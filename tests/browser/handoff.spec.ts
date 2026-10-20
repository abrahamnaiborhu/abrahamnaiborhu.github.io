import { test, expect } from '@playwright/test';

test('physical handoff keeps its application and reverses on phone and desktop', async ({ page }) => {
  for (const viewport of [{width:390,height:844},{width:360,height:640},{width:1280,height:720}]) {
    await page.setViewportSize(viewport);
    await page.goto('/#behind-the-application');
    const stage = page.locator('.unfold .stage');
    await expect(page.locator('.unfold')).toHaveClass(/motion-ready/);
    await page.locator('.unfold .application').evaluate(el => { el.setAttribute('data-persistent','yes'); });
    for (const [index,phase] of ['application','operations','shared','application'].entries()) {
      await page.locator('.unfold [data-seek]').nth(index === 3 ? 0 : index).click();
      await expect(stage).toHaveAttribute('data-phase',phase);
      await expect(page.locator('.unfold .application')).toHaveAttribute('data-persistent','yes');
      expect(await stage.evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(80);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
      if (viewport.width < 761) {
        const drawing = await page.locator('.unfold .application').boundingBox();
        const narration = await page.locator('.unfold .narration').boundingBox();
        expect(drawing!.y + drawing!.height).toBeLessThanOrEqual(narration!.y + 2);
      }
      await page.screenshot({path:`/tmp/portfolio-unfold-${viewport.width}-${phase}.png`});
    }
    await page.screenshot({path:`/tmp/portfolio-unfold-${viewport.width}.png`});
    await page.locator('.unfold-skip').click();
    await expect(page).toHaveURL(/#perspective$/);
  }
});

test('reduced motion uses instant phase choices; no JavaScript preserves the explanation', async ({ browser }) => {
  const context = await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});
  const page = await context.newPage();
  await page.goto('/#behind-the-application');
  await expect(page.locator('.unfold .play')).toBeDisabled();
  await page.locator('.unfold [data-seek]').first().click();
  await expect(page.locator('.unfold .stage')).toHaveAttribute('data-phase','application');
  await context.close();
  const staticContext = await browser.newContext({javaScriptEnabled:false});
  const staticPage = await staticContext.newPage();
  await staticPage.goto('/#behind-the-application');
  await expect(staticPage.locator('.unfold-transcript')).toContainText('development and staging');
  await expect(staticPage.locator('.unfold-skip')).toBeVisible();
  await staticContext.close();
});

test('chapter links include the unfolding scene and its final pose holds before release', async ({ page }) => {
  await page.setViewportSize({width:1280,height:720});
  await page.goto('/#glinsta');
  const next = page.locator('#glinsta .scene-foot a');
  await expect(next).toHaveAttribute('href','#behind-the-application');
  await next.click();
  await expect(page).toHaveURL(/#behind-the-application$/);
  const slider = page.locator('.unfold input[type=range]');
  await slider.fill('910');
  const pose = await page.locator('.unfold .application').getAttribute('style');
  await slider.fill('990');
  await expect(page.locator('.unfold .application')).toHaveAttribute('style',pose!);
  await expect(page.locator('.unfold .stage')).toHaveAttribute('data-progress','0.990');
  const note = page.locator('.unfold-transcript');
  await expect(note).not.toHaveAttribute('open');
  await note.locator('summary').click();
  await expect(note.locator('p').first()).toBeVisible();
  await page.locator('.unfold-skip').click();
  await expect(page.locator('#perspective-title')).toContainText('a better way to ship');
});
