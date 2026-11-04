/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { test as base } from '@playwright/test';

import { authModal, type AuthModal } from './pom/auth-modal.ts';
import { langMenu, type LangMenu } from './pom/lang-menu.ts';

/**
 * Custom test fixtures extending the base Playwright environment.
 */
interface Fixtures {
  /**
   * Component object for the authentication modal dialog.
   */
  authModal: AuthModal;

  /**
   * Component object for the header language selection menu.
   */
  langMenu: LangMenu;
}

/**
 * Configured Playwright test runner with injected Page Objects.
 */
export const test = base.extend<Fixtures>({
  authModal: async ({ page }, use) => {
    await use(authModal(page));
  },
  langMenu: async ({ page }, use) => {
    await use(langMenu(page));
  },
});

/**
 * Re-exported web-first assertions for uniform imports across test suites.
 */
export { expect } from '@playwright/test';
