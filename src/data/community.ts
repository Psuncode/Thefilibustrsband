import type { ImageMetadata } from "astro";

import battleWinnerImage from "../assets/images/battle-of-the-band-winner.jpg";
import breakUpWithYourBoyfriendCover from "../assets/images/break-up-with-your-boyfriend-cover.jpg";
import followPromptSinger from "../assets/images/follow-prompt-singer.jpg";
import heroBand from "../assets/images/hero-band.jpg";
import devotionalUnforumImage from "../assets/images/devotional-unforum.png";
import velourShowImage from "../assets/images/vlour show.jpg";
import punkFestImage from "../assets/images/punk-fest-2026-05-30.jpg";
import newSongShowcaseImage from "../assets/images/filibusters-new-song-showcase-2026-06-12.png";
import alwaysHerImage from "../assets/images/velour-2026-06-19.png";
import utahArtsFestivalImage from "../assets/images/utah-art-festival-2026.png";

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
    title: "Recap: we played the Utah Arts Festival in Salt Lake City",
    slug: "utah-arts-festival-2026-recap",
    category: "Show Updates",
    publishedAt: "2026-06-21T11:00:00-06:00",
    summary:
      "Our biggest stage yet — 8:30 PM on the Garden Stage at the Utah Arts Festival in downtown Salt Lake City, right before Shakey Graves.",
    heroImage: utahArtsFestivalImage,
    heroAlt: "The Filibusters on the Garden Stage at the Utah Arts Festival 2026 in Salt Lake City.",
    relatedShowSlug: "utah-arts-festival-2026",
    body: [
      "Saturday, June 20 we took the Garden Stage at the Utah Arts Festival, down at Library Square in downtown Salt Lake City. An 8:30 PM slot, an outdoor stage, and a festival crowd that wasn't necessarily there for us yet — exactly the kind of room we love to win over.",
      "Playing SLC instead of a Provo Friday night changes the math. The faces are new, the sound carries differently outside, and you have a set's length to make a stranger care. We leaned into what we always lean into: loud, direct songs that don't wait around to land.",
      "Going on right before Shakey Graves headlined the night was not lost on us. Sharing a bill like that, at a festival this size, is the kind of thing we'll be chasing more of.",
      "If you caught us for the first time in Salt Lake, this is where we keep the thread going. Next dates are on the shows page, and the music lives on Spotify, Apple Music, and YouTube."
    ]
  },
  {
    title: "Recap: supporting Always Her's album release at Velour",
    slug: "always-her-album-release-2026-recap",
    category: "Show Updates",
    publishedAt: "2026-06-20T11:00:00-06:00",
    summary:
      "A Friday night at Velour helping Always Her celebrate their album release — a hometown room that always shows up.",
    heroImage: alwaysHerImage,
    heroAlt: "The Filibusters live at Velour Live Music Gallery supporting Always Her's album release.",
    relatedShowSlug: "always-her-album-release-2026-06-19",
    body: [
      "Friday, June 19 we were back at Velour Live Music Gallery, this time supporting Always Her on their album release night. Album release shows have a specific kind of energy — the room is there to celebrate someone, and your job as support is to hand the night momentum, not steal it.",
      "Velour is home turf for us, and a release-night crowd is a generous one. We kept our set tight and loud, set the table, and tried to leave the room warmer than we found it before Always Her took over.",
      "Nights like this are the whole point of a local scene: bands showing up for each other's biggest moments. Congrats to Always Her — go find the record.",
      "More from us is always on the shows page, and the songs are on Spotify, Apple Music, and YouTube."
    ]
  },
  {
    title: "Recap: the free acoustic New Song Showcase at The Green House",
    slug: "filibusters-new-song-showcase-2026-recap",
    category: "Show Updates",
    publishedAt: "2026-06-13T10:00:00-06:00",
    summary:
      "We played a room full of unreleased songs and let the crowd vote on what we record next. The feedback was the whole show.",
    heroImage: newSongShowcaseImage,
    heroAlt: "The Filibusters playing an acoustic new-song showcase at The Green House in Provo.",
    relatedShowSlug: "filibusters-new-song-showcase-2026-06-12",
    body: [
      "Friday, June 12 we did something a little different: a free, all-acoustic showcase at The Green House in Provo, built entirely around music nobody had heard yet. Unreleased favorites, never-before-played originals, and a stripped-back setup that left the songs nowhere to hide.",
      "The point wasn't to perform at the room — it was to ask it. We wanted real reactions to every new track, because the crowd favorites from this night are the ones we take into the studio next. If a song landed, you helped decide its future.",
      "Stripping everything down to acoustic is the most honest test a song can get. A few of these are going to surprise you when they come back fully produced — and you'll know you were in the room when we figured that out.",
      "Thank you to everyone who came and actually told us what they thought. Watch the music pages on Spotify, Apple Music, and YouTube to hear which ones make it."
    ]
  },
  {
    title: "Recap: Punk Fest Summer Kickoff at Punko Vintage",
    slug: "punk-fest-summer-kickoff-2026-recap",
    category: "Show Updates",
    publishedAt: "2026-05-31T10:00:00-06:00",
    summary:
      "Live music and vintage racks under one roof — we kicked off summer in Provo on a stacked five-band punk bill.",
    heroImage: punkFestImage,
    heroAlt: "The Filibusters at the Punk Fest Summer Kickoff at Punko Vintage in Provo.",
    relatedShowSlug: "punk-fest-summer-kickoff-2026-05-30",
    body: [
      "Saturday, May 30 we played the Punk Fest Summer Kickoff at Punko Vintage in Provo — a five-band bill packed into a vintage clothing shop, which is exactly as fun as it sounds. We shared the night with Misdemeanor, Hatchback, Hurry Up & Wait, and T Street.",
      "DIY rooms like Punko bring out a different side of our set. There's no barrier between the band and the crowd, the volume fills the space fast, and everybody's there because they actually want loud music on a Saturday. That's our natural habitat.",
      "Kicking off summer with a room full of the Provo punk scene was the right way to start the season. Thanks to Punko Vintage for putting it together and to everyone who came to dig through the racks and stay for the sets.",
      "We've got more dates coming on the shows page, and our music is on Spotify, Apple Music, and YouTube."
    ]
  },
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
