import {test,expect} from '@playwright/test';

test('judgment keeps its interruption and exit readable in compact viewports',async({page})=>{
 for(const [width,height] of [[360,640],[1280,720]]) {
  await page.setViewportSize({width,height});await page.goto('/#judgment');
  const film=page.locator('.judgment-track');await expect(film).toHaveAttribute('data-mode','pin');
  await film.locator('[data-scene-seek]').nth(1).click();await expect(film).toHaveAttribute('data-state','cut');
  const pose=await film.locator('[data-part=request]').getAttribute('transform');await page.waitForTimeout(180);
  expect(await film.locator('[data-part=request]').getAttribute('transform')).toBe(pose);
  const exit=await film.locator('.scene-foot').boundingBox();expect(exit!.y+exit!.height).toBeLessThanOrEqual(height);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await film.locator('[data-scene-seek]').last().click();await expect(film).toHaveAttribute('data-state','continue');
  await film.locator('.scene-foot a').click();await expect(page).toHaveURL(/#judgment-decisions$/);
  await expect(page.locator('.judgment-decision-grid')).toContainText('single database writer');
 }
});

test('judgment ships the complete story and honest recovery limits without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page=await context.newPage();await page.goto('/#judgment');
 await expect(page.locator('.judgment-track')).toBeHidden();await expect(page.locator('#judgment .scene-frames li')).toHaveCount(3);
 await expect(page.locator('#judgment-decisions')).toContainText('backup and restore validation is ongoing');
 await expect(page.locator('.judgment-next')).toHaveAttribute('href','#contact');
 await context.close();
});
