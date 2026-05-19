# SEO Local Discovery And AI Press Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen local-discovery SEO for The Filibusters, add one targeted Provo alt rock landing page, and publish a low-visibility AI press kit with crawlable public text assets that improve AI-assisted promoter and press research.

**Architecture:** Keep the implementation inside the current Astro data-driven structure. Existing routes get more differentiated metadata, copy, and internal links; one new discovery page and one new AI hub page are added; machine-readable assets ship as stable text files in `public/ai/`; structured data stays centered in `BaseLayout.astro` with page-level additions per route.

**Tech Stack:** Astro 5, TypeScript data modules, Astro route components, static public text assets, existing Playwright SEO verification script

---

## File Structure

### Files to modify

- `src/data/site.ts`
  Responsibility: central site metadata, shared route labels, site entity IDs, optional helper data for new AI and local-discovery links.
- `src/layouts/BaseLayout.astro`
  Responsibility: shared metadata and structured-data API improvements if the new pages need clearer page-level support.
- `src/pages/index.astro`
  Responsibility: homepage metadata and route-level discovery positioning.
- `src/pages/about.astro`
  Responsibility: authority-page metadata, schema, and internal linking toward local discovery and press surfaces.
- `src/pages/listen.astro`
  Responsibility: music-intent metadata and discovery-loop internal linking.
- `src/pages/shows/index.astro`
  Responsibility: live-intent metadata and internal links back into the discovery loop.
- `src/pages/press.astro`
  Responsibility: low-visibility bridge to the AI press kit hub.
- `src/pages/sitemap.xml.ts`
  Responsibility: include any new public page routes intentionally.
- `public/llms.txt`
  Responsibility: top-level AI discovery entry point that points to the new AI hub and text assets.
- `README.md`
  Responsibility: document the AI-readable assets and when to run SEO verification.
- `scripts/verify-seo-mobile.mjs`
  Responsibility: extend route coverage to the new page set and catch hard failures on the new routes.

### Files to create

- `src/data/localDiscovery.ts`
  Responsibility: copy source of truth for the new local-intent landing page.
- `src/data/aiPressKit.ts`
  Responsibility: copy source of truth for the AI hub page and shared factual band summaries used across AI assets.
- `src/pages/provo-alt-rock-band.astro`
  Responsibility: local-discovery landing page targeting Provo alt rock band intent.
- `src/pages/press/ai.astro`
  Responsibility: low-visibility AI press kit hub page linking to public text assets and canonical band facts.
- `public/ai/band-profile.txt`
  Responsibility: concise machine-readable band profile.
- `public/ai/promoter-brief.txt`
  Responsibility: promoter and venue oriented summary.
- `public/ai/press-backgrounder.txt`
  Responsibility: machine-readable press backgrounder.
- `public/ai/fact-sheet.txt`
  Responsibility: stable facts, links, location, contact, and band details.
- `public/ai/faq.txt`
  Responsibility: AI-friendly FAQ for common retrieval and summarization tasks.

## Task 1: Inventory Existing SEO Surfaces And Lock Shared Copy Inputs

**Files:**
- Modify: `src/data/site.ts`
- Create: `src/data/localDiscovery.ts`
- Create: `src/data/aiPressKit.ts`

- [ ] **Step 1: Read the current shared metadata and route copy sources**

Run: `sed -n '1,260p' src/data/site.ts`
Expected: current site metadata, route labels, entity IDs, and social links are visible.

- [ ] **Step 2: Add shared route references for the new pages in `src/data/site.ts`**

Add stable hrefs and labels for:
- `/provo-alt-rock-band`
- `/press/ai`

Expected code shape:

```ts
export const specialRoutes = {
  localDiscovery: {
    label: "Provo alt rock band",
    href: "/provo-alt-rock-band"
  },
  aiPressKit: {
    label: "AI press kit",
    href: "/press/ai"
  }
} as const;
```

