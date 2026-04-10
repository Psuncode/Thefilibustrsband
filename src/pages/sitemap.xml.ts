import type { APIRoute } from "astro";
import { communityPosts } from "../data/community";
import { siteMeta } from "../data/site";
import { getAllShowSlugs } from "../lib/shows/data";

export const GET: APIRoute = async () => {
  const lastModified = new Date().toISOString();
  const showSlugs = await getAllShowSlugs();
  const communityRoutes = communityPosts.map((post) => `/community/${post.slug}`);
  const routes = [
    "",
    "/about",
    "/community",
    "/contact",
    "/listen",
    "/press",
    "/press/ai",
    "/provo-alt-rock-band",
    "/privacy",
    "/shows",
    ...communityRoutes,
    ...showSlugs.map((slug) => `/shows/${slug}`)
  ];
  const urls = routes
    .map((route) => {
      const path = route === "" ? "/" : route;

      return [
        "  <url>",
        `    <loc>${siteMeta.url}${path === "/" ? "" : path}</loc>`,
        `    <lastmod>${lastModified}</lastmod>`,
        "  </url>"
      ].join("\n");
    })
    .join("\n");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>"
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
