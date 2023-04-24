![Mumble Theme](https://raw.githubusercontent.com/smartive-education/design-system-component-library-yeahyeahyeah/master/packages/design-system-component-library-yeahyeahyeah/stories/assets/mumble-logo.svg?style=for-the-badge)

# Mumble Chat App

## Introduction

This is the 2nd part of the new **Frontend Engineering Advanced** course of the **University Ost** in Rapperswil.

A **chat app** based on [NextJS](https://nextjs.org) in **Mumble Design** according to the specification of [Mumble-Figma-Design](https://www.figma.com/file/nsXR2h0KwciWpuwKRD58FX/Mumble?node-id=437-1018).

## Table of contents

- [Getting started](#getting-started)
- [Add Credentials](#add-credentials)
- [Add .env vars](#add-env-vars)
- [Install dependencies](#install-dependencies)
- [Resources](#resources)

## Getting started

In the next steps you will setup the mumble chat app.

### Prerequisites

#### NODE

Please use node version **16.17.0**. If you use _nvm_ you can use the following command.

```shell
nvm use 16.17.0
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

## Clone repository and installation

Execute the following commands in sequence:

```bash
git clone https://github.com/smartive-education/app-yeahyeahyeah.git

cd app-yeahyeahyeah

npm install
```

### Add .env vars

Create a new _.env_ file in the root directory. I have sent you an email with the _.env_ vars. Please copy them into the newly created _.env_ file.

Now, you should be able to start the application.

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm run build

npm start
```

## Features

The application is equipped with the following features.

- Real-time display of the latest news.
- Write messages (mumble) with text and an image (optional).
- Write messages with #hashtags.
- Rate messages with a like.
- Comment on existing messages.
- Delete your own messages as needed.

## Live Demo

You can view a live demo at [www.mumble-yeahyeahyeah.ch](www.mumble-yeahyeahyeah.ch). Please note that you must have a valid and active account on [Zitadel](https://zitadel.com/).

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

### Contributors

<a href="https://github.com/smartive-education/design-system-component-library-yeahyeahyeah/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=smartive-education/design-system-component-library-yeahyeahyeah" />
</a>
