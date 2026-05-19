# SEO Refinements Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining medium- and low-severity findings from the 2026-05-19 SEO audit — BreadcrumbList JSON-LD on detail pages, dynamic og:image dimensions, a richer robots meta, a standard og:type for events, and basic mobile/PWA discovery signals (theme-color, apple-touch-icon).

**Architecture:** Almost entirely BaseLayout + detail-page edits. One new helper (`src/lib/seo/breadcrumb.ts`) emits the JSON-LD object from a typed list of crumbs. Detail pages compose breadcrumbs alongside their existing structured data. og:image dimensions become optional props with the current 1200×1500 defaults.

**Tech Stack:** Astro 5.5, TypeScript, existing structured-data helpers in `src/data/site.ts`. No new dependencies.

**Out of Scope** (deferred):
- Self-hosted Google Fonts via Astro Fonts API.
- Full PWA manifest (`manifest.webmanifest`).
- Real PNG `apple-touch-icon` artwork (use the SVG favicon as fallback for now; design hand-off can replace later).
- Sanity-driven `lastmod` (already shipped in the Astro modernization phase).
- Additional schema types beyond `BreadcrumbList` + `Article`.

---

## File Map

**Create:**
- `src/lib/seo/breadcrumb.ts` — `buildBreadcrumbList(items)` helper returning a Schema.org `BreadcrumbList` JSON-LD object.
- `tests/breadcrumb.test.mjs` — node:test cases for the helper.

**Modify:**
- `src/layouts/BaseLayout.astro` — accept optional `ogImageWidth` / `ogImageHeight` / `themeColor` props with defaults; add `<meta name="robots">`, `<meta name="theme-color">`, `<link rel="apple-touch-icon">`; broaden the `ogType` union to include `"music.event"`.
- `src/pages/shows/[slug].astro` — pass `ogType="music.event"`, pass flyer dimensions to `ogImage`/`ogImageWidth`/`ogImageHeight`, add a `BreadcrumbList` to the structured-data array.
- `src/pages/community/[slug].astro` — pass `BreadcrumbList` + `Article` structured data.

---

### Task 1: `buildBreadcrumbList` helper + tests

**Files:**
- Create: `src/lib/seo/breadcrumb.ts`
- Create: `tests/breadcrumb.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `tests/breadcrumb.test.mjs`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildBreadcrumbList } from "../src/lib/seo/breadcrumb.ts";

const SITE = "https://www.thefilibustersband.com";

test("builds a 3-item BreadcrumbList", () => {
  const out = buildBreadcrumbList(SITE, [
    { name: "Home", path: "/" },
    { name: "Shows", path: "/shows" },
    { name: "Utah Arts Festival 2026", path: "/shows/utah-arts-festival-2026" }
  ]);

  assert.equal(out["@context"], "https://schema.org");
  assert.equal(out["@type"], "BreadcrumbList");
  assert.equal(out.itemListElement.length, 3);

  const [first, second, third] = out.itemListElement;
  assert.equal(first.position, 1);
  assert.equal(first.name, "Home");
  assert.equal(first.item, "https://www.thefilibustersband.com/");
  assert.equal(second.position, 2);
  assert.equal(second.item, "https://www.thefilibustersband.com/shows");
  assert.equal(third.position, 3);
  assert.equal(third.item, "https://www.thefilibustersband.com/shows/utah-arts-festival-2026");
});

test("trims trailing slashes except for root", () => {
  const out = buildBreadcrumbList(SITE, [
    { name: "Home", path: "/" },
    { name: "Community", path: "/community/" }
  ]);
  assert.equal(out.itemListElement[0].item, "https://www.thefilibustersband.com/");
  assert.equal(out.itemListElement[1].item, "https://www.thefilibustersband.com/community");
});

test("throws on empty crumbs", () => {
  assert.throws(() => buildBreadcrumbList(SITE, []), /at least one crumb/i);
});
```

- [ ] **Step 2: Run the test → FAIL** (`Cannot find module .../breadcrumb.ts`)

```bash
node --test tests/breadcrumb.test.mjs
```

- [ ] **Step 3: Implement the helper**

Create `src/lib/seo/breadcrumb.ts`:

```typescript
export type BreadcrumbCrumb = {
  name: string;
  path: string;
};

export type BreadcrumbList = {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
};

const normalizePath = (path: string): string => {
  if (path === "/") return "/";
  return path.replace(/\/+$/, "");
};

export const buildBreadcrumbList = (
  siteOrigin: string,
  crumbs: ReadonlyArray<BreadcrumbCrumb>
): BreadcrumbList => {
  if (crumbs.length === 0) {
    throw new Error("buildBreadcrumbList requires at least one crumb");
  }
  const origin = siteOrigin.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${origin}${normalizePath(crumb.path)}`
    }))
  };
};
```

- [ ] **Step 4: Run the test → PASS**

```bash
node --test tests/breadcrumb.test.mjs
```

Expect: 3/3 pass.

- [ ] **Step 5: Run the full suite to confirm no regressions**

```bash
npm test
```

Expect: 17→20 tests (3 new), all pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo/breadcrumb.ts tests/breadcrumb.test.mjs
git commit -m "feat(seo): add buildBreadcrumbList helper"
```

