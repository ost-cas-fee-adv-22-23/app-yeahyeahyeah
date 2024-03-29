resource "google_service_account" "cloud-runner" {
  account_id   = "cloud-runner"
  display_name = "Google Cloud Run"
  description  = "Account to deploy applications to google cloud run."
}

resource "google_project_iam_member" "cloud-runner" {
  for_each = toset([
    "roles/run.serviceAgent",
    "roles/viewer",
    "roles/storage.objectViewer",
    "roles/run.admin",
  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.cloud-runner.email}"
  project = data.google_project.project.id
}

resource "google_project_iam_member" "cloud-runner-svc" {
  role    = "roles/run.serviceAgent"
  member  = "serviceAccount:service-${data.google_project.project.number}@serverless-robot-prod.iam.gserviceaccount.com"
  project = data.google_project.project.id
}

output "cloud-runner-email" {
  value = google_service_account.cloud-runner.email
}

resource "google_cloud_run_service" "app-yeahyeahyeah" {
  name                       = local.name
  location                   = local.gcp_region
  autogenerate_revision_name = true

  template {
    spec {
      containers {
        image = "europe-west6-docker.pkg.dev/casfea22/app-yeahyeahyeah-docker/app-yeahyeahyeah:${var.release_version}"

        resources {
          limits = {
            "memory" = "256Mi"
            "cpu"    = "1"
          }
        }

        env {
          name = "NEXTAUTH_URL"
          value = "https://app-yeahyeahyeah-cbvb5d3h6a-oa.a.run.app"
        }

        env {
          name = "NEXTAUTH_SECRET"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = google_secret_manager_secret.nextauth_secret.secret_id
            }
          }
        }

        env {
          name = "ZITADEL_ISSUER"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = google_secret_manager_secret.zitadel_issuer.secret_id
            }
          }
        }

        env {
          name = "ZITADEL_CLIENT_ID"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = google_secret_manager_secret.zitadel_client_id.secret_id
            }
          }
        }

        ports {
          name           = "http1"
          container_port = 3000
        }
      }

      service_account_name = google_service_account.cloud-runner.email
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [
    google_secret_manager_secret_version.nextauth_secret,
    google_secret_manager_secret_iam_member.nextauth_secret,
    google_secret_manager_secret_version.zitadel_issuer,
    google_secret_manager_secret_iam_member.zitadel_issuer,
    google_secret_manager_secret_version.zitadel_client_id,
    google_secret_manager_secret_iam_member.zitadel_client_id,
  ]
}

output "cloud-run-url" {
  value = google_cloud_run_service.app-yeahyeahyeah.status[0].url
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.app-yeahyeahyeah.location
  project  = google_cloud_run_service.app-yeahyeahyeah.project
  service  = google_cloud_run_service.app-yeahyeahyeah.name

  policy_data = data.google_iam_policy.noauth.policy_data
}