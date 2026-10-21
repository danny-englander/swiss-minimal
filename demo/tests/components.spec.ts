import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// The demo's Components page: the chips, the accordions, the dialog, the toast and the phone width.

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

test('the dialog opens modal on Cancel, and Escape brings focus back', async ({ page }) => {
  await page.goto('/components');
  const opener = page.getByRole('button', { name: 'Delete export…' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Delete this export?' });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => el.matches(':modal'))).toBe(true);
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('a dialog button closes it and returns its value', async ({ page }) => {
  await page.goto('/components');
  await page.getByRole('button', { name: 'Delete export…' }).click();
  const dialog = page.getByRole('dialog', { name: 'Delete this export?' });
  await dialog.getByRole('button', { name: 'Delete' }).click();
  await expect(dialog).toBeHidden();
  expect(await page.locator('#cmp-dialog').evaluate((el: HTMLDialogElement) => el.returnValue)).toBe('delete');
  await expect(page.locator('[data-toast]')).toContainText('Export deleted.');
});

test('a click outside the dialog closes it', async ({ page }) => {
  await page.goto('/components');
  await page.getByRole('button', { name: 'Delete export…' }).click();
  const dialog = page.getByRole('dialog', { name: 'Delete this export?' });
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialog).toBeHidden();
});

for (const theme of ['light', 'dark'] as const) {
  test(`the open dialog has no violations, ${theme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/components');
    await page.getByRole('button', { name: 'Delete export…' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))));
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}

test('the page never scrolls sideways on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/components');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBe(0);
});
