/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test';

/**
 * Component object representing the authentication modal dialog and its
 * controls.
 */
export interface AuthModal {
  /**
   * Closes the authentication dialog using the dismissal button.
   */
  readonly close: () => Promise<void>;

  /**
   * Returns the locator for validation error messages rendered within the
   * dialog.
   */
  readonly errors: () => Locator;

  /**
   * Submits the authentication form with the provided user credentials.
   *
   * @param credentials - User credentials object containing email and password.
   */
  readonly login: (credentials: {
    email: string;
    password: string;
  }) => Promise<void>;

  /**
   * Returns the root locator of the authentication modal overlay.
   */
  readonly modal: () => Locator;

  /**
   * Opens the authentication dialog via the desktop header user icon.
   */
  readonly open: () => Promise<void>;
}

/**
 * Encapsulated Page Object factory for interacting with the authentication
 * modal dialog.
 *
 * @param page - Playwright page context.
 *
 * @returns An instance of {@link AuthModal}.
 */
export const authModal = (page: Page): AuthModal => {
  const reveal = page.locator('.header_main a.user_link.login_modal');
  const modal = page.locator('#authModal');
  return {
    close: async () => {
      await modal.locator('a.modal_close').click();
    },
    errors: () => modal.locator('#loginErrors .form_error'),
    login: async ({ email, password }) => {
      await modal.getByLabel(/email/iu).fill(email);
      await modal.getByLabel(/пароль/iu).fill(password);
      await modal.getByRole('button', { name: /увійти/iu }).click();
    },
    modal: () => modal,
    open: async () => {
      await reveal.click();
    },
  };
};
