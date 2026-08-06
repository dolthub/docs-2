---
title: Sequences
description: Sequences, SERIAL, and identity columns in Doltgres, and how they interact with branches and merges.
---

## What is a Sequence?

*Sequences* are a database entity that keeps track of a number that counts up or down. You can
create a sequence with the `CREATE SEQUENCE` statement, and access its next value with the
`nextval` function. If you want to change the value of the counter, use the `setval` function.

```sql
CREATE SEQUENCE counter;

SELECT nextval('counter'); -- 1
SELECT nextval('counter'); -- 2
SELECT nextval('counter'); -- 3

-- Move the counter to a new value
SELECT setval('counter', 100);
SELECT nextval('counter'); -- 101
```

## Options for sequences

Sequences can be configured with a few different numeric data types. They can count up or down by an
increment you choose, and they can be configured to wrap around to the start value. By default, they
start at 1 and count up by 1.

```sql
-- A sequence that counts up by 2, starting at 2
CREATE SEQUENCE evens START 2 INCREMENT BY 2;

SELECT nextval('evens'); -- 2
SELECT nextval('evens'); -- 4

-- A smallint sequence that counts down from 10 to 2 by 2,
-- then wraps around to the start
CREATE SEQUENCE countdown AS smallint
    INCREMENT BY -2 MINVALUE 2 MAXVALUE 10 START 10 CYCLE;

SELECT nextval('countdown'); -- 10
SELECT nextval('countdown'); -- 8
SELECT nextval('countdown'); -- 6
SELECT nextval('countdown'); -- 4
SELECT nextval('countdown'); -- 2
SELECT nextval('countdown'); -- 10 (wrapped around)
```

### SERIAL Columns

`SERIAL` columns are an option during `CREATE TABLE` statements to automatically create a sequence
and set the default value for a column to use its `nextval`. This is an easy way to create unique
values in a key column automatically.

```sql
CREATE TABLE users (id SERIAL PRIMARY KEY, name text);

INSERT INTO users (name) VALUES ('ada'), ('grace');

SELECT * FROM users;
--  id | name
-- ----+-------
--   1 | ada
--   2 | grace
```

### Identity Columns

`IDENTITY` columns are another way to get database-assigned unique values in a key column. This is
the modern, preferred method of accomplishing this use case.

```sql
CREATE TABLE employees (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text);

INSERT INTO employees (name) VALUES ('ada'), ('grace');

SELECT * FROM employees;
--  id | name
-- ----+-------
--   1 | ada
--   2 | grace
```
