---
title: Dolt SQL Functions
---

## Table of Contents

- [Version Control Functions](#version-control-functions)

  - [dolt_add()](#dolt_add)
  - [dolt_backup()](#dolt_backup)
  - [dolt_branch()](#dolt_branch)
  - [dolt_checkout()](#dolt_checkout)
  - [dolt_cherry_pick()](#dolt_cherry_pick)
  - [dolt_clean()](#dolt_clean)
  - [dolt_clone()](#dolt_clone)
  - [dolt_commit()](#dolt_commit)
  - [dolt_conflicts_resolve()](#dolt_conflicts_resolve)
  - [dolt_count_commits()](#dolt_count_commits)
  - [dolt_fetch()](#dolt_fetch)
  - [dolt_gc()](#dolt_gc)
  - [dolt_merge()](#dolt_merge)
  - [dolt_pull()](#dolt_pull)
  - [dolt_purge_dropped_databases()](#dolt_purge_dropped_databases)
  - [dolt_push()](#dolt_push)
  - [dolt_rebase()](#dolt_rebase)
  - [dolt_remote()](#dolt_remote)
  - [dolt_reset()](#dolt_reset)
  - [dolt_revert()](#dolt_revert)
  - [dolt_rm()](#dolt_rm)
  - [dolt_stash()](#dolt_stash)
  - [dolt_tag()](#dolt_tag)
  - [dolt_thread_dump()](#dolt_thread_dump)
  - [dolt_undrop()](#dolt_undrop)
  - [dolt_update_column_tag()](#dolt_update_column_tag)
  - [dolt_verify_constraints()](#dolt_verify_constraints)

- [Informational Functions](#informational-functions)

  - [active_branch()](#active_branch)
  - [dolt_merge_base()](#dolt_merge_base)
  - [dolt_hashof()](#dolt_hashof)
  - [dolt_hashof_table()](#dolt_hashof_table)
  - [dolt_hashof_db()](#dolt_hashof_db)
  - [dolt_version()](#dolt_version)
  - [has_ancestor()](#has_ancestor)

- [Table Functions](#table-functions)

  - [dolt_diff()](#dolt_diff)
  - [dolt_diff_stat()](#dolt_diff_stat)
  - [dolt_diff_summary()](#dolt_diff_summary)
  - [dolt_log()](#dolt_log)
  - [dolt_patch()](#dolt_patch)
  - [dolt_preview_merge_conflicts_summary()](#dolt_preview_merge_conflicts_summary)
  - [dolt_preview_merge_conflicts()](#dolt_preview_merge_conflicts)
  - [dolt_reflog()](#dolt_reflog)
  - [dolt_schema_diff()](#dolt_schema_diff)
  - [dolt_query_diff()](#dolt_query_diff)

## Version Control Functions

Doltgres provides functions for version control features that update the state of the database, such
as creating or deleting branches, making a new commit, etc. Each is named after the Git command that
it imitates. So for example, the following Git command:

```bash
git add .
```

Is modeled as the following SQL statement in Doltgres:

```sql
SELECT DOLT_ADD('.');
```

Version control features that only inspect the state of the database are modeled as [system
tables](/reference/version-control/dolt-system-tables) or [table functions](#table-functions) instead.

The version control operations in this section are functions, and must be invoked with `SELECT`.
Invoking them with `CALL` is not supported and will be rejected with an error:

```sql
SELECT DOLT_ADD('.'); -- returns a status value
CALL DOLT_ADD('.'); -- ERROR: Dolt stored procedure may only be invoked using SELECT
```

### `DOLT_ADD()`

Adds working changes to staged for this session.

After adding tables to the staged area, they can be committed with
`DOLT_COMMIT()`.

```sql
SELECT DOLT_ADD('-A');
SELECT DOLT_ADD('.');
SELECT DOLT_ADD('table1', 'table2');
```

#### Options

`table`: Table\(s\) to add to the list tables staged to be
committed. The abbreviation '.' can be used to add all tables.

`-A`: Stages all tables with changes.

#### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

#### Example

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = 'new value'
WHERE pk = 'key';

-- Stage all changes.
SELECT DOLT_ADD('-A');

-- Commit the changes.
SELECT DOLT_COMMIT('-m', 'committing all changes');
```

### `DOLT_BACKUP()`

Add or remove a configured backup, sync with a configured backup, sync a backup
to a remote URL, restore a remote URL backup as a new database.

To sync the current database to a configured backup:

```sql
SELECT DOLT_BACKUP('sync', 'name');
```

To sync with a remote URL which is not configured as a backup:

```sql
SELECT DOLT_BACKUP('sync-url', 'https://dolthub.com/some_organization/some_dolthub_repository');
```

To add and remove a configured backup:

```sql
SELECT DOLT_BACKUP('add', 'dolthub', 'https://dolthub.com/some_organization/some_dolthub_repository');

SELECT DOLT_BACKUP('remove', 'dolthub');
```

To restore a backup:

```sql
SELECT DOLT_BACKUP('restore', 'https://dolthub.com/some_organization/some_dolthub_repository', 'database_name');
```

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

#### Example

```sql
-- Set the current database for the session
USE mydb;

-- Configure a backup to sync to.
SELECT dolt_backup('add', 'my-backup', 'https://dolthub.com/some_organization/some_dolthub_repository');

-- Upload the current database contents to that named backup
SELECT dolt_backup('sync', 'my-backup');

-- Restore the uploaded database to a new database name
SELECT dolt_backup('restore', 'https://dolthub.com/some_organization/some_dolthub_repository', 'mydb_restored');
```

### `DOLT_BRANCH()`

Create, delete, and rename branches.

To list branches, use the [`DOLT_BRANCHES` system table](dolt-system-tables.md#dolt.branches),
instead of the `DOLT_BRANCH()` function.

To look up the current branch, use the `active_branch()` SQL function, as shown in the
examples section below.

WARNING: In a multi-session server environment, Dolt will prevent you from deleting or renaming a
branch in use in another session. You can force renaming or deletion by passing the `--force`
option, but be aware that active clients on other sessions will no longer be able to execute
statements after their active branch is removed and will need to end their session and reconnect.

```sql
-- Create a new branch from the current HEAD
SELECT DOLT_BRANCH('myNewBranch');

-- Create a new branch from start point of tip of feature1 branch.
SELECT DOLT_BRANCH('myNewBranch', 'feature1');

-- Create a new branch by copying an existing branch
-- Will fail if feature1 branch already exists
SELECT DOLT_BRANCH('-c', 'main', 'feature1');

-- Create or replace a branch by copying an existing branch
-- '-f' forces the copy, even if feature1 branch already exists
SELECT DOLT_BRANCH('-c', '-f', 'main', 'feature1');

-- Delete a branch
SELECT DOLT_BRANCH('-d', 'branchToDelete');

-- Rename a branch
SELECT DOLT_BRANCH('-m', 'currentBranchName', 'newBranchName')
```

> **Note**

### Notes

Branch names have a few restrictions which are similar to the constraints Git puts on branch names. Dolt's branches are a little more restrictive, as [ASCII](https://en.wikipedia.org/wiki/ASCII) characters are required. Rules are as follows:

- All characters must be ASCII (7 Bit)
- May not start with '.' (period)
- May not contain '..' (two periods)
- May not contain '@{'
- May not contain ASCII control characters
- May not contain characters: ':', '?', '\[', '\\', '^', '~', '\*'
- May not contain whitespace (spaces, tabs, newlines)
- May not end with '/'
- May not end with '.lock'
- May not be HEAD (case insensitive)
- May not be indistinguishable from a commit hash. 32 characters, where all characters are 0-9 or a-z (case sensitive)

The `dolt_branch()` function implicitly commits the current transaction and begins a new one.



#### Options

`-c`, `--copy`: Create a copy of a branch. Must be followed by the name of the source branch to copy and the name of the new branch to create. Without the `--force` option, the copy will fail if the new branch already exists.

`-m`, `--move`: Move/rename a branch. Must be followed by the current name of an existing branch and a new name for that branch. Without the `--force` option, renaming a branch in use on another server session will fail. Be aware that forcibly renaming or deleting a branch in use in another session will require that session to disconnect and reconnect before it can execute statements again.

`-d`, `--delete`: Delete a branch. Must be followed by the name of an existing branch to delete. Without the `--force` option, deleting a branch in use on another server session will fail. Be aware that forcibly renaming or deleting a branch in use in another session will require that session to disconnect and reconnect before it can execute statements again.

`-f`, `--force`: When used with the `--copy` option, allows for recreating a branch from another branch, even if the branch already exists. When used with the `--move` or `--delete` options, force will allow you to rename or delete branches in use in other active server sessions, but be aware that this will require those other sessions to disconnect and reconnect before they can execute statements again.

`-D`: Shortcut for `--delete --force`.

#### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

#### Examples

```sql
-- List the available branches
SELECT * FROM DOLT_BRANCHES;
+--------+----------------------------------+
| name   | hash                             |
+--------+----------------------------------+
| backup | nsqtc86d54kafkuf0a24s4hqircvg68g |
| main   | dvtsgnlg7n9squriob3nq6kve6gnhkf2 |
+--------+----------------------------------+

-- Create a new branch for development work from the tip of head and switch to it
SELECT DOLT_BRANCH('myNewFeature');
SELECT DOLT_CHECKOUT('myNewFeature');

-- View your current branch
select active_branch();
+----------------+
| active_branch  |
+----------------+
| myNewFeature   |
+----------------+

-- Create a new branch from an existing branch
SELECT DOLT_BRANCH('-c', 'backup', 'bugfix-3482');

-- Rename a branch
SELECT DOLT_BRANCH('-m', 'bugfix-3482', 'critical-bugfix-3482');

-- Delete a branch
SELECT DOLT_BRANCH('-d', 'old-unused-branch');
```

### `DOLT_CHECKOUT()`

Switches this session to a different branch.

With table names as arguments, restores those tables to their contents
in the current HEAD.

Note, unlike the Git command-line, if you have a modified working set, those changes remain on the
branch you modified after a `DOLT_CHECKOUT()`. Uncommitted changes in the working set do not
transfer to the checked out branch as on the command line. We modified this behavior in the SQL
context because multiple users may be connected to the same branch. Having one user bring changes
from various other branches with them when they switch branches is too disruptive in the
multi-tenant SQL context.

```sql
SELECT DOLT_CHECKOUT('-b', 'my-new-branch');
SELECT DOLT_CHECKOUT('my-existing-branch');
SELECT DOLT_CHECKOUT('my-table');
```

> **Note**

### Notes

`DOLT_CHECKOUT()` with a branch argument has two side effects on your session state:

1. The session's current database, as returned by `SELECT current_database()`, is now the unqualified
   database name.
2. For the remainder of this session, references to the unqualified name of this database will
   resolve to the branch checked out.

See the comments after the statements below for an example of this behavior, and also read [Using
Branches](/reference/version-control/branches)



```sql
use mydb/branch1; -- current db is now `mydb/branch1`
insert into t1 values (1); -- modifying the `branch1` branch
select dolt_checkout('branch2'); -- current db is now `mydb`
insert into t1 values (2); -- modifying the `branch2` branch
use mydb/branch3; -- current db is now `mydb/branch3`
insert into mydb.t1 values (3); -- modifying the `branch2` branch
```

#### Options

`-b`: Create a new branch with the given name and switch to it.

`-B`: Similar to `-b`, but will move a branch if it already exists.

`-t`: When creating a new branch, set up 'upstream' configuration.

#### Output Schema

```text
+---------+------+-----------------------------+
| Field   | Type | Description                 |
+---------+------+-----------------------------+
| status  | int  | 0 if successful, 1 if not   |
| message | text | success/failure information |
+---------+------+-----------------------------+
```

#### Example

```sql
-- Set the current database for the session
USE mydb;

-- Create and checkout to a new branch.
SELECT DOLT_CHECKOUT('-b', 'feature-branch');

-- Make modifications
UPDATE table
SET column = 'new value'
WHERE pk = 'key';

-- Stage and commit all  changes.
SELECT DOLT_COMMIT('-a', '-m', 'committing all changes');

-- Go back to main
SELECT DOLT_CHECKOUT('main');
```

### `DOLT_CHERRY_PICK()`

Apply the changes introduced by an existing commit.

Apply changes from existing commit and creates a new commit from the current HEAD.

```sql
SELECT DOLT_CHERRY_PICK('my-existing-branch~2');
SELECT DOLT_CHERRY_PICK('qj6ouhjvtrnp1rgbvajaohmthoru2772');
```

#### Options

No options for this function.

#### Output Schema

```text
+-----------------------+------+---------------------------------+
| Field                 | Type | Description                     |
+-----------------------+------+---------------------------------+
| hash                  | text | hash of the applied commit      |
| data_conflicts        | int  | number of data conflicts        |
| schema_conflicts      | int  | number of schema conflicts      |
| constraint_violations | int  | number of constraint violations |
+-----------------------+------+---------------------------------+
```

#### Example

For the below example consider the following set up of `main` and `mybranch` branches:

```sql
-- Checkout main branch
SELECT DOLT_CHECKOUT('main');

-- View a log of commits
SELECT commit_hash, message FROM dolt_log;
+----------------------------------+----------------------------+
| commit_hash                      | message                    |
+----------------------------------+----------------------------+
| 7e2q0hibo2m2af874i4e7isgnum74j4m | create a new table         |
| omuqq67att6vfnka94drdallu4983gnr | Initialize data repository |
+----------------------------------+----------------------------+
(2 rows)

-- View the table
SELECT * FROM mytable;
(0 rows)

-- Checkout new branch
SELECT DOLT_CHECKOUT('mybranch');

-- View a log of commits
SELECT commit_hash, message FROM dolt_log;
+----------------------------------+----------------------------+
| commit_hash                      | message                    |
+----------------------------------+----------------------------+
| 577isdjbq1951k2q4dqhli06jlauo51p | add 3, 4, 5 to the table   |
| k318tpmqn4l97ofpaerato9c3m70lc14 | add 1, 2 to the table      |
| 7e2q0hibo2m2af874i4e7isgnum74j4m | create a new table         |
| omuqq67att6vfnka94drdallu4983gnr | Initialize data repository |
+----------------------------------+----------------------------+
(4 rows)

-- View the table
SELECT * FROM mytable;
+---+
| a |
+---+
| 1 |
| 2 |
| 3 |
| 4 |
| 5 |
+---+
(5 rows)
```

We want to cherry-pick only the change introduced in commit hash
`'k318tpmqn4l97ofpaerato9c3m70lc14'`, which inserts `1` and `2` to the table. Specifying
`'mybranch~1'` instead of the commit hash also works.

```sql
-- Checkout main branch
SELECT DOLT_CHECKOUT('main');

-- Cherry-pick the commit
SELECT DOLT_CHERRY_PICK('k318tpmqn4l97ofpaerato9c3m70lc14');
+----------------------------------+
| hash                             |
+----------------------------------+
| mh518gdgbsut8m705b7b5rie9neq9uaj |
+----------------------------------+
(1 row)

mydb> SELECT * FROM mytable;
+---+
| a |
+---+
| 1 |
| 2 |
+---+
(2 rows)

mydb> SELECT commit_hash, message FROM dolt_log;
+----------------------------------+----------------------------+
| commit_hash                      | message                    |
+----------------------------------+----------------------------+
| mh518gdgbsut8m705b7b5rie9neq9uaj | add 1, 2 to the table      |
| 7e2q0hibo2m2af874i4e7isgnum74j4m | create a new table         |
| omuqq67att6vfnka94drdallu4983gnr | Initialize data repository |
+----------------------------------+----------------------------+
(3 rows)
```

### `DOLT_CLEAN()`

Deletes untracked tables in the working set.

Deletes only specified untracked tables if table names are passed as arguments.

With `--dry-run` flag, tests whether removing untracked tables will
return with zero status.

```sql
SELECT DOLT_CLEAN();
SELECT DOLT_CLEAN('untracked-table');
SELECT DOLT_CLEAN('--dry-run');
```

#### Options

`--dry-run`: Test removing untracked tables from working set.

#### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

#### Example

```sql
-- Create three new tables
create table tracked (x int primary key);
create table committed (x int primary key);
create table untracked (x int primary key);

-- Commit the first table
select dolt_add('committed');
select dolt_commit('-m', 'commit a table');
+----------------------------------+
| hash                             |
+----------------------------------+
| n7gle7jv6aqf72stbdicees6iduhuoo9 |
+----------------------------------+

-- Track the second table
select dolt_add('tracked');

-- Observe database status
select * from dolt_status;
+-------------------+--------+-----------+
| table_name        | staged | status    |
+-------------------+--------+-----------+
| public.tracked    | t      | new table |
| public.untracked  | f      | new table |
+-------------------+--------+-----------+

-- Clear untracked tables
select dolt_clean('untracked');

-- Observe final status
select * from dolt_status;
+-----------------+--------+-----------+
| table_name      | staged | status    |
+-----------------+--------+-----------+
| public.tracked  | t      | new table |
+-----------------+--------+-----------+

-- Committed and tracked tables are preserved
select tablename from pg_tables;
+----------------+
| tablename      |
+----------------+
| committed      |
| tracked        |
+----------------+
```

### `DOLT_CLONE()`

Clones an existing Dolt database into a new database within the current Dolt environment. The
existing database must be specified as an argument, either as a file URL that points to an existing
Dolt database on disk, or a `doltremote` URL for remote hosted database (e.g. a database hosted in
an S3 bucket). An additional argument can optionally be supplied to specify the name of the new,
cloned database, otherwise the current name of the existing database will be used.

NOTE: When cloning from a file URL, you must currently include the `.dolt/noms` subdirectories. For
more details see the GitHub tracking issue,
[dolt#1860](https://github.com/dolthub/dolt/issues/1860).

```sql
SELECT DOLT_CLONE('file:///myDatabasesDir/database/.dolt/noms');
```

#### Options

`--remote`: Name of the remote to be added to the new, cloned database. The default is 'origin'.

`-b`, `--branch`: The branch to be cloned. If not specified all branches will be cloned.

`--depth`: Clone a single branch and limit history to the given commit depth.

#### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

#### Examples

```sql
-- Clone the us-jails database from a local remote
SELECT DOLT_CLONE('file:///myDatabasesDir/us-jails/.dolt/noms');
-- Use the new, cloned database
-- NOTE: quotes are required for database names with hyphens
USE "us-jails";
select tablename from pg_tables;
+-----------------------------+
| tablename                   |
+-----------------------------+
| incidents                   |
| inmate_population_snapshots |
| jails                       |
+-----------------------------+
```

### `DOLT_COMMIT()`

Commits staged tables to HEAD.

`DOLT_COMMIT()` also implicitly commits the current transaction.

```sql
SELECT DOLT_COMMIT('-a', '-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

#### Options

`-m`, `--message`: Use the given `<msg>` as the commit message. **Required**

`-a`, `--all`: Stages all modified tables (but not newly created tables) before committing.

`-A`, `--ALL`: Stages all tables (including new tables) before committing.

`--allow-empty`: Allow recording a commit that has the exact same data
as its sole parent. This is usually a mistake, so it is disabled by
default. This option bypasses that safety.

`--skip-empty`: Record a commit only if there are changes to be committed. The commit operation will be a no-op, instead of an error, if there are no changes staged to commit. An error will be thrown if `--skip-empty` is used with `--allow-empty`.

`--date`: Specify the date used in the commit. If not specified the
current system time is used.

`--author`: Specify an explicit author using the standard "A U Thor
author@example.com" format.

`--amend`: Overwrite the commit message for the current HEAD, rather than creating a new commit.

#### Output Schema

```text
+-------+------+----------------------------+
| Field | Type | Description                |
+-------+------+----------------------------+
| hash  | text | hash of the commit created |
+-------+------+----------------------------+
```

#### Examples

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = 'new value'
WHERE pk = 'key';

-- Stage all changes and commit.
SELECT DOLT_COMMIT('-a', '-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

### `DOLT_CONFLICTS_RESOLVE()`

When a merge finds conflicting changes, it documents them in the dolt_conflicts table.
A conflict is between two versions: ours (the rows at the destination branch head) and theirs
(the rows at the source branch head).
`dolt conflicts resolve` will automatically resolve the conflicts by taking either
the ours or theirs versions for each row.

```sql
SELECT DOLT_CONFLICTS_RESOLVE('--ours', <table>);
SELECT DOLT_CONFLICTS_RESOLVE('--theirs', <table>);
```

#### Options

`<table>`: List of tables to be resolved. '.' can be used to resolve all tables.

`--ours`: For all conflicts, take the version from our branch and resolve the conflict.

`--theirs`: For all conflicts, take the version from their branch and resolve the conflict.

#### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

#### Examples

```sql
-- Set the current database for the session
USE mydb;

-- Attempt merge
SELECT DOLT_MERGE('feature-branch');

-- Check for conflicts
SELECT * FROM dolt_conflicts;

-- Resolve conflicts for tables t1 and t2 with rows from our branch.
SELECT DOLT_CONFLICTS_RESOLVE('--ours', 't1', 't2');
```

### `DOLT_COUNT_COMMITS()`

Counts how many commits one ref is ahead of and behind another, relative to
their nearest common ancestor. This is a read-only operation.

```sql
SELECT DOLT_COUNT_COMMITS('--from', 'feature', '--to', 'main');
```

#### Options

`--from`, `-f`: The ref to count from. **Required.**

`--to`, `-t`: The ref to count to. **Required.**

#### Output Schema

```text
+--------+--------+--------------------------------+
| Field  | Type   | Description                    |
+--------+--------+--------------------------------+
| ahead  | bigint | commits in `from` not in `to`  |
| behind | bigint | commits in `to` not in `from`  |
+--------+--------+--------------------------------+
```

#### Example

```sql
-- How far has the feature branch diverged from main?
SELECT DOLT_COUNT_COMMITS('--from', 'feature', '--to', 'main');
```

### `DOLT_FETCH()`

Fetch refs, along with the objects necessary to complete their histories
and update remote-tracking branches.

```sql
SELECT DOLT_FETCH('origin', 'main');
SELECT DOLT_FETCH('origin', 'feature-branch');
SELECT DOLT_FETCH('origin', 'refs/heads/main:refs/remotes/origin/main');
SELECT DOLT_FETCH('origin', NULL);
SELECT DOLT_FETCH('origin');
```

#### Options

No options for this function.

#### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

#### Example

```sql
-- Get remote main
SELECT DOLT_FETCH('origin', 'main');

-- Inspect the hash of the fetched remote branch
SELECT HASHOF('origin/main');

-- Merge remote main with current branch
SELECT DOLT_MERGE('origin/main');
```

### Notes

Dropping the second argument, or passing NULL, will result is using the default refspec.

### `DOLT_GC()`

Cleans up unreferenced data from the database to reclaim disk space.

```sql
SELECT DOLT_GC();
SELECT DOLT_GC('--shallow');
```

#### Options

`--shallow` Performs a faster but less thorough garbage collection.

#### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### `DOLT_MERGE()`

Incorporates changes from the named commits \(since the time their
histories diverged from the current branch\) into the current
branch.

Any resulting merge conflicts must be resolved before the transaction
can be committed or a new Dolt commit created. `DOLT_MERGE()` creates
a new commit for any successful merge with auto-generated commit
message if not defined.

```sql
SELECT DOLT_MERGE('feature-branch'); -- Optional --squash parameter
SELECT DOLT_MERGE('feature-branch', '--no-ff', '-m', 'This is a msg for a non fast forward merge');
SELECT DOLT_MERGE('--abort');
```

> **Note**

### Notes

- The `dolt_merge()` function implicitly commits the current transaction and begins a new one.



#### Options

`--no-ff`: Create a merge commit even when the merge resolves as a fast-forward.

`--squash`: Merges changes to the working set without updating the
commit history

`-m <msg>, --message=<msg>`: Use the given as the commit message. This
is only useful for --non-ff commits.

`--abort`: Abort the current conflict resolution process, and try to
reconstruct the pre-merge state.

`--author`: Specify an explicit author using the standard `A U Thor
<author@example.com>` format.

When merging a branch, your session state must be clean. `COMMIT`
or`ROLLBACK` any changes, then `DOLT_COMMIT()` to create a new dolt
commit on the target branch.

If the merge causes conflicts or constraint violations, you must
resolve them using the `dolt_conflicts` system tables before the
transaction can be committed. See [Dolt system
tables](/reference/version-control/dolt-system-tables#dolt_conflicts_usdtablename) for
details.

#### Output Schema

```text
+--------------+------+--------------------------------------+
| Field        | Type | Description                          |
+--------------+------+--------------------------------------+
| hash         | text | hash of the merge commit             |
| fast_forward | int  | whether the merge was a fast forward |
| conflicts    | int  | number of conflicts created          |
| message      | text | optional informational message       |
+--------------+------+--------------------------------------+
```

#### Example

```sql
-- Set the current database for the session
USE mydb;

-- Create and checkout to a new branch.
SELECT DOLT_CHECKOUT('-b', 'feature-branch');

-- Make modifications
UPDATE table
SET column = 'new value'
WHERE pk = 'key';

-- Stage and commit all  changes.
SELECT DOLT_COMMIT('-a', '-m', 'committing all changes');

-- Go back to main
SELECT DOLT_CHECKOUT('main');

-- Merge the feature branch into main
SELECT DOLT_MERGE('feature-branch', '--author', 'John Doe <johndoe@example.com>');
```

### `DOLT_PULL()`

Fetch from and integrate with another database or a local branch. In
its default mode, `dolt pull` is shorthand for `dolt fetch` followed by
`dolt merge <remote>/<branch>`.

Any resulting merge conflicts must be resolved before the transaction
can be committed or a new Dolt commit created.

```sql
SELECT DOLT_PULL('origin');
SELECT DOLT_PULL('origin', 'some-branch');
SELECT DOLT_PULL('feature-branch', '--force');
```

#### Options

`--no-ff`: Create a merge commit even when the merge resolves as a fast-forward.

`--squash`: Merges changes to the working set without updating the
commit history

`--force`: Ignores any foreign key warnings and proceeds with the commit.

When merging a branch, your session state must be clean. `COMMIT`
or`ROLLBACK` any changes, then `DOLT_COMMIT()` to create a new Dolt
commit on the target branch.

If the merge causes conflicts or constraint violations, you must
resolve them using the `dolt_conflicts` system tables before the
transaction can be committed. See [Dolt system
tables](dolt-system-tables.md#dolt_conflicts_usdtablename) for
details.

#### Output Schema

```text
+--------------+------+-------------------------------------+
| Field        | Type | Description                         |
+--------------+------+-------------------------------------+
| fast_forward | int  | whether the pull was a fast forward |
| conflicts    | int  | number of conflicts created         |
| message      | text | optional informational message      |
+--------------+------+-------------------------------------+
```

#### Example

```sql
-- Update local working set with remote changes
-- Note: this requires upstream tracking information to be set in order for
--       Dolt to know what remote branch to merge
SELECT DOLT_PULL('origin');

-- Update local working set with remote changes from an explicit branch
SELECT DOLT_PULL('origin', 'some-branch');

-- View a log of new commits
SELECT * FROM dolt_log LIMIT 5;
```

### `DOLT_PURGE_DROPPED_DATABASES()`

Permanently deletes any dropped databases that are being held in a temporary holding area. When a
Doltgres database is dropped, it is moved to a temporary holding area where the [`dolt_undrop()`
function](#dolt_undrop) can restore it. The `dolt_purge_dropped_databases()` function clears this
holding area and permanently deletes any data from those databases. This action is not reversible,
so callers should be cautious about using it. The main benefit of using this function is to reclaim
disk space used by the temporary holding area. Because this is a destructive operation, callers must
have a `SUPERUSER` role in order to execute it.

#### Example

```sql
-- Create a database and populate a table in the working set
CREATE DATABASE database1;
use database1;
create table t(pk int primary key);

-- Dropping the database will move it to a temporary holding area
DROP DATABASE database1;

-- At this point, the database can be restored by calling dolt_undrop('database1'), but
-- instead, we permanently delete it by calling dolt_purge_dropped_databases().
SELECT dolt_purge_dropped_databases();
```

### `DOLT_PUSH()`

Updates remote refs using local refs, while sending objects necessary to
complete the given refs.

```sql
SELECT DOLT_PUSH('origin', 'main');
SELECT DOLT_PUSH('--force', 'origin', 'main');
```

#### Options

`--force`: Update the remote with local history, overwriting any conflicting history in the remote.

#### Output Schema

```text
+---------+------+--------------------------------+
| Field   | Type | Description                    |
+---------+------+--------------------------------+
| status  | int  | 0 if successful, 1 if not      |
| message | text | optional informational message |
+---------+------+--------------------------------+
```

#### Example

```sql
-- Checkout new branch
SELECT DOLT_CHECKOUT('-b', 'feature-branch');

-- Add a table
CREATE TABLE test (a int primary key);

-- Create commit
SELECT DOLT_COMMIT('-a', '-m', 'create table test');

-- Push to remote
SELECT DOLT_PUSH('origin', 'feature-branch');
```

### `DOLT_REBASE()`

Rewrites commit history for the current branch by replaying commits, allowing the commits to be
reordered, squashed, or dropped. The commits included in the rebase plan are the commits reachable
by the current branch, but NOT reachable from the branch specified as the argument when starting a
rebase (also known as the upstream branch). This is the same as Git and Dolt's ["two dot log"
syntax](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log/#two-dot-log), or
|upstreamBranch|..|currentBranch|.

For example, consider the commit graph below, where a `feature` branch has branched off of a `main` branch, and both branches have added commits:

```sql
A → B → C → D → E → F  main
         ↘
           G → H → I  feature
```

If we rebase from the `feature` branch using the `main` branch as our upstream, the default rebase plan will include commits `G`, `H`, and `I`, since those commits are reachable from our current branch, but NOT reachable from the upstream branch. By default, the changes from those same commits will be reapplied, in the same order, to the tip of the upstream branch `main`. The resulting commit graph will then look like:

```sql
A → B → C → D → E → F  main
                     ↘
                       G' → H' → I'  feature
```

Rebasing is useful to clean and organize your commit history, especially before merging a feature branch back to a shared branch. For example, you can drop commits that contain debugging or test changes, or squash or fixup small commits into a single commit, or reorder commits so that related changes are adjacent in the new commit history.

```sql
SELECT DOLT_REBASE('--interactive', 'main');
SELECT DOLT_REBASE('-i', 'main');
SELECT DOLT_REBASE('--continue');
SELECT DOLT_REBASE('--abort');
```

### Limitations

Currently only interactive rebases are supported, and there is no support for resolving conflicts that arise while executing a rebase plan. If applying a commit creates a conflict, the rebase will be automatically aborted.

#### Options

`--interactive` or `-i`: Start an interactive rebase. Currently only interactive rebases are supported, so this option is required.

`--continue`: Continue an interactive rebase after adjusting the rebase plan stored in `dolt_rebase`.

`--abort`: Abort a rebase in progress.

#### Output Schema

```text
+---------+------+-----------------------------+
| Field   | Type | Description                 |
+---------+------+-----------------------------+
| status  | int  | 0 if successful, 1 if not   |
| message | text | success/failure information |
+---------+------+-----------------------------+
```

#### Example

```sql
-- create a simple table
create table t (pk int primary key);
select dolt_commit('-Am', 'creating table t');

-- create a new branch that we'll add more commits to later
select dolt_branch('branch1');

-- create another commit on the main branch, right after where branch1 branched off
insert into t values (0);
select dolt_commit('-am', 'inserting row 0');

-- switch to branch1 and create three more commits that each insert one row
select dolt_checkout('branch1');
insert into t values (1);
select dolt_commit('-am', 'inserting row 1');
insert into t values (2);
select dolt_commit('-am', 'inserting row 2');
insert into t values (3);
select dolt_commit('-am', 'inserting row 3');

-- check out what our commit history on branch1 looks like before we rebase
select commit_hash, message from dolt_log;
           commit_hash            |          message
----------------------------------+----------------------------
 m2v3oajs9jesvvc44ihqlsu1uq2c8jf2 | inserting row 3
 qa1t5ieqs418s1b7mssqlmpn68ackq20 | inserting row 2
 tgltn67jjho1mp8a3jdl3jkip08jbbun | inserting row 1
 nof0lk6ufv031mddiahqfqfelqcpjdv5 | creating table t
 pfjaqljdrdn43877sbc2d2sla9g3eb8u | CREATE DATABASE
 k23mej9jdej41s0n7o2g8gp5rpgvrfdb | Initialize data repository
(6 rows)

-- start an interactive rebase and check out the default rebase plan; this will rebase
-- all the new commits on this branch and move them to the tip of the main branch
select dolt_rebase('-i', 'main');
select * from dolt_rebase order by rebase_order;
 rebase_order | action |           commit_hash            | commit_message
--------------+--------+----------------------------------+-----------------
         1.00 | pick   | tgltn67jjho1mp8a3jdl3jkip08jbbun | inserting row 1
         2.00 | pick   | qa1t5ieqs418s1b7mssqlmpn68ackq20 | inserting row 2
         3.00 | pick   | m2v3oajs9jesvvc44ihqlsu1uq2c8jf2 | inserting row 3
(3 rows)

-- adjust the rebase plan to reword the first commit, drop the commit that inserted row 2,
-- and combine the third commit into the previous commit
update dolt_rebase set action='reword', commit_message='insert rows' where rebase_order=1;
update dolt_rebase set action='drop' where rebase_order=2;
update dolt_rebase set action='fixup' where rebase_order=3;

-- continue rebasing now that we've adjusted the rebase plan
select dolt_rebase('--continue');

-- check out the history
select commit_hash, message from dolt_log;
           commit_hash            |          message
----------------------------------+----------------------------
 8jc1dpj25fv6f2kn3bd47uokc8hs1vp0 | insert rows
 gd5rnrmjvbf0fb6sb8dfaf5a344t68ei | inserting row 0
 nof0lk6ufv031mddiahqfqfelqcpjdv5 | creating table t
 pfjaqljdrdn43877sbc2d2sla9g3eb8u | CREATE DATABASE
 k23mej9jdej41s0n7o2g8gp5rpgvrfdb | Initialize data repository
(5 rows)
```

### `DOLT_REMOTE()`

Adds a remote for a database at given url, or removes an existing remote with its remote-tracking
branches and configuration settings. To list existing remotes, use the [`dolt_remotes` system
table](/reference/version-control/dolt-system-tables#dolt.remotes).

```sql
SELECT DOLT_REMOTE('add','remote_name','remote_url');
SELECT DOLT_REMOTE('remove','existing_remote_name');
```

#### Output Schema

```text
+-----------------------+------+----------------------------------------------------------+
| Field                 | Type | Description                                              |
+-----------------------+------+----------------------------------------------------------+
| hash                  | text | hash of the last revert commit created                   |
| data_conflicts        | int  | number of data conflicts                                 |
| schema_conflicts      | int  | number of schema conflicts                               |
| constraint_violations | int  | number of constraint violations                          |
+-----------------------+------+----------------------------------------------------------+
```

#### Example

```sql
-- Add a HTTP remote
SELECT DOLT_REMOTE('add','origin','https://doltremoteapi.dolthub.com/Dolthub/museum-collections');

-- Add a HTTP remote with shorthand notation for the URL
SELECT DOLT_REMOTE('add','origin1','Dolthub/museum-collections');

-- Add a filesystem based remote
SELECT DOLT_REMOTE('add','origin2','file:///Users/jennifer/datasets/museum-collections');

-- List remotes to check.
SELECT * FROM dolt_remotes;
+---------+--------------------------------------------------------------+-----------------------------------------+--------+
| name    | url                                                          | fetch_specs                             | params |
+---------+--------------------------------------------------------------+-----------------------------------------+--------+
| origin  | https://doltremoteapi.dolthub.com/Dolthub/museum-collections | ["refs/heads/*:refs/remotes/origin/*"]  | {}     |
| origin1 | https://doltremoteapi.dolthub.com/Dolthub/museum-collections | ["refs/heads/*:refs/remotes/origin1/*"] | {}     |
| origin2 | file:///Users/jennifer/datasets/museum-collections           | ["refs/heads/*:refs/remotes/origin2/*"] | {}     |
+---------+--------------------------------------------------------------+-----------------------------------------+--------+

-- Remove a remote
SELECT DOLT_REMOTE('remove','origin1');

-- List remotes to check.
SELECT * FROM dolt_remotes;
+---------+--------------------------------------------------------------+-----------------------------------------+--------+
| name    | url                                                          | fetch_specs                             | params |
+---------+--------------------------------------------------------------+-----------------------------------------+--------+
| origin  | https://doltremoteapi.dolthub.com/Dolthub/museum-collections | ["refs/heads/*:refs/remotes/origin/*"]  | {}     |
| origin2 | file:///Users/jennifer/datasets/museum-collections           | ["refs/heads/*:refs/remotes/origin2/*"] | {}     |
+---------+--------------------------------------------------------------+-----------------------------------------+--------+
```

### `DOLT_RESET()`

With no arguments, resets staged tables to their HEAD state. Can also be used to reset a database to
a specific commit.

Like other data modifications, after a reset you must `COMMIT` the
transaction for any changes to affected tables to be visible to other
clients.

```sql
SELECT DOLT_RESET('--hard', 'featureBranch');
SELECT DOLT_RESET('--hard', 'commitHash123abc');
SELECT DOLT_RESET('myTable'); -- soft reset
```

> **Note**

### Notes

- With the `--hard` option, the `dolt_reset()` function implicitly commits the current transaction
  and begins a new one.



#### Options

`--hard`: Resets the working tables and staged tables. Any changes to
tracked tables in the working tree since <commit> are discarded.

`--soft`: Does not touch the working tables, but removes all tables
staged to be committed. This is the default behavior.

#### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

#### Example

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = 'new value'
WHERE pk = 'key';

-- Reset the changes permanently.
SELECT DOLT_RESET('--hard');

-- Makes some more changes.
UPDATE table
SET column = 'new value'
WHERE pk = 'key';

-- Stage the table.
SELECT DOLT_ADD('table')

-- Unstage the table.
SELECT DOLT_RESET('table')
```

### `DOLT_REVERT()`

Reverts the changes introduced in a commit, or set of commits. Creates a new commit from the current HEAD that reverses
the changes in all the specified commits. If multiple commits are given, they are applied in the order given.

```sql
SELECT DOLT_REVERT('gtfv1qhr5le61njimcbses9oom0de41e');
SELECT DOLT_REVERT('HEAD~2');
SELECT DOLT_REVERT('HEAD', '--author=reverter@rev.ert');
```

#### Options

`--author=<author>`: Specify an explicit author using the standard `A U Thor <author@example.com>` format.

#### Output Schema

```text
+-----------------------+------+--------------------------------------+
| Field                 | Type | Description                          |
+-----------------------+------+--------------------------------------+
| hash                  | text | hash of the created revert commit    |
| data_conflicts        | int  | number of data conflicts             |
| schema_conflicts      | int  | number of schema conflicts           |
| constraint_violations | int  | number of constraint violations      |
+-----------------------+------+--------------------------------------+
```

#### Example

```sql
-- Create a table and add data in multiple commits
CREATE TABLE t1(pk INT PRIMARY KEY, c VARCHAR(255));
SELECT dolt_add('t1')
SELECT dolt_commit('-m', 'Creating table t1');
INSERT INTO t1 VALUES(1, 'a'), (2, 'b'), (3, 'c');
SELECT dolt_commit('-am', 'Adding some data');
insert into t1 VALUES(10, 'aa'), (20, 'bb'), (30, 'cc');
SELECT dolt_commit('-am', 'Adding some more data');

-- Examine the changes made in the commit immediately before the current HEAD commit
SELECT to_pk, to_c, to_commit, diff_type FROM dolt_diff_t1 WHERE to_commit=hashof('HEAD~1');
+-------+------+----------------------------------+-----------+
| to_pk | to_c | to_commit                        | diff_type |
+-------+------+----------------------------------+-----------+
| 1     | a    | fc4fks6jutcnee9ka6458nmuot7rl1r2 | added     |
| 2     | b    | fc4fks6jutcnee9ka6458nmuot7rl1r2 | added     |
| 3     | c    | fc4fks6jutcnee9ka6458nmuot7rl1r2 | added     |
+-------+------+----------------------------------+-----------+

-- Revert the commit immediately before the current HEAD commit
SELECT dolt_revert('HEAD~1');

-- Check out the new commit created by dolt_revert
SELECT commit_hash, message FROM dolt_log limit 1;
+----------------------------------+---------------------------+
| commit_hash                      | message                   |
+----------------------------------+---------------------------+
| vbevrdghj3in3napcgdsch0mq7f8en4v | Revert "Adding some data" |
+----------------------------------+---------------------------+

-- View the exact changes made by the revert commit
SELECT from_pk, from_c, to_commit, diff_type FROM dolt_diff_t1 WHERE to_commit=hashof('HEAD');
+---------+--------+----------------------------------+-----------+
| from_pk | from_c | to_commit                        | diff_type |
+---------+--------+----------------------------------+-----------+
| 1       | a      | vbevrdghj3in3napcgdsch0mq7f8en4v | removed   |
| 2       | b      | vbevrdghj3in3napcgdsch0mq7f8en4v | removed   |
| 3       | c      | vbevrdghj3in3napcgdsch0mq7f8en4v | removed   |
+---------+--------+----------------------------------+-----------+
```

### `DOLT_RM()`

Removes tables from the staging area and working directory. With the
`--cached` flag, removes tables only from the staging area while leaving
the working directory unchanged.

```sql
SELECT DOLT_RM('table1');
SELECT DOLT_RM('table1', 'table2', 'table3');
SELECT DOLT_RM('--cached', 'table1');
```

#### Options

`--cached`: Unstage and remove tables only from the staging area. Working
tree tables, whether modified or not, are left alone.

#### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

#### Example

```sql
-- Create and stage a table
CREATE TABLE t1 (id INT PRIMARY KEY, name VARCHAR(50));
SELECT DOLT_ADD('t1');

-- Remove it from the staging area only, keeping the working copy
SELECT DOLT_RM('--cached', 't1');

-- Remove it completely (staging area and working directory)
SELECT DOLT_RM('t1');
```

### `DOLT_STASH()`

Manages temporary saves of uncommitted changes. Changes can be saved,
restored, or removed without affecting the commit history. The function
requires a `push` subcommand — it cannot be called without arguments to
stash away changes.

#### Push (save changes)

```sql
SELECT DOLT_STASH('push', 'stash_name');
SELECT DOLT_STASH('push', 'stash_name', '--include-untracked');
SELECT DOLT_STASH('push', 'stash_name', '--all');
```

Saves the current working directory and staged changes to a named stash. By
default only changes to already-tracked tables are stashed.

- `--include-untracked`, `-u`: Include untracked tables in the stash.
- `--all`, `-a`: Include all changes (tracked, untracked, and ignored tables).

#### Pop (restore and remove)

```sql
SELECT DOLT_STASH('pop', 'stash_name');
SELECT DOLT_STASH('pop', 'stash_name', 'stash@{0}');
```

Applies the changes from the specified stash to the working directory and
removes the stash. If conflicts occur, the operation is aborted.

#### Drop

```sql
SELECT DOLT_STASH('drop', 'stash_name');
SELECT DOLT_STASH('drop', 'stash_name', 'stash@{0}');
```

Removes the specified stash without applying its changes. If no stash id is
given, removes the most recent stash for the given name.

#### Clear

```sql
SELECT DOLT_STASH('clear', 'stash_name');
```

Removes all stashes for the specified stash name.

### `DOLT_TAG()`

Creates a new tag that points at specified commit ref, or deletes an existing tag. To list existing
tags, use [`dolt.tags` system table](/reference/version-control/dolt-system-tables#dolt.tags).

```sql
SELECT DOLT_TAG('tag_name', 'commit_ref');
SELECT DOLT_TAG('-m', 'message', 'tag_name', 'commit_ref');
SELECT DOLT_TAG('-m', 'message', '--author', 'John Doe <johndoe@example.com>', 'tag_name', 'commit_ref');
SELECT DOLT_TAG('-d', 'tag_name');
```

#### Options

`-m`: Use the given message as the tag message.

`-d`: Delete a tag.

`--author`: Specify an explicit author using the standard "A U Thor
author@example.com" format.

#### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

#### Example

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = 'new value'
WHERE pk = 'key';

-- Stage and commit all changes.
SELECT DOLT_COMMIT('-am', 'committing all changes');

-- Create a tag for the HEAD commit.
SELECT DOLT_TAG('v1','head','-m','creating v1 tag');
```

### `DOLT_THREAD_DUMP()`

Returns a dump of all goroutines running in the Doltgres server process, for
debugging hangs or performance issues. This is an admin-only, read-only
operation and takes no arguments.

```sql
SELECT DOLT_THREAD_DUMP();
```

#### Output Schema

```text
+-------------+------+-------------------------------------+
| Field       | Type | Description                         |
+-------------+------+-------------------------------------+
| thread_dump | text | the server's current goroutine dump |
+-------------+------+-------------------------------------+
```

### `DOLT_UNDROP()`

Restores a dropped database. See the [`dolt_purge_dropped_databases()`
function](#dolt_purge_dropped_databases) for info on how to permanently remove dropped databases.

```sql
SELECT DOLT_UNDROP(<database_name>);
```

#### Options

`dolt_undrop()` takes a single argument – the name of the dropped database to restore. When called
without any arguments, `dolt_undrop()` returns an error message that contains a list of all dropped
databases that are available to be restored.

#### Example

```sql
-- Create a database and populate a table in the working set
CREATE DATABASE database1;
use database1;
create table t(pk int primary key);

-- Dropping the database will move it to a temporary holding area
DROP DATABASE database1;

-- calling dolt_undrop() with no arguments will return an error message that
-- lists the dropped database that are available to be restored
SELECT dolt_undrop();

-- Use dolt_undrop() to restore it
SELECT dolt_undrop('database1');
SELECT * FROM database1.t;
```

### `DOLT_UPDATE_COLUMN_TAG()`

Updates a column's internal identifier. Most users will never need to know
about column tags, but [there are rare cases where a column tag collision can
occur during a merge](https://www.dolthub.com/blog/2025-05-15-column-tags/),
where it can be useful to manually update a column's tag. This is an advanced
operation — use with caution and reach out to the Dolt team on
[Discord](https://discord.gg/gqr7K4VNKe) or
[GitHub](https://github.com/dolthub/doltgresql/issues/new) for guidance.

The function updates the tag in the working set, so you must call
[`dolt_commit()`](#dolt_commit) afterward to commit the change. Tag changes
do not show up in working-set status or diffs, so commit them immediately to
avoid a confusing dirty working set with no visible diff.

#### Arguments

`<table>`: The table containing the column to update.

`<column>`: The name of the column to update.

`<tag>`: An integer value to set as the column's new tag.

#### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

#### Example

```sql
SELECT DOLT_UPDATE_COLUMN_TAG('myTable', 'col1', 42);
SELECT DOLT_COMMIT('-am', 'updating myTable.col1 tag');
```

### `DOLT_VERIFY_CONSTRAINTS()`

Verifies that working set changes (inserts, updates, and/or deletes) satisfy the
defined table constraints. If any constraints are violated they are written to the
[DOLT_CONSTRAINT_VIOLATIONS](/reference/version-control/dolt-system-tables#dolt.constraint_violations) table.

`DOLT_VERIFY_CONSTRAINTS` by default does not detect constraints for row changes
that have been previously committed. The `--all` option can be specified if you
wish to validate all rows in the database. Doltgres always enforces constraints for
SQL statements, but operations such as merges can introduce constraint violations,
which are recorded for later verification. If violating rows have been committed in
prior commits, you may want to use the `--all` option to ensure that the current
state is consistent and no violated constraints are missed.

#### Arguments and Options

`<table>`: The table(s) to check constraints on. If omitted, checks all tables.

`-a`, `--all`:
Verifies constraints against every row.

`-o`, `--output-only`:
Disables writing results to the
[DOLT_CONSTRAINT_VIOLATIONS](/reference/version-control/dolt-system-tables#dolt.constraint_violations)
system table.

#### Output Schema

```text
+------------+------+-----------------------------------------+
| Field      | Type | Description                             |
+------------+------+-----------------------------------------+
| violations | int  | 1 if violations were found, otherwise 0 |
+------------+------+-----------------------------------------+
```

#### Example

For the below examples consider the following schema:

```sql
CREATE TABLE parent (
  pk int PRIMARY KEY
);

CREATE TABLE child (
  pk int PRIMARY KEY,
  parent_fk int,
  FOREIGN KEY (parent_fk) REFERENCES parent(pk)
);
```

A simple case:

```sql
-- enable dolt_force_transaction_commit so that we can inspect the
-- violation in our working set
SET dolt_force_transaction_commit TO ON;

-- Doltgres always enforces foreign key checks for SQL statements, so set up
-- two branches whose merge violates child's foreign key constraint
INSERT INTO parent VALUES (1);
SELECT DOLT_COMMIT('-Am', 'setup');

SELECT DOLT_CHECKOUT('-b', 'branch_to_merge');
INSERT INTO child VALUES (1, 1);
SELECT DOLT_COMMIT('-Am', 'add a child of parent 1');

SELECT DOLT_CHECKOUT('main');
DELETE FROM parent WHERE pk = 1;
SELECT DOLT_COMMIT('-Am', 'delete parent 1');

-- The merge introduces a foreign key constraint violation
SELECT DOLT_MERGE('branch_to_merge');

SELECT DOLT_VERIFY_CONSTRAINTS();
/*
+------------+
| violations |
+------------+
| 1          |
+------------+
*/

SELECT * from dolt_constraint_violations;
/*
+-------+----------------+
| table | num_violations |
+-------+----------------+
| child | 1              |
+-------+----------------+
*/

SELECT violation_type, pk, parent_fk from dolt_constraint_violations_child;
/*
+----------------+----+-----------+
| violation_type | pk | parent_fk |
+----------------+----+-----------+
| foreign key    | 1  | -1        |
+----------------+----+-----------+
*/
```

Using `--all` to verify all rows:

```sql
-- Continuing from the example above, clear the recorded violations, then
-- force-commit the merged working set, which still contains violating rows
DELETE FROM dolt_constraint_violations_child;
SELECT DOLT_COMMIT('-a', '-f', '-m', 'commit rows that violate constraints');

SELECT DOLT_VERIFY_CONSTRAINTS();
/*
No violations are returned since there are no changes in the working set.

+------------+
| violations |
+------------+
| 0          |
+------------+
*/

SELECT * from dolt_constraint_violations_child;
/*
+----------------+----+-----------+----------------+
| violation_type | pk | parent_fk | violation_info |
+----------------+----+-----------+----------------+
+----------------+----+-----------+----------------+
*/

SELECT DOLT_VERIFY_CONSTRAINTS('--all');
/*
When all rows are considered, constraint violations are found.

+------------+
| violations |
+------------+
| 1          |
+------------+
*/

SELECT * from dolt_constraint_violations_child;
/*
+----------------+----+-----------+
| violation_type | pk | parent_fk |
+----------------+----+-----------+
| foreign key    | 1  | -1        |
+----------------+----+-----------+
*/
```

Checking specific tables only:

```sql
-- Continuing from the example above, the violating row is still present in the
-- child table. Clear the recorded violations, then verify each table
-- individually by naming it as an argument.
DELETE FROM dolt_constraint_violations_child;

SELECT DOLT_VERIFY_CONSTRAINTS('--all', 'parent');
/*
+------------+
| violations |
+------------+
| 0          |
+------------+
*/

SELECT DOLT_VERIFY_CONSTRAINTS('--all', 'child');
/*
+------------+
| violations |
+------------+
| 1          |
+------------+
*/

SELECT * from dolt_constraint_violations_child;
/*
+----------------+----+-----------+
| violation_type | pk | parent_fk |
+----------------+----+-----------+
| foreign key    | 1  | -1        |
+----------------+----+-----------+
*/
```

## Informational Functions

### `ACTIVE_BRANCH()`

The `ACTIVE_BRANCH()` function returns the name of the currently
active branch for this session.

[https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=select+active_branch%28%29%3B](https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=select+active_branch%28%29%3B)

### `DOLT_MERGE_BASE()`

`DOLT_MERGE_BASE()` returns the hash of the common ancestor between
two branches.

Consider the following branch structure:

```text
      A---B---C feature
     /
D---E---F---G main
```

The following would return the hash of commit `E`:

[https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=SELECT+DOLT_MERGE_BASE%28%27feature%27%2C+%27main%27%29%3B](https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=SELECT+DOLT_MERGE_BASE%28%27feature%27%2C+%27main%27%29%3B)

### `DOLT_HASHOF()`

The `DOLT_HASHOF()` function returns the commit hash of a branch or other commit spec.

[https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=select+dolt_hashof%28%27main%27%29%3B](https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=select+dolt_hashof%28%27main%27%29%3B)

### `DOLT_HASHOF_TABLE()`

The `DOLT_HASHOF_TABLE()` function returns the value hash of a table. The hash is the hash of all the rows in the table,
and is dependent on their serialization format. As such a table could have the same rows, but different hashes if the
serialization format has changed, however if a table hash has not changed, then it's guaranteed that the table's data has
not changed.

This function can be used to watch for changes in data by storing previous hashes in your application and comparing them
to the current hash. For example, you can use this function to get the hash of a table named `color` like so:

```sql
SELECT dolt_hashof_table('color');
+----------------------------------+
| dolt_hashof_table('color')       |
+----------------------------------+
| q8t28sb3h5g2lnhiojacpi7s09p4csjv |
+----------------------------------+
```

### `DOLT_HASHOF_DB()`

The `DOLT_HASHOF_DB()` function returns the value hash of the entire versioned database. The hash is the hash of all tables
(schema and data) in the database, and includes additional versioned items such as stored procedures and triggers. The hash
does not include unversioned items such as tables which have been [ignored](/reference/version-control/dolt-system-tables#dolt_ignore). The function
takes an optional argument to specify a branch or one of the values of 'STAGED', 'WORKING', or 'HEAD' (default no argument call
is equivalent to 'WORKING').

This function can be used to watch for changes in the database by storing previous hashes in your application and comparing them
to the current hash. For example, you can use this function to get the hash of the entire database like so:

```sql
SELECT dolt_hashof_db();
+----------------------------------+
| dolt_hashof_db()                 |
+----------------------------------+
| 1q8t28sb3h5g2lnhiojacpi7s09p4csj |
+----------------------------------+
```

It should be noted that if you are connected to branch 'main' and you call `dolt_hashof_db('feature')`, the hash may be different
than if you were connected to branch 'feature' and called `dolt_hashof_db()`. This happens if there exist changes to the working set on
branch 'feature' that have not been committed. Calling `dolt_hashof_db('feature')` while on 'main' is equivalent to calling
`dolt_hashof_db('HEAD')` while on branch 'feature'.

The general recommendation when trying to look for changes to the database is to connect to the branch you want to use, then
call `dolt_hashof_db()` without any arguments. Any change in the hash means that the database has changed.

### `DOLT_VERSION()`

The `DOLT_VERSION()` function returns the version string for the Dolt
binary.

```sql
select dolt_version();
+----------------+
| dolt_version() |
+----------------+
| 0.40.4         |
+----------------+
```

### `HAS_ANCESTOR()`

The `HAS_ANCESTOR(target, ancestor)` function returns a `boolean` indicating whether a
candidate `ancestor` commit is in the commit graph of the `target` ref.

Consider the example commit graph from above:

```text
      A---B---C feature
     /
D---E---F---G main
```

A hypothetical example where we substitute letters for commit
hashes would look like:

```sql
select has_ancestor('feature', 'A'); -- true
select has_ancestor('feature', 'E'); -- true
select has_ancestor('feature', 'F'); -- false
select has_ancestor('main', 'E');    -- true
select has_ancestor('main', 'G');    -- true
```

## Table Functions

Table functions operate like regular SQL functions, but instead of returning a single,
scalar value, a table function returns rows of data, just like a table. Dolt's table
functions have several restrictions in how they can be used in queries. For example, you
cannot currently alias a table function or join a table function with another table or
table function.

### `DOLT_DIFF()`

The `DOLT_DIFF()` table function calculates the differences in a table's data at any two commits in the database.
Each row in the result set describes how a row in the underlying table has changed between the two commits,
including the row's values at to and from commits and the type of change (i.e. `added`, `modified`, or `removed`).
`DOLT_DIFF()` is an alternative to the
[`dolt_commit_diff_$tablename` system table](/reference/version-control/dolt-system-tables#dolt_commit_diff_usdtablename).
You should generally prefer the system tables when possible, since they have less restrictions on use.
However, some use cases, such as viewing a table data diff containing schema changes or viewing the [three dot diff](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log/#three-dot-diff),
can be easier to view with the `DOLT_DIFF` table function.

The main difference between the results of the `DOLT_DIFF()` table function and the `dolt_commit_diff_$tablename`
system table is the schema of the returned results. `dolt_commit_diff_$tablename` generates the resulting schema
based on the table's schema at the currently checked out branch. `DOLT_DIFF()` will use the schema at the `from_commit`
for the `from_` columns and the schema at the `to_commit` for the `to_` columns. This can make it easier to view
diffs where the schema of the underlying table has changed.

Note that the `DOLT_DIFF()` table function currently requires that argument values be literal values.

#### Privileges

`DOLT_DIFF()` table function requires `SELECT` privilege on the specified table.

#### Options

```sql
DOLT_DIFF(<from_revision>, <to_revision>, <tablename>)
DOLT_DIFF(<from_revision..to_revision>, <tablename>)
DOLT_DIFF(<from_revision...to_revision>, <tablename>)
```

The `DOLT_DIFF()` table function takes either two or three required arguments:

- `from_revision` — the revision of the table data for the start of the diff. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~").
- `to_revision` — the revision of the table data for the end of the diff. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~").
- `from_revision..to_revision` — gets the two dot diff, or revision of table data between the `from_revision` and `to_revision`. This is equivalent to `dolt_diff(<from_revision>, <to_revision>, <tablename>)`.
- `from_revision...to_revision` — gets the three dot diff, or revision of table data between the `from_revision` and `to_revision`, _starting at the last common commit_.
- `tablename` — the name of the table containing the data to diff.

#### Schema

```sql
+------------------+----------+
| field            | type     |
+------------------+----------+
| from_commit      | TEXT     |
| from_commit_date | DATETIME |
| to_commit        | TEXT     |
| to_commit_date   | DATETIME |
| diff_type        | TEXT     |
| other cols       |          |
+------------------+----------+
```

The remaining columns are dependent on the schema of the user table as it existed at the `from_commit` and at
the `to_commit`. For every column `X` in your table at the `from_commit` revision, there is a column in the result
set named `from_X`. Likewise, for every column `Y` in your table at the `to_commit` revision, there is a column
in the result set named `to_Y`. This is the major difference between the `DOLT_DIFF()` table function and the
`dolt_commit_diff_$tablename` system table – `DOLT_DIFF()` uses the two schemas at the `to_commit` and
`from_commit` revisions to form the to and from columns of the result set, while `dolt_commit_diff_$tablename` uses
only the table schema of the currently checked out branch to form the to and from columns of the result set.

#### Example

Consider a table named `inventory` in a database with two branches: `main` and `feature_branch`. We can use the
`DOLT_DIFF()` function to calculate a diff of the table data from the `main` branch to the `feature_branch` branch
to see how our data has changed on the feature branch.

Here is the schema of `inventory` at the tip of `main`:

```sql
+----------+------+
| field    | type |
+----------+------+
| pk       | int  |
| name     | text |
| quantity | int  |
+----------+------+
```

Here is the schema of `inventory` at the tip of `feature_branch`:

```sql
+----------+------+
| field    | type |
+----------+------+
| pk       | int  |
| name     | text |
| color    | text |
| size     | int  |
+----------+------+
```

Based on the schemas at the two revision above, the resulting schema from `DOLT_DIFF()` will be:

```sql
+------------------+----------+
| field            | type     |
+------------------+----------+
| from_pk          | int      |
| from_name        | text     |
| from_quantity    | int      |
| from_commit      | TEXT     |
| from_commit_date | DATETIME |
| to_pk            | int      |
| to_name          | text     |
| to_color         | text     |
| to_size          | int      |
| to_commit        | TEXT     |
| to_commit_date   | DATETIME |
| diff_type        | text     |
+------------------+----------+
```

To calculate the diff and view the results, we run the following query:

```sql
SELECT * FROM DOLT_DIFF('main', 'feature_branch', 'inventory')
```

The results from `DOLT_DIFF()` show how the data has changed going from `main` to `feature_branch`:

```sql
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
| to_name | to_pk | to_size | to_color | to_commit      | to_commit_date                    | from_name | from_pk | from_quantity | from_commit | from_commit_date                  | diff_type |
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
| shirt   | 1     | 15      | false    | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | shirt     | 1       | 70            | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| shoes   | 2     | 9       | brown    | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | shoes     | 2       | 200           | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| pants   | 3     | 30      | blue     | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | pants     | 3       | 150           | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| hat     | 4     | 6       | grey     | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | NULL      | NULL    | NULL          | main        | 2022-03-23 18:51:48.333 +0000 UTC | added     |
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
```

#### Three dot `DOLT_DIFF`

Let's say the above database has a commit graph that looks like this:

```text
A - B - C - D (main)
         \
          E - F (feature_branch)
```

The example above gets the two dot diff, or differences between two revisions: `main` and `feature_branch`.
`dolt_diff('main', 'feature_branch', 'inventory')` (equivalent to `dolt_diff('main..feature_branch', 'inventory')`)
outputs the difference from F to D (i.e. with effects of E and F).

Three dot diff is useful for showing differences introduced by a feature branch from the point at which it _diverged_
from the main branch. Three dot diff is used to show pull request diffs.

Therefore, `dolt_diff('main...feature_branch')` outputs just the differences in `feature_branch` (i.e. E and F).

Learn more about two vs three dot diff [here](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log).

### `DOLT_DIFF_STAT()`

The `DOLT_DIFF_STAT()` table function calculates the data difference stat between any two commits
in the database. Schema changes such as creating a new table with no rows, or deleting a table with no rows will
return empty result. Each row in the result set describes a diff stat for a single table with statistics information of
number of rows unmodified, added, deleted and modified, number of cells added, deleted and modified and total number of
rows and cells the table has at each commit.

For keyless tables, this table function only provides the number of added and deleted rows. It
returns empty result for tables with no data changes.

Note that the `DOLT_DIFF_STAT()` table function currently requires that argument values be literal values.

#### Privileges

`DOLT_DIFF_STAT()` table function requires `SELECT` privilege for all tables if no table is defined or
for the defined table only.

#### Options

```sql
DOLT_DIFF_STAT(<from_revision>, <to_revision>, <optional_tablename>)
DOLT_DIFF_STAT(<from_revision..to_revision>, <optional_tablename>)
DOLT_DIFF_STAT(<from_revision...to_revision>, <optional_tablename>)
```

The `DOLT_DIFF_STAT()` table function takes three arguments:

- `from_revision` — the revision of the table data for the start of the diff. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `to_revision` — the revision of the table data for the end of the diff. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `from_revision..to_revision` — gets the two dot diff stat, or revision of table data between the `from_revision` and `to_revision`. This is equivalent to `dolt_diff_stat(<from_revision>, <to_revision>, <tablename>)`.
- `from_revision...to_revision` — gets the three dot diff stat, or revision of table data between the `from_revision` and `to_revision`, _starting at the last common commit_.
- `tablename` — the name of the table containing the data to diff. This argument is optional. When it's not defined, all tables with data diff will be returned.

#### Schema

```sql
+-----------------+--------+
| field           | type   |
+-----------------+--------+
| table_name      | TEXT   |
| rows_unmodified | BIGINT |
| rows_added      | BIGINT |
| rows_deleted    | BIGINT |
| rows_modified   | BIGINT |
| cells_added     | BIGINT |
| cells_deleted   | BIGINT |
| cells_modified  | BIGINT |
| old_row_count   | BIGINT |
| new_row_count   | BIGINT |
| old_cell_count  | BIGINT |
| new_cell_count  | BIGINT |
+-----------------+--------+
```

#### Example

Consider we start with a table `inventory` in a database on `main` branch. When we make any changes, we can use
the `DOLT_DIFF_STAT()` function to calculate a diff of the table data or all tables with data changes across specific
commits.

Here is the schema of `inventory` at the tip of `main`:

```sql
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| pk       | int         | NO   | PRI | NULL    |       |
| name     | varchar(50) | YES  |     | NULL    |       |
| quantity | int         | YES  |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

Here is what table `inventory` has at the tip of `main`:

```sql
+----+-------+----------+
| pk | name  | quantity |
+----+-------+----------+
| 1  | shirt | 15       |
| 2  | shoes | 10       |
+----+-------+----------+
```

We perform some changes to the `inventory` table and create new keyless table:

```sql
ALTER TABLE inventory ADD COLUMN color VARCHAR(10);
INSERT INTO inventory VALUES (3, 'hat', 6, 'red');
UPDATE inventory SET quantity=0 WHERE pk=1;
CREATE TABLE items (name varchar(50));
INSERT INTO items VALUES ('shirt'),('pants');
```

Here is what table `inventory` has in the current working set:

```sql
+----+-------+----------+-------+
| pk | name  | quantity | color |
+----+-------+----------+-------+
| 1  | shirt | 0        | NULL  |
| 2  | shoes | 10       | NULL  |
| 3  | hat   | 6        | red   |
+----+-------+----------+-------+
```

To calculate the diff and view the results, we run the following query:

```sql
SELECT * FROM DOLT_DIFF_STAT('main', 'WORKING');
```

The results from `DOLT_DIFF_STAT()` show how the data has changed going from tip of `main` to our current working set:

```sql
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| table_name        | rows_unmodified | rows_added | rows_deleted | rows_modified | cells_added | cells_deleted | cells_modified | old_row_count | new_row_count | old_cell_count | new_cell_count |
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| public.inventory  | 1               | 1          | 0            | 1             | 6           | 0             | 1              | 2             | 3             | 6              | 12             |
| public.items      | NULL            | 2          | 0            | NULL          | NULL        | NULL          | NULL           | NULL          | NULL          | NULL           | NULL           |
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
```

To get a table specific changes going from the current working set to tip of `main`, we run the following query:

```sql
SELECT * FROM DOLT_DIFF_STAT('WORKING', 'main', 'inventory');
```

With result of single row:

```sql
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| table_name        | rows_unmodified | rows_added | rows_deleted | rows_modified | cells_added | cells_deleted | cells_modified | old_row_count | new_row_count | old_cell_count | new_cell_count |
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| public.inventory  | 1               | 0          | 1            | 1             | 0           | 6             | 1              | 3             | 2             | 12             | 6              |
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
```

### `DOLT_DIFF_SUMMARY()`

The `DOLT_DIFF_SUMMARY()` table function is a summary of what tables changed and how
between any two commits in the database. Only changed tables will be listed in the result,
along with the diff type ('added', 'dropped', 'modified', 'renamed') and whether there are
data and schema changes.

It returns empty result if there are no tables with changes.

Note that the `DOLT_DIFF()` table function currently requires that argument values be literal values.

#### Privileges

`DOLT_DIFF_SUMMARY()` table function requires `SELECT` privilege for all tables if no
table is defined or for the defined table only.

#### Options

```sql
DOLT_DIFF_SUMMARY(<from_revision>, <to_revision>, <optional_tablename>)
DOLT_DIFF_SUMMARY(<from_revision..to_revision>, <optional_tablename>)
DOLT_DIFF_SUMMARY(<from_revision...to_revision>, <optional_tablename>)
```

The `DOLT_DIFF_SUMMARY()` table function takes three arguments:

- `from_revision` — the revision of the table data for the start of the diff. This
  argument is required. This may be a commit, tag, branch name, or other revision
  specifier (e.g. "main~", "WORKING", "STAGED").
- `to_revision` — the revision of the table data for the end of the diff. This argument is
  required. This may be a commit, tag, branch name, or other revision specifier (e.g.
  "main~", "WORKING", "STAGED").
- `from_revision..to_revision` — gets the two dot diff summary, or revision of table data
  between the `from_revision` and `to_revision`. This is equivalent to
  `dolt_diff_summary(<from_revision>, <to_revision>, <tablename>)`.
- `from_revision...to_revision` — gets the three dot diff summary, or revision of table data
  between the `from_revision` and `to_revision`, _starting at the last common commit_.
- `tablename` — the name of the table containing the data to diff. This argument is
  optional. When it's not defined, all tables with data diff will be returned.

#### Schema

```sql
+-----------------+---------+
| field           | type    |
+-----------------+---------+
| from_table_name | TEXT    |
| to_table_name   | TEXT    |
| diff_type       | TEXT    |
| data_change     | BOOLEAN |
| schema_change   | BOOLEAN |
+-----------------+---------+
```

#### Example

Consider we start with a table `inventory` in a database on `main` branch. When we make
any changes, we can use the `DOLT_DIFF_SUMMARY()` function to calculate a diff of the
table data or all tables with data changes across specific commits.

Here is the schema of `inventory` at the tip of `main`:

```sql
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| pk       | int         | NO   | PRI | NULL    |       |
| name     | varchar(50) | YES  |     | NULL    |       |
| quantity | int         | YES  |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

Here is what table `inventory` has at the tip of `main`:

```sql
+----+-------+----------+
| pk | name  | quantity |
+----+-------+----------+
| 1  | shirt | 15       |
| 2  | shoes | 10       |
+----+-------+----------+
```

We perform some changes to the `inventory` table and create new keyless table:

```sql
ALTER TABLE inventory ADD COLUMN color VARCHAR(10);
INSERT INTO inventory VALUES (3, 'hat', 6, 'red');
UPDATE inventory SET quantity=0 WHERE pk=1;
CREATE TABLE items (name varchar(50));
```

Here is what table `inventory` has in the current working set:

```sql
+----+-------+----------+-------+
| pk | name  | quantity | color |
+----+-------+----------+-------+
| 1  | shirt | 0        | NULL  |
| 2  | shoes | 10       | NULL  |
| 3  | hat   | 6        | red   |
+----+-------+----------+-------+
```

To calculate the diff and view the results, we run the following query:

```sql
SELECT * FROM DOLT_DIFF_SUMMARY('main', 'WORKING');
```

The results from `DOLT_DIFF_SUMMARY()` show how the data has changed going from tip of
`main` to our current working set:

```sql
+-------------------+-------------------+-----------+-------------+---------------+
| from_table_name   | to_table_name     | diff_type | data_change | schema_change |
+-------------------+-------------------+-----------+-------------+---------------+
| public.inventory  | public.inventory  | modified  | 1           | 1             |
| public.items      | public.items      | added     | 0           | 1             |
+-------------------+-------------------+-----------+-------------+---------------+
```

To get a table specific changes going from the current working set to tip of `main`, we
run the following query:

```sql
SELECT * FROM DOLT_DIFF_SUMMARY('WORKING', 'main', 'inventory');
```

With result of single row:

```sql
+-------------------+-------------------+-----------+-------------+---------------+
| from_table_name   | to_table_name     | diff_type | data_change | schema_change |
+-------------------+-------------------+-----------+-------------+---------------+
| public.inventory  | public.inventory  | modified  | 1           | 1             |
+-------------------+-------------------+-----------+-------------+---------------+
```

### `DOLT_LOG()`

The `DOLT_LOG` table function gets the commit log for all commits reachable from the
provided revision's `HEAD` (or the current `HEAD` if no revision is provided).

Note that the `DOLT_LOG()` table function currently requires that argument values be literal values.

#### Privileges

`DOLT_LOG()` table function requires `SELECT` privilege for all tables.

#### Options

```sql
DOLT_LOG([<optional_revisions>...], [--tables <tables>...])
```

The `DOLT_LOG()` table function takes any number of optional revision arguments:

- `optional_revision`: a branch name, tag, or commit ref (with or without an ancestor
  spec) that specifies which ancestor commits to include in the results. If no revisions
  are specified, the default is the current branch `HEAD`.
  - If you'd like to get [two dot logs](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log/#two-dot-log)
    (all commits reachable by `revision2`, but NOT reachable by `revision1`), you can
    use `..` between revisions (`DOLT_LOG('revision1..revision2')`) or `^` in front of
    the revision you'd like to exclude (`DOLT_LOG('revision2', '^revision1')`). Note: if providing two
    revisions, one must contain `^`.
  - If you'd like to get [three dot logs](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log/#three-dot-log)
    (all commits reachable by `revision1` or `revision2`, excluding commits reachable by
    BOTH `revision1` AND `revision2`), you can use `...` between revisions (`DOLT_LOG('revision1...revision2')`).
- `--min-parents`: The minimum number of parents a commit must have to be included in the log.
- `--merges`: Equivalent to min-parents == 2, this will limit the log to commits with 2 or
  more parents.
- `--parents`: Shows all parents of each commit in the log.
- `--decorate`: Shows refs next to commits. Valid options are short, full, no, and auto. Defaults to "no".
- `--not`: Excludes commits reachable by revision.
- `--tables`: Limits the log to commits that affect the specified tables. Any number of comma separated tables can be specified.

#### Schema

```sql
+-------------+----------+
| field       | type     |
+-------------+--------- +
| commit_hash | text     |
| committer   | text     |
| email       | text     |
| date        | datetime |
| message     | text     |
| parents     | text     | -- column hidden unless `--parents` flag provided
| refs        | text     | -- column hidden unless `--decorate` is "short" or "full"
+-------------+--------- +
```

#### Example

Consider we have the following commit graph:

```text
A - B - C - D (main)
         \
          E - F (feature)
```

To get the commit log for the `main` branch, we can use the query:

```sql
SELECT * FROM DOLT_LOG('main');
```

And it would return commits in reverse-chronological order - `D`,`C`, `B`, and `A`. The
output will look something like:

```sql
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
| commit_hash                      | committer | email              | date                              | message       |
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
| qi331vjgoavqpi5am334cji1gmhlkdv5 | bheni     | brian@dolthub.com | 2019-06-07 00:22:24.856 +0000 UTC | update rating  |
| 137qgvrsve1u458briekqar5f7iiqq2j | bheni     | brian@dolthub.com | 2019-04-04 22:43:00.197 +0000 UTC | change rating  |
| rqpd7ga1nic3jmc54h44qa05i8124vsp | bheni     | brian@dolthub.com | 2019-04-04 21:07:36.536 +0000 UTC | fixes          |
| qfk3bpan8mtrl05n8nihh2e3t68t3hrk | bheni     | brian@dolthub.com | 2019-04-04 21:01:16.649 +0000 UTC | test           |
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
```

To get the commit log for the `feature` branch, we can change the revision in the above
query:

```sql
SELECT * FROM DOLT_LOG('feature');
```

And it would return all commits reachable from the `HEAD` of `feature` - `F`, `E`, `C`,
`B`, and `A`.

#### Two and three dot log

We also support two and three dot log. Two dot log returns commits from a revision,
excluding commits from another revision. If we want all commits in `feature`, excluding
commits from `main`, all of these queries will return commits `F` and `E`.

```sql
SELECT * FROM DOLT_LOG('main..feature');
SELECT * FROM DOLT_LOG('feature', '^main');
SELECT * FROM DOLT_LOG('feature', '--not', 'main');
```

Three dot log returns commits in either revision, excluding commits in BOTH revisions. If
we want commits in `main` OR `feature`, excluding commits in `main` AND `feature`, this
query would return commits `F`, `E`, and `D`.

```sql
SELECT * FROM DOLT_LOG('main...feature');
```

Note: The order of revisions in two dot log matters, but not for three dot log.
`DOLT_LOG('main..feature')` returns `F` and `E`, while `DOLT_LOG('feature..main')`
returns just `D`. `DOLT_LOG('main...feature')` and `DOLT_LOG('feature...main')`
both return `F`, `E`, and `D`.

Learn more about two vs three dot log [here](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log).

### `DOLT_PATCH()`

Generate the SQL statements needed to patch a table (or all tables) from a starting revision
to a target revision. This can be useful when you want to import data into Dolt from an external source,
compare differences, and generate the SQL statements needed to patch the original source.
Both schema and/or data diff statements are returned if applicable. Some data diff cannot be
produced from incompatible schema changes; these are shown as warnings containing
which table this occurred on.

The order of the statements is that the schema patch comes first after the data patch. If patching
all tables, then we recommend to turn off the foreign key checks (`SET foreign_key_checks=0;`)
before applying these patch statements in order to avoid conflicts.

#### Privileges

`DOLT_PATCH()` table function requires `SELECT` privilege for all tables if no table is defined or
for the defined table only.

#### Options

```sql
DOLT_PATCH(<from_revision>, <to_revision>, <optional_tablename>)
DOLT_PATCH(<from_revision..to_revision>, <optional_tablename>)
DOLT_PATCH(<from_revision...to_revision>, <optional_tablename>)
```

The `DOLT_PATCH()` table function takes the following arguments:

- `from_revision` — the revision of the table data for the start of the patch. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `to_revision` — the revision of the table data for the end of the patch. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `from_revision..to_revision` — gets the two dot patch, or revision of table data between the `from_revision` and `to_revision`. This is equivalent to `dolt_patch(<from_revision>, <to_revision>, <tablename>)`.
- `from_revision...to_revision` — gets the three dot patch, or revision of table data between the `from_revision` and `to_revision`, _starting at the last common commit_.
- `tablename` — the name of the table containing the data and/or schema to patch. This argument is optional. When it's not defined, all tables with data and/or schema patch will be returned.

#### Schema

```sql
+------------------+--------+
| field            | type   |
+------------------+--------+
| statement_order  | BIGINT |
| from_commit_hash | TEXT   |
| to_commit_hash   | TEXT   |
| table_name       | TEXT   |
| diff_type        | TEXT   |
| statement        | TEXT   |
+------------------+--------+
```

#### Example

Consider we start with a table `inventory` in a database on `main` branch. When we make any changes, we can use
the `DOLT_PATCH()` function to get SQL patch statements of the table data or all tables with data changes across specific
commits.

Here is the schema of `inventory` at the tip of `main`:

```sql
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| pk       | int         | NO   | PRI | NULL    |       |
| name     | varchar(50) | YES  |     | NULL    |       |
| quantity | int         | YES  |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

Here is what table `inventory` has at the tip of `main`:

```sql
+----+-------+----------+
| pk | name  | quantity |
+----+-------+----------+
| 1  | shirt | 15       |
| 2  | shoes | 10       |
+----+-------+----------+
```

We perform some changes to the `inventory` table and create new keyless table:

```sql
INSERT INTO inventory VALUES (3, 'hat', 6);
UPDATE inventory SET quantity=0 WHERE pk=1;
CREATE TABLE items (name varchar(50));
INSERT INTO items VALUES ('shirt'),('pants');
```

Here is what table `inventory` has in the current working set:

```sql
+----+-------+----------+
| pk | name  | quantity |
+----+-------+----------+
| 1  | shirt | 0        |
| 2  | shoes | 10       |
| 3  | hat   | 6        |
+----+-------+----------+
```

To get SQL patch statements, we run the following query:

```sql
SELECT * FROM DOLT_PATCH('main', 'WORKING');
```

The results from `DOLT_PATCH()` show how the data has changed going from tip of `main` to our current working set:

```sql
+-----------------+----------------------------------+----------------+-------------------+-----------+----------------------------------------------------------------------+
| statement_order | from_commit_hash                 | to_commit_hash | table_name        | diff_type | statement                                                            |
+-----------------+----------------------------------+----------------+-------------------+-----------+----------------------------------------------------------------------+
| 1               | gg4kasjl6tgrtoag8tnn1der09sit4co | WORKING        | public.inventory  | data      | UPDATE "inventory" SET "quantity"=0 WHERE "pk"=1;                    |
| 2               | gg4kasjl6tgrtoag8tnn1der09sit4co | WORKING        | public.inventory  | data      | INSERT INTO "inventory" ("pk","name","quantity") VALUES (3,'hat',6); |
| 3               | gg4kasjl6tgrtoag8tnn1der09sit4co | WORKING        | public.items      | schema    | CREATE TABLE "items" (                                               |
|                 |                                  |                |                   |           |   "name" varchar(50)                                                 |
|                 |                                  |                |                   |           | );                                                                   |
| 4               | gg4kasjl6tgrtoag8tnn1der09sit4co | WORKING        | public.items      | data      | INSERT INTO "items" ("name") VALUES ('shirt');                       |
| 5               | gg4kasjl6tgrtoag8tnn1der09sit4co | WORKING        | public.items      | data      | INSERT INTO "items" ("name") VALUES ('pants');                       |
+-----------------+----------------------------------+----------------+-------------------+-----------+----------------------------------------------------------------------+
```

To get a table specific schema patch going from the current working set to tip of `main`, we run the following query:

```sql
SELECT * FROM DOLT_PATCH('WORKING', 'main', 'items') WHERE diff_type = 'schema';
```

With result of single row:

```sql
+-----------------+------------------+----------------------------------+---------------+-----------+---------------------+
| statement_order | from_commit_hash | to_commit_hash                   | table_name    | diff_type | statement           |
+-----------------+------------------+----------------------------------+---------------+-----------+---------------------+
| 1               | WORKING          | gg4kasjl6tgrtoag8tnn1der09sit4co | public.items  | schema    | DROP TABLE "items"; |
+-----------------+------------------+----------------------------------+---------------+-----------+---------------------+
```

### `DOLT_PREVIEW_MERGE_CONFLICTS_SUMMARY()`

The `DOLT_PREVIEW_MERGE_CONFLICTS_SUMMARY()` table function provides a summary of merge conflicts that would occur when merging a branch. This function is useful for understanding potential conflicts before performing an actual merge operation, allowing you to identify which tables would have conflicts and how many data and schema conflicts would occur.

This function performs a "dry run" merge operation and returns information about conflicts without actually modifying the database or creating a merge commit.

#### Privileges

`DOLT_PREVIEW_MERGE_CONFLICTS_SUMMARY()` table function requires `SELECT` privilege for all tables.

#### Options

```sql
DOLT_PREVIEW_MERGE_CONFLICTS_SUMMARY(<base_branch>, <merge_branch>)
```

The `DOLT_PREVIEW_MERGE_CONFLICTS_SUMMARY()` table function takes two required arguments:

- `base_branch` — the base branch to merge into (e.g. "main").
- `merge_branch` — the branch to merge into the base branch (e.g. "feature_branch").

#### Schema

```text
+---------------------+--------+
| field               | type   |
+---------------------+--------+
| table               | TEXT   |
| num_data_conflicts  | BIGINT |
| num_schema_conflicts| BIGINT |
+---------------------+--------+
```

#### Example

Consider a scenario where you have a `main` branch and a `feature_branch` that have diverged and made conflicting changes to the same data. You can preview the conflicts that would occur when merging `feature_branch` into `main`:

```sql
SELECT * FROM DOLT_PREVIEW_MERGE_CONFLICTS_SUMMARY('main', 'feature_branch');
```

This might return results like:

```text
+----------+--------------------+---------------------+
| table    | num_data_conflicts | num_schema_conflicts|
+----------+--------------------+---------------------+
| users    | 3                  | 0                   |
| orders   | 1                  | 0                   |
| products | NULL               | 2                   |
+----------+--------------------+---------------------+
```

Note that if there are schema conflicts the data conflicts are not able to be calculated and that column will be null.

This output indicates that merging `feature_branch` into `main` would create conflicts in three tables:

- The `users` table would have 3 data conflicts and no schema conflicts
- The `orders` table would have 1 data conflict and no schema conflicts
- The `products` table would have 2 schema conflicts

If there would be no conflicts, the function returns an empty result set.

This information helps you understand the scope of conflicts before attempting a merge, allowing you to plan conflict resolution strategies or coordinate with other developers who may have made conflicting changes.

### `DOLT_PREVIEW_MERGE_CONFLICTS()`

The `DOLT_PREVIEW_MERGE_CONFLICTS()` table function provides detailed information about merge conflicts that would occur when merging a branch. Unlike `DOLT_PREVIEW_MERGE_CONFLICTS_SUMMARY()` which only provides a count of conflicts per table, this function returns the actual conflicting rows with their base, ours, and theirs values.

This function performs a "dry run" merge operation and returns detailed conflict information without actually modifying the database or creating a merge commit. The results are similar to what you would see in the `dolt_conflicts_$TABLENAME` system tables after performing an actual merge, but without making any changes to the database.

#### Privileges

`DOLT_PREVIEW_MERGE_CONFLICTS()` table function requires `SELECT` privilege on the specified table.

#### Options

```sql
DOLT_PREVIEW_MERGE_CONFLICTS(<base_branch>, <merge_branch>, <table_name>)
```

The `DOLT_PREVIEW_MERGE_CONFLICTS()` table function takes three required arguments:

- `base_branch` — the base branch to merge into (e.g. "main").
- `merge_branch` — the branch to merge into the base branch (e.g. "feature_branch").
- `table_name` — the name of the table to preview conflicts for.

#### Schema

The schema of the `DOLT_PREVIEW_MERGE_CONFLICTS()` function depends on the schema of the specified table. For each column `X` in the table, the result set contains three columns:

- `base_X` — the value of column X at the common ancestor commit
- `our_X` — the value of column X in the base branch
- `their_X` — the value of column X in the merge branch

Additionally, the result set includes these metadata columns:

```text
+------------------+--------+
| field            | type   |
+------------------+--------+
| from_root_ish    | TEXT   |
| our_diff_type    | TEXT   |
| their_diff_type  | TEXT   |
| dolt_conflict_id | TEXT   |
+------------------+--------+
```

Where:

- `from_root_ish` — the commit hash of the merge branch (the "from" branch of the merge). This hash can be used to identify which merge produced a conflict, since conflicts can accumulate across merges. User code generally ignores this column.
- `our_diff_type` and `their_diff_type` indicate whether the row was "added", "modified", or "removed" in the corresponding branch
- `dolt_conflict_id` is a unique identifier for each conflict

#### Example

Consider a table `users` with columns `id`, `name`, and `email` that has conflicts between `main` and `feature_branch`. You can preview the specific conflicts:

```sql
SELECT * FROM DOLT_PREVIEW_MERGE_CONFLICTS('main', 'feature_branch', 'users');
```

This might return results like:

```text
+----------------------------------+---------+-----------+----------------+---------+-----------+------------------+---------------+-----------+-----------+-------------------+-----------------+------------------------+
| from_root_ish                    | base_id | base_name | base_email     | our_id  | our_name  | our_email        | our_diff_type | their_id  | their_name| their_email       | their_diff_type | dolt_conflict_id       |
+----------------------------------+---------+-----------+----------------+---------+-----------+------------------+---------------+-----------+-----------+-------------------+-----------------+------------------------+
| abc123def456789012345678901234567 | 1       | John      | john@email.com | 1       | John Doe  | john@email.com   | modified      | 1         | John      | john@newemail.com | modified        | abc123def456           |
| abc123def456789012345678901234567 | NULL    | NULL      | NULL           | 2       | Jane      | jane@email.com   | added         | 2         | Jane Doe  | jane@email.com    | added           | def789ghi012           |
+----------------------------------+---------+-----------+----------------+---------+-----------+------------------+---------------+-----------+-----------+-------------------+-----------------+------------------------+
```

This output shows:

- Row 1: Both branches modified the same user but with different changes (name vs email)
- Row 2: Both branches added a new user with the same ID but different data

To view only specific columns for easier reading:

```sql
SELECT dolt_conflict_id, base_name, our_name, our_diff_type, their_name, their_diff_type
FROM DOLT_PREVIEW_MERGE_CONFLICTS('main', 'feature_branch', 'users');
```

### Keyless Tables

For keyless tables (tables without primary keys), the behavior is slightly different. Dolt uses content-based addressing to identify rows, so conflicts in keyless tables are detected when the same content would be added or modified differently on each branch.

Keyless tables include additional columns not present in tables with primary keys:

```text
+-------------------+--------+
| field             | type   |
+-------------------+--------+
| base_cardinality  | BIGINT |
| our_cardinality   | BIGINT |
| their_cardinality | BIGINT |
+-------------------+--------+
```

- `base_cardinality` — the number of occurrences of the conflicting row in the merge ancestor commit
- `our_cardinality` — the number of occurrences of the conflicting row in the base branch
- `their_cardinality` — the number of occurrences of the conflicting row in the merge branch

Consider a keyless table `logs` with columns `timestamp`, `level`, and `message`:

```sql
SELECT * FROM DOLT_PREVIEW_MERGE_CONFLICTS('main', 'feature_branch', 'logs');
```

This might return results like:

```text
+----------------------------------+---------------------+-------------+------------------+---------------------+-------------+------------------+---------------+---------------------+-------------+------------------+-----------------+------------------------+------------------+-------------------+---------------------+
| from_root_ish                    | base_timestamp      | base_level  | base_message     | our_timestamp       | our_level   | our_message      | our_diff_type | their_timestamp     | their_level | their_message    | their_diff_type | dolt_conflict_id       | base_cardinality | our_cardinality   | their_cardinality   |
+----------------------------------+---------------------+-------------+------------------+---------------------+-------------+------------------+---------------+---------------------+-------------+------------------+-----------------+------------------------+------------------+-------------------+---------------------+
| abc123def456789012345678901234567 | 2023-01-01 10:00:00 | ERROR       | Database timeout | 2023-01-01 10:00:00 | ERROR       | Database timeout | modified      | 2023-01-01 10:00:00 | ERROR       | Database timeout | modified        | xyz789abc123           | 1                | 3                 | 2                   |
+----------------------------------+---------------------+-------------+------------------+---------------------+-------------+------------------+---------------+---------------------+-------------+------------------+-----------------+------------------------+------------------+-------------------+---------------------+
```

In this example, the same log entry exists once in the base branch, but appears 3 times in our branch and 2 times in their branch, creating a conflict about cardinality (how many times the row should appear).

### Notes

If there are no conflicts in the specified table, the function returns an empty result set.

This detailed view allows you to examine the exact differences that would cause conflicts and plan appropriate resolution strategies before performing the actual merge. The results are similar to what you would see in the `dolt_conflicts_$TABLENAME` system tables after an actual merge, but without making any changes to your database.

### `DOLT_REFLOG()`

The `DOLT_REFLOG()` table function shows the history of named refs (e.g. branches and tags), which is useful when you want to understand how a branch or tag has changed over time to reference different commits, particularly for information that isn't surfaced through the `dolt_log` system table or `dolt_log()` table function. For example, if you use `dolt_reset()` to change the commit a branch points to, you can use `dolt_reflog()` to see what commit the branch was pointing to before it was moved to that commit. Another common use case for `dolt_reflog()` is to recreate a branch or tag that was accidentally deleted. The example section below shows how to recreate a deleted branch.

The data from Dolt's reflog comes from [Dolt's journaling chunk store](https://www.dolthub.com/blog/2023-03-08-dolt-chunk-journal/). This data is local to a Dolt database and never included when pushing, pulling, or cloning a Dolt database. This means when you clone a Dolt database, it will not have any reflog data until you perform operations that change what commit branches or tags reference.

Dolt's reflog is similar to [Git's reflog](https://git-scm.com/docs/git-reflog), but there are a few differences:

- The Dolt reflog currently only supports named references, such as branches and tags, and not any of Git's special refs (e.g. `HEAD`, `FETCH-HEAD`, `MERGE-HEAD`).
- The Dolt reflog can be queried for the log of references, even after a reference has been deleted. In Git, once a branch or tag is deleted, the reflog for that ref is also deleted and to find the last commit a branch or tag pointed to you have to use Git's special `HEAD` reflog to find the commit, which can sometimes be challenging. Dolt makes this much easier by allowing you to see the history for a deleted ref so you can easily see the last commit a branch or tag pointed to before it was deleted.

#### Privileges

There are no special privileges required to use the `dolt_reflog()` table function.

#### Options

```sql
DOLT_REFLOG()
DOLT_REFLOG(['--all'], <ref_name>)
```

The `dolt_reflog()` table function can be called with no arguments or with one argument. If called without any arguments, it will return the full reference log, which lists changes from newest to oldest for all tracked references. If called with one argument, that argument is the name of a ref to query. This can be the name of a branch (e.g. "myBranch") or the name of a tag (e.g. "v1.1.4") or it can be the fully qualified ref path (e.g. "refs/heads/myBranch"). The `ref_name` parameter is case-insensitive.

The `dolt_reflog()` table function can also be called with the `--all` flag to show all refs, including hidden refs, such as DoltHub workspace refs.

#### Schema

```sql
+-----------------------+-----------+
| field                 | type      |
+-----------------------+-----------+
| ref                   | TEXT      |
| ref_timestamp         | TIMESTAMP |
| commit_hash           | TEXT      |
| commit_message        | TEXT      |
+-----------------------+-----------+
```

#### Example

The example below shows how to recreate a branch that was deleted by finding the last commit it referenced in Dolt's reflog.

```sql
-- Someone accidentally deletes the wrong branch!
select dolt_branch('-D', 'prodBranch');

-- After we realize the wrong branch has been deleted, we query the Dolt reflog on the same Dolt database instance
-- where the branch was deleted to see what commits the prodBranch branch has referenced. Using the same Dolt
-- instance is important, since reflog information is always local and not included when pushing/pulling databases.
select * from dolt_reflog('prodBranch');
+-----------------------+---------------------+----------------------------------+-------------------------------+
| ref                   | ref_timestamp       | commit_hash                      | commit_message                |
+-----------------------+---------------------+----------------------------------+-------------------------------+
| refs/heads/prodBranch | 2023-10-25 20:54:37 | v531ptpmv2tquig8v591tsjghtj84ksg | inserting row 42              |
| refs/heads/prodBranch | 2023-10-25 20:53:12 | rvt34lqrbtdr3dhnjchruu73lik4e398 | inserting row 100000          |
| refs/heads/prodBranch | 2023-10-25 20:53:06 | v531ptpmv2tquig8v591tsjghtj84ksg | inserting row 42              |
| refs/heads/prodBranch | 2023-10-25 20:52:43 | ihuj1l7fmqq37sjhtlrgpup5n76gfhju | inserting row 1 into table xy |
+-----------------------+---------------------+----------------------------------+-------------------------------+

-- The last commit prodBranch pointed to was v531ptpmv2tquig8v591tsjghtj84ksg, so to restore our branch, we
-- just need to create a branch with the same name, pointing to that last commit.
select dolt_branch('prodBranch', 'v531ptpmv2tquig8v591tsjghtj84ksg');
```

### `DOLT_SCHEMA_DIFF()`

The `DOLT_SCHEMA_DIFF()` table function calculates the schema difference between any two commits in the database.
Each row in the result set describes how a table was altered between the two commits, including the table's create statement at to and from commits.

Note that the `DOLT_SCHEMA_DIFF()` table function currently requires that argument values be literal values.

#### Privileges

`DOLT_SCHEMA_DIFF()` table function requires `SELECT` privilege for all tables if no table is defined or
for the defined table only.

#### Options

```sql
DOLT_SCHEMA_DIFF(<from_commit>, <to_commit>, <optional_tablename>)
DOLT_SCHEMA_DIFF(<from_revision..to_revision>, <optional_tablename>)
DOLT_SCHEMA_DIFF(<from_revision...to_revision>, <optional_tablename>)
```

The `DOLT_SCHEMA_DIFF()` table function takes three arguments:

- `from_revision` — the revision of the table data for the start of the diff. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `to_revision` — the revision of the table data for the end of the diff. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `from_revision..to_revision` — gets the two dot diff, or revision of table schema between the `from_revision` and `to_revision`. This is equivalent to `dolt_schema_diff(<from_revision>, <to_revision>, [<tablename>])`.
- `from_revision...to_revision` — gets the three dot diff, or revision of table schema between the `from_revision` and `to_revision`, _starting at the last common commit_.
- `tablename` — the name of the table to diff. This argument is optional. When it's not defined, all tables with schema diffs will be returned.

#### Schema

```sql
+-----------------------+------+
| field                 | type |
+-----------------------+------+
| from_table_name       | TEXT |
| to_table_name         | TEXT |
| from_create_statement | TEXT |
| to_create_statement   | TEXT |
+-----------------------+------+
```

#### Example

For this example, we'll consider three tables within the context of two branches: `main` and `feature_branch`.

These are the tables on `main`: `employees`, `inventory`, `vacations`.
These are the tables on `feature_branch`: `inventory`, `photos`, `trips`.

To figure out how these tables changed, we run the following query:

```sql
SELECT * FROM DOLT_SCHEMA_DIFF('main', 'feature_branch')
```

The results from `DOLT_SCHEMA_DIFF()` show how the schema for all tables has changed going from tip of `main` to tip of `feature_branch`:

```sql
+-------------------+-------------------+-----------------------------+-----------------------------+
| from_table_name   | to_table_name     | from_create_statement       | to_create_statement         |
+-------------------+-------------------+-----------------------------+-----------------------------+
| public.employees  |                   | CREATE TABLE "employees" (  |                             |
|                   |                   |   "pk" integer NOT NULL,    |                             |
|                   |                   |   "name" varchar(50),       |                             |
|                   |                   |   PRIMARY KEY ("pk")        |                             |
|                   |                   | );                          |                             |
| public.inventory  | public.inventory  | CREATE TABLE "inventory" (  | CREATE TABLE "inventory" (  |
|                   |                   |   "pk" integer NOT NULL,    |   "pk" integer NOT NULL,    |
|                   |                   |   "name" varchar(50),       |   "name" varchar(50),       |
|                   |                   |   "quantity" integer,       |   "color" varchar(10),      |
|                   |                   |   PRIMARY KEY ("pk")        |   PRIMARY KEY ("pk")        |
|                   |                   | );                          | );                          |
|                   | public.photos     |                             | CREATE TABLE "photos" (     |
|                   |                   |                             |   "pk" integer NOT NULL,    |
|                   |                   |                             |   "name" varchar(50),       |
|                   |                   |                             |   "dt" timestamp,           |
|                   |                   |                             |   PRIMARY KEY ("pk")        |
|                   |                   |                             | );                          |
| public.vacations  | public.trips      | CREATE TABLE "vacations" (  | CREATE TABLE "trips" (      |
|                   |                   |   "pk" integer NOT NULL,    |   "pk" integer NOT NULL,    |
|                   |                   |   "name" varchar(50),       |   "name" varchar(50),       |
|                   |                   |   PRIMARY KEY ("pk")        |   PRIMARY KEY ("pk")        |
|                   |                   | );                          | );                          |
+-------------------+-------------------+-----------------------------+-----------------------------+
```

Let's look at the returned data.

1. The first row has values in `from_table_name` and `from_create_statement` columns, while `to_table_name` and `to_create_statement` columns are empty. This means that between `main` and `feature_branch`, the table `employees` was deleted.
2. The second row has identical values for `from_table_name` and `to_table_name`, but `from_create_statement` is different from `to_create_statement`. This means the table's schema changed between `main` and `feature_branch`.
3. The third row is similar to the first row, except its `to_*` columns are empty, and `from_*` columns are set. This means that between `main` and `feature_branch`, the table `photos` was added.
4. Finally, the last row has mostly identical `from_create_statement` and `to_create_statement` columns, but different `from_table_name` and `to_table_name` columns. This means the table was renamed changed between `main` and `feature_branch`.

We invoked `DOLT_SCHEMA_DIFF()` with branch names, but we could have used any revision specifier. For example, we could have used commit hashes or tag names, and would have gotten the same results.

Using tags or commit hashes:

```sql
select * from dolt_schema_diff('v1', 'v1.1');
select * from dolt_schema_diff('tjj1kp2mnoad8crv6b94mh4a4jiq7ab2', 'v391rm7r0t4989sgomv0rpn9ue4ugo6g');
```

So far, we have always supplied just the first two parameters, the `from` and `to` revisions, but we have not specified the optional table parameter, so `DOLT_SCHEMA_DIFF()` returned schema diffs of all changed tables.
We can scope `DOLT_SCHEMA_DIFF()` to a specific table simply by specifying it as the last parameter.

Let's try this with the `inventory` table.

```sql
SELECT * FROM DOLT_SCHEMA_DIFF('main', 'feature_branch', 'inventory')
```

We will see this set of results:

```sql
+-------------------+-------------------+-----------------------------+-----------------------------+
| from_table_name   | to_table_name     | from_create_statement       | to_create_statement         |
+-------------------+-------------------+-----------------------------+-----------------------------+
| public.inventory  | public.inventory  | CREATE TABLE "inventory" (  | CREATE TABLE "inventory" (  |
|                   |                   |   "pk" integer NOT NULL,    |   "pk" integer NOT NULL,    |
|                   |                   |   "name" varchar(50),       |   "name" varchar(50),       |
|                   |                   |   "quantity" integer,       |   "color" varchar(10),      |
|                   |                   |   PRIMARY KEY ("pk")        |   PRIMARY KEY ("pk")        |
|                   |                   | );                          | );                          |
+-------------------+-------------------+-----------------------------+-----------------------------+
```

When a table is renamed, we can specify either the "old" table name, or the "new" table name, and we will receive the same results. The following two queries will provide the same results:

```sql
SELECT * FROM DOLT_SCHEMA_DIFF('main', 'feature_branch', 'trips');
SELECT * FROM DOLT_SCHEMA_DIFF('main', 'feature_branch', 'vacations');
```

Here are the results:

```sql
+-------------------+---------------+-----------------------------+-----------------------------+
| from_table_name   | to_table_name | from_create_statement       | to_create_statement         |
+-------------------+---------------+-----------------------------+-----------------------------+
| public.vacations  | public.trips  | CREATE TABLE "vacations" (  | CREATE TABLE "trips" (      |
|                   |               |   "pk" integer NOT NULL,    |   "pk" integer NOT NULL,    |
|                   |               |   "name" varchar(50),       |   "name" varchar(50),       |
|                   |               |   PRIMARY KEY ("pk")        |   PRIMARY KEY ("pk")        |
|                   |               | );                          | );                          |
+-------------------+---------------+-----------------------------+-----------------------------+
```

Finally, we can flip the order of the revisions to get the schema diff in the opposite direction.

```sql
select * from dolt_schema_diff('feature_branch', 'main');
```

The above query will produce this output:

```sql
+-------------------+-------------------+-----------------------------+-----------------------------+
| from_table_name   | to_table_name     | from_create_statement       | to_create_statement         |
+-------------------+-------------------+-----------------------------+-----------------------------+
| public.photos     |                   | CREATE TABLE "photos" (     |                             |
|                   |                   |   "pk" integer NOT NULL,    |                             |
|                   |                   |   "name" varchar(50),       |                             |
|                   |                   |   "dt" timestamp,           |                             |
|                   |                   |   PRIMARY KEY ("pk")        |                             |
|                   |                   | );                          |                             |
|                   | public.employees  |                             | CREATE TABLE "employees" (  |
|                   |                   |                             |   "pk" integer NOT NULL,    |
|                   |                   |                             |   "name" varchar(50),       |
|                   |                   |                             |   PRIMARY KEY ("pk")        |
|                   |                   |                             | );                          |
| public.inventory  | public.inventory  | CREATE TABLE "inventory" (  | CREATE TABLE "inventory" (  |
|                   |                   |   "pk" integer NOT NULL,    |   "pk" integer NOT NULL,    |
|                   |                   |   "name" varchar(50),       |   "name" varchar(50),       |
|                   |                   |   "color" varchar(10),      |   "quantity" integer,       |
|                   |                   |   PRIMARY KEY ("pk")        |   PRIMARY KEY ("pk")        |
|                   |                   | );                          | );                          |
| public.trips      | public.vacations  | CREATE TABLE "trips" (      | CREATE TABLE "vacations" (  |
|                   |                   |   "pk" integer NOT NULL,    |   "pk" integer NOT NULL,    |
|                   |                   |   "name" varchar(50),       |   "name" varchar(50),       |
|                   |                   |   PRIMARY KEY ("pk")        |   PRIMARY KEY ("pk")        |
|                   |                   | );                          | );                          |
+-------------------+-------------------+-----------------------------+-----------------------------+
```

Note the difference between this select and the previous `dolt_schema_diff('main', 'feature_branch')` invocation:

1. First row shows that the table `photos` was deleted
2. Second row show the creation of `employees` table
3. Third row has the `from_create_statement` and `to_create_statement` columns swapped
4. Fourth row shows the inverse rename of `trips` to `vacations`

#### Example query

You can try calling `DOLT_SCHEMA_DIFF()` against the [DoltHub docs_examples DB](https://www.dolthub.com/repositories/dolthub/docs_examples), by getting the diff of schemas between `schema_diff_v1` and `schema_diff_v2` tags, which correspond to `main` and `feature_branch` branches from these examples.

[https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?active=Tables&q=SELECT+*%0AFROM+dolt_schema_diff%28%27schema_diff_v1%27%2C+%27schema_diff_v2%27%29%3B%0A](https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?active=Tables&q=SELECT+*%0AFROM+dolt_schema_diff%28%27schema_diff_v1%27%2C+%27schema_diff_v2%27%29%3B%0A)

### `DOLT_QUERY_DIFF()`

The `DOLT_QUERY_DIFF()` table function calculates the data difference between any two queries, producing a table similar to the `DOLT_DIFF()` table function.

> **Known limitation:** `DOLT_QUERY_DIFF()` does not currently work in Doltgres. The examples below
> show the intended behavior once support is added.

#### Privileges

`DOLT_QUERY_DIFF()` table function requires `SELECT` privilege on all tables in the database (e.g. `GRANT SELECT ON mydb.*`).

#### Example

For this example, we have the table `t` in two branches `main` and `other`.

On `main`, the table `t` has the following data:

```sql
+---+----+
| i | j  |
+---+----+
| 0 | 0  |
| 1 | 10 |
| 3 | 3  |
| 4 | 4  |
+---+----+
```

On `other`, the table `t` has the following data:

```sql
+---+---+
| i | j |
+---+---+
| 0 | 0 |
| 1 | 1 |
| 2 | 2 |
| 4 | 4 |
+---+---+
```

We can use the `DOLT_QUERY_DIFF()` table function to calculate the difference between the two tables:

```sql
select * from dolt_query_diff('select * from t as of main', 'select * from t as of other');
+--------+--------+------+------+-----------+
| from_i | from_j | to_i | to_j | diff_type |
+--------+--------+------+------+-----------+
| 1      | 10     | 1    | 1    | modified  |
| NULL   | NULL   | 2    | 2    | added     |
| 3      | 3      | NULL | NULL | deleted   |
+--------+--------+------+------+-----------+
```

### Note

Query diff is performed brute force and thus, will be slow for large result sets.
The algorithm is super linear (`n^2`) on the size of the results sets.
Over time, we will optimize this to use features of the storage engine to improve performance.
