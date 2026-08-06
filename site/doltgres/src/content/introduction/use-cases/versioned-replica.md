---
title: Versioned Postgres Replica
description: Running Doltgres as a replica of Postgres to get history and point-in-time snapshots without changing your primary.
---

## Problem

* Is your production Postgres vulnerable to data loss? 
* If an operator runs a bad query, script, or deployment can your production Postgres be down for hours or days as you recover data from backups or logs?
* Are you worried your backups aren't working?
* Does internal audit want an immutable log of what changes on your Postgres instance?
* Do you want the ability to copy and sync your production Postgres database for analytics, development, or debugging?

## Doltgres solves this by…

Because Doltgres is [Postgres-compatible](/reference/benchmarks/correctness), you can set Doltgres up as [a versioned replica](/guides/replication-from-postgres) of your Postgres primary using Postgres's built-in logical replication. Doltgres subscribes to a publication on your primary, and with the `behavior.dolt_transaction_commit` setting enabled, every transaction on your primary becomes a [Dolt commit](/concepts/git/commits) on the Doltgres replica. 

On your Doltgres replica, you get a full, immutable, queryable audit log of every cell in your database. If an auditor wants guarantees that a cell in your database has not been modified, you can use Doltgres to prove it. [Diffs](/concepts/git/diff) can be produced for every transaction.

If an operator makes a bad query, runs a bad script, or makes a bad deployment, you have an additional tool beyond backups and logs to restore production data. Find the bad transactions using Doltgres's audit capabilities. Rollback the bad individual transactions. [Produce a SQL patch](/reference/version-control/dolt-sql-functions#dolt_patch) and apply that back to your primary. If there are conflicting writes, Doltgres will surface those for you and you can decide how to proceed. A Doltgres replica becomes an essential part of your disaster recovery plan, shortening some outages by hours or days or recovering lost production data.

Moreover, Doltgres can be added to your serving path as a read-only Postgres replica, so you know that it is always in sync with your primary. Your disaster recovery instance can serve production traffic so you always know it's working. Note that Doltgres can only subscribe to a publication on your primary; it cannot act as a publisher itself.

Additionally, a Doltgres replica can be easily cloned (ie. copied) to a developer's machine for debugging purposes. See a data issue in production? Debug locally on your laptop safely.

## Doltgres replaces...

## Backups and Transaction Logs

Doltgres as a versioned replica becomes your first line of defense against a bad operator query, script, or deployment. Doltgres is online and contains the full history of your database. In a disaster you can use diffs to find a bad query and roll it back. Then you can produce a database patch and apply it to production. You do not need to reinstall from a backup and replay the write-ahead log to the point of the failure, an extremely time consuming process.

## Change Data Capture

[Change Data Capture](https://www.dolthub.com/blog/2023-03-01-change-data-capture/) is a way to add a history of data changes to an existing database. Modern change data capture tools consume logical replication streams to produce database changes in a consumable stream. Doltgres can consume the same stream producing a simpler change data capture solution. 

## Case Studies

Let us know if you would like us to feature your use of Doltgres as a versioned Postgres replica here.

## Related Articles

* [Writing a Postgres Logical Replication System in Golang](https://www.dolthub.com/blog/2024-03-08-postgres-logical-replication/)
* [Announcing Postgres to Doltgres Replication](https://www.dolthub.com/blog/2024-04-23-announcing-postgres-to-doltgres-replication/)
