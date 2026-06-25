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
      "Before The Filibusters, Hanna Eyre was already a national TV voice. At 15 she earned a three-chair turn on Season 12 of NBC's The Voice with a blind audition of Taylor Swift's \"Blank Space,\" joined Team Adam Levine, and sang her way to the live playoffs.",
      "She came up as a songwriter first — writing her own songs from age 11 and performing piano-led pop and R&B long before she fronted a rock band. Hayley Williams of Paramore sits high on her list of influences, which tells you most of what you need to know about where the band's sound points.",
      "In The Filibusters she aims all of it — the range, the training, the instinct for a hook — straight at Provo alt rock: louder, rawer, and more direct than a television stage ever allowed.",
      "Live, the emotional directness the band is built on lands hardest through her delivery — the one carrying the lines most people leave unsaid."
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
