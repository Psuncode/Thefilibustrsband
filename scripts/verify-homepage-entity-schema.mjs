import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const htmlPath = resolve(process.argv[2] ?? "dist/index.html");
const expectedSiteUrl = "https://www.thefilibustersband.com";
const expectedMusicGroupId = `${expectedSiteUrl}#music-group`;
const expectedWebsiteId = `${expectedSiteUrl}#website`;
const expectedSubjectPages = [
  { name: "About", path: "/about/" },
  { name: "Listen", path: "/listen/" },
  { name: "Contact", path: "/contact/" },
  { name: "Shows", path: "/shows/" }
];

const fail = (message) => {
  throw new Error(message);
};

const extractStructuredData = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(
    ([, rawJson]) => {
      try {
        const parsed = JSON.parse(rawJson);
        const graph = Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed];
        return graph.filter(Boolean);
      } catch {
        return [];
      }
    }
  );

const assertField = (value, field, label) => {
  if (!value || !(field in value)) {
    fail(`Missing ${label}`);
  }
};

const html = await readFile(htmlPath, "utf8");
const structuredData = extractStructuredData(html);

const website = structuredData.find((entry) => entry?.["@type"] === "WebSite");
const musicGroup = structuredData.find((entry) => entry?.["@type"] === "MusicGroup");

if (!website) fail("Missing WebSite schema");
if (!musicGroup) fail("Missing MusicGroup schema");

if (website["@id"] !== expectedWebsiteId) fail("WebSite @id is not stable");
if (website.about?.["@id"] !== expectedMusicGroupId) fail("WebSite does not point at MusicGroup");

if (musicGroup["@id"] !== expectedMusicGroupId) fail("MusicGroup @id is not stable");
assertField(musicGroup, "genre", "MusicGroup genre");
assertField(musicGroup, "email", "MusicGroup email");
assertField(musicGroup, "image", "MusicGroup image");
assertField(musicGroup, "address", "MusicGroup address");
assertField(musicGroup, "contactPoint", "MusicGroup contactPoint");
assertField(musicGroup, "sameAs", "MusicGroup sameAs");
assertField(musicGroup, "mainEntityOfPage", "MusicGroup mainEntityOfPage");
assertField(musicGroup, "subjectOf", "MusicGroup subjectOf");

if (musicGroup.genre !== "alt rock") fail("Unexpected MusicGroup genre");
if (musicGroup.email !== "filibustersband@gmail.com") fail("Unexpected MusicGroup email");
if (musicGroup.address?.addressLocality !== "Provo") fail("Unexpected MusicGroup addressLocality");
if (musicGroup.address?.addressRegion !== "Utah") fail("Unexpected MusicGroup addressRegion");
if (musicGroup.address?.addressCountry !== "US") fail("Unexpected MusicGroup addressCountry");
if (musicGroup.mainEntityOfPage?.["@id"] !== expectedWebsiteId) {
  fail("MusicGroup mainEntityOfPage does not point at WebSite");
}

const subjectOf = Array.isArray(musicGroup.subjectOf) ? musicGroup.subjectOf : [];
if (subjectOf.length !== expectedSubjectPages.length) fail("Unexpected MusicGroup subjectOf count");

for (const expectedPage of expectedSubjectPages) {
  const page = subjectOf.find((entry) => entry?.name === expectedPage.name);
  if (!page) fail(`Missing subjectOf page: ${expectedPage.name}`);
  if (new URL(page.url).pathname !== expectedPage.path) {
    fail(`Unexpected subjectOf path for ${expectedPage.name}`);
  }
  if (page.isPartOf?.["@id"] !== expectedWebsiteId) {
    fail(`subjectOf page ${expectedPage.name} is not part of the WebSite`);
  }
  if (page.about?.["@id"] !== expectedMusicGroupId) {
    fail(`subjectOf page ${expectedPage.name} does not point at MusicGroup`);
  }
}

console.log(`Homepage entity schema verified in ${htmlPath}`);
