locals {
  name       = "app-yeahyeahyeah"
  gcp_region = "europe-west6"
  env        = "prod"
}

provider "google" {
  project = "casfea22"
  region  = local.gcp_region
}

data "google_project" "project" {
}

terraform {
  backend "gcs" {
    bucket = "casfea22-tf-state"
  }
}