// All pages from packages/dolt/content/SUMMARY.md
// path: URL path relative to https://docs.dolthub.com
// title: expected h1 text (matches SUMMARY.md link text)

export type DocPage = {
  path: string;
  title: string;
};

export const introductionPages: DocPage[] = [
  { path: "/introduction/what-is-dolt", title: "What Is Dolt?" },
  { path: "/introduction/installation", title: "Installation" },
  { path: "/introduction/installation/linux", title: "Linux" },
  { path: "/introduction/installation/windows", title: "Windows" },
  { path: "/introduction/installation/mac", title: "Mac" },
  { path: "/introduction/installation/source", title: "Build from Source" },
  {
    path: "/introduction/installation/application-server",
    title: "Application Server",
  },
  { path: "/introduction/installation/docker", title: "Docker" },
  { path: "/introduction/installation/upgrading", title: "Upgrading" },
  { path: "/introduction/getting-started", title: "Getting Started" },
  {
    path: "/introduction/getting-started/database",
    title: "Version Controlled Database",
  },
  {
    path: "/introduction/getting-started/git-for-data",
    title: "Git For Data",
  },
  {
    path: "/introduction/getting-started/versioned-mysql-replica",
    title: "Versioned MySQL Replica",
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
    title: "Versioned MySQL Replica",
  },
  { path: "/introduction/use-cases/audit", title: "Audit" },
  {
    path: "/introduction/use-cases/configuration-management",
    title: "Configuration Management",
  },
  { path: "/introduction/use-cases/offline-first", title: "Offline First" },
];

export const conceptsPages: DocPage[] = [
  { path: "/concepts/dolt", title: "Dolt" },
  { path: "/concepts/dolt/git", title: "Git" },
  { path: "/concepts/dolt/git/commits", title: "Commits" },
  { path: "/concepts/dolt/git/log", title: "Log" },
  { path: "/concepts/dolt/git/diff", title: "Diff" },
  { path: "/concepts/dolt/git/branch", title: "Branch" },
  { path: "/concepts/dolt/git/merge", title: "Merge" },
  { path: "/concepts/dolt/git/conflicts", title: "Conflicts" },
  { path: "/concepts/dolt/git/remotes", title: "Remotes" },
  { path: "/concepts/dolt/git/working-set", title: "Working Set" },
  { path: "/concepts/dolt/sql", title: "SQL" },
  { path: "/concepts/dolt/sql/databases", title: "Databases" },
  { path: "/concepts/dolt/sql/schema", title: "Schema" },
  { path: "/concepts/dolt/sql/table", title: "Tables" },
  { path: "/concepts/dolt/sql/primary-key", title: "Primary Keys" },
  { path: "/concepts/dolt/sql/types", title: "Types" },
  { path: "/concepts/dolt/sql/indexes", title: "Indexes" },
  { path: "/concepts/dolt/sql/views", title: "Views" },
  { path: "/concepts/dolt/sql/constraints", title: "Constraints" },
  { path: "/concepts/dolt/sql/triggers", title: "Triggers" },
  { path: "/concepts/dolt/sql/procedures", title: "Procedures" },
  { path: "/concepts/dolt/sql/users-grants", title: "Users/Grants" },
  { path: "/concepts/dolt/sql/transaction", title: "Transactions" },
  { path: "/concepts/dolt/sql/system-variables", title: "System Variables" },
  { path: "/concepts/dolt/rdbms", title: "RDBMS" },
  { path: "/concepts/dolt/rdbms/server", title: "Server" },
  { path: "/concepts/dolt/rdbms/backups", title: "Backups" },
  { path: "/concepts/dolt/rdbms/replication", title: "Replication" },
  { path: "/concepts/dolthub", title: "DoltHub/DoltLab" },
  { path: "/concepts/dolthub/permissions", title: "Permissions" },
  { path: "/concepts/dolthub/prs", title: "Pull Requests" },
  { path: "/concepts/dolthub/issues", title: "Issues" },
  { path: "/concepts/dolthub/forks", title: "Forks" },
];

