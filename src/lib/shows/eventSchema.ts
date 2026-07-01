import type { ShowEntry } from "./types";
import { siteMeta } from "../../data/site";
import { isPastShow } from "./schedule.js";

type EventSchemaInput = {
  show: ShowEntry;
  /** Absolute canonical URL of the show's own detail page. */
  url: string;
  /** Resolved event description (seoDescription/summary/generated). */
  description: string;
  /** Absolute OG image URL, if any. */
  image?: string;
};

const eventStatusByShowStatus = {
  announced: "https://schema.org/EventScheduled",
  "sold-out": "https://schema.org/EventScheduled",
  cancelled: "https://schema.org/EventCancelled",
  canceled: "https://schema.org/EventCancelled",
  postponed: "https://schema.org/EventPostponed"
} as const;

export const buildEventStructuredData = ({
  show,
  url,
  description,
  image
}: EventSchemaInput): Record<string, unknown> => {
  // A show that has already happened shouldn't advertise an on-sale, in-stock Offer.
  const hasEnded = isPastShow(show);
  const hasPrice = show.offers?.isFree === true || typeof show.offers?.price === "number";
  const offers =
    !hasEnded &&
    show.offers &&
    (show.offers.url ||
      typeof show.offers.price === "number" ||
      show.offers.isFree === true ||
      show.offers.availability ||
      show.offers.validFrom)
      ? {
          "@type": "Offer",
          // Google flags Offers missing url/validFrom. Fall back so every emitted
          // Offer is complete: ticket link, else the show page; on-sale date
          // defaults to ~30 days before the show when unset (override via offers.validFrom).
          url: show.offers.url || show.ticketUrl || url,
          price: show.offers.isFree ? 0 : show.offers.price,
          // priceCurrency is required whenever a price is present (free shows emit
          // price:0). Default to USD so a free-show Offer isn't flagged as incomplete.
          priceCurrency: show.offers.priceCurrency || (hasPrice ? "USD" : undefined),
          availability: show.offers.availability || "https://schema.org/InStock",
          validFrom:
            show.offers.validFrom ||
            new Date(new Date(show.startsAt).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      : undefined;

  return {
    "@type": "Event",
    name: show.title,
    description,
    startDate: show.startsAt,
    endDate: show.endsAt || show.startsAt,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus:
      eventStatusByShowStatus[show.status as keyof typeof eventStatusByShowStatus] ??
      "https://schema.org/EventScheduled",
    image: image ? [encodeURI(image)] : undefined,
    url,
    performer: {
      "@type": "MusicGroup",
      name: siteMeta.title,
      url: siteMeta.url
    },
    location: {
      "@type": "Place",
      name: show.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: show.city,
        addressRegion: show.state,
        addressCountry: show.country || "US"
      }
    },
    organizer: show.organizerName
      ? {
          "@type": "Organization",
          name: show.organizerName,
          // Google flags organizer missing url; fall back to ticket link, else show page.
          url: show.organizerUrl || show.ticketUrl || url
        }
      : undefined,
    offers,
    ...(show.award ? { award: show.award } : {})
  };
};
