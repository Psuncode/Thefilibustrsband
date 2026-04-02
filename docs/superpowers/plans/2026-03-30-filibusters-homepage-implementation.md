# The Filibusters Homepage Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing homepage so the hero reads horizontally, official logo and album assets are used, mobile navigation moves to a bottom icon bar, and the rest of the page feels more intentional without changing the one-page architecture.

**Architecture:** Keep the current Astro homepage composition and data-driven content model. Implement the refinement as a surgical pass: ship only the required brand assets into `public/images/`, extend shared global styles for the revised visual system, then update the existing homepage components section by section. Finish with a production build and responsive manual review focused on the fixed mobile navigation.

**Tech Stack:** Astro, TypeScript, Tailwind CSS, static image assets in `public/images/`

---

## File Structure

These are the files this refinement should touch.

- `public/images/filibusters-logo-text.png` - optimized official text logo used as the header home button and optional supporting stamp
- `public/images/break-up-with-your-boyfriend-cover.jpg` - real album cover used in the release section
- `src/styles/global.css` - shared tokens, bottom-nav spacing, focus styling, and any small utilities for stamped or framed treatments
- `src/components/site/Header.astro` - logo-based header and mobile bottom icon navigation
- `src/components/site/Footer.astro` - footer spacing adjustment to account for the fixed mobile bottom bar if needed
- `src/components/home/HeroSection.astro` - wider horizontal headline layout, framed image, supporting logo stamp
- `src/components/home/LatestReleaseSection.astro` - real artwork framing and icon-led streaming links
- `src/components/home/WhyStickAroundSection.astro` - improved hierarchy and reduced card sameness
- `src/components/home/ShowsPreviewSection.astro` - event-listing visual treatment and spacing refinement
- `src/components/home/PersonalityStripSection.astro` - less generic bordered blocks and improved contrast
- `src/components/home/CommunitySignupSection.astro` - stronger branded callout treatment and bottom spacing
- `src/data/site.ts` - mobile bottom-nav actions, social links, and any labels needed for icon-only controls
- `src/data/release.ts` - release artwork reference and platform metadata if icon rendering needs it

## Task 1: Ship The Real Homepage Assets

**Files:**
- Create: `public/images/filibusters-logo-text.png`
- Modify: `public/images/break-up-with-your-boyfriend-cover.jpg`

- [ ] **Step 1: Inspect the source asset files**

Run:

```bash
ls -1 "Brand Guide and logos" "Band Assest/Website Use"
```

Expected: the official text logo source and the real homepage/release artwork source files are listed

- [ ] **Step 2: Copy the approved text logo into shipped assets**

Run:

```bash
cp "Brand Guide and logos/FILIBUSTERS FINAL-02.png" public/images/filibusters-logo-text.png
```

Expected: `public/images/filibusters-logo-text.png` exists

- [ ] **Step 3: Copy the real album cover into shipped assets**

Run:

```bash
cp "Band Assest/Website Use/Homepage.jpg" public/images/break-up-with-your-boyfriend-cover.jpg
```

Expected: `public/images/break-up-with-your-boyfriend-cover.jpg` exists and replaces the current shipped placeholder-style artwork

- [ ] **Step 4: Verify the new shipped assets are present**

Run:

```bash
ls -l public/images/filibusters-logo-text.png public/images/break-up-with-your-boyfriend-cover.jpg
```

Expected: both files are listed with non-zero sizes

- [ ] **Step 5: Commit**

```bash
git add public/images/filibusters-logo-text.png public/images/break-up-with-your-boyfriend-cover.jpg
git commit -m "feat: add homepage brand assets"
```

## Task 2: Prepare Shared Styling For The Refinement

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Snapshot the current global styles**

Run:

```bash
sed -n '1,220p' src/styles/global.css
```

Expected: existing brand tokens, body styles, and `.focus-ring` helper are shown

- [ ] **Step 2: Write the failing layout expectation**

Run:

```bash
rg -n "bottom-nav-safe|poster-frame|logo-stamp" src/styles/global.css
```

