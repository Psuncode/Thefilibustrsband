import { test, expect, type Page } from "@playwright/test";

const requiredSeoSelectors = [
  'link[rel="canonical"][href]',
  'meta[name="description"][content]',
  'meta[property="og:title"][content]',
  'meta[property="og:description"][content]',
  'meta[property="og:image"][content]'
] as const;

const assertSeoTags = async (page: Page) => {
  for (const selector of requiredSeoSelectors) {
    await expect(page.locator(selector), `Missing required SEO tag: ${selector}`).toHaveCount(1);
  }
};

const staticRoutes = ["/", "/shows", "/provo-alt-rock-band", "/press/ai"] as const;

for (const route of staticRoutes) {
  test(`SEO tags present on ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.ok(), `Failed to load ${route}`).toBe(true);
    await page.waitForSelector("main");
    await assertSeoTags(page);
  });
}

test("SEO tags present on a dynamic /shows/<slug> route", async ({ page }) => {
  const indexResponse = await page.goto("/shows");
  expect(indexResponse?.ok(), "Failed to load /shows").toBe(true);
  await page.waitForSelector('a[href^="/shows/"]');

  const slugRoute = await page
    .locator('a[href^="/shows/"]')
    .evaluateAll((nodes) =>
      Array.from(nodes)
        .map((node) => node.getAttribute("href"))
        .find((href) => href && href !== "/shows" && /^\/shows\/[^/]+\/?$/.test(href))
    );

  expect(slugRoute, "Could not derive a dynamic show detail route from /shows").toBeTruthy();

  const detailResponse = await page.goto(slugRoute!);
  expect(detailResponse?.ok(), `Failed to load ${slugRoute}`).toBe(true);
  await page.waitForSelector("main");
  await assertSeoTags(page);
});
