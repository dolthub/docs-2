import type { NavSection } from "../../../shared/components";

const nav: NavSection[] = [
  {
    section: "Introduction",
    items: [
      { title: "What is Doltgres?", href: "/introduction" },
      { title: "Installation", href: "/introduction/installation" },
      { title: "Getting Started", href: "/introduction/getting-started" },
    ],
  },
  {
    section: "Concepts",
    items: [
      {
        title: "Git",
        href: "/concepts/git",
        children: [
          { title: "Commits", href: "/concepts/git/commits" },
          { title: "Log", href: "/concepts/git/log" },
          { title: "Diff", href: "/concepts/git/diff" },
          { title: "Branch", href: "/concepts/git/branch" },
          { title: "Merge", href: "/concepts/git/merge" },
          { title: "Conflicts", href: "/concepts/git/conflicts" },
          { title: "Remotes", href: "/concepts/git/remotes" },
          { title: "Working Set", href: "/concepts/git/working-set" },
        ],
      },
      {
        title: "SQL",
        href: "/concepts/sql",
        children: [
          { title: "Databases", href: "/concepts/sql/databases" },
          { title: "Schema", href: "/concepts/sql/schema" },
          { title: "Tables", href: "/concepts/sql/table" },
          { title: "Primary Keys", href: "/concepts/sql/primary-key" },
          { title: "Types", href: "/concepts/sql/types" },
          { title: "Indexes", href: "/concepts/sql/indexes" },
          { title: "Views", href: "/concepts/sql/views" },
          { title: "Constraints", href: "/concepts/sql/constraints" },
          { title: "Triggers", href: "/concepts/sql/triggers" },
          { title: "Functions", href: "/concepts/sql/functions" },
          { title: "Procedures", href: "/concepts/sql/procedures" },
          { title: "Users/Grants", href: "/concepts/sql/users-grants" },
          { title: "Transactions", href: "/concepts/sql/transaction" },
          { title: "System Variables", href: "/concepts/sql/system-variables" },
        ],
      },
      {
        title: "RDBMS",
        href: "/concepts/rdbms",
        children: [
          { title: "Server", href: "/concepts/rdbms/server" },
          { title: "Backups", href: "/concepts/rdbms/backups" },
          { title: "Replication", href: "/concepts/rdbms/replication" },
        ],
      },
    ],
  },
  {
    section: "Guides",
    items: [
      { title: "Cheat Sheet", href: "/guides/cheat-sheet" },
      { title: "Replication from Postgres", href: "/guides/replication-from-postgres" },
    ],
  },
  {
    section: "Reference",
    items: [
      {
        title: "Running the Server",
        href: "/reference/server",
        children: [
          { title: "Configuration", href: "/reference/server/configuration" },
          { title: "Access Management", href: "/reference/server/access-management" },
          { title: "Branch Permissions", href: "/reference/server/branch-permissions" },
          { title: "Backups", href: "/reference/server/backups" },
          { title: "Garbage Collection", href: "/reference/server/garbage-collection" },
          { title: "Metrics", href: "/reference/server/metrics" },
          { title: "Replication", href: "/reference/server/replication" },
          { title: "Troubleshooting", href: "/reference/server/troubleshooting" },
        ],
      },
      {
        title: "Version Control Features",
        href: "/reference/version-control",
        children: [
          { title: "All SQL Extensions", href: "/reference/version-control/sql-extensions" },
          { title: "Using Branches", href: "/reference/version-control/branches" },
          { title: "Merges", href: "/reference/version-control/merges" },
          { title: "Querying History", href: "/reference/version-control/querying-history" },
          { title: "Using Remotes", href: "/reference/version-control/remotes" },
          { title: "Functions", href: "/reference/version-control/dolt-sql-functions" },
          { title: "System Tables", href: "/reference/version-control/dolt-system-tables" },
          { title: "System Variables", href: "/reference/version-control/dolt-sysvars" },
        ],
      },
      {
        title: "SQL Language Support",
        href: "/reference/sql-support",
        children: [
          { title: "Supported Functions and Operators", href: "/reference/sql-support/supported-functions" },
          { title: "Supported Types", href: "/reference/sql-support/supported-types" },
          { title: "Supported SQL Commands", href: "/reference/sql-support/supported-commands" },
          { title: "System Catalog Schema", href: "/reference/sql-support/system-catalog-schema" },
        ],
      },
      {
        title: "Supported Clients",
        href: "/reference/supported-clients",
        children: [
          { title: "Programmatic", href: "/reference/supported-clients/clients" },
        ],
      },
      {
        title: "Benchmarks",
        href: "/reference/benchmarks",
        children: [
          { title: "Correctness", href: "/reference/benchmarks/correctness" },
          { title: "Latency", href: "/reference/benchmarks/latency" },
        ],
      },
    ],
  },
];

export default nav;
