# SEO Local Discovery And AI Press Kit Design

Date: 2026-04-08

## Goal

Improve organic discovery for The Filibusters by positioning the site more strongly around local Provo alt rock intent while also making the band easier for AI-assisted promoter, venue, and press workflows to understand accurately.

This pass should improve search relevance, crawl clarity, internal link structure, and machine-readable band context without turning the site into a content farm or adding more than two new pages.

## Scope

In scope:
- stronger page-level SEO on existing routes
- more deliberate local-discovery positioning around Provo and alt rock
- metadata, schema, and internal-link improvements
- one new local-intent landing page if justified
- one low-visibility public AI press kit hub plus linked machine-readable documents
- improvement of `public/llms.txt`
- verification of mobile SEO hygiene, metadata uniqueness, schema coverage, and crawlable AI assets

Out of scope:
- broad content marketing expansion
- more than two new pages
- private or AI-only documents that are inaccessible to humans
- off-site SEO work
- major visual redesign
- roadmap work unrelated to SEO or machine-readable discovery

## Current Repo Context

The current site already has a solid technical SEO baseline:
- `src/layouts/BaseLayout.astro` outputs canonical URLs, Open Graph tags, Twitter tags, and sitewide JSON-LD
- `astro.config.mjs` sets the canonical site URL to `https://www.thefilibustersband.com`
- `public/robots.txt` and `src/pages/sitemap.xml.ts` provide crawl basics
- `public/llms.txt` already exists, but is minimal
- `src/pages/press.astro` already serves a human-facing press room
- `scripts/verify-seo-mobile.mjs` provides a dependable mobile SEO smoke check at `375px`

The recent work has focused on structured data and outbound tracking, so the technical baseline is no longer the main weakness.

The main remaining gaps are:
- the site is still stronger at baseline SEO hygiene than at local discovery positioning
- the existing routes do not yet form a deliberate local-intent search funnel
- the current `llms.txt` is too thin for AI-assisted promoter and press research
- there is no low-visibility machine-readable press hub that AI systems can use as a canonical factual source

## Problem Statement

The site is indexable and clean, but it does not yet compete as aggressively as it should for discovery-oriented queries around a Provo alt rock band.

The current experience communicates brand and style, but it under-expresses:
- local search relevance
- authority and credibility for promoters and press
- a machine-readable version of the band story, facts, links, and booking context

The objective is not to stuff keywords or fabricate authority. The objective is to make the site easier for search engines and AI systems to interpret correctly, while making the band more discoverable to people looking for standout alt rock acts in Provo.

## Recommended Approach

Use a two-layer SEO approach:

1. Strengthen the existing core routes so the homepage, about page, shows page, and listen page each carry a clearer and more differentiated SEO job.
2. Add two tightly scoped discovery surfaces:
   - one local-intent landing page for Provo alt rock discovery
   - one public but low-visibility AI press kit hub that links to machine-readable documents for promoter, venue, and press research

This is preferable to adding many new pages because:
- the existing site already has enough core authority surfaces
- a small site benefits more from clarity than from thin page volume
- the user explicitly wants no more than two new pages
- the roadmap already defers broader editorial expansion

## Page Strategy

### Existing Core Routes

#### Homepage

The homepage should become the primary branded-local discovery page.

Its role:
- answer who the band is
- reinforce that The Filibusters are a Provo, Utah alt rock band
- establish the live-show and original-music identity
- route people toward `/listen`, `/shows`, `/about`, and the new local-intent page where appropriate

The homepage can use assertive positioning selectively, including the idea that the band is among the standout alt rock acts in Provo, but it should support that positioning with proof points rather than repeat superlatives mechanically.

#### About Page

`/about` should become the credibility and authority page.

Its role:
- explain origin, sound, lineup, and local roots
- support local authority and comparable-artist understanding
- help promoters, journalists, and AI systems understand what kind of band this is
- function as the strongest long-form authority page tied to the band entity

#### Shows Page

`/shows` remains important, but it should support freshness and local relevance rather than carry the whole SEO strategy.

