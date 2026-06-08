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

The Dolt version is `2.1.4`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL  |  Dolt  | Multiple |
|:-----------------------:|:------:|:------:|:--------:|
|  covering\_index\_scan  | 17.32  |  2.3   |   0.13   |
|      groupby\_scan      | 142.39 | 142.39 |   1.0    |
|       index\_join       |  3.49  |  2.0   |   0.57   |
|    index\_join\_scan    |  4.18  |  1.34  |   0.32   |
|       index\_scan       | 350.33 | 219.36 |   0.63   |
|   oltp\_point\_select   |  0.2   |  0.26  |   1.3    |
|    oltp\_read\_only     |  3.82  |  5.09  |   1.33   |
| select\_random\_points  |  0.37  |  0.56  |   1.51   |
| select\_random\_ranges  |  0.39  |  0.64  |   1.64   |
|       table\_scan       | 350.33 | 196.89 |   0.56   |
|   types\_table\_scan    | 746.32 | 450.77 |   0.6    |
| reads\_mean\_multiplier |        |        |   0.87   |

|       Write Tests        | MySQL | Dolt  | Multiple |
|:------------------------:|:-----:|:-----:|:--------:|
|   oltp\_delete\_insert   | 8.43  | 6.32  |   0.75   |
|       oltp\_insert       |  4.1  | 3.19  |   0.78   |
|    oltp\_read\_write     | 9.22  | 11.45 |   1.24   |
|   oltp\_update\_index    | 4.41  | 3.36  |   0.76   |
| oltp\_update\_non\_index | 4.18  | 3.07  |   0.73   |
|    oltp\_write\_only     | 5.28  | 6.32  |   1.2    |
|  types\_delete\_insert   | 8.43  | 6.79  |   0.81   |
| writes\_mean\_multiplier |       |       |   0.9    |

|    TPC-C TPS Tests    | MySQL | Dolt  | Multiple |
|:---------------------:|:-----:|:-----:|:--------:|
|  tpcc-scale-factor-1  | 93.04 | 52.51 |   1.77   |
| tpcc\_tps\_multiplier |       |       |   1.77   |

| Overall Mean Multiple | 1.18 |
|:---------------------:|:----:|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
