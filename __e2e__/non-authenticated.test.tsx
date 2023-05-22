import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('/');
  await page.waitForSelector('body');
  await expect(page.getByLabel('Login')).toBeInViewport();
  await expect(page.getByLabel('Logout')).not.toBeInViewport();
});

test.describe('02.non authenticated', () => {
  test('02.timeline - post without text', async ({ page }) => {
    await Promise.all([
      page.goto('/'),
      page.waitForSelector('body'),
      page.getByRole('button', { name: 'Absenden' }).click(),
      expect(page.getByText('Das Textfeld darf nicht leer sein.', { exact: true })).toBeVisible,
    ]);
  });
});