Expected: no matches, confirming the new refinement utilities do not exist yet

- [ ] **Step 3: Extend the global styles with refinement utilities**

Update `src/styles/global.css` to this content:

```css
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-ink: #231f20;
  --color-paper: #ffffff;
  --color-paper-soft: #f7f3e8;
  --color-pink: #ce2067;
  --color-yellow: #ecdb5d;
  --color-muted: #6b6770;
  --color-border: rgba(35, 31, 32, 0.12);
  --color-panel: rgba(255, 255, 255, 0.82);
  --shadow-poster: 0 18px 40px rgba(35, 31, 32, 0.12);
  --shadow-stamp: 0 10px 24px rgba(35, 31, 32, 0.16);
  --bottom-nav-height: 5.5rem;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: var(--color-ink);
  background:
    radial-gradient(circle at top left, rgba(236, 219, 93, 0.18), transparent 24rem),
    linear-gradient(180deg, #fffaf4 0%, var(--color-paper) 22rem);
  font-family: "Inter", system-ui, sans-serif;
}

main {
  padding-bottom: calc(var(--bottom-nav-height) + 1rem);
}

@media (min-width: 768px) {
  main {
    padding-bottom: 0;
  }
}

.display-face {
  font-family: "Archivo Black", "Inter", system-ui, sans-serif;
}

.focus-ring {
  @apply focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4;
  outline-color: var(--color-pink);
}

.poster-frame {
  box-shadow: var(--shadow-poster);
  border: 1px solid rgba(35, 31, 32, 0.12);
  background: rgba(255, 255, 255, 0.92);
}

.logo-stamp {
  box-shadow: var(--shadow-stamp);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(35, 31, 32, 0.1);
}
```

- [ ] **Step 4: Verify the style utilities exist**

Run:

```bash
rg -n "bottom-nav-height|poster-frame|logo-stamp|Archivo Black" src/styles/global.css
```

Expected: matches for the new utilities and font import are returned

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add homepage refinement styles"
```

## Task 3: Replace The Header With Logo Branding And Mobile Bottom Navigation

**Files:**
- Modify: `src/components/site/Header.astro`
- Modify: `src/data/site.ts`

- [ ] **Step 1: Snapshot the current header and site data**

Run:

```bash
sed -n '1,220p' src/components/site/Header.astro
sed -n '1,220p' src/data/site.ts
```

Expected: the current text-based brand link and word-based nav items are shown

- [ ] **Step 2: Write the failing navigation expectation**

Run:

```bash
rg -n "filibusters-logo-text|aria-label=\"Home\"|aria-label=\"Instagram\"|fixed bottom-4" src/components/site/Header.astro src/data/site.ts
```

Expected: no matches, confirming the logo home button and icon-led mobile nav are not implemented yet

- [ ] **Step 3: Add icon metadata and action definitions to site data**

Update `src/data/site.ts` so it exports a mobile action list and keeps social links centralized:

```ts
export const siteMeta = {
  title: "The Filibusters",
  description: "Pop-punk, covers, and chaos worth showing up for.",
  url: "https://thefilibustersband.com",
  contactEmail: "filibustersband@gmail.com"
} as const;

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/thefilibusters/",
    icon: "instagram"
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/4Wv6mktSLS2i6sX2f0Jf9R",
    icon: "spotify"
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@thefilibusters",
    icon: "tiktok"
  }
] as const;

export const primaryNav = [
  { label: "Music", href: "#latest-release", icon: "music" },
  { label: "Shows", href: "#shows", icon: "ticket" },
  { label: "Community", href: "#community", icon: "mail" }
] as const;
```

- [ ] **Step 4: Replace the text header with the logo button and icon mobile nav**

Update `src/components/site/Header.astro` to this structure:

```astro
---
import { primaryNav, socialLinks } from "../../data/site";

