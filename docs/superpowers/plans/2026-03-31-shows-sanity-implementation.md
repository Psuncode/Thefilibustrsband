# Shows + Sanity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first CMS-backed product surface by integrating Sanity and shipping a visual upcoming-shows grid at `/shows` plus event detail pages at `/shows/[slug]`.

**Architecture:** Keep the Astro site as the primary front end and add a repo-local Sanity Studio plus a small shared data layer in `src/lib/`. Route generation should prefer Sanity content when environment variables are present, but keep a repo-local fallback wired to the existing `src/data/shows.ts` so the site still builds cleanly without project credentials during setup.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, Sanity Studio, `@sanity/client`, GROQ

---

## File Structure

- Create: `sanity.config.ts`
  - Sanity Studio configuration and schema registration.
- Create: `sanity.cli.ts`
  - CLI config for local Studio commands.
- Create: `sanity/schemaTypes/index.ts`
  - Export Sanity schema types.
- Create: `sanity/schemaTypes/showType.ts`
  - `show` document schema.
- Modify: `package.json`
  - Add Sanity dependencies and Studio scripts.
- Modify: `.env.example`
  - Add Sanity environment variable placeholders if the file exists, otherwise create it.
- Create: `src/lib/sanity/env.ts`
  - Reads and validates public Sanity env values.
- Create: `src/lib/sanity/client.ts`
  - Shared Sanity client factory.
- Create: `src/lib/shows/types.ts`
  - Normalized front-end show type.
- Create: `src/lib/shows/queries.ts`
  - GROQ queries and mapping utilities.
- Create: `src/lib/shows/data.ts`
  - Fetch Sanity data with repo-local fallback.
- Modify: `src/data/shows.ts`
  - Expand fallback data to support list and detail pages.
- Create: `src/pages/shows/index.astro`
  - Upcoming-shows grid page.
- Create: `src/pages/shows/[slug].astro`
  - Event detail route using `getStaticPaths`.
- Modify: `src/components/home/ShowsPreviewSection.astro`
  - Link homepage show preview to the new route and normalize card CTA behavior.
- Modify: `src/data/site.ts`
  - Add `Shows` primary nav route and any route constants needed.
- Modify: `src/pages/sitemap.xml.ts`
  - Include `/shows` and generated show detail URLs.

## Constraints And Verification Notes

- There is no test runner configured in `package.json`.
- Verification for this slice must rely on:
  - `npm run build`
  - focused file review
- The site must still build without active Sanity credentials by falling back to `src/data/shows.ts`.
- `/shows` should list upcoming events only.
- `/shows/[slug]` should be article-style event pages with flyer/media as supporting content.

### Task 1: Add Sanity Dependencies And Studio Scaffolding

**Files:**
- Modify: `package.json`
- Create: `sanity.config.ts`
- Create: `sanity.cli.ts`
- Create: `sanity/schemaTypes/index.ts`
- Create: `sanity/schemaTypes/showType.ts`
- Modify or create: `.env.example`

- [ ] **Step 1: Add Sanity packages and scripts**

Add dependencies for a local Studio and query client:

```json
{
  "scripts": {
    "sanity:dev": "sanity dev",
    "sanity:build": "sanity build"
  },
  "dependencies": {
    "@sanity/client": "^6.28.0",
    "groq": "^4.0.1",
    "sanity": "^3.52.0"
  }
}
```

- [ ] **Step 2: Create the Studio config**

Add `sanity.config.ts`:

```ts
import {defineConfig} from "sanity";
import {schemaTypes} from "./sanity/schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || "demo";
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "The Filibusters CMS",
  projectId,
  dataset,
  schema: {
    types: schemaTypes
  }
});
```

- [ ] **Step 3: Create CLI config**

Add `sanity.cli.ts`:

```ts
import {defineCliConfig} from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || "demo",
    dataset: process.env.SANITY_STUDIO_DATASET || process.env.PUBLIC_SANITY_DATASET || "production"
  }
});
```

- [ ] **Step 4: Create the first schema type**

Add `sanity/schemaTypes/showType.ts`:

