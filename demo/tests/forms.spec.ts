import { test, expect } from '@playwright/test';

// The kit's form controls (switch, radio, select) and the page title, on the demo's Forms page.

test('switches toggle from the keyboard and say on or off', async ({ page }) => {
  await page.goto('/forms');
  const digest = page.getByRole('switch', { name: 'Send a monthly digest' });
  await expect(digest).not.toBeChecked();
  await digest.focus();
  await page.keyboard.press('Space');
  await expect(digest).toBeChecked();
  await expect(page.getByRole('switch', { name: 'Try new features early (closed)' })).toBeDisabled();
});

test('radios move with the arrow keys and skip a disabled option', async ({ page }) => {
  await page.goto('/forms');
  const group = page.getByRole('group', { name: 'How often' });
  await group.getByRole('radio', { name: 'Once a week' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(group.getByRole('radio', { name: 'Once a month' })).toBeChecked();
  await page.keyboard.press('ArrowDown');
  // "Every hour" is disabled, so the choice wraps to the first option.
  await expect(group.getByRole('radio', { name: 'Every day' })).toBeChecked();
});

test('the select picks an option by its label', async ({ page }) => {
  await page.goto('/forms');
  // The Contact tab in the panel has a Topic select too.
  const topic = page.getByRole('region', { name: 'Details' }).getByLabel('Topic');
  await topic.selectOption({ label: 'Tools' });
  await expect(topic).toHaveValue('Tools');
});

test('the page title is the one h1 and never scrolls the page sideways on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ['/forms', '/work']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.page-title h1')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBe(0);
  }
});
