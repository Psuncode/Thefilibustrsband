# GEO Content Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `/for-fans-of` into a hub + one rich, FAQ-bearing page per comparison artist, and enrich `/music/[slug]` with full lyrics + a click-to-load music video — all as static Astro with schema, to win the "bands like X" search cluster and own the band's lyrics/video surface.

**Architecture:** Pure static Astro following existing repo patterns (`getStaticPaths`, `BaseLayout` `structuredData` prop, `buildBreadcrumbList`, Tailwind idioms from `community/[slug].astro`). Data lives in `src/data/*.ts`; pages render it; JSON-LD is emitted via the existing `structuredData` prop. One CSP line is relaxed for the YouTube facade.

**Tech Stack:** Astro 5, Tailwind, TypeScript data files, Playwright e2e (`@playwright/test` + `@axe-core/playwright`), Vercel CSP headers.

**Spec:** `docs/superpowers/specs/2026-06-25-geo-content-engine-design.md`

**Verification reality:** `node:test` cannot import data files that import images (`discography.ts` imports artwork via `astro:assets`). So failing-first tests use **Playwright e2e** (run with `CI=true npm run test:e2e` to skip the darwin-only visual snapshot) plus `npm run check` (types) and `npm run build`. Each task commits on the working branch.

---

## File Structure

- `src/data/forFansOf.ts` — extend `ForFansOfEntry` (slug, hook, body[], faq[]); migrate 8 entries; add `entryBySlug`. (No image imports — safe.)
- `src/pages/for-fans-of.astro` — rewrite to a **hub** (teaser cards → sub-pages).
- `src/pages/for-fans-of/[slug].astro` — **new** per-artist page + WebPage/Breadcrumb/FAQPage JSON-LD.
- `src/data/discography.ts` — extend `Track` (`lyrics?`, `video?`).
- `src/pages/music/[slug].astro` — render lyrics + click-to-load YouTube facade; add `MusicComposition`/`lyrics` + `VideoObject` JSON-LD; deep-link the for-fans-of line.
- `vercel.json` — add `https://www.youtube-nocookie.com` to CSP `frame-src`.
- `tests/e2e/seo.spec.ts`, `tests/e2e/a11y.spec.ts`, `tests/e2e/structured-data.spec.ts` — cover the new routes + assert FAQPage and lyrics schema.

Reference patterns to copy: `src/pages/community/[slug].astro` (detail-page layout + breadcrumb), `src/pages/band/[slug].astro` (getStaticPaths + Person schema), `src/components/site/InstagramGallery.astro` (click-to-load facade + `<dialog>`), `src/lib/seo/breadcrumb.ts` (`buildBreadcrumbList`).

---

## Task 1: Extend the for-fans-of data model + migrate entries

**Files:**
- Modify: `src/data/forFansOf.ts`

- [ ] **Step 1: Replace the type + helper, keep `forFansOfEntries` exported**

Replace the top of `src/data/forFansOf.ts` (the `type` block) with:

```ts
export type ForFansOfFaq = {
  question: string;
  answer: string;
};

export type ForFansOfEntry = {
  /** kebab-case slug, e.g. "the-backseat-lovers" */
  slug: string;
  artist: string;
  /** one-line teaser shown on the /for-fans-of hub card */
  hook: string;
  /** 2-3 comparison paragraphs (what's similar / what's different) */
  body: readonly string[];
  /** The Filibusters tracks to start with (resolved against the discography). */
  recommendedTracks: readonly string[];
  /** 2-3 Q&A; rendered as a FAQ section + FAQPage JSON-LD */
  faq: readonly ForFansOfFaq[];
};
```

- [ ] **Step 2: Migrate all 8 entries to the new shape**

For each existing entry: set `slug`, add a one-line `hook`, move the current `contrastParagraph` to be the FIRST element of `body` and add **1-2 more paragraphs**, keep `recommendedTracks`, and add **2-3 `faq`** items. Slugs (exact):
`paramore`, `arctic-monkeys`, `the-1975`, `the-backseat-lovers`, `wolf-alice`, `beach-bunny`, `wallows`, `pvris`.

Worked example — replace the Paramore entry with this complete form (use it as the template for the other 7):

