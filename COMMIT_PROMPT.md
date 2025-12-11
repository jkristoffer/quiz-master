# AI Commit & Milestone Prompt

**Instructions for the AI:**
Use this prompt to generate a structured commit message and documentation update when I ask for a "Checkpoint" or "Milestone".

1. **Analyze Changes**: Run `git status` and `git diff` (or read recent changes).
2. **Contextualize**: Compare changes against `task.md` and `PRD.md`.
3. **Generate Output**:
   - **Title**: Conventional Commit format (e.g., `feat:`, `fix:`, `chore:`, `docs:`).
   - **Summary**: 1-2 sentences explaining _why_ this change happened.
   - **Changes**: Bulleted list of technical changes.
   - **Milestone Check**:
     - If a defined Phase in `task.md` was completed (all items checked), suggest a **Tag** (e.g., `v0.1.0-phase1`).
     - If partial work, note "Work in Progress".

## Example Output Format

```text
feat(ui): implement ScreenWrapper and Theme

Introduced the core "Universal" layout component and global color system to satisfy Phase 1 requirements.

- Added `components/ScreenWrapper.tsx` (SafeArea + Web Constraints)
- Added `constants/Colors.ts` (Primary, Background, Text)
- Updated `app/_layout.tsx` to load 'Fredoka' fonts
- Initialized `app/index.tsx` as Home placeholder

🚀 **Milestone Reached**: Phase 1 (Foundation)
Suggested Command:
git add .
git commit -m "feat(ui): implement ScreenWrapper and Theme"
git tag -a v0.1.0-phase1 -m "Phase 1 Complete: Foundation"
```
