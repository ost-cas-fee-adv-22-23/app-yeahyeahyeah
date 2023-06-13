import path from 'path';
import { defineConfig, devices } from '@playwright/test';

export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
  globalSetup: './__e2e__/globalSetup.ts',
  globalTeardown: './__e2e__/globalTeardown.ts',
  testDir: './__e2e__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 3,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list', { printSteps: true }]],
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
      name: 'cleanup test message',
      testMatch: /globalTeardown\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Chrome'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Safari'] },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup'],
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
  webServer: {
    command: 'npm run build && npm start',
    url: 'http://localhost:3000/',
    timeout: 120000,
    reuseExistingServer: true,
  },
});
