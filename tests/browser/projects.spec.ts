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

test('project diagrams enter once and cancel cleanly for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const diagram = page.locator('[aria-labelledby="delivery-diagram-title"]');
  await expect(diagram).toHaveAttribute('data-motion-state', 'static');
  await diagram.scrollIntoViewIfNeeded();
  await expect(diagram).toHaveAttribute('data-motion-state', 'complete');
  const changes = await diagram.evaluate(element => new Promise<number>(resolve => {
    let count = 0;
    const observer = new MutationObserver(records => { count += records.length; });
    observer.observe(element, { attributes: true, subtree: true, attributeFilter: ['style'] });
    setTimeout(() => { observer.disconnect(); resolve(count); }, 1200);
  }));
  expect(changes).toBe(0);
  await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
  await diagram.scrollIntoViewIfNeeded();
  await expect(diagram).toHaveAttribute('data-motion-state', 'complete');
  const platform = page.locator('[aria-labelledby="platform-diagram-title"]');
  await platform.scrollIntoViewIfNeeded();
  await expect(platform).toHaveAttribute('data-motion-state', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(platform).toHaveAttribute('data-motion-state', 'static');
  expect(await platform.locator('li').evaluateAll(nodes => nodes.every(node => !node.getAttribute('style')))).toBe(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(platform).toHaveAttribute('data-motion-state', 'static');
});

test('Strict Mode project remounts remove every animation on unmount', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('http://127.0.0.1:5174/tests/motion-harness.html?project');
  for (let i = 0; i < 3; i++) {
    await expect(page.locator('.project-diagram')).toHaveAttribute('data-motion-state', 'running');
    await page.getByRole('button', { name: 'Hide sample' }).click();
    expect(await page.evaluate(() => window.foundationTweenCount())).toBe(0);
    await page.getByRole('button', { name: 'Show sample' }).click();
  }
  await page.getByRole('button', { name: 'Hide sample' }).click();
  expect(await page.evaluate(() => window.foundationTweenCount())).toBe(0);
});

test('new case studies preserve semantic diagrams and evidence at mobile and desktop sizes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    for (const [id, title] of [['delivery', 'Keyless CI/CD on Google Cloud'], ['platform', 'Production-Lite GCP Web Platform']]) {
      const project = page.getByRole('article', { name: title });
      await expect(project.getByRole('link', { name: 'View repository' })).toHaveAttribute('href', 'https://github.com/abrahamnaiborhu/terraform-gcp-production-lite-web-platform');
      await expect(project.getByRole('figure')).toBeVisible();
      await project.screenshot({ path: `docs/rebuild/captures/sprint3-${id}-${width}.png`, style: '.navigation-shell, .skip-link { visibility: hidden; }' });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
