# Astro Modernization Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt the Astro integrations and config the multi-skill audit flagged as missing — Vercel adapter, official sitemap integration with real per-URL `lastmod`, Sanity CDN image-service configuration, `<Image>` migration on community pages, `astro check` script, and pinned Node version.

**Architecture:** Surgical config + dependency changes. Replace the hand-rolled `src/pages/sitemap.xml.ts` with `@astrojs/sitemap` configured via a `serialize` hook that injects real `lastmod` from `post.publishedAt` (community) and `show.startsAt` (shows). Add `image.remotePatterns` for `cdn.sanity.io` so `<Image>` can process Sanity URLs. The show-flyer migration to `<Image>` is deliberately **deferred** because the flyer URL flows through `flyerUrl: imported.src` in `src/data/shows.ts` — refactoring to pass `ImageMetadata` through is a bigger change for a future phase.

**Tech Stack:** Astro 5.5 (already), `@astrojs/vercel` (new), `@astrojs/sitemap` (new), `@sanity/client` (existing), Tailwind 3.4, Vercel.

**Out of Scope** (deferred to other phases):
- Content collections migration for community + shows.
- Astro Fonts API (self-hosted Google Fonts).
- `vercel.ts` migration from `vercel.json`.
- CSP nonce work.
- Show-flyer `<img>` → `<Image>` migration (requires refactoring `src/data/shows.ts` to retain `ImageMetadata`).

---

## File Map

**Modify:**
- `astro.config.mjs` — add `@astrojs/vercel` adapter, `@astrojs/sitemap` integration with `serialize`, `image.service` + `image.remotePatterns`.
- `package.json` — add `@astrojs/vercel` + `@astrojs/sitemap` deps, add `"check": "astro check"` script, add `"engines": { "node": "24.x" }`.
- `src/lib/community/queries.ts` — extend the Sanity query to project `heroImageWidth` / `heroImageHeight` from `heroImage.asset->metadata.dimensions` (optional but enables `<Image>` to know the source size).
- `src/lib/community/types.ts` — add optional `heroImageWidth?: number` / `heroImageHeight?: number` to `CommunityPostEntry`.
- `src/pages/community/[slug].astro` — swap raw `<img>` for `<Image>` from `astro:assets`, fed by `heroImageUrl` + width/height.
- `src/pages/community/index.astro` — same swap.

**Create:**
- (none)

**Delete:**
- `src/pages/sitemap.xml.ts` — replaced by `@astrojs/sitemap`.

---

### Task 1: Install `@astrojs/vercel` adapter and declare `output: 'static'`

**Files:** `package.json`, `astro.config.mjs`.

- [ ] **Step 1: Install the adapter**

```bash
npx astro add vercel --yes
```

This runs the official integration script which (a) installs `@astrojs/vercel`, (b) updates `astro.config.mjs` to import the adapter and set `adapter: vercel()`, (c) may also set `output`. Manually verify the result before continuing.

- [ ] **Step 2: Confirm `output: 'static'`**

After `astro add` finishes, open `astro.config.mjs` and ensure the config reads (preserving the existing `site` and `tailwind()` integration):

```javascript
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://www.thefilibustersband.com",
  output: "static",
  adapter: vercel(),
  integrations: [tailwind()]
});
```

If `astro add` set `output: 'server'` or `'hybrid'`, change it to `'static'`. The site has no SSR routes today and changing the output mode would break the deployment.

- [ ] **Step 3: Build to confirm**

```bash
npm run build
```

Expected: build succeeds. The output should now go to `.vercel/output/` (Vercel adapter convention) rather than `dist/` — this is normal. Verify by running `ls -la .vercel/output/static/` and seeing the built pages.

- [ ] **Step 4: Verify `.vercel` is gitignored**

```bash
grep -n "\.vercel" .gitignore
```

