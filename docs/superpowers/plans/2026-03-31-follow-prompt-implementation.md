# Follow Prompt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a homepage-only follow prompt that appears after a short delay, links visitors directly to Spotify or Apple Music, and stays hidden for 14 days after dismissal or CTA click.

**Architecture:** Add a new Astro component for the popup and mount it only on the homepage. Keep canonical streaming links and prompt copy in shared site data, use one repo-local image asset for the visual half of the popup, and manage delay plus cooldown with a small client-side script that reads and writes `localStorage`.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, browser `localStorage`, repo-local image assets

---

## File Structure

- Modify: `src/data/site.ts`
  - Add canonical follow-prompt content and streaming URLs the popup will use.
- Create: `src/components/home/FollowPrompt.astro`
  - Render the split-panel modal markup, CTA buttons, and client-side popup logic.
- Modify: `src/pages/index.astro`
  - Render the new follow prompt on the homepage only.
- Modify: `src/styles/global.css`
  - Add any reusable popup-specific global classes that do not fit well as utility-only markup.
- Optional create: `src/assets/images/<chosen-follow-prompt-image>`
  - Only if the implementation decides the existing repo images are not suitable and a new shipped asset is needed.

## Constraints And Verification Notes

- There is no automated test runner configured in `package.json`.
- Verification for this feature must rely on:
  - `npm run build`
  - manual browser verification in `npm run dev`
- Manual checks must cover desktop and approximately `375px` width.
- The popup must never introduce horizontal scroll.

### Task 1: Add Canonical Follow Prompt Data

**Files:**
- Modify: `src/data/site.ts`

- [ ] **Step 1: Extend the site data types to support the popup copy and CTA definitions**

Add popup-oriented types near the existing `SocialLink` and `PrimaryNavItem` definitions:

```ts
type FollowPromptLink = {
  label: string;
  href: string;
};

type FollowPromptContent = {
  eyebrow: string;
  title: string;
  description: string;
  cooldownDays: number;
  delayMs: number;
  links: readonly [FollowPromptLink, FollowPromptLink];
};
```

- [ ] **Step 2: Add canonical popup content to `site.ts` using the existing Spotify and Apple Music artist URLs**

Add a new export after `siteMeta`:

```ts
export const followPrompt = {
  eyebrow: "Stay Loud",
  title: "Follow the chaos where the songs actually live.",
  description:
    "Pick your platform, follow the band, and keep the next release from sneaking past you.",
  cooldownDays: 14,
  delayMs: 3000,
  links: [
    {
      label: "Follow on Spotify",
      href: "https://open.spotify.com/artist/4Mf8AkUvGERBfOkG8ozuDl?si=sVvFzSJ-Qd-zMQ-ao6ry9g"
    },
    {
      label: "Follow on Apple Music",
      href: "https://music.apple.com/us/artist/the-filibusters/1550597371"
    }
  ]
} as const satisfies FollowPromptContent;
```

- [ ] **Step 3: Verify the data file still typechecks through the build**

Run: `npm run build`

Expected:
- Astro build completes with exit code `0`
- No TypeScript errors from `src/data/site.ts`

- [ ] **Step 4: Commit the data change**

```bash
git add src/data/site.ts
git commit -m "feat: add follow prompt site data"
```

### Task 2: Build The Split-Panel Follow Prompt Component

**Files:**
- Create: `src/components/home/FollowPrompt.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create the Astro component shell with imported data and image**

Start the component with shared data imports and a local storage key constant:

```astro
---
import { Image } from "astro:assets";
import heroBand from "../../assets/images/hero-band.jpg";
import { followPrompt } from "../../data/site";

