<!--
SPDX-FileCopyrightText: 2026 Illia Brashkin
SPDX-License-Identifier: MIT
-->

# Ukrainska Pravda QA Suite

Playwright-based end-to-end and accessibility test suite for the
[pravda.com.ua][portal] portal.

[![CI Status][badge-ci]][workflow-ci]
[![Playwright][badge-playwright]][playwright-url]
[![Firefox][badge-firefox]][firefox-url]
[![Node.js Version][badge-node]][node-url]
[![pnpm Version][badge-pnpm]][pnpm-url]
[![TypeScript][badge-typescript]][typescript-url]
[![REUSE Status][badge-reuse]][reuse-url]
[![License][badge-license]][license-url]

[Overview](#overview) &bull;
[Features](#features) &bull;
[Traceability Matrix](#traceability-matrix) &bull;
[Prerequisites](#prerequisites) &bull;
[Getting Started](#getting-started) &bull;
[Running Tests](#running-tests) &bull;
[Architecture](#architecture) &bull;
[Legal Notice](#legal-notice)

## Overview

This repository contains an automated quality assurance suite for
[Ukrainska Pravda][portal], an independent online news portal in Ukraine.
The suite provides end-to-end verification across critical user journeys,
internationalization switchers, subscription channels, and modal dialogs.

The implementation builds on [Playwright][playwright-url] and
[TypeScript][typescript-url]. It adheres to ISO/IEC 25010 software quality
characteristics and WCAG 2.1 AA accessibility guidelines. Interactions are
structured through the Page Object Model (POM) pattern and delivered via
modular test fixtures.

> [!NOTE]
> Mutating HTTP requests (including authentication and newsletter
> subscriptions) are intercepted and fulfilled with mock responses at the
> network layer. This avoids Cloudflare WAF bot mitigation and rate limits,
> keeps tests deterministic, and prevents test data pollution on production.

## Features

- **Automated Accessibility Audits**: Scans modal dialogs and subscription
  forms against WCAG 2.0 and 2.1 (Level A and AA) standards using
  `@axe-core/playwright`, attaching audit reports directly to test runs.
- **Pure Keyboard Navigation**: Verifies critical user flows, including
  credential submission and newsletter opt-ins, strictly through keyboard
  sequences without pointing devices.
- **Graceful Degradation Verification**: Confirms that news feeds, articles,
  and language selections remain operable with JavaScript disabled in the
  browser.
- **Page Object Architecture**: Encapsulates locator queries and user
  interactions within decoupled component objects (`Article`, `AuthModal`,
  `Feed`, `LangMenu`, and `Newsletter`).
- **Shift-Right Network Interception**: Mocks backend responses for credential
  evaluations, CSRF validations, and subscriptions to avert Cloudflare WAF
  blocks and preserve production state integrity.
- **Requirements Traceability**: Binds every test scenario to specific
  functional (`REQ-F-*`) and non-functional (`REQ-NF-*`) quality requirements.

## Traceability Matrix

| Requirement ID | Description                                | Test Case ID                                                              | Test File                                                  |
| :------------- | :----------------------------------------- | :------------------------------------------------------------------------ | :--------------------------------------------------------- |
| `REQ-F-01`     | Header language switching and localization | `@TC-LOC-01`, `@TC-LOC-02`, `@TC-LOC-03`, `@TC-LOC-04`                    | [`tests/localization.spec.ts`](tests/localization.spec.ts) |
| `REQ-F-02`     | Header authentication modal dialog         | `@TC-AUTH-01`, `@TC-AUTH-02`, `@TC-AUTH-03`, `@TC-AUTH-04`, `@TC-AUTH-05` | [`tests/auth.spec.ts`](tests/auth.spec.ts)                 |
| `REQ-F-03`     | Morning newsletter subscription form       | `@TC-SUB-01`, `@TC-SUB-02`, `@TC-SUB-03`                                  | [`tests/newsletter.spec.ts`](tests/newsletter.spec.ts)     |
| `REQ-NF-01`    | Graceful degradation without JavaScript    | `@TC-NF-01`, `@TC-NF-02`                                                  | [`tests/no-js.spec.ts`](tests/no-js.spec.ts)               |
| `REQ-NF-03`    | Accessibility and keyboard navigation      | `@TC-NF-05`, `@TC-NF-06`                                                  | [`tests/a11y.spec.ts`](tests/a11y.spec.ts)                 |

## Prerequisites

Before running the suite, ensure your local environment contains:

- **Node.js**: Version `24.x`, matching the exact runtime in
  [`devEngines`](package.json).
- **pnpm**: Version `12.x`, matching the package manager in
  [`devEngines`](package.json).
- **Firefox**: The default test browser configured in
  [`playwright.config.ts`](playwright.config.ts).

## Getting Started

1. Clone this repository to your workstation:

   ```bash
   git clone https://github.com/illia-m-b/ukrainska-pravda-qa-suite.git
   cd ukrainska-pravda-qa-suite
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Download required Playwright browser binaries:

   ```bash
   pnpm exec playwright install firefox
   ```

> [!TIP]
> Install local Git hooks via `pnpm lefthook install` to run type checks,
> linters, and code formatters automatically before commits.

## Running Tests

Execute tests in headless mode:

```bash
pnpm test:e2e
```

Launch the interactive Playwright UI mode:

```bash
pnpm test:e2e:ui
```

Inspect execution traces and screenshots in the HTML report:

```bash
pnpm test:e2e:report
```

Target an individual test file:

```bash
pnpm test:e2e tests/a11y.spec.ts
```

Execute tests matching a specific requirement tag:

```bash
pnpm test:e2e --grep "@TC-SUB-01"
```

Launch the selector generator against the portal:

```bash
pnpm test:e2e:codegen
```

## Architecture

The project organizes tests, page objects, and configurations as follows:

```text
├── .github/
│   └── workflows/            # GitHub Actions CI/CD pipeline definitions
├── tests/
│   ├── fixtures.ts           # Custom Playwright test runner and fixture injection
│   ├── a11y.spec.ts          # WCAG 2.1 AA and keyboard navigation test suite
│   ├── auth.spec.ts          # Header login modal verification suite
│   ├── localization.spec.ts  # Language switcher and routing test suite
│   ├── newsletter.spec.ts    # Morning newsletter subscription test suite
│   ├── no-js.spec.ts         # JavaScript-disabled degradation test suite
│   └── pom/                  # Encapsulated Page Object Model components
│       ├── article.ts        # Article reader view component
│       ├── auth-modal.ts     # Authentication modal dialog component
│       ├── feed.ts           # Main portal news feed component
│       ├── lang-menu.ts      # Header language menu component
│       └── newsletter.ts     # Newsletter subscription widget component
├── lefthook.yml              # Local Git hook configurations
├── package.json              # Project manifest, dependencies, and scripts
└── playwright.config.ts      # Playwright configuration (Kyiv timezone, uk-UA)
```

## Legal Notice

This project is an independent open-source testing suite. It is not affiliated
with, endorsed by, or sponsored by Ukrainska Pravda or LLC "UP Media Plus".
All trademarks, service marks, logos, brand names, and publication content
belong to their respective owners.

[badge-ci]: https://img.shields.io/github/actions/workflow/status/illia-m-b/ukrainska-pravda-qa-suite/playwright.yml?label=CI
[badge-firefox]: https://img.shields.io/badge/Firefox-FF7139?logo=firefoxbrowser&logoColor=white
[badge-license]: https://img.shields.io/badge/license-MIT-brightgreen.svg
[badge-node]: https://img.shields.io/badge/Node.js-24.x-3c873a
[badge-playwright]: https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white
[badge-pnpm]: https://img.shields.io/badge/pnpm-12.x-f69220
[badge-reuse]: https://img.shields.io/badge/REUSE-compliant-blue
[badge-typescript]: https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white
[firefox-url]: https://www.mozilla.org/en-US/firefox/new/
[license-url]: https://github.com/illia-m-b/ukrainska-pravda-qa-suite/blob/main/LICENSE.txt
[node-url]: https://nodejs.org/
[playwright-url]: https://playwright.dev/
[pnpm-url]: https://pnpm.io/
[portal]: https://www.pravda.com.ua
[reuse-url]: https://reuse.software/
[typescript-url]: https://www.typescriptlang.org/
[workflow-ci]: https://github.com/illia-m-b/ukrainska-pravda-qa-suite/actions/workflows/playwright.yml
