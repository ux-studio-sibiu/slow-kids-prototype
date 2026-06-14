import { createClient, type ClientConfig } from "@sanity/client";

// Server-only client with a write token, used by server actions (e.g. signup
// submission). Kept separate from the read client (which uses the CDN) so the
// token never reaches the browser. Requires SANITY_EDIT_DATASET_TOKEN in the
// environment (a Sanity API token with Editor/Contributor permissions).
const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hn56l1ht",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-07-14",
  useCdn: false,
  token: process.env.SANITY_EDIT_DATASET_TOKEN,
};

const writeClient = createClient(config);

export default writeClient;
