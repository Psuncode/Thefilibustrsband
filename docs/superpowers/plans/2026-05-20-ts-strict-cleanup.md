# TypeScript Strict Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drive `npx astro check` from 15 errors to 0, unblocking strict CI gating in a future phase.

**Architecture:** Four files, four kinds of fix. Most are local annotations or boundary casts — no schema changes, no data refactors. Specifically: (1) annotate DOM-handler variables and parameters in `SubscribeModal.astro`, (2) cast analytics-event `properties` to `Record<string, AllowedPropertyValues>` at the call site in `BaseLayout.astro` (the lib remains plain JS), (3) widen the fallback show-data type at its import boundary via a type-only re-export shape, (4) use a type-predicate filter in `about.astro` so `.filter(Boolean)` narrows correctly.

**Tech Stack:** Astro 5.5, TypeScript 5.8, `@vercel/analytics`. No new dependencies.

**Out of Scope:**
- Migrating `src/lib/analytics.js` to `.ts` (separate refactor, defer).
- Strict-mode `tsconfig.json` flag flips (defer to a future strict-CI phase).
- The 2 unused-Image warnings on `src/pages/community/*.astro` — Astro modernization PR #2 already adds the `<Image>` usage that consumes those imports; warnings vanish on merge.

---

## File Map

**Modify:**
- `src/components/site/SubscribeModal.astro` — annotate `opener` and `trapFocus(event)`.
- `src/layouts/BaseLayout.astro` — cast analytics `properties` at three `track(...)` call sites.
- `src/lib/shows/data.ts` — cast `fallbackShows` to a permissive type at boundary so optional `endsAt` and union-narrowing on `seoDescription`/`summary` resolve.
- `src/pages/about.astro` — replace `.filter(Boolean)` with a type-predicate filter for `heroCtas` and `footerCtas`.

---

### Task 1: SubscribeModal DOM-handler types

**Files:** `src/components/site/SubscribeModal.astro`

- [ ] **Step 1: Locate the affected lines**

```bash
grep -nE "let opener|trapFocus = \(event\)" src/components/site/SubscribeModal.astro
```

Expected: `let opener = null;` (~line 102), `const trapFocus = (event) => {` (~line 115).

- [ ] **Step 2: Annotate `opener`**

Change:

```javascript
    let opener = null;
```

to:

```javascript
    let opener: HTMLElement | null = null;
```

- [ ] **Step 3: Annotate `trapFocus` parameter**

Change:

```javascript
    const trapFocus = (event) => {
```

to:

```javascript
    const trapFocus = (event: KeyboardEvent) => {
```

(The handler is registered via `document.addEventListener("keydown", trapFocus)` somewhere in the same `<script>` block — keydown delivers a `KeyboardEvent`, so this is precise.)

- [ ] **Step 4: Verify**

```bash
npx astro check 2>&1 | grep "SubscribeModal.astro" | head
```

Expected: zero matches (the 3 SubscribeModal errors are gone). Other errors in other files remain — that's fine.

- [ ] **Step 5: Commit**

```bash
git add src/components/site/SubscribeModal.astro
git commit -m "fix(ts): annotate SubscribeModal opener + trapFocus handler"
```

---

### Task 2: BaseLayout analytics-event call-site cast

**Files:** `src/layouts/BaseLayout.astro`

Context: `src/lib/analytics.js` (plain JS) returns events shaped like `{ eventName, properties: { source, label } }` or `{ eventName, properties: { location, platform } }`. TS infers `properties` as `{ source: any; label: any; }` (or the music variant), which doesn't structurally satisfy `Record<string, AllowedPropertyValues>` because it lacks an index signature. Three `track(...)` call sites fail. We cast `properties` at each call site.

- [ ] **Step 1: Locate the three call sites**

```bash
grep -nE "track\(.*\.properties" src/layouts/BaseLayout.astro
```

Expected: three lines around 107, 121, 135.

- [ ] **Step 2: Cast `properties` to the analytics-accepted type**

For each of the three `track(...)` calls, change:

```javascript
            track(linkEvent.eventName, linkEvent.properties);
            track(clickEvent.eventName, clickEvent.properties);
            track(formEvent.eventName, formEvent.properties);
```

to (preserving the variable name on each line):

```javascript
            track(linkEvent.eventName, linkEvent.properties as Record<string, string | number | boolean | null>);
            track(clickEvent.eventName, clickEvent.properties as Record<string, string | number | boolean | null>);
            track(formEvent.eventName, formEvent.properties as Record<string, string | number | boolean | null>);
```

Rationale: `Record<string, AllowedPropertyValues>` is the @vercel/analytics public type. We approximate with the same primitive set (`string | number | boolean | null`) so we don't take a hard dependency on the type name — `AllowedPropertyValues` is an internal export. The cast is safe because `analytics.js` only ever assigns string values.

- [ ] **Step 3: Verify**

```bash
npx astro check 2>&1 | grep "BaseLayout.astro" | grep -v "warning"
```

