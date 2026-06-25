# The Filibusters — Growth Roadmap

Last updated: 2026-06-24

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
- Curated Instagram gallery on `/for-fans-of` and `/community` (no third-party JS).

## ✅ Off-site identity — DONE (2026-06-25)

- **MusicBrainz** artist `7a328949-233a-496b-baf4-9dcd9b3dfd5f` — band + 4 members (Curtis on drums) + the single. Also merged a duplicate Hanna Eyre and kept her 2017 *Voice* single.
- **Wikidata** item **Q140356485** — full statements (instance of, Provo, genres, inception, MBID, Spotify, Apple, Instagram).
- **Bandsintown** artist `bandsintown.com/a/15654159` — profile live.
- All three wired into the site's MusicGroup `sameAs` via `identitySameAs` in `src/data/site.ts`.
- **Result:** Google's AI Overview now lists the correct lineup (Curtis Schnitzer on drums) — the "Trevor Jacobson" hallucination is resolved.

## 🟡 Next — needs band-side action

| Item | Why | Who |
|---|---|---|
| **⏰ Add shows to Bandsintown** (REMINDER) | Profile is live but **events were NOT added yet** — events are what win the `provo events` / `live music in Provo` queries. Add each show from `src/data/shows.ts`, and every future date when booked. | You |
| **Google Knowledge Panel** claim | Anchors branded SERPs once MusicBrainz + Wikidata index (~2–6 wks). | Band Google account |
| **Songkick** (optional) | Redundant event graph; lower priority than Bandsintown. | You |
| **Facebook About cleanup** | Google cites the (now-unused) FB page — keep its lineup/genre/founding accurate so it reinforces the correct entity. | You |

When any new profile goes live, add its URL to `src/data/site.ts` → `socialLinks`
("follow us" profiles) or `identitySameAs` (identity/disambiguation records).

## 🟢 Soon (compounding, mostly content)

- **Wrong-drummer correction** — AI engines say "Trevor Jacobson"; actual drummer
  is Curtis Schnitzer. Find + correct the off-domain source (see Share-of-Model
  tracker §1).
- **Share-of-Model re-baseline** — fill the chat-engine columns; re-measure after
  the June crawl uptake.
- **Recap cadence** — one journal post per show going forward (pattern + page
  system are proven).
- **Real Instagram posts** — swap the gallery placeholders for specific post
  permalinks + screenshots in `src/data/instagram.ts`.

## ⚪ Backlog (only if needed)

- **Sanity community migration** — only if the band wants no-deploy editing; TS
  data files are the accepted steady state otherwise.
- Comparison / "best-of" landing pages (next-phase GEO for the 0/5 comparison
  prompts).
- Merch storefront (when there's product to sell — `/merch` placeholder is live).
