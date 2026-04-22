---
title: Garbage Collection
---

# Garbage Collection

# How garbage is created

Dolt creates on-disk garbage. Dolt transactions that do not have a corresponding Dolt commit create on-disk garbage. This garbage is most noticeable after large data imports.

Specifically, writes to Dolt can result in multiple chunks of the [prolly
tree](https://www.dolthub.com/blog/2020-04-01-how-dolt-stores-table-data) being rewritten,
which [writes a large portion of the
tree](https://www.dolthub.com/blog/2020-05-13-dolt-commit-graph-and-structural-sharing/#cant_share).
When you perform write operations without committing or delete a branch containing novel
chunks, garbage is created.

![How garbage is created](../../../.gitbook/assets/how-garbage-is-created.png)

# Automatic GC
As of Dolt 1.75, garbage collection will be performed automatically in both `dolt sql-server` and `dolt sql` contexts.

If you determine you need to disable Automatic GC in the `sql-server` context, you must set the following [configuration](/sql-reference/server/configuration):

```yaml
behavior:
  auto_gc_behavior:
    enable: false
```

To disable Automatic GC in the `dolt sql` context, start the command with the `--disable-auto-gc` flag:

```sh
$ dolt sql --disable-auto-gc
```

# How to run garbage collection manually

Garbage collection can be run offline using [`dolt gc`](/cli-reference/cli#dolt-gc) or online using [`call dolt_gc()`](/sql-reference/version-control/dolt-sql-procedures#dolt_gc).

## Offline

If you have access to the server where your Dolt database is located and a Dolt sql-server is not running, navigate to the directory your database is stored in and run `dolt gc`. This will cycle through all the needed chunks in your database and delete those that are unnecessary. This process is CPU and memory intensive.

## Online, with Automatic GC disabled

If you have disabled Automatic GC, you can run garbage collection on your running SQL server using [`call dolt_gc`](/sql-reference/version-control/dolt-sql-procedures#dolt_gc) through any connected client. To prevent concurrent
writes potentially referencing garbage collected chunks, running
[`call dolt_gc`](/sql-reference/version-control/dolt-sql-procedures#dolt_gc) will break all open
connections to the running server. In-flight queries on those connections may fail and must be retried. Re-establishing connections after they are broken is safe.

At the end of the run, the connection which ran `call dolt_gc()` will be left open in order to deliver the results of the operation itself. The connection will be left in a terminally broken state where any attempt to run a query on it will result in the following error:

`ERROR 1105 (HY000): this connection was established when this server performed an online garbage collection. this connection can no longer be used. please reconnect.`

The connection should be closed. In some connection pools it can be awkward to cause a single connection to actually close. If you need to run `call dolt_gc()` programmatically, one workaround is to use a separate connection pool with a size of 1 which can be closed after the run is successful.

NOTE: Performing GC on [a cluster replica](/sql-reference/server/replication) which is in standby mode is not yet supported, and running `call dolt_gc()` on the replica will fail. This only applies when Automatic GC is disabled on the secondary.
