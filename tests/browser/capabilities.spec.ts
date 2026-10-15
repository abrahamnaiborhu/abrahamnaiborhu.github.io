import { expect, test } from '@playwright/test';

test('supporting technology inventory remains readable without displacing the main story', async ({ browser }) => {
  for(const width of [390,768,1440]) {
    const context=await browser.newContext({javaScriptEnabled:false,viewport:{width,height:1000}});const page=await context.newPage();
    await page.goto('http://127.0.0.1:4174/#capabilities');
    const section=page.locator('#capabilities');await expect(section.locator('dt')).toHaveCount(4);
    for(const name of ['Cloud Infrastructure','Platform & DevOps','Kubernetes & Linux','Software Engineering']) await expect(section.getByText(name,{exact:true})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await page.evaluate(()=>document.querySelector('#work')!.compareDocumentPosition(document.querySelector('#capabilities')!)&Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
    await context.close();
  }
});
