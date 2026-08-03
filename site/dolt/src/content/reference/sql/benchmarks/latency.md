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

The Dolt version is `2.2.3`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL  |  Dolt  | Multiple |
|:-----------------------:|:------:|:------:|:--------:|
|  covering\_index\_scan  | 17.01  |  2.35  |   0.14   |
|      groupby\_scan      | 142.39 | 63.32  |   0.44   |
|       index\_join       |  3.49  |  1.93  |   0.55   |
|    index\_join\_scan    |  4.25  |  1.32  |   0.31   |
|       index\_scan       | 350.33 | 204.11 |   0.58   |
|   oltp\_point\_select   |  0.19  |  0.25  |   1.32   |
|    oltp\_read\_only     |  3.68  |  4.91  |   1.33   |
| select\_random\_points  |  0.35  |  0.52  |   1.49   |
| select\_random\_ranges  |  0.39  |  0.64  |   1.64   |
|       table\_scan       | 356.7  | 207.82 |   0.58   |
|   types\_table\_scan    | 773.68 | 458.96 |   0.59   |
| reads\_mean\_multiplier |        |        |   0.82   |

|       Write Tests        | MySQL | Dolt  | Multiple |
|:------------------------:|:-----:|:-----:|:--------:|
|   oltp\_delete\_insert   |  7.7  | 6.21  |   0.81   |
|       oltp\_insert       |  4.1  | 3.19  |   0.78   |
|    oltp\_read\_write     |  8.9  | 11.24 |   1.26   |
|   oltp\_update\_index    | 4.33  |  3.3  |   0.76   |
| oltp\_update\_non\_index |  4.1  | 3.02  |   0.74   |
|    oltp\_write\_only     | 5.18  | 6.21  |   1.2    |
|  types\_delete\_insert   | 8.43  | 6.79  |   0.81   |
| writes\_mean\_multiplier |       |       |   0.91   |

|    TPC-C TPS Tests    | MySQL | Dolt  | Multiple |
|:---------------------:|:-----:|:-----:|:--------:|
|  tpcc-scale-factor-1  | 96.62 | 53.01 |   1.82   |
| tpcc\_tps\_multiplier |       |       |   1.82   |

| Overall Mean Multiple | 1.18 |
|:---------------------:|:----:|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
