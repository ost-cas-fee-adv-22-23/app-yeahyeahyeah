resource "random_password" "nextauth_secret" {
  length           = 16
  special          = false
}

resource "google_secret_manager_secret" "nextauth_secret" {
  secret_id = "${local.name}-${local.env}-nextauth_secret"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "nextauth_secret" {
  secret      = google_secret_manager_secret.nextauth_secret.name
  secret_data = random_password.nextauth_secret.result
}

resource "google_secret_manager_secret_iam_member" "nextauth_secret" {
  secret_id = google_secret_manager_secret_version.nextauth_secret.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud-runner.email}"
  depends_on = [
    google_secret_manager_secret.nextauth_secret,
  ]
}

resource "google_secret_manager_secret" "zitadel_issuer" {
  secret_id = "${local.name}-${local.env}-zitadel_issuer"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "zitadel_issuer" {
  secret      = google_secret_manager_secret.zitadel_issuer.name
  secret_data = var.zitadel_issuer
}

resource "google_secret_manager_secret_iam_member" "zitadel_issuer" {
  secret_id = google_secret_manager_secret_version.zitadel_issuer.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud-runner.email}"
  depends_on = [
    google_secret_manager_secret.nextauth_secret,
  ]
}

resource "google_secret_manager_secret" "zitadel_client_id" {
  secret_id = "${local.name}-${local.env}-zitadel_client_id"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "zitadel_client_id" {
  secret      = google_secret_manager_secret.zitadel_client_id.name
  secret_data = var.zitadel_client_id
}

resource "google_secret_manager_secret_iam_member" "zitadel_client_id" {
  secret_id = google_secret_manager_secret_version.zitadel_client_id.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud-runner.email}"
  depends_on = [
    google_secret_manager_secret.nextauth_secret,
  ]
}
