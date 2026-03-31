import type { APIRoute } from "astro";
import { siteMeta } from "../data/site";

const routes = ["", "/about", "/contact", "/listen"] as const;

export const GET: APIRoute = () => {
  const lastModified = new Date().toISOString();
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
