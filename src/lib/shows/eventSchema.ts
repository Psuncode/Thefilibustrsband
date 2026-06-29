import type { ShowEntry } from "./types";
import { siteMeta } from "../../data/site";

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
  const offers =
    show.offers &&
    (show.offers.url ||
      typeof show.offers.price === "number" ||
      show.offers.isFree === true ||
      show.offers.availability ||
      show.offers.validFrom)
      ? {
          "@type": "Offer",
          url: show.offers.url || show.ticketUrl || url,
          price: show.offers.isFree ? 0 : show.offers.price,
          priceCurrency: show.offers.priceCurrency,
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
          url: show.organizerUrl || show.ticketUrl || url
        }
      : undefined,
    offers,
    ...(show.award ? { award: show.award } : {})
  };
};
