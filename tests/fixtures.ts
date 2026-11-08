/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

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
  article: Article;

  /**
   * Component object for the authentication modal dialog.
   */
  authModal: AuthModal;

  /**
   * Component object for the main feed.
   */
  feed: Feed;

  /**
   * Component object for the header language selection menu.
   */
  langMenu: LangMenu;

  /**
   * Component object for the newsletter subscription widget.
   */
  newsletter: Newsletter;
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
