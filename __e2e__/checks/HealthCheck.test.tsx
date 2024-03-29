import { test, expect } from '@playwright/test';

test.describe('@healthcheck', () => {
  test('health check - endpoint mumble app', async ({ page }) => {
    const response = await page.request.get('https://app-yeahyeahyeah-cbvb5d3h6a-oa.a.run.app');
    const result = response.status();
    expect(result, 'should be 200').toBe(200);
  });

  test('health check - endpoint qwacker API', async ({ page }) => {
    const response = await page.request.get('https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app');
    const result = response.status();
    expect(result, 'should be 404').toBe(404);
  });

  test('health check - endpoint zitadel', async ({ page }) => {
    const response = await page.request.get('https://cas-fee-advanced-ocvdad.zitadel.cloud');
    const result = response.status();
    expect(result, 'should be 200').toBe(200);
  });

  test('smoke test - qwacker API post', async ({ page }) => {
    const response: any = await page.request.get(
      'https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/posts?offset=0&limit=1&creator=201161756305785089'
    );

    const apiResponse = await response.json();
    const headerResponse = response.statusText();

    expect(response.status()).toBe(200);
    expect(headerResponse).toBe('OK');
    expect(apiResponse.data[0].id).not.toBe('');
    expect(apiResponse.data[0].creator).toBe('201161756305785089');
    expect(apiResponse.data[0].text).not.toBe('');
  });
});
