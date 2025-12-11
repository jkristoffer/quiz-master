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

  test('should handle timeout: Auto-fail when time runs out', async ({ page }) => {
    // 1. Start Quiz (Level 1)
    // IMPORTANT: Level 1 duration is 10s. We need to wait for it.
    await page.goto('/');
    await page.getByText('Level 1', { exact: true }).click();
    await expect(page).toHaveURL(/\/quiz\/1/);

    // 2. Wait for Timeout (10s + buffer)
    // We can use page.waitForTimeout or just expect with long timeout.
    // Let's rely on the text changing to "0s" or the modal appearing.
    // Ideally, we'd mock the timer, but for e2e let's just wait 11s.
    // It's a bit slow but reliable for "visual" / real-time testing.
    // Use test.setTimeout to ensure test doesn't fail before logic triggers.
    test.setTimeout(30000);

    // Expect "Time's Up!" modal text or similar failure message.
    // The implementation plan says message: "Time's Up!"
    // We will wait up to 15s for this.
    await expect(page.getByText("Time's Up!")).toBeVisible({ timeout: 15000 });

    // 3. Verify Modal Button allows next question
    await expect(page.getByTestId('modal-next-button')).toBeVisible();
    await page.getByTestId('modal-next-button').click();

    // 4. Verify moved to Q2
    await expect(page).toHaveURL(/\/quiz\/2/);
  });
});
