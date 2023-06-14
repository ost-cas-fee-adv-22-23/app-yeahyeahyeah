import { expect, Browser, chromium, Page, FullConfig } from '@playwright/test';
import { LoginForm } from './lib/LoginForm';
import { sentence } from '../src/utils/randomSentence';
import path from 'path';

const globalSetup = async (config: FullConfig) => {
  const browser: Browser = await chromium.launch();
  const context = await browser.newContext();
  const page: Page = await context.newPage();
  const hashTag = 'e2e';
  const imageUploadEndPoint = /storage.googleapis.com\/qwacker-api-prod-data/;
  const hasTestMessage = await page.isVisible(`text=#${hashTag}`);

  // GENERATE RANDOM SENTENCE
  let testMessage: string;
  testMessage = sentence();

  // LOGIN USER
  LoginForm;

  // CHECK FOR TEST MESSAGE
  if (hasTestMessage === false) {
    await expect(async () => {
      await page.waitForSelector('[data-testid="testTextarea"]');
      await page.getByTestId('testTextarea').fill(`${testMessage} #${hashTag}`);
      await page.locator('input[type=file]').setInputFiles(path.join(__dirname, '../public', 'avatar_default.png'));
      await page.getByRole('button', { name: 'Absenden' }).click();

      expect(page.getByRole('article').filter({ hasText: `${testMessage}` }));
      await expect(page.getByRole('img', { name: `${testMessage} #${hashTag}` })).toHaveAttribute(
        'src',
        imageUploadEndPoint
      );
    }).toPass();
  }

  await browser.close();
};

export default globalSetup;
