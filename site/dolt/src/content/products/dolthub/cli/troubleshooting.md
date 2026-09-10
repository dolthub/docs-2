---
title: "Troubleshoot dh"
description: "Resolve installation, authentication, database selection, SQL, and import errors."
---

## Command not found or wrong version

Run `command -v dh` on Linux/macOS or `Get-Command dh` in PowerShell. Confirm the directory containing the intended executable is on `PATH`, then open a new terminal and run `dh version`. See [Installation](/products/dolthub/cli/installation).

## Browser login refuses to start

If the error says `DH_TOKEN` is set, unset it before `dh auth login`. Token authentication and browser credential storage are separate modes. In Docker, use `DH_TOKEN`; run browser login with the native CLI.

## Authentication fails or uses the wrong account

```bash
dh auth status
dh config list
```

`DH_TOKEN` overrides saved credentials, and `DH_HOST` overrides the saved host. Check both before logging in again. A custom `DH_OAUTH_CLIENT_ID` must match the client that issued the credentials. For ordinary production login, unset unnecessary overrides and use `dh auth login --hostname www.dolthub.com`.

A `403` means the authenticated identity lacks permission. Check the database's [permissions](/concepts/dolthub/permissions), not just whether login succeeded.

## Could not determine a database

Supply the database explicitly:

```bash
dh db view --db OWNER/people
```

Or save it with `dh config set db OWNER/people`. Remote discovery requires `dolt` and a local repository with a recognized DoltHub remote. Multiple candidates require a choice; scripts should provide `--db`. See [Configuration](/products/dolthub/cli/configuration).

## A command is using the wrong database

`DH_DB` overrides the saved database, and both override local remote discovery. Explicit `--db` takes precedence over all three. `DH_REPO` remains accepted as a compatibility alias for `DH_DB`, but `DH_DB` wins when both are set. `dh config list` shows environment/config values but does not resolve local remotes.

## SQL flags are rejected

Reads require `--ref`. Writes require `--write --branch`. Do not mix `--ref`, `--limit`, or `--timeout` with write mode. Query arguments and `--file` are mutually exclusive. See [SQL modes](/products/dolthub/cli/guides/sql#read-and-write-options).

## JSON field is unknown or unavailable

Use a field listed in the command reference. SQL reads return query fields such as `columns,rows,status`; writes return job fields such as `id,status,result`. For acceptance without waiting, use `--no-wait --json id,href`. Most `--jq` and `--template` flags require `--json`; `dh api` is the exception.

## An import fails

Check the target branch, input format, regular-file requirement, and 1 GiB size limit. The default mode creates a table; use an existing-table mode when the table already exists. JSON requires `--update` or `--replace`. In Docker, use the file's mounted container path and ensure UID 1001 can read it.

Expired or failed uploads cannot resume. After an ambiguous submission failure, use `dh job list --db OWNER/DATABASE` before retrying. See [import recovery](/products/dolthub/cli/guides/table-imports#completion-and-recovery).

## A wait was interrupted

The remote job may still be running. Find it with `dh job list`, inspect it with `dh job view JOB_ID`, or resume waiting with `dh job watch JOB_ID`. Use the host where the job was submitted. A successful submission is not the same as a successful job.

## Report a problem

Include `dh version`, your operating system, the command with credentials removed, and the error message when opening an issue in [dolthub/cli](https://github.com/dolthub/cli/issues). Include a job ID when relevant, but do not include tokens or credential files.
