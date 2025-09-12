import { test, expect } from '@playwright/test';

test('AI opening move happens once (no double move)', async ({ page }) => {
  await page.goto('/game');

  // Switch to vs Computer, AI (Red) opens
  await page.getByTestId('mode-ai').click();
  await page.getByTestId('you-first').uncheck();

  // Stable outcome of opening: your turn + exactly 1 chip on the board
  await expect(page.getByTestId('status')).toContainText(/Yellow/i);
  // Count cells whose accessible name is "red" or "yellow"
  const chips = page.getByRole('gridcell', { name: /(red|yellow)/i });
  await expect(chips).toHaveCount(1); // after AI opening
  await expect(page.getByTestId('move-count')).toHaveText('1'); // opening done

  // You play in column 4 (accessible name from your buttons)
  await page.getByRole('button', { name: 'Drop in column 4' }).click();

  // Stable outcome after your move: AI replies once → total chips = 3, and back to your turn
  await expect(chips).toHaveCount(3); // after you play + AI reply
  await expect(page.getByTestId('move-count')).toHaveText('3'); // no double move

  await expect(page.getByTestId('status')).toContainText(/Yellow/i);
});
