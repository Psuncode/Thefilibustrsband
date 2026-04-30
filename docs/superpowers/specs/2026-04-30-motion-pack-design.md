# The Filibusters Motion Pack Design

## Goal

Prepare a reusable site-wide motion foundation for The Filibusters Astro website that can be applied incrementally across pages and components.

This is not a homepage redesign and not a full animation pass. It is a foundational layer that gives the site a consistent motion language and a clean opt-in system for future implementation.

The motion direction should feel:

- energetic
- concert-like
- sharp rather than floaty
- expressive without harming clarity or performance

## Scope

This work defines the reusable motion pack only.

In scope:

- shared motion tokens in global styles
- reusable motion utility classes
- reusable data-attribute conventions for choreography
- a lightweight reveal-on-enter script using native browser APIs
- reduced-motion handling
- a short usage note for future component authors

Primary implementation targets:

- `src/styles/global.css`
- `src/lib/` for a small client-side motion helper
- shared layout wiring only if needed to initialize the helper globally
- lightweight documentation in the repo for usage conventions

Out of scope:

- redesigning homepage sections
- adding bespoke animation to every component
- introducing a large animation dependency
- scroll hijacking or smooth-scroll libraries
- 3D, canvas, or WebGL effects
- parallax-heavy hero behavior
- replacing existing content, layout, or visual hierarchy

## Product Intent

The website already has a bold poster-like visual identity. The motion system should extend that identity so the site feels more like a live set poster coming to life, not like a generic SaaS site with decorative fades.

The foundation should make future motion decisions easier by giving the repo:

- one shared vocabulary for timing and easing
- one shared reveal system
- one shared reduced-motion policy
- one shared pattern for hover, press, and stagger behavior

## Motion Direction

### Overall Character

The motion language should feel like stage energy:

- quick starts
- confident ease-out finishes
- short travel distances
- layered entrances
- tactile hover and press feedback

It should avoid motion that feels dreamy, soft, or overly cinematic.

### Core Principles

1. Motion supports hierarchy, not decoration.
2. Motion should emphasize rhythm between sections and actions.
3. Motion should stay readable on a marketing site with real conversion goals.
4. The system must degrade gracefully when motion is reduced or unsupported.

## Architecture Approach

Use a hybrid native motion pack.

That means:

- CSS for tokens, utilities, keyframes, and interaction states
- a small JavaScript helper for viewport-triggered reveals
- no heavyweight animation library in this phase

This approach fits the current Astro/Tailwind stack because the site is primarily static, component-driven, and already relies on global CSS plus targeted progressive enhancement.

## Motion Pack Contents

### 1. Motion Tokens

Add shared CSS custom properties for:

- duration tiers
- delay tiers
- easing curves
- reveal travel distance
- hover lift amount
- press compression amount
- glow/shadow emphasis where needed for interactive elements

These tokens should be named semantically enough to reuse across components without forcing each section to invent its own timing.

Recommended behavior:

- fast durations for hover and press
- medium durations for reveal entrances
- strong ease-out curves for most visible movement
- restrained travel distances so the site feels punchy, not floaty

### 2. Utility Classes

Provide reusable classes for common motion needs:

- fade and lift reveal base state
- directional reveal variants
- stagger container support
- stagger item support
- hover lift treatment
- press/tap feedback
- glow or emphasis states for key calls to action

These should be additive utilities, not component-specific classes tied to one section.

### 3. Data-Attribute Conventions

Use data attributes to make motion behavior declarative in Astro templates.

Expected patterns:

- `data-motion="reveal"` for standard reveal behavior
- directional variants such as upward or lateral reveal
- `data-motion-group` for stagger parents
- `data-motion-item` for stagger children
- optional delay or intensity modifiers where justified

The convention should be simple enough that a future section can opt in without needing bespoke script changes.

### 4. Reveal-On-Enter Helper

Create a small client-side helper using `IntersectionObserver`.

Responsibilities:

- detect motion-marked elements as they enter the viewport
- add a ready/active class or data state to trigger CSS transitions
- support one-time reveal behavior by default
- support stagger activation for grouped children
- avoid heavy scroll listeners

The helper should be initialized once at the layout level if global setup is required.

### 5. Reduced-Motion Policy

All motion features must respect `prefers-reduced-motion`.

Requirements:

- disable non-essential transforms and long transitions
- reveal content immediately or nearly immediately
- keep hover and press states readable without requiring animation
- preserve usability and hierarchy even when movement is removed

Reduced motion is not a degraded experience. It is the fully supported accessibility mode for the system.

### 6. Usage Guidance

Document how component authors should use the motion pack.

The note should cover:

- when to use reveal motion
- when not to animate
- how to mark a stagger group
- how hover and press utilities should be applied
- how to keep motion restrained on dense content pages

This avoids the system becoming inconsistent after the initial implementation.

## Performance Rules

The motion pack must follow strict performance constraints.

Allowed emphasis should prefer:

- `transform`
- `opacity`
- carefully limited `filter` when useful

Avoid:

- animating layout properties such as width, height, top, left, margin
- continuous scroll handlers
- broad `will-change` usage across many elements
- long-running decorative loops outside existing intentional marquees

The pack should feel fast because it is technically restrained, not because it pushes more effects.

## Initial Behavioral Spec

### Section Reveals

Default reveal behavior should:

- begin slightly offset and transparent
- resolve quickly into place
- trigger once as content enters view
- feel snappy and confident

The reveal should support individual sections and smaller content blocks.

### Stagger Rhythm

Grouped items should:

- reveal in short intervals
- feel sequenced rather than delayed for too long
- avoid excessive cascade effects that slow down content scanning

The stagger is there to create rhythm, not to force the user to wait.

### Hover States

Interactive surfaces may use:

- slight lift
- slight scale emphasis when appropriate
- shadow or glow reinforcement for key actions

Hover behavior should feel tactile and stage-lit, not bouncy or toy-like.

### Press States

Buttons and interactive cards should support a subtle compressed state so interaction feels physical and responsive.

## Visual Tone Guardrails

The motion foundation should reinforce the band identity already present in the site.

It should feel compatible with:

- the poster framing
- the pink and yellow accents
- the black-and-paper contrast
- the bold uppercase type direction

It should avoid:

- luxury-brand floatiness
- overly soft easing
- trendy ambient drift effects
- generic fade-only motion with no personality

## Rollout Strategy

This phase prepares the reusable foundation only.

Future implementation passes can opt components into the system selectively, starting with:

1. homepage hero and key homepage sections
2. shared navigation and footer interactions
3. interior page section reveals where appropriate

The motion pack should be valuable even before all components adopt it.

## Verification Expectations

When implemented, verification should include:

- `npm run build`
- a browser check in `npm run dev`
- reduced-motion verification
- mobile-width review around `375px`
- confirmation that no horizontal scroll or layout shift is introduced

## Success Criteria

The motion pack is successful if:

1. the repo has a reusable motion vocabulary rather than ad hoc animation rules
2. future components can opt into motion with simple classes or data attributes
3. the default motion tone feels energetic and concert-like
4. reduced-motion users get a clean, fully usable experience
5. the system adds minimal runtime complexity and no unnecessary dependency weight
