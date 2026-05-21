# Win Keywords + Win AI Citations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the three highest-ROI structural moves from the 2026-05-21 strategic audit: a `/music/[slug]` per-song corpus with MusicRecording schema (closes the only structural GEO gap), a `/for-fans-of` HTML page promoting the existing comparison content out of `llms.txt`, and a BYU Battle of the Bands winner claim + a `/shows/provo-2026-06` aggregator (catches "Provo live music this weekend" search traffic).

**Architecture:** Three new content surfaces, one schema enrichment, one llms-full regeneration. The `/music` corpus follows the existing `/shows/[slug]` and `/community/[slug]` dynamic-route pattern, sourced from a typed `src/data/discography.ts` so the band can clone the existing entry to add new songs. `/for-fans-of` is a single static page sourced from `src/data/forFansOf.ts` so comparison framing lives in one place. The BYU winner claim is a content edit on the existing show entry plus a new optional `award` field on `ShowEntry`. The June aggregator is a static Astro page filtering `upcomingShows` to Provo + June 2026.

**Tech Stack:** Astro 5.5, TypeScript, Schema.org `MusicRecording` + `ItemList`. No new dependencies. Existing helpers reused: `buildBreadcrumbList`, `siteMeta`, `siteEntityIds.musicGroup`.

**Out of Scope** (band-side or deferred):
- Additional songs beyond "Break Up With Your Boyfriend" (band clones the discography entry).
- Real lyric excerpts (legal/license decision — placeholder for now).
- Wikidata / MusicBrainz / Songkick / Bandcamp / Last.fm / Genius profile creation.
- Journalist quotes for `pressPage.quotes` upgrade.
- Spotify "About" blurb alignment.
- Multi-month aggregator pages (only June 2026 in scope; pattern is replicable).

---

## File Map

**Create:**
- `src/data/discography.ts` — `discography: Track[]` (initial entry: Break Up With Your Boyfriend).
- `src/pages/music/index.astro` — discography index page.
- `src/pages/music/[slug].astro` — per-song detail page with MusicRecording JSON-LD.
- `src/data/forFansOf.ts` — comparison-artist data (3 entries).
- `src/pages/for-fans-of.astro` — comparison HTML page.
- `src/pages/shows/provo-2026-06.astro` — June aggregator with ItemList schema.
- `public/ai/discography.txt` — plain-text catalog for AI ingest.

