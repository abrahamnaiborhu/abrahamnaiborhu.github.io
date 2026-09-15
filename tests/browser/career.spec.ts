import { expect, test } from '@playwright/test';

test('career and credentials remain complete and readable without motion or JavaScript', async ({ browser }) => {
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width, height: 1000 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4174/#experience');
    await expect(page.locator('.career-timeline > li')).toHaveCount(4);
    await expect(page.locator('.career-timeline h3').first()).toHaveText('Application Engineer');
    await expect(page.locator('.career-timeline time').last()).toHaveAttribute('datetime', '2023-11');
    const certifications = page.locator('#certifications');
    await expect(certifications.getByRole('heading', { level: 3 })).toHaveCount(4);
    await expect(certifications.getByRole('link')).toHaveCount(0);
    await expect(certifications.getByText('AWS Academy Cloud Foundations', { exact: false })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const id of ['experience', 'certifications']) {
      await page.locator(`#${id}`).screenshot({ path: `docs/rebuild/captures/sprint4-${id}-${width}.png`, style: '.navigation-shell, .skip-link { visibility: hidden; }' });
    }
    await context.close();
  }
});
