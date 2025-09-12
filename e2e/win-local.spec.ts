import { test, expect } from '@playwright/test';

test('local play: Red wins horizontally', async ({ page }) => {
  await page.goto('/game');

  // Sequence: R,Y,R,Y,R,Y,R across columns 0..3
  const click = (c: number) => page.getByTestId(`col-${c}`).click();
  await click(0);
  await click(0);
  await click(1);
  await click(1);
  await click(2);
  await click(2);
  await click(3);

  await expect(page.getByTestId('winner')).toHaveText(/Red wins!?/i);
  await expect(page.getByTestId('status')).toHaveCount(0);
});
