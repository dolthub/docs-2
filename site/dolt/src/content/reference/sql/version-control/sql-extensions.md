---
title: All SQL Extensions
---

# All SQL Extensions

A flat index of every Dolt-specific SQL extension — every stored procedure,
function, system table, and system variable — on a single page. Press
⌘F / Ctrl-F and search by keyword when you don't know what kind of
construct exposes the feature you're looking for.

The list is grouped by extension kind:

- [Procedures](#procedures) — invoked with `CALL`; each one mirrors a
  `dolt` CLI command and is the only way to perform that operation from a
  SQL session.
- [Functions](#functions) — invoked with `SELECT`; includes both scalar
  functions (return a single value) and table functions (used in a `FROM`
  clause to expose a view of repository state).
- [System tables](#system-tables) — queryable tables that expose
  repository state (commits, diffs, status, conflicts, …).
- [System variables](#system-variables) — session and global settings
  that change Dolt's behavior.

If you'd rather browse by use case, see the [Dolt cheat
sheet](/guides/cheat-sheet).

## Procedures

Stored procedures expose the imperative side of `dolt` — anything that
modifies state (commit, push, merge, branch, etc.). Invoke with `CALL`.
Full details: [Procedures](/sql-reference/version-control/dolt-sql-procedures).

| Name | Description |
|------|-------------|
| [`DOLT_ADD()`](/sql-reference/version-control/dolt-sql-procedures#dolt_add) | Stage working changes for the next commit. |
| [`DOLT_BACKUP()`](/sql-reference/version-control/dolt-sql-procedures#dolt_backup) | Manage backup remotes and run backups. |
| [`DOLT_BRANCH()`](/sql-reference/version-control/dolt-sql-procedures#dolt_branch) | Create, delete, rename, or copy a branch. |
| [`DOLT_CHECKOUT()`](/sql-reference/version-control/dolt-sql-procedures#dolt_checkout) | Switch the session to a different branch, or restore a table from HEAD. |
| [`DOLT_CHERRY_PICK()`](/sql-reference/version-control/dolt-sql-procedures#dolt_cherry_pick) | Apply a single commit from another branch to the current branch. |
| [`DOLT_CLEAN()`](/sql-reference/version-control/dolt-sql-procedures#dolt_clean) | Discard untracked tables in the working set. |
| [`DOLT_CLONE()`](/sql-reference/version-control/dolt-sql-procedures#dolt_clone) | Clone a remote database into the current Dolt environment. |
| [`DOLT_COMMIT()`](/sql-reference/version-control/dolt-sql-procedures#dolt_commit) | Create a new commit from staged changes. |
| [`DOLT_CONFLICTS_RESOLVE()`](/sql-reference/version-control/dolt-sql-procedures#dolt_conflicts_resolve) | Resolve a merge conflict by taking the `--ours` or `--theirs` side. |
| [`DOLT_FETCH()`](/sql-reference/version-control/dolt-sql-procedures#dolt_fetch) | Update remote-tracking refs without merging. |
| [`DOLT_GC()`](/sql-reference/version-control/dolt-sql-procedures#dolt_gc) | Reclaim disk space by removing unreferenced chunks. |
| [`DOLT_MERGE()`](/sql-reference/version-control/dolt-sql-procedures#dolt_merge) | Merge another branch into the current branch. |
| [`DOLT_PULL()`](/sql-reference/version-control/dolt-sql-procedures#dolt_pull) | Fetch from and merge a remote branch in one step. |
| [`DOLT_PURGE_DROPPED_DATABASES()`](/sql-reference/version-control/dolt-sql-procedures#dolt_purge_dropped_databases) | Permanently delete dropped databases held in the recovery area. |
| [`DOLT_PUSH()`](/sql-reference/version-control/dolt-sql-procedures#dolt_push) | Update remote refs with local commits. |
| [`DOLT_REBASE()`](/sql-reference/version-control/dolt-sql-procedures#dolt_rebase) | Replay the current branch's commits on top of a different base. |
| [`DOLT_REMOTE()`](/sql-reference/version-control/dolt-sql-procedures#dolt_remote) | Add, remove, or list named remotes. |
| [`DOLT_RESET()`](/sql-reference/version-control/dolt-sql-procedures#dolt_reset) | Move HEAD (and optionally the working set) to a different commit. |
| [`DOLT_REVERT()`](/sql-reference/version-control/dolt-sql-procedures#dolt_revert) | Create a new commit that undoes a prior commit. |
| [`DOLT_RM()`](/sql-reference/version-control/dolt-sql-procedures#dolt_rm) | Remove a table from the working set. |
| [`DOLT_STASH()`](/sql-reference/version-control/dolt-sql-procedures#dolt_stash) | Save working-set changes to a side stack and restore HEAD. |
| [`dolt_stats_flush()`](/sql-reference/version-control/dolt-sql-procedures#dolt_stats_flush) | Block until in-progress statistics writes have flushed. |
| [`dolt_stats_gc()`](/sql-reference/version-control/dolt-sql-procedures#dolt_stats_gc) | Block until a statistics garbage-collection signal completes. |
| [`dolt_stats_info()`](/sql-reference/version-control/dolt-sql-procedures#dolt_stats_info) | Print the current state of the statistics provider. |
| [`dolt_stats_once()`](/sql-reference/version-control/dolt-sql-procedures#dolt_stats_once) | Run a single statistics collection cycle. |
| [`dolt_stats_purge()`](/sql-reference/version-control/dolt-sql-procedures#dolt_stats_purge) | Clear the stats queue and cache and disable the collector. |
| [`dolt_stats_restart()`](/sql-reference/version-control/dolt-sql-procedures#dolt_stats_restart) | Restart the statistics collector thread. |
| [`dolt_stats_stop()`](/sql-reference/version-control/dolt-sql-procedures#dolt_stats_stop) | Clear the stats queue and stop the collector thread. |
| [`dolt_stats_wait()`](/sql-reference/version-control/dolt-sql-procedures#dolt_stats_wait) | Block on a full statistics queue cycle. |
| [`DOLT_TAG()`](/sql-reference/version-control/dolt-sql-procedures#dolt_tag) | Create, list, or delete a tag at a commit. |
| [`DOLT_UNDROP()`](/sql-reference/version-control/dolt-sql-procedures#dolt_undrop) | Restore a recently dropped database from the recovery area. |
| [`DOLT_UPDATE_COLUMN_TAG()`](/sql-reference/version-control/dolt-sql-procedures#dolt_update_column_tag) | Reassign the internal tag identifier of a column. |
| [`DOLT_VERIFY_CONSTRAINTS()`](/sql-reference/version-control/dolt-sql-procedures#dolt_verify_constraints) | Walk the working set and record any constraint violations. |

## Functions

Functions cover the read side: inspecting repository state, computing
diffs, and looking up identifiers. Invoke scalar functions with
`SELECT … FROM` and table functions in a `FROM` clause. Full details:
[Functions](/sql-reference/version-control/dolt-sql-functions).

| Name | Kind | Description |
|------|------|-------------|
| [`ACTIVE_BRANCH()`](/sql-reference/version-control/dolt-sql-functions#active_branch) | scalar | Name of the session's current branch. |
| [`DOLT_BRANCH_STATUS()`](/sql-reference/version-control/dolt-sql-functions#dolt_branch_status) | table | Per-table modification status for the current branch. |
| [`DOLT_DIFF()`](/sql-reference/version-control/dolt-sql-functions#dolt_diff) | table | Row-level diff between two commits (or two refs) for a given table. |
| [`DOLT_DIFF_STAT()`](/sql-reference/version-control/dolt-sql-functions#dolt_diff_stat) | table | Numeric summary (rows added/modified/removed) of the diff between two commits. |
| [`DOLT_DIFF_SUMMARY()`](/sql-reference/version-control/dolt-sql-functions#dolt_diff_summary) | table | Per-table summary of which tables changed between two commits. |
| [`DOLT_HASHOF()`](/sql-reference/version-control/dolt-sql-functions#dolt_hashof) | scalar | Commit hash of a ref. |
| [`DOLT_HASHOF_DB()`](/sql-reference/version-control/dolt-sql-functions#dolt_hashof_db) | scalar | Hash representing the entire database's working set. |
| [`DOLT_HASHOF_TABLE()`](/sql-reference/version-control/dolt-sql-functions#dolt_hashof_table) | scalar | Hash of a single table's current contents. |
| [`DOLT_JSON_DIFF()`](/sql-reference/version-control/dolt-sql-functions#dolt_json_diff) | scalar | JSON-formatted diff between two JSON values. |
| [`DOLT_LOG()`](/sql-reference/version-control/dolt-sql-functions#dolt_log) | table | Filtered commit log, the function equivalent of `dolt log`. |
| [`DOLT_MERGE_BASE()`](/sql-reference/version-control/dolt-sql-functions#dolt_merge_base) | scalar | Commit hash of the merge base between two refs. |
| [`DOLT_PATCH()`](/sql-reference/version-control/dolt-sql-functions#dolt_patch) | table | SQL patch statements representing the diff between two commits. |
| [`DOLT_PREVIEW_MERGE_CONFLICTS()`](/sql-reference/version-control/dolt-sql-functions#dolt_preview_merge_conflicts) | table | Row-level conflicts a merge would produce, without performing the merge. |
| [`DOLT_PREVIEW_MERGE_CONFLICTS_SUMMARY()`](/sql-reference/version-control/dolt-sql-functions#dolt_preview_merge_conflicts_summary) | table | Per-table conflict counts a merge would produce. |
| [`DOLT_QUERY_DIFF()`](/sql-reference/version-control/dolt-sql-functions#dolt_query_diff) | table | Diff between two query results expressed as rows. |
| [`DOLT_REFLOG()`](/sql-reference/version-control/dolt-sql-functions#dolt_reflog) | table | Local history of ref updates (the `dolt reflog` equivalent). |
| [`DOLT_SCHEMA_DIFF()`](/sql-reference/version-control/dolt-sql-functions#dolt_schema_diff) | table | Schema-only diff between two commits. |
| [`DOLT_TEST_RUN()`](/sql-reference/version-control/dolt-sql-functions#dolt_test_run) | table | Run the configured commit-verification test groups against the working set. |
| [`DOLT_VERSION()`](/sql-reference/version-control/dolt-sql-functions#dolt_version) | scalar | Version string of the running `dolt` binary. |
| [`HAS_ANCESTOR()`](/sql-reference/version-control/dolt-sql-functions#has_ancestor) | scalar | True if one ref is an ancestor of another. |
| [`LAST_INSERT_UUID()`](/sql-reference/version-control/dolt-sql-functions#last_insert_uuid) | scalar | UUID generated by the most recent `INSERT` (Dolt's UUID-column analog of `LAST_INSERT_ID()`). |

## System tables

System tables expose repository state — commits, branches, diffs,
conflicts, status — as ordinary tables you can `SELECT` and `JOIN`.
Per-user-table tables (e.g. `dolt_diff_$TABLENAME`) substitute the user
table's name for `$TABLENAME`. Full details:
[System tables](/sql-reference/version-control/dolt-system-tables).

| Name | Description |
|------|-------------|
| [`dolt_backups`](/sql-reference/version-control/dolt-system-tables#dolt_backups) | Configured backup remotes. |
| [`dolt_blame_$tablename`](/sql-reference/version-control/dolt-system-tables#dolt_blame_usdtablename) | Last-modifying commit for each row of a user table. |
| [`dolt_branch_activity`](/sql-reference/version-control/dolt-system-tables#dolt_branch_activity) | Recent activity timestamps for each branch. |
| [`dolt_branch_control`](/sql-reference/server/branch-permissions#dolt_branch_control) | Per-user branch-modification permission rules. |
| [`dolt_branch_namespace_control`](/sql-reference/server/branch-permissions#dolt_branch_namespace_control) | Per-user rules for which branch names a user may create. |
| [`dolt_branches`](/sql-reference/version-control/dolt-system-tables#dolt_branches) | All local branches with their HEAD hash and commit metadata. |
| [`dolt_column_diff`](/sql-reference/version-control/dolt-system-tables#dolt_column_diff) | Per-column history of which commits touched which column. |
| [`dolt_commit_ancestors`](/sql-reference/version-control/dolt-system-tables#dolt_commit_ancestors) | Parent-commit relationships across the commit graph. |
| [`dolt_commit_diff_$TABLENAME`](/sql-reference/version-control/dolt-system-tables#dolt_commit_diff_usdtablename) | Row-level diff for a user table between two specific commits. |
| [`dolt_commits`](/sql-reference/version-control/dolt-system-tables#dolt_commits) | Every commit in the database with hash, author, message, and timestamp. |
| [`dolt_conflicts`](/sql-reference/version-control/dolt-system-tables#dolt_conflicts) | Per-table conflict counts for the active merge. |
| [`dolt_conflicts_$TABLENAME`](/sql-reference/version-control/dolt-system-tables#dolt_conflicts_usdtablename) | Row-level conflicts for a single user table during an active merge. |
| [`dolt_constraint_violations`](/sql-reference/version-control/dolt-system-tables#dolt_constraint_violations) | Per-table count of constraint violations in the working set. |
| [`dolt_constraint_violations_$TABLENAME`](/sql-reference/version-control/dolt-system-tables#dolt_constraint_violations_usdtablename) | Row-level constraint violations for a single user table. |
| [`dolt_diff`](/sql-reference/version-control/dolt-system-tables#dolt_diff) | Database-wide history of which tables changed in which commits. |
| [`dolt_diff_$TABLENAME`](/sql-reference/version-control/dolt-system-tables#dolt_diff_usdtablename) | Row-level history of a single user table. |
| [`dolt_docs`](/sql-reference/version-control/dolt-system-tables#dolt_docs) | Special `README.md` / `LICENSE.md` contents managed by Dolt. |
| [`dolt_history_$TABLENAME`](/sql-reference/version-control/dolt-system-tables#dolt_history_usdtablename) | A user table's contents as of every commit in history. |
| [`dolt_ignore`](/sql-reference/version-control/dolt-system-tables#dolt_ignore) | Table-name patterns that should be ignored from staging. |
| [`dolt_log`](/sql-reference/version-control/dolt-system-tables#dolt_log) | Commit log table (the system-table form of `dolt log`). |
| [`dolt_merge_status`](/sql-reference/version-control/dolt-system-tables#dolt_merge_status) | State of any in-progress merge on the current branch. |
| [`dolt_nonlocal_tables`](/sql-reference/version-control/dolt-system-tables#dolt_nonlocal_tables) | Tables that live outside the local Dolt repository. |
| [`dolt_procedures`](/sql-reference/version-control/dolt-system-tables#dolt_procedures) | User-defined stored procedures registered in the database. |
| [`dolt_query_catalog`](/sql-reference/version-control/dolt-system-tables#dolt_query_catalog) | Saved queries created with `dolt sql --save`. |
| [`dolt_rebase`](/sql-reference/version-control/dolt-system-tables#dolt_rebase) | Plan/state of an in-progress interactive rebase. |
| [`dolt_remote_branches`](/sql-reference/version-control/dolt-system-tables#dolt_remote_branches) | Remote-tracking branches and their tip commits. |
| [`dolt_remotes`](/sql-reference/version-control/dolt-system-tables#dolt_remotes) | Configured remotes (URLs and fetch specs). |
| [`dolt_schema_conflicts`](/sql-reference/version-control/dolt-system-tables#dolt_schema_conflicts) | Schema-level conflicts produced by an active merge. |
| [`dolt_schemas`](/sql-reference/version-control/dolt-system-tables#dolt_schemas) | Stored schema fragments (views, triggers, events). |
| [`dolt_stashes`](/sql-reference/version-control/dolt-system-tables#dolt_stashes) | Stack of stashed working-set states. |
| [`dolt_statistics`](/sql-reference/version-control/dolt-system-tables#dolt_statistics) | Index histograms used by the query planner. |
| [`dolt_status`](/sql-reference/version-control/dolt-system-tables#dolt_status) | Working-set status (staged / unstaged / untracked). |
| [`dolt_status_ignored`](/sql-reference/version-control/dolt-system-tables#dolt_status_ignored) | Working-set entries hidden by `dolt_ignore`. |
| [`dolt_tags`](/sql-reference/version-control/dolt-system-tables#dolt_tags) | Named refs (tags) defined in the database. |
| [`dolt_tests`](/sql-reference/version-control/dolt-system-tables#dolt_tests) | Commit-verification test groups configured for the database. |
| [`dolt_workspace_$TABLENAME`](/sql-reference/version-control/dolt-system-tables#dolt_workspace_usdtablename) | Per-user-table view of pending modifications in the working set. |

## System variables

Session and global settings that change Dolt's behavior. Most affect
either commit/transaction semantics or replication. Full details:
[System variables](/sql-reference/version-control/dolt-sysvars).

| Name | Description |
|------|-------------|
| [`dolt_allow_commit_conflicts`](/sql-reference/version-control/dolt-sysvars#dolt_allow_commit_conflicts) | Permit committing a working set with unresolved conflicts. |
| [`dolt_async_replication`](/sql-reference/version-control/dolt-sysvars#dolt_async_replication) | Push to the replication remote asynchronously instead of synchronously. |
| [`dolt_author_date`](/sql-reference/version-control/dolt-sysvars#dolt_author_date) | Override the author date stamped on the next commit. |
| [`dolt_author_email`](/sql-reference/version-control/dolt-sysvars#dolt_author_email) | Override the author email on the next commit. |
| [`dolt_author_name`](/sql-reference/version-control/dolt-sysvars#dolt_author_name) | Override the author name on the next commit. |
| [`dolt_commit_verification_groups`](/sql-reference/version-control/dolt-sysvars#dolt_commit_verification_groups) | Test groups that must pass before a commit / merge / rebase is accepted. |
| [`dolt_committer_date`](/sql-reference/version-control/dolt-sysvars#dolt_committer_date) | Override the committer date on the next commit. |
| [`dolt_committer_email`](/sql-reference/version-control/dolt-sysvars#dolt_committer_email) | Override the committer email on the next commit. |
| [`dolt_committer_name`](/sql-reference/version-control/dolt-sysvars#dolt_committer_name) | Override the committer name on the next commit. |
| [`dolt_dont_merge_json`](/sql-reference/version-control/dolt-sysvars#dolt_dont_merge_json) | Treat JSON columns as opaque blobs during three-way merges. |
| [`dolt_force_transaction_commit`](/sql-reference/version-control/dolt-sysvars#dolt_force_transaction_commit) | Force the transaction commit even when it would violate constraints. |
| [`dolt_log_level`](/sql-reference/version-control/dolt-sysvars#dolt_log_level) | Dolt's server-side log verbosity. |
| [`dolt_override_schema`](/sql-reference/version-control/dolt-sysvars#dolt_override_schema) | Use a specific schema name regardless of the working-set HEAD. |
| [`dolt_read_replica_force_pull`](/sql-reference/version-control/dolt-sysvars#dolt_read_replica_force_pull) | Force read replicas to fast-forward even on history divergence. |
| [`dolt_read_replica_remote`](/sql-reference/version-control/dolt-sysvars#dolt_read_replica_remote) | Configure this server as a read replica of the named remote. |
| [`dolt_replicate_all_heads`](/sql-reference/version-control/dolt-sysvars#dolt_replicate_all_heads) | Replicate every branch instead of an explicit list. |
| [`dolt_replicate_heads`](/sql-reference/version-control/dolt-sysvars#dolt_replicate_heads) | Comma-separated list of branches to replicate. |
| [`dolt_replicate_to_remote`](/sql-reference/version-control/dolt-sysvars#dolt_replicate_to_remote) | Configure this server as a primary that replicates to the named remote. |
| [`dolt_replication_remote_url_template`](/sql-reference/version-control/dolt-sysvars#dolt_replication_remote_url_template) | URL template used when replicating to dynamically-named remotes. |
| [`dolt_show_branch_databases`](/sql-reference/version-control/dolt-sysvars#dolt_show_branch_databases) | List one virtual database per branch in `SHOW DATABASES`. |
| [`dolt_show_system_tables`](/sql-reference/version-control/dolt-sysvars#dolt_show_system_tables) | Include `dolt_*` system tables in `SHOW TABLES`. |
| [`dolt_skip_replication_errors`](/sql-reference/version-control/dolt-sysvars#dolt_skip_replication_errors) | Don't fail commits when replication to the remote fails. |
| [`dolt_stats_branches`](/sql-reference/sql-support/miscellaneous#auto-refresh) | Branches whose statistics get auto-collected. |
| [`dolt_stats_enabled`](/sql-reference/sql-support/miscellaneous#disable) | Enable or disable statistics collection. |
| [`dolt_stats_gc_enabled`](/sql-reference/sql-support/miscellaneous#stats-garbage-collection) | Enable or disable the statistics garbage collector. |
| [`dolt_stats_gc_interval`](/sql-reference/sql-support/miscellaneous#stats-garbage-collection) | Interval between statistics GC cycles (default 1 hour). |
| [`dolt_stats_job_interval`](/sql-reference/sql-support/miscellaneous#auto-refresh) | Delay between statistics collection processing steps. |
| [`dolt_stats_memory_only`](/sql-reference/sql-support/miscellaneous#auto-refresh) | Run statistics collection in memory only (no on-disk persistence). |
| [`dolt_stats_paused`](/sql-reference/sql-support/miscellaneous#disable) | Pause the statistics collector without disabling it. |
| [`dolt_transaction_commit`](/sql-reference/version-control/dolt-sysvars#dolt_transaction_commit) | Automatically create a Dolt commit at the end of each SQL transaction. |
| [`dolt_transaction_commit_message`](/sql-reference/version-control/dolt-sysvars#dolt_transaction_commit_message) | Message used for auto-generated transaction commits. |

<!--
Maintenance: this page is a hand-curated index. When you add a new
procedure, function, system table, or system variable to the dedicated
docs in this directory, please add it here as well so this index stays
canonical.
-->
