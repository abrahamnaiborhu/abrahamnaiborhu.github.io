import { expect, test } from '@playwright/test';

test('APN entrance settles, can be skipped, and does not repeat on a return', async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'no-preference' });
  await page.goto('/');
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','playing');
  await page.getByRole('button', {name:'Skip opening'}).click();
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','complete');
  await expect(page.locator('h1')).toHaveText('I like making thingswork together.');
  expect(await page.locator('.opening').evaluate(el => el.getAnimations({subtree:true}).length)).toBe(0);
  await page.reload();
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

test('project illustrations pause at their current state and respect reduced motion', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/#work');
  await expect(page.locator('#work')).toHaveAttribute('data-visible','true');
  const control=page.getByLabel('Animate project illustrations');
  await control.uncheck();
  await page.evaluate(()=>Promise.all(document.querySelector('#work')!.getAnimations({subtree:true}).map(a=>a.ready.then(()=>true))));
  const times=()=>page.locator('#work').evaluate(el=>el.getAnimations({subtree:true}).map(a=>({time:a.currentTime,state:a.playState})));
  const first=await times();expect(first.length).toBe(15);await page.waitForTimeout(200);expect(await times()).toEqual(first);
  await control.focus();await page.keyboard.press('Space');
  await expect.poll(async()=>(await times()).every(a=>a.state==='running')).toBe(true);
  await page.emulateMedia({reducedMotion:'reduce'});await expect.poll(async()=>(await times()).length).toBe(0);
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
    await page.setViewportSize({width:1440+pass,height:1000+pass});
    await page.waitForTimeout(80);
    expect(await detached!.evaluate(el=>el.getAttribute('data-scroll'))).toBe('false');
    await page.getByRole('button',{name:'Mount documentary'}).click();
    await expect(page.locator('h1')).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});

test('desktop keeps project evidence beside narration while phones retain a readable vertical sequence', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:1000});await page.goto('/');
    for(const [copySelector,evidenceSelector] of [['.applications-main .narration','.product-gallery'],['.perspective-main .narration','.responsibility-detail']]) {
      const copy=await page.locator(copySelector).boundingBox();const evidence=await page.locator(evidenceSelector).boundingBox();
      expect(copy).not.toBeNull();expect(evidence).not.toBeNull();
      if(width>1000) {
        expect(evidence!.x).toBeGreaterThanOrEqual(copy!.x+copy!.width);
        expect(Math.min(evidence!.y+evidence!.height,copy!.y+copy!.height)).toBeGreaterThan(Math.max(evidence!.y,copy!.y));
      } else expect(evidence!.y).toBeGreaterThanOrEqual(copy!.y+copy!.height);
    }
  }
});
