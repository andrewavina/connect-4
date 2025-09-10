import { test, expect } from '@playwright/test';

test('undo reverts last move; new game resets everything', async ({ page }) => {
  await page.goto('/game');

  await page.getByTestId('col-0').click();
  await expect(page.getByTestId('status')).toContainText(/Yellow/i);

  await page.getByTestId('undo').click();
  await expect(page.getByTestId('status')).toContainText(/Red/i);

  // play a quick mini-game then reset
  await page.getByTestId('col-0').click();
  await page.getByTestId('col-1').click();
  await page.getByTestId('new-game').click();
  await expect(page.getByTestId('status')).toContainText(/Red/i);
  await expect(page.getByTestId('winner')).toHaveCount(0);
});
