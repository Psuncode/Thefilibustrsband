# Contact GEO Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add sitewide footer GEO reinforcement and refine `/contact` copy, metadata, schema, and mobile readability without introducing a full contact-form flow.

**Architecture:** Keep shared entity facts in `src/data/site.ts`, use `src/data/contact.ts` as the source of truth for contact-page copy, update the shared `BaseLayout` schema for stronger `MusicGroup` locality/contact information, and make the shared `Footer` render a compact factual GEO line on every page. The `/contact` route should keep the existing structure, but the redundant “primary contact” block should become more useful instead of simply repeating the general card.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, existing shared layout/components, JSON-LD in `BaseLayout.astro`

---

## File Structure

- Modify: `src/data/site.ts`
  - Add reusable band-location facts and contact-point metadata that support footer/schema updates.
- Modify: `src/data/contact.ts`
  - Refine hero copy, inquiry-path copy, and primary-contact section content to include GEO and non-redundant value.
- Modify: `src/layouts/BaseLayout.astro`
  - Strengthen shared `MusicGroup` structured data and, if needed, support a more specific contact-page description.
- Modify: `src/components/site/Footer.astro`
  - Add the compact sitewide GEO line.
- Modify: `src/pages/contact.astro`
  - Apply the refined copy, clarify mailto behavior, and fix mobile hero sizing/readability.

## Constraints And Verification Notes

- No form backend or third-party submission service in this slice.
- `mailto:` remains the contact mechanism.
- Required verification:
  - `npm run build`
  - manual inspection in `npm run dev`
  - explicit visual check around `375px` width on `/contact`
- Blockers:
  - mobile heading overflow or broken wrapping
  - horizontal scroll
  - redundant section still repeating the same information without added value
  - missing location signal in footer/contact/schema

### Task 1: Centralize GEO Facts In Shared Site Data

**Files:**
- Modify: `src/data/site.ts`

- [ ] **Step 1: Add reusable location and service-area facts near `siteMeta`**

Insert shared facts near `siteMeta`:

```ts
export const bandFacts = {
  location: {
    city: "Provo",
    region: "Utah",
    display: "Provo, Utah"
  },
  geoLine: "The Filibusters are an alt rock band based in Provo, Utah.",
  serviceArea: "Provo, across Utah, and beyond"
} as const;
```

- [ ] **Step 2: Add reusable contact-point metadata for schema expansion**

Add:

```ts
export const contactPoints = [
  {
    contactType: "booking",
    email: siteMeta.contactEmail
  },
  {
    contactType: "press",
    email: siteMeta.contactEmail
  },
  {
    contactType: "general",
    email: siteMeta.contactEmail
  }
] as const;
```

- [ ] **Step 3: Verify the shared data still builds**

Run: `npm run build`

Expected:
- Astro build exits with code `0`
- no TypeScript errors from `src/data/site.ts`

- [ ] **Step 4: Commit the shared data change**

```bash
git add src/data/site.ts
git commit -m "feat: add shared geo and contact metadata"
```

### Task 2: Refine Contact Page Copy In Data

**Files:**
- Modify: `src/data/contact.ts`

- [ ] **Step 1: Update the hero copy to include location and booking relevance**

Refine the `hero` object to a more specific shape:

```ts
hero: {
  eyebrow: "Contact",
  title: "Reach the band for bookings, press, and everything else.",
  description:
    "Contact The Filibusters for bookings, press, and general inquiries. Based in Provo, Utah and available for shows regionally and beyond."
}
```

- [ ] **Step 2: Refine inquiry path copy to add location context and clearer email behavior**

Update at least the booking path description and CTA labels:

```ts
paths: [
  {
    title: "Booking",
    description: "For shows, events, and live performance requests in Provo, across Utah, and beyond.",
    email: contactEmail,
    ctaLabel: "Email booking"
  },
  {
    title: "Press",
    description: "For interviews, media requests, and press coverage.",
    email: contactEmail,
    ctaLabel: "Email press"
  },
  {
    title: "General",
    description: "For fan mail, questions, and anything that does not fit the other lanes.",
    email: contactEmail,
    ctaLabel: "Email general"
  }
]
```

- [ ] **Step 3: Repurpose the primary-contact section so it adds distinct value**

Update the `primary` object to give the section a unique purpose:

```ts
primary: {
  label: "Before you send it",
  title: "A little context helps.",
  emailLabel: "Primary email",
  email: contactEmail,
  note: "If you are reaching out about a show, press request, or collaboration, include the date, location, timeline, and any relevant links so the band can respond more quickly."
}
```

- [ ] **Step 4: Make the social section clearly secondary**

Refine the social object:

```ts
social: {
  eyebrow: "Elsewhere",
  title: "Follow the band outside your inbox.",
  note: "For quicker updates between emails, keep up with The Filibusters on social."
}
```

- [ ] **Step 5: Verify the refined data builds**

Run: `npm run build`

Expected:
- Astro build exits with code `0`
- no TypeScript errors from `src/data/contact.ts`

- [ ] **Step 6: Commit the contact data refinement**