const iconPaths = {
  music: "M9 18V5l12-2v13M9 18a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  ticket: "M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5V10a2 2 0 1 0 0 4v2.5A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5V14a2 2 0 1 0 0-4V7.5Z",
  mail: "M4 7h16v10H4V7Zm1.5 1.5 6.5 4.5 6.5-4.5",
  instagram: "M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm8.5 3.5h.01M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  spotify: "M6 9.5c3.7-1.1 8.2-.8 11.8 1M7.2 12.5c2.8-.8 6.2-.5 8.7.9M8.4 15.4c2-.5 4.3-.3 6 .7",
  tiktok: "M14 4c.4 1.7 1.6 3 3.5 3.4V10a6.8 6.8 0 0 1-3.5-1V15a4 4 0 1 1-4-4c.3 0 .7 0 1 .1V8.3a7 7 0 1 0 3 6.7V4Z"
} as const;
---

<header class="sticky top-0 z-30 border-b border-black/10 bg-white/80 backdrop-blur-xl">
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
    <a class="focus-ring inline-flex items-center" aria-label="Home" href="/">
      <img
        alt="The Filibusters"
        class="h-10 w-auto md:h-12"
        height="96"
        src="/images/filibusters-logo-text.png"
        width="320"
      />
    </a>

    <nav aria-label="Primary" class="hidden items-center gap-3 md:flex">
      {primaryNav.map((item) => (
        <a class="focus-ring rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-black/5 hover:text-[var(--color-pink)]" href={item.href}>
          {item.label}
        </a>
      ))}
      {socialLinks.map((item) => (
        <a
          aria-label={item.label}
          class="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[var(--color-ink)] transition hover:border-[var(--color-pink)] hover:text-[var(--color-pink)]"
          href={item.href}
          rel="noreferrer"
          target="_blank"
        >
          <svg aria-hidden="true" class="h-5 w-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
            <path d={iconPaths[item.icon]} />
          </svg>
        </a>
      ))}
    </nav>
  </div>

  <nav aria-label="Mobile quick actions" class="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 items-center justify-between rounded-full border border-black/10 bg-white/90 px-3 py-2 shadow-[var(--shadow-poster)] backdrop-blur md:hidden">
    {primaryNav.map((item) => (
      <a aria-label={item.label} class="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-full text-[var(--color-ink)] transition hover:bg-black/5 hover:text-[var(--color-pink)]" href={item.href}>
        <svg aria-hidden="true" class="h-5 w-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
          <path d={iconPaths[item.icon]} />
        </svg>
      </a>
    ))}
    {socialLinks.map((item) => (
      <a
        aria-label={item.label}
        class="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-full text-[var(--color-ink)] transition hover:bg-black/5 hover:text-[var(--color-pink)]"
        href={item.href}
        rel="noreferrer"
        target="_blank"
      >
        <svg aria-hidden="true" class="h-5 w-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
          <path d={iconPaths[item.icon]} />
        </svg>
      </a>
    ))}
  </nav>
