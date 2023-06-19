import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__e2e__/checks',
  fullyParallel: false,
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? './__e2e__/utils/testReporter.ts' : [['list', { printSteps: true }]],
  expect: {
    timeout: 0,
  },
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    viewport: null,
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Chrome'],
      },
    },
  ],
  webServer: {
    command: 'npm run build && npm start',
    url: 'http://localhost:3000/',
    timeout: 120000,
    reuseExistingServer: true,
  },
});
