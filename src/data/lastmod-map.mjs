// SOURCE-OF-TRUTH MIRROR — slug + date pairs duplicated from src/data/{shows,community}.ts.
// Kept separate so astro.config.mjs can import it without pulling in image assets
// (which only resolve inside the Astro build).
// tests/lastmod-map.test.mjs guards against drift. If you add/remove an entry here,
// ensure the matching .ts file is updated, and vice versa.

export const showLastmod = [
  { slug: "byu-battle-of-the-bands-2026", startsAt: "2026-03-28T19:00:00-06:00" },
  { slug: "devotional-unforum-2026-04-14", startsAt: "2026-04-14T11:05:00-06:00" },
  { slug: "les-femmes-de-velour-2026-05-08", startsAt: "2026-05-08T19:30:00-06:00" },
  { slug: "punk-fest-summer-kickoff-2026-05-30", startsAt: "2026-05-30T18:00:00-06:00" },
  { slug: "filibusters-new-song-showcase-2026-06-12", startsAt: "2026-06-12T19:00:00-06:00" },
  { slug: "always-her-album-release-2026-06-19", startsAt: "2026-06-19T19:30:00-06:00" },
  { slug: "utah-arts-festival-2026", startsAt: "2026-06-20T20:30:00-06:00" },
  { slug: "rustic-paradise-2026-06-25", startsAt: "2026-06-25T22:00:00-06:00" }
];

export const communityLastmod = [
  { slug: "les-femmes-de-velour-2026-recap", publishedAt: "2026-05-09T11:00:00-06:00" },
  { slug: "devotional-unforum-2026-recap", publishedAt: "2026-04-15T10:00:00-06:00" },
  { slug: "byu-battle-of-the-bands-2026-win", publishedAt: "2026-03-29T10:00:00-06:00" },
  { slug: "break-up-with-your-boyfriend-out-now", publishedAt: "2026-03-26T09:00:00-06:00" },
  { slug: "before-the-set-starts", publishedAt: "2026-03-20T18:30:00-06:00" },
  { slug: "next-phase-feels-bigger", publishedAt: "2026-03-18T14:00:00-06:00" }
];
