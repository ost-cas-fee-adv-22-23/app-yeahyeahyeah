import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

test.use({ storageState: './__e2e__/data/noAuth.json' });

test.describe('@healthcheck', () => {
  test('health check - mumble app', async ({ page }) => {
    const response = await page.request.get('https://app-yeahyeahyeah-cbvb5d3h6a-oa.a.run.app');
    const result = response.status();
    expect(result, 'should be 200').toBe(200);
  });

  test('health check - qwacker API', async ({ page }) => {
    const response = await page.request.get('https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app');
    const result = response.status();
    expect(result, 'should be 404').toBe(404);
  });

  test('health check - zitadel', async ({ page }) => {
    const response = await page.request.get('https://cas-fee-advanced-ocvdad.zitadel.cloud');
    const result = response.status();
    expect(result, 'should be 200').toBe(200);
  });

  test('smoke test - qwacker API post', async ({ page }) => {
    const response: any = await page.request.get(
      'https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/posts?offset=0&limit=1&creator=201161756305785089'
    );

    const apiResponse = await response.json();
    console.log(apiResponse.data);

    expect(response.status()).toBe(200);
    expect(apiResponse.data[0].id).not.toBe('');
    expect(apiResponse.data[0].creator).toBe('201161756305785089');
    expect(apiResponse.data[0].text).not.toBe('');
  });
});
