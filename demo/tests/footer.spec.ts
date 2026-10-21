import { test, expect } from '@playwright/test';

// The Footer on every page, and the BottomBar only where a page asks for it.

const WITH_BAR = ['/work', '/work/field-notes', '/components'];
const WITHOUT_BAR = ['/', '/about', '/forms', '/agents'];

test('every page ends with the footer, listing the site’s pages', async ({ page }) => {
  for (const path of [...WITH_BAR, ...WITHOUT_BAR]) {
    await page.goto(path);
    const footer = page.getByRole('contentinfo');
    await expect(footer, path).toContainText('Swiss Minimal');
    const nav = footer.getByRole('navigation', { name: 'Footer' });
    await expect(nav.getByRole('link', { name: 'About' }), path).toHaveAttribute('href', '/about');
    await expect(nav.getByRole('link', { name: 'Contact' }), path).toHaveAttribute('href', '#contact');
  }
});

test('the footer marks the page you are on', async ({ page }) => {
  await page.goto('/about');
  const nav = page.getByRole('contentinfo').getByRole('navigation', { name: 'Footer' });
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
  await expect(nav.getByRole('link', { name: 'Forms' })).not.toHaveAttribute('aria-current', 'page');
});

test('the footer stacks on a phone and splits in two from 768px', async ({ page }) => {
  const columns = () =>
    page
      .locator('[data-panel-page] > .page > .site-footer .site-footer-inner')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/about');
  expect(await columns()).toBe(1);
  await page.setViewportSize({ width: 1024, height: 800 });
  expect(await columns()).toBe(2);
});

for (const path of WITHOUT_BAR) {
  test(`${path} has no bottom bar and keeps no space for one`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('.bottom-bar')).toHaveCount(0);
    const padding = await page.locator('[data-panel-page]').evaluate((el) => getComputedStyle(el).paddingBottom);
    expect(padding).toBe('0px');
  });
}

test('the bottom bar is a region named by its h2', async ({ page }) => {
  await page.goto('/work');
  const bar = page.getByRole('region', { name: 'Bottom bar' });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole('heading', { level: 2, name: 'Bottom bar' })).toBeVisible();
});

for (const path of WITH_BAR) {
  test(`${path} shows the bottom bar, and the footer ends above it`, async ({ page }) => {
    await page.goto(path);
    const bar = page.locator('.bottom-bar');
    await expect(bar).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const footer = await page.getByRole('contentinfo').boundingBox();
    const barBox = await bar.boundingBox();
    expect(Math.round(footer!.y + footer!.height)).toBeLessThanOrEqual(Math.round(barBox!.y));
  });
}
