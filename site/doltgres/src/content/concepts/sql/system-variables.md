---
title: System Variables
---

## What is a System Variable?

System variables, called configuration parameters in Postgres, are server-side key-value pairs
that control the server's behavior. You set a variable in your session with
`SET <name> TO <value>`, and you read one with `SHOW <name>` or the `current_setting()`
function. Server-wide defaults come from server configuration.

## How to use System Variables

System variables are most often managed through the SQL shell, although server-startup defaults can
be manually set and persisted between server restarts.

## Difference between Postgres and Doltgres System Variables

Doltgres only supports a subset of Postgres's system variables at the moment. The ones we do
support should have the same lifecycle behavior as Postgres.

We also have Doltgres-specific system variables, which can be found
[here](/reference/version-control/dolt-sysvars). Most dolt specific variables are
prefixed with either `dolt_...` or the database's name (ex: `mydb_...`). These can be read
individually in the Postgres shell with `SHOW <name>` or `SELECT current_setting('<name>')`.

## Interaction with Doltgres Version Control

System variables are maintained outside of version control. Different clones of the same database
can have different system variables.

Some system variables impact transaction, merge, and conflict resolution behavior. For example,
`dolt_force_transaction_commit` both creates a new Doltgres commit for every SQL transaction, and
dismisses merge conflicts in the process of auto-executing these commits.

A full list of Doltgres system variables and descriptions can be found
[here](/reference/version-control/dolt-sysvars).

## Example

### Reading System Variables

```sql
show max_connections;
 max_connections
-----------------
 100
(1 row)
```

### Writing System Variables

```sql
-- some variables are read only
SET max_connections TO 10;
ERROR:  parameter "max_connections" cannot be changed now

-- some variables are "dynamic" at session time
SET TIME ZONE 'PST8PDT';
```

### Show System Variables

Individual system variables can be read with `SHOW <name>`. `SHOW ALL` is not yet supported.
