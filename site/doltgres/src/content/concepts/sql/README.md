---
title: A Full-featured SQL Database
---

# SQL

Doltgres is a full-featured SQL database, akin to [Postgres](https://www.postgresql.org/) or
[MySQL](https://www.mysql.com/).

Doltgres implements the Postgres SQL dialect. You connect to Doltgres using a Postgres client. The goal
is for Doltgres to be a drop in replacement for Postgres.

Doltgres has [databases](/concepts/sql/databases) and [tables](/concepts/sql/table) as you'd expect. Doltgres
implements most Postgres [data types](/concepts/sql/types). Doltgres supports [secondary
indexes](/concepts/sql/indexes). Doltgres supports [foreign key and check
constraints](/concepts/sql/constraints). Doltgres supports [views](/concepts/sql/views), [triggers](/concepts/sql/triggers),
[functions](/concepts/sql/functions), and [procedures](/concepts/sql/procedures). Doltgres implements [users and
grants](/concepts/sql/users-grants) for permissions.

This section of the documentation will explain Doltgres's flavor of these standard SQL
concepts. Perhaps more importantly, this section will also explain how these concepts interact with
Doltgres's version control features.

Concepts will be tackled in the following order:

1. [Databases](/concepts/sql/databases)
2. [Schema](/concepts/sql/schema)
3. [Tables](/concepts/sql/table)
4. [Primary Keys](/concepts/sql/primary-key)
5. [Types](/concepts/sql/types)
6. [Indexes](/concepts/sql/indexes)
7. [Views](/concepts/sql/views)
8. [Constraints](/concepts/sql/constraints)
9. [Triggers](/concepts/sql/triggers)
10. [Functions](/concepts/sql/functions)
11. [Procedures](/concepts/sql/procedures)
12. [Users/Grants](/concepts/sql/users-grants)
13. [Transactions](/concepts/sql/transaction)
14. [System Variables](/concepts/sql/system-variables)
