import { expect, test } from '@playwright/test';

for (const width of [390, 768, 1440]) {
  test(`foundation evidence remains readable at ${width}px without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 1000 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4174/#work');
    const project = page.getByRole('article', { name: 'GCP Terraform Foundation' });
    await expect(project).toBeVisible();
    await expect(project.getByText('Object versioning · remote state')).toBeVisible();
    const repository = project.getByRole('link', { name: 'View repository' });
    await expect(repository).toHaveAttribute('href', 'https://github.com/abrahamnaiborhu/GCP-Terraform-Foundation-Lite');
    await repository.focus();
    await page.keyboard.press('Tab');
    await expect(project.getByRole('link', { name: 'Read case study' })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await project.screenshot({ path: `docs/rebuild/captures/sprint3-foundation-${width}.png`, style: '.navigation-shell { visibility: hidden; }' });
    await context.close();
  });
}
