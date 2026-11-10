<!--
SPDX-FileCopyrightText: 2026 Illia Brashkin
SPDX-License-Identifier: MIT
-->

# Security Policy

## Supported Versions

Security updates and critical patches are released exclusively for the latest
major version.

| Version                               |     Supported      |
| :------------------------------------ | :----------------: |
| 1.x <!-- x-release-please-major -->   | :white_check_mark: |
| < 1.x <!-- x-release-please-major --> |        :x:         |

## Reporting a Vulnerability

If you discover a security vulnerability, do not disclose
it publicly in an issue or pull request.

Please report vulnerabilities directly through GitHub:

1. Navigate to the repository [Security Advisories][security-advisories] tab.
2. Click **Report a vulnerability** to open a private advisory draft.
3. Provide a clear description, reproduction steps, and potential impact.

If you cannot submit via GitHub, send an encrypted report to the email address
specified in [`package.json`](package.json):

```bash
pnpm pkg get bugs.email
```

### Response Timeline

- **Initial Response**: Within 48 hours to confirm receipt and begin triage.
- **Triage & Assessment**: Within 5 business days with preliminary findings.
- **Resolution & Release**: Critical vulnerabilities patched and released via
  GitHub release within coordinated disclosure targets (typically 30–90 days).

## Proactive Security Controls

Ukrainska Pravda QA Suite implements defensive supply-chain controls:

- **Immutable Pinning**: All GitHub Actions are pinned to full commit SHAs with
  release tag comments. All Node dependencies are pinned to exact versions.
- **Dependency Quarantine**: Automated dependency upgrades enforced via
  Renovate include a mandatory 3-day release age threshold
  (`minimumReleaseAge: "3 days"`) to guard against compromised upstream
  packages.
- **Static Analysis (SAST)**: Automated CodeQL analysis scans GitHub Actions
  workflows.

[security-advisories]: https://github.com/illia-m-b/ukrainska-pravda-qa-suite/security/advisories/new
