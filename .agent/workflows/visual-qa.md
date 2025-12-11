---
description: Run end-to-end visual verification using the browser subagent
---

# Visual QA Workflow

1. **Verify Server Status**
   Ensure the local development server is running.
   If not running, execute: `npx expo start --web`

2. **Run Browser Smoke Test**
   Call the `browser_subagent` with the following task:

   "Navigate to http://localhost:8081.
   1. **Home Verification**: Check for the 'BrainSpark' title and 'Start Quiz' button. Take a screenshot named 'home_screen'.
   2. **Flow Verification**: Click 'Start Quiz'. Verify the Level Selection screen appears. Take a screenshot named 'level_select'.
   3. **Gameplay Verification**: Click 'Level 1'. Verify a Question Card appears. Click the first option. Verify the progress bar logic or feedback appears.
   4. **Completion**: Answer all questions blindly (clicking first option) until the quiz finishes or for at least 3 questions.
   5. Return a summary of the flow."

3. **Report Results**
   Summarize the findings to the user.
