---
title: Configuration
---

# Configuration

A Dolt SQL server can be configured at server start time using a [configuration file](#configyaml), or by
setting [system variables](#system-variables) in the SQL session.

# config.yaml


The simplest way to configure server behavior is to provide a config file with the
`--config` flag, usually called `config.yaml`.
Here is a complete `config.yaml` file populated with all the default values for every key. 

```yaml
log_level: info
log_format: text

behavior:
  read_only: false
  autocommit: true
  disable_client_multi_statements: false
  dolt_transaction_commit: false
  event_scheduler: "ON"
  auto_gc_behavior:
    enable: false
    archive_level: 0

listener:
  host: localhost
  port: 3306
  max_connections: 1000
  back_log: 50
  max_connections_timeout_millis: 60000
  read_timeout_millis: 28800000
  write_timeout_millis: 28800000
  ca_cert: null
  tls_key: null
  tls_cert: null
  require_client_cert: null
  require_secure_transport: null
  allow_cleartext_passwords: null

max_logged_query_len: 0

data_dir: .
cfg_dir: .doltcfg
privilege_file: .doltcfg/privileges.db
branch_control_file: .doltcfg/branch_control.db

# Advanced Configuration
metrics:
  labels: {}
  host: null
  port: -1

remotesapi:
  port: null
  read_only: null

mcp_server:
  port: 7007
  user: root
  password: ""
  database: ""

system_variables: {}

user_session_vars: []

jwks: []

# Cluster configuration has required defaults.
# cluster: {}
```

For the examples, I use a database named `config_blog` with a single table defined by:

```sql
create table t (
  id int primary key,
  words varchar(100)
)
```

## `log_level`

This configuration value is used to increase or decease the log level of your Dolt SQL server. Logs by default are printed to `STDERR` and `STDOUT`.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

>  Level of logging provided. Options are: trace, debug, info, warning, error, and fatal.

**Default**: `info`

**Values**:

Possible values from most logging to least. Each log level logs everything below it plus the values at the listed level.

1. `trace`: Logs server messages including MySQL wire protocol messages. Useful for debugging client/server communication issues.  
2. `debug`: Logs all queries, results, and latencies. Useful when trying to debug bad query behavior like what query is causing an error. Note, SQL queries often contain sensitive data so this log level is not recommended for production use.
3. `info`: Logs informational messages but not queries. This log level is recommended for production deployments.
4. `warning`: Logs warnings.
5. `error`: Logs all errors.
6. `fatal`: Logs fatal errors.

**Example**:

In this example, I set the log level to `info` and run a bad query. Then, I restart the server with `debug` log level and re-run the same bad query.

```sh
$ grep log_level config.yaml        
log_level: info
$ dolt sql-server --config=config.yaml
Starting server with Config HP="localhost:3310"|T="28800000"|R="false"|L="info"|S="/tmp/mysql.sock"
WARN[0000] unix socket set up failed: file already in use: /tmp/mysql.sock 
INFO[0000] Server ready. Accepting connections.         
WARN[0000] secure_file_priv is set to "", which is insecure. 
WARN[0000] Any user with GRANT FILE privileges will be able to read any file which the sql-server process can read. 
WARN[0000] Please consider restarting the server with secure_file_priv set to a safe (or non-existent) directory. 
INFO[0009] NewConnection                                 DisableClientMultiStatements=false connectionID=1
WARN[0009] error running query                           connectTime="2024-12-04 13:22:52.439832 -0800 PST m=+9.896056876" connectionDb=config_blog connectionID=1 error="column \"bad_col\" could not be found in any table in scope"
```

As you can see, I get the error but not the query that caused the error. Now, I stop the server using `Ctrl-C` and edit my config.yaml using `emacs`, raising the log level to `debug`. I restart the server and re-run the bad query in a connected client.

```sh
$ emacs config.yaml
$ grep log_level config.yaml        
log_level: debug
$ dolt sql-server --config=config.yaml
Starting server with Config HP="localhost:3310"|T="28800000"|R="false"|L="debug"|S="/tmp/mysql.sock"
DEBU[0000] Loading events                               
WARN[0000] unix socket set up failed: file already in use: /tmp/mysql.sock 
INFO[0000] Server ready. Accepting connections.         
WARN[0000] secure_file_priv is set to "", which is insecure. 
WARN[0000] Any user with GRANT FILE privileges will be able to read any file which the sql-server process can read. 
WARN[0000] Please consider restarting the server with secure_file_priv set to a safe (or non-existent) directory. 
INFO[0006] NewConnection                                 DisableClientMultiStatements=false connectionID=1
DEBU[0006] Starting query                                connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionID=1 query="select @@version_comment limit 1"
DEBU[0006] Query finished in 0 ms                        connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionID=1 query="select @@version_comment limit 1"
DEBU[0011] Starting query                                connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionID=1 query="SELECT DATABASE()"
DEBU[0011] Query finished in 0 ms                        connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionID=1 query="SELECT DATABASE()"
DEBU[0011] Starting query                                connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionDb=config_blog connectionID=1 query="show databases"
DEBU[0011] Query finished in 0 ms                        connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionDb=config_blog connectionID=1 query="show databases"
DEBU[0011] Starting query                                connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionDb=config_blog connectionID=1 query="show tables"
DEBU[0011] Query finished in 0 ms                        connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionDb=config_blog connectionID=1 query="show tables"
DEBU[0011] Starting query                                connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionDb=config_blog connectionID=1 query="SELECT * FROM `t` LIMIT 0;"
DEBU[0011] Query finished in 0 ms                        connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionDb=config_blog connectionID=1 query="SELECT * FROM `t` LIMIT 0;"
DEBU[0019] Starting query                                connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionDb=config_blog connectionID=1 query="select * from t where bad_col=3"
WARN[0019] error running query                           connectTime="2024-12-04 13:25:18.756126 -0800 PST m=+6.422378084" connectionDb=config_blog connectionID=1 error="column \"bad_col\" could not be found in any table in scope" query="select * from t where bad_col=3"
```

I now see the bad query being run is `select * from t where bad_col=3`.

## `log_format`

This configuration value is used to change the log format. Current supported options are text and json. Text is the default.

**Default**: `text`

**Values**:

1. `text`: Default log format emits logs as text strings
2. `json`: Emits logs in json format for easier parsing

**Example**:

In this example, I set the log format to `json` and start a server. As you can see the logs are emitted in json format.

```sh
$ grep log_format config.yaml        
log_format: json
$ dolt sql-server --config=config.yaml
'Starting server with Config HP="localhost:3306"|T="28800000"|R="false"|L="debug"|S="/tmp/mysql.sock"
{"level":"debug","msg":"Loading events","time":"2025-03-05T09:38:03-08:00"}
{"level":"debug","msg":"privileges.db already exists, not creating root superuser","time":"2025-03-05T09:38:03-08:00"}
{"level":"warning","msg":"unix socket set up failed: file already in use: /tmp/mysql.sock","time":"2025-03-05T09:38:03-08:00"}
{"level":"info","msg":"Server ready. Accepting connections.","time":"2025-03-05T09:38:03-08:00"}
{"level":"warning","msg":"secure_file_priv is set to \"\", which is insecure.","time":"2025-03-05T09:38:03-08:00"}
{"level":"warning","msg":"Any user with GRANT FILE privileges will be able to read any file which the sql-server process can read.","time":"2025-03-05T09:38:03-08:00"}
{"level":"warning","msg":"Please consider restarting the server with secure_file_priv set to a safe (or non-existent) directory.","time":"2025-03-05T09:38:03-08:00"}
```

## `behavior`

The `behavior` section of `config.yaml` defines configuration that determines the way the SQL engine works.

### `read_only`

This configuration value is used to turn your SQL server into read only mode, preventing any write queries from succeeding and logging an error.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> If true database modification is disabled. Defaults to false.

**Default**: false

**Values**: true, false

**Example**:

I start the Dolt SQL server with `read_only` set to false. The second `read_only` configuration value is `remotesapi.read_only` which is set to `null`.

```sh
$ grep read_only config.yaml 
  read_only: false
  read_only: null
$ emacs config.yaml         
$ dolt sql-server --config=config.yaml
Starting server with Config HP="localhost:3310"|T="28800000"|R="false"|L="info"|S="/tmp/mysql.sock"
WARN[0000] unix socket set up failed: file already in use: /tmp/mysql.sock 
INFO[0000] Server ready. Accepting connections.         
WARN[0000] secure_file_priv is set to "", which is insecure. 
WARN[0000] Any user with GRANT FILE privileges will be able to read any file which the sql-server process can read. 
WARN[0000] Please consider restarting the server with secure_file_priv set to a safe (or non-existent) directory. 
```

I make an insert in a connected client and it succeeds.

```sql
MySQL [config_blog]> insert into t values (0, 'first');
Query OK, 1 row affected (0.006 sec)
```

Now, I stop the above server using `Ctrl-C` and modify the `config.yaml` by setting `read_only` to `true`. Then, I restart the server using the new `config.yaml`.

```sh
$ emacs config.yaml                   
$ grep read_only config.yaml          
  read_only: true
  read_only: null
$ dolt sql-server --config=config.yaml
Starting server with Config HP="localhost:3310"|T="28800000"|R="true"|L="info"|S="/tmp/mysql.sock"
WARN[0000] unix socket set up failed: file already in use: /tmp/mysql.sock 
INFO[0000] Server ready. Accepting connections.         
WARN[0000] secure_file_priv is set to "", which is insecure. 
WARN[0000] Any user with GRANT FILE privileges will be able to read any file which the sql-server process can read. 
WARN[0000] Please consider restarting the server with secure_file_priv set to a safe (or non-existent) directory. 
INFO[0016] NewConnection                                 DisableClientMultiStatements=false connectionID=1
WARN[0016] error running query                           connectTime="2024-12-04 14:38:05.684674 -0800 PST m=+16.751230334" connectionDb=config_blog connectionID=1 error="database server is set to read only mode"
```

As expected, you can see the query failed with a "database server is set to read only mode". In the client, I also received the same error.

```sql
MySQL [config_blog]> insert into t values (1, 'second');
ERROR 1105 (HY000): database server is set to read only mode
```

### `autocommit`

`autocommit` is a standard SQL database setting where every SQL statement triggers a transaction `COMMIT`. Without `autocommit`, the user is responsible for managing their own concurrency by issuing `BEGIN` statements at the start of transactions and `COMMIT` or `ROLLBACK` statements at the end of transactions. Most databases (ie. MySQL, Postgres) and clients (ie. ODBC, JDBC) have `autocommit` on by default with [the notable exception of the Python client](https://www.dolthub.com/blog/2023-09-25-python-autocommit/).

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> If true every statement is committed automatically. Defaults to true. @@autocommit can also be specified in each session.

**Default**: true

**Values**: true, false

**Example**:

`autocommit` is visible under concurrency so for this example I need two connected clients. I start by starting the Dolt SQL server with `autocommit` on.

```sh
$ grep autocommit config.yaml 
  autocommit: true
$ dolt sql-server --config=config.yaml
Starting server with Config HP="localhost:3310"|T="28800000"|R="false"|L="info"|S="/tmp/mysql.sock"
```

Now I connect both clients, viewing the state of the table. In client one I see:

```sql
MySQL [config_blog]> select * from t;
+----+-------+
| id | words |
+----+-------+
|  0 | first |
+----+-------+
1 row in set (0.001 sec)
```

In client two I see the same thing:

```sql
MySQL [config_blog]> select * from t;
+----+-------+
| id | words |
+----+-------+
|  0 | first |
+----+-------+
1 row in set (0.001 sec)
```

Back in client one, I insert a value:

```sql
MySQL [config_blog]> insert into t values (1, 'second');
Query OK, 1 row affected (0.007 sec)
```

And I am able to see that value in client two without issuing an explicit transaction commit.

```sql
MySQL [config_blog]> select * from t;
+----+--------+
| id | words  |
+----+--------+
|  0 | first  |
|  1 | second |
+----+--------+
2 rows in set (0.004 sec)
```

Now, I kill the server with `Ctrl-C` and set `autocommit` to false in `config.yaml`.

```sh
$ emacs config.yaml 
$ grep autocommit config.yaml
  autocommit: false
$ dolt sql-server --config=config.yaml
Starting server with Config HP="localhost:3310"|T="28800000"|R="false"|L="info"|S="/tmp/mysql.sock"
```

Now I reconnect both clients. I should see this table in both clients:

```sql
MySQL [config_blog]> select * from t;
+----+--------+
| id | words  |
+----+--------+
|  0 | first  |
|  1 | second |
+----+--------+
2 rows in set (0.004 sec)
```

In client one I make an insert:

```sql
MySQL [config_blog]> insert into t values (2, 'third');
Query OK, 1 row affected (0.005 sec)
```

But that insert is not visible in client two:

```sql
MySQL [config_blog]> select * from t;
+----+--------+
| id | words  |
+----+--------+
|  0 | first  |
|  1 | second |
+----+--------+
2 rows in set (0.001 sec)
```

I must issue a `commit` in client one:

```sql
MySQL [config_blog]> commit;
Query OK, 0 rows affected (0.007 sec)
```

and a `begin` in client two. Now I see the insert in client two.

```sql
MySQL [config_blog]> begin;
Query OK, 0 rows affected (0.000 sec)

MySQL [config_blog]> select * from t;
+----+--------+
| id | words  |
+----+--------+
|  0 | first  |
|  1 | second |
|  2 | third  |
+----+--------+
3 rows in set (0.001 sec)
```

### `disable_client_multi_statements`

By default, the Dolt SQL server can accept and process multiple SQL queries in a single statement. The default delimiter is a semicolon (ie.  `;`). So, you can send multiple SQL queries in the same statement as long as they are separated by a semicolon and by default Dolt will process each individually and return the results. However, some clients are not able to handle multiple result sets from a single statement. So, Dolt offers a configuration value to fail statements that contain multiple SQL queries. 

**Default**: false

**Values**: true, false

**Example**:

In order to get the standard MySQL client to send multi-statement queries to a server, I must change the delimiter to something other than `;`. The client parses queries at the defined delimiter and sends them individually. So, I start by changing the delimiter on my client to `?`.

```sql
MySQL [config_blog]> delimiter '?';
```

Now, I issue a multi-statement query and it succeeds.

```sql
MySQL [config_blog]> insert into t values (3, 'fourth'); update t set words='first  modified' where id=0?
Query OK, 1 row affected (0.012 sec)

Query OK, 1 row affected (0.012 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

I stop the server using `Ctrl-C`. Now, I set the `disable_client_multi_statement` to true and restart the server:

```sh
$ emacs config.yaml
$ grep multi_statement config.yaml
  disable_client_multi_statements: true                   
$ dolt sql-server --config=config.yaml
Starting server with Config HP="localhost:3310"|T="28800000"|R="false"|L="debug"|S="/tmp/mysql.sock"
```

I pass in the inverse query and it will fail:

```sql
MySQL [config_blog]> delete from t where id=3; update t set words='first' where id=0?
ERROR 1105 (HY000): syntax error at position 33 near 'update'
```

### `dolt_transaction_commit`

Dolt offers a setting where every transaction commit also becomes a Dolt commit. That setting can be controlled using `dolt_transaction_commit` in `config.yaml`. By default, Dolt commits are user controlled and triggered via the [`dolt_commit()` procedure](https://docs.dolthub.com/sql-reference/version-control/dolt-sql-procedures#dolt_commit). In some cases, like when you have an existing application that is built against standard MySQL, you may want Dolt commits generated automatically. This setting enables that behavior.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> If true all SQL transaction commits will automatically create a Dolt commit, with a generated commit message. This is useful when a system working with Dolt wants to create versioned data, but doesn't want to directly use Dolt features such as dolt_commit()

**Default**: false

**Values**: true, false

**Example**:

Without `dolt_transaction_commit` enabled, I must issue a call to the `dolt_commit()` procedure to get a new entry in the log.

```sql
MySQL [config_blog]> call dolt_commit('-Am', 'Manual commit');
+----------------------------------+
| hash                             |
+----------------------------------+
| rgifn94i58hqov4mdv0efsjju0qpg964 |
+----------------------------------+
1 row in set (0.006 sec)

MySQL [config_blog]> select * from dolt_log;
+----------------------------------+-----------+-----------------+---------------------+---------------------------------+
| commit_hash                      | committer | email           | date                | message                         |
+----------------------------------+-----------+-----------------+---------------------+---------------------------------+
| rgifn94i58hqov4mdv0efsjju0qpg964 | root      | root@%          | 2024-12-05 00:48:50 | Manual commit                   |
| do1tvb8g442jvggv4e3nfqp3fmqt0u5a | timsehn   | tim@dolthub.com | 2024-12-03 19:16:49 | Inіtialіze datа rеposіtory      |
+----------------------------------+-----------+-----------------+---------------------+---------------------------------+
2 rows in set (0.001 sec)
```

After I enable `dolt_transaction_commit` and restart the server:

```sh
$ emacs config.yaml 
$ grep dolt_transaction_commit config.yaml 
  dolt_transaction_commit: true
$ dolt sql-server --config=config.yaml    
Starting server with Config HP="localhost:3310"|T="28800000"|R="false"|L="debug"|S="/tmp/mysql.sock"
```

Every write statement becomes a Dolt commit:

```sql
MySQL [config_blog]> insert into t values (4, 'dolt commit');
Query OK, 1 row affected (0.009 sec)

MySQL [config_blog]> select * from dolt_log;
+----------------------------------+------------+-----------------+---------------------+---------------------------------+
| commit_hash                      | committer  | email           | date                | message                         |
+----------------------------------+------------+-----------------+---------------------+---------------------------------+
| vmikac4f7s4395v0v43dtfcbhrmtmo41 | configblog | tim@dolthub.com | 2024-12-05 00:51:32 | Transaction commit              |
| rgifn94i58hqov4mdv0efsjju0qpg964 | root       | root@%          | 2024-12-05 00:48:50 | Manual commit                   |
| do1tvb8g442jvggv4e3nfqp3fmqt0u5a | timsehn    | tim@dolthub.com | 2024-12-03 19:16:49 | Inіtialіze datа rеposіtory      |
+----------------------------------+------------+-----------------+---------------------+---------------------------------+
```

Note, I lose control of the commit message in this mode. The commit is made by the server user, in this case `configblog`, in contrast to manual commits which are made by the client user `root`.

### `event_scheduler` 

Dolt supports [MySQL events](https://dev.mysql.com/doc/refman/8.4/en/create-event.html). Events are scheduled jobs created using the `CREATE EVENT` SQL statement. Event scheduling is on by default but can be disabled using this configuration setting. Note, only events on the main branch will be executed by the event scheduler. Events can be used to schedule Dolt commits at intervals if you don't have access to the application code for your application, but also don't want a commit at every SQL transaction.

**Default**: "ON"

**Values**: "ON", "OFF"

**Example**:

I start the Dolt SQL server in debug mode so we can see event execution in the logs. I create an event to create a Dolt commit every minute. Notice the `--allow-empty` flag. This allows Dolt to commit without error even when nothing has changed in the database.

```sql
[config_blog]> CREATE EVENT make_dolt_commits ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 MINUTE DO CALL dolt_commit('-A', '--allow-empty', '-m', 'Commit created using an event');
Query OK, 0 rows affected (0.011 sec)
```

Now, we wait a minute and in the logs we see that the event has fired, as expected.

```sh
DEBU[0090] Executing event config_blog.make_dolt_commits, seconds until execution: -28.759227 
DEBU[0090] executing event config_blog.make_dolt_commits  query="CALL dolt_commit('-A', '--allow-empty', '-m', 'Commit created using an event')"
```

We can inspect the Dolt log and see indeed the commit succeeded.

```sql
MySQL [config_blog]> select * from dolt_log;
+----------------------------------+------------+-----------------+---------------------+---------------------------------+
| commit_hash                      | committer  | email           | date                | message                         |
+----------------------------------+------------+-----------------+---------------------+---------------------------------+
| im7qq2ja3nfqnc75khtuli8krla3s3fm | root       | root@%          | 2024-12-05 20:19:04 | Commit created using an event   |
| vmikac4f7s4395v0v43dtfcbhrmtmo41 | configblog | tim@dolthub.com | 2024-12-05 00:51:32 | Transaction commit              |
| rgifn94i58hqov4mdv0efsjju0qpg964 | root       | root@%          | 2024-12-05 00:48:50 | Manual commit                   |
| do1tvb8g442jvggv4e3nfqp3fmqt0u5a | timsehn    | tim@dolthub.com | 2024-12-03 19:16:49 | Inіtialіze datа rеposіtory      |
+----------------------------------+------------+-----------------+---------------------+---------------------------------+
```

Now stop the server and stop event execution using `config.yaml`.

```sh
$ emacs config.yaml
$ grep event_scheduler config.yaml 
  event_scheduler: "OFF"                   
$ dolt sql-server --config=config.yaml
Starting server with Config HP="localhost:3310"|T="28800000"|R="false"|L="debug"|S="/tmp/mysql.sock"
```

We do not see any more commits in the debug log or in the Dolt log.

### `auto_gc_behavior`

The `auto_gc_behavior` subsection of `behavior` controls the configuration of [automatic garbage collection](/sql-reference/server/garbage-collection#automatic-gc).

#### `enable`

**Default**: true

**Values**: false, true

**Example**:

When automatic GC is disabled, Dolt never performs a garbage collection of a database without being explicitly asked to. In this mode, the only way to run GC is to run the SQL query `call dolt_gc()`. When automatic GC is disabled, running garbage collection on the server forcefully terminates inflight connections and terminally invalidates the requesting connection:

```sql
MySQL [auto_gc_test]> call dolt_gc();
+--------+
| status |
+--------+
|      0 |
+--------+
1 row in set (0,04 sec)

MySQL [auto_gc_test]> select 1;
ERROR 1105 (HY000): this connection was established when this server performed an online garbage collection. this connection can no longer be used. please reconnect.
```

When running with `auto_gc_behavior: enable: true`, the server will periodically run a garbage collection of a growing database in the background. The impact of running a garbage collection on the server will also be different. It will no longer terminate in flight connections and it will no longer leave the calling connection in an invalid state.

```sh
% cat config.yaml
behavior: { auto_gc_behavior: { enable: true } }
% dolt sql-server --config=config.yaml >/dev/null &
```

Here we see the impact of running GC is different:

```sql
> call dolt_gc();
+--------+
| status |
+--------+
|      0 |
+--------+
1 row in set (0,04 sec)

> select 1;
+---+
| 1 |
+---+
| 1 |
+---+
1 row in set (0,01 sec)
```

We can cause an automatic GC by inserting some data.

```sql
mysql> CREATE TABLE vals (
    ->        i1 int, i2 int, i3 int, i4 int, i5 int, i6 int,
    ->        KEY(i1, i2, i3, i4, i5, i6),
    ->        KEY(i1, i3, i4, i5, i6, i2),
    ->        KEY(i1, i4, i5, i6, i2, i3),
    ->        KEY(i1, i5, i6, i2, i3, i4),
    ->        KEY(i1, i6, i2, i3, i4, i5)
    -> );
Query OK, 0 rows affected, 4 warnings (0,01 sec)

mysql> DELIMITER //
mysql> CREATE PROCEDURE insertn(n INT)
    -> BEGIN
    ->   SET @i = 0;
    ->   REPEAT
    ->     SET @i = @i + 1;
    ->     INSERT INTO vals VALUES (rand()*65536, rand()*65536, rand()*65536, rand()*65536, rand()*65536, rand()*65536);
    ->     UNTIL @i > n END REPEAT;
    -> END //
Query OK, 0 rows affected (0,01 sec)

mysql> DELIMITER ;
mysql> CALL insertn(8192);
Query OK, 1 row affected (3,52 sec)

```

We will see a log line from the server like:

```
INFO[0257] sqle/auto_gc: Successfully completed auto GC of database auto_gc_test in 3.508769959s
```

and if we run a GC manually we can see that there is nothing to collect:

```sql
mysql> call dolt_gc();
ERROR 1105 (HY000): no changes since last gc
```

#### `archive_level`

**Default**: 1

**Values**: 0, 1

When automatic garbage collection is enabled, you can optionally specify the amount of compression performed on the storage files.

The default level `1` will result in ~30% less space used, but may force older clients to perform more computational work if they are not upgraded. Setting this value to `0` should only be done if there are a considerable number of contributors to the database who can not upgrade.

**Example**:
```sh
% cat config.yaml
behavior: { auto_gc_behavior: { enable: true, archive_level: 1 } }
% dolt sql-server --config config.yaml
```

### `branch_activity_tracking`

**Default**: false

**Values**: true, false, null

This flag is used to enable the `dolt_branch_activity` [system table](https://docs.dolthub.com/sql-reference/version-control/dolt-system-tables#dolt_branch_activity). This feature can impact performance on high-throughput servers, so it is disabled by default.

**Example**:
```sh
% cat config.yaml
behavior: { branch_activity_tracking: true } }
% dolt sql-server --config config.yaml
```

## `listener`

The listener section of `config.yaml` is configuration for the SQL server transport layer.

### `host`

The host defines the address of the server that Dolt is running on.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> The host address that the server will run on. This may be localhost or an IPv4 or IPv6 address

**Default**: localhost 

**Values**: localhost or an IPv4 or IPv6 address

**Example**:

This is a bit of a hard one to show off as valid values for this field on my laptop are `localhost` or `127.0.0.1`. I change the value to `127.0.0.1`.

```sh
$ emacs config.yaml                   
$ grep host: config.yaml 
  host: 127.0.0.1
  host: null
$ dolt sql-server --config=config.yaml
Starting server with Config HP="127.0.0.1:3310"|T="28800000"|R="false"|L="debug"
```

You notice the starting server message now says `127.0.0.1` instead of `localhost`.

### `port`

The port on the server used to accept connections. The default is 3306. Be careful because that is also the MySQL and MariaDB default port so you either need to stop your MySQL server to run Dolt, or change the Dolt port to something else. 

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> The port that the server should listen on

**Default**: 3306

**Values**: Any integer between 1024 to 49151.

**Example**:

Astute readers may have noticed I've been running this example on port 3310 the whole time. I'm using port 3306 for [my long-running Wikipedia import](https://www.dolthub.com/blog/2024-12-09-wikipedia-update/). I have this port configured in my `config.yaml`. The second and third port settings are for a Remote API and a metrics endpoint which are not covered in this article.

```sh
$ grep port config.yaml  
  port: 3310
  require_secure_transport: null
  port: -1
  port: null
$ dolt sql-server --config=config.yaml
Starting server with Config HP="localhost:3310"|T="28800000"|R="false"|L="debug"|S="/tmp/mysql.sock"
```

### `max_connections`

The maximum number of simultaneous connections the server will accept. Connections over the limit queue until 
an existing connection is terminated. Setting this to `0` will allow for unlimited connections.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> The number of simultaneous connections that the server will accept

**Default**: 1000

**Values**: Any integer between 0 and 100,000.

**Example**:

I configure a server with a single maximum connection.

```sh
$ grep max_connections config.yaml    
  max_connections: 1
$ dolt sql-server --config=config.yaml
Starting server with Config HP="127.0.0.1:3310"|T="28800000"|R="false"|L="debug"
```

I connect with a client one with no issue.

```sh
$ mysql -h 127.0.0.1 -P 3310 -u root
WARNING: option --ssl-verify-server-cert is disabled, because of an insecure passwordless login.
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 8.0.33 Dolt

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]>
```

If I connect with another client, it will hang for 1 minute before giving up (see [`max_connections_timeout_millis`](#max_connections_timeout_millis))

```sh
$ mysql -h 127.0.0.1 -P 3310 -u root
WARNING: option --ssl-verify-server-cert is disabled, because of an insecure passwordless login.
```

If I exit client one:

```sh
MySQL [(none)]> exit
Bye
```

Client two connects.

```sh
$ mysql -h 127.0.0.1 -P 3310 -u root
WARNING: option --ssl-verify-server-cert is disabled, because of an insecure passwordless login.
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 8.0.33 Dolt

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]>
```

### `back_log`

This setting controls the number of client connections that can be blocked waiting. If the queue is full, new connection attempts will be refused until a slot becomes available. If
set to `0`, new connections will be immediately rejected if `max_connections` has been reached. `back_log` is only meaningful if `max_connections` is set to a non-zero value.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> The number of simultaneous connections that the server will allow to block waiting for a connection before new connections result in immediate rejection.

**Default**: 50

**Values**: Any integer between 0 and the max 32-bit integer (2,147,483,647).

**Example**:

I want to ensure that we take no more than 42 conncurrent active connections and allow 5 connections to wait (block) for one of those to close. Of those blocked connections,
they will wait for a maximum of 7 seconds before being closed by the server:

```sh
$ cat config.yaml
listener:
  max_connections: 42
  back_log: 5
  max_connections_timeout_millis: 7000
