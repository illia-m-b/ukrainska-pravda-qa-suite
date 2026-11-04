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
        await page.route('**/paywall/login/', async (route, request) => {
          expect(request.postDataJSON()).toMatchObject(user);
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

    test(
      'prevents submission on empty fields',
      {
        tag: '@TC-AUTH-04',
      },
      async ({ authModal, page }) => {
        await page.route('**/paywall/login/', () => {
          throw new Error(
            'Network requests must be prevented when login fields are empty',
          );
        });
        const empty = { email: '', password: '' };
        await page.goto('/');
        await authModal.open();
        await authModal.login(empty);
        await expect(authModal.modal()).toBeVisible();
        const field = authModal.modal().getByLabel(/email/iu);
        await expect(field).toBeFocused();
        await expect(field).toHaveJSProperty('validity.valueMissing', true);
        await expect(authModal.errors()).toHaveCount(0);
      },
    );

    test(
      'includes csrf token and handles error response',
      {
        tag: '@TC-AUTH-05',
      },
      async ({ authModal, page }) => {
        const user = {
          email: 'existing@example.com',
          password: 'Wrong_Password_123',
        };
        await page.route('**/paywall/login/', async (route, request) => {
          expect(request.postDataJSON()).toMatchObject(user);
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
        await expect(
          authModal.modal().locator('input[name="_token"]'),
        ).toHaveValue(/^.{31,}$/);
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
