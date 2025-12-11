import { test, expect } from '@playwright/test';

test.describe('Core Game Loop', () => {
  test('Critical Path: Play Level 1 and Unlock Level 2', async ({ page }) => {
    // 1. Load Home
    await page.goto('/');
    await expect(page.getByText('BrainSpark')).toBeVisible();

    // 2. Click Level 1
    await page.getByText('Level 1', { exact: true }).click();

    // Verify we are on the quiz page
    // Note: Expo Router URLs might handle trailing slashes differently, so regex is safer
    await expect(page).toHaveURL(/\/quiz\/1/);
    await expect(page.getByText('Question 1', { exact: true })).toBeVisible();

    // 3. Answer Correctly (Level 1 is True/False, Correct: True)
    // "The next shape in the pattern..." -> True
    await page.getByText('True', { exact: true }).click();

    // 4. Verify Success Modal
    await expect(page.getByText('SUCCESS!', { exact: true })).toBeVisible();

    // 5. Click Next Level
    await page.getByText('NEXT LEVEL', { exact: true }).click();

    // 6. Verify automated navigation to Level 2
    await expect(page).toHaveURL(/\/quiz\/2/);
    await expect(page.getByText('Question 2', { exact: true })).toBeVisible();
  });

  test('Persistence: Progress is saved after reload', async ({ page }) => {
    // 1. Complete Level 1 to establish state
    await page.goto('/');
    await page.getByText('Level 1', { exact: true }).click();
    await page.getByText('True', { exact: true }).click();
    await page.getByText('NEXT LEVEL', { exact: true }).click();
    await expect(page.getByText('Question 2', { exact: true })).toBeVisible();

    // 2. Return to Home and Reload
    await page.goto('/');
    await page.reload();

    // 3. Verify Level 2 is still unlocked by clicking it
    // If it was locked, it would be disabled or visually distinct (handled by component logic)
    // But primarily, clicking it should navigate us to /quiz/2
    await page.getByText('Level 2', { exact: true }).click();

    await expect(page).toHaveURL(/\/quiz\/2/);
    await expect(page.getByText('Question 2', { exact: true })).toBeVisible();
  });
});
