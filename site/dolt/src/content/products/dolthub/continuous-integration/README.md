---
title: "DoltHub/DoltLab Continuous Integration (CI)"
---

# DoltHub/DoltLab Continuous Integration (CI)

DoltHub and DoltLab support continuous integration (CI) testing which allow you to validate changes before you commit them on your primary branch.&#x20;

Continuous integration (CI) testing originated as a software development best practice where automated tests run against incoming code changes pushed by software developers who are collaborating on a code repository. 

If a developer pushes changes that fail to pass the automated tests, the proposed changes are rejected. This practice ensures that only valid, high quality changes get committed on the primary build branch, resulting in fewer bugs, and higher developer productivity.

Dolt's revolutionary technology that marries Git and MySql now allows for CI testing on data and is supported on both DoltHub and DoltLab. In the same way the proposed code changes undergo automated tests to ensure they're valid, proposed data changes on a DoltHub or DoltLab database can also undergo automated tests to assert their validity.

The following sections will introduce you to how CI works with Dolt, DoltHub and DoltLab and help you setup CI testing for your own databases.

# CI starts with Dolt

CI configuration for a DoltHub or DoltLab database is stored in the database itself. At the time of this writing, in order to add CI configuration to a DoltHub or DoltLab database, you will need to have a local Dolt client version >= [v1.45.3](https://github.com/dolthub/dolt/releases/tag/v1.45.3) and will have to clone a copy of the the database. In order to configure CI on the database, you will use Dolt's CI CLI commands.

## Dolt CI Commands

The primary interface for creating and editing CI configuration in a Dolt database is via the `dolt ci` CLI command. These commands aim to simplify CI configuration in Dolt, so that users do not need to manually interact with the underlying CI tables directly.

The `dolt ci` commands as of Dolt v1.45.3 are:

- [dolt ci init](../../../reference/cli/cli.md#dolt-ci-init). This command creates internal database tables used to store continuous integration configuration.
- [dolt ci destroy](../../../reference/cli/cli.md#dolt-ci-destroy). This command drops all database tables used to store continuous integration configuration.
- [dolt ci import](../../../reference/cli/cli.md#dolt-ci-import). This command will import a Dolt continuous integration workflow file into the database.
- [dolt ci export](../../../reference/cli/cli.md#dolt-ci-export). This command will export a Dolt continuous integration workflow by name.
- [dolt ci ls](../../../reference/cli/cli.md#dolt-ci-ls). This command lists existing Dolt continuous integration workflows by name.
- [dolt ci remove](../../../reference/cli/cli.md#dolt-ci-remove). This command removes a Dolt continuous integration workflow by name.

The `dolt ci init` command is the starting point for adding CI to a Dolt database, since it creates the underlying tables Dolt needs to begin storing configuration. To get started adding CI to a Dolt database, follow our [getting started guide]().

# Workflows

Borrowing from [GitHub Actions](https://github.com/features/actions) terminology, Dolt CI configuration is also defined as _workflows_ and follows their same general syntax and definitions. Workflows are yaml files that define when CI on a database should run, and what should happen during the course of that run. Though workflows in Dolt are defined and edited as files, Dolt does not store these files directly. Instead, it parses these files and only stores the relevant content of each file in its internal CI tables. These tables are then read by DoltHub and DoltLab to enact the defined CI runs.

More specifically, a workflow file specifies _when_ it should run, by the Events defined in it, and _what_ should happen during the run by the Jobs defined in it.

# Events

Events are specific activities that occur in a DoltHub or DoltLab database that trigger a workflow to run. One such event might be the pushing of a branch to the database, known as a `push` event, or the opening of a pull request on a database, a `pull_request` event. When these events occur on a database that contains a workflow that specifies it should run on these events, DoltHub and DoltLab run them.

For a complete list of events that trigger workflows, please see the [workflow reference](./reference.md).

# Jobs

In addition to Events, A workflow file also contains Jobs. In the context of a workflow, Jobs define what should happen when a workflow runs. This definition consists of a series of programmatic Steps that DoltHub or DoltLab will execute during the course of a workflow run. These workflow Jobs are somewhat related to DoltHub and DoltLab _Jobs_, although at this time their relationship has no direct impact on the end-user.

These DoltHub/DoltLab Jobs, are the automated asynchronous machinery that allow DoltHub and DoltLab to run long running processes to do programmatic work outside of its main API. These come in different types and depending on their type, do things like merge pull requests, or import a file uploaded by a user into a database. With the addition of CI on DoltHub and DoltLab, a new type of Job was added, a Dolt CI Job. This is the type of DoltHub/DoltLab Job executes a workflow Job as it is defined in the workflow file.

# Steps

A workflow Job is made up of a series of Steps. A step, in its current form, is a single Saved Query that will run against the database as the "check", or test, that asserts the database branch's validity. Steps run in the order they're defined and will "pass", or succeed, if the Saved Query they execute completes without error and if the defined expected SQL results match the actual SQL results returned from the Saved Query.

For more information on Steps, please see the [workflow reference](./reference.md).

## Saved Query

A [Saved Query](../../../reference/sql/version-control/saved-queries.md) is a SQL query that is stored and versioned in a Dolt database. For the purpose of DoltHub and DoltLab CI, this allows users to write a SQL query that will be executed on command at a later time, during a CI run.

For example, take the simple SQL query "show tables;". This can be added to a Dolt database as a saved query using the [dolt sql command](../../../reference/cli/cli.md#dolt-sql) with the `--save` flag.

```bash
$ dolt sql --save "Show tables query" -q "show tables;"
```

The query is saved under the name "Show tables query", and can be executed at anytime with the `-x` flag.

```bash
$ dolt sql -x "Show tables query"
```

In a Dolt CI workflow file, this saved query can be reference by name as a Step during the execution of a workflow Job.

```yaml
name: example workflow
on: push
  branches: [main]
jobs:
  - name: example job
    steps:
      - name: step 1
        saved_query_name: "Show tables query"
```

During the execution of the example workflow defined above, the "Show tables query" will be executed whenever the "example job" runs. This will result in the SQL query "show tables;" running against the database.

Saved queries are currently the primary method for defining tests or checks on a Dolt database.

For more information on Saved Query Steps, please see the [workflow reference](./reference.md). 