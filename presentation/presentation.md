---
author: Illia Brashkin
date: 11/10/26
lang: en-US
subtitle: Methods for Ensuring the Quality of Software Systems
title: Ukrainska Pravda QA Suite
---

## Introduction & Requirements Specification

> "Quality is meeting user and business needs, not merely the absence of bugs"
> (ISO/IEC 25010)

---

### Research Object & Project Scope

:::::::::::::: {.columns}
::: {.column width="50%"}

**Testing Target:**

- Client-side of the leading Ukrainian news
  portal [pravda.com.ua](https://www.pravda.com.ua/).
- Evaluated directly on the live production environment (_Shift-Right_).

:::
::: {.column width="50%"}

**Project Objectives:**

- Execute the full QA lifecycle: from SRS to CI/CD.
- Apply formal test design, usability heuristics (SUS), and Playwright
  automation.

:::
::::::::::::::

---

### Standards & Quality Attributes

ISO/IEC/IEEE 29148:2018
: Standard for software requirements specification (SRS) architecture.

ISO/IEC 25010
: Product quality model covering functional suitability, reliability,
compatibility, and usability.

Ukrainian Language Legislation
: Compliance with Art. 27, Part 6 regarding default state language loading.

---

### Testing Scope: Functional (SRS)

- **REQ-F-01 (Localization):** Default Ukrainian locale routing and manual
  `/rus/`, `/eng/` switching.
- **REQ-F-02 (Authentication):** Modal `#authModal` login lifecycle, field
  validation, anti-enumeration security, and CSRF token verification.
- **REQ-F-03 (Newsletter):** Email format validation across newsletter
  subscription entry points.

---

### Testing Scope: Non-Functional (ISO/IEC 25010)

- **REQ-NF-01 (Reliability):** _Graceful Degradation_ — core article
  accessibility and navigation when JavaScript is completely disabled.
- **REQ-NF-02 (Compatibility):** Dark theme rendering resilience and third-party
  password manager autofill support (Proton Pass, Bitwarden).
- **REQ-NF-03 (Usability / A11y):** Keyboard-only navigation conforming to WCAG
  2.1.

## Test Strategy & Planning

$$
\begin{gathered}
\text{System Testing} \\
= \\
\text{Shift-Right (Production)} \\ + \\
\text{Playwright Automation}
\end{gathered}
$$

---

### Strategy: Shift-Right in Production

| Parameter         | Specification in Project         |
| :---------------- | :------------------------------- |
| **Test Level**    | System Testing (End-to-End)      |
| **Approach**      | Reactive production testing      |
| **Base**          | GNU/Linux, Mozilla Firefox       |
| **E2E Framework** | Playwright (TypeScript, Node.js) |

---

### Entry & Exit Criteria

- **Entry Criteria:** Baseline SRS finalized, sanitized test datasets prepared,
  and target portal availability verified.
- **Exit Criteria:** 100% planned test-case execution, bidirectional RTM
  coverage, zero open Blocker/Critical defects, and a green automated regression
  run.

## Test Design & Documentation

---

### Verification Checklist

> Structured high-level instrument designed for rapid smoke and regression
> validation.

- Checks categorized across functional and non-functional
  subsystems.
- Strict separation of execution methods: _Manual_ vs. _Playwright Automation_.
- Comprehensive coverage of Happy Path, negative inputs, and boundary states.

---

### Test Design Techniques

Equivalence Partitioning
: Partitioning input data into valid email domains and invalid formats (missing
`@`, omitted TLD).

Boundary Value Analysis
: Evaluating empty string boundaries (`length=0`) and native HTML5 `required`
constraints.

State Transition Testing
: Validating language menu states, active classes, and URL routing under
`.lang_menu` transitions.

---

### Requirements Traceability Matrix

```text
[ Requirements ] ──► [ Test Cases ] ──► [ Playwright ]
REQ-F-01              TC-LOC-01..04      localization.spec.ts
REQ-F-02              TC-AUTH-01..05     auth.spec.ts
REQ-F-03              TC-SUB-01..03      newsletter.spec.ts
REQ-NF-01             TC-NF-01..02       no-js.spec.ts
REQ-NF-02..03         TC-NF-03..06       a11y.spec.ts
```

_Guarantees 100% bidirectional traceability between specification and tests._

## Usability Testing (ISO 9241-11)

> "Evaluating ergonomic interaction through effectiveness, efficiency, and
> satisfaction"

---

### Participant Sampling & Methodology

- **Sample Group (5 respondents) based on SRS archetypes:**
  - _Standard Users (U1, U2):_ Mouse/trackpad interaction, general news
    consumption.
  - _Tech-Savvy Users (U3, U4, U5):_ Linux, Firefox, dark mode, password
    managers, keyboard shortcuts.
- **Methodology:** Moderated _Think-Aloud Protocol_ across 4 real-world user
  scenarios.

---

### Task Execution Metrics

| Task   | Scenario Summary                       | Time | Completion |
| :----- | :------------------------------------- | :--: | :--------: |
| **T1** | Switch to English and return           | 5.8  |    100%    |
| **T2** | Login attempt & autofill check         | 16.4 |    100%    |
| **T3** | Subscribe in dark mode                 | 11.6 |    100%    |
| **T4** | Mouse-free modal login (`Tab`/`Enter`) | 47.0 |   **0%**   |

---

### System Usability Scale Benchmark

$$
\text{SUS} = 2.5 \times \left(
  \sum (Q_{\text{odd}} - 1) + \sum (5 - Q_{\text{even}})
\right)
$$

- **Mean Score $\overline{\text{SUS}}$:** **77.0 / 100** (**Grade B+ / Good**,
  outperforming the 68.0 industry median).
- **Cohort Divergence:**
  - _Standard Users (Mouse):_ **88.75 / 100** (Grade A, _Excellent_).
  - _Power Users (Keyboard):_ **69.17 / 100** (Grade C+).

---

### Critical Accessibility Blocker

:::::::::::::: {.columns}
::: {.column width="50%"}

#### Actual DOM Markup

```html
<a class="user_link login_modal"></a>
```

Anchor tags without href receive implicit `tabindex="-1"` and are skipped during
Tab traversal!

:::
::: {.column width="50%"}

#### Solution

```html
<button
  type="button"
  class="user_link login_modal"
  aria-label="Sign In"
></button>
```

Or explicitly specify `tabindex="0"` and `role="button"`

:::
::::::::::::::

## Automated Testing (Playwright)

---

### Page Object Model (POM) Architecture

- Pure factory functions and POJOs over heavy classes.
- Complete locator encapsulation through lexical closures.
- Strict TypeScript interfaces with zero leaky internal state.

---

### Core Automation Principles

Web-First Assertions
: Native auto-waiting: `await expect(locator).toBeVisible()`.

BrowserContext Isolation
: Hermetic test environments with pristine cache, cookies, and local storage per
test run.

Graceful Degradation
: Verifying functional resiliency without JavaScript via
`javaScriptEnabled: false`.

---

### Test Execution & Repository

[`illia-m-b/ukrainska-pravda-qa-suite`][repo]

```text
$ playwright test

Running 20 tests using 1 worker
  ...
  20 passed (54.1s)
```

## Engineering Culture & CI/CD

---

### Code Quality & Static Analysis

- **ESLint:** Strict type checking (`@typescript-eslint/strict`),
  `eslint-plugin-playwright`, `security`, and `sonarjs`.
- **Git Hooks:** `lefthook` enforces type checks, linting, and formatting on
  pre-commit and pre-push.
- **Static Enforcement:** Multi-layer static analysis via `markdown-lint`,
  `codeql`, `reuse`, `yamllint`, `actionlint`, and `typos`.

---

### Automated CI/CD Pipeline

```text
[Push/PR] ─► [Lefthook] ─► [CI: Playwright]
                                 │ (on main)
[Pages: Report & Slides] ◄── [Release-Please]

```

- Automated semantic versioning and changelogs via `release-please`.
- Seamless static deployment of Playwright HTML Reports and Reveal.js slides to
  GitHub Pages.

## Summary & Key Takeaways

- **End-to-End QA Lifecycle:** Complete engineering alignment from IEEE/ISO
  requirements to CI/CD automation.
- **Robust Test Automation:** 20 production-tested Playwright E2E scenarios
  built on a functional POM architecture.
- **Practical Engineering Impact:** Detected and documented a critical keyboard
  accessibility blocker violating WCAG 2.1 Level AA.

[repo]: https://github.com/illia-m-b/ukrainska-pravda-qa-suite
