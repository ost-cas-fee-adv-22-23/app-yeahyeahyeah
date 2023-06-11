import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.use({ storageState: './noAuth.json' });

test.beforeEach(async ({ page }) => {
  test.slow();
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('body');
  await expect(page.getByLabel('Login')).toBeInViewport();
  await expect(page.getByLabel('Logout')).not.toBeInViewport();
});

test.describe('01.non-authenticated', () => {
  test('01.timeline - should have at least one article', async ({ page }) => {
    await page.waitForSelector('body');
    const articles = page.getByRole('article');
    const totalArticles = await articles.count();
    expect(totalArticles).toBeGreaterThanOrEqual(1);
  });

  test('02.timeline - should redirect to landingpage', async ({ page }) => {
    await page.waitForSelector('body');
    const article = page.getByRole('article').filter({ hasText: 'username' }).first();
    const articles = page.getByRole('article');
    const totalArticles = await articles.count();
    expect(totalArticles).toBeGreaterThanOrEqual(1);

    await article.locator('a').first().click();
    await page.waitForSelector('body');
    await expect(page).toHaveURL(/landing/);
    await expect(page.locator('h1')).toContainText('Find out whats new');
    await expect(page).toHaveTitle(`Mumble - Willkommen auf der Mumble App des CAS Frontend Engineer's Advanced`);
  });
});
