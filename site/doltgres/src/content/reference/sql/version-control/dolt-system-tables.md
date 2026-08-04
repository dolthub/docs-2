---
title: Dolt System Tables
---

## Table of contents

- [Dolt Schema](#dolt-schema)

  - [Database Metadata](#database-metadata-system-tables)

    - [dolt.branches](#dolt.branches)
    - [dolt.remote_branches](#dolt.remote_branches)
    - [dolt.docs](#dolt.docs)
    <!-- TODO: Uncomment when procedures implemented - [dolt.procedures](#dolt.procedures) -->
    - [dolt.remotes](#dolt.remotes)
    - [dolt.tags](#dolt.tags)

  - [Database History](#database-history-system-tables)

    - [dolt.commit_ancestors](#dolt.commit_ancestors)
    - [dolt.commits](#dolt.commits)
    - [dolt.log](#dolt.log)

  - [Database Diffs](#database-diffs)

    - [dolt.diff](#dolt.diff)
    - [dolt.column_diff](#dolt.column_diff)

  - [Working Set Metadata](#working-set-metadata-system-tables)

    - [dolt.conflicts](#dolt.conflicts)
    - [dolt.schema_conflicts](#dolt.schema_conflicts)
    - [dolt.merge_status](#dolt.merge_status)
    - [dolt.status](#dolt.status)

  - [Constraint Validation](#constraint-violation-system-tables)

    - [dolt.constraint_violations](#dolt.constraint_violations)

  - [Rebasing](#rebasing-tables)

    - [dolt.rebase](#dolt.rebase)

- [User-defined Schema](#user-defined-schema)

  - [Database Metadata](#database-metadata-system-tables-1)

    - [dolt_schemas](#dolt_schemas)
    - [dolt_statistics](#dolt_statistics)

  - [Database History](#database-history-system-tables-1)

    - [dolt_blame\_$tablename](#dolt_blame_usdtablename)
    - [dolt_history\_$tablename](#dolt_history_usdtablename)

  - [Database Diffs](#database-diffs-1)

    - [dolt_commit_diff\_$tablename](#dolt_commit_diff_usdtablename)
    - [dolt_diff\_$tablename](#dolt_diff_usdtablename)

  - [Working Set Metadata](#working-set-metadata-system-tables-1)

    - [dolt_conflicts\_$tablename](#dolt_conflicts_usdtablename)
    - [dolt_workspace\_$tablename](#dolt_workspace_usdtablename)

  - [Constraint Validation](#constraint-violation-system-tables-1)

    - [dolt_constraint_violations\_$tablename](#dolt_constraint_violations_usdtablename)

  - [Configuration](#configuration-tables)

    - [dolt_ignore](#dolt_ignore)

## Dolt Schema

These are the system tables defined on the `dolt` schema. These refer to version control
information that is not schema or table specific, like branches, logs, etc.

## Database Metadata System Tables

### `dolt.branches`

`dolt.branches` (also usable as `dolt_branches`) contains information about branches known
to the database.

Because the branch information is global to all clients, not just your
session, `dolt.branches` system table is read-only. Branches can be created
or deleted with the [`DOLT_BRANCH()` function](/reference/version-control/dolt-sql-functions#dolt_branch).

#### Schema

```sql
         Field          |   Type   | Null | Key | Default | Extra
------------------------+----------+------+-----+---------+-------
 name                   | text     | NO   | PRI |         |
 hash                   | text     | NO   |     |         |
 latest_committer       | text     | YES  |     |         |
 latest_committer_email | text     | YES  |     |         |
 latest_commit_date     | datetime | YES  |     |         |
 latest_commit_message  | text     | YES  |     |         |
 remote                 | text     | YES  |     |         |
 branch                 | text     | YES  |     |         |
 dirty                  | boolean  | YES  |     |         |
```

#### Example Query

Get all the branches.

```sql
postgres=> SELECT * FROM dolt.branches;
   name    |               hash               | latest_committer | latest_committer_email | latest_commit_date  | latest_commit_message | remote | branch | dirty
-----------+----------------------------------+------------------+------------------------+---------------------+-----------------------+--------+--------+-------
 main      | 83cg0dnk3tav4v04mb4vd8joqrdsvahc | postgres         | postgres@127.0.0.1     | 2024-11-14 00:11:39 | add table             |        |        | false
 newbranch | rj8d14954ldsjp6p78jtnpvnsmtq00ki | postgres         | postgres@127.0.0.1     | 2024-11-14 00:03:34 | CREATE DATABASE       |        |        | false
(2 rows)
```

`remote` and `branch` show the remote host and branch that each branch is tracking.

`dirty` is `TRUE` when there are uncommitted changed on the branch.

To find the current active branch use [`select active_branch()`](/reference/version-control/dolt-sql-functions#active_branch).

```sql
postgres=> select active_branch();
 active_branch
---------------
 main
(1 row)
```

`dolt.branches` only contains information about local branches. For
branches on a remote you have fetched, see
[`dolt.remote_branches`](#doltremote_branches).

### `dolt.remote_branches`

`dolt.remote_branches` (also usable as `dolt_remote_branches`) contains information about branches on remotes
you have fetched. It has a similar schema as `dolt_branches`, but the `remote`, `branch`, and `dirty` columns
don't make sense in this context and are not included. Only remote branches are included in this table.

#### Schema

```sql
         Field          |   Type   | Null | Key | Default | Extra
------------------------+----------+------+-----+---------+-------
 name                   | text     | NO   | PRI |         |
 hash                   | text     | NO   |     |         |
 latest_committer       | text     | YES  |     |         |
 latest_committer_email | text     | YES  |     |         |
 latest_commit_date     | datetime | YES  |     |         |
 latest_commit_message  | text     | YES  |     |         |
```

#### Example Query

Get all local and remote branches in a single query. Remote branches
will have the prefix `remotes/<remoteName>` in their names.

```sql
postgres=> SELECT name, hash, latest_committer, latest_commit_date, latest_commit_message
FROM dolt.branches
UNION
SELECT name, hash, latest_committer, latest_commit_date, latest_commit_message FROM dolt.remote_branches;

   name          |               hash               | latest_committer | latest_commit_date  | latest_commit_message
-----------+----------------------------------+------------------+---------------------+-----------------------
 main            | 83cg0dnk3tav4v04mb4vd8joqrdsvahc | postgres         | 2024-11-14 00:11:39 | add table
 remotes/rem1/b1 | rj8d14954ldsjp6p78jtnpvnsmtq00ki | postgres         | 2024-11-14 00:03:34 | CREATE DATABASE
(2 rows)
```

### `dolt.docs`

`dolt.docs` (also usable as `dolt_docs`) stores the contents of Dolt docs \(`LICENSE.md`,
`README.md`\).

#### Schema

```sql
  Field   | Type | Null | Key | Default | Extra
----------+------+------+-----+---------+-------
 doc_name | text | NO   | PRI |         |
 doc_text | text | NO   |     |         |
```

#### Example Query

```sql
postgres=> INSERT INTO dolt.docs VALUES ('README.md', '# README\nThis is more info about my README.');
INSERT 0 1

postgres> SELECT * FROM dolt.docs;
 doc_name  |                   doc_text
-----------+----------------------------------------------
 README.md | # README\nThis is more info about my README.
(1 row)
```

<!-- TODO: Uncomment when procedures implemented

### `dolt.procedures`

`dolt.procedures` (also usable as `dolt_procedures`) stores each stored procedure that has been created
on the database.

The values in this table are implementation details associated with
the storage of stored procedures. It is recommended to use built-in
SQL statements for examining and modifying stored procedures rather
than using this table directly.

#### Schema

```text
+-------------+----------+
| field       | type     |
+-------------+----------+
| name        | longtext |
| create_stmt | longtext |
| created_at  | datetime |
| modified_at | datetime |
+-------------+----------+
```

When using the standard `CREATE PROCEDURE` workflow, the `name` column
will always be lowercase. Dolt assumes that `name` is always lowercase
as a result, and manually inserting a stored procedure must also have
a lowercase `name`. Otherwise, it will be invisible to some
operations, such as `DROP PROCEDURE`.

#### Example Query

```sql
postgres=> CREATE PROCEDURE simple_proc1(x DOUBLE, y DOUBLE) AS SELECT x*y;
postgres=> CREATE PROCEDURE simple_proc2() AS SELECT name FROM category;

postgres> SELECT * FROM dolt.procedures;
 name         |        create_stmt        |     created_at      |     modified_at
--------------+---------------------------+---------------------+---------------------
 simple_proc1 | SELECT x*y                | 2024-11-14 00:11:39 | 2024-11-14 00:11:39
 simple_proc2 | SELECT name FROM category | 2024-11-14 00:11:40 | 2024-11-14 00:11:40
(2 rows)
``` -->

### `dolt.remotes`

`dolt.remotes` (also usable as `dolt_remotes`) returns the remote subcontents of the `repo_state.json`, similar
to running `dolt remote -v` from the Dolt command line.

The `dolt.remotes` table is currently read only. Use the [`dolt_remote()` function](/reference/version-control/dolt-sql-functions#dolt_remote) to add, update or delete remotes.

#### Schema

```text
+-------------+------+------+-----+---------+-------+
| Field       | Type | Null | Key | Default | Extra |
+-------------+------+------+-----+---------+-------+
| name        | text | NO   | PRI |         |       |
| url         | text | NO   |     |         |       |
| fetch_specs | json | YES  |     |         |       |
| params      | json | YES  |     |         |       |
+-------------+------+------+-----+---------+-------+
```

#### Example Query

```sql
postgres=> SELECT dolt_remote('add', 'origin', 'file:///go/github.com/dolthub/doltgres/rem1');
 dolt_remote
-------------
 {0}
(1 row)

postgres=> SELECT * FROM dolt.remotes WHERE name = 'origin';
  name  |                     url                     |              fetch_specs               | params
--------+---------------------------------------------+----------------------------------------+--------
 origin | file:///go/github.com/dolthub/doltgres/rem1 | ["refs/heads/*:refs/remotes/origin/*"] | {}
(1 row)
```

### `dolt.tags`

`dolt.tags` (also usable as `dolt_tags`) shows information for all active tags in the current database.

[DOLT_TAG()](/reference/version-control/dolt-sql-functions#dolt_tag) function can be used to INSERT and DELETE tags on the `dolt.tags` table.

#### Schema

```text
+----------+----------+------+-----+---------+-------+
| Field    | Type     | Null | Key | Default | Extra |
+----------+----------+------+-----+---------+-------+
| tag_name | text     | NO   | PRI | NULL    |       |
| tag_hash | text     | NO   | PRI | NULL    |       |
| tagger   | text     | NO   |     | NULL    |       |
| email    | text     | NO   |     | NULL    |       |
| date     | datetime | NO   |     | NULL    |       |
| message  | text     | NO   |     | NULL    |       |
+----------+----------+------+-----+---------+-------+
```

#### Example Query

Create a tag using the `dolt_tag()` function.

```sql
postgres=> SELECT DOLT_TAG('_migrationtest', 'head', '-m', 'savepoint for migration testing');
 dolt_tag
----------
 {0}
(1 row)
```

Get all the tags.

```sql
postgres=> SELECT * FROM dolt.tags;
    tag_name    |             tag_hash             | tagger  |       email        |        date         |             message
----------------+----------------------------------+---------+--------------------+---------------------+---------------------------------
 _migrationtest | jqhiu72scmtjlfcb4297f39oj7rmi0nl | tbantle | taylor@dolthub.com | 2024-12-02 20:18:52 | savepoint for migration testing
(1 row)
```

## Database History System Tables

### `dolt.commit_ancestors`

The `dolt.commit_ancestors` (also usable as `dolt_commit_ancestors`) table records the ancestors for every commit in the database. Each commit has one or two
ancestors, two in the case of a merge commit.

#### Schema

Each commit hash has one or two entries in the table, depending on whether it has one or two parent commits. The root
commit of the database has a `NULL` parent. For merge commits, the merge base will have `parent_index` 0, and the commit
merged will have `parent_index` 1.

```text
+--------------+------+------+-----+---------+-------+
| Field        | Type | Null | Key | Default | Extra |
+--------------+------+------+-----+---------+-------+
| commit_hash  | text | NO   | PRI |         |       |
| parent_hash  | text | NO   | PRI |         |       |
| parent_index | int  | NO   | PRI |         |       |
+--------------+------+------+-----+---------+-------+
```

#### Example Query

If we want to get the parent of our most recently created commit, we can use the `dolt.commit_ancestors` system table.

```sql
postgres=> SELECT * FROM dolt.commit_ancestors WHERE commit_hash=HASHOF('HEAD');
           commit_hash            |           parent_hash            | parent_index
----------------------------------+----------------------------------+--------------
 jqhiu72scmtjlfcb4297f39oj7rmi0nl | chs35au558gkso3nfchoprmpm261orfr |            0
(1 row)
```

### `dolt.commits`

The `dolt.commits` (also usable as `dolt_commits`) system table shows _ALL_ commits in a Dolt database.

This is similar, but different from the `dolt.log` [system table](#doltlog)
and the `dolt log` [CLI command](https://dolthub.com/docs/cli-reference/cli#dolt-log).
`dolt.log` shows you commit history for all commit ancestors reachable from the current `HEAD` of the
checked out branch, whereas `dolt.commits` shows all commits from the entire database, no matter which branch is checked out.

#### Schema

```sql
    Field    |   Type   | Null | Key | Default | Extra
-------------+----------+------+-----+---------+-------
 commit_hash | text     | NO   | PRI |         |
 committer   | text     | NO   |     |         |
 email       | text     | NO   |     |         |
 date        | datetime | NO   |     |         |
 message     | text     | NO   |     |         |
```

#### Example Query

We can query for the two commits before December 2nd, 2024, across all commits in the database
(regardless of what is checked out to `HEAD`) with this query:

```sql
postgres=> SELECT * FROM dolt.commits WHERE date < '2024-12-02' ORDER BY date;
           commit_hash            | committer |       email        |        date         |          message
----------------------------------+-----------+--------------------+---------------------+----------------------------
 jqhiu72scmtjlfcb4297f39oj7rmi0nl | postgres  | postgres@127.0.0.1 | 2024-11-27 18:59:01 | CREATE DATABASE
 chs35au558gkso3nfchoprmpm261orfr | tbantle   | taylor@dolthub.com | 2024-11-27 18:59:01 | Initialize data repository
(2 rows)
```

### `dolt.log`

The `dolt.log` (also usable as `dolt_log`) system table contains the commit log for all commits reachable from the current `HEAD`.
This is the same data returned by the [`dolt log` CLI command](https://dolthub.com/docs/cli-reference/cli#dolt-log).

#### Schema

```sql
    Field    |   Type   | Null | Key | Default | Extra
-------------+----------+------+-----+---------+-------
 commit_hash | text     | NO   | PRI |         |
 committer   | text     | NO   |     |         |
 email       | text     | NO   |     |         |
 date        | datetime | NO   |     |         |
 message     | text     | NO   |     |         |
```

#### Example Query

The following query shows the commits reachable from the current checked out head and created by user `postgres` since November 27, 2024, 7:30pm:

```sql
postgres=> SELECT * FROM dolt.log WHERE committer = 'postgres' AND date > '2024-11-27 19:30' ORDER BY date;
           commit_hash            | committer |       email        |        date         |                     message
----------------------------------+-----------+--------------------+---------------------+-------------------------------------------------
 me2evqipttub684bjadg0fr49hr4i9sc | postgres  | postgres@127.0.0.1 | 2024-11-27 19:36:09 | Changes to public.employees from schema_changes
 u7s00b87vg0bhpeleu96dvtkoq34do25 | postgres  | postgres@127.0.0.1 | 2024-11-27 19:38:41 | Merge branch schema_changes
 0nchqhqsp15eo23qnsoiec2vmrsfi494 | postgres  | postgres@127.0.0.1 | 2024-11-27 19:39:21 | Merge branch modifications
(3 rows)
```

## Database Diffs

### `dolt.diff`

The `dolt.diff` (also usable as `dolt_diff`) system table shows which tables in the current database were changed in each commit reachable from the active branch's HEAD. When multiple tables are changed in a single commit, there is one row in the `dolt.diff` system table for each table, all with the same commit hash. Any staged or unstaged changes in the working set are included with the value `WORKING` for their `commit_hash`. After identifying the tables that changed in a commit, the `dolt_diff_$TABLENAME` system tables can be used to determine the data that changed in each table.

#### Schema

The `DOLT.DIFF` system table has the following columns

```sql
     Field     |    Type    | Null | Key | Default | Extra
---------------+------------+------+-----+---------+-------
 commit_hash   | text       | NO   | PRI |         |
 table_name    | text       | NO   | PRI |         |
 committer     | text       | NO   |     |         |
 email         | text       | NO   |     |         |
 date          | datetime   | NO   |     |         |
 message       | text       | NO   |     |         |
 data_change   | boolean    | NO   |     |         |
 schema_change | boolean    | NO   |     |         |
```

#### Query Details

`dolt.diff` displays the changes from the current branch HEAD, including any working set changes. If a commit did not
make any changes to tables _(e.g. an empty commit)_, it is not included in the `dolt.diff` results.

#### Example Query

The following query uses the `dolt.diff` system table to find all commits, and the tables they changed,
between November 28 and December 3, 2024.

```sql
postgres=> SELECT commit_hash, table_name, data_change, schema_change
FROM dolt_diff
WHERE date BETWEEN '2024-11-28' AND '2024-12-03';
           commit_hash            |    table_name    | data_change | schema_change
----------------------------------+------------------+-------------+---------------
 mc4ogkoqlnnlk6j2a9bh7qf842um4n8v | public.employees | f           | t
 j5bfa0bvpgjgkva0mq8eft0nvl4394gn | public.employees | t           | f
(2 rows)
```

From these results, we can see there were two commits to this database in the above time frame. Commit `mc4ogko` was a schema-only change to the `public.employees` table, while `j5b0a0b` was a data-only change to the same table.

To dig deeper into these changes, we can query
the `dolt_diff_$TABLENAME` system tables specific to each of the changed tables, like this:

```sql
postgres=> SELECT count(*) as total_rows_changed
FROM   dolt_diff_employees
WHERE  to_commit='j5b0a0bvpgjgkva0mq8eft0nvl4394gn';
 total_rows_changed
--------------------
                  2
(1 row)
```

### `dolt.column_diff`

The `dolt.column_diff` (also usable as `dolt_column_diff`) system table shows which columns and tables in the current database were changed in each commit
reachable from the active branch's HEAD. When multiple columns are changed in a single commit, there is one row in the
`dolt.column_diff` system table for each column, all with the same commit hash. Any staged changes in the working set
are included with the value `STAGED` for their `commit_hash`. Any unstaged changes in the working set are included with
the value `WORKING` for their `commit_hash`.

#### Schema

The `dolt.column_diff` system table has the following columns:

```sql
    Field    |   Type   | Null | Key | Default | Extra
-------------+----------+------+-----+---------+-------
 commit_hash | text     | NO   | PRI |         |
 table_name  | text     | NO   | PRI |         |
 column_name | text     | NO   | PRI |         |
 committer   | text     | NO   |     |         |
 email       | text     | NO   |     |         |
 date        | datetime | NO   |     |         |
 message     | text     | NO   |     |         |
 diff_type   | text     | NO   |     |         |
```

#### Query Details

`dolt.column_diff` displays the changes from the current branch HEAD, including any working set changes. If a commit did not
make any changes to tables _(e.g. an empty commit)_, it is not included in the `dolt.column_diff` results.

#### Example Query

The following query uses the `dolt.column_diff` system table to find commits and tables where the column `start_date` was updated.

```sql
postgres=> SELECT commit_hash, date
FROM dolt_column_diff where column_name = 'start_date';
           commit_hash            |        date
----------------------------------+---------------------
 j5b0a0bvpgjgkva0mq8eft0nvl4394gn | 2024-12-02 21:36:17
 u7s00b87vg0bhpeleu96dvtkoq34do25 | 2024-11-27 19:38:41
 me2evqipttub684bjadg0fr49hr4i9sc | 2024-11-27 19:36:09
(3 rows)
```

If we narrow in on the `employees` table we can count the number of commits that updated each column
over the course of all our commits.

```sql
postgres=> SELECT column_name, count(commit_hash) as total_column_changes
FROM dolt.column_diff
WHERE table_name = 'public.employees'
GROUP BY column_name;
 column_name | total_column_changes
-------------+----------------------
 end_date    |                    1
 id          |                    5
 last_name   |                    5
 first_name  |                    5
 start_date  |                    3
(5 rows)
```

From these results, we can see that fields describing the employee names are being updated far more
frequently than the fields holding start and end date information.

## Working Set Metadata System Tables

### `dolt.conflicts`

`dolt.conflicts` (also usable as `dolt_conflicts`) is a system table that has a row for every table in the working set that has an unresolved merge
conflict.

#### Schema

```sql
     Field     |  Type   | Null | Key | Default | Extra
---------------+---------+------+-----+---------+-------
 table         | text    | NO   | PRI |         |
 num_conflicts | numeric | NO   |     |         |
```

Query this table when resolving conflicts in a SQL session. For more information on resolving merge conflicts in SQL,
see docs for the [dolt_conflicts\_$TABLENAME](#dolt_conflicts_usdtablename) tables.

### `dolt.schema_conflicts`

`dolt.schema_conflicts` (also usable as `dolt_schema_conflicts`) is a system table that has a row for every table in the working
set that has an unresolved schema conflict.

#### Schema

```sql
    Field     | Type | Null | Key | Default | Extra
--------------+------+------+-----+---------+-------
 table_name   | text | NO   | PRI |         |
 base_schema  | text | NO   |     |         |
 our_schema   | text | NO   |     |         |
 their_schema | text | NO   |     |         |
 description  | text | NO   |     |         |
```

#### Example Query

```sql
postgres=> SELECT table_name, description, base_schema, our_schema, their_schema FROM dolt.schema_conflicts;
 table_name |             description               |          base_schema          |          our_schema           |         their_schema
------------+---------------------------------------+-------------------------------+-------------------------------+-------------------------------
 people     | different column definitions for our  | CREATE TABLE "people" (       | CREATE TABLE "people" (       | CREATE TABLE "people" (
            | column age and their column age       |   "id" integer NOT NULL,      |   "id" integer NOT NULL,      |   "id" integer NOT NULL,
            |                                       |   "last_name" varchar(120),   |   "last_name" varchar(120),   |   "last_name" varchar(120),
            |                                       |   "first_name" varchar(120),  |   "first_name" varchar(120),  |   "first_name" varchar(120),
            |                                       |   "birthday" timestamp,       |   "birthday" timestamp,       |   "birthday" timestamp,
            |                                       |   "age" integer DEFAULT 0,    |   "age" real,                 |   "age" bigint,
            |                                       |   PRIMARY KEY ("id")          |   PRIMARY KEY ("id")          |   PRIMARY KEY ("id")
            |                                       | );                            | );                            | );
(1 row)
```

Query this table when resolving schema conflicts in a SQL session. For more information on
resolving schema conflicts during merge, see the docs on [conflicts](/reference/version-control/merges#conflicts).

### `dolt.merge_status`

The `dolt.merge_status` system table tells a user if a merge is active.

#### Schema

```sql
      Field      |  Type   | Null | Key | Default | Extra
-----------------+---------+------+-----+---------+-------
 is_merging      | boolean | NO   |     |         |
 source          | text    | YES  |     |         |
 source_commit   | text    | YES  |     |         |
 target          | text    | YES  |     |         |
 unmerged_tables | text    | YES  |     |         |
```

#### Example Query

Let's create a simple conflict:

```sql
CREATE TABLE t (a INT PRIMARY KEY, b INT);
SELECT DOLT_COMMIT('-Am', 'base');

SELECT DOLT_CHECKOUT('-b', 'right');
ALTER TABLE t ADD c INT;
INSERT INTO t VALUES (1, 2, 1);
SELECT DOLT_COMMIT('-Am', 'right');

SELECT DOLT_CHECKOUT('main');
INSERT INTO t values (1, 3);
SELECT DOLT_COMMIT('-Am', 'left');

SELECT DOLT_MERGE('right');
```

Output of `SELECT * from dolt.merge_status;`:

```sql
 is_merging |  source   |          source_commit           |     target      | unmerged_tables
------------+-----------+----------------------------------+-----------------+-----------------
 t          | right     | fbghslue1k9cfgbi00ti4r8417frgbca | refs/heads/main | t
(1 row)
```

### `dolt.status`

`dolt.status` (also usable as `dolt_status`) returns the status of the database session, analogous to
running `dolt status` from the Dolt command line.

#### Schema

```sql
   Field    |    Type    | Null | Key | Default | Extra
------------+------------+------+-----+---------+-------
 table_name | text       | NO   | PRI |         |
 staged     | boolean    | NO   | PRI |         |
 status     | text       | NO   | PRI |         |
```

#### Example Query

```sql
postgres=> SELECT * FROM dolt.status;
  table_name   | staged |  status
---------------+--------+-----------
 public.one_pk | f      | new table
(1 row)
```

## Constraint Violation System Tables

### `dolt.constraint_violations`

The `dolt.constraint_violations` (also usable as `dolt_constraint_violations`) system table contains one row for every table that has a constraint violation
introduced by a merge. Dolt enforces constraints (such as foreign keys) during normal SQL operations, but it's possible
that a merge puts one or more tables in a state where constraints no longer hold. For example, a row deleted in the
merge base could be referenced via a foreign key constraint by an added row in the merged commit. Use
`dolt.constraint_violations` to discover such violations.

#### Schema

```sql
     Field      |  Type   | Null | Key | Default | Extra
----------------+---------+------+-----+---------+-------
 table          | text    | NO   | PRI |         |
 num_violations | numeric | NO   |     |         |
```

## Rebasing Tables

### `dolt.rebase`

`dolt.rebase` (also usable as `dolt_rebase`) is only present while an interactive rebase is in progress, and only on the branch where the rebase is being executed. For example, when rebasing the `feature1` branch, the rebase will be executed on the `dolt_rebase_feature1` branch, and the `dolt.rebase` system table will exist on that branch while the rebase is in-progress. The `dolt.rebase` system table starts off with the default rebase plan, which is to `pick` all of the commits identified for the rebase. Users can adjust the rebase plan by updating the `dolt.rebase` table to change the rebase action, reword a commit message, or even add new rows with additional commits to be applied as part of the rebase. For more details about rebasing, see [the `dolt_rebase()` function](/reference/version-control/dolt-sql-functions#dolt_rebase).

#### Schema

```sql
     Field      |    Type    | Null | Key | Default | Extra
----------------+------------+------+-----+---------+-------
 rebase_order   | real       | NO   | PRI |         |
 action         | varchar(6) | NO   |     |         |
 commit_hash    | text       | NO   |     |         |
 commit_message | text       | NO   |     |         |
```

The `action` field can take one of the following rebase actions:

- `pick` - apply a commit as is and keep its commit message.
- `drop` - do not apply a commit. The row in the `dolt.rebase` table can also be deleted to drop a commit from the rebase plan.
- `reword` - apply a commit, and use the updated commit message from the `commit_message` field in the `dolt.rebase` table for its commit message. Note that if you edit the `commit_message` but do not use the `reword` action, the original commit message will still be used.
- `squash` - apply a commit, but include its changes in the previous commit instead of creating a new commit. The commit message of the previous commit will be altered to include the previous commit message as well as the commit message from the squashed commit. Note that the rebase plan MUST include a `pick` or `reword` action in the plan before a `squash` action.
- `fixup` - apply a commit, but include its changes in the previous commit instead of creating a new commit. The commit message of the previous commit will NOT be changed, and the commit message from the fixup commit will be discarded. Note that the rebase plan MUST include a `pick` or `reword` action in the plan before a `fixup` action.

#### Example Query

To squash all commits into a single commit and include the commit messages from all commits, the following query can be used:

```sql
update dolt.rebase set action = 'squash' where rebase_order > 1;
```

To reword a commit with commit hash '123aef456f', be sure to set the action to `reword` and to update the `commit_message` field:

```sql
update dolt.rebase set action = 'reword', commit_message = 'here is my new message' where commit_hash = '123aef456f';
```

To drop the second commit in the rebase plan, you can use the `drop` action:

```sql
update dolt.rebase set action = 'drop' where rebase_order = 2;
```

Or you can simply delete that row from the `dolt.rebase` table:

```sql
delete from dolt.rebase where rebase_order = 2;
```

## User-defined Schema

These are the system tables that are on each user-defined schema. They refer to version control information that is schema or table specific, like table diffs, procedures, views, etc.

## Database Metadata System Tables

### `dolt_schemas`

`dolt_schemas` stores SQL schema fragments for a dolt database that
are versioned alongside the database itself. Certain DDL statements
will modify this table and the value of this table in a SQL session
will affect what database entities exist in the session.

The values in this table are implementation details associated with
the storage of certain schema elements. It is recommended to use
built-in SQL statements for examining and modifying schemas, rather
than using this table directly.

#### Schema

```sql
  Field   | Type | Null | Key | Default | Extra
----------+------+------+-----+---------+-------
 type     | text | NO   | PRI |         |
 name     | text | NO   | PRI |         |
 fragment | text | YES  |     |         |
 extra    | json | YES  |     |         |
 sql_mode | text | YES  |     |         |
```

Currently, `VIEW` definitions are stored in the `dolt_schemas` table, and the `type` column
is always `view`.
The column `name` is the fragment name as supplied in the `CREATE` statement.
The column `fragment` stores the `CREATE` statement of the fragment. The column
`json` is any additional important information such as `CreateAt` field
for the fragment.

The values in this table are partly implementation details associated with the implementation of the underlying database objects.

#### Example Query

<!-- TODO: Add procedures and events once they exist -->

```sql
CREATE VIEW four AS SELECT 2+2;
CREATE TABLE mytable (x INT PRIMARY KEY);
```

Then you can view them in `dolt_schemas`:

```sql
postgres=> select * from public.dolt_schemas;
 type | name |            fragment            |      extra      |                           sql_mode
------+------+--------------------------------+-----------------+---------------------------------------------------------------
 view | four | CREATE VIEW four AS SELECT 2+2 | {"CreatedAt":0} | NO_ENGINE_SUBSTITUTION,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES
(1 row)
```

### `dolt_statistics`

`dolt_statistics` includes currently collected
database statistics. This information is stored outside of the
commit graph and is not subject to versioning semantics.

> **Known limitation:** The `dolt_statistics` table is not yet queryable in Doltgres, although
> `ANALYZE` itself works to collect statistics.

#### Schema

```sql
      Field      |   Type   | Null | Key | Default | Extra
-----------------+----------+------+-----+---------+-------
 database_name   | text     | NO   | PRI |         |
 table_name      | text     | NO   | PRI |         |
 index_name      | text     | NO   | PRI |         |
 row_count       | bigint   | NO   |     |         |
 distinct_count  | bigint   | NO   |     |         |
 null_count      | bigint   | NO   |     |         |
 columns         | text     | NO   |     |         |
 types           | text     | NO   |     |         |
 upper_bound     | text     | NO   |     |         |
 upper_bound_cnt | bigint   | NO   |     |         |
 created_at      | datetime | NO   |     |         |
 mcv1            | text     | NO   |     |         |
 mcv2            | text     | NO   |     |         |
 mcv3            | text     | NO   |     |         |
 mcv4            | text     | NO   |     |         |
 mcvCounts       | text     | NO   |     |         |
```

## Database History System Tables

### `dolt_blame_$tablename`

For every user table that has a primary key, there is a queryable system view named `dolt_blame_$tablename`
which can be queried to see the user and commit responsible for the current value of each row.
This is equivalent to the [`dolt blame` CLI command](https://dolthub.com/docs/cli-reference/cli#dolt-blame).
Tables without primary keys will not have an associated `dolt_blame_$tablename`.

#### Schema

The `dolt_blame_$tablename` system view has the following columns:

```sql
    Field    |   Type    | Null | Key | Default | Extra
-------------+-----------+------+-----+---------+-------
 commit      | text      | YES  |     |         |
 commit_date | timestamp | YES  |     |         |
 committer   | text      | NO   |     |         |
 email       | text      | NO   |     |         |
 message     | text      | NO   |     |         |
[primary key cols]
```

The remaining columns are dependent on the schema of the user table.
Every column from the primary key of your table will be included in the `dolt_blame_$tablename` system table.

#### Query Details

Executing a `SELECT *` query for a `dolt_blame_$tablename` system view will show you the primary key columns
for every row in the underlying user table and the commit metadata for the last commit that modified that row.
Note that if a table has any uncommitted changes in the working set,
those will not be displayed in the `dolt_blame_$tablename` system view.

`dolt_blame_$tablename` is only available for tables with a primary key.
Attempting to query `dolt_blame_$tablename` for a table without a primary key will return an error message.

#### Example Query

Consider the following example table `employees`:

```sql
postgres=> describe employees;
   Field    |   Type    | Null | Key | Default | Extra
------------+-----------+------+-----+---------+-------
 id         | bigint    | NO   | PRI |         |
 last_name  | text      | YES  |     |         |
 first_name | text      | YES  |     |         |
 start_date | timestamp | YES  |     |         |
(4 rows)
```

To find who set the current values, we can query the `dolt_blame_employees` table:

```sql
postgres=> select * from public.dolt_blame_employees limit 5;
   id  |               commit             |     commit_date     | committer  |        email         |  message
-------+----------------------------------+---------------------+-----------------------------------+-------------
 1     | o697ec6a39ocek9bq4vt87o3qd2bu8l0 | 2024-11-14 00:11:39 | postgres   | postgres@127.0.0.1   |  add table
 2     | o697ec6a39ocek9bq4vt87o3qd2bu8l0 | 2024-11-14 00:11:39 | postgres   | postgres@127.0.0.1   |  add table
 3     | o697ec6a39ocek9bq4vt87o3qd2bu8l0 | 2024-11-14 00:11:39 | postgres   | postgres@127.0.0.1   |  add table
 4     | bh4rr16vjkr52s0nr4so1kmv8lh8ut7o | 2024-11-14 00:12:37 | postgres   | postgres@127.0.0.1   |  add row
 5     | bh4rr16vjkr52s0nr4so1kmv8lh8ut7o | 2024-11-14 00:12:37 | postgres   | postgres@127.0.0.1   |  add row
(5 rows)
```

### `dolt_history_$TABLENAME`

For every user table named `$TABLENAME`, there is a read-only system table named `dolt_history_$TABLENAME`
that can be queried to find a row's value at every commit in the current branch's history.

#### Schema

Every Dolt history table contains columns for `commit_hash`, `committer`, and `commit_date`, plus every column
from the user table's schema at the current checked out branch.

```sql
    Field    |   Type    | Null | Key | Default | Extra
-------------+-----------+------+-----+---------+-------
 commit_hash | text      | NO   | MUL |         |
 committer   | text      | NO   |     |         |
 commit_date | timestamp | NO   |     |         |
[other cols]
```

#### Example Schema

Consider a table named `mytable` with the following schema:

```sql
 Field |  Type   | Null | Key | Default | Extra
-------+---------+------+-----+---------+-------
 x     | integer | NO   | PRI |         |
```

The schema for `dolt_history_states` would be:

```sql
    Field    |   Type    | Null | Key | Default | Extra
-------------+-----------+------+-----+---------+-------
 x           | integer   | NO   | PRI |         |
 commit_hash | text      | NO   | MUL |         |
 committer   | text      | NO   |     |         |
 commit_date | timestamp | NO   |     |         |
```

#### Example Query

Assume a database with the `mytable` table above and the following commit graph:

```text
   B---E  feature
  /
 A---C---D  main
```

When the `feature` branch is checked out, the following query returns the results below, showing
the row at every ancestor commit reachable from our current branch.

```sql
postgres=> SELECT * FROM public.dolt_history_mytable;
 x |           commit_hash            | committer |     commit_date
---+----------------------------------+-----------+---------------------
 2 | gqjqr0r24sheugofr95qf2c2i5fgkdgs | postgres  | 2024-12-02 22:58:46
(1 row)
```

## Database Diffs

### `dolt_commit_diff_$TABLENAME`

For every user table named `$TABLENAME`, there is a read-only system table named `dolt_commit_diff_$TABLENAME`
that can be queried to see a diff of the data in the specified table between **any** two commits in the database.
For example, you can use this system table to view the diff between two commits on different branches.
The schema of the returned data from this system table is based on the schema of the underlying user table
at the currently checked out branch.

> **Known limitation:** Queries against `dolt_commit_diff_$TABLENAME` tables do not currently work
> in Doltgres. These tables must be filtered to a single `to_commit` value, and that filtering is
> currently broken. Use the [`dolt_diff()` table
> function](/reference/version-control/dolt-sql-functions#dolt_diff) or the
> [`dolt_diff_$TABLENAME`](#dolt_diff_usdtablename) system table instead.

You must provide `from_commit` and `to_commit` in all queries to this system table in order to specify the
to and from points for the diff of your table data. Each returned row describes how a row in the underlying
user table has changed from the `from_commit` ref to the `to_commit` ref by showing the old and new values.

`dolt_commit_diff_$TABLENAME` is the analogue of the `dolt diff` CLI command.  
It represents the [two-dot diff](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#double_dot)
between the two commits provided.
The `dolt_diff_$TABLENAME` system table also exposes diff information, but instead of a two-way diff,
it returns a log of individual diffs between all adjacent commits in the history of the current branch.
In other words, if a row was changed in 10 separate commits, `dolt_diff_$TABLENAME` will show 10 separate rows –
one for each individual delta. In contrast, `dolt_commit_diff_$TABLENAME` would show a single row that combines
all the individual commit deltas into one diff.

The [`DOLT_DIFF()` table function](/reference/version-control/dolt-sql-functions#dolt_diff) is an alternative to the
`dolt_commit_diff_$tablename` system table for cases where a table's schema has changed between the `to` and `from`
commits. Consider the `DOLT_DIFF()` table function if you need to see the schema from each of those commits,
instead of using the schema from the currently checked out branch.

#### Schema

```sql
      Field       |     Type      | Null | Key | Default | Extra
------------------+---------------+------+-----+---------+-------
 to_commit        | text          | YES  | MUL |         |
 to_commit_date   | timestamp     | YES  |     |         |
 from_commit      | text          | YES  |     |         |
 from_commit_date | timestamp     | YES  |     |         |
 diff_type        | text          | YES  |     |         |
 [other cols]
```

The remaining columns are dependent on the schema of the user table at the currently checked out branch.  
For every column `X` in your table at the currently checked out branch, there are columns in the result set named
`from_X` and `to_X` with the same type as `X` in the current schema.
The `from_commit` and `to_commit` parameters must both be specified in the query, or an error is returned.

#### Example Schema

Consider a simple example with a table that has one column:

```sql
 Field |  Type   | Null | Key | Default | Extra
-------+---------+------+-----+---------+-------
 x     | integer | NO   | PRI |         |
```

Based on the table's schema above, the schema of the `dolt_commit_diff_$TABLENAME` will be:

```sql
      Field       |     Type      | Null | Key | Default | Extra
------------------+---------------+------+-----+---------+-------
 to_x             | integer       | YES  |     |         |
 to_commit        | text          | YES  | MUL |         |
 to_commit_date   | timestamp     | YES  |     |         |
 from_x           | integer       | YES  |     |         |
 from_commit      | text          | YES  |     |         |
 from_commit_date | timestamp     | YES  |     |         |
 diff_type        | text          | YES  |     |         |
```

#### Query Details

Now consider the following branch structure:

```text
      A---B---C feature
     /
D---E---F---G main
```

We can use the above table to represent two types of diffs: a two-point diff and a three-point diff.
In a two-point diff we want to see the difference in rows between Point C and Point G.

```sql
postgres=> SELECT * FROM public.dolt_commit_diff_mytable WHERE to_commit=HASHOF('feature') and from_commit = HASHOF('main');
 to_x |            to_commit             |     to_commit_date      | from_x |           from_commit            |    from_commit_date     | diff_type
------+----------------------------------+-------------------------+--------+----------------------------------+-------------------------+-----------
    2 | gqjqr0r24sheugofr95qf2c2i5fgkdgs | 2024-12-02 22:58:46.441 |        | rlknscedvfjd586u5pj0r5m01ap3dqsk | 2024-12-02 22:57:50.408 | added
(1 row)
```

We can also compute a three-point diff using this table.
In a three-point diff we want to see how our feature branch has diverged
from our common ancestor E, without including the changes from F and G on main.

```sql
postgres=> SELECT * from public.dolt_commit_diff_mytable where to_commit=HASHOF('feature') and from_commit=dolt_merge_base('main', 'feature');
 to_x |            to_commit             |     to_commit_date      | from_x |           from_commit            |    from_commit_date     | diff_type
------+----------------------------------+-------------------------+--------+----------------------------------+-------------------------+-----------
    2 | gqjqr0r24sheugofr95qf2c2i5fgkdgs | 2024-12-02 22:58:46.441 |        | rlknscedvfjd586u5pj0r5m01ap3dqsk | 2024-12-02 22:57:50.408 | added
(1 row)
```

[The `dolt_merge_base` function](/reference/version-control/dolt-sql-functions#dolt_merge_base)
computes the closest ancestor E between `main` and `feature`.

#### Additional Notes

There is one special `to_commit` value `WORKING` which can be used to
see what changes are in the working set that have yet to be committed
to HEAD. It is often useful to use [the `HASHOF()` function](/reference/version-control/dolt-sql-functions#dolt_hashof)
to get the commit hash of a branch, or an ancestor commit. The above table
requires both `from_commit` and `to_commit` to be filled.

### `dolt_diff_$TABLENAME`

For every user table named `$TABLENAME`, there is a read-only system
table named `dolt_diff_$TABLENAME` that returns a list of diffs showing
how rows have changed over time on the current branch.
Each row in the result set represents a row that has changed between two adjacent
commits on the current branch – if a row has been updated in 10 commits, then 10
individual rows are returned, showing each of the 10 individual updates.

Compared to the
[`dolt_commit_diff_$TABLENAME` system table](#dolt_commit_diff_usdtablename),
the `dolt_diff_$TABLENAME` system table focuses on
how a particular row has evolved over time in the current branch's history.
The major differences are that `dolt_commit_diff_$TABLENAME` requires specifying `from_commit` and `to_commit`,
works on any commits in the database (not just the current branch),
and returns a single combined diff for all changes to a row between those two commits. In the example
above where a row is changed 10 times, `dolt_commit_diff_$TABLENAME` would only return a single row
showing the diff, instead of the 10 individual deltas.

#### Schema

Every Dolt diff table will have the columns

```sql
      Field       |     Type      | Null | Key | Default | Extra
------------------+---------------+------+-----+---------+-------
 to_commit        | text          | YES  | MUL |         |
 to_commit_date   | timestamp     | YES  |     |         |
 from_commit      | text          | YES  |     |         |
 from_commit_date | timestamp     | YES  |     |         |
 diff_type        | text          | YES  |     |         |
 [other cols]
```

The remaining columns are dependent on the schema of the user
table at the current branch. For every column `X` in your table at the current branch there will
be columns in the result set named `from_X` and `to_X` with the same type as `X`.

#### Example Schema

For a table named `states` with the following schema:

```sql
   Field    |    Type    | Null | Key | Default | Extra
------------+------------+------+-----+---------+-------
 state      | varchar(2) | NO   | PRI |         |
 population | bigint     | YES  |     |         |
 area       | bigint     | YES  |     |         |
(3 rows)
```

The schema for `dolt_diff_states` would be:

```sql
      Field       |     Type      | Null | Key | Default | Extra
------------------+---------------+------+-----+---------+-------
 to_state         | varchar(2)    | YES  | UNI |         |
 to_population    | bigint        | YES  |     |         |
 to_area          | bigint        | YES  |     |         |
 to_commit        | text          | YES  | UNI |         |
 to_commit_date   | timestamp     | YES  |     |         |
 from_state       | varchar(2)    | YES  |     |         |
 from_population  | bigint        | YES  |     |         |
 from_area        | bigint        | YES  |     |         |
 from_commit      | text          | YES  | UNI |         |
 from_commit_date | timestamp     | YES  |     |         |
 diff_type        | text          | YES  |     |         |
```

#### Query Details

A `SELECT *` query for a diff table will show you every change
that has occurred to each row for every commit in this branch's
history. Using `to_commit` or `from_commit` will limit the data to
specific commits. There is one special `to_commit` value `WORKING`
which can be used to see what changes are in the working set that have
yet to be committed to HEAD. It is often useful to use the
[`HASHOF()`](/reference/version-control/dolt-sql-functions#dolt_hashof)
function to get the commit hash of a branch, or an ancestor
commit. For example, to get the differences between the last commit and its parent
you could use `to_commit=HASHOF('HEAD') and from_commit=HASHOF('HEAD^')`.

For each row the field `diff_type` will be one of the values `added`,
`modified`, or `removed`. You can filter which rows appear in the
result set to one or more of those `diff_type` values in order to
limit which types of changes will be returned.

#### Example Query

The following query will retrieve all commits that modified existing rows in the `employees` table.

```sql
postgres=> select * from public.dolt_diff_employees where diff_type='modified';
 to_id | to_last_name | to_first_name |    to_start_date    |            to_commit             |     to_commit_date      | from_id | from_last_name | from_first_name |   from_start_date   |           from_commit            |    from_commit_date     | diff_type
-------+--------------+---------------+---------------------+----------------------------------+-------------------------+---------+----------------+-----------------+---------------------+----------------------------------+-------------------------+-----------
     0 | Sehn         | Timothy       | 2018-09-08 00:00:00 | 0nchqhqsp15eo23qnsoiec2vmrsfi494 | 2024-11-27 19:39:21.373 |       0 | Sehn           | Timothy         |                     | bfrgi3ju2ntf1h698lpeqfvvrm67o00u | 2024-11-27 19:28:33.921 | modified
     1 | Hendriks     | Brian         | 2018-09-08 00:00:00 | 0nchqhqsp15eo23qnsoiec2vmrsfi494 | 2024-11-27 19:39:21.373 |       1 | Hendriks       | Brian           |                     | bfrgi3ju2ntf1h698lpeqfvvrm67o00u | 2024-11-27 19:28:33.921 | modified
     2 | Son          | Aaron         | 2018-09-08 00:00:00 | 0nchqhqsp15eo23qnsoiec2vmrsfi494 | 2024-11-27 19:39:21.373 |       2 | Son            | Aaron           |                     | bfrgi3ju2ntf1h698lpeqfvvrm67o00u | 2024-11-27 19:28:33.921 | modified
     3 | Fitzgerald   | Brian         | 2021-04-19 00:00:00 | 0nchqhqsp15eo23qnsoiec2vmrsfi494 | 2024-11-27 19:39:21.373 |       3 | Fitzgerald     | Brian           |                     | bfrgi3ju2ntf1h698lpeqfvvrm67o00u | 2024-11-27 19:28:33.921 | modified
     0 | Sehn         | Timothy       |                     | bfrgi3ju2ntf1h698lpeqfvvrm67o00u | 2024-11-27 19:28:33.921 |       0 | Sehn           | Tim             |                     | 4uppauhho8eimk5s6rfiqfguvtu3be26 | 2024-11-27 19:21:41.059 | modified
     0 | Sehn         | Timothy       | 2018-09-08 00:00:00 | 0nchqhqsp15eo23qnsoiec2vmrsfi494 | 2024-11-27 19:39:21.373 |       0 | Sehn           | Tim             | 2018-09-08 00:00:00 | u7s00b87vg0bhpeleu96dvtkoq34do25 | 2024-11-27 19:38:41.548 | modified
(6 rows)
```

## Working Set Metadata System Tables

### `dolt_conflicts_$TABLENAME`

For each table `$TABLENAME` in conflict after a merge, there is a
corresponding system table named `dolt_conflicts_$TABLENAME`. The
schema of each such table contains three columns for each column in
the actual table, representing each row in conflict for each of ours,
theirs, and base values.

Consider a table `mytable` with this schema:

```sql
 Field |  Type   | Null | Key | Default | Extra
-------+---------+------+-----+---------+-------
 x     | integer | NO   | PRI |         |
 y     | integer | YES  |     |         |
```

If we attempt a merge that creates conflicts in this table, I can
examine them with the following query:

```sql
postgres=> select dolt_conflict_id, base_x, base_y, our_x, our_y, their_x, their_y from public.dolt_conflicts_mytable;
    dolt_conflict_id    | base_x | base_y | our_x | our_y | their_x | their_y
------------------------+--------+--------+-------+-------+---------+---------
 hWDLmYufTrm+eVjFSVzPWw |        |        | 3     | 3     | 3       | 1
 gi2p1YbSwu8oUV/WRSpr3Q |        |        | 4     | 4     | 4       | 2
(2 rows)
```

To mark conflicts as resolved, delete them from the corresponding
table. To effectively keep all `our` values, I would simply run:

```sql
postgres=> delete from public.dolt_conflicts_mytable;
```

If I wanted to keep all `their` values, I would first run this statement:

```sql
postgres=> insert into mytable (select their_x, their_y from public.dolt_conflicts_mytable)
           on conflict (x) do update set y = excluded.y;
```

For convenience, you can also modify the `our_` columns of the
`dolt_conflicts_mytable` to update the corresponding row in `mytable`. The above
insert statement can be rewritten as:

```sql
postgres=> update public.dolt_conflicts_mytable set our_x = their_x, our_y = their_y;
```

And of course you can use any combination of `ours`, `theirs` and
`base` rows in these statements.

> **Note**

#### Notes

- Updates made to the `our_` columns are applied to the original table using the
  primary key (or keyless hash). If the row does not exist, it will be inserted.
  Updates made to `our_` columns will never delete a row, however.

- `dolt_conflict_id` is a unique identifier for the conflict. It is particularly
  useful when writing software that needs to resolve conflicts automatically.

- `from_root_ish` is the commit hash of the "from branch" of the merge. This
  hash can be used to identify which merge produced a conflict, since conflicts
  can accumulate across merges.



### `dolt_workspace_$TABLENAME`

This system table shows you which rows have been changed in your workspace and if they are staged.
It is the union of rows changed from HEAD to STAGED, and STAGED to WORKING. Any table listed in
`dolt_status` table will have a non-empty corresponding `dolt_workspace_$TABLENAME` table. Changes
listed are all relative to the HEAD of the current branch.

These tables can be modified in order to update what changes are staged for commit.
[Workspace review](https://www.dolthub.com/blog/2024-08-16-workspace-review/)

#### Schema

The schema of the source table is going to affect the schema of the workspace table. The first
three column are always the same, then the schema of the source table is used to create "to\_" and
"from\_" columns.

Each row in the `dolt_workspace_$TABLENAME` corresponds to a single row update in the table.

```sql
      Field      |   Type    | Null | Key | Default | Extra
-----------------+-----------+------+-----+---------+-------
 id              | bigint    | NO   | PRI |         |
 staged          | boolean   | NO   |     |         |
 diff_type       | text      | NO   |     |         |
 [other cols]
```

The `staged` column will be `true` when the changes are going to be committed on the next
call to [`dolt_commit()`](/reference/version-control/dolt-sql-functions#dolt_commit). Changes which have `staged = false` are present in your
workspace which means all queries in your session contain them but they will not be recorded
in the event that [`dolt_commit()`](/reference/version-control/dolt-sql-functions#dolt_commit) is executed.

There are two ways you can alter the state of your workspace using these tables.

1. The `staged` column can be toggled for any row. If changing from false to true, the row values will be moved
   to staging. If there are already staged changes for that row, they will be overwritten. If changing from true to
   false, the row values will be unstaged. If there are other changes in the workspace for that row, the workspace
   change will be preserved and the staged change will be dropped.
2. Any row which has `staged = false` can be deleted. This will result in reverting the change to the row in the source table.

#### Example Query

```sql
postgres=> SELECT * FROM public.dolt_workspace_mytable WHERE staged=false;
 id | staged | diff_type | to_x | to_y | from_x
----+--------+-----------+------+------+--------
  0 | f      | modified  |    2 |   33 |      2
  1 | f      | added     |    3 |   44 |
  2 | f      | added     |    4 |   33 |
(3 rows)
```

```sql
UPDATE public.dolt_workspace_mytable SET staged = TRUE WHERE to_id = 3;
SELECT dolt_commit('-m', 'Added row id 3 in my table');
```

#### Notes

The `dolt_workspace_$TABLENAME` tables are generated based on the session state when inspected,
so they can not be considered stable on a branch which has multiple editors.

## Constraint Violation System Tables

### `dolt_constraint_violations_$TABLENAME`

For each table `$TABLENAME` with a constraint violation after a merge, there is a corresponding system table named
`dolt_constraint_violations_$TABLENAME`. Each row in the table represents a constraint violation that must be resolved
via `INSERT`, `UPDATE`, or `DELETE` statements. Resolve each constraint violation before committing the result of the
merge that introduced them.

#### Schema

For a hypothetical table `mytable` with the following schema:

```sql
 Field |  Type   | Null | Key | Default | Extra
-------+---------+------+-----+---------+-------
 x     | integer | NO   | PRI |         |
 y     | integer | YES  |     |         |
```

`dolt_constraint_violations_mytable` will have the following schema:

```sql
     Field      |    Type     | Null | Key | Default | Extra
----------------+-------------+------+-----+---------+-------
 from_root_ish  | text        | YES  |     |         |
 violation_type | varchar(16) | NO   | PRI |         |
 x              | integer     | NO   | PRI |         |
 y              | integer     | YES  |     |         |
 violation_info | json        | YES  |     |         |
```

Each row in the table represents a row in the primary table that is in violation of one or more constraint violations.
The `violation_info` field is a JSON payload describing the violation. The `violation_type` field is one of these four strings:
"foreign key", "unique index", "check constraint", or "not null".

As with `dolt_conflicts`, delete rows from the corresponding `dolt_constraint_violations` table to signal to Doltgres that
you have resolved any such violations before committing.

## Configuration Tables

Configuration Tables can be staged and versioned just like user tables. They always exist, even in an empty database.

### `dolt_ignore`

`dolt_ignore` stores a list of "table name patterns", and a boolean flag for each pattern indicating whether tables that match the patterns should not be staged for commit.

This only affects the staging of new tables. Tables that have already been staged or committed are not affected the contents of `dolt_ignore`, and changes to those tables can still be staged.

#### Schema

```sql
  Field  |  Type   | Null | Key | Default | Extra
---------+---------+------+-----+---------+-------
 pattern | text    | NO   | PRI |         |
 ignored | boolean | NO   |     |         |
```

#### Notes

The format of patterns is a simplified version of gitignore’s patterns:

- An asterisk "\*" or ampersand "%" matches any number of characters.
- The character "?" matches any one character.
- All other characters match exactly.

If a table name matches multiple patterns with different values for `ignored`, the most specific pattern is chosen (a pattern A is more specific than a pattern B if all names that match A also match pattern B, but not vice versa.) If no pattern is most specific, then attempting to stage that table will result in an error.

Tables that match patterns in `dolt_ignore` can be force-committed by passing the `--force` flag to `SELECT dolt_add()`.

`dolt_diff` won't display ignored tables unless the additional `--ignored` flag is passed.

#### Example Query

```sql
INSERT INTO public.dolt_ignore VALUES ('generated_*', true), ('generated_exception', false);
CREATE TABLE foo (pk int);
CREATE TABLE generated_foo (pk int);
CREATE TABLE generated_exception (pk int);
SELECT dolt_add('-A');
SELECT * FROM dolt.status WHERE staged=true;
```

```sql
postgres=> SELECT * FROM dolt.status;
         table_name         | staged |  status
----------------------------+--------+-----------
 public.foo                 | t      | new table
 public.generated_exception | t      | new table
```
