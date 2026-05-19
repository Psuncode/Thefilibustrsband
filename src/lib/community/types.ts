import type { CommunityCategory } from "../../data/community";

export type CommunityPostEntry = {
  title: string;
  slug: string;
  category: CommunityCategory;
  publishedAt: string;
  summary: string;
  heroImageUrl: string;
  heroImageWidth?: number;
  heroImageHeight?: number;
  heroAlt: string;
  body: string[];
  relatedShowSlug?: string;
};
