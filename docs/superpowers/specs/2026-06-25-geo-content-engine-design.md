# GEO Content Engine — per-artist comparison pages + song lyrics/video

Date: 2026-06-25
Status: Approved (design) — pending implementation plan
Milestone: Roadmap Milestone 1 (`docs/roadmap.md`)

## Goal

Convert the discovery traffic the SEO/identity work already earns into deeper,
more crawlable on-site content that (a) wins the "bands like X" comparison
cluster (Share-of-Model tracker shows it at 0/5 CITED) and (b) gives AI search
a band-owned lyrics + video surface instead of donating it to third parties.

Pure static Astro, following existing repo patterns. No CMS, backend, or
payments. This is the cheapest high-confidence next build and it compounds
everything already shipped.

## Current state (what exists today)

- `/for-fans-of` is a single page (`src/pages/for-fans-of.astro`) rendering all
  8 comparison artists inline from `forFansOfEntries`
  (`src/data/forFansOf.ts`): each entry has `artist`, `contrastParagraph`,
  `recommendedTracks`. Track links already resolve against the discography
  source of truth (no broken `/music` links).
- `/music/[slug]` (`src/pages/music/[slug].astro`) is already a rich song page
  (title, "About this song" citable, sound profile, for-fans-of line, platform
  links, artwork) with `MusicRecording` + `BreadcrumbList` JSON-LD — but the
  lyrics block (lines ~102–107) is a placeholder ("Lyrics excerpt coming soon").
- `discography.ts` has one released track ("Break Up With Your Boyfriend"); the
  `Track` type has no lyrics or music-video fields.

## Scope

**In scope**
1. Split `/for-fans-of` into a hub + one rich page per artist
   (`/for-fans-of/[slug]`), with a per-artist FAQ.
2. Replace the song-page lyrics placeholder with full rendered lyrics and add a
   music-video embed.
3. Structured data: FAQPage (per-artist pages), MusicComposition/lyrics +
   VideoObject (song page).

**Out of scope (non-goals)**
- No CMS migration, backend, or payments.
- Lyrics/video populated for the single released track only (data model scales
  to future releases).
- The other roadmap milestones (EPK, email backend, merch store).
- Changing the existing visual design language — follow current patterns
  (`community/[slug].astro`, `band/[slug].astro`).

## Architecture & routing

### `/for-fans-of` (hub — rewrite in place, no redirect needed)
- Keep the existing hero intro + the `canonicalParagraph` citable block.
- Replace the 8 inline `<article>` comparison sections with a responsive grid of
  **8 teaser cards**: artist name + one-line `hook` + "Read more →" linking to
  `/for-fans-of/{slug}`.
- Keeps `BreadcrumbList` (Home > For fans of).

