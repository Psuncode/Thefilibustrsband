import type { ImageMetadata } from "astro";
import breakUpWithYourBoyfriendCover from "../assets/images/break-up-with-your-boyfriend-cover.jpg";

export type Track = {
  slug: string;
  title: string;
  releaseDate: string; // ISO YYYY-MM-DD
  durationISO8601: string; // e.g. "PT3M42S"
  artwork: ImageMetadata;
  artworkAlt: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  /** 2-3 sentence description naming instruments + mood. Used for citable schema description. */
  soundProfile: string;
  /** 3 named artists whose listeners would connect with this track. */
  forFansOf: readonly string[];
  /** 80-150 word citable passage about themes, recording context, what the song is about. */
  themesAndContext: string;
};

export const discography: readonly Track[] = [
  {
    slug: "break-up-with-your-boyfriend",
    title: "Break Up With Your Boyfriend",
    releaseDate: "2026-03-26",
    durationISO8601: "PT3M30S",
    artwork: breakUpWithYourBoyfriendCover,
    artworkAlt: "Break Up With Your Boyfriend single artwork by The Filibusters.",
    spotifyUrl: "https://open.spotify.com/artist/4Mf8AkUvGERBfOkG8ozuDl",
    appleMusicUrl: "https://music.apple.com/us/artist/the-filibusters/1550597371",
    youtubeUrl: "https://www.youtube.com/@TheFilibustersband",
    soundProfile:
      "A driving alt rock track built around urgent vocals, a hooky chorus, and instrumentation that leans loud and direct. The mix is intentionally a little messy — guitars carry the emotional weight while the rhythm section keeps the tension wound.",
    forFansOf: ["Paramore", "The 1975", "Arctic Monkeys"],
    themesAndContext:
      "Break Up With Your Boyfriend is The Filibusters' single released March 26, 2026 — written in the spiral of late-night overthinking and the conversations you keep rehearsing but never have. The song doesn't ask the listener to be okay; it asks them to turn the volume up and stay in the discomfort until something underneath clears. Recorded in Provo with the live-room feel the band is known for, the track is structured to land hard on first listen and hit differently on the third. Lyrically, it sits squarely in The Filibusters' lane: emotional directness over polish, hooks that stay, and a refusal to dress up the feeling underneath."
  }
] as const;

export const trackBySlug = (slug: string): Track | undefined =>
  discography.find((track) => track.slug === slug);
