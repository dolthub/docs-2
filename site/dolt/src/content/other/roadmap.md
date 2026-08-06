---
title: Roadmap
description: What's shipped, in progress, and planned.
---

Full details on [supported SQL features](/sql-reference/sql-support/) are available on the docs
site.

This is a selection of unimplemented features we're working on. Don't see what you need on here?
[Let us know!](https://github.com/dolthub/dolt/issues) Paying customers get their feature requests
implemented first.

Roadmap last updated Aug 2026, next update Oct 2026.

# Major releases in 2026

[Dolt 2.0](https://www.dolthub.com/blog/2026-05-11-dolt-2-dot-0/) launched in May. It is the second
major-version release of the database, and represents a new level of performance, features, and
stability for our growing pool of production server customers.

[Doltgres 1.0](https://www.dolthub.com/blog/2026-08-06-doltgres-1-0/) launched in August. Doltgres
is the Postgres-compatible version of Dolt. This launch signals that Doltgres has achieved a level
of compatibility and stability comparable to Dolt's 1.0 release and is ready for production use
cases. Try it and let us know what you think.

# Upcoming features

Work to improve the performance and availability of Dolt and Doltgres is a constant theme and not
called out explicitly unless it's a major separable effort.

## Dolt

| Feature                                                                                  | Estimate    |
|------------------------------------------------------------------------------------------|-------------|
| [User-defined functions](https://github.com/dolthub/dolt/issues/6193)                    | Q4 2026     |
| Update multiple branches in a transaction                                                | Q4 2026     |
| Row-level locking (`SELECT FOR UPDATE`)                                                  | Q4 2026     |
| [Transaction isolation levels](https://github.com/dolthub/dolt/issues/2007)              | Unscheduled |
| [Rebase schema conflict resolution support](https://github.com/dolthub/dolt/issues/7820) | Unscheduled |
| [Multiple DBs in one repo](https://github.com/dolthub/dolt/issues/3043)                  | Unscheduled |
| [Customized merge rules](https://github.com/dolthub/dolt/issues/7680)                    | Unscheduled |
| Images / video types                                                                     | Unscheduled |
| [History compression](https://github.com/dolthub/dolt/issues/5355)                       | Unscheduled |
| [Embedded Dolt](https://github.com/dolthub/dolt/issues/8953)                             | Unscheduled |
| Lock / unlock tables                                                                     | Unscheduled |
| Updateable views                                                                         | Unscheduled |
| Encryption at rest                                                                       | Unscheduled |
| Pipeline query processing                                                                | Unscheduled |

## Doltgres

Dolt and Doltgres share an engine, so most features on the Dolt roadmap also apply to Doltgres.

| Feature                                                          | Estimate |
|------------------------------------------------------------------|----------|
| PostGIS support                                                  | Q4 2026  |
| pgvector support                                                 | Q4 2026  |
| Collation support                                                | 2027     |
| Custom indexing (anything not built in)                          | 2027     |
| Custom aggregate functions                                       | 2027     |
| More built-in function support                                   | Ongoing  |
| Additional DDL statements (e.g. `ALTER SEQUENCE`, `COMMENT ON`)  | Ongoing  |
| Better pg_catalog support                                        | Ongoing  |

# Selection of recent feature launches

| Feature                                                                                                                            | Launch Date |
|------------------------------------------------------------------------------------------------------------------------------------|-------------|
| [dolt_squash_history() procedure](https://www.dolthub.com/blog/2026-07-31-squash-history/)                                         | Jul 2026    |
| [DoltHub API v2](https://www.dolthub.com/blog/2026-07-09-dolthub-api-v2/)                                                          | Jul 2026    |
| [Functional indexes in Doltgres](https://www.dolthub.com/blog/2026-06-01-announcing-functional-index-support-in-doltgres/)         | Jun 2026    |
| [Dolt 2.0](https://www.dolthub.com/blog/2026-05-11-dolt-2-dot-0/)                                                                  | May 2026    |
| [DumboDB, a MongoDB-compatible frontend for Dolt](https://www.dolthub.com/blog/2026-05-07-announcing-dumbodb/)                     | May 2026    |
| [Azure Private Link for Hosted Dolt](https://www.dolthub.com/blog/2026-05-06-azure-private-link-networking/)                       | May 2026    |
| [Doltgres agent mode in Dolt Workbench](https://www.dolthub.com/blog/2026-04-30-doltgres-agent-mode/)                              | Apr 2026    |
| [Functional indexes in Dolt](https://www.dolthub.com/blog/2026-04-29-announcing-functional-indexes-in-dolt/)                       | Apr 2026    |
| [Incremental garbage collection](https://www.dolthub.com/blog/2026-04-28-introducing-incremental-garbage-collection/)              | Apr 2026    |
| [Doltgres support in the Dolt MCP server](https://www.dolthub.com/blog/2026-04-23-doltgres-mcp-server/)                            | Apr 2026    |
| [Hosted Dolt on Azure](https://www.dolthub.com/blog/2026-04-13-hosted-dolt-on-azure/)                                              | Apr 2026    |
| [Revert with conflict resolution](https://www.dolthub.com/blog/2026-04-10-revert-conflict-resolution/)                             | Apr 2026    |
| [DoltLite, a SQLite-compatible version-controlled database](https://www.dolthub.com/blog/2026-03-25-doltlite/)                     | Mar 2026    |
| [SSH remotes](https://www.dolthub.com/blog/2026-03-17-announcing-ssh-remotes/)                                                     | Mar 2026    |
| [Branch permissions in the Hosted Dolt Workbench](https://www.dolthub.com/blog/2026-03-12-hosted-branch-permissions/)              | Mar 2026    |
| [Azure remotes](https://www.dolthub.com/blog/2026-02-24-azure-remotes/)                                                            | Feb 2026    |
| [Doltgres set-returning functions (RETURNS TABLE)](https://www.dolthub.com/blog/2026-02-18-doltgres-returns-table-udf/)            | Feb 2026    |
| [Git remotes as Dolt remotes](https://www.dolthub.com/blog/2026-02-13-announcing-git-remote-support-in-dolt/)                      | Feb 2026    |
| [Commit verification](https://www.dolthub.com/blog/2026-02-12-commit-verification/)                                                | Feb 2026    |
| [Agent mode in Dolt Workbench](https://www.dolthub.com/blog/2026-02-09-introducing-agent-mode/)                                    | Feb 2026    |
| [Edit commits during interactive rebase](https://www.dolthub.com/blog/2026-02-04-sql-rebase-edit/)                                 | Feb 2026    |
| [MCP support for Hosted Dolt](https://www.dolthub.com/blog/2026-02-03-hosted-dolt-mcp/)                                            | Feb 2026    |
| [Prometheus metrics for Hosted Dolt](https://www.dolthub.com/blog/2026-01-21-hosted-dolt-metrics/)                                 | Jan 2026    |
| [Doltgres Docker images](https://www.dolthub.com/blog/2025-12-05-announcing-doltgres-docker-image/)                                | Dec 2025    |
| [DoltLab on Kubernetes](https://www.dolthub.com/blog/2025-12-02-announcing-doltlab-on-kubernetes/)                                 | Dec 2025    |
| [Require client certificates](https://www.dolthub.com/blog/2025-12-01-require-client-cert/)                                        | Dec 2025    |
| [DOLT_JSON_DIFF() for diffing documents](https://www.dolthub.com/blog/2025-11-24-announcing-dolt-json-diff/)                       | Nov 2025    |
| [Mutual TLS authentication](https://www.dolthub.com/blog/2025-11-20-client-cert-auth/)                                             | Nov 2025    |
| [DoltLab on Podman](https://www.dolthub.com/blog/2025-11-05-announcing-doltlab-on-podman/)                                         | Nov 2025    |
| [dolt_branch_activity system table](https://www.dolthub.com/blog/2025-10-27-branch-activity/)                                      | Oct 2025    |
| [AutoGC and archival storage on by default (Dolt 1.75)](https://www.dolthub.com/blog/2025-10-20-dolt-1-75/)                        | Oct 2025    |
| [MariaDB client support](https://www.dolthub.com/blog/2025-10-14-mariadb-client-support/)                                          | Oct 2025    |
| [Faster CLI access to large databases with mmap](https://www.dolthub.com/blog/2025-10-13-faster-large-db-access-with-mmap/)        | Oct 2025    |
| [Non-local tables](https://www.dolthub.com/blog/2025-10-06-nonlocal-tables/)                                                       | Oct 2025    |
