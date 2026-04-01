# Roadmap Gap Implementation Plan

Date: 2026-03-31

## Goal

Map the current shipped site against the roadmap and specs, identify what is still unbuilt, and define the next implementation slices in the right order.

## Current Shipped Surface

Routes currently present in `src/pages/`:
- `/`
- `/about`
- `/contact`
- `/listen`

Current completed spec slices:
- homepage refinement
- `/about`
- `/contact`
- GEO/contact refinement
- `FollowPrompt` plus `/listen`

## Status By Spec

### Built

- `2026-03-30-filibusters-homepage-design.md`
  - implemented on `/`
- `2026-03-31-about-contact-design.md`
  - `/about` and `/contact` are shipped
- `2026-03-31-contact-geo-refinement-design.md`
  - core GEO/contact refinements are shipped
- `2026-03-31-follow-prompt-design.md`
  - popup funnel and `/listen` route are shipped

### Partially Built

- `2026-03-31-next-phase-roadmap.md`
  - completed from this roadmap:
    - streaming prompt intent is already covered by `FollowPrompt` and `/listen`
  - not yet completed:
    - `Sanity`
    - `/shows`
    - `/shows/[slug]`
    - `/community`
    - real `Kit` email signup flow
    - merch exploration

## Features Not Yet Built

### 1. Sanity CMS Setup

Not built.

Needed because:
- shows are still repo data
- community content has no editor workflow
- roadmap explicitly chose `Sanity`

Expected scope:
- Sanity schema setup
- Astro data fetching at build time
- local fallback strategy during migration

### 2. Dedicated `/shows` Page

Not built.

Current state:
- homepage has a shows preview only
- there is no standalone `/shows` route

Expected scope:
- full event list page
- status-aware rows or cards
- direct ticket links
- better internal linking than homepage-only anchors

### 3. Dynamic `/shows/[slug]` Pages

Not built.

Expected scope:
- one page per show
- flyer/poster-first layout
- venue/date/ticket/meta details
- optional lineup and notes

### 4. `/community` Hub

Not built.

Current state:
- homepage has only a signup section
- no journal/news destination exists

Expected scope:
- mixed hub for news, announcements, release updates, and behind-the-scenes posts
- fan-journal tone rather than newsroom tone
- content model designed alongside shows to avoid a second migration

### 5. Real Email Flow With `Kit`

Not built.

Current state:
- homepage signup still depends on `PUBLIC_COMMUNITY_FORM_ACTION`
- fallback is still email/manual
- no confirmed `Kit` integration exists in repo

Expected scope:
- email-only signup
- one main audience
- branded success/error states
- replace fallback-first behavior with real submission flow

### 6. `/press`

Still not built, but intentionally deferred by earlier specs.

Expected later scope:
- short bio
- long bio
- approved photos
- logo assets
- quotes
- music video
- contact block

This should stay separate from `/community`.

## Important Non-Roadmap Gaps

These are not core roadmap items, but they are now visible gaps from the current site and audit work:

### Privacy Policy

Not built.

Reason:
- repeated live audit warning
- trust/legal footer gap

### Editorial/Trust Pages

Not built.

Reason:
- optional, but useful if community content grows
- helps with E-E-A-T warnings later

### Homepage Horizontal Scroll Cleanup

Still not fully resolved from audit output.

Reason:
- verification standard in `AGENTS.md` treats horizontal scroll as a blocker

## Recommended Build Order

### Slice 1: Shows Foundation

Build first:
- `/shows`
- `/shows/[slug]`

Reason:
- highest-value content gap
- aligns directly with roadmap
- creates immediate reason to leave homepage anchors behind

### Slice 2: CMS Foundation

Build second:
- `Sanity` setup
- migrate show data first

Reason:
- show data changes often
- the structure can later be reused for community

### Slice 3: Community Hub

Build third:
- `/community`
- shared content architecture with shows

Reason:
- roadmap explicitly prioritizes this before merch
- it gives fans a destination beyond static pages

### Slice 4: Email System

Build fourth:
- `Kit` signup integration
- replace fallback-first homepage signup behavior

Reason:
- better after content destinations exist
- easier to design around real audience acquisition points

### Slice 5: Press And Trust Layer

Build fifth:
- `/press`
- `/privacy`
- optional editorial/trust page

Reason:
- press assets are still pending
- privacy/trust should ship before community scales up

## Recommended Immediate Next Execution Plan

Next implementation session should focus on one bounded slice:

1. Build `/shows`
2. Build `/shows/[slug]`
3. Add internal links from homepage and about/contact where relevant
4. Keep data repo-local first if needed, but shape it for a near-term `Sanity` migration

This is the cleanest next move because it creates visible user value without blocking on CMS credentials or external platform setup.

## Open Questions

- whether show pages should launch from repo data first or wait for `Sanity`
- whether `/community` should launch from static seed content or wait until CMS is ready
- whether `Kit` integration should be embedded directly or proxied through a serverless endpoint
- whether `/press` should remain hidden until all assets arrive
