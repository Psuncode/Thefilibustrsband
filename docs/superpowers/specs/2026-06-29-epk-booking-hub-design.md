# EPK / Booking Hub (`/press/epk`) — design

Date: 2026-06-29
Status: Approved (design) — pending implementation plan
Milestone: Roadmap Milestone 2 (`docs/roadmap.md`)

## Goal

Give the band one shareable link a venue booker or promoter can act on in a
single screen — answering "who are they, do they draw, what do they sound like,
how do I book them?" — to attack the documented live bottleneck (filling shows).
`/press` stays the media room for journalists; `/press/epk` is the new
booker-facing hub.

Pure static Astro. No backend, CMS, or payments. "Book us" is a prefilled
`mailto:` (consistent with the rest of the site). Sections degrade gracefully:
each renders only when its data exists, so the page ships useful today and the
band fills the remaining slots over time.

## Current state

- `/press` (`src/pages/press.astro`, data `src/data/press.ts`) is media-focused:
  short/long bio, approved assets, quotes, a prefilled press `mailto`, WebPage
  schema. It is NOT changed by this work except adding a cross-link to the EPK.
- Show data is available via `getPastShows()` / `getUpcomingShows()` from
  `src/lib/shows/data` (Sanity-aware with repo-data fallback; returns
  `ShowEntry[]`). The Event JSON-LD shape lives in `src/pages/shows/[slug].astro`.
- Lineup: `src/data/bandMembers.ts` (`bandMembers`, each with slug/name/role/image).
- Music + video: `src/data/discography.ts` (`discography`; the released single has
  `video` set).
- Quotes: `src/data/press.ts` `pressPage.quotes`.

## Scope

**In scope**
1. New page `src/pages/press/epk.astro` composing existing data + a new
   `src/data/epk.ts`.
2. New `src/data/epk.ts` for booker-specific content (hero one-liner, pitch,
   photo pack, optional tech rider, optional draw stats, booking CTA config).
3. Sections with graceful degradation (table below).
4. WebPage + BreadcrumbList JSON-LD; reuse the existing complete-fields Event
   JSON-LD shape for listed past shows.
5. Cross-link `/press` ↔ `/press/epk`.
6. e2e coverage (SEO, a11y, structured-data).

**Out of scope (non-goals)**
- No PDF export (future follow-up).
- No backend / booking form — "Book us" is a prefilled `mailto`.
- No changes to `/press` beyond a cross-link.
- No new merch/email work; not touching other milestones.
- Tech rider / draw stats CONTENT is band-supplied later; the page renders their
  slots only when present.

## Architecture & routing

- New file `src/pages/press/epk.astro` (sits alongside `src/pages/press/ai.astro`).
- Composes existing data — no duplication: `getPastShows()` from
  `src/lib/shows/data`, `bandMembers` from `bandMembers.ts`, `pressPage.quotes`
  from `press.ts`, the released track (with `video`) from `discography.ts`, plus
  the new `epk` object.
- Follows the established page idiom: `BaseLayout` + `Header`/`Footer`, Tailwind
  classes consistent with `press.astro`, `structuredData` prop for JSON-LD,
  `buildBreadcrumbList` from `src/lib/seo/breadcrumb`.
- Add `epk: { path: "/press/epk" }` to `siteRoutes` in `src/data/site.ts`.

## Data model — `src/data/epk.ts`

```ts
import type { ImageMetadata } from "astro";

export type EpkPhoto = {
  label: string;
  image: ImageMetadata;   // imported via astro:assets
  credit?: string;
  /** download URL — typically image.src */
  downloadHref: string;
};

export type EpkStat = { label: string; value: string };

export type EpkTechRider = {
  inputList?: readonly string[];
  backline?: readonly string[];
  stagePlotImage?: ImageMetadata;
  notes?: readonly string[];
};

export type Epk = {
  heroOneLiner: string;
  pitch: readonly string[];           // 1-2 booker-facing paragraphs
  photoPack: readonly EpkPhoto[];     // hi-res photos (band has these now)
  drawStats?: readonly EpkStat[];     // optional; hidden when absent
  techRider?: EpkTechRider;           // optional; hidden when absent
  booking: {
    email: string;
    mailtoSubject: string;
    mailtoBodyLines: readonly string[];
  };
};

export const epk = { /* populated values */ } as const satisfies Epk;
```

Notes:
- `booking.email` = `siteMeta.contactEmail`.
- Show history, lineup, quotes, music/video are NOT re-entered here — pulled from
  their existing source files at render time.