$ dolt sql-server --config=config.yaml
Starting server with Config HP="127.0.0.1:3310"|T="28800000"|R="false"|L="debug"
```

42 clients will immediately connect and be able to perform queries. The next 5 connections will block
(assuming no connections drop). Additional connections will be immediately closed. Any blocked connection which
waits for 7 seconds will be closed. To test, see the [`max_connections`](#max_connections) examples.

### `max_connections_timeout_millis`

This setting controls the maximum amount of time, in milliseconds, that a client connection attempt will block waiting for a connection. This configuration
is only meaningful if `back_log` is a non-zero value.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> The maximum amount of time that a connection will block waiting for a connection before being rejected.

**Default**: 60000

**Values**: Any integer between 1 and the max 64-bit integer (9,223,372,036,854,775,807).

**Examples**:

See [`back_log`](#back_log)

### `read_timeout_millis`

This setting controls when the server will time out a connection where no packets are sent. The value is defined in milliseconds. If the server does not read a packet from the connected client for the listed number of milliseconds a timeout error is returned and the connection is killed. The option is equivalent to `net_read_timeout` in MySQL. Most MySQL clients send keep alive packets to avoid this timeout. Use this to control bad client connections.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> The number of milliseconds that the server will wait for a read operation

**Default**: 28800000

**Values**: Any integer between 1 and the max 64-bit integer (9,223,372,036,854,775,807).

**Example**:

I set the read timeout to 1 millisecond and start the server. 

```sh
$ emacs config.yaml 
$ grep read_timeout config.yaml 
  read_timeout_millis: 1
