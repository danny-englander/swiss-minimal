import { test, expect } from '@playwright/test';

// The demo's Components page: the chips, the accordions, the toast and the phone width.

test('a chip presses alone, and the accordion says what it shows', async ({ page }) => {
  await page.goto('/components');
  const acc = page.locator('details.page-acc');
  await acc.locator('summary').click();
  const group = acc.getByRole('group', { name: 'Category' });
  await group.getByRole('button', { name: /Type/ }).click();
  await expect(group.getByRole('button', { name: /Type/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(group.getByRole('button', { name: /All/ })).toHaveAttribute('aria-pressed', 'false');
  await expect(acc.locator('[data-demo-status]')).toHaveText('Type · 1 item');
});

test('Show toast shows a toast', async ({ page }) => {
  await page.goto('/components');
  await page.getByRole('button', { name: 'Show toast' }).click();
  await expect(page.locator('[data-toast]')).toHaveText('Settings saved.');
  await expect(page.locator('[data-toast]')).toHaveAttribute('data-show', 'true');
});

test('the sample menu opens two levels deep', async ({ page }) => {
  await page.goto('/components');
  const menu = page.locator('[data-panel-page] .menu-list');
  await menu.getByText('Work', { exact: true }).click();
  await menu.getByText('Projects', { exact: true }).click();
  await expect(menu.getByRole('link', { name: 'Field notes' })).toBeVisible();
});

test('the page never scrolls sideways on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/components');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBe(0);
});
