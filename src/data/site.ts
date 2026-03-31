export type HeaderIconName =
  | "music"
  | "ticket"
  | "mail"
  | "instagram"
  | "spotify"
  | "tiktok";

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
    href: "https://www.instagram.com/thefilibusters/",
    icon: "instagram"
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/4Wv6mktSLS2i6sX2f0Jf9R",
    icon: "spotify"
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@thefilibusters",
    icon: "tiktok"
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
