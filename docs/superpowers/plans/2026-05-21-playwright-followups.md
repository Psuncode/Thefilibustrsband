# Playwright Follow-ups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three small additions on top of PR #6's Playwright migration: (1) axe-core a11y assertions on key routes, (2) visual-regression baseline for the home page, (3) flip the workflow trigger from manual-only to `pull_request` + `workflow_dispatch`.

**Architecture:** Build directly on PR #6's setup — same `playwright.config.ts`, same `tests/e2e/` directory. Two new spec files (`a11y.spec.ts`, `visual.spec.ts`), one workflow edit. Visual regression uses Playwright's built-in `toHaveScreenshot()` with `maxDiffPixelRatio: 0.02` to tolerate minor antialiasing differences.

**Tech Stack:** `@playwright/test` (existing), `@axe-core/playwright` (new devDep). Snapshots committed under `tests/e2e/visual.spec.ts-snapshots/`.

**Branch dependency:** This PR branches off `feat/playwright-migration` (PR #6), not `main`. PR #6 must merge first OR be rebased onto main before this PR can land. Document this in the PR body.

**Out of Scope:**
- Cross-browser visual baselines (Chromium-only for now; WebKit/Firefox baselines diverge).
- Per-component visual tests (only the home page in this phase).
- Pixel-perfect baselines (`maxDiffPixelRatio: 0` is too strict for CSS rendering across environments).
- axe-core checks on `/press/ai` (programmatic content, semantic JSON-LD page — defer).

---

### Task 1: Axe-core a11y assertions

**Files:** `package.json`, `tests/e2e/a11y.spec.ts` (new)

- [ ] **Step 1: Install `@axe-core/playwright`**

```bash
npm install --save-dev @axe-core/playwright
```

- [ ] **Step 2: Write `tests/e2e/a11y.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/shows", "/community", "/about", "/press"] as const;

for (const route of routes) {
  test(`a11y: ${route} has no serious or critical axe violations`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.ok(), `Failed to load ${route}`).toBe(true);
    await page.waitForSelector("main");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );

    if (blocking.length > 0) {
      console.log(`${route} violations:`, JSON.stringify(blocking, null, 2));
    }
    expect(blocking, `${blocking.length} serious/critical a11y violations on ${route}`).toHaveLength(0);
  });
}
```

Note: filtering to `serious`/`critical` only. Moderate/minor violations are logged but don't block — they're tracked for a future cleanup phase.

- [ ] **Step 3: Run**

```bash
npx playwright test tests/e2e/a11y.spec.ts
```

Expected: 5 tests pass. If a route fails, the console log shows which axe rule fired — assess whether it's a real bug (fix in scope) vs. an axe false positive on the existing build.

If a real bug surfaces that the a11y branch (PR #1) already fixes: note in the report, expect the violation to disappear once PR #1 merges. Do NOT duplicate-fix in this branch.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json tests/e2e/a11y.spec.ts
git commit -m "feat(test): axe-core a11y assertions on key routes"
```

---

### Task 2: Visual regression baseline (home page)

**Files:** `tests/e2e/visual.spec.ts` (new), `tests/e2e/visual.spec.ts-snapshots/*.png` (new, committed)

- [ ] **Step 1: Write `tests/e2e/visual.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Visual regression (mobile viewport)", () => {
  test("home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("main");
    // Wait for fonts + images to settle; Playwright stabilizes by default but we add a beat for the marquee.
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("home.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: "disabled"
    });
  });
});
```

- [ ] **Step 2: Generate the baseline**

```bash
npx playwright test tests/e2e/visual.spec.ts --update-snapshots
```

This creates `tests/e2e/visual.spec.ts-snapshots/home-chromium-mobile-darwin.png` (or similar — naming depends on OS).

NOTE: macOS and Linux render slightly differently. The committed baseline is whichever OS you're on. CI on Ubuntu may show small drift on first run — that's expected. To make CI stable: generate the baseline on Linux (e.g., via Docker or GitHub Actions). For this initial phase, commit the local baseline and document the cross-OS drift in the PR body. A follow-up phase can add `--update-snapshots` to a manual-trigger CI workflow.

- [ ] **Step 3: Run again to confirm green**

```bash
npx playwright test tests/e2e/visual.spec.ts
```

Expected: 1 test passes (the baseline was just written; this run compares the freshly-rendered output against it).

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/visual.spec.ts tests/e2e/visual.spec.ts-snapshots/
git commit -m "feat(test): home page visual regression baseline (2% tolerance)"
```

---

### Task 3: Flip workflow trigger to `pull_request`

**Files:** `.github/workflows/playwright.yml`

- [ ] **Step 1: Edit the `on:` block**

Change:

```yaml
on:
  workflow_dispatch:
```

to:

```yaml
on:
  workflow_dispatch:
  pull_request:
    branches: [main]
    paths:
      - "src/**"
      - "sanity/**"
      - "scripts/**"
      - "tests/e2e/**"
      - "playwright.config.ts"
      - "package.json"
      - "package-lock.json"
      - ".github/workflows/playwright.yml"
```

The path filter prevents the workflow from running on PRs that only touch docs / plan files. `workflow_dispatch` stays available for manual reruns.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/playwright.yml
git commit -m "ci(playwright): trigger on pull_request + path filter (was manual-only)"
```

---

### Task 4: Verification + PR

- [ ] **Step 1: Full e2e gates**

```bash
npx playwright test
npm test
npm run build
```

Expected: all green. Playwright suite should now show ~11 tests passing (5 SEO + 1 structured data + 5 a11y + 1 visual = 12 — but the a11y count may include `/press` which already runs in SEO; not a duplication issue, just two different concerns per route).

- [ ] **Step 2: Open PR** via `superpowers:finishing-a-development-branch`.

Title: `feat(test): axe-core + visual regression + pull_request trigger`.

PR body MUST note:
- Branch depends on PR #6 (Playwright migration). Merge PR #6 first OR rebase this one onto main before merge.
- Visual baseline committed from local machine — first CI run may surface platform-specific rendering drift. If so, follow up with a manual-trigger workflow that re-generates baselines on Linux.
- axe-core filters to serious/critical only. Moderate/minor violations logged but non-blocking.
