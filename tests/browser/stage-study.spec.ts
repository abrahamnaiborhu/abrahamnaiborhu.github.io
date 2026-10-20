import { expect, test } from '@playwright/test';

const url = 'http://127.0.0.1:5174/studies/stage-unfold/';

test('full playback passes through all three beats and stops without replacing the application', async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'no-preference' });
  await page.goto(url);
  const actor = await page.locator('[data-actor=application]').elementHandle();
  await page.evaluate(() => {
    const stage = document.querySelector('.stage')!;
    const observed = new Set([stage.getAttribute('data-phase')]);
    const observer = new MutationObserver(() => {
      observed.add(stage.getAttribute('data-phase'));
      document.body.dataset.observedPhases = [...observed].join(',');
    });
    observer.observe(stage,{attributes:true,attributeFilter:['data-phase']});
  });
  await page.getByRole('button',{name:'Play study',exact:true}).click();
  await expect(page.locator('.stage')).toHaveAttribute('data-progress','1.000',{timeout:15000});
  await expect(page.getByRole('button',{name:'Play study',exact:true})).toBeVisible();
  await expect(page.locator('body')).toHaveAttribute('data-observed-phases','application,operations,shared');
  expect(await actor!.evaluate(el => el.isConnected)).toBe(true);
});

test('stage surfaces unfold around the same application on phone and laptop', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion:'no-preference' });
  const errors:string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const [width,height] of [[360,640],[390,844],[1280,720],[1440,900]]) {
    await page.setViewportSize({ width,height });
    await page.goto(url);
    const actor = await page.locator('[data-actor=application]').elementHandle();
    const poses:string[] = [];
    for (const [name,phase] of [['01 / App','application'],['02 / Behind it','operations'],['03 / Shared','shared']] as const) {
      await page.getByRole('button',{name,exact:true}).click();
      await expect(page.locator('.stage')).toHaveAttribute('data-phase',phase);
      expect(await actor!.evaluate(el => el.isConnected && el === document.querySelector('[data-actor=application]'))).toBe(true);
      poses.push(await page.locator('.application').evaluate(el => getComputedStyle(el).transform));
      if (phase !== 'application') await expect(page.locator('.deploy')).toHaveCSS('opacity','1');
      if (phase === 'shared') await expect(page.locator('.peer-left')).toHaveCSS('opacity','1');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const copy = (await page.locator('.narration').boundingBox())!;
      expect(copy.y).toBeGreaterThan(80);
      expect(copy.y + copy.height).toBeLessThan(height - 70);
      const objects = await page.locator('.application,.plane,.peer,.ground').evaluateAll(elements => elements
        .filter(el => Number(getComputedStyle(el).opacity) > .9)
        .map(el => { const r = el.getBoundingClientRect(); return {name:el.className,top:r.top,bottom:r.bottom,left:r.left,right:r.right}; }));
      for (const object of objects) {
        expect(object.left,`${object.name} at ${width} ${phase}`).toBeGreaterThanOrEqual(0);
        expect(object.right,`${object.name} at ${width} ${phase}`).toBeLessThanOrEqual(width);
        if (width <= 760) {
          expect(object.top,`${object.name} at ${width} ${phase}`).toBeGreaterThanOrEqual(128);
          expect(object.bottom,`${object.name} at ${width} ${phase}`).toBeLessThan(copy.y - 12);
        } else {
          expect(object.top,`${object.name} at ${width} ${phase}`).toBeGreaterThanOrEqual(70);
          expect(object.bottom,`${object.name} at ${width} ${phase}`).toBeLessThan(height - 80);
        }
      }
      await page.screenshot({path:testInfo.outputPath(`${phase}-${width}.png`)});
    }
    expect(new Set(poses).size).toBe(3);
    await page.getByRole('button',{name:'01 / App',exact:true}).click();
    await expect(page.locator('.peer-left')).toHaveCSS('opacity','0');
    await page.getByRole('button',{name:'Play study',exact:true}).click();
    await page.waitForTimeout(500);
    await page.getByRole('button',{name:'Pause study',exact:true}).click();
    const stopped = await page.locator('.stage').getAttribute('data-progress');
    await page.waitForTimeout(120);
    expect(await page.locator('.stage').getAttribute('data-progress')).toBe(stopped);
    await page.getByRole('slider',{name:'Study progress'}).focus();
    await page.keyboard.press('End');
    await expect(page.locator('.stage')).toHaveAttribute('data-phase','shared');
    await page.getByRole('link',{name:'Skip study'}).click();
    await expect(page.locator('#study-end')).toBeInViewport();
  }
  expect(errors).toEqual([]);
});

test('reduced motion gives instant selected views; no JavaScript retains the narrative', async ({ browser }) => {
  const reduced = await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});
  const page = await reduced.newPage();
  await page.goto(url);
  await expect(page.getByRole('button',{name:'Motion reduced'})).toBeDisabled();
  await expect(page.locator('.stage')).toHaveAttribute('data-phase','shared');
  await page.getByRole('button',{name:'01 / App',exact:true}).click();
  await expect(page.locator('.stage')).toHaveAttribute('data-phase','application');
  const p = await page.locator('.stage').getAttribute('data-progress');
  await page.mouse.wheel(0,100);
  await page.waitForTimeout(100);
  expect(await page.locator('.stage').getAttribute('data-progress')).toBe(p);
  await reduced.close();
  const plain = await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:640}});
  const noJS = await plain.newPage();
  await noJS.goto(url);
  await expect(noJS.locator('.transcript li')).toHaveCount(3);
  await expect(noJS.getByRole('link',{name:'Skip study'})).toBeVisible();
  await expect(noJS.locator('.controls')).toBeHidden();
  await plain.close();
});
