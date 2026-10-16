import { expect, test } from "@playwright/test";

test("mobile drawer manages focus, Escape, scroll lock, navigation and resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByText("Menu", { exact: true });
  const drawer = page.getByRole("dialog", { name: "Navigation" });
  await expect(menu).toHaveAttribute("aria-haspopup", "dialog");
  await menu.click();
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Close menu" })).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Shift+Tab");
  await expect(drawer.getByRole("link", { name: "Resume" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(menu).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await menu.click();
  await drawer.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(drawer).not.toBeVisible();
  await expect(page.locator("#work")).toBeFocused();
  const scrollBefore = await page.evaluate(() => scrollY);
  await menu.click();
  await page.screenshot({ path: "docs/rebuild/production-captures/sprint2-mobile-drawer.png" });
  await page.keyboard.press("Escape");
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
  await menu.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(drawer).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator(".desktop-navigation a").first()).toBeFocused();
});

test("mobile navigation works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4174/");
  await page.getByText("Menu", { exact: true }).click();
  await page
    .locator(".mobile-navigation")
    .getByRole("link", { name: "Writing", exact: true })
    .click();
  await expect(page).toHaveURL(/#writing$/);
  await context.close();
});

test('accepted portrait, product interaction and chapter links replace the old topology hero', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/#writing');
  await expect(page.locator('.desktop-navigation a[href="#writing"]')).toHaveAttribute('aria-current','location');
  await expect(page.locator('.opening-portrait img')).toHaveAttribute('alt','Portrait of Abraham Naiborhu');
  await expect(page.locator('#sattabi .scene-frames svg').first()).toHaveAccessibleName(/card.*reader.*door/i);
  await expect(page.locator('.certification-grid li')).toHaveCount(4);
  await expect(page.locator('h1')).toHaveText('I like making thingswork together.');
});

test('product scenes never play on their own: no running animations in the Work chapter', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/#work');
  await expect(page.locator('#sattabi .scene-track')).toHaveAttribute('data-mode',/pin|flow/);
  await page.waitForTimeout(400);
  expect(await page.locator('#work').evaluate(el=>el.getAnimations({subtree:true}).length)).toBe(0);
  const before=await page.locator('#sattabi [data-scrub-art]').innerHTML();await page.waitForTimeout(500);
  expect(await page.locator('#sattabi [data-scrub-art]').innerHTML()).toBe(before);
});

test('mobile metadata and project captions remain readable', async ({ page }) => {
  await page.setViewportSize({width:320,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  const labels=await page.locator('.opening-context span,.scene-product,.scene-role,.scene-public a,.scene-public span,.scene-frame-caption').all();
  expect(labels.length).toBeGreaterThan(20);
  for(const label of labels) expect(parseFloat(await label.evaluate(el=>getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(14);
  await expect(page.locator('#team .platform-mobile-flow')).toBeVisible();
});