Expected: zero error lines.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "fix(ts): cast analytics event properties to Record at track() call sites"
```

---

### Task 3: shows/data.ts fallback boundary widening

**Files:** `src/lib/shows/data.ts`

Context: `src/data/shows.ts` exports `upcomingShows` declared `as const`, which gives TS a deeply-literal readonly tuple type. When `data.ts` maps over it, the union over different show objects loses common ground: the BYU entry has no `endsAt`, so `show.endsAt` access errors; literal `seoDescription` values are all non-empty strings, so TS narrows `show.summary` access in the `||` fall-through to `never`. We widen the import boundary by retyping to a permissive raw-show shape — no schema refactor.

- [ ] **Step 1: Locate the import**

```bash
sed -n '1,12p' src/lib/shows/data.ts
```

Expected: `import { upcomingShows as fallbackShows } from "../../data/shows";` at line 1.

- [ ] **Step 2: Add a permissive boundary type alias**

Just below the imports (before `const DEFAULT_COUNTRY = ...`), insert:

```typescript
type FallbackShowSource = {
  readonly title: string;
  readonly slug: string;
  readonly status: ShowEntry["status"];
  readonly startsAt: string;
  readonly endsAt?: string;
  readonly venue: string;
  readonly city: string;
  readonly state: string;
  readonly country?: string;
  readonly ticketUrl?: string;
  readonly flyerUrl?: string;
  readonly organizerName?: string;
  readonly organizerUrl?: string;
  readonly offers?: ShowEntry["offers"];
  readonly summary: string;
  readonly body: readonly string[];
  readonly lineup: readonly string[];
  readonly notes?: string;
  readonly seoDescription?: string;
};

const fallbackSource = fallbackShows as readonly FallbackShowSource[];
```

Then change the existing `fallbackEntries` mapper from iterating `fallbackShows` to iterating `fallbackSource`:

```typescript
const fallbackEntries: ShowEntry[] = fallbackSource.map((show) => ({
  // ...existing body unchanged...
}));
```

(Only the iteration target changes — the mapper body stays as-is.)

If `ShowEntry["status"]` doesn't widen cleanly (i.e., the source `status` literals don't match), narrow the cast: change `readonly status: ShowEntry["status"]` to `readonly status: string` and rely on `mapShowEntry`'s downstream validation. Document the choice in the commit message.

- [ ] **Step 3: Verify**

```bash
npx astro check 2>&1 | grep "shows/data.ts"
```

Expected: zero matches.

- [ ] **Step 4: Build to confirm runtime unchanged**

```bash
npm run build
```

Expected: succeeds, 18 pages. Open one show page to confirm rendering is the same.

- [ ] **Step 5: Commit**

```bash
git add src/lib/shows/data.ts
git commit -m "fix(ts): widen fallback show source at boundary to allow optional endsAt"
```

---

### Task 4: about.astro `.filter(Boolean)` type predicate

**Files:** `src/pages/about.astro`

Context: `[listenCta, contactCta].filter(Boolean)` returns `(CTA | undefined)[]` in TypeScript because `Boolean` doesn't carry a type predicate. The mapped `cta` is therefore possibly undefined at all 4 hit sites (lines 71, 73, 252, 254). Fix with a typed-predicate filter.

- [ ] **Step 1: Locate the source line + the CTA type**

```bash
grep -nE "heroCtas|footerCtas|listenCta|contactCta|showsCta|communityCta" src/pages/about.astro | head -10
```

Find:
- The declarations of `heroCtas` and `footerCtas` (around lines 23–24).
- Where `listenCta`, `contactCta`, etc. are sourced from. Probably `aboutPage` or `siteRoutes`.

```bash
grep -nE "listenCta|contactCta|showsCta|communityCta" src/data/about.ts | head -10
```

Identify the type of each individual CTA. It's likely something like `{ label: string; href: string } | undefined`.

- [ ] **Step 2: Replace `.filter(Boolean)` with a type predicate**

Change:

```typescript
const heroCtas = [listenCta, contactCta].filter(Boolean);
const footerCtas = [listenCta, showsCta, communityCta, contactCta].filter(Boolean);
```

to:

```typescript
type CtaEntry = { label: string; href: string };
const isCta = (value: CtaEntry | undefined | null): value is CtaEntry => Boolean(value);
const heroCtas = [listenCta, contactCta].filter(isCta);
const footerCtas = [listenCta, showsCta, communityCta, contactCta].filter(isCta);
```

(If the actual CTA type differs — e.g., already declared as `Cta` somewhere in `src/data/about.ts` — use the existing type name and remove the local `CtaEntry` declaration. Run `grep -n "type.*Cta\|interface.*Cta" src/data/about.ts` to discover.)

- [ ] **Step 3: Verify**

```bash
npx astro check 2>&1 | grep "about.astro"
```

Expected: zero error matches for the 4 `cta is possibly undefined` errors.

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: succeeds; about page renders identically (the filter behavior is identical at runtime; only the static type narrows).

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro
git commit -m "fix(ts): use typed predicate filter for heroCtas/footerCtas"
```

---

### Task 5: Verification + PR

- [ ] **Step 1: Confirm clean `astro check`**

```bash
npx astro check 2>&1 | tail -5
```

Expected: `Result (... files): 0 errors, 0 warnings, N hints`. The 2 community-page `Image declared but never read` warnings will still appear on this branch (they're resolved by PR #2 which merges separately). Otherwise: zero errors.

If there are unexpected errors, do NOT silently ignore — re-dispatch a fix subagent for the specific failure.

- [ ] **Step 2: Run full gates**

```bash
npm test
npm run build
npm run verify:seo
```

Expected: all green.

- [ ] **Step 3: Commit summary** (skip if nothing new emerged)

- [ ] **Step 4: Open PR** via `superpowers:finishing-a-development-branch`. Title: `fix(ts): resolve all 15 pre-existing astro check errors`.
