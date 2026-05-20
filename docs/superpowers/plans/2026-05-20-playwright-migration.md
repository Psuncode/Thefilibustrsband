# Playwright Test Runner Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the hand-rolled `scripts/verify-seo-mobile.mjs` (355 lines of dev-server spawning + Chromium driving) to `@playwright/test` — small `playwright.config.ts` + parallel spec per route — and add a manual-trigger GitHub Action so the same checks can run in CI.

**Architecture:** Replace the custom server-lifecycle and serial route loop with Playwright's first-class `webServer` config + per-route `test()` blocks running in parallel workers. Specs assert the same SEO meta selectors and Event JSON-LD presence the legacy script does. The legacy script is marked deprecated but NOT deleted in this phase — both run side-by-side for one cycle to confirm parity.

**Tech Stack:** `@playwright/test`, Astro 5.5 dev server, GitHub Actions. No production dependencies added.

**Out of Scope:**
- Visual regression baselines (`toHaveScreenshot`) — future phase.
- Full a11y assertions via `@axe-core/playwright` — separate phase (would pair well with the a11y PR #1 work).
- Deletion of `scripts/verify-seo-mobile.mjs` — next cycle, after one parallel-run window confirms parity.
- `pull_request` CI trigger — workflow ships with `workflow_dispatch` only; flip the trigger when stable.
- BreadcrumbList assertion (it ships in PR #3 which hasn't merged into `main` yet — defer that specific assertion).

---

## File Map

**Create:**
- `playwright.config.ts` — repo root, sets webServer + testDir + viewport + reporter.
- `tests/e2e/seo.spec.ts` — one parallel `test()` per route asserting the 5 SEO meta selectors.
- `tests/e2e/structured-data.spec.ts` — Event JSON-LD presence assertion on one show detail page.
- `.github/workflows/playwright.yml` — workflow_dispatch action; installs deps + browser + builds + runs tests + uploads report on failure.

**Modify:**
- `package.json` — add `@playwright/test` devDep, add `test:e2e` and `test:e2e:ui` scripts.
- `scripts/verify-seo-mobile.mjs` — add a deprecation header comment pointing at the new specs.
- `.gitignore` — add `playwright-report/`, `test-results/`, and `tests/e2e/.cache/` if not already ignored.

**Don't touch:**
- The existing `npm run test` (`node --test`) — that runs the unit suite in `tests/*.test.mjs`. Keep separate from e2e in `tests/e2e/`.

---

### Task 1: Install `@playwright/test` and seed Playwright config

**Files:** `package.json`, `playwright.config.ts` (new), `.gitignore`

- [ ] **Step 1: Install the devDep**

```bash
npm install --save-dev @playwright/test
```

This may also pull in browser binaries (~150MB). If it doesn't run them automatically, the spec setup will trigger them.

- [ ] **Step 2: Install Chromium browser**

```bash
npx playwright install chromium
```

Expected: downloads/installs Chromium for headless testing. macOS install is fast; the CI workflow uses `--with-deps`.

- [ ] **Step 3: Create `playwright.config.ts`**

At repo root, create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

const port = 4323;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }], ["list"]],
  use: {
    baseURL,
    viewport: { width: 375, height: 812 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    {
      name: "chromium-mobile",
      use: { ...devices["iPhone 13"], viewport: { width: 375, height: 812 } }
    }
  ],
  webServer: {
    command: `npm run dev -- --port ${port} --host 127.0.0.1`,
    url: baseURL,
    timeout: 60_000,
    reuseExistingServer: !process.env.CI
  }
});
```

Notes:
- `webServer.command` matches the legacy script's port (4323) and host (127.0.0.1).
- `reuseExistingServer: !process.env.CI` speeds local iteration (no startup wait if a dev server is already running).
- `forbidOnly` blocks accidental `.only()` from shipping in CI.
- The `iPhone 13` device gives realistic mobile UA + DPR while we override viewport to match the legacy script.

- [ ] **Step 4: Update `.gitignore`**

```bash
grep -nE "playwright-report|test-results" .gitignore || echo "needs update"
```

If the entries are missing, append to `.gitignore`:

```
playwright-report
test-results
tests/e2e/.cache
```

- [ ] **Step 5: Add `test:e2e` scripts to `package.json`**

In the `scripts` block, add:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
```

Place them alphabetically near `test`.

- [ ] **Step 6: Verify the config compiles**

```bash
npx playwright test --list
```

