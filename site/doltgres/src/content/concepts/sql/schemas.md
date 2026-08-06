---
title: Schemas
description: Postgres schemas (namespaces) in Doltgres — the public schema, search_path, and how schemas interact with databases and branches.
---

## What is a Schema?

A *schema* is a namespace element in a database. In Postgres, all database entities like tables,
sequences, functions, etc. belong to a schema, which is part of their fully qualified name. You can
address tables with their schema in any SQL statement, like this:

```sql
SELECT * FROM public.myTable;
```

## The `public` schema

When you create a database, one schema gets created for you automatically: `public`. If you don't
create any other schemas, every table you create will automatically be placed in the `public`
schema.

## The search_path

Two tables with the same name can exist in two or more different schemas. When you use a table name
without qualifying it with its schema name in a statement, Postgres resolves it by using the
*search_path* session variable. Like the `$PATH` construct in a shell, Postgres will examine each
comma-separated element of `search_path`, in order, to find the first schema that has a table with
the name you provided.

```sql
-- Create two schemas, each containing a table named "items"
CREATE SCHEMA inventory;
CREATE SCHEMA sales;

CREATE TABLE inventory.items (id int PRIMARY KEY, name text);
CREATE TABLE sales.items (id int PRIMARY KEY, name text);

INSERT INTO inventory.items VALUES (1, 'wrench');
INSERT INTO sales.items VALUES (1, 'invoice');

-- With inventory on the search_path, the unqualified name
-- "items" resolves to inventory.items
SET search_path TO inventory;
SELECT * FROM items;
--  id |  name
-- ----+--------
--   1 | wrench

-- With sales on the search_path, the same query
-- now reads sales.items instead
SET search_path TO sales;
SELECT * FROM items;
--  id |  name
-- ----+---------
--   1 | invoice
```

By default, `search_path` has two elements:

* A schema with the same name as the logged in user
* `public`

When you create a table with `CREATE TABLE` and don't specify a schema name, it will be created in
the first existing schema found on `search_path`.

## Creating new schemas

Create new schemas with a `CREATE SCHEMA` statement. To use the new schema in queries, either use a
schema-qualified table name, or place the schema on `search_path`.