Its role:
- reinforce that the band is active
- connect local discovery to live proof
- link back to the discovery and authority pages cleanly

#### Listen Page

`/listen` should support music-intent discovery and artist understanding.

Its role:
- provide a clean destination for streaming intent
- support artist-identity queries with clearer copy
- link back toward authority and live-intent pages

#### Press Page

`/press` should remain the primary human-facing press room.

Its role should stay distinct from the AI layer:
- approved assets
- human-readable bios
- direct press contact
- pull quotes and media-facing materials

It should not become a dumping ground for raw machine-readable documents.

### New Pages

#### New Page 1: Local-Intent Landing Page

Add one new local-intent landing page, likely with a route such as `/provo-alt-rock-band`.

Its role:
- target local-discovery query intent directly
- serve users and crawlers looking for an alt rock band in Provo
- summarize the band, sound, local relevance, and proof points
- send users deeper into `/listen`, `/shows`, `/about`, and `/press`

This page must be clearly different from `/about`.

It should be:
- shorter
- more search-intent specific
- more location-and-genre focused
- less biographical than `/about`

#### New Page 2: AI Press Kit Hub

Add one low-visibility public page, likely under `/press/ai` or `/press/ai-kit`.

Its role:
- act as the canonical AI-friendly hub for machine-readable band context
- link to a small set of structured public documents
- help AI tools used by promoters, venues, and press retrieve clean, consistent facts

This page should be publicly crawlable but not heavily promoted in main navigation.

It can be linked from:
- `llms.txt`
- the human press page
- optionally the footer or another low-visibility location if needed

## AI-Readable Asset Strategy

There is no practical way to publish a document that only AI can read while keeping humans out. If a document is public enough for AI crawlers or assistants to access, it is effectively public.

The design should therefore use public structured documents with low navigation prominence rather than pretending they are private.

### Asset Set

The AI press hub should link to a compact set of stable public assets, such as:
- `llms.txt` as the top-level AI discovery entry point
- a band profile summary document
- a promoter and venue brief
- a press backgrounder
- a factual reference sheet
- an FAQ for common AI-assisted lookup tasks

These assets should likely live under stable public URLs such as:
- `/ai/band-profile.txt`
- `/ai/promoter-brief.txt`
- `/ai/press-backgrounder.txt`
- `/ai/fact-sheet.txt`
- `/ai/faq.txt`

The exact route pattern can vary, but the URLs should be:
- simple
- stable
- text-first
- easy to reference from `llms.txt` and the AI hub

### Content Principles For AI Assets

These assets should be:
- factual first
- concise
- internally consistent
- explicit about location, genre, lineup, contact, and official links
- written to be easy for retrieval, summarization, and citation

They should avoid:
- exaggerated hype language
- contradictory summaries across documents
- duplicate content with only cosmetic rewrites
- claims that are not supportable from the site itself

The assertive positioning can still appear, but it should be framed carefully, for example:
- “a standout alt rock band from Provo, Utah”
- “considered by fans to be one of the most exciting alt rock bands in the Provo scene”

This is safer and more defensible than repeatedly stating unverifiable “best band” claims as factual assertions.

## Metadata Design

Metadata should become more differentiated by route.

### Homepage

The homepage title and description should emphasize:
- band name
- Provo, Utah
- alt rock
- original music
- live shows

The homepage should target broad branded-local discovery rather than trying to cover every intent.

### About

`/about` should emphasize:
- who the band is
- where they are from
- sound and identity
- local credibility

### Shows

`/shows` should emphasize:
- upcoming Filibusters shows
- live performances
- Utah or Provo relevance where natural

### Listen

`/listen` should emphasize:
- original music
- streaming destinations
- the band identity in a way that supports music-intent searches

### Local-Intent Page

The new local page should be the strongest target for:
- “Provo alt rock band”
- “alt rock band in Provo”
- closely related local discovery phrasing

It should not duplicate the homepage title formula exactly. Its metadata should be more direct and search-intent specific.

