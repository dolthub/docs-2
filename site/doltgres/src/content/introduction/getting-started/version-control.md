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

## Insert some data

Now, I'm going to populate the database with a few employees here at DoltHub. Then, I'll assign the employees to two teams: engineering and sales. The CEO wears many hats at a start up so he'll be assigned to multiple teams.

```sql
getting_started=> insert into employees values
    (0, 'Sehn', 'Tim'),
    (1, 'Hendriks', 'Brian'),
    (2, 'Son','Aaron'),
    (3, 'Fitzgerald', 'Brian');
INSERT 0 4

getting_started=> select * from employees where first_name='Brian';
 id | last_name  | first_name
----+------------+------------
  1 | Hendriks   | Brian
  3 | Fitzgerald | Brian
(2 rows)

getting_started=> insert into teams values
    (0, 'Engineering'),
    (1, 'Sales');
INSERT 0 2

getting_started=> insert into employees_teams values
    (0,0),
    (1,0),
    (2,0),
    (0,1),
    (3,1);
ERROR:  cannot add or update a child row - Foreign key violation on fk: `rv9ek7ft`, table: `employees_teams`, referenced table: `teams`, key: `[2]`
```

Oops, I violated a constraint. It looks like I created the table with teams before employees. You should always specify your columns when you insert, not rely on natural ordering. Serves me right! Doltgres comes with the full power of a modern SQL relational database to ensure data integrity.

```sql
getting_started=> insert into employees_teams(employee_id, team_id) values
    (0,0),
    (1,0),
    (2,0),
    (0,1),
    (3,1);
INSERT 0 5

getting_started=> select first_name, last_name, team_name from employees
    join employees_teams on (employees.id=employees_teams.employee_id)
    join teams on (teams.id=employees_teams.team_id)
    where team_name='Engineering';
 first_name | last_name |  team_name
------------+-----------+-------------
 Tim        | Sehn      | Engineering
 Brian      | Hendriks  | Engineering
 Aaron      | Son       | Engineering
(3 rows)
```

Looks like everything is inserted and correct. I was able to list the members of the engineering team using that three table `JOIN`. Doltgres supports up to twelve table `JOIN`s. Again, Doltgres is a modern SQL relational database paired with Git-style version control.

## Examine the diff

Now, what if you want to see what changed in your working set before you make a commit? You use the `dolt.status` and `dolt_diff_<tablename>` system tables.

```sql
getting_started=> select * from dolt.status;
       table_name       | staged |  status
------------------------+--------+----------
 public.teams           | f      | modified
 public.employees       | f      | modified
 public.employees_teams | f      | modified
(3 rows)

getting_started=> select * from dolt_diff_employees;
 to_last_name | to_first_name | to_id | to_commit | to_commit_date | from_last_name | from_first_name | from_id |           from_commit            |  from_commit_date   | diff_type
--------------+---------------+-------+-----------+----------------+----------------+-----------------+---------+----------------------------------+---------------------+-----------
 Sehn         | Tim           |     0 | WORKING   |                |                |                 |         | peqq98e2dl5gscvfvic71e7j6ne34533 | 2023-11-01 22:08:04 | added
 Hendriks     | Brian         |     1 | WORKING   |                |                |                 |         | peqq98e2dl5gscvfvic71e7j6ne34533 | 2023-11-01 22:08:04 | added
 Son          | Aaron         |     2 | WORKING   |                |                |                 |         | peqq98e2dl5gscvfvic71e7j6ne34533 | 2023-11-01 22:08:04 | added
 Fitzgerald   | Brian         |     3 | WORKING   |                |                |                 |         | peqq98e2dl5gscvfvic71e7j6ne34533 | 2023-11-01 22:08:04 | added
(4 rows)
```

As you can see from the diff I've added the correct values to the `employees` table. The values were previously `NULL` and now they are populated.

Let's finish off with another Dolt commit this time adding all modified tables using `-am`.

```sql
getting_started=> select dolt_commit('-am', 'Populated tables with data');
           dolt_commit
----------------------------------
 13qfqa5rojq18j84d1n2htjkm6fletg4
(1 row)
```

You can inspect the log using `dolt.log` and see which tables changed in each commit using the unscoped `dolt.diff`. Unscoped `dolt.diff` tells you whether schema, data, or both changed in that particular commit for the table.

