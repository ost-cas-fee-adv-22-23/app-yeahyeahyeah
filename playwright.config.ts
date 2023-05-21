import path from 'path';
import { defineConfig, devices } from '@playwright/test';

export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
  globalSetup: './__e2e__/globalSetup.ts',
  testDir: './__e2e__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list', { printSteps: true }]],
  use: {
    baseURL: 'http://localhost:3000/',
    actionTimeout: 0,
    storageState: STORAGE_STATE,
    trace: 'on-first-retry',
    viewport: null,
    headless: true,
    launchOptions: {
      args: ['--start-maximized'],
    },
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  /* Run your local dev server before starting the tests */

  webServer: {
    command: 'npm run build && npm start',
    url: 'http://localhost:3000/',
    timeout: 120000,
    reuseExistingServer: true,
  },
});
