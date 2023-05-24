import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe.configure({ mode: 'serial' });

const testMessage = 'Lorem ipsum dolor ...';

test.describe('01.authenticated tests', () => {
  test('01.timeline - post message', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="testTextarea"]');
    await page.getByTestId('testTextarea').fill(testMessage);
    await page.waitForSelector('body');
    await page.getByRole('button', { name: 'Absenden' }).click();
    expect(page.getByRole('article').filter({ hasText: `${testMessage}` }));
  });

  test('02.timeline - delete message', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('body');
    console.log(`🛠️  delete all test messages (${testMessage}) on page.`);

    await expect(async () => {
      let hasArticleToBeDelete: boolean = false;

      hasArticleToBeDelete = await page.isVisible(`text=${testMessage}`);
      console.log('found by locator', hasArticleToBeDelete);

      console.log(
        hasArticleToBeDelete === true
          ? `👉 test message (${testMessage}) is present`
          : `❗ no test message (${testMessage}) found`
      );

      if (hasArticleToBeDelete === true) {
        const articleToBeDeleted = page
          .getByRole('article')
          .filter({ hasText: `${testMessage}` })
          .first();

        expect(articleToBeDeleted, '👉 test article found in stream. Try to delete this article.').toBeTruthy;

        const article_id = await articleToBeDeleted.getAttribute('id');
        await articleToBeDeleted.locator('svg').last().click();

        expect(page.locator(`body:has(#${article_id})`)).toBe(false);
      }
      expect(hasArticleToBeDelete, '👍 should have no test message').toBe(false);
    }).toPass();

    expect(
      page.getByRole('article').filter({ hasText: `${testMessage}` }),
      '👎 something went wrong. there are still test messages present'
    ).toBeVisible;
    console.log(`👍 should have no test message (${testMessage}) on page.`);
  });

  test('03.timeline - post without text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="testTextarea"]');
    await page.getByRole('button', { name: 'Absenden' }).click();
    // expect(page.getByText('Das Textfeld darf nicht leer sein.', { exact: true }));
    await expect(page.locator('p').filter({ hasText: 'Das Textfeld darf nicht leer sein.' })).toBeInViewport();
  });
});
