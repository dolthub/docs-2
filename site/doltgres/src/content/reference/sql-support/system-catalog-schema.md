---
title: System Catalog Schema
---

The [Postgres `pg_catalog` schema](https://www.postgresql.org/docs/15/catalogs.html)
provides access to a variety of database metadata useful for inspecting your database and
also used by database tooling.

Doltgres vends the pg_catalog system catalog tables for compatibility with clients and
libraries. Some tables contain no rows because the schema entities or configuration
settings they model are unsupported or meaningless to the Doltgres server. Such empty
tables are designated with ❌.

All tables and views from Postgres's `pg_catalog` exist with the correct schema. In the
tables below, the "Populated" column indicates how complete each relation's data is:

* ✅ means the relation contains substantially correct information; any limitations are
  described in the notes.
* 🟠 means the relation contains data, but has major gaps or stub values, described in
  the notes.
* ❌ means the relation exists with the correct schema but contains no rows.

If you need support for `pg_catalog` metadata that is available in Postgres, but not yet
available in Doltgres, please
[open a GitHub issue](https://github.com/dolthub/doltgresql/issues) to let us know what
you need.

## Tables

| Table                                                                                                     | Populated | Notes and limitations |
| :-------------------------------------------------------------------------------------------------------- | :-------: | :-------------------- |
| [pg_aggregate](https://www.postgresql.org/docs/current/catalog-pg-aggregate.html)                         |    ❌     |                       |
| [pg_am](https://www.postgresql.org/docs/current/catalog-pg-am.html)                                       |    ✅     | Lists the standard Postgres access methods, though only btree indexes can be created |
| [pg_amop](https://www.postgresql.org/docs/current/catalog-pg-amop.html)                                   |    ❌     |                       |
| [pg_amproc](https://www.postgresql.org/docs/current/catalog-pg-amproc.html)                               |    ❌     |                       |
| [pg_attrdef](https://www.postgresql.org/docs/current/catalog-pg-attrdef.html)                             |    ✅     | Lists column default expressions; the adbin node-tree column is not populated |
| [pg_attribute](https://www.postgresql.org/docs/current/catalog-pg-attribute.html)                         |    ✅     | Lists columns for all relations; ACL and options columns are defaulted |
| [pg_auth_members](https://www.postgresql.org/docs/current/catalog-pg-auth-members.html)                   |    ✅     | Lists role memberships with grantor and admin option |
| [pg_authid](https://www.postgresql.org/docs/current/catalog-pg-authid.html)                               |    ✅     | Lists all roles and their attributes |
| [pg_cast](https://www.postgresql.org/docs/current/catalog-pg-cast.html)                                   |    🟠     | Lists user-created casts only; the built-in casts that ship with Postgres are not included |
| [pg_class](https://www.postgresql.org/docs/current/catalog-pg-class.html)                                 |    ✅     | Lists tables, indexes, views, and sequences; some storage-related columns (relam, relacl, reloptions, etc.) are defaulted |
| [pg_collation](https://www.postgresql.org/docs/current/catalog-pg-collation.html)                         |    ✅     | Built-in collations only; collation values are approximations since Doltgres does not yet apply collations |
| [pg_constraint](https://www.postgresql.org/docs/current/catalog-pg-constraint.html)                       |    ✅     | Primary key, unique, check, and foreign key constraints; exclusion constraints are not supported |
| [pg_conversion](https://www.postgresql.org/docs/current/catalog-pg-conversion.html)                       |    ❌     |                       |
| [pg_database](https://www.postgresql.org/docs/current/catalog-pg-database.html)                           |    ✅     | Lists all databases; collation and ACL columns are defaulted |
| [pg_db_role_setting](https://www.postgresql.org/docs/current/catalog-pg-db-role-setting.html)             |    ❌     |                       |
| [pg_default_acl](https://www.postgresql.org/docs/current/catalog-pg-default-acl.html)                     |    ❌     |                       |
| [pg_depend](https://www.postgresql.org/docs/current/catalog-pg-depend.html)                               |    🟠     | Only sequence-to-column and column-default dependencies are emitted; view, constraint, index, and other dependency kinds are missing |
| [pg_description](https://www.postgresql.org/docs/current/catalog-pg-description.html)                     |    ❌     |                       |
| [pg_enum](https://www.postgresql.org/docs/current/catalog-pg-enum.html)                                   |    ✅     | Lists labels for all user-created enum types |
| [pg_event_trigger](https://www.postgresql.org/docs/current/catalog-pg-event-trigger.html)                 |    ❌     |                       |
| [pg_extension](https://www.postgresql.org/docs/current/catalog-pg-extension.html)                         |    ✅     | Lists installed extensions; the extension owner is not tracked |
| [pg_foreign_data_wrapper](https://www.postgresql.org/docs/current/catalog-pg-foreign-data-wrapper.html)   |    ❌     |                       |
| [pg_foreign_server](https://www.postgresql.org/docs/current/catalog-pg-foreign-server.html)               |    ❌     |                       |
| [pg_foreign_table](https://www.postgresql.org/docs/current/catalog-pg-foreign-table.html)                 |    ❌     |                       |
| [pg_index](https://www.postgresql.org/docs/current/catalog-pg-index.html)                                 |    ✅     | Lists all indexes; expression and predicate node-tree columns are not populated |
| [pg_inherits](https://www.postgresql.org/docs/current/catalog-pg-inherits.html)                           |    ❌     |                       |
| [pg_init_privs](https://www.postgresql.org/docs/current/catalog-pg-init-privs.html)                       |    ❌     |                       |
| [pg_language](https://www.postgresql.org/docs/current/catalog-pg-language.html)                           |    ✅     | Lists the internal, c, sql, and plpgsql languages; owner and handler function references are NULL |
| [pg_largeobject](https://www.postgresql.org/docs/current/catalog-pg-largeobject.html)                     |    ❌     |                       |
| [pg_largeobject_metadata](https://www.postgresql.org/docs/current/catalog-pg-largeobject-metadata.html)   |    ❌     |                       |
| [pg_namespace](https://www.postgresql.org/docs/current/catalog-pg-namespace.html)                         |    ✅     | Lists all schemas; owner and ACL columns are not populated |
| [pg_opclass](https://www.postgresql.org/docs/current/catalog-pg-opclass.html)                             |    ✅     | btree and hash operator classes only; gin, gist, brin, and spgist classes are not included |
| [pg_operator](https://www.postgresql.org/docs/current/catalog-pg-operator.html)                           |    ❌     |                       |
| [pg_opfamily](https://www.postgresql.org/docs/current/catalog-pg-opfamily.html)                           |    ✅     | btree and hash operator families only; gin, gist, brin, and spgist families are not included |
| [pg_parameter_acl](https://www.postgresql.org/docs/current/catalog-pg-parameter-acl.html)                 |    ❌     |                       |
| [pg_partitioned_table](https://www.postgresql.org/docs/current/catalog-pg-partitioned-table.html)         |    ❌     |                       |
| [pg_policy](https://www.postgresql.org/docs/current/catalog-pg-policy.html)                               |    ❌     |                       |
| [pg_proc](https://www.postgresql.org/docs/current/catalog-pg-proc.html)                                   |    🟠     | Lists user-created functions and procedures; the built-in functions that ship with Postgres are not included |
| [pg_publication](https://www.postgresql.org/docs/current/catalog-pg-publication.html)                     |    ❌     |                       |
| [pg_publication_namespace](https://www.postgresql.org/docs/current/catalog-pg-publication-namespace.html) |    ❌     |                       |
| [pg_publication_rel](https://www.postgresql.org/docs/current/catalog-pg-publication-rel.html)             |    ❌     |                       |
| [pg_range](https://www.postgresql.org/docs/current/catalog-pg-range.html)                                 |    ❌     |                       |
| [pg_replication_origin](https://www.postgresql.org/docs/current/catalog-pg-replication-origin.html)       |    ❌     |                       |
| [pg_rewrite](https://www.postgresql.org/docs/current/catalog-pg-rewrite.html)                             |    🟠     | Contains a rule entry per view, but the rule definition (ev_action) is a placeholder |
| [pg_seclabel](https://www.postgresql.org/docs/current/catalog-pg-seclabel.html)                           |    ❌     |                       |
| [pg_sequence](https://www.postgresql.org/docs/current/catalog-pg-sequence.html)                           |    ✅     | Lists all sequences with their full parameters |
| [pg_shdepend](https://www.postgresql.org/docs/current/catalog-pg-shdepend.html)                           |    ❌     |                       |
| [pg_shdescription](https://www.postgresql.org/docs/current/catalog-pg-shdescription.html)                 |    ❌     |                       |
| [pg_shseclabel](https://www.postgresql.org/docs/current/catalog-pg-shseclabel.html)                       |    ❌     |                       |
| [pg_statistic](https://www.postgresql.org/docs/current/catalog-pg-statistic.html)                         |    ❌     |                       |
| [pg_statistic_ext](https://www.postgresql.org/docs/current/catalog-pg-statistic-ext.html)                 |    ❌     |                       |
| [pg_statistic_ext_data](https://www.postgresql.org/docs/current/catalog-pg-statistic-ext-data.html)       |    ❌     |                       |
| [pg_subscription](https://www.postgresql.org/docs/current/catalog-pg-subscription.html)                   |    ❌     |                       |
| [pg_subscription_rel](https://www.postgresql.org/docs/current/catalog-pg-subscription-rel.html)           |    ❌     |                       |
| [pg_tablespace](https://www.postgresql.org/docs/current/catalog-pg-tablespace.html)                       |    ✅     | Contains the standard pg_default and pg_global entries; tablespaces are not otherwise supported |
| [pg_transform](https://www.postgresql.org/docs/current/catalog-pg-transform.html)                         |    ❌     |                       |
| [pg_trigger](https://www.postgresql.org/docs/current/catalog-pg-trigger.html)                             |    ✅     | Lists user-created triggers; constraint linkage, UPDATE OF column lists, and WHEN conditions are not populated |
| [pg_ts_config](https://www.postgresql.org/docs/current/catalog-pg-ts-config.html)                         |    🟠     | Only the built-in simple configuration; language-specific configurations are not included |
| [pg_ts_config_map](https://www.postgresql.org/docs/current/catalog-pg-ts-config-map.html)                 |    ❌     |                       |
| [pg_ts_dict](https://www.postgresql.org/docs/current/catalog-pg-ts-dict.html)                             |    🟠     | Only the built-in simple dictionary; language-specific stemming dictionaries are not included |
| [pg_ts_parser](https://www.postgresql.org/docs/current/catalog-pg-ts-parser.html)                         |    ✅     | Contains the single built-in default parser, matching Postgres |
| [pg_ts_template](https://www.postgresql.org/docs/current/catalog-pg-ts-template.html)                     |    🟠     | Only the simple template; ispell, snowball, and other built-in templates are not included |
| [pg_type](https://www.postgresql.org/docs/current/catalog-pg-type.html)                                   |    ✅     | Lists built-in and user-created types; type default and ACL columns are not populated |
| [pg_user_mapping](https://www.postgresql.org/docs/current/catalog-pg-user-mapping.html)                   |    ❌     |                       |

## Views

| View                                                                                                                                   | Populated | Notes and limitations |
| :------------------------------------------------------------------------------------------------------------------------------------- | :-------: | :-------------------- |
| [pg_available_extension_versions](https://www.postgresql.org/docs/current/view-pg-available-extension-versions.html)                   |    ❌     |                       |
| [pg_available_extensions](https://www.postgresql.org/docs/current/view-pg-available-extensions.html)                                   |    ❌     |                       |
| [pg_backend_memory_contexts](https://www.postgresql.org/docs/current/view-pg-backend-memory-contexts.html)                             |    ❌     |                       |
| [pg_config](https://www.postgresql.org/docs/current/view-pg-config.html)                                                               |    🟠     | Contains the standard rows, but the values are static placeholders for a default Postgres install layout |
| [pg_cursors](https://www.postgresql.org/docs/current/view-pg-cursors.html)                                                             |    ❌     |                       |
| [pg_file_settings](https://www.postgresql.org/docs/current/view-pg-file-settings.html)                                                 |    ❌     |                       |
| [pg_group](https://www.postgresql.org/docs/current/view-pg-group.html)                                                                 |    ✅     | Lists non-login roles and their members |
| [pg_hba_file_rules](https://www.postgresql.org/docs/current/view-pg-hba-file-rules.html)                                               |    ❌     |                       |
| [pg_ident_file_mappings](https://www.postgresql.org/docs/current/view-pg-ident-file-mappings.html)                                     |    ❌     |                       |
| [pg_indexes](https://www.postgresql.org/docs/current/view-pg-indexes.html)                                                             |    ✅     | Lists all indexes with their definitions |
| [pg_locks](https://www.postgresql.org/docs/current/view-pg-locks.html)                                                                 |    ❌     |                       |
| [pg_matviews](https://www.postgresql.org/docs/current/view-pg-matviews.html)                                                           |    ❌     |                       |
| [pg_policies](https://www.postgresql.org/docs/current/view-pg-policies.html)                                                           |    ❌     |                       |
| [pg_prepared_statements](https://www.postgresql.org/docs/current/view-pg-prepared-statements.html)                                     |    ❌     |                       |
| [pg_prepared_xacts](https://www.postgresql.org/docs/current/view-pg-prepared-xacts.html)                                               |    ❌     |                       |
| [pg_publication_tables](https://www.postgresql.org/docs/current/view-pg-publication-tables.html)                                       |    ❌     |                       |
| [pg_replication_origin_status](https://www.postgresql.org/docs/current/view-pg-replication-origin-status.html)                         |    ❌     |                       |
| [pg_replication_slots](https://www.postgresql.org/docs/current/view-pg-replication-slots.html)                                         |    ❌     |                       |
| [pg_roles](https://www.postgresql.org/docs/current/view-pg-roles.html)                                                                 |    ✅     | Lists all roles; passwords are masked, matching Postgres |
| [pg_rules](https://www.postgresql.org/docs/current/view-pg-rules.html)                                                                 |    ❌     |                       |
| [pg_seclabels](https://www.postgresql.org/docs/current/view-pg-seclabels.html)                                                         |    ❌     |                       |
| [pg_sequences](https://www.postgresql.org/docs/current/view-pg-sequences.html)                                                         |    ✅     | Lists all sequences with parameters and last value; sequenceowner is NULL |
| [pg_settings](https://www.postgresql.org/docs/current/view-pg-settings.html)                                                           |    ✅     | Lists all configuration parameters; min_val, max_val, enumvals, and source-location columns are NULL |
| [pg_shadow](https://www.postgresql.org/docs/current/view-pg-shadow.html)                                                               |    ✅     | Lists login roles; per-role settings (useconfig) are NULL |
| [pg_shmem_allocations](https://www.postgresql.org/docs/current/view-pg-shmem-allocations.html)                                         |    ❌     |                       |
| [pg_stat_activity](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW)                     |    ❌     |                       |
| [pg_stat_all_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW)               |    🟠     | One row per real index, but all statistics counters are zero and timestamps are NULL |
| [pg_stat_all_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)                 |    🟠     | One row per real table, but all statistics counters are zero and timestamps are NULL |
| [pg_stat_archiver](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ARCHIVER-VIEW)                     |    🟠     | Single row with zeroed counters; Doltgres has no WAL archiver |
| [pg_stat_bgwriter](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-BGWRITER-VIEW)                     |    🟠     | Single row with zeroed counters; Doltgres has no background writer |
| [pg_stat_database](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-DATABASE-VIEW)                     |    🟠     | One row per database, but all counters are zero and timestamps are NULL |
| [pg_stat_database_conflicts](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW) |    🟠     | One row per database with zeroed conflict counters |
| [pg_stat_gssapi](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-GSSAPI-VIEW)                         |    ❌     |                       |
| [pg_stat_io](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-IO-VIEW)                                 |    ❌     | Not implemented; this view was added in Postgres 16 |
| [pg_stat_progress_analyze](https://www.postgresql.org/docs/current/progress-reporting.html#ANALYZE-PROGRESS-REPORTING)                 |    ❌     |                       |
| [pg_stat_progress_basebackup](https://www.postgresql.org/docs/current/progress-reporting.html#BASEBACKUP-PROGRESS-REPORTING)           |    ❌     |                       |
| [pg_stat_progress_cluster](https://www.postgresql.org/docs/current/progress-reporting.html#CLUSTER-PROGRESS-REPORTING)                 |    ❌     |                       |
| [pg_stat_progress_copy](https://www.postgresql.org/docs/current/progress-reporting.html#COPY-PROGRESS-REPORTING)                       |    ❌     |                       |
| [pg_stat_progress_create_index](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING)       |    ❌     |                       |
| [pg_stat_progress_vacuum](https://www.postgresql.org/docs/current/progress-reporting.html#VACUUM-PROGRESS-REPORTING)                   |    ❌     |                       |
| [pg_stat_recovery_prefetch](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-RECOVERY-PREFETCH)        |    🟠     | Single row with zeroed counters; Doltgres does not perform WAL recovery prefetching |
| [pg_stat_replication](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW)               |    ❌     |                       |
| [pg_stat_replication_slots](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW)   |    ❌     |                       |
| [pg_stat_slru](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SLRU-VIEW)                             |    🟠     | One row per SLRU cache name with zeroed counters; Doltgres has no SLRU caches |
| [pg_stat_ssl](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SSL-VIEW)                               |    ❌     |                       |
| [pg_stat_subscription](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION)                  |    ❌     |                       |
| [pg_stat_subscription_stats](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION-STATS)      |    ❌     |                       |
| [pg_stat_sys_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW)               |    🟠     | One row per real index, but all statistics counters are zero and timestamps are NULL |
| [pg_stat_sys_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)                 |    🟠     | One row per real table, but all statistics counters are zero and timestamps are NULL |
| [pg_stat_user_functions](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)         |    ❌     |                       |
| [pg_stat_user_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW)              |    🟠     | One row per real index, but all statistics counters are zero and timestamps are NULL |
| [pg_stat_user_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)                |    🟠     | One row per real table, but all statistics counters are zero and timestamps are NULL |
| [pg_stat_wal](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-WAL-VIEW)                               |    🟠     | Single row with zeroed counters; WAL statistics are not tracked |
| [pg_stat_wal_receiver](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-WAL-RECEIVER-VIEW)             |    ❌     |                       |
| [pg_stat_xact_all_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)            |    🟠     | One row per real table, but all statistics counters are zero |
| [pg_stat_xact_sys_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)            |    🟠     | One row per real table, but all statistics counters are zero |
| [pg_stat_xact_user_functions](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)    |    ❌     |                       |
| [pg_stat_xact_user_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)           |    🟠     | One row per real table, but all statistics counters are zero |
| [pg_statio_all_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)           |    🟠     | One row per real index, but all block I/O counters are zero |
| [pg_statio_all_sequences](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)       |    🟠     | One row per real sequence, but all block I/O counters are zero |
| [pg_statio_all_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-TABLES-VIEW)             |    🟠     | One row per real table, but all block I/O counters are zero |
| [pg_statio_sys_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)           |    🟠     | One row per real index, but all block I/O counters are zero |
| [pg_statio_sys_sequences](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)       |    🟠     | One row per real sequence, but all block I/O counters are zero |
| [pg_statio_sys_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-TABLES-VIEW)             |    🟠     | One row per real table, but all block I/O counters are zero |
| [pg_statio_user_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)          |    🟠     | One row per real index, but all block I/O counters are zero |
| [pg_statio_user_sequences](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)      |    🟠     | One row per real sequence, but all block I/O counters are zero |
| [pg_statio_user_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-TABLES-VIEW)            |    🟠     | One row per real table, but all block I/O counters are zero |
| [pg_stats](https://www.postgresql.org/docs/current/view-pg-stats.html)                                                                 |    ❌     |                       |
| [pg_stats_ext](https://www.postgresql.org/docs/current/view-pg-stats-ext.html)                                                         |    ❌     |                       |
| [pg_stats_ext_exprs](https://www.postgresql.org/docs/current/view-pg-stats-ext-exprs.html)                                             |    ❌     |                       |
| [pg_tables](https://www.postgresql.org/docs/current/view-pg-tables.html)                                                               |    ✅     | Lists all tables; information_schema tables are excluded |
| [pg_timezone_abbrevs](https://www.postgresql.org/docs/current/view-pg-timezone-abbrevs.html)                                           |    🟠     | Contains a subset (about 47) of the roughly 200 abbreviations Postgres ships |
| [pg_timezone_names](https://www.postgresql.org/docs/current/view-pg-timezone-names.html)                                               |    ✅     | Full timezone list with current offset, abbreviation, and DST flag for each zone |
| [pg_user](https://www.postgresql.org/docs/current/view-pg-user.html)                                                                   |    ✅     | Lists login roles; passwords are masked, matching Postgres |
| [pg_user_mappings](https://www.postgresql.org/docs/current/view-pg-user-mappings.html)                                                 |    ❌     |                       |
| [pg_views](https://www.postgresql.org/docs/current/view-pg-views.html)                                                                 |    ✅     | Lists all views with their definitions; viewowner is empty |
