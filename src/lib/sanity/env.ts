const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2025-05-08";

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  enabled: Boolean(projectId && dataset)
} as const;
