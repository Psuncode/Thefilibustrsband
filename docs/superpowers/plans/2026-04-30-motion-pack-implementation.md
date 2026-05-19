# The Filibusters Motion Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable, site-wide motion foundation for the Astro marketing site using native CSS and a lightweight reveal helper, without redesigning existing sections.

**Architecture:** Keep the system small and declarative. Add a browser-safe motion helper in `src/lib/motion.js`, initialize it once from `BaseLayout.astro`, define all shared tokens and utilities in `src/styles/global.css`, and document the opt-in conventions in a short repo note. The implementation stays dependency-free and should be a no-op until components opt into the new data attributes or utility classes.

**Tech Stack:** Astro, JavaScript, `node:test`, Tailwind CSS, global CSS custom properties, native `IntersectionObserver`

---

## File Structure

These are the files this implementation should touch.

- `tests/motion.test.mjs` - unit tests for the reusable motion helper’s pure functions
- `src/lib/motion.js` - reveal initialization, reduced-motion handling, stagger delay helpers, and exported constants
- `src/layouts/BaseLayout.astro` - one-time global motion initialization
- `src/styles/global.css` - motion tokens, reveal base states, interaction utilities, and reduced-motion rules
- `docs/motion-pack.md` - usage note for future component authors

## Task 1: Add Failing Tests For The Motion Helper API

**Files:**
- Create: `tests/motion.test.mjs`

- [ ] **Step 1: Confirm the new test file does not exist yet**

Run:

```bash
ls tests/motion.test.mjs
```

Expected: `ls` reports `No such file or directory`

- [ ] **Step 2: Create the failing test file**

Create `tests/motion.test.mjs` with this content:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  MOTION_MEDIA_QUERY,
  MOTION_STAGGER_MAX_ITEMS,
  MOTION_STAGGER_STEP_MS,
  createRevealObserverOptions,
  getMotionItemDelay,
  shouldReduceMotion
} from "../src/lib/motion.js";

test("exports the prefers-reduced-motion media query used by the helper", () => {
  assert.equal(MOTION_MEDIA_QUERY, "(prefers-reduced-motion: reduce)");
});

test("treats only matching media queries as reduced motion", () => {
  assert.equal(shouldReduceMotion({ matches: true }), true);
  assert.equal(shouldReduceMotion({ matches: false }), false);
  assert.equal(shouldReduceMotion(undefined), false);
});

test("builds stagger delays in fixed increments and clamps long lists", () => {
  assert.equal(MOTION_STAGGER_STEP_MS, 70);
  assert.equal(MOTION_STAGGER_MAX_ITEMS, 6);
  assert.equal(getMotionItemDelay(0), "0ms");
  assert.equal(getMotionItemDelay(1), "70ms");
  assert.equal(getMotionItemDelay(4), "280ms");
  assert.equal(getMotionItemDelay(20), "420ms");
});

test("returns the expected observer options for standard motion", () => {
  assert.deepEqual(createRevealObserverOptions(false), {
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px"
  });
});

test("returns immediate observer options for reduced motion fallback", () => {
  assert.deepEqual(createRevealObserverOptions(true), {
    threshold: 0,
    rootMargin: "0px 0px 0px 0px"
  });
});
```

- [ ] **Step 3: Run the new test file to verify it fails**

Run:

```bash
node --test tests/motion.test.mjs
```

Expected: FAIL with an error that `../src/lib/motion.js` cannot be found

- [ ] **Step 4: Commit the failing test**

```bash
git add tests/motion.test.mjs
git commit -m "test: add motion helper coverage"
```

## Task 2: Implement The Native Motion Helper

**Files:**
- Create: `src/lib/motion.js`
- Test: `tests/motion.test.mjs`

- [ ] **Step 1: Re-read the test contract before writing code**

Run:

```bash
sed -n '1,220p' tests/motion.test.mjs
```

Expected: the tests define the exported constants, helper functions, and observer options required by the implementation

- [ ] **Step 2: Create the minimal motion helper implementation**

Create `src/lib/motion.js` with this content:

```js
export const MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
export const MOTION_STAGGER_STEP_MS = 70;
export const MOTION_STAGGER_MAX_ITEMS = 6;