```ts
import {defineField, defineType} from "sanity";

export const showType = defineType({
  name: "show",
  title: "Show",
  type: "document",
  fields: [
    defineField({name: "title", title: "Title", type: "string", validation: (rule) => rule.required()}),
    defineField({name: "slug", title: "Slug", type: "slug", options: {source: "title", maxLength: 96}, validation: (rule) => rule.required()}),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          {title: "Announced", value: "announced"},
          {title: "Sold Out", value: "sold-out"},
          {title: "Canceled", value: "canceled"}
        ]
      },
      initialValue: "announced",
      validation: (rule) => rule.required()
    }),
    defineField({name: "startsAt", title: "Start Date & Time", type: "datetime", validation: (rule) => rule.required()}),
    defineField({name: "venue", title: "Venue", type: "string", validation: (rule) => rule.required()}),
    defineField({name: "city", title: "City", type: "string", validation: (rule) => rule.required()}),
    defineField({name: "state", title: "State", type: "string", validation: (rule) => rule.required()}),
    defineField({name: "ticketUrl", title: "Ticket URL", type: "url"}),
    defineField({name: "summary", title: "Summary", type: "text", rows: 3}),
    defineField({name: "flyer", title: "Flyer", type: "image", options: {hotspot: true}}),
    defineField({name: "body", title: "Body", type: "array", of: [{type: "block"}]}),
    defineField({name: "lineup", title: "Lineup Notes", type: "array", of: [{type: "string"}]}),
    defineField({name: "notes", title: "Extra Notes", type: "text", rows: 4})
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "venue"
    }
  }
});
```

- [ ] **Step 5: Register schema exports**

Add `sanity/schemaTypes/index.ts`:

```ts
import {showType} from "./showType";

export const schemaTypes = [showType];
```

- [ ] **Step 6: Add environment placeholders**

Create or update `.env.example`:

```dotenv
PUBLIC_SANITY_PROJECT_ID=
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-05-08
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=production
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`

Expected:
- lockfile updates
- `package.json` reflects the new Sanity dependencies

### Task 2: Add Shared Sanity And Shows Data Utilities

**Files:**
- Create: `src/lib/sanity/env.ts`
- Create: `src/lib/sanity/client.ts`
- Create: `src/lib/shows/types.ts`
- Create: `src/lib/shows/queries.ts`
- Create: `src/lib/shows/data.ts`
- Modify: `src/data/shows.ts`

- [ ] **Step 1: Normalize the fallback show type**

Replace `src/data/shows.ts` with richer fallback data:

```ts
export const upcomingShows = [
  {
    title: "BYU Battle of the Bands 2026",
    slug: "byu-battle-of-the-bands-2026",
    status: "announced",
    startsAt: "2026-03-28T19:00:00-06:00",
    venue: "BYU Marriott Center",
    city: "Provo",
    state: "Utah",
    ticketUrl: "https://sclcenter.byu.edu/battle-of-the-bands",
    summary: "The Filibusters take the stage at BYU Battle of the Bands 2026.",
    body: [
      "The Filibusters bring a loud, emotionally direct live set to the BYU Marriott Center for Battle of the Bands 2026.",
      "Expect a high-energy room, crowd-sing moments, and a set built to feel immediate in person."
    ],
    lineup: ["The Filibusters"],
    notes: "Doors and event timing should be confirmed with the venue."
  }
] as const;
```

- [ ] **Step 2: Add the shared front-end type**

Add `src/lib/shows/types.ts`:

```ts
export type ShowStatus = "announced" | "sold-out" | "canceled";

export type ShowEntry = {
  title: string;
  slug: string;
  status: ShowStatus;
  startsAt: string;
  venue: string;
  city: string;
  state: string;
  ticketUrl?: string;
  summary?: string;
  flyerUrl?: string;
  body: string[];
  lineup: string[];
  notes?: string;
};
```

- [ ] **Step 3: Add Sanity env helpers**

Add `src/lib/sanity/env.ts`:

```ts
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2025-05-08";

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  enabled: Boolean(projectId && dataset)
} as const;
```

