---
title: "Run SQL with dh"
description: "Read DoltHub data at a branch, tag, or commit and write changes to a selected branch."
---

These examples use the table from [Getting Started](/products/dolthub/cli/getting-started). Replace `OWNER` with your username.

## Read a branch, tag, or commit

```bash
dh sql --db OWNER/people --ref main "SELECT * FROM people ORDER BY id"
```

Every read requires `--ref`. Use a branch name, tag, or commit SHA to select the version you want to query. `--limit` caps returned rows; `--timeout` sets the server-side read timeout, from `1ms` through `60s` in whole milliseconds.

```bash
dh sql --db OWNER/people --ref main --limit 10 --timeout 5s \
  "SELECT * FROM people ORDER BY id"
```

## Read SQL from a file or pipe

Save this as `query.sql`:

```sql
SELECT id, name, city FROM people ORDER BY id;
```

Run it with:

```bash
dh sql --db OWNER/people --ref main --file query.sql
```

Or pipe SQL into the command:

```bash
printf 'SELECT COUNT(*) FROM people;\n' | dh sql --db OWNER/people --ref main
```

`--file -` explicitly reads stdin. A query argument and `--file` are mutually exclusive. Without either, `dh` reads piped stdin; an empty query is rejected.

## Write to a branch

```bash
dh sql --write --db OWNER/people --branch feature/people --from-branch main \
  "UPDATE people SET city = 'Paris' WHERE id = 1"
```

`--write` selects asynchronous write mode. `--branch` is the target, and `--from-branch` supplies the source branch when creating or updating a feature branch. If omitted, the source defaults to the target branch. Use `--file update.sql` for a query stored in a file.

The command waits for the write job and prints its result. To submit and return immediately after acceptance, add `--no-wait`; then use [dh job watch](/products/dolthub/cli/commands/job#dh-job-watch) with the returned ID.

## Read and write options

| Mode | Required | Additional options |
| --- | --- | --- |
| Read | `--ref` | `--limit`, `--timeout` |
| Write | `--write`, `--branch` | `--from-branch`, `--no-wait` |

Read options cannot be used in write mode, and write options cannot be used in read mode. The branch/reference selection is explicit even when you have configured a default database.

## Structured results and failures

```bash
dh sql --db OWNER/people --ref main "SELECT id, name FROM people ORDER BY id" \
  --json columns,rows,status
```

Read output can include `columns`, `rows`, `status`, `message`, and `warnings`. Rows are arrays aligned with the column metadata. Writes return job fields instead. For acceptance without waiting, use `--no-wait --json id,href`; for completed writes, use fields such as `id,status,result`.

A failed query or failed write job returns a nonzero exit code, even when output was printed. Read warnings go to stderr in human-readable mode. Scripts should check the exit code as well as any JSON they consume. See [Automate with dh](/products/dolthub/cli/guides/automation) and the complete [dh sql reference](/products/dolthub/cli/commands/sql#dh-sql).
