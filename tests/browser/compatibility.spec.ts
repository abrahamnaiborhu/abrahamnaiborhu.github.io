import { expect, test } from "@playwright/test";

test("mobile drawer restores keyboard focus and opens the current Resume", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning")
      errors.push(`${message.text()} ${message.location().url}`);
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const menu = page.getByText("Menu", { exact: true });
  const drawer = page.getByRole("dialog", { name: "Navigation" });
  await expect(menu).toHaveAttribute("aria-haspopup", "dialog");
  await menu.click();
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
  await expect(page.locator("#work")).toBeFocused();
  await page.locator(".header-resume").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Abraham Naiborhu");
  const pendingDownload = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download Resume (PDF)" }).click();
  const download = await pendingDownload;
  expect(download.suggestedFilename()).toBe("Abraham-Naiborhu-Resume.pdf");
  expect(await download.failure()).toBeNull();
  await page.getByRole("link", { name: "Contact Abraham" }).click();
  await expect(page.getByRole("link", { name: "Email Abraham" })).toBeInViewport();
  expect(errors).toEqual([]);
});

test("static content and native navigation work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4174/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toHaveCSS("opacity", "1");
    await page.getByText("Menu", { exact: true }).click();
    await page
      .locator(".mobile-navigation")
      .getByRole("link", { name: "Writing", exact: true })
      .click();
    await expect(page).toHaveURL(/#writing$/);
    await expect(page.locator("#writing")).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  } finally {
    await context.close();
  }
});

test("wide desktop keeps content within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator(".desktop-navigation")).toBeVisible();
  await expect(page.locator("h1")).toBeInViewport();
});
