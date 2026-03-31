# About + Contact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build new `/about` and `/contact` pages, expose them in primary navigation, and add a structured band identity + outreach flow without changing the homepage’s emotional focus.

**Architecture:** Add two new data modules, `src/data/about.ts` and `src/data/contact.ts`, then build one Astro page per route using the existing `BaseLayout`, shared header/footer, and current visual language. Keep copy and member metadata in data files, render member photos through `astro:assets`, and use `npm run build` plus manual responsive checks for verification because there is no automated test suite configured.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, `astro:assets`, existing global CSS tokens/utilities

---

## File Structure

- Create: `src/data/about.ts`
  - Canonical copy, facts, member metadata, similar artists, FAQ, and CTA links for `/about`
- Create: `src/data/contact.ts`
  - Canonical outreach copy and inquiry-path data for `/contact`
- Create: `src/pages/about.astro`
  - About route using shared shell plus on-page sections
- Create: `src/pages/contact.astro`
  - Contact route using shared shell plus inquiry cards
- Modify: `src/data/site.ts`
  - Add `About` and `Contact` to primary navigation and refine site metadata if needed
- Optional modify: `src/styles/global.css`
  - Only if a repeated layout treatment cannot stay readable as utility classes

## Constraints And Verification Notes

- `package.json` only provides `npm run dev`, `npm run build`, and `npm run preview`
- There is no automated unit/integration test runner configured
- Required verification for this slice:
  - `npm run build`
  - manual browser review in `npm run dev`
  - responsive check around `375px` width
- Blockers:
  - horizontal scroll
  - missing member images
  - unreadable text overlays
  - broken navigation links

### Task 1: Add Canonical About Page Data

**Files:**
- Create: `src/data/about.ts`

- [ ] **Step 1: Create the About page data types and import member images**

Create `src/data/about.ts` with imports and types:

```ts
import atticusPhoto from "../assets/images/atticus wintch — bassist.jpg";
import curtisPhoto from "../assets/images/curtis schnitzer drummer.jpg";
import hannaPhoto from "../assets/images/hanna eyre vocalist.jpg";
import thomasPhoto from "../assets/images/thomas wintch.jpg";

type AboutMember = {
  name: string;
  role: string;
  photo: ImageMetadata;
  alt: string;
};

type AboutFaq = {
  question: string;
  answer: string;
};

type AboutArtistReference = {
  name: string;
};
```

- [ ] **Step 2: Add the canonical About content object**

Continue `src/data/about.ts` with one exported object:

```ts
export const aboutPage = {
  hero: {
    eyebrow: "About The Filibusters",
    title: "Alt rock for the ones still figuring it out.",
    description:
      "The Filibusters are a Provo, Utah band making emotionally driven alt rock built for loud rooms, real connection, and songs that stay with people after the set ends."
  },
  definition: {
    title: "What Is The Filibusters?",
    intro:
      "The Filibusters are an alt rock band based in Provo, Utah, known for high-energy live shows and emotionally driven songs.",
    body:
      "Their music centers on connection, identity, and belonging, balancing cathartic live energy with lyrics that meet people in the middle of the mess."
  },
  quickFacts: [
    { label: "Based in", value: "Provo, Utah" },
    { label: "Genre", value: "Alt rock" },
    { label: "Known for", value: "High-energy live shows" },
    { label: "Themes", value: "Connection, identity, belonging" }
  ],
  members: [
    {
      name: "Hanna Eyre",
      role: "Vocalist",
      photo: hannaPhoto,
      alt: "Hanna Eyre of The Filibusters."
    },
    {
      name: "Thomas Wintch",
      role: "Guitarist",
      photo: thomasPhoto,
      alt: "Thomas Wintch of The Filibusters."
    },
    {
      name: "Atticus Wintch",
      role: "Bassist",
      photo: atticusPhoto,
      alt: "Atticus Wintch of The Filibusters."
    },
    {
      name: "Curtis Schnitzer",
      role: "Percussionist",
      photo: curtisPhoto,
      alt: "Curtis Schnitzer of The Filibusters."
    }
  ],
  story: {
    title: "Why it hits",
    paragraphs: [
      "The Filibusters make music for people who want something honest enough to feel and loud enough to carry home with them.",
      "The band leans into the emotional mess instead of sanding it down, building songs and sets that feel immediate, communal, and alive."
    ]
  },
  similarArtists: [
    { name: "Paramore" },
    { name: "Arctic Monkeys" },
    { name: "The 1975" }
  ],
  faq: [
    {
      question: "What genre is The Filibusters?",
      answer: "The Filibusters are an alt rock band."
    },
    {
      question: "Where is The Filibusters based?",
      answer: "The Filibusters are based in Provo, Utah."
    },
    {
      question: "What are The Filibusters known for?",
      answer: "They are known for high-energy live shows and emotionally driven songs."
    },
    {
      question: "Are The Filibusters playing shows?",
      answer: "Yes. Check the shows section on the homepage for currently listed dates."
    },
    {
      question: "What bands are similar to The Filibusters?",
      answer: "Fans may connect with The Filibusters through artists like Paramore, Arctic Monkeys, and The 1975."
    }
  ],
  ctas: {
    primary: { label: "Listen now", href: "/listen" },
    secondary: { label: "See shows", href: "/#shows" },
    tertiary: { label: "Contact the band", href: "/contact" }
  }
} as const;
```

