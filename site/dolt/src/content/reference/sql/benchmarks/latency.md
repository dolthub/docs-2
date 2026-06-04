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

The Dolt version is `2.0.6`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|:-----------------------:|:-----:|:-----:|:--------:|
|  covering\_index\_scan  | 1.96  | 0.55  |   0.28   |
|      groupby\_scan      | 13.7  | 10.09 |   0.74   |
|       index\_join       | 1.52  | 1.89  |   1.24   |
|    index\_join\_scan    | 1.47  | 1.34  |   0.91   |
|       index\_scan       | 34.33 | 20.74 |   0.6    |
|   oltp\_point\_select   | 0.21  | 0.26  |   1.24   |
|    oltp\_read\_only     | 3.82  | 5.09  |   1.33   |
| select\_random\_points  | 0.36  | 0.52  |   1.44   |
| select\_random\_ranges  | 0.39  | 0.57  |   1.46   |
|       table\_scan       | 34.33 | 20.74 |   0.6    |
|   types\_table\_scan    | 77.19 | 45.79 |   0.59   |
| reads\_mean\_multiplier |       |       |   0.95   |

|       Write Tests        | MySQL | Dolt  | Multiple |
|:------------------------:|:-----:|:-----:|:--------:|
|   oltp\_delete\_insert   | 8.43  | 6.32  |   0.75   |
|       oltp\_insert       | 4.18  | 3.13  |   0.75   |
|    oltp\_read\_write     | 9.22  | 10.84 |   1.18   |
|   oltp\_update\_index    | 4.25  | 3.19  |   0.75   |
| oltp\_update\_non\_index | 4.18  | 3.02  |   0.72   |
|    oltp\_write\_only     | 5.28  | 5.77  |   1.09   |
|  types\_delete\_insert   | 8.58  | 6.55  |   0.76   |
| writes\_mean\_multiplier |       |       |   0.86   |

|    TPC-C TPS Tests    | MySQL | Dolt  | Multiple |
|:---------------------:|:-----:|:-----:|:--------:|
|  tpcc-scale-factor-1  | 94.16 | 52.87 |   1.78   |
| tpcc\_tps\_multiplier |       |       |   1.78   |

| Overall Mean Multiple | 1.20 |
|:---------------------:|:----:|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
