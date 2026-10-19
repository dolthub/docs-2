---
title: Latency
description: Read and write latency benchmarks versus MySQL, and the overhead version control adds.
---

## Latency and Throughput

Our approach to SQL performance benchmarking is to use `sysbench`, an
industry standard benchmarking tool. We also benchmark Dolt using 
[TPC-C](https://www.tpc.org/tpcc/), an industry standard transactional 
throughput metric.

## Performance Roadmap

Dolt is slightly faster than MySQL on the `sysbench` test suite, approximately 10% 
faster on writes and 5% slower on reads. The `multiple` column represents this 
relationship with regard to a particular benchmark.

Dolt gets about 40% of the transactional throughput on TPC-C than MySQL, 
40 transactions per second versus about 100 for MySQL. Most applications
are not sensitive to transactional throughput beyond a handful per second.

It's important recognize that these are industry standard tests, and
are OLTP-oriented. Performance results may vary but Dolt is 
generally competitive on latency with MySQL and Postgres.

## Benchmark Data

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt in the current default 
storage format. We will update this with every release. The tests 
attempt to run as many queries as possible in a fixed 2 minute time 
window. The `Dolt` and `MySQL` columns show the median latency in 
milliseconds (ms) of each query during that 2 minute time window.

The Dolt version is `2.5.0`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL  |  Dolt  | Multiple |
|:------------------------|:-------|:-------|:---------|
| covering\_index\_scan   | 16.71  | 2.35   | 0.14     |
| groupby\_scan           | 132.49 | 70.55  | 0.53     |
| index\_join             | 3.43   | 2.0    | 0.58     |
| index\_join\_scan       | 4.18   | 1.32   | 0.32     |
| index\_scan             | 344.08 | 200.47 | 0.58     |
| oltp\_point\_select     | 0.19   | 0.25   | 1.32     |
| oltp\_read\_only        | 3.62   | 4.91   | 1.36     |
| select\_random\_points  | 0.35   | 0.52   | 1.49     |
| select\_random\_ranges  | 0.38   | 0.65   | 1.71     |
| table\_scan             | 344.08 | 200.47 | 0.58     |
| types\_table\_scan      | 746.32 | 450.77 | 0.6      |
| reads\_mean\_multiplier |        |        | 0.84     |

|       Write Tests        | MySQL | Dolt  | Multiple |
|:-------------------------|:------|:------|:---------|
| oltp\_delete\_insert     | 7.7   | 4.03  | 0.52     |
| oltp\_insert             | 4.1   | 2.07  | 0.5      |
| oltp\_read\_write        | 8.74  | 10.09 | 1.15     |
| oltp\_update\_index      | 4.33  | 2.22  | 0.51     |
| oltp\_update\_non\_index | 4.1   | 1.93  | 0.47     |
| oltp\_write\_only        | 5.18  | 5.18  | 1.0      |
| types\_delete\_insert    | 8.43  | 4.49  | 0.53     |
| writes\_mean\_multiplier |       |       | 0.67     |

|    TPC-C TPS Tests    | MySQL | Dolt | Multiple |
|:----------------------|:------|:-----|:---------|
| tpcc-scale-factor-1   | 97.17 | 57.8 | 1.68     |
| tpcc\_tps\_multiplier |       |      | 1.68     |

| Overall Mean Multiple | 1.06 |
|:----------------------|:-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
