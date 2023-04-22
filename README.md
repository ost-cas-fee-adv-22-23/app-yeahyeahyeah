# Mumble Chat App

## Table of contents

- [Getting started](#getting-started)
- [Use credentials](#use-credentials)
- [Add .env vars](#add-env-vars)
- [Install dependencies](#install-dependencies)
- [Resources](#resources)

## Getting started

In the next steps you will setup the mumble chat app.

## Use credentials

We need a github token and a .npmrc to get access to the [mumble npm package](https://github.com/smartive-education/design-system-component-library-yeahyeahyeah/pkgs/npm/design-system-component-library-yeahyeahyeah) at [smartive education](https://github.com/smartive-education) on github.

Create github token and add to .npmrc

[Create a classic github token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-personal-access-token-classic)

To authenticate by adding your personal access token (classic) to your ~/.npmrc file, edit the ~/.npmrc file for your project to include the following line, replacing TOKEN with your personal access token. Create a new ~/.npmrc file if one doesn’t exist.

```bash
//npm.pkg.github.com/:_authToken=TOKEN
```

Create .npmrc and add following line

```bash
@smartive-education:registry=https://npm.pkg.github.com
```

## Add .env vars

I have sent you an email with the .env vars. Please copy them to the .env file in the root folder of the project.

## Install dependencies

Now we can install the dependencies.

From within the new folder, run `npm install`, then `npm run dev` to start the dev server.

## Resources

- [Mumble Component Library Development](https://github.com/smartive-education/design-system-component-library-yeahyeahyeah)
- [Typescript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [styled-components](https://styled-components.com/)
- [Twin](https://github.com/ben-rogerson/twin.macro)
- [Github](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-packages-from-other-organizations)
