import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('body');
  await expect(page.getByLabel('Login')).toBeInViewport();
  await expect(page.getByLabel('Logout')).not.toBeInViewport();
  // console.log(await context.storageState());
});

test.describe('01.non-authenticated', () => {
  test('01.timeline - should have at least one article', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('body');

    const articles = page.getByRole('article');
    const totalArticles = await articles.count();
    console.log('totalArticles', totalArticles);
    expect(totalArticles).toBeGreaterThanOrEqual(1);
  });

  test('01.timeline - should redirect to landingpage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('body');
    const article = page.getByRole('article').filter({ hasText: 'username' }).first();
    const articles = page.getByRole('article');
    const totalArticles = await articles.count();
    console.log('totalArticles', totalArticles);

    await article.locator('a').first().click();
    await page.waitForSelector('body');
    await expect(page).toHaveURL(/landing/);
    await expect(page.locator('h1')).toContainText('Find out whats new');
    await expect(page).toHaveTitle(`Mumble - Willkommen auf der Mumble App des CAS Frontend Engineer's Advanced`);
  });
});
