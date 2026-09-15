import { expect, test } from '@playwright/test';
import { articles } from '../../src/rebrand/articles';

test('writing titles wrap and every curated destination is keyboard accessible', async ({ browser }) => {
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width, height: 1000 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4174/#writing');
    const section = page.locator('#writing');
    await expect(section.getByRole('link')).toHaveCount(5);
    await section.getByRole('link', { name: articles[0].title, exact: true }).focus();
    for (const article of articles) {
      const link = section.getByRole('link', { name: article.title, exact: true });
      await expect(link).toBeFocused();
      await expect(link).toHaveAttribute('href', article.url);
      await expect(link).toHaveCSS('outline-style', 'solid');
      await expect(link.locator('.writing-arrow')).toHaveCSS('transform', 'none');
      await page.keyboard.press('Tab');
    }
    await expect(section.getByRole('link', { name: 'Read all articles on Dev.to' })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await section.screenshot({ path: `docs/rebuild/captures/sprint4-writing-${width}.png`, style: '.navigation-shell, .skip-link { visibility: hidden; }' });
    await context.close();
  }
});
