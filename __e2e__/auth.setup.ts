import { test as setup } from '@playwright/test';
import * as dotenv from 'dotenv';
const config = dotenv.config();

const user = process.env.ZITADEL_USER || '';
const pw = process.env.ZITADEL_PW || '';

console.log('dotenv config', config.parsed);
console.log('user', user);
console.log('pw', pw);

setup('authenticate', async ({ page }) => {
  const authFile = './playwright/.auth/user.json';

  console.log('page', page.getByRole('button', { name: 'Login' }));
  console.log('page', page.getByLabel(''));

  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('username@domain').click();
  await page.getByPlaceholder('username@domain').fill(user);
  await page.getByRole('button', { name: 'next' }).click();
  await page.getByLabel('Password').fill(pw);
  await page.getByRole('button', { name: 'next' }).click();
  await page.context().storageState({ path: authFile });
});
