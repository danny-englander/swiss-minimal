import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// The demo's gear switcher for previewing accents (demo only, not part of the kit).

test('the gear switches the accent and remembers it', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  // The page names its accent, vermilion by default.
  await expect(html).toHaveAttribute('data-accent', 'vermilion');

  const gear = page.getByRole('button', { name: 'Change accent color' });
  await gear.click();
  await expect(gear).toHaveAttribute('aria-expanded', 'true');
  // Focus goes to the chosen option.
  await expect(page.getByRole('button', { name: 'Vermilion', pressed: true })).toBeFocused();

  await page.getByRole('button', { name: 'Verdigris' }).click();
  await expect(html).toHaveAttribute('data-accent', 'verdigris');
  await expect(page.getByRole('button', { name: 'Verdigris', pressed: true })).toBeVisible();

  // Escape closes it and gives focus back to the gear.
  await page.keyboard.press('Escape');
  await expect(gear).toHaveAttribute('aria-expanded', 'false');
  await expect(gear).toBeFocused();

  // Remembered on another page, applied before the page's own scripts run.
  await page.goto('/work');
  await expect(html).toHaveAttribute('data-accent', 'verdigris');

  // Back to vermilion, and remembered too.
  await gear.click();
  await page.getByRole('button', { name: 'Vermilion' }).click();
  await expect(html).toHaveAttribute('data-accent', 'vermilion');
  await page.goto('/about');
  await expect(html).toHaveAttribute('data-accent', 'vermilion');
});

for (const theme of ['light', 'dark'] as const) {
  test(`the open switcher has no violations, ${theme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/');
    await page.getByRole('button', { name: 'Change accent color' }).click();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}
