import { bandFacts, contactPoints } from "./site";

type ContactPath = {
  title: string;
  description: string;
  email: string;
  ctaLabel: string;
};

type ContactPageContent = {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  pathsSection: {
    eyebrow: string;
    title: string;
  };
  paths: readonly ContactPath[];
  primary: {
    label: string;
    title: string;
    emailLabel: string;
    email: string;
    note: string;
  };
  social: {
    eyebrow: string;
    title: string;
    note: string;
  };
};

const bookingContact = contactPoints.find((entry) => entry.kind === "booking");

if (!bookingContact) {
  throw new Error("Missing booking contact point");
}

const contactEmail = bookingContact.email;
const contactLaneLabels = contactPoints.map(({ label }) => label.toLowerCase());

const contactPathCopy = {
  booking: {
    description: `For shows, events, and live performance requests in ${bandFacts.location.display}, across ${bandFacts.serviceArea.statewide}, and nearby regional dates.`,
    ctaLabel: "Email booking"
  },
  press: {
    description: "For interviews, media requests, and press coverage.",
    ctaLabel: "Email press"
  },
  general: {
    description: "For fan mail, questions, and anything that does not fit the other lanes.",
    ctaLabel: "Email general"
  }
} as const satisfies Record<
  (typeof contactPoints)[number]["kind"],
  {
    description: string;
    ctaLabel: string;
  }
>;

export const contactPage = {
  meta: {
    title: "Contact The Filibusters | Booking and Press",
    description:
      `Contact The Filibusters for booking, press, and general inquiries. Based in ${bandFacts.location.display}, available for local and regional shows.`
  },
  hero: {
    eyebrow: "Contact",
    title: `Book ${bandFacts.geoIdentity.bandName} for ${bandFacts.location.city} shows and ${bandFacts.location.region} dates.`,
    description:
      `${bandFacts.geoLine} Send ${contactLaneLabels.join(", ")} inquiries with the date, venue, and service area so the request gets routed cleanly.`
  },
  pathsSection: {
    eyebrow: "Inquiry paths",
    title: "Pick the lane that fits your message."
  },
  paths: contactPoints.map((point) => {
    const copy = contactPathCopy[point.kind];

    return {
      title: point.label,
      description: copy.description,
      email: point.email,
      ctaLabel: copy.ctaLabel
    };
  }),
  primary: {
    label: "Direct routing",
    title: "Use this for requests that need a human answer fast.",
    emailLabel: "Email",
    email: contactEmail,
    note: `If you need confirmation, follow-up, or a reply that does not fit the ${contactLaneLabels.join(", ")} lanes, send it here with the key details up front.`
  },
  social: {
    eyebrow: "Secondary channels",
    title: "Social is for following along, not for inquiries.",
    note: "Use the contact paths above for booking and other requests. Social is where the band posts clips, photos, and updates."
  }
} as const satisfies ContactPageContent;
