---
title: Supported SQL Commands
---

# Basic SQL

## Data Description (DDL)

| SQL Commands    | Parses | Works | Notes and limitations                    |
|:----------------|:------:|:-----:|:-----------------------------------------|
| ALTER TABLE     | ✅     | ✅    | Some ALTER TABLE statments not supported |
| CREATE DATABASE | ✅     | ✅    |                                          |
| CREATE TABLE    | ✅     | ✅    |                                          |
| DROP DATABASE   | ✅     | ✅    |                                          |
| DROP TABLE      | ✅     | ✅    |                                          |

## Data Manipulation (DML)

| SQL Commands | Parses | Works | Notes and limitations |
| :----------- | :----: | :---: | :-------------------- |
| CALL         |   ✅   |  ✅   |                       |
| DELETE       |   ✅   |  ✅   | Supports RETURNING    |
| INSERT       |   ✅   |  ✅   | Supports ON CONFLICT DO NOTHING / DO UPDATE and RETURNING |
| SELECT       |   ✅   |  ✅   |                       |
| UPDATE       |   ✅   |  ✅   | Supports RETURNING    |
| VALUES       |   ✅   |  ✅   |                       |

## All SQL

## Access management statements

| SQL Commands             | Parses | Works | Notes and limitations |
| :----------------------- | :----: | :---: | :-------------------- |
| ALTER DEFAULT PRIVILEGES |   ✅   |  ❌   |                       |
| ALTER GROUP              |   🟠   |  🟠   | Treated as ALTER ROLE; ADD/DROP USER forms are not supported |
| ALTER ROLE               |   ✅   |  ✅   |                       |
| ALTER USER               |   ✅   |  ✅   |                       |
| ALTER USER MAPPING       |   ❌   |  ❌   |                       |
| CREATE GROUP             |   ✅   |  ✅   | Alias for CREATE ROLE |
| CREATE ROLE              |   ✅   |  ✅   |                       |
| CREATE USER              |   ✅   |  ✅   |                       |
| CREATE USER MAPPING      |   ❌   |  ❌   |                       |
| DROP GROUP               |   ✅   |  ✅   |                       |
| DROP ROLE                |   ✅   |  ✅   |                       |
| DROP USER                |   ✅   |  ✅   |                       |
| DROP USER MAPPING        |   ❌   |  ❌   |                       |
| GRANT                    |   ✅   |  🟠   | Supported for tables, schemas, databases, sequences, routines, and role grants; cross-database grants are not supported |
| REASSIGN OWNED           |   ❌   |  ❌   |                       |
| REVOKE                   |   ✅   |  🟠   | Same forms as GRANT   |

## Data definition statements