$ dolt sql-server --config=config.yaml
Starting server with Config HP="127.0.0.1:3310"|T="1"|R="false"|L="debug"
```

Now, I'll issue a `select sleep(5)` in a client which occupies the client so it does not send packets.

```sh
$ mysql -h 127.0.0.1 -P 3310 -u root
WARNING: option --ssl-verify-server-cert is disabled, because of an insecure passwordless login.
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 8.0.33

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]> select sleep(5);
ERROR 2006 (HY000): Server has gone away
No connection. Trying to reconnect...
Connection id:    1
Current database: *** NONE ***

ERROR 1105 (HY000): row read wait bigger than connection timeout
```

The query fails and the connection is killed.

### `write_timeout_millis`

This setting controls when the server will time out a connection where it cannot send packets. The value is defined in milliseconds. If the server does not write a packet to the connected client for the listed number of milliseconds a timeout error is returned and the connection is killed. The option is equivalent to `net_write_timeout` in MySQL. Use this to control bad client connections.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> The number of milliseconds that the server will wait for a write operation

**Default**: 28800000

**Values**: Any integer between 1 and the max 64-bit integer (9,223,372,036,854,775,807).

**Example**:

We were a bit confused how to trigger this timeout and could only do it within Dolt code. Practically, we think this type of timeout is triggered very rarely in the wild.

### `ca_cert`

`ca_cert` allows you to specify a CA (Certificate Authority) certificate that will be used to validate client certificates. You can configure user accounts to require a valid client certificate when creating the user account by specifying the `REQUIRE X509` clause, for example: `CREATE USER user1@'%' REQUIRE X509`.   

**Default**: null

**Values**: A path on your filesystem to a `.pem` file.

### `tls_key`

`tls_key`, `tls_cert`, and `require_secure_transport` are used together and are covered in [this article](https://www.dolthub.com/blog/2024-12-03-ssl-mode/). `tls_key` is the path to the key file to use for secure transport.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> The path to the TLS key used for secure transport

**Default**: null

**Values**: A path on your filesystem to a `.pem` file.

### `tls_cert`

`tls_key`, `tls_cert`, and `require_secure_transport` are used together and are covered in [this article](https://www.dolthub.com/blog/2024-12-03-ssl-mode/). `tls_cert` is the path to the cert file to use for secure transport.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> The path to the TLS certificate used for secure transport

**Default**: null

**Values**: A path on your filesystem to a `.pem` file.

### `require_secure_transport`

`tls_key`, `tls_cert`, and `require_secure_transport` as used together and are covered in [this article](https://www.dolthub.com/blog/2024-12-03-ssl-mode/). Setting `require_secure_transport` enables TLS using the listed `tls_key` and `tls_cert` files.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> Boolean flag to turn on TLS/SSL transport

**Default**: null

**Values**: null or true

**Example**:

Dolt source code comes with a signed key and cert `.pem` file. Set the following variables in your config.yaml. I have my Dolt source code stored at `~/dolthub/git/dolt/`.

```yaml
  tls_key: "/Users/timsehn/dolthub/git/dolt/go/libraries/doltcore/servercfg/tes\
tdata/chain_key.pem"
  tls_cert: "/Users/timsehn/dolthub/git/dolt/go/libraries/doltcore/servercfg/te\
stdata/chain_cert.pem"
  require_secure_transport: true
