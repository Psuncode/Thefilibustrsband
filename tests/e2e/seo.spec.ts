import { test, expect, type Page } from "@playwright/test";

import { communityPosts } from "../../src/data/community";
import { siteMeta } from "../../src/data/site";

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

test.describe("SEO tags on /community/<slug> detail pages", () => {
  for (const post of communityPosts) {
    test(`SEO tags present on /community/${post.slug}`, async ({ page }) => {
      const route = `/community/${post.slug}`;
      const response = await page.goto(route);
      expect(response?.ok(), `Failed to load ${route}`).toBe(true);
      await page.waitForSelector("main");
      await assertSeoTags(page);

      // Title should contain the post title.
      await expect(page).toHaveTitle(new RegExp(post.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

      // Meta description should be present and non-empty.
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description, `Missing meta description on ${route}`).toBeTruthy();
      expect((description ?? "").trim().length, `Empty meta description on ${route}`).toBeGreaterThan(0);

      // Canonical URL should match the production URL for this route.
      const expectedCanonical = new URL(route, siteMeta.url).href;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", expectedCanonical);

      // og:title should contain the post title.
      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute("content");
      expect(ogTitle, `Missing og:title on ${route}`).toBeTruthy();
      expect(ogTitle).toContain(post.title);

      // og:description should be present and non-empty.
      const ogDescription = await page
        .locator('meta[property="og:description"]')
        .getAttribute("content");
      expect(ogDescription, `Missing og:description on ${route}`).toBeTruthy();
      expect((ogDescription ?? "").trim().length, `Empty og:description on ${route}`).toBeGreaterThan(0);

      // og:url should match the canonical URL.
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        expectedCanonical
      );

      // twitter:card should be present.
      await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
      const twitterCard = await page
        .locator('meta[name="twitter:card"]')
        .getAttribute("content");
      expect(twitterCard, `Missing twitter:card on ${route}`).toBeTruthy();
    });
  }
});
