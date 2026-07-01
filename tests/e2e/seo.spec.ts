import { test, expect, type Page } from "@playwright/test";

// NOTE: do NOT import from src/data/community.ts or src/data/site.ts here — both
// transitively import images via `astro:assets`, which Playwright's loader can't
// parse (it tries to read a .jpg as TS). Source community slugs from the
// image-free lastmod-map mirror instead, and hardcode the two stable constants.
import { communityLastmod } from "../../src/data/lastmod-map.mjs";

const SITE_URL = "https://www.thefilibustersband.com";
const SITE_TITLE = "The Filibusters";

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

const staticRoutes = [
  "/",
  "/shows",
  "/provo-alt-rock-band",
  "/press/ai",
  "/press/epk",
  "/for-fans-of",
  "/for-fans-of/paramore",
  "/listen",
  "/music",
  "/merch",
  "/band/hanna-eyre"
] as const;

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
  for (const { slug } of communityLastmod) {
    test(`SEO tags present on /community/${slug}`, async ({ page }) => {
      const route = `/community/${slug}`;
      const response = await page.goto(route);
      expect(response?.ok(), `Failed to load ${route}`).toBe(true);
      await page.waitForSelector("main");
      await assertSeoTags(page);

      // Title should be present, branded, and specific (post title + site name).
      const title = await page.title();
      expect(title.trim().length, `Empty <title> on ${route}`).toBeGreaterThan(0);
      expect(title, `Title should be branded on ${route}`).toContain(SITE_TITLE);
      expect(
        title.replace(`| ${SITE_TITLE}`, "").trim().length,
        `Title has no post-specific portion on ${route}`
      ).toBeGreaterThan(0);

      // Meta description should be present and non-empty.
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description, `Missing meta description on ${route}`).toBeTruthy();
      expect((description ?? "").trim().length, `Empty meta description on ${route}`).toBeGreaterThan(0);

      // Canonical URL should match the production URL for this route.
      const expectedCanonical = new URL(route, SITE_URL).href;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", expectedCanonical);

      // og:title should match the document <title> (BaseLayout sets them together).
      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute("content");
      expect(ogTitle, `Missing og:title on ${route}`).toBe(title);

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
