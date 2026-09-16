import { test, expect } from '@playwright/test';

const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440];

test('motion enhancements never conceal essential text and do not replay completed sections', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.topology')).toHaveAttribute('data-motion-state', 'complete');
  const targets = page.locator('.hero h1, .hero .actions, .credential-strip li, .capability-grid > li, .career-timeline > li, .certification-grid > li, .about-grid, .contact h2, .contact .actions');
  expect(await targets.evaluateAll(nodes => nodes.every(node => parseFloat(getComputedStyle(node).opacity) >= 0.84))).toBe(true);
  await expect(page.locator('.career-timeline > :not(li)')).toHaveCount(0);
  await expect(page.locator('.contact')).toHaveCSS('overflow', 'visible');
  const about = page.locator('.about-grid');
  await about.scrollIntoViewIfNeeded();
  await expect(about).toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(about).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const changes = await about.evaluate(element => new Promise<number>(resolve => {
    let count = 0;
    const observer = new MutationObserver(records => { count += records.length; });
    observer.observe(element, { attributes: true, attributeFilter: ['style'] });
    setTimeout(() => { observer.disconnect(); resolve(count); }, 1000);
  }));
  expect(changes).toBe(0);
});

// S5.2: systematic browser and accessibility checks.

test('no horizontal overflow at any responsive width', async ({ page }) => {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.waitForSelector('h1');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth, `overflow at ${width}px`).toBeLessThanOrEqual(clientWidth);
  }
});

test('no text below 14px on mobile viewports', async ({ page }) => {
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.waitForSelector('h1');
    const tooSmall = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const small: string[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const el = node.parentElement;
        if (!el || !node.textContent?.trim()) continue;
        if (el.closest('[aria-hidden="true"]') || el.tagName === 'STYLE' || el.tagName === 'SCRIPT') continue;
        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        if (fontSize < 14) small.push(`${el.tagName}.${el.className}: ${fontSize}px "${node.textContent.trim().slice(0, 40)}"`);
      }
      return small;
    });
    expect(tooSmall, `text below 14px at ${width}px`).toEqual([]);
  }
});

test('interactive elements meet 44px minimum touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForSelector('h1');
  const undersized = await page.evaluate(() => {
    const elements = document.querySelectorAll('a[href], button, summary, [tabindex="0"]');
    const issues: string[] = [];
    elements.forEach(el => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return; // hidden elements
      if (rect.height < 44 || rect.width < 44) {
        const label = (el as HTMLElement).textContent?.trim().slice(0, 30) || el.tagName;
        issues.push(`${label}: ${Math.round(rect.width)}×${Math.round(rect.height)}`);
      }
    });
    return issues;
  });
  expect(undersized, 'touch targets below 44px').toEqual([]);
});

test('single H1 and logical heading hierarchy', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('h1');
  const headings = await page.evaluate(() => {
    const all = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return Array.from(all).map(h => ({ level: parseInt(h.tagName[1]), text: h.textContent?.trim().slice(0, 60) || '' }));
  });
  const h1s = headings.filter(h => h.level === 1);
  expect(h1s).toHaveLength(1);
  // Check no heading level is skipped (e.g. h1 → h3 without h2)
  let previousLevel = 0;
  for (const h of headings) {
    expect(h.level, `heading "${h.text}" skips a level`).toBeLessThanOrEqual(previousLevel + 1);
    previousLevel = h.level;
  }
});

test('all images and SVGs have appropriate alt or aria-label', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('h1');
  const issues = await page.evaluate(() => {
    const problems: string[] = [];
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('alt') && !img.getAttribute('aria-label') && img.getAttribute('aria-hidden') !== 'true') {
        problems.push(`img without alt: ${img.src.slice(-40)}`);
      }
    });
    document.querySelectorAll('svg[role="img"]').forEach(svg => {
      if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
        problems.push('SVG role="img" without aria-label or title');
      }
    });
    return problems;
  });
  expect(issues).toEqual([]);
});

test('720px reflow proxy does not cause overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForSelector('h1');
  // A layout reflow proxy only, not browser-zoom or hidden-content certification.
  await page.setViewportSize({ width: 720, height: 450 });
  await page.waitForTimeout(300);
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth, 'overflow at 200% zoom').toBeLessThanOrEqual(clientWidth);
  // Verify content is still accessible
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#work')).toBeVisible();
  await expect(page.locator('#contact')).toBeVisible();
});

test('visible link labels remain in accessible names and underlines stay continuous', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.getByRole('link', { name: /^View credential:/ })).toHaveCount(4);
  await expect(page.locator('.writing-row').first()).toHaveAccessibleName(/Terraform Drift Detection.*Terraform.*Google Cloud/);

  const link = page.getByRole('link', { name: 'View repository' }).first();
  await link.scrollIntoViewIfNeeded();
  await expect(link).not.toHaveAttribute('data-split', 'chars');
  await expect(link.locator('.char')).toHaveCount(0);
  await expect(link).toHaveCSS('text-decoration-skip-ink', 'none');
  await expect(link).toHaveCSS('text-decoration-thickness', '1px');
  await link.hover();
  await expect(link).toHaveCSS('text-decoration-thickness', '1px');
});