**Modify:**
- `src/data/site.ts` — add `music`, `forFansOf` entries to `siteRoutes`; add `siteEntityIds.discography` if needed.
- `src/data/shows.ts` — rewrite BYU entry with winner status + add `award` field.
- `src/lib/shows/types.ts` — extend `ShowEntry` with optional `award?: string`.
- `src/pages/shows/[slug].astro` — wire `award` into Event JSON-LD.
- `src/pages/llms-full.txt.ts` — append discography section.
- `src/data/lastmod-map.mjs` — (only if needed; static routes don't normally need entries).

---

### Task 1: Discography data + types

**Files:** `src/data/discography.ts` (new)

- [ ] **Step 1: Create the data file**

```typescript
import type { ImageMetadata } from "astro";
import breakUpWithYourBoyfriendCover from "../assets/images/break-up-with-your-boyfriend-cover.jpg";

export type Track = {
  slug: string;
  title: string;
  releaseDate: string; // ISO YYYY-MM-DD
  durationISO8601: string; // e.g. "PT3M42S"
  artwork: ImageMetadata;
  artworkAlt: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  /** 2-3 sentence description naming instruments + mood. Used for citable schema description. */
  soundProfile: string;
  /** 3 named artists whose listeners would connect with this track. */
  forFansOf: readonly string[];
  /** 80-150 word citable passage about themes, recording context, what the song is about. */
  themesAndContext: string;
};

export const discography: readonly Track[] = [
  {
    slug: "break-up-with-your-boyfriend",
    title: "Break Up With Your Boyfriend",
    releaseDate: "2026-03-26",
    durationISO8601: "PT3M30S",
    artwork: breakUpWithYourBoyfriendCover,
    artworkAlt: "Break Up With Your Boyfriend single artwork by The Filibusters.",
    spotifyUrl: "https://open.spotify.com/artist/4Mf8AkUvGERBfOkG8ozuDl",
    appleMusicUrl: "https://music.apple.com/us/artist/the-filibusters/1550597371",
    youtubeUrl: "https://www.youtube.com/@TheFilibustersband",
    soundProfile:
      "A driving alt rock track built around urgent vocals, a hooky chorus, and instrumentation that leans loud and direct. The mix is intentionally a little messy — guitars carry the emotional weight while the rhythm section keeps the tension wound.",
    forFansOf: ["Paramore", "The 1975", "Arctic Monkeys"],
    themesAndContext:
      "Break Up With Your Boyfriend is The Filibusters' single released March 26, 2026 — written in the spiral of late-night overthinking and the conversations you keep rehearsing but never have. The song doesn't ask the listener to be okay; it asks them to turn the volume up and stay in the discomfort until something underneath clears. Recorded in Provo with the live-room feel the band is known for, the track is structured to land hard on first listen and hit differently on the third. Lyrically, it sits squarely in The Filibusters' lane: emotional directness over polish, hooks that stay, and a refusal to dress up the feeling underneath."
  }
] as const;

export const trackBySlug = (slug: string): Track | undefined =>
  discography.find((track) => track.slug === slug);
```

- [ ] **Step 2: Type-check**

```bash
npx astro check 2>&1 | grep "discography" || echo "no new errors"
```

- [ ] **Step 3: Commit**

```bash
git add src/data/discography.ts
git commit -m "feat(music): seed discography data with Break Up With Your Boyfriend"
```

---

### Task 2: `/music/[slug]` detail page

**Files:** `src/pages/music/[slug].astro` (new)

- [ ] **Step 1: Create the file**

```astro
---
import { Image } from "astro:assets";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Footer from "../../components/site/Footer.astro";
import Header from "../../components/site/Header.astro";
import { discography, trackBySlug } from "../../data/discography";
import { siteEntityIds, siteMeta } from "../../data/site";
import { buildBreadcrumbList } from "../../lib/seo/breadcrumb";

export function getStaticPaths() {
  return discography.map((track) => ({
    params: { slug: track.slug }
  }));
}

const { slug } = Astro.params;
const track = trackBySlug(slug!);
if (!track) {
  throw new Error(`Unknown track slug: ${slug}`);
}

const canonicalUrl = new URL(`/music/${track.slug}`, Astro.site).href;
const absoluteArtwork = new URL(track.artwork.src, Astro.site).href;

const musicRecordingStructuredData = {
  "@context": "https://schema.org",
  "@type": "MusicRecording",
  "@id": `${canonicalUrl}#recording`,
  name: track.title,
  url: canonicalUrl,
  image: absoluteArtwork,
  duration: track.durationISO8601,
  datePublished: track.releaseDate,
  description: track.soundProfile,
  inLanguage: "en",
  byArtist: {
    "@id": siteEntityIds.musicGroup
  }
};

const breadcrumbStructuredData = buildBreadcrumbList(Astro.site!.toString(), [
  { name: "Home", path: "/" },
  { name: "Music", path: "/music" },
  { name: track.title, path: `/music/${track.slug}` }
]);

const platformLinks = [
  track.spotifyUrl ? { label: "Spotify", href: track.spotifyUrl } : null,
  track.appleMusicUrl ? { label: "Apple Music", href: track.appleMusicUrl } : null,
  track.youtubeUrl ? { label: "YouTube", href: track.youtubeUrl } : null
].filter((link): link is { label: string; href: string } => Boolean(link));
---

<BaseLayout
  title={`${track.title} | ${siteMeta.title}`}
  description={track.soundProfile}
  ogImage={absoluteArtwork}
  ogImageWidth={1200}
  ogImageHeight={1200}
  ogType="article"
  structuredData={[musicRecordingStructuredData, breadcrumbStructuredData]}
