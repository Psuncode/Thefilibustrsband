# Project Decisions

This file stores durable project decisions that future agents and contributors are likely to need.

## 2026-03-30

### Startup Memory Strategy

- `AGENTS.md` is the repo startup-memory file for stable instructions and conventions.
- `docs/memory/` stores durable project memory that is too detailed for `AGENTS.md` but still worth preserving.
- Raw task chatter and full AI transcripts should not be committed.

### Locus Memory Policy

- `locus` is installed as an external Codex MCP memory server.
- `locus` should be used for cross-session recall and non-committed working memory.
- Repo-critical facts should still be written into `AGENTS.md` or `docs/memory/` so they stay with the codebase.

### Analytics

- `@vercel/analytics` is installed.
- Analytics is mounted in `src/layouts/BaseLayout.astro` so it applies site-wide.

### Favicon

- The tab icon is a megaphone-style SVG stored at `public/favicon.svg`.
- The layout continues to reference `/favicon.svg` directly.
