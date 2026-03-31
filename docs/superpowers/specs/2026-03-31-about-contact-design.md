# About + Contact Page Design

Date: 2026-03-31

## Goal

Add two new public pages, `/about` and `/contact`, that extend the Filibusters site beyond the homepage while preserving the current emotional homepage focus.

The new pages should:
- give the band a clear identity page that works for both humans and AI retrieval
- create a dedicated outreach page for booking, press, and general inquiries
- prepare the site for a later `/press` page without forcing press-kit content into the wrong place
- follow the current Astro + Tailwind component and data-driven content patterns already used in the site

## Approved Scope

This slice includes:
- a new `/about` page
- a new `/contact` page
- primary navigation updates to expose `/about` and `/contact`
- new structured content files in `src/data/`
- reuse of existing site shell patterns

This slice does not include:
- a public `/press` page in navigation
- a public `/community` page
- CMS setup
- a new contact form flow
- member-by-member long bios

## Information Architecture

### Homepage

The homepage remains the primary emotional and conversion-focused experience.

It should continue to emphasize:
- music
- shows
- fan reaction
- community signup

The homepage should not become the main factual band explainer page.

### About

`/about` becomes the canonical band-identity page.

Its responsibilities:
- explain who The Filibusters are in plain language
- carry the strongest GEO-friendly factual content
- provide quoteable description of genre, location, themes, and live-show identity
- introduce the band lineup with photos, names, and roles
- give visitors a clear next step to listen, see shows, or contact the band

### Contact

`/contact` becomes the canonical outreach page.

Its responsibilities:
- direct booking, press, and general inquiries to the right contact path
- make email the primary contact method
- reduce ambiguity around how to reach the band
- support future `/press` linking without requiring the press page now

### Press

`/press` is intentionally deferred.

Reasoning:
- it serves a distinct audience from `/community`
- it should eventually hold press-specific assets such as approved photos, logos, quotes, video, and press bios
- those assets are not ready yet
- the page should reuse copy foundations established by `/about` and `/contact` rather than being improvised early

Press should remain separate from `/community` when implemented later.

## UX Direction

The new pages should preserve the current visual language:
- poster-like section framing
- bold typography
- emotionally expressive voice
- high-contrast CTA treatment

They should also become easier to scan than the homepage.

Design principles for this slice:
- lead with clarity before depth
- place factual content early on `/about`
- keep only one primary CTA emphasis per section
- avoid making either page feel corporate or overly optimized
- keep mobile readability and touch sizing aligned with the current site

## About Page Design

### Page Objective

Help a new visitor, venue contact, journalist, or AI system quickly understand:
- what kind of band this is
- where the band is based
- what the band is known for
- who is in the band
- what to do next

### Proposed Section Order

1. Hero
2. What Is The Filibusters?
3. Meet the Band
4. Band Story
5. Similar Artists + Quick Facts
6. FAQ
7. CTA band

### Hero

Purpose:
- establish the page immediately as the band identity page
- balance emotional tone with clearer language than the homepage

Content:
- page eyebrow
- strong headline
- short intro paragraph
- primary CTA to listen
- secondary CTA to contact or see shows

### What Is The Filibusters?

Purpose:
- serve as the main GEO anchor on the site
- provide clear, extractable, quoteable copy

Content expectations:
- one concise defining paragraph
- one supporting paragraph with stronger emotional positioning
- short factual descriptors such as genre, location, themes, and live-show identity

This section should include explicit statements such as:
- The Filibusters are an alt rock band based in Provo, Utah.
- They are known for high-energy live shows.
- Their music centers on connection, identity, and belonging.

The final wording can be refined during implementation, but the section must stay direct and machine-readable.

### Meet the Band

Purpose:
- humanize the page
- introduce lineup without waiting for long-form member bios

Content expectations:
- photo cards using real assets from `src/assets/`
- member name
- member role

Approved first-version lineup:
- Hanna Eyre — vocalist
- Thomas Wintch — guitarist
- Atticus Wintch — bassist
- Curtis Schnitzer — percussionist

This should be a lighter strip or grid, not a full profile section.

### Band Story

Purpose:
- carry the more emotional band narrative after the factual framing is established

