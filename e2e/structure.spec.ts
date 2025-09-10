import { test, expect } from '@playwright/test';

test('board renders with 7x6 grid and column overlays', async ({ page }) => {
  await page.goto('/game');

  const grid = page.getByRole('grid', { name: /connect four board/i });
  await expect(grid).toBeVisible();

  // 7 columns x 6 rows = 42 cells
  await expect(grid.getByRole('gridcell')).toHaveCount(42);

  // 7 column hit targets exist
  for (let c = 0; c < 7; c++) {
    await expect(page.getByTestId(`col-${c}`)).toBeVisible();
  }

  // status is live-region and starts at Red
  await expect(page.getByTestId('status')).toContainText(/Red/i);
});
