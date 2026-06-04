---
title: Access Management
description: Configuring users, roles, and privileges on the server.
---


Access management in Dolt is handled similarly to how it is handled in MySQL.
When Dolt is running, it relies upon the grant tables (`mysql.user`, `mysql.db`, etc.) to control user access.
Access is determined by the privileges that a user has.
For more information on the basics of how users and privileges work and how to use them, [please read our blog post from when we announced their inclusion into Dolt](https://www.dolthub.com/blog/2022-02-16-introducing-users-and-privileges/).
This document will assume some familiarity with users and privileges.

## Configuring Privileges 

Users and grants are on by default. Users and grants are stored in the `.doltcfg/privileges.db` file by default. You can reference a non-default privileges file if you want to share privileges between databases.

### CLI Argument

By default, privileges will be stored in `.doltcfg/privileges.db` file, but you may pass in the `--privilege-file="PATH"` argument to specify your own file.
`"PATH"` represents the path to the privileges file, generally named `privileges.db`.

### YAML Configuration Option

By default, privileges will be stored in `.doltcfg/privileges.db` file, you may add the `privilege_file: PATH` line to your [YAML config](/sql-reference/server/configuration).
`"PATH"` represents the path to the privileges file, generally named `privileges.db`.

### `root@localhost` Superuser

By default, when you start a `dolt sql-server`, if the privileges database has not yet been initialized (i.e. the `.doltcfg/privileges.db` file doesn't exist yet), a `root@localhost` superuser will automatically be created and persisted in the privileges database. This superuser is scoped to `localhost` and does not have a password. You can delete or modify this 
user account, just like any other user account.


## Editing Users

Dolt comes with a built-in client - the [`dolt sql`](/cli-reference/cli#dolt-sql) command. From within a Dolt database 
directory, you can always access the database as a superuser by using `dolt sql`, even if you have lost the superuser password. 

From any SQL shell where you are logged in with superuser access, you can use the standard SQL statements to create users
and grant privileges. For example, the following statements create a new `user1` user, accessible from any host, with the
password 'pass1', and with broad permission on all databases in the server (but without the ability to `GRANT` 
privileges to other users):   
```sql
CREATE USER user1@'%' IDENTIFIED BY 'pass1';
GRANT ALL ON *.* to user1@'%';
```

## Updates and Persistence

Unlike in MySQL, Dolt immediately processes all updates to the grant tables.
Any privilege changes will immediately take effect, any deleted users with current sessions will immediately lose access, etc.
Whether these are benefits or drawbacks depend on those running the database.
For Dolt, the decision to have all updates take immediate effect allows for emergency updates to not require a server restart in some cases, which we believe offers some security and convenience advantages.
The benefit of delayed updates do not seem as likely or often, although we may still change this behavior in the future if it is proven otherwise.

Persistence to the [privilege file](#privilege-file) is immediate only when the grant tables are modified through their typical statements (`CREATE USER`, `GRANT`, `REVOKE`, etc.).
Directly modifying the grant tables using `INSERT`, `UPDATE`, etc. will cause an immediate update to all current users, however it **will not** be immediately persisted to the [privilege file](#privilege-file).
The [privilege file](#privilege-file) is **only** updated when the aforementioned statements are executed.
This may change in the future.

## Statements

For now, only some of the core statements are supported for users and privileges.
Of those core statements, some are fully supported, while others only offer partial support.

### Fully Supported

- `CREATE ROLE`
- `DROP ROLE`
- `DROP USER`
- `SHOW PRIVILEGES`

The following grant tables are fully implemented:

- `mysql.user`
  - Contains the user definition, global static privileges, login details, password limits, account maximums, and attributes
  - Although this table is fully implemented, we do not support all of the features that this table provides, even though they may be set
    - For those features that are not yet implemented, their column values may not survive a server restart
- `mysql.db`
  - Contains the database-level privileges
- `mysql.tables_priv`
  - Contains the table-level privileges
- `mysql.role_edges`
  - Contains the connections between all roles and users

### Partially Supported

- `CREATE USER`
  - For now, we only support setting the username and host name, global static privileges, locked status, and a basic `mysql_native_password` for authentication
  - All other fields, such as the `DEFAULT ROLE` and multiple auth options, are either ignored or will throw an error
  - Even though a comment and attributes may be set (and are persisted), they are ignored, and this includes partial revokes
- `GRANT`
  - The form `GRANT <privileges> ON <privilege_level> TO <users...>` does not yet support columns, an object type (tables only), or assuming a different user
  - The form `GRANT <roles...> TO <users...> [WITH ADMIN OPTION]` is fully supported
  - The form `GRANT PROXY ...` is not yet supported
- `REVOKE`
  - The form `REVOKE <privileges...> ON <privilege_level> FROM <users...>` does not yet support columns or an object type (tables only)
  - The form `REVOKE <roles...> FROM <users...>` is fully supported
  - The form `REVOKE PROXY ...` is not yet supported
  - The form `REVOKE ALL PRIVILEGES ...` is not yet supported, which differs from `REVOKE ALL ON ...` in functionality
- `SHOW GRANTS`
  - Displays global static grants and granted roles
  - Does not yet display a user's database or table-level privileges
  - The optional `[USING <roles...>]` portion is not yet supported

### Not Yet Supported

- `ALTER USER`
- `RENAME USER`
- `SET DEFAULT ROLE`
- `SET PASSWORD`
- `SET ROLE`

The following grant tables (and their associated functionality) are not yet supported:

- `mysql.global_grants`
  - Contains all global dynamic grants
- `mysql.columns_priv`
  - Contains column privileges
- `mysql.procs_priv`
  - Contains stored procedures
- `mysql.proxies_priv`
  - Contains proxy accounts
- `mysql.default_roles`
  - Stores each user's default roles
- `mysql.password_history`
  - Contains password changes

The following system variables are not yet supported:
- `mandatory_roles`
  - All roles (and users) named here are granted to all users automatically, and cannot be revoked or dropped
- `activate_all_roles_on_login`
  - Sets all roles to active upon logging into a user
  - As `SET ROLE` is also not yet implemented, any granted roles are automatically active when granted and logging in
    - This will be changed as soon as `SET ROLE` is implemented

## Future Plans

We plan to incorporate all currently missing statements and functionality that MySQL contains regarding users and privileges.
In addition, we also plan to allow for all of our versioning features to have their access privilege-checked.
This includes the Dolt SQL functions (`DOLT_COMMIT()`, `DOLT_CHECKOUT()`, etc.) as well as only allowing specific users to manage specific branches, just to name a few of the planned features.
This page will be updated as features are added!
