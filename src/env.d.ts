/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_COMMUNITY_FORM_ACTION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
