/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from './fixtures.ts';

test.describe(
  'morning newsletter form',
  {
    annotation: { description: 'REQ-F-03', type: 'requirement' },
  },
  () => {
    for (const { title, url } of [
      { title: 'on the landing page', url: '/newsletter/up-ranok/' },
      { title: 'on an article page', url: '/news/2026/11/07/8061724' },
    ]) {
      test.describe(title, () => {
        test.beforeEach(async ({ page }) => {
          await page.goto(url);
        });

        test(
          'subscribes with a valid email',
          { tag: '@TC-SUB-01' },
          async ({ newsletter, page }) => {
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
            await newsletter.subscribe(email);
            await expect(newsletter.success()).toBeVisible();
            await expect(newsletter.error()).toBeHidden();
            await expect(newsletter.field()).toBeEmpty();
          },
        );

        test(
          'prevents submission on malformed emails',
          { tag: '@TC-SUB-02' },
          async ({ newsletter, page }) => {
            await page.route('**/ranok/subscribe/', () => {
              throw new Error(
                'Network request must be prevented when email field is malformed',
              );
            });
            for (const malformed of [
              'invalid_user@',
              'test@.com',
              'user@domain..com',
              'plain-email',
            ]) {
              await test.step(`rejects "${malformed}"`, async () => {
                await newsletter.subscribe(malformed);
                await expect(newsletter.field()).toBeFocused();
                await expect(newsletter.field()).toHaveValue(malformed);
                await expect(newsletter.field()).toHaveJSProperty(
                  'validity.typeMismatch',
                  true,
                );
              });
            }
            await expect(newsletter.error()).toBeHidden();
            await expect(newsletter.success()).toBeHidden();
          },
        );

        test(
          'prevents submission on an empty field',
          { tag: '@TC-SUB-03' },
          async ({ newsletter, page }) => {
            await page.route('**/ranok/subscribe/', () => {
              throw new Error(
                'Network request must be prevented when email field is empty',
              );
            });
            await newsletter.subscribe('');
            await expect(newsletter.field()).toBeFocused();
            await expect(newsletter.field()).toHaveJSProperty(
              'validity.valueMissing',
              true,
            );
            await expect(newsletter.error()).toBeHidden();
            await expect(newsletter.success()).toBeHidden();
          },
        );
      });
    }
  },
);
