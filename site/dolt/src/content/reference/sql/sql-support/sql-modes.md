---
title: "SQL Modes"
description: Supported sql_mode flags.
---

Dolt supports a subset of [SQL modes that MySQL supports](https://dev.mysql.com/doc/refman/8.4/en/sql-mode.html).
SQL modes are added upon request, so please [file an issue](https://github.com/dolthub/dolt/issues) if a SQL mode you need is missing.

**Currently supporting 4 of 18 MySQL SQL Modes.**

| Mode                                                           | Supported | Notes and limitations  |
|:---------------------------------------------------------------|:----------|:-----------------------|
| `ALLOW_INVALID_DATES`                                          | ❌        |                        |
| `ANSI_QUOTES`                                                  | ✅        |                        |
| `ERROR_FOR_DIVISION_BY_ZERO`                                   | ❌        |                        |
| `HIGH_NOT_PRECEDENCE`                                          | ❌        |                        |
| `IGNORE_SPACE`                                                 | ❌        |                        |
| `NO_AUTO_VALUE_ON_ZERO`                                        | ✅        |                        |
| `NO_BACKSLASH_ESCAPES`                                         | ❌        |                        |
| `NO_DIR_IN_CREATE`                                             | ❌        |                        |
| `NO_ENGINE_SUBSTITUION`                                        | ❌        |                        |
| `NO_UNSIGNED_SUBTRACTION`                                      | ❌        |                        |
| `NO_ZERO_IN_DATE`                                              | ❌        |                        |
| `ONLY_FULL_GROUP_BY`                                           | ✅        |                        |
| `PAD_CHAR_TO_FULL_LENGTH`                                      | ❌        |                        |
| `PIPES_AS_CONCAT`                                              | ✅        |                        |
| `REAL_AS_FLOAT`                                                | ❌        |                        |
| `STRICT_ALL_TABLES`                                            | 🟠        | Partial implementation |
| `STRICT_TRANS_TABLES`                                          | 🟠        | Partial implementation |
| `TIME_TRUNCATE_FRACTIONAL`                                     | ❌        |                        |
| `ANSI`                                                         | 🟠        | Partial implementation |
| `TRADITIONAL`                                                  | 🟠        | Partial implementation |
