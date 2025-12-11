import { test, expect } from '@playwright/test';

test.describe('Quiz Logic', () => {
  test('should enforce single attempt: Wrong answer moves to Next Question', async ({ page }) => {
    // 1. Start Quiz
    await page.goto('/');
    await page.getByText('Level 1', { exact: true }).click();
    await expect(page).toHaveURL(/\/quiz\/1/);

    // 2. Answer Q1 Incorrectly
    // Q1: "The next shape in the sequence..." (True/False). Correct is True.
    // We select 'False'.
    await page.getByText('False').click();

    // 3. Verify Feedback Modal for Failure
    await expect(page.getByText('Oops! Try again.')).toBeVisible();

    // 4. Click "NEXT LEVEL" (orphaned text for now) or "TRY AGAIN" (current text)
    // The implementation plan says we will change "TRY AGAIN" to "NEXT QUESTION".
    // Currently, it says "TRY AGAIN".
    // We want to verify that clicking this button moves us to Q2,
    // NOT staying on Q1 to retry.

    // Current behavior: Click "TRY AGAIN" -> Modal closes, Timer restarts, Still on Q1.
    // Desired behavior: Click "NEXT QUESTION" -> Moves to Q2.

    // For TDD, let's target the button testID which is stable: 'modal-next-button'
    await page.getByTestId('modal-next-button').click();

    // 5. Expectation: Moved to Q2
    await expect(page).toHaveURL(/\/quiz\/2/);
    await expect(page.getByText('Question 2')).toBeVisible();
  });
});