```

Now I connect and run status and I can see I am on a SSL connection.

```sh
$ mysql -h 127.0.0.1 -P 3310 -u root
WARNING: option --ssl-verify-server-cert is disabled, because of an insecure passwordless login.
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 8.0.33 Dolt

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]> source
ERROR: Usage: \. <filename> | source <filename>
MySQL [(none)]> status
--------------
mysql from 11.6.2-MariaDB, client 15.2 for osx10.20 (arm64) using  EditLine wrapper

Connection id:		1
Current database:	
Current user:		root@%
SSL:			Cipher in use is TLS_AES_128_GCM_SHA256, cert is UNKNOWN
Current pager:		stdout
Using outfile:		''
Using delimiter:	;
Server:			MySQL
Server version:		8.0.33 Dolt
Protocol version:	10
Connection:		127.0.0.1 via TCP/IP
Server characterset:	utf8mb4
Db     characterset:	utf8mb4
Client characterset:	utf8mb4
Conn.  characterset:	utf8mb4
TCP port:		3310
--------------
```

### `require_client_cert`

Setting this field requires all client connections to present a client certificate. If the server also defines `ca_cert`, then the client certificates will also be verified against the server's CA cert. Using this option requires also setting `tls_key` and `tls_cert` since use of certificates require a TLS connection.  

**Default**: null

**Values**: null, false, or true

**Example**:

The following snippet from a `config.yaml` file shows how to set `require_client_cert`, along with `tls_key`, and `tls_cert`. 

```yaml
listener:
  require_client_cert: true
  tls_key: /path/to/my/certs/server_key.pem
  tls_cert: /path/to/my/certs/server_cert.pem
