export type HeaderIconName =
  | "music"
  | "ticket"
  | "mail"
  | "apple"
  | "instagram"
  | "spotify"
  | "tiktok"
  | "youtube";

export const iconPaths: Record<HeaderIconName, string> = {
  music: "M9 18V5l12-2v13M9 18a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  ticket: "M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5V10a2 2 0 1 0 0 4v2.5A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5V14a2 2 0 1 0 0-4V7.5Z",
  mail: "M4 7h16v10H4V7Zm1.5 1.5 6.5 4.5 6.5-4.5",
  apple: "M15.2 12.1c0-2.1 1.7-3.1 1.8-3.2-1-.4-2.5-.5-3.4.6-.8 1-1.4 1.1-1.8 1.1s-1.2-.1-1.8-1c-.8-1-2.2-1.1-3.1-.4-1.7 1.2-2 4-.7 6.1.6 1 1.4 2.1 2.4 2.1.9 0 1.2-.6 2.3-.6s1.4.6 2.3.6c1 0 1.6-.9 2.2-1.9.4-.7.6-1.1.7-1.3-.1 0-1.9-.8-1.9-2.1ZM13.7 6.4c.5-.6.8-1.3.7-2.1-.7 0-1.5.4-2 .9-.5.5-.9 1.3-.8 2 .8.1 1.6-.3 2.1-.8Z",
  instagram: "M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm8.5 3.5h.01M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  spotify: "M6 9.5c3.7-1.1 8.2-.8 11.8 1M7.2 12.5c2.8-.8 6.2-.5 8.7.9M8.4 15.4c2-.5 4.3-.3 6 .7",
  tiktok: "M14 4c.4 1.7 1.6 3 3.5 3.4V10a6.8 6.8 0 0 1-3.5-1V15a4 4 0 1 1-4-4c.3 0 .7 0 1 .1V8.3a7 7 0 1 0 3 6.7V4Z",
  youtube: "M21.6 8.2a2.9 2.9 0 0 0-2-2.1C17.8 5.5 12 5.5 12 5.5s-5.8 0-7.6.6a2.9 2.9 0 0 0-2 2.1A30 30 0 0 0 2 12a30 30 0 0 0 .4 3.8 2.9 2.9 0 0 0 2 2.1c1.8.6 7.6.6 7.6.6s5.8 0 7.6-.6a2.9 2.9 0 0 0 2-2.1A30 30 0 0 0 22 12a30 30 0 0 0-.4-3.8ZM10 15.5v-7l6 3.5-6 3.5Z"
};

type SocialLink = {
  label: string;
  href: string;
  icon: HeaderIconName;
};

type PrimaryNavItem = {
  label: string;
  href: string;
  icon: HeaderIconName;
};

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/thefilibustersband",
    icon: "instagram"
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/4Mf8AkUvGERBfOkG8ozuDl?si=sVvFzSJ-Qd-zMQ-ao6ry9g",
    icon: "spotify"
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@thefilibustersband",
    icon: "tiktok"
  },
  {
    label: "Apple Music",
    href: "https://music.apple.com/us/artist/the-filibusters/1550597371",
    icon: "apple"
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@TheFilibusters",
    icon: "youtube"
  }
] as const satisfies readonly SocialLink[];

export const siteMeta = {
  title: "The Filibusters",
  description: "Pop-punk, covers, and chaos worth showing up for.",
  url: "https://thefilibustersband.com",
  contactEmail: "thefilibustersband@gmail.com",
  socials: socialLinks.map(({ label, href }) => ({ label, href }))
} as const;

export const primaryNav = [
  { label: "Music", href: "#latest-release", icon: "music" },
  { label: "Shows", href: "#shows", icon: "ticket" },
  { label: "Community", href: "#community", icon: "mail" }
] as const satisfies readonly PrimaryNavItem[];
