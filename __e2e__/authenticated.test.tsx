import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe.configure({ mode: 'serial' });

const testMessage = 'Lorem ipsum dolor dolor sit amet';
const hashTag = 'e2e';

test.describe('01.authenticated tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('01.timeline - post message', async ({ page }) => {
    await page.waitForSelector('[data-testid="testTextarea"]');
    await page.getByTestId('testTextarea').fill(`${testMessage} #${hashTag}`);
    await page.waitForSelector('body');
    await page.getByRole('button', { name: 'Absenden' }).click();
    expect(page.getByRole('article').filter({ hasText: `${testMessage}` }));
  });

  test('03.timeline - post without text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="testTextarea"]');
    await page.getByRole('button', { name: 'Absenden' }).click();
    await expect(page.locator('p').filter({ hasText: 'Das Textfeld darf nicht leer sein.' })).toBeInViewport();
  });

  test('03.timeline - click on hashtag', async ({ page }) => {
    await expect(async () => {
      let hasArticleToBeDelete: boolean = false;
      hasArticleToBeDelete = await page.isVisible(`text=${testMessage}`);

      if (hasArticleToBeDelete === true) {
        await page
          .getByRole('article')
          .filter({ hasText: `${testMessage}` })
          .getByTitle('e2e')
          .first()
          .click();

        await page
          .getByRole('link', { name: `#${hashTag}` })
          .first()
          .click();

        await expect(page).toHaveURL('/search/e2e');
        expect(page.getByRole('link', { name: `${hashTag}` }).first());
        expect(page.getByRole('article').filter({ hasText: `${testMessage}` }));
      }
    }).toPass();
  });

  test('04.timeline - delete message', async ({ page }) => {
    await page.waitForSelector('body, footer');
    await expect(async () => {
      let hasArticleToBeDelete: boolean = false;
      hasArticleToBeDelete = await page.isVisible(`text=${testMessage}`);

      if (hasArticleToBeDelete === true) {
        const articleToBeDeleted = page
          .getByRole('article')
          .filter({ hasText: `${testMessage}` })
          .first();

        const article_id = await articleToBeDeleted.getAttribute('id');
        expect(article_id, `👉 should have an article id ${article_id}`);
        await articleToBeDeleted.locator('svg').last().click();
        console.log(`👉 deleting article with id ${article_id}`);

        expect(page.locator(`body:has(#${article_id})`)).toBe(false);
      } else {
        console.log(`❗ no test message (${testMessage}) found`);
      }
      expect(hasArticleToBeDelete, '👍 should have no test message').toBe(false);
    }).toPass();

    expect(
      page.getByRole('article').filter({ hasText: `${testMessage}` }),
      '👎 something went wrong. there are still test messages present'
    ).not.toBeInViewport();
    console.log(`✅ should have cleaned up all messages.`);
  });
});
