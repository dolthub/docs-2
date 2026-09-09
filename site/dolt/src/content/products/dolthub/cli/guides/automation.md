---
title: "Automate with dh"
description: "Use tokens, structured output, exit codes, and asynchronous operations in scripts."
---

For noninteractive use, provide `DH_TOKEN` through your environment or CI secret store, and select a database explicitly with `--db` or `DH_REPO`. See [Authentication](/products/dolthub/cli/authentication#tokens-for-scripts-and-containers).

Supply values that interactive commands would otherwise prompt for. For example, `db create` needs a name and `--public` or `--private`, while `pr create` needs a title, head, and base.

## Structured output

Commands that support `--json` accept a comma-separated field list:

```bash
dh pr list --db OWNER/people --json pull_number,title,state
```

Use `--jq` to select or transform the requested fields, without installing a separate `jq` executable:

```bash
dh pr list --db OWNER/people --json pull_number,title \
  --jq '.[] | [.pull_number, .title] | @tsv'
```

Or use a Go template:

```bash
dh pr list --db OWNER/people --json pull_number,title \
  --template '{{range .}}{{.pull_number}}{{"\t"}}{{.title}}{{"\n"}}{{end}}'
```

For these commands, `--jq` and `--template` require `--json`. Available fields are listed in each [command reference](/products/dolthub/cli/commands). SQL read and write modes support different fields. Prefer JSON over parsing human-readable tables.

## Asynchronous operations

SQL writes, table imports, forks, and PR merges normally wait for completion. With `--no-wait`, they return an accepted operation ID and URL. Acceptance does not mean the change succeeded. Imports still finish uploading before returning that reference.

This Bash script submits an update and waits separately. It assumes the [getting-started database](/products/dolthub/cli/getting-started) and a configured `DH_TOKEN`. Replace `OWNER`:

```bash
#!/usr/bin/env bash
set -euo pipefail

operation_id=$(dh sql --write --db OWNER/people --branch main \
  "UPDATE people SET city = 'Paris' WHERE id = 1" \
  --no-wait --json id --jq .id)

printf 'Submitted operation %s\n' "$operation_id" >&2
dh operation watch "$operation_id" --json id,status,result
```

The script exits on submission or operation failure. Save the operation ID if you need to resume monitoring in another process:

```bash
dh operation list --db OWNER/people
dh operation view OPERATION_ID
dh operation watch OPERATION_ID
```

`view` returns a snapshot; `watch` polls until completion. Both use the configured host. If submission used a host-qualified database on another host, set `DH_HOST` to that same host when viewing or watching its operation.

Stopping a local wait does not cancel the remote operation. After a connection error, inspect the operation or database state before submitting the same write again.

## Pagination

List commands such as `pr list`, `release list`, and `operation list` fetch API pages until reaching their `--limit` (30 by default). Increase that flag when you need more results.

For direct API requests, `dh api --paginate` follows pagination tokens. Add `--slurp` to collect whole page responses into one JSON array; it does not flatten the records inside those responses.

## Direct API requests

`dh api` accesses the [DoltHub v2 API](/products/dolthub/api/v2):

```bash
dh api user --jq '.data.username'
```

Endpoints are relative to `/api/v2/`. The default method is GET, or POST when a nonempty request body is supplied. `--method` overrides it. `--raw-field` sends string JSON values; `--field` recognizes booleans, null, and signed integers. With `--input`, the file becomes the body and additional fields become query parameters.

Unlike structured command output, `dh api --jq` and `--template` operate on the API response without a `--json` flag. See [dh api](/products/dolthub/cli/commands/api#dh-api).

## Output and exit codes

Results go to stdout; diagnostics and operation progress go to stderr. You can redirect stdout to a file while leaving progress visible.

| Code | Meaning |
| --- | --- |
| `0` | Success, including commands that return no matching results. |
| `1` | General failure, including failed asynchronous operations. |
| `2` | Invalid usage or a CLI cancellation error. |
| `4` | Authentication error. |

External-command failures can propagate their own exit codes. Do not assume all process interruptions use the same code. Check the exit status even when JSON or a human-readable result was printed.

For containerized jobs, see [Run dh in Docker](/products/dolthub/cli/guides/docker). This guide covers running the CLI in your scripts; DoltHub's server-side workflow system has its own [Continuous Integration documentation](/products/dolthub/continuous-integration).