---

### Task 2: BaseLayout — dynamic og:image dims + robots meta + theme-color + apple-touch-icon + music.event

**Files:** `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Broaden the Props interface and accept new optional fields**

In the frontmatter `interface Props { ... }`, change to:

```typescript
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: "website" | "article" | "music.event";
  themeColor?: string;
  structuredData?: StructuredDataValue | StructuredDataValue[];
}
```

Update the destructuring + defaults:

```typescript
const {
  title,
  description,
  ogImage,
  ogImageWidth = 1200,
  ogImageHeight = 1500,
  ogType = "website",
  themeColor = "#ce2067",
  structuredData = []
} = Astro.props;
```

(`#ce2067` is the existing `--color-pink` brand value from `src/styles/global.css:9`.)

- [ ] **Step 2: Update the head markup**

In the `<head>` block, change:

```astro
    <meta property="og:image" content={resolvedOgImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="1500" />
```

to:

```astro
    <meta property="og:image" content={resolvedOgImage} />
    <meta property="og:image:width" content={String(ogImageWidth)} />
    <meta property="og:image:height" content={String(ogImageHeight)} />
```

Then, immediately after the existing `<meta name="viewport" ... />` line and BEFORE the font preconnects, add:

```astro
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="theme-color" content={themeColor} />
```

After the existing `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`, add:

```astro
    <link rel="apple-touch-icon" href="/favicon.svg" />
```

(Apple's WebKit prefers a 180×180 PNG, but a SVG fallback works in modern iOS. A future asset pass can replace with a proper PNG.)

- [ ] **Step 3: Build to confirm**

```bash
npm run build
```

Expect: succeeds. Open `dist/index.html` and confirm the new `<meta>` tags + `apple-touch-icon` link appear in `<head>`, and the og:image dimensions still read 1200 / 1500.

- [ ] **Step 4: Spot-check that ogType still rejects unknown strings**

Run: `npx astro check 2>&1 | grep -i ogtype || echo "no new errors"`. Expect: "no new errors". (Show detail still passes the now-invalid `"event"` — but that page is updated in Task 3 below; if astro check flags it now, that's fine — we'll fix it in the next commit.)

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(seo): dynamic og:image dims + robots/theme-color/apple-touch-icon"
```

---

### Task 3: Show detail — `music.event` + dynamic og:image + BreadcrumbList

**Files:** `src/pages/shows/[slug].astro`

- [ ] **Step 1: Inspect current `<BaseLayout>` call**

```bash
grep -n "<BaseLayout\|ogType\|ogImage\|structuredData\|flyerUrl" src/pages/shows/[slug].astro | head -20
```

Confirm the page passes `ogType="event"` and `structuredData={eventStructuredData}`.

- [ ] **Step 2: Build the BreadcrumbList**

Near the top of the frontmatter (after other imports), add:

```typescript
import { buildBreadcrumbList } from "../../lib/seo/breadcrumb";
```

After the existing `eventStructuredData` definition, add:

```typescript
const breadcrumbStructuredData = buildBreadcrumbList(Astro.site!.toString(), [
  { name: "Home", path: "/" },
  { name: "Shows", path: "/shows" },
  { name: show.title, path: `/shows/${show.slug}` }
]);
```

Then change `structuredData={eventStructuredData}` to:

```astro
  structuredData={[eventStructuredData, breadcrumbStructuredData]}
```

- [ ] **Step 3: Switch to `music.event` and pass flyer dimensions**

Change the `<BaseLayout>` opening tag attributes:

- `ogType="event"` → `ogType="music.event"`
- Add `ogImage={show.flyerUrl}` if not already present (the page currently uses BaseLayout's default — verify by grep; only add if missing).
- Add `ogImageWidth={1200}` and `ogImageHeight={1500}` (matches the existing flyer aspect — Task 8 of the a11y phase locked 1200×1500 / 4:5).

After the change the opening tag should read approximately:

```astro
<BaseLayout
  title={`${show.title} | ${siteMeta.title}`}
  description={show.seoDescription || show.summary}
  ogImage={show.flyerUrl}
  ogImageWidth={1200}
  ogImageHeight={1500}
  ogType="music.event"
  structuredData={[eventStructuredData, breadcrumbStructuredData]}
>
```

Preserve any other existing props.

- [ ] **Step 4: Build and inspect**

```bash
npm run build
```

Then open `dist/shows/utah-arts-festival-2026/index.html` and grep for `BreadcrumbList`:

```bash
grep -A2 BreadcrumbList dist/shows/utah-arts-festival-2026/index.html | head -20
```

Expect: a `BreadcrumbList` JSON-LD block with three `ListItem` entries. Also confirm `og:type` is `music.event` and `og:image:width` / `og:image:height` reflect 1200 / 1500.

- [ ] **Step 5: Commit**

```bash
git add src/pages/shows/[slug].astro
git commit -m "feat(seo): show detail uses music.event + ships BreadcrumbList"
```

---

### Task 4: Community detail — BreadcrumbList + Article schema

**Files:** `src/pages/community/[slug].astro`

- [ ] **Step 1: Add the BreadcrumbList**

In the frontmatter, add:

```typescript
import { buildBreadcrumbList } from "../../lib/seo/breadcrumb";
```

After the existing `dateFormatter` definition, add:

```typescript
const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.summary,
  datePublished: post.publishedAt,
  image: post.heroImageUrl,
  url: new URL(`/community/${post.slug}`, Astro.site).href,
  author: {
    "@type": "MusicGroup",
    name: siteMeta.title,
    url: siteMeta.url
  },
  publisher: {
    "@type": "MusicGroup",
    name: siteMeta.title,
    url: siteMeta.url
  }
};

