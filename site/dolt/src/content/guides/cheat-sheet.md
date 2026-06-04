---
title: Dolt Cheat Sheet
description: The commands you'll actually use day to day, on one page.
---

This cheat sheet briefly summarizes the main version-control features of Dolt with simple
examples. Most commands can be executed on the command line or in a SQL session. Most Dolt commands
take the same options as Git commands.

Click links in the comments section to read docs for the feature.

## Setup and init

| SQL server                                       | Dolt CLI                                | Comments                                                                                                                            |
| ---                                              | -----                                   | --------                                                                                                                            |
| `CREATE DATABASE mydb;`                          | `dolt init`                             | Creates a new Dolt database                                                                                                         |
| `CALL DOLT_CLONE('post-no-preference/options');` | `dolt clone post-no-preference/options` | [Clones the `post-no-preference/options` database from DoltHub](/sql-reference/version-control/dolt-sql-procedures#dolt_clone) |

## Stage and snapshot

| SQL server                             | Dolt CLI                     | Comments                                                                                                            |
| ---                                    | -----                        | --------                                                                                                            |
| `CALL DOLT_ADD('myTable');`            | `dolt add myTable`           | [Adds a table to the staging area](/sql-reference/version-control/dolt-sql-procedures#dolt_add)                |
| `CALL DOLT_RESET();`                   | `dolt reset`                 | [Removes staged tables, keeps working changes](/sql-reference/version-control/dolt-sql-procedures#dolt_reset)  |
| `CALL DOLT_RESET('--hard');`           | `dolt reset --hard`          | [Resets all staged and working changes to HEAD](/sql-reference/version-control/dolt-sql-procedures#dolt_reset) |
| `CALL DOLT_COMMIT('-m', 'a commit');`  | `dolt commit -m 'a commit'`  | [Commits staged tables as a new snapshot](/sql-reference/version-control/dolt-sql-procedures#dolt_commit)      |
| `CALL DOLT_COMMIT('-Am', 'a commit');` | `dolt commit -Am 'a commit'` | [Stages and commits all tables](/sql-reference/version-control/dolt-sql-procedures#dolt_commit)                |

## Branch and merge 

| SQL server                              | Dolt CLI                    | Comments                                                                                                          |
| ---                                     | -----                       | --------                                                                                                          |
| `SELECT * FROM dolt_branches;`          | `dolt branch`               | [Lists all branches](/sql-reference/version-control/dolt-system-tables#dolt_branches)                        |
| `CALL DOLT_BRANCH('myBranch');`         | `dolt branch myBranch`      | [Creates a new branch](/sql-reference/version-control/dolt-sql-procedures#dolt_branch)                       |
| `CALL DOLT_CHECKOUT('myBranch');`       | `dolt checkout myBranch`    | [Switches to another branch](/sql-reference/version-control/dolt-sql-procedures#dolt_checkout)               |
| `CALL DOLT_CHECKOUT('-b', 'myBranch');` | `dolt checkout -b myBranch` | [Creates a new branch and switches to it](/sql-reference/version-control/dolt-sql-procedures#dolt_checkout)  |
| `CALL DOLT_MERGE('myBranch');`          | `dolt merge mybranch`       | [Merges a branch into the checked out branch](/sql-reference/version-control/dolt-sql-procedures#dolt_merge) |

## Diffing

| SQL server                                                    | Dolt CLI                            | Comments                                                                                                                      |
| ---                                                           | -----                               | --------                                                                                                                      |
| `SELECT * FROM dolt_diff('HEAD', 'WORKING', 'mytable');`      | `dolt diff mytable`                 | [Shows the working diff for `mytable`](/sql-reference/version-control/dolt-sql-functions#dolt_diff)                      |
| `SELECT * FROM dolt_diff_stat('HEAD', 'WORKING', 'mytable');` | `dolt diff --stat mytable`          | [Shows statistics for the diff of `mytable`](/sql-reference/version-control/dolt-sql-functions#dolt_diff_stat)           |
| `SELECT * FROM dolt_diff('HEAD~', 'HEAD', 'mytable');`        | `dolt diff HEAD~ HEAD mytable`      | [Shows the diff between the last two commits for `mytable`](/sql-reference/version-control/dolt-sql-functions#dolt_diff) |
| `SELECT * FROM dolt_diff('HEAD', 'STAGED', 'mytable');`       | `dolt diff --cached mytable`        | [Shows the staged diff for `mytable`](/sql-reference/version-control/dolt-sql-functions#dolt_diff)                       |
| `SELECT * FROM dolt_diff('branchA', 'branchB', 'mytable');`   | `dolt diff branchA branchB mytable` | [Shows diff between branches two branches for `mytable`](/sql-reference/version-control/dolt-sql-functions#dolt_diff)    |

## Status and logs

| SQL server                                    | Dolt CLI                    | Comments                                                                                                                      |
| ---                                           | -----                       | --------                                                                                                                      |
| `SELECT * FROM dolt_status;`                  | `dolt status`               | [Shows which tables are modified or staged](/sql-reference/version-control/dolt-system-tables#dolt_status)               |
| `SELECT active_branch();`                     | `dolt branch`               | [Shows the checked out branch (marked with `*` on CLI)](/sql-reference/version-control/dolt-sql-functions#active_branch) |
| `SELECT * FROM dolt_log;`                     | `dolt log`                  | [Shows the commit history for the current branch](/sql-reference/version-control/dolt-system-tables#dolt_log)            |
| `SELECT * FROM dolt_log('myBranch');`         | `dolt log myBranch`         | [Shows the commit history for myBranch](/sql-reference/version-control/dolt-sql-functions#dolt_log)                      |
| `SELECT * FROM dolt_log('branchB..branchA');` | `dolt log branchB..branchA` | [Shows the commits on branchA that are not on branchB](/sql-reference/version-control/dolt-sql-functions#dolt_log)       |

## History

History querying is specific to the SQL server and has no command line equivalent.

| SQL server                                                                              | Comments                                                                                                                                              |
| ---                                                                                     | --------                                                                                                                                              |
| `SELECT * FROM mytable AS OF 'HEAD~3';`                                                 | [Selects data from 3 commits ago](/sql-reference/version-control/querying-history#querying-past-snapshots-with-as-of)                            |
| `USE mydb/HEAD~3;`                                                                      | [Sets this session to query data from 3 commits ago](/sql-reference/version-control/querying-history#specifying-a-revision-in-the-database-name) |
| `SELECT * FROM dolt_history_mytable;`                                                   | [Selects every row from `mytable` at every point in history](/sql-reference/version-control/dolt-system-tables#dolt_history_usdtablename)        |
| `SELECT committer FROM dolt_history_mytable where id = 1 order by commit_date LIMIT 1;` | [Selects who first added the row with `id = 1` to `mytable`](/sql-reference/version-control/dolt-system-tables#dolt_history_usdtablename)        |

## Working with remotes

| SQL server                                             | Dolt CLI                          | Comments                                                                                                                        |
| ---                                                    | -----                             | --------                                                                                                                        |
| `CALL DOLT_REMOTE('add', 'myRemote', 'myOrg/myRepo');` | `dolt remote add myRemote/myRepo` | [Adds a new DoltHub remote](/sql-reference/version-control/dolt-sql-procedures#dolt_remote)                                |
| `SELECT * FROM dolt_remotes;`                          | `dolt remote`                     | [Lists remotes](/sql-reference/version-control/dolt-system-tables#dolt_remotes)                                            |
| `CALL DOLT_FETCH();`                                   | `dolt fetch`                      | [Fetches all branches from the remote](/sql-reference/version-control/dolt-sql-procedures#dolt_fetch)                      |
| `CALL DOLT_PULL();`                                    | `dolt pull`                       | [Fetch and merge commits from the remote tracking branch](/sql-reference/version-control/dolt-sql-procedures#dolt_pull)    |
| `CALL DOLT_PUSH('origin', 'myBranch');`                | `dolt push origin myBranch`       | [Push local commits of branch `myBranch` to remote `origin`](/sql-reference/version-control/dolt-sql-procedures#dolt_push) |
| `CALL DOLT_PUSH();`                                    | `dolt push`                       | [Push local commits to the remote tracking branch](/sql-reference/version-control/dolt-sql-procedures#dolt_push)           |

## Advanced use cases

| SQL server                                                                | Dolt CLI                                            | Comments                                                                                                                                                  |
| ---                                                                       | -----                                               | --------                                                                                                                                                  |
| `SELECT HASHOF('main');`                                                  | `dolt show main`                                    | [Shows the commit hash of a ref](/sql-reference/version-control/dolt-sql-functions#hashof)                                                           |
| `SELECT * from dolt_blame_mytable;`                                       | `dolt blame mytable`                                | [Shows who last updated every row of a table](/sql-reference/version-control/dolt-system-tables#dolt_blame_usdtablename)                             |
| `SELECT * FROM dolt_diff('branch1...branch2');`                           | `dolt diff branch1...branch2`                       | [Shows a three-dot diff](/sql-reference/version-control/dolt-sql-functions#dolt_diff)                                                                |
| `CALL DOLT_REVERT('gtfv1qhr5le61njimcbses9oom0de41e');`                   | `dolt revert gtfv1qhr5le61njimcbses9oom0de41e`      | [Creates a new commit which reverts the changes in a prior commit](/sql-reference/version-control/dolt-sql-procedures#dolt_revert)                   |
| `SELECT * FROM DOLT_PATCH('main', 'WORKING');`                            | `dolt patch main`                                   | [Creates SQL statements to apply a diff between two revisions](/sql-reference/version-control/dolt-sql-functions#dolt_patch)                         |
| `SELECT * FROM dolt_conflicts;`                                           | `dolt conflicts cat`                                | [Lists which tables have conflicts after a merge](/sql-reference/version-control/dolt-system-tables#dolt_conflicts)                                  |
| `SELECT * FROM [dolt_conflicts_mytable];`                                 | `dolt conflicts cat mytable`                        | [Lists the rows in conflict for `mytable`](/sql-reference/version-control/dolt-system-tables#dolt_conflicts_usdtablename)                            |
| `CALL DOLT_CONFLICTS_RESOLVE('--theirs', 'mytable');`                     | `dolt conflicts resolve --theirs mytable`           | [Resolves conflicts in `mytable` by taking their changes](/sql-reference/version-control/dolt-sql-procedures#dolt_conflicts_resolve)                 |
| `CALL DOLT_TAG('tag1', 'myBranch');`                                      | `dolt tag tag1 mybranch`                            | [Creates a new tag at the HEAD of `mybranch`](/sql-reference/version-control/dolt-sql-procedures#dolt_tag)                                           |
| `CALL DOLT_CHERRY_PICK('qj6ouhjvtrnp1rgbvajaohmthoru2772');`              | `dolt cherry-pick qj6ouhjvtrnp1rgbvajaohmthoru2772` | [Applies the changes in a commit to the current branch HEAD](/sql-reference/version-control/dolt-sql-procedures#dolt_cherry_pick)                    |
| `SELECT * FROM dolt_schema_diff('main', 'branch1', 'mytable');`           | `dolt diff --schema main branch1 `                  | [Shows schema differences for a table between two commits](/sql-reference/version-control/dolt-sql-functions#dolt_schema_diff)                       |
| `CALL DOLT_VERIFY_CONSTRAINTS();`                                         | `dolt verify-constraints`                           | [Checks for constraint violations (e.g. after checks had been disabled)](/sql-reference/version-control/dolt-sql-procedures#dolt_verify_constraints) |
| `CALL DOLT_GC();`                                                         | `dolt gc`                                           | [Runs garbage collection to compact the size of the database on disk](/sql-reference/version-control/dolt-sql-procedures#dolt_gc)                    |
| `CALL DOLT_REBASE('--interactive', 'main');`                              | `dolt rebase --interactive main`                    | [Begins an interactive rebase session](/sql-reference/version-control/dolt-sql-procedures#dolt_rebase)                                               |
| `SELECT * FROM dolt_reflog('mybranch');`                                  | `dolt reflog mybranch`                              | [Shows the history of a ref, included deleted refs](/sql-reference/version-control/dolt-sql-functions#dolt_reflog)                                   |
| `SELECT * FROM dolt_commit_ancestors where commit_hash = HASHOF('main');` | No equivalent                                       | [Shows the parent commit(s) of a commit](/sql-reference/version-control/dolt-system-tables#dolt_commit_ancestors)                                    |
| `SELECT DOLT_MERGE_BASE('main', 'feature');`                              | `dolt merge-base main feature`                      | [Shows the common ancestor of two commits](/sql-reference/version-control/dolt-sql-functions#dolt_merge_base)                                        |
| `SELECT * FROM dolt_commits;`                                             | No equivalent                                       | [Shows all commits on all branches](/sql-reference/version-control/dolt-system-tables#dolt_commits)                                                  |
| `INSERT INTO dolt_ignore VALUES ("generated_*", true);`                   | No equivalent                                       | [Ignores tables matching `generated*` (won't be added or committed)](/sql-reference/version-control/dolt-system-tables#dolt_ignore)                  |

