import { test, expect, type Page } from '@playwright/test';

// The Contact tab's form, sent to Netlify Forms. Netlify only exists on the live site, so these
// tests answer the POST themselves: once as Netlify accepting it, once as a failure.

/** Answers the form's POST to "/" with `status`, and returns the bodies it received. */
async function netlify(page: Page, status: number) {
  const bodies: string[] = [];
  await page.route(
    (url) => url.pathname === '/',
    (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      bodies.push(route.request().postData() ?? '');
      return route.fulfill({ status, body: '' });
    },
  );
  return bodies;
}

async function fill(page: Page) {
  await page.goto('/#contact');
  const form = page.locator('[data-contact-form]');
  await form.getByLabel('Your name').fill('Jane Doe');
  await form.getByLabel('Email').fill('jane@example.com');
  await form.getByLabel('Message').fill('Hello from the tests.');
  return form;
}

test('the form is marked for Netlify Forms', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('[data-contact-form]');
  await expect(form).toHaveAttribute('name', 'contact');
  await expect(form).toHaveAttribute('data-netlify', 'true');
  await expect(form.locator('input[name="form-name"]')).toHaveValue('contact');
  await expect(form.locator('input[name="bot-field"]')).toBeHidden();
});

test('a sent message closes the panel and says thank you', async ({ page }) => {
  const bodies = await netlify(page, 200);
  const form = await fill(page);
  await form.getByRole('button', { name: 'Send' }).click();

  await expect(page.locator('[data-toast]')).toHaveText('Message sent. Thank you.');
  await expect(page.locator('#panel')).toHaveAttribute('aria-hidden', 'true');
  const sent = new URLSearchParams(bodies[0]);
  expect(sent.get('form-name')).toBe('contact');
  expect(sent.get('email')).toBe('jane@example.com');
  expect(sent.get('message')).toBe('Hello from the tests.');
});

test('a failed send keeps the message and says so in the form', async ({ page }) => {
  await netlify(page, 500);
  const form = await fill(page);
  await form.getByRole('button', { name: 'Send' }).click();

  await expect(form.getByRole('alert')).toContainText('Couldn’t send your message');
  await expect(form.getByLabel('Message')).toHaveValue('Hello from the tests.');
  await expect(page.locator('#panel')).toHaveAttribute('aria-hidden', 'false');
  await expect(form.getByRole('button', { name: 'Send' })).toBeEnabled();
});
