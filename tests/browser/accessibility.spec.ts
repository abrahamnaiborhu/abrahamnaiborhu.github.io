import { test, expect } from '@playwright/test';

const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440];

test('settled motion leaves essential content readable and supporting sections do not replay', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','complete');
  const targets=page.locator('h1, #work .narration, #team .team-account, .career-timeline > li, .certification-grid > li, .about-grid, #contact h2');
  expect(await targets.evaluateAll(nodes=>nodes.every(node=>parseFloat(getComputedStyle(node).opacity)===1))).toBe(true);
  await expect(page.locator('.career-timeline > :not(li)')).toHaveCount(0);
  const about=page.locator('.about-grid');await about.scrollIntoViewIfNeeded();
  await page.emulateMedia({reducedMotion:'reduce'});await expect(about).toHaveCSS('opacity','1');
  await page.emulateMedia({reducedMotion:'no-preference'});await expect(about).toHaveCSS('transform','none');
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

test('visible SVG labels stay readable at their rendered scale', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [[320, 720], [360, 640], [390, 844], [768, 1024], [1000, 800], [1024, 600], [1280, 720], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.waitForSelector('h1');
    const minimum = width <= 640 ? 14 : 12;
    const tooSmall = await page.evaluate((minimum) => [...document.querySelectorAll('main svg text')].flatMap(text => {
      const svgText = text as SVGTextElement;
      const matrix = svgText.getScreenCTM();
      if (!matrix || !svgText.checkVisibility() || svgText.closest('[aria-hidden="true"]')) return [];
      const rendered = parseFloat(getComputedStyle(svgText).fontSize) * Math.hypot(matrix.a, matrix.b);
      return rendered < minimum ? [`${rendered.toFixed(1)}px "${svgText.textContent?.trim()}"`] : [];
    }), minimum);
    expect(tooSmall, `SVG text below ${minimum}px at ${width}x${height}`).toEqual([]);
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
