# Roadmap Feature Architecture Design

Date: 2026-03-31

## Goal

Define the shared product architecture for the next major Filibusters site features before writing separate specs for each feature.

This document covers:
- route roles
- navigation strategy
- CMS architecture
- content model boundaries
- delivery order

This document does not replace the need for individual feature specs.

Those should still be written separately for:
- `shows-sanity`
- `community`
- `subscribe`
- `press`

## Context

The current shipped site includes:
- homepage at `/`
- `/about`
- `/contact`
- `/listen`
- homepage follow prompt and listen funnel

The next roadmap work needs to expand the site without collapsing multiple audiences into one catch-all page.

The most important design constraint is clarity:
- fans need updates and music/show discovery
- media/bookers need press-ready information
- the band needs a simple editor workflow
- email signup should stay conversion-focused

## Primary Decisions

### 1. Features Should Be Planned Separately

The remaining roadmap items should not be designed as one implementation blob.

They should be treated as:
- one shared architecture layer
- multiple feature-specific specs

Reasoning:
- each feature has a different user, content model, and UX goal
- this keeps implementation slices bounded
- it avoids designing around vague route names instead of actual product jobs

### 2. Feature Order

The product should be designed and built in this order:

1. `Shows`
2. `Community`
3. `Subscribe`
4. `Press`

`Sanity` is not treated as a separate user-facing feature after this point.

Instead:
- the `Shows` spec should include the first `Sanity` integration
- `Community` should extend the same CMS patterns after that

### 3. `Shows` Must Be CMS-Backed From The Start

`Shows` should not launch as a temporary hardcoded route.

It should be the first real `Sanity`-backed content surface so the site establishes:
- editorial workflow
- image handling
- slug strategy
- build-time content fetching
- reusable content patterns

### 4. `Community` And `Press` Stay Separate

`Community` should not become the container for `About`, `Press`, and updates all at once.

`Community` is for:
- fan-facing updates
- news
- announcements
- release updates
- behind-the-scenes posts
- milestone posts like the BYU Battle of the Bands 2026 win

`Press` is for:
- media
- venues
- bookers
- collaborators

`Press` should remain:
- curated
- stable
- asset-heavy
- secondary in navigation

### 5. `Subscribe` Stays Narrow

`Subscribe` should not launch as a generalized fan club or perks destination.

It should stay focused on one promise:
- get emails when there is new music, merch, and important band updates

Launch scope:
- one email field
- one list/audience
- one clear value proposition
- no segmentation
- no fake exclusives page

## Route Architecture

### Existing Routes

- `/`
- `/about`
- `/contact`
- `/listen`

### New Planned Routes

#### `/shows`

Purpose:
- public destination for upcoming events

Role:
- visual upcoming-shows grid
- date-first discovery
- ticket/status actions

#### `/shows/[slug]`

Purpose:
- full detail page for an individual event

Role:
- event article, not just a digital poster
- flyer as supporting media
- strong metadata and search value for venue/date/show queries

#### `/community`

Purpose:
- central fan-facing updates hub

Role:
- clean updates listing
- category-filterable later if needed
- not a formal newsroom

#### `/community/[slug]`

Purpose:
- full detail page for each update

Role:
- preserve milestone content as real pages
- allow image-led updates and search visibility
- support cross-linking to relevant shows

#### `/subscribe`

Purpose:
- email conversion page

Role:
- email-only signup
- narrow promise around music, merch, and major updates

#### `/press`

Purpose:
- press/media destination

Role:
- curated media kit
- secondary route, not a primary nav destination at launch

## Navigation Strategy

### Primary Navigation

Primary nav should remain tight:
- `Music`
- `Shows`
- `About`
- `Contact`

Reasoning:
- current header style does not benefit from too many top-level items
- `Community`, `Press`, and `Subscribe` are important but secondary-intent destinations

### Secondary Discovery

`Community` should be discoverable through:
- homepage community section
- footer
- contextual links from shows/about