Content expectations:
- a fuller story section with more voice than the GEO block
- concise enough to scan on mobile
- aligned with the current site tone rather than sounding like a formal biography

### Similar Artists + Quick Facts

Purpose:
- give visitors and AI systems relational context
- connect the band to known references without overclaiming

Content expectations:
- a compact similar-artists block
- a compact fact block for items like base location, genre, and current focus

This should stay concise and support scannability.

### FAQ

Purpose:
- answer common direct questions in a format that is easy to scan and quote

Expected questions:
- What genre is The Filibusters?
- Where is The Filibusters based?
- What are The Filibusters known for?
- Are The Filibusters playing shows?
- What bands are similar to The Filibusters?

Answers should be short and explicit.

### CTA Band

Purpose:
- keep the page outcome-oriented

Expected actions:
- Listen now
- See shows
- Contact the band

## Contact Page Design

### Page Objective

Make it obvious how to contact the band and what each contact path is for.

### Proposed Section Order

1. Hero
2. Inquiry paths
3. Primary contact block
4. Social fallback / follow links

### Hero

Purpose:
- establish the page as direct and useful
- avoid unnecessary friction

Content:
- short headline
- one sentence explaining the types of inquiries supported

### Inquiry Paths

Purpose:
- reduce ambiguity around who should send what

Expected paths:
- Booking
- Press
- General

Each path should include:
- short label
- one-line explanation
- direct CTA or email reference

### Primary Contact Block

Purpose:
- make email the default contact method for now

Content:
- primary email address
- supporting copy for what to include in outreach
- optional lightweight note about response expectations

This should not require a form in the first version.

### Social Fallback

Purpose:
- provide a lower-friction route for casual outreach
- keep social links secondary to email

This content should not visually compete with the main contact CTA.

## Navigation Changes

Update primary navigation to include:
- About
- Contact

Current homepage anchor links can remain, but the navigation should begin transitioning from homepage-only anchors toward a fuller site structure.

The `/press` page should not be added to primary navigation yet.

## Content Model

### `src/data/about.ts`

Should hold:
- hero copy
- definition / GEO copy
- quick facts
- member list
- story copy
- similar artists
- FAQ entries
- CTA labels and links

### `src/data/contact.ts`

Should hold:
- hero copy
- inquiry path definitions
- primary email content
- optional supporting contact notes

### Assets

Member photos should live in `src/assets/images/` and be used through `astro:assets`.

No placeholders should ship if a real image is missing. If any member asset is not ready at implementation time, the page should degrade gracefully rather than inventing fake imagery.

## Component Strategy

Follow existing Astro patterns first.

Recommended implementation shape:
- create `src/pages/about.astro`
- create `src/pages/contact.astro`
- add focused page sections as components only where reuse or readability justifies them

Do not over-componentize prematurely. If a page can remain clear in one route file with small extracted sections, prefer that.

## Copy Strategy

The site voice should remain recognizably Filibusters:
- emotionally grounded
- direct
- unpretentious
- not corporate

At the same time, `/about` should be more explicit and quoteable than the homepage.

The key tradeoff is:
- homepage = emotional first
- about = clarity first, personality second

## Accessibility and Responsive Requirements

Must preserve:
- heading hierarchy
- meaningful alt text on member images
- clear focus states
- mobile-safe spacing
- no horizontal scroll at approximately 375px width

For the member grid:
- image crops must remain intentional on mobile
- names and roles must remain readable without truncation where possible

## Relationship to Future Work

This slice should prepare the next pages rather than compete with them.

Specifically:
- `/about` should become the source foundation for future press bio language
- `/contact` should be link-ready for a later `/press` page and future inquiry refinements
- `/community` remains the later fan-facing update hub from the roadmap

## Out of Scope Decisions

The following are intentionally deferred:
- whether contact emails will split into multiple addresses later
- whether `/press` will include downloadable zip assets or individual downloads
- whether `/contact` gets a form after email-first launch
- whether member bios expand beyond names/roles in a future iteration

## Implementation Notes

- keep content and config in `src/data/` rather than hardcoding copy in components
- preserve existing visual language rather than redesigning the whole site
- use the current layout shell and metadata patterns
- verify with `npm run build`
- for visual changes, check responsive behavior around 375px width

