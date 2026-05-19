# SEO Foundation Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve page-level SEO for the existing Filibusters site by moving event rich-result schema onto show pages, enriching show metadata, and tightening organic-search relevance on the homepage and shows routes.

**Architecture:** Keep site-wide SEO concerns in `BaseLayout.astro`, but extend the layout API so routes can pass page-specific Open Graph and JSON-LD data. Normalize richer show fields in the shared show data layer, then render complete `Event` schema and better metadata from `src/pages/shows/[slug].astro` while refreshing copy on the homepage and show index.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, Astro static build, Sanity-backed show data fallback

---

## File Structure

### Existing files to modify

- `src/layouts/BaseLayout.astro`
  Responsibility: shared metadata tags, canonical URL, default Open Graph values, site-level structured data, route override API.
- `src/lib/shows/types.ts`
  Responsibility: canonical `ShowEntry` type shared by fallback and Sanity show data.
- `src/lib/shows/queries.ts`
  Responsibility: Sanity query shape and `mapShowEntry()` normalization.
- `src/lib/shows/data.ts`
  Responsibility: normalize fallback show objects into the canonical `ShowEntry` shape.
- `src/data/shows.ts`
  Responsibility: fallback show content and SEO-rich event data for current static shows.
- `src/pages/shows/[slug].astro`
  Responsibility: page-level event metadata, event JSON-LD, show detail rendering, event-specific OG image.
- `src/pages/shows/index.astro`
  Responsibility: shows index metadata and intro copy.
- `src/pages/index.astro`
  Responsibility: homepage title/description wiring.
- `src/data/homepage.ts`
  Responsibility: homepage search-relevant supporting copy.

### Optional existing files to modify if needed during implementation

- `src/data/about.ts`
  Responsibility: about copy or CTA phrasing if one more internal-linking cue is needed.

### No new runtime modules required

Keep the implementation inside the existing Astro files unless a small helper becomes necessary during implementation. Do not add a testing framework in this slice.

## Task 1: Extend Shared SEO Layout API

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add route-level SEO props to `BaseLayout.astro`**

Add an explicit prop contract so routes can override Open Graph defaults and append page-specific structured data.

```astro
---
import Analytics from "@vercel/analytics/astro";
import SubscribeModal from "../components/site/SubscribeModal.astro";
import heroBand from "../assets/images/hero-band.jpg";
import { buildMusicGroupSchema, siteMeta } from "../data/site";
import "../styles/global.css";

type StructuredDataValue = Record<string, unknown>;

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: "website" | "article" | "event";
  structuredData?: StructuredDataValue | StructuredDataValue[];
}

const {
  title,
  description,
  ogImage,
  ogType = "website",
  structuredData = []
} = Astro.props;
```

- [ ] **Step 2: Remove show-event schema generation from the shared layout**

Delete the current `getUpcomingShows()` import and the `Event` entries in the layout-level schema graph. Keep only `WebSite` and `MusicGroup` in the base graph.

```astro
const pageUrl = new URL(Astro.url.pathname, Astro.site);
const defaultOgImage = new URL(heroBand.src, Astro.site);
const resolvedOgImage = ogImage ? new URL(ogImage, Astro.site).href : defaultOgImage.href;
const musicGroupStructuredData = buildMusicGroupSchema({ image: resolvedOgImage });
const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteMeta.title,
  url: siteMeta.url,
  description: siteMeta.description
};

const pageStructuredData = Array.isArray(structuredData) ? structuredData : [structuredData];
const structuredDataGraph = [websiteStructuredData, musicGroupStructuredData, ...pageStructuredData];
```

- [ ] **Step 3: Wire metadata tags to use the new overrides**

Update the OG tags and structured-data script to use `resolvedOgImage`, `ogType`, and `structuredDataGraph`.

```astro
<meta property="og:type" content={ogType} />
<meta property="og:url" content={pageUrl.href} />
<meta property="og:image" content={resolvedOgImage} />
<meta property="og:image:alt" content={`${siteMeta.title} band photo`} />
<meta name="twitter:image" content={resolvedOgImage} />
<script
  type="application/ld+json"
  set:html={JSON.stringify({ "@context": "https://schema.org", "@graph": structuredDataGraph })}
></script>
```

- [ ] **Step 4: Run the production build to verify the layout API change**

Run: `npm run build`

Expected:
- Astro build completes successfully
- no TypeScript prop errors in `BaseLayout.astro`

