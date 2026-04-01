import heroBand from "../assets/images/hero-band.jpg";
import filibustersLogoText from "../assets/images/filibusters-logo-text.png";
import { siteMeta } from "./site";

export const pressPage = {
  eyebrow: "Press Room",
  title: "The Filibusters press room.",
  description:
    "A clean place for bios, approved visuals, and the core context media, venues, and bookers need without digging through social posts.",
  shortBio:
    "The Filibusters are an alt rock band from Provo, Utah making loud, emotionally direct songs built for live rooms, late nights, and real connection.",
  longBio: [
    "The Filibusters write and perform with one priority above everything else: make people feel seen without sanding the emotion down into something polite.",
    "The band blends high-energy instrumentation with lyrics that stay direct and personal, creating songs that feel just as natural in headphones as they do in a packed room.",
    "Based in Provo, Utah, the Filibusters are building momentum through live performance, release consistency, and a band identity that feels immediate instead of manufactured."
  ],
  approvedAssets: [
    {
      label: "Band photo",
      description: "Primary group image for articles, event listings, and promo context.",
      href: heroBand.src
    },
    {
      label: "Wordmark logo",
      description: "The Filibusters logo lockup for web and editorial use.",
      href: filibustersLogoText.src
    }
  ],
  quotes: [
    "Songs for the moments you do not know how to say out loud.",
    "High-energy live shows with emotionally direct writing at the center.",
    "Alt rock from Provo, Utah built for connection, not background noise."
  ],
  videoLink: "https://www.youtube.com/@TheFilibusters",
  contactLabel: "Press contact",
  contactEmail: siteMeta.contactEmail
} as const;
