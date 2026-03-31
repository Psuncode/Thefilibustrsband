# Contact GEO Refinement Design

Date: 2026-03-31

## Goal

Refine the contact experience and sitewide entity clarity without expanding into a full contact-form build.

This slice should:
- add a compact GEO-oriented band identity line to the shared footer
- strengthen geographic and booking context on `/contact`
- improve `/contact` metadata and structured data alignment
- fix the oversized mobile hero heading behavior on `/contact`
- reduce redundant contact-page sections while preserving the current visual language

## Approved Scope

This slice includes:
- shared footer GEO copy
- `/contact` copy refinements
- `/contact` metadata refinements
- `MusicGroup` schema refinements for locality and contact points
- `/contact` layout adjustment to remove or repurpose the redundant primary-contact section
- mobile heading sizing improvement on `/contact`

This slice does not include:
- a full contact form
- backend submission handling
- footer redesign
- About page rewrite beyond what is already done
- press page implementation

## Product Decisions

### GEO In Footer

Add a short factual sentence to the shared footer so every page reinforces the band’s entity identity.

Recommended copy direction:
- concise
- factual
- location-bearing
- not promotional

Example shape:
- The Filibusters are an alt rock band based in Provo, Utah.

This line should support GEO/SEO across the site, but it should not be the only place location appears.

### Contact Page GEO Strategy

`/contact` should carry direct location context because it serves bookers, press, and collaborators.

The page should mention:
- Provo, Utah
- booking or performance availability context

This should appear in:
- hero description or adjacent supporting copy
- at least one inquiry path
- metadata / structured data

### Contact Form

Do not add a form in this slice.

Reasoning:
- that is a separate product decision with workflow, spam, and delivery implications
- the current task is better treated as a copy/structure/metadata refinement pass

`mailto:` remains acceptable for now, but the UI should make that behavior clearer.

## Contact Page Design Changes

### Hero

Keep the existing section structure but refine the content to include geography and booking relevance.

Requirements:
- use a responsive heading size that avoids awkward wrapping on mobile
- include city/state context in the supporting copy
- keep the tone direct and band-appropriate

### Inquiry Paths

Keep the three-card model:
- Booking
- Press
- General

Refine at least one card to include regional context.

Example direction:
- For shows, events, and live performance requests in Provo, across Utah, and beyond.

The CTA language should still communicate that it opens email.

### Primary Contact Section

The current dark section is too close in function to the General inquiry card.

This section should be repurposed, not simply repeated.

Recommended role:
- response expectations
- what to include in outreach
- fallback path if the user is unsure where to send the message

It should add distinct value beyond repeating the email address.

### Social Section

Keep it for now, but reduce its emphasis so it reads as secondary to contact intent.

This section should remain visually lighter than the primary contact path.

## Metadata And Schema

### Meta Description

The `/contact` page description should be updated to include:
- band name
- inquiry purpose
- location

Target shape:
- Contact The Filibusters for bookings, press, and general inquiries. Based in Provo, Utah.

### Structured Data

Keep using the shared `MusicGroup` schema in `BaseLayout`, but strengthen it with:
- `addressLocality`
- `addressRegion`
- `contactPoint` entries for booking, press, and general

If the shared layout remains the schema source, this should be done there rather than creating page-only duplicate schema unless a page-specific override becomes necessary.

## Footer Design Changes

Add a compact factual GEO line to the shared footer.

Requirements:
- visually secondary to primary footer content
- readable on mobile
- consistent with the site voice
- not styled like a CTA

This should be implemented in the shared footer component so it appears sitewide.

## Implementation Notes

- keep content/config in `src/data/` where possible
- preserve the current visual language
- avoid introducing unnecessary new component layers
- verify with `npm run build`
- manually inspect `/contact` at approximately `375px` width after implementation