Expected: lists 0 tests (no specs yet) AND does NOT error on config parsing. If config has syntax issues, fix before continuing.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json playwright.config.ts .gitignore
git commit -m "feat(test): install @playwright/test + repo config (mobile viewport, webServer)"
```

---

### Task 2: Port SEO meta-tag checks to `tests/e2e/seo.spec.ts`

**Files:** `tests/e2e/seo.spec.ts` (new)

The legacy script asserts these 5 selectors exist on every route:

- `link[rel="canonical"][href]`
- `meta[name="description"][content]`
- `meta[property="og:title"][content]`
- `meta[property="og:description"][content]`
- `meta[property="og:image"][content]`

And visits these routes:
- `/`
- `/shows`
- `/shows/<dynamic slug derived from /shows>`
- `/provo-alt-rock-band`
- `/press/ai`

- [ ] **Step 1: Write the spec**

Create `tests/e2e/seo.spec.ts`:

```typescript
import { test, expect, type Page } from "@playwright/test";

const requiredSeoSelectors = [
  'link[rel="canonical"][href]',
  'meta[name="description"][content]',
  'meta[property="og:title"][content]',
  'meta[property="og:description"][content]',
  'meta[property="og:image"][content]'
] as const;

const assertSeoTags = async (page: Page) => {
  for (const selector of requiredSeoSelectors) {
    await expect(page.locator(selector), `Missing required SEO tag: ${selector}`).toHaveCount(1);
  }
};

const staticRoutes = ["/", "/shows", "/provo-alt-rock-band", "/press/ai"] as const;

