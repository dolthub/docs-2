---
title: Version Control Your Application
---

# Problem

* Do your customers want branches and merges in your application? 
* Do your customers want to review changes in your application before they go live? 
* Do you want to add a pull request workflow to your application?
* Do you want to expose audit log functionality in your application?
* Do you want to expose rollback functionality in your application?

# Dolt solves this by…

If you have an application that would benefit from [branches](/concepts/dolt/git/branch), [merges](/concepts/dolt/git/merge), [diffs](/concepts/dolt/git/diff), [logs](/concepts/dolt/git/log), and human review of changes, you can use Dolt to power that application. Dolt gives you branch, diff, and merge at the database layer. 

Programmatically access git functionality via [procedures](/sql-reference/version-control/dolt-sql-procedures), [system tables](/sql-reference/version-control/dolt-system-tables), and [functions](/sql-reference/version-control/dolt-sql-functions). Programmatic control of Git operations combined with the ability to use [standard SQL](/concepts/dolt/sql/) creates the ideal foundation to add version control to your application.

Dolt ships with standard [RDBMS](/concepts/dolt/rdbms/) tools like [replication](/concepts/dolt/rdbms/replication) and [backups](/concepts/dolt/rdbms/backups). Run Dolt with a hot standby and failover just like MySQL or Postgres.

[Hosted Dolt](https://hosted.doltdb.com/) is a hosted version of Dolt that works like AWS RDS. Let us worry about operating Dolt in the cloud. Write your application against a cloud endpoint.

In the past applications that needed these features required [slowly changing dimension](https://www.dolthub.com/blog/2021-09-17-database-version-control/) or [soft deletes](https://www.dolthub.com/blog/2022-11-03-soft-deletes/). These approaches are cumbersome and do not support merge. Dolt gives application the full development power of Git.

# Dolt replaces

## Soft Deletes

A common technique to version your database is to use [soft deletes](https://www.dolthub.com/blog/2022-11-03-soft-deletes/). When your application would make an update or a delete, you application instead makes an insert and marks the old row invalid. Dolt obviates the need for this technique. You can keep your existing database schema and Dolt ensures every write is non-destructive. Queries against soft deleted rows become Dolt history queries against [system tables](/sql-reference/version-control/dolt-system-tables). 

## Slowly Changing Dimension

A more advanced technique for versioning databases is [slowly changing dimension](https://www.dolthub.com/blog/2023-06-22-slowly-changing-dimension/). Slowly Changing Dimension is similar to soft deletes. Additional database columns are added to tables to manage versioning. Dolt is slowly changing dimension on every table by default. Queries involving the slowly changing dimension become Dolt history queries against [system tables](/sql-reference/version-control/dolt-system-tables). Moreover, complicated [merge](/concepts/dolt/git/merge) processes can happen at the database layer. Merges must handled by custom code at the application layer with slowly changing dimension.

# Companies Doing This

* [Threekit](https://www.threekit.com/) 
* [Network To Code](https://www.networktocode.com/)
* [FJA](https://www.fja.com/)
* [Idearoom](https://www.idearoom.com/)

# Case Studies

* [Nautobot by Network To Code](https://www.dolthub.com/blog/2021-11-19-dolt-nautobot/)
* [Turbine](https://www.dolthub.com/blog/2022-08-17-dolt-turbine/)

# Other Related Articles

* [Django and Dolt](https://www.dolthub.com/blog/2021-06-09-running-django-on-dolt/)
* [Django and Dolt Part II](https://www.dolthub.com/blog/2021-08-27-django-dolt-2/)
* [Using SQLAlchemy for Dolt Time Travel](https://www.dolthub.com/blog/2023-04-12-dolt-sqlalchemy/)
* [How we built the Hosted Dolt Workbench](https://www.dolthub.com/blog/2022-08-24-hosted-sql-workbench/#how-it-was-built)
* [So you want Database Version Control?](https://www.dolthub.com/blog/2021-09-17-database-version-control/)
* [So you want Soft Deletes](https://www.dolthub.com/blog/2022-11-03-soft-deletes/)
* [Getting Started: Dolt and SQLAlchemy](https://www.dolthub.com/blog/2023-07-12-sql-alchemy-getting-started/)
* [Using SQLAlchemy for Dolt Time Travel](https://www.dolthub.com/blog/2023-04-12-dolt-sqlalchemy/)
