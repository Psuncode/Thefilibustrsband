import type { ShowEntry } from "./types";

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
  venue,
  city,
  state,
  ticketUrl,
  summary,
  "flyerUrl": flyer.asset->url,
  body,
  lineup,
  notes
}`;

export const allShowSlugsQuery = `*[_type == "show"]{"slug": slug.current}`;

export const showBySlugQuery = `*[_type == "show" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  status,
  startsAt,
  venue,
  city,
  state,
  ticketUrl,
  summary,
  "flyerUrl": flyer.asset->url,
  body,
  lineup,
  notes
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
  venue: show.venue || "Venue TBA",
  city: show.city || "City TBA",
  state: show.state || "State TBA",
  ticketUrl: show.ticketUrl || undefined,
  summary: show.summary || "",
  flyerUrl: show.flyerUrl || undefined,
  body: blocksToParagraphs(show.body),
  lineup: Array.isArray(show.lineup) ? show.lineup : [],
  notes: show.notes || undefined
});
