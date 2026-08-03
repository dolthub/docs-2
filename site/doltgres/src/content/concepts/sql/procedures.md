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

User created stored procedures are supported. You create a procedure with `CREATE PROCEDURE` and
invoke it with `CALL`. Procedures can be written in PL/pgSQL, SQL, or C.

Doltgres's [version control operations](/reference/version-control/dolt-sql-functions)
are implemented as functions, not stored procedures. You invoke them with `SELECT`, as in
`SELECT dolt_commit('-m', 'my commit');`. Using `CALL` on them returns an error.
