import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe.configure({ mode: 'parallel' });

const testMessage = 'Lorem ipsum dolor ...';
test.describe('handle messages', () => {
  test('01.timeline - post message', async ({ page }) => {
    await Promise.all([
      page.goto('/'),
      page.waitForSelector('[data-testid="testTextarea"]'),
      page.getByTestId('testTextarea').fill(testMessage),
      page.waitForTimeout(3000),
      page.getByRole('button', { name: 'Absenden' }).click(),
      expect(page.getByRole('article').filter({ hasText: `${testMessage}` })).toBeVisible,
    ]);
  });

  test('02.timeline - post without text', async ({ page }) => {
    await Promise.all([
      page.goto('/'),
      page.waitForSelector('body'),
      page.getByRole('button', { name: 'Absenden' }).click(),
      expect(page.getByText('Das Textfeld darf nicht leer sein.', { exact: true })).toBeVisible,
    ]);
  });
});

test.afterAll(async ({ page }) => {
  console.log(`🛠️  delete all test messages (${testMessage}) on page.`);
  await page.goto('/');
  await page.waitForSelector('article');

  await expect(async () => {
    const hasArticleToBeDelete = await page.isVisible(`text=${testMessage}`);
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

      const article_id = await articleToBeDeleted.getAttribute('id');
      await articleToBeDeleted.locator('svg').last().click();

      expect(articleToBeDeleted, '👉 test article found in stream. Try to delete this article.').toBeTruthy;
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
