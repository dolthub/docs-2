---
title: SQL Language Support
---

# SQL Language Support

Dolt's goal is to be compliant with the MySQL dialect, with every query and statement that works in MySQL behaving identically in Dolt. 

For most syntax and technical questions, you should feel free to refer to the [MySQL user manual](https://dev.mysql.com/doc/refman/8.0/en/select.html). 

Any deviation from the MySQL manual should be documented on this page, or else indicates a bug. Please [file issues](https://github.com/dolthub/dolt/issues) with any incompatibilities you discover.

This series of documents shows:

* ✅ Which SQL language features we support the same as MySQL 
* 🟠 Where we support the feature but deviate from MySQL in some way 
* ❌ Where we lack support for the SQL language feature. 

This section is divided into five main categories:

1. [Data Description](/sql-reference/sql-support/data-description): SQL features for describing and organizing data
2. [Expressions, Functions, Operators](/sql-reference/sql-support/expressions-functions-operators): SQL expressions, functions and operators used in queries
3. [Supported Statements](/sql-reference/sql-support/supported-statements): statements Dolt supports
4. [Information Schema](/sql-reference/sql-support/information-schema): Dolt support for MySQL information schema
5. [Collations and Character Sets](/sql-reference/sql-support/collations-and-charsets): SQL features for describing and comparing strings
6. [System Variables](/sql-reference/sql-support/system-variables): SQL features for configuring server behavior
7. [SQL Modes](/sql-reference/sql-support/sql-modes): Dolt support for MySQL SQL modes
8. [Miscellaneous](/sql-reference/sql-support/miscellaneous): miscellaneous SQL features 
