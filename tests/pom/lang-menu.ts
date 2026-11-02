/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Locator, Page } from '@playwright/test';

/**
 * Component object representing the header language switcher.
 */
export interface LangMenu {
  /**
   * Retrieves the locator of the currently active language item.
   */
  readonly active: () => Locator;

  /**
   * Switches the portal language by clicking the corresponding navigation link.
   *
   * @param language - Target language code.
   */
  readonly switchTo: (language: Language) => Promise<void>;
}

/**
 * Supported localization codes for the pravda.com.ua portal.
 */
export type Language = 'en' | 'ru' | 'uk';

/**
 * Encapsulated Page Object factory for interacting with the language menu
 * widget.
 *
 * @param page - Playwright page context.
 *
 * @returns An instance of {@link LangMenu}.
 */
export const langMenu = (page: Page): LangMenu => {
  const links: ReadonlyMap<Language, RegExp> = new Map([
    ['en', /eng/iu],
    ['ru', /рос/iu],
    ['uk', /укр/iu],
  ]);
  const root = page.locator('.lang_menu');
  return {
    active: () => root.locator('.lang_menu_item_active'),
    switchTo: async (language: Language) => {
      const name = links.get(language);
      if (name === undefined) {
        throw new Error(`Unsupported language pattern for "${language}"`);
      }
      await root.getByRole('link', { name }).click();
    },
  };
};