```ts
  {
    slug: "paramore",
    artist: "Paramore",
    hook: "Hooky, female-fronted, emotionally direct — built for the room, not the arena.",
    body: [
      "If Paramore's early discography is the entry point, The Filibusters will feel familiar before the first chorus lands. Both bands write to hook hard and play live like the room matters more than the recording. Where Paramore eventually scaled into arena-sized production, The Filibusters are still building the set for ~150-500 capacity rooms like Velour Live Music Gallery in Provo — closer to the listener, less polish, more direct.",
      "Hanna Eyre fronts the band the way Hayley Williams anchors Paramore: the vocal carries the song's emotional weight, and the writing stays openly vulnerable rather than ironic. Listeners who connect with Riot!-era Paramore or the rawer cuts off This Is Why will recognize the energy here.",
      "The difference is scale and polish, not intent. The Filibusters lean harder into the unpolished, present-tense feeling — a band you can still catch in a small Provo room before it grows."
    ],
    recommendedTracks: ["Break Up With Your Boyfriend"],
    faq: [
      {
        question: "Are The Filibusters like Paramore?",
        answer:
          "Yes — both are female-fronted alt rock built on hooks and emotionally direct writing, with a frontwoman carrying the song. The Filibusters are earlier-stage and play smaller, sweatier rooms than Paramore plays today."
      },
      {
        question: "Where should a Paramore fan start with The Filibusters?",
        answer:
          "Start with \"Break Up With Your Boyfriend\" — the hook-forward, emotionally direct side that maps most closely to Paramore."
      }
    ]
  },
```

Apply the same shape to the other 7 entries, reusing each existing `contrastParagraph` as `body[0]`, writing a `hook` and 1-2 extra body paragraphs in the band's voice, and 2-3 FAQs whose questions use natural "bands like X" phrasing (e.g. "Are The Filibusters like Arctic Monkeys?", "What Utah bands sound like The Backseat Lovers?"). Keep every `recommendedTracks` as `["Break Up With Your Boyfriend"]` (the only released track).

- [ ] **Step 3: Add the `entryBySlug` helper at the end of the file**

```ts
export const entryBySlug = (slug: string): ForFansOfEntry | undefined =>
  forFansOfEntries.find((entry) => entry.slug === slug);
```

- [ ] **Step 4: Verify types compile**

Run: `npm run check`
Expected: `0 errors` (the `forFansOfEntries` array still satisfies `readonly ForFansOfEntry[]`).

- [ ] **Step 5: Commit**

```bash
git add src/data/forFansOf.ts
git commit -m "feat(for-fans-of): extend entry model (slug, hook, body, faq)"
```

---

## Task 2: Per-artist page route with FAQPage schema (failing test first)

**Files:**
- Create: `src/pages/for-fans-of/[slug].astro`
- Test: `tests/e2e/structured-data.spec.ts` (add a case), `tests/e2e/seo.spec.ts` (add route)

- [ ] **Step 1: Write the failing e2e assertion for the FAQPage node**

Append to `tests/e2e/structured-data.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `CI=true npx playwright test structured-data -g "FAQPage"`
Expected: FAIL — `/for-fans-of/paramore` 404s (route doesn't exist yet).

- [ ] **Step 3: Create the per-artist page**

Create `src/pages/for-fans-of/[slug].astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Footer from "../../components/site/Footer.astro";
import Header from "../../components/site/Header.astro";
import { forFansOfEntries, entryBySlug } from "../../data/forFansOf";
import { discography } from "../../data/discography";
import { siteEntityIds, siteMeta, buildPageUrl, siteRoutes } from "../../data/site";
import { buildBreadcrumbList } from "../../lib/seo/breadcrumb";

export function getStaticPaths() {
  return forFansOfEntries.map((entry) => ({ params: { slug: entry.slug } }));
}

const { slug } = Astro.params;
const entry = entryBySlug(slug!);
if (!entry) {
  throw new Error(`Unknown for-fans-of slug: ${slug}`);
}

const slugByTrackTitle = new Map(discography.map((t) => [t.title.toLowerCase(), t.slug]));
const pageUrl = new URL(`/for-fans-of/${entry.slug}`, Astro.site).href;
const seoTitle = `For fans of ${entry.artist} | ${siteMeta.title}`;
const seoDescription = entry.hook;

