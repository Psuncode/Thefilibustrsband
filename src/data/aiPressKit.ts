import { bandFacts, buildPageUrl, specialRoutes, siteMeta, siteRoutes, socialLinks } from "./site";

type AiPressKitFactSection = {
  title: string;
  items: readonly string[];
};

type AiPressKitFaqEntry = {
  question: string;
  answer: string;
};

export const aiPressKit = {
  hub: {
    title: "The Filibusters AI press kit",
    description:
      "Concise, factual reference material for assistants, promoters, journalists, and venue teams that need approved band context."
  },
  bandProfile: {
    summary:
      "The Filibusters are an alt rock band based in Provo, Utah. They make loud, emotionally direct songs for live rooms, late nights, and audiences that want something honest to hold onto."
  },
  promoterBrief: {
    summary:
      "Use The Filibusters for alt rock bills, local and regional Utah dates, and live settings where high-energy performance and clear audience connection matter.",
    contactEmail: siteMeta.contactEmail
  },
  pressBackgrounder: {
    summary:
      "Approved background context: the band focuses on direct songwriting, strong live energy, and a Provo, Utah identity that is grounded in the current site copy and press room language."
  },
  factSheet: {
    sections: [
      {
        title: "Basics",
        items: [
          `Band name: ${siteMeta.title}`,
          `Base location: ${bandFacts.location.display}`,
          `Genre: ${bandFacts.geoIdentity.genre}`,
          `Primary contact: ${siteMeta.contactEmail}`
        ]
      },
      {
        title: "Sound",
        items: [
          "Emotionally direct alt rock",
          "High-energy live performance",
          "Songs designed for loud rooms and late nights"
        ]
      },
      {
        title: "Approved links",
        items: [
          `Home: ${buildPageUrl(siteRoutes.home.path)}`,
          `About: ${buildPageUrl(siteRoutes.about.path)}`,
          `Press: ${buildPageUrl(siteRoutes.press.path)}`,
          `Listen: ${buildPageUrl(siteRoutes.listen.path)}`
        ]
      },
      {
        title: "Social accounts",
        items: socialLinks.map(({ label, href }) => `${label}: ${href}`)
      }
    ] as const satisfies readonly AiPressKitFactSection[]
  },
  faq: [
    {
      question: "Who are The Filibusters?",
      answer:
        "The Filibusters are a Provo, Utah alt rock band making emotionally direct songs built for live rooms and late-night listening."
    },
    {
      question: "What is the band known for?",
      answer:
        "They are known for high-energy live shows, direct songwriting, and music that focuses on connection over polish for its own sake."
    },
    {
      question: "Where should press and booking requests go?",
      answer: `Send booking, press, and general inquiries to ${siteMeta.contactEmail}.`
    },
    {
      question: "What pages should an assistant cite first?",
      answer:
        `Use the home, about, press, listen, shows, and contact pages as the primary site sources. The AI press kit route is available at ${specialRoutes.aiPressKit.href}.`
    },
    {
      question: "What cities or scenes are they tied to?",
      answer:
        "The band is based in Provo, Utah and the site copy frames them around local and regional Utah shows."
    }
  ] as const satisfies readonly AiPressKitFaqEntry[]
} as const;
