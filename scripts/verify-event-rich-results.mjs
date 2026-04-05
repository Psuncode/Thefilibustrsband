import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const showPages = [
  "dist/shows/byu-battle-of-the-bands-2026/index.html",
  "dist/shows/devotional-unforum-2026-04-14/index.html",
  "dist/shows/utah-arts-festival-2026/index.html"
];

const fail = (message) => {
  throw new Error(message);
};

const extractEvent = (html, sourcePath) => {
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  for (const [, rawJson] of matches) {
    const parsed = JSON.parse(rawJson);
    const graph = Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed];
    const event = graph.find((entry) => entry?.["@type"] === "Event");

    if (event) {
      return event;
    }
  }

  fail(`Missing Event JSON-LD in ${sourcePath}`);
};

const readEvent = async (relativePath) => {
  const absolutePath = resolve(relativePath);
  const html = await readFile(absolutePath, "utf8");

  return {
    event: extractEvent(html, relativePath),
    path: relativePath
  };
};

const assertAbsoluteUrl = (value, label, pagePath) => {
  if (typeof value !== "string" || value.length === 0) {
    fail(`Missing ${label} in ${pagePath}`);
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(value);
  } catch {
    fail(`Invalid ${label} URL in ${pagePath}: ${value}`);
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    fail(`Non-http ${label} URL in ${pagePath}: ${value}`);
  }

  if (value.includes(" ")) {
    fail(`Unescaped space in ${label} URL in ${pagePath}: ${value}`);
  }
};

for (const pagePath of showPages) {
  const { event } = await readEvent(pagePath);

  if (!event.description) fail(`Missing Event description in ${pagePath}`);
  if (!event.endDate) fail(`Missing Event endDate in ${pagePath}`);
  if (!event.organizer) fail(`Missing Event organizer in ${pagePath}`);
  if (!event.offers) fail(`Missing Event offers in ${pagePath}`);

  const imageValue = Array.isArray(event.image) ? event.image[0] : event.image;
  assertAbsoluteUrl(imageValue, "image", pagePath);
}

console.log("Event rich result schema verified for all show pages.");
