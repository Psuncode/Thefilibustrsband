import type { ShowEntry } from "./types";

const DEFAULT_COUNTRY = "US";

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

export const allShowSlugsQuery = `*[_type == "show"]{"slug": slug.current}`;

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

export const mapShowEntry = (show: SanityShowRecord): ShowEntry => ({
  title: show.title || "Untitled Show",
  slug: show.slug || "untitled-show",
  status: show.status || "announced",
  startsAt: show.startsAt || new Date().toISOString(),
  endsAt: show.endsAt || undefined,
  venue: show.venue || "Venue TBA",
  city: show.city || "City TBA",
  state: show.state || "State TBA",
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
});
