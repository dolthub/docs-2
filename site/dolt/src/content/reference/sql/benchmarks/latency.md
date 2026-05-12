---
title: Latency
---

# Latency

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

The Dolt version is `2.0.0`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|:-----------------------:|:-----:|:-----:|:--------:|
|  covering\_index\_scan  | 1.93  | 0.54  |   0.28   |
|      groupby\_scan      | 13.46 | 9.91  |   0.74   |
|       index\_join       | 1.52  | 1.86  |   1.22   |
|    index\_join\_scan    |  1.5  | 1.32  |   0.88   |
|       index\_scan       | 34.33 | 22.28 |   0.65   |
|   oltp\_point\_select   |  0.2  | 0.25  |   1.25   |
|    oltp\_read\_only     | 3.82  |  5.0  |   1.31   |
| select\_random\_points  | 0.35  |  0.5  |   1.43   |
| select\_random\_ranges  | 0.39  | 0.56  |   1.44   |
|       table\_scan       | 34.95 | 22.28 |   0.64   |
|   types\_table\_scan    | 75.82 | 47.47 |   0.63   |
| reads\_mean\_multiplier |       |       |   0.95   |

|       Write Tests        | MySQL | Dolt  | Multiple |
|:------------------------:|:-----:|:-----:|:--------:|
|   oltp\_delete\_insert   | 8.43  | 6.43  |   0.76   |
|       oltp\_insert       | 4.18  | 3.13  |   0.75   |
|    oltp\_read\_write     | 9.06  | 11.04 |   1.22   |
|   oltp\_update\_index    | 4.18  | 3.19  |   0.76   |
| oltp\_update\_non\_index | 4.18  | 3.02  |   0.72   |
|    oltp\_write\_only     | 5.28  | 5.99  |   1.13   |
|  types\_delete\_insert   | 8.58  | 6.67  |   0.78   |
| writes\_mean\_multiplier |       |       |   0.87   |

|    TPC-C TPS Tests    | MySQL | Dolt  | Multiple |
|:---------------------:|:-----:|:-----:|:--------:|
|  tpcc-scale-factor-1  | 93.16 | 45.32 |   2.06   |
| tpcc\_tps\_multiplier |       |       |   2.06   |

| Overall Mean Multiple | 1.29 |
|:---------------------:|:----:|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
