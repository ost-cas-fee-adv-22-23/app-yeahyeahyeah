import { expect, Browser, chromium, Page, FullConfig } from '@playwright/test';
import { STORAGE_STATE } from './../playwright.config';
import * as dotenv from 'dotenv';
dotenv.config();

const user = process.env.ZITADEL_USER || '';
const pw = process.env.ZITADEL_PW || '';
const url = process.env.ZITADEL_ISSUER || '';

const globalSetup = async (config: FullConfig) => {
  const { baseURL } = config.projects[0].use;
  const browser: Browser = await chromium.launch();
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  await page.goto(baseURL!);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(new RegExp(`${url}`));
  await page.waitForSelector('body');
  await page.getByPlaceholder('username@domain').click();
  await page.getByPlaceholder('username@domain').fill(user);
  await page.locator('#submit-button').click();
  await page.getByLabel('Password').fill(pw);
  await page.getByRole('button', { name: 'next' }).click();

  // Save the state
  await page.context().storageState({ path: STORAGE_STATE });
  console.log('💾 Saved authentication state to ', STORAGE_STATE);
  await page.waitForSelector('body');
  await expect(page.getByLabel('Logout')).not.toBeInViewport();
  await browser.close();
};

export default globalSetup;
