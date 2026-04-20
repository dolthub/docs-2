// All pages from packages/doltgres/content/SUMMARY.md
// path: URL path relative to https://docs.doltgres.com
// title: expected h1 text (matches SUMMARY.md link text)

import { DocPage } from "./dolt-pages";
export type { DocPage };

export const introductionPages: DocPage[] = [
  { path: "/introduction", title: "What is Doltgres?" },
  { path: "/introduction/installation", title: "Installation" },
  { path: "/introduction/getting-started", title: "Getting Started" },
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
  { path: "/concepts/sql/schema", title: "Schema" },
  { path: "/concepts/sql/table", title: "Tables" },
  { path: "/concepts/sql/primary-key", title: "Primary Keys" },
  { path: "/concepts/sql/types", title: "Types" },
  { path: "/concepts/sql/indexes", title: "Indexes" },
  { path: "/concepts/sql/views", title: "Views" },
  { path: "/concepts/sql/constraints", title: "Constraints" },
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
  {
    path: "/guides/replication-from-postgres",
    title: "Replication from Postgres",
  },
];

export const referencePages: DocPage[] = [
  { path: "/reference/sql/server", title: "Running the Server" },
  { path: "/reference/sql/server/configuration", title: "Configuration" },
  {
    path: "/reference/sql/server/access-management",
    title: "Access Management",
  },
  {
    path: "/reference/sql/server/branch-permissions",
    title: "Branch Permissions",
  },
  { path: "/reference/sql/server/backups", title: "Backups" },
  {
    path: "/reference/sql/server/garbage-collection",
    title: "Garbage Collection",
  },
  { path: "/reference/sql/server/metrics", title: "Metrics" },
  { path: "/reference/sql/server/replication", title: "Replication" },
  { path: "/reference/sql/server/troubleshooting", title: "Troubleshooting" },
  {
    path: "/reference/sql/version-control",
    title: "Version Control Features",
  },
  {
    path: "/reference/sql/version-control/branches",
    title: "Using Branches",
  },
  { path: "/reference/sql/version-control/merges", title: "Merges" },
  {
    path: "/reference/sql/version-control/querying-history",
    title: "Querying History",
  },
  { path: "/reference/sql/version-control/remotes", title: "Using Remotes" },
  {
    path: "/reference/sql/version-control/dolt-sql-functions",
    title: "Functions",
  },
  {
    path: "/reference/sql/version-control/dolt-system-tables",
    title: "System Tables",
  },
  {
    path: "/reference/sql/version-control/dolt-sysvars",
    title: "System Variables",
  },
  { path: "/reference/sql-support", title: "SQL Language Support" },
  {
    path: "/reference/sql-support/supported-functions",
    title: "Supported Functions and Operators",
  },
  {
    path: "/reference/sql-support/supported-types",
    title: "Supported Types",
  },
  {
    path: "/reference/sql-support/supported-commands",
    title: "Supported SQL Commands",
  },
  {
    path: "/reference/sql-support/system-catalog-schema",
    title: "System Catalog Schema",
  },
  { path: "/reference/sql/supported-clients", title: "Supported Clients" },
  {
    path: "/reference/sql/supported-clients/clients",
    title: "Programmatic",
  },
  { path: "/reference/benchmarks", title: "Benchmarks" },
  { path: "/reference/benchmarks/correctness", title: "Correctness" },
  { path: "/reference/benchmarks/latency", title: "Latency" },
];

export const allDoltgresPages: DocPage[] = [
  ...introductionPages,
  ...conceptsPages,
  ...guidesPages,
  ...referencePages,
];
