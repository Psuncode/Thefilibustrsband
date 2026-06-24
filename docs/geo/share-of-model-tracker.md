# Share-of-Model Tracker — The Filibusters

A manual baseline of how AI engines describe and cite the band. Track lift over time as GEO/SEO changes ship.

**Cadence: quarterly, plus an ad-hoc re-baseline after any major SEO/content push.**
(This supersedes the earlier "weekly" cadence — weekly was unrealistic for a band
in maintenance mode and drifted from `MAINTENANCE.md`, which schedules this
quarterly. Re-baseline sooner when a batch of GEO work ships so you can attribute
lift to it.)

## How to baseline

1. Open each engine in a fresh session (sign out, or use a private/guest tab).
2. Paste each prompt verbatim.
3. For each cell, record one of:
   - **CITED** — the answer names "The Filibusters" or links to thefilibustersband.com
   - **MISSED** — the answer doesn't mention the band at all
   - **PARTIAL** — the band is named but no link/URL, OR a non-canonical URL is cited, OR the band is named but a fact about it is wrong
4. Re-baseline weekly. Note in the change-log section below what shipped that week.

A "citation" is any of: the band name verbatim, a link to thefilibustersband.com (or any subpath), or a quoted sentence pulled from llms.txt / llms-full.txt / ai/*.txt.

## Prompts × Engines (baseline: 2026-05-21)

Google AI Overviews column was baselined autonomously via `WebSearch`. The other four chat-engine columns (ChatGPT, Claude, Perplexity, Gemini) require a human in a browser session — left as TBD for you to fill in over the next week. The autonomous baseline below is a strong proxy: where Google AI Overviews cited the band, the chat engines almost certainly cite it too; where Google missed, the chat engines may surprise either direction.

### Category prompts

| Prompt | ChatGPT | Claude | Perplexity | Gemini | Google AI Overviews |
|---|---|---|---|---|---|
| best alt rock bands in Provo 2026 | TBD | TBD | TBD | TBD | **CITED** — led the answer with The Filibusters as the #1 standout |
| best Provo live music | TBD | TBD | TBD | TBD | **MISSED** — answer focused on venues (Velour, Covey Center) without naming the band |
| alt rock bands from Utah 2026 | TBD | TBD | TBD | TBD | **CITED** — led with The Filibusters above Open Door Policy and The Backseat Lovers |
| indie rock Utah 2026 | TBD | TBD | TBD | TBD | **MISSED** — entirely festival-focused (Kilby Block Party, Lorde, The xx). No Utah-local-band content surfaced. |
| where to see live alt rock in Provo | TBD | TBD | TBD | TBD | **PARTIAL** — thefilibustersband.com appears in organic top 10 but the AI summary describes venues only |

### Comparison prompts

| Prompt | ChatGPT | Claude | Perplexity | Gemini | Google AI Overviews |
|---|---|---|---|---|---|
| bands like Paramore from Utah | TBD | TBD | TBD | TBD | **MISSED** — returned global Paramore-similar bands (Flyleaf, Tonight Alive, PVRIS). AI explicitly noted "search results don't specifically highlight bands that are both similar to Paramore and from Utah." |
| bands like The 1975 from Provo | TBD | TBD | TBD | TBD | **MISSED** — global The-1975-similar bands only (Band CAMINO, Inhaler, Wallows). |
| bands like Arctic Monkeys in Utah | TBD | TBD | TBD | TBD | **MISSED** — global Arctic-Monkeys-similar bands (The Strokes, Cage the Elephant, Foals). |
| smaller alt rock bands like The 1975 | TBD | TBD | TBD | TBD | **MISSED** — global recommendations only (MUNA, LANY, The Neighbourhood, Bad Suns). |
| Provo bands similar to Paramore | TBD | TBD | TBD | TBD | **MISSED** — same pattern. AI noted "search results don't specifically highlight bands from Provo, Utah." |

### Branded prompts

| Prompt | ChatGPT | Claude | Perplexity | Gemini | Google AI Overviews |
|---|---|---|---|---|---|
| tell me about The Filibusters band | TBD | TBD | TBD | TBD | **PARTIAL** — band correctly identified as Provo Utah alt rock, but lists **Trevor Jacobson on percussion** (incorrect — should be Curtis Schnitzer on drums). Also surfaces UK and Seattle bands of the same name. |
| who are The Filibusters | TBD | TBD | TBD | TBD | **PARTIAL** — same as above. Drummer name wrong, namesake disambiguation issue. |
| where can I see The Filibusters live | TBD | TBD | TBD | TBD | **PARTIAL** — first pass returned U.S. Senate filibuster results entirely; reformulated to find the band but no specific show dates returned. |
| The Filibusters Utah | TBD | TBD | TBD | TBD | **PARTIAL** — band correctly identified as Provo Utah alt rock with corrected geography, but again names **Trevor Jacobson** as a member. |
| The Filibusters next show | TBD | TBD | TBD | TBD | **MISSED** — entirely returned U.S. Senate filibuster pages. Band-vs-procedure name collision is severe. |

## Baseline score (Google AI Overviews only)

- **CITED**: 2 / 15 (13%)
- **PARTIAL**: 5 / 15 (33%)
- **MISSED**: 8 / 15 (53%)

Category: 2 CITED + 1 PARTIAL out of 5. Comparison: 0 CITED out of 5. Branded: 0 CITED + 4 PARTIAL out of 5.

## Critical issues surfaced by the baseline

### 1. INCORRECT MEMBER NAME on AI engines

Google AI Overviews repeatedly named **"Trevor Jacobson on percussion"** as a band member. This is wrong — the band's drummer is **Curtis Schnitzer**.

**Source hunt result (2026-06-24): there is no correctable page.** A thorough
web sweep found "Trevor Jacobson" on **zero** live third-party pages about our
band. Every real source — the official site, the BYU Daily Universe Battle of
the Bands article, Spotify — correctly names **Curtis Schnitzer**. The wrong
name appears only inside AI-generated answer boxes, which are even
self-contradictory (naming both Jacobson *and* Schnitzer in the same summary).
Diagnosis: this is an **AI-layer hallucination / entity-blend**, not scraped
misinformation — fueled by the name colliding with the Seattle punk "The
Filibusters," an AllMusic "Filibuster," and the U.S. Senate term, plus the fact
that our band had **no off-site structured profile** for the model to ground on.

Mitigation (re-ground the model rather than chase a page):
- [x] Ship machine-readable lineup: `MusicGroup.member[]` schema with each member
      as a `Person` (jobTitle incl. "Drummer" → Curtis Schnitzer), now linked to
      `/band/[slug]` Person pages. Plain-text members live on `/about` + `/band`.
- [ ] Create the off-site structured profiles the model can trust — **MusicBrainz**
      (with members), **Bandsintown**, **Songkick** — per
      `docs/off-site-seo-submission-packet.md`. This is the real fix: give the
      model a competing, correct, structured source.
- [ ] Report the wrong drummer directly via each engine's AI-overview feedback /
      "report a problem" control, citing thefilibustersband.com + the BYU article.
- [ ] (Band) Confirm the Facebook page "Members" field lists Curtis Schnitzer and
      not Trevor Jacobson (login-walled; couldn't verify externally).
- [ ] Standardize the genre string ("alt rock") across every profile — AI
      summaries currently drift between "pop rock" and "alt rock".

### 2. NAME COLLISION with U.S. Senate filibusters

Prompts like "The Filibusters next show" returned legislative-procedure pages exclusively. The band-name itself is a homonym for a major political concept. Mitigation: more **entity-resolution signals** that tie the name unambiguously to the band:

- [ ] Wikidata item ("The Filibusters" instance-of band, country US, location Provo, founded 2024, members named with their own items where possible)
- [ ] MusicBrainz entry with full member list, founded date, similar artists
- [ ] Schema.org `disambiguatingDescription` field in MusicGroup JSON-LD ("not to be confused with U.S. Senate filibusters") — engineering one-line PR
- [ ] Consistent prefix "The Filibusters band" in third-party listings (avoid bare "Filibusters")

### 3. COMPARISON prompts are 0 / 5 CITED

The site's new `/for-fans-of` page (shipped 2026-05-21) targets exactly this cluster. Re-baseline in 2-3 weeks after Google has had time to crawl. If still 0/5, the page needs more aggressive entity-density (named track recommendations, more comparison body copy).

### 4. NAMED venues (Velour, Utah Arts Festival) DON'T bridge to the band

"Best Provo live music" mentions Velour as a venue but doesn't name The Filibusters even though the band plays there. AI engines aren't connecting venue → band. Mitigation: more **Velour-anchored show pages**, more body copy on `/shows/[slug]` describing the venue context, and the `/shows/provo-2026-06` aggregator (shipped 2026-05-21) should help — re-baseline after a few weeks.

## Score formula (weekly)

Total cells (across all 5 engines): 75. When you finish the chat-engine columns:

- Overall citation rate = CITED ÷ 75
- Category rate = (category CITED) ÷ 25
- Comparison rate = (comparison CITED) ÷ 25
- Branded rate = (branded CITED) ÷ 25 — expected to be highest; if not, something is wrong with entity resolution.

## Change log

- **2026-05-21** — **Baseline (Google AI Overviews only).** 15 PRs shipped that day across a11y, SEO, Astro modernization, press kit, GEO entity + FAQ, citable passages + llms.txt v2, /music + /for-fans-of + BYU winner + /shows/provo-2026-06. **Critical finding: AI engines have wrong drummer name** (Trevor Jacobson instead of Curtis Schnitzer); needs source-hunt + correction. Comparison prompts entirely missed — the new /for-fans-of page hasn't been crawled yet. Branded "next show" prompts collide with Senate filibuster.
- **2026-06-24** — **Wrong-drummer source hunt completed.** No correctable third-party page exists; "Trevor Jacobson" is an AI-overview hallucination/entity-blend (see §1, rewritten). Mitigation reframed from "find the page" to "give the model authoritative structured data": MusicGroup `member[]` now links to new `/band/[slug]` Person pages; off-site MusicBrainz/Bandsintown/Songkick entries are the remaining real fix. Also shipped this cycle: Provo geo/keyword schema, 4 show recaps w/ setlists, band member pages, merch placeholder, Instagram gallery. **Chat-engine columns (ChatGPT/Claude/Perplexity/Gemini) still TBD — fill them in the next baseline.** Cadence reconciled to quarterly.
- _(Add quarterly rows below. Next re-baseline target: 2026-09 — and an ad-hoc one ~2-3 weeks after the June batch merges to catch crawl uptake on /band/*, the expanded recaps, and the geo keywords.)_