### `/for-fans-of/[slug]` (new dynamic route)
- `getStaticPaths()` over `forFansOfEntries` (params: `slug`).
- Sections:
  - H1: "For fans of {artist}"
  - Expanded comparison body (`body`: 2–3 paragraphs)
  - "Start with" — Filibusters `recommendedTracks`, linking to `/music/{trackSlug}`
    via the existing discography lookup (plain text if a track isn't released).
  - **FAQ** — render `faq[]` as accessible Q&A.
  - Cross-links: back to the hub, to `/music`, and to `/shows`.
- Breadcrumb: Home > For fans of > {artist}.
- Follow the `community/[slug].astro` / `band/[slug].astro` layout idiom
  (Header, BaseLayout props, Footer, Tailwind classes).

### `/music/[slug]` (enrich existing page)
- Replace the placeholder lyrics block with full lyrics rendered from
  `track.lyrics` (stanza breaks preserved); keep a tasteful fallback when
  `lyrics` is absent.
- Add a music-video embed when `track.video` is present. **Decision:** use a
  **click-to-load facade** (static YouTube thumbnail → on click, swap in a
  `https://www.youtube-nocookie.com/embed/{id}` iframe), mirroring the Instagram
  gallery pattern — keeps the page light and privacy-friendly, no YouTube JS.
  Requires a CSP change (see below).
- Update the existing "For fans of {a}, {b}, {c}" line to deep-link each named
  artist to `/for-fans-of/{slug}` instead of the hub.

## Content model (data files)

### `src/data/forFansOf.ts`
Extend `ForFansOfEntry`:
```
type ForFansOfFaq = { question: string; answer: string };
type ForFansOfEntry = {
  slug: string;                       // kebab, e.g. "the-backseat-lovers"
  artist: string;
  hook: string;                       // one line for the hub teaser card
  body: readonly string[];            // 2-3 comparison paragraphs (replaces contrastParagraph)
  recommendedTracks: readonly string[];
  faq: readonly ForFansOfFaq[];       // 2-3 Q&A
};
export const entryBySlug = (slug: string) => forFansOfEntries.find(e => e.slug === slug);
```
Migrate the 8 existing entries: keep current `contrastParagraph` as the first
`body` paragraph, add 1–2 more paragraphs + a `hook` + 2–3 FAQ each (copy
generated, band-approvable). Slugs:
`paramore`, `arctic-monkeys`, `the-1975`, `the-backseat-lovers`, `wolf-alice`,
`beach-bunny`, `wallows`, `pvris`.

### `src/data/discography.ts`
Extend `Track`:
```
type TrackVideo = {
  youTubeId: string;     // 11-char video id (not the channel)
  name: string;          // video title
  uploadDate: string;    // ISO YYYY-MM-DD
  description?: string;
};
type Track = {
  ...existing...
  lyrics?: readonly string[];   // lines; "" denotes a stanza break
  video?: TrackVideo;
};
```

## Structured data

### Per-artist page (`/for-fans-of/[slug]`)
- `WebPage` (+ `isPartOf` website, `about` the MusicGroup `@id`).
- `BreadcrumbList`.
- `FAQPage` with `mainEntity: Question[] → acceptedAnswer: Answer` built from
  `faq[]`. (Primary AI-answer lever for "is X like Y".)

### Song page (`/music/[slug]`)
- Keep existing `MusicRecording` (`@id` `…#recording`, `byArtist` MusicGroup).
- Add `recordingOf` → `MusicComposition` `{ name, lyrics: { "@type":
  "CreativeWork", text } }` where `text` = `track.lyrics` joined with newlines.
- Add `VideoObject` `{ name, description, thumbnailUrl (YouTube thumbnail from
  youTubeId), uploadDate, embedUrl, contentUrl }` when `track.video` is present.
- Keep `BreadcrumbList`.

## SEO details

- **No duplicate content:** full per-artist copy lives once on each sub-page;
  the hub only teases. Each page has its own canonical (BaseLayout default).
- **Internal linking:** hub ↔ sub-pages ↔ `/music` ↔ `/shows`; song-page
  for-fans-of line deep-links sub-pages.
- **Sitemap:** Astro's integration auto-includes the new `/for-fans-of/[slug]`
  pages. No `lastmod-map.mjs` change (that mirror is shows/community only).
- **`/for-fans-of` URL is preserved** (becomes the hub) — existing inbound links
  and the `siteRoutes.forFansOf` reference stay valid.
- **CSP:** the song-page video facade requires adding
  `https://www.youtube-nocookie.com` to `frame-src` in `vercel.json` (YouTube
  thumbnails load under the existing `img-src https:`). No script-src change —
  the facade uses a plain iframe, no YouTube JS.

## Testing & verification

- Add to `tests/e2e/seo.spec.ts` staticRoutes: `/for-fans-of` and
  `/for-fans-of/paramore` (a representative sub-page); the song page
  `/music/break-up-with-your-boyfriend`.
- Add the same to `tests/e2e/a11y.spec.ts` routes.
- Extend `tests/e2e/structured-data.spec.ts`: assert a `FAQPage` node on a
  sub-page and a `MusicComposition`/`lyrics` node on the song page.
- Run `npm run check`, `npm test`, `npm run build`, and an agent-browser smoke
  (hub shows 8 cards; sub-page renders body + FAQ + FAQ schema; song page
  renders lyrics + video + schema).

## Build-time inputs needed from the band

- **Lyrics text** for "Break Up With Your Boyfriend" (full).
- **YouTube video** for the track: the 11-char video id, title, upload date.

These populate `track.lyrics` and `track.video`; until provided, the song page
keeps its graceful "lyrics coming soon" fallback and omits the VideoObject.

## File-by-file change list

- `src/data/forFansOf.ts` — extend type, migrate 8 entries (+hook/body/faq), add `entryBySlug`.
- `src/pages/for-fans-of.astro` — rewrite to hub (teaser cards).
- `src/pages/for-fans-of/[slug].astro` — NEW per-artist page + FAQPage schema.
- `src/data/discography.ts` — extend `Track` (lyrics, video).
- `src/pages/music/[slug].astro` — render lyrics + video; MusicComposition + VideoObject schema; deep-link for-fans-of.
- `vercel.json` — add `https://www.youtube-nocookie.com` to CSP `frame-src` (song-page video facade).
- `tests/e2e/seo.spec.ts`, `tests/e2e/a11y.spec.ts`, `tests/e2e/structured-data.spec.ts` — cover new routes + assertions.
