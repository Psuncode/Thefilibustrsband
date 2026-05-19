import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { showLastmod, communityLastmod } from "../src/data/lastmod-map.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const extractPairs = (sourcePath, dateField) => {
  const text = readFileSync(resolve(repoRoot, sourcePath), "utf-8");
  // Walk top-down: each entry has a `slug: "..."` followed (within the same object) by `<dateField>: "..."`.
  const slugRe = /slug:\s*"([^"]+)"/g;
  const pairs = [];
  let slugMatch;
  while ((slugMatch = slugRe.exec(text)) !== null) {
    const after = text.slice(slugMatch.index);
    const dateRe = new RegExp(`${dateField}:\\s*"([^"]+)"`);
    const dateMatch = dateRe.exec(after);
    if (dateMatch) {
      pairs.push({ slug: slugMatch[1], date: dateMatch[1] });
    }
  }
  return pairs;
};

test("every upcoming show has a lastmod entry with matching startsAt", () => {
  const shows = extractPairs("src/data/shows.ts", "startsAt");
  assert.ok(shows.length > 0, "regex extracted zero shows from shows.ts — check the regex");
  for (const show of shows) {
    const entry = showLastmod.find((e) => e.slug === show.slug);
    assert.ok(entry, `Missing lastmod entry for show slug "${show.slug}". Add to src/data/lastmod-map.mjs.`);
    assert.equal(entry.startsAt, show.date, `Date mismatch for show "${show.slug}": helper has ${entry.startsAt}, source has ${show.date}.`);
  }
});

test("every community post has a lastmod entry with matching publishedAt", () => {
  const posts = extractPairs("src/data/community.ts", "publishedAt");
  assert.ok(posts.length > 0, "regex extracted zero community posts — check the regex");
  for (const post of posts) {
    const entry = communityLastmod.find((e) => e.slug === post.slug);
    assert.ok(entry, `Missing lastmod entry for community slug "${post.slug}". Add to src/data/lastmod-map.mjs.`);
    assert.equal(entry.publishedAt, post.date, `Date mismatch for community "${post.slug}": helper has ${entry.publishedAt}, source has ${post.date}.`);
  }
});
