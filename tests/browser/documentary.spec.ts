import { expect, test } from '@playwright/test';

test('APN entrance settles, can be skipped, and replays its loading gate on reload', async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'no-preference' });
  await page.goto('/');
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','playing');
  await page.getByRole('button', {name:'Skip opening'}).click();
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','complete');
  await expect(page.locator('h1')).toHaveText('I like making thingswork together.');
  expect(await page.locator('.opening').evaluate(el => el.getAnimations({subtree:true}).length)).toBe(0);
  await page.reload();
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','playing');
  await page.getByRole('button',{name:'Skip opening'}).click();
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','complete');
  await expect(page.getByRole('button',{name:'Skip opening'})).not.toBeVisible();
});

test('scroll drives the platform forward and backward; a stopped scene holds', async ({ page }) => {
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/#team');
  const film=page.locator('.platform-film');
  await expect(film).toHaveAttribute('data-scroll','true');
  const move=async (p:number) => {
    await film.evaluate((el,progress) => {
      const stage=el.querySelector('.platform-stage')!;
      const header=document.querySelector('header')!;
      const start=el.getBoundingClientRect().top+scrollY-header.getBoundingClientRect().height;
      scrollTo(0,start+(el.getBoundingClientRect().height-stage.getBoundingClientRect().height)*progress);
    },p);
    await expect(film).toHaveAttribute('data-step',p<.2?'source':p<.4?'build':p<.6?'config':p<.8?'runtime':'complete');
  };
  await move(.1); await move(.3); await move(.5); await move(.7); await move(.9);
  const held=await film.getAttribute('style');await page.waitForTimeout(250);
  expect(await film.getAttribute('style')).toBe(held);
  await move(.3);await move(.1);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(film).not.toHaveAttribute('data-scroll','true');
  await expect(page.locator('#team .platform-explanation')).toBeVisible();
});

const scrubTo=(page:import('@playwright/test').Page,id:string,p:number)=>page.evaluate(([id,p])=>{
  const track=document.querySelector<HTMLElement>(`#${id} .scene-track`)!;const stage=track.querySelector<HTMLElement>('[data-scrub-stage]')!;
  const header=document.querySelector('header')!.getBoundingClientRect().height;
  scrollTo(0,track.getBoundingClientRect().top+scrollY-header+(track.offsetHeight-stage.offsetHeight)*p);
},[id,p] as const);

test('scroll scrubs each pinned scene forward and backward, holds when stopped and skips ahead', async ({ page }) => {
  for(const [width,height] of [[1440,900],[1280,720]]) {
    await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/#work');
    for(const [id,states] of [['sattabi',['start','fail','recover']],['avad',['start','fail','recover']],['glinsta',['start','fail','recover']],['perspective',['start','change','settled']]] as const) {
      const track=page.locator(`#${id} .scene-track`);await expect(track).toHaveAttribute('data-mode','pin');
      const failure = .5;
      const recovery = .95;
      for(const [p,state] of [[0.1,states[0]],[failure,states[1]],[recovery,states[2]],[failure,states[1]],[0.1,states[0]]] as const) { await scrubTo(page,id,p);await expect(track).toHaveAttribute('data-state',state); }
      const stage=track.locator('[data-scrub-stage]');expect(Math.round((await stage.boundingBox())!.y)).toBe(Math.round(await page.locator('header').evaluate(el=>el.getBoundingClientRect().height)));
      await scrubTo(page,id,0.5);await page.waitForTimeout(700);const held=await track.getAttribute('style');await page.waitForTimeout(300);expect(await track.getAttribute('style')).toBe(held);
      await expect(track.locator('.scene-caption')).toHaveText(/./);
    }
    await scrubTo(page,'sattabi',0.3);await page.locator('#sattabi .scene-foot a').click();await expect(page).toHaveURL(/#avad$/);
  }
});

test('phones pin product films; reduced motion shows complete still frames', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/#work');
  const track=page.locator('#sattabi .scene-track');await expect(track).toHaveAttribute('data-mode','pin');
  expect(await track.locator('[data-scrub-stage]').evaluate(el=>getComputedStyle(el).position)).toBe('sticky');
  await expect(page.locator('#sattabi .scene-foot')).toBeVisible();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(track).toBeHidden();await expect(page.locator('#sattabi .scene-still')).toBeVisible();
  await expect(page.locator('#sattabi .scene-still .scene-frame-caption')).toHaveCount(3);
  await page.emulateMedia({reducedMotion:'no-preference'});await expect(track).toBeVisible();
  await expect(page.locator('#team .platform-payoff')).toBeVisible();
  await page.locator('[data-platform-seek]').first().click();
  await expect(page.locator('.platform-film')).toHaveAttribute('data-step','source');
  await page.locator('[data-platform-seek]').last().click();
  await expect(page.locator('.platform-film')).toHaveAttribute('data-step','complete');
});

