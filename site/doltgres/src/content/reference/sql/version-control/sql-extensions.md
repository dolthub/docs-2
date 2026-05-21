---
title: SQL Extensions Index
---

A flat index of every Doltgres-specific SQL extension — every function,
system table, and system variable — on a single page. Press ⌘F / Ctrl-F
and search by keyword when you don't know what kind of construct exposes
the feature you're looking for.

The list is grouped by extension kind:

- [Version-Control Functions](#version-control-functions) — write-side
  operations equivalent to Dolt CLI commands (`dolt_commit`,
  `dolt_merge`, `dolt_push`, …). Invoke with `SELECT`.
- [Informational Functions](#informational-functions) — scalar functions
  that return repository state (active branch, ref hashes, version, …).
- [Table Functions](#table-functions) — used in a `FROM` clause to
  expose diff / log / conflict views as virtual tables.
- [System Tables](#system-tables) — queryable tables that expose
  repository state.
- [System Variables](#system-variables) — session and global settings
  that change Doltgres's behavior.

If you'd rather browse by use case, see the [Doltgres cheat
sheet](/guides/cheat-sheet).

## Version-Control Functions

Function equivalents of `dolt` CLI commands. These modify state — call
each with `SELECT … FROM` (Doltgres-style) for the same effect that
`CALL DOLT_X()` has in Dolt. Full details:
[Functions](/reference/version-control/dolt-sql-functions).

| Name | Description |
|------|-------------|
| [`DOLT_ADD()`](/reference/version-control/dolt-sql-functions#dolt_add) | Stage working changes for the next commit. |
| [`DOLT_BACKUP()`](/reference/version-control/dolt-sql-functions#dolt_backup) | Manage backup remotes and run backups. |
| [`DOLT_BRANCH()`](/reference/version-control/dolt-sql-functions#dolt_branch) | Create, delete, rename, or copy a branch. |
| [`DOLT_CHECKOUT()`](/reference/version-control/dolt-sql-functions#dolt_checkout) | Switch the session to a different branch, or restore a table from HEAD. |
| [`DOLT_CHERRY_PICK()`](/reference/version-control/dolt-sql-functions#dolt_cherry_pick) | Apply a single commit from another branch to the current branch. |
| [`DOLT_CLEAN()`](/reference/version-control/dolt-sql-functions#dolt_clean) | Discard untracked tables in the working set. |
| [`DOLT_CLONE()`](/reference/version-control/dolt-sql-functions#dolt_clone) | Clone a remote database into the current Doltgres environment. |
| [`DOLT_COMMIT()`](/reference/version-control/dolt-sql-functions#dolt_commit) | Create a new commit from staged changes. |
| [`DOLT_CONFLICTS_RESOLVE()`](/reference/version-control/dolt-sql-functions#dolt_conflicts_resolve) | Resolve a merge conflict by taking the `--ours` or `--theirs` side. |
| [`DOLT_FETCH()`](/reference/version-control/dolt-sql-functions#dolt_fetch) | Update remote-tracking refs without merging. |
| [`DOLT_GC()`](/reference/version-control/dolt-sql-functions#dolt_gc) | Reclaim disk space by removing unreferenced chunks. |
| [`DOLT_MERGE()`](/reference/version-control/dolt-sql-functions#dolt_merge) | Merge another branch into the current branch. |
| [`DOLT_PULL()`](/reference/version-control/dolt-sql-functions#dolt_pull) | Fetch from and merge a remote branch in one step. |
| [`DOLT_PURGE_DROPPED_DATABASES()`](/reference/version-control/dolt-sql-functions#dolt_purge_dropped_databases) | Permanently delete dropped databases held in the recovery area. |
| [`DOLT_PUSH()`](/reference/version-control/dolt-sql-functions#dolt_push) | Update remote refs with local commits. |
| [`DOLT_REBASE()`](/reference/version-control/dolt-sql-functions#dolt_rebase) | Replay the current branch's commits on top of a different base. |
| [`DOLT_REMOTE()`](/reference/version-control/dolt-sql-functions#dolt_remote) | Add, remove, or list named remotes. |
| [`DOLT_RESET()`](/reference/version-control/dolt-sql-functions#dolt_reset) | Move HEAD (and optionally the working set) to a different commit. |
| [`DOLT_REVERT()`](/reference/version-control/dolt-sql-functions#dolt_revert) | Create a new commit that undoes a prior commit. |
| [`DOLT_TAG()`](/reference/version-control/dolt-sql-functions#dolt_tag) | Create, list, or delete a tag at a commit. |
| [`DOLT_UNDROP()`](/reference/version-control/dolt-sql-functions#dolt_undrop) | Restore a recently dropped database from the recovery area. |
| [`DOLT_VERIFY_CONSTRAINTS()`](/reference/version-control/dolt-sql-functions#dolt_verify_constraints) | Walk the working set and record any constraint violations. |

## Informational Functions

Scalar functions that return repository state without modifying it.

| Name | Description |
|------|-------------|
| [`ACTIVE_BRANCH()`](/reference/version-control/dolt-sql-functions#active_branch) | Name of the session's current branch. |
| [`DOLT_HASHOF()`](/reference/version-control/dolt-sql-functions#dolt_hashof) | Commit hash of a ref. |
| [`DOLT_HASHOF_DB()`](/reference/version-control/dolt-sql-functions#dolt_hashof_db) | Hash representing the entire database's working set. |
| [`DOLT_HASHOF_TABLE()`](/reference/version-control/dolt-sql-functions#dolt_hashof_table) | Hash of a single table's current contents. |
| [`DOLT_MERGE_BASE()`](/reference/version-control/dolt-sql-functions#dolt_merge_base) | Commit hash of the merge base between two refs. |
| [`DOLT_VERSION()`](/reference/version-control/dolt-sql-functions#dolt_version) | Version string of the running `doltgres` binary. |
| [`HAS_ANCESTOR()`](/reference/version-control/dolt-sql-functions#has_ancestor) | True if one ref is an ancestor of another. |

## Table Functions

Used in a `FROM` clause to expose diff, log, and conflict views as
virtual tables.

| Name | Description |
|------|-------------|
| [`DOLT_DIFF()`](/reference/version-control/dolt-sql-functions#dolt_diff) | Row-level diff between two commits (or two refs) for a given table. |
| [`DOLT_DIFF_STAT()`](/reference/version-control/dolt-sql-functions#dolt_diff_stat) | Numeric summary (rows added/modified/removed) of the diff between two commits. |
| [`DOLT_DIFF_SUMMARY()`](/reference/version-control/dolt-sql-functions#dolt_diff_summary) | Per-table summary of which tables changed between two commits. |
| [`DOLT_LOG()`](/reference/version-control/dolt-sql-functions#dolt_log) | Filtered commit log, the function equivalent of `dolt log`. |
| [`DOLT_PATCH()`](/reference/version-control/dolt-sql-functions#dolt_patch) | SQL patch statements representing the diff between two commits. |
| [`DOLT_PREVIEW_MERGE_CONFLICTS()`](/reference/version-control/dolt-sql-functions#dolt_preview_merge_conflicts) | Row-level conflicts a merge would produce, without performing the merge. |
| [`DOLT_PREVIEW_MERGE_CONFLICTS_SUMMARY()`](/reference/version-control/dolt-sql-functions#dolt_preview_merge_conflicts_summary) | Per-table conflict counts a merge would produce. |
| [`DOLT_QUERY_DIFF()`](/reference/version-control/dolt-sql-functions#dolt_query_diff) | Diff between two query results expressed as rows. |
| [`DOLT_REFLOG()`](/reference/version-control/dolt-sql-functions#dolt_reflog) | Local history of ref updates (the `dolt reflog` equivalent). |
| [`DOLT_SCHEMA_DIFF()`](/reference/version-control/dolt-sql-functions#dolt_schema_diff) | Schema-only diff between two commits. |

## System Tables

System tables expose repository state — commits, branches, diffs,
conflicts, status — as ordinary tables you can `SELECT` and `JOIN`.
Per-user-table tables (e.g. `dolt_diff_$TABLENAME`) substitute the user
table's name for `$TABLENAME`. Full details:
[System Tables](/reference/version-control/dolt-system-tables).

| Name | Description |
|------|-------------|
| [`dolt_blame_$tablename`](/reference/version-control/dolt-system-tables#dolt_blame_usdtablename) | Last-modifying commit for each row of a user table. |
| [`dolt_branch_control`](/reference/server/branch-permissions#dolt_branch_control) | Per-user branch-modification permission rules. |
| [`dolt_branch_namespace_control`](/reference/server/branch-permissions#dolt_branch_namespace_control) | Per-user rules for which branch names a user may create. |
| [`dolt_commit_diff_$TABLENAME`](/reference/version-control/dolt-system-tables#dolt_commit_diff_usdtablename) | Row-level diff for a user table between two specific commits. |
| [`dolt_conflicts_$TABLENAME`](/reference/version-control/dolt-system-tables#dolt_conflicts_usdtablename) | Row-level conflicts for a single user table during an active merge. |
| [`dolt_constraint_violations_$TABLENAME`](/reference/version-control/dolt-system-tables#dolt_constraint_violations_usdtablename) | Row-level constraint violations for a single user table. |
| [`dolt_diff_$TABLENAME`](/reference/version-control/dolt-system-tables#dolt_diff_usdtablename) | Row-level history of a single user table. |
| [`dolt_history_$TABLENAME`](/reference/version-control/dolt-system-tables#dolt_history_usdtablename) | A user table's contents as of every commit in history. |
| [`dolt_ignore`](/reference/version-control/dolt-system-tables#dolt_ignore) | Table-name patterns that should be ignored from staging. |
| [`dolt_schemas`](/reference/version-control/dolt-system-tables#dolt_schemas) | Stored schema fragments (views, triggers, events). |
| [`dolt_statistics`](/reference/version-control/dolt-system-tables#dolt_statistics) | Index histograms used by the query planner. |
| [`dolt_workspace_$TABLENAME`](/reference/version-control/dolt-system-tables#dolt_workspace_usdtablename) | Per-user-table view of pending modifications in the working set. |

## System Variables

Session and global settings that change Doltgres's behavior. Full
details: [System
Variables](/reference/version-control/dolt-sysvars).

| Name | Description |
|------|-------------|
| [`dolt_allow_commit_conflicts`](/reference/version-control/dolt-sysvars#dolt_allow_commit_conflicts) | Permit committing a working set with unresolved conflicts. |
| [`dolt_async_replication`](/reference/version-control/dolt-sysvars#dolt_async_replication) | Push to the replication remote asynchronously instead of synchronously. |
| [`dolt_force_transaction_commit`](/reference/version-control/dolt-sysvars#dolt_force_transaction_commit) | Force the transaction commit even when it would violate constraints. |
| [`dolt_log_level`](/reference/version-control/dolt-sysvars#dolt_log_level) | Doltgres's server-side log verbosity. |
| [`dolt_override_schema`](/reference/version-control/dolt-sysvars#dolt_override_schema) | Use a specific schema name regardless of the working-set HEAD. |
| [`dolt_read_replica_force_pull`](/reference/version-control/dolt-sysvars#dolt_read_replica_force_pull) | Force read replicas to fast-forward even on history divergence. |
| [`dolt_read_replica_remote`](/reference/version-control/dolt-sysvars#dolt_read_replica_remote) | Configure this server as a read replica of the named remote. |
| [`dolt_replicate_all_heads`](/reference/version-control/dolt-sysvars#dolt_replicate_all_heads) | Replicate every branch instead of an explicit list. |
| [`dolt_replicate_heads`](/reference/version-control/dolt-sysvars#dolt_replicate_heads) | Comma-separated list of branches to replicate. |
| [`dolt_replicate_to_remote`](/reference/version-control/dolt-sysvars#dolt_replicate_to_remote) | Configure this server as a primary that replicates to the named remote. |
| [`dolt_replication_remote_url_template`](/reference/version-control/dolt-sysvars#dolt_replication_remote_url_template) | URL template used when replicating to dynamically-named remotes. |
| [`dolt_show_branch_databases`](/reference/version-control/dolt-sysvars#dolt_show_branch_databases) | List one virtual database per branch in `SHOW DATABASES`. |
| [`dolt_show_system_tables`](/reference/version-control/dolt-sysvars#dolt_show_system_tables) | Include `dolt_*` system tables in `SHOW TABLES`. |
| [`dolt_skip_replication_errors`](/reference/version-control/dolt-sysvars#dolt_skip_replication_errors) | Don't fail commits when replication to the remote fails. |
| [`dolt_transaction_commit`](/reference/version-control/dolt-sysvars#dolt_transaction_commit) | Automatically create a Doltgres commit at the end of each SQL transaction. |
| [`dolt_transaction_commit_message`](/reference/version-control/dolt-sysvars#dolt_transaction_commit_message) | Message used for auto-generated transaction commits. |

<!--
Maintenance: this page is a hand-curated index. When you add a new
function, system table, or system variable to the dedicated docs in
this directory, please add it here as well so this index stays
canonical.
-->
