import {test,expect} from '@playwright/test';

test('scroll deals and restores the stack on phone and desktop, with resting cards and an exit',async({page})=>{
 for(const [width,height] of [[360,640],[390,844],[1280,720],[1440,900]]) {
  await page.setViewportSize({width,height});await page.goto('/#cloud-work');
  const track=page.locator('.engineering-stack-track');await expect(track).toHaveAttribute('data-mode','pin');
  for(const [i,index] of [0,1,2,1,0].entries()) {
   await track.locator('.engineering-stack-controls button').nth(index).click();
   const cards=track.locator('[data-engineering-slide]');
   await expect(cards.nth(index)).not.toHaveAttribute('inert');
   for(let n=0;n<3;n++) if(n!==index)await expect(cards.nth(n)).toHaveAttribute('inert','');
   const stage=await track.locator('.engineering-stack-stage').boundingBox();expect(Math.round(stage!.y)).toBe(80);
   const card=await cards.nth(index).boundingBox();expect(card!.y).toBeGreaterThanOrEqual(80);expect(card!.y+card!.height).toBeLessThan(height-70);
   expect(await cards.nth(index).evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBeTruthy();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   if(i===0 || i===1 || i===2)await page.screenshot({path:`/tmp/engineering-stack-${width}-${index}.png`});
  }
  const at=async(p:number)=>{await track.evaluate((el,p)=>{const stage=el.querySelector('.engineering-stack-stage')!;scrollTo(0,el.getBoundingClientRect().top+scrollY-80+(el.clientHeight-stage.clientHeight)*p);},p);await page.waitForTimeout(80);};
  const front=track.locator('#foundation');const restingX=(await front.boundingBox())!.x;
  await at(.31);expect((await front.boundingBox())!.x).toBeLessThan(restingX-20);
  await page.screenshot({path:`/tmp/engineering-stack-${width}-transition.png`});
  await at(.49);await expect(track.locator('.engineering-stack-controls button').nth(1)).toHaveAttribute('aria-pressed','true');
  await at(.08);await expect(front).not.toHaveAttribute('inert');
  const pose=await track.locator('#foundation').getAttribute('style');await page.waitForTimeout(200);expect(await track.locator('#foundation').getAttribute('style')).toBe(pose);
  await track.locator('#foundation').getByRole('link',{name:'Notes',exact:true}).click();await expect(page.locator('#foundation-notes')).toHaveAttribute('open','');
 }
});

test('direct projects, reduced motion and no-JavaScript keep the evidence accessible',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();await page.goto('/#platform');
 await expect(page.locator('#platform')).not.toHaveAttribute('inert');await expect(page.locator('.engineering-stack-controls button').last()).toHaveAttribute('aria-pressed','true');
 await page.locator('.engineering-stack-skip').click();await expect(page).toHaveURL(/#engineering-notes$/);await context.close();
 for(const mode of ['reduced','no-js']) {
  const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',javaScriptEnabled:mode!=='no-js'});const p=await c.newPage();await p.goto('/#cloud-work');
  await expect(p.locator('.engineering-stack-track')).toHaveAttribute('data-mode','static');
  for(const id of ['foundation','delivery','platform'])await expect(p.locator(`#${id}`)).toBeVisible();
  await expect(p.locator('.engineering-stack-controls')).toBeHidden();await c.close();
 }
});