>
  <Header />
  <main id="main-content" tabindex="-1" class="mobile-nav-offset overflow-x-clip bg-white">
    <section class="border-b border-black/10">
      <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <article class="max-w-3xl">
          <p class="text-sm font-bold uppercase tracking-[0.2em] text-pink">Single</p>
          <h1 class="display-face mt-3 text-4xl uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
            {track.title}
          </h1>
          <p class="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Released {new Date(track.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <aside class="citable-passage mt-6" aria-label="About this song">
            <span class="citable-passage-label">About this song</span>
            {track.themesAndContext}
          </aside>

          <p class="mt-6 text-base leading-7 text-ink/85 md:text-lg">{track.soundProfile}</p>

          <p class="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            For fans of {track.forFansOf.join(", ")} — see <a class="underline" href="/for-fans-of">for-fans-of</a>.
          </p>

          {platformLinks.length > 0 ? (
            <div class="mt-8 flex flex-wrap gap-3">
              {platformLinks.map((link) => (
                <a
                  class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-pink"
                  href={link.href}
                  rel="me noreferrer"
                  target="_blank"
                >
                  Listen on {link.label}
                </a>
              ))}
            </div>
          ) : null}

          <section class="mt-10 border-t border-black/10 pt-6">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-pink">Lyrics excerpt</p>
            <p class="mt-3 text-base leading-7 text-ink/85 md:text-lg">
              Lyrics excerpt coming soon — contact <a class="underline" href={`mailto:${siteMeta.contactEmail}`}>{siteMeta.contactEmail}</a> to license excerpts for press use.
            </p>
          </section>
        </article>

        <aside class="poster-frame overflow-hidden rounded-[2rem]">
          <Image
            src={track.artwork}
            alt={track.artworkAlt}
            width="1200"
            height="1200"
            decoding="async"
            class="aspect-square w-full object-cover object-center"
          />
        </aside>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Build + verify**

```bash
npm run build
grep -o '"@type":"MusicRecording"' dist/music/break-up-with-your-boyfriend/index.html
grep -o '"@type":"BreadcrumbList"' dist/music/break-up-with-your-boyfriend/index.html
```

Expected: both render.

- [ ] **Step 3: Commit**

```bash
git add src/pages/music/\[slug\].astro
git commit -m "feat(music): per-song detail page with MusicRecording + BreadcrumbList schema"
```

---

### Task 3: `/music` index + sitemap wiring

**Files:** `src/pages/music/index.astro` (new), `src/data/site.ts` (modify)

- [ ] **Step 1: Add `music` to `siteRoutes`**

In `src/data/site.ts`, locate the `siteRoutes` object. Add:

```typescript
  music: { label: "Music", path: "/music" },
```

If `siteRoutes` is `as const satisfies` something, just add the entry.

- [ ] **Step 2: Create the index page**

`src/pages/music/index.astro`:

```astro
---
import { Image } from "astro:assets";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Footer from "../../components/site/Footer.astro";
import Header from "../../components/site/Header.astro";
import { discography } from "../../data/discography";
import { siteMeta } from "../../data/site";
import { buildBreadcrumbList } from "../../lib/seo/breadcrumb";

const breadcrumbStructuredData = buildBreadcrumbList(Astro.site!.toString(), [
  { name: "Home", path: "/" },
  { name: "Music", path: "/music" }
]);
---

<BaseLayout
  title={`Music | ${siteMeta.title}`}
  description="Discography and streaming links for The Filibusters' alt rock catalog."
  structuredData={[breadcrumbStructuredData]}
>
  <Header />
  <main id="main-content" tabindex="-1" class="mobile-nav-offset overflow-x-clip bg-paper-soft">
    <section class="border-b border-black/10 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <p class="text-[0.82rem] font-bold uppercase tracking-[0.2em] text-pink md:text-sm">Discography</p>
        <h1 class="display-face mt-3 max-w-4xl text-[2.35rem] uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
          Music by The Filibusters
        </h1>
        <aside class="citable-passage mt-6" aria-label="Music summary">
          <span class="citable-passage-label">Music summary</span>
          {siteMeta.canonicalParagraph}
        </aside>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <div class="grid gap-4 md:grid-cols-2 md:gap-5">
          {discography.map((track) => (
            <article class="poster-frame overflow-hidden rounded-[1.75rem]">
              <a class="block" href={`/music/${track.slug}`} tabindex="-1" aria-hidden="true">
                <Image
                  src={track.artwork}
                  alt=""
                  width="1200"
                  height="1200"
                  decoding="async"
                  class="aspect-square w-full object-cover object-center"
                />
              </a>
              <div class="p-4 md:p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Released {new Date(track.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </p>
                <h2 class="mt-3 text-2xl font-black uppercase leading-tight text-ink">
                  <a class="focus-ring rounded-sm" href={`/music/${track.slug}`}>
                    {track.title}
                  </a>
                </h2>
                <p class="mt-4 text-sm leading-6 text-ink/85">{track.soundProfile}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Build + verify**

```bash
npm run build
ls dist/music/index.html
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/music/index.astro src/data/site.ts
git commit -m "feat(music): /music discography index + siteRoutes entry"
```

---

### Task 4: `public/ai/discography.txt` + extend `/llms-full.txt`

**Files:** `public/ai/discography.txt` (new), `src/pages/llms-full.txt.ts` (modify)

- [ ] **Step 1: Create the plain-text catalog**

```
Last updated: 2026-05-21

