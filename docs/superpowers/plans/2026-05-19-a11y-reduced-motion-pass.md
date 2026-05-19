# A11y + Reduced-Motion Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the high- and medium-severity accessibility gaps surfaced by the 2026-05-19 audits — reduced-motion compliance, focus-management correctness, contrast minima, heading order, skip-link reliability, marquee semantics, and CLS-prone `<img>` usage.

**Architecture:** Mostly surgical CSS, markup, and small TypeScript changes. One bounded refactor: introduce a `formatShowStatus(status)` helper to render human-readable status labels. No new dependencies — uses Astro's existing `<Image>` for community/show flyers; remote Sanity URLs route through a sized `<img>` with explicit `width`/`height` for now (full Sanity CDN integration in `astro.config.mjs` is a deliberate non-goal — see Out of Scope).

**Tech Stack:** Astro 5.5, Tailwind 3.4, vanilla TS in `.astro` `<script>` blocks, `node --test` for runtime helper coverage.

**Out of Scope:**
- Migrating to `<Image>` for remote Sanity URLs (requires `image.remotePatterns` config + image service — belongs in the Astro modernization phase).
- Moving Tailwind CSS-var tokens into `theme.extend` (belongs in the Tailwind/TS phase).
- Adding Playwright Test runner / a11y assertions (belongs in the testing phase).

---

## File Map

**Modify:**
- `src/styles/global.css` — extend `prefers-reduced-motion` block to neutralize Tailwind `animate-*` keyframes and `data-motion` already covered.
- `tailwind.config.mjs` — keyframes stay; no change required (override happens in CSS).
- `src/components/home/FollowPrompt.astro` — remove auto-open `setTimeout`; replace with explicit trigger gated by an opt-in CTA.
- `src/components/home/AboutBandSection.astro`, `CommunitySignupSection.astro`, `PersonalityStripSection.astro`, `ShowsPreviewSection.astro` — bump low-opacity body text utilities.
- `src/pages/community/index.astro` — `h2` → `h3` for card titles; drop duplicate inner anchor.
- `src/pages/community/[slug].astro`, `src/pages/shows/[slug].astro` — duplicate-link cleanup, status label, `<img>` width/height (community detail flyer is local-imported → can use `<Image>`; shows detail flyer is local-imported → can use `<Image>`).
- `src/pages/index.astro`, `src/pages/community/index.astro`, `src/pages/community/[slug].astro`, `src/pages/shows/index.astro`, `src/pages/shows/[slug].astro` — `tabindex="-1"` on `<main id="main-content">`.
- `src/components/home/PersonalityStripSection.astro` — wrap the marquee rows container in `<div role="region" aria-label="Listener feedback">`.

**Create:**
- `src/lib/shows/status.ts` — `formatShowStatus(status: ShowEntry["status"]): string` helper.
- `tests/shows-status.test.mjs` — node:test coverage.

---

### Task 1: Gate Tailwind `animate-*` keyframes behind `prefers-reduced-motion`

**Files:**
- Modify: `src/styles/global.css:150-165` (extend existing block)

- [ ] **Step 1: Inspect current reduced-motion block**

Run: `sed -n '150,170p' src/styles/global.css`
Expected: Block only neutralizes `[data-motion]`, not the Tailwind `animate-fade-in-up` / `animate-fade-in` / `animate-zoom-in` classes used in `HeroSection.astro`.

- [ ] **Step 2: Extend the `@media (prefers-reduced-motion: reduce)` block**

In `src/styles/global.css`, append inside the existing `@media (prefers-reduced-motion: reduce) { ... }` block (after the `[data-motion]` rules):

```css
  .animate-fade-in-up,
  .animate-fade-in,
  .animate-zoom-in {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
```

Rationale: `HeroSection.astro` pairs `opacity-0` with `animate-fade-in-up` so the animation forwards-fills to opacity 1. If the OS disables the animation, the user is stuck at opacity 0. `opacity: 1 !important` is a defensive guarantee.

