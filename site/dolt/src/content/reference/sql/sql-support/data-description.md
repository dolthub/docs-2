---
title: Data Description
description: Supported DDL — CREATE, ALTER, and DROP for tables, indexes, and more.
---


## Data types

| Data type            | Supported | Notes                           |
| :------------------- |:----------| :------------------------------ |
| `BOOLEAN`            | ✅         | Alias for `TINYINT`             |
| `INTEGER`            | ✅         |                                 |
| `TINYINT`            | ✅         |                                 |
| `SMALLINT`           | ✅         |                                 |
| `MEDIUMINT`          | ✅         |                                 |
| `INT`                | ✅         |                                 |
| `BIGINT`             | ✅         |                                 |
| `DECIMAL`            | ✅         | Max \(precision + scale\) is 65 |
| `FLOAT`              | ✅         |                                 |
| `DOUBLE`             | ✅         |                                 |
| `BIT`                | ✅         |                                 |
| `DATE`               | ✅         |                                 |
| `TIME`               | ✅         |                                 |
| `DATETIME`           | ✅         |                                 |
| `TIMESTAMP`          | ✅         |                                 |
| `YEAR`               | ✅         |                                 |
| `CHAR`               | ✅         |                                 |
| `VARCHAR`            | ✅         |                                 |
| `BINARY`             | ✅         |                                 |
| `VARBINARY`          | ✅         |                                 |
| `TINYBLOB`           | ✅         |                                 |
| `BLOB`               | ✅         |                                 |
| `MEDIUMBLOB`         | ✅         |                                 |
| `LONGBLOB`           | ✅         |                                 |
| `TINYTEXT`           | ✅         |                                 |
| `TEXT`               | ✅         |                                 |
| `MEDIUMTEXT`         | ✅         |                                 |
| `LONGTEXT`           | ✅         |                                 |
| `ENUM`               | ✅         |                                 |
| `SET`                | ✅         |                                 |
| `GEOMETRY`           | ✅         |                                 |
| `POINT`              | ✅         |                                 |
| `LINESTRING`         | ✅         |                                 |
| `POLYGON`            | ✅         |                                 |
| `MULTIPOINT`         | ✅         |                                 |
| `MULTILINESTRING`    | ✅         |                                 |
| `MULTIPOLYGON`       | ✅         |                                 |
| `GEOMETRYCOLLECTION` | ✅         |                                 |
| `JSON`               | ✅         |                                 |

## Constraints

| Component     | Supported | Notes and limitations                                                        |
| :------------ | :-------- | :--------------------------------------------------------------------------- |
| Not Null      | ✅        |                                                                              |
| Unique        | ✅        | Unique constraints are supported via creation of indexes with `UNIQUE` keys. |
| Primary Key   | ✅        |                                                                              |
| Check         | ✅        |                                                                              |
| Foreign Key   | ✅        |                                                                              |
| Default Value | ✅        |                                                                              |

## Indexes

| Component            | Supported | Notes and limitations                                                                                                                                          |
| :------------------- | :-------- |:---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Indexes              | ✅        |                                                                                                                                                                |
| Multi-column indexes | ✅        |                                                                                                                                                                |
| Full-text indexes    | 🟠        | Only basic functionality supported. Missing other search modifiers, different text parsers, stopword support, minimum word length adjustments, phrase matching |
| Spatial indexes      | ✅        |                                                                                                                                                                |

## Schema

| Component                | Supported | Notes and limitations                                                          |
| :----------------------- | :-------- | :----------------------------------------------------------------------------- |
| `ALTER TABLE` statements | 🟠        | Some limitations. See the [supported statements doc](/sql-reference/sql-support/supported-statements). |
| Database renames         | ❌        | Database names are read-only, and configured by the server at startup.         |
| Adding tables            | ✅        |                                                                                |
| Dropping tables          | ✅        |                                                                                |
| Table renames            | ✅        |                                                                                |
| Adding views             | ✅        |                                                                                |
| Dropping views           | ✅        |                                                                                |
| View renames             | ❌        |                                                                                |
| Column renames           | ✅        |                                                                                |
| Adding columns           | ✅        |                                                                                |
| Removing columns         | ✅        |                                                                                |
| Reordering columns       | ✅        |                                                                                |
| Adding constraints       | ✅        |                                                                                |
| Removing constraints     | ✅        |                                                                                |
| Creating indexes         | ✅        |                                                                                |
| Index renames            | ✅        |                                                                                |
| Removing indexes         | ✅        |                                                                                |
| `AUTO INCREMENT`         | ✅        |                                                                                |
