---
description: Analyze changes, assume the 'git' identity, and commit progress with a structured message.
---

1. Check the current git status.
   // turbo
   `git status`

2. If there are changes, view the diff to understand context.
   // turbo
   `git diff`

3. Formulate a commit message based on:
   - Type: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`
   - Scope: The file or feature area changed (e.g., `ui`, `auth`, `api`)
   - Description: Concise summary of the change
   
   *Example: `feat(ui): add ScreenWrapper component`*

4. Present the proposed commit message and specific files to be added to the user.

5. Ask the user: "Do you want to create a Milestone Tag for this commit?" (e.g., `v0.1-alpha`).

6. Run the git commands upon approval.
   `git add .`
   `git commit -m "your message"`
   `git tag -a vX.X -m "Milestone: ..."` (if requested)
