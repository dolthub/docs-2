---
title: "Review Changes with dh"
description: "Create a branch, update data, open a pull request, and merge a reviewed change on DoltHub."
---

Start with the `OWNER/people` database and table from [Getting Started](/products/dolthub/cli/getting-started). Replace `OWNER` with your username. You need write access to the database and permission to merge its pull requests.

## Create a feature branch

```bash
dh branch create feature/people --db OWNER/people --from-branch main
```

Branches can start from another branch or an exact commit. Supply exactly one of `--from-branch` and `--from-commit`.

## Make and inspect a change

```bash
dh sql --write --db OWNER/people --branch feature/people \
  "UPDATE people SET city = 'Paris' WHERE id = 1"
dh sql --db OWNER/people --ref feature/people \
  "SELECT * FROM people ORDER BY id"
```

The write commits to the feature branch. The `main` branch keeps its previous data until the change is merged.

## Open a pull request

```bash
dh pr create --db OWNER/people --head feature/people --base main \
  --title "Update Ada's city" --body "Change Ada's city to Paris."
dh pr list --db OWNER/people
```

Use the pull request number returned by `pr create` in place of `NUMBER` below:

```bash
dh pr view NUMBER --db OWNER/people --comments
dh browse NUMBER --db OWNER/people
```

The browser provides the data diff for review. Add a comment from the terminal:

```bash
dh pr comment NUMBER --db OWNER/people --body "Reviewed the city change."
```

For longer descriptions, use `--body-file description.md` instead of `--body`. In scripts, provide `--title`, `--head`, and `--base` explicitly so `pr create` does not need prompts.

## Merge and verify

After review:

```bash
dh pr merge NUMBER --db OWNER/people
dh sql --db OWNER/people --ref main \
  "SELECT city FROM people WHERE id = 1"
```

Merge waits for its job to finish. A successful merge makes the query return `Paris`. If the merge fails, inspect its error and the pull request before retrying. See [asynchronous jobs](/products/dolthub/cli/guides/automation#asynchronous-jobs).

## Contribute from a fork

When contributing to another owner's database, fork it into your account. Replace `UPSTREAM` and `MY_USER` with the respective usernames; this example assumes the source has the same `people` table.

```bash
dh db fork UPSTREAM/people --org MY_USER
dh branch create feature/people --db MY_USER/people --from-branch main
dh sql --write --db MY_USER/people --branch feature/people \
  "UPDATE people SET city = 'Paris' WHERE id = 1"
dh pr create --db UPSTREAM/people --head MY_USER/people:feature/people \
  --base main --title "Update Ada's city" --body "Proposed city correction."
```

The fork command waits for completion before you use the new database. The PR's `--db` selects the **target** database; the `OWNER/DB:BRANCH` form of `--head` selects the source in your fork. An upstream maintainer with the appropriate permissions merges the PR.

## Work from a local clone

You can also create and commit changes locally using `dolt`, push the branch with `dolt push`, then use `dh pr create` to request review on DoltHub. See [DoltHub Data Sharing](/products/dolthub/data-sharing) for that workflow. Local Dolt authentication is separate from `dh auth login`.

For editing, closing, or reopening a PR, see [dh pr](/products/dolthub/cli/commands/pr).
