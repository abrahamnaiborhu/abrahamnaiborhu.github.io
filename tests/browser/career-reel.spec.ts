import {test,expect} from '@playwright/test';

test('career reel moves chronologically, reverses, fits and exits',async({page})=>{
 for(const [width,height] of [[390,844],[1280,720],[360,640],[1280,520]]){
  await page.setViewportSize({width,height});await page.goto('/#experience');
  const reel=page.locator('.career-reel');await expect(reel).toHaveAttribute('data-mode',height===520?'manual':'pin');
  for(const i of [0,1,2,3,1,0]){
   await reel.locator('button').nth(i).click();
   await expect(reel.locator('button').nth(i)).toHaveAttribute('aria-pressed','true');
   const panel=reel.locator('[data-career-panel]').nth(i);await expect(panel).not.toHaveAttribute('inert');
   expect(await panel.evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBeTruthy();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
  if(height!==520){
   await reel.evaluate(el=>{const stage=el.querySelector('.career-reel-stage')!;scrollTo(0,el.getBoundingClientRect().top+scrollY-80+(el.clientHeight-stage.clientHeight)*.205);});
   await expect.poll(()=>reel.locator('[data-career-panel]').first().evaluate(el=>getComputedStyle(el).transform)).not.toBe('matrix(1, 0, 0, 1, 0, 0)');
   await expect.poll(()=>reel.evaluate(el=>Number(el.style.getPropertyValue('--career-position')))).toBeCloseTo(.205*3,2);
   const offset=await reel.locator('[data-career-panel]').first().evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m42);
   expect(Math.abs(offset)).toBeLessThanOrEqual(56);
   const pose=await reel.getAttribute('style');await page.waitForTimeout(150);expect(await reel.getAttribute('style')).toBe(pose);
   await page.screenshot({path:`/tmp/career-reel-${width}-moving.png`});
   await reel.evaluate(el=>{const stage=el.querySelector('.career-reel-stage')!;scrollTo(0,el.getBoundingClientRect().top+scrollY-80+(el.clientHeight-stage.clientHeight)*.94);});
   await expect(reel.locator('button').last()).toHaveAttribute('aria-pressed','true');
   await page.screenshot({path:`/tmp/career-reel-${width}-final.png`});
  }
  await reel.locator('.career-reel-exit').click();await expect(page).toHaveURL(/#career-responsibilities$/);
  if(await page.locator('#career-responsibilities details').getAttribute('open')===null)await page.locator('#career-responsibilities summary').click();await expect(page.locator('#career-responsibilities li').first()).toBeVisible();
 }
});

test('reduced motion and no script show the complete chronological career',async({browser})=>{
 for(const noJS of [false,true]){
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',javaScriptEnabled:!noJS});
  const page=await context.newPage();await page.goto('/#experience');
  await expect(page.locator('.career-reel')).toHaveAttribute('data-mode','static');
  await expect(page.locator('.career-reel-rail')).toBeHidden();
  await expect(page.locator('[data-career-panel]')).toHaveCount(4);
  for(const panel of await page.locator('[data-career-panel]').all())await expect(panel).not.toHaveAttribute('inert');
  await page.locator('#career-responsibilities summary').click();await expect(page.locator('#career-responsibilities details')).toHaveAttribute('open','');
  await context.close();
 }
});

test('rail reaches the actual checkpoints on large screens and after resizing',async({page})=>{
 await page.goto('/#experience');
 for(const [width,height] of [[2560,1440],[1920,1080],[390,844]]){
  await page.setViewportSize({width,height});
  const reel=page.locator('.career-reel');await expect(reel).toHaveAttribute('data-mode','pin');
  for(const position of [0,.6,1,1.6,2,3,1,0]){
   await reel.evaluate((el,position)=>{const stage=el.querySelector('.career-reel-stage')!;scrollTo(0,el.getBoundingClientRect().top+scrollY-80+(el.clientHeight-stage.clientHeight)*position/3);},position);
   await expect.poll(()=>reel.evaluate(el=>Number(el.style.getPropertyValue('--career-position')))).toBeCloseTo(position,2);
   const geometry=await reel.locator('.career-reel-rail').evaluate(el=>{
    const railTop=el.getBoundingClientRect().top;
    const line=getComputedStyle(el,'::after'),base=getComputedStyle(el,'::before');
    const dots=[...el.querySelectorAll('.career-rail-dot')].map(dot=>{const r=dot.getBoundingClientRect();return r.top+r.height/2-railTop;});
    const reached=[...el.querySelectorAll('button')].map(button=>button.dataset.reached==='true');
    return {top:parseFloat(line.top),end:parseFloat(line.top)+parseFloat(line.height),bottom:parseFloat(base.top)+parseFloat(base.height),dots,reached};
   });
   expect(Math.abs(geometry.top-geometry.dots[0])).toBeLessThan(1);
   expect(Math.abs(geometry.bottom-geometry.dots[3])).toBeLessThan(1);
   const segment=Math.min(2,Math.floor(position));
   const expected=geometry.dots[segment]+(geometry.dots[segment+1]-geometry.dots[segment])*(position-segment);
   expect(Math.abs(geometry.end-expected)).toBeLessThan(1);
   geometry.reached.forEach((reached,i)=>expect(reached).toBe(position>=i));
  }
  await page.screenshot({path:`/tmp/career-checkpoints-${width}.png`});
 }
});
