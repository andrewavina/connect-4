import { test, expect } from '@playwright/test';

test('keyboard: focus a column and press Enter to drop', async ({ page }) => {
  await page.goto('/game');

  const col2 = page.getByTestId('col-2');
  await col2.focus();

  // drop first chip via Enter
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('status')).toContainText(/Yellow/i);

  // drop next chip via clicking for sanity
  await page.getByTestId('col-2').click();
  await expect(page.getByTestId('status')).toContainText(/Red/i);
});
