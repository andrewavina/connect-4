import { test, expect } from '@playwright/test';

test('undo reverts last move; new game resets everything', async ({ page }) => {
  await page.goto('/game');

  await page.getByRole('button', { name: 'Drop in column 1' }).click();
  await expect(page.getByTestId('status')).toContainText(/Yellow/i);

  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByTestId('status')).toContainText(/Red/i);

  // play a quick mini-game then reset
  await page.getByRole('button', { name: 'Drop in column 1' }).click();
  await expect(page.getByTestId('status')).toContainText(/Yellow/i);
  await page.getByTestId('col-1').click();
  await page.getByTestId('new-game').click();
  await expect(page.getByTestId('status')).toContainText(/Red/i);
  await expect(page.getByTestId('winner')).toHaveCount(0);
});