- [ ] **Step 4: Add the shared client**

Add `src/lib/sanity/client.ts`:

```ts
import {createClient} from "@sanity/client";
import {sanityConfig} from "./env";

export const sanityClient = sanityConfig.enabled
  ? createClient({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: true
    })
  : null;
```

- [ ] **Step 5: Add queries and mappers**

Add `src/lib/shows/queries.ts`:

```ts
import type {ShowEntry} from "./types";

export const upcomingShowsQuery = `*[_type == "show" && startsAt >= now()] | order(startsAt asc){
  title,
  "slug": slug.current,
  status,
  startsAt,
  venue,
  city,
  state,
  ticketUrl,
  summary,
  "flyerUrl": flyer.asset->url,
  body,
  lineup,
  notes
}`;

export const allShowSlugsQuery = `*[_type == "show"]{"slug": slug.current}`;

export const showBySlugQuery = `*[_type == "show" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  status,
  startsAt,
  venue,
  city,
  state,
  ticketUrl,
  summary,
  "flyerUrl": flyer.asset->url,
  body,
  lineup,
  notes
}`;

export const mapShowEntry = (show: any): ShowEntry => ({
  title: show.title,
  slug: show.slug,
  status: show.status || "announced",
  startsAt: show.startsAt,
  venue: show.venue,
  city: show.city,
  state: show.state,
  ticketUrl: show.ticketUrl || undefined,
  summary: show.summary || "",
  flyerUrl: show.flyerUrl || undefined,
  body: Array.isArray(show.body)
    ? show.body
        .map((block: any) =>
          Array.isArray(block.children) ? block.children.map((child: any) => child.text).join("") : ""
        )
        .filter(Boolean)
    : [],
  lineup: Array.isArray(show.lineup) ? show.lineup : [],
  notes: show.notes || undefined
});
```

- [ ] **Step 6: Add fallback-aware data functions**

Add `src/lib/shows/data.ts`:

```ts
import {upcomingShows as fallbackShows} from "../../data/shows";
import {sanityClient} from "../sanity/client";
import {allShowSlugsQuery, mapShowEntry, showBySlugQuery, upcomingShowsQuery} from "./queries";
import type {ShowEntry} from "./types";

const fallbackEntries: ShowEntry[] = fallbackShows.map((show) => ({
  ...show,
  ticketUrl: show.ticketUrl || undefined,
  summary: show.summary || "",
  body: [...show.body],
  lineup: [...show.lineup],
  notes: show.notes || undefined
}));

export const getUpcomingShows = async (): Promise<ShowEntry[]> => {
  if (!sanityClient) return fallbackEntries;
  const shows = await sanityClient.fetch(upcomingShowsQuery);
  return Array.isArray(shows) && shows.length > 0 ? shows.map(mapShowEntry) : fallbackEntries;
};

export const getAllShowSlugs = async (): Promise<string[]> => {
  if (!sanityClient) return fallbackEntries.map((show) => show.slug);
  const slugs = await sanityClient.fetch(allShowSlugsQuery);
  return Array.isArray(slugs) && slugs.length > 0
    ? slugs.map((entry: {slug?: string}) => entry.slug).filter(Boolean)
    : fallbackEntries.map((show) => show.slug);
};

export const getShowBySlug = async (slug: string): Promise<ShowEntry | null> => {
  if (!sanityClient) return fallbackEntries.find((show) => show.slug === slug) || null;
  const show = await sanityClient.fetch(showBySlugQuery, {slug});
  return show ? mapShowEntry(show) : fallbackEntries.find((entry) => entry.slug === slug) || null;
};
```

### Task 3: Build `/shows` Route

**Files:**
- Create: `src/pages/shows/index.astro`
- Modify: `src/data/site.ts`

- [ ] **Step 1: Add the primary nav route**

Update `src/data/site.ts` primary nav to use `/shows` instead of the homepage anchor:

```ts
export const primaryNav = [
  {
    label: "Music",
    href: "/#latest-release",
    icon: "music"
  },
  {
    label: "Shows",
    href: "/shows",
    icon: "ticket"
  },
  {
    label: "About",
    href: "/about",
    icon: "info"
  },
  {
    label: "Contact",
    href: "/contact",
    icon: "mail"
  }
] as const satisfies readonly PrimaryNavItem[];
```

- [ ] **Step 2: Create the shows index route**

Add `src/pages/shows/index.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Header from "../../components/site/Header.astro";
import Footer from "../../components/site/Footer.astro";
import {getUpcomingShows} from "../../lib/shows/data";
import {siteMeta} from "../../data/site";

const shows = await getUpcomingShows();

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});
---

<BaseLayout
  title={`Shows | ${siteMeta.title}`}
  description="See upcoming Filibusters shows, dates, venues, and ticket links."
>
  <Header />
  <main id="main-content" class="mobile-nav-offset overflow-x-clip bg-[var(--color-paper-soft)]">
    <section class="border-b border-black/10 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Shows</p>
        <h1 class="display-face mt-3 text-4xl uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
          Upcoming dates worth showing up for.
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-[var(--color-ink)]/76 md:text-lg">
          Catch the next Filibusters show, grab tickets when they are live, and get the details before the room fills up.
        </p>
      </div>
    </section>

    <section>
      <div class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shows.map((show) => (
            <article class="poster-frame overflow-hidden rounded-[1.75rem] p-5">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">
                {formatter.format(new Date(show.startsAt))}
              </p>
              <h2 class="mt-4 text-2xl font-black uppercase leading-tight text-[var(--color-ink)]">
                <a class="focus-ring rounded-sm" href={`/shows/${show.slug}`}>
                  {show.title}
                </a>
              </h2>
              <p class="mt-3 text-sm uppercase tracking-[0.12em] text-[var(--color-muted)]">
                {show.venue} · {show.city}, {show.state}
              </p>
              {show.summary ? (
                <p class="mt-4 text-sm leading-6 text-[var(--color-ink)]/74">{show.summary}</p>
              ) : null}
              <div class="mt-6 flex gap-3">
                <a
                  class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-pink)]"
                  href={`/shows/${show.slug}`}
                >
                  View details
                </a>
                {show.ticketUrl ? (
                  <a
                    class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-black/12 bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-ink)] transition hover:border-[var(--color-pink)] hover:text-[var(--color-pink)]"
                    href={show.ticketUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Tickets
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

### Task 4: Build `/shows/[slug]` Route

**Files:**
- Create: `src/pages/shows/[slug].astro`
- Modify: `src/pages/sitemap.xml.ts`

- [ ] **Step 1: Create the show detail route**

Add `src/pages/shows/[slug].astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Header from "../../components/site/Header.astro";
import Footer from "../../components/site/Footer.astro";
import {getAllShowSlugs, getShowBySlug} from "../../lib/shows/data";
import {siteMeta} from "../../data/site";

export async function getStaticPaths() {
  const slugs = await getAllShowSlugs();
  return slugs.map((slug) => ({
    params: {slug}
  }));
}

const {slug} = Astro.params;
const show = slug ? await getShowBySlug(slug) : null;

if (!show) {
  return Astro.redirect("/shows");
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit"
});
---

<BaseLayout
  title={`${show.title} | ${siteMeta.title}`}
  description={show.summary || `Show details for ${show.title}.`}
