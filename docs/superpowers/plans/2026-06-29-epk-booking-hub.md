# EPK / Booking Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/press/epk` — a booker-facing EPK hub assembled from existing site data (past shows, lineup, quotes, music/video) plus a new `epk.ts` (one-liner, pitch, photo pack, optional rider/draw-stats) with a prefilled "Book us" mailto, so the band has one shareable link to get gigs.

**Architecture:** Static Astro page composing existing data sources; a new `src/data/epk.ts` for booker-specific content; a shared Event-schema helper extracted from `/shows/[slug]` so both pages emit identical, complete Event JSON-LD. Sections degrade gracefully — each renders only when its data exists.

**Tech Stack:** Astro 5, Tailwind, TypeScript data files, Playwright e2e.

**Spec:** `docs/superpowers/specs/2026-06-29-epk-booking-hub-design.md`

**Verification reality:** `node:test` cannot import data files that import images (`epk.ts`, `discography.ts` import via `astro:assets`). Failing-first tests use **Playwright e2e** (`CI=true npm run test:e2e`), plus `npm run check` and `npm run build`. Commit on the working branch each task.

---

## File Structure

- `src/lib/shows/eventSchema.ts` — NEW: `buildEventStructuredData({show, url, description, image})` returning the complete Event JSON-LD node (offer/organizer fallbacks). Single source of truth for Event schema.
- `src/pages/shows/[slug].astro` — MODIFY: replace the inline Event-node assembly with a call to the new helper (keep output schema-equivalent; existing e2e stays green).
- `src/data/epk.ts` — NEW: `Epk` types + `epk` data object (one-liner, pitch, photoPack seeded from existing images, booking config; rider/drawStats omitted for now).
- `src/data/site.ts` — MODIFY: add `epk: { path: "/press/epk" }` to `siteRoutes`.
- `src/pages/press/epk.astro` — NEW: the booking hub page.
- `src/pages/press.astro` — MODIFY: add a cross-link to `/press/epk`.
- `tests/e2e/{structured-data,seo,a11y}.spec.ts` — MODIFY: cover `/press/epk`.

Reference patterns: `src/pages/press.astro` (page idiom + `pressMailto`), `src/pages/shows/[slug].astro` (Event schema source), `src/pages/shows/index.astro` (`getPastShows()` usage), `src/pages/band/[slug].astro` (lineup links), `src/lib/seo/breadcrumb.ts` (`buildBreadcrumbList`).

---

## Task 1: Extract shared Event-schema helper

**Files:**
- Create: `src/lib/shows/eventSchema.ts`
- Modify: `src/pages/shows/[slug].astro`
- Test: existing `tests/e2e/structured-data.spec.ts` ("show detail page emits an Event JSON-LD node") must stay green.

- [ ] **Step 1: Create the helper**

Create `src/lib/shows/eventSchema.ts`:

```ts
import type { ShowEntry } from "./types";
import { siteMeta } from "../../data/site";

type EventSchemaInput = {
  show: ShowEntry;
  /** Absolute canonical URL of the show's own detail page. */
  url: string;
  /** Resolved event description (seoDescription/summary/generated). */
  description: string;
  /** Absolute OG image URL, if any. */
  image?: string;
};

const eventStatusByShowStatus = {
  announced: "https://schema.org/EventScheduled",
  "sold-out": "https://schema.org/EventScheduled",
  cancelled: "https://schema.org/EventCancelled",
  canceled: "https://schema.org/EventCancelled",
  postponed: "https://schema.org/EventPostponed"
} as const;

export const buildEventStructuredData = ({
  show,
  url,
  description,
  image
}: EventSchemaInput): Record<string, unknown> => {
  const offers =
    show.offers &&
    (show.offers.url ||
      typeof show.offers.price === "number" ||
      show.offers.isFree === true ||
      show.offers.availability ||
      show.offers.validFrom)
      ? {
          "@type": "Offer",
          url: show.offers.url || show.ticketUrl || url,
          price: show.offers.isFree ? 0 : show.offers.price,
          priceCurrency: show.offers.priceCurrency,
          availability: show.offers.availability || "https://schema.org/InStock",
          validFrom:
            show.offers.validFrom ||
            new Date(new Date(show.startsAt).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      : undefined;

  return {
    "@type": "Event",
    name: show.title,
    description,
    startDate: show.startsAt,
    endDate: show.endsAt || show.startsAt,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus:
      eventStatusByShowStatus[show.status as keyof typeof eventStatusByShowStatus] ??
      "https://schema.org/EventScheduled",
    image: image ? [encodeURI(image)] : undefined,
    url,
    performer: {
      "@type": "MusicGroup",
      name: siteMeta.title,
      url: siteMeta.url
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
    organizer: show.organizerName
      ? {
          "@type": "Organization",
          name: show.organizerName,
          url: show.organizerUrl || show.ticketUrl || url
        }
      : undefined,
    offers,
    ...(show.award ? { award: show.award } : {})
  };
};
```

