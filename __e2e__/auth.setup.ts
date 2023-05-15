import { test as setup } from '@playwright/test';

const username: string = `${process.env.NEXT_PUBLIC_SECRET_USER}`;
const password: string = `${process.env.NEXT_PUBLIC_SECRET_PW}`;

setup('authenticate', async ({ page }) => {
  const authFile = './playwright/.auth/user.json';

  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('username@domain').click();
  await page.getByPlaceholder('username@domain').fill(username);
  await page.getByRole('button', { name: 'next' }).click();
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'next' }).click();
  await page.context().storageState({ path: authFile });
});
