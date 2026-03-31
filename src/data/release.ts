import breakUpWithYourBoyfriendCover from "../assets/images/break-up-with-your-boyfriend-cover.jpg";

export const latestRelease = {
  eyebrow: "Latest release",
  title: "Break Up With Your Boyfriend",
  description: "The new Filibusters release brings the same sharp hooks and chaotic energy from the live set into your headphones.",
  artwork: breakUpWithYourBoyfriendCover,
  links: [
    {
      label: "Spotify",
      href: "https://open.spotify.com/artist/4Mf8AkUvGERBfOkG8ozuDl?utm_medium=share&utm_source=linktree",
      icon: "spotify"
    },
    {
      label: "Apple Music",
      href: "https://music.apple.com/us/artist/the-filibusters/1550597371",
      icon: "apple"
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@TheFilibusters",
      icon: "play"
    }
  ]
} as const;