- [ ] **Step 5: Commit the shared SEO layout refactor**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add page-level seo layout overrides"
```

## Task 2: Enrich Canonical Show Data For SEO

**Files:**
- Modify: `src/lib/shows/types.ts`
- Modify: `src/lib/shows/queries.ts`
- Modify: `src/lib/shows/data.ts`
- Modify: `src/data/shows.ts`

- [ ] **Step 1: Extend `ShowEntry` with explicit schema-ready fields**

Update the type to support richer event metadata without guessing inside the page component.

```ts
export type ShowOffer = {
  url?: string;
  price?: number;
  priceCurrency?: string;
  availability?: "https://schema.org/InStock" | "https://schema.org/SoldOut";
  validFrom?: string;
  isFree?: boolean;
};

export type ShowEntry = {
  title: string;
  slug: string;
  status: ShowStatus;
  startsAt: string;
  endsAt?: string;
  venue: string;
  city: string;
  state: string;
  country?: string;
  ticketUrl?: string;
  summary?: string;
  flyerUrl?: string;
  body: string[];
  lineup: string[];
  notes?: string;
  organizerName?: string;
  organizerUrl?: string;
  seoDescription?: string;
  offers?: ShowOffer;
};
```

- [ ] **Step 2: Update Sanity query mapping to fetch and normalize the new fields**

Modify `src/lib/shows/queries.ts` to request the new optional properties and emit them in `mapShowEntry()`.

```ts
type SanityShowRecord = Partial<Omit<ShowEntry, "body" | "lineup">> & {
  body?: SanityBlock[];
  lineup?: string[];
};

export const upcomingShowsQuery = `*[_type == "show" && startsAt >= now()] | order(startsAt asc){
  title,
  "slug": slug.current,
  status,
  startsAt,
  endsAt,
  venue,
  city,
  state,
  country,
  ticketUrl,
  summary,
  seoDescription,
  organizerName,
  organizerUrl,
  offers,
  "flyerUrl": flyer.asset->url,
  body,
  lineup,
  notes
}`;

export const mapShowEntry = (show: SanityShowRecord): ShowEntry => ({
  title: show.title || "Untitled Show",
  slug: show.slug || "untitled-show",
  status: show.status || "announced",
  startsAt: show.startsAt || new Date().toISOString(),
  endsAt: show.endsAt || undefined,
  venue: show.venue || "Venue TBA",
  city: show.city || "City TBA",
  state: show.state || "State TBA",
  country: show.country || "US",
  ticketUrl: show.ticketUrl || undefined,
  summary: show.summary || "",
  seoDescription: show.seoDescription || show.summary || "",
  organizerName: show.organizerName || "The Filibusters",
  organizerUrl: show.organizerUrl || "https://www.thefilibustersband.com",
  offers: show.offers || undefined,
  flyerUrl: show.flyerUrl || undefined,
  body: blocksToParagraphs(show.body),
  lineup: Array.isArray(show.lineup) ? show.lineup : [],
  notes: show.notes || undefined
});
```

- [ ] **Step 3: Update fallback show normalization in `src/lib/shows/data.ts`**

Preserve the new properties when fallback data is used.

```ts
const fallbackEntries: ShowEntry[] = fallbackShows.map((show) => ({
  ...show,
  endsAt: show.endsAt || undefined,
  country: show.country || "US",
  ticketUrl: show.ticketUrl || undefined,
  summary: show.summary || "",
  seoDescription: show.seoDescription || show.summary || "",
  organizerName: show.organizerName || "The Filibusters",
  organizerUrl: show.organizerUrl || "https://www.thefilibustersband.com",
  offers: show.offers || undefined,
  body: [...show.body],
  lineup: [...show.lineup],
  notes: show.notes || undefined
}));
```

- [ ] **Step 4: Enrich each fallback show in `src/data/shows.ts` with explicit SEO fields**

Add concrete metadata for current shows, including an explicit organizer and offer shape.

```ts
{
  title: "Devotional: Unforum",
  slug: "devotional-unforum-2026-04-14",
  status: "announced",
  startsAt: "2026-04-14T11:05:00-06:00",
  endsAt: "2026-04-14T12:00:00-06:00",
  venue: "Marriott Center",
  city: "Provo",
  state: "Utah",
  country: "US",
  ticketUrl: "https://calendar.byu.edu/devotionals-forums/devotional-unforum-2026-04-14",
  flyerUrl: devotionalUnforumImage.src,
  summary: "The Filibusters appear at BYU's Devotional: Unforum on Tuesday, April 14.",
  seoDescription:
    "See The Filibusters live at BYU's Devotional: Unforum in Provo, Utah on Tuesday, April 14, with schedule details and event information.",
  organizerName: "Brigham Young University",
  organizerUrl: "https://calendar.byu.edu",
  offers: {
    url: "https://calendar.byu.edu/devotionals-forums/devotional-unforum-2026-04-14",
    price: 0,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    isFree: true
  },
  body: [
    "The Filibusters are part of BYU's Devotional: Unforum at the Marriott Center in Provo, Utah on Tuesday, April 14 from 11:05 AM to 12:00 PM.",
    "Unforum is described by BYU as a student-centered year in review celebrating student successes, performances, service, and achievements."
  ],
  lineup: ["The Filibusters"],
  notes: "Event details are based on the BYU Events Calendar listing and should be confirmed with BYU before attending."
}
```

- [ ] **Step 5: Run the production build to verify the data-model changes**

Run: `npm run build`

Expected:
- Astro build completes successfully
- no type errors from `ShowEntry`, query mapping, or fallback data

- [ ] **Step 6: Commit the show data enrichment**

```bash
git add src/lib/shows/types.ts src/lib/shows/queries.ts src/lib/shows/data.ts src/data/shows.ts
git commit -m "feat: enrich show seo data"
```

## Task 3: Add Page-Level Event SEO To Show Detail Pages

**Files:**
- Modify: `src/pages/shows/[slug].astro`

- [ ] **Step 1: Build page-specific title, description, image, and URL values**

Compute route-specific SEO values near the top of the file so the page component stays declarative.

```astro
const showUrl = new URL(`/shows/${show.slug}`, Astro.site).href;
const showDate = new Date(show.startsAt);
const readableDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric"
}).format(showDate);

