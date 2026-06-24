import { test, expect } from "@playwright/test";

test.describe("Visual regression (mobile viewport)", () => {
  // Screenshot baselines are platform-specific and only a macOS (darwin) baseline
  // is committed, so this can't pass on CI's Linux runner. Run it locally on macOS;
  // skip in CI until a Linux baseline is generated and committed there.
  test.skip(!!process.env.CI, "Visual baseline is darwin-only; run locally (see snapshots dir).");

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
