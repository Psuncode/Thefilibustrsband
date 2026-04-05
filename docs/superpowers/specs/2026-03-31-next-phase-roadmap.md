# Next-Phase Roadmap

Date: 2026-03-31

## Goal

Define the next product slices for the Filibusters website after the current homepage refinement work.

## Decisions

### CMS

Use `Sanity` as the editable CMS.

Reasoning:
- Shows need frequent updates and should not stay hardcoded in repo data.
- Community content will benefit from the same editor workflow.
- Sanity supports structured content plus a Notion-like editing experience well enough for this project.

### Shows

Build a dedicated `/shows` page as a clean event table.

Build `/shows/[slug]` poster-style pages for every show by default.

Planned show content model:
- title
- slug
- date/time
- venue
- city/state
- ticket link
- status
- short summary
- full body content
- hero image or flyer
- optional lineup / notes

### Community

Build `/community` as a mixed hub, not a formal newsroom.

Content should include:
- news
- announcements
- behind-the-scenes updates
- release updates
- show-related posts

This should feel like a living band journal rather than a corporate blog.

### Email List

Keep signup simple at first: email only.

Do not ask for interests/tags on the form yet.

Planned behavior:
- one email field
- one main audience/list
- welcome email later
- segmentation can wait until the audience is larger

### Email Platform

Start with `Kit`.

Reasoning:
- lowest-friction option for this use case
- official pricing shows a free Newsletter plan up to 10,000 subscribers
- simpler fit than a heavier marketing tool for a band site

Notes:
- Mailchimp free is more limited on contact count and sends
- beehiiv is more optimized for publisher/newsletter growth than this project needs today

### Streaming Popup

Add a popup that prompts visitors to follow on Spotify or Apple Music.

Guidelines:
- show once per visitor for a limited period
- trigger after a short delay or scroll threshold, not instantly
- include dismiss action
- use two clear CTAs:
  - Follow on Spotify
  - Follow on Apple Music

### Merch

Treat merch as a later-phase feature after CMS, shows, community, and email flow are stable.

## Deferred SEO Growth Ideas

These ideas came out of the 2026-04-04 SEO foundation brainstorming pass and are intentionally deferred so the current work can stay focused on improving SEO within the existing page set.

Potential next-phase SEO expansions:
- publish search-targeted community or editorial content around releases, live shows, and participation in the local Utah music scene
- create venue-focused or city-focused evergreen pages only if search demand and available content justify them
- extend structured data coverage beyond show pages to applicable community content
- do a dedicated Core Web Vitals and image delivery pass if performance becomes a measurable search or usability constraint

## Recommended Build Order

1. Set up `Sanity`
2. Build `/shows`
3. Build `/shows/[slug]`
4. Build `/community`
5. Replace homepage signup fallback with real email-only signup using `Kit`
6. Add Spotify / Apple Music popup
7. Explore merch

## Implementation Notes

- Astro should pull published CMS content at build time.
- The current homepage can continue to exist while the new content system is introduced incrementally.
- Shows and community should share a coherent content architecture from the start to avoid a second migration later.

## References

- Kit pricing: https://kit.com/pricing
- Mailchimp pricing: https://mailchimp.com/pricing/
- beehiiv pricing: https://www.beehiiv.com/pricing
