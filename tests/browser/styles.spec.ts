import { expect, test } from '@playwright/test';

for (const origin of ['http://127.0.0.1:5174', 'http://127.0.0.1:4174']) {
  test(`styles precede JavaScript on initial load and reload: ${origin}`, async ({ page }) => {
    // Reproduce the interval before the entry module can inject imported CSS.
    await page.route('**/*', route => route.request().resourceType() === 'script'
      ? route.abort()
      : route.continue());
    await page.goto(origin);
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt) await page.reload();
      await expect(page.locator('head link[rel="stylesheet"]')).toHaveCount(1);
      await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(11, 15, 20)');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-weight', '600');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });
}