```

When running with this configuration, all clients **must** present a certificate in order to connect to the sever. If `ca_cert` is also configured, then the client's certificate will be verified against the server's CA cert.

### `allow_cleartext_passwords`

This is a bit of an advanced option. `allow_cleartext_passwords` only affects the `mysql_clear_password` auth plugin, which is only used for JSON Web Token (JWT) authentication. Other auth plugins protect the password (e.g. `mysql_native_password` does a hash scramble, `caching_sha2_password` requires an encrypted connection), but `mysql_clear_password` sends the plaintext password over the wire. If you are using JWT authentication you must enable `allow_cleartext_passwords` or `require_secure_transport`.

**Default**: false

**Values**: true, false, or null

## max_logged_query_len

`max_logged_query_len` sets the maximum amount of characters Dolt will log in the server logs. We had an issue where very long queries, like seen in dumps would overflow buffers in some log monitoring utilities. This setting allows the user to truncate log lines at a maximum length to avoid such failure modes. This only effects queries so you must also set the log level to debug or above to see an effect.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> If greater than zero, truncates query strings in logging to the number of characters given.

**Default**: 0

**Values**: non-negative integer

**Example**:

I set the `log_level` to `debug` and the `max_logged_query_len` to 10 and start the Dolt SQL server.

```sh
$ grep log_level config.yaml 
log_level: debug
$ grep max_log config.yaml  
max_logged_query_len: 10
$ dolt sql-server --config=config.yaml
Starting server with Config HP="127.0.0.1:3310"|T="28800000"|R="false"|L="debug"
```

Now, all queries are truncated to 10 characters in the logs:

```sh
DEBU[0020] Starting query                                connectTime="2024-12-06 14:21:58.139943 -0800 PST m=+3.826578251" connectionDb=config_blog connectionID=1 query="select * f..."
```

## `data_dir`

The `data_dir`, `config_dir`, `privilege_file` and `branch_control_file` work in conjunction to tell Dolt where to create and load various artifacts needed for the running of the database. `data dir` defaults to the current working directory. `data_dir` configures the root directory and is used by `config_dir`, `privilege_file` and `branch_control_file`.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> A directory where the server will load dolt databases to serve, and create new ones. Defaults to the current directory.

**Default**: `.`

**Values**: Any filesystem path

## `config_dir`

`config_dir` is a directory where Dolt will load and store configuration used by the database. Configuration includes the `privilege_file` and `branch_control_file` used to store users/grants and branch permissions configuration respectively. This defaults to the `$data_dir/doltcfg` directory. 

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> A directory where the server will load and store non-database configuration data, such as permission information. Defaults `$data_dir/.doltcfg`

**Default**: `.doltcfg`

**Values**: Any filesystem path

## `privilege_file`

The `privilege_file` is a file used to store and load users/grants configuration.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> Path to a file to load and store users and grants. Defaults to $doltcfg-dir/privileges.db. Will be created as needed.

**Default**: `.doltcfg/privileges.db`

**Values**: Any filesystem path

## `branch_control_file`

The `branch_control_file` is a file used to store and load users/grants configuration.

From the [`dolt sql-server` help documentation](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server):

> Path to a file to load and store branch control permissions. Defaults to $doltcfg-dir/branch_control.db. Will be created as needed.

**Default**: `.doltcfg/branch_control.db`

**Values**: Any filesystem path

**Example**:

`data_dir`, `config_dir`, `privilege_file` and `branch_control_file` can all be set to independent filesystem locations but we recommend only using `data_dir` to change the location of your database storage. It is common to have data stored on a different mounted drive than where the server binary or logs are stored.

I set the `data_dir` to `/tmp`.

```sh
$ grep data_dir config.yaml 
data_dir: /tmp
$ dolt sql-server --config=config.yaml
Starting server with Config HP="127.0.0.1:3310"|T="28800000"|R="false"|L="debug"
```

This is a new directory so there are no databases in it.

```sh
$ mysql -h 127.0.0.1 -P 3310 -u root
WARNING: option --ssl-verify-server-cert is disabled, because of an insecure passwordless login.
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 8.0.33 Dolt

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
+--------------------+
2 rows in set (0.000 sec)
```

After we create a database named `tmp`:

```sql
MySQL [(none)]> create database tmp;
Query OK, 1 row affected (0.135 sec)
```

We can see the `.dolt` directory in `/tmp/tmp`:

```sh
$ ls -al /tmp/tmp 
total 0
drwxr-xr-x  3 timsehn  wheel   96 Dec  6 14:26 .
drwxrwxrwt  7 root     wheel  224 Dec  6 14:26 ..
drwxr-xr-x  7 timsehn  wheel  224 Dec  6 14:26 .dolt
```

## metrics

This set of configuration values configures a [Dolt metrics HTTP endpoint](https://docs.dolthub.com/sql-reference/server/metrics). Dolt emits metrics in [Prometheus](https://prometheus.io/) format.

### host

The host defines the host Dolt will use to serve the metrics endpoint.

**Default**: `null`

**Values**: `localhost` or an IPv4 or IPv6 address

### port 

The port defines the port Dolt will use to expose the metrics endpoint.

**Default**: `-1`

**Values**: Any integer between 1024 to 49151

**Example:**

`host` and `port` must be defined together to enable a metrics endpoint. In  this example, I define `host` as `localhost` and port as `11111` in `config.yaml` and start a server.

```sh
$ grep -3 metrics config.yaml 