export const shouldReduceMotion = (mediaQueryList) => {
  return Boolean(mediaQueryList?.matches);
};

export const getMotionItemDelay = (
  index,
  step = MOTION_STAGGER_STEP_MS,
  maxItems = MOTION_STAGGER_MAX_ITEMS
) => {
  const safeIndex = Math.max(0, Math.min(index, maxItems));

  return `${safeIndex * step}ms`;
};

export const createRevealObserverOptions = (reducedMotion) => {
  return reducedMotion
    ? {
        threshold: 0,
        rootMargin: "0px 0px 0px 0px"
      }
    : {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px"
      };
};

const markGroupItems = (group) => {
  const items = Array.from(group.querySelectorAll("[data-motion-item]"));

  items.forEach((item, index) => {
    if (!item.style.getPropertyValue("--motion-delay")) {
      item.style.setProperty("--motion-delay", getMotionItemDelay(index));
    }
  });
};

const activateMotionNode = (node) => {
  node.dataset.motionState = "active";

  if (node.hasAttribute("data-motion-group")) {
    markGroupItems(node);
  }
};

export const initMotion = (root = document) => {
  if (typeof window === "undefined" || !root?.querySelectorAll) {
    return () => {};
  }

  const mediaQueryList =
    typeof window.matchMedia === "function"
      ? window.matchMedia(MOTION_MEDIA_QUERY)
      : undefined;
  const reducedMotion = shouldReduceMotion(mediaQueryList);
  const nodes = Array.from(root.querySelectorAll("[data-motion]"));

  if (nodes.length === 0) {
    return () => {};
  }

  nodes.forEach((node) => {
    node.dataset.motionReady = "true";

    if (node.hasAttribute("data-motion-group")) {
      markGroupItems(node);
    }
  });

  if (reducedMotion || typeof IntersectionObserver === "undefined") {
    nodes.forEach(activateMotionNode);
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      activateMotionNode(entry.target);
      observer.unobserve(entry.target);
    });
  }, createRevealObserverOptions(false));

  nodes.forEach((node) => observer.observe(node));

  return () => observer.disconnect();
};
```

- [ ] **Step 3: Run the focused motion tests**

Run:

```bash
node --test tests/motion.test.mjs
```

Expected: PASS with 5 passing tests

- [ ] **Step 4: Run the full existing test suite to catch regressions**

Run:

```bash
npm test
```

Expected: PASS with the existing analytics and show schedule tests plus the new motion test

- [ ] **Step 5: Commit the helper implementation**

```bash
git add src/lib/motion.js tests/motion.test.mjs
git commit -m "feat: add native motion helper"
```

## Task 3: Add Shared Motion Tokens And Utilities

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Snapshot the current global stylesheet**

Run:

```bash
sed -n '1,260p' src/styles/global.css
```

Expected: the current file contains the existing brand tokens, poster-frame styles, marquee styles, and modal styles

- [ ] **Step 2: Confirm the new motion hooks are not already present**

Run:

```bash
rg -n "motion-duration|data-motion|motion-lift|motion-press|motion-glow" src/styles/global.css
```

Expected: no matches

- [ ] **Step 3: Extend `:root` with shared motion tokens**

Add these declarations inside the existing `:root` block in `src/styles/global.css`:

```css
  --motion-duration-fast: 160ms;
  --motion-duration-base: 280ms;
  --motion-duration-slow: 420ms;
  --motion-delay-step: 70ms;
  --motion-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-ease-emphasis: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-ease-press: cubic-bezier(0.34, 1.56, 0.64, 1);
  --motion-distance-near: 0.5rem;
  --motion-distance-base: 1rem;
  --motion-hover-lift: -4px;
  --motion-press-scale: 0.98;
  --motion-glow-pink: 0 18px 36px rgba(206, 32, 103, 0.24);
