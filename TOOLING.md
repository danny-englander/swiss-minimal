# Tooling recipes

Two setups that came from Dial Hopping and suit any site built on this kit: accessibility tests that run against the built site, and a release script that tags each release with the date. These are recipes to copy, not kit code.

## Accessibility tests: Playwright and axe

[Playwright](https://playwright.dev) drives a real browser; [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm) scans each page it opens for WCAG problems. The demo has a working copy: `demo/playwright.config.ts` and `demo/tests/a11y.spec.ts`.

### Set up

```bash
npm install --save-dev @playwright/test @axe-core/playwright
npx playwright install chromium
```

Add `"test": "playwright test"` to `package.json` scripts, and `test-results/` and `playwright-report/` to `.gitignore`.

### The config, and why

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:4327',
    reducedMotion: 'reduce',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx astro build && npx astro preview --port 4327 --ignore-lock',
    url: 'http://localhost:4327',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- **Test the built site, not the dev server.** Visitors get the build. The dev server can also reload the page once while it warms up, which breaks a test mid-run.
- **Reduce Motion on.** The kit turns its slides and fades off for this setting, so a scan never catches a panel halfway down or text mid-fade (which axe reads as low contrast).
- **A port of its own** (4327 here), so the tests never meet a dev server on 4321. `--ignore-lock` lets the preview run while a dev server holds Astro's lock.
- `reuseExistingServer` saves a rebuild locally, but it will happily reuse a stale preview left running from an earlier run. If a fix doesn't seem to take, stop whatever is on the port and run again.

### What to scan

A one-page site has few URLs but many states. Scan each one that changes what is on screen, in **both themes** (contrast differs):

- every page;
- each tab of the panel (open it with its deep link, `/#contact`, or a click);
- the drawer, open;
- a filtered list, and the Favorites filter with something starred (`page.addInitScript` to put it in localStorage first);
- the active row, if it changes colors;
- the "new" dot, by marking the visitor as returning in `addInitScript`.

```ts
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

for (const theme of ['light', 'dark'] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme });
    test('home has no violations', async ({ page }) => {
      await page.goto('/');
      await settle(page);
      await scan(page);
    });
  });
}
```

The report lists each rule that failed and the elements that broke it, so a failure says what to fix.

### Beyond axe

axe finds missing names, bad contrast and broken ARIA. It can't tell whether things *work*. Dial Hopping also has short behavior tests worth copying for any site that uses these components:

- **Keyboard:** Tab reaches every panel tab; arrows, Home and End move; Escape closes; focus goes back to the button.
- **Jump to current:** scroll the current row away and the button appears; filter it out and the button clears the filter and focuses the row.
- **Favorites:** a star tap doesn't trigger the row; the Favorites filter shows only starred items; it survives a reload.
- **"New" dot:** none on a first visit; shown for a returning one; gone after the tab is opened.

Write them with Playwright's role locators (`page.getByRole('tab', { name: /Contact/ })`), so a test also proves the accessible name is right.

## Releases: date tags and notes from the features list

Dial Hopping's `npm run release` (`scripts/release.ts`) turns "push to main" into a named release with notes, in one step. It fits any site whose host builds on every push (Netlify, Vercel, Cloudflare Pages), where every push already is a release.

### What it does

1. Checks it is on a clean main that is up to date with `origin`.
2. Picks the tag: `v` plus today's date, `v2026.10.16`, or `v2026.10.16.2` for a second release that day. Dates sort, say when, and need no version-number decisions.
3. Writes the notes from the typed features list (`src/data/features.ts`, the same data as the `DatedList` / Features tab):
   - entries added since the last tag are **New**; entries whose text or date changed are **Updated**;
   - lines already in the last release's published notes are not repeated;
   - with neither, the notes say "Polish and fixes.";
   - every commit since the last tag is listed underneath, folded in a `<details>`.
   It reads the old features list straight from the last tag (`git show <tag>:src/data/features.ts`) to compare.
4. **Stops if a new feature isn't dated today**, since the Features tab shows the day each one went live. (An entry added late to an earlier release, dated on or before that release's day, is left out instead.)
5. Shows the tag and notes and asks before going on.
6. Runs `npm test`, pushes main, pushes the tag, and creates the GitHub Release with `gh`.

### Use it

```bash
npm run release
```

```bash
npm run release -- --dry-run
```

`--dry-run` shows the tag and notes and changes nothing; `--yes` skips the question. `RELEASE_TODAY=2026-10-20` pretends it is another day, for trying out a dry run.

### Set up

- Copy `scripts/release.ts` from Dial Hopping and change the title (`Dial Hopping ${tag}`) and anything site-specific (it also lists stations added or removed from `stations.json`; drop that part or point it at your own data).
- Add `"release": "node --experimental-strip-types --no-warnings scripts/release.ts"` to `package.json` (Node 22.6 or later runs TypeScript this way, with no build step).
- Install the GitHub CLI and sign in (`gh auth login`).
- Keep `features.ts` honest: one entry per thing a visitor would notice, dated the day it went live. The release notes, the Features tab and the "new" dot all come from it.
