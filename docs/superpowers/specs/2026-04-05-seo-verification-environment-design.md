# SEO Verification Environment Design

Date: 2026-04-05

## Goal

Create a reusable local verification command for SEO-facing changes so future work can be checked with a real mobile-width browser pass instead of ad hoc manual inspection.

This tool should specifically close the gap encountered during the SEO foundation pass: visual screenshots were possible, but reliable scripted `scrollWidth` verification was not yet available as a stable repo workflow.

## Scope

In scope:
- a repo-local command for SEO/mobile smoke verification
- browser-based checks at `375px` width
- checks for a small set of SEO-critical pages
- failures only on hard issues
- screenshot capture for manual inspection
- documentation for future developers

Out of scope:
- implementing deferred roadmap product ideas
- broad visual regression coverage
- Lighthouse or Core Web Vitals automation
- CI integration unless it is trivial and clearly valuable
- sweeping checks across the entire route set

## Problem Statement

The repo currently lacks a reusable, trustworthy browser automation workflow for validating mobile SEO-related changes.

Recent verification succeeded on build output and structured data, but the deeper browser-side mobile check had to be improvised. That makes future SEO development slower and less reliable.

The missing capability is not general test automation. It is a focused browser verification environment for search-facing changes.

## Recommended Approach

Build a narrow Playwright-based verification command for SEO-related work.

This command should:
- start the local site automatically
- open a small set of high-value pages at `375px`
- fail on hard issues only
- save screenshots as artifacts for quick review

This gives the project a dependable answer to the most important mobile/SEO regressions without turning the repo into a heavy QA framework.

## Why This Is Worth Building

This is worth building because:
- SEO changes often affect layout, metadata, image behavior, and schema output together
- mobile overflow and broken assets are blockers for user experience and search quality
- future verification should not depend on one-off shell experiments
- the repo is small enough that a narrow smoke check will stay maintainable

This is not worth overbuilding into:
- full visual regression infrastructure
- route-by-route crawling
- automated performance auditing on every run

## Route Strategy

Use a hybrid route set:
- fixed core routes:
  - `/`
  - `/shows`
- one dynamic show detail route derived from current show data

This balances stability with relevance:
- homepage and shows index are evergreen high-value pages
- one dynamic show detail page ensures event-schema and event-layout checks stay tied to current content

The command should not depend on hardcoded show slugs.

## Verification Rules

The command should fail only on hard issues.

Hard failures:
- horizontal overflow at `375px`
- failed critical requests, especially document and image requests
- missing critical SEO tags on the checked pages
- failure to capture screenshots

Soft signals that should not fail the run:
- console warnings
- copy polish issues
- subjective visual concerns

This keeps the command useful and trustworthy instead of noisy.

## Required Checks

### Mobile Layout Check

At `375px` width, each checked page should verify:
- `document.documentElement.scrollWidth <= clientWidth`
- no horizontal overflow on the main document

This is the primary scripted replacement for the earlier incomplete manual attempt.

### Request Integrity Check

Track network failures for the checked pages and fail on:
- failed document requests
- failed image requests
- failed stylesheet requests

Third-party analytics noise should not make the command fail unless it blocks page verification.

### Critical SEO Tag Check

For all checked pages:
- canonical URL exists
- meta description exists
- Open Graph title exists
- Open Graph description exists
- Open Graph image exists

For the dynamic show detail page:
- `Event` JSON-LD exists

The tool does not need to fully validate every structured-data field in this phase. It just needs to confirm the key expected tags are present.

### Screenshot Artifacts

Capture a screenshot for each checked page at mobile width.

These screenshots should be written to a predictable local output directory that is not committed to git.

## Tooling Design

Use Playwright as a dev dependency.

Implementation should likely include:
- `playwright` in `devDependencies`
- a script such as `scripts/verify-seo-mobile.mjs`
- an npm command such as `npm run verify:seo`

The script should:
- start the site automatically using an existing local server workflow
- wait for the server to become reachable
- resolve the dynamic show slug from current show data
- run the checks
- print a clear pass/fail summary
- exit nonzero on hard failures

## Browser Strategy

The verification command should use Playwright browser automation in a repo-owned way rather than depending on manual Chrome CLI invocations.

Preferred behavior:
- use Playwright's managed browser/runtime path for consistency
- avoid requiring future developers to improvise direct DevTools or Chrome command-line scripting

The developer experience should be one command, not a multi-step manual setup.

## Output Design

The command should report:
- which pages were checked
- whether overflow was detected
- whether any critical requests failed
- whether required SEO tags were missing
- where screenshots were written

If the command fails, the output should make the reason obvious enough to act on immediately.

## Developer Workflow

This command should be run explicitly after SEO-facing changes, not automatically on every save.

Recommended use cases:
- metadata changes
- structured data changes
- layout changes on search-facing pages
- image changes
- homepage or shows-page copy changes

This keeps the workflow fast enough for normal development and reliable enough for targeted verification.

## Documentation Requirement

Document:
- what the command checks
- which pages it targets
- what counts as a failure
- where screenshots are written
- when developers should run it

This should live in repo documentation that future contributors will actually find and use.

## Success Criteria

This slice is successful when:
- `npm run verify:seo` or equivalent runs locally from the repo
- it checks `/`, `/shows`, and one current show detail page
- it fails on horizontal overflow, broken critical requests, or missing critical SEO tags
- it saves screenshots
- it is documented clearly enough for future development use

## Deferred Follow-On Ideas

These are valid future improvements, but not part of this implementation:
- broader route coverage beyond the three core checks
- deeper JSON-LD assertions
- CI integration
- Lighthouse or performance checks
- broader visual regression tooling

## Recommended Next Step

Write an implementation plan for a narrow Playwright-based SEO verification environment and keep the first version intentionally small.
