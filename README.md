# The Filibusters Website

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
