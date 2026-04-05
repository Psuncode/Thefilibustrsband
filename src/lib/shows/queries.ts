import type { ShowEntry } from "./types";

const DEFAULT_COUNTRY = "US";
const VALID_SHOW_STATUSES = new Set(["announced", "sold-out", "canceled"]);

type SanityBlockChild = {
  text?: string;
};

type SanityBlock = {
  children?: SanityBlockChild[];
};

type SanityShowRecord = Partial<Omit<ShowEntry, "body" | "lineup">> & {
  body?: SanityBlock[];
  lineup?: string[];
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isShowStatus = (value: unknown): value is ShowEntry["status"] =>
  typeof value === "string" && VALID_SHOW_STATUSES.has(value);

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

export const upcomingShowsQuery = `*[_type == "show" && startsAt >= now()] | order(startsAt asc){
  title,
  "slug": slug.current,
  status,
  startsAt,
  endsAt,
  venue,
  city,
  state,
  country,
  ticketUrl,
  summary,
  "flyerUrl": flyer.asset->url,
  body,
  lineup,
  notes,
  organizerName,
  organizerUrl,
  seoDescription,
  offers
}`;

export const allShowSlugsQuery = `*[_type == "show"]{
  title,
  "slug": slug.current,
  status,
  startsAt,
  venue,
  city,
  state
}`;

export const showBySlugQuery = `*[_type == "show" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  status,
  startsAt,
  endsAt,
  venue,
  city,
  state,
  country,
  ticketUrl,
  summary,
  "flyerUrl": flyer.asset->url,
  body,
  lineup,
  notes,
  organizerName,
  organizerUrl,
  seoDescription,
  offers
}`;

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

export const mapShowEntry = (show: SanityShowRecord): ShowEntry | null => {
  if (
    !isNonEmptyString(show.title) ||
    !isNonEmptyString(show.slug) ||
    !isShowStatus(show.status) ||
    !isNonEmptyString(show.startsAt) ||
    !isNonEmptyString(show.venue) ||
    !isNonEmptyString(show.city) ||
    !isNonEmptyString(show.state)
  ) {
    return null;
  }

  return {
    title: show.title,
    slug: show.slug,
    status: show.status,
    startsAt: show.startsAt,
    endsAt: show.endsAt || undefined,
    venue: show.venue,
    city: show.city,
    state: show.state,
    country: show.country || DEFAULT_COUNTRY,
    ticketUrl: show.ticketUrl || undefined,
    summary: show.summary || "",
    flyerUrl: show.flyerUrl || undefined,
    body: blocksToParagraphs(show.body),
    lineup: Array.isArray(show.lineup) ? show.lineup : [],
    notes: show.notes || undefined,
    organizerName: show.organizerName || undefined,
    organizerUrl: show.organizerUrl || undefined,
    seoDescription: show.seoDescription || show.summary || "",
    offers: normalizeOffer(show.offers)
  };
};
