/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from './fixtures.ts';

test.describe(
  'using keyboard only',
  {
    annotation: { description: 'REQ-NF-03', type: 'requirement' },
  },
  () => {
    test(
      'signs in via the login modal window',
      { tag: '@TC-NF-05' },
      async ({ authModal, axe, page }, testInfo) => {
        const user = {
          email: 'user@example.com',
          password: 'My_Password_123',
        };
        await page.route('**/paywall/login/', async (route, request) => {
          expect(request.postDataJSON()).toMatchObject(user);
          await route.fulfill({
            body: JSON.stringify({ redirect: 'https://www.pravda.com.ua/' }),
            contentType: 'application/json',
            status: 200,
          });
        });
        await page.goto('/');
        await authModal.open();
        await expect(authModal.modal()).toBeVisible();
        await testInfo.attach('accessibility-scan-results', {
          body: JSON.stringify(await axe().analyze(), undefined, 2),
          contentType: 'application/json',
        });
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.type(user.email);
        await page.keyboard.press('Tab');
        await page.keyboard.type(user.password);
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');
        await expect(authModal.errors()).toHaveCount(0);
        await expect(authModal.modal()).toBeHidden();
        await expect(page).toHaveURL(/\/$/);
      },
    );

    test(
      'submits a newsletter form',
      { tag: '@TC-NF-06' },
      async ({ axe, newsletter, page }, testInfo) => {
        const email = 'me@example.com';
        await page.route('**/ranok/subscribe/', async (route, request) => {
          expect(request.postDataJSON()).toMatchObject({ email });
          await route.fulfill({
            body: JSON.stringify({
              message:
                'Ви успішно підписалися на УП. Ранок! Чекайте листи на пошті, а для управління розсилкою ми створили кабінет.',
            }),
            contentType: 'application/json',
            status: 200,
          });
        });
        await page.goto('/news/2026/11/07/8061724');
        const input = newsletter.field();
        await testInfo.attach('accessibility-scan-results', {
          body: JSON.stringify(await axe().analyze(), undefined, 2),
          contentType: 'application/json',
        });
        await input.fill(email);
        await expect(input).toBeFocused();
        await input.press('Enter');
        await expect(newsletter.success()).toBeVisible();
        await expect(newsletter.error()).toBeHidden();
        await expect(newsletter.field()).toBeEmpty();
      },
    );
  },
);