const breadcrumbStructuredData = buildBreadcrumbList(Astro.site!.toString(), [
  { name: "Home", path: "/" },
  { name: "Community", path: "/community" },
  { name: post.title, path: `/community/${post.slug}` }
]);
```

If `siteMeta` is not already imported in this file, add it:

```typescript
import { siteMeta } from "../../data/site";
```

(Run `grep -n "siteMeta" src/pages/community/\[slug\].astro` first to confirm.)

- [ ] **Step 2: Pass them to `<BaseLayout>`**

Change the `<BaseLayout>` opening tag to add the structuredData prop:

```astro
<BaseLayout
  title={`${post.title} | ${siteMeta.title}`}
  description={post.summary}
  ogImage={post.heroImageUrl}
  ogType="article"
  structuredData={[articleStructuredData, breadcrumbStructuredData]}
>
```

Adapt to whatever existing attributes are there — preserve them and add the four shown.

- [ ] **Step 3: Build and inspect**

```bash
npm run build
grep -A2 BreadcrumbList dist/community/break-up-with-your-boyfriend-out-now/index.html | head -20
grep -A2 '"Article"' dist/community/break-up-with-your-boyfriend-out-now/index.html | head -20
```

Expect: BOTH the `BreadcrumbList` (three crumbs: Home → Community → post title) AND the `Article` schema appear in the page's structured data.

- [ ] **Step 4: Run the test suite**

```bash
npm test
```

Expect: all tests pass (we didn't add new tests in T3/T4, but T1's tests must continue passing).

- [ ] **Step 5: Commit**

```bash
git add src/pages/community/[slug].astro
git commit -m "feat(seo): community detail ships Article + BreadcrumbList JSON-LD"
```

---

### Task 5: Full-suite verification + Rich Results sanity check

- [ ] **Step 1: Run all gates**

```bash
npm run check 2>&1 | tail -5
npm test
npm run build
npm run verify:seo
```

- `check`: pre-existing 15 errors in untouched files remain; no NEW errors.
- `test`: 20/20 pass.
- `build`: 18 pages, succeeds.
- `verify:seo`: exits 0.

- [ ] **Step 2: Spot-check sitemap unchanged**

```bash
head -20 dist/sitemap-0.xml
```

Confirm: `lastmod` values still real (this phase does not touch the sitemap pipeline).

- [ ] **Step 3: Spot-check robots + theme-color appear on every page**

```bash
grep -l 'name="robots"' dist/**/index.html | wc -l
grep -l 'name="theme-color"' dist/**/index.html | wc -l
```

Both counts should match the total page count (~18).

- [ ] **Step 4: Sanity check og:type on show detail**

```bash
grep 'og:type' dist/shows/utah-arts-festival-2026/index.html
```

Expect: `<meta property="og:type" content="music.event">`.

- [ ] **Step 5: Future verification (manual, not in CI)**

In a follow-up after PR merge:
- Paste a deployed show URL into Google Rich Results Test (https://search.google.com/test/rich-results) and confirm both Event + Breadcrumbs render as valid rich results.
- Paste a community URL and confirm Article + Breadcrumbs.
- Use Facebook's Sharing Debugger on a show URL to confirm `og:image:width`/`height` are read correctly.

- [ ] **Step 6: Open PR** via the `superpowers:finishing-a-development-branch` skill once verification passes.
