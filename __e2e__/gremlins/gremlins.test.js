const { test } = require('@playwright/test');
// Test 2: Test Katalon Demo CURA with the allTogether strategy and a 30-second timeout
test('test2', async ({ page }) => {
  // Load gremlins.js library
  await page.addInitScript({
    path: './node_modules/gremlins.js/dist/gremlins.min.js',
  });
  // Navigate to the test page
  await page.goto('https://app-yeahyeahyeah-cbvb5d3h6a-oa.a.run.app/');

  // Execute chaos testing with the allTogether strategy and a 30-second timeout
  await page.evaluate(() =>
    Promise.race([
      new Promise((resolve) => {
        gremlins
          .createHorde({
            strategies: [gremlins.strategies.allTogether({ nb: 10000 })],
          })
          .unleash();
      }),
      new Promise((resolve) => setTimeout(resolve, 30000)), // 30 seconds timeout
    ])
  );
});
