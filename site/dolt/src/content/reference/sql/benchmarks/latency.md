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

The Dolt version is `2.3.2`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL  |  Dolt  | Multiple |
|:-----------------------:|:------:|:------:|:--------:|
|  covering\_index\_scan  | 17.01  |  2.3   |   0.14   |
|      groupby\_scan      | 134.9  | 65.65  |   0.49   |
|       index\_join       |  3.43  |  1.93  |   0.56   |
|    index\_join\_scan    |  4.1   |  1.32  |   0.32   |
|       index\_scan       | 344.08 | 204.11 |   0.59   |
|   oltp\_point\_select   |  0.19  |  0.25  |   1.32   |
|    oltp\_read\_only     |  3.62  |  5.0   |   1.38   |
| select\_random\_points  |  0.35  |  0.52  |   1.49   |
| select\_random\_ranges  |  0.38  |  0.64  |   1.68   |
|       table\_scan       | 344.08 | 204.11 |   0.59   |
|   types\_table\_scan    | 759.88 | 467.3  |   0.61   |
| reads\_mean\_multiplier |        |        |   0.83   |

|       Write Tests        | MySQL | Dolt  | Multiple |
|:------------------------:|:-----:|:-----:|:--------:|
|   oltp\_delete\_insert   |  7.7  | 6.21  |   0.81   |
|       oltp\_insert       | 4.03  | 3.13  |   0.78   |
|    oltp\_read\_write     |  8.9  | 11.24 |   1.26   |
|   oltp\_update\_index    | 4.41  |  3.3  |   0.75   |
| oltp\_update\_non\_index |  4.1  | 3.02  |   0.74   |
|    oltp\_write\_only     | 5.18  | 6.21  |   1.2    |
|  types\_delete\_insert   | 8.28  | 6.67  |   0.81   |
| writes\_mean\_multiplier |       |       |   0.91   |

|    TPC-C TPS Tests    | MySQL | Dolt  | Multiple |
|:---------------------:|:-----:|:-----:|:--------:|
|  tpcc-scale-factor-1  | 97.52 | 53.03 |   1.84   |
| tpcc\_tps\_multiplier |       |       |   1.84   |

| Overall Mean Multiple | 1.19 |
|:---------------------:|:----:|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
