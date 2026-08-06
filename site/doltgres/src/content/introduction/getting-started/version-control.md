---
title: Using Version Control
description: A walkthrough of Doltgres version control basics — commits, log, diff, branch, and merge.
---

## Create a Database and Tables

Create a `getting_started` database. Create the `getting_started` example tables.

```sql
postgres=> create database getting_started;
--
(0 rows)

postgres=> \c getting_started;
psql (15.4 (Homebrew), server 15.17 (Homebrew))
You are now connected to database "getting_started" as user "postgres".
getting_started=> create table employees (
    id int8,
    last_name text,
    first_name text,
    primary key(id));
--
(0 rows)

getting_started=> create table teams (
    id int8,
    team_name text,
    primary key(id));
--
(0 rows)

getting_started=> create table employees_teams(
    team_id int8,
    employee_id int8,
    primary key(team_id, employee_id),
    foreign key (team_id) references teams(id),
    foreign key (employee_id) references employees(id));
--
(0 rows)

getting_started=> \d
              List of relations
 Schema |      Name       | Type  |  Owner
--------+-----------------+-------+----------
 public | employees       | table | postgres
 public | employees_teams | table | postgres
 public | teams           | table | postgres
(3 rows)
```

## Make a Dolt Commit

```sql
getting_started=> select * from dolt.status;
   table_name           | staged |  status
------------------------+--------+-----------
 public.employees       | f      | new table
 public.employees_teams | f      | new table
 public.teams           | f      | new table
(3 rows)

getting_started=> select dolt_add('teams', 'employees', 'employees_teams');
 dolt_add
----------
        0
(1 row)

getting_started=> select * from dolt.status;
   table_name           | staged |  status
------------------------+--------+-----------
 public.employees       | t      | new table
 public.employees_teams | t      | new table
 public.teams           | t      | new table
(3 rows)

getting_started=> select dolt_commit('-m', 'Created initial schema');
           dolt_commit
----------------------------------
 peqq98e2dl5gscvfvic71e7j6ne34533
(1 row)
```

## View the Dolt Log

```sql
getting_started=> select * from dolt.log;
           commit_hash            | committer |       email        |        date         |          message
----------------------------------+-----------+--------------------+---------------------+----------------------------
 peqq98e2dl5gscvfvic71e7j6ne34533 | postgres  | postgres@127.0.0.1 | 2023-11-01 22:08:04 | Created initial schema
 in7bk735qa6p6rv6i3s797jjem2pg4ru | timsehn   | tim@dolthub.com    | 2023-11-01 22:04:03 | Initialize data repository
(2 rows)
```

<!-- TODO: stub sections — write content -->

## Insert Some Data

## Examine the Diff

## Make Changes on a Branch

## Merge the Branch
