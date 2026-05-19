# Structured Data Expansion Design

Date: 2026-04-05

## Goal

Strengthen The Filibusters website as a clear entity source for search engines by expanding structured data with a knowledge-signal-first approach.

This phase should improve the site's usefulness as a canonical reference for the band while keeping event schema accurate and supportive.

## Priority

Primary priority:
- band and organization knowledge signals

Secondary priority:
- event rich-result support on existing show pages

This is not an events-first SEO phase. It is an entity-first structured-data phase with factual event support.

## Scope

In scope:
- homepage entity schema strengthening
- structured-data improvements on existing supporting pages
- coherence between site-level and route-level schema
- evaluation of one possible new entity-supporting route if there is a clear gap

Out of scope:
- thin SEO expansion pages
- city or venue landing-page sprawl
- broad content creation
- performance optimization work
- fabricated schema fields added only to chase richer markup

## Current Repo Context

The current repo already has:
- site-level `WebSite` and `MusicGroup` schema emitted from `BaseLayout.astro`
- factual event schema on show detail pages
- supporting routes including `/about`, `/listen`, `/contact`, `/community`, and `/shows`

The current structured-data baseline is not missing entirely. The main opportunity is to make the homepage and supporting routes form a stronger entity graph for The Filibusters.

## Problem Statement

The site currently provides a valid but relatively light entity signal.

Weaknesses:
- the homepage is not yet maximized as the canonical entity page for the band
- supporting routes exist, but schema relationships between them may still be shallow
- route-level structured data is stronger for events than for the broader band identity
- the site may have enough content already, but not enough explicit entity structure connecting that content

## Recommended Approach

Use a homepage-first knowledge graph expansion.

This means:
- strengthen homepage identity schema first
- use existing routes as supporting signals
- keep event schema accurate but secondary
- only add a new route if current pages leave a clear entity gap

This approach best matches the product goal: stronger knowledge signals without creating content sprawl.

## Entity Strategy

### Canonical Entity Page

The homepage should be treated as the primary canonical entity page for The Filibusters.

It should be the strongest page for answering:
- who the band is
- what kind of band it is
- where it is based
- how it is connected across the site and social profiles
- how search engines should interpret the rest of the site in relation to that entity

### Supporting Entity Pages

Existing routes should reinforce the homepage entity rather than compete with it.

Likely supporting roles:
- `/about`: deeper band identity and member/story context
- `/listen`: music and platform presence
- `/contact`: contact and organization legitimacy
- `/shows`: live-performance relationship to the entity
- `/community`: ongoing activity and band updates

These routes should support the same entity graph rather than operate as isolated pages with disconnected metadata.

## Homepage Schema Direction

The homepage should continue to include `WebSite` and `MusicGroup`, but those should be reviewed and expanded where the repo has strong factual support.

The homepage should become a cleaner expression of:
- band identity
- genre
- home location
- contact points
- official social profiles
- relationship to other core routes

This phase should favor explicit, high-confidence entity facts over speculative richness.

## Existing Route Schema Direction

### About

`/about` should be evaluated as an entity-supporting page, not just a content page.

If the current route has no page-specific schema, it may need a small amount of structured data that reinforces:
- band identity
- band origin/location
- band story context

### Listen

`/listen` is a likely place to strengthen music/platform signals if the page can support structured data cleanly.

The goal is not to over-schema every page, but to make music-related route meaning more explicit where it helps the band entity.

### Contact

`/contact` should reinforce that the site represents a real, reachable organization/band identity.

### Community

Community routes may benefit from structured-data support only if it materially strengthens band activity and identity signals. This phase should not broaden into a full article-schema program unless it is clearly justified.

### Shows

Show detail pages should keep their current factual event schema direction:
- accurate
- conservative
- no invented organizer or offer details

The event pages should support the main entity graph, not distort it.

## Route Expansion Decision Rule

A new route may be added only if it meaningfully improves band/entity understanding.

Valid reason to add a route:
- current homepage and `/about` page together still leave a clear entity gap that a focused route would solve better

Invalid reasons:
- “more indexed pages”
- generic local SEO expansion
- thin city/venue pages
- filler content that exists only to host schema

The default assumption should be:
- do not add a new route unless implementation discovery proves it is necessary

## Metadata And Copy Relationship

This phase is not primarily a copywriting project, but some metadata and content refinement may be needed if the current wording weakens entity clarity.

Allowed refinements:
- make homepage identity signals clearer
- improve route titles/descriptions where they materially support entity understanding

Not allowed:
- broad content rewrite
- keyword stuffing

## Success Criteria

This phase is successful when:
- the homepage is a clearly stronger canonical entity page for The Filibusters
- existing routes reinforce the same band/entity understanding more coherently
- event schema remains truthful and useful
- any added route is clearly justified as entity infrastructure rather than SEO filler

## Risks

### Risk: over-structuring weak pages

Adding schema to every route can create noise instead of clarity.

Mitigation:
- add route-level schema only where it creates a clear entity benefit

### Risk: schema richness outruns factual support

Trying to maximize schema fields can push the implementation toward invented or weakly supported facts.

Mitigation:
- prefer high-confidence fields only
- keep event schema conservative

### Risk: unnecessary new route

A new route can create maintenance overhead without adding meaningful entity value.

Mitigation:
- apply the route-expansion decision rule strictly

## Recommended Next Step

Write an implementation plan for a knowledge-signal-first structured-data expansion covering:
- homepage schema strengthening
- existing-route schema review and selective additions
- conditional evaluation of one new entity-supporting route only if clearly justified
