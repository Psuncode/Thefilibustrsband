import { bandFacts, specialRoutes, siteMeta, siteRoutes } from "./site";

type LocalDiscoveryProofPoint = {
  label: string;
  value: string;
};

type LocalDiscoveryCta = {
  label: string;
  href: string;
};

export const localDiscoveryPage = {
  meta: {
    title: `${bandFacts.location.display} alt rock band | The Filibusters`,
    description:
      "Provo alternative rock band making loud, emotionally direct songs for live rooms, late nights, and regional alt rock shows across Utah."
  },
  hero: {
    eyebrow: "Provo alt rock band",
    title: "Provo alternative rock that actually wants something to land.",
    description:
      `${bandFacts.geoLine} A Utah alternative rock band, the Filibusters keep the writing direct, the live energy high, and the focus on connection instead of polish for its own sake.`
  },
  differentiators: [
    "Emotionally direct Provo alternative rock from an alternative band from Utah with a clear regional identity",
    "High-energy Provo live music shows and Utah alt rock touring built for loud rooms and real audience connection",
    "A clear booking, press, and listen path already wired into the site",
    "Copy and metadata that stay consistent with the about, press, and homepage pages"
  ],
  proofPoints: [
    {
      label: "Base location",
      value: bandFacts.location.display
    },
    {
      label: "Genre",
      value: bandFacts.geoIdentity.genre
    },
    {
      label: "Positioning",
      value: "Loud, emotionally direct songs for live rooms and late nights."
    },
    {
      label: "Contact",
      value: siteMeta.contactEmail
    }
  ] as const satisfies readonly LocalDiscoveryProofPoint[],
  ctaLinks: [
    {
      label: "Listen now",
      href: siteRoutes.listen.path
    },
    {
      label: "See shows",
      href: siteRoutes.shows.path
    },
    {
      label: "Contact the band",
      href: siteRoutes.contact.path
    },
    {
      label: "Press room",
      href: siteRoutes.press.path
    },
    {
      label: specialRoutes.aiPressKit.label,
      href: specialRoutes.aiPressKit.href
    }
  ] as const satisfies readonly LocalDiscoveryCta[]
} as const;
