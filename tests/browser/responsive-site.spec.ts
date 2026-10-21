import {test,expect} from '@playwright/test';

const viewports=[[320,568],[360,640],[390,844],[430,932],[768,1024],[844,390],[1024,600],[1280,720],[1440,900],[1920,1080],[2560,1440]];
const chapters=['home','sattabi','avad','glinsta','behind-the-application','perspective','team','judgment','contact','cloud-work','capabilities','experience','certifications','writing','about'];

test('whole site stays usable across narrow, short, tablet and large viewports',async({page})=>{
 test.setTimeout(180000);
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 const findings:string[]=[];
 for(const [width,height] of viewports){
  await page.setViewportSize({width,height});await page.goto('/#home');
  await expect(page.locator('h1')).toBeVisible();
  for(const id of chapters){
   const section=page.locator(`#${id}`);
   if(!await section.count()){findings.push(`missing #${id}`);continue;}
   await section.scrollIntoViewIfNeeded();
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
   if(overflow)findings.push(`${width}x${height} #${id}: horizontal overflow`);
   if([390,1280,2560].includes(width))await page.screenshot({path:`/tmp/site-audit-${width}-${id}.png`});
  }
  for(const id of ['sattabi','avad','glinsta','judgment']){
   const track=page.locator(`#${id} .scene-track`);if(!await track.count())continue;
   for(const index of [2,0]){
    await track.locator('[data-scene-seek]').nth(index).click();
    if(await track.getAttribute('data-mode')==='pin'){
     const stage=await track.locator('.scene-stage').boundingBox();
     const foot=await track.locator('.scene-foot').boundingBox();
     if(!stage||Math.abs(stage.y-80)>2||!foot||foot.y+foot.height>height+2)findings.push(`${width}x${height} #${id}: pinned stage/exit outside viewport`);
    }
   }
  }
  for(const selector of ['.engineering-stack-track','.career-reel']){
   const track=page.locator(selector);const buttons=track.locator('button');
   for(const index of [await buttons.count()-1,0]){
    await buttons.nth(index).click();
    const panel=track.locator(selector.includes('engineering')?'[data-engineering-slide]:not([inert])':'[data-career-panel]:not([inert])');
    const fits=await panel.evaluate(el=>el.scrollHeight<=el.clientHeight+1);
    if(!fits)findings.push(`${width}x${height} ${selector}: active content clipped`);
   }
  }
  const platform=page.locator('.platform-film');
  if(await platform.getAttribute('data-motion')==='true'){
   await platform.locator('[data-platform-seek]').last().click();
   if(await platform.getAttribute('data-scroll')==='true'){
    const actions=await platform.locator('.platform-stage-actions').boundingBox();
    if(!actions||actions.y+actions.height>height+2)findings.push(`${width}x${height}: platform exit clipped`);
   }
  }
 }
 expect(errors,'runtime errors').toEqual([]);
 expect(findings,'responsive findings').toEqual([]);
});

test('touch-sized navigation, chapter controls and resume remain usable',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await context.newPage();await page.goto('/#home');
 await page.getByText('Menu',{exact:true}).tap();
 await page.getByRole('dialog',{name:'Navigation'}).getByRole('link',{name:'Work',exact:true}).tap();
 await expect(page).toHaveURL(/#work$/);
 await page.locator('#sattabi [data-scene-seek]').last().tap();
 await expect(page.locator('#sattabi .scene-track')).toHaveAttribute('data-state','recover');
 await page.locator('#sattabi .scene-foot a').tap();await expect(page).toHaveURL(/#avad$/);
 await page.setViewportSize({width:844,height:390});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await context.close();
 for(const [width,height] of [[320,568],[1024,600],[2560,1440]]){
  const c=await browser.newContext({viewport:{width,height}});const p=await c.newPage();await p.goto('/resume.html');
  await expect(p.getByRole('heading',{level:1})).toHaveText('Abraham Naiborhu');
  expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await expect(p.getByRole('link',{name:'Download Resume (PDF)'})).toBeVisible();await c.close();
 }
});
