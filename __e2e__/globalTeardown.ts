import { expect, Browser, chromium, Page, FullConfig } from '@playwright/test';
import { LoginForm } from './lib/LoginForm';

const globalTeardown = async (config: FullConfig) => {
  const browser: Browser = await chromium.launch();
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  // LOGIN USER
  LoginForm;

  // DELETING TEST MESSAGE
  await expect(async () => {
    let hasArticleToBeDelete: boolean = false;
    hasArticleToBeDelete = await page.isVisible(`text=#e2e`);

    if (hasArticleToBeDelete === true) {
      const articleToBeDeleted = page.getByRole('article').filter({ hasText: `#e2e` });
      const article_id = await articleToBeDeleted.getAttribute('id');

      expect(article_id, `👉 should have an article id ${article_id}`);
      expect(articleToBeDeleted.locator('svg').last());

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
