# The Filibusters — Growth Roadmap

Last updated: 2026-06-25

Post-maintenance roadmap, ranked by impact on the band's real goal: **get
discovered → hear the music → find shows.** Three tracks: Discovery (off-site
identity + listings), Content (reasons to return + crawl fuel), Product (site
features).

For the *current shipped state* see `docs/memory/project-state.md`. For the
how-to-submit detail on the off-site items see
`docs/off-site-seo-submission-packet.md`. For AI-search measurement see
`docs/geo/share-of-model-tracker.md`.

---

## ✅ Recently shipped (June 2026)

- Provo geo + brand-keyword SEO (singular "filibuster band" + geo phrasing in
  MusicGroup schema and `/provo-alt-rock-band`).
- `agent-browser` SEO verification harness (`npm run verify:seo:agent-browser`).
- Sitemap `lastmod` drift fix + `npm test` enforced in CI + 301 for the renamed
  June slug.
- Four show recaps expanded into SEO/GEO assets with setlists and new-song teases.
- Band-member Person pages (`/band/[slug]`) linked into the MusicGroup schema.
- Real 180×180 PNG apple-touch-icon.
- `/merch` "coming soon" placeholder.
- Curated Instagram gallery on `/for-fans-of` and `/community` (no third-party JS) — now linked to 6 real posts.
- Genres set to Alternative rock / Indie rock / Pop punk; `/for-fans-of` expanded to 8 comparison artists.
- Richer Hanna Eyre bio (The Voice S12, songwriter history) on `/band/hanna-eyre`.

## ✅ Off-site identity — DONE (2026-06-25)

- **MusicBrainz** artist `7a328949-233a-496b-baf4-9dcd9b3dfd5f` — band + 4 members (Curtis on drums) + the single. Also merged a duplicate Hanna Eyre and kept her 2017 *Voice* single.
- **Wikidata** item **Q140356485** — full statements (instance of, Provo, genres, inception, MBID, Spotify, Apple, Instagram).
- **Bandsintown** artist `bandsintown.com/a/15654159` — profile live.
- All three wired into the site's MusicGroup `sameAs` via `identitySameAs` in `src/data/site.ts`.
- **Result:** Google's AI Overview now lists the correct lineup (Curtis Schnitzer on drums) — the "Trevor Jacobson" hallucination is resolved.

## ⏸️ Blocked / on a timer (revisit later)

| Item | Status |
|---|---|
| **Add shows to Bandsintown** | No future dates booked right now. Add each new show (to Bandsintown *and* `src/data/shows.ts`) the moment it's confirmed. |
| **Facebook About cleanup** | Band has **no account access** — skip. (Page still ranks/cited; revisit only if access is regained.) |
| **Google Knowledge Panel** claim | Wait ~2–6 wks for MusicBrainz/Wikidata to index, then claim via the band's Google account. |

## 🎯 What you can do now (no FB, no events needed)

Ranked by leverage — all doable solo today:

1. **Spotify for Artists** (highest leverage) — claim the artist profile (id `4Mf8AkUvGERBfOkG8ozuDl`). It lets you fix the **bio + genre at the source** (kills the "pop rock" label leaking into AI answers), add photos/canvas, and it's the **verification key for Bandsintown**.
2. **Re-baseline the Share-of-Model tracker** (`docs/geo/share-of-model-tracker.md`) — re-run the prompts on ChatGPT/Claude/Perplexity/Gemini now that the fixes are live; record CITED/MISSED/PARTIAL. Measures the win and shows what's still weak.
3. **Apple Music for Artists** — same as Spotify: claim, set consistent bio/genre/photos.
4. **Genius** — add lyrics for "Break Up With Your Boyfriend" → a lyric surface + another `sameAs` for AI search.
5. **Bandcamp / Last.fm** — more `sameAs`. (Last.fm: create a *new* entry — the existing "The Filibusters" there is the Seattle punk band.)
6. **Wikidata enrichment** — add the 4 members as items linked to the band (`P463` member of); enrich Hanna's item with her Voice history.
7. **YouTube channel UC id** — grab the `UC…` id and backfill the `P2397` statement on Wikidata + the YouTube link on MusicBrainz/Bandsintown (we skipped it earlier).

When any new profile goes live, send me the URL and I'll add it to `src/data/site.ts` → `socialLinks` ("follow us") or `identitySameAs` (identity record).

## 🟢 Soon (compounding, mostly content)

- **Recap cadence** — one journal post per show going forward (pattern + page system are proven).
- **Swap Instagram tiles for the actual post images** — currently band photos linked to real posts; send the post images for exact-match tiles.

## ⚪ Backlog (only if needed)

- **Sanity community migration** — only if the band wants no-deploy editing; TS
  data files are the accepted steady state otherwise.
- Comparison / "best-of" landing pages (next-phase GEO for the 0/5 comparison
  prompts).
- Merch storefront (when there's product to sell — `/merch` placeholder is live).
