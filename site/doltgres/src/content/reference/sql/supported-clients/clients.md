---
title: SQL Clients
---

Doltgres ships with a built-in Postgres compatible server. To start the server for your Doltgres
database, you run `doltgres`. The `doltgres` command starts a Postgres compatible server
on port 5432. By default, a user named `postgres` with a password of `password` is created, along
with the `postgres` database.

Once a server is running, any Postgres client should be able to connect to Doltgres SQL Server in
the exact same way it connects to a standard Postgres database. For instance, if you are running a
Doltgres sql-server locally, you can connect to it with the `psql` client like so:

```sql
PGPASSWORD=password psql -h 127.0.0.1 -U postgres
psql (16.1 (Ubuntu 16.1-1.pgdg20.04+1), server 15.0)
Type "help" for help.

postgres=>
```

We explicitly support the programmatic clients outlined in this document through integration
testing. Tests are run on GitHub pull requests to Doltgres in a Ubuntu environment in a Docker
container. If you would like another Postgres compatible client supported and tested, [please let us
know](https://www.dolthub.com/contact).

The [test code](https://github.com/dolthub/doltgresql/tree/main/testing/postgres-client-tests)
linked to below is a good way to get started connecting to a Doltgres SQL server if you are not
familiar how to connect to Postgres in your language of choice. The code establishes a connection,
runs some simple queries, verifies the output comes back as expected, and closes the connection.

## Supported clients

Doltgres client support and tests for compatibility are still being built out. If you have a
particular client you would like to see supported, please let us know by [filing an
issue](https://github.com/dolthub/doltgresql/issues).

## Java

### pgJDBC

- [Official Client Documentation](https://jdbc.postgresql.org/)
- [Java pgJDBC test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/java/PostgresTest.java)

### R2DBC PostgreSQL

- [Official Client Documentation](https://github.com/pgjdbc/r2dbc-postgresql)
- [Java R2DBC test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/r2dbc/src/main/java/R2dbcTest.java)

## Node

### node-postgres (pg)

- [Official Client Documentation](https://node-postgres.com/)
- [Node postgres test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/node/index.js)

### Knex.js

- [Official Library Documentation](https://knexjs.org/)
- [Knex test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/node/knex.js)

### Drizzle ORM

- [Official Library Documentation](https://orm.drizzle.team/)
- [Drizzle test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/drizzle/src/index.ts)

## Python

### psycopg2

- [Official Client Documentation](https://www.psycopg.org/docs/)
- [Python psycopg2 test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/python/psycopg2_test.py)

### SQLAlchemy

- [Official Library Documentation](https://www.sqlalchemy.org/)
- [Python SQLAlchemy test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/python/sqlalchemy-test.py)

## Go

### pgx

- [Official Client Documentation](https://github.com/jackc/pgx)
- [Go pgx test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/go/pgx/main.go)

### lib/pq

- [Official Client Documentation](https://github.com/lib/pq)
- [Go lib/pq test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/go/libpq/main.go)

## C

### libpq

- [Official Client Documentation](https://www.postgresql.org/docs/current/libpq.html)
- [C libpq test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/c/postgres-c-connector-test.c)

### libaprutil (apr_dbd)

- [Official Client Documentation](https://apr.apache.org/docs/apr-util/)
- [C libaprutil test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/c/libaprutil-test.c)

### libdbi

- [Official Client Documentation](https://libdbi.sourceforge.net/)
- [C libdbi test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/c/libdbi-test.c)

## C++

### libpqxx

- [Official Client Documentation](https://pqxx.org/libpqxx/)
- [C++ libpqxx test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/cpp/libpqxx-test.cpp)

## ODBC

### psqlODBC

- [Official Client Documentation](https://odbc.postgresql.org/)
- [psqlODBC test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/odbc/psqlodbc-test.c)

## Perl

### DBD::Pg

- [Official Client Documentation](https://metacpan.org/pod/DBD::Pg)
- [Perl DBD::Pg test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/perl/postgres-test.pl)

## Ruby

### pg

- [Official Client Documentation](https://github.com/ged/ruby-pg)
- [Ruby pg test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/ruby/pg-test.rb)

### Sequel

- [Official Library Documentation](https://sequel.jeremyevans.net/)
- [Ruby Sequel test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/ruby/sequel-test.rb)

### ActiveRecord

- [Official Library Documentation](https://guides.rubyonrails.org/active_record_basics.html)
- [Ruby ActiveRecord test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/ruby/activerecord-test.rb)

## PHP

### pgsql (pg_connect)

- [Official Client Documentation](https://www.php.net/manual/en/book.pgsql.php)
- [PHP pg_connect test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/php/pg_connect_test.php)

### PDO_PGSQL

- [Official Client Documentation](https://www.php.net/manual/en/ref.pdo-pgsql.php)
- [PHP PDO test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/php/pdo_connector_test.php)

## R

### RPostgres

- [Official Client Documentation](https://rpostgres.r-dbi.org/)
- [R RPostgres test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/r/rpostgres-test.r)

### RPostgreSQL

- [Official Client Documentation](https://cran.r-project.org/package=RPostgreSQL)
- [R RPostgreSQL test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/r/rpostgresql-test.r)

## Rust

### sqlx

- [Official Client Documentation](https://github.com/launchbadge/sqlx)
- [Rust sqlx test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/rust/src/main.rs)

## Dotnet

### Npgsql

- [Official Client Documentation](https://www.npgsql.org/)
- [Npgsql test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/dotnet/Program.cs)

## Elixir

### Postgrex

- [Official Client Documentation](https://hexdocs.pm/postgrex/)
- [Elixir Postgrex test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/elixir/lib/postgrex_test.ex)

Note: the Postgrex test is currently disabled in CI due to a [known
issue](https://github.com/dolthub/doltgresql/issues/2859).

## Swift

### PostgresNIO

- [Official Client Documentation](https://github.com/vapor/postgres-nio)
- [Swift PostgresNIO test code](https://github.com/dolthub/doltgresql/blob/main/testing/postgres-client-tests/swift/Sources/PostgresNIOTest.swift)