Expected: `.vercel` already present (committed in the cleanup pass).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs
git commit -m "feat(astro): adopt @astrojs/vercel adapter with output: static"
```

---

### Task 2: Replace custom sitemap with `@astrojs/sitemap` + real `lastmod`

**Files:** `package.json`, `astro.config.mjs`, delete `src/pages/sitemap.xml.ts`.

- [ ] **Step 1: Install the sitemap integration**

```bash
npx astro add sitemap --yes
```

This installs `@astrojs/sitemap` and registers it in `integrations: [...]` automatically. Verify the import + integrations array after the command finishes.

- [ ] **Step 2: Configure the `serialize` hook**

The default sitemap uses build time as `lastmod` for every URL. The SEO audit flagged this as noise. Override per-URL `lastmod`:

In `astro.config.mjs`, change the sitemap integration call to:

```javascript
import sitemap from "@astrojs/sitemap";
import { upcomingShows } from "./src/data/shows";
import { communityPosts as fallbackCommunityPosts } from "./src/data/community";

// Lookup tables mapping route → ISO timestamp
const showLastmodBySlug = new Map(
  upcomingShows.map((show) => [`/shows/${show.slug}`, show.startsAt])
);
const communityLastmodBySlug = new Map(
  fallbackCommunityPosts.map((post) => [`/community/${post.slug}`, post.publishedAt])
);

export default defineConfig({
  site: "https://www.thefilibustersband.com",
  output: "static",
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap({
      serialize(item) {
        const url = new URL(item.url);
        const pathname = url.pathname.replace(/\/$/, "") || "/";
        const explicitLastmod =
          showLastmodBySlug.get(pathname) ?? communityLastmodBySlug.get(pathname);
        if (explicitLastmod) {
          return { ...item, lastmod: new Date(explicitLastmod).toISOString() };
        }
        return item;
      }
    })
  ]
});
```

Note: the `serialize` lookup uses the **fallback** data (the hand-coded `src/data/shows.ts` and `src/data/community.ts`) for `lastmod`. Sanity-backed posts share slugs with the fallback set, so this works correctly until the fallback is removed. If a slug exists only in Sanity (no fallback entry), it falls through to the default `lastmod` (build time) — acceptable. A follow-up phase can wire the Sanity-fetched dates if needed.

- [ ] **Step 3: Delete the custom sitemap**

```bash
git rm src/pages/sitemap.xml.ts
```

- [ ] **Step 4: Update `robots.txt` if it references the old path**

```bash
grep -n "sitemap" public/robots.txt
```

If `public/robots.txt` has `Sitemap: https://.../sitemap.xml` — the integration emits `sitemap-index.xml` and `sitemap-0.xml`. Change `robots.txt` to:

```
Sitemap: https://www.thefilibustersband.com/sitemap-index.xml
```

- [ ] **Step 5: Build and inspect**

```bash
npm run build
ls .vercel/output/static/sitemap-*.xml
```

Open `.vercel/output/static/sitemap-0.xml` and spot-check:
- A `<url>` exists for `/shows/utah-arts-festival-2026` with `<lastmod>2026-06-20T...</lastmod>` (matches the show's `startsAt`).
- A `<url>` for a community post with `<lastmod>` matching its `publishedAt`.
- Static routes like `/about`, `/listen` have a `<lastmod>` (build time) — acceptable.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs public/robots.txt
git rm src/pages/sitemap.xml.ts  # if not already staged from Step 3
git commit -m "feat(seo): replace custom sitemap with @astrojs/sitemap + real lastmod"
```

---

### Task 3: Configure image service for Sanity CDN

**Files:** `astro.config.mjs`.

- [ ] **Step 1: Add `image.remotePatterns` for Sanity CDN**

In `astro.config.mjs`, extend the `defineConfig` block:

```javascript
export default defineConfig({
  site: "https://www.thefilibustersband.com",
  output: "static",
  adapter: vercel(),
  image: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" }
    ]
  },
  integrations: [ /* ...as before */ ]
});
```

This whitelists Sanity's CDN so the `<Image>` component can fetch and optimize remote Sanity URLs at build/request time. Without this, `<Image src="https://cdn.sanity.io/..." />` would error at build.

- [ ] **Step 2: Build to confirm**

```bash
npm run build
```

Expected: build still succeeds (no `<Image>` actually uses Sanity URLs yet — that's Task 4 — but the config should not break anything).

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat(astro): allow Sanity CDN as remote image source"
```

