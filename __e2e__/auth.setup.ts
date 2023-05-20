import { STORAGE_STATE } from './../playwright.config';
import { expect, Browser, FullConfig, Page } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const user = process.env.ZITADEL_USER || '';
const pw = process.env.ZITADEL_PW || '';
const url = process.env.ZITADEL_ISSUER || '';

async function globalSetup(page: Page, config: FullConfig, browser: Browser) {
  const { baseURL } = config.projects[0].use;

  await Promise.all([
    page.goto(baseURL!),
    page.getByRole('button', { name: 'Login' }).click(),
    expect(page).toHaveURL(url),
    page.getByPlaceholder('username@domain').click(),
    page.getByPlaceholder('username@domain').fill(user),
    page.locator('#submit-button').click(),
    page.getByLabel('Password').fill(pw),
    page.locator('#submit-button').click(),
    page.context().storageState({ path: STORAGE_STATE }),
    console.log(await page.context().storageState()),
  ]);
}

export default globalSetup;
