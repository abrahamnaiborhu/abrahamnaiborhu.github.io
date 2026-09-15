import { expect, test } from "@playwright/test";

test("visitor can navigate from Work to current Resume, email, and back to top", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "View Engineering Work" }).click();
  await expect(page).toHaveURL(/#work$/);
  await page.locator(".header-resume").click();
  await expect(page).toHaveURL(/\/resume.html$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Abraham Pardomuan Naiborhu");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download Resume (PDF)" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Abraham-Naiborhu-Resume.pdf");
  expect(await download.failure()).toBeNull();
  await page.getByRole("link", { name: "Contact Abraham" }).click();
  const email = page.getByRole("link", { name: "Email Abraham" });
  await email.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(email).toBeFocused();
  await expect(email).toHaveCSS("outline-style", "solid");
  await expect(email).toHaveAttribute("href", "mailto:abrahamnaiborhu@gmail.com");
  await page.keyboard.press("Tab");
  await expect(page.locator("#contact").getByRole("link", { name: "LinkedIn" })).toBeFocused();
  await expect(page.locator("#contact").getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/abrahamnaiborhu",
  );
  await page.keyboard.press("Tab");
  await expect(page.locator("#contact").getByRole("link", { name: "GitHub" })).toBeFocused();
  await page.getByRole("contentinfo").getByRole("link", { name: "Back to top" }).click();
  await expect(page).toHaveURL(/#home$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
});

test("about, contact, and footer remain readable without JavaScript", async ({ browser }) => {
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 1000 },
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4174/#about");
    await expect(page.getByRole("heading", { name: "President University" })).toBeVisible();
    await expect(page.getByText("Professional Working Proficiency")).toBeVisible();
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    await expect(page.locator('a[href$="CV.pdf"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    for (const id of ["about", "contact"]) {
      await page
        .locator(`#${id}`)
        .screenshot({
          path: `docs/rebuild/captures/sprint4-${id}-${width}.png`,
          style: ".navigation-shell, .skip-link { visibility: hidden; }",
        });
    }
    await context.close();
  }
});
