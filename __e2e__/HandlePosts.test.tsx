import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe.configure({ mode: 'serial' });
const testMessage = 'Lorem ipsum dolor ...';
test.describe('handle messages', () => {
  test('01.timeline - post message and set article', async ({ page }) => {
    await Promise.all([
      page.goto('/'),
      page.waitForSelector('[data-testid="testTextarea"]'),
      page.getByTestId('testTextarea').fill(testMessage),
      page.waitForTimeout(3000),
      page.getByRole('button', { name: 'Absenden' }).click(),
      expect(page.getByRole('article').filter({ hasText: `${testMessage}` })).toBeVisible,
    ]);
  });

  test('02.timeline - delete message', async ({ page }) => {
    await page.goto('/');

    const hasArticleToBeDelete = await page.isVisible(`text=${testMessage}`);
    let ARTICLE_ID;

    if (hasArticleToBeDelete) {
      const articleToBeDeleted = await page.getByRole('article').filter({ hasText: `${testMessage}` });
      const article_id = await articleToBeDeleted.getAttribute('id');
      expect(page.isVisible(`body:has(#${ARTICLE_ID})`)).not;
      ARTICLE_ID = article_id;
      console.log(article_id);
      await articleToBeDeleted.locator('svg').last().click();
    }
    expect(await page.getByRole('article').filter({ hasText: `${testMessage}` })).not.toBeVisible;
  });

  test('03.timeline - post without text', async ({ page }) => {
    await Promise.all([
      page.goto('/'),
      page.waitForTimeout(3000),
      page.getByRole('button', { name: 'Absenden' }).click(),
      expect(page.getByText('Das Textfeld darf nicht leer sein.', { exact: true })).toBeVisible(),
    ]);
  });
});
