import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('/');
  await page.waitForSelector('body');
  await expect(page.getByLabel('Login')).toBeInViewport();
  await expect(page.getByLabel('Logout')).not.toBeInViewport();
  // console.log(await context.storageState());
});

test.describe('01.non-authenticated', () => {
  test('01.timeline - should redirect ', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('body');
    const article = await page.getByRole('article').filter({ hasText: 'username' }).first();
    await article.locator('a').first().click();
    await page.waitForSelector('body');
    await expect(page).toHaveURL(/landing/);
    await expect(page.locator('h1')).toContainText('Find out whats new');
    await expect(page).toHaveTitle(`Mumble - Willkommen auf der Mumble App des CAS Frontend Engineer's Advanced`);
  });
});
