import { test, expect } from '@playwright/test';

// The blog: PostFeature, PostList and the Pager on the index; PostHeader, the post body and
// PostNav on each post.

/** The featured post, which opens every page of the index. */
async function expectFeature(page: import('@playwright/test').Page) {
  const feature = page.locator('.post-feature');
  await expect(feature.getByRole('heading', { level: 2 })).toHaveText('Why one typeface is enough');
  await expect(feature.getByRole('link', { name: 'Read post: Why one typeface is enough' })).toHaveAttribute(
    'href',
    '/blog/one-typeface/',
  );
  await expect(feature.locator('img')).toHaveAttribute('alt', /red circle/);
}

test('the index opens with the featured post, then lists five of the rest newest first', async ({ page }) => {
  await page.goto('/blog');
  await expectFeature(page);
  const titles = page.locator('.post-list-title a');
  await expect(titles).toHaveText([
    'Setting a grid before the words',
    'Notes on vermilion and verdigris',
    'Thick rule, thin rule',
    'Labels in two words or fewer',
    'Why the bars stay dark',
  ]);
  await expect(titles.first()).toHaveAttribute('href', '/blog/grid-before-words/');
  await expect(page.locator('.post-list time').first()).toHaveAttribute('datetime', '2026-09-30');
});

test('the pager leads to page 2, which keeps the feature and lists the older posts', async ({ page }) => {
  await page.goto('/blog');
  const pager = page.getByRole('navigation', { name: 'Blog pages' });
  await expect(pager.getByRole('link', { name: 'Page 1 of 2' })).toHaveAttribute('aria-current', 'page');
  await expect(pager.locator('[rel="prev"]')).toHaveCount(0);
  await pager.getByRole('link', { name: 'Older' }).click();

  await expect(page).toHaveURL(/\/blog\/page\/2\/$/);
  await expect(page).toHaveTitle('Blog · Page 2 · Swiss Minimal');
  await expectFeature(page);
  await expect(page.locator('.post-list-title a')).toHaveText(['Images are content, not filler', 'Motion that stops']);
  await expect(pager.getByRole('link', { name: 'Page 2 of 2' })).toHaveAttribute('aria-current', 'page');
  await expect(pager.locator('[rel="next"]')).toHaveCount(0);
  await expect(pager.getByRole('link', { name: 'Newer' })).toHaveAttribute('href', '/blog/');
});

test('the pager sits under the list on phones, with the numbers under the steps', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/blog/page/2/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  const [step, numbers] = await Promise.all([
    page.locator('.pager-step').first().boundingBox(),
    page.locator('.pager-pages').boundingBox(),
  ]);
  expect(numbers!.y).toBeGreaterThan(step!.y);
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

  await page.goto('/blog/motion-that-stops');
  await expect(nav.locator('[rel="next"]')).toHaveAttribute('href', '/blog/images-are-content/');
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
