import { FullConfig, Page } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const user = process.env.ZITADEL_USER || '';
const pw = process.env.ZITADEL_PW || '';

const globalSetup = async (page: Page, config: FullConfig) => {
  const authFile = './playwright/.auth/user.json';
  const { baseURL } = config.projects[0].use;

  await Promise.all([
    page.goto(baseURL!),
    page.getByRole('button', { name: 'Login' }).click(),
    page.getByPlaceholder('username@domain').click(),
    page.getByPlaceholder('username@domain').fill(user),
    page.locator('#submit-button').click(),
    page.getByLabel('Password').fill(pw),
    page.locator('#submit-button').click(),
    page.context().storageState({ path: authFile }),
  ]);
};

export default globalSetup;
