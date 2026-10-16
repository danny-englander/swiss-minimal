import { test, expect } from '@playwright/test';

// The icon row and the remove button reach 0.5rem past each side of a drawer row. Without the
// matching margin and padding on .drawer-list, the list was 8px wider than its scroll area and
// scrolled sideways on a phone (found in Dial Hopping).
test.describe('on a phone', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('the drawer list never scrolls sideways', async ({ page }) => {
    // Enough rows that the list scrolls, each with its icon row and remove button.
    await page.addInitScript(() => {
      const visits = Array.from({ length: 12 }, (_, i) => ({
        path: `/?v=${i}`,
        title: `Sample page ${i + 1}`,
        at: Date.now() - i * 3_600_000,
      }));
      localStorage.setItem('swiss-demo:recent', JSON.stringify(visits));
    });
    await page.goto('/about');
    await page.locator('[data-drawer-button]').click();
    await expect(page.locator('section[data-drawer]')).toHaveAttribute('data-open', 'true');

    const list = page.locator('[data-drawer-list]');
    await expect(list.locator('.icon-btn--remove').first()).toBeVisible();
    const { scrollWidth, clientWidth } = await list.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
