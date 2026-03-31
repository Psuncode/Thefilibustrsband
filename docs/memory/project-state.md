# Project State

Last updated: 2026-03-30

## Current Site

- The site is an Astro + Tailwind marketing website for The Filibusters band.
- The main published experience is the homepage at `src/pages/index.astro`.
- Shared shell behavior lives in `src/layouts/BaseLayout.astro`, `src/components/site/Header.astro`, and `src/components/site/Footer.astro`.
- Homepage content is assembled from focused sections in `src/components/home/`.
- Site-level metadata lives in `src/data/site.ts`.

## Current Integrations

- Vercel Analytics is installed and rendered in `src/layouts/BaseLayout.astro`.

## Current Assets

- The browser tab icon is `public/favicon.svg`.
- Public images should stay limited to assets used by the shipped site.

## Current Verification Standard

- Run `npm run build` after code changes.
- For visual work, also check the site in `npm run dev`.
- Verify mobile width around `375px` and avoid horizontal scroll.