const webPageStructuredData = {
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,
  name: seoTitle,
  url: pageUrl,
  description: seoDescription,
  isPartOf: { "@id": siteEntityIds.website },
  about: { "@id": siteEntityIds.musicGroup }
};

const faqStructuredData = {
  "@type": "FAQPage",
  "@id": `${pageUrl}#faq`,
  mainEntity: entry.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer }
  }))
};

const breadcrumbStructuredData = buildBreadcrumbList(Astro.site!.toString(), [
  { name: "Home", path: "/" },
  { name: "For fans of", path: siteRoutes.forFansOf.path },
  { name: entry.artist, path: `/for-fans-of/${entry.slug}` }
]);
---

<BaseLayout
  title={seoTitle}
  description={seoDescription}
  structuredData={[webPageStructuredData, faqStructuredData, breadcrumbStructuredData]}
>
  <Header />
  <main id="main-content" tabindex="-1" class="mobile-nav-offset overflow-x-clip bg-white">
    <section class="border-b border-black/10">
      <div class="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-pink">If you like</p>
        <h1 class="display-face mt-3 text-4xl uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
          For fans of {entry.artist}
        </h1>

        <div class="mt-8 space-y-4">
          {entry.body.map((paragraph) => (
            <p class="text-base leading-7 text-ink/85 md:text-lg">{paragraph}</p>
          ))}
        </div>

        <p class="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
          Start with:
          {entry.recommendedTracks.map((track, idx) => {
            const trackSlug = slugByTrackTitle.get(track.toLowerCase());
            return (
              <>
                {idx > 0 ? ", " : " "}
                {trackSlug ? (
                  <a class="underline" href={`/music/${trackSlug}`}>{track}</a>
                ) : (
                  <span>{track}</span>
                )}
              </>
            );
          })}
        </p>

        <section class="mt-10 border-t border-black/10 pt-8">
          <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-pink">FAQ</h2>
          <dl class="mt-5 space-y-6">
            {entry.faq.map((item) => (
              <div>
                <dt class="text-lg font-black uppercase leading-tight text-ink">{item.question}</dt>
                <dd class="mt-2 text-base leading-7 text-ink/85">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div class="mt-10 flex flex-wrap gap-3">
          <a class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-black/12 bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-ink transition hover:border-pink hover:text-pink" href={siteRoutes.forFansOf.path}>
            All comparisons
          </a>
          <a class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-pink" href={siteRoutes.shows.path}>
            See shows
          </a>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `CI=true npx playwright test structured-data -g "FAQPage"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/for-fans-of/[slug].astro tests/e2e/structured-data.spec.ts
git commit -m "feat(for-fans-of): per-artist pages with FAQPage schema"
```

---

## Task 3: Rewrite /for-fans-of as a hub

**Files:**
- Modify: `src/pages/for-fans-of.astro`

- [ ] **Step 1: Replace the entries `<section>` body with teaser cards**

Keep the existing frontmatter imports, `breadcrumbStructuredData`, the `BaseLayout`/`Header`, the hero `<section>` (eyebrow + h1 + `citable-passage`), and `<InstagramGallery />` + `<Footer />`. Replace the **second `<section>`** (the one that maps `forFansOfEntries` to `<article>` blocks) with a card grid:

```astro
    <section>
      <div class="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forFansOfEntries.map((entry) => (
            <a
              class="focus-ring poster-frame group block rounded-[1.5rem] p-5 transition hover:-translate-y-0.5 md:p-6"
              href={`/for-fans-of/${entry.slug}`}
            >
              <h2 class="display-face text-2xl uppercase leading-[0.95] tracking-[-0.03em] text-ink md:text-3xl">
                Like {entry.artist}?
              </h2>
              <p class="mt-3 text-sm leading-6 text-ink/80 md:text-base">{entry.hook}</p>
              <p class="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-pink">Read more -&gt;</p>
            </a>
          ))}
        </div>
      </div>
    </section>
```

(The `slugByTrackTitle`/`discography` import added by the earlier track-link fix is no longer used on this page — remove that import line and the map constant from the frontmatter if present, to keep `npm run check` clean.)

- [ ] **Step 2: Verify build + types**

Run: `npm run check && npm run build`
Expected: `0 errors`; build completes; page count increases by 8 (the new `/for-fans-of/[slug]` pages).

- [ ] **Step 3: Commit**

```bash
git add src/pages/for-fans-of.astro
git commit -m "feat(for-fans-of): convert page to a hub of teaser cards"
```

---

## Task 4: Extend the Track data model (lyrics + video)

**Files:**
- Modify: `src/data/discography.ts`

- [ ] **Step 1: Add the new optional fields to the `Track` type**

In `src/data/discography.ts`, add to the `Track` type (after `themesAndContext`):

```ts
  /** Full lyrics, one entry per line; "" denotes a stanza break. */
  lyrics?: readonly string[];
  /** Music video for VideoObject schema + click-to-load embed. */
  video?: {
    youTubeId: string; // 11-char video id (not the channel)
    name: string;
    uploadDate: string; // ISO YYYY-MM-DD
    description?: string;
  };
```

- [ ] **Step 2: (Data fill — requires band content) Populate the released track**

When the band provides them, add `lyrics` and `video` to the `break-up-with-your-boyfriend` entry, e.g.:

```ts
    lyrics: [
      "<line 1>",
      "<line 2>",
      "",
      "<line 3 of next stanza>"
    ],
    video: {
      youTubeId: "<11-char id>",
      name: "Break Up With Your Boyfriend (Official Video)",
      uploadDate: "2026-03-26"
    },
```

If the content is not yet available at execution time, leave both omitted — Task 5 renders a graceful fallback and skips the VideoObject. Do not block the rest of the plan on this.

- [ ] **Step 3: Verify types**

Run: `npm run check`
Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add src/data/discography.ts
git commit -m "feat(music): add optional lyrics + video fields to Track"
```

---

## Task 5: Song page — lyrics + click-to-load video + schema

**Files:**
- Modify: `src/pages/music/[slug].astro`
- Modify: `vercel.json`
- Test: `tests/e2e/structured-data.spec.ts`

- [ ] **Step 1: Write the failing e2e assertion for MusicComposition/lyrics**

This test only asserts schema when lyrics exist, so it is robust to the data-fill timing. Append to `tests/e2e/structured-data.spec.ts`:

```ts
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
    const lyricsBlockVisible = !!document.querySelector('[data-lyrics]');
    const hasComposition = items.some((i) => i["@type"] === "MusicComposition");
    return { lyricsBlockVisible, hasComposition };
  });

  // If lyrics are rendered on the page, the MusicComposition node must exist.
  if (result.lyricsBlockVisible) {
    expect(result.hasComposition, "Lyrics rendered but no MusicComposition schema").toBe(true);
  }
});
```

- [ ] **Step 2: Run it to verify current behavior**

Run: `CI=true npx playwright test structured-data -g "MusicComposition"`
Expected: PASS trivially while lyrics are absent (the `if` is skipped). This guards the invariant once lyrics are added — it is intentionally a guard, not a red test, given the data-fill timing.

- [ ] **Step 3: Add the CSP frame-src entry for the video facade**

In `vercel.json`, in the `Content-Security-Policy` value, change the `frame-src` directive from:
`frame-src https://www.instagram.com;`
to:
`frame-src https://www.instagram.com https://www.youtube-nocookie.com;`