const storageKey = "filibusters-follow-prompt-until";
const cooldownMs = followPrompt.cooldownDays * 24 * 60 * 60 * 1000;
---
```

- [ ] **Step 2: Add the split-panel modal markup with dialog semantics and two CTA buttons**

Create markup shaped like this:

```astro
<div class="follow-prompt hidden" data-follow-prompt>
  <div class="follow-prompt__backdrop" data-follow-prompt-close></div>
  <div
    aria-labelledby="follow-prompt-title"
    aria-modal="true"
    class="follow-prompt__dialog"
    role="dialog"
  >
    <button
      aria-label="Close follow prompt"
      class="follow-prompt__close focus-ring"
      data-follow-prompt-close
      type="button"
    >
      ×
    </button>

    <div class="follow-prompt__media">
      <Image
        alt="The Filibusters band promo photo"
        class="follow-prompt__image"
        src={heroBand}
        widths={[640, 960]}
        sizes="(max-width: 767px) 100vw, 50vw"
      />
    </div>

    <div class="follow-prompt__content">
      <p class="follow-prompt__eyebrow">{followPrompt.eyebrow}</p>
      <h2 class="display-face follow-prompt__title" id="follow-prompt-title">
        {followPrompt.title}
      </h2>
      <p class="follow-prompt__description">{followPrompt.description}</p>
      <div class="follow-prompt__actions">
        {followPrompt.links.map((link) => (
          <a
            class="focus-ring follow-prompt__action"
            data-follow-prompt-cta
            href={link.href}
            rel="noreferrer"
            target="_blank"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Add the client script to handle delay, cooldown, dismissal, and CTA clicks**

Use a script like this inside the component:

```astro
<script>
  const root = document.querySelector("[data-follow-prompt]");

  if (root instanceof HTMLElement) {
    const dialog = root.querySelector(".follow-prompt__dialog");
    const closeControls = root.querySelectorAll("[data-follow-prompt-close]");
    const ctas = root.querySelectorAll("[data-follow-prompt-cta]");
    const storageKey = "filibusters-follow-prompt-until";
    const delayMs = 3000;
    const cooldownMs = 14 * 24 * 60 * 60 * 1000;
    let opener = null;
    let timer = 0;

    const setCooldown = () => {
      window.localStorage.setItem(storageKey, String(Date.now() + cooldownMs));
    };

    const closePrompt = () => {
      root.classList.add("hidden");
      root.setAttribute("aria-hidden", "true");
      document.body.classList.remove("follow-prompt-open");
      if (opener instanceof HTMLElement) opener.focus();
    };

    const openPrompt = () => {
      opener = document.activeElement;
      root.classList.remove("hidden");
      root.setAttribute("aria-hidden", "false");
      document.body.classList.add("follow-prompt-open");
      if (dialog instanceof HTMLElement) dialog.focus();
    };

    const expiresAt = Number(window.localStorage.getItem(storageKey) || "0");

    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
      timer = window.setTimeout(openPrompt, delayMs);
    }

    closeControls.forEach((node) => {
      node.addEventListener("click", () => {
        setCooldown();
        window.clearTimeout(timer);
        closePrompt();
      });
    });

    ctas.forEach((node) => {
      node.addEventListener("click", () => {
        setCooldown();
        closePrompt();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !root.classList.contains("hidden")) {
        setCooldown();
        closePrompt();
      }
    });
  }
</script>
```

- [ ] **Step 4: Refine the script to read values from `followPrompt` rather than hardcoding them twice**

Replace the hardcoded constants in the script with server-rendered values:

```astro
<script define:vars={{ storageKey, delayMs: followPrompt.delayMs, cooldownMs }}>
  // same logic, but use `storageKey`, `delayMs`, and `cooldownMs`
</script>
```

- [ ] **Step 5: Add popup-specific styles in `global.css` for the editorial split layout**

Append styles along these lines:

```css
.follow-prompt-open {
  overflow: hidden;
}

.follow-prompt {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.follow-prompt.hidden {
  display: none;
}

.follow-prompt__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(35, 31, 32, 0.64);
  backdrop-filter: blur(6px);
}

.follow-prompt__dialog {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(58rem, 100%);
  max-height: calc(100vh - 2rem);
  overflow: hidden;
  border: 1px solid rgba(35, 31, 32, 0.12);
  border-radius: 2rem;
  background: #fffaf4;
  box-shadow: 0 28px 90px rgba(20, 18, 19, 0.28);
}

@media (min-width: 768px) {
  .follow-prompt__dialog {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  }
}
```

- [ ] **Step 6: Finish the component styling for content spacing, CTA buttons, and mobile behavior**

Add the remaining styles:

```css
.follow-prompt__media {
  min-height: 16rem;
}

.follow-prompt__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.follow-prompt__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding: 4.5rem 1.5rem 1.75rem;
}

.follow-prompt__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  border: 0;
  background: transparent;
  color: var(--color-ink);
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
}

.follow-prompt__eyebrow {
  margin: 0;
  color: var(--color-pink);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.follow-prompt__title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.75rem);
  line-height: 0.95;
}

.follow-prompt__description {
  margin: 0;
  max-width: 28rem;
  color: rgba(35, 31, 32, 0.72);
  font-size: 0.98rem;
  line-height: 1.7;
}

.follow-prompt__actions {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.follow-prompt__action {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(35, 31, 32, 0.12);
  padding: 0.9rem 1.2rem;
  color: var(--color-ink);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-decoration: none;
  text-transform: uppercase;
  transition: transform 150ms ease, background-color 150ms ease, color 150ms ease;
}

.follow-prompt__action:hover {
  transform: translateY(-1px);
  background: var(--color-pink);
  color: white;
}

@media (max-width: 767px) {
  .follow-prompt {
    padding: 0.75rem;
  }

  .follow-prompt__dialog {
    max-height: calc(100vh - 1.5rem);
    overflow: auto;
  }

  .follow-prompt__content {
    padding-top: 1.25rem;
  }
}
```

- [ ] **Step 7: Run the build to catch Astro, image, and type errors**

Run: `npm run build`

Expected:
- Build completes with exit code `0`
- No image import or Astro component errors

- [ ] **Step 8: Commit the new component and styles**

```bash
git add src/components/home/FollowPrompt.astro src/styles/global.css
git commit -m "feat: add follow prompt modal component"
```

### Task 3: Mount The Prompt On The Homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Import the new homepage component**

Add this import with the other home section imports:

```astro
import FollowPrompt from "../components/home/FollowPrompt.astro";
```

- [ ] **Step 2: Render the prompt in the homepage layout**

Place the component after the existing sections and before the footer context ends:

```astro
  <main id="main-content" class="mobile-nav-offset">
    <HeroSection />
    <LatestReleaseSection />
    <WhyStickAroundSection />
    <ShowsPreviewSection />
    <PersonalityStripSection />
    <CommunitySignupSection />
    <FollowPrompt />
  </main>
```

- [ ] **Step 3: Run a build to verify the homepage wires up correctly**

Run: `npm run build`

Expected:
- Build completes with exit code `0`
- The homepage route still renders as `/index.html`

- [ ] **Step 4: Commit the homepage integration**

```bash
git add src/pages/index.astro
git commit -m "feat: mount homepage follow prompt"
```

### Task 4: Manual Verification In Dev Mode

**Files:**
- No file changes required unless bugs are found during verification

- [ ] **Step 1: Start the Astro dev server**

Run: `npm run dev`

Expected:
- Astro reports a local URL
- The homepage loads without console-breaking runtime errors

- [ ] **Step 2: Verify delayed appearance on desktop**

Manual check:
- Open the homepage in a fresh tab
- Wait about 3 seconds
- Confirm the popup appears centered with image and content split into two panels

Expected:
- Popup does not flash instantly on page load
- Popup appears only after the intended delay

- [ ] **Step 3: Verify dismiss controls**

Manual check:
- Close with the `×` button
- Reload the page
- Clear `localStorage`, then reopen and dismiss via backdrop click
- Clear `localStorage`, then reopen and dismiss via `Escape`

Expected:
- All three dismissal methods close the popup
- No horizontal scroll appears during or after closing

- [ ] **Step 4: Verify outbound CTA behavior**

Manual check:
- Clear `localStorage`
- Wait for the popup
- Click `Follow on Spotify`
- Repeat and click `Follow on Apple Music`

Expected:
- Each button opens the correct artist page in a new tab
- Clicking either CTA writes the cooldown timestamp and suppresses immediate repeat prompts

- [ ] **Step 5: Verify the 14-day cooldown logic**

Manual check in DevTools console:

```js
localStorage.getItem("filibusters-follow-prompt-until")
```

Expected:
- Value exists after dismissal or CTA click
- Parsed value is greater than `Date.now()`
- Reloading the page during the cooldown does not reopen the popup

- [ ] **Step 6: Verify mobile layout around `375px`**

Manual check:
- Use responsive mode around `375px` width
- Reopen the popup after clearing the local storage key

Expected:
- No horizontal overflow
- Close button remains visible
- CTA buttons remain visible without awkward clipping
- Image remains present but does not dominate the entire viewport

- [ ] **Step 7: Run the final build after any verification fixes**

Run: `npm run build`

Expected:
- Final build completes with exit code `0`

- [ ] **Step 8: Commit the verified feature**

```bash
git add src/data/site.ts src/components/home/FollowPrompt.astro src/pages/index.astro src/styles/global.css
git commit -m "feat: add homepage follow prompt"
```

## Self-Review

- Spec coverage:
  - delayed popup: Task 2
  - 14-day cooldown: Tasks 1 and 2
  - Spotify and Apple Music direct links: Task 1 and Task 4
  - split-panel editorial layout with image: Task 2
  - homepage-only mounting: Task 3
  - desktop and mobile verification: Task 4
- Placeholder scan:
  - no `TODO`, `TBD`, or undefined verification steps remain
- Type consistency:
  - popup data is defined in `followPrompt`
  - script constants align with `storageKey`, `delayMs`, and `cooldownMs`
