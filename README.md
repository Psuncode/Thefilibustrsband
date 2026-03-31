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

## Accessibility Checks

- Keyboard navigation works through all interactive elements
- Visible focus states are preserved
- Reduced-motion users do not get forced animation
- No section creates horizontal scroll at 375px width
