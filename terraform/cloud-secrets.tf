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
  role      = "roles/secretmanager.admin",
  member    = "serviceAccount:${google_service_account.cloud-runner.email}"
  depends_on = [
    google_secret_manager_secret.nextauth_secret,
  ]
}
