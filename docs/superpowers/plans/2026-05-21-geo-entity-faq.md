# GEO Entity + FAQ Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the highest-impact gaps surfaced by the 2026-05-21 GEO audit — AI-crawler robots.txt allowlist, FAQPage JSON-LD on `/about` + `/press/ai`, MusicGroup enrichment (`foundingDate`, `keywords`, `genre` as array), and a canonical brand description shared across surfaces.

**Architecture:** Four independent concerns, each scoped to 1–3 files. A new `src/lib/seo/faq.ts` helper mirrors the existing `breadcrumb.ts` pattern (typed input → Schema.org object). MusicGroup enrichment is purely additive to `buildMusicGroupSchema`. Brand-description canonicalization pulls llms.txt into alignment with `siteMeta.description`; press shortBio stays longer-form (bio context) but its opening sentence is harmonized.

**Tech Stack:** Astro 5.5, TypeScript, Schema.org FAQPage. No new dependencies.

**Out of Scope** (deferred):
- `MusicRecording` / `MusicAlbum` schema for releases (needs release-date metadata; defer).
- `dateModified` / `datePublished` freshness signals across pages.
- llms.txt structural enrichment beyond the description sentence (per-link descriptions, Optional/Press section).
- Cross-reference `sameAs` knowledge platforms (Wikidata, MusicBrainz) — requires band-side action.

---

## File Map

**Create:**
- `src/lib/seo/faq.ts` — `buildFaqSchema(items)` helper.
- `tests/faq.test.mjs` — node:test covering shape + edge cases.

**Modify:**
- `public/robots.txt` — replace with AI-crawler allowlist + default-allow fallback + Sitemap line.
- `src/data/site.ts` — add `foundingDate`, `keywords`, `genre` array to `buildMusicGroupSchema`.
- `src/pages/about.astro` — import `buildFaqSchema` + `aboutPage.faq`, pass via `structuredData`.
- `src/pages/press/ai.astro` — same pattern with `aiPressKit.faq`.
- `public/llms.txt` — replace the existing blockquote line so it matches `siteMeta.description` verbatim.
- `src/data/press.ts` — rewrite the FIRST sentence of `shortBio` to start with the canonical description verbatim, then append the press-specific tail.

---

### Task 1: AI-crawler `robots.txt` allowlist

**Files:** `public/robots.txt`

- [ ] **Step 1: Read current**

```bash
cat public/robots.txt
```

Confirm it's the bare `User-agent: * / Allow: / / Sitemap: ...` form.

- [ ] **Step 2: Replace contents**

Write `public/robots.txt`:

```
# AI search crawlers (explicit allowlist — the band welcomes citation)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: ClaudeBot-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

# Default — allow all other well-behaved crawlers
User-agent: *
Allow: /

Sitemap: https://www.thefilibustersband.com/sitemap-index.xml
```

The named entries are redundant with the default `User-agent: *` (since they already get Allow: /), but explicit naming signals intent — useful (a) for visibility to people reading robots.txt and (b) as a placeholder for future per-bot Disallow tweaks.

- [ ] **Step 3: Verify it parses**

```bash
npm run build
# After build, fetch the served robots.txt
cat dist/robots.txt 2>/dev/null || cat .vercel/output/static/robots.txt
```

Expected: identical to what you wrote. No syntax errors during build.

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt
git commit -m "feat(seo): explicit AI crawler allowlist in robots.txt"
```

---

### Task 2: `buildFaqSchema` helper + tests

**Files:** `src/lib/seo/faq.ts` (new), `tests/faq.test.mjs` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/faq.test.mjs`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFaqSchema } from "../src/lib/seo/faq.ts";

test("builds FAQPage with 3 questions", () => {
  const out = buildFaqSchema([
    { question: "Q1", answer: "A1" },
    { question: "Q2", answer: "A2" },
    { question: "Q3", answer: "A3" }
  ]);

  assert.equal(out["@context"], "https://schema.org");
  assert.equal(out["@type"], "FAQPage");
  assert.equal(out.mainEntity.length, 3);
  assert.equal(out.mainEntity[0]["@type"], "Question");
  assert.equal(out.mainEntity[0].name, "Q1");
  assert.equal(out.mainEntity[0].acceptedAnswer["@type"], "Answer");
  assert.equal(out.mainEntity[0].acceptedAnswer.text, "A1");
});

test("throws on empty input", () => {
  assert.throws(() => buildFaqSchema([]), /at least one/i);
});

test("preserves order", () => {
  const out = buildFaqSchema([
    { question: "first", answer: "one" },
    { question: "second", answer: "two" }
  ]);
  assert.equal(out.mainEntity[0].name, "first");
  assert.equal(out.mainEntity[1].name, "second");
});
```

- [ ] **Step 2: Run → FAIL**

```bash
node --test tests/faq.test.mjs
```

Expected: `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement**

Create `src/lib/seo/faq.ts`:

```typescript
export type FaqEntry = {
  question: string;
  answer: string;
};

export type FaqPage = {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
};

export const buildFaqSchema = (items: ReadonlyArray<FaqEntry>): FaqPage => {
  if (items.length === 0) {
    throw new Error("buildFaqSchema requires at least one FAQ entry");
  }
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
};
```