`Subscribe` should be discoverable through:
- homepage community section
- footer
- community and release-related CTAs

`Press` should be discoverable through:
- footer
- `/contact`
- relevant about/contact copy

### Homepage Community Block

The existing homepage community element should evolve into a dual-CTA section:
- primary reading CTA: `View updates`
- primary conversion CTA: `Subscribe`

This lets one homepage block support:
- content discovery
- email capture

without forcing one CTA to do both jobs poorly.

## CMS Architecture

### Platform Choice

Use `Sanity`.

Reason:
- already chosen in the roadmap
- best fit for structured show data plus editorial updates
- allows the site to move away from hardcoded repo-only content in the areas that change most often

### CMS Rollout Strategy

Phase 1:
- integrate `Sanity` for shows

Phase 2:
- extend the same system for community posts

Phase 3:
- optionally extend or reuse pieces for press assets and site-level subscription settings

This avoids a big-bang migration.

### Astro Integration Direction

Astro should consume published content at build time.

The implementation should support:
- predictable static output
- clean route generation for slugs
- repo-side fallback decisions only if needed during migration

## Content Model

The CMS should start with distinct content types rather than a single generic post type.

### `show`

Fields:
- title
- slug
- status
- date/time
- venue
- city
- state
- ticket link
- short summary
- full body content
- flyer or hero image
- optional lineup
- optional notes

### `communityPost`

Fields:
- title
- slug
- category
- published date
- summary
- hero image
- full body content
- optional related show reference

### `pressPage` or `pressAssetGroup`

Fields:
- short bio
- long bio
- approved images
- logos
- quotes
- video link
- press contact

### `subscribeSettings` or site-level email config

Fields:
- heading
- body copy
- success message
- provider/form configuration

## Relationship Rules

### Shows

- `/shows` is upcoming-only at launch
- past shows should not clutter the main listing
- past shows may remain accessible via direct slug pages or a later archive

### Show Pages

- individual show pages should be event-article-first
- flyer remains important, but not as the only content
- these pages should be able to support both upcoming-event intent and later archival value

### Community

- `Community` launches as clean updates first, not an expressive journal
- every post gets a dedicated detail page
- categories stay lightweight

Initial categories:
- `Band News`
- `Show Updates`
- `Release Updates`
- `Behind the Scenes`

### Community Flagship Example

The BYU Battle of the Bands 2026 win should be treated as a model community post:
- image-led
- milestone-driven
- dedicated page
- strong title and summary
- optional relationship to a show/event if relevant

### Press

- separate from community
- should not inherit community’s chronological feed structure
- should remain curated and relatively static

### Subscribe

- separate from community content pages
- not a category inside community
- not a future merch hub
- only a signup destination with a narrow promise

## Delivery Plan

### Spec 1: `shows-sanity`

Should define:
- `Sanity` show schema
- Astro show fetching
- `/shows`
- `/shows/[slug]`
- image and status handling
- internal linking updates

### Spec 2: `community`

Should define:
- `communityPost` schema
- `/community`
- `/community/[slug]`
- category model
- relation to shows

### Spec 3: `subscribe`

Should define:
- `/subscribe`
- homepage CTA split
- provider integration strategy using `Kit`
- success/error states

### Spec 4: `press`

Should define:
- `/press`
- launch visibility strategy
- asset grouping
- contact integration

## Non-Core Supporting Pages

These are not part of the first four feature specs, but should stay in view:
- `/privacy`
- optional editorial/trust page

These become more important once:
- community content grows
- email signup becomes real
- audit clean-up continues

## Out Of Scope For This Shared Architecture Spec

- exact UI layout for each route
- final `Sanity` project setup commands
- provider-specific `Kit` implementation details
- detailed press asset presentation
- merch

Those belong in the separate feature specs.

## Recommended Next Step

Write the first feature spec for:
- `shows-sanity`

That spec should be the first implementation-driving document because it establishes:
- the CMS foundation
- the first new route family
- the first reusable editorial model
