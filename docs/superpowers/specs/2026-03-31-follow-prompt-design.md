# Follow Prompt Design

Date: 2026-03-31
Status: Approved for planning

## Goal

Add a homepage popup that routes visitors into a dedicated `/listen` conversion page without feeling spammy.

## User Experience

- Show a centered split-panel modal on the homepage only.
- Delay appearance by about 3 seconds after page load.
- Keep the prompt dismissible with a clear close button.
- Allow dismissal by clicking the backdrop or pressing `Escape`.
- Send visitors into a dedicated in-site route instead of directly to platform pages.
- Use the site's existing bold visual language and band voice.
- Keep the layout clean on desktop and mobile, especially around `375px`.
- Use a more editorial composition inspired by the provided reference:
  - one visual panel with a band image
  - one content panel with headline, short copy, and two route-launching actions

## Display Rules

- Show the prompt once per visitor within a fixed 14-day cooldown window.
- Store cooldown state in `localStorage`.
- Use a single timestamp key such as `filibusters-follow-prompt-until`.
- If the stored expiry is still in the future, do not open the modal.
- If there is no valid stored expiry, wait for the delay, then open the modal once.
- When the visitor dismisses the prompt or clicks either CTA, write a new expiry 14 days in the future.

## Architecture

- Create a homepage-only component at `src/components/home/FollowPrompt.astro`.
- Render it near the end of `src/pages/index.astro` so it only loads on the homepage.
- Create a standalone route at `src/pages/listen.astro`.
- Keep popup copy, CTA URLs, and the `/listen` page platform data in canonical site data rather than duplicating them inside components.
- Read all route and platform URLs from `src/data/site.ts`.
- Use an existing or repo-local band image asset for the visual side of the modal, preferably from `src/assets/`.
- Use a small client-side script inside the component to manage:
  - delay timing
  - open and close state
  - cooldown persistence
  - keyboard dismissal

## Funnel Structure

- Popup:
  - primary CTA: `LISTEN NOW`
  - secondary CTA: `FOLLOW THE BAND`
  - primary CTA links to `/listen`
  - secondary CTA links to `/listen#follow`
- `/listen` page:
  - top section is the listening funnel
  - lower section with `id="follow"` is the follow funnel
  - the page becomes the canonical destination for music and follow actions

## Accessibility

- Use dialog semantics with `role="dialog"` and `aria-modal="true"`.
- Include a clear heading and descriptive supporting copy.
- Ensure the close button is keyboard reachable and labeled.
- Support `Escape` to dismiss.
- Avoid horizontal scroll and clipped content on small screens.
- Restore focus cleanly if focus management is introduced.

## Content Direction

- Headline and body copy should sound direct, band-forward, and slightly playful.
- Keep the copy short.
- The visual treatment should feel more like a promo card than a utility popup.
- The layout should prioritize atmosphere without hiding the CTA choices.
- Present one clear primary CTA and one quieter secondary CTA:
  - `LISTEN NOW`
  - `FOLLOW THE BAND`

## Listen Route Content

- Top section:
  - lead with listening intent
  - include short supporting copy
  - include platform actions for Spotify, Apple Music, and YouTube
- Follow section:
  - anchor with `id="follow"`
  - include short follow-oriented copy
  - include platform actions for TikTok, Instagram, and YouTube
- The route should feel like a purpose-built band conversion page, not a generic link list.

## Layout Direction

- Desktop:
  - use a two-column modal
  - left side carries the image
  - right side carries the copy and CTA buttons
- Mobile:
  - stack vertically or collapse to a single-column card
  - keep the image visible but secondary to the CTA buttons
  - avoid a tall layout that pushes the close control off screen
- Styling:
  - avoid a generic app-style dialog
  - lean into typography, contrast, and a poster-like composition
  - keep the close button visually quiet but obvious

## Non-Goals

- No multi-step signup flow.
- No email capture in this prompt.
- No sitewide popup outside the homepage.
- No repeated prompting inside the 14-day cooldown period.
- No platform picker row inside the popup itself.

## Verification

- Run `npm run build`.
- Run `npm run dev` for a manual visual check.
- Verify on desktop and around `375px` width.
- Confirm:
  - the modal appears after the intended delay
  - dismiss works from close button, backdrop, and `Escape`
  - popup CTA links go to `/listen` and `/listen#follow`
  - `/listen` renders the correct listening and follow sections
  - platform links on `/listen` go to the correct destinations
  - the cooldown prevents the prompt from reappearing for 14 days

## Open Decisions Resolved

- Trigger: delayed page load
- Cooldown: 14 days
- Popup actions: `/listen` and `/listen#follow`
- Route structure: one combined page with top = listen and bottom = follow
- Dismissibility: required