- [ ] **Step 2: Refactor `/shows/[slug].astro` to use the helper**

In `src/pages/shows/[slug].astro` frontmatter: add the import
`import { buildEventStructuredData } from "../../lib/shows/eventSchema";`
Delete the inline `eventStatusByShowStatus`, `eventOffers`, and `eventStructuredData` blocks (lines ~51-120). Replace with:

```ts
const eventStructuredData = buildEventStructuredData({
  show,
  url: canonicalShowUrl,
  description: pageDescription,
  image: pageOgImage
});
```

(Keep `canonicalShowUrl`, `pageDescription`, `pageOgImage`, `eventEndDate` if still referenced elsewhere — `eventEndDate` is now unused, remove it to keep `npm run check` clean. Verify `siteMeta` import is still needed; if no other usage remains, remove it.)

- [ ] **Step 3: Verify types + the existing Event test still passes**

Run: `npm run check && CI=true npx playwright test structured-data -g "Event JSON-LD"`
Expected: 0 errors; the Event test passes (schema unchanged).

- [ ] **Step 4: Commit**

```bash
git add src/lib/shows/eventSchema.ts src/pages/shows/[slug].astro
git commit -m "refactor(shows): extract shared Event JSON-LD builder"
```

---

## Task 2: Add EPK route + data model

**Files:**
- Modify: `src/data/site.ts`
- Create: `src/data/epk.ts`

- [ ] **Step 1: Add the route to `siteRoutes`**

In `src/data/site.ts`, in the `siteRoutes` object, change:

```ts
  merch: { path: "/merch" }
} as const satisfies Record<string, SiteRoute>;
```

to:

```ts
  merch: { path: "/merch" },
  epk: { path: "/press/epk" }
} as const satisfies Record<string, SiteRoute>;
```

- [ ] **Step 2: Create the EPK data file**

Create `src/data/epk.ts` (photo pack seeded with existing in-repo images per spec; rider/drawStats omitted so those sections stay hidden):