---

### Task 4: Enrich Sanity community query with image dimensions

**Files:** `src/lib/community/queries.ts`, `src/lib/community/types.ts`, `src/lib/community/data.ts` (mapping function).

- [ ] **Step 1: Add dimensions to the GROQ projections**

In `src/lib/community/queries.ts`, modify the three queries that project `heroImageUrl` to also project image dimensions. Example for `upcomingCommunityPostsQuery`:

```typescript
export const upcomingCommunityPostsQuery = `*[_type == "communityPost" && publishedAt <= now()] | order(publishedAt desc){
  title,
  "slug": slug.current,
  category,
  publishedAt,
  summary,
  "heroImageUrl": heroImage.asset->url,
  "heroImageWidth": heroImage.asset->metadata.dimensions.width,
  "heroImageHeight": heroImage.asset->metadata.dimensions.height,
  heroAlt,
  body,
  "relatedShowSlug": relatedShow->slug.current
}`;
```

Apply the same two new projections to `communityPostBySlugQuery`. (The `allCommunitySlugsQuery` only needs the slug — leave it alone.)

- [ ] **Step 2: Type the new fields**

In `src/lib/community/types.ts`, extend `CommunityPostEntry`:

```typescript
export type CommunityPostEntry = {
  // ...existing fields...
  heroImageUrl: string;
  heroImageWidth?: number;
  heroImageHeight?: number;
  // ...rest...
};
```

(Adapt to the actual shape — if the type is built via `Pick` / `Omit` on another type, propagate the addition accordingly.)

- [ ] **Step 3: Pass the new fields through `mapCommunityEntry`**

In `src/lib/community/queries.ts` (or `data.ts`, wherever `mapCommunityEntry` lives), include the new fields in the returned object. Guard with `typeof post.heroImageWidth === "number"` etc. to keep the result safe when older Sanity records lack dimensions:

```typescript
return {
  // ...existing fields...
  heroImageUrl: post.heroImageUrl,
  heroImageWidth: typeof post.heroImageWidth === "number" ? post.heroImageWidth : undefined,
  heroImageHeight: typeof post.heroImageHeight === "number" ? post.heroImageHeight : undefined,
  // ...
};
```

- [ ] **Step 4: Run `astro check`** (after Task 6 adds the script, or run `npx astro check` ad-hoc)

```bash
npx astro check
```

Expected: no new type errors.

- [ ] **Step 5: Build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/lib/community/queries.ts src/lib/community/types.ts src/lib/community/data.ts
git commit -m "feat(community): expose Sanity hero image dimensions"
```

---

### Task 5: Migrate community `<img>` to `<Image>`

**Files:** `src/pages/community/[slug].astro`, `src/pages/community/index.astro`.

- [ ] **Step 1: Migrate the community detail hero**

In `src/pages/community/[slug].astro`:

- Add to imports (frontmatter): `import { Image } from "astro:assets";`
- Replace the existing hero `<img ... />` (the one with `src={post.heroImageUrl}` and `width="1280" height="1600"` from the a11y phase) with:

```astro
          <Image
            src={post.heroImageUrl}
            alt={post.heroAlt}
            width={post.heroImageWidth ?? 1280}
            height={post.heroImageHeight ?? 1600}
            class="aspect-[4/5] w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
