/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test';

/**
 * Component object representing the main feed.
 */
export interface Feed {
  /**
   * Returns the first available link to an article belonging to the current
   * domain.
   */
  readonly latest: () => Locator;
}

/**
 * Encapsulated Page Object factory for interacting with the main feed.
 *
 * @param page - Playwright page context.
 *
 * @returns An instance of {@link Feed}.
 */
export const feed = (page: Page): Feed => {
  return {
    latest: () =>
      page
        .locator(
          '.article_title a[href*="www.pravda.com.ua/"][href*="/news/"]:not([target="_blank"], :has(*))',
        )
        .first(),
  };
};
