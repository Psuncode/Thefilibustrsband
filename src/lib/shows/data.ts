import { upcomingShows as fallbackShows } from "../../data/shows";
import { sanityClient } from "../sanity/client";
import { partitionShowsByDate } from "./schedule.js";
import {
  allShowSlugsQuery,
  mapShowEntry,
  pastShowsQuery,
  showBySlugQuery,
  upcomingShowsQuery
} from "./queries";
import type { ShowEntry } from "./types";

type FallbackShowSource = {
  readonly title: string;
  readonly slug: string;
  readonly status: ShowEntry["status"];
  readonly startsAt: string;
  readonly endsAt?: string;
  readonly venue: string;
  readonly venueMapUrl?: string;
  readonly city: string;
  readonly state: string;
  readonly country?: string;
  readonly ticketUrl?: string;
  readonly flyerUrl?: string;
  readonly organizerName?: string;
  readonly organizerUrl?: string;
  readonly offers?: ShowEntry["offers"];
  readonly summary: string;
  readonly body: readonly string[];
  readonly lineup: readonly string[];
  readonly notes?: string;
  readonly seoDescription?: string;
};

const fallbackSource = fallbackShows as readonly FallbackShowSource[];

const DEFAULT_COUNTRY = "US";

const normalizeOffer = (offer: ShowEntry["offers"]): ShowEntry["offers"] => {
  if (!offer) return undefined;

  const normalized = {
    url: offer.url || undefined,
    price: typeof offer.price === "number" ? offer.price : undefined,
    priceCurrency: offer.priceCurrency || undefined,
    availability: offer.availability || undefined,
    validFrom: offer.validFrom || undefined,
    isFree: typeof offer.isFree === "boolean" ? offer.isFree : undefined
  };

  return Object.values(normalized).some((value) => value !== undefined) ? normalized : undefined;
};

const fallbackEntries: ShowEntry[] = fallbackSource.map((show) => ({
  ...show,
  endsAt: show.endsAt || undefined,
  venueMapUrl: show.venueMapUrl || undefined,
  country: show.country || DEFAULT_COUNTRY,
  ticketUrl: show.ticketUrl || undefined,
  summary: show.summary || "",
  body: [...show.body],
  lineup: [...show.lineup],
  notes: show.notes || undefined,
  organizerName: show.organizerName || undefined,
  organizerUrl: show.organizerUrl || undefined,
  seoDescription: show.seoDescription || show.summary || "",
  offers: normalizeOffer(show.offers)
}));

const getFallbackShowBuckets = () => partitionShowsByDate(fallbackEntries);

export const getUpcomingShows = async (): Promise<ShowEntry[]> => {
  if (!sanityClient) return getFallbackShowBuckets().upcoming;

  try {
    const shows = await sanityClient.fetch(upcomingShowsQuery);
    if (!Array.isArray(shows) || shows.length === 0) return getFallbackShowBuckets().upcoming;

    const normalized = shows
      .map(mapShowEntry)
      .filter((show): show is ShowEntry => Boolean(show));

    return normalized.length > 0 ? normalized : getFallbackShowBuckets().upcoming;
  } catch {
    return getFallbackShowBuckets().upcoming;
  }
};

export const getPastShows = async (): Promise<ShowEntry[]> => {
  if (!sanityClient) return getFallbackShowBuckets().past;

  try {
    const shows = await sanityClient.fetch(pastShowsQuery);
    if (!Array.isArray(shows) || shows.length === 0) return getFallbackShowBuckets().past;

    const normalized = shows
      .map(mapShowEntry)
      .filter((show): show is ShowEntry => Boolean(show));

    return normalized.length > 0 ? normalized : getFallbackShowBuckets().past;
  } catch {
    return getFallbackShowBuckets().past;
  }
};

export const getAllShowSlugs = async (): Promise<string[]> => {
  if (!sanityClient) return fallbackEntries.map((show) => show.slug);

  try {
    const slugs = await sanityClient.fetch(allShowSlugsQuery);
    const normalized = Array.isArray(slugs)
      ? slugs
          .map(mapShowEntry)
          .filter((show): show is ShowEntry => Boolean(show))
          .map((show) => show.slug)
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
    const normalized = show ? mapShowEntry(show) : null;

    return normalized || fallbackEntries.find((entry) => entry.slug === slug) || null;
  } catch {
    return fallbackEntries.find((entry) => entry.slug === slug) || null;
  }
};
