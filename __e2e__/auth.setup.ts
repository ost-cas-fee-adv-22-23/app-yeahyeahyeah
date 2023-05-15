import { test as setup } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const user = process.env.ZITADEL_USER || '';
const pw = process.env.ZITADEL_PW || '';

setup('authenticate', async ({ page }) => {
  const authFile = './playwright/.auth/user.json';

  console.log('page', page.getByRole('button', { name: 'Login' }));

  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('username@domain').click();
  await page.getByPlaceholder('username@domain').fill(user);
  await page.locator('#submit-button').click();
  await page.getByLabel('Password').fill(pw);
  await page.locator('#submit-button').click();
  await page.context().storageState({ path: authFile });
});