# The Filibusters — Discography

## Singles

### Break Up With Your Boyfriend
- Released: 2026-03-26
- Duration: ~3:30
- Listen: Spotify, Apple Music, YouTube
- For fans of: Paramore, The 1975, Arctic Monkeys
- Sound: A driving alt rock track built around urgent vocals, a hooky chorus, and instrumentation that leans loud and direct.
- About: Written in the spiral of late-night overthinking and the conversations you keep rehearsing but never have. The song doesn't ask the listener to be okay; it asks them to turn the volume up and stay in the discomfort until something underneath clears.
- Page: https://www.thefilibustersband.com/music/break-up-with-your-boyfriend

For new releases as they ship, check https://www.thefilibustersband.com/music or the AI press kit at https://www.thefilibustersband.com/press/ai.
```

- [ ] **Step 2: Wire discography into `llms-full.txt.ts`**

In `src/pages/llms-full.txt.ts`, add to the imports:

```typescript
import { discography } from "../data/discography";
```

In the `body` array, after the existing "## Promoter brief" section and before "## About FAQ (long)", insert a new section:

```typescript
    "---",
    "## Discography",
    "",
    readAiFile("discography.txt"),
    "",
```

(`readAiFile` will pick up the new file automatically — no other endpoint changes needed.)

- [ ] **Step 3: Build + verify**

```bash
npm run build
head -1 dist/ai/discography.txt
grep -c "## Discography" dist/llms-full.txt 2>/dev/null || grep -c "## Discography" .vercel/output/static/llms-full.txt
```

Expected: stamp present, llms-full has the new section.

- [ ] **Step 4: Commit**

```bash
git add public/ai/discography.txt src/pages/llms-full.txt.ts
git commit -m "feat(geo): ai/discography.txt + extend /llms-full.txt with music corpus"
```

---

### Task 5: `/for-fans-of` page + data

**Files:** `src/data/forFansOf.ts` (new), `src/pages/for-fans-of.astro` (new), `src/data/site.ts` (modify)

- [ ] **Step 1: Create the data file**

`src/data/forFansOf.ts`:

```typescript
export type ForFansOfEntry = {
  artist: string;
  contrastParagraph: string;
  recommendedTracks: readonly string[];
};

export const forFansOfEntries: readonly ForFansOfEntry[] = [
  {
    artist: "Paramore",
    contrastParagraph:
      "If Paramore's early discography is the entry point, The Filibusters will feel familiar before the first chorus lands. Both bands write to hook hard and play live like the room matters more than the recording. Where Paramore eventually scaled into arena-sized production, The Filibusters are still building the set for ~150-500 capacity rooms like Velour Live Music Gallery in Provo — closer to the listener, less polish, more direct. Listeners who connect with Riot!-era Paramore or the rawer cuts off This Is Why will recognize the energy here, with lyric writing that leans more openly emotional and less narrative.",
    recommendedTracks: ["Break Up With Your Boyfriend"]
  },
  {
    artist: "Arctic Monkeys",
    contrastParagraph:
      "Arctic Monkeys fans land here for the rhythmic guitar work and the lyric attention. The contrast: Arctic Monkeys' writing reads like character sketches — specific, distanced, often funny. The Filibusters write in first person about the feeling itself, with less ironic remove. The instrumentation pulls from a similar palette — taut drums, melodic bass, guitars carrying the hook — but the songs sit closer to alt rock than to the dance-punk side of AM. If 'Do I Wanna Know' or the AM-era ballads are the connector, the live show is where The Filibusters will feel most familiar.",
    recommendedTracks: ["Break Up With Your Boyfriend"]
  },
  {
    artist: "The 1975",
    contrastParagraph:
      "Listeners who like The 1975's earlier, guitar-forward material more than the later genre-hopping experiments will connect with The Filibusters quickly. The shared territory: emotionally direct writing, hooks built to stay, production that lets the song breathe. The contrast: The Filibusters are guitar-driven across the catalog without the synth/pop pivots, and the live show leans grittier — designed for sweatier rooms than The 1975 plays today. The lyric register is similar — vulnerable, specific, present-tense — but more focused on the moment than the cultural commentary that runs through The 1975's later records.",
    recommendedTracks: ["Break Up With Your Boyfriend"]
  }
] as const;
```

- [ ] **Step 2: Add `forFansOf` to `siteRoutes`**

In `src/data/site.ts`:

```typescript
  forFansOf: { label: "For fans of", path: "/for-fans-of" },