- [ ] **Step 3: Manual verification**

```bash
npm run dev
```

Then in a browser with reduced motion enabled (macOS: System Settings → Accessibility → Display → Reduce motion):
- Visit `/`.
- Hero headline, eyebrow, paragraph, and CTA row should be visible immediately on load (no fade-up).
- Visit `/shows` and `/community`; data-motion fades should also be instant.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "fix(a11y): honor prefers-reduced-motion for Tailwind animate-* classes"
```

---

### Task 2: Remove FollowPrompt auto-open focus steal

**Files:**
- Modify: `src/components/home/FollowPrompt.astro:164-168`

- [ ] **Step 1: Identify the auto-open trigger**

Run: `grep -n "openTimer\|setTimeout(openPrompt" src/components/home/FollowPrompt.astro`
Expected: line 167 schedules `openPrompt` via `setTimeout` whenever the cooldown has expired.

- [ ] **Step 2: Remove the timer; keep the explicit trigger paths**

In `src/components/home/FollowPrompt.astro`, replace lines 164–168:

```javascript
    const expiresAt = readCooldown();

    if (expiresAt <= Date.now()) {
      openTimer = window.setTimeout(openPrompt, delayMs);
    }
```

with:

```javascript
    // Auto-open removed for a11y (WCAG 2.2.2 — no unexpected focus changes).
    // The prompt now opens only via explicit triggers (existing CTAs / footer link).
