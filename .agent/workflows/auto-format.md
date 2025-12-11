---
description: Automatically fix code style and linting issues
---

# Auto-Format Workflow

1. **Prettier Write**
   Format all files according to .prettierrc
   // turbo
   `npm run format`

2. **ESLint Fix**
   Attempt to automatically fix linting errors
   // turbo
   `ESLINT_USE_FLAT_CONFIG=false npx eslint . --fix`

3. **Verify Result**
   Run the verification suite to check if issues persist
   // turbo
   `npm run lint && npm run format:check`
