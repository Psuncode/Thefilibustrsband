# Press Kit Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three engineering improvements that make `/press` more useful to journalists and stronger for entity-graph indexing — `MusicGroup.member` Person nodes, a prefilled press-contact mailto, and clipboard-copy buttons on bio sections.

**Architecture:** Schema work consolidates around the existing `buildMusicGroupSchema` in `src/data/site.ts` (a new `buildMembers()` helper sources from `src/data/about.ts`). The mailto CTA is a plain anchor — no JS. Copy-to-clipboard adds vanilla TS to a `<script>` block at the bottom of `press.astro` with a graceful `execCommand` fallback for older Safari.

**Tech Stack:** Astro 5.5, TypeScript, Schema.org Person. No new dependencies.

**Out of Scope:**
- Downloadable EPK ZIP (asset bundling, build step).
- New bio content (band-side; current shortBio/longBio is good enough for this phase).
- Per-member profile pages with their own URLs (defer — Person nodes use `name` + `jobTitle` only).
- Visual redesign of `/press` page.
- Public `MusicGroup.member` schema on `/press/ai` (already serves the schema graph via BaseLayout).

---

## File Map

**Modify:**
- `src/data/site.ts` — add `buildMemberPersons()` helper that imports `aboutPage.members` and returns a Person[] array; extend `buildMusicGroupSchema` to include `member: buildMemberPersons()` on the MusicGroup object.
- `src/data/about.ts` — no change expected, but exporting `aboutPage` already covers what we need. (If the import path collides, expose a thin `members` re-export — verify first.)
- `src/pages/press.astro` — append a press-contact section with a prefilled mailto CTA, and add "Copy" buttons + a `<script>` block for clipboard.

**Create:** none.

**Tests:** none required (schema output verified via `dist/index.html` inspection; clipboard via manual browser check). The existing `tests/e2e/seo.spec.ts` will continue to pass — no SEO regression.

---

### Task 1: `MusicGroup.member` Person nodes

**Files:** `src/data/site.ts`

- [ ] **Step 1: Locate the schema helper**

```bash
grep -n "buildMusicGroupSchema\|MusicGroupSchema" src/data/site.ts | head -10
```

Expected: a `buildMusicGroupSchema({ image })` function returning a MusicGroup object. `member` is currently absent.

- [ ] **Step 2: Add a Person builder**

In `src/data/site.ts`, near `buildMusicGroupSchema`, add:

```typescript
import { aboutPage } from "./about";

type MemberPerson = {
  "@type": "Person";
  name: string;
  jobTitle: string;
};

const buildMemberPersons = (): readonly MemberPerson[] =>
  aboutPage.members.map((member) => ({
    "@type": "Person",
    name: member.name,
    jobTitle: member.role
  }));
```

