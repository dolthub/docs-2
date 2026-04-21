---
title: Relational Database Management System
---

# RDBMS

Doltgres can be used as a Relational Database Management System or RDBMS. Doltgres ships with [a
Postgres compatible server](/concepts/rdbms/server) built in, accessed via the `doltgres`
command.

Doltgres supports [backups](/concepts/rdbms/backups). There are two options for backups:
[remotes](/concepts/git/remotes) or [backups](/concepts/rdbms/backups). Pushing to a remote only backs up committed
changes. Using `dolt backup` backs up uncommitted changes as well. Backups are accessed via the
[dolt_backup() function](/reference/version-control/dolt-sql-functions#doltbackup).

Doltgres leverages Git-style [remotes](/concepts/git/remotes) to facilitate replication. The master and
replicas configure the same remote. On the master, you configure "push on write" and on the replicas
you configure "pull on read".