- [ ] **Step 3: Verify the data module builds cleanly**

Run: `npm run build`

Expected:
- Astro build exits with code `0`
- No TypeScript errors from `src/data/about.ts`

- [ ] **Step 4: Commit the data module**

```bash
git add src/data/about.ts
git commit -m "feat: add about page content model"
```

### Task 2: Add Canonical Contact Page Data

**Files:**
- Create: `src/data/contact.ts`

- [ ] **Step 1: Create the contact data types**

Create `src/data/contact.ts` with focused types:

```ts
type ContactPath = {
  title: string;
  description: string;
  email: string;
  ctaLabel: string;
};
```

- [ ] **Step 2: Add the exported Contact content object**

Add the canonical page copy:

```ts
import { siteMeta } from "./site";

export const contactPage = {
  hero: {
    eyebrow: "Contact",
    title: "Get in touch with The Filibusters.",
    description:
      "Reach out for booking, press, collaborations, or general questions."
  },
  paths: [
    {
      title: "Booking",
      description: "Live show inquiries, venue outreach, and performance opportunities.",
      email: siteMeta.contactEmail,
      ctaLabel: "Email about booking"
    },
    {
      title: "Press",
      description: "Interviews, media requests, and coverage inquiries.",
      email: siteMeta.contactEmail,
      ctaLabel: "Email for press"
    },
    {
      title: "General",
      description: "Questions, collaborations, and anything else that does not fit the other buckets.",
      email: siteMeta.contactEmail,
      ctaLabel: "Send a general email"
    }
  ],
  primary: {
    label: "Primary email",
    email: siteMeta.contactEmail,
    note: "Include what you are reaching out about, the timeline, and any relevant links so the band can respond quickly."
  },
  socialsNote:
    "For lighter-weight follow-ups, you can also reach the band through the social platforms linked below."
} as const;
```

- [ ] **Step 3: Verify the contact module builds cleanly**

Run: `npm run build`

Expected:
- Astro build exits with code `0`
- No TypeScript errors from `src/data/contact.ts`

- [ ] **Step 4: Commit the data module**

```bash
git add src/data/contact.ts
git commit -m "feat: add contact page content model"
```

### Task 3: Build The About Route

**Files:**
- Create: `src/pages/about.astro`
- Modify: `src/styles/global.css` only if repeated classes become unwieldy

- [ ] **Step 1: Create the route shell with shared layout and imported page data**

Start `src/pages/about.astro` like this:

```astro
---
import { Image } from "astro:assets";
import Footer from "../components/site/Footer.astro";
import Header from "../components/site/Header.astro";
import BaseLayout from "../layouts/BaseLayout.astro";
import { aboutPage } from "../data/about";
import { siteMeta } from "../data/site";
---

<BaseLayout
  title={`About | ${siteMeta.title}`}
  description={aboutPage.definition.intro}
>
  <Header />
  <main id="main-content" class="mobile-nav-offset">
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Add the hero and GEO definition sections**

Inside `<main>`, add the opening sections:

```astro
<section class="border-b border-black/10">
  <div class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
    <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">
      {aboutPage.hero.eyebrow}
    </p>
    <h1 class="display-face mt-3 max-w-4xl text-4xl uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
      {aboutPage.hero.title}
    </h1>
    <p class="mt-5 max-w-3xl text-base leading-7 text-[var(--color-ink)]/78 md:text-lg md:leading-8">
      {aboutPage.hero.description}
    </p>
    <div class="mt-7 flex flex-col gap-3 sm:flex-row">
      <a class="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-pink)] px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white" href={aboutPage.ctas.primary.href}>
        {aboutPage.ctas.primary.label}
      </a>
      <a class="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-black/12 bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-ink)]" href={aboutPage.ctas.tertiary.href}>
        {aboutPage.ctas.tertiary.label}
      </a>
    </div>
  </div>
</section>

