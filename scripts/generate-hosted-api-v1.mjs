#!/usr/bin/env node
/**
 * Generates per-tag Markdown pages for the Hosted v1 API from the OpenAPI spec.
 *
 * Usage:
 *   node scripts/generate-hosted-api-v1.mjs
 *
 * Output: site/dolt/src/content/products/hosted/api/v1/
 *   user.md         — User-tagged endpoints
 *   deployment.md   — Deployment-tagged endpoints
 *   pull-request.md — Pull request-tagged endpoints
 *   models.md       — all component schemas
 *
 * authentication.md and README.md are hand-written; this script does not touch
 * them.
 *
 * The rendering lives in scripts/lib/openapi-docs.mjs, shared with the DoltHub
 * v2 generator.
 */

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { generateApiDocs } from "./lib/openapi-docs.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

generateApiDocs({
  specPath: join(__dirname, "../specs/hosted-v1.yaml"),
  outDir: join(__dirname, "../site/dolt/src/content/products/hosted/api/v1"),
  tagPages: [
    {
      tag: "User",
      file: "user.md",
      frontmatter:
        '---\ntitle: "User"\ndescription: The authenticated user resource in the Hosted v1 API.\n---\n\n# User',
    },
    {
      tag: "Deployment",
      file: "deployment.md",
      frontmatter:
        '---\ntitle: "Deployment"\ndescription: Creating, listing, and reading Hosted Dolt deployments and their instances.\n---\n\n# Deployment',
    },
    {
      tag: "Pull request",
      file: "pull-request.md",
      frontmatter:
        '---\ntitle: "Pull Request"\ndescription: Reading the pull requests in a deployment database, with their comments and activity.\n---\n\n# Pull Request',
    },
  ],
  models: {
    file: "models.md",
    href: "/products/hosted/api/v1/models",
    frontmatter:
      '---\ntitle: "Models"\ndescription: Request and response schemas for the Hosted v1 API.\n---\n\n# Models',
    intro:
      "Shared request and response types used across the v1 API. See the [error model](#model-problem) for how failures are reported.",
  },
});
