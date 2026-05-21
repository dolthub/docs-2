---
title: SQL Clients
---

Dolt ships with a built in MySQL compatible server. To start the server for your Dolt database, you run `dolt sql-server` in the repository directory. The `dolt sql-server` command starts a MySQL compatible server for the Dolt database on port 3306 with no authentication. The database name is the name of the repository directory but with dashes \(`-`\) replaced with underscores \(`_`\). So `dolt-test` repository name would become `dolt_test` database name. See [this documentation for more configuration details](/cli-reference/cli#dolt-sql-server).

Once a server is running, any MySQL client should be able to connect to Dolt SQL Server in the exact same way it connects to a standard MySQL database. For instance, if you are running a Dolt sql-server locally, you can connect to it with the MySQL client `mysql` like so:

```sql
$ mysql -u root
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.9-Vitess

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

We explicitly support the programmatic clients outlined in this document through integration testing. Tests are run on GitHub pull requests to Dolt in a Ubuntu environment in a Docker container. If you would like another MySQL compatible client supported and tested, [please let us know](https://www.dolthub.com/contact).

The test code linked to below is a good way to get started connecting to a Dolt SQL server if you are not familiar how to connect to MySQL in your language of choice. The code establishes a connection, runs some simple queries, verifies the output comes back as expected, and closes the connection.

> ⚠️ **Disclaimer:** This is a recommendation based on our testing with Dolt. While the MySQL and MariaDB connector libraries are largely similar, we recommend using the MySQL connectors. They are more thoroughly tested with Dolt, whereas the MariaDB connectors have some known quirks, such as silently stripping certain SQL join hint comments.


## Python

We currently support multiple Python MySQL connectors, including [mysql.connector](https://dev.mysql.com/doc/connector-python/en/), [pymysql](https://pymysql.readthedocs.io/en/latest/), and [mariadb](https://mariadb.com/docs/server/connect/programming-languages/python/). These are all fully written in Python, however, the MariaDB connector does build from the C connector.

### mysql.connector

- [Official Client documentation](https://dev.mysql.com/doc/connector-python/en/)
- [Python mysql.connector test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/python/mysql-connector-test.py)

### pymysql

- [Official Client documentation](https://pymysql.readthedocs.io/en/latest/)
- [Python pymysql test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/python/pymysql-test.py)

### mariadb

- [Official Client documentation](https://mariadb.com/docs/connectors/mariadb-connector-python)
- [Python mariadb test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/python/mariadb-connector-test.py)

### SQLAlchemy

We also support the [SQLAlchemy](https://www.sqlalchemy.org/) library. SQLAlchemy requires a connector that is specified in the connection string. Choose one of the supported connectors listed above, and then pass that to the SQLAlchemy connection string, as in the snippet taken from the connector test below:

```python
conn_string_base = "mysql+mysqlconnector://"

engine = create_engine(conn_string_base +
                       "{user}@127.0.0.1:{port}/{db}".format(user=user,
                                                             port=port,
                                                             db=db)
```

- [Offical Library documentation](https://docs.sqlalchemy.org/en/13/)
- [Python SQLAlchemy test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/python/sqlalchemy-test.py)
- [In depth Dolt <> SQLAlchemy guide with Examples](https://www.dolthub.com/blog/2023-07-12-sql-alchemy-getting-started/)

## Node

We support the standard `mysql` Node library as well as the `mariadb` connector.

### mysql

- [Official Client documentation](https://www.npmjs.com/package/mysql)
- [Node MySQL test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/node/index.js)

### mariadb

- [Official Client documentation](https://mariadb.com/docs/connectors/mariadb-connector-nodejs/mariadb-connector-node-js-guide)
- [Node MariaDB test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/node/mariadb-connector.js)

## Java

We support multiple Java MySQL connectors, including `mysql-connector-j`, `mariadb-java-client`, and `r2dbc-mariadb`.

### mysql-connector-j

- [Official Client Documentation](https://dev.mysql.com/doc/connector-j/en/)
- [Java mysql-connector test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/java/src/main/java/MySQLConnectorTest.java)

### mariadb-java-client

- [Official Client Documentation](https://mariadb.com/kb/en/about-mariadb-connector-j/)
- [Java mariadb-java-client test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/java/src/main/java/MariaDBConnectorTest.java)

### r2dbc-mariadb

- [Official Client Documentation](https://mariadb.com/docs/connectors/mariadb-connector-r2dbc/mariadb-connector-r2dbc-guide)
- [Java r2dbc-mariadb test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/java/src/main/java/MariaDBR2DBCTest.java)

## C

We support [libmysqlclient](https://dev.mysql.com/doc/c-api/8.0/en/) distributed by MySQL, the [MariaDB Connector/C](https://mariadb.com/kb/en/mariadb-connector-c/), and the [MariaDB ODBC connector](https://mariadb.com/kb/en/about-mariadb-connector-odbc/). For the tests, we `apt-get install -y libmysqlclient-dev` and compile against the dynamic binaries.

### libmysqlclient

- [Official Client Documentation](https://dev.mysql.com/doc/c-api/8.0/en/)
- [C libmysqlclient test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/c/mysql-connector-test.c)

### MariaDB Connector/C

- [Official Client Documentation](https://mariadb.com/kb/en/mariadb-connector-c/)
- [C MariaDB Connector/C test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/c/mariadb-connector-test.c)

### MariaDB ODBC

- [Official Client Documentation](https://mariadb.com/kb/en/about-mariadb-connector-odbc/)
- [C MariaDB ODBC test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/c/mariadb-odbc-test.c)

## C++

We support `mysql-connector-cpp` and `mariadb-connector-cpp`. We build these connectors through the available packages in MariaDB [download page](https://mariadb.com/downloads/connectors/connectors-data-access/cpp-connector/) or Debian's `apt-get`.

### mysql-connector-cpp

- [Official Client Documentation](https://dev.mysql.com/doc/connector-cpp/8.0/en/)
- [C++ mysql-connector-cpp test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/cpp/mysql-connector-test.cpp)

### mariadb-connector-cpp

- [Official Client Documentation](https://mariadb.com/kb/en/mariadb-connector-cpp/)
- [C++ mariadb-connector-cpp test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/cpp/mariadb-connector-test.cpp)

## Dotnet

We support [MySQL.Data.MySqlClient](https://dev.mysql.com/doc/connector-net/en/) distributed by MySQL and the asynchronous [MySqlConnector](https://mysqlconnector.net/). We tested the client using [.NET 9.0 SDK](https://dotnet.microsoft.com/en-us/download).

### MySQL.Data.MySqlClient

- [Official Client Documentation](https://dev.mysql.com/doc/connector-net/en/)
- [MySql.Data test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/dotnet/MySqlClient/Program.cs)

### MySQLConnector

- [Official Client Documentation](https://mysqlconnector.net/)
- [MySqlConnector test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/dotnet/MySqlConnector/Program.cs)

## Perl

We support the [DBD::mysql](https://metacpan.org/pod/DBD::mysql) and [DBD::MariaDB](https://metacpan.org/pod/DBD::MariaDB) packages that implement [DBI](https://metacpan.org/pod/DBI) for MySQL. These connectors rely on [libmysqlclient](https://dev.mysql.com/doc/c-api/8.0/en/) or [MariaDB Connector/C](https://mariadb.com/kb/en/mariadb-connector-c/).

### DBD::mysql

- [Official Client Documentation](https://metacpan.org/pod/DBD::mysql)
- [DBD::mysql test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/perl/dbd-mysql-test.pl)

### DBD::MariaDB

- [Official Client Documentation](https://metacpan.org/pod/DBD::MariaDB)
- [DBD::MariaDB test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/perl/dbd-mariadb-test.pl)

## PHP

We support the built-in [mysqli](https://www.php.net/manual/en/book.mysqli.php) extension and [PDO](https://www.php.net/manual/en/book.pdo.php) API for connecting to MySQL.

- [Official mysqli Client Documentation](https://www.php.net/manual/en/book.mysqli.php)
- [mysqli test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/php/mysqli_connector_test.php)

- [Official PDO Client Documentation](https://www.php.net/manual/en/book.pdo.php)
- [PDO test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/php/pdo_connector_test.php)

## Go

We support multiple Go MySQL clients, including [go-sql-driver/mysql](https://github.com/go-sql-driver/mysql) (the standard MySQL driver for the [database/sql](https://golang.org/pkg/database/sql/) package) and [go-mysql](https://github.com/go-mysql-org/go-mysql).

### go-sql-driver/mysql

- [Official Client Documentation](https://github.com/go-sql-driver/mysql)
- [go-sql-driver/mysql test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/go/sql-driver-mysql-test.go)

### go-mysql

- [Official Client Documentation](https://github.com/go-mysql-org/go-mysql)
- [go-mysql test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/go-mysql/mysql-client-test.go)

## Ruby

We support the native [ruby/mysql](http://www.tmtm.org/en/ruby/mysql/) library and the native [mysql2](https://github.com/brianmario/mysql2) library. The [mysql/ruby](http://www.tmtm.org/en/mysql/ruby/) package uses the MySQL C API and [has not been ported to MySQL client version 8](https://github.com/luislavena/mysql-gem/issues/35). Thus, we do not support `mysql/ruby`.

### mysql2

- [Official Client Documentation](https://www.rubydoc.info/gems/mysql2)
- [mysql2 test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/ruby/mysql2-test.rb)

### ruby/mysql

- [Official Client Documentation](http://www.tmtm.org/en/ruby/mysql/)
- [ruby/mysql test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/ruby/mysql-client-test.rb)

## R

We support the legacy [RMySQL](https://github.com/r-dbi/RMySQL) and newer [RMariaDB](https://github.com/r-dbi/RMariaDB) R clients. Both implement [DBI](https://metacpan.org/pod/DBI) and require either [libmysqlclient](https://dev.mysql.com/doc/c-api/8.0/en/) or [MariaDBConnector/C](https://mariadb.com/docs/connectors/mariadb-connector-c/mariadb-connector-c-guide).

- [RMySQL Official Client Documentation](https://github.com/r-dbi/RMySQL)
- [RMYSQL test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/r/rmysql-test.r)

- [RMariaDB Official Client Documentation](https://rmariadb.r-dbi.org)
- [RMariaDB test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/r/rmariadb-test.r)

There is also an open-source, third-party wrapper for working with Dolt, called [DoltR](https://github.com/noamross/doltr). This tool is well-maintained by [EcoHealth Alliance](https://www.ecohealthalliance.org/) and provides an easy way to work with local or remote Dolt databases from within R Studio.

- [Getting Started with DoltR](https://rdrr.io/github/ecohealthalliance/doltr/f/)
- [DoltR on GitHub](https://github.com/ecohealthalliance/doltr)

## Rust

We support the [mysql crate](https://docs.rs/mysql/latest/mysql/) in Rust.

- [Official Client Documentation](https://docs.rs/mysql/latest/mysql/)
- [Rust test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/rust/src/mysql_connector_test.rs)

## Elixir

We support multiple Elixir MySQL clients, including [MyXQL](https://hex.pm/packages/myxql) (a native Elixir MySQL driver) and [mysql-otp](https://github.com/mysql-otp/mysql-otp) (an Erlang MySQL driver usable from Elixir).

### MyXQL

- [Official Client Documentation](https://hexdocs.pm/myxql/)
- [Elixir MyXQL test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/elixir/myxql/lib/simple.ex)

### mysql-otp

- [Official Client Documentation](https://github.com/mysql-otp/mysql-otp)
- [Elixir mysql-otp test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/elixir/mysql/lib/mysql_otp_test.ex)

## Swift

We support the [Perfect-MariaDB](https://github.com/PerfectlySoft/Perfect-MariaDB) connector for Swift, which provides MariaDB/MySQL connectivity using the MariaDB Connector/C library.

- [Official Client Documentation](https://github.com/PerfectlySoft/Perfect-MariaDB)
- [Swift Perfect-MariaDB test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/swift/Sources/main.swift)