- [ ] **Step 3: Create `src/data/localDiscovery.ts` with page-specific discovery copy**

Add a focused data object for the new local page, including:
- title
- description
- hero copy
- differentiators
- proof points
- CTA links

Expected code shape:

```ts
export const localDiscoveryPage = {
  meta: {
    title: "Provo Alt Rock Band | The Filibusters",
    description:
      "Meet The Filibusters, a Provo, Utah alt rock band known for emotionally direct songs, live shows, and a growing local presence."
  },
  hero: {
    eyebrow: "Provo alt rock",
    title: "A standout alt rock band from Provo, Utah.",
    description:
      "The Filibusters make loud, emotionally direct alt rock built for local stages, late nights, and people looking for a band that actually leaves an impression."
  }
} as const;
```

- [ ] **Step 4: Create `src/data/aiPressKit.ts` with shared factual AI-facing content**

Add one shared source of truth for:
- band summary
- promoter summary
- press backgrounder summary
- fact sheet sections
- FAQ entries

Expected code shape:

```ts
export const aiPressKit = {
  hub: {
    title: "AI Press Kit",
    description:
      "Structured band information for AI-assisted promoter, venue, and press research."
  },
  summaries: {
    bandProfile:
      "The Filibusters are a Provo, Utah alt rock band making original music shaped by high-energy live shows, emotionally direct writing, and a strong local identity.",
    promoterBrief:
      "The Filibusters are a four-piece alt rock band from Provo, Utah with a live-first identity, original material, and a fan response that consistently highlights energy, stage presence, and connection."
  }
} as const;
```

- [ ] **Step 5: Verify the new data modules load cleanly**

Run: `npm run build`
Expected: build completes successfully with no unresolved imports.

## Task 2: Differentiate Core Route Metadata And Discovery Positioning

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/listen.astro`
- Modify: `src/pages/shows/index.astro`
- Modify: `src/data/site.ts`

- [ ] **Step 1: Update homepage metadata for stronger branded-local discovery**

Adjust the homepage title and description to emphasize:
- Provo, Utah
- alt rock
- original music
- live shows

Expected code shape in `src/pages/index.astro`:

```astro
<BaseLayout
  title={`${siteMeta.title} | Provo Alt Rock Band`}
  description="The Filibusters are a Provo, Utah alt rock band making original music, playing live shows, and building a reputation as one of the standout bands in the local scene."
