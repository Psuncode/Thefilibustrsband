# Design Distinctiveness Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Two conservative, easily-reversible changes that address the frontend-design audit's "looks like a generic indie-band template" finding: (1) swap body font Inter for Space Grotesk (more characterful free Google grotesk), (2) add a subtle site-wide SVG noise overlay for tactile texture.

**Architecture:** Both changes touch only `src/layouts/BaseLayout.astro` (font preload + link tags) and `src/styles/global.css` (font-family + body::before noise rule). No component edits, no layout changes. Either change can be reverted by `git revert` in a single commit if disliked.

**Tech Stack:** Google Fonts (`Space Grotesk`), inline SVG data URI for noise. No new dependencies.

**Out of Scope** (deferred — these need design partnership to do well):
- Layout rhythm break (varying section shapes beyond the poster-frame card).
- CTA personality variants.
- Hero gradient → halftone/grain printed effect.
- Typography hierarchy refinement.
- Header/navigation redesign.

**Rationale on font choice:** Space Grotesk is a free Google grotesk with more character than Inter (slightly geometric, friendly, modern). It's not Söhne (paid) but reads similarly. Keeps the existing Archivo Black for display headings — Space Grotesk pairs well with it. If you'd prefer something else (Onest, Geist Sans, GT America via direct license, etc.), revert this commit and re-do with the alternative.

---

### Task 1: Swap body font to Space Grotesk

**Files:** `src/layouts/BaseLayout.astro`, `src/styles/global.css`

- [ ] **Step 1: Update Google Fonts link in BaseLayout**

In `src/layouts/BaseLayout.astro`, find:

```astro
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&display=swap"
    />
```

Change `Inter:wght@400;500;600;700;800` to `Space+Grotesk:wght@400;500;600;700`:

```astro
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&display=swap"
    />
```

(Space Grotesk doesn't ship an 800 weight; 700 is its boldest. Verify by visiting fonts.google.com/specimen/Space+Grotesk.)

- [ ] **Step 2: Update body font-family in global.css**

In `src/styles/global.css` line ~42, change:

```css
  font-family: "Inter", system-ui, sans-serif;
```

to:

```css
  font-family: "Space Grotesk", "Inter", system-ui, sans-serif;
```

(Inter stays as a fallback in case Space Grotesk fails to load.)

Also update line ~73 — the display heading fallback chain:

```css
  font-family: "Archivo Black", "Inter", system-ui, sans-serif;
```

becomes:

```css
  font-family: "Archivo Black", "Space Grotesk", system-ui, sans-serif;
```

- [ ] **Step 3: Audit other font-weight references**

Search for any class or rule that uses `font-weight: 800`:

```bash
grep -rn "font-weight.*800\|font-extrabold\|font-black" src/styles/ src/components/ 2>/dev/null | head
```

If any usage assumes 800 weight from Inter, audit case-by-case:
- `font-black` in Tailwind = 900 (works with Archivo Black for display, falls back to 700 in Space Grotesk for body — visually similar enough).
- Explicit `font-weight: 800` in CSS should be downgraded to 700 OR moved to a `<span class="display-face">` if the intent was display weight.

Don't make blanket changes — only adjust if a visual regression is obvious.

- [ ] **Step 4: Build + visual check**

```bash
npm run build
npm run dev
```

Browse `/`, `/about`, `/shows`. Body copy should look slightly more characterful (Space Grotesk has more personality in lowercase glyphs). Display headings still use Archivo Black — no change there.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat(design): swap body font Inter -> Space Grotesk for more character"
```

---

### Task 2: Site-wide subtle noise overlay

**Files:** `src/styles/global.css`

The audit asked for "grain/noise textures" for tactile depth. A 1% opacity SVG noise overlay site-wide adds printed-zine feel without changing any layout.

- [ ] **Step 1: Add the overlay rule**

In `src/styles/global.css`, near the existing `body` rule, add:

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.9 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 200px 200px;
}

@media (prefers-reduced-motion: reduce) {
  body::before {
    opacity: 0;
  }
}
```

Notes:
- `pointer-events: none` so the overlay never blocks interaction.
- `z-index: 9999` ensures it sits above content. (If anything else uses higher z-index, audit later.)
- `mix-blend-mode: multiply` lets the noise integrate with light AND dark sections.
- `opacity: 0.04` — start subtle. Bump to 0.06–0.08 if invisible on a real display. Tweak after visual verification.
- The fractalNoise SVG is inlined as a data URI so no extra HTTP request.
- Reduced-motion users get NO overlay (noise can be sensory-distracting for some).

- [ ] **Step 2: Build + visual check**

```bash
npm run dev
```

Browse `/` and `/shows`. The noise should be subtle — visible on plain backgrounds (paper-soft, white) but not dominant. Adjust opacity if too strong or invisible.

If the overlay interferes with the existing modals (SubscribeModal, FollowPrompt), audit z-index — those modals typically render at `z-index: 50` or so. The noise at `z-index: 9999` will sit ABOVE modals. If that's wrong (e.g., the noise should be behind modals), lower noise z-index to `z-index: 1` and remove `position: fixed` (use absolute on a wrapper instead). Defer that nuance — start with the simplest version.

- [ ] **Step 3: Verify modals still work**

Click the footer "Follow the band" CTA or anything that opens a modal. Confirm the modal renders correctly. If the noise layer covers it, lower noise z-index — see note above.

- [ ] **Step 4: Run all gates**

```bash
npm test
npm run build
npm run verify:seo
```

Expected: all green. Noise overlay is purely visual; no DOM structure change.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(design): site-wide subtle SVG noise overlay (printed-zine texture)"
```

---

### Task 3: Verification + PR

- [ ] **Step 1: All gates**

```bash
npm test
npm run build
npm run verify:seo
```

Expected: all green.

- [ ] **Step 2: Visual confirmation (manual)**

Quick browse:
- `/` — body copy character, noise subtlety
- `/shows` — same checks on dark show flyer backdrop (noise reads differently on dark)
- `/community` — paper-soft background with noise
- Open the FollowPrompt modal — confirm noise doesn't visually break the dialog

- [ ] **Step 3: Open PR** via `superpowers:finishing-a-development-branch`.

Title: `feat(design): Space Grotesk body font + subtle site-wide noise overlay`.

PR body should:
- Explain Space Grotesk choice (free, characterful, pairs with Archivo Black).
- Note that the overlay is `prefers-reduced-motion`-aware.
- List the deferred design items (layout rhythm, CTA personality, hero gradient texture) — those need design partnership.
- Emphasize easy revert path: `git revert <font-commit>` or `git revert <noise-commit>` to roll back either independently.
