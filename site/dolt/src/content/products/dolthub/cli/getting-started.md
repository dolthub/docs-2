---
title: "Get Started with dh"
description: "Log in, create a DoltHub database, write sample data, and query it with dh."
---

This walkthrough creates a private `people` database in your DoltHub account. You need a [DoltHub account](https://www.dolthub.com), permission to create a private database, and [dh installed](/products/dolthub/cli/installation).

Replace `OWNER` in every command with your DoltHub username. Use a new database name if `people` already exists. The SQL commands below use the `main` branch; substitute your database's branch name if it differs.

## Log in

```bash
dh auth login
dh auth status
```

The first command opens your browser. After approving access, return to the terminal. `auth status` shows the account and host in use. See [Authentication](/products/dolthub/cli/authentication) for token-based use.

## Create a database

```bash
dh db create OWNER/people --private
```

The command prints the database identifier and its web URL. To create a public database instead, choose `--public` when creating it.

## Add a table and rows

Create a small table:

```bash
dh sql --write --db OWNER/people --branch main \
  "CREATE TABLE people (id INT PRIMARY KEY, name VARCHAR(100), city VARCHAR(100))"
```

Then add two rows:

```bash
dh sql --write --db OWNER/people --branch main \
  "INSERT INTO people VALUES (1, 'Ada', 'London'), (2, 'Grace', 'New York')"
```

Each write runs as a DoltHub job. By default, `dh` waits for it to finish and prints its status. Wait for a successful result before running the next command. These remote SQL writes commit their changes on DoltHub; you do not need to run a local `dolt commit` or `dolt push`.

## Query the data

```bash
dh sql --db OWNER/people --ref main \
  "SELECT id, name, city FROM people ORDER BY id"
```

You should see Ada and Grace with their cities. A read query uses `--ref` to select a branch, tag, or commit; a write uses `--write` and `--branch` to select its target.

For structured results:

```bash
dh sql --db OWNER/people --ref main \
  "SELECT id, name FROM people ORDER BY id" --json columns,rows,status
```

## Open the database

```bash
dh browse --db OWNER/people
```

To avoid repeating `--db`, save a default with `dh config set db OWNER/people`. Explicit `--db` flags override that default; [Configuration](/products/dolthub/cli/configuration) explains the full selection order.

Next, [make a change through a pull request](/products/dolthub/cli/guides/pull-requests), [import a file](/products/dolthub/cli/guides/table-imports), or explore the [command reference](/products/dolthub/cli/commands).