| SQL Commands                     | Parses | Works | Notes and limitations |
| :------------------------------- | :----: | :---: | :-------------------- |
| ALTER AGGREGATE                  |   ✅   |  ❌   |                       |
| ALTER COLLATION                  |   ✅   |  ❌   |                       |
| ALTER CONVERSION                 |   ✅   |  ❌   |                       |
| ALTER DATABASE                   |   ✅   |  ❌   |                       |
| ALTER DOMAIN                     |   ✅   |  ❌   |                       |
| ALTER EVENT TRIGGER              |   ❌   |  ❌   |                       |
| ALTER EXTENSION                  |   ❌   |  ❌   |                       |
| ALTER FOREIGN DATA WRAPPER       |   ❌   |  ❌   |                       |
| ALTER FOREIGN TABLE              |   ❌   |  ❌   |                       |
| ALTER FUNCTION                   |   ✅   |  ❌   |                       |
| ALTER INDEX                      |   ✅   |  ❌   |                       |
| ALTER LANGUAGE                   |   ❌   |  ❌   |                       |
| ALTER LARGE OBJECT               |   ❌   |  ❌   |                       |
| ALTER MATERIALIZED VIEW          |   ✅   |  ❌   |                       |
| ALTER OPERATOR                   |   ❌   |  ❌   |                       |
| ALTER OPERATOR CLASS             |   ❌   |  ❌   |                       |
| ALTER OPERATOR FAMILY            |   ❌   |  ❌   |                       |
| ALTER POLICY                     |   ❌   |  ❌   |                       |
| ALTER PROCEDURE                  |   ✅   |  ❌   |                       |
| ALTER PUBLICATION                |   ❌   |  ❌   |                       |
| ALTER ROUTINE                    |   ❌   |  ❌   |                       |
| ALTER RULE                       |   ❌   |  ❌   |                       |
| ALTER SCHEMA                     |   ✅   |  ❌   |                       |
| ALTER SEQUENCE                   |   ✅   |  🟠   | Only OWNED BY is supported |
| ALTER SERVER                     |   ❌   |  ❌   |                       |
| ALTER STATISTICS                 |   ❌   |  ❌   |                       |
| ALTER SUBSCRIPTION               |   ❌   |  ❌   |                       |
| ALTER SYSTEM                     |   ❌   |  ❌   |                       |
| ALTER TABLE                      |   ✅   |  ✅   |                       |
| ALTER TABLESPACE                 |   ❌   |  ❌   |                       |
| ALTER TEXT SEARCH CONFIGURATION  |   ❌   |  ❌   |                       |
| ALTER TEXT SEARCH DICTIONARY     |   ❌   |  ❌   |                       |
| ALTER TEXT SEARCH PARSER         |   ❌   |  ❌   |                       |
| ALTER TEXT SEARCH TEMPLATE       |   ❌   |  ❌   |                       |
| ALTER TRIGGER                    |   ✅   |  ❌   |                       |
| ALTER TYPE                       |   ✅   |  ❌   |                       |
| ALTER VIEW                       |   ✅   |  ❌   |                       |
| COMMENT                          |   ✅   |  🟠   | Silently ignored (no-op) |
| CREATE ACCESS METHOD             |   ❌   |  ❌   |                       |
| CREATE AGGREGATE                 |   ✅   |  ❌   |                       |
| CREATE CAST                      |   ✅   |  ✅   |                       |
| CREATE COLLATION                 |   ❌   |  ❌   |                       |
| CREATE CONVERSION                |   ❌   |  ❌   |                       |
| CREATE DATABASE                  |   ✅   |  ✅   |                       |
| CREATE DOMAIN                    |   ✅   |  🟠   | COLLATE is not supported |
| CREATE EVENT TRIGGER             |   ❌   |  ❌   |                       |
| CREATE EXTENSION                 |   ✅   |  🟠   | Non-public SCHEMA, VERSION, and CASCADE are not supported |
| CREATE FOREIGN DATA WRAPPER      |   ❌   |  ❌   |                       |
| CREATE FOREIGN TABLE             |   ❌   |  ❌   |                       |
| CREATE FUNCTION                  |   ✅   |  ✅   | Supports PL/pgSQL, SQL, and C functions |
| CREATE INDEX                     |   ✅   |  🟠   | btree only; CONCURRENTLY is not supported |
| CREATE LANGUAGE                  |   ❌   |  ❌   |                       |
| CREATE MATERIALIZED VIEW         |   ✅   |  ❌   |                       |
| CREATE OPERATOR                  |   ❌   |  ❌   |                       |
| CREATE OPERATOR CLASS            |   ❌   |  ❌   |                       |
| CREATE OPERATOR FAMILY           |   ❌   |  ❌   |                       |
| CREATE POLICY                    |   ❌   |  ❌   |                       |
| CREATE PROCEDURE                 |   ✅   |  ✅   | Supports PL/pgSQL, SQL, and C procedures |
| CREATE PUBLICATION               |   ❌   |  ❌   |                       |
| CREATE RULE                      |   ❌   |  ❌   |                       |
| CREATE SCHEMA                    |   ✅   |  ✅   |                       |
| CREATE SEQUENCE                  |   ✅   |  ✅   |                       |
| CREATE SERVER                    |   ❌   |  ❌   |                       |
| CREATE STATISTICS                |   ❌   |  ❌   |                       |
| CREATE SUBSCRIPTION              |   ❌   |  ❌   |                       |
| CREATE TABLE                     |   ✅   |  🟠   |                       |
| CREATE TABLE ... PARTITION       |   ✅   |  ❌   | PARTITIONs are parsed, but ignored|
| CREATE TABLESPACE                |   ❌   |  ❌   |                       |
| CREATE TEXT SEARCH CONFIGURATION |   ❌   |  ❌   |                       |
| CREATE TEXT SEARCH DICTIONARY    |   ❌   |  ❌   |                       |
| CREATE TEXT SEARCH PARSER        |   ❌   |  ❌   |                       |
| CREATE TEXT SEARCH TEMPLATE      |   ❌   |  ❌   |                       |
| CREATE TRANSFORM                 |   ❌   |  ❌   |                       |
| CREATE TRIGGER                   |   ✅   |  🟠   | Row-level BEFORE/AFTER INSERT/UPDATE/DELETE only; CONSTRAINT, INSTEAD OF, FOR EACH STATEMENT, UPDATE OF, REFERENCING, and TRUNCATE triggers are not supported |
| CREATE TYPE                      |   ✅   |  🟠   | Composite, enum, and shell types; RANGE and base types are not supported |
| CREATE VIEW                      |   ✅   |  🟠   |                       |
| DROP ACCESS METHOD               |   ❌   |  ❌   |                       |
| DROP AGGREGATE                   |   ✅   |  ❌   |                       |
| DROP CAST                        |   ✅   |  ✅   |                       |
| DROP COLLATION                   |   ❌   |  ❌   |                       |
| DROP CONVERSION                  |   ❌   |  ❌   |                       |
| DROP DATABASE                    |   ✅   |  🟠   |                       |
| DROP DOMAIN                      |   ✅   |  ✅   |                       |
| DROP EVENT TRIGGER               |   ❌   |  ❌   |                       |
| DROP EXTENSION                   |   ✅   |  ✅   |                       |
| DROP FOREIGN DATA WRAPPER        |   ❌   |  ❌   |                       |
| DROP FOREIGN TABLE               |   ❌   |  ❌   |                       |
| DROP FUNCTION                    |   ✅   |  ✅   |                       |
| DROP INDEX                       |   ✅   |  🟠   |                       |
| DROP LANGUAGE                    |   ❌   |  ❌   |                       |
| DROP MATERIALIZED VIEW           |   ✅   |  ❌   | Executes as DROP VIEW; CREATE MATERIALIZED VIEW is not supported |
| DROP OPERATOR                    |   ❌   |  ❌   |                       |
| DROP OPERATOR CLASS              |   ❌   |  ❌   |                       |
| DROP OPERATOR FAMILY             |   ❌   |  ❌   |                       |
| DROP OWNED                       |   ❌   |  ❌   |                       |
| DROP POLICY                      |   ❌   |  ❌   |                       |
| DROP PROCEDURE                   |   ✅   |  ✅   |                       |
| DROP PUBLICATION                 |   ❌   |  ❌   |                       |
| DROP ROUTINE                     |   ❌   |  ❌   |                       |
| DROP RULE                        |   ❌   |  ❌   |                       |
| DROP SCHEMA                      |   ✅   |  🟠   | CASCADE is not supported |
| DROP SEQUENCE                    |   ✅   |  ✅   |                       |
| DROP SERVER                      |   ❌   |  ❌   |                       |
| DROP STATISTICS                  |   ❌   |  ❌   |                       |
| DROP SUBSCRIPTION                |   ❌   |  ❌   |                       |
| DROP TABLE                       |   ✅   |  🟠   |                       |
| DROP TABLESPACE                  |   ❌   |  ❌   |                       |
| DROP TEXT SEARCH CONFIGURATION   |   ❌   |  ❌   |                       |
| DROP TEXT SEARCH DICTIONARY      |   ❌   |  ❌   |                       |
| DROP TEXT SEARCH PARSER          |   ❌   |  ❌   |                       |
| DROP TEXT SEARCH TEMPLATE        |   ❌   |  ❌   |                       |
| DROP TRANSFORM                   |   ❌   |  ❌   |                       |
| DROP TRIGGER                     |   ✅   |  🟠   |                       |
| DROP TYPE                        |   ✅   |  ✅   |                       |
| DROP VIEW                        |   ✅   |  🟠   |                       |
| SECURITY LABEL                   |   ❌   |  ❌   |                       |

