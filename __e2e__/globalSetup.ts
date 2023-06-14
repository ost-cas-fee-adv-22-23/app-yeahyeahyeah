import { expect, Browser, chromium, Page, FullConfig } from '@playwright/test';
import { sentence } from '../src/utils/randomSentence';
import { STORAGE_STATE } from '../playwright.config';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const user: string = process.env.ZITADEL_USER || '';
const pw: string = process.env.ZITADEL_PW || '';
const url: string = process.env.ZITADEL_ISSUER || '';

const globalSetup = async (config: FullConfig) => {
  const { baseURL } = config.projects[0].use;
  const browser: Browser = await chromium.launch();
  const context = await browser.newContext();
  const page: Page = await context.newPage();
  const hashTag = 'e2e';
  const imageUploadEndPoint = /storage.googleapis.com\/qwacker-api-prod-data/;
  let testMessage: string;

  // LOGIN
  await page.goto(baseURL!);
  await page.waitForLoadState('domcontentloaded');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(new RegExp(`${url}`));
  await page.waitForSelector('body');
  await page.getByPlaceholder('username@domain').fill(user);
  await page.locator('#submit-button').click();
  await page.getByLabel('Password').fill(pw);
  await page.getByRole('button', { name: 'next' }).click();

  // Save the state
  await page.context().storageState({ path: STORAGE_STATE });
  console.log('💾 Saved authentication state to ', STORAGE_STATE);
  await page.waitForSelector('body');
  await expect(page.getByLabel('Logout')).not.toBeInViewport();

  // ADD TEST MESSAGE IF NOT PRESENT
  const hasTestMessage = await page.isVisible(`text=#${hashTag}`);

  if (hasTestMessage === false) {
    await expect(async () => {
      testMessage = sentence();
      await page.waitForSelector('[data-testid="testTextarea"]');
      await page.getByTestId('testTextarea').fill(`${testMessage} #${hashTag}`);
      await page.locator('input[type=file]').setInputFiles(path.join(__dirname, '../public', 'avatar_default.png'));
      await page.getByRole('button', { name: 'Absenden' }).click();

      await expect(page.getByRole('article').filter({ hasText: `${testMessage}` })).toBeVisible();
      await expect(page.getByRole('img', { name: `${testMessage} #${hashTag}` })).toHaveAttribute(
        'src',
        imageUploadEndPoint
      );
    }).toPass();
  }

  await browser.close();
};

export default globalSetup;
