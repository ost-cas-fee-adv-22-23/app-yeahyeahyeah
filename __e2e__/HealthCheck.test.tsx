import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

test.use({ storageState: './__e2e__/data/noAuth.json' });

test.describe('@healthcheck', () => {
  test('healthcheck - testing mumble app', async ({ page }) => {
    const response = await page.request.get('https://app-yeahyeahyeah-cbvb5d3h6a-oa.a.run.app');
    await expect(response).toBeOK();
  });

  test('healthcheck - testing qwacker', async ({ page }) => {
    const response = await page.request.get(
      'https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/posts?offset=0&limit=100&creator=201444056083988737'
    );
    await expect(response).toBeOK();
  });
});
