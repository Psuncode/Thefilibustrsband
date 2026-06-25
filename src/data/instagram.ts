import type { ImageMetadata } from "astro";

import battleWinnerImage from "../assets/images/battle-of-the-band-winner.jpg";
import followPromptSinger from "../assets/images/follow-prompt-singer.jpg";
import heroBand from "../assets/images/hero-band.jpg";
import punkFestImage from "../assets/images/punk-fest-2026-05-30.jpg";
import utahArtFestivalImage from "../assets/images/utah-art-festival-2026.png";
import velourShowImage from "../assets/images/vlour show.jpg";

export type InstagramPost = {
  // Local image (no third-party JS / no Instagram embed script is loaded).
  // To feature a real post: screenshot/save it into src/assets/images/, import
  // it above, and point `href` at the post permalink (https://www.instagram.com/p/<id>/).
  image: ImageMetadata;
  alt: string;
  href: string;
};

export const instagramProfileUrl = "https://www.instagram.com/thefilibustersband";

export const instagramGallery = {
  eyebrow: "On Instagram",
  title: "Straight from @thefilibustersband.",
  description:
    "A few moments from the feed — shows, studio, and the parts that never make it onto the posters. Tap any photo to open it on Instagram.",
  ctaLabel: "Follow on Instagram",
  // Tiles use existing band photos; each links to a specific @thefilibustersband
  // post. To refresh, swap the `href` (and optionally the image) for newer posts.
  posts: [
    {
      image: heroBand,
      alt: "The Filibusters band photo",
      href: "https://www.instagram.com/p/DWpPqtbEmYR/"
    },
    {
      image: punkFestImage,
      alt: "The Filibusters at Punk Fest Summer Kickoff in Provo",
      href: "https://www.instagram.com/p/DVrMDTuDxuj/"
    },
    {
      image: velourShowImage,
      alt: "The Filibusters live at Velour Live Music Gallery in Provo",
      href: "https://www.instagram.com/p/DWZQol6AJ3f/"
    },
    {
      image: utahArtFestivalImage,
      alt: "The Filibusters at the Utah Arts Festival in Salt Lake City",
      href: "https://www.instagram.com/p/DX181oBA3ov/"
    },
    {
      image: battleWinnerImage,
      alt: "The Filibusters after winning BYU Battle of the Bands 2026",
      href: "https://www.instagram.com/p/DXPHLYQAJ0L/"
    },
    {
      image: followPromptSinger,
      alt: "The Filibusters vocalist during a live performance",
      href: "https://www.instagram.com/p/DWhHP9PiXJM/"
    }
  ] as const satisfies readonly InstagramPost[]
} as const;
