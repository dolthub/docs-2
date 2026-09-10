---
title: "Configure dh"
description: "Select a DoltHub host and database, save defaults, and understand environment overrides."
---

## Select a database

Database commands accept `--db OWNER/DATABASE`, or the short form `-R`. Include a host when needed: `--db HOST/OWNER/DATABASE`.

```bash
dh db view --db OWNER/people
dh config set db OWNER/people
dh db view
```

The selection order is:

1. An explicit `--db` value, or a positional database argument on commands that accept one.
2. `DH_DB` in the environment.
3. The saved `db` setting.
4. DoltHub remotes in the current local Dolt repository.

For example, `dh db view OWNER/people` supplies the same selection as `dh db view --db OWNER/people`. Do not supply both forms to the same command.

Remote discovery invokes `dolt remote -v`, so it requires a local `dolt` installation. One matching DoltHub remote selects that database. Multiple candidates prompt interactively; noninteractive commands require an explicit selection. Using `--db` works outside a clone and without `dolt` installed.

## Select a host

```bash
dh config set host www.dolthub.com
dh config get host
```

`DH_HOST` overrides the saved host; otherwise the default is `www.dolthub.com`. Commands with `--hostname` let you select the host for that invocation. A host-qualified database selector selects the API host for that database command.

Job commands that take an ID use the configured host rather than a database selector. When watching work submitted to a custom host, set `DH_HOST` to that host too.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DH_HOST` | Default DoltHub host for the current process. |
| `DH_DB` | Default database, in `[HOST/]OWNER/DB` form. |
| `DH_TOKEN` | Authentication token; overrides saved credentials. |
| `DH_OAUTH_CLIENT_ID` | Override the public OAuth client ID for custom-client or custom-host login. |

For one Bash command:

```bash
DH_DB=OWNER/people dh sql --branch main "SELECT COUNT(*) FROM people"
```

`DH_REPO` remains accepted as a compatibility alias for `DH_DB`. When both are set, `DH_DB` takes precedence.

To return to saved defaults, unset the environment overrides:

```bash
unset DH_HOST DH_DB
```

## Inspect saved and effective settings

```bash
dh config list
dh config get db
```

`config list` shows the effective `host` and `db` values and their sources. It does not discover local remotes. The supported writable keys are `host` and `db`; `repo` remains accepted as an alias for `db`. There is no `config unset` command. You can select another saved value or use an explicit selector for one invocation.

Settings live in `dh/config.json` beneath the [platform config directory](/products/dolthub/cli/authentication#credential-locations). See [dh config](/products/dolthub/cli/commands/config) for command details.