const pageTitle = `${show.title} in ${show.city}, ${show.state} | ${siteMeta.title}`;
const pageDescription =
  show.seoDescription ||
  `See ${siteMeta.title} live at ${show.venue} in ${show.city}, ${show.state} on ${readableDate}.`;
const pageOgImage = show.flyerUrl || undefined;
```

- [ ] **Step 2: Create a complete `Event` JSON-LD payload**

Build a single event object with the canonical page URL and explicit organizer/offers.

```astro
const getEventStatus = (status: string) => {
  switch (status) {
    case "canceled":
      return "https://schema.org/EventCancelled";
    case "sold-out":
      return "https://schema.org/EventScheduled";
    default:
      return "https://schema.org/EventScheduled";
  }
};

const eventStructuredData = {
  "@type": "Event",
  name: show.title,
  description: pageDescription,
  startDate: show.startsAt,
  ...(show.endsAt ? { endDate: show.endsAt } : {}),
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: getEventStatus(show.status),
  image: show.flyerUrl ? [new URL(show.flyerUrl, Astro.site).href] : [],
  url: showUrl,
  performer: {
    "@type": "MusicGroup",
    name: siteMeta.title,
    url: siteMeta.url
  },
  organizer: {
    "@type": "Organization",
    name: show.organizerName || siteMeta.title,
    url: show.organizerUrl || siteMeta.url
  },
  location: {
    "@type": "Place",
    name: show.venue,
    address: {
      "@type": "PostalAddress",
      addressLocality: show.city,
      addressRegion: show.state,
      addressCountry: show.country || "US"
    }
  },
  offers: {
    "@type": "Offer",
    url: show.offers?.url || show.ticketUrl || showUrl,
    price: show.offers?.price ?? 0,
    priceCurrency: show.offers?.priceCurrency || "USD",
    availability:
      show.status === "sold-out"
        ? "https://schema.org/SoldOut"
        : show.offers?.availability || "https://schema.org/InStock",
    ...(show.offers?.validFrom ? { validFrom: show.offers.validFrom } : {})
  }
};
```

- [ ] **Step 3: Pass the new metadata into `BaseLayout`**

Wire the route-specific values into the layout API from Task 1.

```astro
<BaseLayout
  title={pageTitle}
  description={pageDescription}
  ogImage={pageOgImage}
  ogType="event"
  structuredData={eventStructuredData}
>
```

- [ ] **Step 4: Add an internal link back to the show index**

Give users and crawlers a clear path back to `/shows` near the top of the detail page.

```astro
<a
  class="focus-ring inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-pink)]"
  href="/shows"
>
  All shows
</a>
```

- [ ] **Step 5: Run the production build and inspect one generated page**

Run: `npm run build`

Then inspect:

Run: `rg -n "\"@type\":\"Event\"|og:type|og:image|canonical" dist/shows -g 'index.html'`

Expected:
- build succeeds
- at least one show page contains `@type":"Event"`
- show pages contain `og:type` with `event`
- show pages contain a canonical URL under `/shows/<slug>`

- [ ] **Step 6: Commit the show-detail SEO upgrade**

```bash
git add 'src/pages/shows/[slug].astro'
git commit -m "feat: add event seo to show pages"
```

