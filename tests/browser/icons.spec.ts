import { mkdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';

test('interface arrows stay monochrome and preserve link names at phone and laptop sizes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  mkdirSync('docs/rebuild/icon-fix', { recursive: true });
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    expect(await page.locator('body').innerText()).not.toMatch(/[↗↘↓↑→]/u);
    for (const name of ['View Engineering Work', 'View Resume', 'Contact me']) {
      const link = page.getByRole('link', { name, exact: true });
      await expect(link).toBeVisible();
      const icon = link.locator('svg');
      const drawing = await icon.evaluate(el => {
        const style = getComputedStyle(el);
        const box = el.getBoundingClientRect();
        return { color: style.color, stroke: style.stroke, fill: style.fill, width: box.width, height: box.height };
      });
      expect(drawing.stroke).toBe(drawing.color);
      expect(drawing.fill).toBe('none');
      expect(drawing.width).toBeGreaterThanOrEqual(14);
      expect(drawing.height).toBeGreaterThanOrEqual(14);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.screenshot({ path: `docs/rebuild/icon-fix/arrows-${width}.png` });
  }
});
