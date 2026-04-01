import { defineConfig } from "sanity";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID ||
  "demo";
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.PUBLIC_SANITY_DATASET ||
  "production";

export default defineConfig({
  name: "default",
  title: "The Filibusters CMS",
  projectId,
  dataset,
  schema: {
    types: schemaTypes
  }
});
