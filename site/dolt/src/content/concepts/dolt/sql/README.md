---
title: A Full-featured SQL Database
---

Dolt is a full-featured SQL database, akin to [Postgres](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/).

Dolt implements the MySQL SQL dialect. You connect to Dolt using a MySQL client. The goal is for Dolt to be a drop in replacement for MySQL.

Dolt has [databases](./databases) and [tables](./schema) as you'd expect. Dolt implements all MySQL [data types](./types). Dolt supports [secondary indexes](./indexes). Dolt supports [foreign key and check constraints](./constraints). Dolt supports [views](./views), [triggers](./triggers), and [procedures](./procedures). Dolt implements [users and grants](./users-grants) for permissions.

This section of the documentation will explain Dolt's flavor of these standard SQL concepts. Perhaps more importantly, this section will also explain how these concepts interact with Dolt's version control features.

Concepts will be tackled in the following order:

1. [Databases](./databases)
2. [Schema](./schema)
3. [Tables](./table)
4. [Primary Keys](./primary-key)
5. [Types](./types)
6. [Indexes](./indexes)
7. [Views](./views)
8. [Constraints](./views)
9. [Triggers](./triggers)
10. [Procedures](./procedures)
11. [Users/Grants](./users-grants)
12. [Transactions](./transaction)
13. [System Variables](./system-variables)
