---
title: "Automate with dh"
description: "Use tokens, structured output, exit codes, and asynchronous jobs in scripts."
---

For noninteractive use, provide `DH_TOKEN` through your environment or CI secret store, and select a database explicitly with `--db` or `DH_DB`. See [Authentication](/products/dolthub/cli/authentication#tokens-for-scripts-and-containers).

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

## Asynchronous jobs

SQL writes, table imports, forks, and PR merges normally wait for completion. With `--no-wait`, they return an accepted job ID and URL. Acceptance does not mean the change succeeded. Imports still finish uploading before returning that reference.

Job IDs in tables, progress messages, and JSON output use the UUID rather than
the fully qualified resource name. Pass that UUID to `dh job view` or
`dh job watch`. The `href` field remains the full polling URL.

This Bash script submits an update and waits separately. It assumes the [getting-started database](/products/dolthub/cli/getting-started) and a configured `DH_TOKEN`. Replace `OWNER`:

```bash
#!/usr/bin/env bash
set -euo pipefail

job_id=$(dh sql --write --db OWNER/people --branch main \
  "UPDATE people SET city = 'Paris' WHERE id = 1" \
  --no-wait --json id --jq .id)

printf 'Submitted job %s\n' "$job_id" >&2
dh job watch "$job_id" --json id,status,result
```

The script exits on submission or job failure. Save the job ID if you need to resume monitoring in another process:

```bash
dh job list --db OWNER/people
dh job view JOB_ID
dh job watch JOB_ID
```

`view` returns a snapshot; `watch` polls until completion. Both use the configured host. If submission used a host-qualified database on another host, set `DH_HOST` to that same host when viewing or watching its job.

Stopping a local wait does not cancel the remote job. After a connection error, inspect the job or database state before submitting the same write again.

## Pagination

List commands such as `pr list`, `release list`, and `job list` fetch API pages until reaching their `--limit` (30 by default). Increase that flag when you need more results.

For direct API requests, `dh api --paginate` follows pagination tokens. Add `--slurp` to collect whole page responses into one JSON array; it does not flatten the records inside those responses.

## Direct API requests

`dh api` accesses the [DoltHub v2 API](/products/dolthub/api/v2):

```bash
dh api user --jq '.data.username'
```

Endpoints are relative to `/api/v2/`. The default method is GET, or POST when a nonempty request body is supplied. `--method` overrides it. `--raw-field` sends string JSON values; `--field` recognizes booleans, null, and signed integers. With `--input`, the file becomes the body and additional fields become query parameters.

Unlike structured command output, `dh api --jq` and `--template` operate on the API response without a `--json` flag. See [dh api](/products/dolthub/cli/commands#dh-api).

## Output and exit codes

Results go to stdout; diagnostics and job progress go to stderr. You can redirect stdout to a file while leaving progress visible.

| Code | Meaning |
| --- | --- |
| `0` | Success, including commands that return no matching results. |
| `1` | General failure, including failed asynchronous jobs. |
| `2` | Invalid usage or a CLI cancellation error. |
| `4` | Authentication error. |

External-command failures can propagate their own exit codes. Do not assume all process interruptions use the same code. Check the exit status even when JSON or a human-readable result was printed.

For containerized jobs, see [Run dh in Docker](/products/dolthub/cli/guides/docker). This guide covers running the CLI in your scripts; DoltHub's server-side workflow system has its own [Continuous Integration documentation](/products/dolthub/continuous-integration).