```bash
git add src/data/contact.ts
git commit -m "feat: refine contact page copy and geo context"
```

### Task 3: Strengthen Shared Schema And Metadata

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/data/site.ts`

- [ ] **Step 1: Import the new shared facts and contact points into `BaseLayout.astro`**

Update the imports:

```astro
import { bandFacts, contactPoints, siteMeta, socialLinks } from "../data/site";
```

- [ ] **Step 2: Expand the `MusicGroup` JSON-LD with locality and contact points**

Update the `MusicGroup` entry in `structuredData`:

```ts
{
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: siteMeta.title,
  description: siteMeta.description,
  url: siteMeta.url,
  email: siteMeta.contactEmail,
  image: ogImage.href,
  sameAs: socialLinks.map(({ href }) => href),
  address: {
    "@type": "PostalAddress",
    addressLocality: bandFacts.location.city,
    addressRegion: bandFacts.location.region
  },
  contactPoint: contactPoints.map((point) => ({
    "@type": "ContactPoint",
    email: point.email,
    contactType: point.contactType
  }))
}
```

- [ ] **Step 3: Verify the shared layout still builds**

Run: `npm run build`

Expected:
- Astro build exits with code `0`
- pages emit valid build output without serialization errors

- [ ] **Step 4: Commit the schema refinement**

```bash
git add src/layouts/BaseLayout.astro src/data/site.ts
git commit -m "feat: add location and contact points to schema"
```

### Task 4: Add The Shared Footer GEO Line

**Files:**
- Modify: `src/components/site/Footer.astro`
- Modify: `src/data/site.ts` if the footer copy is read from shared facts

- [ ] **Step 1: Inspect the current footer structure and add the geo line in a secondary position**

Add a compact factual line using shared data, shaped like:

```astro
<p class="mt-4 text-sm leading-6 text-[var(--color-ink)]/64">
  {bandFacts.geoLine}
</p>
```

Place it so it supports existing footer content rather than competing with it.

- [ ] **Step 2: Verify the footer change builds**

Run: `npm run build`

Expected:
- Astro build exits with code `0`
- no footer import/type errors

- [ ] **Step 3: Commit the footer update**

```bash
git add src/components/site/Footer.astro src/data/site.ts
git commit -m "feat: add sitewide footer geo line"
```

### Task 5: Refine The Contact Route Layout And Mobile Readability

**Files:**
- Modify: `src/pages/contact.astro`
- Optional modify: `src/styles/global.css` only if utility classes are not enough

- [ ] **Step 1: Reduce mobile hero overflow risk with a responsive heading size**

Adjust the contact-page H1 classes from a fixed mobile `text-4xl md:text-6xl` style to a clamp or smaller responsive scale. One acceptable utility-first version:

```astro
<h1 class="display-face mt-3 text-[clamp(2.1rem,8vw,3.75rem)] uppercase leading-[1.02] tracking-[-0.04em]">
  {contactPage.hero.title}
</h1>
```
```

- [ ] **Step 2: Make `mailto:` behavior clearer in the inquiry cards**

Add lightweight helper text beneath each card CTA:

```astro
<p class="mt-3 text-xs leading-5 text-[var(--color-ink)]/58">
  Opens your email app with the subject line filled in.
</p>
```

- [ ] **Step 3: Ensure the repurposed primary-contact section adds unique value**

Keep the dark section, but make it clearly different from the general card by rendering the updated `primary` content as guidance rather than a duplicate lane choice.

- [ ] **Step 4: Visually de-emphasize the social section**

Keep the section but ensure it reads as secondary. Acceptable adjustments:
- lighter heading/eyebrow language from data
- maintain current card grid but avoid making it feel like the page’s main CTA

- [ ] **Step 5: Verify the full slice in build and local dev**

Run: `npm run build`

Then run: `npm run dev`

Expected manual checks:
- `/contact` hero wraps cleanly at approximately `375px`
- no horizontal scroll
- footer GEO line appears on `/`, `/about`, and `/contact`
- contact page mentions Provo, Utah in visible copy
- inquiry CTA helper text makes `mailto:` behavior clearer

- [ ] **Step 6: Commit the contact route refinement**

```bash
git add src/pages/contact.astro src/components/site/Footer.astro src/layouts/BaseLayout.astro src/data/contact.ts src/data/site.ts
git commit -m "feat: refine contact geo and footer context"
```

## Self-Review

### Spec Coverage Check

- shared footer GEO line: Task 4
- contact-page location context: Task 2 and Task 5
- metadata/schema refinement: Task 3
- mobile hero readability: Task 5
- reduced section redundancy: Task 2 and Task 5
- no full form added: preserved by scope

### Placeholder Scan

No `TODO`, `TBD`, or vague “handle later” instructions remain in the implementation tasks.

### Type Consistency Check

- `bandFacts` and `contactPoints` are referenced consistently between `site.ts`, `BaseLayout.astro`, and `Footer.astro`
- `contactPage` continues to hold page copy in `contact.ts`
- route and layout changes remain aligned with existing Astro component imports

