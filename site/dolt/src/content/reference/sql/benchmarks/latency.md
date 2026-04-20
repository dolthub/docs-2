---
title: Latency
---

# Latency and Throughput

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

The Dolt version is `1.84.0`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|:-----------------------:|:-----:|:-----:|:--------:|
|  covering\_index\_scan  | 1.93  | 0.55  |   0.28   |
|      groupby\_scan      | 13.46 | 9.91  |   0.74   |
|       index\_join       |  1.5  | 1.86  |   1.24   |
|    index\_join\_scan    | 1.44  | 1.39  |   0.97   |
|       index\_scan       | 34.33 | 21.89 |   0.64   |
|   oltp\_point\_select   |  0.2  | 0.27  |   1.35   |
|    oltp\_read\_only     | 3.82  | 5.18  |   1.36   |
| select\_random\_points  | 0.35  | 0.53  |   1.51   |
| select\_random\_ranges  | 0.39  | 0.56  |   1.44   |
|       table\_scan       | 34.95 | 22.28 |   0.64   |
|   types\_table\_scan    | 77.19 | 66.84 |   0.87   |
| reads\_mean\_multiplier |       |       |   1.0    |

|       Write Tests        | MySQL | Dolt  | Multiple |
|:------------------------:|:-----:|:-----:|:--------:|
|   oltp\_delete\_insert   | 8.28  | 6.43  |   0.78   |
|       oltp\_insert       |  4.1  | 3.13  |   0.76   |
|    oltp\_read\_write     | 9.06  | 11.45 |   1.26   |
|   oltp\_update\_index    | 4.18  | 3.19  |   0.76   |
| oltp\_update\_non\_index | 4.18  | 3.13  |   0.75   |
|    oltp\_write\_only     | 5.28  | 6.09  |   1.15   |
|  types\_delete\_insert   | 8.43  | 6.79  |   0.81   |
| writes\_mean\_multiplier |       |       |   0.9    |

|    TPC-C TPS Tests    | MySQL | Dolt  | Multiple |
|:---------------------:|:-----:|:-----:|:--------:|
|  tpcc-scale-factor-1  | 94.04 | 38.04 |   2.47   |
| tpcc\_tps\_multiplier |       |       |   2.47   |

| Overall Mean Multiple | 1.46 |
|:---------------------:|:----:|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
