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
  await page.screenshot({ path: "docs/rebuild/captures/sprint2-mobile-drawer.png" });
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

test("signature slice has a conceptual diagram, four credentials, and active anchors", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#writing");
  await expect(page.locator('.desktop-navigation a[href="#writing"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
  await expect(page.getByRole("img", { name: /Conceptual delivery system/ })).toHaveCount(1);
  await expect(page.locator(".credential-strip li")).toHaveCount(4);
  await expect(page.locator(".topology")).toContainText("Conceptual");
  await expect(page.locator(".topology")).toHaveCSS("opacity", "1");
  await expect(page.locator("#hero-title")).toHaveText(
    "I build reliable cloud infrastructure and delivery systems.",
  );
});

test("topology settles, then draws a random branch on a loop, and resets when reduced motion changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const topology = page.locator(".topology");
  await expect(topology).toHaveAttribute("data-motion-state", "running");
  await expect(topology).toHaveAttribute("data-motion-state", "complete", { timeout: 2000 });
  await expect(topology).toHaveCSS("transform", "none");
  await expect(topology).toHaveAttribute("data-ambient", "running");

  // Over several passes the loop must draw both branches, not repeat one side.
  const drawnBranches = await topology.evaluate(
    (element) =>
      new Promise<string[]>((resolve) => {
        const seen = new Set<string>();
        const observer = new MutationObserver((records) => {
          for (const record of records) {
            const path = record.target as SVGPathElement;
            if (path.style.strokeDasharray && parseFloat(path.style.opacity || "0") > 0)
              seen.add(path.dataset.flow!);
          }
        });
        observer.observe(element, { subtree: true, attributes: true, attributeFilter: ["style"] });
        setTimeout(() => {
          observer.disconnect();
          resolve([...seen]);
        }, 28000);
      }),
  );
  expect(drawnBranches).toContain("trunk");
  expect(drawnBranches).toContain("left");
  expect(drawnBranches).toContain("right");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(topology).toHaveAttribute("data-motion-state", "static");
  await expect(topology).toHaveAttribute("data-ambient", "idle");
  for (const path of await page.locator(".flow-emphasis").all())
    await expect(path).toHaveCSS("opacity", "0");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(topology).toHaveAttribute("data-motion-state", "running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(topology).toHaveAttribute("data-motion-state", "static");
  await expect(topology).toHaveCSS("opacity", "1");
});

test("mobile metadata and scaled SVG labels respect the 14px minimum", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  for (const label of await page
    .locator(".topology figcaption, .credential-strip span, .hero-foot a")
    .all()) {
    await expect(label).toHaveCSS("font-size", "14px");
  }
  const svgFontSize = await page.locator(".topology svg").evaluate((svg) => {
    const text = svg.querySelector("text")!;
    return (parseFloat(getComputedStyle(text).fontSize) * svg.getBoundingClientRect().width) / 360;
  });
  expect(svgFontSize).toBeGreaterThanOrEqual(14);
});
