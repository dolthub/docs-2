---
title: Hardware Requirements
---

# Hardware Requirements

Right-sizing the host matters more for a Dolt server than for a typical
MySQL deployment because Dolt stores version history alongside the
working data. The headline numbers:

| Resource | Recommendation                                                                                                                  |
|:---------|:--------------------------------------------------------------------------------------------------------------------------------|
| RAM      | **10–20% of the on-disk database size.** A working set under that threshold leaves room for full-table scans without thrashing. |
| Disk     | The current HEAD takes **less space than the same data in MySQL** thanks to Dolt's prolly-tree compression, but plan for steady growth from version history (see below). |
| CPU      | No special requirements; CPU is rarely the scale-limiting axis. Match what you would provision for an equivalent MySQL workload. |
| Network  | Similar to MySQL. If you plan to use Dolt as a remote (clients running `clone` / `fetch` against this server), the remotes endpoint benefits from extra bandwidth. |

## RAM

As a rule of thumb, provision RAM in the **10–20% of database size**
range. As a real-world reference point, a **104 GB** Dolt database used
about **2 GB** at server startup and grew to roughly **4.6 GB** during
full table scans — comfortably inside the 10% band. Workloads with very
hot working sets, heavy concurrent reads, or large in-memory sorts will
want to be closer to 20%.

If the host is also doing bulk imports, give those operations their own
headroom on top of the steady-state requirement.

## Disk

Two things drive Dolt's disk usage beyond what an equivalent MySQL
deployment uses:

- **Version history.** Each commit retains the chunks needed to
  reconstruct prior states. As a rough sizing model, an UPDATE or
  INSERT writes about `4 KB × indexes × log(table_size) / 2` of new
  data on top of the working-set delta. Long-lived, heavily-updated
  databases grow noticeably beyond their HEAD size.
- **Import-time amplification.** Row-by-row `INSERT` statements can
  generate as much as **10× more garbage** as bulk inserts during an
  import. If you're sizing for an initial bulk-load, see the
  [import guide](/guides/import#import-best-practices) for ways to
  keep the spike short.

Compression more than offsets the working-set cost on a fresh database —
expect a single HEAD to sit comfortably below an equivalent MySQL
footprint. The growth budget is mostly about history.

## CPU

CPU is rarely Dolt's scale-limiting axis: query throughput is bounded
more by memory and disk than by parallel processing. There's no
Dolt-specific "X cores per Y connections" guidance — match what you
would provision for an equivalent MySQL workload, and lean on the RAM
sizing instead.

## Reference

For the longer-form discussion these numbers come from, see the blog
post [Sizing your Dolt
instance](https://www.dolthub.com/blog/2023-12-06-sizing-your-dolt-instance/).