- [ ] **Step 4: Replace the lyrics placeholder + add lyrics/video rendering and schema**

In `src/pages/music/[slug].astro` frontmatter, after the `musicRecordingStructuredData` block, add composition + video nodes and fold them into the `structuredData` array:

```ts
const lyricsText = track.lyrics?.join("\n");

const musicCompositionStructuredData = lyricsText
  ? {
      "@type": "MusicComposition",
      "@id": `${canonicalUrl}#composition`,
      name: track.title,
      lyrics: { "@type": "CreativeWork", text: lyricsText }
    }
  : undefined;

const videoStructuredData = track.video
  ? {
      "@type": "VideoObject",
      name: track.video.name,
      description: track.video.description || track.soundProfile,
      thumbnailUrl: `https://i.ytimg.com/vi/${track.video.youTubeId}/hqdefault.jpg`,
      uploadDate: track.video.uploadDate,
      embedUrl: `https://www.youtube-nocookie.com/embed/${track.video.youTubeId}`,
      contentUrl: `https://www.youtube.com/watch?v=${track.video.youTubeId}`
    }
  : undefined;

const songStructuredData = [
  musicRecordingStructuredData,
  ...(musicCompositionStructuredData ? [musicCompositionStructuredData] : []),
  ...(videoStructuredData ? [videoStructuredData] : []),
  breadcrumbStructuredData
];
```

Add `recordingOf` to the existing `musicRecordingStructuredData` object (so the recording links the composition) — only meaningful when lyrics exist, but harmless to always reference the id; to keep it clean, append after creating `musicCompositionStructuredData`:

```ts
if (musicCompositionStructuredData) {
  (musicRecordingStructuredData as Record<string, unknown>).recordingOf = {
    "@id": `${canonicalUrl}#composition`
  };
}
```

Change the `<BaseLayout ... structuredData={[musicRecordingStructuredData, breadcrumbStructuredData]}>` prop to `structuredData={songStructuredData}`.

Replace the lyrics `<section>` (currently the "Lyrics excerpt coming soon" block) with:

```astro
          <section class="mt-10 border-t border-black/10 pt-6">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-pink">Lyrics</p>
            {track.lyrics ? (
              <div data-lyrics class="mt-3 space-y-4 text-base leading-7 text-ink/85 md:text-lg">
                {track.lyrics.reduce<string[][]>((stanzas, line) => {
                  if (line === "") { stanzas.push([]); return stanzas; }
                  (stanzas[stanzas.length - 1] ||= stanzas[stanzas.push([]) - 1]).push(line);
                  return stanzas;
                }, [[]]).filter((s) => s.length).map((stanza) => (
                  <p>{stanza.map((l, i) => (<>{i > 0 ? <br /> : null}{l}</>))}</p>
                ))}
              </div>
            ) : (
              <p class="mt-3 text-base leading-7 text-ink/85 md:text-lg">
                Lyrics coming soon — contact <a class="underline" href={`mailto:${siteMeta.contactEmail}`}>{siteMeta.contactEmail}</a> to license excerpts for press use.
              </p>
            )}
          </section>

          {track.video ? (
            <section class="mt-10 border-t border-black/10 pt-6">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-pink">Video</p>
              <button
                type="button"
                class="yt-facade focus-ring poster-frame group relative mt-3 block aspect-video w-full overflow-hidden rounded-[1.5rem]"
                data-yt-id={track.video.youTubeId}
                aria-label={`Play video: ${track.video.name}`}
              >
                <img
                  src={`https://i.ytimg.com/vi/${track.video.youTubeId}/hqdefault.jpg`}
                  alt={track.video.name}
                  loading="lazy"
                  class="h-full w-full object-cover transition group-hover:scale-[1.02]"
                />
                <span class="absolute inset-0 grid place-items-center">
                  <span class="rounded-full bg-black/60 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">Play ▶</span>
                </span>
              </button>
            </section>
          ) : null}
