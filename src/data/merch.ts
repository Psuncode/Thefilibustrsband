type MerchPageLink = {
  label: string;
  href: string;
  description: string;
};

type MerchPageContent = {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    body: readonly string[];
  };
  cta: {
    notifyLabel: string;
    notifyNote: string;
  };
  links: {
    eyebrow: string;
    title: string;
    items: readonly MerchPageLink[];
  };
};

export const merchPage = {
  meta: {
    title: "Merch | The Filibusters",
    description:
      "Merch from The Filibusters is on the way. Get notified when shirts, prints, and tour goods drop, and keep listening in the meantime.",
  },
  hero: {
    eyebrow: "Merch",
    title: "Merch is coming.",
    description:
      "Shirts, prints, and the kind of tour goods you actually want to wear are in the works. Drop your email and we will tell you the moment it lands.",
    body: [
      "We are putting the same care into the merch that we put into the songs and the live show. No filler, no throwaway designs.",
      "Until it goes live, the best way to back the band is to keep the music in rotation and show up loud at the next gig.",
    ],
  },
  cta: {
    notifyLabel: "Notify me",
    notifyNote: "Join the list and you will hear about the drop before anyone else.",
  },
  links: {
    eyebrow: "In the meantime",
    title: "Don't leave empty-handed.",
    items: [
      {
        label: "Listen now",
        href: "/listen",
        description: "Stream the band on Spotify, Apple Music, and YouTube.",
      },
      {
        label: "Catch a show",
        href: "/shows",
        description: "Find the next live date and come hear it in the room.",
      },
    ],
  },
} as const satisfies MerchPageContent;
