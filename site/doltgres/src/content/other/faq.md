---
title: FAQ
description: Common questions about Doltgres.
---

## Why is it called Dolt? Are you calling me dumb?

We named our first version-controlled database `dolt` to pay homage to [how Linus Torvalds named
git](https://en.wikipedia.org/wiki/Git#Naming):

> Torvalds sarcastically quipped about the name git (which means
> "unpleasant person" in British English slang): "I'm an egotistical
> bastard, and I name all my projects after myself. First 'Linux',
> now 'git'."

We wanted a word meaning "idiot", starting with D for Data, short enough to type on the command
line, and not taken in the standard command line lexicon. So, `dolt`. For the Postgres version, it
became Doltgres.

## What's the difference between `COMMIT` and `DOLT_COMMIT()`?

`COMMIT` is a standard SQL statement that commits a transaction. In
dolt, it just flushes any pending changes in the current SQL session
to disk, updating the working set. HEAD stays the same, but your
working set changes. This means your edits will persist after this
session ends.

`DOLT_COMMIT()` commits the current SQL transaction, then creates a
new dolt commit on the current branch. It's the same as if you run
`dolt commit` from the command line.

## I want each of my connected SQL users to get their own branch to make changes on, then merge them back into `main` when they're done making edits. How do I do that?

We are glad you asked! This is a common use case, and giving each user
their own branch is something we've spent a lot of time getting
right. For more details on how to use this pattern effectively, see
[using branches](/sql-reference/version-control/branches).

## Does Doltgres support transactions?

Yes, it should exactly work the same as Postgres, but with fewer locks for competing writes.

It's also possible for different sessions to connect to different
branches on the same server. See [using
branches](/sql-reference/version-control/branches) for details.

## What SQL features / syntax are supported?

Most of them! Check out [the docs for the full list of supported
features](/sql-reference/sql-support/supported-statements).

You can check out what we're working on next on our
[roadmap](/other/roadmap). Paying customers get their feature requests
bumped to the front of the line.

## Does Doltgres support my favorite SQL workbench / tool?

Probably! Have you tried it? We have [blogs and sample code](/guides/dolt-tested-apps)
for many popular ORMs and tools.

If you try it and it doesn't work, [let
us know with an issue](https://github.com/dolthub/dolt/issues) or in
[our Discord](https://discord.gg/s8uVgc3) and we'll [fix it in 24 hours](https://www.dolthub.com/blog/2024-05-15-24-hour-bug-fixes/).

Our goal is to be a 100% drop-in replacement for Postgres.