```sql
getting_started=> select * from dolt.log;
           commit_hash            | committer |       email        |        date         |          message
----------------------------------+-----------+--------------------+---------------------+----------------------------
 13qfqa5rojq18j84d1n2htjkm6fletg4 | postgres  | postgres@127.0.0.1 | 2023-11-01 22:39:32 | Populated tables with data
 peqq98e2dl5gscvfvic71e7j6ne34533 | postgres  | postgres@127.0.0.1 | 2023-11-01 22:08:04 | Created initial schema
 in7bk735qa6p6rv6i3s797jjem2pg4ru | timsehn   | tim@dolthub.com    | 2023-11-01 22:04:03 | Initialize data repository
(3 rows)

getting_started=> select * from dolt.diff;
           commit_hash            |       table_name       | committer |       email        |        date         |          message           | data_change | schema_change
----------------------------------+------------------------+-----------+--------------------+---------------------+----------------------------+-------------+---------------
 13qfqa5rojq18j84d1n2htjkm6fletg4 | public.teams           | postgres  | postgres@127.0.0.1 | 2023-11-01 22:39:32 | Populated tables with data | t           | f
 13qfqa5rojq18j84d1n2htjkm6fletg4 | public.employees       | postgres  | postgres@127.0.0.1 | 2023-11-01 22:39:32 | Populated tables with data | t           | f
 13qfqa5rojq18j84d1n2htjkm6fletg4 | public.employees_teams | postgres  | postgres@127.0.0.1 | 2023-11-01 22:39:32 | Populated tables with data | t           | f
 peqq98e2dl5gscvfvic71e7j6ne34533 | public.employees       | postgres  | postgres@127.0.0.1 | 2023-11-01 22:08:04 | Created initial schema     | f           | t
 peqq98e2dl5gscvfvic71e7j6ne34533 | public.employees_teams | postgres  | postgres@127.0.0.1 | 2023-11-01 22:08:04 | Created initial schema     | f           | t
 peqq98e2dl5gscvfvic71e7j6ne34533 | public.teams           | postgres  | postgres@127.0.0.1 | 2023-11-01 22:08:04 | Created initial schema     | f           | t
(6 rows)
```

## Oh no! I made a mistake.

Doltgres supports undoing changes via `dolt_reset()`. Let's imagine I accidentally drop a table.

```sql
getting_started=> drop table employees_teams;
DROP TABLE

getting_started=> \d
              List of relations
 Schema |      Name       | Type  |  Owner
--------+-----------------+-------+----------
 public | employees       | table | postgres
 public | teams           | table | postgres
(2 rows)
```

In a traditional database, this could be disastrous. In Doltgres, you're one command away from getting your table back.

```sql
getting_started=> select dolt_reset('--hard');
 dolt_reset
------------
          0
(1 row)

getting_started=> \d
              List of relations
 Schema |      Name       | Type  |  Owner
--------+-----------------+-------+----------
 public | employees       | table | postgres
 public | employees_teams | table | postgres
 public | teams           | table | postgres
(3 rows)
```

