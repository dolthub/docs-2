---
title: Running the DoltgreSQL Server
---

Start the DoltgreSQL server by running the `doltgres` command:

```bash
% doltgres
```

## Configuration options

`doltgres` is configured primarily via a `config.yaml` file, provided with the `--config` flag. The
binary itself accepts only a small number of command line flags, most notably `--config` and
`--data-dir`, plus a few utility flags. Run `doltgres --help` for the list of command line flags,
and `doltgres -config-help` for the full list of `config.yaml` fields. See the
[configuration docs](/reference/server/configuration) for more details.

## Data location

The location of any databases created depends on the setting of the `DOLTGRES_DATA_DIR` environment
variable. For example:

```bash
% export DOLTGRES_DATA_DIR=~/dbs/
% doltgres &
% psql -h 127.0.0.1 -U postgres -c "CREATE DATABASE newDb"
```

The `newDb` database above will be stored at the location `~/dbs/newDb`. The first time you run the
`doltgres` command, a database named after the connecting user (`postgres` by default) will be
created for you in the data directory if it doesn't exist. You can override the name of this
database with the `DOLTGRES_DB` environment variable.

If you don't set this environment variable, it defaults to `~/doltgres/databases`.

You can override this location on the command line with the `--data-dir` flag:

```bash
% doltgres --data-dir /var/doltgres/dbs
```

Or you can provide it in a `config.yaml` file:

```yaml
log_level: debug

behavior:
  read_only: false

listener:
  host: localhost
  port: 5432
  read_timeout_millis: 28800000
  write_timeout_millis: 28800000

data_dir: /var/doltgres/dbs

cfg_dir: .doltcfg
```

Provide the path to the `config.yaml` on the command line with the `--config` option.

```bash
% doltgres --config config.yaml
```
