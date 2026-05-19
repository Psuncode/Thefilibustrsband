---
name: show-update
description: Use when adding, editing, correcting, or retiring show listings for The Filibusters website, especially when event facts must be gathered from source pages, links in show descriptions must stay clickable, or old shows should be archived after about 2 months.
---

# Show Update

## Overview

Use this skill for show-list maintenance in this repo.

The current fallback source of truth is [src/data/shows.ts](/Users/philipsun/Documents/Filibuster%20website/src/data/shows.ts). Show detail pages auto-link plain `http` and `https` URLs in `body` paragraphs via [src/pages/shows/[slug].astro](/Users/philipsun/Documents/Filibuster%20website/src/pages/shows/%5Bslug%5D.astro), so full URLs written into show copy become clickable automatically.

## When To Use

Use this skill when you need to:
- add a newly announced show
- update show timing, venue, ticket link, lineup, or image
- attach a show flyer or event image
- ensure event-source links remain clickable on the show detail page
- remove or archive stale shows that are more than about 60 days old

Do not use this skill for community posts or press updates.

## Workflow

1. Gather facts from the primary event source.
   Required fields:
   - event title
   - date
   - start time
   - venue
   - city/state
   - public event or ticket URL
   Optional fields:
   - flyer/event image
   - headliner/support acts
   - event description language worth paraphrasing

2. Update [src/data/shows.ts](/Users/philipsun/Documents/Filibuster%20website/src/data/shows.ts).
   For each new show entry include:
   - `title`
   - `slug`
   - `status`
   - `startsAt` in ISO format with Utah offset when appropriate
   - `venue`
   - `city`
   - `state`
   - `ticketUrl`
   - `summary`
   - `body`
   - `lineup`
   - `notes`
   Add `flyerUrl` when an image is available.

3. Keep links clickable.
   Rules:
   - If you want a link inside show description copy, include the full URL in the `body` paragraph text.
   - Prefer `https://...` links, never bare domains.
   - Put the most important external action in `ticketUrl`.
   - Use the event homepage or festival homepage when the user wants “learn more”, and ticket checkout when the user wants “tickets”.

4. Attach images correctly.
   Rules:
   - Prefer putting new show images in `src/assets/images/`.
   - Import the image at the top of [src/data/shows.ts](/Users/philipsun/Documents/Filibuster%20website/src/data/shows.ts) and set `flyerUrl: importedImage.src`.
   - Reuse an existing image only if it is truly the correct event image.

5. Archive old shows.
   Rules:
   - If a show `startsAt` is more than 60 days before the current date, it should not stay in `upcomingShows`.
   - Move expired entries into an `archivedShows` export in [src/data/shows.ts](/Users/philipsun/Documents/Filibuster%20website/src/data/shows.ts) if one exists.
   - If no `archivedShows` export exists yet and archiving is needed, create it below `upcomingShows` using the same object shape.
   - Do not delete historical data unless explicitly asked.

6. Verify.
   Always run:
   ```bash
   npm run build
   ```
   Confirm:
   - `/shows`
   - `/shows/[slug]`
   - the new image is included
   - any URL in `body` text becomes clickable on the detail page

## Data Pattern

Use this object shape:

```ts
{
  title: "Utah Arts Festival 2026",
  slug: "utah-arts-festival-2026",
  status: "announced",
  startsAt: "2026-06-20T21:30:00-06:00",
  venue: "Festival Stage",
  city: "Salt Lake City",
  state: "Utah",
  ticketUrl: "https://www.uaf.org/tix",
  flyerUrl: festivalImage.src,
  summary: "Short listing summary.",
  body: [
    "Primary event details.",
    "For full festival details, learn more at https://www.uaf.org/."
  ],
  lineup: ["The Filibusters", "Shakey Graves"],
  notes: "Anything users should verify with the venue or organizer."
}
```

## Writing Rules

- Keep `summary` short and scannable for cards.
- Keep `body` useful, not repetitive.
- Prefer factual phrasing over hype unless it reflects the source.
- Mention headliners or festival framing only when it helps orient the user.
- Use exact dates in source-derived copy when needed for clarity.

## Common Mistakes

- Adding a show without `ticketUrl` even though an official event page exists
- Putting bare domains like `www.uaf.org` into body copy instead of full `https://` URLs
- Leaving old shows in `upcomingShows`
- Importing images from `public/` or unrelated asset folders instead of `src/assets/`
- Guessing city/state or venue naming when the event source is available

