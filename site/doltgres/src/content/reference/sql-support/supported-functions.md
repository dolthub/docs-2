---
title: Supported Functions
---

# Supported Functions and Operators

Doltgres currently supports a subset of [Postgres functions](https://www.postgresql.org/docs/15/functions.html)
for the built-in data types. If you need any Postgres function that is not available in Doltgres yet,
you can [open a GitHub issue](https://github.com/dolthub/doltgresql/issues) to let us know what you need.

## Logical Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-logical.html).

| Function | Supported | Notes and limitations |
|:---------|:----------|:----------------------|
| AND      | ✅         |                       |
| OR       | ✅         |                       |
| NOT      | ✅         |                       |

## Comparison Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-comparison.html#FUNCTIONS-COMPARISON-OP-TABLE).

| Function                               | Supported | Notes and limitations |
|:---------------------------------------|:----------|:----------------------|
| **datatype** < **datatype**  | ✅         |                       |
| **datatype** > **datatype**  | ✅         |                       |
| **datatype** <= **datatype** | ✅         |                       |
| **datatype** >= **datatype** | ✅         |                       |
| **datatype** = **datatype**  | ✅         |                       |
| **datatype** <> **datatype** | ✅         |                       |
| **datatype** != **datatype** | ✅         |                       |

## Comparison Predicates

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-comparison.html#FUNCTIONS-COMPARISON-PRED-TABLE).

| Function                                                     | Supported | Notes and limitations |
|:-------------------------------------------------------------|:----------|:----------------------|
| **datatype** [NOT] BETWEEN **datatype** AND **datatype**     | ❌         |                       |
| **datatype** BETWEEN SYMMETRIC **datatype** AND **datatype** | ❌         |                       |
| **datatype** IS [NOT] DISTINCT FROM **datatype**             | ❌         |                       |
| **datatype** IS [NOT] NULL                                   | ❌         |                       |
| **datatype** IS [NOT] TRUE                                   | ❌         |                       |
| **datatype** IS [NOT] FALSE                                  | ❌         |                       |
| **datatype** IS [NOT] UNKNOWN                                | ❌         |                       |

## Comparison Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-comparison.html#FUNCTIONS-COMPARISON-FUNC-TABLE).

| Function      | Supported | Notes and limitations |
|:--------------|:----------|:----------------------|
| num_nonnulls  | ❌         |                       |
| num_nulls     | ❌         |                       |

## Mathematical Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-math.html#FUNCTIONS-MATH-OP-TABLE).

| Function                               | Supported | Notes and limitations |
|:---------------------------------------|:----------|:----------------------|
| **numeric_type** + **numeric_type**    | ✅         |                       |
| + **numeric_type**                     | ✅         |                       |
| **numeric_type** - **numeric_type**    | ✅         |                       |
| - **numeric_type**                     | ✅         |                       |
| **numeric_type** * **numeric_type**    | ✅         |                       |
| **numeric_type** / **numeric_type**    | ✅         |                       |
| **numeric_type** % **numeric_type**    | ✅         |                       |
| **numeric_type** ^ **numeric_type**    | ✅         |                       |
| \|/ **double_precision**               | ❌         |                       |
| \|\|/ **double_precision**             | ❌         |                       |
| @ **numeric_type**                     | ❌         |                       |
| **integral_type** & **integral_type**  | ❌         |                       |
| **integral_type** \| **integral_type** | ❌         |                       |
| **integral_type** # **integral_type**  | ❌         |                       |
| ~ **integral_type**                    | ❌         |                       |
| **integral_type** << **integer**       | ❌         |                       |
| **integral_type** >> **integer**       | ❌         |                       |

## Mathematical Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-math.html#FUNCTIONS-MATH-FUNC-TABLE).

| Function     | Supported | Notes and limitations |
|:-------------|:----------|:----------------------|
| abs          | ✅         |                       |
| cbrt         | ✅         |                       |
| ceil         | ✅         |                       |
| ceiling      | ❌         |                       |
| degrees      | ✅         |                       |
| div          | ✅         |                       |
| erf          | ❌         |                       |
| erfc         | ❌         |                       |
| exp          | ✅         |                       |
| factorial    | ✅         |                       |
| floor        | ✅         |                       |
| gcd          | ✅         |                       |
| lcm          | ✅         |                       |
| ln           | ✅         |                       |
| log          | ✅         |                       |
| log10        | ✅         |                       |
| min_scale    | ✅         |                       |
| mod          | ✅         |                       |
| pi           | ✅         |                       |
| power        | ✅         |                       |
| radians      | ✅         |                       |
| round        | ✅         |                       |
| scale        | ✅         |                       |
| sign         | ✅         |                       |
| sqrt         | ✅         |                       |
| trim_scale   | ✅         |                       |
| trunc        | ✅         |                       |
| width_bucket | ✅         |                       |

## Random Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-math.html#FUNCTIONS-MATH-RANDOM-TABLE).

| Function | Supported | Notes and limitations |
|:---------|:----------|:----------------------|
| random   | ✅         |                       |
| setseed  | ❌         |                       |

## Trigonometric Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-math.html#FUNCTIONS-MATH-TRIG-TABLE).

| Function | Supported | Notes and limitations |
|:---------|:----------|:----------------------|
| acos     | ✅         |                       |
| acosd    | ✅         |                       |
| asin     | ✅         |                       |
| asind    | ✅         |                       |
| atan     | ✅         |                       |
| atand    | ✅         |                       |
| atan2    | ✅         |                       |
| atan2d   | ✅         |                       |
| cos      | ✅         |                       |
| cosd     | ✅         |                       |
| cot      | ✅         |                       |
| cotd     | ✅         |                       |
| sin      | ✅         |                       |
| sind     | ✅         |                       |
| tan      | ✅         |                       |
| tand     | ✅         |                       |

## Hyperbolic Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-math.html#FUNCTIONS-MATH-HYP-TABLE).

| Function | Supported | Notes and limitations |
|:---------|:----------|:----------------------|
| sinh     | ✅         |                       |
| cosh     | ✅         |                       |
| tanh     | ✅         |                       |
| asinh    | ✅         |                       |
| acosh    | ✅         |                       |
| atanh    | ✅         |                       |

## SQL String Functions and Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-string.html#FUNCTIONS-STRING-SQL).

| Function                           | Supported | Notes and limitations |
|:-----------------------------------|:----------|:----------------------|
| **text** \|\| **text**             | ❌         |                       |
| **anynonarray** \|\| **text**      | ❌         |                       |
| **text** \|\| **anynonarray**      | ❌         |                       |
| **text** IS [NOT][form] NORMALIZED | ❌         |                       |
| btrim                              | ✅         |                       |
| bit_length                         | ✅         |                       |
| char_length                        | ✅         |                       |
| lower                              | ✅         |                       |
| lpad                               | ✅         |                       |
| ltrim                              | ✅         |                       |
| normalize                          | ❌         |                       |
| octet_length                       | ✅         |                       |
| overlay                            | ❌         |                       |
| position                           | ❌         |                       |
| rpad                               | ✅         |                       |
| rtrim                              | ✅         |                       |
| substring                          | ❌         |                       |
| trim                               | ❌         |                       |
| unicode_assigned                   | ❌         |                       |
| upper                              | ✅         |                       |

## Other String Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-string.html#FUNCTIONS-STRING-OTHER).

| Function              | Supported | Notes and limitations |
|:----------------------|:----------|:----------------------|
| **text** ^@ **text**  | ❌         |                       |
| ascii                 | ✅         |                       |
| chr                   | ✅         |                       |
| concat                | ❌         |                       |
| concat_ws             | ❌         |                       |
| format                | ❌         |                       |
| initcap               | ✅         |                       |
| left                  | ✅         |                       |
| length                | ✅         |                       |
| md5                   | ✅         |                       |
| parse_ident           | ❌         |                       |
| pg_client_encoding    | ❌         |                       |
| quote_ident           | ✅         |                       |
| quote_literal         | ❌         |                       |
| quote_nullable        | ❌         |                       |
| regexp_count          | ❌         |                       |
| regexp_instr          | ❌         |                       |
| regexp_like           | ❌         |                       |
| regexp_match          | ❌         |                       |
| regexp_matches        | ❌         |                       |
| regexp_replace        | ❌         |                       |
| regexp_split_to_array | ❌         |                       |
| regexp_split_to_table | ❌         |                       |
| regexp_substr         | ❌         |                       |
| repeat                | ✅         |                       |
| replace               | ✅         |                       |
| reverse               | ✅         |                       |
| right                 | ✅         |                       |
| split_part            | ✅         |                       |
| starts_with           | ❌         |                       |
| string_to_array       | ❌         |                       |
| string_to_table       | ❌         |                       |
| strpos                | ✅         |                       |
| substr                | ✅         |                       |
| to_ascii              | ❌         |                       |
| to_bin                | ❌         |                       |
| to_hex                | ✅         |                       |
| to_oct                | ❌         |                       |
| translate             | ✅         |                       |
| unistr                | ❌         |                       |

## SQL Binary String Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-binarystring.html#FUNCTIONS-BINARYSTRING-SQL).

| Function                 | Supported | Notes and limitations |
|:-------------------------|:----------|:----------------------|
| **bytea** \|\| **bytea** | ❌         |                       |
| bit_length               | ❌         |                       |
| btrim                    | ❌         |                       |
| ltrim                    | ❌         |                       |
| octet_length             | ❌         |                       |
| overlay                  | ❌         |                       |
| position                 | ❌         |                       |
| rtrim                    | ❌         |                       |
| substring                | ❌         |                       |
| trim                     | ❌         |                       |

## Other Binary String Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-binarystring.html#FUNCTIONS-BINARYSTRING-OTHER).

| Function   | Supported | Notes and limitations |
|:-----------|:----------|:----------------------|
| bit_count  | ❌         |                       |
| get_bit    | ❌         |                       |
| get_byte   | ❌         |                       |
| length     | ❌         |                       |
| md5        | ❌         |                       |
| set_bit    | ❌         |                       |
| set_byte   | ❌         |                       |
| sha224     | ❌         |                       |
| sha256     | ❌         |                       |
| sha384     | ❌         |                       |
| sha512     | ❌         |                       |
| substr     | ❌         |                       |

## Text/Binary String Conversion Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-binarystring.html#FUNCTIONS-BINARYSTRING-CONVERSIONS).

| Function     | Supported | Notes and limitations |
|:-------------|:----------|:----------------------|
| convert      | ❌         |                       |
| convert_from | ❌         |                       |
| convert_to   | ❌         |                       |
| encode       | ❌         |                       |
| decode       | ❌         |                       |

## Bit String Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-bitstring.html#FUNCTIONS-BIT-STRING-OP-TABLE).

| Function               | Supported | Notes and limitations |
|:-----------------------|:----------|:----------------------|
| **bit** \|\| **bit**   | ❌         |                       |
| **bit** & **bit**      | ❌         |                       |
| **bit** \| **bit**     | ❌         |                       |
| **bit** # **bit**      | ❌         |                       |
| ~ **bit**              | ❌         |                       |
| **bit** << **integer** | ❌         |                       |
| **bit** >> **integer** | ❌         |                       |

## Bit String Functions

See detailed list in the [Postgres docs](https://postgresql.org/docs/current/functions-bitstring.html#FUNCTIONS-BIT-STRING-TABLE).

| Function     | Supported | Notes and limitations |
|:-------------|:----------|:----------------------|
| bit_count    | ❌         |                       |
| bit_length   | ❌         |                       |
| length       | ❌         |                       |
| octet_length | ❌         |                       |
| overlay      | ❌         |                       |
| position     | ❌         |                       |
| substring    | ❌         |                       |
| get_bit      | ❌         |                       |
| set_bit      | ❌         |                       |

## Pattern Matching

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-matching.html).

| Function                                                  | Supported | Notes and limitations |
|:----------------------------------------------------------|:----------|:----------------------|
| [NOT] LIKE **pattern** [ESCAPE **escape-character**       | ❌         |                       |
| [NOT] SIMILAR TO **pattern** [ESCAPE **escape-character** | ❌         |                       |

## Regular Expression Match Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-matching.html#FUNCTIONS-POSIX-TABLE).

| Function              | Supported | Notes and limitations |
|:----------------------|:----------|:----------------------|
| **text** ~ **text**   | ❌         |                       |
| **text** ~* **text**  | ❌         |                       |
| **text** !~ **text**  | ❌         |                       |
| **text** !~* **text** | ❌         |                       |

## Formatting Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-formatting.html#FUNCTIONS-FORMATTING-TABLE).

| Function     | Supported | Notes and limitations |
|:-------------|:----------|:----------------------|
| to_char      | ✅         |                       |
| to_date      | ❌         |                       |
| to_number    | ❌         |                       |
| to_timestamp | ❌         |                       |

## Date/Time Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-datetime.html#OPERATORS-DATETIME-TABLE).

| Function                            | Supported | Notes and limitations |
|:------------------------------------|:----------|:----------------------|
| **date** + **integer**              | ❌         |                       |
| **date** + **interval**             | ❌         |                       |
| **date** + **time**                 | ❌         |                       |
| **interval** + **interval**         | ❌         |                       |
| **timestamp** + **interval**        | ❌         |                       |
| **time** + **interval**             | ❌         |                       |
| - **interval**                      | ❌         |                       |
| **date** - **date**                 | ❌         |                       |
| **date** - **integer**              | ❌         |                       |
| **date** - **interval**             | ❌         |                       |
| **time** - **time**                 | ❌         |                       |
| **time** - **interval**             | ❌         |                       |
| **timestamp** - **interval**        | ❌         |                       |
| **interval** - **interval**         | ❌         |                       |
| **timestamp** - **timestamp**       | ❌         |                       |
| **interval** * **double_precision** | ❌         |                       |
| **interval** / **double_precision** | ❌         |                       |

## Date/Time Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-TABLE).

| Function              | Supported | Notes and limitations                    |
|:----------------------|:----------|:-----------------------------------------|
| age                   | ✅         |                                          |
| clock_timestamp       | ❌         |                                          |
| current_date          | ✅         |                                          |
| current_time          | ❌         |                                          |
| current_timestamp     | ✅         |                                          |
| date_add              | ❌         |                                          |
| date_bin              | ❌         |                                          |
| date_part             | ❌         |                                          |
| date_subtract         | ❌         |                                          |
| date_trunc            | ❌         |                                          |
| extract               | ✅         |                                          |
| isfinite              | ❌         |                                          |
| justify_days          | ❌         |                                          |
| justify_hours         | ❌         |                                          |
| justify_interval      | ❌         |                                          |
| localtime             | 🟠        | returns timestamp                        |
| localtimestamp        | 🟠        | missing support for integer input option |
| make_date             | ❌         |                                          |
| make_interval         | ❌         |                                          |
| make_time             | ❌         |                                          |
| make_timestamp        | ❌         |                                          |
| make_timestamptz      | ❌         |                                          |
| now                   | 🟠        | missing timezone value                   |
| statement_timestamp   | ❌         |                                          |
| timeofday             | ❌         |                                          |
| timezone              | ❌         |                                          |
| transaction_timestamp | ❌         |                                          |
| to_timestamp          | ❌         |                                          |

## Enum Support Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-enum.html#FUNCTIONS-ENUM-TABLE).

| Function    | Supported | Notes and limitations |
|:------------|:----------|:----------------------|
| enum_first  | ❌         |                       |
| enum_last   | ❌         |                       |
| enum_range  | ❌         |                       |

## Geometric Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-geometry.html#FUNCTIONS-GEOMETRY-OP-TABLE).

| Function                                   | Supported | Notes and limitations |
|:-------------------------------------------|:----------|:----------------------|
| **geometric_type** + **point**             | ❌         |                       |
| **path** + **path**                        | ❌         |                       |
| **geometric_type** - **point**             | ❌         |                       |
| **geometric_type** * **point**             | ❌         |                       |
| **geometric_type** / **point**             | ❌         |                       |
| @-@ **geometric_type**                     | ❌         |                       |
| @@ **geometric_type**                      | ❌         |                       |
| **geometric_type** # **geometric_type**    | ❌         |                       |
| **box** # **box**                          | ❌         |                       |
| **geometric_type** ## **geometric_type**   | ❌         |                       |
| **geometric_type** <-> **geometric_type**  | ❌         |                       |
| **geometric_type** @> **geometric_type**   | ❌         |                       |
| **geometric_type** <@ **geometric_type**   | ❌         |                       |
| **geometric_type** && **geometric_type**   | ❌         |                       |
| **geometric_type** << **geometric_type**   | ❌         |                       |
| **geometric_type** >> **geometric_type**   | ❌         |                       |
| **geometric_type** &< **geometric_type**   | ❌         |                       |
| **geometric_type** &> **geometric_type**   | ❌         |                       |
| **geometric_type** >>\| **geometric_type** | ❌         |                       |
| **geometric_type** \|>> **geometric_type** | ❌         |                       |
| **geometric_type** &>\| **geometric_type** | ❌         |                       |
| **geometric_type** \|&> **geometric_type** | ❌         |                       |
| **box** <^ **box**                         | ❌         |                       |
| **box** >^ **box**                         | ❌         |                       |
| **geometric_type** ?# **geometric_type**   | ❌         |                       |
| ?- **line**                                | ❌         |                       |
| ?- **lseg**                                | ❌         |                       |
| **point** ?- **point**                     | ❌         |                       |
| ?\| **line**                               | ❌         |                       |
| ?\| **lseg**                               | ❌         |                       |
| **point** ?\| **point**                    | ❌         |                       |
| **line** ?-\| **line**                     | ❌         |                       |
| **lseg** ?-\| **lseg**                     | ❌         |                       |
| **line** ?\|\| **line**                    | ❌         |                       |
| **lseg** ?\|\| **lseg**                    | ❌         |                       |
| **geometric_type** ~= **geometric_type**   | ❌         |                       |

## Geometric Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-geometry.html#FUNCTIONS-GEOMETRY-FUNC-TABLE).

| Function | Supported | Notes and limitations |
|:---------|:----------|:----------------------|
| area     | ❌         |                       |
| center   | ❌         |                       |
| diagonal | ❌         |                       |
| diameter | ❌         |                       |
| height   | ❌         |                       |
| isclosed | ❌         |                       |
| isopen   | ❌         |                       |
| length   | ❌         |                       |
| npoints  | ❌         |                       |
| pclose   | ❌         |                       |
| popen    | ❌         |                       |
| radius   | ❌         |                       |
| slope    | ❌         |                       |
| width    | ❌         |                       |

## Geometric Type Conversion Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-geometry.html#FUNCTIONS-GEOMETRY-CONV-TABLE).

| Function  | Supported | Notes and limitations |
|:----------|:----------|:----------------------|
| box       | ❌         |                       |
| bound_box | ❌         |                       |
| circle    | ❌         |                       |
| line      | ❌         |                       |
| lseg      | ❌         |                       |
| path      | ❌         |                       |
| point     | ❌         |                       |
| polygon   | ❌         |                       |

## IP Address Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-net.html#CIDR-INET-OPERATORS-TABLE).

| Function              | Supported | Notes and limitations |
|:----------------------|:----------|:----------------------|
| **inet** << **inet**  | ❌         |                       |
| **inet** <<= **inet** | ❌         |                       |
| **inet** >> **inet**  | ❌         |                       |
| **inet** >>= **inet** | ❌         |                       |
| **inet** && **inet**  | ❌         |                       |
| ~ **inet**            | ❌         |                       |
| **inet** & **inet**   | ❌         |                       |
| **inet** \| **inet**  | ❌         |                       |
| **inet** + **bigint** | ❌         |                       |
| **bigint** + **inet** | ❌         |                       |
| **inet** - **bigint** | ❌         |                       |
| **inet** - **inet**   | ❌         |                       |

## IP Address Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-net.html#CIDR-INET-FUNCTIONS-TABLE).

| Function         | Supported | Notes and limitations |
|:-----------------|:----------|:----------------------|
| abbrev           | ❌         |                       |
| broadcast        | ❌         |                       |
| family           | ❌         |                       |
| host             | ❌         |                       |
| hostmask         | ❌         |                       |
| inet_merge       | ❌         |                       |
| inet_same_family | ❌         |                       |
| masklen          | ❌         |                       |
| netmask          | ❌         |                       |
| network          | ❌         |                       |
| set_masklen      | ❌         |                       |
| text             | ❌         |                       |

## MAC Address Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-net.html#MACADDR-FUNCTIONS-TABLE).

| Function         | Supported | Notes and limitations |
|:-----------------|:----------|:----------------------|
| trunc            | ❌         |                       |
| macaddr8_set7bit | ❌         |                       |

## Text Search Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-textsearch.html#TEXTSEARCH-OPERATORS-TABLE).

| Function                       | Supported | Notes and limitations |
|:-------------------------------|:----------|:----------------------|
| **tsvector** @@ **tsquery**    | ❌         |                       |
| **tsquery** @@ **tsvector**    | ❌         |                       |
| **text** @@ **tsquery**        | ❌         |                       |
| **tsvector** \|\| **tsvector** | ❌         |                       |
| **tsquery** && **tsquery**     | ❌         |                       |
| **tsquery** \|\| **tsquery**   | ❌         |                       |
| !! **tsquery**                 | ❌         |                       |
| **tsquery** <-> **tsquery**    | ❌         |                       |
| **tsquery** @> **tsquery**     | ❌         |                       |
| **tsquery** <@ **tsquery**     | ❌         |                       |

## Text Search Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-textsearch.html#TEXTSEARCH-FUNCTIONS-TABLE).

| Function              | Supported | Notes and limitations |
|:----------------------|:----------|:----------------------|
| array_to_tsvector     | ❌         |                       | 
| get_current_ts_config | ❌         |                       |
| length                | ❌         |                       |
| numnode               | ❌         |                       |
| plainto_tsquery       | ❌         |                       |
| phraseto_tsquery      | ❌         |                       |
| websearch_to_tsquery  | ❌         |                       |
| querytree             | ❌         |                       |
| setweight             | ❌         |                       |
| strip                 | ❌         |                       |
| to_tsquery            | ❌         |                       |
| to_tsvector           | ❌         |                       |
| json_to_tsvector      | ❌         |                       |
| ts_delete             | ❌         |                       |
| ts_filter             | ❌         |                       |
| ts_headline           | ❌         |                       |
| ts_rank               | ❌         |                       |
| ts_rank_cd            | ❌         |                       |
| ts_rewrite            | ❌         |                       |
| tsquery_phrase        | ❌         |                       |
| tsvector_to_array     | ❌         |                       |
| unnest                | ❌         |                       |

## Text Search Debugging Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-textsearch.html#TEXTSEARCH-FUNCTIONS-DEBUG-TABLE).

| Function      | Supported | Notes and limitations |
|:--------------|:----------|:----------------------|
| ts_debug      | ❌         |                       |
| ts_lexize     | ❌         |                       |
| ts_parse      | ❌         |                       |
| ts_token_type | ❌         |                       |
| ts_stat       | ❌         |                       |

## UUID Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-uuid.html#FUNCTIONS-UUID).

| Function               | Supported | Notes and limitations |
|:-----------------------|:----------|:----------------------|
| gen_random_uuid        | ❌         |                       |
| uuid_extract_timestamp | ❌         |                       |
| uuid_extract_version   | ❌         |                       |

## XML Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-xml.html#FUNCTIONS-XML).

| Function                      | Supported | Notes and limitations |
|:------------------------------|:----------|:----------------------|
| xmltext                       | ❌         |                       |
| xmlcomment                    | ❌         |                       |
| xmlconcat                     | ❌         |                       |
| xmlelement                    | ❌         |                       |
| xmlforest                     | ❌         |                       |
| xmlpi                         | ❌         |                       |
| xmlroot                       | ❌         |                       |
| xmlagg                        | ❌         |                       |
| xmlexists                     | ❌         |                       |
| xml_is_well_formed            | ❌         |                       |
| xml_is_well_formed_document   | ❌         |                       |
| xml_is_well_formed_content    | ❌         |                       |
| xpath                         | ❌         |                       |
| xpath_exists                  | ❌         |                       |
| xmltable                      | ❌         |                       |
| table_to_xml                  | ❌         |                       |
| query_to_xml                  | ❌         |                       |
| cursor_to_xml                 | ❌         |                       |
| table_to_xmlschema            | ❌         |                       |
| query_to_xmlschema            | ❌         |                       |
| cursor_to_xmlschema           | ❌         |                       |
| table_to_xml_and_xmlschema    | ❌         |                       |
| query_to_xml_and_xmlschema    | ❌         |                       |
| schema_to_xml                 | ❌         |                       |
| schema_to_xmlschema           | ❌         |                       |
| schema_to_xml_and_xmlschema   | ❌         |                       |
| database_to_xml               | ❌         |                       |
| database_to_xmlschema         | ❌         |                       |
| database_to_xml_and_xmlschema | ❌         |                       |

## json and jsonb Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-OP-TABLE).

| Function                  | Supported | Notes and limitations |
|:--------------------------|:----------|:----------------------|
| **json** -> **integer**   | ❌         |                       |
| **jsonb** -> **integer**  | ❌         |                       |
| **json** -> **text**      | ❌         |                       |
| **jsonb** -> **text**     | ❌         |                       |
| **json** ->> **integer**  | ❌         |                       |
| **jsonb** ->> **integer** | ❌         |                       |
| **json** ->> **text**     | ❌         |                       |
| **jsonb** ->> **text**    | ❌         |                       |
| **json** #> **text[]**    | ❌         |                       |
| **jsonb** #> **text[]**   | ❌         |                       |
| **json** #>> **text[]**   | ❌         |                       |
| **jsonb** #>> **text[]**  | ❌         |                       |

## Additional jsonb Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSONB-OP-TABLE).

| Function                  | Supported | Notes and limitations |
|:--------------------------|:----------|:----------------------|
| **jsonb** @> **jsonb**    | ❌         |                       |
| **jsonb** <@ **jsonb**    | ❌         |                       |
| **jsonb** ? **text**      | ❌         |                       |
| **jsonb** ?\| **text[]**  | ❌         |                       |
| **jsonb** ?& **text[]**   | ❌         |                       |
| **jsonb** \|\|  **jsonb** | ❌         |                       |
| **jsonb** - **text**      | ❌         |                       |
| **jsonb** - **text[]**    | ❌         |                       |
| **jsonb** - **integer**   | ❌         |                       |
| **jsonb** #- **text[]**   | ❌         |                       |
| **jsonb** @? **jsonpath** | ❌         |                       |
| **jsonb** @@ **jsonpath** | ❌         |                       |

## JSON Creation Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-CREATION-TABLE).

| Function           | Supported | Notes and limitations |
|:-------------------|:----------|:----------------------|
| to_json            | ❌         |                       |
| to_jsonb           | ❌         |                       |
| array_to_json      | ❌         |                       |
| json_array         | ❌         |                       |
| row_to_json        | ❌         |                       |
| json_build_array   | ❌         |                       |
| jsonb_build_array  | ❌         |                       |
| json_build_object  | ❌         |                       |
| jsonb_build_object | ❌         |                       |
| json_object        | ❌         |                       |
| jsonb_object       | ❌         |                       |
| json               | ❌         |                       |
| json_scalar        | ❌         |                       |
| json_serialize     | ❌         |                       |

## JSON Processing Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING-TABLE).

| Function                    | Supported | Notes and limitations |
|:----------------------------|:----------|:----------------------|
| json_array_elements         | ❌         |                       |
| jsonb_array_elements        | ❌         |                       |
| json_array_elements_text    | ❌         |                       |
| jsonb_array_elements_text   | ❌         |                       |
| json_array_length           | ❌         |                       |
| jsonb_array_length          | ❌         |                       |
| json_each                   | ❌         |                       |
| jsonb_each                  | ❌         |                       |
| json_each_text              | ❌         |                       |
| jsonb_each_text             | ❌         |                       |
| json_extract_path           | ❌         |                       |
| jsonb_extract_path          | ❌         |                       |
| json_extract_path_text      | ❌         |                       |
| jsonb_extract_path_text     | ❌         |                       |
| json_object_keys            | ❌         |                       |
| jsonb_object_keys           | ❌         |                       |
| json_populate_record        | ❌         |                       |
| jsonb_populate_record       | ❌         |                       |
| json_                       | ❌         |                       |
| jsonb_populate_record_valid | ❌         |                       |
| json_populate_recordset     | ❌         |                       |
| jsonb_populate_recordset    | ❌         |                       |
| json_to_record              | ❌         |                       |
| jsonb_to_record             | ❌         |                       |
| json_to_recordset           | ❌         |                       |
| jsonb_to_recordset          | ❌         |                       |
| json_                       | ❌         |                       |
| jsonb_set                   | ❌         |                       |
| jsonb_set_lax               | ❌         |                       |
| jsonb_insert                | ❌         |                       |
| json_strip_nulls            | ❌         |                       |
| jsonb_strip_nulls           | ❌         |                       |
| jsonb_path_exists           | ❌         |                       |
| jsonb_path_match            | ❌         |                       |
| jsonb_path_query            | ❌         |                       |
| jsonb_path_query_array      | ❌         |                       |
| jsonb_path_query_first      | ❌         |                       |
| jsonb_path_exists_tz        | ❌         |                       |
| jsonb_path_match_tz         | ❌         |                       |
| jsonb_path_query_tz         | ❌         |                       |
| jsonb_path_query_array_tz   | ❌         |                       |
| jsonb_path_query_first_tz   | ❌         |                       |
| jsonb_pretty                | ❌         |                       |
| json_typeof                 | ❌         |                       |
| jsonb_typeof                | ❌         |                       |

## SQL/JSON Query Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-SQLJSON-QUERYING).

| Function     | Supported | Notes and limitations |
|:-------------|:----------|:----------------------|
| json_exists  | ❌         |                       |
| json_query   | ❌         |                       |
| json_value   | ❌         |                       |
| json_table   | ❌         |                       |

## Sequence Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-sequence.html#FUNCTIONS-SEQUENCE-TABLE).

| Function | Supported | Notes and limitations |
|:---------|:----------|:----------------------|
| nextval  | ✅         |                       |
| setval   | ✅         |                       |
| currval  | ❌         |                       |
| lastval  | ❌         |                       |

## Conditional Expressions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-conditional.html#FUNCTIONS-CONDITIONAL).

| Function | Supported | Notes and limitations |
|:---------|:----------|:----------------------|
| case     | ❌         |                       |
| coalesce | ❌         |                       |
| nullif   | ❌         |                       |
| greatest | ❌         |                       |
| least    | ❌         |                       |

## Array Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-array.html#ARRAY-OPERATORS-TABLE).

| Function                                           | Supported | Notes and limitations |
|:---------------------------------------------------|:----------|:----------------------|
| **anyarray** @> **anyarray**                       | ❌         |                       |
| **anyarray** <@ **anyarray**                       | ❌         |                       |
| **anyarray** && **anyarray**                       | ❌         |                       |
| **anycompatiblearray** \|\| **anycompatiblearray** | ❌         |                       |
| **anycompatible** \|\| **anycompatiblearray**      | ❌         |                       |
| **anycompatiblearray** \|\| **anycompatible**      | ❌         |                       |

## Array Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-array.html#ARRAY-FUNCTIONS-TABLE).

| Function        | Supported | Notes and limitations           |
|:----------------|:----------|:--------------------------------|
| array_append    | ✅         |                                 |
| array_cat       | ❌         |                                 |
| array_dims      | ❌         |                                 |
| array_fill      | ❌         |                                 |
| array_length    | ❌         |                                 |
| array_lower     | ❌         |                                 |
| array_ndims     | ❌         |                                 |
| array_position  | ❌         |                                 |
| array_positions | ❌         |                                 |
| array_prepend   | ❌         |                                 |
| array_remove    | ❌         |                                 |
| array_replace   | ❌         |                                 |
| array_sample    | ❌         |                                 |
| array_shuffle   | ❌         |                                 |
| array_to_string | ✅         |                                 |
| array_upper     | ❌         |                                 |
| cardinality     | ❌         |                                 |
| trim_array      | ❌         |                                 |
| unnest          | 🟠        | works with array lengths of 0-1 |

## Range Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-range.html#RANGE-OPERATORS-TABLE).

| Function                       | Supported | Notes and limitations |
|:-------------------------------|:----------|:----------------------|
| **anyrange** @> **anyrange**   | ❌         |                       |
| **anyrange** @> **anyelement** | ❌         |                       |
| **anyrange** <@ **anyrange**   | ❌         |                       |
| **anyelement** <@ **anyrange** | ❌         |                       |
| **anyrange** && **anyrange**   | ❌         |                       |
| **anyrange** << **anyrange**   | ❌         |                       |
| **anyrange** >> **anyrange**   | ❌         |                       |
| **anyrange** &< **anyrange**   | ❌         |                       |
| **anyrange** &> **anyrange**   | ❌         |                       |
| **anyrange** -\|- **anyrange** | ❌         |                       |
| **anyrange** + **anyrange**    | ❌         |                       |
| **anyrange** * **anyrange**    | ❌         |                       |
| **anyrange** - **anyrange**    | ❌         |                       |

## Multirange Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-range.html#MULTIRANGE-OPERATORS-TABLE).

| Function                               | Supported | Notes and limitations |
|:---------------------------------------|:----------|:----------------------|
| **anymultirange** @> **anymultirange** | ❌         |                       |
| **anymultirange** @> **anyrange**      | ❌         |                       |
| **anymultirange** @> **anyelement**    | ❌         |                       |
| **anyrange** @> **anymultirange**      | ❌         |                       |
| **anymultirange** <@ **anymultirange** | ❌         |                       |
| **anymultirange** <@ **anyrange**      | ❌         |                       |
| **anyrange** <@ **anymultirange**      | ❌         |                       |
| **anyelement** <@ **anymultirange**    | ❌         |                       |
| **anymultirange** && **anymultirange** | ❌         |                       |
| **anymultirange** && **anyrange**      | ❌         |                       |
| **anyrange** && **anymultirange**      | ❌         |                       |
| **anymultirange** << **anymultirange** | ❌         |                       |
| **anymultirange** << **anyrange**      | ❌         |                       |
| **anyrange** << **anymultirange**      | ❌         |                       |
| **anymultirange** >> **anymultirange** | ❌         |                       |
| **anymultirange** >> **anyrange**      | ❌         |                       |
| **anyrange** >> **anymultirange**      | ❌         |                       |
| **anymultirange** &< **anymultirange** | ❌         |                       |
| **anymultirange** &< **anyrange**      | ❌         |                       |
| **anyrange** &< **anymultirange**      | ❌         |                       |
| **anymultirange** &> **anymultirange** | ❌         |                       |
| **anymultirange** &> **anyrange**      | ❌         |                       |
| **anyrange** &> **anymultirange**      | ❌         |                       |
| **anymultirange** -\|- **anyrange**    | ❌         |                       |
| **anymultirange** + **anyrange**       | ❌         |                       |
| **anymultirange** * **anyrange**       | ❌         |                       |
| **anymultirange** - **anyrange**       | ❌         |                       |

## Range Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-range.html#RANGE-FUNCTIONS-TABLE).

| Function    | Supported | Notes and limitations |
|:------------|:----------|:----------------------|
| lower       | ❌         |                       |
| upper       | ❌         |                       |
| isempty     | ❌         |                       |
| lower_inc   | ❌         |                       |
| upper_inc   | ❌         |                       |
| lower_inf   | ❌         |                       |
| upper_inf   | ❌         |                       |
| range_merge | ❌         |                       |

## Multirange Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-range.html#MULTIRANGE-FUNCTIONS-TABLE).

| Function    | Supported | Notes and limitations |
|:------------|:----------|:----------------------|
| lower       | ❌         |                       |
| upper       | ❌         |                       |
| isempty     | ❌         |                       |
| lower_inc   | ❌         |                       |
| upper_inc   | ❌         |                       |
| lower_inf   | ❌         |                       |
| upper_inf   | ❌         |                       |
| range_merge | ❌         |                       |
| multirange  | ❌         |                       |
| unnest      | ❌         |                       |

## General-Purpose Aggregate Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE).

| Function                      | Supported | Notes and limitations      |
|:------------------------------|:----------|:---------------------------|
| any_value                     | ❌         |                            |
| array_agg                     | ❌         |                            |
| avg                           | ❌         |                            |
| bit_and                       | ❌         |                            |
| bit_or                        | ❌         |                            |
| bit_xor                       | ❌         |                            |
| bool_and                      | ❌         |                            |
| bool_or                       | ❌         |                            |
| count                         | ✅         | only count(*) is supported |
| every                         | ❌         |                            |
| json_agg                      | ❌         |                            |
| json_agg_strict               | ❌         |                            |
| json_arrayagg                 | ❌         |                            |
| json_objectagg                | ❌         |                            |
| json_object_agg               | ❌         |                            |
| json_object_agg_strict        | ❌         |                            |
| json_object_agg_unique        | ❌         |                            |
| json_object_agg_unique_strict | ❌         |                            |
| max                           | ❌         |                            |
| min                           | ❌         |                            |
| range_agg                     | ❌         |                            |
| range_intersect_agg           | ❌         |                            |
| string_agg                    | ❌         |                            |
| sum                           | ❌         |                            |
| xmlagg                        | ❌         |                            |

## Aggregate Functions for Statistics

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-AGGREGATE-STATISTICS-TABLE).

| Function       | Supported | Notes and limitations |
|:---------------|:----------|:----------------------|
| corr           | ❌         |                       |
| covar_pop      | ❌         |                       |
| covar_samp     | ❌         |                       |
| regr_avgx      | ❌         |                       |
| regr_avgy      | ❌         |                       |
| regr_count     | ❌         |                       |
| regr_intercept | ❌         |                       |
| regr_r2        | ❌         |                       |
| regr_slope     | ❌         |                       |
| regr_sxx       | ❌         |                       |
| regr_sxy       | ❌         |                       |
| regr_syy       | ❌         |                       |
| stddev         | ❌         |                       |
| stddev_pop     | ❌         |                       |
| stddev_samp    | ❌         |                       |
| variance       | ❌         |                       |
| var_pop        | ❌         |                       |
| var_samp       | ❌         |                       |

## Ordered-Set Aggregate Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-ORDEREDSET-TABLE).

| Function        | Supported | Notes and limitations |
|:----------------|:----------|:----------------------|
| mode            | ❌         |                       |
| percentile_cont | ❌         |                       |
| percentile_disc | ❌         |                       |

## Hypothetical-Set Aggregate Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-HYPOTHETICAL-TABLE).

| Function     | Supported | Notes and limitations |
|:-------------|:----------|:----------------------|
| rank         | ❌         |                       |
| dense_rank   | ❌         |                       |
| percent_rank | ❌         |                       |
| cume_dist    | ❌         |                       |

## Grouping Operations

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-GROUPING-TABLE).

| Function  | Supported | Notes and limitations |
|:----------|:----------|:----------------------|
| grouping  | ❌         |                       |

## General-Purpose Window Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-window.html#FUNCTIONS-WINDOW-TABLE).

| Function     | Supported | Notes and limitations |
|:-------------|:----------|:----------------------|
| row_number   | ❌         |                       |
| rank         | ❌         |                       |
| dense_rank   | ❌         |                       |
| percent_rank | ❌         |                       |
| cume_dist    | ❌         |                       |
| ntile        | ❌         |                       |
| lag          | ❌         |                       |
| lead         | ❌         |                       |
| first_value  | ❌         |                       |
| last_value   | ❌         |                       |
| nth_value    | ❌         |                       |

## Merge Support Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-merge-support.html#FUNCTIONS-MERGE-SUPPORT-TABLE).

| Function     | Supported | Notes and limitations |
|:-------------|:----------|:----------------------|
| merge_action | ❌         |                       |

## Subquery Expressions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-subquery.html#FUNCTIONS-SUBQUERY).

| Function | Supported | Notes and limitations |
|:---------|:----------|:----------------------|
| exists   | ❌         |                       |
| in       | ❌         |                       |
| not in   | ❌         |                       |
| any/some | ✅         |                       |
| all      | ❌         |                       |

## Series Generating Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-srf.html#FUNCTIONS-SRF-SERIES).

| Function         | Supported | Notes and limitations |
|:-----------------|:----------|:----------------------|
| generate_series  | ❌         |                       |

## Subscript Generating Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-srf.html#FUNCTIONS-SRF-SUBSCRIPTS).

| Function             | Supported | Notes and limitations |
|:---------------------|:----------|:----------------------|
| generate_subscripts  | ❌         |                       |

## Session Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-SESSION-TABLE).

| Function                        | Supported | Notes and limitations        |
|:--------------------------------|:----------|:-----------------------------|
| current_catalog                 | ✅         |                              |
| current_database()              | ✅         |                              |
| current_query                   | ❌         |                              |
| current_role                    | ❌         |                              |
| current_schema                  | ✅         |                              |
| current_schemas                 | ✅         |                              |
| current_user                    | ❌         |                              |
| inet_client_addr                | ❌         |                              |
| inet_client_port                | ❌         |                              |
| inet_server_addr                | ❌         |                              |
| inet_server_port                | ❌         |                              |
| pg_backend_pid                  | ❌         |                              |
| pg_blocking_pids                | ❌         |                              |
| pg_conf_load_time               | ❌         |                              |
| pg_current_logfile              | ❌         |                              |
| pg_my_temp_schema               | ❌         |                              |
| pg_is_other_temp_schema         | ❌         |                              |
| pg_jit_available                | ❌         |                              |
| pg_listening_channels           | ❌         |                              |
| pg_notification_queue_usage     | ❌         |                              |
| pg_postmaster_start_time        | 🟠        | Parses, returns current time |
| pg_safe_snapshot_blocking_pids  | ❌         |                              |
| pg_trigger_depth                | ❌         |                              |
| session_user                    | ❌         |                              |
| system_user                     | ❌         |                              |
| user                            | ❌         |                              |

## Access Privilege Inquiry Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-ACCESS-TABLE).

| Function                           | Supported | Notes and limitations |
|:-----------------------------------|:----------|:----------------------|
| has_any_column_privilege           | ❌         |                       |
| has_column_privilege               | ❌         |                       |
| has_database_privilege             | ❌         |                       |
| has_foreign_data_wrapper_privilege | ❌         |                       |
| has_function_privilege             | ❌         |                       |
| has_language_privilege             | ❌         |                       |
| has_parameter_privilege            | ❌         |                       |
| has_schema_privilege               | ❌         |                       |
| has_sequence_privilege             | ❌         |                       |
| has_server_privilege               | ❌         |                       |
| has_table_privilege                | ❌         |                       |
| has_tablespace_privilege           | ❌         |                       |
| has_type_privilege                 | ❌         |                       |
| pg_has_role                        | ❌         |                       |
| row_security_active                | ❌         |                       |

## _aclitem_ Operators

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-ACLITEM-OP-TABLE).

| Function                     | Supported | Notes and limitations |
|:-----------------------------|:----------|:----------------------|
| **aclitem** = **aclitem**    | ❌         |                       |
| **aclitem[]** @> **aclitem** | ❌         |                       |
| **aclitem[]** ~ **aclitem**  | ❌         |                       |

## _aclitem_ Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-ACLITEM-FN-TABLE).

| Function    | Supported | Notes and limitations |
|:------------|:----------|:----------------------|
| acldefault  | ❌         |                       |
| aclexplode  | ❌         |                       |
| makeaclitem | ❌         |                       |

## Schema Visibility Inquiry Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-SCHEMA-TABLE).

| Function                     | Supported | Notes and limitations   |
|:-----------------------------|:----------|:------------------------|
| pg_collation_is_visible      | ❌         |                         |
| pg_conversion_is_visible     | ❌         |                         |
| pg_function_is_visible       | 🟠        | Parses, not implemented |
| pg_opclass_is_visible        | ❌         |                         |
| pg_operator_is_visible       | ❌         |                         |
| pg_opfamily_is_visible       | ❌         |                         |
| pg_statistics_obj_is_visible | ❌         |                         |
| pg_table_is_visible          | ✅         |                         |
| pg_ts_config_is_visible      | ❌         |                         |
| pg_ts_dict_is_visible        | ❌         |                         |
| pg_ts_parser_is_visible      | ❌         |                         |
| pg_ts_template_is_visible    | ❌         |                         |
| pg_type_is_visible           | ❌         |                         |

## System Catalog Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-CATALOG-TABLE).

| Function                           | Supported | Notes and limitations   |
|:-----------------------------------|:----------|:------------------------|
| format_type                        | ✅         |                         |
| pg_basetype                        | ❌         |                         |
| pg_char_to_encoding                | ❌         |                         |
| pg_encoding_to_char                | 🟠        | Parses, not implemented |
| pg_get_catalog_foreign_keys        | ❌         |                         |
| pg_get_constraintdef               | ✅         |                         |
| pg_get_expr                        | 🟠        | Parses, not implemented |
| pg_get_functiondef                 | 🟠        | Parses, not implemented |
| pg_get_function_arguments          | ❌         |                         |
| pg_get_function_identity_arguments | 🟠        | Parses, not implemented |
| pg_get_function_result             | ❌         |                         |
| pg_get_indexdef                    | 🟠        | Parses, not implemented |
| pg_get_keywords                    | ❌         |                         |
| pg_get_partkeydef                  | 🟠        | Parses, not implemented |
| pg_get_ruledef                     | ❌         |                         |
| pg_get_serial_sequence             | ✅         |                         |
| pg_get_statisticsobjdef            | ❌         |                         |
| pg_get_triggerdef                  | 🟠        | Parses, not implemented |
| pg_get_userbyid                    | 🟠        | Parses, not implemented |
| pg_get_viewdef                     | ✅         |                         |
| pg_index_column_has_property       | ❌         |                         |
| pg_index_has_property              | ❌         |                         |
| pg_indexam_has_property            | ❌         |                         |
| pg_options_to_table                | ❌         |                         |
| pg_settings_get_flags              | ❌         |                         |
| pg_tablespace_databases            | ❌         |                         |
| pg_tablespace_location             | 🟠        | Parses, not implemented |
| pg_typeof                          | ❌         |                         |
| COLLATION FOR                      | ❌         |                         |
| to_regclass                        | ✅         |                         |
| to_regcollation                    | ❌         |                         |
| to_regnamespace                    | ❌         |                         |
| to_regoper                         | ❌         |                         |
| to_regoperator                     | ❌         |                         |
| to_regproc                         | ✅         |                         |
| to_regprocedure                    | ❌         |                         |
| to_regrole                         | ❌         |                         |
| to_regtype                         | ✅         |                         |
| to_regtypemod                      | ❌         |                         |

## Object Information and Addressing Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-OBJECT-TABLE).

| Function                      | Supported | Notes and limitations |
|:------------------------------|:----------|:----------------------|
| pg_describe_object            | ❌         |                       |
| pg_identify_object            | ❌         |                       |
| pg_identify_object_as_address | ❌         |                       |
| pg_get_object_address         | ❌         |                       |

## Comment Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-COMMENT-TABLE).

| Function          | Supported | Notes and limitations   |
|:------------------|:----------|:------------------------|
| col_description   | 🟠        | Parses, not implemented |
| obj_description   | 🟠        | Parses, not implemented |
| shobj_description | 🟠        | Parses, not implemented |

## Data Validity Checking Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-VALIDITY-TABLE).

| Function            | Supported | Notes and limitations |
|:--------------------|:----------|:----------------------|
| pg_input_is_valid   | ❌         |                       |
| pg_input_error_info | ❌         |                       |

## Transaction ID and Snapshot Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-PG-SNAPSHOT).

| Function                       | Supported | Notes and limitations |
|:-------------------------------|:----------|:----------------------|
| pg_current_xact_id             | ❌         |                       |
| pg_current_xact_id_if_assigned | ❌         |                       |
| pg_xact_status                 | ❌         |                       |
| pg_current_snapshot            | ❌         |                       |
| pg_snapshot_xip                | ❌         |                       |
| pg_snapshot_xmax               | ❌         |                       |
| pg_snapshot_xmin               | ❌         |                       |
| pg_visible_in_snapshot         | ❌         |                       |

## Committed Transaction Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-COMMIT-TIMESTAMP).

| Function                        | Supported | Notes and limitations |
|:--------------------------------|:----------|:----------------------|
| pg_xact_commit_timestamp        | ❌         |                       |
| pg_xact_commit_timestamp_origin | ❌         |                       |
| pg_last_committed_xact          | ❌         |                       |

## Control Data Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-CONTROLDATA).

| Function               | Supported | Notes and limitations |
|:-----------------------|:----------|:----------------------|
| pg_control_checkpoint  | ❌         |                       |
| pg_control_system      | ❌         |                       |
| pg_control_init        | ❌         |                       |
| pg_control_recovery    | ❌         |                       |

## Version Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-VERSION).

| Function            | Supported  | Notes and limitations                |
|:--------------------|:-----------|:-------------------------------------|
| version             | 🟠         | Includes version but not system info |
| unicode_version     | ❌          |                                      |
| icu_unicode_version | ❌          |                                      |

## WAL Summarization Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-WAL-SUMMARY).

| Function                    | Supported | Notes and limitations |
|:----------------------------|:----------|:----------------------|
| pg_available_wal_summaries  | ❌         |                       |
| pg_wal_summary_contents     | ❌         |                       |
| pg_get_wal_summarizer_state | ❌         |                       |

## Configuration Settings Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-SET-TABLE).

| Function         | Supported | Notes and limitations                                           |
|:-----------------|:----------|:----------------------------------------------------------------|
| current_setting  | ✅         |                                                                 |
| set_config       | 🟠        | setting config for the current transaction is not supported yet |

## Server Signaling Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL-TABLE).

| Function                       | Supported | Notes and limitations |
|:-------------------------------|:----------|:----------------------|
| pg_cancel_backend              | ❌         |                       |
| pg_log_backend_memory_contexts | ❌         |                       |
| pg_reload_conf                 | ❌         |                       |
| pg_rotate_logfile              | ❌         |                       |
| pg_terminate_backend           | ❌         |                       |

## Backup Control Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-BACKUP-TABLE).

| Function                  | Supported | Notes and limitations |
|:--------------------------|:----------|:----------------------|
| pg_create_restore_point   | ❌         |                       |
| pg_current_wal_flush_lsn  | ❌         |                       |
| pg_current_wal_insert_lsn | ❌         |                       |
| pg_current_wal_lsn        | ❌         |                       |
| pg_backup_start           | ❌         |                       |
| pg_backup_stop            | ❌         |                       |
| pg_switch_wal             | ❌         |                       |
| pg_walfile_name           | ❌         |                       |
| pg_walfile_name_offset    | ❌         |                       |
| pg_split_walfile_name     | ❌         |                       |
| pg_wal_lsn_diff           | ❌         |                       |

## Recovery Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-RECOVERY-INFO-TABLE).

| Function                      | Supported | Notes and limitations    |
|:------------------------------|:----------|:-------------------------|
| pg_is_in_recovery             | 🟠        | Parses, not implemented  |
| pg_last_wal_receive_lsn       | ❌         |                          |
| pg_last_wal_replay_lsn        | ❌         |                          |
| pg_last_xact_replay_timestamp | ❌         |                          |
| pg_get_wal_resource_managers  | ❌         |                          |

## Recovery Control Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-RECOVERY-CONTROL-TABLE).

| Function                      | Supported | Notes and limitations |
|:------------------------------|:----------|:----------------------|
| pg_is_wal_replay_paused       | ❌         |                       |
| pg_get_wal_replay_pause_state | ❌         |                       |
| pg_promote                    | ❌         |                       |
| pg_wal_replay_pause           | ❌         |                       |
| pg_wal_replay_resume          | ❌         |                       |

## Snapshot Synchronization Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION-TABLE).

| Function                | Supported | Notes and limitations |
|:------------------------|:----------|:----------------------|
| pg_export_snapshot      | ❌         |                       |
| pg_log_standby_snapshot | ❌         |                       |

## Replication Management Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-REPLICATION-TABLE).

| Function                               | Supported | Notes and limitations |
|:---------------------------------------|:----------|:----------------------|
| pg_create_physical_replication_slot    | ❌         |                       |
| pg_drop_replication_slot               | ❌         |                       |
| pg_create_logical_replication_slot     | ❌         |                       |
| pg_copy_physical_replication_slot      | ❌         |                       |
| pg_copy_logical_replication_slot       | ❌         |                       |
| pg_logical_slot_get_changes            | ❌         |                       |
| pg_logical_slot_peek_changes           | ❌         |                       |
| pg_logical_slot_get_binary_changes     | ❌         |                       |
| pg_logical_slot_peek_binary_changes    | ❌         |                       |
| pg_replication_slot_advance            | ❌         |                       |
| pg_replication_origin_create           | ❌         |                       |
| pg_replication_origin_drop             | ❌         |                       |
| pg_replication_origin_oid              | ❌         |                       |
| pg_replication_origin_session_setup    | ❌         |                       |
| pg_replication_origin_session_reset    | ❌         |                       |
| pg_replication_origin_session_is_setup | ❌         |                       |
| pg_replication_origin_session_progress | ❌         |                       |
| pg_replication_origin_xact_setup       | ❌         |                       |
| pg_replication_origin_xact_reset       | ❌         |                       |
| pg_replication_origin_advance          | ❌         |                       |
| pg_replication_origin_progress         | ❌         |                       |
| pg_logical_emit_message                | ❌         |                       |
| pg_sync_replication_slots              | ❌         |                       |

## Database Object Size Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-DBSIZE).

| Function                 | Supported | Notes and limitations   |
|:-------------------------|:----------|:------------------------|
| pg_column_size           | ❌         |                         |
| pg_column_compression    | ❌         |                         |
| pg_column_toast_chunk_id | ❌         |                         |
| pg_database_size         | ❌         |                         |
| pg_indexes_size          | 🟠        | Parses, not implemented |
| pg_relation_size         | 🟠        | Parses, not implemented |
| pg_size_bytes            | ❌         |                         |
| pg_size_pretty           | ❌         |                         |
| pg_table_size            | 🟠        | Parses, not implemented |
| pg_tablespace_size       | ❌         |                         |
| pg_total_relation_size   | 🟠        | Parses, not implemented |

## Database Object Location Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-DBLOCATION).

| Function             | Supported | Notes and limitations |
|:---------------------|:----------|:----------------------|
| pg_relation_filenode | ❌         |                       |
| pg_relation_filepath | ❌         |                       |
| pg_filenode_relation | ❌         |                       |

## Collation Management Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-COLLATION).

| Function                             | Supported | Notes and limitations |
|:-------------------------------------|:----------|:----------------------|
| pg_collation_actual_version          | ❌         |                       |
| pg_database_collation_actual_version | ❌         |                       |
| pg_import_system_collations          | ❌         |                       |

## Partitioning Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-INFO-PARTITION).

| Function               | Supported | Notes and limitations |
|:-----------------------|:----------|:----------------------|
| pg_partition_tree      | ❌         |                       |
| pg_partition_ancestors | ❌         |                       |
| pg_partition_root      | ❌         |                       |

## Index Maintenance Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-INDEX-TABLE).

| Function                   | Supported | Notes and limitations |
|:---------------------------|:----------|:----------------------|
| brin_summarize_new_values  | ❌         |                       |
| brin_summarize_range       | ❌         |                       |
| brin_desummarize_range     | ❌         |                       |
| gin_clean_pending_list     | ❌         |                       |

## Generic File Access Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-GENFILE-TABLE).

| Function                | Supported | Notes and limitations |
|:------------------------|:----------|:----------------------|
| pg_ls_dir               | ❌         |                       |
| pg_ls_logdir            | ❌         |                       |
| pg_ls_waldir            | ❌         |                       |
| pg_ls_logicalmapdir     | ❌         |                       |
| pg_ls_logicalsnapdir    | ❌         |                       |
| pg_ls_replslotdir       | ❌         |                       |
| pg_ls_archive_statusdir | ❌         |                       |
| pg_ls_tmpdir            | ❌         |                       |
| pg_read_file            | ❌         |                       |
| pg_read_binary_file     | ❌         |                       |
| pg_stat_file            | ❌         |                       |

## Advisory Lock Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADVISORY-LOCKS-TABLE).

| Function                         | Supported | Notes and limitations |
|:---------------------------------|:----------|:----------------------|
| pg_advisory_lock                 | ❌         |                       |
| pg_advisory_lock_shared          | ❌         |                       |
| pg_advisory_unlock               | ❌         |                       |
| pg_advisory_unlock_all           | ❌         |                       |
| pg_advisory_unlock_shared        | ❌         |                       |
| pg_advisory_xact_lock            | ❌         |                       |
| pg_advisory_xact_lock_shared     | ❌         |                       |
| pg_try_advisory_lock             | ❌         |                       |
| pg_try_advisory_lock_shared      | ❌         |                       |
| pg_try_advisory_xact_lock        | ❌         |                       |
| pg_try_advisory_xact_lock_shared | ❌         |                       |

## Built-In Trigger Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-trigger.html#BUILTIN-TRIGGERS-TABLE).

| Function                            | Supported | Notes and limitations |
|:------------------------------------|:----------|:----------------------|
| suppress_redundant_updates_trigger  | ❌         |                       |
| tsvector_update_trigger             | ❌         |                       |
| tsvector_update_trigger_column      | ❌         |                       |

## Event Trigger Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-event-triggers.html#FUNCTIONS-EVENT-TRIGGERS).

| Function                              | Supported | Notes and limitations |
|:--------------------------------------|:----------|:----------------------|
| pg_event_trigger_ddl_commands         | ❌         |                       |
| pg_event_trigger_dropped_objects      | ❌         |                       |
| pg_event_trigger_table_rewrite_oid    | ❌         |                       |
| pg_event_trigger_table_rewrite_reason | ❌         |                       |

## Statistics Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-statistics.html#FUNCTIONS-STATISTICS).

| Function          | Supported | Notes and limitations |
|:------------------|:----------|:----------------------|
| pg_mcv_list_items | ❌         |                       |

## Statistics Access Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/9.1/monitoring-stats.html#MONITORING-STATS-FUNCS-TABLE).

| Function                                     | Supported | Notes and limitations   |
|:---------------------------------------------|:----------|:------------------------|
| pg_stat_get_db_numbackends                   | ❌         |                         |
| pg_stat_get_db_xact_commit                   | ❌         |                         |
| pg_stat_get_db_xact_rollback                 | ❌         |                         |
| pg_stat_get_db_blocks_fetched                | ❌         |                         |
| pg_stat_get_db_blocks_hit                    | ❌         |                         |
| pg_stat_get_db_tuples_returned               | ❌         |                         |
| pg_stat_get_db_tuples_fetched                | ❌         |                         |
| pg_stat_get_db_tuples_inserted               | ❌         |                         |
| pg_stat_get_db_tuples_updated                | ❌         |                         |
| pg_stat_get_db_tuples_deleted                | ❌         |                         |
| pg_stat_get_db_conflict_tablespace           | ❌         |                         |
| pg_stat_get_db_conflict_lock                 | ❌         |                         |
| pg_stat_get_db_conflict_snapshot             | ❌         |                         |
| pg_stat_get_db_conflict_bufferpin            | ❌         |                         |
| pg_stat_get_db_conflict_startup_deadlock     | ❌         |                         |
| pg_stat_get_db_stat_reset_time               | ❌         |                         |
| pg_stat_get_numscans                         | 🟠        | Parses, not implemented |
| pg_stat_get_tuples_returned                  | ❌         |                         |
| pg_stat_get_tuples_fetched                   | ❌         |                         |
| pg_stat_get_tuples_inserted                  | ❌         |                         |
| pg_stat_get_tuples_updated                   | ❌         |                         |
| pg_stat_get_tuples_deleted                   | ❌         |                         |
| pg_stat_get_tuples_hot_updated               | ❌         |                         |
| pg_stat_get_live_tuples                      | ❌         |                         |
| pg_stat_get_dead_tuples                      | ❌         |                         |
| pg_stat_get_blocks_fetched                   | ❌         |                         |
| pg_stat_get_blocks_hit                       | ❌         |                         |
| pg_stat_get_last_vacuum_time                 | ❌         |                         |
| pg_stat_get_last_autovacuum_time             | ❌         |                         |
| pg_stat_get_last_analyze_time                | ❌         |                         |
| pg_stat_get_last_autoanalyze_time            | ❌         |                         |
| pg_stat_get_vacuum_count                     | ❌         |                         |
| pg_stat_get_autovacuum_count                 | ❌         |                         |
| pg_stat_get_analyze_count                    | ❌         |                         |
| pg_stat_get_autoanalyze_count                | ❌         |                         |
| pg_stat_get_xact_numscans                    | ❌         |                         |
| pg_stat_get_xact_tuples_returned             | ❌         |                         |
| pg_stat_get_xact_tuples_fetched              | ❌         |                         |
| pg_stat_get_xact_tuples_inserted             | ❌         |                         |
| pg_stat_get_xact_tuples_updated              | ❌         |                         |
| pg_stat_get_xact_tuples_deleted              | ❌         |                         |
| pg_stat_get_xact_tuples_hot_updated          | ❌         |                         |
| pg_stat_get_xact_blocks_fetched              | ❌         |                         |
| pg_stat_get_xact_blocks_hit                  | ❌         |                         |
| pg_backend_pid                               | ❌         |                         |
| pg_stat_get_activity                         | ❌         |                         |
| pg_stat_get_function_calls                   | ❌         |                         |
| pg_stat_get_function_time                    | ❌         |                         |
| pg_stat_get_function_self_time               | ❌         |                         |
| pg_stat_get_xact_function_calls              | ❌         |                         |
| pg_stat_get_xact_function_time               | ❌         |                         |
| pg_stat_get_xact_function_self_time          | ❌         |                         |
| pg_stat_get_backend_idset                    | ❌         |                         |
| pg_stat_get_backend_pid                      | ❌         |                         |
| pg_stat_get_backend_dbid                     | ❌         |                         |
| pg_stat_get_backend_userid                   | ❌         |                         |
| pg_stat_get_backend_activity                 | ❌         |                         |
| pg_stat_get_backend_waiting                  | ❌         |                         |
| pg_stat_get_backend_activity_start           | ❌         |                         |
| pg_stat_get_backend_xact_start               | ❌         |                         |
| pg_stat_get_backend_start                    | ❌         |                         |
| pg_stat_get_backend_client_addr              | ❌         |                         |
| pg_stat_get_backend_client_port              | ❌         |                         |
| pg_stat_get_bgwriter_timed_checkpoints       | ❌         |                         |
| pg_stat_get_bgwriter_requested_checkpoints   | ❌         |                         |
| pg_stat_get_bgwriter_buf_written_checkpoints | ❌         |                         |
| pg_stat_get_bgwriter_buf_written_clean       | ❌         |                         |
| pg_stat_get_bgwriter_maxwritten_clean        | ❌         |                         |
| pg_stat_get_bgwriter_stat_reset_time         | ❌         |                         |
| pg_stat_get_buf_written_backend              | ❌         |                         |
| pg_stat_get_buf_alloc                        | ❌         |                         |
| pg_stat_get_wal_senders                      | ❌         |                         |
| pg_stat_clear_snapshot                       | ❌         |                         |
| pg_stat_reset                                | ❌         |                         |
| pg_stat_reset_shared                         | ❌         |                         |
| pg_stat_reset_single_table_counters          | ❌         |                         |
| pg_stat_reset_single_function_counters       | ❌         |                         |
