import { communityPosts as fallbackPosts } from "../../data/community";
import { sanityClient } from "../sanity/client";
import {
  allCommunitySlugsQuery,
  communityPostBySlugQuery,
  mapCommunityEntry,
  upcomingCommunityPostsQuery
} from "./queries";
import type { CommunityPostEntry } from "./types";

const fallbackEntries: CommunityPostEntry[] = fallbackPosts.map((post) => ({
  ...post,
  heroImageUrl: post.heroImage.src,
  body: [...post.body]
}));

export const getCommunityPosts = async (): Promise<CommunityPostEntry[]> => {
  if (!sanityClient) return fallbackEntries;

  try {
    const posts = await sanityClient.fetch(upcomingCommunityPostsQuery);
    if (!Array.isArray(posts) || posts.length === 0) return fallbackEntries;

    const normalized = posts
      .map(mapCommunityEntry)
      .filter((post): post is CommunityPostEntry => Boolean(post));

    return normalized.length > 0 ? normalized : fallbackEntries;
  } catch {
    return fallbackEntries;
  }
};

export const getAllCommunitySlugs = async (): Promise<string[]> => {
  if (!sanityClient) return fallbackEntries.map((post) => post.slug);

  try {
    const slugs = await sanityClient.fetch(allCommunitySlugsQuery);
    const normalized = Array.isArray(slugs)
      ? slugs
          .map((item) => (item as any).slug)
          .filter((slug): slug is string => typeof slug === "string" && slug.length > 0)
      : [];

    return normalized.length > 0 ? normalized : fallbackEntries.map((post) => post.slug);
  } catch {
    return fallbackEntries.map((post) => post.slug);
  }
};

export const getCommunityPostBySlug = async (slug: string): Promise<CommunityPostEntry | null> => {
  if (!sanityClient) {
    return fallbackEntries.find((post) => post.slug === slug) || null;
  }

  try {
    const post = await sanityClient.fetch(communityPostBySlugQuery, { slug });
    const normalized = post ? mapCommunityEntry(post) : null;

    return normalized || fallbackEntries.find((entry) => entry.slug === slug) || null;
  } catch {
    return fallbackEntries.find((entry) => entry.slug === slug) || null;
  }
};
