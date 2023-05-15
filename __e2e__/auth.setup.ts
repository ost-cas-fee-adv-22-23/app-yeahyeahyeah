import { test as setup } from '@playwright/test';

const username: string = `${process.env.ZITADEL_USER}`;
const password: string = `${process.env.ZITADEL_PW}`;
const url: string = `${process.env.NEXTAUTH_URL}`;

setup('authenticate', async ({ page }) => {
  const authFile = './playwright/.auth/user.json';

  await page.goto(url);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('username@domain').click();
  await page.getByPlaceholder('username@domain').fill(username);
  await page.getByRole('button', { name: 'next' }).click();
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'next' }).click();
  await page.context().storageState({ path: authFile });
});
