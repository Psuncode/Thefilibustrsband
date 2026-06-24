// Generates public/apple-touch-icon.png — a real 180x180 PNG for iOS home-screen
// bookmarks (many iOS versions ignore SVG apple-touch-icons).
//
// Apple icons must NOT be transparent, so we composite the brand megaphone mark
// (public/favicon.svg) onto a solid brand-pink (#ce2067) background. The mark's
// cream fill (#FCFAF6), dark mouthpiece (#2E2528), and yellow sparkles (#F5E55B)
// all read with strong contrast against the pink field; a pink-on-pink choice
// would wash the mark out.
//
// Run: node scripts/generate-apple-touch-icon.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const SIZE = 180; // Apple touch icon: 180x180
const BG = '#ce2067'; // brand pink background (opaque — Apple icons must not be transparent)
const MARK_RATIO = 0.74; // mark occupies ~74% of the canvas, leaving comfortable padding

const sharp = (await import('sharp')).default;

const svg = await readFile(resolve(projectRoot, 'public/favicon.svg'));
const markSize = Math.round(SIZE * MARK_RATIO);
const offset = Math.round((SIZE - markSize) / 2);

// Rasterize the SVG mark at the target size.
const mark = await sharp(svg)
  .resize(markSize, markSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

// Solid pink background, mark centered on top.
const png = await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 4,
    background: BG,
  },
})
  .composite([{ input: mark, top: offset, left: offset }])
  .png()
  .toBuffer();

const outPath = resolve(projectRoot, 'public/apple-touch-icon.png');
await writeFile(outPath, png);

const meta = await sharp(png).metadata();
console.log(`Wrote ${outPath} — ${meta.format} ${meta.width}x${meta.height}`);
