---
title: Stored Procedures
---

## What is a Stored Procedure?

A stored procedure is SQL code that can be accessed using the SQL `CALL` syntax. Much like a
function in other programming languages, you can pass values into a stored procedures. Stored
procedures cannot return results, unlike functions.

Database users create procedures. Procedures are schema and are stored along with other schema
elements in the database.

## Doltgres support for Stored Procedures

Doltgres comes with [many built-in stored procedures for version control
features](/reference/version-control/dolt-sql-functions).

User created stored procedures are not yet supported but will be added in a future release.
