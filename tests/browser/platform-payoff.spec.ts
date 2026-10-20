import { test, expect } from '@playwright/test';

test('a single release transforms and joins the team on phone and laptop', async ({ page }) => {
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  for (const [width,height] of [[360,640],[390,844],[1280,720],[1440,900]]) {
    await page.setViewportSize({width,height});await page.goto('/#team');
    const film=page.locator('.platform-film');
    await expect(film).toHaveAttribute('data-motion','true');
    await expect(film).toHaveAttribute('data-scroll','true');
    const release=page.locator('[data-release-actor]');
    await release.evaluate(el=>el.setAttribute('data-original','yes'));
    for (const [i,step] of ['source','build','config','runtime','complete','source'].entries()) {
      await page.locator('[data-platform-seek]').nth(i===5?0:i).click();
      await expect(film).toHaveAttribute('data-step',step);
      await expect(release).toHaveAttribute('data-original','yes');
      await expect(page.locator('.platform-payoff svg')).toBeVisible();
      const stage=await page.locator('.platform-stage').boundingBox();
      expect(Math.round(stage!.y)).toBe(80);
      const actions=await page.locator('.platform-stage-actions').boundingBox();
      expect(actions!.y+actions!.height).toBeLessThanOrEqual(height+1);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
      await page.screenshot({path:`/tmp/platform-payoff-${width}-${step}.png`});
    }
    await page.locator('[data-platform-seek]').nth(4).click();
    await expect(page.locator('.payoff-scope')).toContainText('10 applications');
    await expect(page.locator('[data-payoff-peer][opacity="1"]')).toHaveCount(9);
    const pose=await release.getAttribute('transform');await page.waitForTimeout(150);
    expect(await release.getAttribute('transform')).toBe(pose);
    await page.locator('.platform-stage-actions a').click();await expect(page).toHaveURL(/#platform-details$/);
  }
  expect(errors).toEqual([]);
});

test('reduced motion and no JavaScript retain a complete platform workflow', async ({ browser }) => {
  for(const javaScriptEnabled of [true,false]) {
    const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',javaScriptEnabled});
    const page=await context.newPage();await page.goto('/#team');
    await expect(page.locator('.platform-mobile-flow')).toBeVisible();
    await expect(page.locator('.platform-payoff')).toBeHidden();
    await expect(page.locator('.platform-explanation')).toContainText('Argo CD');
    await expect(page.locator('.team-scope')).toContainText('~11');
    await context.close();
  }
});
