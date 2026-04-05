export type ShowStatus = "announced" | "sold-out" | "canceled";

export type ShowOffer = {
  url?: string;
  price?: number;
  priceCurrency?: string;
  availability?: "https://schema.org/InStock" | "https://schema.org/SoldOut";
  validFrom?: string;
  isFree?: boolean;
};

export type ShowEntry = {
  title: string;
  slug: string;
  status: ShowStatus;
  startsAt: string;
  endsAt?: string;
  venue: string;
  city: string;
  state: string;
  country?: string;
  ticketUrl?: string;
  summary?: string;
  flyerUrl?: string;
  body: string[];
  lineup: string[];
  notes?: string;
  organizerName?: string;
  organizerUrl?: string;
  seoDescription?: string;
  offers?: ShowOffer;
};