</header>
```

- [ ] **Step 5: Verify the header is logo-led and mobile nav is fixed**

Run:

```bash
rg -n "filibusters-logo-text|Mobile quick actions|aria-label=\"Instagram\"|fixed bottom-4" src/components/site/Header.astro src/data/site.ts
```

Expected: matches confirm the logo asset, icon labels, and fixed mobile navigation are present

- [ ] **Step 6: Commit**

```bash
git add src/components/site/Header.astro src/data/site.ts
git commit -m "feat: refine homepage navigation"
```

## Task 4: Rebuild The Hero And Release Section Around Real Brand Media

**Files:**
- Modify: `src/components/home/HeroSection.astro`
- Modify: `src/components/home/LatestReleaseSection.astro`
- Modify: `src/data/homepage.ts`
- Modify: `src/data/release.ts`

- [ ] **Step 1: Snapshot the current hero, release component, and content data**

Run:

```bash
sed -n '1,220p' src/components/home/HeroSection.astro
sed -n '1,240p' src/components/home/LatestReleaseSection.astro
sed -n '1,220p' src/data/homepage.ts
sed -n '1,220p' src/data/release.ts
```

Expected: the current narrow headline hero and generic rectangular release links are shown

- [ ] **Step 2: Write the failing hero/release expectation**

Run:

```bash
rg -n "logo-stamp|filibusters-logo-text|Break Up With Your Boyfriend|spotify|apple music|youtube music" src/components/home/HeroSection.astro src/components/home/LatestReleaseSection.astro src/data/release.ts
```

Expected: missing or incomplete matches, confirming the refinement has not been applied yet

- [ ] **Step 3: Update the homepage content to support the horizontal hero**

Update `src/data/homepage.ts` to this content:

```ts
export const homepageContent = {
  hero: {
    eyebrow: "The Filibusters",
    headline: "Pop-punk covers, real songs, and just enough chaos.",
    subheadline: "Stream the newest release, catch the next show, and keep up with the band between the noise.",
    primaryCta: { label: "Listen now", href: "#latest-release" },
    secondaryCta: { label: "Join the community", href: "#community" },
    supportingStampLabel: "Official logo stamp"
  },
  reasons: [
    "Original songs with replay value",
    "Covers people actually scream along to",
    "Live sets that feel bigger in person",
    "Band-life chaos worth following"
  ],
  personality: {
    title: "More than one song.",
    items: [
      "Originals that hit hard",
      "Covers and mashups that pull people in",
      "Practice-room chaos, live-show momentum, and actual personality"
    ]
  },
  community: {
    title: "Join the Filibusters community",
    description: "Be first to hear new music, show drops, and everything happening between the chaos."
  }
} as const;
```

- [ ] **Step 4: Update the release data to use the real artwork and icon metadata**

Update `src/data/release.ts` to this structure:

```ts
export const latestRelease = {
  eyebrow: "Latest release",
  title: "Break Up With Your Boyfriend",
  description: "The new Filibusters release brings the same sharp hooks and chaotic energy from the live set into your headphones.",
  artwork: "/images/break-up-with-your-boyfriend-cover.jpg",
  links: [
    { label: "Spotify", href: "https://open.spotify.com/", icon: "spotify" },
    { label: "Apple Music", href: "https://music.apple.com/", icon: "apple" },
    { label: "YouTube Music", href: "https://music.youtube.com/", icon: "play" }
  ]
} as const;
```

- [ ] **Step 5: Replace the hero layout with a horizontal, framed composition**

Update `src/components/home/HeroSection.astro` to this structure:

```astro
---
import { homepageContent } from "../../data/homepage";
---

<section class="border-b border-black/10">
  <div class="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-6 md:py-14">
    <div class="relative flex flex-col justify-center">
      <div class="logo-stamp absolute right-0 top-0 hidden -rotate-3 rounded-2xl px-4 py-3 lg:block">
        <img
          alt={homepageContent.hero.supportingStampLabel}
          class="h-10 w-auto"
          height="48"
          src="/images/filibusters-logo-text.png"
          width="160"
        />
      </div>

      <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">{homepageContent.hero.eyebrow}</p>
      <h1 class="display-face mt-3 max-w-[12ch] text-4xl uppercase leading-[0.95] tracking-[-0.03em] md:max-w-[16ch] md:text-6xl">
        {homepageContent.hero.headline}
      </h1>
      <p class="mt-5 max-w-2xl text-base leading-7 text-[var(--color-muted)] md:text-lg">
        {homepageContent.hero.subheadline}
      </p>

      <div class="mt-7 flex flex-col gap-3 sm:flex-row">
        <a class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-pink)] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:brightness-110" href={homepageContent.hero.primaryCta.href}>
          {homepageContent.hero.primaryCta.label}
        </a>
        <a class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-ink)] bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-ink)] transition hover:bg-[var(--color-yellow)]" href={homepageContent.hero.secondaryCta.href}>
          {homepageContent.hero.secondaryCta.label}
        </a>
      </div>
    </div>

    <div class="poster-frame relative overflow-hidden rounded-[2rem] p-3">
      <img
        alt="The Filibusters posing together in a candid black-and-white band photo."
        class="aspect-[4/5] w-full rounded-[1.25rem] object-cover"
        height="1500"
        src="/images/hero-band.jpg"
        width="1200"
      />
    </div>
  </div>
