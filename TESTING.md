# Testing Guide

This project follows a "Lean E2E" testing strategy using [Playwright](https://playwright.dev/).

## 1. Unit Tests

Run unit tests with Jest:

```bash
npm test
```

_Scope: Individual functions and utilities._

## 2. E2E Tests (Web)

Run end-to-end tests with Playwright:

```bash
npm run test:e2e
```

_Scope: Critical user flows and persistence._

### Coverage

- **Critical Path:** Launches app, enters Level 1, answers correctly, verifies success modal, and navigation to Level 2.
- **Persistence:** Completes a level, reloads the page, and checks if the next level remains unlocked.

### Setup

If running for the first time:

```bash
npx playwright install --with-deps chromium
```

## 3. Manual Verification

For native-specific UI checks (iOS/Android), refer to `TEST_REPORT.md` for manual testing checklists.
