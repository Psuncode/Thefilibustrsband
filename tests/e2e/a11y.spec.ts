import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/shows", "/community", "/about", "/press"] as const;

for (const route of routes) {
  test(`a11y: ${route} has no serious or critical axe violations`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.ok(), `Failed to load ${route}`).toBe(true);
    await page.waitForSelector("main");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );

    if (blocking.length > 0) {
      console.log(`${route} violations:`, JSON.stringify(blocking, null, 2));
    }
    expect(blocking, `${blocking.length} serious/critical a11y violations on ${route}`).toHaveLength(0);
  });
}
