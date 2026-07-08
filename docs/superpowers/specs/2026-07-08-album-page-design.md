# Album Release Page — Design Spec

**Date:** 2026-07-08
**Status:** Design approved (planning ahead of release — album details not yet final)
**Branch context:** builds on the music/discography structure in `src/data/discography.ts` + `src/pages/music/`

## Context

The Filibusters are releasing a new album. The site today only models **individual
tracks/singles** (`discography: Track[]`, one entry so far, each with a rich
`/music/[slug]` page). There is no album concept. This spec defines an **album
release page** so that when the album drops, shipping it is mostly a data fill plus
one cover-art asset — no re-architecting.

Scope decision (confirmed with Phil): **tracklist-only**. The album page lists the
tracks with durations and whole-album streaming links; it does **not** generate a new
per-track page for every song. Tracks that already have a `/music/[slug]` page (e.g.
*Break Up With Your Boyfriend*) link out to it; the rest are listed only.

## Goals

- One album page per album at `/albums/{slug}`, driven entirely by data.
- Rich, correct SEO: `MusicAlbum` + `WebPage` + `BreadcrumbList` structured data,
  clean title/description/OG, internal-linking cluster, sitemap `lastmod`.
- Reuse existing patterns (`BaseLayout` `@graph`, `buildBreadcrumbList`,
  `eventSchema.ts`-style schema builder, band aesthetic) — no new conventions.
- Build-ready shell: when album metadata is final, fill data + drop in cover art.

## Non-Goals

- No new per-track detail pages (tracklist-only).
- No audio hosting/streaming — links out to Spotify/Apple/YouTube.
- No CMS/Sanity modeling for albums in this pass (fallback-data first, matching how
  `shows` began). Can be added later mirroring `getUpcomingShows`.

## Route

`src/pages/albums/[slug].astro` — dynamic, `getStaticPaths()` from the albums data.
Top-level `/albums/` (not nested under `/music/`) so it never collides with the
single-segment `/music/[slug]` track route, and future albums are just new entries.

## Data Model — `src/data/albums.ts`

Mirrors the shape/typing discipline of `discography.ts`.

```ts
import type { ImageMetadata } from "astro";

export type AlbumTrack = {
  title: string;
  durationISO8601: string;   // e.g. "PT3M30S"
  trackSlug?: string;        // optional link to an existing /music/[slug] page
};

export type AlbumReleaseType = "single" | "ep" | "album";

export type Album = {
  slug: string;
  title: string;
  releaseDate: string;       // ISO YYYY-MM-DD
  releaseType: AlbumReleaseType;
  artwork: ImageMetadata;    // square cover
  artworkAlt: string;
  genre: string;             // e.g. "Alternative rock"
  oneLiner: string;          // 150-160 char hook -> meta description
  about: string;             // 80-150 word citable passage (themes/recording context)
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  bandcampUrl?: string;
  tracklist: readonly AlbumTrack[];
  credits?: readonly string[];
};

export const albums: readonly Album[] = [ /* ...one entry when finalized... */ ] as const;

export const albumBySlug = (slug: string): Album | undefined =>
  albums.find((a) => a.slug === slug);
```

Cover art imported from `src/assets/images/` like other imagery (so Astro's image
pipeline resolves it; `artwork.src` gives the built URL for OG/JSON-LD).

## Schema Builder — `src/lib/music/albumSchema.ts`

New pure builder mirroring `src/lib/shows/eventSchema.ts` (keeps JSON-LD out of the
`.astro` frontmatter and makes it unit-testable).

`buildAlbumStructuredData({ album, url, image })` returns a `MusicAlbum` node:

- `"@type": "MusicAlbum"`, `name`, `url`
- `byArtist: { "@id": siteEntityIds.musicGroup }` — references the `#music-group`
  entity `BaseLayout` already emits on every page (no duplicate MusicGroup).
- `datePublished: album.releaseDate`
- `image: [encodeURI(absoluteCoverUrl)]`
- `genre`, `numTracks: tracklist.length`
- `albumReleaseType` → schema.org enum (`AlbumRelease` / `SingleRelease` / `EPRelease`)
- `albumProductionType: "https://schema.org/StudioAlbum"` (default; overridable later)
- `track`: array of `MusicRecording` — `{ "@type": "MusicRecording", name, duration,
  byArtist: { "@id": siteEntityIds.musicGroup }, url? }` where `url` is the absolute
  `/music/{trackSlug}` link when present.

## Page Structure — `/albums/[slug].astro`

Uses the existing band aesthetic (`display-face` headings, pink eyebrow labels,
`poster-frame`, `focus-ring` CTAs — same tokens as `press/epk.astro`).

Frontmatter assembles:
- `webPageStructuredData` (WebPage node: `@id` via `buildPageId('/albums/'+slug)`,
  name, url, description = `oneLiner`, `isPartOf` website, `about` musicGroup) —
  same pattern as `epk.astro`.
