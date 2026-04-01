# Roadmap Gap Implementation Plan

Date: 2026-03-31
Updated: 2026-04-01

## Goal

Map the current shipped site against the roadmap and specs, identify what is still unbuilt, and define the next implementation slices in the right order.

## Current Shipped Surface

Routes currently present in `src/pages/`:
- `/`
- `/about`
- `/contact`
- `/listen`
- `/shows`
- `/shows/[slug]`

Current completed spec slices:
- homepage refinement
- `/about`
- `/contact`
- GEO/contact refinement
- `FollowPrompt` plus `/listen`
- shows foundation with dedicated list and detail pages
- repo-local Sanity studio scaffolding and show data layer fallback

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
- `2026-03-31-shows-sanity-implementation.md`
  - Sanity studio scaffolding, fallback-aware show data utilities, `/shows`, and `/shows/[slug]` are shipped

### Partially Built

- `2026-03-31-next-phase-roadmap.md`
  - completed from this roadmap:
    - streaming prompt intent is covered by `FollowPrompt` and `/listen`
    - the shows experience is now covered by `/shows` and `/shows/[slug]`
    - the initial Sanity foundation for shows is in repo
  - not yet completed:
    - populated remote Sanity content workflow
    - `/community`
    - real `Kit` email signup flow
    - merch exploration

## Features Not Yet Built

### 1. `/community` Hub

Not built.

Current state:
- homepage has a signup section only
- no journal or updates destination exists yet

Expected scope:
- mixed hub for news, announcements, release updates, and behind-the-scenes posts
- fan-journal tone rather than newsroom tone
- content model designed to sit alongside the existing show schema work

### 2. Real Email Flow With `Kit`

Not built.

Current state:
- homepage signup still depends on `PUBLIC_COMMUNITY_FORM_ACTION`
- fallback is still email/manual
- no confirmed `Kit` integration exists in repo

Expected scope:
- email-only signup
- one main audience
- branded success and error states
- replace fallback-first behavior with real submission flow

### 3. Populated Sanity Workflow

Partially built.

Current state:
- repo-local studio config exists
- show schema exists
- Astro fetch layer already prefers Sanity when env vars are present
- fallback repo data is still the effective content source unless project credentials and remote documents are added

Expected scope:
- connect real project credentials
- create and publish show documents in Sanity
- verify production builds against remote content

### 4. `/press`

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

These are not core roadmap items, but they are visible gaps from the current site and earlier audit work.

### Privacy Policy

Not built.

Reason:
- repeated live audit warning
- trust and legal footer gap

### Editorial/Trust Pages

Not built.

Reason:
- optional, but useful if community content grows
- helps with E-E-A-T warnings later

### Homepage Horizontal Scroll Cleanup

Needs periodic verification whenever layout changes land.

Current state:
- current build passes
- `AGENTS.md` still treats horizontal scroll as a blocker, so this stays a verification requirement rather than a closed one-time task

## Recommended Build Order

### Slice 1: Community Foundation

Build first:
- `/community`
- shared content architecture for community posts

Reason:
- biggest remaining roadmap surface
- most visible content gap after shows shipped

### Slice 2: Email System

Build second:
- `Kit` signup integration
- replace fallback-first homepage signup behavior

Reason:
- better once there is a true community destination
- audience capture should connect to actual recurring content

### Slice 3: Sanity Content Operations

Build third:
- connect real project credentials
- move actual show management into Sanity
- expand schema strategy for community content

Reason:
- foundation code exists already
- remaining work is operational/content-model completion rather than route scaffolding

### Slice 4: Press And Trust Layer

Build fourth:
- `/press`
- `/privacy`
- optional editorial or trust page

Reason:
- good support layer once community and email flows exist
- improves press readiness and trust signals

### Slice 5: Merch Exploration

Build fifth:
- merch discovery and fulfillment direction

Reason:
- explicitly later-phase in the roadmap
- depends less on the current content architecture than community/email do

## Recommended Immediate Next Execution Plan

Next implementation session should focus on one bounded slice:

1. Build `/community`
2. Define a Sanity-ready content model for community posts
3. Add homepage and supporting-page links that point toward `/community`
4. After that lands, replace the current community signup fallback with real `Kit`

This is the cleanest next move because the shows slice is already in place, while community plus email is now the main product gap.

## Open Questions

- whether `/community` should launch from static seed content first or directly from Sanity-backed content
- whether `Kit` integration should be embedded directly or proxied through a serverless endpoint
- whether show status and event history should expand once remote Sanity content is populated
- whether `/press` should remain hidden until all assets arrive
