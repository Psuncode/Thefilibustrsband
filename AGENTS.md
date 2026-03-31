# Filibuster Website Agent Memory

Use this file as the repo-specific working memory for any coding agent operating in this repository. Keep it short, stable, and factual so it works well for Codex, Claude-style agents, Cursor-style agents, and other tools that read `AGENTS.md` at session start.

## Repository Purpose

- This repo contains the marketing website for The Filibusters band.
- The site uses Astro and Tailwind.
- The current site is primarily a static homepage built from shared layout/components plus structured content files.

## Project Structure

- `src/pages/` holds route entrypoints.
- `src/pages/index.astro` is the homepage.
- `src/layouts/` holds shared page wrappers.
- `src/components/site/` holds shared shell components.
- `src/components/home/` holds homepage-only sections.
- `src/data/` holds copy, metadata, release data, and show data.
- `src/styles/` holds global styles and tokens.
- `public/` should contain only shipped public assets.

## Important Files

- `src/pages/index.astro`: homepage route.
- `src/layouts/BaseLayout.astro`: shared document shell, metadata, favicon link, analytics.
- `src/components/site/Header.astro`: shared header.
- `src/components/site/Footer.astro`: shared footer.
- `src/data/site.ts`: site-level metadata.
- `src/data/homepage.ts`: homepage copy source of truth.
- `src/data/shows.ts`: current show listing source of truth until CMS migration.
- `public/favicon.svg`: current tab icon.

## Operating Rules

- Follow existing Astro patterns before introducing new structure.
- Prefer small, focused components with one clear responsibility.
- Keep content and configuration in `src/data/` instead of hardcoding copy in components.
- Use `PascalCase` for Astro component filenames.
- Use `camelCase` for exported data objects.
- Use 2-space indentation in Astro, CSS, JSON, and config files.
- Preserve the established visual language unless the task is explicitly a redesign.

## Asset Rules

- Do not commit raw source assets from `Band Assest/` or `Brand Guide and logos/`.
- Add site images to `src/` first, preferably under `src/assets/`, when they are used by Astro components.
- If an image is currently outside `src/` and should be used in a component, move it into `src/` before wiring it up.
- Homepage/release/brand images currently live in `src/assets/images/` and are referenced through `astro:assets`.
- Do not add unused images or scratch files to `public/`.
- Keep `public/` for assets that must ship at a fixed public URL, such as `favicon.svg`.
- If an asset is added to `public/`, it should be referenced by the shipped site.

## Commands

- `npm install`: install dependencies.
- `npm run dev`: local Astro dev server.
- `npm run build`: production build to `dist/`.
- `npm run preview`: preview the built site locally.

## Verification

- Always run `npm run build` after code changes unless the user explicitly says not to.
- For layout, styling, or interaction changes, also check in `npm run dev`.
- For visual changes, verify mobile width around `375px`.
- Treat horizontal scroll, broken CSS, missing assets, and broken anchors as blockers.

## Environment

- Do not commit `.env`.
- `PUBLIC_COMMUNITY_FORM_ACTION` must be provided at deploy time, not committed.

## Current Decisions

- The site currently uses Google Fonts via `BaseLayout.astro` and Vercel Analytics via `@vercel/analytics`.
- The homepage is still the primary shipped experience, but future content is expected to move toward an editable CMS workflow instead of repo-only data files.
- The agreed CMS direction is `Sanity`.
- The agreed starter email platform direction is `Kit`, with a simple email-only signup flow first.
- Planned next-phase roadmap lives in `docs/superpowers/specs/2026-03-31-next-phase-roadmap.md`.

## Change Scope

- Prefer small, scoped changes tied to one user request.
- Use commit prefixes like `feat:`, `fix:`, and `chore:` when committing.
- Do not revert unrelated user changes in the worktree.

## Agent Guidance

- Treat this file as startup context, not as a task scratchpad.
- Prefer updating this file only when repo conventions or stable facts change.
- Put feature plans, temporary notes, and task-specific decisions somewhere else.

## Memory Layout

- `AGENTS.md`: stable startup memory for any coding agent.
- `docs/memory/project-state.md`: durable current-state summary of the site.
- `docs/memory/decisions.md`: important project decisions and rationale worth preserving.
- `docs/memory/work-log.md`: concise human-written milestone log, not raw session transcripts.
- `docs/superpowers/specs/`: design docs and implementation plans, not startup memory.

## Locus Usage

- Use `locus` for searchable working memory across sessions: recalled context, prior exploration, and ephemeral notes that do not belong in git.
- Use `AGENTS.md` and `docs/memory/` for durable repo knowledge that should travel with the codebase.
- If a fact would help any future contributor or agent after cloning the repo, it belongs in `AGENTS.md` or `docs/memory/`, not only in `locus`.
- Do not rely on `locus` alone for project-critical decisions, conventions, or deployment requirements.

## Memory Update Rules

- Update `AGENTS.md` only for stable repo conventions or high-signal project facts.
- Update `docs/memory/project-state.md` when the shipped site materially changes.
- Update `docs/memory/decisions.md` when a decision will matter to future work.
- Use `locus` for temporary or session-level memory that should not be committed.
- Do not dump full agent transcripts into the repo.
- Prefer short summaries over chronological noise.

## What Belongs Here

- Stable repo facts.
- Build and verification expectations.
- Asset and content placement rules.
- Project-specific constraints an agent should know at session start.

## What Does Not Belong Here

- Temporary task notes.
- Long design docs or implementation plans.
- Personal reminders unrelated to the repo.
- Repeated generic advice that the agent already knows.
