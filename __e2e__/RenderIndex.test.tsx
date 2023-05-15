import { test, expect } from '@playwright/test';

test('E2E - testing index page', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const title = await page.title();
  expect(title).toEqual('Mumble - Willkommen auf Mumble');

  const stream = await page.waitForSelector('.DefaultLayout__NavigationWrapper-sc-5gfcqa-1');
  expect(stream).not.toBeNull();
});