```

- [ ] **Step 4: Add reveal-state and interaction utilities**

Append these rules near the shared utility section in `src/styles/global.css`, after `.poster-frame` and before the marquee styles:

```css
[data-motion] {
  opacity: 0;
  transform: translate3d(0, var(--motion-distance-base), 0);
  filter: saturate(0.92);
  transition:
    opacity var(--motion-duration-base) var(--motion-ease-out),
    transform var(--motion-duration-base) var(--motion-ease-out),
    filter var(--motion-duration-base) var(--motion-ease-out);
  transition-delay: var(--motion-delay, 0ms);
}

[data-motion][data-motion-direction="left"] {
  transform: translate3d(calc(var(--motion-distance-base) * -1), 0, 0);
}

[data-motion][data-motion-direction="right"] {
  transform: translate3d(var(--motion-distance-base), 0, 0);
}

[data-motion][data-motion-direction="up"] {
  transform: translate3d(0, var(--motion-distance-base), 0);
}

[data-motion][data-motion-direction="down"] {
  transform: translate3d(0, calc(var(--motion-distance-near) * -1), 0);
}

[data-motion][data-motion-state="active"] {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  filter: none;
}

[data-motion-group] [data-motion-item] {
  transition-delay: var(--motion-delay, 0ms);
}

.motion-lift {
  transition:
    transform var(--motion-duration-fast) var(--motion-ease-emphasis),
    box-shadow var(--motion-duration-fast) var(--motion-ease-emphasis),
    filter var(--motion-duration-fast) var(--motion-ease-emphasis);
}

.motion-lift:hover,
.motion-lift:focus-visible {
  transform: translate3d(0, var(--motion-hover-lift), 0);
}

.motion-press {
  transition: transform var(--motion-duration-fast) var(--motion-ease-press);
}

.motion-press:active {
  transform: scale(var(--motion-press-scale));
}

.motion-glow:hover,
.motion-glow:focus-visible {
  box-shadow: var(--motion-glow-pink);
  filter: saturate(1.05);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  [data-motion] {
    opacity: 1;
    transform: none;
    filter: none;
    transition-duration: 1ms;
    transition-delay: 0ms;
  }

  .motion-lift,
  .motion-press,
  .motion-glow {
    transition-duration: 1ms;
  }

  .motion-lift:hover,
  .motion-lift:focus-visible,
  .motion-press:active {
    transform: none;
  }

  .feedback-track {
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
  }
}
```

- [ ] **Step 5: Verify the motion CSS hooks now exist**

Run:

```bash
rg -n "motion-duration|data-motion|motion-lift|motion-press|motion-glow|prefers-reduced-motion" src/styles/global.css
```

Expected: matches for the new tokens, reveal selectors, interaction utilities, and reduced-motion override block

- [ ] **Step 6: Commit the global motion styles**

```bash
git add src/styles/global.css
git commit -m "feat: add reusable motion styles"
```

## Task 4: Initialize Motion Once From The Shared Layout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Inspect the current shared layout script block**

Run:

```bash
sed -n '1,220p' src/layouts/BaseLayout.astro
```

Expected: one inline module script handles analytics click and submit tracking

- [ ] **Step 2: Update the layout to initialize motion globally**

In the existing `<script>` block in `src/layouts/BaseLayout.astro`, add the `initMotion` import and call so the top of the script becomes:

```astro
    <script>
      import { track } from "@vercel/analytics";
      import { getTrackedClickEvent, getTrackedFormEvent, getTrackedLinkEvent } from "../lib/analytics.js";
      import { initMotion } from "../lib/motion.js";

      initMotion();

      document.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
          return;
        }

        const link = target.closest("a");

        if (link instanceof HTMLAnchorElement) {
          const linkEvent = getTrackedLinkEvent(link.dataset);

          if (linkEvent) {
            track(linkEvent.eventName, linkEvent.properties);
            return;
          }
        }

        const clickTarget = target.closest("[data-track-event]");

        if (!(clickTarget instanceof HTMLElement)) {
          return;
        }

        const clickEvent = getTrackedClickEvent(clickTarget.dataset);

        if (clickEvent) {
          track(clickEvent.eventName, clickEvent.properties);
        }
      });

      document.addEventListener("submit", (event) => {
        const target = event.target;

        if (!(target instanceof HTMLFormElement)) {
          return;
        }

        const formEvent = getTrackedFormEvent(target.dataset);

        if (formEvent) {
          track(formEvent.eventName, formEvent.properties);
        }
      });
    </script>
