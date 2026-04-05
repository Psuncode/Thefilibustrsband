# The Filibusters Website

The homepage must output title, description, Open Graph tags, and a favicon.

## Local Development

The homepage uses Tailwind utilities plus CSS variables for the official brand palette.

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Asset Policy

Only copy assets into `public/images/` if they are used by the homepage.
Keep all unused brand assets and source files in the local asset folders outside the shipped app.

## Publish Hygiene

The GitHub repo should include only the website app, the approved docs, and the small set of shipped homepage assets.
Unused source assets stay local and out of version control.

## Accessibility Checks

- Keyboard navigation works through all interactive elements
- Visible focus states are preserved
- Reduced-motion users do not get forced animation
- No section creates horizontal scroll at 375px width

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
- one current show detail route derived from the live shows listing

It fails on:
- horizontal overflow at `375px`
- failed critical document/image/stylesheet requests
- missing critical SEO tags
- missing `Event` JSON-LD on the dynamic show detail page

Screenshots are written to `tmp/verify-seo/`.

## Deployment

1. Connect the local directory to the existing GitHub repo
2. Add `PUBLIC_COMMUNITY_FORM_ACTION` in the deployment environment
3. Deploy to Vercel or Netlify
4. Verify the release links, show CTA, and signup form in production
