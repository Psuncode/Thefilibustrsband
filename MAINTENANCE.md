# Maintenance Guide

A short, practical guide for keeping the Filibusters site healthy after the
initial build. If you only ever need to add shows, post community updates,
and ship them safely — this file is the whole job.

## What this site is

The Filibusters are a Provo, UT alt rock band. This site is an Astro + Tailwind
project deployed on Vercel. The `main` branch is the production branch — every
push to `main` triggers a Vercel deploy automatically. Content lives in
TypeScript data files (no CMS required for the routine flow), images live in
`src/assets/`, and a small suite of tests guards against the most common
self-inflicted mistakes.

## Repo layout (what matters for content maintenance)

- `src/data/shows.ts` — upcoming + past shows (source of truth for show pages).
- `src/data/community.ts` — community posts / band updates (the in-house blog).
- `src/data/site.ts` — site metadata, footer copy, schema config. Edit
  `siteMeta.canonicalParagraph` when the band's situation changes.
- `src/data/lastmod-map.mjs` — slug + date mirror of shows + community posts.
  Imported by `astro.config.mjs` for the sitemap. Drift-guarded by tests.
- `src/assets/images/` — show flyers, band photos, release art.
- `src/pages/` — Astro route files (`/`, `/shows`, `/community`, etc.).
- `src/components/` — UI components.
- `src/lib/shows/` and `src/lib/seo/` — read-only helpers; usually don't touch.
- `tests/` — `node:test` drift guards and Playwright e2e (SEO / a11y) checks.
- `vercel.json` — security headers + redirects (apex → www, slug renames).
- `docs/geo/share-of-model-tracker.md` — quarterly AI-search visibility log.

## How to add a show

1. **Add the flyer** to `src/assets/images/` (jpg or png). Use a descriptive
   filename (e.g. `velour-2026-08-15.png`).
2. **Import the image** at the top of `src/data/shows.ts`:
   ```ts
   import myShowImage from "../assets/images/velour-2026-08-15.png";
   ```
3. **Add a show object** to the `upcomingShows` array in `src/data/shows.ts`.
   Required fields (per `FallbackShowSource` in `src/lib/shows/data.ts`):
   `title`, `slug`, `status`, `startsAt`, `venue`, `city`, `state`, `summary`,
   `body` (array of paragraphs), `lineup` (array).
   Optional fields: `endsAt`, `country` (defaults to `"US"`), `ticketUrl`,
   `flyerUrl` (use `myShowImage.src`), `organizerName`, `organizerUrl`,
   `offers` (`{ url, price?, priceCurrency, availability, validFrom?, isFree? }`),
   `notes`, `seoDescription`.
4. **Use Mountain Time offsets** on `startsAt` / `endsAt`:
   - MDT (Mar–early Nov): `-06:00`
   - MST (early Nov–Mar): `-07:00`
5. **Mirror the slug + startsAt** into `src/data/lastmod-map.mjs` under
   `showLastmod`. If you skip this, `tests/lastmod-map.test.mjs` will fail.
6. **Verify, then commit and push.** Vercel deploys on push to `main`.

## How to add a community post

1. **Add the hero image** to `src/assets/images/` and import it at the top of
   `src/data/community.ts` (note: community.ts imports `ImageMetadata` objects
   directly, not `.src` strings — see existing posts).
2. **Add a post object** to `communityPosts` in `src/data/community.ts`.
   Required fields (`CommunityPost` type): `title`, `slug`, `category`
   (one of `Band News`, `Show Updates`, `Release Updates`, `Behind the Scenes`),
   `publishedAt` (ISO with `-06:00` / `-07:00` offset), `summary`,
   `heroImage`, `heroAlt`, `body` (array of paragraphs).
   Optional: `relatedShowSlug` — use this whenever the post is tied to a show
   so the two pages cross-link cleanly.
3. **Mirror slug + publishedAt** into `src/data/lastmod-map.mjs` under
   `communityLastmod`.
4. **Verify, then commit and push.**

## How to rename a show slug

Two things must happen together:

1. **Update `src/data/lastmod-map.mjs`** — change the slug under `showLastmod`
   (the drift-guard test compares slugs across `shows.ts` and the mirror).
2. **Add a 301 redirect** in `vercel.json` under `"redirects"`. Use the same
   shape already in the file:
   ```json
   {
     "source": "/shows/old-slug",
     "destination": "/shows/new-slug",
     "permanent": true
   }
   ```
   `"permanent": true` is what makes it a 301. Keep old redirects in place —
   they protect inbound links from press, socials, and search engines.

## Verification before pushing

Run from the project root:

- `npm run check` — Astro type check + diagnostics.
- `npm test` — `node:test` drift guards (lastmod-map mirror, etc.).
- `npm run test:e2e` — Playwright SEO + accessibility checks.
- Optional: `npm run dev` to spot-check the affected pages locally.

If `npm test` complains about `lastmod-map`, you forgot step 5 / step 3
above — go mirror the slug.

## Maintenance cadence

| Cadence | What |
|---|---|
| Every show added | Edit shows.ts, mirror slug, add flyer, commit + push |
| Every community post | Edit community.ts, commit + push |
| Monthly | `npm run check` + `npm run test:e2e`, glance Vercel Analytics + Search Console |
| Quarterly | Refresh Share-of-Model tracker (docs/share-of-model-*), audit MusicGroup schema |
| After any deploy | Hard-refresh `/`, `/shows`, latest community post |

## Off-site SEO playbook

The on-site SEO is already strong (MusicGroup schema, sitemap, OG tags). The
remaining wins are off-site identity: a MusicBrainz artist entry, a Wikidata
item linked to MusicBrainz + this site, and (eventually) claiming the Google
Knowledge Panel via a verified entity. If any of those three are not yet
done, treat them as a one-time quarterly task — they compound for AI search
(Share-of-Model) far more than another on-site tweak.

## Common pitfalls

- **Time zones.** Date formatters must use `timeZone: "America/Denver"` —
  Vercel builds in UTC, so naïve formatting will render the wrong day for
  late-evening shows. Every existing formatter already does this; copy that
  pattern when adding new ones.
- **The `lastmod-map.mjs` mirror is not optional.** `tests/lastmod-map.test.mjs`
  fails the build if `shows.ts` / `community.ts` and the mirror disagree. If
  the test fails after a content change, the fix is almost always "add the
  missing entry to `lastmod-map.mjs`."
- **Slug renames need a 301.** Changing a slug without adding a redirect in
  `vercel.json` quietly breaks every inbound link to that page.
- **Footer "Band summary" is `siteMeta.canonicalParagraph`.** Edit that string
  in `src/data/site.ts` when the band's situation changes (lineup, new release
  narrative, geography). It also feeds AI-search snippets, so keep it sharp.
- **Apex → www redirect already exists** in `vercel.json`. Don't duplicate it
  when adding new redirects.