## Data manipulation statements

| SQL Commands              | Parses | Works | Notes and limitations |
| :------------------------ | :----: | :---: | :-------------------- |
| CALL                      |   ✅   |  ✅   |                       |
| CLOSE                     |   ❌   |  ❌   |                       |
| CREATE TABLE AS           |   ✅   |  🟠   | WITH NO DATA is not supported |
| CLUSTER                   |   ❌   |  ❌   |                       |
| COPY                      |   🟠   |  🟠   | COPY FROM STDIN and COPY FROM file work for text and CSV formats; BINARY and COPY TO are not supported |
| DECLARE                   |   ❌   |  ❌   |                       |
| DELETE                    |   ✅   |  ✅   | Supports RETURNING    |
| DO                        |   ❌   |  ❌   |                       |
| FETCH                     |   ❌   |  ❌   |                       |
| IMPORT FOREIGN SCHEMA     |   ❌   |  ❌   |                       |
| INSERT                    |   ✅   |  ✅   | Supports ON CONFLICT DO NOTHING / DO UPDATE and RETURNING |
| LOAD                      |   ❌   |  ❌   |                       |
| MERGE                     |   ❌   |  ❌   |                       |
| MOVE                      |   ❌   |  ❌   |                       |
| REFRESH MATERIALIZED VIEW |   ✅   |  ❌   |                       |
| REINDEX                   |   ❌   |  ❌   |                       |
| SELECT                    |   🟠   |  🟠   |                       |
| SELECT INTO               |   ❌   |  ❌   |                       |
| TRUNCATE                  |   🟠   |  🟠   |                       |
| UPDATE                    |   ✅   |  ✅   | Supports RETURNING    |
| VACUUM                    |   ✅   |  🟠   | Accepted as a no-op   |
| VALUES                    |   ✅   |  ✅   |                       |