>
```

- [ ] **Step 2: Update `/about` metadata so it reads as the authority page**

Revise the title and description in `src/pages/about.astro` to emphasize:
- who the band is
- sound and identity
- Provo roots
- local credibility

- [ ] **Step 3: Update `/listen` metadata for music-intent discovery**

Revise the title and description in `src/pages/listen.astro` to better support music-intent searches and reinforce band identity.

- [ ] **Step 4: Update `/shows` metadata for live-intent freshness**

Revise `src/pages/shows/index.astro` so its title and description emphasize upcoming shows and local live relevance without duplicating the homepage.

- [ ] **Step 5: Build and confirm metadata compiles**

Run: `npm run build`
Expected: build succeeds and route-level metadata changes compile cleanly.

## Task 3: Add The Local-Intent Landing Page

**Files:**
- Create: `src/pages/provo-alt-rock-band.astro`
- Create: `src/data/localDiscovery.ts`
- Modify: `src/data/site.ts`

- [ ] **Step 1: Create the new route file**

Create `src/pages/provo-alt-rock-band.astro` using existing Astro patterns:
- `BaseLayout`
- `Header`
- `Footer`
- data imported from `src/data/localDiscovery.ts`

- [ ] **Step 2: Add page-level metadata and schema**

Use the new data module to set:
- unique title
- unique description
- page-level structured data tied back to the `MusicGroup`

Expected schema shape:

```ts
const localDiscoveryStructuredData = {
  "@type": "WebPage",
  name: "Provo Alt Rock Band | The Filibusters",
  url: Astro.url.href,
  description: localDiscoveryPage.meta.description,
  about: { "@id": siteEntityIds.musicGroup },
  isPartOf: { "@id": siteEntityIds.website }
} as const;
```

- [ ] **Step 3: Add focused content sections without duplicating `/about`**

The page should contain:
- concise hero
- short “why they stand out” section
- proof points or fan-response section
- clear links to `/listen`, `/shows`, `/about`, and `/press`

- [ ] **Step 4: Build the site and verify the page exists**

Run: `npm run build`
Expected: generated output includes the new `provo-alt-rock-band` route.

## Task 4: Add The AI Press Kit Hub

**Files:**
- Create: `src/pages/press/ai.astro`
- Create: `src/data/aiPressKit.ts`
- Modify: `src/pages/press.astro`

- [ ] **Step 1: Create the AI hub route**

Create `src/pages/press/ai.astro` using the existing site shell and shared data patterns.

- [ ] **Step 2: Add metadata and page-level structured data**

Set unique metadata that clearly describes the route as an AI-friendly press and factual resource.

Expected schema shape:

```ts
const aiPressStructuredData = {
  "@type": "CollectionPage",
  name: "AI Press Kit | The Filibusters",
  url: Astro.url.href,
  description: aiPressKit.hub.description,
  about: { "@id": siteEntityIds.musicGroup },
  isPartOf: { "@id": siteEntityIds.website }
} as const;
```

- [ ] **Step 3: Add low-visibility links from the existing press page**

Update `src/pages/press.astro` to include a modest section or link card that points to `/press/ai` without promoting it as a main nav destination.

- [ ] **Step 4: Build and verify the AI hub route**

Run: `npm run build`
Expected: generated output includes `/press/ai`.

## Task 5: Publish Stable AI-Readable Public Text Assets

**Files:**
- Create: `public/ai/band-profile.txt`
- Create: `public/ai/promoter-brief.txt`
- Create: `public/ai/press-backgrounder.txt`
- Create: `public/ai/fact-sheet.txt`
- Create: `public/ai/faq.txt`
- Modify: `public/llms.txt`

- [ ] **Step 1: Write `public/ai/band-profile.txt`**

Add:
- one-paragraph band summary
- location and genre
- current identity and sound
- official site and streaming links

- [ ] **Step 2: Write `public/ai/promoter-brief.txt`**

Add:
- booker-facing summary
- band format
- live identity
- official links
- contact email

- [ ] **Step 3: Write `public/ai/press-backgrounder.txt`**

Add:
- short and long machine-readable press context
- Provo relevance
- band story and positioning

- [ ] **Step 4: Write `public/ai/fact-sheet.txt`**

Add:
- band name
- location
- genre
- member names and roles if already approved for public use
- primary contact
- official socials
- streaming links
- core page URLs

- [ ] **Step 5: Write `public/ai/faq.txt`**

Add Q/A pairs for:
- who the band is
- where they are based
- what genre they play
- what makes them distinct
- where to hear them
- how to contact them

- [ ] **Step 6: Upgrade `public/llms.txt`**

Update `llms.txt` so it:
- remains concise
- points to `/press/ai`
- links to the `public/ai/*.txt` assets
- uses the same factual summary language as the new AI assets

- [ ] **Step 7: Build and spot-check the assets**

Run: `npm run build`
Expected: build succeeds and the static assets remain publicly addressable under `/ai/`.

## Task 6: Tighten Internal Linking Across Discovery, Authority, And Press Routes

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/listen.astro`
- Modify: `src/pages/shows/index.astro`
- Modify: `src/pages/press.astro`
- Modify: `src/components/site/Footer.astro`

- [ ] **Step 1: Add homepage links into the discovery loop**

Ensure the homepage exposes clear links to:
- `/about`
- `/listen`
- `/shows`
- `/provo-alt-rock-band`

- [ ] **Step 2: Add `/about` links toward music, shows, and press**

Ensure `/about` links toward:
- `/listen`
- `/shows`
- `/press`
- `/provo-alt-rock-band`

- [ ] **Step 3: Add supporting links on `/listen` and `/shows`**

Ensure `/listen` and `/shows` each contain at least one route back toward:
- band authority (`/about`)
- another discovery destination (`/provo-alt-rock-band` or `/shows`/`/listen`)

- [ ] **Step 4: Add a low-visibility footer or supporting-link path if needed**

If the new routes remain too isolated, update `src/components/site/Footer.astro` with a restrained link to the local-intent page and keep the AI press kit out of main primary navigation.

- [ ] **Step 5: Build and inspect route connectivity**

Run: `npm run build`
Expected: build succeeds and all new internal links compile to valid routes.

## Task 7: Update Sitemap And Shared Structured-Data Support

**Files:**
- Modify: `src/pages/sitemap.xml.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/data/site.ts`

- [ ] **Step 1: Add the new public routes to the sitemap**

Update `src/pages/sitemap.xml.ts` to include:
- `/provo-alt-rock-band`
- `/press/ai`

Do not add the individual `.txt` assets to the XML sitemap unless there is a clear product reason; the initial implementation should prioritize page URLs.

- [ ] **Step 2: Extend `BaseLayout.astro` only if the new routes need it**

If the implementation needs better page-level support for:
- `structuredData`
- `ogType`
- optional page-specific OG image alt text

make the smallest API improvement consistent with existing layout patterns.

- [ ] **Step 3: Build and verify sitemap generation**

Run: `npm run build`
Expected: build succeeds and `dist/sitemap.xml` includes the new page routes.

## Task 8: Expand Verification Coverage For The New Routes

**Files:**
- Modify: `scripts/verify-seo-mobile.mjs`
- Modify: `README.md`

- [ ] **Step 1: Extend the SEO verification route set**

Update `scripts/verify-seo-mobile.mjs` so it checks:
- `/`
- `/shows`
- one dynamic show route
- `/provo-alt-rock-band`
- `/press/ai`

Keep the script focused on hard failures only:
- horizontal overflow
- failed critical requests
- missing core SEO tags

- [ ] **Step 2: Document the new verification expectations**

Update `README.md` to explain:
- the new routes added by this pass
- the purpose of the AI press kit assets
- when to run `npm run verify:seo`

- [ ] **Step 3: Run the verification command**

Run: `npm run verify:seo`
Expected: PASS with screenshots generated for the expanded route set.

## Task 9: Final Validation

**Files:**
- No new files

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: Astro build completes successfully.

- [ ] **Step 2: Run the SEO verification smoke test**

Run: `npm run verify:seo`
Expected: PASS with screenshots for all configured routes.

- [ ] **Step 3: Spot-check generated pages and AI assets in preview**

Run: `npm run preview`
Expected: local preview server starts successfully.

- [ ] **Step 4: Manually confirm these URLs in preview or dev**

Check:
- `/`
- `/about`
- `/listen`
- `/shows`
- `/provo-alt-rock-band`
- `/press`
- `/press/ai`
- `/llms.txt`
- `/ai/band-profile.txt`
- `/ai/promoter-brief.txt`
- `/ai/press-backgrounder.txt`
- `/ai/fact-sheet.txt`
- `/ai/faq.txt`

Expected:
- no broken routes
- metadata present
- internal links connect as designed
- AI text assets are reachable and readable

## Self-Review

Spec coverage check:
- existing route SEO differentiation is covered in Task 2
- the local-intent landing page is covered in Task 3
- the AI press hub is covered in Task 4
- `llms.txt` and public AI-readable assets are covered in Task 5
- internal linking is covered in Task 6
- sitemap and shared metadata/schema support are covered in Task 7
- verification is covered in Tasks 8 and 9

Placeholder scan:
- no `TODO`, `TBD`, or deferred implementation markers remain in the task steps

Type consistency check:
- proposed route names, data module names, and public asset paths are used consistently across the plan
