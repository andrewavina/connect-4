import { test, expect } from '@playwright/test';

test('local play drops discs and swaps turns', async ({ page }) => {
  await page.goto('http://localhost:3000/game');

  // initial status shows Red's turn
  await expect(page.getByTestId('status')).toContainText('Red');

  // click column 0
  await page.getByTestId('col-0').click();

  // turn should swap to Yellow
  await expect(page.getByTestId('status')).toContainText('Yellow');

  // click column 1
  await page.getByTestId('col-1').click();

  // back to Red
  await expect(page.getByTestId('status')).toContainText('Red');
});
