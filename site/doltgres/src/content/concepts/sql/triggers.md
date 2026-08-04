---
title: Triggers
---


## What is a Trigger?

Triggers are SQL statements you can set to run every time a row is inserted, updated, or deleted
from a particular table. Triggers receive the value of the row being inserted, updated, or deleted
like a parameter, and can change it in some cases.

Database users create triggers. Triggers are schema. Triggers are stored along with other schema elements in the database.

## How to use Triggers

Triggers are a general tool, but they are most commonly used to enforce complex constraints that
can't be expressed by foreign keys, nullness, types, or the `check` syntax.

Doltgres supports row-level triggers. As in Postgres, you first define a trigger function, usually
in PL/pgSQL, and then attach it to a table with
`CREATE TRIGGER ... BEFORE | AFTER INSERT | UPDATE | DELETE ... FOR EACH ROW EXECUTE FUNCTION ...`.

Some Postgres trigger features are not yet supported: constraint triggers, `DEFERRABLE`,
`REFERENCING`, statement-level triggers (`FOR EACH STATEMENT`), `INSTEAD OF` triggers,
`UPDATE OF <columns>`, and `TRUNCATE` events.

## Interaction with Doltgres Version Control

Triggers are versioned in storage like other schema elements. You add and commit trigger changes
just like any other schema change. Note that unlike [views](/concepts/sql/views), triggers do not appear in
the `dolt_schemas` table.
