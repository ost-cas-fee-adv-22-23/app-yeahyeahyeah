import { expect, Browser, chromium, Page, FullConfig } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';
import { generateHashtag } from './utils/hastagGenerator';
import * as dotenv from 'dotenv';
dotenv.config();

const user = process.env.ZITADEL_USER || '';
const pw = process.env.ZITADEL_PW || '';
const url = process.env.ZITADEL_ISSUER || '';

const globalTeardown = async (config: FullConfig): Promise<void> => {
  const { baseURL } = config.projects[0].use;
  const browser: Browser = await chromium.launch();
  const context = await browser.newContext();
  const page: Page = await context.newPage();
  const hashTag: string = generateHashtag();

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

  // SAVE STORAGE STATE
  await page.context().storageState({ path: STORAGE_STATE });
  console.log('💾 Saved authentication state to ', STORAGE_STATE);
  await page.waitForSelector('body');
  await expect(page.getByLabel('Logout')).not.toBeInViewport();

  // DELETING TEST MESSAGE
  await expect(async () => {
    const hasArticleToBeDelete: boolean = await page.isVisible(`text=${hashTag}`);

    if (hasArticleToBeDelete === true) {
      const articleToBeDeleted = page.getByRole('article').filter({ hasText: `${hashTag}` });
      const article_id = await articleToBeDeleted.getAttribute('id');

      expect(article_id).toBeTruthy();
      expect(typeof article_id).toBe('string');
      expect(article_id, `👉 article_id should be a string of 26 alphanumeric and/or - characters: ${article_id}`).toMatch(
        /^[\w-]{26}$/i
      );

      await articleToBeDeleted.locator('svg').last().click();
      console.log(`🧹 deleting test message ${article_id}`);

      expect(page.locator(`body:has(#${article_id})`)).toBe(false);
    } else {
      console.log(`✅ stage cleared and closing tests.`);
    }
    expect(hasArticleToBeDelete, '👍 should have no test message').toBe(false);
  }).toPass();

  // LOGOUT AND CLOSE SESSION
  page.getByRole('button', { name: 'Logout' });
  console.log(`🏁 e2e testing successfully completed.`);

  await browser.close();
};

export default globalTeardown;
