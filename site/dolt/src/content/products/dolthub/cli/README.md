---
title: "DoltHub CLI"
description: "Manage DoltHub databases, run SQL, import tables, and review changes from your terminal."
---

`dh` is the command-line interface for DoltHub. Use it to query databases, upload data, manage pull requests, and automate DoltHub workflows from your terminal.

[Install dh](/products/dolthub/cli/installation), then follow [Getting Started](/products/dolthub/cli/getting-started) to create and query a small database.

## dh and dolt

| Tool | Use it for |
| --- | --- |
| `dh` | Work with databases hosted on DoltHub through its API: SQL, imports, forks, pull requests, tags, and releases. |
| `dolt` | Run the database locally, start a SQL server, and clone, commit, push, or pull database changes. |

You can use `dh` without a local clone or a running SQL server. If you already have a Dolt repository, `dh` can discover its DoltHub database from the local remotes. Logging in to `dh` and configuring [Dolt credentials](/cli-reference/cli#dolt-login) are separate steps.

## Choose a workflow

- [Query and write SQL](/products/dolthub/cli/guides/sql): query a branch, tag, or commit, or write changes to a branch.
- [Import a table](/products/dolthub/cli/guides/table-imports): upload CSV, PSV, XLSX, or JSON data.
- [Review changes with pull requests](/products/dolthub/cli/guides/pull-requests): make a change on a branch and merge it after review.
- [Tag data and create releases](/products/dolthub/cli/guides/releases): name a dataset version and describe it for other users.
- [Automate with dh](/products/dolthub/cli/guides/automation): use tokens, structured output, and asynchronous operations in scripts.
- [Run in Docker](/products/dolthub/cli/guides/docker): run the CLI in a container with mounted input files.

## Reference and help

The [command reference](/products/dolthub/cli/commands) groups commands by task, with a section for every subcommand. For help matching your installed binary, run:

```bash
dh version
dh --help
dh pr create --help
```

See [Authentication](/products/dolthub/cli/authentication), [Configuration](/products/dolthub/cli/configuration), or [Troubleshooting](/products/dolthub/cli/troubleshooting) for setup and common errors. Source and issue reporting are in [dolthub/cli](https://github.com/dolthub/cli); available downloads and release notes are on [GitHub Releases](https://github.com/dolthub/cli/releases).
