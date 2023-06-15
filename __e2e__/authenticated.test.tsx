import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { sentence } from './utils/randomSentence';
dotenv.config();

let hashTagPrefix: string = 'e2e3yeah';
let hashTag: string;
let testMessage: string;

test.describe('01.authenticated tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('body');
    const getHashTag = (await page.getByRole('article').first().getByTitle(`${hashTagPrefix}`).innerText()).substring(1);
    hashTag = getHashTag;
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

    expect(article_id, `👉 should have an article id ${article_id}`).not.toBeNull();
    await expect(page).toHaveURL(new RegExp(`/mumble/${article_id}`));
    expect(page.getByRole('article').first()).toBeVisible();

    // COMMENT ARTICLE
    await page.waitForSelector('[data-testid="testTextarea"]');

    let commentMessage = sentence();
    await page.getByTestId('testTextarea').fill(commentMessage);
    await page.getByRole('button', { name: 'Absenden' }).click();

    await expect(
      page
        .getByRole('article')
        .filter({ hasText: `${commentMessage}` })
        .locator('p')
    ).toHaveText(commentMessage);

    await page.getByRole('link', { name: 'Startpage' }).click();

    await expect(async () => {
      const commentLink = page.locator(`[id="${article_id}"]`).getByRole('link', { name: /Comment/ });
      const countComments = await commentLink.innerText();
      const getCommentsNumber = countComments.split(' ');

      await expect(commentLink).toHaveText(/(\d+ )?Comments?/);
      expect(parseInt(getCommentsNumber[0])).toBeGreaterThanOrEqual(1);
    }).toPass();
  });

  test('timeline - should click on hashtag', async ({ page }) => {
    let hasHashtag: boolean = false;
    hasHashtag = await page.isVisible(`text=${hashTagPrefix}`);

    await expect(async () => {
      if (hasHashtag === true) {
        await page.getByRole('article').first().getByTitle(`${hashTagPrefix}`).click();

        await page
          .getByRole('link', { name: `${hashTag}` })
          .first()
          .click();

        await expect(page).toHaveURL(`/search/${hashTag}`);

        expect(page.getByRole('link', { name: `${hashTag}` }).first()).toHaveAttribute('title', `${hashTag}`);
        await expect(
          page
            .getByRole('article')
            .first()
            .filter({ hasText: `${hashTag}` })
        ).toBeVisible();
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
    await page.getByRole('link', { name: 'Profile' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/profile/);

    await expect(async () => {
      articleIsPresent = await page.isVisible(`text=${testMessage}`);
      if (articleIsPresent === true) {
        expect(page.getByRole('article').filter({ hasText: `${testMessage}` })).not.toBe('');
        expect(page.getByRole('button', { name: /Liked/ })).toHaveText(/Liked/);
      }

      // CLICK ON SWITCH TAB 'DEINE LIKES'
      await page.getByRole('tab', { name: 'Deine Likes' }).click();
      if (articleIsPresent === true) {
        expect(
          page
            .getByRole('article')
            .filter({ hasText: `${testMessage}` })
            .first()
        ).toContainText(`${hashTag}`);
        // CHECK LIKED MUMBLE ON PROFILE PAGE
        const likeButton = page.getByRole('article').first().getByRole('button', { name: /Like/ });
        const likeButtonState = await likeButton.innerText();

        await expect.soft(page.getByRole('article').first().getByRole('button', { name: /Like/ })).toHaveText(/Like/);
        console.log(likeButtonState === 'Like' ? `💔 Mumble is unliked` : `💝 Mumble is liked`);
      }
    }).toPass();
  });
});
