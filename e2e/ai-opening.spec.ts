import { test, expect } from '@playwright/test';

test('AI opening move happens once (no double move)', async ({ page }) => {
  await page.goto('/game');

  await page.getByTestId('mode-ai').click();
  await page.getByTestId('you-first').uncheck(); // AI is Red, opens

  // Wait for AI turn to complete: status should flip to Yellow (your turn)
  await expect(page.getByTestId('status')).toContainText(/Yellow/i);

  // Now play one human move and ensure it flips back to Red (AI)
  await page.getByTestId('col-3').click();
  await expect(page.getByTestId('status')).toContainText(/Red/i);
});