If `aboutPage` is not currently exported from `src/data/about.ts`, add the export there (it's likely already exported — verify with `grep -n "export.*aboutPage\|export const aboutPage" src/data/about.ts`).

**Circular import safety check:** `src/data/about.ts` imports image assets and types only — no dependency back into `site.ts`. Verify:

```bash
grep -n "from.*site" src/data/about.ts
```

Expected: empty or non-`site.ts` references only. If a circular dep exists, refactor: move the Person builder to a new `src/data/members.ts` that imports from both. Otherwise the direct import is fine.

- [ ] **Step 3: Extend the MusicGroup schema**

In `buildMusicGroupSchema(...)`, add `member: buildMemberPersons()` to the returned object (alongside the existing `sameAs`, `address`, `contactPoint`, etc.).

Also extend the `MusicGroupSchema` type if it's an explicit interface (run `grep -n "type MusicGroupSchema\|interface MusicGroupSchema" src/data/site.ts`):

```typescript
member: readonly MemberPerson[];
```

If the type is structurally inferred from `as const satisfies` patterns, the addition is automatic.

- [ ] **Step 4: Build and verify**

```bash
npm run build
grep -o '"@type":"Person","name":"[^"]*"' dist/index.html | sort -u
```

Expected: 4 Person nodes — `"Hanna Eyre"`, `"Thomas Wintch"`, `"Atticus Wintch"`, `"Curtis Schnitzer"`. Order may vary depending on JSON serialization but the count must be 4.

- [ ] **Step 5: Run Playwright/SEO/test gates**

```bash
npm test
npx astro check 2>&1 | tail -3
```

Expected: 15 unit tests pass; astro check report unchanged (0 new errors — pre-existing 15 errors on main are out of scope, will be fixed by PR #5).

- [ ] **Step 6: Commit**

```bash
git add src/data/site.ts src/data/about.ts
git commit -m "feat(seo): emit Person JSON-LD for band members in MusicGroup.member"
```

(`src/data/about.ts` only included if you had to add an export; otherwise stage just `site.ts`.)

---

### Task 2: Press-contact prefilled mailto

**Files:** `src/pages/press.astro`

The page currently ends with an "Approved pull quotes" section. Insert a new "Press contact" section just before `</main>`.

- [ ] **Step 1: Build the mailto URL**

Insert helper logic in the frontmatter (after the existing imports):

```typescript
const pressMailto = (() => {
  const subject = encodeURIComponent("Filibusters press inquiry");
  const body = encodeURIComponent(
    [
      "Hi Filibusters,",
      "",
      "I'm [your name] from [outlet]. I'm working on [story angle] and would love to:",
      "  - request press assets / photos",
      "  - confirm a quote / fact",
      "  - schedule a quick interview by [date]",
      "",
      "Anything else useful: [link to outlet, deadline, etc.]",
      "",
      "Thanks,",
      "[name]"
    ].join("\n")
  );
  return `mailto:${pressPage.contactEmail}?subject=${subject}&body=${body}`;
})();
```

- [ ] **Step 2: Append the section**

Inside `<main>`, just before the closing `</main>` tag (after the "Approved pull quotes" section), add:

```astro
    <section class="border-t border-black/10 bg-[var(--color-paper-soft)]">
      <div class="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <div class="poster-frame rounded-[1.75rem] bg-white p-5 md:p-7">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Press contact</p>
          <h2 class="display-face mt-3 text-[1.75rem] uppercase leading-[0.95] tracking-[-0.03em] md:text-4xl">
            Need anything else? Email lands directly with the band.
          </h2>
          <p class="mt-4 max-w-2xl text-base leading-7 text-[var(--color-ink)]/85 md:text-lg">
            Drop a line with your outlet, deadline, and what you're after. We aim to reply within 48 hours.
          </p>
          <div class="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <a
              class="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-pink)]"
              href={pressMailto}
            >
              Email {pressPage.contactEmail}
            </a>
            <a
              class="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-black/12 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-ink)] transition hover:border-[var(--color-pink)] hover:text-[var(--color-pink)]"
              href={`mailto:${pressPage.contactEmail}`}
            >
              Plain email (no template)
            </a>
          </div>
        </div>
      </div>
    </section>
```

The second CTA gives journalists a plain mailto if the prefilled template feels too pushy.

- [ ] **Step 3: Build and verify**

```bash
npm run build
grep -o 'mailto:[^"]*' dist/press/index.html | head -3
```

Expected: at least one URL with the encoded subject and body parameters.

Open `dist/press/index.html` in a browser:
- Click the "Email …" CTA → mail client opens with subject "Filibusters press inquiry" and body template prefilled.
- Click "Plain email" → mail client opens with no subject/body.

- [ ] **Step 4: Commit**

```bash
git add src/pages/press.astro
git commit -m "feat(press): prefilled press-contact mailto CTA"
```

---

### Task 3: Copy-to-clipboard buttons on bio sections

**Files:** `src/pages/press.astro`

- [ ] **Step 1: Mark each bio section copyable**

In the existing "Short bio" and "Long bio" sections of `press.astro`, add `data-copy-target` attributes so the script can find them.

Around the existing short bio:

```astro
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Short bio</p>
          <p class="mt-4 text-base leading-7 text-[var(--color-ink)]/85 md:text-lg" data-copy-target="short-bio">{pressPage.shortBio}</p>
          <button
            type="button"
            class="focus-ring mt-4 inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-ink)] transition hover:border-[var(--color-pink)] hover:text-[var(--color-pink)]"
            data-copy-button="short-bio"
          >
            <span data-copy-label>Copy short bio</span>
          </button>
```

Around the existing long bio (note: longBio is rendered via `{pressPage.longBio.map(...)}` — wrap the rendered paragraphs in a parent `<div data-copy-target="long-bio">` and source the clipboard text from the parent's `innerText`):

```astro
          <p class="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Long bio</p>
          <div class="mt-4 space-y-4" data-copy-target="long-bio">
            {pressPage.longBio.map((paragraph) => (
              <p class="text-base leading-7 text-[var(--color-ink)]/85">{paragraph}</p>
            ))}
          </div>
          <button
            type="button"
            class="focus-ring mt-4 inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-ink)] transition hover:border-[var(--color-pink)] hover:text-[var(--color-pink)]"
            data-copy-button="long-bio"
          >
            <span data-copy-label>Copy long bio</span>
          </button>
```

(Update the body-text opacity in these new lines to `/85` so they match the Task 3 contrast policy from PR #1. They are new lines so this won't conflict with the a11y branch's existing edits.)

- [ ] **Step 2: Add the clipboard script**

Just before the closing `</BaseLayout>` (after `<Footer />`), add a `<script>` block:

```astro
<script>
  const FEEDBACK_DURATION_MS = 1600;

  const fallbackCopy = (text: string): boolean => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    textarea.remove();
    return ok;
  };

  const copyText = async (text: string): Promise<boolean> => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // fall through to fallback
      }
    }
    return fallbackCopy(text);
  };

  document.querySelectorAll<HTMLButtonElement>("[data-copy-button]").forEach((button) => {
    const targetKey = button.getAttribute("data-copy-button");
    if (!targetKey) return;
    const target = document.querySelector<HTMLElement>(`[data-copy-target="${targetKey}"]`);
    if (!target) return;
    const label = button.querySelector<HTMLElement>("[data-copy-label]");
    if (!label) return;
    const originalLabel = label.textContent;

    button.addEventListener("click", async () => {
      const text = (target.innerText || "").trim();
      if (!text) return;

      const ok = await copyText(text);
      label.textContent = ok ? "Copied!" : "Press Cmd/Ctrl + C";

      window.setTimeout(() => {
        label.textContent = originalLabel;
      }, FEEDBACK_DURATION_MS);
    });
  });
</script>
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: succeeds. Open `dist/press/index.html` and look for the new `<script>` block + the two `<button data-copy-button>` elements.

- [ ] **Step 4: Manual browser verification**

```bash
npm run dev
```

Visit `/press`:
- Click "Copy short bio" → expect "Copied!" feedback for ~1.6s, then revert. Paste somewhere — confirms the shortBio text landed in clipboard.
- Click "Copy long bio" → same pattern.
- In an http://localhost (non-HTTPS) context, the Clipboard API may be denied — the fallback `execCommand` path should still work in modern browsers. If the label flips to "Press Cmd/Ctrl + C", the fallback fired (acceptable on dev).

- [ ] **Step 5: Commit**

```bash
git add src/pages/press.astro
git commit -m "feat(press): copy-to-clipboard buttons on short/long bio sections"
```

---

### Task 4: Verification + PR

- [ ] **Step 1: Full-suite gates**

```bash
npm test
npm run build
npm run verify:seo
# If on a machine with the new Playwright setup checked out:
npm run test:e2e || echo "test:e2e not on this branch"
```

Expected: unit + build + verify:seo all clean. `test:e2e` may not exist on this branch yet (it ships in PR #6) — skipping is fine.

- [ ] **Step 2: Schema graph spot-check**

```bash
grep -o '"@type":"Person","name":"[^"]*","jobTitle":"[^"]*"' dist/index.html
```

Expected: 4 Person nodes with names + jobTitles matching the 4 members.

- [ ] **Step 3: Mailto + clipboard spot-check on `dist/press/index.html`**

```bash
grep -c 'data-copy-button' dist/press/index.html
grep -c 'mailto:' dist/press/index.html
```

Expected: `data-copy-button` count ≥ 2 (short + long), `mailto:` count ≥ 2 (prefilled + plain).

- [ ] **Step 4: Open PR** via `superpowers:finishing-a-development-branch`. Title: `feat(press): Person schema + prefilled mailto + bio clipboard buttons`.

PR body should note:
- Person nodes ship on EVERY page (via the shared MusicGroup schema in BaseLayout), not just `/press`. Good for "Filibusters band members" SERP queries from any page.
- Both mailto links open a real email client; prefilled subject is `Filibusters press inquiry`.
- Clipboard buttons use the modern API with a textarea+execCommand fallback for older Safari.
- Out-of-scope follow-ups (deferred): downloadable EPK ZIP, per-member profile pages with `Person.url`, expanded fact-sheet section on `/press`.