cfg_dir: .doltcfg

metrics:
  labels: {}
  host: localhost
  port: 11111
$ dolt sql-server --config config.yaml
Starting server with Config HP="127.0.0.1:3310"|T="28800000"|R="false"|L="debug"
INFO[0000] Server ready. Accepting connections.    
```

Then, I can access the metrics by making an HTTP request to http://localhost:11111/metrics

```sh
$ curl http://localhost:11111/metrics | HEAD -n 10
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  6041    0  6041    0     0  4776k      0 --:--:-- --:--:-- --:--:-- 5899k
# HELP dss_concurrent_connections Number of clients concurrently connected to this instance of dolt sql server
# TYPE dss_concurrent_connections gauge
dss_concurrent_connections 0
# HELP dss_concurrent_queries Number of queries concurrently being run on this instance of dolt sql server
# TYPE dss_concurrent_queries gauge
dss_concurrent_queries 0
# HELP dss_connects Count of server connects
# TYPE dss_connects counter
dss_connects 0
# HELP dss_disconnects Count of server disconnects
```

For more information on how to scrape the metrics from this endpoint consult [our metrics documentation](https://docs.dolthub.com/sql-reference/server/metrics).

### labels

Labels can be added to any Dolt metrics emitted using this optional configuration setting. This is often used to differentiate metrics coming from multiple sources to a single Prometheus collector. The label map will be applied to every metric Dolt emits.

**Default**: `{}`

**Values**: A map of the form `{"label": "value"}`

**Example:**

I add the `{"process": "dolt-sql-server"}` label value in `config.yaml` and start a Dolt SQL Server.

```sh
$ grep -3 metrics config.yaml