for (const route of staticRoutes) {
  test(`SEO tags present on ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.ok(), `Failed to load ${route}`).toBe(true);
    await page.waitForSelector("main");
    await assertSeoTags(page);
  });
}

test("SEO tags present on a dynamic /shows/<slug> route", async ({ page }) => {
  // Derive a real show slug from the index so we don't hardcode brittle URLs.
  const indexResponse = await page.goto("/shows");
  expect(indexResponse?.ok(), "Failed to load /shows").toBe(true);
  await page.waitForSelector('a[href^="/shows/"]');

  const slugRoute = await page
    .locator('a[href^="/shows/"]')
    .evaluateAll((nodes) =>
      Array.from(nodes)
        .map((node) => node.getAttribute("href"))
        .find((href) => href && href !== "/shows" && /^\/shows\/[^/]+\/?$/.test(href))
    );

  expect(slugRoute, "Could not derive a dynamic show detail route from /shows").toBeTruthy();

  const detailResponse = await page.goto(slugRoute!);
  expect(detailResponse?.ok(), `Failed to load ${slugRoute}`).toBe(true);
  await page.waitForSelector("main");
  await assertSeoTags(page);
});
```

- [ ] **Step 2: Run the spec**

```bash
npx playwright test tests/e2e/seo.spec.ts
```

Expected: 5 tests pass (4 static + 1 dynamic). Playwright spawns the dev server via `webServer`; first run takes ~10–20s for server boot.

If any test fails, the message will indicate which selector is missing on which route. Do NOT pre-emptively patch the BaseLayout — investigate first (the legacy script passes today on `main`, so the new spec should also pass).

- [ ] **Step 3: Confirm parallel execution**

In the test run output, observe that the 5 tests run in parallel workers (default = CPU count locally). They should NOT serialize.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/seo.spec.ts
git commit -m "feat(test): port SEO meta-tag checks to @playwright/test (parallel per route)"
```

---

### Task 3: Port Event JSON-LD validation

**Files:** `tests/e2e/structured-data.spec.ts` (new)

The legacy script's `collectEventJsonLd` extracts JSON-LD blocks (including `@graph` arrays) and checks for an `Event` type on show detail pages.

- [ ] **Step 1: Write the spec**

Create `tests/e2e/structured-data.spec.ts`:

```typescript
import { test, expect, type Page } from "@playwright/test";

const extractJsonLd = async (page: Page): Promise<unknown[]> => {
  return page.$$eval('script[type="application/ld+json"]', (nodes) => {
    const extractItems = (value: unknown): unknown[] => {
      if (!value || typeof value !== "object") return [];
      if (Array.isArray(value)) return value.flatMap(extractItems);
      const obj = value as Record<string, unknown>;
      if (Array.isArray(obj["@graph"])) return obj["@graph"].flatMap(extractItems);
      return [value];
    };

    return nodes.flatMap((node) => {
      try {
        return extractItems(JSON.parse(node.textContent || ""));
      } catch {
        return [];
      }
    });
  });
};

const isItem = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object";

test("show detail page emits an Event JSON-LD node", async ({ page }) => {
  // Derive a show slug from /shows
  await page.goto("/shows");
  await page.waitForSelector('a[href^="/shows/"]');
  const slugRoute = await page
    .locator('a[href^="/shows/"]')
    .evaluateAll((nodes) =>
      Array.from(nodes)
        .map((node) => node.getAttribute("href"))
        .find((href) => href && href !== "/shows" && /^\/shows\/[^/]+\/?$/.test(href))
    );
  expect(slugRoute).toBeTruthy();

  await page.goto(slugRoute!);
  await page.waitForSelector("main");

  const items = await extractJsonLd(page);
  const eventNode = items.find((item) => isItem(item) && item["@type"] === "Event");
  expect(eventNode, `No Event JSON-LD on ${slugRoute}`).toBeTruthy();
});
```

Note: the BreadcrumbList assertion that would normally pair with this is intentionally OMITTED because BreadcrumbList ships in PR #3 (not yet merged into main). Once #3 merges, a follow-up task can add the breadcrumb assertion.

- [ ] **Step 2: Run**

```bash
npx playwright test tests/e2e/structured-data.spec.ts
```

Expected: 1 test passes.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/structured-data.spec.ts
git commit -m "feat(test): assert Event JSON-LD on show detail page via Playwright"
```

---

### Task 4: GitHub Actions workflow (manual trigger)

**Files:** `.github/workflows/playwright.yml` (new)

- [ ] **Step 1: Create the workflow**

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright e2e

on:
  workflow_dispatch:

jobs:
  playwright:
    name: Playwright (chromium-mobile)
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "24.x"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Build site
        run: npm run build

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

Notes:
- `workflow_dispatch` = manual-trigger only. No pull_request trigger yet — flip when stable (separate PR).
- `node-version: "24.x"` matches the `engines.node` pin from the Astro modernization phase (will land via PR #2).
- `--with-deps` ensures Chromium has its OS-level dependencies in Ubuntu.

- [ ] **Step 2: Confirm the workflow lints**

If the repo has actionlint or similar, run it. Otherwise: visually inspect indentation + the `actions/...` versions are reasonable.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/playwright.yml
git commit -m "feat(ci): add Playwright workflow (manual trigger)"
```

---

### Task 5: Deprecate `scripts/verify-seo-mobile.mjs` header

**Files:** `scripts/verify-seo-mobile.mjs`

Don't delete — just mark the file as deprecated and point at the new specs. Parity-run for one cycle.

- [ ] **Step 1: Prepend deprecation comment**

In `scripts/verify-seo-mobile.mjs`, add at the very top (before the first `import`):

```javascript
/**
 * @deprecated since 2026-05-20.
 *
 * This script's checks have been ported to @playwright/test in:
 *   - tests/e2e/seo.spec.ts (SEO meta-tag assertions per route)
 *   - tests/e2e/structured-data.spec.ts (Event JSON-LD on show detail)
 *
 * The script is preserved for one cycle to verify parity. Once the
 * Playwright suite has run cleanly in CI for at least one PR cycle,
 * this file can be removed along with the `verify:seo` npm script.
 *
 * For now: prefer `npm run test:e2e` over `npm run verify:seo`.
 */
```

- [ ] **Step 2: Commit**

```bash
git add scripts/verify-seo-mobile.mjs
git commit -m "chore(test): mark scripts/verify-seo-mobile.mjs deprecated (replaced by playwright)"
```

---

### Task 6: Full-suite verification + PR

- [ ] **Step 1: Verify both old and new pass locally**

```bash
npm run verify:seo
npm run test:e2e
npm test
npm run build
```

Expected: all four exit 0. Both verify:seo and test:e2e exercise the same routes; both should pass against the same content.

- [ ] **Step 2: Skim the Playwright HTML report**

```bash
npx playwright show-report
```

Open in a browser (auto-launches). Confirm: all 6 tests pass (5 SEO + 1 structured data), reports show parallel execution, no flakiness.

- [ ] **Step 3: Commit summary** (skip if nothing new emerged)

If verification surfaced flakiness or selector mismatches, address in dedicated commits — do NOT lump fixes into a verification commit.

- [ ] **Step 4: Open PR** via `superpowers:finishing-a-development-branch`.

Title: `feat(test): migrate SEO verification to @playwright/test + CI workflow`.

PR body should explicitly note:
- Old `scripts/verify-seo-mobile.mjs` still exists (deprecated header) — to delete in next cycle.
- GitHub workflow is workflow_dispatch only — opt-in trigger to avoid resource churn until stable.
- BreadcrumbList assertion deferred until PR #3 merges.
- Run command for reviewers: `npm run test:e2e` (server boots automatically).
