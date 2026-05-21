import { test } from "node:test";
import assert from "node:assert/strict";
import { buildBreadcrumbList } from "../src/lib/seo/breadcrumb.ts";

const SITE = "https://www.thefilibustersband.com";

test("builds a 3-item BreadcrumbList", () => {
  const out = buildBreadcrumbList(SITE, [
    { name: "Home", path: "/" },
    { name: "Shows", path: "/shows" },
    { name: "Utah Arts Festival 2026", path: "/shows/utah-arts-festival-2026" }
  ]);

  assert.equal(out["@context"], "https://schema.org");
  assert.equal(out["@type"], "BreadcrumbList");
  assert.equal(out.itemListElement.length, 3);

  const [first, second, third] = out.itemListElement;
  assert.equal(first.position, 1);
  assert.equal(first.name, "Home");
  assert.equal(first.item, "https://www.thefilibustersband.com/");
  assert.equal(second.position, 2);
  assert.equal(second.item, "https://www.thefilibustersband.com/shows");
  assert.equal(third.position, 3);
  assert.equal(third.item, "https://www.thefilibustersband.com/shows/utah-arts-festival-2026");
});

test("trims trailing slashes except for root", () => {
  const out = buildBreadcrumbList(SITE, [
    { name: "Home", path: "/" },
    { name: "Community", path: "/community/" }
  ]);
  assert.equal(out.itemListElement[0].item, "https://www.thefilibustersband.com/");
  assert.equal(out.itemListElement[1].item, "https://www.thefilibustersband.com/community");
});

test("throws on empty crumbs", () => {
  assert.throws(() => buildBreadcrumbList(SITE, []), /at least one crumb/i);
});
