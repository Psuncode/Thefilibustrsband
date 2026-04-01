export type ShowStatus = "announced" | "sold-out" | "canceled";

export type ShowEntry = {
  title: string;
  slug: string;
  status: ShowStatus;
  startsAt: string;
  venue: string;
  city: string;
  state: string;
  ticketUrl?: string;
  summary?: string;
  flyerUrl?: string;
  body: string[];
  lineup: string[];
  notes?: string;
};
