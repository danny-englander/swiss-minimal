import { test, expect } from '@playwright/test';

// /llms.txt, for agents that read the site, and the Agents page that explains it.

test('llms.txt is served as plain text and every demo page it lists exists', async ({ request }) => {
  const res = await request.get('/llms.txt');
  expect(res.ok()).toBe(true);
  expect(res.headers()['content-type']).toContain('text/plain');
  const text = await res.text();
  expect(text.startsWith('# Swiss Minimal\n')).toBe(true);

  // Links to this site are written with the live domain; check each path on the local build.
  const paths = [...text.matchAll(/\]\(https:\/\/www\.swissminimal\.ch(\/[^)]*)\)/g)].map((m) => m[1]);
  expect(paths.length).toBeGreaterThan(0);
  for (const path of paths) {
    // Written as the site serves them: www, and a slash at the end.
    expect(path.endsWith('/'), path).toBe(true);
    const linked = await request.get(path);
    expect(linked.ok(), path).toBe(true);
  }
});

test('the Agents page links to llms.txt and never scrolls sideways on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/agents');
  await expect(page.getByRole('link', { name: '/llms.txt' })).toHaveAttribute('href', '/llms.txt');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBe(0);
});
