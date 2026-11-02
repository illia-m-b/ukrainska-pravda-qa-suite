/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from './fixtures.ts';

test('displays Ukrainian as default language', async ({ langMenu, page }) => {
  await page.goto('/');
  await expect(langMenu.active()).toHaveText(/укр/iu);
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
});

test('switches to Russian locale successfully', async ({ langMenu, page }) => {
  await page.goto('/');
  await langMenu.switchTo('ru');
  await expect(page).toHaveURL(/\/rus\/?/);
  await expect(langMenu.active()).toHaveText(/рос/iu);
});

test('switches to English locale successfully', async ({ langMenu, page }) => {
  await page.goto('/');
  await langMenu.switchTo('en');
  await expect(page).toHaveURL(/\/eng\/?/);
  await expect(langMenu.active()).toHaveText(/eng/iu);
});

test('returns not found for unsupported locale', async ({ page }) => {
  const response = await page.goto('/kk');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle(/помилка 404/iu);
});

test('switches back to Ukrainian locale successfully', async ({
  langMenu,
  page,
}) => {
  await page.goto('/eng/');
  await langMenu.switchTo('uk');
  await expect(page).toHaveURL(/\//);
  await expect(langMenu.active()).toHaveText(/укр/iu);
});
