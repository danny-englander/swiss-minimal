# Tooling recipes

Two setups that came from Dial Hopping and suit any site built on this kit: accessibility tests that run against the built site, and a release script that tags each release with the date. These are recipes to copy, not kit code. Between them sits the manual checklist, for what the tests can't see.

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

const PORT = 4392; // one per site: Dial Hopping uses 4391, this demo 4392
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    reducedMotion: 'reduce',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx astro build && npx astro preview --port ${PORT} --ignore-lock`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
```

- **Test the built site, not the dev server.** Visitors get the build. The dev server can also reload the page once while it warms up, which breaks a test mid-run.
- **Reduce Motion on.** The kit turns its slides and fades off for this setting, so a scan never catches a panel halfway down or text mid-fade (which axe reads as low contrast).
- **An uncommon port of its own, never near 4321.** Astro dev servers start at 4321 and, when a port is busy, quietly move up one: with a few running, a dev server can land on 4326 or higher. That really happened: a Swiss Minimal dev server moved to 4326, the port Dial Hopping's tests used, and those tests passed against the wrong site. So give each site's tests a distinct port well away from 4321–4330 (Dial Hopping 4391, this demo 4392). `--ignore-lock` lets the preview run while a dev server holds Astro's lock.
- **`reuseExistingServer: false`.** With reuse on, Playwright tests whatever already answers on the port: another site, or a stale build from an earlier run. Off, a busy port fails loudly at the start instead. (The cost is a fresh build each run.)
- **Write the port once.** Tests use relative URLs (`page.goto('/work')`), and anything that needs the origin, such as a route that blocks every other site, reads it from `baseURL` (the `baseURL` fixture, or `new URL(page.url()).origin`), never a hard-coded `localhost:…`.

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
- **No sideways scroll:** at a 375px viewport, a scrolling list of icon rows has `scrollWidth <= clientWidth` (the demo's `tests/drawer.spec.ts`).

Write them with Playwright's role locators (`page.getByRole('tab', { name: /Contact/ })`), so a test also proves the accessible name is right.

## Manual checks

What the automated tests can't see. Run through it in a real browser at about 390px and 1280px wide, in light and dark, before a release or after restyling a site. Skip the lines for components the site doesn't use.

- [ ] Menu button opens the panel; the top bar turns dark with it; the page behind doesn't scroll.
- [ ] Focus moves into the panel on open and back to the menu button on close. Tab can't reach the page behind.
- [ ] Escape closes it. Clicking an in-page `#` link in the menu closes it.
- [ ] Panel tabs: every tab is a Tab stop; arrows, Home and End move; a tab's `#id` in the URL opens it; Back closes the panel.
- [ ] "New" dot: none on a first visit; shows for a returning visitor; opening its tab clears it.
- [ ] Hover labels show under the top-bar buttons after a pause (not on a phone); the last one stays on screen.
- [ ] Drawer: reaches down to the bottom bar like the menu; the page doesn't scroll; a click outside (the top or bottom bar) closes it and still works; Tab past the last row closes it; the menu and drawer close each other; the round arrow shows while the list overflows.
- [ ] Icon actions: icons are one color and turn the accent on hover; each says what it does (hover label and screen reader); removing a row moves focus to the next row's remove button.
- [ ] Favorites: the star never opens its row; the Favorites filter shows only starred items.
- [ ] Jump: scroll the current item away (or filter it out) and the triangle in the bottom bar brings it back and focuses it.
- [ ] Accordions: only one open per level; nested level works; plus becomes minus.
- [ ] Current page is underlined in the accent in the menu.
- [ ] With `data-accent="teal"`, every accent mark turns teal in light and dark, and nothing else changes.
- [ ] Theme toggle switches and remembers; reloading in dark shows no flash of light.
- [ ] Filters: hide/show, keep numbers, status line updates, URL updates and is read on load, live region announces.
- [ ] Forms: switches and radios work from the keyboard and show the accent when on; required fields show ⁕; a form that submits confirms with a toast above any bottom bar.
- [ ] Page title: one `h1`, and a long title wraps instead of scrolling the page sideways on a phone.
- [ ] A long title in a bottom bar scrolls three rounds, then rests with an ellipsis.
- [ ] With Reduce Motion on (macOS: System Settings > Accessibility > Display), nothing slides or loops.
- [ ] `npm run build` passes with no errors or warnings.

## Releases: date tags and notes from the features list

Dial Hopping's `npm run release` (`scripts/release.ts`) turns "push to main" into a named release with notes, in one step. It fits any site whose host builds on every push (Netlify, Vercel, Cloudflare Pages), where every push already is a release. This repository uses it too: `demo/scripts/release.ts` is the same script with the stations part dropped, reading `demo/src/data/features.ts` from the repository root.

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