```

- [ ] **Step 3: Create the page**

`src/pages/for-fans-of.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Footer from "../components/site/Footer.astro";
import Header from "../components/site/Header.astro";
import { forFansOfEntries } from "../data/forFansOf";
import { siteMeta } from "../data/site";
import { buildBreadcrumbList } from "../lib/seo/breadcrumb";

const breadcrumbStructuredData = buildBreadcrumbList(Astro.site!.toString(), [
  { name: "Home", path: "/" },
  { name: "For fans of", path: "/for-fans-of" }
]);
---

<BaseLayout
  title={`For fans of Paramore, Arctic Monkeys, and The 1975 | ${siteMeta.title}`}
  description="The Filibusters compared honestly to Paramore, Arctic Monkeys, and The 1975 — what's similar, what's different, and which tracks to start with."
  structuredData={[breadcrumbStructuredData]}
>
  <Header />
  <main id="main-content" tabindex="-1" class="mobile-nav-offset overflow-x-clip bg-white">
    <section class="border-b border-black/10 bg-paper-soft">
      <div class="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <p class="text-[0.82rem] font-bold uppercase tracking-[0.2em] text-pink md:text-sm">If you like</p>
        <h1 class="display-face mt-3 max-w-4xl text-[2.35rem] uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
          For fans of Paramore, Arctic Monkeys, and The 1975.
        </h1>
        <aside class="citable-passage mt-6" aria-label="How The Filibusters compare">
          <span class="citable-passage-label">How we compare</span>
          {siteMeta.canonicalParagraph}
        </aside>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
        <div class="space-y-10">
          {forFansOfEntries.map((entry) => (
            <article>
              <h2 class="display-face text-3xl uppercase leading-[0.95] tracking-[-0.03em] text-ink md:text-4xl">
                Like {entry.artist}?
              </h2>
              <p class="mt-4 text-base leading-7 text-ink/85 md:text-lg">{entry.contrastParagraph}</p>
              <p class="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                Start with:
                {entry.recommendedTracks.map((track, idx) => (
                  <>
                    {idx > 0 ? ", " : " "}
                    <a class="underline" href={`/music/${track.toLowerCase().replace(/\s+/g, "-")}`}>{track}</a>
                  </>
                ))}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 4: Build + verify**

```bash
npm run build
ls dist/for-fans-of/index.html
grep -c "Like Paramore\|Like Arctic Monkeys\|Like The 1975" dist/for-fans-of/index.html
```

Expected: 3 H2 sections render.

- [ ] **Step 5: Commit**

```bash
git add src/data/forFansOf.ts src/pages/for-fans-of.astro src/data/site.ts
git commit -m "feat(seo): /for-fans-of comparison page (Paramore, Arctic Monkeys, The 1975)"
```

---

### Task 6: Claim BYU Battle of the Bands winner + `award` schema field

**Files:** `src/data/shows.ts`, `src/lib/shows/types.ts`, `src/pages/shows/[slug].astro`

- [ ] **Step 1: Add `award?: string` to `ShowEntry` type**

In `src/lib/shows/types.ts`, add:

```typescript
  award?: string;
```

To the `ShowEntry` type, before the closing `};`.

- [ ] **Step 2: Update the BYU show entry in `src/data/shows.ts`**

Find the entry with `slug: "byu-battle-of-the-bands-2026"`. Change:

- `title: "BYU Battle of the Bands 2026"` → `title: "BYU Battle of the Bands 2026 — Winner"`
- `summary` → `"The Filibusters won BYU Battle of the Bands 2026 — a full room, a confident set, and a result that confirmed the live show works."`
- `body` (replace both paragraphs with):
  ```typescript
  body: [
    "The Filibusters won BYU Battle of the Bands 2026 on March 28 at the BYU Marriott Center in Provo, Utah. The set was loud, direct, and built for the room — and the room responded.",
    "Winning mattered, but the more important takeaway was confirmation: these songs hit live. The crowd never dropped, the band held the energy through every cut, and the result of the night reflected what the live show is actually capable of.",
    "Full recap and post-show notes live on the community update at https://www.thefilibustersband.com/community/byu-battle-of-the-bands-2026-win."
  ],
  ```
- Add a new field: `award: "Winner — BYU Battle of the Bands 2026"`
- `seoDescription` → `"The Filibusters won BYU Battle of the Bands 2026 at the BYU Marriott Center in Provo, Utah on March 28, 2026."`

Keep `slug`, `startsAt`, `endsAt`, `status`, `venue`, `city`, `state`, `country`, `ticketUrl`, `flyerUrl`, `organizerName`, `organizerUrl`, `offers`, `lineup`, `notes` unchanged.

- [ ] **Step 3: Wire `award` into Event JSON-LD**

In `src/pages/shows/[slug].astro`, find the `eventStructuredData` object. Add a conditional `award` field. The simplest approach: add it to the const if `show.award` exists, e.g.:

```typescript
const eventStructuredData = {
  // ...existing fields...
  ...(show.award ? { award: show.award } : {})
};
```

Or, if the const is built declaratively, append after construction:

```typescript
const eventStructuredData = {
  /* existing fields */
};
if (show.award) {
  (eventStructuredData as Record<string, unknown>).award = show.award;
}
```

The first form is preferred. Verify the construction style and pick accordingly.

- [ ] **Step 4: Optional UI surface — render "Winner" badge if present**

In the rendered show detail markup (the section that shows venue/location/status), add a small section:

```astro
{show.award ? (
  <p class="mt-6 inline-flex items-center gap-2 rounded-full bg-pink px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
    🏆 {show.award}
  </p>
) : null}
```

(Pick the placement that fits the existing show page rhythm — likely near the H1 or in the status card area.)

- [ ] **Step 5: Build + verify**

```bash
npm run build
grep -o '"award":"[^"]*"' dist/shows/byu-battle-of-the-bands-2026/index.html
grep -o "Winner — BYU Battle of the Bands 2026" dist/shows/byu-battle-of-the-bands-2026/index.html | head
```

Both should hit.

- [ ] **Step 6: Commit**

```bash
git add src/lib/shows/types.ts src/data/shows.ts src/pages/shows/[slug].astro
git commit -m "feat(seo): claim BYU Battle of the Bands winner + add award schema field"
```

---

### Task 7: `/shows/provo-2026-06` June aggregator + ItemList schema

**Files:** `src/pages/shows/provo-2026-06.astro` (new)

- [ ] **Step 1: Create the page**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Footer from "../../components/site/Footer.astro";
import Header from "../../components/site/Header.astro";
import { upcomingShows } from "../../data/shows";
import { siteMeta } from "../../data/site";
import { buildBreadcrumbList } from "../../lib/seo/breadcrumb";

const juneShows = upcomingShows
  .filter((show) => show.startsAt.startsWith("2026-06") && show.city === "Provo")
  .sort((left, right) => left.startsAt.localeCompare(right.startsAt));

// Note: Utah Arts Festival is Salt Lake City, NOT Provo. We include it because the band is on the bill
// and Provo-based audiences will look for it. But the page heading and ItemList focus on Provo dates.
const provoJuneShows = upcomingShows
  .filter((show) => show.startsAt.startsWith("2026-06"))
  .sort((left, right) => left.startsAt.localeCompare(right.startsAt));

const canonicalUrl = new URL("/shows/provo-2026-06", Astro.site).href;

const itemListStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "The Filibusters — June 2026 Live Dates",
  description: "Live shows by The Filibusters in June 2026, primarily in Provo, Utah.",
  url: canonicalUrl,
  numberOfItems: provoJuneShows.length,
  itemListElement: provoJuneShows.map((show, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: new URL(`/shows/${show.slug}`, Astro.site).href,
    name: show.title
  }))
};

const breadcrumbStructuredData = buildBreadcrumbList(Astro.site!.toString(), [
  { name: "Home", path: "/" },
  { name: "Shows", path: "/shows" },
  { name: "Provo June 2026", path: "/shows/provo-2026-06" }
]);

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
});
---

