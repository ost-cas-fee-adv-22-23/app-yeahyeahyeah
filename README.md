![Mumble Theme](https://raw.githubusercontent.com/smartive-education/design-system-component-library-yeahyeahyeah/master/packages/design-system-component-library-yeahyeahyeah/stories/assets/mumble-logo.svg?style=for-the-badge)

# Mumble Chat App

## Introduction

This is the final project for the 2nd part of the **Frontend Engineering Advanced** course, offered by the **University Ost** in Rapperswil.

We had to develop a **Chat App** based on [NextJS](https://nextjs.org) in a given **Mumble Design** according to the specification of [Mumble-Figma-Design](https://www.figma.com/file/nsXR2h0KwciWpuwKRD58FX/Mumble?node-id=437-1018). We had the requirement to use our previously developed [Component Library](https://github.com/smartive-education/design-system-component-library-yeahyeahyeah) for our **Chat App**.

## Table of contents

- [Introduction](#introduction)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
    - [NODE](#node)
- [Add Credentials](#add-credentials)
- [Add .env vars](#add-env-vars)
- [Installation](#installation)
- [Start the App](#start-the-app)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [Testing](#testing)
  - [Unit testing with jest and react-testing-library](#unit-testing-with-jest-and-react-testing-library)
  - [E2E testing with playwright](#e2e-testing-with-playwright)
- [Features](#features)
- [Live Demo](#live-demo)
- [Resources](#resources)
- [Project Status](#project-status)
- [Design System Component Library Version](#design-system-component-library-version)
- [Contributors](#contributors)

## Getting started

In the next steps you will setup the chat app.

### Prerequisites

#### NODE

Please use node version **16.19.1**. If you use _nvm_ you can use the following command.

```shell
nvm use 16.19.1
```

## Add credentials

We need a github token and a .npmrc to get access to the [mumble npm package](https://github.com/smartive-education/design-system-component-library-yeahyeahyeah/pkgs/npm/design-system-component-library-yeahyeahyeah) at [smartive education](https://github.com/smartive-education) on github.

Create github token and add to .npmrc

[Create a classic github token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-personal-access-token-classic)

To authenticate by adding your personal access token (classic) to your ~/.npmrc file, edit the ~/.npmrc file for your project to include the following line, replacing TOKEN with your personal access token. Create a new ~/.npmrc file if one doesn’t exist.

```bash
//npm.pkg.github.com/:_authToken=TOKEN
```

Create .npmrc in the project folder, where you wanna add your npm package and add following line

```bash
@smartive-education:registry=https://npm.pkg.github.com
```

## Add .env vars

Create a new _.env_ file in the root directory. I have sent you an email with the _.env_ vars. Please copy them into the newly created _.env_ file.

Now, you should be able to start the application.

## Installation

```bash
git clone https://github.com/smartive-education/app-yeahyeahyeah.git

cd app-yeahyeahyeah

npm install
```

## Start the app

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm run build

npm start
```

## Testing

### Unit testing with jest and react-testing-library

Run tests in watch mode

```bash
npm run test
```

Run tests once

```bash
npm run test:ci
```

Run tests in silent mode (without warnings)

```bash
npm run test:ci-silent
```

Run tests once with coverage report

```bash
npm run test:ci-coverage
```

Run tests in debug mode

```bash
npm run test:debug
```

### E2E testing with playwright

Before the first run, you have to install the default browsers for playwright.

```bash
npx playwright install
```

Now you can run the tests.

Run tests in headless mode

```bash
npm run test:e2e
```

Run tests in headful mode

```bash
npm run test:e2e:headful
```

## Docker

Test the docker image locally.

### Local

#### Build

```bash
docker build -t app-yeahyeahyeah . --build-arg NPM_TOKEN=$NPM_TOKEN
```

#### Run

```bash
docker run -p 3000:3000 --env-file .env --rm --name app-yeahyeahyeah app-yeahyeahyeah
```

#### Google Cloud

#### Build

```bash
docker build -t europe-west6-docker.pkg.dev/casfea22/app-yeahyeahyeah-docker/app-yeahyeahyeah . --build-arg NPM_TOKEN=$NPM_TOKEN
```

### Run

```bash
docker run -p 3000:3000 --env-file .env --rm --name app-yeahyeahyeah europe-west6-docker.pkg.dev/casfea22/app-yeahyeahyeah-docker/app-yeahyeahyeah:latest
```

### Push

```bash
docker push europe-west6-docker.pkg.dev/casfea22/app-yeahyeahyeah-docker/app-yeahyeahyeah
```

## Features

The application is equipped with the following features.

- Almost real-time feeling, thanks to SWR. :)
- Write messages (mumble) with text and an image (optional).
- Search detail page, where you can navigate through #hashtags.
- Rate messages with a like.
- Comment on existing messages.
- Delete your own messages as needed.

## Live Demo

You can view a live demo at [www.mumble-yeahyeahyeah.ch](https://www.mumble-yeahyeahyeah.ch). Please note that you must have a valid and active account on [Zitadel](https://zitadel.com/).

## Resources

- [Mumble Component Library Development](https://github.com/smartive-education/design-system-component-library-yeahyeahyeah)
- [Typescript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [styled-components](https://styled-components.com/)
- [Twin](https://github.com/ben-rogerson/twin.macro)
- [Github](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-packages-from-other-organizations)

## Project status

![GitHub pull requests](https://img.shields.io/github/issues-pr/smartive-education/app-yeahyeahyeah?style=for-the-badge)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/smartive-education/app-yeahyeahyeah?style=for-the-badge)

![GitHub closed issues](https://img.shields.io/github/issues-closed/smartive-education/app-yeahyeahyeah?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues-raw/smartive-education/app-yeahyeahyeah?style=for-the-badge)

## Design System Component Library Version

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/smartive-education/design-system-component-library-yeahyeahyeah?style=for-the-badge)

## Contributors

<a href="https://github.com/smartive-education/design-system-component-library-yeahyeahyeah/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=smartive-education/design-system-component-library-yeahyeahyeah" />
</a>

## Google Cloud

### Create a new project

```bash
gcloud projects create PROJECT_ID --name=PROJECT_NAME --set-as-default
```

### Enable billing

```bash
gcloud beta billing projects link PROJECT_ID --billing-account=BILLING_ACCOUNT_ID
```

### Enable APIs

```bash
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### Create cloud storage bucket

```bash
gsutil mb -p PROJECT_ID -c STANDARD -l europe-west6 -b on gs://BUCKET_NAME
```

### Secret Manager

#### Create secret

```bash
echo -n "SUPERSECRET" | gcloud secrets create "nextauth_secret" \
    --data-file - \
    --replication-policy "automatic"
```

## Terraform

With our terraform configuration, we can create a new project on Google Cloud and deploy our application. First you have to install terraform on your machine.

### Init

```bash
terraform init
```

### Plan

You can use this command to check whether the proposed changes match what you expected before you apply the changes or share your changes with your team for broader review.

```bash
terraform plan
```

`-out=FILENAME` - Writes the generated plan to the given filename in an opaque file format that you can later pass to terraform apply to execute the planned changes, and to some other Terraform commands that can work with saved plan files.

```bash
terraform plan -out=FILENAME
```

### Apply

When you run terraform apply without passing a saved plan file, Terraform automatically creates a new execution plan as if you had run terraform plan, prompts you to approve that plan, and takes the indicated actions.

You can pass the -auto-approve option to instruct Terraform to apply the plan without asking for confirmation.

```bash
terraform apply -auto-approve
```

### Secret Manager

#### Create secret

```bash
echo -n "SUPERSECRET" | gcloud secrets create "nextauth_secret" \
    --data-file - \
    --replication-policy "automatic"
```

#### Add needed permissions

Permission "roles/secretmanager.secretAccessor" is needed to access the secret manager. Add this role to "google_project_iam_member" "cloud-runner". Following code snippet shows how to add the role.

```terraform
resource "google_project_iam_member" "cloud-runner" {
  for_each = toset([
    "roles/run.serviceAgent",
    "roles/viewer",
    "roles/storage.objectViewer",
    "roles/run.admin",
    "roles/cloudsql.client",
    "roles/secretmanager.secretAccessor",
  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.cloud-runner.email}"
  project = data.google_project.project.id
}
```

#### Access the secret

To access a secret from Google Secret Manager, use `the google_secret_manager_secret_version data` source:

```terraform
data "google_secret_manager_secret_version" "nextauth_secret" {
  provider = google

  secret  = "nextauth_secret"
  version = "1"
}
```

#### Print value of the secret

```terraform
output "secret" {
  value = data.google_secret_manager_secret_version.my-secret.secret_data
}
```

### Hints

##### Rename service or delete service

If you rename the name of the service or delete the service and create a new one, you will have to delete the actual state value ("casfea22-tf-state") in the bucket. Following code snippet shows the name of the service, that has to be changed.

```terraform
locals {
  name       = "app-yeahyeahyeah"
  gcp_region = "europe-west6"
}
```

You will also have to delete the service account, because the service account will be created during the first terraform run and will not be deleted if you rename the service.

##### Service account for terraform deployment

If you deleted the service account, or you want to create a new one with terraform, you will have to add the following roles to the service account.

Necessary permissions for the service account that is used for terraform deployment.

```bash
gcloud projects add-iam-policy-binding casfea22 \
--member='serviceAccount:casfea22-service-account@casfea22.iam.gserviceaccount.com' \
--role='roles/resourcemanager.projectIamAdmin'
```

```bash
gcloud projects add-iam-policy-binding casfea22 \
--member='serviceAccount:casfea22-service-account@casfea22.iam.gserviceaccount.com' \
--role='roles/iam.serviceAccountAdmin'
```