test('phone project scenes keep the drawing and its current explanation together', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion:'no-preference' });
  for (const [width, height] of [[360,640], [390,844]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/#work');
    for (const id of ['sattabi', 'avad']) {
      const track = page.locator(`#${id} .scene-track`);
      await expect(track).toHaveAttribute('data-mode', 'pin');
      const art = track.locator('[data-scrub-art]');
      const caption = track.locator('.scene-caption');
      const headingBox = (await track.locator('.scene-product').boundingBox())!;
      const artBox = (await art.boundingBox())!;
      const captionBox = (await caption.boundingBox())!;
      expect(headingBox.y + headingBox.height).toBeLessThanOrEqual(artBox.y);
      expect(captionBox.y - artBox.y - artBox.height).toBeLessThanOrEqual(24);
      for (const [progress, state] of [[0.1,'start'],[0.5,'fail'],[0.95,'recover'],[0.5,'fail']] as const) {
        await scrubTo(page,id,progress);
        await expect(track).toHaveAttribute('data-state', state);
        await expect(track.locator('[data-scrub-caption][data-on]')).toHaveCSS('opacity', '1');
        const drawing = (await art.boundingBox())!;
        const explanation = (await caption.boundingBox())!;
        const headerHeight = await page.locator('header').evaluate(el => el.getBoundingClientRect().height);
        expect(drawing.y).toBeGreaterThanOrEqual(headerHeight);
        expect(explanation.y + explanation.height).toBeLessThanOrEqual(height);
      }
      await page.screenshot({ path:testInfo.outputPath(`${id}-${width}.png`) });
    }
  }
});

test('enabling motion does not replay a completed reduced-motion entrance', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','complete');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(150);
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','complete');
  await expect(page.getByRole('button',{name:'Skip opening'})).not.toBeVisible();
});

test('native motion cleans up across Strict Mode remounts and resize after unmount', async ({ page }) => {
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({reducedMotion:'no-preference'});
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:5174/tests/documentary-harness.html');
  for(let pass=0;pass<3;pass++) {
    const film=page.locator('.platform-film');await expect(film).toHaveAttribute('data-scroll','true');
    const detached=await film.elementHandle();
    await page.getByRole('button',{name:'Unmount documentary'}).click();
    expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
    expect(await detached!.evaluate(el=>el.getAttribute('data-scroll'))).toBe('false');
    expect(await page.evaluate(()=>document.documentElement.classList.contains('scenes-live'))).toBe(false);
    await page.setViewportSize({width:1440+pass,height:1000+pass});
    await page.waitForTimeout(80);
    expect(await detached!.evaluate(el=>el.getAttribute('data-scroll'))).toBe('false');
    await page.getByRole('button',{name:'Mount documentary'}).click();
    await expect(page.locator('h1')).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});

test('desktop keeps each drawing beside its caption while phones put the drawing above its caption', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:1000});await page.goto('/#work');
    for(const [copySelector,evidenceSelector] of [['#sattabi .scene-caption','#sattabi [data-scrub-art]'],['#glinsta .scene-caption','#glinsta [data-scrub-art]']]) {
      await page.locator(copySelector).scrollIntoViewIfNeeded();
      const copy=await page.locator(copySelector).boundingBox();const evidence=await page.locator(evidenceSelector).boundingBox();
      expect(copy).not.toBeNull();expect(evidence).not.toBeNull();
      if(width>1000) {
        expect(evidence!.x).toBeGreaterThanOrEqual(copy!.x+copy!.width);
        expect(Math.min(evidence!.y+evidence!.height,copy!.y+copy!.height)).toBeGreaterThan(Math.max(evidence!.y,copy!.y));
      } else expect(copy!.y).toBeGreaterThanOrEqual(evidence!.y+evidence!.height);
    }
  }
});

