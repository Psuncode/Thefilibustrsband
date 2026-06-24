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

## 🟡 Next — needs band-side action (highest leverage)

| Item | Why | Who |
|---|---|---|
| **MusicBrainz** artist + members + release | #1 "get discovered" lever; durable fix for the Senate-"filibuster" name collision; feeds Wikidata. | You submit (packet is paste-ready) |
| **Wikidata** item (links MusicBrainz MBID) | Structured-data layer behind Google Knowledge Panels and AI answers. | You paste the QuickStatements batch |
| **Bandsintown / Songkick** listing | What actually wins the `provo events` / `live music in Provo` Search Console queries; live-show verification. | You claim; copy in the packet |
| **Google Knowledge Panel** claim | Anchors branded SERPs once MusicBrainz + Wikidata index (~2–6 wks). | You verify via the band's Google account |

When any new profile goes live, add its URL to `src/data/site.ts` →
`socialLinks` and the `sameAs` graph picks it up automatically.

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
