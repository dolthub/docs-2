---
title: What is Doltgres?
---

# What is Doltgres?

DoltgreSQL, or Doltgres for short, is a Postgres-compatible version of [Dolt](https://www.doltdb.com). Dolt is the world's first version controlled SQL database. It is like Git and MySQL had a baby. Doltgres is like Git and Postgres had a baby.

Download the latest DoltgreSQL [here](https://github.com/dolthub/doltgresql/releases/latest).

For instructions on how to install and run DoltgreSQL, checkout our [installation guide](/introduction/installation).

## Differences from Dolt

Dolt and Doltgres share the same [storage engine](https://docs.dolthub.com/architecture/storage-engine) and implement the same version control interfaces in SQL. Only the SQL dialect/implementation is different. Thus, you can refer to the [documentation for the Dolt SQL server](https://docs.dolthub.com/sql-reference/server) to understand how to run and use DoltgreSQL and its features. Just connect with a Postgres-compatible client instead of a MySQL-compatible client.

So, what is different?

### Doltgres is beta

Dolt is 1.0 and production ready. Doltgres is still in very active development and many required features are missing. See [our SQL support documentation for the latest compatibility](/reference/sql-support). If you are a potential user and need something missing, please [create an issue](https://github.com/dolthub/doltgresql/issues).

### Doltgres does not have a CLI

Unlike Dolt, Doltgres does not implement version control features via the command line and must be run as a server.