test('phones animate the platform while static preferences retain one readable workflow', async ({ browser }) => {
  for(const [width,height] of [[360,640],[390,844],[768,1024],[999,800]]) for(const javaScriptEnabled of [true,false]) for(const reducedMotion of ['no-preference','reduce'] as const) {
    const context=await browser.newContext({javaScriptEnabled,reducedMotion,viewport:{width,height}});const page=await context.newPage();
    await page.goto('/#team');
    const label=`${width}x${height} JS ${javaScriptEnabled} ${reducedMotion}`;
    if(javaScriptEnabled && reducedMotion === 'no-preference') {
      await expect(page.locator('#team .platform-payoff'),label).toBeVisible();
      await expect(page.locator('#team .platform-mobile-flow'),label).toBeHidden();
    } else {
      await expect(page.locator('#team .platform-mobile-flow'),label).toBeVisible();
      await expect(page.locator('#team .platform-payoff'),label).toBeHidden();
    }
    await context.close();
  }
});

test('judgment holds an interruption, uses the fallback, and separates platform recovery limits',async({page})=>{
 for(const [width,height] of [[1440,900],[390,844]]) {
  await page.setViewportSize({width,height});await page.goto('/#judgment');
  const track=page.locator('.judgment-track');await expect(track).toHaveAttribute('data-mode','pin');
  for(const [i,state] of ['primary','cut','continue','cut'].entries()) {
   await track.locator('[data-scene-seek]').nth(i===3?1:i).click();await expect(track).toHaveAttribute('data-state',state);
  }
  await expect(track.locator('[data-part=cut]')).toHaveAttribute('opacity','1');
  await expect(track.locator('[data-part=fallback]')).toHaveAttribute('stroke-dashoffset','1');
  await track.locator('[data-scene-seek]').last().click();
  await expect(track.locator('[data-part=arrival]')).toHaveAttribute('opacity','1');
  await expect(page.locator('#judgment-decisions')).toContainText('backup and restore validation is ongoing');
  await page.screenshot({path:`/tmp/judgment-film-${width}.png`});
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 await expect(page.locator('.judgment-track')).toBeHidden();
 await expect(page.locator('#judgment .scene-frames li')).toHaveCount(3);
});

test('captions change without moving the surrounding copy in pinned scenes', async ({ page }) => {
  for(const [width,height] of [[1440,900],[1024,600]]) {
    await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/#work');
    for(const id of ['sattabi','avad','glinsta','perspective']) {
      await expect(page.locator(`#${id} .scene-track`)).toHaveAttribute('data-mode','pin');
      const positions:string[]=[];
      for(const p of [0.1,0.5,0.95]) {
        await scrubTo(page,id,p);await page.waitForTimeout(500);
        positions.push(await page.locator(`#${id} .scene-track`).evaluate(track=>[...track.querySelectorAll('.scene-product,.starting-command,.scene-dashes,.scene-public,.scene-more')].map(el=>Math.round(el.getBoundingClientRect().top)).join('/')));
      }
      expect(new Set(positions).size,`${id} at ${width}x${height}: ${positions.join(' | ')}`).toBe(1);
    }
  }
});
