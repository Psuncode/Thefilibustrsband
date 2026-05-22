/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_COMMUNITY_FORM_ACTION?: string;
  readonly PUBLIC_SANITY_PROJECT_ID?: string;
  readonly PUBLIC_SANITY_DATASET?: string;
  readonly PUBLIC_SANITY_API_VERSION?: string;
  // Server-only — used by src/pages/api/subscribe.ts. Set in Vercel
  // Project Settings → Environment Variables (and a local .env for `astro dev`).
  readonly KIT_API_KEY?: string;
  readonly KIT_FORM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
