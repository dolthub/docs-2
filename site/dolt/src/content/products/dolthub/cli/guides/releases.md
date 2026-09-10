---
title: "Tag Data and Create Releases"
description: "Create branches, tags, and named releases for versions of a DoltHub database."
---

A branch is a working line of changes. A tag names a particular commit. A release adds a title and notes to a dataset version so other users can understand it.

These commands assume the `OWNER/people` database from [Getting Started](/products/dolthub/cli/getting-started). Replace `OWNER` with your username and choose unused tag names.

## Create a tag

Tag the head of a branch:

```bash
dh tag create v1 --db OWNER/people --from-branch main --message "First dataset"
```

To tag a specific commit, replace `--from-branch main` with `--from-commit COMMIT_SHA`. Branch and tag creation require exactly one source selector. You can also create a branch from a commit with `dh branch create NAME --from-commit COMMIT_SHA --db OWNER/people`.

## Create a release

A release needs a tag, title, and exact target commit SHA. You can obtain the commit from tag creation's JSON output:

```bash
dh tag create v2 --db OWNER/people --from-branch main --json name,commit_sha
```

Copy the returned `commit_sha` into `COMMIT_SHA` below. Save your release notes in `release-notes.md`, then run:

```bash
dh release create v2 --db OWNER/people --target COMMIT_SHA \
  --title "People dataset v2" --notes-file release-notes.md
```

If the tag does not yet exist, add `--create-tag` to create it as part of the release request. `--target` still requires an exact commit SHA, not a branch name. For short notes, use `--notes "Release description"` instead of `--notes-file`; the two flags are mutually exclusive.

## Find and view releases

```bash
dh release list --db OWNER/people
dh release view v2 --db OWNER/people
dh release view v2 --db OWNER/people --web
```

`release list` fetches up to `--limit` releases. Use `--json tag,title,commit_sha` for structured output.

## Read data at a tag

```bash
dh sql --db OWNER/people --ref v2 "SELECT * FROM people ORDER BY id"
```

This queries the tagged version even if `main` has changed since the release. See [dh tag](/products/dolthub/cli/commands/tag) and [dh release](/products/dolthub/cli/commands/release) for command details.