```ts
import type { ImageMetadata } from "astro";

import heroBand from "../assets/images/hero-band.jpg";
import battleWinner from "../assets/images/battle-of-the-band-winner.jpg";
import velourShow from "../assets/images/velour-2026-06-19.png";
import { siteMeta } from "./site";

export type EpkPhoto = {
  label: string;
  image: ImageMetadata;
  credit?: string;
  downloadHref: string;
};

export type EpkStat = { label: string; value: string };

export type EpkTechRider = {
  inputList?: readonly string[];
  backline?: readonly string[];
  stagePlotImage?: ImageMetadata;
  notes?: readonly string[];
};

export type Epk = {
  heroOneLiner: string;
  pitch: readonly string[];
  photoPack: readonly EpkPhoto[];
  drawStats?: readonly EpkStat[];
  techRider?: EpkTechRider;
  booking: {
    email: string;
    mailtoSubject: string;
    mailtoBodyLines: readonly string[];
  };
};

export const epk = {
  heroOneLiner:
    "Provo, Utah alt rock built for loud rooms — fronted by a Voice alum, playing for the crowd, not the recording.",
  pitch: [
    "The Filibusters are a high-energy Provo alt rock band built around live connection: hooks that land on first listen, emotionally direct songs, and a frontwoman — Hanna Eyre, a Season 12 contestant on NBC's The Voice — who carries the room.",
    "They draw a young, engaged local crowd and have shared bills across the Utah scene, from Velour Live Music Gallery in Provo to the Utah Arts Festival in Salt Lake City. Easy to work with, ready to load in, and built to leave a room louder than they found it."
  ],
  photoPack: [
    {
      label: "Band photo (primary)",
      image: heroBand,
      downloadHref: heroBand.src
    },
    {
      label: "Live — Velour, Provo",
      image: velourShow,
      downloadHref: velourShow.src
    },
    {
      label: "BYU Battle of the Bands 2026 — winner",
      image: battleWinner,
      downloadHref: battleWinner.src
    }
  ],
  booking: {
    email: siteMeta.contactEmail,
    mailtoSubject: "Booking inquiry — The Filibusters",
    mailtoBodyLines: [
      "Hi Filibusters,",
      "",
      "I'd like to book you for:",
      "  - Venue / event: ",
      "  - Date(s): ",
      "  - City: ",
      "  - Capacity: ",
      "  - Offer / guarantee: ",
      "",
      "Anything else useful (links, set length, backline available): ",
      "",
      "Thanks!"
    ]
  }
} as const satisfies Epk;
```

- [ ] **Step 3: Verify types**

