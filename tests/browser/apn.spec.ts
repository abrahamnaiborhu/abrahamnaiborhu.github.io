import { expect, test } from '@playwright/test';

test('title sequence moves the name behind a stationary portrait and reveals the headline in two beats', async ({ page }, testInfo) => {
  for (const [width, height] of [[390, 700], [1280, 720], [1440, 900], [1920, 1080], [2560, 1440]]) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await expect(page.locator('.opening')).toHaveAttribute('data-opening', 'playing');
    await expect(page.locator('.opening')).toHaveAttribute('data-loading', 'ready');
    await expect(page.locator('.identity .apn-mark')).toHaveAttribute('data-wordmark', 'Abraham');
    const seek = async (time: number) => {
      await page.evaluate(time => document.getAnimations().forEach(animation => {
        animation.pause();
        animation.currentTime = time;
      }), time);
    };
    await seek(2200);
    const introduction = page.locator('.opening-introduction');
    await expect(introduction).toHaveCSS('opacity', '0');
    await expect(page.locator('.opening-name')).toHaveText('ABRAHAM');
    await seek(2550);
    await expect(page.locator('.identity .apn-mark')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await expect(introduction).toHaveCSS('opacity', '0');
    const before = await page.locator('.opening-portrait').boundingBox();
    await seek(2850);
    const portrait = page.locator('.opening-portrait');
    await expect(portrait).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(portrait).toHaveCSS('clip-path', 'none');
    await expect(portrait).toHaveCSS('transform', 'none');
    expect(await portrait.boundingBox()).toEqual(before);
    await expect(introduction).toHaveCSS('opacity', '1');
    const title = page.locator('.opening-name');
    const titleX = await title.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
    expect(titleX).toBeGreaterThan(1);
    expect(await title.evaluate(el => Number(getComputedStyle(el).zIndex))).toBeLessThan(await portrait.evaluate(el => Number(getComputedStyle(el).zIndex)));
    const lines = page.locator('[data-hero-line]');
    await expect(lines).toHaveCount(2);
    await seek(3200);
    const travel = await lines.evaluateAll(elements => elements.map(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42 / el.getBoundingClientRect().height));
    expect(travel[0]).toBeGreaterThan(0);
    expect(travel[0]).toBeLessThan(1.3);
    expect(travel[1]).toBeCloseTo(1.3, 2);
    await page.screenshot({ path: testInfo.outputPath(`headline-first-${width}.png`) });
    await seek(3740);
    await expect(lines.nth(0)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    expect(await lines.nth(1).evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42)).toBeGreaterThan(0);
    expect(await portrait.boundingBox()).toEqual(before);
    await page.screenshot({ path: testInfo.outputPath(`headline-second-${width}.png`) });
    await page.getByRole('button', { name: 'Skip opening' }).click();
    await expect(introduction).toHaveCSS('opacity', '1');
    await expect(title).toHaveCSS('transform', 'none');
    const photo = await portrait.boundingBox();
    const copy = await page.locator('.opening-narration').boundingBox();
    if (width > 900) expect(copy!.x + copy!.width).toBeLessThan(photo!.x);
    else expect(copy!.y).toBeGreaterThanOrEqual(photo!.y + photo!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(() => sessionStorage.removeItem('apn-opening-seen'));
  }
});

test('opening releases interruption listeners on completion, skip and interruption', async ({ browser }) => {
  for (const ending of ['complete', 'skip', 'escape', 'resize', 'reduced'] as const) {
    const context = await browser.newContext({ reducedMotion: 'no-preference' });
    await context.addInitScript(() => {
      const listeners = new Set<EventListenerOrEventListenerObject>();
      const add = window.addEventListener.bind(window);
      const remove = window.removeEventListener.bind(window);
      window.addEventListener = (type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) => {
        // The unfolding scene owns separate signal-based wheel controls. Track the opening's
        // explicitly removed listeners, including its pre-paint reservation.
        const signalled = typeof options === 'object' && Boolean(options.signal);
        if (type === 'wheel' && listener && !signalled) listeners.add(listener);
        if (listener) add(type, listener, options);
      };
      window.removeEventListener = (type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions) => {
        if (type === 'wheel' && listener) listeners.delete(listener);
        if (listener) remove(type, listener, options);
      };
      Object.defineProperty(window, '__openingWheelListeners', { get: () => listeners.size });
    });
    const page = await context.newPage();
    try {
      await page.goto('/');
      await expect(page.locator('.opening')).toHaveAttribute('data-opening', 'playing');
      const listenerCount = () => page.evaluate(() => Reflect.get(window, '__openingWheelListeners') as number);
      expect(await listenerCount(), ending).toBe(1);
      if (ending === 'skip') await page.getByRole('button', { name: 'Skip opening' }).click();
      if (ending === 'escape') await page.keyboard.press('Escape');
      if (ending === 'resize') await page.setViewportSize({ width: 390, height: 700 });
      if (ending === 'reduced') await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(page.locator('.opening')).toHaveAttribute('data-opening', 'complete');
      await expect.poll(listenerCount, { message: ending }).toBe(0);
      expect(await page.locator('.apn-mark').evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
    } finally { await context.close(); }
  }
});

test('first paint stays in the opening state while the application scripts load', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  let release!: () => void;
  const scripts = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/assets/*.js', async route => { await scripts; await route.continue(); });
  try {
    await page.goto('/', { waitUntil: 'commit' });
    await expect(page.locator('.opening-context')).toHaveCSS('visibility', 'hidden', { timeout: 1000 });
    await expect(page.locator('.opening-portrait')).toHaveCSS('visibility', 'hidden');
    await expect(page.locator('.identity .apn-mark')).toHaveCSS('visibility', 'hidden');
    await expect(page.locator('.header-resume')).toBeVisible();
    release();
    await expect(page.locator('.opening')).toHaveAttribute('data-opening', 'playing');
    await expect(page.locator('.opening-introduction')).toHaveCSS('opacity', '0');
    await page.getByRole('button', { name: 'Skip opening' }).click();
    await expect(page.locator('.opening-context')).toHaveCSS('visibility', 'visible');
  } finally { release(); }
});

test('late scripts reveal the static hero and cannot restart the opening afterward', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  let release!: () => void;
  const scripts = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/assets/*.js', async route => { await scripts; await route.continue(); });
  try {
    await page.goto('/', { waitUntil: 'commit' });
    await expect(page.locator('html')).toHaveAttribute('data-apn-opening', 'complete');
    await expect(page.locator('.opening-context')).toHaveCSS('visibility', 'visible');
    release();
    await page.waitForLoadState('load');
    await page.waitForTimeout(150);
    await expect(page.locator('.opening')).toHaveAttribute('data-opening', 'complete');
    expect(await page.locator('.apn-mark').evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  } finally { release(); }
});

test('return visits, direct entry, reduced motion and no JavaScript paint the static hero immediately', async ({ browser }) => {
  for (const mode of ['return', 'direct', 'reduced', 'no-js']) {
    const context = await browser.newContext({
      javaScriptEnabled: mode !== 'no-js',
      reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference',
    });
    if (mode === 'return') await context.addInitScript(() => sessionStorage.setItem('apn-opening-seen', 'true'));
    const page = await context.newPage();
    let release!: () => void;
    const scripts = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/assets/*.js', async route => { await scripts; await route.continue(); });
    try {
      await page.goto(mode === 'direct' ? '/#work' : '/', { waitUntil: 'commit' });
      await expect(page.locator('.opening-context'), mode).toHaveCSS('visibility', 'visible');
      await expect(page.locator('html'), mode).not.toHaveAttribute('data-apn-opening', 'pending');
      release();
      await page.waitForLoadState('load');
      await expect(page.locator('.opening'), mode).toHaveAttribute('data-opening', 'complete');
    } finally { release(); await context.close(); }
  }
});

test('the curved b paints during handwriting and the opening cleans up its strokes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.opening')).toHaveAttribute('data-opening', 'playing');
  await expect(page.locator('.opening')).toHaveAttribute('data-loading', 'ready');
  // Inspect an actual rendered handwriting frame, before any introduction text appears.
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      animation.pause();
      animation.currentTime = 1500;
    }
  });
  await page.waitForTimeout(80);
  const point = await page.locator('[data-stroke="b"]').evaluate(node => {
    const path = node as SVGPathElement;
    const local = path.getPointAtLength(path.getTotalLength() * .7);
    const screen = new DOMPoint(local.x, local.y).matrixTransform(path.getScreenCTM()!);
    return { x: screen.x, y: screen.y };
  });
  // Sample the curved lowercase letter, away from its ascender and neighbouring letters.
  const crop = await page.screenshot({ clip: { x: Math.floor(point.x - 4), y: Math.floor(point.y - 4), width: 8, height: 8 } });
  const painted = await page.evaluate(async data => {
    const image = new Image();
    image.src = `data:image/png;base64,${data}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, image.width, image.height).data;
    let light = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i] > 150 && pixels[i + 1] > 150 && pixels[i + 2] > 150) light++;
    }
    return light;
  }, crop.toString('base64'));
  expect(painted, 'The curved b must be painted, not only present in the DOM').toBeGreaterThan(5);

  // Resume the opening and verify both temporary dashes and animation effects clear.
  await page.evaluate(() => document.getAnimations().forEach(animation => animation.play()));
  await expect.poll(() => page.locator('.apn-mark path').evaluateAll(paths =>
    paths.every(path => getComputedStyle(path).strokeDasharray === 'none' && path.getAnimations().length === 0)
  )).toBe(true);
  await expect(page.locator('.opening')).toHaveAttribute('data-opening', 'complete');
  expect(await page.locator('.apn-mark').evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
});
