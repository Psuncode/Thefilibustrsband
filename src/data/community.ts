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
  setlist?: string[];
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
    title: "Utah Arts Festival 2026: our Garden Stage setlist + recap",
    slug: "utah-arts-festival-2026-recap",
    category: "Show Updates",
    publishedAt: "2026-06-21T11:00:00-06:00",
    summary:
      "The Filibusters at the Utah Arts Festival 2026 — our full Garden Stage setlist plus a recap of an 8:30 PM slot in downtown Salt Lake City, right before Shakey Graves.",
    heroImage: utahArtsFestivalImage,
    heroAlt: "The Filibusters on the Garden Stage at the Utah Arts Festival 2026 in Salt Lake City, Utah.",
    relatedShowSlug: "utah-arts-festival-2026",
    setlist: [
      "Steal My Girl",
      "Jori",
      "Fall to Fly",
      "Just a Girl",
      "BUWYBF (Break Up With Your Boyfriend)",
      "Oranges",
      "I Want to Break Free",
      "Just Might",
      "Scissorhands",
      "Love at Eleven",
      "Nervous Breakdown",
      "Still Into You"
    ],
    body: [
      "Saturday, June 20 we played the Utah Arts Festival, up on the Garden Stage at Library Square in downtown Salt Lake City. An 8:30 PM slot, an outdoor stage, and one of the biggest events on Utah's summer calendar. For a Provo alt rock band used to sweaty Friday nights at Velour, walking onto a festival stage in SLC in front of a crowd that hadn't necessarily come for us was a different kind of nerve — and exactly the kind of room we love to win over.",
      "Playing Salt Lake City instead of a Provo club changes the whole math. The faces are new, the sound carries differently outside, and you get one set to make a stranger care. So we built the arc to grab the room fast: we opened on 'Steal My Girl,' pulled it straight into our own songs with 'Jori' and 'Fall to Fly,' and let a couple of big covers — 'Just a Girl' and 'I Want to Break Free' — do the heavy lifting in the middle. A festival crowd will sing those back to you whether they know your band or not, and that buy-in carried us into the back half.",
      "The originals are where we actually live, though. 'Just Might,' 'Scissorhands,' and 'Love at Eleven' are the songs we're building this next stretch of the band around — and a couple of them still aren't released. If you heard one at the festival and can't find it on Spotify yet, that's on purpose. We're getting them right before they go out, and we put a whole night into testing the new material at our New Song Showcase (recap on this page too).",
      "'BUWYBF' — 'Break Up With Your Boyfriend' — is the one from that run you can actually stream right now, and hearing a downtown SLC crowd lock into it mid-set was a small full-circle moment for a song that started as a late-night overthinking spiral.",
      "Going on right before Shakey Graves headlined the Garden Stage wasn't lost on us. Sharing a festival bill at that scale is exactly the kind of room we want more of, and a reminder that Provo alt rock travels just fine up I-15. We closed on 'Nervous Breakdown' and 'Still Into You' and walked off with the festival already feeling too short.",
      "If the Utah Arts Festival was your first Filibusters set, this is where it keeps going. Our next live dates are on the shows page, and the music lives on Spotify, Apple Music, and YouTube — go find the songs you heard in Salt Lake City."
    ]
  },
  {
    title: "Always Her album release at Velour: our setlist + recap",
    slug: "always-her-album-release-2026-recap",
    category: "Show Updates",
    publishedAt: "2026-06-20T11:00:00-06:00",
    summary:
      "The Filibusters at Velour Live Music Gallery in Provo — our full setlist and a recap of supporting Always Her's Friday-night album release show.",
    heroImage: alwaysHerImage,
    heroAlt: "The Filibusters live at Velour Live Music Gallery in Provo supporting Always Her's album release.",
    relatedShowSlug: "always-her-album-release-2026-06-19",
    setlist: [
      "Fall to Fly",
      "Give Me Some Heartbreak",
      "End of Beginning",
      "Oranges",
      "Jori",
      "Love at Eleven",
      "Nervous Breakdown",
      "Still Into You"
    ],
    body: [
      "Friday, June 19 we were back at Velour Live Music Gallery in Provo, this time supporting Always Her on their album release night. Album release shows have a specific kind of energy: the room came to celebrate someone, and the job of a support band is to hand the night momentum, not steal it. We took that seriously.",
      "Velour is home turf for us — 135 N University Ave, the room where a lot of the Provo music scene actually happens — and a release-night crowd is a generous one. We opened on 'Fall to Fly' and 'Give Me Some Heartbreak,' dropped 'End of Beginning' into the middle, and kept the back half ours with 'Oranges,' 'Jori,' and 'Love at Eleven' before closing on 'Nervous Breakdown' and 'Still Into You.' Tight, loud, and built to set the table.",
      "A quick note for anyone scanning the setlist: 'Give Me Some Heartbreak' is one of our unreleased originals. It's been showing up in our sets and at our New Song Showcase, and it's high on the list of new songs we're getting ready to record — so if it caught you Friday night, you heard it early.",
      "Nights like this are the whole point of a local scene: bands showing up for each other's biggest moments. Huge congrats to Always Her on the record — go find it. And if you came to Velour for them and left curious about us, that's the best-case scenario.",
      "More Filibusters dates are always on the shows page, and our music is on Spotify, Apple Music, and YouTube. Follow along — the new songs are coming."
    ]
  },
  {
    title: "New Song Showcase: every unreleased Filibusters song we played",
    slug: "filibusters-new-song-showcase-2026-recap",
    category: "Show Updates",
    publishedAt: "2026-06-13T10:00:00-06:00",
    summary:
      "Inside The Filibusters' free acoustic New Song Showcase at The Green House in Provo — the full setlist of unreleased originals, and how the crowd helped pick which new songs we record next.",
    heroImage: newSongShowcaseImage,
    heroAlt: "The Filibusters playing an acoustic new-song showcase at The Green House in Provo, Utah.",
    relatedShowSlug: "filibusters-new-song-showcase-2026-06-12",
    setlist: [
      "Give Me Some Heartbreak",
      "My Fish Just Died (and I didn't even cry)",
      "Still Mine (The More You Know)",
      "Two Souls",
      "Runaway",
      "Can We Go Dancing?",
      "Love at Eleven",
      "Nervous Breakdown"
    ],
    body: [
      "Friday, June 12 we did something a little different: a free, all-acoustic showcase at The Green House in Provo (653 N 200 E), built entirely around music nobody had heard yet. Every song on the setlist below is an unreleased Filibusters original — never-before-played writing, stripped back to just the bones, with nowhere for a weak song to hide.",
      "The point wasn't to perform at the room — it was to ask it. We wanted honest reactions to every new track, because the crowd favorites from this night are the ones we take into the studio first. If a song landed Friday, you genuinely helped decide its future.",
      "So here's the tease, straight up: 'Give Me Some Heartbreak,' 'My Fish Just Died (and I didn't even cry),' 'Still Mine (The More You Know),' 'Two Souls,' 'Runaway,' and 'Can We Go Dancing?' are all new, all unreleased, and all in the running to be the next thing we put out. A few of them are going to surprise you when they come back fully produced and turned all the way up — acoustic is the most honest test a song can get, and these passed.",
      "It says something that 'Love at Eleven' and 'Nervous Breakdown' have started to feel like the familiar ones in a set of brand-new material. That's the whole arc we're chasing right now: write fast, play it live, let the room tell us the truth, then record the ones that earned it.",
      "Thank you to everyone who came out to The Green House and actually told us what they thought — that feedback is already shaping the recording list. To hear which of these new songs make it to release first, follow along on Spotify, Apple Music, and YouTube, and keep an eye on the shows page for the next time we test new material live."
    ]
  },
  {
    title: "Punk Fest Summer Kickoff: The Filibusters at Punko Vintage, Provo",
    slug: "punk-fest-summer-kickoff-2026-recap",
    category: "Show Updates",
    publishedAt: "2026-05-31T10:00:00-06:00",
    summary:
      "The Filibusters recap the Punk Fest Summer Kickoff at Punko Vintage in Provo, Utah — a stacked five-band DIY bill and the start of our summer of live shows.",
    heroImage: punkFestImage,
    heroAlt: "The Filibusters at the Punk Fest Summer Kickoff at Punko Vintage in Provo, Utah.",
    relatedShowSlug: "punk-fest-summer-kickoff-2026-05-30",
    body: [
      "Saturday, May 30 we played the Punk Fest Summer Kickoff at Punko Vintage in Provo (283 N University Ave) — a five-band bill packed into a vintage clothing shop, which is exactly as fun as it sounds. We shared the night with Misdemeanor, Hatchback, Hurry Up & Wait, and T Street, with the racks pushed back and the room turned into a stage.",
      "DIY rooms like Punko bring out a different side of our set. There's no barrier between the band and the crowd, the volume fills the space fast, and everybody there actually wants loud music on a Saturday night. For an alt rock band that writes for exactly that kind of room, it's home — closer and sweatier than a club, and all the better for it.",
      "Kicking off summer with a room full of the Provo punk scene was the right way to start the season. It was the first show in a run that carried us through June — The Green House, Velour, and all the way up to the Utah Arts Festival in Salt Lake City — so if Punko was where you first caught us, you got in early.",
      "We leaned on the loud, direct end of our catalog for this one, and worked in a couple of the newer originals we've been roadtesting before taking them into the studio. Tracking how a new song lands in a room like Punko is half the reason we play bills like this.",
      "Thanks to Punko Vintage for putting it together and to everyone who came to dig through the racks and stay for the sets. More dates are on the shows page, and our music is on Spotify, Apple Music, and YouTube — the new songs we've been testing live are on the way."
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
