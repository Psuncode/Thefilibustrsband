# Project State

Last updated: 2026-04-15

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

- The next product step is setting up `Sanity` for community content so `/community` can move off hardcoded repo data.
- After that, the next step is replacing the current signup fallback with a real `Kit` email flow.

## Current Verification Standard

- Run `npm run build` after code changes.
- For visual work, also check the site in `npm run dev`.
- Verify mobile width around `375px` and avoid horizontal scroll.
