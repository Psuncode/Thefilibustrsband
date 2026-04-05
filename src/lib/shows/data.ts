import { upcomingShows as fallbackShows } from "../../data/shows";
import { sanityClient } from "../sanity/client";
import {
  allShowSlugsQuery,
  mapShowEntry,
  showBySlugQuery,
  upcomingShowsQuery
} from "./queries";
import type { ShowEntry } from "./types";

const DEFAULT_COUNTRY = "US";

const fallbackEntries: ShowEntry[] = fallbackShows.map((show) => ({
  ...show,
  endsAt: show.endsAt || undefined,
  country: show.country || DEFAULT_COUNTRY,
  ticketUrl: show.ticketUrl || undefined,
  summary: show.summary || "",
  body: [...show.body],
  lineup: [...show.lineup],
  notes: show.notes || undefined,
  organizerName: show.organizerName || undefined,
  organizerUrl: show.organizerUrl || undefined,
  seoDescription: show.seoDescription || show.summary || "",
  offers: show.offers
    ? {
        url: show.offers.url || undefined,
        price: typeof show.offers.price === "number" ? show.offers.price : undefined,
        priceCurrency: show.offers.priceCurrency || undefined,
        availability: show.offers.availability || undefined,
        validFrom: show.offers.validFrom || undefined,
        isFree: typeof show.offers.isFree === "boolean" ? show.offers.isFree : undefined
      }
    : undefined
}));

export const getUpcomingShows = async (): Promise<ShowEntry[]> => {
  if (!sanityClient) return fallbackEntries;

  try {
    const shows = await sanityClient.fetch(upcomingShowsQuery);
    return Array.isArray(shows) && shows.length > 0
      ? shows.map(mapShowEntry)
      : fallbackEntries;
  } catch {
    return fallbackEntries;
  }
};

export const getAllShowSlugs = async (): Promise<string[]> => {
  if (!sanityClient) return fallbackEntries.map((show) => show.slug);

  try {
    const slugs = await sanityClient.fetch<{ slug?: string }[]>(allShowSlugsQuery);
    const normalized = Array.isArray(slugs)
      ? slugs.map((entry) => entry.slug).filter((slug): slug is string => Boolean(slug))
      : [];

    return normalized.length > 0
      ? normalized
      : fallbackEntries.map((show) => show.slug);
  } catch {
    return fallbackEntries.map((show) => show.slug);
  }
};

export const getShowBySlug = async (slug: string): Promise<ShowEntry | null> => {
  if (!sanityClient) {
    return fallbackEntries.find((show) => show.slug === slug) || null;
  }

  try {
    const show = await sanityClient.fetch(showBySlugQuery, { slug });
    return show
      ? mapShowEntry(show)
      : fallbackEntries.find((entry) => entry.slug === slug) || null;
  } catch {
    return fallbackEntries.find((entry) => entry.slug === slug) || null;
  }
};
