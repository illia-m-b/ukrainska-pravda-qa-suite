/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test';

/**
 * Component object representing an article on its dedicated page.
 */
export interface Article {
  /**
   * Returns the locator for the article main text.
   */
  readonly text: () => Locator;

  /**
   * Returns the locator for the article heading.
   */
  readonly title: () => Locator;
}

/**
 * Encapsulated Page Object factory for interacting with an article.
 *
 * @param page - Playwright page context.
 *
 * @returns An instance of {@link Article}.
 */
export const article = (page: Page): Article => {
  const root = page.getByRole('article');
  return {
    text: () => root.locator('.post_news_text'),
    title: () => root.getByRole('heading', { level: 1 }),
  };
};
