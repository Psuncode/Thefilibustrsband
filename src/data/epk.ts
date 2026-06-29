import type { ImageMetadata } from "astro";

import heroBand from "../assets/images/hero-band.jpg";
import battleWinner from "../assets/images/battle-of-the-band-winner.jpg";
import velourShow from "../assets/images/velour-2026-06-19.png";
import { siteMeta } from "./site";

export type EpkPhoto = {
  label: string;
  image: ImageMetadata;
  credit?: string;
  downloadHref: string;
};

export type EpkStat = { label: string; value: string };

export type EpkTechRider = {
  inputList?: readonly string[];
  backline?: readonly string[];
  stagePlotImage?: ImageMetadata;
  notes?: readonly string[];
};

export type Epk = {
  heroOneLiner: string;
  pitch: readonly string[];
  photoPack: readonly EpkPhoto[];
  drawStats?: readonly EpkStat[];
  techRider?: EpkTechRider;
  booking: {
    email: string;
    mailtoSubject: string;
    mailtoBodyLines: readonly string[];
  };
};

export const epk = {
  heroOneLiner:
    "Provo, Utah alt rock built for loud rooms — fronted by a Voice alum, playing for the crowd, not the recording.",
  pitch: [
    "The Filibusters are a high-energy Provo alt rock band built around live connection: hooks that land on first listen, emotionally direct songs, and a frontwoman — Hanna Eyre, a Season 12 contestant on NBC's The Voice — who carries the room.",
    "They draw a young, engaged local crowd and have shared bills across the Utah scene, from Velour Live Music Gallery in Provo to the Utah Arts Festival in Salt Lake City. Easy to work with, ready to load in, and built to leave a room louder than they found it."
  ],
  photoPack: [
    {
      label: "Band photo (primary)",
      image: heroBand,
      downloadHref: heroBand.src
    },
    {
      label: "Live — Velour, Provo",
      image: velourShow,
      downloadHref: velourShow.src
    },
    {
      label: "BYU Battle of the Bands 2026 — winner",
      image: battleWinner,
      downloadHref: battleWinner.src
    }
  ],
  booking: {
    email: siteMeta.contactEmail,
    mailtoSubject: "Booking inquiry — The Filibusters",
    mailtoBodyLines: [
      "Hi Filibusters,",
      "",
      "I'd like to book you for:",
      "  - Venue / event: ",
      "  - Date(s): ",
      "  - City: ",
      "  - Capacity: ",
      "  - Offer / guarantee: ",
      "",
      "Anything else useful (links, set length, backline available): ",
      "",
      "Thanks!"
    ]
  }
} as const satisfies Epk;