- [ ] **Step 4: Run → PASS**

```bash
node --test tests/faq.test.mjs
```

Expected: 3/3 pass.

- [ ] **Step 5: Run the full suite**

```bash
npm test
```

Expected: previous 25 + new 3 = 28 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo/faq.ts tests/faq.test.mjs
git commit -m "feat(seo): add buildFaqSchema helper for FAQPage JSON-LD"
```

---

### Task 3: Wire FAQPage into `/about`

**Files:** `src/pages/about.astro`

- [ ] **Step 1: Read the current `<BaseLayout>` call**

```bash
grep -n "BaseLayout\|structuredData\|aboutPage" src/pages/about.astro | head -10
```

Confirm `aboutPage` is imported and `<BaseLayout>` is the wrapper.

- [ ] **Step 2: Build the FAQ schema in frontmatter**

In `src/pages/about.astro` frontmatter, add to the imports:

```typescript
import { buildFaqSchema } from "../lib/seo/faq";
```

After existing constants, add:

```typescript
const faqStructuredData = buildFaqSchema(aboutPage.faq);
```

- [ ] **Step 3: Pass to `<BaseLayout>`**

If the existing `<BaseLayout>` call already passes a `structuredData` prop, append `faqStructuredData` to that array. If not, add:

```astro
<BaseLayout
  title={...}
  description={...}
  structuredData={[faqStructuredData]}
>
```

If there's already a single object passed (not an array), wrap into an array: `structuredData={[existingNode, faqStructuredData]}`.

- [ ] **Step 4: Build + inspect**

```bash
npm run build
grep -o '"@type":"FAQPage"' dist/about/index.html | head
grep -o '"@type":"Question"' dist/about/index.html | wc -l
```

Expected: `FAQPage` appears once, `Question` appears 5 times (matches `aboutPage.faq` length).

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat(seo): emit FAQPage JSON-LD on /about"
```

---

### Task 4: Wire FAQPage into `/press/ai`

**Files:** `src/pages/press/ai.astro`

- [ ] **Step 1: Same pattern as Task 3**

Add `import { buildFaqSchema } from "../../lib/seo/faq";` (note the extra `../` — this page is one level deeper). Confirm `aiPressKit` is imported and has a `.faq` property.

Build the schema:

```typescript
const aiFaqStructuredData = buildFaqSchema(aiPressKit.faq);
```

- [ ] **Step 2: Add to `<BaseLayout>` structuredData**

If `<BaseLayout>` already passes structuredData (likely — this is the AI press kit page, which probably has WebPage schema), append `aiFaqStructuredData`. Otherwise add.

- [ ] **Step 3: Build + inspect**

```bash
npm run build
grep -o '"@type":"FAQPage"' dist/press/ai/index.html
grep -o '"@type":"Question"' dist/press/ai/index.html | wc -l
```

Expected: FAQPage present, Question count matches `aiPressKit.faq.length` (verify the actual count with `grep "question:" src/data/aiPressKit.ts | wc -l`).

- [ ] **Step 4: Commit**

```bash
git add src/pages/press/ai.astro
git commit -m "feat(seo): emit FAQPage JSON-LD on /press/ai"
```

---

### Task 5: Enrich `MusicGroup` schema

**Files:** `src/data/site.ts`

- [ ] **Step 1: Locate `buildMusicGroupSchema`**

```bash
grep -n "buildMusicGroupSchema\|foundingDate\|keywords\|genre:" src/data/site.ts | head
```

- [ ] **Step 2: Add fields**

Inside `buildMusicGroupSchema(...)` return object, add three new fields. Place them near existing semantic fields (`genre`, `description`, etc.):

```typescript
  foundingDate: "2024",
  keywords: [
    "Provo alt rock",
    "Utah alt rock",
    "alternative rock band",
    "Provo live music",
    "indie rock Utah"
  ],
```

For `genre`: it's currently `genre: bandFacts.geoIdentity.genre` (a single string). Convert to an array. Two options:

(a) **Inline conversion** (minimal change):

```typescript
  genre: [bandFacts.geoIdentity.genre, "Indie rock"],
```

(b) **Source-level change** (cleaner):

In the `bandGeoIdentity` constant earlier in `site.ts`, change `genre: "..."` to `genre: ["...", "Indie rock"] as const`. Then propagate any consumer types.

Pick (a) if the source change cascades into many files; pick (b) if only `buildMusicGroupSchema` consumes `bandFacts.geoIdentity.genre`. Verify:

```bash
grep -rn "geoIdentity.genre" src/ | head
```

If only `buildMusicGroupSchema` uses it, go with (b). Otherwise (a).

About `foundingDate`: if you find an existing `foundingDate` / `formed` / `since` field in `bandFacts`, use that. Otherwise `"2024"` is a reasonable inference based on the recent release dates and content tone — flag it as approximate in the commit message.

