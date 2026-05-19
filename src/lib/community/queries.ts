import type { CommunityPostEntry } from "./types";
import type { CommunityCategory } from "../../data/community";

export const upcomingCommunityPostsQuery = `*[_type == "communityPost" && publishedAt <= now()] | order(publishedAt desc){
  title,
  "slug": slug.current,
  category,
  publishedAt,
  summary,
  "heroImageUrl": heroImage.asset->url,
  heroAlt,
  body,
  "relatedShowSlug": relatedShow->slug.current
}`;

export const allCommunitySlugsQuery = `*[_type == "communityPost"]{
  "slug": slug.current
}`;

export const communityPostBySlugQuery = `*[_type == "communityPost" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  category,
  publishedAt,
  summary,
  "heroImageUrl": heroImage.asset->url,
  heroAlt,
  body,
  "relatedShowSlug": relatedShow->slug.current
}`;

type SanityBlockChild = {
  text?: string;
};

type SanityBlock = {
  children?: SanityBlockChild[];
};

type SanityCommunityRecord = Partial<Omit<CommunityPostEntry, "body">> & {
  body?: SanityBlock[];
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const blocksToParagraphs = (blocks: SanityBlock[] | undefined): string[] =>
  Array.isArray(blocks)
    ? blocks
        .map((block) =>
          Array.isArray(block.children)
            ? block.children.map((child) => child.text || "").join("").trim()
            : ""
        )
        .filter(Boolean)
    : [];

export const mapCommunityEntry = (post: SanityCommunityRecord): CommunityPostEntry | null => {
  if (
    !isNonEmptyString(post.title) ||
    !isNonEmptyString(post.slug) ||
    !isNonEmptyString(post.category) ||
    !isNonEmptyString(post.publishedAt) ||
    !isNonEmptyString(post.summary) ||
    !isNonEmptyString(post.heroImageUrl) ||
    !isNonEmptyString(post.heroAlt)
  ) {
    return null;
  }

  return {
    title: post.title,
    slug: post.slug,
    category: post.category as CommunityCategory,
    publishedAt: post.publishedAt,
    summary: post.summary,
    heroImageUrl: post.heroImageUrl,
    heroAlt: post.heroAlt,
    body: blocksToParagraphs(post.body),
    relatedShowSlug: post.relatedShowSlug || undefined
  };
};
