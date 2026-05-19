# SEO Verification Environment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable repo-local command that verifies SEO-critical pages at mobile width and fails on hard issues like horizontal overflow, broken critical requests, and missing key SEO tags.

**Architecture:** Keep the implementation intentionally small: add Playwright as a dev dependency, create one Node/ESM verification script that boots the local site and checks a fixed core route set plus one dynamic show route, and document the workflow in the repo. The script should own browser automation, request tracking, tag checks, screenshots, and pass/fail reporting without turning into a broad test framework.

**Tech Stack:** Astro 5, Node.js ESM script, Playwright, npm scripts

---

## File Structure

### Files to modify

- `package.json`
  Responsibility: add `verify:seo` command and any supporting script entries, plus the new dev dependency.
- `.gitignore`
  Responsibility: ignore generated verification artifacts if the chosen output path is inside the repo.
- `README.md`
  Responsibility: document the verification command, what it checks, and when to run it.

### Files to create

- `scripts/verify-seo-mobile.mjs`
  Responsibility: start the local site, resolve one dynamic show slug, run Playwright at `375px`, check for overflow/request/tag failures, capture screenshots, and exit nonzero on hard failures.

### Optional new config file

- `playwright.config.ts` should **not** be added unless implementation clearly becomes simpler with it. The first version should prefer a single self-contained script.

## Task 1: Add Tooling Entry Points

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Add Playwright as a dev dependency**

Update `package.json` so the repo owns the browser automation dependency.

```json
{
  "devDependencies": {
    "playwright": "^1.53.0",
    "typescript": "^5.8.0"
  }
}
```

- [ ] **Step 2: Add a repo-local npm script for verification**

Add one explicit verification command to `package.json`.

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "sanity:dev": "sanity dev",
    "sanity:build": "sanity build",
    "verify:seo": "node scripts/verify-seo-mobile.mjs"
  }
}
```

- [ ] **Step 3: Ignore generated verification artifacts if they live in-repo**

If the script writes screenshots under a repo-local path such as `tmp/verify-seo/`, add that output path to `.gitignore`.

```gitignore
tmp/verify-seo/
```

If the implementation instead writes to `/tmp`, do not change `.gitignore` for this step.

- [ ] **Step 4: Install dependencies**

Run: `npm install`

Expected:
- Playwright is added to `package-lock.json`
- install exits with code 0

- [ ] **Step 5: Commit the tooling entry-point changes**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: add seo verification tooling"
```

## Task 2: Build the Verification Script

**Files:**
- Create: `scripts/verify-seo-mobile.mjs`

- [ ] **Step 1: Create the script skeleton and route definition**

Create a focused ESM script that defines the route strategy, output directory, and failure categories.

```js
import { mkdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";
import { upcomingShows } from "../src/data/shows.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUTPUT_DIR = path.join(ROOT, "tmp", "verify-seo");
const VIEWPORT = { width: 375, height: 812 };
const BASE_URL = "http://127.0.0.1:4321";

const getDynamicShowPath = () => {
  const firstShow = upcomingShows[0];
  if (!firstShow?.slug) {
    throw new Error("No show slug available for SEO verification.");
  }
  return `/shows/${firstShow.slug}`;
};

const routes = [
  { label: "home", path: "/", type: "general" },
  { label: "shows", path: "/shows", type: "general" },
  { label: "show-detail", path: getDynamicShowPath(), type: "event" }
];
```

- [ ] **Step 2: Add local server boot and readiness logic**

Start `astro dev` from the script and wait until the chosen local port responds.

```js
const startDevServer = () =>
  spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4321"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"]
  });

const waitForServer = async (url, timeoutMs = 30000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
};
```

- [ ] **Step 3: Add per-page checks for overflow, failed requests, and critical SEO tags**

Implement one page-check function that:
- records request failures for `document`, `image`, and `stylesheet`
- measures `scrollWidth` and `clientWidth`
- verifies required tags
- captures a screenshot

```js
const REQUIRED_GENERAL_TAGS = [
  'link[rel="canonical"]',
  'meta[name="description"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:image"]'
];

const checkPage = async (browser, route) => {
  const page = await browser.newPage({ viewport: VIEWPORT });
  const failedRequests = [];

  page.on("requestfailed", (request) => {
    const type = request.resourceType();
    if (["document", "image", "stylesheet"].includes(type)) {
      failedRequests.push({
        type,
        url: request.url(),
        errorText: request.failure()?.errorText || "unknown"
      });
    }
  });

  const url = `${BASE_URL}${route.path}`;
  await page.goto(url, { waitUntil: "networkidle" });

  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));

  const tags = await page.evaluate((routeType) => {
    const hasTag = (selector) => Boolean(document.querySelector(selector));
    const base = {
      canonical: hasTag('link[rel="canonical"]'),
      description: hasTag('meta[name="description"]'),
      ogTitle: hasTag('meta[property="og:title"]'),
      ogDescription: hasTag('meta[property="og:description"]'),
      ogImage: hasTag('meta[property="og:image"]')
    };

    const hasEventJsonLd =
      routeType !== "event"
        ? true
        : Array.from(document.querySelectorAll('script[type="application/ld+json"]')).some((node) =>
            node.textContent?.includes('"@type":"Event"')
          );

    return { ...base, eventJsonLd: hasEventJsonLd };
  }, route.type);

  await page.screenshot({
    path: path.join(OUTPUT_DIR, `${route.label}.png`),
    fullPage: true
  });

  await page.close();

  return { route, url, failedRequests, overflow, tags };
};
```

