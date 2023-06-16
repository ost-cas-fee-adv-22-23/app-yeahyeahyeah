import { test, expect } from '@playwright/test';
import { generateHashtag } from './utils/hastagGenerator';
import * as dotenv from 'dotenv';
import { generateSentence } from './utils/randomSentence';
dotenv.config();

const hashTag: string = generateHashtag();
let testMessage: string;

test.describe('01.authenticated tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('body');

    expect(async () => {
      await expect(page.getByRole('article').first().getByTitle(`${hashTag}`)).toHaveAttribute('href', `/search/${hashTag}`);
    });
  });

  test('timeline - should like it or not', async ({ page }) => {
    await page.getByRole('article').first().getByRole('button', { name: /Like/ }).click();
  });

  test('timeline - should comment an article', async ({ page }) => {
    await expect(async () => {
      await page
        .getByRole('article')
        .first()
        .getByRole('link', { name: /Comment/ })
        .click();
    }).toPass();

    const commentArticle = page.getByRole('article').first();
    const article_id = await commentArticle.getAttribute('id');
    expect(article_id).toBeTruthy();
    expect(typeof article_id).toBe('string');
    expect(article_id, `👉 article_id should be a string of 26 alphanumeric and/or - characters: ${article_id}`).toMatch(
      /^[\w-]{26}$/i
    );

    await expect(page).toHaveURL(new RegExp(`/mumble/${article_id}`));
    expect(page.getByRole('article').first()).toBeVisible();

    await page.waitForSelector('[data-testid="testTextarea"]');

    const commentMessage = generateSentence();
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
    const hasHashtag: boolean = await page.isVisible(`text=${hashTag}`);

    await expect(async () => {
      if (hasHashtag === true) {
        await page.getByRole('article').first().getByTitle(`${hashTag}`).click();

        await page
          .getByRole('link', { name: `${hashTag}` })
          .first()
          .click();

        await expect(page).toHaveURL(`/search/${hashTag}`);

        await expect(page.getByRole('link', { name: `${hashTag}` }).first()).toHaveAttribute('title', `${hashTag}`);
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
    await page.getByRole('link', { name: 'Profile' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/profile/);

    await expect(async () => {
      const articleIsPresent: boolean = await page.isVisible(`text=${testMessage}`);

      if (articleIsPresent === true) {
        await expect(page.getByRole('article').filter({ hasText: `${testMessage}` })).toContainText(`${hashTag}`);
        expect(page.getByRole('button', { name: /Liked/ })).toHaveText(/Liked/);
      }

      await page.getByRole('tab', { name: 'Deine Likes' }).click();
      if (articleIsPresent === true) {
        expect(
          page
            .getByRole('article')
            .filter({ hasText: `${testMessage}` })
            .first()
        ).toContainText(`${hashTag}`);

        const likeButton = page.getByRole('article').first().getByRole('button', { name: /Like/ });
        const likeButtonState = await likeButton.innerText();

        await expect.soft(page.getByRole('article').first().getByRole('button', { name: /Like/ })).toHaveText(/Like/);
        console.log(likeButtonState === 'Like' ? `💔 Mumble is unliked` : `💝 Mumble is liked`);
      }
    }).toPass();
  });
});
