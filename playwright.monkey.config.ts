import path from 'path';
import { defineConfig, devices } from '@playwright/test';

export const STORAGE_STATE = path.join(__dirname, './__e2e__/data/playwright/.auth/user.json');

export default defineConfig({
  globalSetup: './__e2e__/globalSetup.ts',
  globalTeardown: './__e2e__/globalTeardown.ts',
  testDir: './__e2e__/monkey',
  fullyParallel: true,
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? './__e2e__/utils/testReporter.ts' : [['list', { printSteps: true }]],
  expect: {
    timeout: 0,
  },
  use: {
    baseURL: 'http://localhost:3000/',
    actionTimeout: 0,
    storageState: STORAGE_STATE,
    trace: 'on-first-retry',
    viewport: null,
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /globalSetup\.ts/,
    },
    {
      name: 'teardown',
      testMatch: /globalTeardown\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Chrome'],
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run build && npm start',
    url: 'http://localhost:3000/',
    timeout: 120000,
    reuseExistingServer: true,
  },
});
