/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from './fixtures.ts';

test.describe(
  'header language menu',
  {
    annotation: { description: 'REQ-F-01', type: 'requirement' },
  },
  () => {
    test(
      'displays default locale',
      {
        tag: '@TC-LOC-01',
      },
      async ({ langMenu, page }) => {
        await page.goto('/');
        await expect(langMenu.active()).toHaveText(/укр/iu);
        await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
      },
    );

    test(
      'switches to russian',
      {
        tag: '@TC-LOC-02',
      },
      async ({ langMenu, page }) => {
        await page.goto('/');
        await langMenu.switchTo('ru');
        await expect(page).toHaveURL(/\/rus\/?/);
        await expect(langMenu.active()).toHaveText(/рос/iu);
      },
    );

    test(
      'switches to english',
      {
        tag: '@TC-LOC-03',
      },
      async ({ langMenu, page }) => {
        await page.goto('/');
        await langMenu.switchTo('en');
        await expect(page).toHaveURL(/\/eng\/?/);
        await expect(langMenu.active()).toHaveText(/eng/iu);
      },
    );

    test(
      'switches back to ukrainian',
      {
        tag: '@TC-LOC-04',
      },
      async ({ langMenu, page }) => {
        await page.goto('/eng/');
        await langMenu.switchTo('uk');
        await expect(page).toHaveURL(/\/$/);
        await expect(langMenu.active()).toHaveText(/укр/iu);
      },
    );

    test(
      'handles unsupported locale',
      {
        tag: '@negative',
      },
      async ({ page }) => {
        const response = await page.goto('/kk');
        expect(response?.status()).toBe(404);
        await expect(page).toHaveTitle(/помилка 404/iu);
      },
    );
  },
);