## Task 4: Refresh Homepage And Shows Index Search Relevance

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/data/homepage.ts`
- Modify: `src/pages/shows/index.astro`
- Modify: `src/data/about.ts` if one additional internal-linking cue is needed

- [ ] **Step 1: Update homepage supporting copy in `src/data/homepage.ts`**

Keep the tone intact, but make local and music-search intent clearer in existing copy.

```ts
hero: {
  eyebrow: "The Filibusters",
  headline: "Feel loud. Feel seen. Feel something.",
  subheadline:
    "The Filibusters are a Provo, Utah alt rock band making original music for loud rooms, late nights, and live shows that actually hit.",
  primaryCta: { label: "Listen now", href: "#latest-release" },
  secondaryCta: { label: "See shows", href: "/shows" }
},
community: {
  title: "Stay close",
  description:
    "Get updates on new Filibusters music, upcoming live shows in Utah, and the band news worth checking back for.",
  updatesCtaLabel: "View updates",
  updatesHref: "/community",
  subscribeCtaLabel: "Subscribe",
  fallbackDescription:
    "Drop your email to hear about new music, upcoming Filibusters shows, and band updates from Provo, Utah and beyond.",
  fallbackCtaLabel: "Get on the list"
}
```

- [ ] **Step 2: Tighten the homepage `<BaseLayout>` metadata**

Use a clearer title and description in `src/pages/index.astro`.

```astro
<BaseLayout
  title={`${siteMeta.title} | Provo, Utah Alt Rock Band`}
  description="The Filibusters are a Provo, Utah alt rock band sharing original music, upcoming live shows, and band updates."
>
```

- [ ] **Step 3: Refresh the shows index metadata and intro copy**

Update `src/pages/shows/index.astro` so the page reads like a destination for upcoming live dates.

```astro
<BaseLayout
  title={`Upcoming Shows | ${siteMeta.title}`}
  description="Find upcoming The Filibusters shows, live music dates, venues, and ticket links across Provo, Utah, and beyond."
>
```

```astro
<p class="mt-3 max-w-3xl text-[0.98rem] leading-6 text-[var(--color-ink)]/76 md:mt-4 md:text-lg md:leading-7">
  Find upcoming Filibusters live shows, check venue details, and grab tickets for dates in Provo, Utah and other upcoming stops.
</p>
```

- [ ] **Step 4: Add one natural internal-linking cue if needed**

If the About content still reads cleanly with one more search-relevant cue, update one existing answer or CTA in `src/data/about.ts`.

```ts
{
  question: "Are The Filibusters playing shows?",
  answer:
    "Yes. Visit the shows page for upcoming Filibusters live dates, venue details, and current event information."
}
```

- [ ] **Step 5: Run the production build and inspect rendered metadata**

Run: `npm run build`

Then inspect:

Run: `rg -n "<title>|meta name=\"description\"" dist/index.html dist/shows/index.html`

Expected:
- build succeeds
- homepage and show index contain the updated metadata strings

- [ ] **Step 6: Commit the metadata and copy refresh**

```bash
git add src/pages/index.astro src/data/homepage.ts src/pages/shows/index.astro src/data/about.ts
git commit -m "feat: improve search-facing page copy"
```

## Task 5: Final Verification

**Files:**
- Verify only, unless a blocker is found

- [ ] **Step 1: Run the final production build**

Run: `npm run build`

Expected:
- build completes successfully without errors

- [ ] **Step 2: Verify generated SEO output in `dist/`**

Run: `rg -n "\"@type\":\"Event\"|og:type|og:image|canonical|sitemap.xml" dist public/robots.txt`

Expected:
- event schema is present in show detail output
- `og:type` appears in generated show pages
- canonical URLs are present
- `robots.txt` still references `/sitemap.xml`

- [ ] **Step 3: Verify sitemap URLs stay on HTTPS**

Run: `sed -n '1,200p' dist/sitemap.xml`

Expected:
- every `<loc>` uses `https://www.thefilibustersband.com`

- [ ] **Step 4: Run the dev server for a quick mobile-width check**

Run: `npm run dev`

Manual check:
- inspect the homepage, shows index, and one show detail page around `375px`
- confirm no horizontal scroll
- confirm show CTA links remain visible
- confirm the new back-link on show pages is usable

- [ ] **Step 5: Record post-deploy validation work**

After deploy:
- run the live show page through Google Rich Results Test
- request validation in Search Console only after confirming the new schema is live

- [ ] **Step 6: Commit only if verification uncovered a required fix**

```bash
git add <any verification-driven fixes>
git commit -m "fix: address seo verification issues"
```

## Self-Review

Spec coverage:
- Shared layout SEO API: covered in Task 1
- Show data model enrichment: covered in Task 2
- Show detail event schema: covered in Task 3
- Homepage and shows metadata/copy updates: covered in Task 4
- Verification: covered in Task 5

Placeholder scan:
- no `TODO`, `TBD`, or deferred implementation markers remain in the task steps
- all commands are concrete
- all code-edit steps include code snippets

Type consistency:
- `ShowEntry`, `ShowOffer`, `seoDescription`, `organizerName`, `organizerUrl`, `offers`, `endsAt`, and `country` are introduced in Task 2 and referenced consistently afterward
