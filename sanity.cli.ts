import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

// The CLI does not read .env.local on its own; reuse Next's loader so Studio, site and CLI share one project ID.
loadEnvConfig(process.cwd());

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