### AI Press Hub

The AI press hub metadata should clearly describe it as an AI-friendly press and factual resource, not as a consumer-facing promo page.

## Structured Data Design

### Keep Existing Sitewide Schema

`BaseLayout.astro` should continue to own sitewide schema:
- `WebSite`
- `MusicGroup`

This remains the correct home for core identity schema.

### Expand Page-Specific Structured Data

Each route should contribute only the schema that matches its purpose.

Likely additions or refinements:
- homepage: a stronger `WebPage` representation tied to the band entity
- about page: enriched `AboutPage`
- press page: a clearer `CollectionPage` or `WebPage` structure tied to press resources
- local-intent page: a focused `WebPage` tied to the `MusicGroup`
- AI press hub: a `WebPage` or `CollectionPage` representing AI-friendly press resources

The AI text assets themselves do not need exotic schema. Their primary value is stable, readable, crawlable text. The hub page should carry the main structured representation.

## Internal Linking Design

Internal linking should create a deliberate discovery loop.

Desired link graph:
- homepage links clearly to `/about`, `/listen`, `/shows`, and the local-intent page
- `/about` links to `/listen`, `/shows`, `/press`, and the local-intent page
- `/listen` links back to `/about` and `/shows`
- `/shows` links back toward `/about` and `/listen`
- `/press` links to the AI press hub in a low-visibility but explicit way
- AI press hub links to `/press`, `/about`, `/listen`, `/shows`, and official social or streaming profiles where relevant
- `llms.txt` points to the AI press hub and its underlying public text assets

This should improve both human journey clarity and crawler understanding of which pages are central.

## Roadmap Alignment And Deficiencies

The roadmap correctly prioritizes Sanity, shows, community, and email flow, but it leaves local discovery and AI-readable brand context underdeveloped.

Current deficiencies relative to the roadmap and current site state:
- there is no dedicated local-discovery page for the strongest target query cluster
- the current AI-readable surface is limited to a basic `llms.txt`
- the human press page exists, but there is no machine-readable companion layer
- the existing SEO verification focuses on mobile technical hygiene rather than content relevance and semantic differentiation

This design addresses those deficiencies without derailing the roadmap into a large editorial or CMS project.

## Verification Plan

After implementation:
- run `npm run build`
- run `npm run verify:seo`
- verify the new routes render correctly at mobile width
- verify title tags and meta descriptions are unique and aligned to route purpose
- verify canonical URLs are correct
- inspect page source for expected route-level structured data
- verify the AI hub and text assets are publicly reachable
- verify `llms.txt` references the new AI surfaces
- verify the sitemap behavior for any new public pages and assets is intentional
- verify internal links connect the discovery loop as designed

External checks after deploy:
- inspect rendered metadata on production URLs
- test whether AI-facing assets are fetchable via their public URLs
- run page-level checks for the local-intent page in search preview tools if desired

## Risks And Mitigations

### Risk: local-intent page duplicates homepage or about page

Mitigation:
- make the new page narrowly search-intent focused
- keep `/about` biographical and authority-oriented
- keep the homepage broader and more brand-led

### Risk: AI assets become inconsistent with human-facing press content

Mitigation:
- define one canonical band summary and fact base
- derive all AI assets from the same approved facts and positioning

### Risk: the assertive Provo positioning becomes spammy or unverifiable

Mitigation:
- use strong but defensible phrasing
- support claims with fan proof, local context, and clean factual framing
- avoid repeating “best” claims as objective fact in every page surface

### Risk: low-visibility AI assets become effectively orphaned

Mitigation:
- link them from `llms.txt`
- link them from the AI press hub
- provide at least one human-facing bridge from the press area

## Recommended Next Step

Write an implementation plan for a focused SEO local-discovery and AI press kit pass covering:
- metadata and copy differentiation across existing routes
- one local-intent landing page
- one AI press hub page
- improved `llms.txt`
- stable public AI-readable text assets
- internal-link updates
- structured-data updates where needed
- verification steps for both SEO and AI asset reachability