- Photo pack uses real hi-res images placed under `src/assets/images/` and
  imported via `astro:assets`; `downloadHref` is the built `image.src`.

## Page sections + graceful degradation

| Order | Section | Source | Renders when |
|---|---|---|---|
| 1 | Hero (one-liner + "Book us" CTA) | `epk` | always |
| 2 | Pitch (1-2 paragraphs) | `epk.pitch` | always |
| 3 | Listen / Watch (track + click-to-load video) | `discography.ts` | always |
| 4 | Live track record (past shows: venue, city, date) + draw stats | `getPastShows()` + `epk.drawStats` | shows always; stats only if `drawStats` set |
| 5 | Lineup (members + roles, link to `/band/[slug]`) | `bandMembers.ts` | always |
| 6 | Quotes | `pressPage.quotes` | always |
| 7 | Photo pack (hi-res grid, each downloadable) | `epk.photoPack` | only if `photoPack` non-empty (see note) |
| 8 | Tech rider / stage plot (input list, backline, plot, notes) | `epk.techRider` | only if `techRider` set |
| 9 | Footer CTA ("Book us" + link to `/press` media room) | `epk` | always |

Day-one shipped sections: 1,2,3,4(shows),5,6,9 are guaranteed from existing
data. Section 7 (photo pack) ships on day one IF hi-res photos are added to the
repo during implementation; if none are provided yet, `photoPack` is `[]` and the
section is hidden until photos land — the page still ships. Sections 4(stats) and
8 (tech rider) appear once the band supplies that data.

**Implementation seed:** if dedicated hi-res press photos aren't supplied at build
time, seed `photoPack` with the existing in-repo band images already used on the
site (e.g. `hero-band.jpg`, live-show photos in `src/assets/images/`) so the
section ships non-empty, and swap in true hi-res files when available.

## Structured data

- `WebPage` (`@id` = `buildPageId(siteRoutes.epk.path)`, `isPartOf` website,
  `about` MusicGroup) — mirrors `press.astro`.
- `BreadcrumbList`: Home › Press › EPK (via `buildBreadcrumbList`).
- For listed past shows, reuse the existing complete-fields Event JSON-LD shape
  (the one from the GSC fix — offers/organizer fields always populated) so the
  track-record section is machine-readable. Factor the builder so both
  `/shows/[slug]` and `/press/epk` use the same logic rather than duplicating it.
  (If extraction is non-trivial, an acceptable interim is a small shared helper
  `src/lib/shows/eventSchema.ts` that both pages import.)

## "Book us" CTA

Prefilled `mailto:` built the same way as `press.astro`'s `pressMailto`
(encodeURIComponent subject + body), using `epk.booking`. Example body lines:
venue/date, capacity, offer/guarantee, links. Mirrors the existing press inquiry
pattern so there's one consistent contact mechanism.

## Testing & verification

- `tests/e2e/seo.spec.ts`: add `/press/epk` to `staticRoutes`.
- `tests/e2e/a11y.spec.ts`: add `/press/epk` to routes (no serious/critical axe
  violations).
- `tests/e2e/structured-data.spec.ts`: assert `/press/epk` emits `WebPage` +
  `BreadcrumbList` nodes.
- Gate: `npm run check` (0 errors), `npm test` (drift guards), `npm run build`,
  and an agent-browser smoke: hero + "Book us" mailto present, photo-pack
  download links resolve, past-show + lineup + quotes sections render.

## Build-time inputs needed from the band

- **Now:** hi-res photo files (placed in `src/assets/images/`), the hero
  one-liner, and the 1-2 pitch paragraphs (I can draft these from existing band
  facts for approval).
- **Later (optional, slots hidden until provided):** tech rider / stage plot,
  draw/attendance stats.

## File-by-file change list

- `src/data/epk.ts` — NEW: `Epk` types + `epk` data object.
- `src/pages/press/epk.astro` — NEW: the booking hub page + WebPage/Breadcrumb/Event schema.
- `src/data/site.ts` — add `epk: { path: "/press/epk" }` to `siteRoutes`.
- `src/pages/press.astro` — add a cross-link to `/press/epk`.
- `src/lib/shows/eventSchema.ts` — NEW (optional): shared Event JSON-LD builder if extraction is cleaner than inlining.
- `tests/e2e/{seo,a11y,structured-data}.spec.ts` — cover `/press/epk`.
- Photo assets under `src/assets/images/` (band-supplied).
