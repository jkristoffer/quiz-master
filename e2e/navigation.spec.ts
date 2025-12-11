import { test, expect } from '@playwright/test';

test.describe('Quiz Navigation', () => {
  test('should allow navigating back and exiting', async ({ page }) => {
    // 1. Start from Home
    await page.goto('/');

    // Start Quiz
    await page.getByText('Level 1', { exact: true }).click();
    await expect(page).toHaveURL(/\/quiz\/1/);
    await expect(page.getByText('Question 1')).toBeVisible();

    // 2. Verify "Back" is NOT visible on Q1
    // We check for the absence of the back button using the testID.
    await expect(page.getByTestId('back-button')).not.toBeVisible();

    // Answer Q1 -> Go to Q2.
    // Q1 is True/False "The next shape..." -> True
    await page.getByText('True').click();
    await expect(page.getByText('SUCCESS!')).toBeVisible();
    await page.getByTestId('modal-next-button').click();

    await expect(page).toHaveURL(/\/quiz\/2/);
    await expect(page.getByText('Question 2')).toBeVisible();

    // 3. Click "Back"
    // The back button should be visible on Q2.
    await page.getByTestId('back-button').click();

    // Verify we are back at Q1
    await expect(page).toHaveURL(/\/quiz\/1/);
    await expect(page.getByText('Question 1')).toBeVisible();

    // 4. Click "Exit"
    await page.getByTestId('exit-button').click();

    // Verify Home screen
    await expect(page).toHaveURL('/');
    // Check for Level 1 button to confirm home screen loaded
    await expect(page.getByText('Level 1', { exact: true }).first()).toBeAttached();
  });
});
