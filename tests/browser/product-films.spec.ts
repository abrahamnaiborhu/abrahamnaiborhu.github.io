import {test,expect} from '@playwright/test';

test('product chapters pin across phone and laptop, with direct beats, exits and stable captions',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 for(const [width,height] of [[360,640],[390,844],[1280,720],[1440,900]]) {
  await page.setViewportSize({width,height});await page.goto('/#sattabi');
  for(const id of ['sattabi','avad','glinsta']) {
   const film=page.locator(`#${id} .scene-track`);await expect(film).toHaveAttribute('data-mode','pin');
   for(const [i,state] of ['start','fail','recover','start'].entries()) {
    await film.locator('[data-scene-seek]').nth(i===3?0:i).click();
    await expect(film).toHaveAttribute('data-state',state);
    const stage=await film.locator('.scene-stage').boundingBox();expect(Math.round(stage!.y)).toBe(80);
    const caption=await film.locator('.scene-caption').boundingBox();const art=await film.locator('.scene-art').boundingBox();
    expect(art!.height).toBeGreaterThanOrEqual(145);
    const exit=await film.locator('.scene-foot').boundingBox();expect(exit!.y+exit!.height).toBeLessThanOrEqual(height+1);
    expect(caption!.y).toBeGreaterThanOrEqual(80);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
    if(i===2) await page.screenshot({path:`/tmp/product-film-${id}-${width}.png`});
   }
  }
 }
 expect(errors).toEqual([]);
});

test('short windows keep interactive beats; reduced motion and no script retain full frames',async({browser})=>{
 for(const mode of ['short','reduced','no-js']) {
  const context=await browser.newContext({viewport:{width:390,height:mode==='short'?480:844},reducedMotion:mode==='reduced'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});
  const page=await context.newPage();await page.goto('/#sattabi');
  if(mode==='short') {
   await expect(page.locator('#sattabi .scene-track')).toHaveAttribute('data-mode','flow');
   for(const [i,state] of ['recover','start','fail'].entries()) {
    await page.locator('#sattabi [data-scene-seek]').nth([2,0,1][i]).click();
    await page.waitForTimeout(150);
    await expect(page.locator('#sattabi .scene-track')).toHaveAttribute('data-state',state);
   }
  } else for(const id of ['sattabi','avad','glinsta']) {
   await expect(page.locator(`#${id} .scene-track`)).toBeHidden();await expect(page.locator(`#${id} .scene-frames li`)).toHaveCount(3);
  }
  await context.close();
 }
});