// NOTE: The live site at docs.dolthub.com uses /sql-reference/ and
// /cli-reference/ as top-level paths — NOT /reference/sql/ or /reference/cli/.
// Old /reference/sql/* paths redirect to the new /sql-reference/* paths.
export const sqlReferencePages: DocPage[] = [
  { path: "/sql-reference/server", title: "Running the Server" },
  { path: "/sql-reference/server/configuration", title: "Configuration" },
  {
    path: "/sql-reference/server/access-management",
    title: "Access Management",
  },
  {
    path: "/sql-reference/server/branch-permissions",
    title: "Branch Permissions",
  },
  { path: "/sql-reference/server/backups", title: "Backups" },
  {
    path: "/sql-reference/server/garbage-collection",
    title: "Garbage Collection",
  },
  { path: "/sql-reference/server/metrics", title: "Metrics" },
  { path: "/sql-reference/server/replication", title: "Replication" },
  { path: "/sql-reference/server/troubleshooting", title: "Troubleshooting" },
  {
    path: "/sql-reference/version-control",
    title: "Version Control Features",
  },
  {
    path: "/sql-reference/version-control/branches",
    title: "Using Branches",
  },
  { path: "/sql-reference/version-control/merges", title: "Merges" },
  {
    path: "/sql-reference/version-control/querying-history",
    title: "Querying History",
  },
  {
    path: "/sql-reference/version-control/remotes",
    title: "Using Remotes",
  },
  {
    path: "/sql-reference/version-control/dolt-sql-procedures",
    title: "Procedures",
  },
  {
    path: "/sql-reference/version-control/dolt-sql-functions",
    title: "Functions",
  },
  {
    path: "/sql-reference/version-control/dolt-system-tables",
    title: "System Tables",
  },
  {
    path: "/sql-reference/version-control/dolt-sysvars",
    title: "System Variables",
  },
  {
    path: "/sql-reference/version-control/saved-queries",
    title: "Saved Queries",
  },
  { path: "/sql-reference/sql-support", title: "SQL Language Support" },
  {
    path: "/sql-reference/sql-support/data-description",
    title: "Data Description",
  },
  {
    path: "/sql-reference/sql-support/expressions-functions-operators",
    title: "Expressions, Functions, Operators",
  },
  {
    path: "/sql-reference/sql-support/supported-statements",
    title: "Supported Statements",
  },
  {
    path: "/sql-reference/sql-support/information-schema",
    title: "MySQL Information Schema",
  },
  {
    path: "/sql-reference/sql-support/collations-and-charsets",
    title: "Collations and Character Sets",
  },
  {
    path: "/sql-reference/sql-support/system-variables",
    title: "System Variables",
  },
  { path: "/sql-reference/sql-support/sql-modes", title: "SQL Modes" },
  {
    path: "/sql-reference/sql-support/miscellaneous",
    title: "Miscellaneous",
  },
  { path: "/sql-reference/supported-clients", title: "Supported Clients" },
  {
    path: "/sql-reference/supported-clients/clients",
    title: "Programmatic",
  },
  {
    path: "/sql-reference/supported-clients/sql-editors",
    title: "SQL Editors",
  },
  {
    path: "/sql-reference/benchmarks",
    title: "Benchmarks and Metrics",
  },
  { path: "/sql-reference/benchmarks/correctness", title: "Correctness" },
  { path: "/sql-reference/benchmarks/latency", title: "Latency" },
  { path: "/sql-reference/benchmarks/import", title: "Import" },
];

export const cliReferencePages: DocPage[] = [
  { path: "/cli-reference/cli", title: "Commands" },
  { path: "/cli-reference/git-comparison", title: "Git Comparison" },
];

export const architecturePages: DocPage[] = [
  { path: "/architecture/architecture", title: "Overview" },
  { path: "/architecture/storage-engine", title: "Storage Engine" },
  {
    path: "/architecture/storage-engine/commit-graph",
    title: "Commit Graph",
  },
  { path: "/architecture/storage-engine/prolly-tree", title: "Prolly Trees" },
  { path: "/architecture/storage-engine/block-store", title: "Block Store" },
  { path: "/architecture/sql", title: "SQL" },
  { path: "/architecture/sql/go-mysql-server", title: "Go MySQL Server" },
  { path: "/architecture/sql/vitess", title: "Vitess" },
];

