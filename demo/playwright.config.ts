import { defineConfig, devices } from '@playwright/test';

// Accessibility checks for the demo (see TOOLING.md). Run with `npm test`.

// The tests' own server, on an uncommon port of their own. Dev servers start at 4321 and move
// up one at a time when a port is busy, so any port near it can end up serving a different
// site. Tests use relative URLs; this is the only place the port appears.
const PORT = 4392;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    // The kit turns its slides and fades off for this setting, so a scan never catches a
    // page halfway through a transition.
    reducedMotion: 'reduce',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Test the production build, as visitors get it. Never reuse a server already on the port:
  // it may be a stale build or another site entirely, so a clash should fail loudly instead.
  webServer: {
    command: `npx astro build && npx astro preview --port ${PORT} --ignore-lock`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
