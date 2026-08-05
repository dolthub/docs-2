---
title: Users/Grants
---


## What are Users and Grants?

Users and grants are SQL's permissions system. A database administrator creates users and grants
them permissions to do certain actions, like read or write to tables.

## How to use Users and Grants

As an administrator user, you create users and roles using `CREATE USER` and `CREATE ROLE`
statements. You grant permissions to users using `GRANT` statements. You can grant privileges to
specific users but this is generally not advised. It is better to grant privileges to roles and then
assign users roles using `GRANT` statements.

## Difference between Postgres Users & Grants and Doltgres Users & Grants

The goal is for Doltgres users and grants to match Postgres users and grants exactly. Doltgres
implements Postgres-style roles, including `CREATE ROLE`, `CREATE USER`, `ALTER`, and `DROP`
statements. `GRANT` and `REVOKE` are supported for privileges on databases, schemas, tables,
sequences, and routines. Some forms are not yet supported, such as grants on specific columns and
cross-database grants. [Submit an issue](https://github.com/dolthub/doltgresql/issues) if you need
more functionality.
