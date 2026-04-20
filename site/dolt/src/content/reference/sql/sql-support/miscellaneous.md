---
title: Miscellaneous
---

# Miscellaneous

## Misc features

| Component                         | Supported | Notes and limitations                                                                                                 |
|:----------------------------------|:----------|:----------------------------------------------------------------------------------------------------------------------|
| Information schema                | ✅         |                                                                                                                       |
| Views                             | ✅         |                                                                                                                       |
| Window functions                  | 🟠         | Some functions not supported, see [window function docs](./expressions-functions-operators.md#window-functions)       |
| Common table expressions \(CTEs\) | ✅         |                                                                                                                       |
| Stored procedures                 | 🟠         | Only a few statements are not yet supported, see [compound statements](./supported-statements.md#compound-statements) |
| Cursors                           | ✅         |                                                                                                                       |
| Triggers                          | ✅         |                                                                                                                       |

## Client Compatibility

Some MySQL features are client features, not server features. Dolt ships with a client (ie. [`dolt sql`](../../cli/cli.md#dolt-sql)) and a server ([`dolt sql-server`](../../cli/cli.md#dolt-sql-server)). The Dolt client is not as sophisticated as the `mysql` client. To access these features you can use the `mysql` client that ships with MySQL.

| Feature                         | Supported | Notes and limitations                                                                                    |
|:--------------------------------|:----------|:---------------------------------------------------------------------------------------------------------|
| SOURCE                          | ❌        | Works with Dolt via the `mysql` client                                                                    |
| LOAD DATA LOCAL INFILE          | ❌        | LOAD DATA INFILE works with the Dolt client. The LOCAL option only works with Dolt via the `mysql` client |

## Join hints

Dolt supports the following join hints:

| name                     | supported | detail                                                                                          |
|--------------------------|-----------|-------------------------------------------------------------------------------------------------|
| JOIN_ORDER(<table1>,...) | ✅         | Join tree in scope should use the following join execution order. Must include all table names. |
| LOOKUP_JOIN(<t1>,<t2>)   | ✅         | Use LOOKUP strategy joining two tables.                                                         |
| MERGE_JOIN(<t1>,<t2>)    | ✅         | Use MERGE strategy joining two tables.                                                          |
| HASH_JOIN(<t1>,<t2>)     | ✅         | Use HASH strategy joining two tables.                                                           |
| INNER_JOIN(<t1>,<t2>)    | ✅         | Use INNER strategy joining two tables.                                                          |
| SEMI_JOIN(<t1>,<t2>)     | ✅         | Use SEMI strategy joining two tables (for `EXISTS` or `IN` queries).                            |
| ANTI_JOIN(<t1>,<t2>)     | ✅         | Use ANTI strategy joining two tables (for `NOT EXISTS` or `NOT IN` queries).                    |
| JOIN_FIXED_ORDER         | ❌         | Join tree uses in-place table order for execution.                                              |
| NO_ICP                   | ❌         | Disable indexed range scans on index using filters.                                             |

Join hints are indicated immediately after a `SELECT` token in a special
comment format `/*+ */`. Multiple hints should be separated by spaces:

```sql
SELECT /*+ JOIN_ORDER(arg1,arg2) */ 1
SELECT /*+ JOIN_ORDER(arg1,arg2) NO_ICP */ 1
```

Join hints currently require a full set of valid hints for all to be
applied. For example, if we have a three table join we can enforce
JOIN_ORDER on its own, join strategies on their own, or both order
and strategy:

```sql
SELECT /*+ JOIN_ORDER(xy,uv,ab) LOOKUP_JOIN(xy,uv) HASH_JOIN(uv,ab) */ 1
FROM xy
JOIN uv on x = u
JOIN ab on a = u;
```

Additional notes:
- If one hint is invalid given the execution options, no hints are applied and the engine falls back to default costing.
- Join operator hints are order-insensitive
- Join operator hints apply as long as the indicated tables are subsets of the join left/right.

## Table Statistics

### ANALYZE table

Dolt currently supports table statistics for index and join costing.

Statistics are auto-collected by default for servers, but can be manually collected by running `ANALYZE TABLE <table, ...>`.

Here is an example of how to initialize and observe statistics:

```sql
CREATE TABLE xy (x int primary key, y int);
INSERT INTO xy values (1,1), (2,2);
ANALYZE TABLE xy;
SELECT * from information_schema.tables;
+-------------+------------+-------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| SCHEMA_NAME | TABLE_NAME | COLUMN_NAME | HISTOGRAM                                                                                                                                                                                                                                                                                                                                                      |
+-------------+------------+-------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| tmp4        | xy         | x           | {"statistic": {"avg_size": 0, "buckets": [{"bound_count": 1, "distinct_count": 2, "mcv_counts": [1,1], "mcvs": [[1],[2]], "null_count": 0, "row_count": 2, "upper_bound": [2]}], "columns": ["x"], "created_at": "2023-11-14T11:33:32.250178-08:00", "distinct_count": 2, "null_count": 2, "qualifier": "tmp4.xy.PRIMARY", "row_count": 2, "types:": ["int"]}} |
+-------------+------------+-------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

```sql
create table horses (id int primary key, name varchar(10), key(name));
insert into horses select x, 'Steve' from (with recursive inputs(x) as (select 1 union select x+1 from inputs where x < 1000) select * from inputs) dt;
analyze table horses;
select `index`, `position`, row_count, distinct_count, columns, upper_bound, upper_bound_cnt, mcv1 from dolt_statistics;
+---------+----------+-----------+----------------+----------+-------------+-----------------+-----------+
| index   | position | row_count | distinct_count | columns  | upper_bound | upper_bound_cnt | mcv1      |
+---------+----------+-----------+----------------+----------+-------------+-----------------+-----------+
| primary | 0        | 344       | 344            | ["id"]   | [344]       | 1               | [344]     |
| primary | 1        | 125       | 125            | ["id"]   | [469]       | 1               | [469]     |
| primary | 2        | 249       | 249            | ["id"]   | [718]       | 1               | [718]     |
| primary | 3        | 112       | 112            | ["id"]   | [830]       | 1               | [830]     |
| primary | 4        | 170       | 170            | ["id"]   | [1000]      | 1               | [1000]    |
| name    | 5        | 260       | 1              | ["name"] | ["Steve"]   | 260             | ["Steve"] |
| name    | 6        | 237       | 1              | ["name"] | ["Steve"]   | 237             | ["Steve"] |
| name    | 7        | 137       | 1              | ["name"] | ["Steve"]   | 137             | ["Steve"] |
| name    | 8        | 188       | 1              | ["name"] | ["Steve"]   | 188             | ["Steve"] |
| name    | 9        | 178       | 1              | ["name"] | ["Steve"]   | 178             | ["Steve"] |
+---------+----------+-----------+----------------+----------+-------------+-----------------+-----------+
```

### Disable

Some workloads, like batch imports, perform strictly better without the overhead of statistics collection. In these cases, we can explicitly stop or purge (stop + delete) statistics on a running server:

```sql
call dolt_stats_stop();
call dolt_stats_purge();
```

A stopped-stats server can be restarted, or have a single collection cycle performed by an operator:

```sql
call dolt_stats_restart();
call dolt_stats_once();
```

An environment variable can disable statistics on server reboots:

```sql
— on version 1.51.0 or higher
SET @@PERSIST.dolt_stats_enabled = 0;

— up to 1.50.x
SET @@PERSIST.dolt_stats_auto_refresh_enabled = 0;
```

A rebooted server with stats turned off has no reversal mechanism at the moment. All stats operations are no-ops
if a server starts with the above variables set.

### Auto-Refresh

Statistics automatically update for servers by default. Stats are stored in a database in `.dolt/stats` separate from user data. This folder can safely be deleted offline.

Stats throughput can be lowered by raising the the `dolt_stats_job_interval` variable, which indicates the milliseconds of delay between processing steps. The higher the delay and more branches in a database, the longer it will take for statistic updates to materialize. High delays reduce the fraction of runtime resources diverted to managing background statistics.

Stats can be disabled with the `dolt_stats_enabled=0` variable.

Stats persistence can be disabled with the `dolt_stats_memory_only=1` variable.

### Stats Garbage Collection

The stats in-memory cache accumulates new histograms proportionally to the write rate and stats update rate. Periodically, an
update cycle will swap the currently active histogram buckets to a new in-memory map and clear the old set.

Stats garbage collection can be disabled with the `dolt_stats_gc_enabled=0` variable.

Garbage collection frequency can be tuned with the `dolt_stats_gc_interval` variable (default 1 hour).

### Stats Controller Functions

Dolt exposes a set of helper procedures for managing statistics collection and use:

  - `dolt_stats_stop`: clear queue and disable thread
  - `dolt_stats_restart`: clear queue, refresh queue, start thread
  - `dolt_stats_purge`: clear queue, refresh queue, clear cache disable thread
  - `dolt_stats_once`: collect statistics once, ex: in sql-shell
  - `dolt_stats_wait`: block on a full queue cycle
  - `dolt_stats_gc`: block waiting for a GC signal
  - `dolt_stats_flush`: block waiting for a flush signal
  - `dolt_stats_info`: print the current state of the stats provider (optional `'-short'` flag)