export const guidesPages: DocPage[] = [
  { path: "/guides/cheat-sheet", title: "Cheat Sheet" },
  { path: "/guides/contributing", title: "Contributing" },
  { path: "/guides/contributing/dolt", title: "dolt" },
  {
    path: "/guides/contributing/go-mysql-server",
    title: "go-mysql-server",
  },
  {
    path: "/guides/binlog-replication",
    title: "MySQL to Dolt Replication",
  },
  { path: "/guides/import", title: "Importing Data" },
  { path: "/guides/dolt-tested-apps", title: "Integrations" },
];

export const otherPages: DocPage[] = [
  { path: "/other/faq", title: "FAQ" },
  { path: "/other/roadmap", title: "Roadmap" },
  { path: "/other/versioning", title: "Versioning" },
];

export const productsPages: DocPage[] = [
  { path: "/products/hosted", title: "Hosted Dolt" },
  { path: "/products/hosted/getting-started", title: "Getting Started" },
  { path: "/products/hosted/notable-features", title: "Notable Features" },
  { path: "/products/hosted/sql-workbench", title: "SQL Workbench" },
  {
    path: "/products/hosted/cloning",
    title: "Cloning a Hosted Database",
  },
  {
    path: "/products/hosted/dolthub-as-remote",
    title: "Using DoltHub as a Remote",
  },
  { path: "/products/hosted/infrastructure", title: "Infrastructure" },
  {
    path: "/products/hosted/private-networking",
    title: "Private Networking",
  },
  { path: "/products/hosted/sso", title: "SSO" },
  { path: "/products/dolthub", title: "DoltHub" },
  { path: "/products/dolthub/data-sharing", title: "Data Sharing" },
  { path: "/products/dolthub/api", title: "API" },
  {
    path: "/products/dolthub/api/authentication",
    title: "Authentication",
  },
  { path: "/products/dolthub/api/sql", title: "SQL" },
  { path: "/products/dolthub/api/csv", title: "CSV" },
  { path: "/products/dolthub/api/databases", title: "Databases" },
  { path: "/products/dolthub/api/branches", title: "Branches" },
  { path: "/products/dolthub/api/pull-requests", title: "Pull Requests" },
  { path: "/products/dolthub/api/releases", title: "Releases" },
  { path: "/products/dolthub/api/tags", title: "Tags" },
  { path: "/products/dolthub/api/uploads", title: "File Uploads" },
  { path: "/products/dolthub/api/jobs", title: "Jobs" },
  { path: "/products/dolthub/api/hooks", title: "Hooks" },
  { path: "/products/dolthub/api/user", title: "User" },
  // Legacy stub kept so old deep links like /api/database#create-pull-request
  // still anchor — page is not in nav.
  { path: "/products/dolthub/api/database", title: "Database (legacy)" },
  {
    path: "/products/dolthub/continuous-integration",
    title: "Continuous Integration",
  },
  {
    path: "/products/dolthub/continuous-integration/getting-started",
    title: "Getting Started",
  },
  {
    path: "/products/dolthub/continuous-integration/reference",
    title: "Workflow Reference",
  },
  {
    path: "/products/dolthub/transform-uploads",
    title: "Transform File Uploads",
  },
  { path: "/products/dolthub/workspaces", title: "Workspaces" },
  { path: "/products/doltlab", title: "DoltLab" },
  { path: "/products/workbench", title: "Dolt Workbench" },
  { path: "/products/doltgres", title: "DoltgreSQL" },
];

export const allDoltPages: DocPage[] = [
  ...introductionPages,
  ...conceptsPages,
  ...sqlReferencePages,
  ...cliReferencePages,
  ...architecturePages,
  ...guidesPages,
  ...otherPages,
  ...productsPages,
];