<BaseLayout
  title={`Live music in Provo — June 2026 | ${siteMeta.title}`}
  description="Where to see The Filibusters live in June 2026: Velour Live Music Gallery, a free outdoor show, and Utah Arts Festival."
  structuredData={[itemListStructuredData, breadcrumbStructuredData]}
>
  <Header />
  <main id="main-content" tabindex="-1" class="mobile-nav-offset overflow-x-clip bg-paper-soft">
    <section class="border-b border-black/10 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <p class="text-[0.82rem] font-bold uppercase tracking-[0.2em] text-pink md:text-sm">June 2026</p>
        <h1 class="display-face mt-3 max-w-4xl text-[2.35rem] uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
          Live music in Provo, June 2026.
        </h1>
        <aside class="citable-passage mt-6" aria-label="June 2026 summary">
          <span class="citable-passage-label">June 2026 summary</span>
          The Filibusters play three shows in June 2026: a free outdoor new-music preview in Provo on Saturday, June 13 (date and venue being finalized); Velour Live Music Gallery in Provo on Friday, June 19 with Always Her on the bill; and the Utah Arts Festival on the Festival Stage in Salt Lake City on Saturday, June 20 ahead of headliner Shakey Graves. Tickets, set times, and venue confirmations for each date are linked below.
        </aside>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
        <div class="space-y-10">
          {provoJuneShows.map((show) => (
            <article class="poster-frame rounded-[1.75rem] bg-white p-5 md:p-7">
              <h2 class="display-face text-2xl uppercase leading-[0.95] tracking-[-0.03em] text-ink md:text-3xl">
                {dateFormatter.format(new Date(show.startsAt))} — {show.title}
              </h2>
              <p class="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                {show.venue} · {show.city}, {show.state}
              </p>
              {show.summary ? (
                <p class="mt-4 text-base leading-7 text-ink/85">{show.summary}</p>
              ) : null}
              <div class="mt-5 flex flex-wrap gap-3">
                <a
                  class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-pink"
                  href={`/shows/${show.slug}`}
                >
                  Show details
                </a>
                {show.ticketUrl ? (
                  <a
                    class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-black/12 bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-ink transition hover:border-pink hover:text-pink"
                    href={show.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Tickets
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Build + verify**

```bash
npm run build
ls dist/shows/provo-2026-06/index.html
grep -c '"@type":"ItemList"' dist/shows/provo-2026-06/index.html
grep -c '"@type":"ListItem"' dist/shows/provo-2026-06/index.html
```

Expected: ItemList present, 3 ListItems.

- [ ] **Step 3: Commit**

```bash
git add src/pages/shows/provo-2026-06.astro
git commit -m "feat(seo): /shows/provo-2026-06 June aggregator with ItemList schema"
```

---

### Task 8: Verification + PR

- [ ] **Step 1: All gates**

```bash
npx astro check 2>&1 | tail -3
npm test
npm run build
npm run verify:seo
```

Expected:
- `astro check` — pre-existing 4 errors on main; 0 NEW.
- `npm test` — 28/28.
- `npm run build` — 24 pages (was 21: +1 /music index, +1 /music/[slug], +1 /for-fans-of, +1 /shows/provo-2026-06).
- `verify:seo` — exits 0.

- [ ] **Step 2: Schema render checks**

```bash
grep -o '"@type":"MusicRecording"' dist/music/break-up-with-your-boyfriend/index.html
grep -o '"@type":"ItemList"' dist/shows/provo-2026-06/index.html
grep -o '"award":"[^"]*"' dist/shows/byu-battle-of-the-bands-2026/index.html
ls dist/music/index.html dist/for-fans-of/index.html dist/shows/provo-2026-06/index.html
head -3 dist/ai/discography.txt
grep -c "## Discography" dist/llms-full.txt 2>/dev/null || grep -c "## Discography" .vercel/output/static/llms-full.txt
```

All checks should pass.

- [ ] **Step 3: Open PR** via `superpowers:finishing-a-development-branch`.

Title: `feat(seo+geo): /music + /for-fans-of + BYU winner + /shows/provo-2026-06`.

PR body should note:
- Closes the structural GEO gap (no on-domain song corpus) with `/music/[slug]` + MusicRecording schema.
- Promotes the `llms.txt` "How we are different" passage into HTML at `/for-fans-of` — same content, now Google-indexable.
- BYU win claim + `award` Event schema field — defensible passage AI engines will repeat.
- `/shows/provo-2026-06` ItemList aggregator catches "Provo live music June 2026" search traffic individual show pages can't.
- New AI asset: `public/ai/discography.txt` + the `/llms-full.txt` endpoint now includes it.
- Band-side follow-ups: clone the discography entry for each new release; lyrics excerpts pending licensing decision.