Doltgres makes operating databases less error prone. You can always back out changes you have in progress or rewind to a known good state. You also have the ability to undo specific commits using [`dolt_revert()`](/reference/version-control/dolt-sql-functions#dolt_revert).

Note, undoing changes from a `drop database` statement requires a special SQL function, [`dolt_undrop()`](/reference/version-control/dolt-sql-functions#dolt_undrop).

## Make changes on a branch

To make changes on a branch, I use the `dolt_checkout()` function. Using the `-b` option creates a branch, just like in Git.

I entered the following SQL to checkout a branch, update, insert, delete, and finally Dolt commit my changes.

```sql
getting_started=> select * from dolt_checkout('-b','modifications');
 status |              message
--------+------------------------------------
      0 | Switched to branch 'modifications'
(1 row)

getting_started=> update employees SET first_name='Timothy' where first_name='Tim';
UPDATE 1

getting_started=> insert INTO employees (id, first_name, last_name) values (4,'Daylon', 'Wilkins');
INSERT 0 1

getting_started=> insert into employees_teams(team_id, employee_id) values (0,4);
INSERT 0 1

getting_started=> delete from employees_teams where employee_id=0 and team_id=1;
DELETE 1

getting_started=> select dolt_commit('-am', 'Modifications on a branch');
           dolt_commit
----------------------------------
 uhkv57j4bp2v16vcnmev9lshgkqq8ppb
(1 row)
```

After I check out `main` again, I cannot see the table modifications I just made, because they happened on a different branch than the one I have checked out in my session.

```sql
getting_started=> select dolt_checkout('main');
           dolt_checkout
------------------------------------
 (0,"Switched to branch 'main'")
(1 row)

getting_started=> select * from dolt.branches;
     name      |               hash               | latest_committer | latest_committer_email | latest_commit_date  |   latest_commit_message
---------------+----------------------------------+------------------+------------------------+---------------------+----------------------------
 main          | 13qfqa5rojq18j84d1n2htjkm6fletg4 | postgres         | postgres@127.0.0.1     | 2023-11-01 22:39:32 | Populated tables with data
 modifications | uhkv57j4bp2v16vcnmev9lshgkqq8ppb | postgres         | postgres@127.0.0.1     | 2023-11-01 22:41:49 | Modifications on a branch
(2 rows)

getting_started=> select active_branch();
 active_branch
---------------
 main
(1 row)

getting_started=> select * from employees;
 id | last_name  | first_name
----+------------+------------
  0 | Sehn       | Tim
  1 | Hendriks   | Brian
  2 | Son        | Aaron
  3 | Fitzgerald | Brian
(4 rows)
```

I can query the branch no matter what I have checked out using SQL `as of` syntax.

```sql
getting_started=> select * from employees as of 'modifications';
 id | last_name  | first_name
----+------------+------------
  0 | Sehn       | Timothy
  1 | Hendriks   | Brian
  2 | Son        | Aaron
  3 | Fitzgerald | Brian
  4 | Wilkins    | Daylon
(5 rows)
```

If I'd like to see the diff between the two branches, I can use the `dolt_diff()` table function. It takes two branches and the table name as arguments.

```sql
getting_started=> select * from dolt_diff('main', 'modifications', 'employees');
 to_last_name | to_first_name | to_id |   to_commit   |   to_commit_date    | from_last_name | from_first_name | from_id | from_commit |  from_commit_date   | diff_type
--------------+---------------+-------+---------------+---------------------+----------------+-----------------+---------+-------------+---------------------+-----------
 Sehn         | Timothy       |     0 | modifications | 2023-11-01 22:41:49 | Sehn           | Tim             |       0 | main        | 2023-11-01 22:39:32 | modified
 Wilkins      | Daylon        |     4 | modifications | 2023-11-01 22:41:49 |                |                 |         | main        | 2023-11-01 22:39:32 | added
(2 rows)
```

As you can see, you have the full power of Git-style branches and diffs in a SQL database with Doltgres.

## Make a schema change on another branch

I can also make schema changes on branches for isolated testing of new schema. I'm going to add a `start_date` column on a new branch and populate it.

```sql
getting_started=> select dolt_checkout('-b', 'schema_changes');
              dolt_checkout
------------------------------------------
 (0,"Switched to branch 'schema_changes'")
(1 row)

getting_started=> alter table employees add column start_date date;
ALTER TABLE

getting_started=> update employees set start_date='2018-09-08';
UPDATE 4

getting_started=> update employees set start_date='2021-04-19' where last_name='Fitzgerald';
UPDATE 1

getting_started=> select * from employees;
 id | last_name  | first_name | start_date
----+------------+------------+------------
  0 | Sehn       | Tim        | 2018-09-08
  1 | Hendriks   | Brian      | 2018-09-08
  2 | Son        | Aaron      | 2018-09-08
  3 | Fitzgerald | Brian      | 2021-04-19
(4 rows)

getting_started=> select dolt_commit('-am', 'Added start_date column to employees');
           dolt_commit
----------------------------------
 pg3nfi0j1dpc5pf1rfgckpmlteaufdrt
(1 row)
```

Changing schema on a branch gives you a new method for doing isolated integration testing of new schema changes.

## Merge it all together

Let's assume all the testing of the new schema on the `schema_changes` branch and data on the `modifications` branch completed flawlessly. It's time to merge all our edits together onto `main`. This is done using the `dolt_merge()` function.

```sql
getting_started=> select dolt_checkout('main');
          dolt_checkout
---------------------------------
 (0,"Switched to branch 'main'")
(1 row)

getting_started=> select * from dolt.status;
 table_name | staged | status
------------+--------+--------
(0 rows)

getting_started=> select * from dolt_merge('schema_changes');
               hash               | fast_forward | conflicts |     message
----------------------------------+--------------+-----------+------------------
 pg3nfi0j1dpc5pf1rfgckpmlteaufdrt |            1 |         0 | merge successful
(1 row)

getting_started=> select * from employees;
 id | last_name  | first_name | start_date
----+------------+------------+------------
  0 | Sehn       | Tim        | 2018-09-08
  1 | Hendriks   | Brian      | 2018-09-08
  2 | Son        | Aaron      | 2018-09-08
  3 | Fitzgerald | Brian      | 2021-04-19
(4 rows)
```

Schema change successful. We now have start dates. Data changes are next.

```sql
getting_started=> select * from dolt_merge('modifications');
               hash               | fast_forward | conflicts |     message
----------------------------------+--------------+-----------+------------------
 vn9b0qcematsj2f6ka0hfoflhr5s6p0b |            0 |         0 | merge successful
(1 row)

getting_started=> select * from employees;
 id | last_name  | first_name | start_date
----+------------+------------+------------
  0 | Sehn       | Timothy    | 2018-09-08
  1 | Hendriks   | Brian      | 2018-09-08
  2 | Son        | Aaron      | 2018-09-08
  3 | Fitzgerald | Brian      | 2021-04-19
  4 | Wilkins    | Daylon     |
(5 rows)
```

Data changes successful as well. As you can see, I am now "Timothy" instead of "Tim", Daylon is added, and we all have start dates except for Daylon who was added on a different branch.

```sql
getting_started=> select first_name, last_name, team_name from employees
    join employees_teams on (employees.id=employees_teams.employee_id)
    join teams on (teams.id=employees_teams.team_id)
    where team_name='Sales';
 first_name | last_name  | team_name
------------+------------+-----------
 Brian      | Fitzgerald | Sales
(1 row)
```

I'm also gone from the Sales Team. Engineering is life.

Now, we have a database with all the schema and data changes merged and ready for use.

```sql
getting_started=> select * from dolt.log;
           commit_hash            | committer |       email        |        date         |                message
----------------------------------+-----------+--------------------+---------------------+----------------------------------------
 vn9b0qcematsj2f6ka0hfoflhr5s6p0b | postgres  | postgres@127.0.0.1 | 2023-11-01 23:10:02 | Merge branch 'modifications' into main
 pg3nfi0j1dpc5pf1rfgckpmlteaufdrt | postgres  | postgres@127.0.0.1 | 2023-11-01 22:44:37 | Added start_date column to employees
 uhkv57j4bp2v16vcnmev9lshgkqq8ppb | postgres  | postgres@127.0.0.1 | 2023-11-01 22:41:49 | Modifications on a branch
 13qfqa5rojq18j84d1n2htjkm6fletg4 | postgres  | postgres@127.0.0.1 | 2023-11-01 22:39:32 | Populated tables with data
 peqq98e2dl5gscvfvic71e7j6ne34533 | postgres  | postgres@127.0.0.1 | 2023-11-01 22:08:04 | Created initial schema
 in7bk735qa6p6rv6i3s797jjem2pg4ru | timsehn   | tim@dolthub.com    | 2023-11-01 22:04:03 | Initialize data repository
(6 rows)
```

## Audit Cell Lineage

Which commit changed my first name? With Doltgres you have lineage for every cell in your database. Let's use the `dolt_history_<tablename>` and `dolt_diff_<tablename>` system tables to explore the lineage features in Doltgres.

`dolt_history_<tablename>` shows you the state of the row at every commit.

```sql
getting_started=> select * from dolt_history_employees where id=0 order by commit_date;
 id | last_name | first_name | start_date |           commit_hash            | committer |     commit_date
----+-----------+------------+------------+----------------------------------+-----------+---------------------
  0 | Sehn      | Tim        |            | 13qfqa5rojq18j84d1n2htjkm6fletg4 | postgres  | 2023-11-01 22:39:32
  0 | Sehn      | Timothy    |            | uhkv57j4bp2v16vcnmev9lshgkqq8ppb | postgres  | 2023-11-01 22:41:49
  0 | Sehn      | Tim        | 2018-09-08 | pg3nfi0j1dpc5pf1rfgckpmlteaufdrt | postgres  | 2023-11-01 22:44:37
  0 | Sehn      | Timothy    | 2018-09-08 | vn9b0qcematsj2f6ka0hfoflhr5s6p0b | postgres  | 2023-11-01 23:10:02
(4 rows)
```

`dolt_diff_<tablename>` allows you to filter the history down to only commits when the cell in question changed. In this case, I'm interested in the commits that are changing my first name. Note, there are two commits that changed my name because one is the original change and the second is the merge commit.

```sql
getting_started=> select to_commit,from_first_name,to_first_name from dolt_diff_employees
    where (from_id=0 or to_id=0) and (from_first_name <> to_first_name or from_first_name is NULL)
    order by to_commit_date;
            to_commit             | from_first_name | to_first_name
----------------------------------+-----------------+---------------
 13qfqa5rojq18j84d1n2htjkm6fletg4 |                 | Tim
 uhkv57j4bp2v16vcnmev9lshgkqq8ppb | Tim             | Timothy
 vn9b0qcematsj2f6ka0hfoflhr5s6p0b | Tim             | Timothy
(3 rows)
```

Doltgres provides powerful data audit capabilities down to individual cells. When, how, and why has each cell in your database changed over time?

## Conclusion

That should be enough to get you started. We covered creating a database and schema, inserting and updating data on main, using branches for change isolation, rollback, diffs and logs, merge, and cell lineage. You had the grand tour. Hopefully you are starting to imagine the possibilities for your Doltgres-backed applications.

Want to dive even deeper? Here are some links to advanced topics:

- [Permissions](/reference/server/access-management)
- [Connecting from application code](/reference/supported-clients/clients)
- [Backups](/reference/server/backups)
- [Replication](/reference/server/replication)
- [Conflicts](/concepts/git/conflicts)
- [Using a Remote with your Server](/reference/version-control/remotes)
