---
title: Access Management
---


Access management in Doltgres is handled similarly to how it is handled in Postgres.  Create users,
roles, and grants with standard SQL statements. Access is determined by the privileges that a user
has.

## First Start

By default, the first time you run the Doltgres server it will create a user named `postgres` with a
password `password`. This user is an admin with all rights to all tables.

You can change this behavior by settings the following environment variables:

* `DOLTGRES_USER`: Set the first-run user created
* `DOLTGRES_PASSWORD`: Set the first-run password created

## Configuring Privileges 

Users and grants are stored in the `auth.db` file by default. This file stores privilege information
for all databases in a server.

### YAML Configuration Option

Use the `auth_file: PATH` line to your [YAML config](configuration.md) to change where the
privileges file is stored.

## Editing Users

Use `psql` or another client to connect to your running `doltgres` server as the admin user to
create new users and grant privileges. For example, the following statements create a new `user1`
user with the password 'pass1', and with broad permission on all tables in the current database (but
without the ability to `GRANT` privileges to other users):

```sql
CREATE USER user1 PASSWORD 'pass1';
GRANT ALL ON ALL TABLES IN SCHEMA public to user1;
```

For more details on editing users and their permissions, refer to the Postgres documentation on
[CREATE ROLE](https://www.postgresql.org/docs/18/sql-createrole.html) and
[GRANT](https://www.postgresql.org/docs/18/sql-grant.html) statements.

Please note that not all permission functionality supported by Postgres is supported by Doltgres. If
you find a gap you need addressed, please [file an
issue](https://github.com/dolthub/doltgresql/issues).

## Statements

For now, only some of the core statements are supported for users and privileges.
Of those core statements, some are fully supported, while others only offer partial support.

### Fully Supported

- `CREATE ROLE`
- `ALTER ROLE`
- `ALTER USER`
- `DROP ROLE`
- `DROP USER`

### Partially Supported

- `CREATE USER`
  - Not all options are supported
- `GRANT`
  - The form `GRANT <privileges> ON <privilege_level> TO <users...>` supports tables, schemas,
    databases, sequences, and functions/procedures, as well as `WITH GRANT OPTION` and
    `GRANTED BY`. Column-level grants and grants on objects in other databases are not yet
    supported.
  - The form `GRANT <roles...> TO <users...> [WITH ADMIN OPTION]` is fully supported
- `REVOKE`
  - The form `REVOKE <privileges...> ON <privilege_level> FROM <users...>` supports tables,
    schemas, databases, sequences, and functions/procedures. Column-level revokes and revokes on
    objects in other databases are not yet supported.
  - The form `REVOKE <roles...> FROM <users...>` is fully supported

## pg_catalog Access to Users and Grants

Doltgres exposes various user and grant information in the `pg_catalog` tables. Refer to the
[Postgres documentation](https://www.postgresql.org/docs/current/catalogs.html) for more details on
the relevant tables and columns.