```

Add the facade script before `</BaseLayout>` close (mirrors the Instagram facade):

```astro
<script>
  function initYtFacades() {
    document.querySelectorAll<HTMLButtonElement>(".yt-facade").forEach((el) => {
      if (el.dataset.ytBound === "true") return;
      el.dataset.ytBound = "true";
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-yt-id");
        if (!id) return;
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
        iframe.title = "YouTube video player";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.setAttribute("allowfullscreen", "");
        iframe.className = "absolute inset-0 h-full w-full";
        el.replaceChildren(iframe);
      });
    });
  }
  initYtFacades();
  document.addEventListener("astro:page-load", initYtFacades);
</script>
```

- [ ] **Step 5: Deep-link the for-fans-of line to the new sub-pages**

In `src/pages/music/[slug].astro`, replace the existing for-fans-of line:

```astro
          <p class="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            For fans of {track.forFansOf.join(", ")} — see <a class="underline" href="/for-fans-of">for-fans-of</a>.
          </p>
```

with a version that links each artist to its sub-page (add `import { forFansOfEntries } from "../../data/forFansOf";` to the frontmatter and a name→slug map):

```ts
const forFansOfSlugByArtist = new Map(forFansOfEntries.map((e) => [e.artist.toLowerCase(), e.slug]));
```

```astro
          <p class="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            For fans of
            {track.forFansOf.map((artist, idx) => {
              const s = forFansOfSlugByArtist.get(artist.toLowerCase());
              return (
                <>
                  {idx > 0 ? ", " : " "}
                  {s ? <a class="underline" href={`/for-fans-of/${s}`}>{artist}</a> : <span>{artist}</span>}
                </>
              );
            })}
          </p>
