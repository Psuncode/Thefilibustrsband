# Structured Data Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen The Filibusters website as a clearer band/entity source for search engines by expanding homepage-first structured data and selectively adding supportive schema to existing routes.

**Architecture:** Keep the homepage as the canonical entity page and make route-level schema additive rather than noisy. Reuse the existing `BaseLayout` structured-data API from the prior SEO phase, add focused schema builders/helpers where needed, and keep event pages factual and conservative. Evaluate route expansion only after existing routes are reviewed; do not assume a new page is necessary.

**Tech Stack:** Astro 5, TypeScript, existing JSON-LD injection via `BaseLayout.astro`, repo data files under `src/data/`

---

## File Structure

### Existing files likely to modify

- `src/data/site.ts`
  Responsibility: site-level entity metadata, current `MusicGroup` schema builder, contact points, social identity, and likely home for any expanded entity-schema helpers.
- `src/layouts/BaseLayout.astro`
  Responsibility: site-wide JSON-LD graph plumbing and page-level structured-data composition.
- `src/pages/index.astro`
  Responsibility: homepage metadata and any homepage-specific schema additions beyond the current site-wide graph.
- `src/pages/about.astro`
  Responsibility: page-level schema if the About page proves to be a useful supporting entity page.
- `src/pages/listen.astro`
  Responsibility: page-level schema if the Listen page is useful for music/platform signals.
- `src/pages/contact.astro`
  Responsibility: page-level schema if Contact can reinforce organization legitimacy.
- `src/pages/community/[slug].astro`
  Responsibility: only if implementation discovery shows a narrowly justified activity signal; likely no-op for first pass.
- `src/pages/shows/[slug].astro`
  Responsibility: preserve factual event schema and align it with any homepage/entity graph changes only if needed.

### Optional new file(s)

- `src/lib/seo/schema.ts`
  Responsibility: shared schema helper functions if `src/data/site.ts` becomes too crowded. Only create this if the homepage/entity additions make the current file unwieldy.

### Optional new route

- No new route should be created by default.
- A new route is allowed only if implementation discovery identifies a clear entity gap that homepage + About cannot cover cleanly.

## Task 1: Audit and Strengthen Homepage Entity Schema

**Files:**
- Modify: `src/data/site.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro` if homepage-specific route data is needed

- [ ] **Step 1: Inspect the current homepage/site-level schema output**

Read the current schema source and the generated homepage output before changing anything.

Run:
```bash
sed -n '1,260p' src/data/site.ts
sed -n '1,220p' src/layouts/BaseLayout.astro
npm run build
rg -n '"@type":"MusicGroup"|"@type":"WebSite"|sameAs|contactPoint|address' dist/index.html
```

Expected:
- current `WebSite` and `MusicGroup` output is visible
- you can point to the exact current graph shape before editing

- [ ] **Step 2: Write a failing homepage-schema regression check**

Create a lightweight script or shell-based assertion under the current verification approach that proves the homepage is missing the richer knowledge-signal output you intend to add.

If using a one-off command during implementation, capture the exact check:

```bash
rg -n '"@type":"MusicGroup"|genre|sameAs|contactPoint|address' dist/index.html
```

Expected before implementation:
- current output is visible, but any newly targeted fields/relationships you plan to add are missing or too weak

- [ ] **Step 3: Expand the entity schema builders in `src/data/site.ts`**

Add or refine schema helpers so the homepage can express a stronger canonical entity graph without inventing unsupported facts.

Target shape:

```ts
type ThingRef = {
  "@type": "WebPage" | "CollectionPage" | "ContactPage";
  "@id": string;
  name: string;
  url: string;
};

type MusicGroupSchema = {
  "@context": "https://schema.org";
  "@type": "MusicGroup";
  "@id": string;
  name: string;
  description: string;
  url: string;
  genre: string;
  email: string;
  image: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  contactPoint: readonly OrganizationContactPointSchema[];
  sameAs: readonly string[];
  mainEntityOfPage: string;
  subjectOf: readonly ThingRef[];
};
```