<section class="bg-[var(--color-paper-soft)]">
  <div class="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[1.15fr_0.85fr]">
    <div class="poster-frame rounded-[2rem] p-6 md:p-8">
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">
        {aboutPage.definition.title}
      </p>
      <p class="mt-4 text-lg font-semibold leading-8 text-[var(--color-ink)]">
        {aboutPage.definition.intro}
      </p>
      <p class="mt-4 text-base leading-7 text-[var(--color-ink)]/74">
        {aboutPage.definition.body}
      </p>
    </div>
    <div class="grid gap-4">
      {aboutPage.quickFacts.map((fact) => (
        <div class="poster-frame rounded-[1.5rem] p-5">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">{fact.label}</p>
          <p class="mt-3 text-lg font-semibold leading-7 text-[var(--color-ink)]">{fact.value}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add the member strip, story, similar artists, FAQ, and CTA band**

Append the remaining sections:

```astro
<section class="bg-white">
  <div class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
    <div class="flex flex-col gap-3">
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Meet the band</p>
      <h2 class="display-face text-3xl uppercase leading-[0.95] tracking-[-0.03em] md:text-5xl">
        The people making the noise.
      </h2>
    </div>
    <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {aboutPage.members.map((member) => (
        <article class="poster-frame overflow-hidden rounded-[1.75rem]">
          <Image
            alt={member.alt}
            class="aspect-[4/5] w-full object-cover object-center"
            src={member.photo}
            widths={[480, 720]}
            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw"
          />
          <div class="p-5">
            <h3 class="text-xl font-black uppercase">{member.name}</h3>
            <p class="mt-2 text-sm uppercase tracking-[0.12em] text-[var(--color-muted)]">{member.role}</p>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

<section class="bg-[var(--color-ink)] text-white">
  <div class="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[1.1fr_0.9fr]">
    <div>
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-yellow)]">{aboutPage.story.title}</p>
      {aboutPage.story.paragraphs.map((paragraph) => (
        <p class="mt-4 max-w-3xl text-base leading-7 text-white/82 md:text-lg md:leading-8">{paragraph}</p>
      ))}
    </div>
    <div class="grid gap-4">
      <div class="rounded-[1.75rem] border border-white/12 bg-white/6 p-5">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-yellow)]">Similar artists</p>
        <div class="mt-4 flex flex-wrap gap-2">
          {aboutPage.similarArtists.map((artist) => (
            <span class="rounded-full border border-white/16 px-4 py-2 text-sm font-semibold text-white/88">
              {artist.name}
            </span>
          ))}
        </div>
      </div>
      <div class="rounded-[1.75rem] border border-white/12 bg-white/6 p-5">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-yellow)]">FAQ</p>
        <div class="mt-4 space-y-4">
          {aboutPage.faq.map((item) => (
            <div>
              <h3 class="text-sm font-bold uppercase tracking-[0.12em] text-white">{item.question}</h3>
              <p class="mt-2 text-sm leading-6 text-white/74">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bg-[var(--color-paper-soft)]">
  <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 md:px-6 md:py-16 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">What next</p>
      <h2 class="display-face mt-3 text-3xl uppercase leading-[0.95] tracking-[-0.03em] md:text-5xl">
        Stay close to the band.
      </h2>
    </div>
    <div class="flex flex-col gap-3 sm:flex-row">
      <a class="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white" href={aboutPage.ctas.primary.href}>
        {aboutPage.ctas.primary.label}
      </a>
      <a class="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-black/12 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-ink)]" href={aboutPage.ctas.secondary.href}>
        {aboutPage.ctas.secondary.label}
      </a>
      <a class="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-black/12 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-ink)]" href={aboutPage.ctas.tertiary.href}>
        {aboutPage.ctas.tertiary.label}
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Verify the route renders without build errors**

Run: `npm run build`

Expected:
- Astro build exits with code `0`
- `dist/about/index.html` is generated

- [ ] **Step 5: Commit the About route**

```bash
git add src/pages/about.astro src/data/about.ts
git commit -m "feat: add about page"
```

### Task 4: Build The Contact Route

**Files:**
- Create: `src/pages/contact.astro`
- Create: `src/data/contact.ts`

- [ ] **Step 1: Create the route shell and import shared data**

Start `src/pages/contact.astro`:

```astro
---
import Footer from "../components/site/Footer.astro";
import Header from "../components/site/Header.astro";
import BaseLayout from "../layouts/BaseLayout.astro";
import { contactPage } from "../data/contact";
import { siteMeta, socialLinks } from "../data/site";
---

<BaseLayout
  title={`Contact | ${siteMeta.title}`}
  description={contactPage.hero.description}
>
  <Header />
  <main id="main-content" class="mobile-nav-offset">
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Add the hero, inquiry cards, and email block**

Inside `<main>`, add:

```astro
<section class="border-b border-black/10">
  <div class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
    <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">
      {contactPage.hero.eyebrow}
    </p>
    <h1 class="display-face mt-3 max-w-4xl text-4xl uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
      {contactPage.hero.title}
    </h1>
    <p class="mt-5 max-w-3xl text-base leading-7 text-[var(--color-ink)]/78 md:text-lg md:leading-8">
      {contactPage.hero.description}
    </p>
  </div>
</section>

<section class="bg-[var(--color-paper-soft)]">
  <div class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
    <div class="grid gap-4 lg:grid-cols-3">
      {contactPage.paths.map((path) => (
        <article class="poster-frame rounded-[1.75rem] p-6">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">{path.title}</p>
          <p class="mt-4 text-base leading-7 text-[var(--color-ink)]/74">{path.description}</p>
          <a
            class="focus-ring mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white"
            href={`mailto:${path.email}?subject=${encodeURIComponent(`${path.title} inquiry`)}`}
          >
            {path.ctaLabel}
          </a>
        </article>
      ))}
    </div>

    <div class="poster-frame mt-8 rounded-[2rem] p-6 md:p-8">
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">{contactPage.primary.label}</p>
      <a class="mt-4 inline-block text-xl font-black text-[var(--color-ink)] underline decoration-[var(--color-pink)] decoration-2 underline-offset-4" href={`mailto:${contactPage.primary.email}`}>
        {contactPage.primary.email}
      </a>
      <p class="mt-4 max-w-2xl text-base leading-7 text-[var(--color-ink)]/74">{contactPage.primary.note}</p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add the secondary social follow section**

Append a lightweight footer section:

```astro
<section class="bg-white">
  <div class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
    <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Elsewhere</p>
    <p class="mt-4 max-w-2xl text-base leading-7 text-[var(--color-ink)]/74">
      {contactPage.socialsNote}
    </p>
    <div class="mt-6 flex flex-wrap gap-3">
      {socialLinks.map((link) => (
        <a
          class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-black/12 bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-ink)]"
          href={link.href}
          rel="noreferrer"
          target="_blank"
        >
          {link.label}
        </a>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Verify the route renders without build errors**

Run: `npm run build`

Expected:
- Astro build exits with code `0`
- `dist/contact/index.html` is generated

- [ ] **Step 5: Commit the Contact route**

```bash
git add src/pages/contact.astro src/data/contact.ts
git commit -m "feat: add contact page"
```

### Task 5: Expose The New Pages In Navigation And Verify UX

**Files:**
- Modify: `src/data/site.ts`
- Optional modify: `src/layouts/BaseLayout.astro` only if page descriptions need route-specific refinement later

- [ ] **Step 1: Update primary navigation to include About and Contact**

Modify `primaryNav` in `src/data/site.ts`:

```ts
export const primaryNav = [
  { label: "About", href: "/about", icon: "music" },
  { label: "Music", href: "/#latest-release", icon: "music" },
  { label: "Shows", href: "/#shows", icon: "ticket" },
  { label: "Contact", href: "/contact", icon: "mail" }
] as const satisfies readonly PrimaryNavItem[];
```

- [ ] **Step 2: Run a production build to verify route generation**

Run: `npm run build`

Expected:
- Astro build exits with code `0`
- route output includes homepage plus `about` and `contact`

- [ ] **Step 3: Run the local dev server and manually verify both new pages**

Run: `npm run dev`

Expected manual checks:
- `/about` and `/contact` load without console errors
- header navigation links work on desktop and mobile
- no horizontal scroll at approximately `375px` width
- member photos display with intentional crop
- CTA buttons remain legible and clickable

- [ ] **Step 4: Commit the navigation update after verification**

```bash
git add src/data/site.ts src/pages/about.astro src/pages/contact.astro
git commit -m "feat: add about and contact navigation"
```

## Self-Review

### Spec Coverage Check

- `/about` page: covered by Task 1 and Task 3
- `/contact` page: covered by Task 2 and Task 4
- primary navigation updates: covered by Task 5
- member strip with photos, names, roles: covered by Task 1 and Task 3
- GEO-friendly factual content off homepage: covered by Task 1 and Task 3
- email-first outreach flow: covered by Task 2 and Task 4
- `/press` deferred and not added to nav: preserved by omission in Task 5

### Placeholder Scan

No `TODO`, `TBD`, or “implement later” language remains in the executable tasks.

### Type Consistency Check

- `aboutPage` naming is consistent between `src/data/about.ts` and `src/pages/about.astro`
- `contactPage` naming is consistent between `src/data/contact.ts` and `src/pages/contact.astro`
- member objects consistently use `name`, `role`, `photo`, and `alt`
- CTA objects consistently use `label` and `href`

