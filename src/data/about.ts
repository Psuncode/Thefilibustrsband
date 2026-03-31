import type { ImageMetadata } from "astro";

import atticusPhoto from "../assets/images/atticus-wintch-bassist.jpg";
import curtisPhoto from "../assets/images/curtis-schnitzer-drummer.jpg";
import hannaPhoto from "../assets/images/hanna-eyre-vocalist.jpg";
import thomasPhoto from "../assets/images/thomas-wintch.jpg";

const aboutCore = {
  bandName: "The Filibusters",
  genre: "alt rock",
  genreDisplay: "Alt rock",
  baseLocation: "Provo, Utah",
  knownFor: "High-energy live shows",
  themes: "Connection, identity, belonging"
} as const;

type AboutMember = {
  name: string;
  role: string;
  photo: ImageMetadata;
  alt: string;
};

type AboutFaqEntry = {
  question: string;
  answer: string;
};

type AboutLink = {
  label: string;
  href: string;
};

type AboutPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: readonly string[];
  };
  definition: {
    title: string;
    intro: string;
    body: string;
  };
  factsSection: {
    eyebrow: string;
  };
  quickFacts: readonly {
    label: string;
    value: string;
  }[];
  members: readonly AboutMember[];
  story: {
    title: string;
    paragraphs: readonly string[];
  };
  similarArtists: readonly string[];
  faq: readonly AboutFaqEntry[];
  ctaSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  ctas: readonly AboutLink[];
};

export const aboutPage = {
  hero: {
    eyebrow: `About ${aboutCore.bandName}`,
    title: "Songs for the moments you do not know how to say out loud.",
    description: [
      `${aboutCore.bandName} are an ${aboutCore.genre} band from ${aboutCore.baseLocation}, making music that lives in the middle of real life: loud rooms, late nights, and everything that feels unfinished.`,
      "Their songs do not try to clean things up. They meet people where they are and turn it into something honest, loud, and worth holding onto."
    ]
  },
  definition: {
    title: "Who Are The Filibusters?",
    intro:
      `${aboutCore.bandName} are an ${aboutCore.genre} band built on one idea: music should make people feel seen.`,
    body:
      "Their sound blends high-energy instrumentation with lyrics that stay direct, personal, and easy to hold onto. Whether it is through a line that hits a little too close or a chorus that stays with you long after, the goal is the same: connection."
  },
  factsSection: {
    eyebrow: "Known for"
  },
  quickFacts: [
    {
      label: "High-Energy Live Shows",
      value: "Sets that feel loud, immediate, and impossible to ignore."
    },
    {
      label: "Emotionally Direct Writing",
      value: "Lyrics that say the things people usually leave unsaid."
    },
    {
      label: "Based in",
      value: aboutCore.baseLocation
    },
    {
      label: "Genre",
      value: aboutCore.genreDisplay
    }
  ],
  members: [
    {
      name: "Hanna Eyre",
      role: "Vocalist",
      photo: hannaPhoto,
      alt: "Hanna Eyre of The Filibusters."
    },
    {
      name: "Thomas Wintch",
      role: "Guitarist",
      photo: thomasPhoto,
      alt: "Thomas Wintch of The Filibusters."
    },
    {
      name: "Atticus Wintch",
      role: "Bassist",
      photo: atticusPhoto,
      alt: "Atticus Wintch of The Filibusters."
    },
    {
      name: "Curtis Schnitzer",
      role: "Drummer",
      photo: curtisPhoto,
      alt: "Curtis Schnitzer of The Filibusters."
    }
  ],
  story: {
    title: "How It Started",
    paragraphs: [
      "The band came together around a shared instinct: write what is real, and play it like it matters.",
      "What started as a few songs turned into something bigger: a sound shaped by live energy, late-night ideas, and a constant push to say things more honestly.",
      "There is not a clean, polished version of the story. That is kind of the point."
    ]
  },
  similarArtists: [
    "Paramore",
    "Arctic Monkeys",
    "The 1975"
  ],
  faq: [
    {
      question: "What genre is The Filibusters?",
      answer: `${aboutCore.bandName} are an ${aboutCore.genre} band with a focus on emotionally direct songwriting and high-energy performance. Fans of artists like Paramore, The 1975, and other modern alt rock acts often connect with their sound.`
    },
    {
      question: "Where is The Filibusters based?",
      answer: `${aboutCore.bandName} are based in ${aboutCore.baseLocation} and regularly perform live shows across the local and regional music scene.`
    },
    {
      question: "What are The Filibusters known for?",
      answer: `They are known for ${aboutCore.knownFor.toLowerCase()}, emotionally direct writing, and songs built around connection.`
    },
    {
      question: "Are The Filibusters playing shows?",
      answer: "Yes. Check the shows section on the homepage for currently listed dates."
    },
    {
      question: "What bands are similar to The Filibusters?",
      answer: `Fans may connect with ${aboutCore.bandName} through artists like Paramore, Arctic Monkeys, and The 1975.`
    }
  ],
  ctaSection: {
    eyebrow: "What next",
    title: "Stay Close to the Band",
    description: "Start with the music, show up to a show, or just reach out."
  },
  ctas: [
    {
      label: "Listen now",
      href: "/listen"
    },
    {
      label: "See shows",
      href: "/#shows"
    },
    {
      label: "Contact the band",
      href: "/contact"
    }
  ]
} satisfies AboutPageContent;
