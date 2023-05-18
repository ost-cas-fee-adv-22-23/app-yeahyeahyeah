import { test, expect } from '@playwright/test';

const testMessage = 'Lorem ipsum dolor ...';

test('A - timeline post - should post a mumble message', async ({ page }) => {
  await Promise.all([
    page.goto('/'),
    page.waitForSelector('[data-testid="testTextarea"]'),
    page.getByTestId('testTextarea').fill(testMessage),
    page.waitForTimeout(3000),
    page.getByRole('button', { name: 'Absenden' }).click(),
  ]);
});

test('B - timeline post error - should render an error', async ({ page }) => {
  await Promise.all([
    page.goto('/'),
    page.waitForTimeout(3000),
    page.getByRole('button', { name: 'Absenden' }).click(),
    expect(page.getByText('Das Textfeld darf nicht leer sein.', { exact: true })).toBeVisible(),
  ]);
});

test('C - timeline find post - mumble exists on timeline', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);
  await page.getByRole('article').filter({ hasText: `${testMessage}` });
});

test('D - profile find and delete', async ({ page }) => {
  await page.goto('/profile/201161756305785089');
  await page.reload();
  const article = await page.getByRole('article').filter({ hasText: `${testMessage}` });
  const svgElement = await article.locator('svg').last();
  await svgElement.click();
});
