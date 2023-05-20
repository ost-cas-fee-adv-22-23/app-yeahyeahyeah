import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('handle messages', () => {
  const testMessage = 'Lorem ipsum dolor ...';

  test('01.timeline - post & delete message', async ({ page }) => {
    await Promise.all([
      page.goto('/'),
      page.waitForSelector('[data-testid="testTextarea"]'),
      page.getByTestId('testTextarea').fill(testMessage),
      page.waitForTimeout(3000),
      page.getByRole('button', { name: 'Absenden' }).click(),
      expect(page.getByRole('article').filter({ hasText: `${testMessage}` })).toBeInViewport,
    ]);

    // DELETE POSTED MESSAGE
    const article = page.getByRole('article').filter({ hasText: `${testMessage}` });
    const articleId = await article.getAttribute('id');
    const svgElement = article.locator('svg').last();

    await Promise.all([
      page.waitForTimeout(3000),
      svgElement.click(),
      page.waitForTimeout(3000),
      expect(page.locator(`body:has(#${articleId})`)).not.toContain,
    ]);
  });

  test('02.timeline - textbox without message text', async ({ page }) => {
    await Promise.all([
      page.goto('/'),
      page.waitForTimeout(3000),
      page.getByRole('button', { name: 'Absenden' }).click(),
      expect(page.getByText('Das Textfeld darf nicht leer sein.', { exact: true })).toBeVisible(),
    ]);
  });
});

// test('D - profile find and delete', async ({ page }) => {
//   await page.goto('/profile/201161756305785089');
//   await page.reload();
//   const article = await page.getByRole('article').filter({ hasText: `${testMessage}` });
//   const svgElement = await article.locator('svg').last();
//   await svgElement.click();
// });
