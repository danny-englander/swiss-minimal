import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Scans every page, the panel's tabs and the drawer for WCAG 2.1 AA problems, in both
// themes and both accents (contrast differs). Each failure lists the rule and the elements
// that broke it.

const THEMES = ['light', 'dark'] as const;
// The demo is red; teal is checked by setting <html data-accent="teal">, as a teal site would.
const ACCENTS = ['red', 'teal'] as const;
const PAGES = ['/', '/work', '/work/field-notes', '/about', '/forms'];
const TABS = ['menu', 'contact', 'features'];

/** Wait for any running CSS animation or transition to finish. */
async function settle(page: Page) {
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))));
}

async function scan(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const report = results.violations
    .map((v) => `[${v.impact}] ${v.id}: ${v.help}\n${v.nodes.map((n) => `    - ${n.target.join(' ')}`).join('\n')}`)
    .join('\n\n');
  expect(results.violations.length, report).toBe(0);
}

for (const accent of ACCENTS) {
  for (const theme of THEMES) {
    test.describe(`${accent} accent, ${theme} theme`, () => {
      test.use({ colorScheme: theme });

      /** Open a page in this accent. */
      async function open(page: Page, path: string) {
        await page.goto(path);
        if (accent !== 'red') await page.evaluate((a) => (document.documentElement.dataset.accent = a), accent);
      }

      for (const path of PAGES) {
        test(`${path} has no violations`, async ({ page }) => {
          await open(page, path);
          await settle(page);
          await scan(page);
        });
      }

      for (const tab of TABS) {
        test(`menu "${tab}" tab has no violations`, async ({ page }) => {
          // A returning visitor, so the "new" dot shows too.
          await page.addInitScript(() => localStorage.setItem('swiss-demo:features-seen', '2000-01-01'));
          await open(page, `/#${tab}`);
          await expect(page.locator(`#panel-${tab}`)).toBeVisible();
          await settle(page);
          await scan(page);
        });
      }

      test('drawer has no violations', async ({ page }) => {
        await open(page, '/about');
        await page.locator('[data-drawer-button]').click();
        await expect(page.locator('[data-drawer]')).toHaveAttribute('data-open', 'true');
        await settle(page);
        await scan(page);
      });

      test('favorites filter with a starred item has no violations', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('favorites', JSON.stringify(['on-grids'])));
        await open(page, '/work?category=favorites');
        await page.getByText('Filter by category').click();
        await settle(page);
        await scan(page);
      });
    });
  }
}
