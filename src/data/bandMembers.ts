import type { ImageMetadata } from "astro";

import atticusPhoto from "../assets/images/atticus-wintch-bassist.jpg";
import curtisPhoto from "../assets/images/curtis-schnitzer-drummer.jpg";
import hannaPhoto from "../assets/images/hanna-eyre-vocalist.jpg";
import thomasPhoto from "../assets/images/thomas-wintch.jpg";

export type BandMember = {
  slug: string;
  name: string;
  role: string;
  image: ImageMetadata;
  imageAlt: string;
  bio: readonly string[];
};

export const bandMembers = [
  {
    slug: "hanna-eyre",
    name: "Hanna Eyre",
    role: "Vocalist",
    image: hannaPhoto,
    imageAlt: "Hanna Eyre, vocalist of The Filibusters.",
    bio: [
      "Hanna is the voice out front for The Filibusters — the one carrying the lines that say the things people usually leave unsaid.",
      "Her singing leans into the same instinct the band was built on: stay direct, stay honest, and let the loud rooms do the rest.",
      "Catch it live and the emotional directness the band is known for lands hardest through her delivery."
    ]
  },
  {
    slug: "thomas-wintch",
    name: "Thomas Wintch",
    role: "Guitarist",
    image: thomasPhoto,
    imageAlt: "Thomas Wintch, guitarist of The Filibusters.",
    bio: [
      "Thomas plays guitar in The Filibusters, shaping the high-energy sound that makes the live set impossible to ignore.",
      "His parts sit right in the middle of the band's alt rock instinct: immediate, a little restless, and built for smaller, sweatier venues.",
      "On stage, the riffs are there to push the songs louder, not to clean them up."
    ]
  },
  {
    slug: "atticus-wintch",
    name: "Atticus Wintch",
    role: "Bassist",
    image: atticusPhoto,
    imageAlt: "Atticus Wintch, bassist of The Filibusters.",
    bio: [
      "Atticus holds down bass for The Filibusters, anchoring the low end that keeps the band's live energy moving.",
      "It is the part you feel more than hear — the foundation the rest of the noise is built on.",
      "In a room full of volume, the bass is what keeps everyone locked in together."
    ]
  },
  {
    slug: "curtis-schnitzer",
    name: "Curtis Schnitzer",
    role: "Drummer",
    image: curtisPhoto,
    imageAlt: "Curtis Schnitzer, drummer of The Filibusters.",
    bio: [
      "Curtis is on drums for The Filibusters, driving the tempo that makes the sets feel loud, immediate, and alive.",
      "The kit is the engine behind the band's high-energy shows — the thing that turns a song into a room you can feel.",
      "When the live set hits hardest, it is usually because the drums are pushing everything forward."
    ]
  }
] as const satisfies readonly BandMember[];
