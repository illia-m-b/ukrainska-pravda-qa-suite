/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test';

/**
 * Component object representing the newsletter subscription widget and its
 * controls.
 */
export interface Newsletter {
  /**
   * Returns the locator for the error message container.
   */
  readonly error: () => Locator;

  /**
   * Returns the locator for the email input field.
   */
  readonly field: () => Locator;

  /**
   * Submits the subscription form with the specified email address.
   *
   * @param email - Target email address to subscribe.
   */
  readonly subscribe: (email: string) => Promise<void>;

  /**
   * Returns the locator for the success confirmation message container.
   */
  readonly success: () => Locator;
}

/**
 * Page Object factory for the newsletter subscription widget.
 *
 * @param page - Playwright page context.
 *
 * @returns An instance of {@link Newsletter}.
 */
export const newsletter = (page: Page): Newsletter => {
  const root = page.locator('.section_ranok_inner');
  return {
    error: () => root.locator('[data-ranok-error]'),
    field: () => root.locator('[data-ranok-subscribe-form] [data-ranok-email]'),
    subscribe: async (email: string) => {
      const form = root.locator('[data-ranok-subscribe-form]');
      await form.locator('[data-ranok-email]').fill(email);
      await form.locator('[data-ranok-submit]').click();
    },
    success: () => root.locator('[data-ranok-success]'),
  };
};
