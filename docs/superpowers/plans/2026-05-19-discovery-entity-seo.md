# Discovery + Entity SEO Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the band's 2026-05-19 discovery strategy into engineering: tighten the platform-profile identity graph (`rel="me"`, typed `socialLinks` categories), satisfy Google's Event rich-result schema requirements (`eventAttendanceMode` + complete `eventStatus` mapping), and weave Provo-alt-rock keyword variants into the highest-leverage pages.

**Architecture:** Mostly small, surgical edits. Two real touch points: (1) the three places outbound platform anchors render — `Footer.astro`, listen page `listenLinks`, listen page `followLinks` — get `rel="me"` once and a category-typed data layer; (2) `src/pages/shows/[slug].astro` Event JSON-LD gains `eventAttendanceMode` and a `postponed` mapping. Keyword work is content-level copy editing in 3 typed data files (homepage, about, community CTA copy) plus `/provo-alt-rock-band`.

**Tech Stack:** Astro 5.5, TypeScript, existing schema helpers in `src/data/site.ts`, existing Event schema in `src/pages/shows/[slug].astro`. No new dependencies.

**Out of Scope** (deferred):
- Creating new external profiles (band-side action — adding the URL is a one-line edit when ready).
- Downloadable EPK / full press kit overhaul.
- Community content sprint (new blog posts).
- New SEO landing pages beyond `/provo-alt-rock-band` (already exists).
- Wikidata cross-linking for venues (Velour doesn't have a Wikidata entity; Utah Arts Festival has Q7873567 but linking it adds little vs. effort).

---

## File Map

**Modify:**
- `src/components/site/Footer.astro` — add `rel="me"` to the `socialLinks` anchor mapping.
- `src/pages/listen.astro` — add `rel="me"` to both `listenLinks` and `followLinks` anchor mappings.
- `src/data/site.ts` — add `category: 'streaming' | 'social' | 'video'` to each `socialLinks` entry; type it via a `SocialLink` interface refinement.
- `src/pages/shows/[slug].astro` — add `eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode"` to the Event JSON-LD; add `postponed: "https://schema.org/EventPostponed"` to `eventStatusByShowStatus`; default unknown statuses to `EventScheduled` (defensive).
- `src/data/homepage.ts` — natural keyword variant on hero subheadline + one "reasons" line (max 2 swaps).
- `src/data/about.ts` — natural keyword variant on the band-summary copy (max 1 swap, only if it reads naturally).
- `src/data/community.ts` — natural keyword variant on the community-section eyebrow/heading copy (max 1 swap, only if natural).
- `src/data/localDiscovery.ts` (the `/provo-alt-rock-band` page content source) — denser keyword variant coverage; this page is intentionally SEO-targeted.

**Create:** (none)

---

### Task 1: Add `rel="me"` to outbound platform anchors

**Files:** `src/components/site/Footer.astro`, `src/pages/listen.astro`

- [ ] **Step 1: Inspect the Footer anchor render**

Run: `grep -n "socialLinks\|<a " src/components/site/Footer.astro`
Locate the `{socialLinks.map((social) => (` block. The anchor inside should look like `<a href={social.href} ...>...</a>`.

- [ ] **Step 2: Add `rel="me"` to the Footer social anchor**

In `src/components/site/Footer.astro`, on the anchor element inside `socialLinks.map`, add `rel="me"` attribute. Preserve all existing attributes (target, class, aria-label, etc.).

Example before:
```astro
<a href={social.href} target="_blank" rel="noopener noreferrer" ...>
```
Example after:
```astro
<a href={social.href} target="_blank" rel="me noopener noreferrer" ...>
```

(Combine `me` with the existing `rel` value rather than replacing it. The `rel="me"` semantic is additive.)

- [ ] **Step 3: Add `rel="me"` to listen page `listenLinks` anchor**

In `src/pages/listen.astro`, find the `listenPage.listenLinks.map((link) => (...))` block. The anchor inside renders Spotify / Apple Music / YouTube. Add `me` to its `rel` attribute (or add `rel="me noopener noreferrer"` if no `rel` exists).

- [ ] **Step 4: Add `rel="me"` to listen page `followLinks` anchor**

In the same file, find the `listenPage.followLinks.map((link) => (...))` block (TikTok / Instagram / YouTube). Same treatment.

- [ ] **Step 5: Build and confirm**

```bash
npm run build
grep -c 'rel="me' dist/index.html
grep -c 'rel="me' dist/listen/index.html
```

Expected: each result `>= 5` (footer has 5 social links visible on every page; listen has 6 across the two clusters but rendered count should match).

- [ ] **Step 6: Commit**

```bash
git add src/components/site/Footer.astro src/pages/listen.astro
git commit -m "feat(seo): add rel=me to outbound platform anchors"
```

---

### Task 2: Event schema — `eventAttendanceMode` + complete status mapping

**Files:** `src/pages/shows/[slug].astro`

- [ ] **Step 1: Inspect current Event schema**

Run: `sed -n '47,82p' src/pages/shows/[slug].astro`
Confirm the current `eventStatusByShowStatus` map and the `eventStructuredData` definition.

- [ ] **Step 2: Extend `eventStatusByShowStatus`**

Change:

```typescript
const eventStatusByShowStatus = {
  announced: "https://schema.org/EventScheduled",
  "sold-out": "https://schema.org/EventScheduled",
  canceled: "https://schema.org/EventCancelled"
} as const;
```

to:

```typescript
const eventStatusByShowStatus = {
  announced: "https://schema.org/EventScheduled",
  "sold-out": "https://schema.org/EventScheduled",
  cancelled: "https://schema.org/EventCancelled",
  canceled: "https://schema.org/EventCancelled",
  postponed: "https://schema.org/EventPostponed"
} as const;
```

- [ ] **Step 3: Defensive default for unknown status**

In the `eventStructuredData` definition, change the line that reads `eventStatus: eventStatusByShowStatus[show.status],` to:

```typescript
  eventStatus:
    eventStatusByShowStatus[show.status as keyof typeof eventStatusByShowStatus] ??
    "https://schema.org/EventScheduled",
```

(Why: if a Sanity-authored show has an unmapped status, fall back to scheduled rather than emitting `undefined`. The `as keyof typeof` cast satisfies the lookup without widening the source `show.status` type.)

- [ ] **Step 4: Add `eventAttendanceMode`**

In the same `eventStructuredData` object, add (anywhere among the top-level fields, but conventionally near `eventStatus`):

```typescript
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
```

Rationale: all current shows are in-person live events. Google's Event rich result requires this field. If a future show becomes hybrid/online, refactor to a per-show field — out of scope.

- [ ] **Step 5: Build and inspect**

```bash
npm run build
grep -o '"eventAttendanceMode":"[^"]*"' dist/shows/utah-arts-festival-2026/index.html
grep -o '"eventStatus":"[^"]*"' dist/shows/utah-arts-festival-2026/index.html
```

Expected:
- `"eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode"`
- `"eventStatus":"https://schema.org/EventScheduled"`

- [ ] **Step 6: Commit**

```bash
git add src/pages/shows/[slug].astro
git commit -m "feat(seo): satisfy Google Event rich-result schema (attendance mode + status map)"
```

---

### Task 3: Add `category` to `socialLinks` for typed platform graph

**Files:** `src/data/site.ts`

- [ ] **Step 1: Read the current `SocialLink` type and `socialLinks` array**

Run: `grep -n "SocialLink\|socialLinks" src/data/site.ts | head -20`

Identify (a) the type definition for a single entry and (b) the array declaration. The array currently has 5 entries: Instagram, Spotify, TikTok, Apple Music, YouTube.

- [ ] **Step 2: Extend the type**

If the type is `SocialLink`, add a `category` field:

```typescript
export type SocialPlatformCategory = "streaming" | "social" | "video";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIconKey;
  category: SocialPlatformCategory;
}
```

(Adapt to the actual existing type — the icon field is `SocialIconKey` or similar. Find via grep.)

- [ ] **Step 3: Annotate each `socialLinks` entry**

In the `socialLinks` array, add the `category` field to each entry:

- Instagram → `category: "social"`
- Spotify → `category: "streaming"`
- TikTok → `category: "social"`
- Apple Music → `category: "streaming"`
- YouTube → `category: "video"`

- [ ] **Step 4: Document the `sameAs` contract**

Above the `buildMusicGroupSchema` function (or wherever `sameAs: socialLinks.map(({ href }) => href)` lives), add a comment:

```typescript
// MusicGroup.sameAs consumes EVERY entry in socialLinks regardless of category.
// To extend the discovery graph (Bandcamp, Last.fm, Songkick, Genius, YouTube Music),
// add a new entry to socialLinks with the appropriate category — schema picks it up automatically.
```

- [ ] **Step 5: Build to confirm**

```bash
npm run build
```

Expected: succeeds. The HTML output for `sameAs` should be unchanged (no new entries — only typing change).

- [ ] **Step 6: Commit**

```bash
git add src/data/site.ts
git commit -m "feat: type socialLinks with platform category for future discovery graph"
```

---

### Task 4: Light keyword density edits

**Files:** `src/data/homepage.ts`, `src/data/about.ts`, `src/data/community.ts`, `src/data/localDiscovery.ts`

**Policy:** Maximum 1–2 word swaps per page, ONLY where the rewritten line reads naturally. Do NOT add new sentences, do NOT shoehorn keywords. Keep the brand voice. Each edit should be defensible if a human read it as "this is just a better version of the same line."

- [ ] **Step 1: Homepage hero subheadline**

In `src/data/homepage.ts`, the hero subheadline currently reads:

> "The Filibusters are a Provo, Utah alt rock band making original music for loud rooms, late nights, and live shows that actually hit."

Already includes the core phrase. Optional swap: change "alt rock band" to "alternative rock band" if it reads natural — it's the longer-tail keyword variant. Decision: KEEP "alt rock" because it scans punchier; skip this edit.

Instead, target the `reasons` array. Currently includes:

> "Live shows that feel cathartic instead of background noise"

Optional swap: change to:

> "Provo live shows that feel cathartic instead of background noise"

(Adds the keyword "Provo live shows" naturally — but evaluate against the rest of the array's brand voice. If "Provo" qualifies feels heavy-handed, skip.)

**Output of this step:** either ONE swap on `reasons` or NONE. Document your decision in the commit message.

- [ ] **Step 2: About page**

Read `src/data/about.ts` to find the band-summary or hero-style copy.

Look for an existing line containing "Provo" OR "alt rock" OR "Utah". Pick ONE line where adding "alternative rock" or "indie rock" (band's actual genre) reads naturally. Examples of acceptable variants:

- "Provo alt rock band" → "Provo alternative rock band"
- "rock band from Utah" → "alternative rock band from Utah"

Max ONE swap. If no line reads naturally with a swap, skip the file.

- [ ] **Step 3: Community index copy**

Open `src/data/community.ts` and find the public-facing copy (intro, reasons, eyebrow strings). The strategy brief calls for the band to be part of "the Provo band conversation" — community copy is a good place to subtly position the band as a Provo-anchored act.

Find one line where adding "Provo" or "Utah" or "alternative rock" reads naturally. Max ONE swap. Skip if nothing reads natural.

- [ ] **Step 4: `/provo-alt-rock-band` page (`src/data/localDiscovery.ts`)**

This page is intentionally SEO-targeted, so denser keyword presence is acceptable. Read the content file end-to-end. Audit for:

- "Provo alternative rock band" (long tail) — should appear at least 2x.
- "Utah alt rock" or "Utah indie rock" — should appear at least 1x.
- "Provo live music" — at least 1x mention.
- "alternative band from Utah" — at least 1x mention.

Make whatever edits are needed to satisfy these counts WITHOUT making copy read as keyword stuffing. The page is content-marketing copy, so phrasing like "If you're looking for a Provo alternative rock band that…" is fair game. Avoid robotic repetition.

After edits, count occurrences:

```bash
grep -c "Provo alternative rock\|Utah alt rock\|Utah indie rock\|Provo live music\|alternative band from Utah" src/data/localDiscovery.ts
```

Expected: at least 5 total hits across the 4 phrases.

- [ ] **Step 5: Build**

```bash
npm run build
```

Open the built `/provo-alt-rock-band/index.html` and skim — does the page still read as natural copy or has it become spammy? If spammy, soften.

- [ ] **Step 6: Commit**

```bash
git add src/data/homepage.ts src/data/about.ts src/data/community.ts src/data/localDiscovery.ts
git commit -m "content(seo): natural keyword variants on homepage/about/community/local-discovery"
```

Only stage the files you actually edited.

---

### Task 5: Verification + PR

- [ ] **Step 1: All gates**

```bash
npm test
npm run build
npm run verify:seo 2>&1 | tail -5
```

Expect: tests pass (count depends on which other branches are merged into main first), build clean, verify:seo exits 0.

- [ ] **Step 2: Confirm Event rich-result eligibility**

```bash
grep -o '"eventStatus":"[^"]*"\|"eventAttendanceMode":"[^"]*"\|"@type":"Event"' dist/shows/utah-arts-festival-2026/index.html | sort -u
```

Expect all three: `"@type":"Event"`, `"eventStatus":"https://schema.org/EventScheduled"`, `"eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode"`.

- [ ] **Step 3: Confirm `rel="me"` coverage**

```bash
grep -c 'rel="me' dist/index.html
grep -c 'rel="me' dist/listen/index.html
```

Expect: index.html >= 5 (footer socials), listen/index.html >= 11 (footer 5 + listen 3 + follow 3).

- [ ] **Step 4: Confirm sameAs intact**

```bash
grep -o '"sameAs":\[[^]]*\]' dist/index.html | head -1
```

Expect: an array of 5 platform URLs.

- [ ] **Step 5: Keyword spot-check** (only the `/provo-alt-rock-band` page, since other pages were light-touch)

```bash
grep -oE "Provo alternative rock|Utah alt rock|Utah indie rock|Provo live music|alternative band from Utah" dist/provo-alt-rock-band/index.html | sort | uniq -c
```

Expect a healthy distribution (no single phrase dominating; total ~5+ hits).

- [ ] **Step 6: Open PR** via `superpowers:finishing-a-development-branch`.
