# SEO Foundation Pass Design

Date: 2026-04-04

## Goal

Improve organic search performance for the Filibusters website by strengthening page-specific SEO on the existing site structure.

This phase should improve ranking relevance, rich result eligibility, and search clickthrough without adding new pages or redesigning the site.

## Scope

In scope:
- page-level metadata improvements on existing routes
- event schema improvements for show detail pages
- stronger local and genre relevance in existing copy
- internal linking improvements within the current page set
- verification of sitemap, robots, canonical, HTTPS, and mobile behavior

Out of scope:
- new landing pages
- broad editorial or content marketing expansion
- off-site SEO work
- major visual redesign
- non-SEO product work

## Current Repo Context

The current site already has a solid technical baseline:
- `astro.config.mjs` sets the site URL to `https://www.thefilibustersband.com`
- `BaseLayout.astro` outputs canonical tags, Open Graph tags, and sitewide structured data
- `public/robots.txt` allows crawling and references the sitemap
- `src/pages/sitemap.xml.ts` generates route URLs using the site metadata URL
- `vercel.json` redirects the apex host to `https://www.thefilibustersband.com`

The main SEO gap is not the absence of baseline SEO plumbing. The main gap is that page-level relevance and event-rich-result eligibility are weaker than they should be.

## Problem Statement

The site is technically indexable, but it underuses the routes and content it already has.

Current weaknesses:
- event schema is emitted from the shared layout instead of being owned by each event page
- event schema is incomplete for rich results
- show metadata is generic instead of venue/date/location specific
- homepage and shows copy do not fully capitalize on local intent and genre signals
- Open Graph presentation is centralized around one image, even when a show page has a better page-specific image

## Approach

Use an SEO foundation pass on the existing site structure.

This approach keeps all current routes and visual patterns, but makes SEO page-specific and data-driven:
- keep site-level schema in the shared layout
- move rich event schema responsibility to individual show detail pages
- enrich show data so schema fields are first-class content fields
- improve title and description formulas on the homepage and show routes
- strengthen organic relevance through clearer copy and internal linking on existing pages

## Architecture

### Shared Layout Responsibility

`src/layouts/BaseLayout.astro` should continue to own shared SEO concerns:
- canonical URL
- default Open Graph values
- Twitter card values
- sitewide `WebSite` schema
- sitewide `MusicGroup` schema

The layout should no longer be the primary owner of event rich-result schema for every upcoming show.

The layout should accept page-level overrides for:
- Open Graph image
- Open Graph type
- optional page-specific structured data payloads

This keeps the layout focused on reusable site-level SEO while allowing routes to provide their own specific metadata.

### Show Detail Responsibility

`src/pages/shows/[slug].astro` should own event SEO for a specific show.

Each show page should output a complete `Event` JSON-LD object using that page's data. This is the most direct mapping between a crawlable event URL and the structured data Google expects for event rich results.

### Data Responsibility

`src/data/shows.ts` and related show types should include the fields needed for complete event schema and metadata instead of relying on partial inference.

These fields should support:
- precise event name
- start date
- optional end date
- summary/description
- image
- venue and location
- organizer information
- offer or ticket information

Sanity-backed show entries should map into the same normalized shape so fallback data and CMS data behave the same way.

## Content Strategy

### Homepage

The homepage should remain brand-led, but its metadata and supporting copy should be slightly more explicit about:
- The Filibusters
- Provo, Utah
- alt rock
- live shows
- original music

This should be done in natural language rather than obvious keyword stuffing.

The homepage should continue linking users toward the most search-relevant destinations already in the site, especially `/shows`.

### Shows Index

`src/pages/shows/index.astro` should read less like a generic list and more like the main destination for upcoming Filibusters live dates.

Its metadata and intro copy should emphasize:
- upcoming Filibusters shows
- live music
- venues and dates
- Utah and Provo relevance where natural

### Show Detail Pages

`src/pages/shows/[slug].astro` should use page-specific metadata formulas based on:
- show title
- venue
- city and state
- event date

Descriptions should summarize why the page matters to a searcher, not just restate the title.

Show body copy should stay truthful and useful, but where appropriate it should reinforce local and music-intent relevance with natural wording.

## Metadata Design

### Title Strategy

Homepage title:
- keep the existing branded direction, but ensure location and genre remain explicit

Shows index title:
- emphasize upcoming shows and band name

Show detail page title:
- include event title plus band name
- where space allows, include venue or location context

Titles should stay readable first and optimized second.

### Meta Description Strategy

Descriptions should:
- clearly describe the page's purpose
- include band, genre, and local context where relevant
- avoid duplicate boilerplate across pages

### Open Graph Strategy

Open Graph should remain centralized in the layout, but with route overrides:
- show pages should use the show flyer or event image when available
- the homepage and general pages can keep the default hero image
- show pages should use a page-appropriate type if supported by the layout API

## Structured Data Design

### Sitewide Schema

Keep these in `BaseLayout.astro`:
- `WebSite`
- `MusicGroup`

These are valid sitewide identities and do not need to be repeated differently on every route.

### Event Schema

Each show detail page should output one complete `Event` JSON-LD object.

The schema should include:
- `@context`
- `@type`
- `name`
- `startDate`
- optional `endDate`
- `description`
- `image` using an absolute HTTPS URL
- `eventAttendanceMode`
- `eventStatus`
- `location`
- `organizer`
- `performer`
- `offers`
- `url`

If a show has a ticket URL, use it for the offer URL.

If a show is free or price is unknown, the offer strategy should still be explicit and valid rather than omitted loosely.

All images in schema should resolve to fully qualified `https://www.thefilibustersband.com/...` URLs when they are hosted on the site.

## Internal Linking Design

Internal linking should improve clarity without introducing navigation clutter.

Changes should stay within existing pages:
- homepage continues linking to `/shows`
- About-related content should continue linking to `/shows` and other relevant routes when natural
- show detail pages should provide an easy path back to `/shows`
- route metadata and CTA copy should align with the actual user journey from discovery to event detail to ticket action

The goal is to make important SEO routes easier for crawlers and users to traverse.

## Verification Plan

After implementation:
- run `npm run build`
- verify generated pages render without broken assets or runtime issues
- inspect page source for canonical URLs and page-level metadata
- inspect a show detail page source for complete JSON-LD
- verify sitemap URLs remain HTTPS
- verify `robots.txt` still points to the correct sitemap
- check mobile layout around `375px`
- treat horizontal scroll, broken links, missing images, and malformed schema output as blockers

External validation after deploy:
- run Google Rich Results Test against a show page
- recheck Search Console for event and image warnings after recrawl

## Risks And Mitigations

### Risk: duplicated or conflicting schema

Mitigation:
- keep site-level schema in the layout
- keep event schema only on event detail routes

### Risk: schema fields become inconsistent between fallback data and CMS data

Mitigation:
- normalize show data into one canonical shape before rendering

### Risk: SEO copy becomes unnatural

Mitigation:
- prioritize readable music-site language and local clarity over aggressive keyword insertion

## Deferred Ideas

These should not be implemented in this phase, but they are good candidates for the roadmap:
- search-targeted community or editorial posts around releases, shows, and the local scene
- venue or city evergreen pages if query demand justifies them
- broader structured data coverage for community content
- deeper performance tuning if Core Web Vitals becomes a ranking or usability constraint

## Recommended Next Step

Write an implementation plan for a scoped SEO foundation pass covering:
- shared layout SEO API improvements
- show data model enrichment
- show detail event schema
- homepage and shows metadata/copy updates
- verification steps