</section>
```

- [ ] **Step 6: Replace the release section with framed artwork and icon-led actions**

Update `src/components/home/LatestReleaseSection.astro` to this structure:

```astro
---
import { latestRelease } from "../../data/release";

const iconPaths = {
  spotify: "M6 9.5c3.7-1.1 8.2-.8 11.8 1M7.2 12.5c2.8-.8 6.2-.5 8.7.9M8.4 15.4c2-.5 4.3-.3 6 .7",
  apple: "M15.2 12.1c0-2.1 1.7-3.1 1.8-3.2-1-.4-2.5-.5-3.4.6-.8 1-1.4 1.1-1.8 1.1s-1.2-.1-1.8-1c-.8-1-2.2-1.1-3.1-.4-1.7 1.2-2 4-.7 6.1.6 1 1.4 2.1 2.4 2.1.9 0 1.2-.6 2.3-.6s1.4.6 2.3.6c1 0 1.6-.9 2.2-1.9.4-.7.6-1.1.7-1.3-.1 0-1.9-.8-1.9-2.1ZM13.7 6.4c.5-.6.8-1.3.7-2.1-.7 0-1.5.4-2 .9-.5.5-.9 1.3-.8 2 .8.1 1.6-.3 2.1-.8Z",
  play: "M9 7.5v9l7-4.5-7-4.5Z"
} as const;
---

