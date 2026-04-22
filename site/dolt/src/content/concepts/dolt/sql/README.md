---
title: A Full-featured SQL Database
---

# A Full-featured SQL Database

Dolt is a full-featured SQL database, akin to [Postgres](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/).

Dolt implements the MySQL SQL dialect. You connect to Dolt using a MySQL client. The goal is for Dolt to be a drop in replacement for MySQL.

Dolt has [databases](/concepts/dolt/sql/databases) and [tables](/concepts/dolt/sql/schema) as you'd expect. Dolt implements all MySQL [data types](/concepts/dolt/sql/types). Dolt supports [secondary indexes](/concepts/dolt/sql/indexes). Dolt supports [foreign key and check constraints](/concepts/dolt/sql/constraints). Dolt supports [views](/concepts/dolt/sql/views), [triggers](/concepts/dolt/sql/triggers), and [procedures](/concepts/dolt/sql/procedures). Dolt implements [users and grants](/concepts/dolt/sql/users-grants) for permissions.

This section of the documentation will explain Dolt's flavor of these standard SQL concepts. Perhaps more importantly, this section will also explain how these concepts interact with Dolt's version control features.

Concepts will be tackled in the following order:

1. [Databases](/concepts/dolt/sql/databases)
2. [Schema](/concepts/dolt/sql/schema)
3. [Tables](/concepts/dolt/sql/table)
4. [Primary Keys](/concepts/dolt/sql/primary-key)
5. [Types](/concepts/dolt/sql/types)
6. [Indexes](/concepts/dolt/sql/indexes)
7. [Views](/concepts/dolt/sql/views)
8. [Constraints](/concepts/dolt/sql/views)
9. [Triggers](/concepts/dolt/sql/triggers)
10. [Procedures](/concepts/dolt/sql/procedures)
11. [Users/Grants](/concepts/dolt/sql/users-grants)
12. [Transactions](/concepts/dolt/sql/transaction)
13. [System Variables](/concepts/dolt/sql/system-variables)
