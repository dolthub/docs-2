---
title: "Overview"
description: What Doltgres is — a Postgres-compatible, version-controlled SQL database.
---

## What is Doltgres?

![](../../../public/images/logo.png)

DoltgreSQL, or Doltgres for short, is the Postgres-compatible version of
[Dolt](https://www.doltdb.com), the world's first version controlled SQL database. Doltgres is like
Git and Postgres had a baby.

To install on your Linux or Mac system, run:

```bash
sudo bash -c 'curl -L https://github.com/dolthub/doltgresql/releases/latest/download/install.sh | bash'
```

Or on Docker:

```bash
$ docker run -e DOLTGRES_PASSWORD=myPassword -p 5432:5432 dolthub/doltgresql:latest
```

For more details on how to run DoltgreSQL, check out our [installation
guide](/introduction/installation).

## Differences from Dolt

Dolt and Doltgres share the same [storage
engine](https://dolthub.com/docs/architecture/storage-engine) and implement the same version control
interfaces in SQL. Only the SQL dialect/implementation is different. Just connect with a
Postgres-compatible client instead of a MySQL-compatible client.

So, what is different?

### Doltgres does not have a CLI

Unlike Dolt, Doltgres does not implement version control features via the command line and must be
run as a server. For example, the Dolt CLI command to pull from a remote:

```bash
% dolt pull
```

Can only be accessed in Doltgres through its corresponding [SQL
function](/reference/version-control/dolt-sql-functions):

```bash
% doltgres &
% PGPASSWORD=password psql -h 127.0.0.1 -U postgres -c "SELECT DOLT_PULL()"
```

Refer to the docs for [version control
features](/reference/version-control/dolt-sql-functions) for details on supported functions
and system tables.

### Doltgres has schemas, sequences, and other Postgres-only features

Postgres has features and syntax that MySQL doesn't, which means Doltgres has features and syntax
that Dolt doesn't. Refer to the rest of the documentation site for more details.
