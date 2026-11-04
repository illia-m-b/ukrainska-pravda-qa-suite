/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from './fixtures.ts';

test.describe(
  'header login form',
  {
    annotation: { description: 'REQ-F-02', type: 'requirement' },
  },
  () => {
    test(
      'opens and closes modal',
      {
        tag: '@TC-AUTH-01',
      },
      async ({ authModal, page }) => {
        await page.goto('/');
        await expect(authModal.modal()).toBeHidden();
        await authModal.open();
        await expect(authModal.modal()).toBeVisible();
        await authModal.close();
        await expect(authModal.modal()).toBeHidden();
      },
    );

    test(
      'redirects on success',
      {
        tag: '@TC-AUTH-02',
      },
      async ({ authModal, page }) => {
        const user = {
          email: 'existing@example.com',
          password: 'Valid_Password_123',
        };
        await page.route('**/paywall/login/', async (route) => {
          expect(route.request().postDataJSON()).toMatchObject(user);
          await route.fulfill({
            body: JSON.stringify({ redirect: 'https://www.pravda.com.ua/' }),
            contentType: 'application/json',
            status: 200,
          });
        });
        await page.goto('/');
        await authModal.open();
        await authModal.login(user);
        await expect(authModal.errors()).toHaveCount(0);
        await expect(authModal.modal()).toBeHidden();
        await expect(page).toHaveURL(/\/$/);
      },
    );

    test(
      'validates invalid credentials',
      {
        tag: '@TC-AUTH-03',
      },
      async ({ authModal, page }) => {
        const user = {
          email: 'my-awesome-fake-email@example.com',
          password: 'Strong_123_Password',
        };
        await page.route('**/paywall/login/', async (route) => {
          expect(route.request().postDataJSON()).toMatchObject(user);
          await route.fulfill({
            body: JSON.stringify({
              errors: { email: ['Невірний email або пароль'] },
            }),
            contentType: 'application/json',
            status: 422,
          });
        });
        await page.goto('/');
        await authModal.open();
        await authModal.login(user);
        await expect(authModal.modal()).toBeVisible();
        await expect(authModal.errors()).toHaveCount(1);
        await expect(authModal.errors()).toContainText(
          /невірний email або пароль/iu,
        );
      },
    );
  },
);
