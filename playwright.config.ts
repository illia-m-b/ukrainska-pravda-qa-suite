/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { PlaywrightTestConfig } from '@playwright/test';

import { devices } from '@playwright/test';

const isCi = process.env.CI !== undefined;

export default {
  expect: {
    timeout: 5 * 1000,
  },
  forbidOnly: isCi,
  fullyParallel: false,
  outputDir: 'test-results',
  projects: [
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
  ],
  reporter: [
    ['list'],
    [
      'html',
      {
        open: 'never',
        outputFolder: 'playwright-report',
      },
    ],
  ],
  retries: isCi ? 2 : 0,
  testDir: './tests',
  timeout: 30 * 1000,
  use: {
    baseURL: 'https://www.pravda.com.ua',
    headless: true,
    locale: 'uk-UA',
    screenshot: 'only-on-failure',
    timezoneId: 'Europe/Kyiv',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    viewport: { height: 720, width: 1280 },
  },
  workers: isCi ? 1 : 2,
} satisfies PlaywrightTestConfig;
