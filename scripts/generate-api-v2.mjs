#!/usr/bin/env node
/**
 * Generates per-tag Markdown pages for the DoltHub v2 API from the OpenAPI spec.
 *
 * Usage:
 *   node scripts/generate-api-v2.mjs
 *
 * Output: site/dolt/src/content/products/dolthub/api/v2/
 *   database.md   — all Database-tagged endpoints
 *   user.md       — User-tagged endpoints
 *   operations.md — Operations-tagged endpoints
 *   models.md     — all component schemas
 *
 * authentication.md, migration.md, and README.md are hand-written; this script
 * does not touch them.
 *
 * The rendering lives in scripts/lib/openapi-docs.mjs, shared with the Hosted
 * v1 generator.
 */

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { generateApiDocs } from "./lib/openapi-docs.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// The Database tag covers every database sub-resource, so its page gets an H2
// per sub-resource rather than one flat list of ~20 endpoints.
function databaseSubResource(path) {
  // After /databases/{owner}/{database}/...
  const m = path.match(/^\/api\/v2\/databases\/\{[^}]+\}\/\{[^}]+\}\/([^/]+)/);
  if (m) {
    switch (m[1]) {
      case "branches":
        return "Branches";
      case "tags":
        return "Tags";
      case "forks":
        return "Forks";
      case "releases":
        return "Releases";
      case "sql":
      case "sql-writes":
        return "SQL";
      case "pulls":
        return "Pull Requests";
      case "imports":
        return "Imports";
      default:
        return m[1];
    }
  }
  if (path.startsWith("/api/v2/databases")) return "Databases";
  return "Other";
}

generateApiDocs({
  specPath: join(__dirname, "../specs/dolthub-v2.yaml"),
  outDir: join(__dirname, "../site/dolt/src/content/products/dolthub/api/v2"),
  tagPages: [
    {
      tag: "User",
      file: "user.md",
      frontmatter:
        '---\ntitle: "User"\ndescription: The authenticated user resource in the DoltHub v2 API.\n---\n\n# User',
    },
    {
      tag: "Database",
      file: "database.md",
      frontmatter:
        '---\ntitle: "Database"\ndescription: DoltHub databases, branches, tags, forks, releases, SQL, pull requests, and imports.\n---\n\n# Database',
      groups: {
        of: databaseSubResource,
        order: [
          "Databases",
          "SQL",
          "Branches",
          "Tags",
          "Forks",
          "Releases",
          "Pull Requests",
          "Imports",
        ],
      },
    },
    {
      tag: "Operations",
      file: "operations.md",
      frontmatter:
        '---\ntitle: "Operations"\ndescription: Long-running async operations in the DoltHub v2 API.\n---\n\n# Operations',
    },
  ],
  models: {
    file: "models.md",
    href: "/products/dolthub/api/v2/models",
    frontmatter:
      '---\ntitle: "Models"\ndescription: Request and response schemas for the DoltHub v2 API.\n---\n\n# Models',
    intro:
      "Shared request and response types used across the v2 API. See the [error model](#model-problem) for how failures are reported.",
  },
});
