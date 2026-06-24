# Project State

Last updated: 2026-06-24

## Current Site

- The site is an Astro + Tailwind marketing website for The Filibusters band.
- The main published experience includes the homepage plus supporting routes for shows, community, press, privacy, and music discovery.
- Shared shell behavior lives in `src/layouts/BaseLayout.astro`, `src/components/site/Header.astro`, and `src/components/site/Footer.astro`.
- Homepage content is assembled from focused sections in `src/components/home/`.
- Site-level metadata lives in `src/data/site.ts`.
- Community content is currently hardcoded in `src/data/community.ts`.
- Shows use a Sanity-aware data layer with repo-data fallback in `src/lib/shows/`.

## Current Integrations

- Vercel Analytics and Speed Insights are rendered in `src/layouts/BaseLayout.astro`.
- Custom click and form tracking is wired through `src/lib/analytics.js`.

## Current Assets

- The browser tab icon is `public/favicon.svg`.
- Public images should stay limited to assets used by the shipped site.

## Current Roadmap Position

- The site is in maintenance mode. The original next-phase roadmap is largely
  superseded by what actually shipped:
  - **Email signup:** `Kit` was built then deliberately reverted (commit
    59b3c09). Signup is a `mailto:` link — this is the steady state, not a
    fallback. Do not re-attempt Kit. See `docs/memory/decisions.md` (2026-06-24).
  - **Sanity community migration:** a full spec exists
    (`docs/superpowers/specs/2026-05-21-sanity-community-migration.md`) but was
    never executed. `/community` still reads `src/data/community.ts`. This is a
    deferred backlog item, not an active step — TS data files are the accepted
    steady state for the routine flow (see `MAINTENANCE.md`).
  - **SEO/GEO cluster (May–June 2026):** citable passages, geo-entity FAQ,
    discovery-entity SEO, Provo geo/keyword coverage, and the June lineup
    refresh all shipped.
- True current next steps live off-site, not in code: the off-site identity
  packet (MusicBrainz → Wikidata → Google Knowledge Panel) in
  `docs/off-site-seo-submission-packet.md`, and keeping the band journal +
  Share-of-Model tracker current.

## Current Verification Standard

- Run `npm run build` after code changes.
- For visual work, also check the site in `npm run dev`.
- Verify mobile width around `375px` and avoid horizontal scroll.
