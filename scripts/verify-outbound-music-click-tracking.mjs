import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const trackingBundlePath = "dist/_astro/BaseLayout.astro_astro_type_script_index_0_lang.yAgloepR.js";
const trackedPages = [
  {
    path: "dist/index.html",
    locations: ["homepage-release"]
  },
  {
    path: "dist/listen/index.html",
    locations: ["listen-primary", "listen-follow"]
  }
];

const fail = (message) => {
  throw new Error(message);
};

const trackingBundle = await readFile(resolve(trackingBundlePath), "utf8");

if (!trackingBundle.includes('outbound_music_click')) {
  fail(`Missing outbound music tracking event in ${trackingBundlePath}`);
}

if (!trackingBundle.includes("data-track-music-platform")) {
  fail(`Missing music link selector in ${trackingBundlePath}`);
}

for (const page of trackedPages) {
  const html = await readFile(resolve(page.path), "utf8");

  if (!html.includes("BaseLayout.astro_astro_type_script_index_0_lang")) {
    fail(`Missing outbound music tracking bundle reference in ${page.path}`);
  }

  if (!html.includes("data-track-music-platform")) {
    fail(`Missing tracked music link attributes in ${page.path}`);
  }

  for (const location of page.locations) {
    if (!html.includes(`data-track-music-location="${location}"`)) {
      fail(`Missing tracked location ${location} in ${page.path}`);
    }
  }
}

console.log("Outbound music click tracking verified.");
