/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from './fixtures.ts';

test.describe(
  'with javascript disabled',
  {
    annotation: { description: 'REQ-NF-01', type: 'requirement' },
  },
  () => {
    test.use({ javaScriptEnabled: false });

    test(
      'displays articles and preserves language switching',
      { tag: '@TC-NF-01' },
      async ({ article, feed, langMenu, page }) => {
        await page.goto('/');
        await langMenu.switchTo('en');
        await expect(page).toHaveURL(/\/eng\/?/);
        await expect(langMenu.active()).toHaveText(/eng/iu);
        const latest = feed.latest();
        const target = await latest.evaluate(
          (element: HTMLAnchorElement) => element.href,
        );
        const referenced = await latest.innerText();
        await latest.click();
        await expect(page).toHaveURL(target);
        await expect(article.title()).toHaveText(referenced);
        await expect(article.text()).toBeVisible();
        await expect(article.text()).toHaveText(/\S+/);
      },
    );

    test(
      'does not open the login modal',
      { tag: '@TC-NF-02' },
      async ({ authModal, page }) => {
        await page.goto('/');
        await authModal.open();
        await expect(authModal.modal()).toBeHidden();
      },
    );
  },
);
