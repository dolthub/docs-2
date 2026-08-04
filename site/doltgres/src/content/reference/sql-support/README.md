---
title: SQL Language Support
---

Doltgres's goal is to be compliant with the PostgreSQL dialect, 
with every query and statement that works in PostgreSQL behaving identically in Doltgres.

For most syntax and technical questions, you should feel free to refer to 
the [PostgreSQL 15 user manual](https://www.postgresql.org/docs/15/index.html).

Any deviation from the PostgreSQL 15 manual should be documented on this page, 
or else indicates a bug. Please [file issues](https://github.com/dolthub/doltgresql/issues)
with any incompatibilities you discover.

This series of documents uses a single "Supported" column to show:

* ✅ SQL language features that work in Doltgres. Minor limitations, where they
  exist, are described in the notes for each entry.
* 🟠 Features that work but have a major limitation or deviation from PostgreSQL,
  described in the notes, that may prevent you from using them successfully.
* ❌ SQL language features that are not yet supported.
