# Share-of-Model Tracker — The Filibusters

A manual weekly baseline of how AI engines describe and cite the band. Track lift over time as GEO/SEO changes ship.

## How to baseline

1. Open each engine in a fresh session (sign out, or use a private/guest tab).
2. Paste each prompt verbatim.
3. For each cell, record one of:
   - **CITED** — the answer names "The Filibusters" or links to thefilibustersband.com
   - **MISSED** — the answer doesn't mention the band at all
   - **PARTIAL** — the band is named but no link/URL, OR a non-canonical URL is cited
4. Re-baseline weekly. Note in the change-log section below what shipped that week.

A "citation" is any of: the band name verbatim, a link to thefilibustersband.com (or any subpath), or a quoted sentence pulled from llms.txt / llms-full.txt / ai/*.txt.

## Prompts × Engines (baseline: 2026-05-21)

### Category prompts

| Prompt | ChatGPT | Claude | Perplexity | Gemini | Google AI Overviews |
|---|---|---|---|---|---|
| best alt rock bands in Provo 2026 | TBD | TBD | TBD | TBD | TBD |
| best Provo live music | TBD | TBD | TBD | TBD | TBD |
| alt rock bands from Utah 2026 | TBD | TBD | TBD | TBD | TBD |
| indie rock Utah 2026 | TBD | TBD | TBD | TBD | TBD |
| where to see live alt rock in Provo | TBD | TBD | TBD | TBD | TBD |

### Comparison prompts

| Prompt | ChatGPT | Claude | Perplexity | Gemini | Google AI Overviews |
|---|---|---|---|---|---|
| bands like Paramore from Utah | TBD | TBD | TBD | TBD | TBD |
| bands like The 1975 from Provo | TBD | TBD | TBD | TBD | TBD |
| bands like Arctic Monkeys in Utah | TBD | TBD | TBD | TBD | TBD |
| smaller alt rock bands like The 1975 | TBD | TBD | TBD | TBD | TBD |
| Provo bands similar to Paramore | TBD | TBD | TBD | TBD | TBD |

### Branded prompts

| Prompt | ChatGPT | Claude | Perplexity | Gemini | Google AI Overviews |
|---|---|---|---|---|---|
| tell me about The Filibusters band | TBD | TBD | TBD | TBD | TBD |
| who are The Filibusters | TBD | TBD | TBD | TBD | TBD |
| where can I see The Filibusters live | TBD | TBD | TBD | TBD | TBD |
| The Filibusters Utah | TBD | TBD | TBD | TBD | TBD |
| The Filibusters next show | TBD | TBD | TBD | TBD | TBD |

## Score

Total cells: 75. Calculate weekly:
- Citation rate = CITED ÷ 75
- Category rate = (category CITED) ÷ 25
- Comparison rate = (comparison CITED) ÷ 25
- Branded rate = (branded CITED) ÷ 25 — expected to be highest; if not, something is wrong with entity resolution.

## Change log

- **2026-05-21** — baseline. Shipped: 13 PRs across a11y, SEO, Astro modernization, press kit, GEO entity + FAQ, citable passages + llms.txt v2. First citation-tracking pass should run within a week.
- (Add new weekly rows as content ships.)