## Prepared statements

| SQL Commands | Parses | Works | Notes and limitations |
| :----------- | :----: | :---: | :-------------------- |
| DEALLOCATE   |   ✅   |  ✅   |                       |
| PREPARE      |   ✅   |  ❌   | SQL-level PREPARE is not supported; prepared statements via the wire protocol work |
| EXECUTE      |   ✅   |  ❌   | SQL-level EXECUTE is not supported; prepared statements via the wire protocol work |

## Session management statements

| SQL Commands              | Parses | Works | Notes and limitations |
| :------------------------ | :----: | :---: | :-------------------- |
| DISCARD                   |   ✅   |  🟠   | Only DISCARD ALL is supported |
| RESET                     |   ✅   |  ❌   |                       |
| SET                       |   ✅   |  🟠   | SET LOCAL is not supported |
| SET CONSTRAINTS           |   ✅   |  ❌   |                       |
| SET ROLE                  |   ✅   |  ❌   |                       |
| SET SESSION AUTHORIZATION |   ✅   |  ❌   |                       |
| SET TRANSACTION           |   🟠   |  ❌   |                       |
| SHOW                      |   ✅   |  🟠   | SHOW ALL is not supported |

## Transactional statements

| SQL Commands          | Parses | Works | Notes and limitations |
| :-------------------- | :----: | :---: | :-------------------- |
| ABORT                 |   ✅   |  ✅   |                       |
| BEGIN                 |   🟠   |  🟠   |                       |
| CHECKPOINT            |   ❌   |  ❌   |                       |
| COMMIT                |   ✅   |  ✅   |                       |
| COMMIT PREPARED       |   ❌   |  ❌   |                       |
| END                   |   ✅   |  ✅   |                       |
| LISTEN                |   ❌   |  ❌   |                       |
| LOCK                  |   ❌   |  ❌   |                       |
| NOTIFY                |   ❌   |  ❌   |                       |
| PREPARE TRANSACTION   |   ❌   |  ❌   |                       |
| RELEASE SAVEPOINT     |   ✅   |  ✅   |                       |
| ROLLBACK              |   ✅   |  ✅   |                       |
| ROLLBACK PREPARED     |   ❌   |  ❌   |                       |
| ROLLBACK TO SAVEPOINT |   ✅   |  ✅   |                       |
| SAVEPOINT             |   ✅   |  ✅   |                       |
| START TRANSACTION     |   🟠   |  🟠   |                       |
| UNLISTEN              |   ❌   |  ❌   |                       |

## Utility statements

| SQL Commands | Parses | Works | Notes and limitations |
| :----------- | :----: | :---: | :-------------------- |
| ANALYZE      |   ✅   |  ✅   |                       |
| EXPLAIN      |   ✅   |  🟠   | EXPLAIN SELECT is supported; other statements are not |