Run: `npm run check`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/site.ts src/data/epk.ts
git commit -m "feat(epk): add /press/epk route + epk data model"
```

---

## Task 3: Build the `/press/epk` page (TDD on schema)

**Files:**
- Create: `src/pages/press/epk.astro`
- Test: `tests/e2e/structured-data.spec.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/e2e/structured-data.spec.ts`:

```ts
test("EPK page emits WebPage and BreadcrumbList JSON-LD", async ({ page }) => {
  const response = await page.goto("/press/epk");
  expect(response?.ok(), "Failed to load /press/epk").toBe(true);
  await page.waitForSelector("main");

  const types = await page.$$eval('script[type="application/ld+json"]', (nodes) => {
    const flatten = (v: unknown): unknown[] => {
      if (!v || typeof v !== "object") return [];
      if (Array.isArray(v)) return v.flatMap(flatten);
      const g = (v as { "@graph"?: unknown })["@graph"];
      if (Array.isArray(g)) return g.flatMap(flatten);
      return [v];
    };
    return nodes
      .flatMap((n) => {
        try { return flatten(JSON.parse(n.textContent || "")); } catch { return []; }
      })
      .map((i) => (i as { "@type"?: string })?.["@type"]);
  });
  expect(types).toContain("WebPage");
  expect(types).toContain("BreadcrumbList");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `CI=true npx playwright test structured-data -g "EPK page"`
Expected: FAIL — `/press/epk` 404s.

- [ ] **Step 3: Create the page**

Create `src/pages/press/epk.astro`:

```astro
---
import { Image } from "astro:assets";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Footer from "../../components/site/Footer.astro";
import Header from "../../components/site/Header.astro";
import { epk } from "../../data/epk";
import { pressPage } from "../../data/press";
import { bandMembers } from "../../data/bandMembers";
import { discography } from "../../data/discography";
import { getPastShows } from "../../lib/shows/data";
import { buildEventStructuredData } from "../../lib/shows/eventSchema";
import { buildBreadcrumbList } from "../../lib/seo/breadcrumb";
import { buildPageId, buildPageUrl, siteEntityIds, siteMeta, siteRoutes } from "../../data/site";

const pastShows = await getPastShows();
const featuredTrack = discography[0];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "America/Denver"
});

const epkMailto = (() => {
  const subject = encodeURIComponent(epk.booking.mailtoSubject);
  const body = encodeURIComponent(epk.booking.mailtoBodyLines.join("\n"));
  return `mailto:${epk.booking.email}?subject=${subject}&body=${body}`;
})();

const webPageStructuredData = {
  "@type": "WebPage",
  "@id": buildPageId(siteRoutes.epk.path),
  name: `Booking & EPK | ${siteMeta.title}`,
  url: buildPageUrl(siteRoutes.epk.path),
  description: epk.heroOneLiner,
  isPartOf: { "@id": siteEntityIds.website },
  about: { "@id": siteEntityIds.musicGroup }
};

const eventNodes = pastShows.map((show) =>
  buildEventStructuredData({
    show,
    url: new URL(`/shows/${show.slug}`, Astro.site).href,
    description: show.seoDescription || show.summary || `${show.title} at ${show.venue}, ${show.city}, ${show.state}.`,
    image: show.flyerUrl ? new URL(show.flyerUrl, Astro.site).href : undefined
  })
);

const breadcrumbStructuredData = buildBreadcrumbList(Astro.site!.toString(), [
  { name: "Home", path: "/" },
  { name: "Press", path: siteRoutes.press.path },
  { name: "Booking & EPK", path: siteRoutes.epk.path }
]);
---

<BaseLayout
  title={`Booking & EPK | ${siteMeta.title}`}
  description={epk.heroOneLiner}
  structuredData={[webPageStructuredData, ...eventNodes, breadcrumbStructuredData]}
>
  <Header />
  <main id="main-content" class="mobile-nav-offset overflow-x-clip bg-paper-soft">
    <!-- 1. Hero -->
    <section class="border-b border-black/10 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <p class="text-[0.82rem] font-bold uppercase tracking-[0.2em] text-pink md:text-sm">Booking / EPK</p>
        <h1 class="display-face mt-3 max-w-4xl text-[2.35rem] uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
          Book The Filibusters
        </h1>
        <p class="mt-4 max-w-3xl text-[0.98rem] leading-6 text-ink/80 md:text-lg md:leading-7">{epk.heroOneLiner}</p>
        <div class="mt-7">
          <a class="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-pink px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-ink" href={epkMailto}>
            Book us
          </a>
        </div>
      </div>
    </section>

    <!-- 2. Pitch -->
    <section>
      <div class="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <div class="space-y-4">
          {epk.pitch.map((p) => (<p class="text-base leading-7 text-ink/85 md:text-lg">{p}</p>))}
        </div>
      </div>
    </section>

    <!-- 3. Listen / Watch -->
    <section class="bg-white">
      <div class="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-pink">Hear them</p>
        <h2 class="display-face mt-3 text-2xl uppercase leading-[0.95] tracking-[-0.03em] md:text-4xl">{featuredTrack.title}</h2>
        <p class="mt-4 text-base leading-7 text-ink/85">{featuredTrack.soundProfile}</p>
        <a class="focus-ring mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-pink" href={`/music/${featuredTrack.slug}`}>
          Listen + watch
        </a>
      </div>
    </section>

    <!-- 4. Live track record -->
    {pastShows.length > 0 ? (
      <section>
        <div class="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-pink">Live track record</p>
          <ul class="mt-5 divide-y divide-black/10">
            {pastShows.map((show) => (
              <li class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                <span class="font-semibold text-ink">{show.title}</span>
                <span class="text-sm text-ink/70">{show.venue}, {show.city} · {dateFormatter.format(new Date(show.startsAt))}</span>
              </li>
            ))}
          </ul>
          {epk.drawStats ? (
            <dl class="mt-6 grid gap-3 sm:grid-cols-2">
              {epk.drawStats.map((stat) => (
                <div class="rounded-[1.25rem] border border-black/10 bg-white px-4 py-3">
                  <dt class="text-xs font-bold uppercase tracking-[0.2em] text-pink">{stat.label}</dt>
                  <dd class="mt-1 text-base font-semibold text-ink">{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>
    ) : null}

    <!-- 5. Lineup -->
    <section class="bg-white">
      <div class="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-pink">Lineup</p>
        <ul class="mt-5 grid gap-3 sm:grid-cols-2">
          {bandMembers.map((m) => (
            <li>
              <a class="focus-ring flex items-baseline justify-between gap-3 rounded-[1.25rem] border border-black/10 px-4 py-3 transition hover:border-pink" href={`/band/${m.slug}`}>
                <span class="font-semibold text-ink">{m.name}</span>
                <span class="text-sm uppercase tracking-[0.12em] text-muted">{m.role}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <!-- 6. Quotes -->
    <section>
      <div class="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-pink">What people say</p>
        <div class="mt-5 space-y-4">
          {pressPage.quotes.map((q) => (
            <blockquote class="border-l-2 border-pink pl-4 text-lg italic leading-7 text-ink/85">{q}</blockquote>
          ))}
        </div>
      </div>
    </section>

    <!-- 7. Photo pack -->
    {epk.photoPack.length > 0 ? (
      <section class="bg-white">
        <div class="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-pink">Press photos</p>
          <p class="mt-2 text-sm text-ink/70">Right-click → save, or open and download. Cleared for promo use.</p>
          <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {epk.photoPack.map((photo) => (
              <figure class="poster-frame overflow-hidden rounded-[1.5rem]">
                <a href={photo.downloadHref} target="_blank" rel="noopener noreferrer" download>
                  <Image src={photo.image} alt={photo.label} widths={[480, 720]} sizes="(max-width: 639px) 100vw, 33vw" class="aspect-[4/5] w-full object-cover" />
                </a>
                <figcaption class="px-4 py-3 text-sm font-semibold text-ink">
                  {photo.label}{photo.credit ? <span class="font-normal text-ink/60"> · {photo.credit}</span> : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    ) : null}

    <!-- 8. Tech rider -->
    {epk.techRider ? (
      <section>
        <div class="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-pink">Tech rider</p>
          {epk.techRider.inputList ? (
            <>
              <h3 class="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-ink">Input list</h3>
              <ul class="mt-2 list-disc pl-5 text-base leading-7 text-ink/85">{epk.techRider.inputList.map((i) => (<li>{i}</li>))}</ul>
            </>
          ) : null}
          {epk.techRider.backline ? (
            <>
              <h3 class="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-ink">Backline</h3>
              <ul class="mt-2 list-disc pl-5 text-base leading-7 text-ink/85">{epk.techRider.backline.map((i) => (<li>{i}</li>))}</ul>
            </>
          ) : null}
          {epk.techRider.stagePlotImage ? (
            <Image src={epk.techRider.stagePlotImage} alt="Stage plot" widths={[480, 960]} sizes="100vw" class="mt-5 w-full rounded-[1.5rem]" />
          ) : null}
          {epk.techRider.notes ? (
            <ul class="mt-4 list-disc pl-5 text-base leading-7 text-ink/85">{epk.techRider.notes.map((n) => (<li>{n}</li>))}</ul>
          ) : null}
        </div>
      </section>
    ) : null}

    <!-- 9. Footer CTA -->
    <section class="border-t border-black/10 bg-white">
      <div class="mx-auto max-w-3xl px-4 py-10 text-center md:px-6 md:py-14">
        <h2 class="display-face text-2xl uppercase leading-[0.95] tracking-[-0.03em] md:text-4xl">Let's get a date on the calendar.</h2>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <a class="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-pink px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-ink" href={epkMailto}>Book us</a>
          <a class="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-black/12 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-ink transition hover:border-pink hover:text-pink" href={siteRoutes.press.path}>Press / media room</a>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `CI=true npx playwright test structured-data -g "EPK page"`
Expected: PASS. Also run `npm run check && npm run build` → 0 errors; page count +1.

- [ ] **Step 5: Commit**

```bash
git add src/pages/press/epk.astro tests/e2e/structured-data.spec.ts
git commit -m "feat(epk): build /press/epk booking hub"
```

---

## Task 4: Cross-link /press → /press/epk

**Files:**
- Modify: `src/pages/press.astro`

- [ ] **Step 1: Add an EPK link near the press contact CTA**

In `src/pages/press.astro`, find the press contact / mailto CTA area and add, alongside it, a link to the booking hub. Use the existing button class idiom already in that file; add:

```astro
        <a
          class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-black/12 bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-ink transition hover:border-pink hover:text-pink"
          href="/press/epk"
        >
          Booking / EPK
        </a>
```

Place it next to the existing press `mailto` button (read the file to find the exact element and match its container).

- [ ] **Step 2: Verify build**

Run: `npm run check && npm run build`
Expected: 0 errors; build OK.

- [ ] **Step 3: Commit**

```bash
git add src/pages/press.astro
git commit -m "feat(press): cross-link to /press/epk booking hub"
```

---

## Task 5: e2e route coverage (SEO + a11y)

**Files:**
- Modify: `tests/e2e/seo.spec.ts`, `tests/e2e/a11y.spec.ts`

- [ ] **Step 1: Add `/press/epk` to the SEO static routes**

In `tests/e2e/seo.spec.ts`, add `"/press/epk"` to the `staticRoutes` array (keep existing entries).

- [ ] **Step 2: Add `/press/epk` to the a11y routes**

In `tests/e2e/a11y.spec.ts`, add `"/press/epk"` to the `routes` array.

- [ ] **Step 3: Run the full e2e suite under CI conditions**

Run: `CI=true npm run test:e2e`
Expected: all pass, 1 skipped (visual). Confirms SEO tags + no serious/critical axe violations on `/press/epk`.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/seo.spec.ts tests/e2e/a11y.spec.ts
git commit -m "test(e2e): cover /press/epk (seo + a11y)"
```

---

## Task 6: Final verification + agent-browser smoke + PR

**Files:** none (verification only)

- [ ] **Step 1: Full local gate**

Run: `npm run check && npm test && npm run build`
Expected: 0 type errors; `npm test` passes; build completes (includes `/press/epk`).

- [ ] **Step 2: agent-browser smoke**

```bash
npm run preview >/dev/null 2>&1 &
sleep 4
agent-browser open http://localhost:4321/press/epk/ --session epk
agent-browser get text h1 --session epk                                          # "BOOK THE FILIBUSTERS"
agent-browser eval "!!document.querySelector('a[href^=\"mailto:\"]')" --session epk        # Book-us mailto present
agent-browser eval "document.querySelectorAll('figure a[download]').length" --session epk  # photo pack downloads (3)
agent-browser eval "!!document.querySelector('a[href=\"/press/epk\"]')" --session epk      # (run after opening /press)
agent-browser open http://localhost:4321/press/ --session epk
agent-browser eval "!!document.querySelector('a[href=\"/press/epk\"]')" --session epk      # cross-link present
agent-browser close --session epk
pkill -f "astro preview"
```
Expected: H1 correct; Book-us mailto present; 3 downloadable photos; `/press` links to `/press/epk`.

- [ ] **Step 3: Open the PR**

```bash
git push -u origin <branch>
gh pr create --base main --title "feat: EPK / booking hub (/press/epk)" --body "Implements docs/superpowers/specs/2026-06-29-epk-booking-hub-design.md"
```

---

## Self-review notes (author)

- **Spec coverage:** route + data model (Task 2), shared Event schema (Task 1), page with all 9 sections + WebPage/Breadcrumb/Event schema (Task 3), cross-link (Task 4), tests (Tasks 3, 5), sitemap auto-includes the new page (no task needed). All spec sections mapped.
- **Graceful degradation:** drawStats + techRider omitted from `epk.ts` → sections 4(stats)/8 hidden; photoPack seeded with 3 in-repo images → section 7 ships non-empty (swap to true hi-res later). Past-shows section guarded by `pastShows.length > 0`.
- **DRY / no regression:** Event schema extracted to one helper used by both `/shows/[slug]` and `/press/epk`; Task 1 keeps the existing Event e2e green.
- **Type consistency:** `Epk`/`EpkPhoto`/`EpkStat`/`EpkTechRider` defined in Task 2 used in Task 3; `buildEventStructuredData({show,url,description,image})` signature defined in Task 1 used identically in Task 3; `siteRoutes.epk` defined in Task 2 used in Tasks 3-4.
- **Verification:** e2e + check + build (no `node:test` on image-importing data).