```

Also remove any now-unused `openTimer` and `delayMs` declarations and `clearTimeout(openTimer)` cleanup branches if present (search for `openTimer` to confirm).

- [ ] **Step 3: Verify existing manual triggers still work**

Run: `grep -n 'data-follow-prompt\|openPrompt' src/components/home/FollowPrompt.astro src/components/site/*.astro src/layouts/*.astro`
Confirm at least one user-initiated path calls `openPrompt` (e.g., a "Follow" CTA in the footer or hero). If none exist, add a follow CTA in the footer that calls `openPrompt()` on click.

- [ ] **Step 4: Manual verification**

```bash
npm run dev
```

- Visit `/`. Wait 10+ seconds. The follow prompt must NOT auto-open.
- Click the explicit "Follow" CTA → prompt opens, focus moves into it, Escape closes, focus returns to the trigger.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/FollowPrompt.astro
git commit -m "fix(a11y): remove FollowPrompt auto-open (WCAG 2.2.2)"
```

---

### Task 3: Lift low-opacity body text above contrast threshold

**Files:**
- Modify: `src/components/home/AboutBandSection.astro`, `CommunitySignupSection.astro`, `PersonalityStripSection.astro`, `ShowsPreviewSection.astro`, `src/pages/community/index.astro`, `src/pages/community/[slug].astro`, `src/pages/shows/[slug].astro`

- [ ] **Step 1: Locate every off-scale opacity utility on body copy**

Run: `grep -rnE "text-(white|\[var\(--color-ink\)\])/(68|72|74|76|78|82)" src/`

Expected: ~15–25 hits across the listed files.

- [ ] **Step 2: Apply the contrast policy**

Rule: round each occurrence to the nearest Tailwind-scale step that meets the WCAG AA contrast target for that surface:

- `text-[var(--color-ink)]/72`, `/74`, `/76`, `/78` (ink on light) → `text-[var(--color-ink)]/85`
- `text-[var(--color-ink)]/82` (ink on light) → `text-[var(--color-ink)]/90`
- `text-white/68` (white on ink) → `text-white/80`
- `text-white/82`, `/90` (white on ink, already passing) → leave as `/90`

For each file, run a targeted replace. Example for one file:

```bash
# in your editor or via sed dry-runs, NOT a global -i unless you've reviewed the hits first
```

Do this file by file using the Edit tool so each diff is reviewable.

- [ ] **Step 3: Manual contrast spot-check**

Open Chrome DevTools → Inspect each of: the About section paragraph, the Community signup paragraph, the Personality strip quote, the Show detail body paragraph. The contrast ratio in the Computed → Color tooltip must read ≥ 4.5:1 for normal text.

- [ ] **Step 4: Build to catch any class typos**

Run: `npm run build`
Expected: build succeeds, no Tailwind "unknown utility" errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/ src/pages/community/ src/pages/shows/
git commit -m "fix(a11y): raise body-text opacity utilities to meet 4.5:1 contrast"
```

---

### Task 4: Restore heading hierarchy on community index

**Files:**
- Modify: `src/pages/community/index.astro:85-89`

- [ ] **Step 1: Read the current heading order**

Run: `grep -n "<h[1-6]" src/pages/community/index.astro`

Expected: a section `<h2>` at line 47 ("Music for the ones still figuring it out.") followed by peer `<h2>`s inside each `<article>`.

- [ ] **Step 2: Demote card title to `<h3>` and drop the duplicate inner anchor**

In `src/pages/community/index.astro`, change lines 85–89 from:

```astro
                <h2 class="mt-4 text-2xl font-black uppercase leading-tight text-[var(--color-ink)]">
                  <a class="focus-ring rounded-sm" href={`/community/${post.slug}`}>
                    {post.title}
                  </a>
                </h2>
```

to:

```astro
                <h3 class="mt-4 text-2xl font-black uppercase leading-tight text-[var(--color-ink)]">
                  <a class="focus-ring rounded-sm" href={`/community/${post.slug}`}>
                    {post.title}
                  </a>
                </h3>
```

Then mark the existing image-wrapper anchor at line 68 as decorative so screen readers don't announce two anchors per card. Change:

```astro
              <a class="block" href={`/community/${post.slug}`}>
                <img
                  src={post.heroImageUrl}
                  alt={post.heroAlt}
                  class="aspect-[16/10] w-full object-cover object-center"
                  loading="lazy"
                />
              </a>
```

to:

```astro
              <a class="block" href={`/community/${post.slug}`} tabindex="-1" aria-hidden="true">
                <img
                  src={post.heroImageUrl}
                  alt=""
                  class="aspect-[16/10] w-full object-cover object-center"
                  loading="lazy"
                />
              </a>
```

Rationale: the inner title `<a>` is the canonical link. The wrapper anchor stays for mouse users (large hit target) but is invisible to AT, and the image is now decorative (`alt=""`) because the title carries the link semantics.

- [ ] **Step 3: Verify with axe DevTools / VoiceOver**

```bash
npm run dev
```

- VoiceOver rotor (Ctrl+Option+U → Links): each card should appear once, with the post title as its accessible name.
- VoiceOver rotor → Headings: page outline should read H1 (site) → H2 ("Music for the ones still figuring it out.") → H3 (each post title). No duplicate H2s.

- [ ] **Step 4: Commit**

```bash
git add src/pages/community/index.astro
git commit -m "fix(a11y): demote community card titles to h3 and dedupe image link"
```

---

### Task 5: Make `<main>` a reliable skip-link target

**Files:**
- Modify: `src/pages/index.astro:20`, `src/pages/community/index.astro:25`, `src/pages/community/[slug].astro:36`, `src/pages/shows/index.astro:23`, `src/pages/shows/[slug].astro:129`

- [ ] **Step 1: Find every `<main id="main-content">` instance**

Run: `grep -rn '<main id="main-content"' src/pages/`

Expected: 5 matches.

- [ ] **Step 2: Add `tabindex="-1"` to each**

For each match, change `<main id="main-content"` to `<main id="main-content" tabindex="-1"` (keep all existing classes).

Example for `src/pages/index.astro:20`:

```astro
<main id="main-content" tabindex="-1" class="mobile-nav-offset overflow-x-clip">
```

- [ ] **Step 3: Manual verification**

```bash
npm run dev
```

- Tab key on first page load → focus lands on "Skip to content" link.
- Press Enter → focus moves to `<main>`. Press Tab again → focus advances into the first focusable element in `<main>` (not back to the site nav).

- [ ] **Step 4: Commit**

```bash
git add src/pages/
git commit -m "fix(a11y): add tabindex=-1 to main for reliable skip-link focus"
```

---

### Task 6: Human-readable show status labels

**Files:**
- Create: `src/lib/shows/status.ts`
- Create: `tests/shows-status.test.mjs`
- Modify: `src/pages/shows/[slug].astro:164`

- [ ] **Step 1: Write the failing test**

Create `tests/shows-status.test.mjs`:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatShowStatus } from "../src/lib/shows/status.ts";

test("formatShowStatus: announced", () => {
  assert.equal(formatShowStatus("announced"), "On sale");
});

test("formatShowStatus: sold-out", () => {
  assert.equal(formatShowStatus("sold-out"), "Sold out");
});

test("formatShowStatus: cancelled spellings", () => {
  assert.equal(formatShowStatus("cancelled"), "Cancelled");
  assert.equal(formatShowStatus("canceled"), "Cancelled");
});

test("formatShowStatus: postponed", () => {
  assert.equal(formatShowStatus("postponed"), "Postponed");
});

test("formatShowStatus: unknown falls back to titlecased input", () => {
  assert.equal(formatShowStatus("draft"), "Draft");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/shows-status.test.mjs`
Expected: FAIL — "Cannot find module '../src/lib/shows/status.ts'".

- [ ] **Step 3: Implement the helper**

Create `src/lib/shows/status.ts`:

```typescript
const KNOWN_STATUS_LABELS: Record<string, string> = {
  announced: "On sale",
  "on-sale": "On sale",
  "sold-out": "Sold out",
  cancelled: "Cancelled",
  canceled: "Cancelled",
  postponed: "Postponed"
};

export const formatShowStatus = (status: string | undefined | null): string => {
  if (!status) return "Announced";
  const normalized = status.toLowerCase();
  if (KNOWN_STATUS_LABELS[normalized]) return KNOWN_STATUS_LABELS[normalized];
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/shows-status.test.mjs`
Expected: PASS (all 5 tests).

- [ ] **Step 5: Use the helper in the show detail page**

In `src/pages/shows/[slug].astro`:

- Add to imports (near the top, in the frontmatter block): `import { formatShowStatus } from "../../lib/shows/status";`
- Change line 164 from `<dd class="mt-3 text-lg font-semibold">{show.status}</dd>` to `<dd class="mt-3 text-lg font-semibold">{formatShowStatus(show.status)}</dd>`

- [ ] **Step 6: Build to confirm no type/import errors**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/lib/shows/status.ts tests/shows-status.test.mjs src/pages/shows/[slug].astro
git commit -m "feat(a11y): human-readable show status labels on detail page"
```

---

### Task 7: Label the marquee feedback region

**Files:**
- Modify: `src/components/home/PersonalityStripSection.astro:21`

- [ ] **Step 1: Read the current marquee container**

Run: `sed -n '18,25p' src/components/home/PersonalityStripSection.astro`

Expected: outer `<div class="mt-5 flex flex-col gap-2.5 overflow-hidden md:mt-10 md:gap-5">` wrapping the rows.

- [ ] **Step 2: Add a labeled region**

Wrap the marquee rows container in a labeled `<div role="region">`. Change:

```astro
    <div class="mt-5 flex flex-col gap-2.5 overflow-hidden md:mt-10 md:gap-5">
      {feedbackRows.map((row, rowIndex) => (
```

to:

```astro
    <div role="region" aria-label="Listener feedback" class="mt-5 flex flex-col gap-2.5 overflow-hidden md:mt-10 md:gap-5">
      {feedbackRows.map((row, rowIndex) => (
```

- [ ] **Step 3: VoiceOver verification**

```bash
npm run dev
```

VoiceOver rotor → Landmarks: a "Listener feedback" region should be enumerable. Each blockquote should be announced within that region context.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/PersonalityStripSection.astro
git commit -m "fix(a11y): label marquee feedback section as a landmark region"
```

---

### Task 8: Stabilize image dimensions on community + show flyers

**Files:**
- Modify: `src/pages/community/[slug].astro:77-82`, `src/pages/shows/[slug].astro:177-184`

Note: community card images on the index page already have a `aspect-[16/10]` class that reserves layout — they don't CLS. The detail pages are the ones that load full-size images without intrinsic dimensions. This task scopes only the detail-page hero images. Migration to `<Image>` for the locally-imported assets (the show flyer is imported in `src/data/shows.ts`) is the right long-term fix; this task uses explicit `width`/`height` so we don't take on the image-service config in this phase.

- [ ] **Step 1: Inspect the show flyer markup**

Run: `sed -n '173,188p' src/pages/shows/[slug].astro`

Expected: an `<img>` with `src={show.flyerUrl}` and no `width`/`height`.

- [ ] **Step 2: Add intrinsic dimensions to the show flyer**

In `src/pages/shows/[slug].astro`, change the flyer `<img>` to include `width="1200" height="1500"` (matching the existing ogImage default 1200×1500 ratio) plus `decoding="async"` and `loading="eager"` (it's above the fold). Use a representative excerpt — adapt to the actual markup:

```astro
              <img
                src={show.flyerUrl}
                alt={`${show.title} flyer`}
                width="1200"
                height="1500"
                decoding="async"
                loading="eager"
                class="poster-frame rounded-[1.75rem] w-full"
              />
```

- [ ] **Step 3: Inspect the community detail hero image**

Run: `sed -n '74,85p' src/pages/community/[slug].astro`

- [ ] **Step 4: Add intrinsic dimensions to the community hero**

Change the community detail hero `<img>` to include `width`/`height` (use the source image's natural ratio — if Sanity-served the aspect comes from `post.heroImageWidth`/`Height` if available, otherwise default 1600×900 for landscape posts):

```astro
              <img
                src={post.heroImageUrl}
                alt={post.heroAlt}
                width={post.heroImageWidth ?? 1600}
                height={post.heroImageHeight ?? 900}
                decoding="async"
                class="aspect-[16/9] w-full rounded-[1.75rem] object-cover"
              />
```

If `heroImageWidth`/`Height` are not on the `CommunityPostEntry` type, drop the optional chain and use literal `width="1600" height="900"`. Verify by reading `src/lib/community/types.ts`.

- [ ] **Step 5: Manual CLS check**

```bash
npm run dev
```

Open Chrome DevTools → Performance → record a reload of `/shows/<slug>` and `/community/<slug>`. CLS during load should be 0 (or trivially close).

- [ ] **Step 6: Commit**

```bash
git add src/pages/community/[slug].astro src/pages/shows/[slug].astro
git commit -m "fix(a11y): intrinsic width/height on community + show detail hero images"
```

---

### Task 9: Full-suite verification

- [ ] **Step 1: Run the existing test suite**

Run: `npm test`
Expected: all tests pass (including the new `shows-status.test.mjs`).

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: build succeeds, no Astro/Tailwind errors.

- [ ] **Step 3: Run the SEO/mobile script (sanity check)**

Run: `npm run verify:seo`
Expected: completes without regressions (script will spin up the dev server, screenshot routes, and exit 0).

- [ ] **Step 4: Lighthouse a11y audit**

In Chrome DevTools → Lighthouse → run an Accessibility audit on `/`, `/community`, `/shows`, and one show detail page. All four should score ≥ 95.

- [ ] **Step 5: Final commit / cleanup (only if anything emerged from verification)**

If any task left a TODO or follow-up, file it as a new plan in `docs/superpowers/plans/` rather than expanding this one.
