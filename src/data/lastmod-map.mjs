// Config-friendly lastmod data for the sitemap integration.
// Kept separate from shows.ts / community.ts so astro.config.mjs can import it
// without pulling in image assets (which only resolve inside the Astro build).
// If you add a show or community post, mirror its slug + date here.

export const showLastmod = [
  { slug: "byu-battle-of-the-bands-2026", startsAt: "2026-03-28T19:00:00-06:00" },
  { slug: "devotional-unforum-2026-04-14", startsAt: "2026-04-14T11:05:00-06:00" },
  { slug: "les-femmes-de-velour-2026-05-08", startsAt: "2026-05-08T19:30:00-06:00" },
  { slug: "utah-arts-festival-2026", startsAt: "2026-06-20T21:30:00-06:00" }
];

export const communityLastmod = [
  { slug: "byu-battle-of-the-bands-2026-win", publishedAt: "2026-03-29T10:00:00-06:00" },
  { slug: "break-up-with-your-boyfriend-out-now", publishedAt: "2026-03-26T09:00:00-06:00" },
  { slug: "before-the-set-starts", publishedAt: "2026-03-20T18:30:00-06:00" },
  { slug: "next-phase-feels-bigger", publishedAt: "2026-03-18T14:00:00-06:00" }
];
