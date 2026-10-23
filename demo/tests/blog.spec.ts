import { test, expect } from '@playwright/test';

// The blog: PostList on the index, PostHeader, the post body and PostNav on each post.

test('the index opens with the featured post, then lists the rest newest first', async ({ page }) => {
  await page.goto('/blog');
  const feature = page.locator('.post-feature');
  await expect(feature.getByRole('heading', { level: 2 })).toHaveText('Why one typeface is enough');
  await expect(feature.getByRole('link', { name: 'Read post: Why one typeface is enough' })).toHaveAttribute(
    'href',
    '/blog/one-typeface/',
  );
  await expect(feature.locator('img')).toHaveAttribute('alt', /red circle/);

  const titles = page.locator('.post-list-title a');
  await expect(titles).toHaveText(['Setting a grid before the words', 'Notes on vermilion and verdigris']);
  await expect(titles.first()).toHaveAttribute('href', '/blog/grid-before-words/');
  await expect(page.locator('.post-list time').first()).toHaveAttribute('datetime', '2026-09-30');
});

test('the feature stacks on a phone and splits 50/50 from 768px', async ({ page }) => {
  const columns = () =>
    page.locator('.post-feature').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/blog');
  expect(await columns()).toBe(1);
  await page.setViewportSize({ width: 1024, height: 800 });
  expect(await columns()).toBe(2);
});

test('a post has its header, byline and body', async ({ page }) => {
  await page.goto('/blog/one-typeface');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Why one typeface is enough');
  await expect(page.locator('.post-header-label')).toHaveAttribute('href', '/blog/');
  const meta = page.locator('.post-meta');
  await expect(meta).toContainText('October 20, 2026');
  await expect(meta).toContainText('Danny Englander');
  await expect(meta).toContainText(/\d+ min/);
  await expect(page.locator('.post-body h2').first()).toHaveText('What you give up');
  await expect(page.locator('.post-body blockquote')).toBeVisible();
});

test('the newest post links only back, the oldest only forward', async ({ page }) => {
  await page.goto('/blog/one-typeface');
  const nav = page.getByRole('navigation', { name: 'More posts' });
  await expect(nav.locator('[rel="prev"]')).toHaveAttribute('href', '/blog/grid-before-words/');
  await expect(nav.locator('[rel="next"]')).toHaveCount(0);

  await page.goto('/blog/two-pigments');
  await expect(nav.locator('[rel="next"]')).toHaveAttribute('href', '/blog/grid-before-words/');
  await expect(nav.locator('[rel="prev"]')).toHaveCount(0);
});

test('the byline wraps on a phone, and Next keeps the right column from 640px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/blog/two-pigments');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  await page.setViewportSize({ width: 1024, height: 800 });
  const column = await page.locator('.post-nav-next').evaluate((el) => getComputedStyle(el).gridColumnStart);
  expect(column).toBe('2');
});

test('code is highlighted in the kit’s code colors, with no background of Shiki’s own', async ({ page }) => {
  await page.goto('/blog/grid-before-words');
  const block = page.locator('.post-body pre.astro-code[data-language="ts"]');
  const colors = await block.evaluate((pre) => {
    const root = getComputedStyle(document.documentElement);
    const probe = document.createElement('span');
    document.body.append(probe);
    const resolve = (name: string) => {
      probe.style.color = root.getPropertyValue(name).trim();
      return getComputedStyle(probe).color;
    };
    const used = new Set([...pre.querySelectorAll('span')].map((s) => getComputedStyle(s).color));
    const result = {
      background: getComputedStyle(pre).backgroundColor,
      keyword: used.has(resolve('--code-keyword')),
      string: used.has(resolve('--code-string')),
      constant: used.has(resolve('--code-constant')),
      comment: used.has(resolve('--muted')),
    };
    probe.remove();
    return result;
  });
  expect(colors).toEqual({ background: 'rgba(0, 0, 0, 0)', keyword: true, string: true, constant: true, comment: true });
});
