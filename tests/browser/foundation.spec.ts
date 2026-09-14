import { expect, test } from '@playwright/test';

for (const javaScriptEnabled of [false, true]) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`readable production shell at ${width}px with JS ${javaScriptEnabled}`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled, viewport: { width, height: 1000 } });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
      await page.goto('http://127.0.0.1:4174/');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('I build reliable cloud infrastructure and delivery systems.');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
      await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveCSS('outline-style', 'solid');
      await page.keyboard.press('Enter');
      await expect(page.locator('main')).toBeFocused();
      await page.getByRole('link', { name: 'View Engineering Work' }).click();
      await expect(page).toHaveURL(/#work$/);
      expect(errors).toEqual([]);
      await context.close();
    });
  }
}

test('reduced motion cancels a running reveal and Strict Mode remounts leave no duplicate tweens', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('http://127.0.0.1:5174/tests/motion-harness.html');
  const sample = page.getByTestId('motion-sample');
  await expect(sample).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.foundationTweenCount())).toBe(1);
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Hide sample' }).click();
    await expect(sample).toHaveCount(0);
    expect(await page.evaluate(() => window.foundationTweenCount())).toBe(0);
    await page.getByRole('button', { name: 'Show sample' }).click();
    await expect.poll(() => page.evaluate(() => window.foundationTweenCount())).toBe(1);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(sample).toHaveCSS('transform', 'none');
  await expect(sample).toHaveCSS('opacity', '1');
  expect(await page.evaluate(() => window.foundationTweenCount())).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => page.evaluate(() => window.foundationTweenCount())).toBe(1);
  await expect(sample).toHaveCSS('transform', 'none');
  await expect(sample).toHaveCSS('opacity', '1');
});

test('development hydration remains clean under slow JavaScript delivery', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  const session = await page.context().newCDPSession(page);
  await session.send('Network.enable');
  await session.send('Network.emulateNetworkConditions', { offline: false, latency: 100, downloadThroughput: 200000, uploadThroughput: 100000 });
  await page.goto('http://127.0.0.1:5174/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByTestId('motion-sample')).toHaveCSS('opacity', '1');
  expect(errors).toEqual([]);
});

test('blocking JavaScript downloads leaves real content and links available', async ({ page }) => {
  await page.route('**/*.js', route => route.abort());
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('link', { name: 'View Engineering Work' }).click();
  await expect(page).toHaveURL(/#work$/);
});

test('save desktop and mobile foundation evidence', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.screenshot({ path: `docs/rebuild/captures/sprint1-${label}-hero.png` });
    await page.screenshot({ path: `docs/rebuild/captures/sprint1-${label}-full.png`, fullPage: true });
  }
});
