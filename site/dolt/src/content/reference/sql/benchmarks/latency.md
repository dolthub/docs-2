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

The Dolt version is `2.2.0`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL  |  Dolt  | Multiple |
|:-----------------------:|:------:|:------:|:--------:|
|  covering\_index\_scan  | 17.63  |  2.3   |   0.13   |
|      groupby\_scan      | 134.9  | 144.97 |   1.07   |
|       index\_join       |  3.55  |  1.93  |   0.54   |
|    index\_join\_scan    |  4.25  |  1.32  |   0.31   |
|       index\_scan       | 350.33 | 219.36 |   0.63   |
|   oltp\_point\_select   |  0.19  |  0.25  |   1.32   |
|    oltp\_read\_only     |  3.68  |  5.0   |   1.36   |
| select\_random\_points  |  0.36  |  0.52  |   1.44   |
| select\_random\_ranges  |  0.39  |  0.65  |   1.67   |
|       table\_scan       | 350.33 | 200.47 |   0.57   |
|   types\_table\_scan    | 746.32 | 450.77 |   0.6    |
| reads\_mean\_multiplier |        |        |   0.88   |

|       Write Tests        | MySQL | Dolt  | Multiple |
|:------------------------:|:-----:|:-----:|:--------:|
|   oltp\_delete\_insert   |  7.7  | 6.21  |   0.81   |
|       oltp\_insert       | 4.03  | 3.19  |   0.79   |
|    oltp\_read\_write     |  8.9  | 11.24 |   1.26   |
|   oltp\_update\_index    | 4.33  |  3.3  |   0.76   |
| oltp\_update\_non\_index |  4.1  | 3.02  |   0.74   |
|    oltp\_write\_only     | 5.18  | 6.32  |   1.22   |
|  types\_delete\_insert   | 8.28  | 6.79  |   0.82   |
| writes\_mean\_multiplier |       |       |   0.91   |

|    TPC-C TPS Tests    | MySQL | Dolt  | Multiple |
|:---------------------:|:-----:|:-----:|:--------:|
|  tpcc-scale-factor-1  | 95.75 | 52.65 |   1.82   |
| tpcc\_tps\_multiplier |       |       |   1.82   |

| Overall Mean Multiple | 1.20 |
|:---------------------:|:----:|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
