import {test,expect} from '@playwright/test';

test('Sattabi shows the contact, hinge and local fallback forward and backward',async({page})=>{
 for(const [width,height] of [[360,640],[390,844],[1280,720],[1440,900]]) {
  await page.setViewportSize({width,height});await page.goto('/#sattabi');
  const track=page.locator('#sattabi .scene-track');
  const seek=async(p:number)=>{
   await track.evaluate((el,p)=>{
    const art=el.querySelector('[data-scrub-art]')!.getBoundingClientRect();
    const caption=el.querySelector('.scene-caption')!.getBoundingClientRect();
    if(el.getAttribute('data-mode')==='pin') {
     const stage=el.querySelector('.scene-stage')!;scrollTo(0,el.getBoundingClientRect().top+scrollY-80+(el.clientHeight-stage.clientHeight)*p);
    } else {
     const start=innerHeight*.9-(caption.bottom-art.top),end=100;
     scrollTo(0,scrollY+art.top-(start-(start-end)*p));
    }
   },p);
   await page.waitForTimeout(350);
  };
  await expect(track).toHaveAttribute('data-mode','pin');
  for(const [p,name] of [[.11,'contact'],[.35,'first-open'],[.54,'offline'],[.74,'local'],[.94,'still-open']] as const) {
   await seek(p);
   const art=track.locator('[data-scrub-art]');
   await expect(art).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   await page.screenshot({path:`/tmp/sattabi-tactile-${width}-${name}.png`});
  }
  await expect(track).toHaveAttribute('data-state','recover');
  await expect(track.locator('[data-part=local]')).toHaveAttribute('opacity','1');
  await expect(track.locator('[data-part=cut]')).toHaveAttribute('opacity','1');
  const finalDoor=await track.locator('[data-part=door]').getAttribute('d');
  await seek(.54);await expect(track).toHaveAttribute('data-state','fail');
  await expect(track.locator('[data-part=local]')).toHaveAttribute('opacity','0');
  await seek(.94);await expect(track.locator('[data-part=door]')).toHaveAttribute('d',finalDoor!);
 }
});