<section id="latest-release" class="bg-[var(--color-ink)] text-white">
  <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[0.85fr_1.15fr] md:px-6 md:py-16">
    <div class="poster-frame overflow-hidden rounded-[2rem] p-3">
      <img
        alt={`${latestRelease.title} cover art`}
        class="w-full rounded-[1.25rem] object-cover"
        height="900"
        src={latestRelease.artwork}
        width="900"
      />
    </div>

    <div class="flex flex-col justify-center">
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-yellow)]">{latestRelease.eyebrow}</p>
      <h2 class="display-face mt-3 text-3xl uppercase leading-[0.95] tracking-[-0.03em] md:text-5xl">
        {latestRelease.title}
      </h2>
      <p class="mt-4 max-w-2xl text-base leading-7 text-white/80">
        {latestRelease.description}
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        {latestRelease.links.map((link) => (
          <a class="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-[var(--color-pink)] hover:bg-[var(--color-pink)]" href={link.href} rel="noreferrer" target="_blank">
            <svg aria-hidden="true" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
              <path d={iconPaths[link.icon]} />
            </svg>
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 7: Verify the hero and release changes exist**

Run:

```bash
rg -n "logo-stamp|filibusters-logo-text|Break Up With Your Boyfriend|rounded-full border border-white/15|display-face" src/components/home/HeroSection.astro src/components/home/LatestReleaseSection.astro src/data/homepage.ts src/data/release.ts
```

Expected: matches confirm the horizontal hero support, real release title/artwork, and icon-led links

- [ ] **Step 8: Commit**

```bash
git add src/components/home/HeroSection.astro src/components/home/LatestReleaseSection.astro src/data/homepage.ts src/data/release.ts
git commit -m "feat: refine homepage hero and release"
```

## Task 5: Refine The Supporting Homepage Sections

**Files:**
- Modify: `src/components/home/WhyStickAroundSection.astro`
- Modify: `src/components/home/ShowsPreviewSection.astro`
- Modify: `src/components/home/PersonalityStripSection.astro`
- Modify: `src/components/home/CommunitySignupSection.astro`
- Modify: `src/components/site/Footer.astro`

- [ ] **Step 1: Snapshot the current supporting sections**

Run:

```bash
sed -n '1,220p' src/components/home/WhyStickAroundSection.astro
sed -n '1,260p' src/components/home/ShowsPreviewSection.astro
sed -n '1,220p' src/components/home/PersonalityStripSection.astro
sed -n '1,260p' src/components/home/CommunitySignupSection.astro
sed -n '1,220p' src/components/site/Footer.astro
```

Expected: the current grid cards, show rows, personality boxes, and community slab are shown

- [ ] **Step 2: Write the failing refinement expectation**

Run:

```bash
rg -n "poster-frame|rounded-\\[2rem\\]|ticket|bottom padding|shadow-\\[var\\(--shadow-poster\\)\\]" src/components/home/WhyStickAroundSection.astro src/components/home/ShowsPreviewSection.astro src/components/home/PersonalityStripSection.astro src/components/home/CommunitySignupSection.astro src/components/site/Footer.astro
```

Expected: minimal or no matches, confirming the supporting sections still use the old treatment

- [ ] **Step 3: Update the supporting sections with cleaner hierarchy**

Update `src/components/home/WhyStickAroundSection.astro`:

```astro
---
import { homepageContent } from "../../data/homepage";
---

<section class="bg-white">
  <div class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
    <div class="max-w-3xl">
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Why people stick around</p>
      <h2 class="display-face mt-3 text-3xl uppercase leading-[0.95] tracking-[-0.03em] md:text-5xl">
        Originals, covers, shows, and actual personality.
      </h2>
    </div>
    <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {homepageContent.reasons.map((reason, index) => (
        <div class:list={["poster-frame rounded-[1.75rem] p-5", index % 2 === 0 ? "bg-white" : "bg-[var(--color-paper-soft)]"]}>
          <p class="text-base font-semibold leading-6">{reason}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

Update `src/components/home/ShowsPreviewSection.astro`:

```astro
---
import { upcomingShows } from "../../data/shows";
---

<section id="shows" class="bg-[var(--color-paper-soft)]">
  <div class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
    <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div class="max-w-3xl">
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Shows</p>
        <h2 class="display-face mt-3 text-3xl uppercase leading-[0.95] tracking-[-0.03em] md:text-5xl">
          Come see what the chaos looks like in person.
        </h2>
      </div>
    </div>
    <div class="mt-8 grid gap-4">
      {upcomingShows.length > 0 ? (
        upcomingShows.map((show) => (
          <article class="poster-frame grid gap-4 rounded-[1.75rem] p-5 md:grid-cols-[0.24fr_1fr_auto] md:items-center">
            <p class="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-pink)]">{show.date}</p>
            <div>
              <h3 class="text-xl font-black uppercase">{show.venue}</h3>
              <p class="text-sm text-[var(--color-muted)]">{show.city}</p>
            </div>
            <a class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-pink)]" href={show.href}>
              {show.ctaLabel}
            </a>
          </article>
        ))
      ) : (
        <article class="poster-frame grid gap-4 rounded-[1.75rem] p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h3 class="text-xl font-black uppercase">No shows announced yet</h3>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
              Join the community and we&apos;ll make sure you hear about the next live date as soon as it lands.
            </p>
          </div>
          <a class="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-pink)]" href="#community">
            Get show alerts
          </a>
        </article>
      )}
    </div>
  </div>
</section>
```

Update `src/components/home/PersonalityStripSection.astro`:

```astro
---
import { homepageContent } from "../../data/homepage";
---

<section class="bg-[var(--color-ink)] text-white">
  <div class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
    <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-yellow)]">Band life</p>
    <h2 class="display-face mt-3 max-w-3xl text-3xl uppercase leading-[0.95] tracking-[-0.03em] md:text-5xl">
      {homepageContent.personality.title}
    </h2>
    <div class="mt-8 grid gap-4 md:grid-cols-3">
      {homepageContent.personality.items.map((item, index) => (
        <div class:list={["rounded-[1.75rem] border p-5", index === 1 ? "border-[var(--color-pink)] bg-[var(--color-pink)]/10" : "border-white/15 bg-white/5"]}>
          <p class="text-base leading-7 text-white/85">{item}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

Update `src/components/home/CommunitySignupSection.astro`:

```astro
---
import { homepageContent } from "../../data/homepage";
import { siteMeta } from "../../data/site";

const formAction = import.meta.env.PUBLIC_COMMUNITY_FORM_ACTION;
const hasFormAction = Boolean(formAction);
const fallbackHref = `mailto:${siteMeta.contactEmail}?subject=Join%20the%20Filibusters%20community`;
---

<section id="community" class="bg-white">
  <div class="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
    <div class="poster-frame rounded-[2rem] bg-[var(--color-yellow)] p-6 md:p-10">
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-pink)]">Community</p>
      <h2 class="display-face mt-3 text-3xl uppercase leading-[0.95] tracking-[-0.03em] md:text-5xl">
        {homepageContent.community.title}
      </h2>
      <p class="mt-4 max-w-2xl text-base leading-7 text-[var(--color-ink)]/80">
        {homepageContent.community.description}
      </p>
      {hasFormAction ? (
        <form class="mt-6 flex flex-col gap-3 md:flex-row" action={formAction} method="POST" novalidate>
          <div class="flex-1">
            <label class="mb-2 block text-sm font-semibold" for="email">Email address</label>
            <input
              class="min-h-11 w-full rounded-full border border-[var(--color-ink)] bg-white px-4 py-3 text-base text-[var(--color-ink)]"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
            />
          </div>
          <button class="focus-ring min-h-11 self-end rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-pink)]" type="submit">
            Join the community
          </button>
        </form>
      ) : (
        <div class="mt-6 rounded-[1.5rem] border border-[var(--color-ink)] bg-white p-4">
          <p class="text-sm leading-6 text-[var(--color-ink)]/80">
            Community signup is being wired up right now. Use email for updates instead of a form submission.
          </p>
          <a class="focus-ring mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-pink)]" href={fallbackHref}>
            Email for updates
          </a>
        </div>
      )}
    </div>
  </div>
</section>
```

Update `src/components/site/Footer.astro` only as needed so the footer retains comfortable spacing above the mobile bottom nav and does not duplicate the primary mobile actions.

- [ ] **Step 4: Verify the supporting section treatments exist**

Run:

```bash
rg -n "display-face|poster-frame|rounded-\\[1.75rem\\]|rounded-full bg-\\[var\\(--color-ink\\)\\]" src/components/home/WhyStickAroundSection.astro src/components/home/ShowsPreviewSection.astro src/components/home/PersonalityStripSection.astro src/components/home/CommunitySignupSection.astro
```

Expected: matches confirm the revised hierarchy and less-generic card treatments

- [ ] **Step 5: Commit**

```bash
git add src/components/home/WhyStickAroundSection.astro src/components/home/ShowsPreviewSection.astro src/components/home/PersonalityStripSection.astro src/components/home/CommunitySignupSection.astro src/components/site/Footer.astro
git commit -m "feat: refine homepage sections"
```

## Task 6: Verify The Refined Homepage

**Files:**
- Modify: none

- [ ] **Step 1: Build the site**

Run:

```bash
npm run build
```

Expected: Astro build completes successfully with no errors

- [ ] **Step 2: Run the local dev server for manual review**

Run:

```bash
npm run dev
```

Expected: local Astro server starts and prints a localhost URL

- [ ] **Step 3: Manually review the homepage at mobile and desktop widths**

Check:

```text
375px: hero headline reads horizontally enough, bottom nav is visible, no horizontal scroll, community section is not obscured
768px: header switches cleanly, hero and release grids balance correctly
1024px+: desktop header feels light, logo remains readable, supporting stamp does not clutter the hero
```

Expected: all checks pass without overlap, clipping, or inaccessible icon-only actions

- [ ] **Step 4: Inspect the final diff**

Run:

```bash
git status --short
git diff --stat
```

Expected: only the planned homepage refinement files appear

- [ ] **Step 5: Commit**

```bash
git add public/images src/components src/data src/styles
git commit -m "feat: refine homepage presentation"
```
