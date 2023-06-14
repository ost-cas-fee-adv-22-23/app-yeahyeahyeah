import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { sentence } from '../src/utils/randomSentence';
dotenv.config();

const hashTag = 'e2e';
let testMessage: string;

test.describe('01.authenticated tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('body');
  });

  test('timeline - should like it or not', async ({ page }) => {
    await page.getByRole('article').first().getByRole('button', { name: /Like/ }).click();
  });

  test('timeline - should comment an article', async ({ page }) => {
    await page
      .getByRole('article')
      .first()
      .getByRole('link', { name: /Comment/ })
      .click();

    const commentArticle = page.getByRole('article').first();
    const article_id = await commentArticle.getAttribute('id');

    expect(article_id, `👉 should have an article id ${article_id}`);

    await expect(page).toHaveURL(new RegExp(`/mumble/${article_id}`));

    expect(page.getByRole('article').first());

    await page.waitForSelector('[data-testid="testTextarea"]');
    await page.getByTestId('testTextarea').fill(sentence());
    await page.getByRole('button', { name: 'Absenden' }).click();

    expect(page.getByRole('article').filter({ hasText: `${testMessage}` }));

    await page.getByRole('link', { name: 'Startpage' }).click();

    expect(
      page
        .getByRole('article')
        .filter({ hasText: `${testMessage}` })
        .first()
        .getByRole('link', { name: '1 Comment' })
    );
  });

  test('timeline - should click on hashtag', async ({ page }) => {
    let hasArticleToBeDelete: boolean = false;
    await expect(async () => {
      hasArticleToBeDelete = await page.isVisible(`text=${hashTag}`);

      if (hasArticleToBeDelete === true) {
        await page.getByRole('article').first().getByTitle(`${hashTag}`).click();

        await page
          .getByRole('link', { name: `#${hashTag}` })
          .first()
          .click();

        await expect(page).toHaveURL('/search/e2e');

        expect(page.getByRole('link', { name: `${hashTag}` }).first()).toHaveAttribute('title', 'e2e');
        expect(
          page
            .getByRole('article')
            .first()
            .filter({ hasText: `${testMessage} ${hashTag}` })
        );
      }
    }).toPass();
  });

  test('timeline - should post no message', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: 'Absenden' }).click();
    await expect(page.locator('p').filter({ hasText: 'Das Textfeld darf nicht leer sein.' })).toBeInViewport();
  });

  test('profile - should list created message and liked article', async ({ page }) => {
    let articleIsPresent: boolean = false;
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/profile/);

    await expect(async () => {
      articleIsPresent = await page.isVisible(`text=${testMessage}`);

      if (articleIsPresent === true) {
        expect(page.getByRole('article').filter({ hasText: `${testMessage}` }));
        expect(page.getByRole('button', { name: /Liked/ }));
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
        // CHECK LIKED MUMBLE ON PROFILE PAGE
        const likeButton = page.getByRole('article').first().getByRole('button', { name: /Like/ });
        const likeButtonState = await likeButton.innerText();

        await expect.soft(page.getByRole('article').first().getByRole('button', { name: /Like/ })).toHaveText(/Like/);
        console.log(likeButtonState === 'Like' ? `💔 Mumble is unliked` : `💝 Mumble is liked`);
      }
    }).toPass();
  });
});
