import { test as setup } from '@playwright/test';
import * as dotenv from 'dotenv';
const config = dotenv.config();

console.log('dotenv config', config.parsed);

setup('authenticate', async ({ page }) => {
  const authFile = './playwright/.auth/user.json';

  console.log('page', page.getByRole('button', { name: 'Login' }));
  console.log('page', page.getByLabel(''));

  await page.goto('http://localhost:3000');
  await page.getByPlaceholder('username@domain').click();
  await page.getByPlaceholder('username@domain').fill(process.env.ZITADEL_USER || '');
  await page.getByRole('button', { name: 'next' }).click();
  await page.getByLabel('Password').fill(process.env.ZITADEL_PW || '');
  await page.getByRole('button', { name: 'next' }).click();
  await page.context().storageState({ path: authFile });
});
