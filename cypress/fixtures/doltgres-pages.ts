// All pages from packages/doltgres/content/SUMMARY.md
// path: URL path relative to https://docs.doltgres.com
// title: expected h1 text (matches SUMMARY.md link text)

import { DocPage } from "./dolt-pages";
export type { DocPage };

// NOTE: /introduction (the README.md) redirects to the homepage on the live
// site, so it is not a standalone page — only the sub-pages exist.
export const introductionPages: DocPage[] = [
  { path: "/introduction/installation", title: "Installation" },
  { path: "/introduction/getting-started", title: "Getting Started" },
  {
    path: "/introduction/getting-started/version-control",
    title: "Using Version Control",
  },
  { path: "/introduction/use-cases", title: "Use Cases" },
  { path: "/introduction/use-cases/data-sharing", title: "Data Sharing" },
  {
    path: "/introduction/use-cases/data-and-model-quality",
    title: "Data and Model Quality Control",
  },
  {
    path: "/introduction/use-cases/manual-data-curation",
    title: "Manual Data Curation",
  },
  {
    path: "/introduction/use-cases/vc-your-app",
    title: "Version Control for your Application",
  },
  {
    path: "/introduction/use-cases/versioned-replica",
    title: "Versioned Postgres Replica",
  },
  { path: "/introduction/use-cases/audit", title: "Audit" },
  {
    path: "/introduction/use-cases/configuration-management",
    title: "Configuration Management",
  },
  { path: "/introduction/use-cases/offline-first", title: "Offline First" },
];

export const conceptsPages: DocPage[] = [
  { path: "/concepts/git", title: "Git" },
  { path: "/concepts/git/commits", title: "Commits" },
  { path: "/concepts/git/log", title: "Log" },
  { path: "/concepts/git/diff", title: "Diff" },
  { path: "/concepts/git/branch", title: "Branch" },
  { path: "/concepts/git/merge", title: "Merge" },
  { path: "/concepts/git/conflicts", title: "Conflicts" },
  { path: "/concepts/git/remotes", title: "Remotes" },
  { path: "/concepts/git/working-set", title: "Working Set" },
  { path: "/concepts/sql", title: "SQL" },
  { path: "/concepts/sql/databases", title: "Databases" },
  { path: "/concepts/sql/schemas", title: "Schemas" },
  { path: "/concepts/sql/schema", title: "Schema" },
  { path: "/concepts/sql/table", title: "Tables" },
  { path: "/concepts/sql/primary-key", title: "Primary Keys" },
  { path: "/concepts/sql/types", title: "Types" },
  { path: "/concepts/sql/indexes", title: "Indexes" },
  { path: "/concepts/sql/views", title: "Views" },
  { path: "/concepts/sql/constraints", title: "Constraints" },
  { path: "/concepts/sql/sequences", title: "Sequences" },
  { path: "/concepts/sql/triggers", title: "Triggers" },
  { path: "/concepts/sql/functions", title: "Functions" },
  { path: "/concepts/sql/procedures", title: "Procedures" },
  { path: "/concepts/sql/users-grants", title: "Users/Grants" },
  { path: "/concepts/sql/transaction", title: "Transactions" },
  { path: "/concepts/sql/system-variables", title: "System Variables" },
  { path: "/concepts/rdbms", title: "RDBMS" },
  { path: "/concepts/rdbms/server", title: "Server" },
  { path: "/concepts/rdbms/backups", title: "Backups" },
  { path: "/concepts/rdbms/replication", title: "Replication" },
];

export const guidesPages: DocPage[] = [
  { path: "/guides/cheat-sheet", title: "Cheat Sheet" },
  { path: "/guides/import", title: "Importing Data" },
  {
    path: "/guides/replication-from-postgres",
    title: "Replication from Postgres",
  },
];

// NOTE: docs.doltgres.com drops the /sql/ segment from reference paths.
// e.g. SUMMARY.md has reference/sql/server/README.md → live URL is /reference/server
export const referencePages: DocPage[] = [
  { path: "/reference/server", title: "Running the Server" },
  { path: "/reference/server/configuration", title: "Configuration" },
  { path: "/reference/server/access-management", title: "Access Management" },
  { path: "/reference/server/branch-permissions", title: "Branch Permissions" },
  { path: "/reference/server/backups", title: "Backups" },
  { path: "/reference/server/garbage-collection", title: "Garbage Collection" },
  { path: "/reference/server/metrics", title: "Metrics" },
  { path: "/reference/server/replication", title: "Replication" },
  { path: "/reference/server/troubleshooting", title: "Troubleshooting" },
  { path: "/reference/version-control", title: "Version Control Features" },
  {
    path: "/reference/version-control/sql-extensions",
    title: "SQL Extensions Index",
  },
  { path: "/reference/version-control/branches", title: "Using Branches" },
  { path: "/reference/version-control/merges", title: "Merges" },
  {
    path: "/reference/version-control/querying-history",
    title: "Querying History",
  },
  { path: "/reference/version-control/remotes", title: "Using Remotes" },
  {
    path: "/reference/version-control/dolt-sql-functions",
    title: "Functions",
  },
  {
    path: "/reference/version-control/dolt-system-tables",
    title: "System Tables",
  },
  {
    path: "/reference/version-control/dolt-sysvars",
    title: "System Variables",
  },
  { path: "/reference/sql-support", title: "SQL Language Support" },
  {
    path: "/reference/sql-support/supported-functions",
    title: "Supported Functions and Operators",
  },
  { path: "/reference/sql-support/supported-types", title: "Supported Types" },
  {
    path: "/reference/sql-support/supported-commands",
    title: "Supported SQL Commands",
  },
  {
    path: "/reference/sql-support/system-catalog-schema",
    title: "System Catalog Schema",
  },
  { path: "/reference/sql-support/extensions", title: "Extensions" },
  { path: "/reference/supported-clients", title: "Supported Clients" },
  { path: "/reference/supported-clients/clients", title: "Programmatic" },
  { path: "/reference/supported-clients/sql-editors", title: "SQL Editors" },
  { path: "/reference/benchmarks", title: "Benchmarks" },
  { path: "/reference/benchmarks/correctness", title: "Correctness" },
  { path: "/reference/benchmarks/latency", title: "Latency" },
];

export const otherPages: DocPage[] = [
  { path: "/other/faq", title: "FAQ" },
  { path: "/other/roadmap", title: "Roadmap" },
];

export const allDoltgresPages: DocPage[] = [
  ...introductionPages,
  ...conceptsPages,
  ...guidesPages,
  ...referencePages,
  ...otherPages,
];