cfg_dir: .doltcfg

metrics:
  host: localhost
  port: 11111
  labels: {"process": "dolt-sql-server"}
$ dolt sql-server --config config.yaml
Starting server with Config HP="127.0.0.1:3310"|T="28800000"|R="false"|L="debug"
INFO[0000] Server ready. Accepting connections.        
```

Now all the metrics emitted are labeled with `process="dolt-sql-server"`.

```sh
$ curl http://localhost:11111/metrics | HEAD -n 10
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  6425    0  6425    0     0  3115k      0 --:--:-- --:--:-- --:--:-- 3137k
# HELP dss_concurrent_connections Number of clients concurrently connected to this instance of dolt sql server
# TYPE dss_concurrent_connections gauge
dss_concurrent_connections{process="dolt-sql-server"} 0
# HELP dss_concurrent_queries Number of queries concurrently being run on this instance of dolt sql server
# TYPE dss_concurrent_queries gauge
dss_concurrent_queries{process="dolt-sql-server"} 0
# HELP dss_connects Count of server connects
# TYPE dss_connects counter
dss_connects{process="dolt-sql-server"} 0
# HELP dss_disconnects Count of server disconnects
```

## remotesapi

A running Dolt SQL server can serve as a [Dolt remote](https://docs.dolthub.com/concepts/dolt/git/remotes) by enabling these configuration values. With a remote endpoint enabled, you can `clone`, `push`, `pull`, and `fetch` from a running Dolt SQL Server by connecting with a user with the appropriate permissions. Additional documentation on how to push can be found in [this blog article](https://www.dolthub.com/blog/2023-12-29-sql-server-push-support/) where we announced `push` support.
  
### port 

**Default**: `null`

**Values**: Any integer between 1024 to 49151

**Example:**

```sh
$ grep -3 remotesapi config.yaml
  port: 11111
  labels: {"process": "dolt-sql-server"}

remotesapi:
  port: 22222
  read_only: null

$ dolt sql-server --config config.yaml
Starting server with Config HP="127.0.0.1:3310"|T="28800000"|R="false"|L="debug"
INFO[0000] Server ready. Accepting connections. 
INFO[0000] Starting http server on :22222 
```

In another shell, I can now clone the database by specifying the `DOLT_REMOTE_PASSWORD` environment variable and a `--user`. Note, cloning from [DoltHub](https://www.dolthub.com) or [DoltLab](https://www.doltlab.com) uses a different authentication method and thus, does not require a user or password.

```sh
$ DOLT_REMOTE_PASSWORD= dolt clone --user root http://localhost:22222/config_blog
cloning http://localhost:22222/config_blog
$ cd config_blog 
$ dolt log
commit im7qq2ja3nfqnc75khtuli8krla3s3fm (HEAD -> main, remotes/origin/main) 
Author: root <root@%>
Date:  Thu Dec 05 12:19:04 -0800 2024

        Commit created using an event

commit vmikac4f7s4395v0v43dtfcbhrmtmo41 
Author: configblog <tim@dolthub.com>
Date:  Wed Dec 04 16:51:32 -0800 2024

        Transaction commit

commit rgifn94i58hqov4mdv0efsjju0qpg964 
Author: root <root@%>
Date:  Wed Dec 04 16:48:50 -0800 2024

        Manual commit

commit do1tvb8g442jvggv4e3nfqp3fmqt0u5a 
Author: timsehn <tim@dolthub.com>
Date:  Tue Dec 03 11:16:49 -0800 2024

        Inіtialіze datа rеposіtory

```

I now have a cloned copy of the database in the location I cloned to.

### read_only

If a Dolt remote endpoint is enabled by setting a valid port, the endpoint can be made read only by setting `read_only` to true. The endpoint will accept `clone`, `pull`, and `fetch` requests but not `push` requests. 

**Default**: `null`

**Values**: `null`, true, or false

**Example:**

I now set the `read_only` configuration value to true and start the Dolt SQL server.

```sh
$ grep -3 remotesapi config.yaml      
  port: 11111
  labels: {"process": "dolt-sql-server"}

remotesapi:
  port: 22222
  read_only: true

$ dolt sql-server --config config.yaml
Starting server with Config HP="127.0.0.1:3310"|T="28800000"|R="false"|L="debug"
INFO[0000] Starting http server on :22222 
```

If I make a change and attempt to push it will fail.

```sh
$ dolt sql -q "insert into t values (6, 'Can I push this');
dquote> "
Query OK, 1 row affected (0.00 sec)
$ dolt sql -q "select * from t;"
+----+-----------------+
| id | words           |
+----+-----------------+
| 0  | first  modified |
| 1  | second          |
| 2  | third           |
| 3  | fourth          |
| 4  | dolt commit     |
| 6  | Can I push this |
+----+-----------------+

$ dolt commit -am "Added row to push"                      
commit 0vkmfbrt3d1uljrh0ie0mdikoc9tcsss (HEAD -> main) 
Author: timsehn <tim@dolthub.com>
Date:  Wed Dec 11 14:07:35 -0800 2024

        Added row to push

