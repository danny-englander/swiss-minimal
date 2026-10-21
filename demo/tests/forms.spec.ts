import { test, expect } from '@playwright/test';

// The kit's form controls (switch, radio, select, date and time, file picker), the output panel,
// the summary list and the page title, on the demo's Forms page.

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

// The Export section: date and time fields, presets, the file picker, the output panel and the
// summary list.

/** YYYY-MM-DD in local time, as the page writes it. */
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

test('the date and time fields are the browser’s own inputs', async ({ page }) => {
  await page.goto('/forms');
  await expect(page.getByLabel('Start date')).toHaveAttribute('type', 'date');
  await expect(page.getByLabel('End date')).toHaveAttribute('type', 'date');
  await expect(page.getByLabel('Run at')).toHaveAttribute('type', 'time');
});

test('a preset fills both dates', async ({ page }) => {
  await page.goto('/forms');
  const now = new Date();
  await page.getByRole('group', { name: 'Date presets' }).getByRole('button', { name: '1st–15th' }).click();
  await expect(page.getByLabel('Start date')).toHaveValue(iso(new Date(now.getFullYear(), now.getMonth(), 1)));
  await expect(page.getByLabel('End date')).toHaveValue(iso(new Date(now.getFullYear(), now.getMonth(), 15)));
  await page.getByRole('button', { name: 'Last month' }).click();
  await expect(page.getByLabel('Start date')).toHaveValue(iso(new Date(now.getFullYear(), now.getMonth() - 1, 1)));
  await expect(page.getByLabel('End date')).toHaveValue(iso(new Date(now.getFullYear(), now.getMonth(), 0)));
});

test('the file picker shows the chosen file, and says it in its name', async ({ page }) => {
  await page.goto('/forms');
  const input = page.locator('#export-file');
  await expect(page.locator('#export-file-name')).toHaveText('No file chosen');
  await input.setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('Notes') });
  await expect(page.locator('#export-file-name')).toHaveText('notes.txt');
  await expect(input).toHaveAccessibleName('Attachment notes.txt');
});

test('Start streams the output, then fills the summary', async ({ page }) => {
  await page.goto('/forms');
  await page.getByRole('button', { name: 'This month' }).click();
  await page.locator('#export-file').setInputFiles({ name: 'cover.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('jpg') });
  await page.getByRole('button', { name: 'Start', exact: true }).click();

  const output = page.getByRole('region', { name: 'Output' });
  await expect(output.getByRole('status')).toHaveText('Finished');
  await expect(output.locator('[data-output-log]')).toContainText('Saved exports/');
  await expect(output.locator('[data-output-log]')).toContainText('Attached cover.jpg');
  const summary = page.getByRole('region', { name: 'Summary' });
  await expect(summary).toContainText('Done. Saved 8 files');
  await expect(summary).toContainText('cover.jpg, added to the export.');
});

test('Start needs both dates', async ({ page }) => {
  await page.goto('/forms');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Output' }).getByRole('status')).toHaveText('Not started');
  expect(await page.getByLabel('Start date').evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
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
