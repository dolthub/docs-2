---
title: "Models"
description: Request and response schemas for the Hosted v1 API.
---

# Models

Shared request and response types used across the v1 API. See the [error model](#model-problem) for how failures are reported.

## ErrorCode {#model-errorcode}
A stable, machine-readable error code in SCREAMING_SNAKE_CASE. Clients branch on this value, never on the human-readable `title`/`detail` prose. The baseline codes below cover the standard HTTP failure categories; endpoint-specific codes (e.g. `DEPLOYMENT_NOT_FOUND`) are appended to this enum alongside the endpoints that emit them, which is an additive, non-breaking change under the v1 stability policy.

**Enum values**

| Value |
|-------|
| `VALIDATION_FAILED` |
| `UNAUTHENTICATED` |
| `PERMISSION_DENIED` |
| `NOT_FOUND` |
| `METHOD_NOT_ALLOWED` |
| `CONFLICT` |
| `UNPROCESSABLE` |
| `RATE_LIMITED` |
| `INTERNAL` |
| `SERVICE_UNAVAILABLE` |
| `OPERATION_FAILED` |

---

## Problem {#model-problem}
A structured error body returned for every non-2xx response, following RFC 9457 (Problem Details for HTTP APIs). This is the single error model for the entire v1 API — there are no ad-hoc error shapes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `string` | yes | A URI identifying the problem type; when dereferenced it points at human-readable documentation for the error. |
| `title` | `string` | yes | A short, human-readable summary of the problem type. |
| `status` | `integer` | yes | The HTTP status code, repeated in the body for convenience. |
| `detail` | `string` | no | A human-readable explanation specific to this occurrence of the problem. |
| `instance` | `string` | no | A URI reference identifying the specific occurrence (typically the request path). |
| `code` | [`ErrorCode`](/products/hosted/api/v1/models#model-errorcode) | yes | A stable, machine-readable error code in SCREAMING_SNAKE_CASE. Clients branch on this value, never on the human-readable `title`/`detail` prose. The baseline codes below cover the standard HTTP failure categories; endpoint-specific codes (e.g. `DEPLOYMENT_NOT_FOUND`) are appended to this enum alongside the endpoints that emit them, which is an additive, non-breaking change under the v1 stability policy. |
| `request_id` | `string` | yes | The request identifier, echoed on every response. Include it when contacting support so a request can be traced end-to-end. |

---

## Meta {#model-meta}
Response metadata carried alongside the primary `data` payload. All fields are optional; list endpoints populate `next_page_token` for cursor pagination.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `next_page_token` | `string` | no | Opaque cursor for the next page of a list response. Absent when there are no further results — never present and empty — otherwise pass it back as the `page_token` query parameter to fetch the next page. |
| `prev_page_token` | `string` | no | Opaque cursor for the previous page. Only log retrieval pages in both directions; every other list endpoint moves forward only and omits this. Pass it back as the `prev_page_token` query parameter. |

---

## Envelope {#model-envelope}
The success envelope wrapping every 2xx response body: the resource or list of resources under `data`, with optional `meta`. This is the single success shape for the API — there are no unenveloped success bodies. Endpoints narrow `data` to a concrete resource via `allOf`; the base leaves `data` unconstrained so that composition works.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | `object \| array` | yes | The primary response payload — a resource, or an array of resources for list endpoints. |
| `meta` | [`Meta`](/products/hosted/api/v1/models#model-meta) | no | Response metadata carried alongside the primary `data` payload. All fields are optional; list endpoints populate `next_page_token` for cursor pagination. |

---

## UserEmailAddress {#model-useremailaddress}
An email address belonging to a user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | `string` | yes | The email address. |
| `is_verified` | `boolean` | yes | Whether the address has completed email verification. |
| `is_primary` | `boolean` | yes | Whether this is the user's primary address. Exactly one address is primary. |

---

## User {#model-user}
A Hosted user. `GET /api/v1/user` returns the authenticated user's profile. v1 returns only public-facing profile fields — the identity provider the account signs in with, session state, and credential metadata are never included.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | `string` | yes | The user's Hosted username (unique handle). |
| `display_name` | `string` | no | The user's display name. May be empty. |
| `company` | `string` | no | The user's stated company. May be empty. |
| `email_addresses` | [`UserEmailAddress[]`](/products/hosted/api/v1/models#model-useremailaddress) | yes | The user's email addresses. Returned only for the authenticated user themselves; empty for any other caller. |

---

## InstanceType {#model-instancetype}
A compute instance type a deployment can run on.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | The identifier `POST /api/v1/deployments` accepts as `instance_type_id`. |
| `name` | `string` | yes | The display name. A deployment reports this as `instance_type_name`. |
| `cpus` | `integer` | no | Virtual CPUs. |
| `memory_gb` | `integer` | no | Memory, in gigabytes. |
| `description` | `string` | no | A human-readable summary of what the instance suits. |
| `hourly_cost_usd` | `number` | no | Cost per hour in US dollars. Absent when no hourly price is published for this instance type. |

---

## StorageOption {#model-storageoption}
A storage type a deployment's volume can use.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | The identifier `POST /api/v1/deployments` accepts as `volume_type_id`. |
| `name` | `string` | yes | The display name. A deployment reports this as `volume_type_name`. |
| `description` | `string` | no | A human-readable summary of the storage type. |
| `min_size_gb` | `integer` | no | Smallest volume size this type supports, in gigabytes. `volume_size_gb` on a create request must be at least this. |
| `max_size_gb` | `integer` | no | Largest volume size this type supports, in gigabytes. |
| `monthly_cost_usd_per_gb` | `number` | no | Cost per gigabyte per month, in US dollars. |

---

## ConfigSetting {#model-configsetting}
One database setting and the value this deployment runs it at.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | `string` | yes | The setting's name. |
| `value` | `string` | yes | The value in effect — the deployment's override when it has one, otherwise the default. A string even for numeric and boolean settings, as stored. |
| `default` | `string` | yes | The value this setting takes when not overridden, and what it reverts to if the override is removed. |
| `is_overridden` | `boolean` | yes | Whether the deployment has overridden this setting. When `false`, `value` equals `default`. |

---

## DeploymentConfig {#model-deploymentconfig}
A deployment's effective configuration — every supported setting, with the value it is running at.

Settings are wrapped in an object rather than returned as a bare list so the resource can gain fields without a breaking change.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `settings` | [`ConfigSetting[]`](/products/hosted/api/v1/models#model-configsetting) | yes | Every setting Hosted supports for this deployment, in the order the catalogue reports them. |

---

## UpdateDeploymentRequest {#model-updatedeploymentrequest}
Settings to change on an existing deployment. Every property is optional, but at least one must be present.

Provider-specific private-networking allowlists are deliberately absent: private networking is not part of the `Deployment` resource in v1.0, and will be settable through its own sub-resource when that lands.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `disable_automatic_dolt_updates` | `boolean` | no | Whether to stop Dolt updating itself during the deployment's service window. Turn this on to pin the version, then roll it forward deliberately. |

_Send at least one of these fields._

---

## PatchDeploymentConfigRequest {#model-patchdeploymentconfigrequest}
The overrides to change. Keys the object omits keep whatever value they have; a key set to `null` is cleared and reverts to its default.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `overrides` | `object` | yes | Setting key to value, or to `null` to clear it. Keys are the `key` values `GET` reports; values are strings whatever the setting's underlying type, so a boolean is `"true"` or `"false"` and a number is its decimal digits. |

---

## ExposeServiceRequest {#model-exposeservicerequest}
Which service to expose or stop exposing. Exactly one property per request: each is applied by its own backend call, so accepting two would risk half-applying a change.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `remotesapi` | `boolean` | no | Whether to serve the remotesapi endpoint, which is what `dolt clone` and `dolt pull` talk to. Requires the deployment to have a WebPKI certificate — `400` otherwise, since a public endpoint with a private CA is unusable. |
| `mcp` | `boolean` | no | Whether to serve the MCP endpoint. |

_Send exactly one of these fields._

---

## ExposeAccepted {#model-exposeaccepted}
Confirmation that a change to an exposed service was accepted. Deliberately minimal, like `DisableAccepted`: it echoes what was asked for, which is all that is certain at this point. `GET` the deployment to see whether it has taken effect.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | `string` | yes | The user or organization that owns the deployment. |
| `name` | `string` | yes | The deployment name. |
| `service` | `string` | yes | Which service the request was about. |
| `requested` | `boolean` | yes | The value that was asked for. Not the deployment's current value — read `expose_remotesapi_endpoint` or `expose_mcp` on the deployment for that. |

---

## AddInstanceRequest {#model-addinstancerequest}
The instance to add to a deployment.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `instance_type_id` | `string` | yes | The **id** of the instance type, from the deployment options endpoint. Note an instance reports `instance_type_name` on a read — the id and the display name are different values. |
| `volume_type_id` | `string` | yes | The **id** of the storage type, from the deployment options endpoint. |
| `volume_size_gb` | `integer` | yes | The size of the instance's storage volume, in gigabytes. Must fall within the selected storage type's supported range. |
| `backup_id` | `string` | no | A backup of this deployment to restore into the new instance, from the backups list. Only valid when the deployment is disabled and this request is restarting it; supplying it otherwise is a `400`. Without it a restarted deployment comes up empty. |

---

## InstanceDeleteAccepted {#model-instancedeleteaccepted}
Acknowledges that an instance has been accepted for removal.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | The instance that is being removed. |
| `state` | `string` | yes | Always `stopping`. The instance is being torn down; it leaves the instances list once that finishes. |

---

## LogLine {#model-logline}
One line of a deployment instance's log output.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `time` | `string` | yes | When the line was logged. |
| `text` | `string` | yes | The line as the instance emitted it, without a trailing newline. |

---

## MetricSeries {#model-metricseries}
One series of a metric. `values` has one entry per entry in the enclosing `timestamps`, in the same order.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | yes | The series' name for display, unique within the metric. |
| `unit` | `string` | no | The unit the values are in. Absent when Hosted does not record one for the series. |
| `values` | `(number \| null)[]` | yes | One value per timestamp, `null` where the metric had no datapoint at that moment. A series Hosted collects but has never recorded is all `null` rather than a shorter array. |

---

## MetricData {#model-metricdata}
One metric's series over a window, sharing a single time axis.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `metric` | `string` | yes | The metric that was read. |
| `instance_id` | `string` | no | The instance the metric was read from, echoed from `instance_id`. Absent when the request named none, in which case the deployment's primary answered. |
| `start_time` | `string` | yes | The start of the window, as asked for. |
| `end_time` | `string` | yes | The end of the window, as asked for. |
| `period_seconds` | `integer` | yes | The seconds between datapoints, chosen from the width of the window. Not the same as the spacing of `timestamps`, which skips any moment no series had a datapoint for. |
| `timestamps` | `string[]` | yes | The time axis every series is laid against, oldest first. A moment no series had a datapoint for is absent from it. |
| `series` | [`MetricSeries[]`](/products/hosted/api/v1/models#model-metricseries) | yes | The metric's series. A metric can carry more than one, and they can be in different units. |

---

## Metric {#model-metric}
One metric a deployment collects. Read it with `GET /api/v1/deployments/{owner}/{deployment}/metrics/{metric}`, passing `id`. `display_name` is for display, and can change.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | The metric's identifier. Today's values are `connections`, `queries`, `query_latency`, `cpu`, `mem`, `disk`, `diskio`, `network`, and `replication_lag`, but this is a string rather than an enum because Hosted adds metrics without a new API version. |
| `display_name` | `string` | yes | The metric's name for display. |

---

## DayOfWeek {#model-dayofweek}
The day of the week a service window falls on, in UTC.

**Enum values**

| Value |
|-------|
| `sunday` |
| `monday` |
| `tuesday` |
| `wednesday` |
| `thursday` |
| `friday` |
| `saturday` |

---

## ServiceWindow {#model-servicewindow}
One weekly window in which Hosted may restart the deployment's instances for maintenance.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | The window's identifier, unique within the deployment. A default window has no identifier of its own and reports the nil UUID, `00000000-0000-0000-0000-000000000000`. |
| `day_of_week` | [`DayOfWeek`](/products/hosted/api/v1/models#model-dayofweek) | yes | The day of the week a service window falls on, in UTC. |
| `start_hour_utc` | `integer` | yes | The first hour of the window, in UTC. Inclusive. |
| `end_hour_utc` | `integer` | yes | The hour the window ends, in UTC. Exclusive, so a window of 3 to 5 covers 03:00 until 05:00. |
| `is_default` | `boolean` | yes | Whether this is the default window Hosted falls back to rather than one that was configured. `true` means no maintenance window has been set for this deployment. |

---

## DeploymentInstance {#model-deploymentinstance}
One instance backing a deployment. A deployment has a primary and, when it has read replicas, one instance per replica.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | The instance's identifier, unique within the deployment. |
| `index` | `integer` | yes | The instance's position in the deployment. `0` is the first instance; replicas take the following indices. |
| `is_primary` | `boolean` | yes | Whether this instance is currently the primary. Exactly one instance of a started deployment is primary, and which one can change over the deployment's life. |
| `host` | `string` | no | The hostname for this specific instance. Connect to the deployment's own `host` unless you mean to address one instance directly. Absent until the instance has come up and reported its address, so an instance that is still being provisioned has no `host`. There is no per-instance state on this API; `host` appearing is what tells you a newly added instance is reachable. |
| `instance_type_name` | `string` | no | The display name of this instance's type. |
| `volume_type_name` | `string` | no | The display name of this instance's storage type. |
| `volume_size_gb` | `integer` | no | The size of this instance's storage volume, in gigabytes. |
| `hourly_cost_usd` | `number` | no | This instance's cost per hour, in US dollars. A deployment's total is the sum across its instances. |

---

## DeploymentOptions {#model-deploymentoptions}
The options available for creating a deployment, narrowed by the query parameters supplied. `instance_types` and `storage_options` are absent until enough of the chain has been supplied to determine them.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cloud` | [`CloudProvider`](/products/hosted/api/v1/models#model-cloudprovider) | yes | The cloud the deployment runs in. |
| `zones` | `string[]` | yes | The zones this cloud supports. |
| `instance_types` | [`InstanceType[]`](/products/hosted/api/v1/models#model-instancetype) | no | Instance types available in the requested `zone`. Absent when `zone` wasn't supplied. |
| `storage_options` | [`StorageOption[]`](/products/hosted/api/v1/models#model-storageoption) | no | Storage types compatible with the requested `instance_type_id`. Absent when `zone` and `instance_type_id` weren't both supplied. |

---

## CreateDeploymentRequest {#model-createdeploymentrequest}
The provisioning parameters for a new deployment.

v1.0 exposes the core parameters only. Restoring from a backup, cloning an existing deployment, workbench user settings, and private networking are all settable on the internal API but are not part of this request; each is its own feature with its own contract, and adding them is additive. The internal deployment test flag is deliberately not exposed at all.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | `string` | yes | The user or organization that will own the deployment. The caller must have permission to create deployments for it. 3–32 characters of letters, digits, hyphens, and underscores. |
| `name` | `string` | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |
| `cloud` | [`CloudProvider`](/products/hosted/api/v1/models#model-cloudprovider) | yes | The cloud the deployment runs in. |
| `zone` | `string` | yes | The cloud region to provision in, as listed by the deployment options. |
| `cluster_type` | [`ClusterType`](/products/hosted/api/v1/models#model-clustertype) | no | The database engine the deployment runs. `mysql_with_dolt_replicas` is a MySQL primary with Dolt read replicas. |
| `instance_type_id` | `string` | yes | The **id** of the instance type, from the deployment options endpoint. Note a deployment reports `instance_type_name` on a read — the id and the display name are different values. |
| `volume_type_id` | `string` | yes | The **id** of the storage type, from the deployment options endpoint. As with `instance_type_id`, this is the id rather than the display name. |
| `volume_size_gb` | `integer` | yes | The size of the storage volume, in gigabytes. Must fall within the selected storage type's supported range. |
| `replicas` | `integer` | no | The number of read replicas. Defaults to `0` when omitted. |
| `webpki_cert` | `boolean` | no | Serve a publicly-trusted (WebPKI) TLS certificate rather than a Hosted-issued one. Defaults to `false` when omitted. |
| `expose_remotesapi_endpoint` | `boolean` | no | Expose a Dolt remotes API endpoint. Defaults to `false` when omitted. |
| `expose_mcp` | `boolean` | no | Expose an MCP endpoint. Defaults to `false` when omitted. |
| `expose_stats` | `boolean` | no | Expose a statistics endpoint. Defaults to `false` when omitted. |

---

## DeploymentState {#model-deploymentstate}
The deployment's lifecycle state. `starting` covers both initial provisioning and a restart; poll this field to observe a create or a resize reaching `started`.

**Enum values**

| Value |
|-------|
| `starting` |
| `started` |
| `stopping` |
| `stopped` |

---

## Backup {#model-backup}
A stored backup of a deployment's databases.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | The backup's identifier, unique within the deployment. Derived from the time it was taken. |
| `databases` | `string[]` | yes | The databases captured in this backup. Empty if the deployment had none at the time. |
| `size_bytes` | `integer` | no | The backup's size in bytes. Absent until it has been measured, which happens asynchronously after the backup is taken — so a recent backup legitimately has no size yet. |
| `instance_index` | `integer` | yes | The index of the deployment instance the backup was taken from. |
| `created_at` | `string` | yes | When the backup was taken. |

---

## CloudProvider {#model-cloudprovider}
The cloud the deployment runs in.

**Enum values**

| Value |
|-------|
| `aws` |
| `gcp` |
| `azure` |

---

## ClusterType {#model-clustertype}
The database engine the deployment runs. `mysql_with_dolt_replicas` is a MySQL primary with Dolt read replicas.

**Enum values**

| Value |
|-------|
| `dolt` |
| `doltgres` |
| `mysql_with_dolt_replicas` |

---

## DeploymentRole {#model-deploymentrole}
The authenticated caller's role on this deployment. Always present on a read, since a caller without at least read access cannot retrieve the deployment at all.

**Enum values**

| Value |
|-------|
| `admin` |
| `writer` |
| `reader` |
| `reader_and_pulls` |

---

## DeploymentSummary {#model-deploymentsummary}
A deployment as it appears in a list.

This is deliberately not the same shape as `Deployment`. The list RPC returns a narrower record — it omits connection details, the caller's role, and the creation audit fields, and it adds the last-backup figures shown in fleet views. Read the deployment itself for the full resource. As with `Deployment`, database credentials are never included.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | `string` | yes | The user or organization that owns the deployment. |
| `name` | `string` | yes | The deployment name, unique within the owner. |
| `state` | [`DeploymentState`](/products/hosted/api/v1/models#model-deploymentstate) | yes | The deployment's lifecycle state. `starting` covers both initial provisioning and a restart; poll this field to observe a create or a resize reaching `started`. |
| `cloud` | [`CloudProvider`](/products/hosted/api/v1/models#model-cloudprovider) | yes | The cloud the deployment runs in. |
| `zone` | `string` | yes | The cloud region the deployment runs in. |
| `cluster_type` | [`ClusterType`](/products/hosted/api/v1/models#model-clustertype) | yes | The database engine the deployment runs. `mysql_with_dolt_replicas` is a MySQL primary with Dolt read replicas. |
| `instance_type_name` | `string` | no | The display name of the deployment's instance type. |
| `volume_type_name` | `string` | no | The display name of the deployment's storage type. |
| `volume_size_gb` | `integer` | no | The size of the deployment's storage volume, in gigabytes. |
| `replicas` | `integer` | no | The number of read replicas. `0` for a single-instance deployment. |
| `database_version` | `string` | no | The version of the database engine the deployment is running — a Dolt version for a `dolt` cluster, a Doltgres version for a `doltgres` one. |
| `hourly_cost_usd` | `number` | no | The deployment's current cost per hour, in US dollars. |
| `webpki_cert` | `boolean` | no | Whether the deployment serves a publicly-trusted (WebPKI) TLS certificate. |
| `last_backup_size_bytes` | `integer` | no | Size of the most recent backup, in bytes. Absent when no backup has been taken or its size has not been computed yet. |
| `last_backup_time` | `string` | no | When the most recent backup was taken. Absent when no backup has been taken. |

---

## DisableAccepted {#model-disableaccepted}
Confirmation that a deployment's shutdown was accepted. Deliberately minimal: it reports only what is certain once the shutdown commits. `GET` the deployment for its full state.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | `string` | yes | The user or organization that owns the deployment. |
| `name` | `string` | yes | The deployment name. |
| `state` | [`DeploymentState`](/products/hosted/api/v1/models#model-deploymentstate) | yes | The deployment's lifecycle state. `starting` covers both initial provisioning and a restart; poll this field to observe a create or a resize reaching `started`. |

---

## PullState {#model-pullstate}
Where a pull request is in its life. `merged` is terminal and set once Hosted has recorded the merge; `closed` means it was abandoned without merging.

**Enum values**

| Value |
|-------|
| `open` |
| `closed` |
| `merged` |

---

## PullActivity {#model-pullactivity}
Something that happened to a pull request. `branch_deleted` is recorded when a branch the pull request uses is deleted, including when a successful merge deletes the source branch. `database_dropped` is recorded when the pull request's database is dropped.

**Enum values**

| Value |
|-------|
| `opened` |
| `merged` |
| `closed` |
| `branch_deleted` |
| `database_dropped` |

---

## PullActivityLogEntry {#model-pullactivitylogentry}
One entry in a pull request's activity log.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | The entry's identifier, unique within the pull request. |
| `activity` | [`PullActivity`](/products/hosted/api/v1/models#model-pullactivity) | yes | Something that happened to a pull request. `branch_deleted` is recorded when a branch the pull request uses is deleted, including when a successful merge deletes the source branch. `database_dropped` is recorded when the pull request's database is dropped. |
| `user` | `string` | yes | The username the activity is attributed to. Empty when Hosted recorded the activity rather than a person. |
| `logged_at` | `string` | yes |  |

---

## CreatePullCommentRequest {#model-createpullcommentrequest}
A comment to add to a pull request.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `comment` | `string` | yes | The comment body. |

---

## PullComment {#model-pullcomment}
A comment on a pull request.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | The comment's identifier, unique within the pull request. |
| `author` | `string` | yes | The username of the user who wrote the comment. |
| `comment` | `string` | yes | The comment body. |
| `created_at` | `string` | yes |  |
| `updated_at` | `string` | yes | Equal to `created_at` until the comment is edited. |

---

## Pull {#model-pull}
A proposal to merge one branch into another within a deployment's database.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | The pull request's identifier, unique within the deployment. |
| `database` | `string` | yes | The database the pull request belongs to. |
| `title` | `string` | yes |  |
| `description` | `string` | no | Absent when the pull request has no description. |
| `from_branch` | `string` | yes | The branch being merged, as a bare branch name. |
| `to_branch` | `string` | yes | The branch being merged into, as a bare branch name. |
| `state` | [`PullState`](/products/hosted/api/v1/models#model-pullstate) | yes | Where a pull request is in its life. `merged` is terminal and set once Hosted has recorded the merge; `closed` means it was abandoned without merging. |
| `creator` | `string` | yes | The username of the user who opened the pull request. |
| `created_at` | `string` | yes |  |
| `comment_count` | `integer` | yes | How many comments the pull request has. |
| `after_merge_commit` | `string` | no | The commit the merge produced. Present only once `state` is `merged`. |

---

## Deployment {#model-deployment}
A Hosted Dolt deployment.

v1 returns configuration and lifecycle state only. The deployment's database credentials are deliberately **not** part of this resource — they are issued and rotated through the deployment credentials endpoints, so that reading a deployment is never a credential-disclosing operation.

Provider-specific private-networking configuration (AWS PrivateLink, GCP Private Service Connect, Azure Private Link) is not included in v1.0. Each carries its own endpoint collection and provisioning state, and will land as its own sub-resource; adding it is additive under the stability policy.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | `string` | yes | The user or organization that owns the deployment. |
| `name` | `string` | yes | The deployment name, unique within the owner. |
| `state` | [`DeploymentState`](/products/hosted/api/v1/models#model-deploymentstate) | yes | The deployment's lifecycle state. `starting` covers both initial provisioning and a restart; poll this field to observe a create or a resize reaching `started`. |
| `cloud` | [`CloudProvider`](/products/hosted/api/v1/models#model-cloudprovider) | yes | The cloud the deployment runs in. |
| `zone` | `string` | yes | The cloud region the deployment runs in. |
| `cluster_type` | [`ClusterType`](/products/hosted/api/v1/models#model-clustertype) | yes | The database engine the deployment runs. `mysql_with_dolt_replicas` is a MySQL primary with Dolt read replicas. |
| `instance_type_name` | `string` | no | The display name of the deployment's instance type. Note this is the *name*, not the id that `POST /api/v1/deployments` accepts; both are listed by the deployment options endpoint. |
| `volume_type_name` | `string` | no | The display name of the deployment's storage type. As with `instance_type_name`, this is the name rather than the id used to create a deployment. |
| `volume_size_gb` | `integer` | no | The size of the deployment's storage volume, in gigabytes. |
| `replicas` | `integer` | no | The number of read replicas. `0` for a single-instance deployment. |
| `database_version` | `string` | no | The version of the database engine the deployment is running — a Dolt version for a `dolt` cluster, a Doltgres version for a `doltgres` one. |
| `host` | `string` | no | The hostname clients connect to. Empty until the deployment reaches `started`. |
| `port` | `integer` | no | The port clients connect to. |
| `hourly_cost_usd` | `number` | no | The deployment's current cost per hour, in US dollars. |
| `webpki_cert` | `boolean` | no | Whether the deployment serves a publicly-trusted (WebPKI) TLS certificate rather than a Hosted-issued one. |
| `expose_remotesapi_endpoint` | `boolean` | no | Whether the deployment exposes a Dolt remotes API endpoint. |
| `expose_mcp` | `boolean` | no | Whether the deployment exposes an MCP endpoint. |
| `expose_stats` | `boolean` | no | Whether the deployment exposes a statistics endpoint. |
| `disable_automatic_dolt_updates` | `boolean` | no | Whether automatic Dolt version updates are disabled for this deployment. |
| `caller_role` | [`DeploymentRole`](/products/hosted/api/v1/models#model-deploymentrole) | yes | The authenticated caller's role on this deployment. Always present on a read, since a caller without at least read access cannot retrieve the deployment at all. |
| `created_by` | `string` | no | The username of the user who created the deployment. |
| `created_at` | `string` | yes | When the deployment was created. |
| `disabled_at` | `string` | no | When the deployment is scheduled to shut down. Absent unless it has been disabled. |
| `disabled_by` | `string` | no | The username of the user who disabled the deployment. Absent unless it has been disabled. |

