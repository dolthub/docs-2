---
title: Supported Types
---

## Standard Types

Most of the standard types with partial support are missing some functionality regarding their parameters.
Length and precision parameters are enforced for many types (for example `char` and `varchar` lengths),
but some parameters (such as `timestamp` precision) may not be fully enforced yet.

| SQL Type Name  | Supported   | Aliases                       |
| :------------- | :---------: | :---------------------------- |
| bit            |     ✅      |                               |
| bit[]          |     ✅      |                               |
| boolean        |     ✅      |                               |
| boolean[]      |     ✅      |                               |
| box            |     ❌      |                               |
| box[]          |     ❌      |                               |
| bytea          |     ✅      |                               |
| bytea[]        |     ✅      |                               |
| "char"         |     ✅      |                               |
| char           |     ✅      | character                     |
| char[]         |     ✅      | character[]                   |
| cidr           |     ❌      |                               |
| cidr[]         |     ❌      |                               |
| circle         |     ❌      |                               |
| circle[]       |     ❌      |                               |
| date           |     ✅      |                               |
| date[]         |     ✅      |                               |
| datemultirange |     ❌      |                               |
| daterange      |     ❌      |                               |
| float4         |     ✅      | real                          |
| float4[]       |     ✅      | real[]                        |
| float8         |     ✅      | double precision              |
| float8[]       |     ✅      | double precision[]            |
| inet           |     ❌      |                               |
| inet[]         |     ❌      |                               |
| int2           |     ✅      | smallint                      |
| int2vector     |     ✅      |                               |
| int2[]         |     ✅      | smallint[]                    |
| int4           |     ✅      | int, integer                  |
| int4[]         |     ✅      | int[], integer[]              |
| int4multirange |     ❌      |                               |
| int4range      |     ❌      |                               |
| int8           |     ✅      | bigint                        |
| int8[]         |     ✅      | bigint[]                      |
| int8multirange |     ❌      |                               |
| int8range      |     ❌      |                               |
| interval       |     ✅      |                               |
| interval[]     |     ✅      |                               |
| json           |     ✅      |                               |
| json[]         |     ✅      |                               |
| jsonb          |     ✅      |                               |
| jsonb[]        |     ✅      |                               |
| line           |     ❌      |                               |
| line[]         |     ❌      |                               |
| lseg           |     ❌      |                               |
| lseg[]         |     ❌      |                               |
| macaddr        |     ❌      |                               |
| macaddr8       |     ❌      |                               |
| macaddr8[]     |     ❌      |                               |
| macaddr[]      |     ❌      |                               |
| money          |     ❌      |                               |
| money[]        |     ❌      |                               |
| name           |     ✅      |                               |
| numeric        |     ✅      | decimal                       |
| numeric[]      |     ✅      | decimal[]                     |
| nummultirange  |     ❌      |                               |
| numrange       |     ❌      |                               |
| path           |     ❌      |                               |
| path[]         |     ❌      |                               |
| point          |     ❌      |                               |
| point[]        |     ❌      |                               |
| polygon        |     ❌      |                               |
| polygon[]      |     ❌      |                               |
| serial2        |     ✅      | smallserial                   |
| serial4        |     ✅      | serial                        |
| serial8        |     ✅      | bigserial                     |
| text           |     ✅      |                               |
| text[]         |     ✅      |                               |
| time           |     ✅      | time without time zone        |
| time[]         |     ✅      | time without time zone[]      |
| timestamp      |     ✅      | timestamp without time zone   |
| timestamp[]    |     ✅      | timestamp without time zone[] |
| timestamptz    |     ✅      | timestamp with time zone      |
| timestamptz[]  |     ✅      | timestamp with time zone[]    |
| timetz         |     ✅      | time with time zone           |
| timetz[]       |     ✅      | time with time zone[]         |
| tsmultirange   |     ❌      |                               |
| tsquery        |     ❌      |                               |
| tsquery[]      |     ❌      |                               |
| tsrange        |     ❌      |                               |
| tstzmultirange |     ❌      |                               |
| tstzrange      |     ❌      |                               |
| tsvector       |     ❌      |                               |
| tsvector[]     |     ❌      |                               |
| uuid           |     ✅      |                               |
| uuid[]         |     ✅      |                               |
| varbit         |     ✅      | bit varying                   |
| varbit[]       |     ✅      | bit varying[]                 |
| varchar        |     ✅      | character varying             |
| varchar[]      |     ✅      | character varying[]           |
| xml            |     ❌      |                               |
| xml[]          |     ❌      |                               |

## Pseudo-Types

| SQL Type Name           | Supported | Notes and limitations |
| :---------------------- | :-------: | :-------------------- |
| any                     |    ✅     |                       |
| anyarray                |    ✅     |                       |
| anycompatible           |    ❌     |                       |
| anycompatiblearray      |    ❌     |                       |
| anycompatiblemultirange |    ❌     |                       |
| anycompatiblenonarray   |    ❌     |                       |
| anycompatiblerange      |    ❌     |                       |
| anyelement              |    ✅     |                       |
| anyenum                 |    ✅     |                       |
| anymultirange           |    ❌     |                       |
| anynonarray             |    ✅     |                       |
| anyrange                |    ❌     |                       |
| cstring                 |    ✅     |                       |
| event_trigger           |    ❌     |                       |
| fdw_handler             |    ❌     |                       |
| index_am_handler        |    ❌     |                       |
| internal                |    ✅     |                       |
| language_handler        |    ❌     |                       |
| pg_ddl_command          |    ❌     |                       |
| record                  |    ✅     |                       |
| table_am_handler        |    ❌     |                       |
| trigger                 |    ✅     |                       |
| tsm_handler             |    ❌     |                       |
| unknown                 |    ✅     | Used internally for values whose type cannot be determined; not intended for direct use |
| void                    |    ✅     |                       |

## OID Alias Types

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/datatype-oid.html).

| SQL Type Name | Supported | Notes and limitations |
| :------------ | :-------: | :-------------------- |
| oid           | ✅        |                       |
| oidvector     | ✅        |                       |
| cid           | ✅        |                       |
| tid           | ✅        |                       |
| xid           | ✅        | The type works, but Doltgres does not expose real transaction IDs; the xmin/xmax system columns always return 0 |
| regclass      | ✅        |                       |
| regcollation  | ❌        |                       |
| regconfig     | ❌        |                       |
| regdictionary | ❌        |                       |
| regnamespace  | ❌        |                       |
| regoper       | ❌        |                       |
| regoperator   | ❌        |                       |
| regproc       | ✅        |                       |
| regprocedure  | ❌        |                       |
| regrole       | ❌        |                       |
| regtype       | ✅        |                       |
