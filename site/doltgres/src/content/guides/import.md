---
title: Importing Data
description: Getting data into Doltgres — pg_dump, psql, and COPY FROM.
---

If you have existing data you want to import into Doltgres, first [start your Doltgres server](/introduction/getting-started). Then follow one of the guides below.

## Importing a Postgres Database with pg_dump

If you have data currently in Postgres you want to migrate to Doltgres, first run pg_dump to get a
dump of the current data.

```bash
pg_dump -h localhost -U postgres --no-owner --no-privileges mydb > mydb.sql
```

You can import the dump into your Doltgres server with the `psql` tool like so:

```bash
# Create the database on the Doltgres server, then replay the dump into it
psql -h 127.0.0.1 -U postgres -c "CREATE DATABASE mydb;"
psql -h 127.0.0.1 -U postgres -d mydb -f mydb.sql
```

## Loading Data Files with COPY FROM

If you have data in another format like CSV that you want to host in Doltgres, start by creating a
table with the schema you want:

```sql
CREATE TABLE products (id int PRIMARY KEY, name text, price decimal(8,2));
```

Then use the `psql` tool to issue a `COPY FROM` statement to load your file into the new table.

```bash
# \copy reads the file on your local machine and sends it to the
# server as a COPY ... FROM STDIN statement
psql -h 127.0.0.1 -U postgres -d mydb \
    -c "\copy products FROM 'products.csv' WITH (FORMAT csv, HEADER true)"
```

If the file is on the same host as the Doltgres server, you can also use a plain `COPY FROM`
statement with the file's path on the server:

```bash
psql -h 127.0.0.1 -U postgres -d mydb \
    -c "COPY products FROM '/path/to/products.csv' WITH (FORMAT csv, HEADER true);"
```

## Verifying an Import

Connect to your Doltgres server and run `SHOW TABLES` and `SELECT` statements to verify that the
tables you expect exist and are populated. Now is a great time to create your first Dolt commit too.

```sql
SHOW TABLES;
--  Tables_in_mydb
-- ----------------
--  employees
--  products

SELECT count(*) FROM products;
--  count
-- -------
--      3

-- Stage all tables and create the first commit of the imported data
SELECT dolt_commit('-Am', 'Initial import of mydb');
```
