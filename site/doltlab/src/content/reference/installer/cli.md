---
title: Installer command line reference
---

# Installer command line reference

## automated-dolt-backups-backup-on-boot

_Boolean_. If true, will create a backup when the `backup-syncer` service comes online, DoltLab Enterprise only (default true).

Configuration file equivalent [backup_on_boot](/reference/installer/configuration-file#backup_on_boot).

## automated-dolt-backups-cron-schedule

_String_. The cron schedule to use for automated doltlabdb backups, DoltLab Enterprise only, (default "0 0 * * *").

Configuration file equivalent [cron_schedule](/reference/installer/configuration-file#cron_schedule).

## automated-dolt-backups-url

_String_. Dolt remote url used for creating automated backups of DoltLab's Dolt server, DoltLab Enterprise only.

Configuration file equivalent [remote_url](/reference/installer/configuration-file#remote_url).

## aws-config-file

_String_. AWS configuration file, used for configuring automated `doltlabdb` backups to AWS, DoltLab Enterprise only.

Configuration file equivalent [aws_config_file](/reference/installer/configuration-file#aws_config_file).

## aws-profile

_String_. AWS profile, used for configuring `doltlabdb` automated AWS backups, DoltLab Enterprise only.

Configuration file equivalent [aws_profile](/reference/installer/configuration-file#aws_profile).

## aws-region

_String_. AWS region, used for configuring `doltlabdb` automated AWS backups, DoltLab Enterprise only.

Configuration file equivalent [aws_region](/reference/installer/configuration-file#aws_region).

## aws-shared-credentials-file

_String_. Absolute path to an AWS shared credentials file, used for configuring `doltlabdb` automated aws backups, DoltLab Enterprise only.

Configuration file equivalent [aws_shared_credentials_file](/reference/installer/configuration-file#aws_shared_credentials_file).

## centos

_Boolean_. If true will generate a script to install DoltLab's dependencies on CentOS.

## config

_String_. Absolute path to `installer` configuration file. By default, the `installer` will look for `installer_config.yaml` in its same directory.

## cors-origin

_String_. Additional allowed CORS origin to include in DoltLab's Envoy-generated CORS policies. Can be supplied multiple times.

If any `--cors-origin` flags are supplied, they override `services.doltlabenvoy.cors_allowed_origins` from the configuration file.

To allow **all** origins, supply `--cors-origin="*"` (or `--cors-origin=".*"`).

Configuration file equivalent [cors_allowed_origins](/reference/installer/configuration-file#doltlabenvoy-cors-allowed-origins).

## custom-color-rgb-accent-1

_String_. Supply a comma-separated RGB value for `accent_1`, DoltLab Enterprise only.

Configuration file equivalent [rgb_accent_1](/reference/installer/configuration-file#rgb_accent_1).

## custom-color-rgb-background-accent-1

_String_. Supply a comma-separated RGB value for `background_accent_1`, DoltLab Enterprise only.

Configuration file equivalent [rgb_background_accent_1](/reference/installer/configuration-file#rgb_background_accent_1).

## custom-color-rgb-background-gradient-start

_String_. Supply a comma-separated RGB value for `background_gradient_start`, DoltLab Enterprise only.

Configuration file equivalent [rgb_background_gradient_start](/reference/installer/configuration-file#rgb_background_gradient_start).

## custom-color-rgb-button-1

_String_. Supply a comma-separated RGB value for `button_1`, DoltLab Enterprise only.

Configuration file equivalent [rgb_button_1](/reference/installer/configuration-file#rgb_button_1).

## custom-color-rgb-button-2

_String_. Supply a comma-separated RGB value for `button_2`, DoltLab Enterprise only.

Configuration file equivalent [rgb_button_2](/reference/installer/configuration-file#rgb_button_2).

## custom-color-rgb-link-1

_String_. Supply a comma-separated RGB value for `link_1`, DoltLab Enterprise only.

Configuration file equivalent [rgb_link_1](/reference/installer/configuration-file#rgb_link_1).

## custom-color-rgb-link-2

_String_. Supply a comma-separated RGB value for `link_2`, DoltLab Enterprise only.

Configuration file equivalent [rgb_link_2](/reference/installer/configuration-file#rgb_link_2).

## custom-color-rgb-link-light

_String_. Supply a comma-separated RGB value for `link_light`, DoltLab Enterprise only.

Configuration file equivalent [rgb_link_light](/reference/installer/configuration-file#rgb_link_light).

## custom-color-rgb-primary

_String_. Supply a comma-separated RGB value for `primary`, DoltLab Enterprise only.

Configuration file equivalent [rgb_primary](/reference/installer/configuration-file#rgb_primary).

## custom-color-rgb-code-background

_String_. Supply a comma-separated RGB value for `code_background`, DoltLab Enterprise only.

Configuration file equivalent [rgb_code_background](/reference/installer/configuration-file#rgb_code_background).

## custom-email-templates

_Boolean_. If true, will generate email templates that can be customized, DoltLab Enterprise only.

Configuration file equivalent [email_templates](/reference/installer/configuration-file#email_templates).

## custom-logo

_String_. Absolute path to an image file to replace DoltLab's logo, DoltLab Enterprise only.

Configuration file equivalent [logo](/reference/installer/configuration-file#logo).

## default-user

_String_. The desired username of the default DoltLab user, (default "admin").

Configuration file equivalent [name](/reference/installer/configuration-file#name).

## default-user-email

_String_. The email address used to create the default DoltLab user.

Configuration file equivalent [email](/reference/installer/configuration-file#email).

## default-user-password

_String_. The password used to create the default DoltLab user.

Configuration file equivalent [password](/reference/installer/configuration-file#default-user-password).

## disable-usage-metrics

_Boolean_. If true, will not collect first-party metrics.

Configuration file equivalent [metrics_disabled](/reference/installer/configuration-file#metrics_disabled).

## network

_String_. The network or namespace to run DoltLab in (default "doltlab"). For Docker/Podman this is the Docker network name; for Kubernetes it is the namespace.

Configuration file equivalent [network](/reference/installer/configuration-file#network).

## docker-network

Deprecated alias for [network](#network). Still accepted for backwards compatibility.

## doltlabapi-asyncworker-aws-sqs-queue

_String_. The name of the SQS queue used for processing asynchronous tasks, DoltLab Enterprise only.

Configuration file equivalent [asyncworker_aws_sqs_queue](/reference/installer/configuration-file#asyncworker_aws_sqs_queue).

## doltlabapi-aws-region

_String_. The AWS region for 'doltlabapi' cloud storage AWS resources, DoltLab Enterprise only.

Configuration file equivalent [aws_region](/reference/installer/configuration-file#doltlabapi-aws-region).

## doltlabapi-csv-port

_Number_. The port for `doltlabapi`'s CSV service.

Configuration file equivalent [csv_port](/reference/installer/configuration-file#csv_port).

## doltlabapi-query-job-aws-s3-bucket

_String_. The name of the S3 bucket used to store the results of SQL query Jobs, DoltLab Enterprise only.

Configuration file equivalent [query_job_aws_bucket](/reference/installer/configuration-file#query_job_aws_bucket).

## doltlabdb-admin-password

_String_. The `dolthubadmin` SQL user password of the `doltlabdb` instance.

Configuration file equivalent [admin_password](/reference/installer/configuration-file#admin_password).

## doltlabdb-autogc-enabled

_Boolean_. If true, automatic garbage collection will be enabled on the `doltlabdb` server..

Configuration file equivalent [auto_gc_enabled](/reference/installer/configuration-file#auto_gc_enabled).

## doltlabdb-backups-volume-host-path

_String_. The path to an existing directory on the DoltLab host used for persisting the 'doltlabdb-dolt-backups' Docker volume.

Configuration file equivalent [backups_volume_path](/reference/installer/configuration-file#backups_volume_path).

## doltlabdb-config-volume-host-path

_String_. The path to an existing directory on the DoltLab host used for persisting the 'doltlabdb-dolt-configs' Docker volume. This has been removed
in DoltLab >= v2.3.12 in favor of [doltlabdb-server-config-file](#doltlabdb-server-config-file).

Configuration file equivalent [configs_volume_path](/reference/installer/configuration-file#configs_volume_path).

## doltlabdb-data-volume-host-path

_String_. The path to an existing directory on the DoltLab host used for persisting the 'doltlabdb-dolt-data' Docker volume.

Configuration file equivalent [data_volume_path](/reference/installer/configuration-file#doltlabdb-data-volume-path).

## doltlabdb-dolthubapi-password

_String_. The `dolthubapi` SQL user password of the `doltlabdb` instance.

Configuration file equivalent [dolthubapi_password](/reference/installer/configuration-file#dolthubapi_password).

## doltlabdb-host

_String_. The hostname or IP address of `doltlabdb`.

Configuration file equivalent [host](/reference/installer/configuration-file#doltlabdb-host).

## doltlabdb-placement-constraint

_String_. The placement constraint to add to the doltlabdb service. Can be supplied multiple times. By default, DoltLab will add the `node.labels.doltlabdb == true` constraint to a multihost deployment. DoltLab Enterprise only.

Configuration file equivalent [placement_constraints](/reference/installer/configuration-file#doltlabdb-placement-constraints).

## doltlabdb-placement-preferences-spread

_String_. The placement preferences spread to add to the doltlabdb service. Can be supplied multiple times. DoltLab Enterprise only.

Configuration file equivalent [placement_preferences_spread](/reference/installer/configuration-file#doltlabdb-placement-preferences-spread).

## doltlabdb-port

_Number_. The port of `doltlabdb`.

Configuration file equivalent [port](/reference/installer/configuration-file#doltlabdb-port).

## doltlabdb-replicas

_Number_. Specifies the number of doltlabdb service replicas to run. NOTE: only a single replica of `doltlabdb` is currently supported. DoltLab Enterprise only.

Configuration file equivalent [replicas](/reference/installer/configuration-file#doltlabdb-replicas).

## doltlabdb-root-volume-host-path

_String_. The path to an existing directory on the DoltLab host used for persisting the 'doltlabdb-dolt-root' Docker volume.

Configuration file equivalent [root_volume_path](/reference/installer/configuration-file#root_volume_path).

## doltlabdb-tls-skip-verify

_Boolean_. If true, will disable TLS verification for connection to `doltlabdb`.

Configuration file equivalent [tls_skip_verify](/reference/installer/configuration-file#tls_skip_verify).

## doltlabdb-server-config-file

_String_. Absolute path to the `doltlabdb` server configuration file.

Configuration file equivalent [server_config](/reference/installer/configuration-file#server_config).

## doltlabapi-placement-constraint

_String_. The placement constraint to add to the doltlabapi service. Can be supplied multiple times. By default, DoltLab will add the `node.labels.doltlabapi == true` constraint to a multihost deployment. DoltLab Enterprise only.

Configuration file equivalent [placement_constraints](/reference/installer/configuration-file#doltlabapi-placement-constraints).

## doltlabapi-placement-preferences-spread

_String_. The placement preferences spread to add to the doltlabapi service. Can be supplied multiple times. DoltLab Enterprise only.

Configuration file equivalent [placement_preferences_spread](/reference/installer/configuration-file#doltlabapi-placement-preferences-spread).

## doltlabapi-replicas

_Number_. Specifies the number of doltlabapi service replicas to run. DoltLab Enterprise only.

Configuration file equivalent [replicas](/reference/installer/configuration-file#doltlabapi-replicas).

## doltlabenvoy-placement-constraint

_String_. The placement constraint to add to the doltlabenvoy service. Can be supplied multiple times. By default, DoltLab will add the `node.labels.doltlabenvoy == true` constraint to a multihost deployment. DoltLab Enterprise only.

Configuration file equivalent [placement_constraints](/reference/installer/configuration-file#doltlabenvoy-placement-constraints).

## doltlabenvoy-placement-preferences-spread

_String_. The placement preferences spread to add to the doltlabenvoy service. Can be supplied multiple times. DoltLab Enterprise only.

Configuration file equivalent [placement_preferences_spread](/reference/installer/configuration-file#doltlabenvoy-placement-preferences-spread).

## doltlabenvoy-replicas

_Number_. Specifies the number of doltlabenvoy service replicas to run. DoltLab Enterprise only.

Configuration file equivalent [replicas](/reference/installer/configuration-file#doltlabenvoy-replicas).

## doltlabfileserviceapi-uploads-volume-host-path

_String_. The path to an existing directory on the DoltLab host for persisting the 'doltlab-user-uploads' Docker volume.

Configuration file equivalent [uploads_volume_path](/reference/installer/configuration-file#uploads_volume_path).

## doltlabfileserviceapi-placement-constraint

_String_. The placement constraint to add to the doltlabfileserviceapi service. Can be supplied multiple times. By default, DoltLab will add the `node.labels.doltlabfileserviceapi == true` constraint to a multihost deployment. DoltLab Enterprise only.

Configuration file equivalent [placement_constraints](/reference/installer/configuration-file#doltlabfileserviceapi-placement-constraints).

## doltlabfileserviceapi-placement-preferences-spread

_String_. The placement preferences spread to add to the doltlabfileserviceapi service. Can be supplied multiple times. DoltLab Enterprise only.

Configuration file equivalent [placement_preferences_spread](/reference/installer/configuration-file#doltlabfileserviceapi-placement-preferences-spread).

## doltlabfileserviceapi-replicas

_Number_. Specifies the number of doltlabfileserviceapi service replicas to run. NOTE: only a single replica of `doltlabfileserviceapi` is currently supported. Use cloud-backed storage to remove this scaling limitation. DoltLab Enterprise only.

Configuration file equivalent [replicas](/reference/installer/configuration-file#doltlabfileserviceapi-replicas).

## doltlabgraphql-placement-constraint

_String_. The placement constraint to add to the doltlabgraphql service. Can be supplied multiple times. By default, DoltLab will add the `node.labels.doltlabgraphql == true` constraint to a multihost deployment. DoltLab Enterprise only.

Configuration file equivalent [placement_constraints](/reference/installer/configuration-file#doltlabgraphql-placement-constraints).

## doltlabgraphql-placement-preferences-spread

_String_. The placement preferences spread to add to the doltlabgraphql service. Can be supplied multiple times. DoltLab Enterprise only.

Configuration file equivalent [placement_preferences_spread](/reference/installer/configuration-file#doltlabgraphql-placement-preferences-spread).

## doltlabgraphql-replicas

_Number_. Specifies the number of doltlabgraphql service replicas to run. DoltLab Enterprise only.

Configuration file equivalent [replicas](/reference/installer/configuration-file#doltlabgraphql-replicas).

## doltlabremoteapi-data-volume-host-path

_String_. The path to an existing directory on the DoltLab host used for persisting the 'doltlab-remote-storage' Docker volume.

Configuration file equivalent [data_volume_path](/reference/installer/configuration-file#doltlabremoteapi-data-volume-path).

## doltlabremoteapi-placement-constraint

_String_. The placement constraint to add to the doltlabremoteapi service. Can be supplied multiple times. By default, DoltLab will add the `node.labels.doltlabremoteapi == true` constraint to a multihost deployment. DoltLab Enterprise only. 

Configuration file equivalent [placement_constraints](/reference/installer/configuration-file#doltlabremoteapi-placement-constraints).

## doltlabremoteapi-placement-preferences-spread

_String_. The placement preferences spread to add to the doltlabremoteapi service. Can be supplied multiple times. DoltLab Enterprise only.

Configuration file equivalent [placement_preferences_spread](/reference/installer/configuration-file#doltlabremoteapi-placement-preferences-spread).

## doltlabremoteapi-replicas

_Number_. Specifies the number of doltlabremoteapi service replicas to run. NOTE: only a single replica of `doltlabremoteapi` is supported when cloud-backed storage is NOT configured. Use cloud-backed storage to remove this scaling limitation. DoltLab Enterprise only.

Configuration file equivalent [replicas](/reference/installer/configuration-file#doltlabremoteapi-replicas).

## doltlabremoteapi-storage-aws-bucket

_String_. The AWS S3 bucket used for storing remote data files. DoltLab Enterprise only.

Configuration file equivalent [aws_bucket](/reference/installer/configuration-file#doltlabremoteapi-aws-bucket).

## doltlabremoteapi-storage-aws-dynamodb-table

_String_. The AWS DynamoDb table name used for storing the manifest of remote databases. DoltLab Enterprise only.

Configuration file equivalent [aws_dynamodb_table](/reference/installer/configuration-file#aws_dynamodb_table).

## doltlabremoteapi-storage-aws-region

_String_. The AWS region where the DynamoDb table is located. DoltLab Enterprise only.

Configuration file equivalent [aws_region](/reference/installer/configuration-file#doltlabremoteapi-aws-region).

## doltlabui-placement-constraint

_String_. The placement constraint to add to the doltlabui service. Can be supplied multiple times. By default, DoltLab will add the `node.labels.doltlabui == true` constraint to a multihost deployment. DoltLab Enterprise only.

Configuration file equivalent [placement_constraints](/reference/installer/configuration-file#doltlabui-placement-constraints).

## doltlabui-placement-preferences-spread

_String_. The placement preferences spread to add to the doltlabui service. Can be supplied multiple times. DoltLab Enterprise only.

Configuration file equivalent [placement_preferences_spread](/reference/installer/configuration-file#doltlabui-placement-preferences-spread).

## doltlabui-replicas

_Number_. Specifies the number of doltlabui service replicas to run. DoltLab Enterprise only.

Configuration file equivalent [replicas](/reference/installer/configuration-file#doltlabui-replicas).

## enterprise-online-api-key

_String_. The online api key for DoltLab Enterprise.

Configuration file equivalent [online_api_key](/reference/installer/configuration-file#online_api_key).

## enterprise-online-license-key

_String_. The online license key for DoltLab Enterprise.

Configuration file equivalent [online_license_key](/reference/installer/configuration-file#online_license_key).

## enterprise-online-product-code

_String_. The online product code for DoltLab Enterprise.

Configuration file equivalent [online_product_code](/reference/installer/configuration-file#online_product_code).

## enterprise-online-shared-key

_String_. The online shared key for DoltLab Enterprise.

Configuration file equivalent [online_shared_key](/reference/installer/configuration-file#online_shared_key).

## enterprise-offline-api-key

_String_. The offline api key for DoltLab Enterprise.

Configuration file equivalent [offline_api_key](/reference/installer/configuration-file#offline_api_key).

## enterprise-offline-license-key

_String_. The offline license key for DoltLab Enterprise.

Configuration file equivalent [offline_license_key](/reference/installer/configuration-file#offline_license_key).

## enterprise-offline-product-code

_String_. The offline product code for DoltLab Enterprise.

Configuration file equivalent [offline_product_code](/reference/installer/configuration-file#offline_product_code).

## enterprise-offline-shared-key

_String_. The offline shared key for DoltLab Enterprise.

Configuration file equivalent [offline_shared_key](/reference/installer/configuration-file#offline_shared_key).

## enterprise-offline-license-file

_String_. The offline license file for DoltLab Enterprise.

Configuration file equivalent [offline_license_file](/reference/installer/configuration-file#offline_license_file).

## enterprise-offline-request-activation

_Boolean_. If true, will generate an activation file that must be provided to the DoltLab team.

Configuration file equivalent [request_offline_activation](/reference/installer/configuration-file#request_offline_activation).

## google-creds-file

_String_. Absolute path to a Google application credentials file, used for configuring automated `doltlabdb backups` to Google Cloud Storage, DoltLab Enterprise only.

Configuration file equivalent [google_credentials_file](/reference/installer/configuration-file#google_credentials_file).

## help

_Boolean_. Print `installer` usage information.

## host

_String_. The hostname or IP address of the host running DoltLab or one of its services.

Configuration file equivalent [host](/reference/installer/configuration-file#host).

## https

_Boolean_. If true, will set the url scheme of DoltLab to `https://`. DoltLab Enterprise only.

Configuration file equivalent [scheme](/reference/installer/configuration-file#scheme).

## job-concurrency-limit

_Number_. The limit of concurrent `running` Jobs.

Configuration file equivalent [concurrency_limit](/reference/installer/configuration-file#concurrency_limit).

## job-concurrency-loop-seconds

_Number_. The number of seconds to wait before attempting to schedule more `pending` Jobs.

Configuration file equivalent [concurrency_loop_seconds](/reference/installer/configuration-file#concurrency_loop_seconds).

## job-max-retries

_Number_. The number of times to retry `failed` Jobs.

Configuration file equivalent [max_retries](/reference/installer/configuration-file#max_retries).

## multihost-deployment

_Boolean_. If true, generates DoltLab Enterprise assets that will run via Docker Swarm. DoltLab Enterprise only.
 
Configuration file equivalent [multihost_deployment](/reference/installer/configuration-file#multihost_deployment).

## no-default-placement-constraints

_Boolean_. If true, will not add the default placment contraints to services when running in multihost deployment mode. DoltLab Enterprise only.

Configuration file equivalent [no_default_placement_contraints](/reference/installer/configuration-file#no_default_placement_contraints).

## no-default-placement-preferences-spreads

_Boolean_. If true, will not add the default placment preferences spread to services when running in multihost deployment mode. DoltLab Enterprise only.

Configuration file equivalent [no_default_placement_preferences_spreads](/reference/installer/configuration-file#no_default_placement_preferences_spreads).

## query-row-limit

_Number_. The maximum number of rows returned by SQL queries in the UI. `0` (default) uses the built-in default of 1000. `-1` means no limit. Any positive value sets that exact limit.

Configuration file equivalent [row_limit](/reference/installer/configuration-file#row_limit).

## query-column-limit

_Number_. The maximum number of columns returned by SQL queries in the UI. `0` (default) uses the built-in default of 20. `-1` means no limit. Any positive value sets that exact limit.

Configuration file equivalent [column_limit](/reference/installer/configuration-file#column_limit).

## no-reply-email

_String_. The email address used as the "from" address in emails sent from DoltLab. DoltLab Enterprise only.

Configuration file equivalent [no_reply_email](/reference/installer/configuration-file#no_reply_email).

## oci-config-file

_String_. Absolute path to an Oracle Cloud config file, used for configuring automated doltlabdb backups to Oracle Cloud, DoltLab Enterprise only.

Configuration file equivalent [oci_config_file](/reference/installer/configuration-file#oci_config_file).

## oci-key-file

_String_. Absolute path to an Oracle Cloud key file, used for configuring automated doltlabdb backups to Oracle Cloud, DoltLab Enterprise only.

Configuration file equivalent [oci_key_file](/reference/installer/configuration-file#oci_key_file).

## smtp-auth-method

_String_. The authentication method of an SMTP server, one of `plain`, `login`, `anonymous`, `external`, `oauthbearer`, or `disable`. DoltLab Enterprise only.

Configuration file equivalent [auth_method](/reference/installer/configuration-file#auth_method).

## smtp-client-hostname

_String_. The client hostname of an SMTP server. DoltLab Enterprise only.

Configuration file equivalent [client_hostname](/reference/installer/configuration-file#client_hostname).

## smtp-host

_String_. The hostname of an SMTP server. DoltLab Enterprise only.

Configuration file equivalent [host](/reference/installer/configuration-file#smtp-host).

## smtp-identity

_String_. The identity of an SMTP server. DoltLab Enterprise only.

Configuration file equivalent [identity](/reference/installer/configuration-file#identity).

## smtp-implicit-tls

_Boolean_. If true, will use implicit TLS when DoltLab connects to the SMTP server. DoltLab Enterprise only.

Configuration file equivalent [implicit_tls](/reference/installer/configuration-file#implicit_tls).

## smtp-insecure-tls

_String_. If true, will skip TLS verification when DoltLab connects to the SMTP server. DoltLab Enterprise only.

Configuration file equivalent [insecure_tls](/reference/installer/configuration-file#insecure_tls).

## smtp-oauth-token

_String_. The Oauth token used for authenticating against an SMTP server. DoltLab Enterprise only.

Configuration file equivalent [oauth_token](/reference/installer/configuration-file#oauth_token).

## smtp-password

_String_. The password used for authenticating against an SMTP server. DoltLab Enterprise only.

Configuration file equivalent [password](/reference/installer/configuration-file#smtp-password).

## smtp-port

_Number_. The port of an SMTP server. DoltLab Enterprise only.

Configuration file equivalent [port](/reference/installer/configuration-file#smtp-port).

## smtp-trace

_String_. The trace of an SMTP server. DoltLab Enterprise only.

Configuration file equivalent [trace](/reference/installer/configuration-file#trace).

## smtp-username

_String_. The username used for authenticating against an SMTP server. DoltLab Enterprise only.

Configuration file equivalent [username](/reference/installer/configuration-file#username).

## sso-saml-cert-common-name

_String_. The common name used for generating the SAML signing certificate, DoltLab Enterprise only.

Configuration file equivalent [cert_common_name](/reference/installer/configuration-file#cert_common_name).

## sso-saml-metadata-descriptor

_String_. Absolute path to the SAML metadata descriptor file from an identity provider, DoltLab Enterprise only.

Configuration file equivalent [metadata_descriptor_file](/reference/installer/configuration-file#metadata_descriptor_file).

## sso-saml-service-provider-issuer

_String_. Optional override for the SAML service provider issuer/entityID (Audience URI). If unset, defaults to `<website_url>/sso`. DoltLab Enterprise only.

This value is rendered into the `doltlabapi` service command as `-samlServiceProviderIssuer`.

Configuration file equivalent [service_provider_issuer](/reference/installer/configuration-file#service_provider_issuer).

## sso-oidc-issuer-url 

_String_. The URL of the OIDC identity provider, DoltLab Enterprise only.

Configuration file equivalent [issuer_url](/reference/installer/configuration-file#issuer_url).

## sso-oidc-client-id

_String_. The OIDC client id, DoltLab Enterprise only.

Configuration file equivalent [client_id](/reference/installer/configuration-file#client_id).

## sso-oidc-client-secret

_String_. The OIDC client secret, DoltLab Enterprise only.

Configuration file equivalent [client_secret](/reference/installer/configuration-file#client_secret).

## super-admin-email

_String_. The email address of a DoltLab user granted "super admin" privileges. Can be supplied multiple times. DoltLab Enterprise only.

Configuration file equivalent [super_admins](/reference/installer/configuration-file#super_admins).

## tls-cert-chain

_String_. Deprecated, use `tls-full-chain-cert` instead. Absolute path to a TLS full chain certificate with `.pem` extension. DoltLab Enterprise only.

Configuration file equivalent [cert_chain](/reference/installer/configuration-file#cert_chain).

## tls-full-chain-cert

_String_. Absolute path to a TLS full chain certificate with `.pem` extension. DoltLab Enterprise only.

Configuration file equivalent [full_chain_cert](/reference/installer/configuration-file#full_chain_cert).

## tls-private-key

_String_. Absolute path to TLS private key with `.pem` extension. DoltLab Enterprise only.

Configuration file equivalent [private_key](/reference/installer/configuration-file#private_key).

## ubuntu

_Boolean_. If true will generate a script to install DoltLab's dependencies on Ubuntu.

## runtime

_String_. Selects the runtime to target: `docker` (default), `podman`, or `k8s`.

When set to `podman`, the installer adjusts generated files for Podman (removes service `depends_on`, sets appropriate container user, maps the Podman socket).

When set to `k8s`, the installer generates Kubernetes manifests under `k8s/`. Apply them with `kubectl apply -f ./k8s/all.yaml`. The value of `network` is used as the Kubernetes namespace. Kubernetes deployments are single-host logical deployments in DoltLab Enterprise; multi-host Kubernetes is not yet supported.

Configuration file equivalent [runtime](/reference/installer/configuration-file#runtime).

## upgrade

_Boolean_. If true will upgrade DoltLab to the latest version. DoltLab Enterprise only.

## use-env

_Boolean_. If true, sensitive values will not be written to generated assets and environment variables will be expected instead.

Configuration file equivalent [use_env](/reference/installer/configuration-file#use_env).

## whitelist-all-users

_Boolean_. If true, allows all users create accounts on a DoltLab instance, (default true).

Configuration file equivalent [whitelist_all_users](/reference/installer/configuration-file#whitelist_all_users).
