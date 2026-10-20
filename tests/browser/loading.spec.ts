import { test, expect } from '@playwright/test';

test('APN holds for the portrait download, then hands over with scrolling unlocked', async ({ page }) => {
  let release!:()=>void;const waiting=new Promise<void>(resolve=>{release=resolve;});
  await page.route('**/assets/abraham.png',async route=>{await waiting;await route.continue();});
  try {
    await page.goto('/',{waitUntil:'domcontentloaded'});
    await expect(page.locator('.opening')).toHaveAttribute('data-opening','playing');
    await page.waitForTimeout(2000);
    await expect(page.locator('.opening')).toHaveAttribute('data-loading','pending');
    await expect(page.locator('.opening-portrait')).toHaveCSS('opacity','0');
    await expect(page.locator('html')).toHaveCSS('overflow','hidden');
    expect((await page.locator('.identity .apn-mark').boundingBox())!.width).toBeGreaterThan(200);
    release();
    await expect(page.locator('.opening')).toHaveAttribute('data-loading','ready');
    expect(await page.locator('.opening-portrait img').evaluate(image=>(image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('.opening')).toHaveAttribute('data-opening','complete');
    await expect(page.locator('html')).not.toHaveCSS('overflow','hidden');
  } finally {release();}
});

test('decoding and font readiness both gate handoff; top reload uses the gate again', async ({ page }) => {
  await page.addInitScript(() => {
    let releaseDecode!:()=>void;
    const decoded = new Promise<void>(resolve=>{releaseDecode=resolve;});
    const original=HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode=async function() {await original.call(this);await decoded;};
    let releaseFonts!:()=>void;
    const fonts = new Promise<void>(resolve=>{releaseFonts=resolve;});
    Object.defineProperty(document.fonts,'ready',{value:fonts});
    Object.assign(window,{releaseDecode,releaseFonts});
  });
  await page.goto('/');
  await expect(page.locator('.opening')).toHaveAttribute('data-loading','pending');
  await page.evaluate(()=>Reflect.get(window,'releaseDecode')());
  await expect(page.locator('.opening')).toHaveAttribute('data-loading','pending');
  await page.evaluate(()=>Reflect.get(window,'releaseFonts')());
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','complete');
  await page.reload();
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','playing');
  await expect(page.locator('.opening')).toHaveAttribute('data-loading','pending');
  await page.getByRole('button',{name:'Skip opening'}).click();
  await expect(page.locator('html')).not.toHaveCSS('overflow','hidden');
});

test('failed images and a stuck dependency cannot trap a visitor', async ({ page }) => {
  await page.route('**/assets/abraham.png',route=>route.abort());
  await page.goto('/');
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','complete');
  await page.addInitScript(()=>Object.defineProperty(document.fonts,'ready',{value:new Promise(()=>{})}));
  await page.reload();
  await expect(page.locator('.opening')).toHaveAttribute('data-loading','timeout',{timeout:10000});
  await expect(page.locator('.opening')).toHaveAttribute('data-opening','complete');
  await expect(page.locator('html')).not.toHaveCSS('overflow','hidden');
});