$ DOLT_REMOTE_PASSWORD= dolt push --user root origin main
- Uploading...unknown push error; rpc error: code = PermissionDenied desc = this server only provides read-only access
```

## mcp_server

Starts a [Dolt MCP](https://github.com/dolthub/dolt-mcp) HTTP server that will be connected to the started Dolt SQL server when enabling these configuration values. When the MCP server is enabled, your AI agents can call tools against your Dolt database. Additional information is provided in [this blog article](). Note: MCP server logs respect the log level of the `dolt sql-server` command, and will be written to the Dolt server log output.
  
### port 

**Default**: `7007`

**Required**

**Values**: Any integer between 1024 to 49151

### user 

**Default**: `root`

**Required**

**Values**: The SQL user the MCP server will use. 

### password 

**Optional**

**Values**: The password of the SQL user used by the MCP server. 

### database 

**Optional**

**Values**: The specific database the MCP server is connected to. 

**Example:**

```sh
$ grep -5 mcp_server config.yaml

# remotesapi:
  # port: 8000
  # read_only: false

mcp_server:
  port: 7007
  user: root 
  password: "" 
  database: ""

$ dolt sql-server --config config.yaml
Starting server with Config HP="0.0.0.0:3306"|T="28800000"|R="false"|L="debug"
DEBU[0000] Loading events
DEBU[0000] privileges.db already exists, not creating root superuser
INFO[0000] Server ready. Accepting connections.
WARN[0000] secure_file_priv is set to "", which is insecure.
WARN[0000] Any user with GRANT FILE privileges will be able to read any file which the sql-server process can read.
WARN[0000] Please consider restarting the server with secure_file_priv set to a safe (or non-existent) directory.
```

In another shell, I can register the MCP server with an agent an it can start using it immediately.

```sh
$ claude mcp add -t http dolt-mcp http://localhost:7007/mcp
Added HTTP MCP server dolt-mcp with URL: http://localhost:7007/mcp to local config
```

```sh
$ claude
╭───────────────────────────────────────────────────╮
│ ✻ Welcome to Claude Code!                         │
│                                                   │
│   /help for help, /status for your current setup  │
│                                                   │
╰───────────────────────────────────────────────────╯
╭──────────────────────────────────────────────────────────────╮
│ Manage MCP servers                                           │
│                                                              │
│ ❯ 1. dolt-mcp  ✔ connected · Enter to view details           │
│                                                              │
╰──────────────────────────────────────────────────────────────╯
   Esc to exit
```

I now have a Dolt SQL server on port `3306` and a Dolt MCP server on port `7007`.

## system_variables

Dolt features a number of [custom system variables](https://docs.dolthub.com/sql-reference/version-control/dolt-sysvars) and [supports many of MySQL's system variables](https://docs.dolthub.com/sql-reference/sql-support/system-variables). These variables can be set for a running server using a map of system variable to value in this section of the configuration.

**Default**: `{}`

**Values**: A map of system variable to value.

**Example:**

I will enable [the `dolt_show_system_tables` system variable](https://docs.dolthub.com/sql-reference/version-control/dolt-sysvars#dolt_show_system_tables) which changes the behavior of `show tables` to include Dolt system tables. 

```
$ grep system_variables config.yaml 
system_variables: {"dolt_show_system_tables": 1}
```

Connecting a client to the server now has that variable set and exhibits the proper behavior:

```sql
MySQL [config_blog]> select @@dolt_show_system_tables;
+---------------------------+
| @@dolt_show_system_tables |
+---------------------------+
|                         1 |
+---------------------------+
1 row in set (0.000 sec)

MySQL [config_blog]> show tables;
+------------------------------+
| Tables_in_config_blog        |
+------------------------------+
| dolt_branches                |
| dolt_commit_ancestors        |
| dolt_commit_diff_t           |
| dolt_commits                 |
| dolt_conflicts               |
| dolt_conflicts_t             |
| dolt_constraint_violations   |
| dolt_constraint_violations_t |
| dolt_diff_t                  |
| dolt_history_t               |
| dolt_log                     |
| dolt_remote_branches         |
| dolt_remotes                 |
| dolt_status                  |
| dolt_workspace_t             |
| t                            |
+------------------------------+
16 rows in set (0.000 sec)
```

## user_session_vars

If instead of setting system variables globally, you would rather set them for individual users, Dolt supports a `user_session_vars` list of maps in `config.yaml`.

**Default**: `[]`

**Values**: A list of user to variable map

**Example:**

Let's again set the `dolt_show_system_tables` variable but this time only for user `root`. I modify my `config.yaml` as such.

```sh
$ grep -3 user_session config.yaml 

system_variables: {}

user_session_vars:
- name: "root"
  vars:
    "dolt_show_system_tables": 1
```

And then in a connected client with user `root`, the server now has that variable set and exhibits the proper behavior:

```sql
MySQL [config_blog]> select user();
+--------+
| user() |
+--------+
| root@% |
+--------+
1 row in set (0.000 sec)

MySQL [config_blog]> select @@dolt_show_system_tables;
+---------------------------+
| @@dolt_show_system_tables |
+---------------------------+
|                         1 |
+---------------------------+
1 row in set (0.000 sec)

MySQL [config_blog]> show tables;
+------------------------------+
| Tables_in_config_blog        |
+------------------------------+
| dolt_branches                |
| dolt_commit_ancestors        |
| dolt_commit_diff_t           |
| dolt_commits                 |
| dolt_conflicts               |
| dolt_conflicts_t             |
| dolt_constraint_violations   |
| dolt_constraint_violations_t |
| dolt_diff_t                  |
| dolt_history_t               |
| dolt_log                     |
| dolt_remote_branches         |
| dolt_remotes                 |
| dolt_status                  |
| dolt_workspace_t             |
| t                            |
+------------------------------+
16 rows in set (0.000 sec)
```

## jwks 

The `jwks` section of `config.yaml` is used to configure JSON web token (JWT) authentication. This configuration section is used to authenticate users of the Hosted Workbench to running Hosted Dolt servers. If your interested in this authentication method for your own Dolt use case, please come to [our Discord](ttps://discord.gg/gqr7K4VNKe) and let us know.

## cluster

This section of `config.yaml` is used to configure "Direct to Standby" or cluster replication. Refer to [the documentation for replication](https://docs.dolthub.com/sql-reference/server/replication#direct-to-standby-replication) for this section of `config.yaml`. This configuration requires multiple Dolt instances configured so it is out of scope for this article.

# System Variables

Dolt defines system variables that you can set in your session via the
`SET` syntax. Many of these can be persisted, so they remain set after
a server restart.

```sql
set @@dolt_transaction_commit = 1;
```

A full list of available system variables can be found in the [docs on
system variables](/sql-reference/version-control/dolt-sysvars).
