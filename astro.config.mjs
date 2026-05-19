import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import { showLastmod, communityLastmod } from "./src/data/lastmod-map.mjs";

const showLastmodBySlug = new Map(
  showLastmod.map((show) => [`/shows/${show.slug}`, show.startsAt])
);
const communityLastmodBySlug = new Map(
  communityLastmod.map((post) => [`/community/${post.slug}`, post.publishedAt])
);

export default defineConfig({
  site: "https://www.thefilibustersband.com",
  output: "static",
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap({
      serialize(item) {
        const url = new URL(item.url);
        const pathname = url.pathname.replace(/\/$/, "") || "/";
        const explicitLastmod =
          showLastmodBySlug.get(pathname) ?? communityLastmodBySlug.get(pathname);
        if (explicitLastmod) {
          return { ...item, lastmod: new Date(explicitLastmod).toISOString() };
        }
        return item;
      }
    })
  ]
});