- [ ] **Step 4: Add failure aggregation and process exit behavior**

Fail the run only on hard issues and print a concise summary.

```js
const summarizeFailures = (result) => {
  const failures = [];

  if (result.overflow.scrollWidth > result.overflow.clientWidth) {
    failures.push(
      `Horizontal overflow on ${result.route.path}: ${result.overflow.scrollWidth} > ${result.overflow.clientWidth}`
    );
  }

  for (const request of result.failedRequests) {
    failures.push(`Failed ${request.type} request on ${result.route.path}: ${request.url}`);
  }

  if (!result.tags.canonical) failures.push(`Missing canonical on ${result.route.path}`);
  if (!result.tags.description) failures.push(`Missing meta description on ${result.route.path}`);
  if (!result.tags.ogTitle) failures.push(`Missing og:title on ${result.route.path}`);
  if (!result.tags.ogDescription) failures.push(`Missing og:description on ${result.route.path}`);
  if (!result.tags.ogImage) failures.push(`Missing og:image on ${result.route.path}`);
  if (!result.tags.eventJsonLd) failures.push(`Missing Event JSON-LD on ${result.route.path}`);

  return failures;
};
```

- [ ] **Step 5: Wire the script end-to-end**

Complete the script so it:
- clears/creates the output directory
- starts the local dev server
- waits for readiness
- launches Playwright
- checks all routes
- prints screenshot location
- exits `1` if any hard failures exist
- always cleans up the server process

```js
const main = async () => {
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  const server = startDevServer();
  try {
    await waitForServer(BASE_URL);
    const browser = await chromium.launch({ headless: true });
    const results = [];

    for (const route of routes) {
      results.push(await checkPage(browser, route));
    }

    await browser.close();

    const failures = results.flatMap(summarizeFailures);

    console.log(`Checked routes: ${results.map((entry) => entry.route.path).join(", ")}`);
    console.log(`Screenshots: ${OUTPUT_DIR}`);

    if (failures.length > 0) {
      for (const failure of failures) console.error(`FAIL: ${failure}`);
      process.exitCode = 1;
      return;
    }

    console.log("SEO mobile verification passed.");
  } finally {
    server.kill("SIGINT");
  }
};

await main();
```

- [ ] **Step 6: Run the command and verify it passes**

Run: `npm run verify:seo`

Expected:
- local server starts automatically
- homepage, shows index, and one show detail page are checked
- screenshots are written
- command exits with code 0 on the current site state

- [ ] **Step 7: Commit the verification script**

```bash
git add scripts/verify-seo-mobile.mjs
git commit -m "feat: add seo verification script"
```

## Task 3: Document the Workflow

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a short verification section to the README**

Document the command and the intended workflow in a place future contributors will see.

```md
## SEO Verification

Run `npm run verify:seo` after SEO-facing changes such as:
- metadata updates
- structured data changes
- homepage or shows-page copy changes
- layout changes on search-facing pages
- image changes that affect public pages

The command checks:
- `/`
- `/shows`
- one current show detail page

It fails on:
- horizontal overflow at `375px`
- failed critical document/image/stylesheet requests
- missing critical SEO tags

Screenshots are written to `tmp/verify-seo/`.
```

- [ ] **Step 2: Run the verification command again after docs changes**

Run: `npm run verify:seo`

Expected:
- command still passes
- screenshots are still generated

- [ ] **Step 3: Commit the documentation update**

```bash
git add README.md
git commit -m "docs: add seo verification workflow"
```

## Task 4: Final Verification

**Files:**
- Verify only unless a blocker is found

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected:
- build exits with code 0

- [ ] **Step 2: Run the SEO verification command**

Run: `npm run verify:seo`

Expected:
- command exits with code 0
- output names the checked routes
- screenshots are present in the configured output directory

- [ ] **Step 3: Confirm artifacts are not accidentally tracked**

Run: `git status --short`

Expected:
- verification screenshots are ignored or written outside the repo
- no unintended generated files appear as tracked changes

- [ ] **Step 4: Commit only if final verification requires a fix**

```bash
git add <verification-related fixes>
git commit -m "fix: stabilize seo verification workflow"
```

## Self-Review

Spec coverage:
- repo-local command: Task 1 and Task 2
- browser checks at `375px`: Task 2
- fixed core routes plus one dynamic show route: Task 2
- hard failures only: Task 2
- screenshots: Task 2
- documentation: Task 3

Placeholder scan:
- no `TODO` / `TBD`
- all file paths are explicit
- all commands are concrete

Type consistency:
- one command name: `verify:seo`
- one script path: `scripts/verify-seo-mobile.mjs`
- one artifact path: `tmp/verify-seo/`
