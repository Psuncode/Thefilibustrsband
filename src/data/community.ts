import type { ImageMetadata } from "astro";

import battleWinnerImage from "../assets/images/battle-of-the-band-winner.jpg";
import breakUpWithYourBoyfriendCover from "../assets/images/break-up-with-your-boyfriend-cover.jpg";
import followPromptSinger from "../assets/images/follow-prompt-singer.jpg";
import heroBand from "../assets/images/hero-band.jpg";
import devotionalUnforumImage from "../assets/images/devotional-unforum.png";
import velourShowImage from "../assets/images/vlour show.jpg";

export type CommunityCategory =
  | "Band News"
  | "Show Updates"
  | "Release Updates"
  | "Behind the Scenes";

export type CommunityPost = {
  title: string;
  slug: string;
  category: CommunityCategory;
  publishedAt: string;
  summary: string;
  heroImage: ImageMetadata;
  heroAlt: string;
  body: string[];
  relatedShowSlug?: string;
};

export const communityPage = {
  eyebrow: "Community",
  title: "Band updates that feel closer than a press release.",
  description:
    "News, release moments, show updates, and the behind-the-scenes pieces that make the Filibusters feel like more than a homepage."
} as const;

export const communityCategories = [
  "Band News",
  "Show Updates",
  "Release Updates",
  "Behind the Scenes"
] as const satisfies readonly CommunityCategory[];

export const communityPosts = [
  {
    title: "Les Femmes de Velour 2026 recap: a sweaty, full-room set",
    slug: "les-femmes-de-velour-2026-recap",
    category: "Show Updates",
    publishedAt: "2026-05-09T11:00:00-06:00",
    summary:
      "Velour was packed for Les Femmes de Velour 2026 and the room moved with the set from the first chorus on.",
    heroImage: velourShowImage,
    heroAlt: "The Filibusters live at Velour Live Music Gallery during Les Femmes de Velour 2026.",
    relatedShowSlug: "les-femmes-de-velour-2026-05-08",
    body: [
      "Les Femmes de Velour 2026 lined up exactly the way a Velour show should: a real crowd, a tight bill, and a room that actually moves. The Filibusters played Friday, May 8 at Velour Live Music Gallery in Provo on a co-bill with Gralley, Shrink The Giant, and Orcamind.",
      "The festival itself is built around femme artists shaping the local Provo and Utah music scene — 40+ artists across 11 nights, organized around connection more than spectacle. The Filibusters' set leaned into that energy: emotionally direct songwriting, a live show that hits more than it polishes, and a crowd that stayed close through every song.",
      "If this was your first Filibusters show, the live energy is going to keep showing up. The next dates are on the shows page, and new music keeps moving on Spotify, Apple Music, and YouTube."
    ]
  },
  {
    title: "Playing BYU's Devotional: Unforum at the Marriott Center",
    slug: "devotional-unforum-2026-recap",
    category: "Show Updates",
    publishedAt: "2026-04-15T10:00:00-06:00",
    summary:
      "The Filibusters performed as part of BYU's year-in-review devotional at the Marriott Center on April 14, 2026.",
    heroImage: devotionalUnforumImage,
    heroAlt: "BYU Devotional: Unforum at the Marriott Center where The Filibusters performed.",
    relatedShowSlug: "devotional-unforum-2026-04-14",
    body: [
      "The Filibusters played BYU's Devotional: Unforum at the Marriott Center on Tuesday, April 14, 2026. The Unforum is BYU's student-centered year in review — performances, service moments, and the kinds of achievements that hit different on a stage that big.",
      "Playing the Marriott Center is a different scale than a Velour Friday night. The Filibusters brought the same direct sound to a much bigger room: loud, emotionally honest, and built for the audience to feel something in real time.",
      "Updates from the band keep landing here. Live dates are on the shows page, new music is on Spotify, Apple Music, and YouTube, and the band's email goes to filibustersband@gmail.com."
    ]
  },
  {
    title: "The Filibusters win BYU Battle of the Bands 2026",
    slug: "byu-battle-of-the-bands-2026-win",
    category: "Band News",
    publishedAt: "2026-03-29T10:00:00-06:00",
    summary:
      "A milestone night in Provo: loud room, full crowd, and a win that felt earned in real time.",
    heroImage: battleWinnerImage,
    heroAlt: "The Filibusters after winning BYU Battle of the Bands 2026.",
    relatedShowSlug: "byu-battle-of-the-bands-2026",
    body: [
      "BYU Battle of the Bands 2026 turned into one of those nights that changes how a band remembers itself. The room was full, the set felt immediate, and the response from the crowd never dipped.",
      "Winning mattered, but the bigger thing was what the night confirmed: these songs are built for live rooms. The band showed up with a set that was loud, direct, and impossible to treat like background noise.",
      "If you found the Filibusters through that show, this is where the updates keep going. More live dates, more music, and more of the moments that do not fit on a flyer are on the way."
    ]
  },
  {
    title: "Break Up With Your Boyfriend is officially out",
    slug: "break-up-with-your-boyfriend-out-now",
    category: "Release Updates",
    publishedAt: "2026-03-26T09:00:00-06:00",
    summary:
      "The latest release is live across platforms and built for the late-night overthinking spiral it came from.",
    heroImage: breakUpWithYourBoyfriendCover,
    heroAlt: "Break Up With Your Boyfriend single artwork by The Filibusters.",
    body: [
      "Break Up With Your Boyfriend is out now. It sits in that exact Filibusters lane where the hook lands hard but the feeling under it stays messy on purpose.",
      "This release is for the nights when your brain keeps circling the same conversation and the volume needs to go up before anything gets clearer.",
      "If this song is your entry point, keep an eye on community updates and show announcements. The next pieces around it are going to matter just as much as the stream link."
    ]
  },
  {
    title: "What the room feels like before the set starts",
    slug: "before-the-set-starts",
    category: "Behind the Scenes",
    publishedAt: "2026-03-20T18:30:00-06:00",
    summary:
      "A closer look at the minutes before the lights hit: nerves, noise, and the kind of focus that only live shows create.",
    heroImage: followPromptSinger,
    heroAlt: "The Filibusters singer during a live performance moment.",
    body: [
      "There is always a strange calm right before a set. Cables are everywhere, somebody is checking one last thing, and the room feels like it is holding its breath without saying it.",
      "That stretch matters because it is where the chaos sharpens into intent. The Filibusters do not chase polish as much as presence, and those last few minutes are where the energy locks in.",
      "Community is where more of these fragments live. Not just announcements, but the pieces that make the band feel human between the posters and release graphics."
    ]
  },
  {
    title: "Why this next phase of the band feels bigger",
    slug: "next-phase-feels-bigger",
    category: "Show Updates",
    publishedAt: "2026-03-18T14:00:00-06:00",
    summary:
      "More songs, stronger live momentum, and a clearer sense of what kind of band the Filibusters are becoming.",
    heroImage: heroBand,
    heroAlt: "The Filibusters band photo.",
    body: [
      "Something has shifted in the last stretch of shows and releases. The songs are hitting harder, the audience connection is getting faster, and the band feels more certain about what deserves to stay raw.",
      "That does not mean everything is suddenly polished. It means the identity is sharper. The Filibusters sound like a band leaning harder into the parts that actually connect: live energy, direct writing, and no interest in sanding the edges off.",
      "This page exists so the next phase has somewhere to live. Not just on social posts that disappear, but on pages worth linking back to later."
    ]
  }
] as const satisfies readonly CommunityPost[];
