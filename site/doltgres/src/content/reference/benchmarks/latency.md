---
title: Latency
---

# Latency

# Latency

Latency is measured using a standard suite of tests called [`sysbench`](https://github.com/akopytov/sysbench).

Latency is benchmarked for Doltgres release 0.50.0. All measurements are median latency in
milliseconds.

| Read Tests                   | Postgres | Doltgres | Multiple |
| ---                          | ---      | ---      | ---      |
| covering_index_scan_postgres | 1.89     | 5.28     | 2.8      |
| groupby_scan_postgres        | 5.28     | 46.63    | 8.8      |
| index_join_postgres          | 1.96     | 10.09    | 5.1      |
| index_join_scan_postgres     | 0.67     | 8.9      | 13.3     |
| index_scan_postgres          | 17.95    | 130.13   | 7.2      |
| oltp_point_select            | 0.14     | 0.52     | 3.7      |
| oltp_read_only               | 2.48     | 12.75    | 5.1      |
| select_random_points         | 0.21     | 1.12     | 5.3      |
| select_random_ranges         | 0.41     | 1.39     | 3.4      |
| table_scan_postgres          | 17.95    | 132.49   | 7.4      |
| types_table_scan_postgres    | 43.39    | 292.6    | 6.7      |
| reads_mean_multiplier        |          |          | 6.3      |


| Write Tests                  | Postgres | Doltgres | Multiple |
|------------------------------|----------|----------|----------|
| oltp_delete_insert_postgres  | 2.22     | 6.79     | 3.1      |
| oltp_insert                  | 1.1      | 3.68     | 3.3      |
| oltp_read_write              | 4.25     | 20.37    | 4.8      |
| oltp_update_index            | 1.12     | 3.55     | 3.2      |
| oltp_update_non_index        | 1.12     | 3.43     | 3.1      |
| oltp_write_only              | 1.73     | 7.43     | 4.3      |
| types_delete_insert_postgres | 2.3      | 7.04     | 3.1      |
| write_mean_multiplier        |          |          | 3.6      |

| Overall Mean Multiple | 5.2 |
| --------------------- | --- |

<br/>
