# Follow Prompt Design

Date: 2026-03-31
Status: Approved for planning

## Goal

Add a homepage popup that asks visitors to follow the band on Spotify or Apple Music without feeling spammy.

## User Experience

- Show a small centered modal on the homepage only.
- Delay appearance by about 3 seconds after page load.
- Keep the prompt dismissible with a clear close button.
- Allow dismissal by clicking the backdrop or pressing `Escape`.
- Send visitors directly to the band's Spotify or Apple Music artist pages.
- Use the site's existing bold visual language and band voice.
- Keep the layout clean on desktop and mobile, especially around `375px`.

## Display Rules

- Show the prompt once per visitor within a fixed 14-day cooldown window.
- Store cooldown state in `localStorage`.
- Use a single timestamp key such as `filibusters-follow-prompt-until`.
- If the stored expiry is still in the future, do not open the modal.
- If there is no valid stored expiry, wait for the delay, then open the modal once.
- When the visitor dismisses the prompt or clicks either outbound CTA, write a new expiry 14 days in the future.

## Architecture

- Create a homepage-only component at `src/components/home/FollowPrompt.astro`.
- Render it near the end of `src/pages/index.astro` so it only loads on the homepage.
- Keep prompt copy and outbound URLs in canonical site data rather than duplicating them inside the component.
- Read Spotify and Apple Music links from `src/data/site.ts`.
- Use a small client-side script inside the component to manage:
  - delay timing
  - open and close state
  - cooldown persistence
  - keyboard dismissal

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
- Present two equal-priority CTA buttons:
  - `Follow on Spotify`
  - `Follow on Apple Music`

## Non-Goals

- No multi-step signup flow.
- No email capture in this prompt.
- No sitewide popup outside the homepage.
- No repeated prompting inside the 14-day cooldown period.

## Verification

- Run `npm run build`.
- Run `npm run dev` for a manual visual check.
- Verify on desktop and around `375px` width.
- Confirm:
  - the modal appears after the intended delay
  - dismiss works from close button, backdrop, and `Escape`
  - outbound links go to the correct Spotify and Apple Music pages
  - the cooldown prevents the prompt from reappearing for 14 days

## Open Decisions Resolved

- Trigger: delayed page load
- Cooldown: 14 days
- Actions: Spotify and Apple Music only
- Dismissibility: required
