import { test, expect } from '@playwright/test';

// The site name in the top bar links home on a site with more than one page.

test('the site name links home, and says so on the home page', async ({ page }) => {
  await page.goto('/forms');
  const home = page.locator('.topbar').getByRole('link', { name: 'Swiss Minimal demo' });
  await expect(home).not.toHaveAttribute('aria-current', /.+/);
  await home.click();
  await expect(page).toHaveURL('/');
  await expect(home).toHaveAttribute('aria-current', 'page');
});