Implementation requirements:
- keep all added fields factually grounded in current repo data
- add stable `@id` values where useful
- include route relationships only for real core routes like About, Listen, Contact, and Shows

- [ ] **Step 4: Update `BaseLayout.astro` to emit the refined homepage/site graph cleanly**

Adjust the graph composition only as needed to support the stronger entity output.

Target behavior:
- `WebSite` remains site-level
- `MusicGroup` remains site-level
- schema nodes reference stable IDs and route relationships cleanly
- no event-schema regressions on non-event pages

Code shape should stay small and readable, for example:

```astro
const structuredDataGraph = [
  websiteStructuredData,
  musicGroupStructuredData,
  ...pageStructuredData
];
```

Avoid expanding route-specific logic in the layout itself.

- [ ] **Step 5: Run the build and verify the homepage graph got stronger**

Run:
```bash
npm run build
rg -n '"@type":"MusicGroup"|genre|mainEntityOfPage|subjectOf|sameAs|contactPoint' dist/index.html
```

Expected:
- build succeeds
- homepage output clearly contains the stronger entity graph fields you added

- [ ] **Step 6: Commit the homepage entity strengthening**

```bash
git add src/data/site.ts src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: strengthen homepage entity schema"
```

## Task 2: Review Existing Routes and Add Only Useful Supporting Schema

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/listen.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/data/site.ts` or optional helper file if shared route-schema builders are needed

- [ ] **Step 1: Decide which existing routes deserve page-level schema**

Use the current routes to make an explicit keep/skip decision before editing.

Run:
```bash
sed -n '1,260p' src/pages/about.astro
sed -n '1,220p' src/pages/listen.astro
sed -n '1,220p' src/pages/contact.astro
```

Decision rule:
- keep a route in scope only if page-level schema adds meaningful entity support
- skip routes that would only add noise

Record the working decision in your implementation notes or commit message summary, not in a new repo doc.

- [ ] **Step 2: Add a small page-level schema payload for `/about` if justified**

If `/about` is kept in scope, add route-level structured data that supports band identity without duplicating the homepage blindly.

One acceptable pattern:

```astro
const aboutStructuredData = {
  "@type": "AboutPage",
  "@id": `${siteMeta.url}/about/#webpage`,
  name: `About ${siteMeta.title}`,
  url: `${siteMeta.url}/about`,
  description: aboutPage.definition.intro,
  about: { "@id": `${siteMeta.url}/#musicgroup` },
  isPartOf: { "@id": `${siteMeta.url}/#website` }
};
```

Pass it through `BaseLayout`:

```astro
<BaseLayout
  title={`About | ${siteMeta.title}`}
  description={aboutPage.definition.intro}
  structuredData={aboutStructuredData}
