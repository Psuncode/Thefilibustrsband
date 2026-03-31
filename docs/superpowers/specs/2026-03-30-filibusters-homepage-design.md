# The Filibusters Homepage Refinement Design

## Goal

Refine the existing homepage so it feels cleaner, more branded, and more intentional without changing the overall site structure or tone.

This is not a redesign. It is a polish pass on the current one-page homepage with four specific priorities:

1. Restore a horizontal hero emphasis instead of a tall, shouty stacked headline
2. Replace generic branding treatments with official logo usage
3. Improve navigation by introducing a bottom-fixed mobile action bar
4. Replace placeholder-style release artwork with the real album cover

## Scope

This refinement applies to the current homepage only.

In scope:

- `Header.astro`
- `HeroSection.astro`
- `LatestReleaseSection.astro`
- homepage supporting sections where spacing, card treatment, or hierarchy need adjustment
- shared global styles and tokens needed to support the refinement
- homepage data updates needed to support icons, labels, or asset references

Out of scope:

- adding new pages
- changing the core section order
- rewriting all homepage copy
- adding large new interactions or motion systems
- broad rebranding beyond using the approved logo assets already available in the repo

## Product Intent

The homepage should still feel like The Filibusters:

- loud but not messy
- youthful but not juvenile
- playful but still trustworthy enough to click, stream, and sign up

The page currently has the right content priorities, but too many areas feel like default marketing blocks. The refinement should make the page read more like a band poster translated to the web: clean framing, sharper hierarchy, stronger brand cues, and fewer generic boxes.

## Visual Direction

### Overall Direction

Use a "poster-cleanup" direction rather than a full editorial redesign.

That means:

- preserve the current black, white, pink, and yellow palette
- preserve the candid hero photography
- keep the current section order and conversion flow
- increase compositional clarity and brand presence

The page should feel more deliberate through spacing, type layout, panel framing, and brand asset usage rather than through novelty effects.

### What To Avoid

Avoid these failure modes:

- hero copy stacked so narrowly that it feels cramped or unbalanced
- plain text branding when official logo art is available
- top navigation competing with the brand lockup
- repeated identical white cards that flatten the page rhythm
- icon usage that feels generic, mismatched, or decorative without function

## Brand Assets

### Header / Home Button

Use the official text logo image supplied by the user as the homepage button in the header.

Requirements:

- export or optimize the logo into `public/images/` as a shipped homepage asset
- use it as the clickable home link instead of the plain text "The Filibusters"
- size it for quick recognition without overpowering the rest of the header
- preserve legibility on small screens

The header should treat the logo as the main brand anchor, not as a decorative extra.

### Supporting Stamp

Reuse the logo or a cropped/stamped treatment as a secondary brand accent in the hero area.

Requirements:

- the stamp should feel layered into the composition
- it should support the hero rather than replace the main headline
- it should not create clutter or compete with the primary CTA

This supports the user's request to involve the logo while keeping it as a supporting brand mark rather than the hero centerpiece.

### Release Artwork

Replace the current release artwork with the real album cover provided by the user.

Requirements:

- use the actual single artwork for the featured release section
- ensure the image is optimized and stored in `public/images/`
- treat the cover as an intentional framed visual element rather than a bare square image

## Layout And Navigation

### Header

The desktop and mobile header should become lighter and more brand-led.

Requirements:

- the header should prioritize the logo home button
- remove the current text-link style brand treatment
- reduce header noise so it does not fight the hero
- keep the header readable on top of a light layout

### Bottom Navigation

Introduce a fixed bottom navigation for mobile.

Requirements:

- use consistent SVG social/action icons instead of word labels where the user requested them
- provide accessible labels for screen readers
- include clear tap states and focus states
- ensure page content does not get hidden behind the fixed bar

The bottom nav should feel like a compact action dock. It should improve usability on phones and give the site more personality.

On larger screens, navigation can remain more conventional if that produces a cleaner layout. The design does not require a fixed bottom nav on desktop.

## Section-by-Section Design

### 1. Hero

The hero is the main priority of this refinement.

Requirements:

- make the headline read horizontally rather than as a tall vertical shout
- widen the text block and control line length so the message feels punchy but balanced
- preserve strong CTA visibility
- frame the image so it feels like a poster panel
- integrate the supporting logo stamp into the hero composition

The hero should still feel bold, but the emphasis should come from composition and contrast rather than from oversized stacked text alone.

### 2. Latest Release

The latest release section should feel more authentic and more commercially clear.

Requirements:

- swap in the real cover art
- improve the framing of the artwork
- tighten the relationship between artwork, title, description, and streaming links
- make platform links feel like recognizable music actions, not generic rectangular buttons

This section should read as the featured music block, not just another content panel.

### 3. Why Stick Around

This section should keep its purpose but reduce the sameness of the current card layout.

Requirements:

- keep the concise reasons format
- improve spacing and visual hierarchy
- vary the treatment enough that it does not look like a repeated grid copied from another section

### 4. Shows

The shows section should feel more event-oriented and easier to scan.

Requirements:

- keep date, venue, city, and CTA visible at a glance
- make each row feel more like a live-show ticket or event listing
- preserve a clear fallback state when there are no shows

### 5. Personality / Band Life

This section should carry the band's personality without turning into clutter.

Requirements:

- maintain concise copy blocks
- improve contrast and spacing
- reduce the feeling of repeated generic bordered boxes

### 6. Community Signup

This section should remain simple, but it should feel more like a deliberate callout.

Requirements:

- preserve the existing conversion goal
- improve layout rhythm and trust cues
- make the form or fallback state feel branded rather than default

## Typography And Styling

The refinement should preserve the current high-contrast identity while improving polish.

Requirements:

- keep strong uppercase display usage where it helps rhythm
- improve text block widths and spacing for readability
- avoid introducing trendy effects that are inconsistent with the current site
- keep focus states visible and accessible

If a font change is necessary, it should support a more music-forward feel without forcing a rebrand. A font change is optional, not required.

## Accessibility And Interaction

The refinement must maintain or improve usability.

Requirements:

- all icon-only actions need screen-reader labels
- fixed bottom navigation must not block content or keyboard navigation
- focus states must remain visible
- hover states must not shift layout
- mobile layouts around 375px must avoid horizontal scroll

## Success Criteria

The refinement is successful if:

- the hero feels wider, calmer, and more intentional
- official branding is visible through the real text logo
- mobile navigation feels cleaner and more usable
- the release section uses the real album cover and feels more authentic
- the rest of the page no longer feels like a stack of similar default cards

## Implementation Notes

Keep the implementation surgical.

Preferred approach:

- update existing Astro components rather than replacing the homepage architecture
- move only the assets that are actually shipped into `public/images/`
- keep copy changes minimal unless needed to support layout
- verify with `npm run build`
- manually inspect mobile layout behavior, especially with the fixed bottom navigation
