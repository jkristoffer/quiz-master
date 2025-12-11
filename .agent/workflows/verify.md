---
description: Run full project verification (Types, Lint, Format, Tests)
---

# Verification Workflow

1. **Type Check**
   Ensure strict type safety across the project.
   // turbo
   `npm run type-check`

2. **Linting**
   Check for code quality and standard conformance.
   // turbo
   `npm run lint`

3. **Formatting**
   Verify code style consistency.
   // turbo
   `npm run format:check`

4. **Unit Tests**
   Run the test suite.
   // turbo
   `npm test -- --passWithNoTests`
