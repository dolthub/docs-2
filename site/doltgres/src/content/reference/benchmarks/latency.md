---
title: Latency
---


Latency is measured using a standard suite of tests called [`sysbench`](https://github.com/akopytov/sysbench).

Latency is benchmarked for Doltgres release 0.50.0. All measurements are median latency in
milliseconds.

| Read Tests                   | Postgres | Doltgres | Multiple |
| ---                          |----------|----------|----------|
| covering_index_scan_postgres | 18.28    | 2.57     | 0.1      |
| groupby_scan_postgres        | 40.37    | 144.97   | 3.6      |
| index_join_postgres          | 1.82     | 2.43     | 1.3      |
| index_join_scan_postgres     | 0.7      | 1.82     | 2.6      |
| index_scan_postgres          | 179.94   | 733.0    | 4.1      |
| oltp_point_select            | 0.16     | 0.55     | 3.4      |
| oltp_read_only               | 2.81     | 8.58     | 3.1      |
| select_random_points         | 0.23     | 0.87     | 3.8      |
| select_random_ranges         | 0.43     | 1.52     | 3.5      |
| table_scan_postgres          | 179.94   | 746.32   | 4.1      |
| types_table_scan_postgres    | 419.45   | 1836.24  | 4.4      |
| reads_mean_multiplier        |          |          | 3.1      |


| Write Tests                  | Postgres | Doltgres | Multiple |
|------------------------------|----------|----------|----------|
| oltp_delete_insert_postgres  | 2.26     | 7.43     | 3.3      |
| oltp_insert                  | 1.12     | 4.1      | 3.7      |
| oltp_read_write              | 4.57     | 16.71    | 3.7      |
| oltp_update_index            | 1.16     | 4.1      | 3.5      |
| oltp_update_non_index        | 1.16     | 3.75     | 3.2      |
| oltp_write_only              | 1.89     | 8.13     | 4.3      |
| types_delete_insert_postgres | 2.35     | 7.98     | 4.3      |
| write_mean_multiplier        |          |          | 3.6      |

| Overall Mean Multiple | 3.3 |
| --------------------- |  |

<br/>
