# Sanity Community Migration

Date: 2026-05-21
Status: Planning only (no code changes in this spec)
Related: `docs/superpowers/specs/2026-03-31-next-phase-roadmap.md` (next step #1)

## 1. Current state

Community posts currently live in `src/data/community.ts` as a hardcoded `communityPosts` array typed against `CommunityPost`. Each post has `title`, `slug`, `category` (one of `Band News` | `Show Updates` | `Release Updates` | `Behind the Scenes`), `publishedAt` (ISO), `summary`, `heroImage` (Astro `ImageMetadata` imported from `src/assets/images/`), `heroAlt`, `body` (array of paragraph strings), and optional `relatedShowSlug` (plain string). The index page `src/pages/community/index.astro` and the detail page `src/pages/community/[slug].astro` import `communityPosts` directly, iterate them for `getStaticPaths`, and render with the imported `ImageMetadata` through Astro's `<Image>` component. The slug+date list is mirrored into `src/data/lastmod-map.mjs` as `communityLastmod` and policed by a drift-guard test.

## 2. Target state

Sanity becomes the source of truth for community posts, mirroring the shows pattern exactly:

- A `communityPost` document type in `sanity/schemaTypes/`, edited via Sanity Studio.
- A new `src/lib/community/` module with `queries.ts` + `data.ts` (and a `types.ts` for the runtime `CommunityPost` shape).
- Pages import `getCommunityPosts()` / `getCommunityPostBySlug()` / `getAllCommunityPostSlugs()` from the fetcher.
- If `sanityClient` is `null` (env not configured) or the fetch throws/returns empty, the fetcher falls back to the existing repo data in `src/data/community.ts`. Identical "soft fallback" behavior as `src/lib/shows/data.ts`.
- Hero images are served from Sanity's CDN (`asset->url`) when Sanity-sourced, and remain Astro `ImageMetadata` imports when fallback-sourced. Pages render both via a unified runtime type (`heroImageUrl?: string` for Sanity, `heroImage?: ImageMetadata` for fallback).

## 3. Sanity schema

New file `sanity/schemaTypes/communityPostType.ts` (registered in `sanity/schemaTypes/index.ts`).

```ts
import { defineField, defineType } from "sanity";

export const communityPostType = defineType({
  name: "communityPost",
  title: "Community Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(140)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Band News", value: "Band News" },
          { title: "Show Updates", value: "Show Updates" },
          { title: "Release Updates", value: "Release Updates" },
          { title: "Behind the Scenes", value: "Behind the Scenes" }
        ],
        layout: "radio"
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(280)
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "heroAlt",
      title: "Hero Image Alt Text",
      type: "string",
      validation: (rule) => rule.required().max(160)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "relatedShow",
      title: "Related Show (optional)",
      type: "reference",
      to: [{ type: "show" }]
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "heroImage"
    }
  }
});
```

Register in `sanity/schemaTypes/index.ts`:

```ts
import { showType } from "./showType";
import { communityPostType } from "./communityPostType";

export const schemaTypes = [showType, communityPostType];
```

Notes on the schema:
- `relatedShow` is a proper Sanity `reference` to a `show` document. The GROQ query projects out `slug.current` so the runtime type stays a plain string (matches existing consumers).
- `body` uses portable-text blocks (same as shows). The fetcher flattens to paragraph strings via the existing `blocksToParagraphs` pattern.
- `heroImage` is mandatory in Sanity but optional in the runtime type — fallback posts use `ImageMetadata` from repo assets.

## 4. Fetcher code

New module `src/lib/community/`:

### `types.ts`

```ts
import type { ImageMetadata } from "astro";

export type CommunityCategory =
  | "Band News"
  | "Show Updates"
  | "Release Updates"
  | "Behind the Scenes";

export type CommunityPostEntry = {
  title: string;
  slug: string;
  category: CommunityCategory;
  publishedAt: string;
  summary: string;
  heroAlt: string;
  body: string[];
  relatedShowSlug?: string;
  // Exactly one of these is set at runtime:
  heroImage?: ImageMetadata;   // fallback path (Astro asset)
  heroImageUrl?: string;       // Sanity path (CDN URL)
};
```

### `queries.ts` (pseudo-code)

```ts
const VALID_CATEGORIES = new Set<CommunityCategory>([
  "Band News", "Show Updates", "Release Updates", "Behind the Scenes"
]);

export const allCommunityPostsQuery = `
  *[_type == "communityPost"] | order(publishedAt desc){
    title,
    "slug": slug.current,
    category,
    publishedAt,
    summary,
    heroAlt,
    "heroImageUrl": heroImage.asset->url,
    body,
    "relatedShowSlug": relatedShow->slug.current
  }`;

export const allCommunityPostSlugsQuery = `
  *[_type == "communityPost"]{ "slug": slug.current }`;

export const communityPostBySlugQuery = `
  *[_type == "communityPost" && slug.current == $slug][0]{
    ... // same projection as allCommunityPostsQuery
  }`;

export const mapCommunityPost = (record: SanityCommunityRecord): CommunityPostEntry | null => {
  // Validate required fields via isNonEmptyString helpers
  // Validate category against VALID_CATEGORIES
  // Map portable-text blocks via blocksToParagraphs (shared util, or inline copy)
  // Return null on invalid records so the fetcher can fall back
};
```

### `data.ts` (pseudo-code)

```ts
import { communityPosts as fallbackPosts } from "../../data/community";
import { sanityClient } from "../sanity/client";
import {
  allCommunityPostsQuery,
  allCommunityPostSlugsQuery,
  communityPostBySlugQuery,
  mapCommunityPost
} from "./queries";
import type { CommunityPostEntry } from "./types";

const fallbackEntries: CommunityPostEntry[] = fallbackPosts.map((post) => ({
  title: post.title,
  slug: post.slug,
  category: post.category,
  publishedAt: post.publishedAt,
  summary: post.summary,
  heroAlt: post.heroAlt,
  body: [...post.body],
  relatedShowSlug: post.relatedShowSlug,
  heroImage: post.heroImage // ImageMetadata
}));

export const getCommunityPosts = async (): Promise<CommunityPostEntry[]> => {
  if (!sanityClient) return fallbackEntries;
  try {
    const records = await sanityClient.fetch(allCommunityPostsQuery);
    if (!Array.isArray(records) || records.length === 0) return fallbackEntries;
    const normalized = records.map(mapCommunityPost).filter(Boolean) as CommunityPostEntry[];
    return normalized.length > 0 ? normalized : fallbackEntries;
  } catch {
    return fallbackEntries;
  }
};

export const getAllCommunityPostSlugs = async (): Promise<string[]> => {
  if (!sanityClient) return fallbackEntries.map((p) => p.slug);
  try {
    const records = await sanityClient.fetch(allCommunityPostSlugsQuery);
    const slugs = Array.isArray(records)
      ? records.map((r) => r?.slug).filter((s): s is string => typeof s === "string" && s.length > 0)
      : [];
    return slugs.length > 0 ? slugs : fallbackEntries.map((p) => p.slug);
  } catch {
    return fallbackEntries.map((p) => p.slug);
  }
};

export const getCommunityPostBySlug = async (slug: string): Promise<CommunityPostEntry | null> => {
  if (!sanityClient) {
    return fallbackEntries.find((p) => p.slug === slug) || null;
  }
  try {
    const record = await sanityClient.fetch(communityPostBySlugQuery, { slug });
    const normalized = record ? mapCommunityPost(record) : null;
    return normalized || fallbackEntries.find((p) => p.slug === slug) || null;
  } catch {
    return fallbackEntries.find((p) => p.slug === slug) || null;
  }
};
```

This matches `src/lib/shows/data.ts` line-for-line in structure.

## 5. Consumer updates

`src/pages/community/index.astro`:
- Replace `import { communityPosts } from "../../data/community"` with `import { getCommunityPosts } from "../../lib/community/data"`.
- Add `const communityPosts = await getCommunityPosts();` in the frontmatter.
- Keep `import { communityPage } from "../../data/community"` for the static page copy (eyebrow/title/description stay in repo).
- In the `<Image>` for each post, branch on `post.heroImage` vs `post.heroImageUrl`. Astro's `<Image>` accepts `ImageMetadata` for local assets; for Sanity CDN URLs, use a plain `<img>` (or `getImage()` with a remote URL after enabling remote-image config in `astro.config.mjs`). Simpler v1: render `<img src={post.heroImageUrl} ...>` when present, `<Image src={post.heroImage} ...>` when not.

`src/pages/community/[slug].astro`:
- `getStaticPaths` becomes `async` and calls `await getAllCommunityPostSlugs()`.
- Replace `communityPosts.find(...)` with `await getCommunityPostBySlug(slug)`.
- Same `heroImage` vs `heroImageUrl` branch as the index page.
- `articleStructuredData.image`: when `heroImageUrl` is set, use it directly; otherwise `new URL(post.heroImage.src, Astro.site).href` as today.

No changes needed to `communityPage` copy, breadcrumb helpers, or structured-data builders.

## 6. Migration steps

1. **Add Sanity schema**: create `sanity/schemaTypes/communityPostType.ts` and register it in `sanity/schemaTypes/index.ts`.
2. **Create initial documents in Sanity Studio** — one per current post. Slugs to migrate (from `src/data/community.ts`):
   - `byu-battle-of-the-bands-2026-win` (Band News, related show: `byu-battle-of-the-bands-2026`)
   - `break-up-with-your-boyfriend-out-now` (Release Updates)
   - `before-the-set-starts` (Behind the Scenes)
   - `next-phase-feels-bigger` (Show Updates)
   For each: upload the hero image to Sanity, paste body paragraphs as separate portable-text blocks, set `publishedAt` to the existing ISO timestamp, set `relatedShow` reference for post #1.
3. **Implement fetcher with fallback**: create `src/lib/community/{types,queries,data}.ts` per section 4. Optionally refactor `blocksToParagraphs` into a shared `src/lib/sanity/portableText.ts` (low priority — copy is fine).
4. **Update consumers**: switch `src/pages/community/index.astro` and `src/pages/community/[slug].astro` to the fetcher; add the image-source branch.
5. **Keep `src/data/community.ts` as the fallback source** — do not delete it. The fetcher imports it directly.
6. **After Sanity goes live**, leave the repo fallback in place permanently as a safety net (shows does the same). Only stale-data risk is the band forgetting to remove an outdated repo post; document this in MAINTENANCE.md.
7. **Update `MAINTENANCE.md`**: change "How to add a community post" section to point editors to Sanity Studio as the primary workflow, with `src/data/community.ts` flagged as the fallback only (edit only if you need offline/no-Sanity coverage). Note that `communityLastmod` mirror still applies to fallback entries.

## 7. Risks / decisions

- **`relatedShowSlug` cross-reference**: use Sanity `reference` to `show`, project `relatedShow->slug.current` as a string in GROQ. This preserves the existing string-typed runtime field and gives Studio editors a typeahead instead of a free-text field. Decision: **reference**, not raw string.
- **Hero images**: store in Sanity Image Library (one image asset per post). Pros: editors can change images without a code deploy; cons: lose Astro's local image optimization (LQIP, format conversion) for Sanity-sourced posts. Mitigation: append `?w=1280&auto=format` to the CDN URL, or use `@sanity/image-url` to generate responsive URLs. For v1, plain `<img src={url}>` is acceptable; revisit if LCP regresses on `/community`.
- **`lastmod-map.mjs` drift-guard**: today the test diffs `communityLastmod` against `src/data/community.ts`. After migration, the source of truth is Sanity, so the existing guard only covers the fallback. Options: (a) keep the guard as-is — it only enforces the fallback shape, which is acceptable; (b) extend the guard to fetch Sanity at test time and reconcile against `communityLastmod`. Recommended: **option (a)** for now, with a follow-up issue to build a `prebuild` script that regenerates `communityLastmod` from Sanity. Sitemap lastmod accuracy degrades only if editors update Sanity without bumping the repo mirror — document this in MAINTENANCE.md.
- **Build-time vs. ISR**: per the next-phase roadmap, "Astro should pull published CMS content at build time." Vercel will rebuild on every deploy; Sanity webhooks can trigger Vercel deploy hooks for editor-initiated rebuilds. No ISR needed for v1.
- **Drift-guard test impact**: keep the existing test. If we choose option (b) above later, the test gains a network dependency and needs a CI Sanity token. Avoid for v1.
- **Category union safety**: GROQ returns whatever string editors set. The mapper validates against the `VALID_CATEGORIES` set and returns `null` on invalid records, which the fetcher filters out — so a typoed category in Studio silently drops the post rather than crashing the build. Editors should see Studio's `radio` constraint, so in practice this should not occur.
- **Empty Sanity dataset during local dev**: when `PUBLIC_SANITY_PROJECT_ID` is set but the dataset has zero `communityPost` documents, the fetcher returns the fallback (length > 0 check covers this). Identical to shows behavior.

## 8. Rollback plan

The fallback path makes rollback close to free:

1. **Soft rollback (fetcher misbehaves)**: unset `PUBLIC_SANITY_PROJECT_ID` in the Vercel env for the affected deployment. `sanityClient` becomes `null` and all reads return the repo fallback. Redeploy.
2. **Hard rollback (consumer pages broken)**: revert the two `src/pages/community/*.astro` commits to re-import `communityPosts` directly from `src/data/community.ts`. The Sanity schema and fetcher files can stay in the repo — they are dead code until pages re-adopt them.
3. **Schema-level rollback**: removing `communityPostType` from `schemaTypes/index.ts` hides it from Studio. Existing documents remain in the dataset but cannot be edited until restored. No data loss.

Rollback safety property: because `src/data/community.ts` stays in the repo permanently as the fallback, no community content is ever Sanity-only at the code level.

## 9. Time estimate

- Schema + Studio registration: 0.5h
- Seed 4 initial documents in Studio (incl. image uploads, portable-text paste): 1.0h
- Fetcher (`types.ts`, `queries.ts`, `data.ts`): 1.5h
- Consumer updates + image-source branch in two pages: 1.0h
- MAINTENANCE.md update: 0.25h
- Manual QA on `/community` + each `/community/[slug]`, with and without `PUBLIC_SANITY_PROJECT_ID` set: 0.75h
- Buffer for portable-text formatting and CDN URL tuning: 1.0h

**Total: ~6 hours of focused work**, plausibly one afternoon.
