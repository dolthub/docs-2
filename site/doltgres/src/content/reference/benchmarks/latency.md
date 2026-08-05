---
title: Latency
---


Latency is measured using a standard suite of tests called [`sysbench`](https://github.com/akopytov/sysbench).

Latency is benchmarked for Doltgres release 1.0.0. All measurements are median latency in
milliseconds.

| Read Tests                   | Postgres | Doltgres | Multiple |
|------------------------------|----------|----------|----------|
| covering_index_scan_postgres | 17.95    | 2.43     | 0.1      |
| groupby_scan_postgres        | 39.65    | 84.47    | 2.1      |
| index_join_postgres          | 1.82     | 2.3      | 1.3      |
| index_join_scan_postgres     | 0.68     | 1.67     | 2.5      |
| index_scan_postgres          | 183.21   | 484.44   | 2.6      |
| oltp_point_select            | 0.15     | 0.38     | 2.5      |
| oltp_read_only               | 2.61     | 6.43     | 2.5      |
| select_random_points         | 0.22     | 0.73     | 3.3      |
| select_random_ranges         | 0.42     | 1.03     | 2.5      |
| table_scan_postgres          | 183.21   | 467.3    | 2.6      |
| types_table_scan_postgres    | 427.07   | 1213.57  | 2.8      |
| reads_mean_multiplier        |          |          | 2.3      |


| Write Tests                  | Postgres | Doltgres | Multiple |
|------------------------------|----------|----------|----------|
| oltp_delete_insert_postgres  | 2.22     | 6.79     | 3.1      |
| oltp_insert                  | 1.1      | 3.82     | 3.5      |
| oltp_read_write              | 4.33     | 13.95    | 3.2      |
| oltp_update_index            | 1.14     | 3.75     | 3.3      |
| oltp_update_non_index        | 1.12     | 3.49     | 3.1      |
| oltp_write_only              | 1.79     | 7.3      | 4.1      |
| types_delete_insert_postgres | 2.3      | 7.43     | 3.2      |
| write_mean_multiplier        |          |          | 3.4      |

| Overall Mean Multiple | 2.7 |
|:---------------------:|:---:|

<br/>
