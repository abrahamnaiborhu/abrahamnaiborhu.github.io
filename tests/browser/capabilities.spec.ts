import { writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test('capabilities stay compact, readable, and before the three projects', async ({ browser }) => {
  const measurements = [];
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 1000 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4174/');
    const section = page.getByRole('region', { name: 'Engineering across infrastructure, delivery, and applications.' });
    await expect(section.getByRole('heading', { level: 3 })).toHaveCount(4);
    await expect(section.getByRole('listitem')).toHaveCount(4);
    await expect(page.getByRole('article')).toHaveCount(3);
    expect(await section.locator('li p').evaluateAll(nodes => nodes.every(node => parseFloat(getComputedStyle(node).fontSize) >= 14))).toBe(true);
    const geometry = await page.evaluate(() => {
      const hero = document.querySelector('.hero')!.getBoundingClientRect();
      const capabilities = document.querySelector('#capabilities')!.getBoundingClientRect();
      const project = document.querySelector('.project')!.getBoundingClientRect();
      return { width: innerWidth, capabilityHeight: capabilities.height, heroToFirstProject: project.top - hero.top, heroEndToFirstProject: project.top - hero.bottom, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    expect(geometry.overflow).toBe(false);
    // Keep the complete inventory within one 1000px review viewport, without hidden text.
    expect(geometry.capabilityHeight).toBeLessThan(1000);
    measurements.push(geometry);
    await section.screenshot({ path: `docs/rebuild/captures/sprint3-capabilities-${width}.png`, style: '.navigation-shell, .skip-link { visibility: hidden; }' });
    await page.getByRole('link', { name: 'View Engineering Work' }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator('#work')).toBeInViewport();
    await context.close();
  }
  await writeFile('docs/rebuild/captures/sprint3-section-flow.json', JSON.stringify(measurements, null, 2));
});
