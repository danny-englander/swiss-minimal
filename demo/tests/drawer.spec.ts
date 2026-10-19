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

test('the drawer reaches down to the bottom bar, like the menu', async ({ page }) => {
  await page.goto('/about');
  await page.locator('[data-drawer-button]').click();
  const drawer = page.locator('section[data-drawer]');
  await expect(drawer).toHaveAttribute('data-open', 'true');
  const drawerBox = await drawer.boundingBox();
  const barBox = await page.locator('[data-jump-bar]').boundingBox();
  expect(Math.round(drawerBox!.y + drawerBox!.height)).toBe(Math.round(barBox!.y));
});

test('each recent row links out to Bluesky, Instagram and YouTube', async ({ page }) => {
  await page.goto('/about');
  await page.locator('[data-drawer-button]').click();
  const row = page.locator('[data-drawer-list] .drawer-item').first();
  await expect(row.getByRole('link', { name: 'Share on Bluesky: About (opens in a new tab)' })).toBeVisible();
  await expect(row.getByRole('link', { name: 'Search on Instagram: About (opens in a new tab)' })).toHaveAttribute(
    'href',
    'https://www.instagram.com/explore/tags/about/',
  );
  await expect(row.getByRole('link', { name: 'Search on YouTube: About (opens in a new tab)' })).toHaveAttribute(
    'href',
    'https://www.youtube.com/results?search_query=About',
  );
});

test('tabbing past the last row closes the drawer, so focus is never hidden behind it', async ({ page }) => {
  await page.goto('/about');
  await page.locator('[data-drawer-button]').click();
  const drawer = page.locator('section[data-drawer]');
  await expect(drawer).toHaveAttribute('data-open', 'true');
  await drawer.locator('.icon-btn--remove').last().focus();
  await page.keyboard.press('Tab');
  await expect(drawer).toHaveAttribute('data-open', 'false');
});
