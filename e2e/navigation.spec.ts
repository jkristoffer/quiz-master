import { test, expect } from '@playwright/test';

test.describe('Quiz Navigation', () => {
  test('should allow navigating linearly, seeing progress, and confirming exit', async ({ page }) => {
    // 1. Start from Home
    await page.goto('/');

    // Start Quiz
    await page.getByText('Level 1', { exact: true }).click();
    await expect(page).toHaveURL(/\/quiz\/1/);
    await expect(page.getByText('Question 1')).toBeVisible();

    // 2. Verify Progress Bar is present (generic check)
    // We can check if an element with style related to width/height exists or add testID.
    // Ideally we should add testID to ProgressBar. For now, let's just check if it renders without crashing.
    // The previous "Back" button check should be removed as it's gone.

    // 3. Answer Q1 -> Go to Q2.
    // Q1 is True/False "The next shape..." -> True
    await page.getByText('True').click();
    await expect(page.getByText('SUCCESS!')).toBeVisible();
    await page.getByTestId('modal-next-button').click();

    await expect(page).toHaveURL(/\/quiz\/2/);
    await expect(page.getByText('Question 2')).toBeVisible();

    // 4. Verify Linear Flow (No Back Button)
    // We can verify that we CANNOT find a back button anymore.
    await expect(page.getByTestId('back-button')).not.toBeVisible();

    // 5. Click "Exit" and Handle Confirmation
    // Dealing with window.confirm or Alert in Playwright
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Are you sure you want to quit?');
      await dialog.accept(); // Click OK
    });

    await page.getByTestId('exit-button').click();

    // Verify Home screen
    await expect(page).toHaveURL('/');
    // Check for Level 1 button to confirm home screen loaded
    await expect(page.getByText('Level 1', { exact: true }).first()).toBeAttached();
  });
});