>
  <Header />
  <main id="main-content" class="mobile-nav-offset overflow-x-clip bg-white">
    <section class="border-b border-black/10">
      <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <article class="max-w-3xl">
          <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Show Details</p>
          <h1 class="display-face mt-3 text-4xl uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
            {show.title}
          </h1>
          <p class="mt-5 text-base leading-7 text-[var(--color-ink)]/78 md:text-lg">
            {show.summary}
          </p>
          <dl class="mt-8 grid gap-4 sm:grid-cols-2">
            <div class="poster-frame rounded-[1.5rem] p-5">
              <dt class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Date</dt>
              <dd class="mt-3 text-lg font-semibold">{dateFormatter.format(new Date(show.startsAt))}</dd>
            </div>
            <div class="poster-frame rounded-[1.5rem] p-5">
              <dt class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Venue</dt>
              <dd class="mt-3 text-lg font-semibold">{show.venue}</dd>
            </div>
            <div class="poster-frame rounded-[1.5rem] p-5">
              <dt class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Location</dt>
              <dd class="mt-3 text-lg font-semibold">{show.city}, {show.state}</dd>
            </div>
            <div class="poster-frame rounded-[1.5rem] p-5">
              <dt class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Status</dt>
              <dd class="mt-3 text-lg font-semibold">{show.status}</dd>
            </div>
          </dl>
          {show.body.length ? (
            <div class="mt-8 space-y-4">
              {show.body.map((paragraph) => (
                <p class="text-base leading-7 text-[var(--color-ink)]/78 md:text-lg">{paragraph}</p>
              ))}
            </div>
          ) : null}
        </article>

        <aside class="poster-frame rounded-[2rem] p-5">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Lineup</p>
          <ul class="mt-4 space-y-2 text-sm leading-6 text-[var(--color-ink)]/76">
            {(show.lineup.length ? show.lineup : ["The Filibusters"]).map((entry) => (
              <li>{entry}</li>
            ))}
          </ul>
          {show.notes ? (
            <>
              <p class="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Notes</p>
              <p class="mt-3 text-sm leading-6 text-[var(--color-ink)]/76">{show.notes}</p>
            </>
          ) : null}
          {show.ticketUrl ? (
            <a
              class="focus-ring mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-pink)]"
              href={show.ticketUrl}
              rel="noreferrer"
              target="_blank"
            >
              Get tickets
            </a>
          ) : null}
        </aside>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Extend the sitemap generator**

Update `src/pages/sitemap.xml.ts` to include dynamic show URLs:

```ts
import {getAllShowSlugs} from "../lib/shows/data";
```

and in `GET`:

```ts
  const showSlugs = await getAllShowSlugs();
  const showRoutes = showSlugs.map((slug) => `/shows/${slug}`);
  const routes = ["", "/about", "/contact", "/listen", "/shows", ...showRoutes] as const;
```

Convert the handler to `async`:

```ts
export const GET: APIRoute = async () => {
```

### Task 5: Update Homepage Discovery And Verify

**Files:**
- Modify: `src/components/home/ShowsPreviewSection.astro`

- [ ] **Step 1: Link homepage preview rows to the new route**

Update the CTA logic in `src/components/home/ShowsPreviewSection.astro`:

```astro
---
import {getUpcomingShows} from "../../lib/shows/data";

const upcomingShows = await getUpcomingShows();
```

Update the CTA button:

```astro
<a
  class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-pink)]"
  href={show.ticketUrl || `/shows/${show.slug}`}
>
  {show.ticketUrl ? "Get tickets" : "View details"}
</a>
```

Add a section-level CTA in the heading row:

```astro
<a
  class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-black/12 bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-ink)] transition hover:border-[var(--color-pink)] hover:text-[var(--color-pink)]"
  href="/shows"
>
  View all shows
</a>
```

- [ ] **Step 2: Run the full build verification**

Run: `npm run build`

Expected:
- build exits with code `0`
- `/shows` and `/shows/[slug]` routes generate
- no type errors from Sanity client helpers when env vars are absent

- [ ] **Step 3: Commit the slice**

```bash
git add package.json package-lock.json .env.example sanity.config.ts sanity.cli.ts sanity/schemaTypes src/lib src/data/shows.ts src/pages/shows src/pages/sitemap.xml.ts src/components/home/ShowsPreviewSection.astro src/data/site.ts
git commit -m "feat: add sanity-backed shows pages"
```

## Self-Review

- Spec coverage:
  - `Shows` route family: covered
  - Sanity-first integration: covered
  - visual upcoming-only listing: covered
  - content-forward slug pages: covered
  - homepage/internal linking updates: covered
- Placeholder scan:
  - no `TODO` or `TBD` markers remain
- Type consistency:
  - `ShowEntry` shape is used consistently across fallback data, queries, and routes