- `buildAlbumStructuredData(...)`
- `buildBreadcrumbList(Astro.site, [Home, Music, {Album}])`
- passes all three to `BaseLayout`'s `structuredData` prop (appended to the graph).

Sections (single `<h1>` = album title; `<h2>` per section):
1. **Hero** — cover art (`<Image>` eager/high priority), album title, release date,
   release-type label, streaming CTA buttons (Spotify / Apple / YouTube / Bandcamp).
2. **Liner notes** — the `about` passage.
3. **Tracklist** — numbered `<ol>`; each row: `#`, title (linked to `/music/{trackSlug}`
   if present), duration. `credits` block if provided.
4. **Bottom CTA** — "Listen" + cross-links to `/music` and `/press/epk`.

## SEO Structure

- **Canonical / robots:** auto by `BaseLayout` (`<link rel="canonical">`,
  `robots: index,follow, max-image-preview:large`). Nothing extra needed.
- **Title:** `"{Album} — Album by The Filibusters"` (<60 chars).
- **Meta description:** `album.oneLiner` (150-160 chars, genre + Provo + release date).
  Flows to `og:description` / `twitter:description` automatically.
- **Structured data:** `MusicAlbum` + `WebPage` + `BreadcrumbList`, emitted inside the
  single top-level `@graph` (nodes omit their own `@context`, matching `epk.astro`).
- **Open Graph:** pass square cover via `ogImage` + `ogImageWidth/Height` (square, e.g.
  1200×1200). **Extend `BaseLayout` `ogType` union** to add `"music.album"` and pass it.
- **Internal linking cluster:** `/music` index feature slot → album; album tracklist →
  existing `/music/[slug]` pages; EPK "Hear them" + homepage feature → album; album →
  back to `/music` and `/press/epk`. Reinforces the whole music cluster.
- **Sitemap `lastmod`:** add an album mirror entry to `src/data/lastmod-map.mjs`
  (`albumLastmod`, keyed by `releaseDate`), wire it in `astro.config.mjs`'s `serialize()`
  the same way `showLastmodBySlug`/`communityLastmodBySlug` are; extend
  `tests/lastmod-map.test.mjs` to guard drift for `src/data/albums.ts`.
- **Core Web Vitals:** hero cover `<Image>` with responsive `widths`/`sizes`,
  `loading="eager"` + `fetchpriority="high"` (LCP); fixed `aspect-square` (no CLS);
  below-fold imagery lazy. Static output keeps TTFB/JS minimal.

## Integration Points

- `src/pages/music/index.astro` — add an album feature slot (hero) linking to the album.
- `src/data/site.ts` — optional: add `albums` to `siteRoutes` for a stable link constant.
- `src/pages/index.astro` (homepage) + `src/pages/press/epk.astro` "Hear them" — point at
  the album once released (currently point at `discography[0]`).

## Testing

- **e2e** (`tests/e2e/structured-data.spec.ts`): new case — `/albums/{slug}` loads and
  the graph contains `MusicAlbum` and `BreadcrumbList` (mirrors the existing EPK case).
- **Unit** (optional, `node --test`): `albumSchema.ts` emits expected node shape /
  `numTracks` / track urls.
- **Drift guard** (`tests/lastmod-map.test.mjs`): album entries in `albums.ts` have a
  matching `albumLastmod` entry.
- **a11y/seo specs** already crawl routes; confirm the new route passes.

## Build Sequence

1. `src/data/albums.ts` — types + `albumBySlug` + placeholder entry; add cover asset.
2. `src/lib/music/albumSchema.ts` — `buildAlbumStructuredData`.
3. `src/pages/albums/[slug].astro` — route + sections + assembled structured data.
4. `BaseLayout` — add `"music.album"` to `ogType`.
5. Integration — music-index feature slot; `lastmod-map.mjs` + `astro.config.mjs` wiring;
   optional homepage/EPK links.
6. Tests — e2e structured-data case; drift-guard extension.
7. Verify — `npm run check` · `npm run build` · `npm test` · `npm run test:e2e`;
   validate JSON-LD in Google Rich Results.

## Data-Fill Checklist (when album is final)

- [ ] Album title + slug + `releaseType`
- [ ] `releaseDate` (ISO)
- [ ] Cover art file → `src/assets/images/`, + `artworkAlt`
- [ ] `genre`, `oneLiner` (150-160 chars), `about` (80-150 words)
- [ ] Streaming URLs (Spotify / Apple / YouTube / Bandcamp)
- [ ] `tracklist`: each `title` + `durationISO8601` (+ `trackSlug` where a page exists)
- [ ] `credits` (optional)
- [ ] Flip homepage/EPK/music-index features to the album

## Open Questions (resolve at build/release time)

- Album name, tracklist, release date, artwork, streaming links (pending).
- Whether any album tracks should graduate to full `/music/[slug]` pages later
  (out of scope now; additive when desired).
