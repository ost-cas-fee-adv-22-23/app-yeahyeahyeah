import { test, expect } from '@playwright/test';
import { sentence } from './randomSentence';
import * as dotenv from 'dotenv';
dotenv.config();

test.use({ storageState: './noAuth.json' });

const url: string = process.env.ZITADEL_ISSUER || '';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('body');
  await expect(page.getByLabel('Login')).toBeInViewport();
  await expect(page.getByLabel('Logout')).not.toBeInViewport();
});

test.describe('02.non-authenticated', () => {
  test('timeline - should have at least one article', async ({ page }) => {
    await page.waitForSelector('body');
    const articles = page.getByRole('article');
    const totalArticles = await articles.count();
    expect(totalArticles).toBeGreaterThanOrEqual(1);
  });

  test('timeline - should redirect to landingpage', async ({ page }) => {
    const article = page.getByRole('article').filter({ hasText: 'username' }).first();
    const articles = page.getByRole('article');
    const totalArticles = await articles.count();
    expect(totalArticles).toBeGreaterThanOrEqual(1);

    await article.locator('a').first().click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/landing/);
    await expect(page.locator('h1')).toContainText('Find out whats new');
    await expect(page).toHaveTitle(`Mumble - Willkommen auf der Mumble App des CAS Frontend Engineer's Advanced`);
  });

  test('timeline - should display an alert after trying to submit message', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('[data-testid="testTextarea"]');
    await page.getByTestId('testTextarea').fill(sentence());
    await page.getByRole('button', { name: 'Absenden' }).click();

    await expect(page.locator('#default-alert')).toHaveText('Du musst angemeldet sein, um Mumbles zu posten!');
  });

  test('timeline - should redirect to login page', async ({ page }) => {
    await page.goto('/landingpage');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: "Let's mumble" }).click();
    await expect(page).toHaveURL(new RegExp(`${url}`));
  });
});