```

- [ ] **Step 6: Verify types, build, and the schema guard**

Run: `npm run check && npm run build && CI=true npx playwright test structured-data`
Expected: `0 errors`; build OK; structured-data tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/pages/music/[slug].astro vercel.json tests/e2e/structured-data.spec.ts
git commit -m "feat(music): render lyrics + click-to-load video with schema"
```

---

## Task 6: Extend e2e route coverage (SEO + a11y)

**Files:**
- Modify: `tests/e2e/seo.spec.ts`, `tests/e2e/a11y.spec.ts`

- [ ] **Step 1: Add the new routes to the SEO static-route list**

In `tests/e2e/seo.spec.ts`, add `"/for-fans-of/paramore"` to the `staticRoutes` array (it already contains `/for-fans-of`, `/music`, etc. — keep the existing entries).

- [ ] **Step 2: Add the new route to the a11y route list**

In `tests/e2e/a11y.spec.ts`, add `"/for-fans-of/paramore"` to the `routes` array.

- [ ] **Step 3: Run the full e2e suite under CI conditions**

Run: `CI=true npm run test:e2e`
Expected: all tests pass, 1 skipped (visual). Confirms SEO tags + no serious/critical axe violations on the new per-artist page.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/seo.spec.ts tests/e2e/a11y.spec.ts
git commit -m "test(e2e): cover per-artist for-fans-of route (seo + a11y)"
```

---

## Task 7: Final verification + agent-browser smoke

**Files:** none (verification only)

- [ ] **Step 1: Full local gate**

Run: `npm run check && npm test && npm run build`
Expected: 0 type errors; `npm test` passes (drift guards unaffected); build completes with the 8 new `/for-fans-of/[slug]` pages.

- [ ] **Step 2: agent-browser smoke (preview server)**

```bash
npm run preview >/dev/null 2>&1 &
sleep 4
agent-browser open http://localhost:4321/for-fans-of/ --session geo
agent-browser eval "document.querySelectorAll('a[href^=\"/for-fans-of/\"]').length" --session geo   # expect 8
agent-browser open http://localhost:4321/for-fans-of/the-backseat-lovers/ --session geo
agent-browser get text h1 --session geo                                                              # expect "FOR FANS OF THE BACKSEAT LOVERS"
agent-browser eval "!!document.querySelector('dl dt')" --session geo                                 # FAQ rendered
agent-browser open http://localhost:4321/music/break-up-with-your-boyfriend/ --session geo
agent-browser get text h1 --session geo
agent-browser close --session geo
pkill -f "astro preview"
```
Expected: hub lists 8 sub-page links; a sub-page renders H1 + FAQ; song page loads.

- [ ] **Step 3: Open the PR**

```bash
git push -u origin <branch>
gh pr create --base main --title "feat: GEO content engine — per-artist pages + lyrics/video" --body "Implements docs/superpowers/specs/2026-06-25-geo-content-engine-design.md"
```

---

## Self-review notes (author)

- **Spec coverage:** hub (Task 3), per-artist pages + FAQPage (Task 2), data model (Tasks 1, 4), lyrics + VideoObject + MusicComposition (Task 5), CSP (Task 5 Step 3), deep-linking (Task 5 Step 5), sitemap (automatic — no task needed), tests (Tasks 2, 5, 6). All spec sections mapped.
- **Data-fill dependency:** lyrics + video content (band-supplied) is isolated to Task 4 Step 2; every page/schema/test degrades gracefully when absent, so the plan ships without it and lights up when the data lands.
- **Type consistency:** `ForFansOfEntry.slug/hook/body/faq` (Task 1) are used identically in Tasks 2/3/5; `Track.lyrics/video` (Task 4) used in Task 5; `entryBySlug` defined in Task 1 used in Task 2.
- **No `node:test` on image-importing data** — verification is e2e + check + build throughout.
