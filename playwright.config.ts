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
  expect: {
    timeout: 3000,
  },
  use: {
    baseURL: 'http://localhost:3000/',
    actionTimeout: 0,
    storageState: STORAGE_STATE,
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
    headless: true,
    launchOptions: {
      args: ['--start-maximized'],
    },
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /globalSetup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
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
