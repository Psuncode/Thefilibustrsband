import { test, expect } from "@playwright/test";

test.describe("Visual regression (mobile viewport)", () => {
  test("home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("main");
    // Wait for fonts + images to settle; Playwright stabilizes by default but we add a beat for the marquee.
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("home.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: "disabled"
    });
  });
});
