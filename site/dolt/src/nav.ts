import type { NavSection } from "../../../shared/components";

const nav: NavSection[] = [
  {
    section: "Introduction",
    items: [
      { title: "What Is Dolt?", href: "/introduction/what-is-dolt" },
      {
        title: "Installation",
        href: "/introduction/installation",
        children: [
          { title: "Linux", href: "/introduction/installation/linux" },
          { title: "Windows", href: "/introduction/installation/windows" },
          { title: "Mac", href: "/introduction/installation/mac" },
          { title: "Build from Source", href: "/introduction/installation/source" },
          { title: "Application Server", href: "/introduction/installation/application-server" },
          { title: "Docker", href: "/introduction/installation/docker" },
          { title: "Upgrading", href: "/introduction/installation/upgrading" },
        ],
      },
      {
        title: "Getting Started",
        href: "/introduction/getting-started",
        children: [
          { title: "Version Controlled Database", href: "/introduction/getting-started/database" },
          { title: "Git For Data", href: "/introduction/getting-started/git-for-data" },
          { title: "Versioned MySQL Replica", href: "/introduction/getting-started/versioned-mysql-replica" },
        ],
      },
      {
        title: "Use Cases",
        href: "/introduction/use-cases",
        children: [
          { title: "Data Sharing", href: "/introduction/use-cases/data-sharing" },
          { title: "Data and Model Quality Control", href: "/introduction/use-cases/data-and-model-quality" },
          { title: "Manual Data Curation", href: "/introduction/use-cases/manual-data-curation" },
          { title: "Version Control for your Application", href: "/introduction/use-cases/vc-your-app" },
          { title: "Versioned MySQL Replica", href: "/introduction/use-cases/versioned-replica" },
          { title: "Audit", href: "/introduction/use-cases/audit" },
          { title: "Configuration Management", href: "/introduction/use-cases/configuration-management" },
          { title: "Offline First", href: "/introduction/use-cases/offline-first" },
        ],
      },
    ],
  },
  {
    section: "Concepts",
    items: [
      {
        title: "Dolt",
        href: "/concepts/dolt",
        children: [
          {
            title: "Git",
            href: "/concepts/dolt/git",
            children: [
              { title: "Commits", href: "/concepts/dolt/git/commits" },
              { title: "Log", href: "/concepts/dolt/git/log" },
              { title: "Diff", href: "/concepts/dolt/git/diff" },
              { title: "Branch", href: "/concepts/dolt/git/branch" },
              { title: "Merge", href: "/concepts/dolt/git/merge" },
              { title: "Conflicts", href: "/concepts/dolt/git/conflicts" },
              { title: "Remotes", href: "/concepts/dolt/git/remotes" },
              { title: "Working Set", href: "/concepts/dolt/git/working-set" },
            ],
          },
          {
            title: "SQL",
            href: "/concepts/dolt/sql",
            children: [
              { title: "Databases", href: "/concepts/dolt/sql/databases" },
              { title: "Schema", href: "/concepts/dolt/sql/schema" },
              { title: "Tables", href: "/concepts/dolt/sql/table" },
              { title: "Primary Keys", href: "/concepts/dolt/sql/primary-key" },
              { title: "Types", href: "/concepts/dolt/sql/types" },
              { title: "Indexes", href: "/concepts/dolt/sql/indexes" },
              { title: "Views", href: "/concepts/dolt/sql/views" },
              { title: "Constraints", href: "/concepts/dolt/sql/constraints" },
              { title: "Triggers", href: "/concepts/dolt/sql/triggers" },
              { title: "Procedures", href: "/concepts/dolt/sql/procedures" },
              { title: "Users/Grants", href: "/concepts/dolt/sql/users-grants" },
              { title: "Transactions", href: "/concepts/dolt/sql/transaction" },
              { title: "System Variables", href: "/concepts/dolt/sql/system-variables" },
            ],
          },
          {
            title: "RDBMS",
            href: "/concepts/dolt/rdbms",
            children: [
              { title: "Server", href: "/concepts/dolt/rdbms/server" },
              { title: "Backups", href: "/concepts/dolt/rdbms/backups" },
              { title: "Replication", href: "/concepts/dolt/rdbms/replication" },
            ],
          },
        ],
      },
      {
        title: "DoltHub/DoltLab",
        href: "/concepts/dolthub",
        children: [
          { title: "Permissions", href: "/concepts/dolthub/permissions" },
          { title: "Pull Requests", href: "/concepts/dolthub/prs" },
          { title: "Issues", href: "/concepts/dolthub/issues" },
          { title: "Forks", href: "/concepts/dolthub/forks" },
        ],
      },
    ],
  },
  {
    section: "SQL Reference",
    items: [
      {
        title: "Running the Server",
        href: "/sql-reference/server",
        children: [
          { title: "Configuration", href: "/sql-reference/server/configuration" },
          { title: "Access Management", href: "/sql-reference/server/access-management" },
          { title: "Branch Permissions", href: "/sql-reference/server/branch-permissions" },
          { title: "Backups", href: "/sql-reference/server/backups" },
          { title: "Garbage Collection", href: "/sql-reference/server/garbage-collection" },
          { title: "Metrics", href: "/sql-reference/server/metrics" },
          { title: "Replication", href: "/sql-reference/server/replication" },
          { title: "Hardware Requirements", href: "/sql-reference/server/hardware-requirements" },
          { title: "Troubleshooting", href: "/sql-reference/server/troubleshooting" },
        ],
      },
      {
        title: "Version Control Features",
        href: "/sql-reference/version-control",
        children: [
          { title: "SQL Extensions Index", href: "/sql-reference/version-control/sql-extensions" },
          { title: "Using Branches", href: "/sql-reference/version-control/branches" },
          { title: "Merges", href: "/sql-reference/version-control/merges" },
          { title: "Querying History", href: "/sql-reference/version-control/querying-history" },
          { title: "Using Remotes", href: "/sql-reference/version-control/remotes" },
          { title: "Authenticating to Remotes", href: "/sql-reference/version-control/remote-authentication" },
          { title: "Procedures", href: "/sql-reference/version-control/dolt-sql-procedures" },
          { title: "Functions", href: "/sql-reference/version-control/dolt-sql-functions" },
          { title: "System Tables", href: "/sql-reference/version-control/dolt-system-tables" },
          { title: "System Variables", href: "/sql-reference/version-control/dolt-sysvars" },
          { title: "Saved Queries", href: "/sql-reference/version-control/saved-queries" },
        ],
      },
      {
        title: "SQL Language Support",
        href: "/sql-reference/sql-support",
        children: [
          { title: "Data Description", href: "/sql-reference/sql-support/data-description" },
          { title: "Expressions, Functions, Operators", href: "/sql-reference/sql-support/expressions-functions-operators" },
          { title: "Supported Statements", href: "/sql-reference/sql-support/supported-statements" },
          { title: "MySQL Information Schema", href: "/sql-reference/sql-support/information-schema" },
          { title: "Collations and Character Sets", href: "/sql-reference/sql-support/collations-and-charsets" },
          { title: "System Variables", href: "/sql-reference/sql-support/system-variables" },
          { title: "SQL Modes", href: "/sql-reference/sql-support/sql-modes" },
          { title: "Miscellaneous", href: "/sql-reference/sql-support/miscellaneous" },
        ],
      },
      {
        title: "Supported Clients",
        href: "/sql-reference/supported-clients",
        children: [
          { title: "Programmatic", href: "/sql-reference/supported-clients/clients" },
          { title: "SQL Editors", href: "/sql-reference/supported-clients/sql-editors" },
        ],
      },
      {
        title: "Benchmarks and Metrics",
        href: "/sql-reference/benchmarks",
        children: [
          { title: "Correctness", href: "/sql-reference/benchmarks/correctness" },
          { title: "Latency", href: "/sql-reference/benchmarks/latency" },
          { title: "Import", href: "/sql-reference/benchmarks/import" },
        ],
      },
    ],
  },
  {
    section: "CLI Reference",
    items: [
      { title: "Commands", href: "/cli-reference/cli" },
      { title: "Git Comparison", href: "/cli-reference/git-comparison" },
    ],
  },
  {
    section: "Architecture",
    items: [
      { title: "Overview", href: "/architecture/architecture" },
      {
        title: "Storage Engine",
        href: "/architecture/storage-engine",
        children: [
          { title: "Commit Graph", href: "/architecture/storage-engine/commit-graph" },
          { title: "Prolly Trees", href: "/architecture/storage-engine/prolly-tree" },
          { title: "Block Store", href: "/architecture/storage-engine/block-store" },
        ],
      },
      {
        title: "SQL",
        href: "/architecture/sql",
        children: [
          { title: "Go MySQL Server", href: "/architecture/sql/go-mysql-server" },
          { title: "Vitess", href: "/architecture/sql/vitess" },
        ],
      },
    ],
  },
  {
    section: "Guides",
    items: [
      { title: "Cheat Sheet", href: "/guides/cheat-sheet" },
      {
        title: "Contributing",
        href: "/guides/contributing",
        children: [
          { title: "dolt", href: "/guides/contributing/dolt" },
          { title: "go-mysql-server", href: "/guides/contributing/go-mysql-server" },
        ],
      },
      { title: "MySQL to Dolt Replication", href: "/guides/binlog-replication" },
      { title: "Importing Data", href: "/guides/import" },
      { title: "Integrations", href: "/guides/dolt-tested-apps" },
    ],
  },
  {
    section: "Other",
    items: [
      { title: "FAQ", href: "/other/faq" },
      { title: "Roadmap", href: "/other/roadmap" },
      { title: "Versioning", href: "/other/versioning" },
    ],
  },
  {
    section: "Products",
    items: [
      {
        title: "Hosted Dolt",
        href: "/products/hosted",
        children: [
          { title: "Getting Started", href: "/products/hosted/getting-started" },
          { title: "Notable Features", href: "/products/hosted/notable-features" },
          { title: "SQL Workbench", href: "/products/hosted/sql-workbench" },
          { title: "Cloning a Hosted Database", href: "/products/hosted/cloning" },
          { title: "Using DoltHub as a Remote", href: "/products/hosted/dolthub-as-remote" },
          { title: "Infrastructure", href: "/products/hosted/infrastructure" },
          { title: "Private Networking", href: "/products/hosted/private-networking" },
          { title: "SSO", href: "/products/hosted/sso" },
          {
            // Only one API version exists, so the sections sit directly under
            // API rather than behind a "v1" node. The paths keep /v1/ so a
            // future v2 can be added without moving any of these URLs.
            title: "API",
            href: "/products/hosted/api",
            children: [
              { title: "Overview", href: "/products/hosted/api/v1" },
              { title: "Authentication", href: "/products/hosted/api/v1/authentication" },
              { title: "User", href: "/products/hosted/api/v1/user" },
              { title: "Deployment", href: "/products/hosted/api/v1/deployment" },
              { title: "Pull Request", href: "/products/hosted/api/v1/pull-request" },
              { title: "Models", href: "/products/hosted/api/v1/models" },
            ],
          },
        ],
      },
      {
        title: "DoltHub",
        href: "/products/dolthub",
        children: [
          { title: "Data Sharing", href: "/products/dolthub/data-sharing" },
          {
            title: "API",
            href: "/products/dolthub/api",
            children: [
              {
                title: "v1alpha1",
                href: "/products/dolthub/api/v1alpha1",
                children: [
                  { title: "Authentication", href: "/products/dolthub/api/v1alpha1/authentication" },
                  { title: "SQL", href: "/products/dolthub/api/v1alpha1/sql" },
                  { title: "User", href: "/products/dolthub/api/v1alpha1/user" },
                  { title: "Databases", href: "/products/dolthub/api/v1alpha1/databases" },
                  { title: "Branches", href: "/products/dolthub/api/v1alpha1/branches" },
                  { title: "Pull Requests", href: "/products/dolthub/api/v1alpha1/pull-requests" },
                  { title: "Releases", href: "/products/dolthub/api/v1alpha1/releases" },
                  { title: "Tags", href: "/products/dolthub/api/v1alpha1/tags" },
                  { title: "File Uploads", href: "/products/dolthub/api/v1alpha1/uploads" },
                  { title: "Jobs", href: "/products/dolthub/api/v1alpha1/jobs" },
                ],
              },
              {
                title: "v2",
                href: "/products/dolthub/api/v2",
                children: [
                  { title: "Authentication", href: "/products/dolthub/api/v2/authentication" },
                  { title: "User", href: "/products/dolthub/api/v2/user" },
                  { title: "Database", href: "/products/dolthub/api/v2/database" },
                  { title: "Operations", href: "/products/dolthub/api/v2/operations" },
                  { title: "Models", href: "/products/dolthub/api/v2/models" },
                  { title: "Migrating from v1alpha1", href: "/products/dolthub/api/v2/migration" },
                ],
              },
              { title: "CSV", href: "/products/dolthub/api/csv" },
              { title: "Webhooks", href: "/products/dolthub/api/hooks" },
            ],
          },
          {
            title: "Continuous Integration",
            href: "/products/dolthub/continuous-integration",
            children: [
              { title: "Getting Started", href: "/products/dolthub/continuous-integration/getting-started" },
              { title: "Workflow Reference", href: "/products/dolthub/continuous-integration/reference" },
            ],
          },
          { title: "Transform File Uploads", href: "/products/dolthub/transform-uploads" },
          { title: "Workspaces", href: "/products/dolthub/workspaces" },
        ],
      },
      { title: "DoltLab", href: "/products/doltlab" },
      { title: "Dolt Workbench", href: "/products/workbench" },
      { title: "DoltgreSQL", href: "/products/doltgres" },
    ],
  },
];

export default nav;
