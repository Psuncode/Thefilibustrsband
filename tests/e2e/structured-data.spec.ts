import { test, expect, type Page } from "@playwright/test";

const extractJsonLd = async (page: Page): Promise<unknown[]> => {
  return page.$$eval('script[type="application/ld+json"]', (nodes) => {
    const extractItems = (value: unknown): unknown[] => {
      if (!value || typeof value !== "object") return [];
      if (Array.isArray(value)) return value.flatMap(extractItems);
      const obj = value as Record<string, unknown>;
      if (Array.isArray(obj["@graph"])) return obj["@graph"].flatMap(extractItems);
      return [value];
    };

    return nodes.flatMap((node) => {
      try {
        return extractItems(JSON.parse(node.textContent || ""));
      } catch {
        return [];
      }
    });
  });
};

const isItem = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object";

test("for-fans-of detail page emits a FAQPage JSON-LD node", async ({ page }) => {
  const response = await page.goto("/for-fans-of/paramore");
  expect(response?.ok(), "Failed to load /for-fans-of/paramore").toBe(true);
  await page.waitForSelector("main");

  const hasFaqPage = await page.$$eval('script[type="application/ld+json"]', (nodes) => {
    const flatten = (v: unknown): unknown[] => {
      if (!v || typeof v !== "object") return [];
      if (Array.isArray(v)) return v.flatMap(flatten);
      const g = (v as { "@graph"?: unknown })["@graph"];
      if (Array.isArray(g)) return g.flatMap(flatten);
      return [v];
    };
    return nodes
      .flatMap((n) => {
        try { return flatten(JSON.parse(n.textContent || "")); } catch { return []; }
      })
      .some((item) => (item as { "@type"?: string })?.["@type"] === "FAQPage");
  });
  expect(hasFaqPage, "No FAQPage JSON-LD on /for-fans-of/paramore").toBe(true);
});

test("song page emits MusicComposition lyrics schema when lyrics are present", async ({ page }) => {
  await page.goto("/music/break-up-with-your-boyfriend");
  await page.waitForSelector("main");
  const result = await page.$$eval('script[type="application/ld+json"]', (nodes) => {
    const flatten = (v: unknown): unknown[] => {
      if (!v || typeof v !== "object") return [];
      if (Array.isArray(v)) return v.flatMap(flatten);
      const g = (v as { "@graph"?: unknown })["@graph"];
      if (Array.isArray(g)) return g.flatMap(flatten);
      return [v];
    };
    const items = nodes.flatMap((n) => {
      try { return flatten(JSON.parse(n.textContent || "")); } catch { return []; }
    }) as Array<Record<string, unknown>>;
    return { lyricsBlockVisible: !!document.querySelector('[data-lyrics]'), hasComposition: items.some((i) => i["@type"] === "MusicComposition") };
  });
  if (result.lyricsBlockVisible) {
    expect(result.hasComposition, "Lyrics rendered but no MusicComposition schema").toBe(true);
  }
});

test("show detail page emits an Event JSON-LD node", async ({ page }) => {
  await page.goto("/shows");
  await page.waitForSelector('a[href^="/shows/"]');
  const slugRoute = await page
    .locator('a[href^="/shows/"]')
    .evaluateAll((nodes) =>
      Array.from(nodes)
        .map((node) => node.getAttribute("href"))
        .find((href) => href && href !== "/shows" && /^\/shows\/[^/]+\/?$/.test(href))
    );
  expect(slugRoute).toBeTruthy();

  await page.goto(slugRoute!);
  await page.waitForSelector("main");

  const items = await extractJsonLd(page);
  const eventNode = items.find((item) => isItem(item) && item["@type"] === "Event");
  expect(eventNode, `No Event JSON-LD on ${slugRoute}`).toBeTruthy();
});
