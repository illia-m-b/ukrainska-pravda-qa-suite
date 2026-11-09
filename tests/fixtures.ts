/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import AxeBuilder from '@axe-core/playwright';
import { test as base } from '@playwright/test';

import { article, type Article } from './pom/article.ts';
import { authModal, type AuthModal } from './pom/auth-modal.ts';
import { feed, type Feed } from './pom/feed.ts';
import { langMenu, type LangMenu } from './pom/lang-menu.ts';
import { newsletter, type Newsletter } from './pom/newsletter.ts';

/**
 * Custom test fixtures extending the base Playwright environment.
 */
interface Fixtures {
  /**
   * Component object for an article.
   */
  readonly article: Article;

  /**
   * Component object for the authentication modal dialog.
   */
  readonly authModal: AuthModal;

  /**
   * Factory function for an accessibility scanner configured for the current
   * page.
   */
  readonly axe: () => AxeBuilder;

  /**
   * Component object for the main feed.
   */
  readonly feed: Feed;

  /**
   * Component object for the header language selection menu.
   */
  readonly langMenu: LangMenu;

  /**
   * Component object for the newsletter subscription widget.
   */
  readonly newsletter: Newsletter;
}

/**
 * Configured Playwright test runner with injected Page Objects.
 */
export const test = base.extend<Fixtures>({
  article: async ({ page }, use) => {
    await use(article(page));
  },
  authModal: async ({ page }, use) => {
    await use(authModal(page));
  },
  axe: async ({ page }, use) => {
    await use(() =>
      new AxeBuilder({ page }).withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
      ]),
    );
  },
  feed: async ({ page }, use) => {
    await use(feed(page));
  },
  langMenu: async ({ page }, use) => {
    await use(langMenu(page));
  },
  newsletter: async ({ page }, use) => {
    await use(newsletter(page));
  },
});

/**
 * Re-exported web-first assertions for uniform imports across test suites.
 */
export { expect } from '@playwright/test';