**Important:** Do NOT duplicate the existing `member: buildMemberPersons()` from PR #7 — verify it's still present and don't re-add.

- [ ] **Step 3: Build + verify**

```bash
npm run build
grep -o '"foundingDate":"[^"]*"' dist/index.html
grep -o '"keywords":\[[^]]*\]' dist/index.html | head -1
grep -o '"genre":\[[^]]*\]\|"genre":"[^"]*"' dist/index.html | head -1
```

Expected: all three render in MusicGroup JSON-LD on every page.

- [ ] **Step 4: Commit**

```bash
git add src/data/site.ts
git commit -m "feat(seo): enrich MusicGroup schema with foundingDate, keywords, multi-genre"
```

---

### Task 6: Canonical brand description sweep

**Files:** `public/llms.txt`, `src/data/press.ts`

Current state (verified before this plan):
- `siteMeta.description` → `"The Filibusters are a Provo, Utah alt rock band making loud, emotionally direct songs for live rooms and late nights."` — **canonical**.
- `public/llms.txt` blockquote → `"The Filibusters are an alt rock band based in Provo, Utah."` — TOO SHORT, doesn't match.
- `src/data/press.ts` `shortBio` → `"The Filibusters are an alt rock band from Provo, Utah making loud, emotionally direct songs built for live rooms, late nights, and real connection."` — close but starts differently; tail is press-specific.

- [ ] **Step 1: Replace llms.txt blockquote**

In `public/llms.txt`, change:

```
> The Filibusters are an alt rock band based in Provo, Utah.
```

to:

```
> The Filibusters are a Provo, Utah alt rock band making loud, emotionally direct songs for live rooms and late nights.
```

(Exactly `siteMeta.description`, verbatim.)

- [ ] **Step 2: Harmonize press shortBio opening sentence**

In `src/data/press.ts`, change `shortBio`:

```typescript
  shortBio:
    "The Filibusters are an alt rock band from Provo, Utah making loud, emotionally direct songs built for live rooms, late nights, and real connection.",
```

to:

```typescript
  shortBio:
    "The Filibusters are a Provo, Utah alt rock band making loud, emotionally direct songs for live rooms and late nights. The live show leans into connection over polish — energetic, present, built for the room.",
```

(First sentence = `siteMeta.description` verbatim; second sentence adds the press-specific framing about live shows that was implicit in the old version.)

- [ ] **Step 3: Verify (optional) — does `siteMeta.description` propagate through any schema?**

```bash
grep -n "siteMeta.description" src/data/site.ts src/layouts/BaseLayout.astro
```

Expected: it's used in `MusicGroup.description`. If so, the schema's description now matches the meta description AND the llms.txt blockquote — single source of truth across all three surfaces.

- [ ] **Step 4: Build + inspect**

```bash
npm run build
grep -o '"description":"[^"]*Provo[^"]*"' dist/index.html | head -1
head -3 dist/llms.txt 2>/dev/null || head -3 .vercel/output/static/llms.txt
```

Both should reflect the canonical description sentence.

- [ ] **Step 5: Commit**

```bash
git add public/llms.txt src/data/press.ts
git commit -m "content: canonical brand description across siteMeta, llms.txt, press shortBio"
```

---

### Task 7: Full-suite verification + PR

- [ ] **Step 1: All gates**

```bash
npx astro check 2>&1 | tail -3
npm test
npm run build
npm run verify:seo
npx playwright test 2>&1 | tail -5
```

Expected:
- `astro check` — 0 errors (PR #5 already cleared the slate).
- `npm test` — 28 tests pass (was 25 + 3 FAQ tests).
- `npm run build` — 18 pages, clean.
- `verify:seo` — exits 0.
- `npx playwright test` — 12 tests pass.

- [ ] **Step 2: GEO render checks**

```bash
# Robots.txt allowlist
grep -c "User-agent:" dist/robots.txt
# Expect: 14 (13 AI bots + 1 default User-agent: *)

# FAQ schema on /about
grep -c '"@type":"FAQPage"' dist/about/index.html
# Expect: 1

# FAQ schema on /press/ai
grep -c '"@type":"FAQPage"' dist/press/ai/index.html
# Expect: 1

# MusicGroup enrichment on homepage
grep -o '"foundingDate":"[^"]*"' dist/index.html
grep -o '"keywords":\[[^]]*\]' dist/index.html | head -1

# Canonical description on llms.txt + index.html
head -3 dist/llms.txt
grep -o '"description":"[^"]*"' dist/index.html | head -1
```

All should render correctly.

- [ ] **Step 3: Open PR** via `superpowers:finishing-a-development-branch`.

Title: `feat(seo): GEO entity + FAQ hardening (FAQPage, robots, MusicGroup enrichment)`.

PR body should note:
- `foundingDate: "2024"` is approximate; replace with actual band founding year if known.
- `genre` shifted from single string to array — verify any consumers that depend on the string shape.
- Brand description is now CANONICAL — future changes should update `siteMeta.description` first, then propagate.
- Deferred (next phases): MusicRecording schema for releases, dateModified/datePublished freshness signals, llms.txt richer per-link descriptions.
