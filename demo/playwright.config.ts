import { defineConfig, devices } from '@playwright/test';

// Accessibility checks for the demo (see TOOLING.md). Run with `npm test`.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:4327',
    // The kit turns its slides and fades off for this setting, so a scan never catches a
    // page halfway through a transition.
    reducedMotion: 'reduce',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Test the production build, as visitors get it, on a port of its own so it never meets
  // a dev server already running.
  webServer: {
    command: 'npx astro build && npx astro preview --port 4327 --ignore-lock',
    url: 'http://localhost:4327',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
