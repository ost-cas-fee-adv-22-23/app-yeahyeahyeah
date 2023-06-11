import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config();

test.describe.configure({ mode: 'parallel' });

const testMessage = 'Lorem ipsum dolor dolor sit amet';
const hashTag = 'e2e';
const imageUploadEndPoint = /storage.googleapis.com\/qwacker-api-prod-data/;

test.describe('01.authenticated tests', () => {
  test.beforeEach(async ({ page }) => {
    test.slow();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('01.timeline - should post a message with image', async ({ page }) => {
    await page.waitForSelector('[data-testid="testTextarea"]');
    await page.getByTestId('testTextarea').fill(`${testMessage} #${hashTag}`);
    await page.locator('input[type=file]').setInputFiles(path.join(__dirname, '../public', 'avatar_default.png'));
    await page.getByRole('button', { name: 'Absenden' }).click();
    expect(page.getByRole('article').filter({ hasText: `${testMessage}` }));
    await expect(page.getByRole('img', { name: 'Lorem ipsum dolor dolor sit amet #e2e' })).toHaveAttribute(
      'src',
      imageUploadEndPoint
    );
  });

  test('02.timeline - should like an article', async ({ page }) => {
    await expect(async () => {
      let hasArticleToBeLiked: boolean = false;
      hasArticleToBeLiked = await page.isVisible(`text=${testMessage}`);

      if (hasArticleToBeLiked === true) {
        await page
          .getByRole('article')
          .filter({ hasText: `${testMessage}` })
          .first()
          .getByRole('button', { name: 'Like' })
          .click();
      }
    }).toPass();
    expect(page.getByRole('button', { name: 'Liked' }));
  });

  test('03.timeline - should click on hashtag', async ({ page }) => {
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

  test('04.timeline - should post no message', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="testTextarea"]');
    await page.getByRole('button', { name: 'Absenden' }).click();
    await expect(page.locator('p').filter({ hasText: 'Das Textfeld darf nicht leer sein.' })).toBeInViewport();
  });

  test('05.profile - should list created message and liked article', async ({ page }) => {
    let articleIsPresent: boolean = false;

    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/profile/);
    await page.waitForLoadState('domcontentloaded');

    await expect(async () => {
      articleIsPresent = await page.isVisible(`text=${testMessage}`);

      if (articleIsPresent === true) {
        expect(page.getByRole('article').filter({ hasText: `${testMessage}` }));
        expect(page.getByRole('button', { name: 'Liked' }));
      }

      // CLICK ON SWITCH TAB 'DEINE LIKES'
      await page.getByRole('tab', { name: 'Deine Likes' }).click();

      articleIsPresent = await page.isVisible(`text=${testMessage}`);

      if (articleIsPresent === true) {
        expect(
          page
            .getByRole('article')
            .filter({ hasText: `${testMessage}` })
            .first()
        );
        expect(page.getByRole('button', { name: 'Liked' }));
      }
    }).toPass();
  });

  test('06.timeline - should delete test message', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
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
        await expect(articleToBeDeleted.locator('svg').last()).toHaveClass(/PostWithShimmer___StyledCancel/);
        await articleToBeDeleted.locator('svg').last().click();
        console.log(`👉 deleting article with id ${article_id}`);
        expect(page.locator(`body:has(#${article_id})`)).toBe(false);
      } else {
        console.log(`❗ no test message (${testMessage}) found`);
      }
      expect(hasArticleToBeDelete, '👍 should have no test message').toBe(false);
    }).toPass();

    const messageShouldBeUndefinded = expect(
      await page
        .getByRole('article')
        .filter({ hasText: `${testMessage}` })
        .count()
    ).toEqual(0);

    expect(messageShouldBeUndefinded, `✅ should have cleaned up all messages.`).toBe(undefined);
  });
});
