import { test } from '@playwright/test';

test.describe('Monkey test with gremlins.js', () => {
  test.describe.configure({ retries: 20 });

  test('@monkeytest', async ({ page }) => {
    await page.addInitScript({
      path: './node_modules/gremlins.js/dist/gremlins.min.js',
    });

    await page.goto('/');

    await page.evaluate(() =>
      Promise.race([
        new Promise((resolve) => {
          gremlins
            .createHorde({
              species: [
                gremlins.species.clicker({
                  clickTypes: ['click'],
                  canClick: function (element) {
                    return !element.classList.contains('NaviButton__StyledButton-sc-vc44vg-2 cCUvUJ');
                  },
                }),
                gremlins.species.formFiller(),
                gremlins.species.typer(),
                gremlins.species.scroller(),
              ],
              mogwais: [gremlins.mogwais.alert()],
              distribution: [0.25, 0.25, 0.25, 0.25],
              delay: 250,
            })
            .unleash();
        }),
        new Promise((resolve) => setTimeout(resolve, 10000)),
      ])
    );
  });
});
