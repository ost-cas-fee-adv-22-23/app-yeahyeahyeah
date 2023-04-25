![Mumble Theme](https://raw.githubusercontent.com/smartive-education/design-system-component-library-yeahyeahyeah/master/packages/design-system-component-library-yeahyeahyeah/stories/assets/mumble-logo.svg?style=for-the-badge)

# Mumble Chat App

## Introduction

This is the final project for the 2nd part of the **Frontend Engineering Advanced** course, offered by the **University Ost** in Rapperswil.

We had to develop a **Chat App** based on [NextJS](https://nextjs.org) in a given **Mumble Design** according to the specification of [Mumble-Figma-Design](https://www.figma.com/file/nsXR2h0KwciWpuwKRD58FX/Mumble?node-id=437-1018). We had the requirement to use our previously developed [Component Library](https://github.com/smartive-education/design-system-component-library-yeahyeahyeah) for our **Chat App**.

## Table of contents

- [Getting started](#getting-started)
- [Add Credentials](#add-credentials)
- [Add .env vars](#add-env-vars)
- [Install dependencies](#install-dependencies)
- [Resources](#resources)

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

## Features

The application is equipped with the following features.

- Almost real-time feeling, thanks to SWR. :)
- Write messages (mumble) with text and an image (optional).
- Search detail page, where you can navigate through #hashtags.
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
