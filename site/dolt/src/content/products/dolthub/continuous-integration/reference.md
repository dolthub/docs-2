---
title: Workflow Reference
---

Workflows are yaml files stored in a Dolt database that specify one or more CI Jobs and identify when those Job(s) should run.

```yaml
name: "workflow name"
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
jobs:
  - name: "job name"
    steps:
      - name: "step name"
        saved_query_name: "saved query name"
        expected_rows: "== 2"
        expected_columns: "== 1"
```

# name

_String_. The case-insensitive name of the workflow, must be unique. Required.

# on

`on` identifies the events that should trigger the workflow to run. Required.

# on.push

Runs workflow whenever a `push` event occurs. Optional.

A `push` event refers to a branch head update on the remote database, usually following the [dolt push](../../../reference/cli/cli.md#dolt-push) command.

# on.pull_request

Runs workflow whenever a `pull_request` event occurs. Optional.

A `pull_request` event refers to any "activity" or action involving a pull request on the remote database. Activities on pull request might include, but are not limited to, opening a pull request, closing a pull request, or synchronizing a pull request.

# on.<push|pull_request>.branches

_List_ _of_ _Strings_. The `branches` filter indicates which branch(es) should cause the workflow to run. Required.

For example, if the `main` branch is listed under `on.push.branches`, then only a push to `main` will trigger the workflow to run.

In the case of `on.pull_request.branches`, branches listed refer to the base branch of the pull request. If `main` is specified as a branch in this case, a pull request opened with `main` as its base branch will trigger the workflow.

# on.pull_request.activities

_List_ _of_ _Strings_. The `activities` filter indicates which pull request activity types should trigger a workflow. Optional.

Supported types as of Dolt v1.45.3 are:

- opened
- closed
- reopened

# jobs

`jobs` specifies one or more Jobs a workflow should run when it is triggered. Required.

# jobs.name

_String_. The case-insensitive name of a job, must be unique. Required.

# jobs.steps

`steps` are a sequence of checks or tests to execute against the database during a workflow run. Required.

Steps run in the order they are defined.

# jobs.steps.name

_String_. The case-insensitive name of a step, must be unique. Required.

# jobs.steps.saved_query_name

_String_. The name of the [saved query](../../../reference/sql/version-control/saved-queries.md) that should be executed during the workflow run. Required.

# jobs.steps.expected_rows

_String_. The number of expected rows resulting from the execution of the named saved query. Optional.

This should be in the format: `<comparator> <number>`, for example, `!= 15`. Valid comparators are:

- == for equals
- \!= for not equals
- &gt; for greater than
- &gt;= for greater than or equal to
- &lt; for less than
- <= for less than or equal to

# jobs.steps.expected_columns

_String_. The number of expected columns resulting from the execution of the named saved query. Optional.

This should be in the format: `<comparator> <number>`, for example, `!= 15`. Valid comparators are:

- == for equals
- \!= for not equals
- &gt; for greater than
- &gt;= for greater than or equal to
- &lt; for less than
- <= for less than or equal to
