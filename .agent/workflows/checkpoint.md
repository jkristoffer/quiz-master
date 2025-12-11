---
description: Analyze changes, assume the 'git' identity, and commit progress with a structured message.
---

1. Run Verification
   Ensure code integrity before committing.
   // turbo
   `npm run lint && npm run format:check && npm test -- --passWithNoTests`

2. Check the current git status.
   // turbo
   `git status`

3. If there are changes, view the diff to understand context.
   // turbo
   `git diff`

4. Formulate a commit message based on:
   - Type: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`
   - Scope: The file or feature area changed (e.g., `ui`, `auth`, `api`)
   - Description: Concise summary of the change

   _Example: `feat(ui): add ScreenWrapper component`_

5. Present the proposed commit message and specific files to be added to the user.

6. Ask the user: "Do you want to create a Milestone Tag for this commit?" (e.g., `v0.1-alpha`).

7. Run the git commands upon approval.
   `git add .`
   `git commit -m "your message"`
   `git tag -a vX.X -m "Milestone: ..."` (if requested)
