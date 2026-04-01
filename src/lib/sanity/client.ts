import { createClient } from "@sanity/client";
import { sanityConfig } from "./env";

export const sanityClient = sanityConfig.enabled
  ? createClient({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: true
    })
  : null;