>
```

- [ ] **Step 3: Add a small page-level schema payload for `/listen` if justified**

If `/listen` is kept in scope, add a route-level page schema that reinforces music/platform meaning.

One acceptable pattern:

```astro
const listenStructuredData = {
  "@type": "CollectionPage",
  "@id": `${siteMeta.url}/listen/#webpage`,
  name: `Listen | ${listenPage.title}`,
  url: `${siteMeta.url}/listen`,
  description: listenPage.description,
  about: { "@id": `${siteMeta.url}/#musicgroup` },
  isPartOf: { "@id": `${siteMeta.url}/#website` }
};
```

- [ ] **Step 4: Add a small page-level schema payload for `/contact` if justified**

If `/contact` is kept in scope, add a route-level page schema that reinforces organization legitimacy.

One acceptable pattern:

```astro
const contactStructuredData = {
  "@type": "ContactPage",
  "@id": `${siteMeta.url}/contact/#webpage`,
  name: contactPage.meta.title,
  url: `${siteMeta.url}/contact`,
  description: contactPage.meta.description,
  about: { "@id": `${siteMeta.url}/#musicgroup` },
  isPartOf: { "@id": `${siteMeta.url}/#website` }
};
```

- [ ] **Step 5: Explicitly skip weak routes rather than over-schema them**

If `/community` or another route does not create a clear entity benefit, leave it alone in this phase.

Verification for this decision:
- no new schema should be added just because a page exists
- the diff should reflect a selective approach, not a blanket schema pass

- [ ] **Step 6: Build and verify the selected supporting pages**

Run:
```bash
npm run build
rg -n '"@type":"AboutPage"|"@type":"CollectionPage"|"@type":"ContactPage"|about|isPartOf' dist/about/index.html dist/listen/index.html dist/contact/index.html
```

Expected:
- build succeeds
- only selected routes gain page-level schema
- schema points back to the main site/band entity graph cleanly

- [ ] **Step 7: Commit the selective supporting-route schema**

```bash
git add src/pages/about.astro src/pages/listen.astro src/pages/contact.astro src/data/site.ts src/lib/seo/schema.ts
git commit -m "feat: add supporting entity page schema"
```

If `src/lib/seo/schema.ts` was not created, omit it from `git add`.

## Task 3: Evaluate Whether a New Entity-Supporting Route Is Actually Needed

**Files:**
- Modify only if justified by discovery

- [ ] **Step 1: Compare homepage + About after Tasks 1 and 2**

Decide whether a new route is necessary.

Use this checklist:
- does the homepage now clearly establish the band entity?
- does `/about` provide a stronger identity-supporting page?
- do `/listen` and `/contact` already reinforce the entity graph enough?

If the answer is yes, stop here and do not add a route.

- [ ] **Step 2: Add a new route only if a clear entity gap remains**

Only if needed, create one narrow route whose purpose is entity clarity, not content expansion.

An acceptable route would be something like a tightly focused press/media or official-band-info page only if the existing homepage + About split still leaves a meaningful gap.

If you add one, its requirements are:
- clear band/entity purpose
- real supporting schema value
- no thin filler copy
- minimal UI and content scope

- [ ] **Step 3: Build and verify the decision**

Run:
```bash
npm run build
```

Expected:
- build succeeds whether or not a new route was added
- if no route was added, the decision is explicit and justified by the stronger existing graph

- [ ] **Step 4: Commit only if a new route was actually added**

```bash
git add <new-route-files>
git commit -m "feat: add supporting entity route"
```

If no route was added, skip this commit.

## Task 4: Final Verification

**Files:**
- Verify only unless a blocker is found

- [ ] **Step 1: Run the production build**

Run:
```bash
npm run build
```

Expected:
- build exits with code 0

- [ ] **Step 2: Verify homepage and supporting-route schema output**

Run:
```bash
rg -n '"@type":"MusicGroup"|mainEntityOfPage|subjectOf|sameAs|contactPoint' dist/index.html
rg -n '"@type":"AboutPage"|"@type":"CollectionPage"|"@type":"ContactPage"|about|isPartOf' dist/about/index.html dist/listen/index.html dist/contact/index.html
```

Expected:
- homepage contains the strengthened entity graph
- selected supporting routes contain only the intended supporting schema

- [ ] **Step 3: Verify event pages did not regress**

Run:
```bash
rg -n '"@type":"Event"|performer|location|organizer|offers' dist/shows/byu-battle-of-the-bands-2026/index.html
```

Expected:
- event schema still exists
- no fabricated organizer/offer regression appears

- [ ] **Step 4: Run the repo’s SEO verifier**

Run:
```bash
npm run verify:seo
```

Expected:
- command exits with code 0
- screenshots are generated
- no overflow/request/tag regressions were introduced on checked pages

- [ ] **Step 5: Commit only if final verification forces a fix**

```bash
git add <verification-related fixes>
git commit -m "fix: stabilize structured data expansion"
```

## Self-Review

Spec coverage:
- homepage entity strengthening: Task 1
- existing-route schema review and selective additions: Task 2
- conditional route expansion only if justified: Task 3
- final verification: Task 4

Placeholder scan:
- no `TODO` / `TBD`
- all commands are concrete
- route expansion is conditional by design, not a placeholder

Type consistency:
- homepage remains the canonical entity page
- supporting routes are additive and point back to the main entity graph
- event schema stays factual and conservative