```

Astro will optimize the URL via the configured service. The literal `1280 / 1600` is a 4:5 fallback for older Sanity records lacking dimensions metadata.

- [ ] **Step 2: Migrate the community index card hero**

In `src/pages/community/index.astro`, the card image (currently `<img src={post.heroImageUrl} alt="" ...>` inside the `aria-hidden` wrapper from the a11y phase):

- Add `import { Image } from "astro:assets";` if not already present.
- Replace `<img>` with:

```astro
                <Image
                  src={post.heroImageUrl}
                  alt=""
                  width={post.heroImageWidth ?? 1280}
                  height={post.heroImageHeight ?? 800}
                  class="aspect-[16/10] w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
```

Index card aspect is 16:10 → use 1280x800 fallback dimensions.

- [ ] **Step 3: Build and visually verify**

```bash
npm run build
npm run preview
```

In a browser, open `/community` and one detail page. Expect:
- Images load correctly (Sanity URL transformed through Vercel's image service, or Astro's local Sharp service if Vercel optimization is not active).
- No CLS during load.
- Lighthouse network panel: image responses are smaller than the original Sanity asset (compression / format negotiation working).

If the build fails because Astro can't resolve a Sanity URL: confirm Task 3's `image.remotePatterns` is in place and the hostname exactly matches (`cdn.sanity.io`, no port, no path).

- [ ] **Step 4: Commit**

```bash
git add src/pages/community/[slug].astro src/pages/community/index.astro
git commit -m "feat(perf): migrate community hero images to Astro <Image>"
```

---

### Task 6: Add `astro check` script + `engines.node` pin

**Files:** `package.json`.

- [ ] **Step 1: Add the `check` script and pin Node**

In `package.json`, add to `scripts`:

```json
"check": "astro check",
```

And add at the top level (after `"scripts": { ... }`):

```json
"engines": {
  "node": "24.x"
}
```

Final `package.json` snippet (illustrative — preserve all existing entries):

```json
{
  "name": "thefilibustersband-site",
  "private": true,
  "type": "module",
  "engines": {
    "node": "24.x"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "node --test",
    "verify:seo": "node scripts/verify-seo-mobile.mjs",
    "sanity:dev": "sanity dev",
    "sanity:build": "sanity build"
  },
  ...
}
```

- [ ] **Step 2: Install `@astrojs/check` if needed**

Run:

```bash
npm run check
```

If it errors with "Could not find @astrojs/check", install it:

```bash
npm install -D @astrojs/check typescript
```

(`typescript` is already a devDependency so this is a no-op for it.) Re-run `npm run check`.

- [ ] **Step 3: Triage any TS errors**

`astro check` may surface pre-existing TS errors. The plan is to FIX errors only in files this branch already touches (community, sitemap config, image migration). Document any errors in *other* files in a follow-up note instead of fixing them in this commit.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add astro check script and pin Node 24 LTS"
```

If any TS errors in touched files needed fixes, include those edits in this same commit.

---

### Task 7: Full-suite verification

- [ ] **Step 1: Run all gates**

```bash
npm run check
npm test
npm run build
npm run verify:seo
```

Expect: each exits 0.

- [ ] **Step 2: Sanity-check generated sitemap**

```bash
cat .vercel/output/static/sitemap-0.xml | head -40
```

Confirm: at least one show URL has `<lastmod>` matching the corresponding `startsAt`, at least one community post URL has `<lastmod>` matching `publishedAt`, and total URL count is roughly equal to the old custom sitemap.

- [ ] **Step 3: Spot-check Lighthouse perf**

`npm run preview`, then in Chrome DevTools → Lighthouse → Performance audit on a community detail page. Compare LCP and Total Blocking Time vs. main branch. Expect: improvement on LCP (responsive image), no regression on TBT.

- [ ] **Step 4: Commit summary** (only if any verification turned up an actionable issue)

Any fix made during verification gets its own commit. If everything is clean, skip this step.

- [ ] **Step 5: Open PR** via the `finishing-a-development-branch` skill.
