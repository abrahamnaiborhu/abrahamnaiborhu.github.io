import {test,expect} from '@playwright/test';

test('scrolling a product does not rewrite dormant chapters, and a stopped frame stays idle',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/#sattabi');await page.waitForTimeout(500);
 await page.evaluate(()=>{
  const counts:Record<string,number>={};
  const observer=new MutationObserver(records=>{
   for(const record of records) {
    const el=record.target as Element;
    const chapter=el.closest('.product-scene,#perspective,#judgment,.unfold,.platform-film');
    if(chapter) {const key=chapter.id||'platform';counts[key]=(counts[key]||0)+1;}
   }
  });
  observer.observe(document.querySelector('main')!,{attributes:true,subtree:true});
  Object.assign(window,{motionWrites:counts,motionObserver:observer});
 });
 await page.locator('#sattabi .scene-track').evaluate(async track=>{
  const stage=track.querySelector('.scene-stage')!;
  const start=track.getBoundingClientRect().top+scrollY-80,range=track.clientHeight-stage.clientHeight;
  for(let i=0;i<60;i++) {scrollTo(0,start+range*(.1+.6*i/59));await new Promise(requestAnimationFrame);}
 });
 await page.waitForTimeout(700);
 const counts=await page.evaluate(()=>({...Reflect.get(window,'motionWrites')}));
 expect(counts.sattabi).toBeGreaterThan(0);
 for(const id of ['avad','glinsta','perspective','judgment','platform','behind-the-application']) expect(counts[id]??0,id).toBe(0);
 await page.waitForTimeout(250);
 expect(await page.evaluate(()=>({...Reflect.get(window,'motionWrites')}))).toEqual(counts);
 await page.evaluate(()=>Reflect.get(window,'motionObserver').disconnect());
});