```

- [ ] **Step 3: Verify the shared layout now wires in the motion helper**

Run:

```bash
rg -n "initMotion|../lib/motion.js" src/layouts/BaseLayout.astro
```

Expected: two matches, one for the import and one for the initializer call

- [ ] **Step 4: Commit the layout wiring**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: initialize motion in shared layout"
```

## Task 5: Document The Motion Pack Usage Conventions

**Files:**
- Create: `docs/motion-pack.md`

- [ ] **Step 1: Create the usage note**

Create `docs/motion-pack.md` with this content:

```md
# Motion Pack

## Purpose

This repo uses a lightweight native motion pack for reveal timing, hover/press feedback, and reduced-motion-safe choreography.

The system is intentionally opt-in. Nothing animates unless a component adds the relevant attributes or utility classes.

## Reveal Patterns

Use `data-motion` on a single element that should reveal when it enters the viewport.

```astro
<section data-motion data-motion-direction="up">
  ...
</section>
```

Supported directions:

- `up`
- `down`
- `left`
- `right`

If `data-motion-direction` is omitted, the default reveal is upward.

## Stagger Groups

Use `data-motion-group` on the parent and `data-motion-item` on each child.

```astro
<ul data-motion data-motion-group data-motion-direction="up">
  <li data-motion-item>First</li>
  <li data-motion-item>Second</li>
  <li data-motion-item>Third</li>
</ul>
```

The helper assigns `--motion-delay` values automatically in short, fixed increments.

## Interaction Utilities

Use these classes on interactive controls:

- `.motion-lift` for subtle hover lift
- `.motion-press` for tactile active-state compression
- `.motion-glow` for CTA emphasis

Example:

```astro
<a class="focus-ring motion-lift motion-press motion-glow" href="/shows">
  View all shows
</a>
```

## Reduced Motion

The pack respects `prefers-reduced-motion`.

- reveal elements appear immediately
- hover/press transitions collapse to near-instant feedback
- scroll behavior returns to `auto`

Do not add custom motion that overrides this policy.

## When To Use Motion

Good candidates:

- section intros
- hero supporting layers
- CTA buttons
- card grids with short stagger rhythm

Avoid using reveal motion on:

- dense body-copy sections
- long lists where delay would slow scanning
- every nested child in a component
- purely decorative wrappers with no hierarchy value
```

- [ ] **Step 2: Verify the note includes the expected conventions**

Run:

```bash
rg -n "data-motion|data-motion-group|motion-lift|prefers-reduced-motion" docs/motion-pack.md
```

Expected: matches for reveal, stagger, utility, and reduced-motion guidance

- [ ] **Step 3: Commit the documentation**

```bash
git add docs/motion-pack.md
git commit -m "docs: add motion pack usage guide"
```

## Task 6: Run Final Verification Before Any Component Adoption

**Files:**
- Verify: `src/lib/motion.js`
- Verify: `src/layouts/BaseLayout.astro`
- Verify: `src/styles/global.css`
- Verify: `docs/motion-pack.md`
- Verify: `tests/motion.test.mjs`

- [ ] **Step 1: Run the unit tests**

Run:

```bash
npm test
```

Expected: PASS

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: PASS with a generated Astro build and no import errors for `src/lib/motion.js`

- [ ] **Step 3: Start the dev server for manual review**

Run:

```bash
npm run dev
```

Expected: Astro dev server starts successfully and serves the site locally

- [ ] **Step 4: Manually verify the non-visual foundation behavior**

Check these conditions in the browser:

```text
- the site loads normally before any component opts into data-motion
- there are no console errors from initMotion on pages with zero motion nodes
- reduced-motion mode does not leave elements hidden
- mobile width around 375px has no horizontal scroll regression
```

Expected: all four checks pass

- [ ] **Step 5: Commit the verified foundation**

```bash
git add tests/motion.test.mjs src/lib/motion.js src/layouts/BaseLayout.astro src/styles/global.css docs/motion-pack.md
git commit -m "feat: add reusable site motion pack"
```
