import { test, expect } from '@playwright/test';

test('E2E - testing index page', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:3000/');

  // Check if the page title is correct
  const title = await page.title();
  expect(title).toEqual('Mumble - Willkommen auf Mumble');

  // Check if the component is rendered
  const stream = await page.waitForSelector('.DefaultLayout__NavigationWrapper-sc-5gfcqa-1');
  expect(stream).not.toBeNull();
});
