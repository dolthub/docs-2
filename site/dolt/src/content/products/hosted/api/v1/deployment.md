---
title: "Deployment"
description: Creating, listing, and reading Hosted Dolt deployments and their instances.
---

# Deployment

Hosted Dolt deployments and their lifecycle.

## List the options a deployment can be created with {#getDeploymentOptions}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v1/deployment-options</code>

Returns the zones, instance types, and storage options available for a cloud, so a caller can construct a valid `POST /api/v1/deployments` request.

The options narrow in steps, because each depends on the one before it. Supply `cloud` alone for its zones; add `zone` to also get that zone's instance types; add `instance_type_id` to also get the storage options compatible with that instance. Fields you haven't narrowed enough to determine are absent rather than empty.

Each list is filtered to what you selected: supplying `zone` narrows `zones` to that zone, and supplying `instance_type_id` narrows `instance_types` to that instance type. A fully narrowed request therefore describes one combination rather than repeating the whole catalogue.

A `zone` or `instance_type_id` that doesn't exist is a `422` rather than an empty result, so a typo can't be mistaken for a combination with nothing available. `instance_type_id` requires `zone`; supplying it alone is a `400`.

The `id` of an instance type or storage option is what `POST /api/v1/deployments` accepts; `name` is for display.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `cloud` | query | string | yes | The cloud to list options for. |
| `zone` | query | string | no | A zone from this cloud's `zones`. Supply it to receive `instance_types`. |
| `instance_type_id` | query | string | no | An instance type `id` from `instance_types`. Supply it, together with `zone`, to receive `storage_options`. |

**Example request**

```sh
curl -X GET 'https://hosted.doltdb.com/api/v1/deployment-options?cloud=aws' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The available options, narrowed by the supplied parameters. | [`DeploymentOptions`](/products/hosted/api/v1/models#model-deploymentoptions) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `422` | The request was well-formed but semantically invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `503` | The service is temporarily unavailable. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example response `200`**

```json
{
  "data": {
    "cloud": "aws",
    "zones": [
      "us-east-1"
    ],
    "instance_types": [
      {
        "id": "aws.t2.medium",
        "name": "t2.medium",
        "cpus": 2,
        "memory_gb": 4,
        "description": "Trial tier, the lowest spec that runs a Dolt SQL server.",
        "hourly_cost_usd": 0.06849315
      }
    ],
    "storage_options": [
      {
        "id": "aws.ebs.gp3_50",
        "name": "Trial 50GB EBS",
        "description": "Trial tier storage capped at 50GB",
        "min_size_gb": 50,
        "max_size_gb": 50,
        "monthly_cost_usd_per_gb": 0
      }
    ]
  }
}
```

---

## Create a deployment {#createDeployment}
<span class="api-method" style="background:#6DB0FC">POST</span> <code class="api-path">/api/v1/deployments</code>

Provisions a new deployment and returns `202` with the deployment in its `starting` state. Provisioning continues after the response: poll `GET /api/v1/deployments/{owner}/{deployment}` until `state` becomes `started`.

Deployment names are unique within an owner, so a create is idempotent by name — a retry after an ambiguous failure returns `409` rather than provisioning a second deployment. Callers should still treat `409` as "it already exists", not as a different failure.

`instance_type_id` and `volume_type_id` take the **ids** from the deployment options endpoint, not the display names a deployment reports back on a read.

As with any create, a `5xx` or a dropped connection does not tell you whether the deployment was created — the call can succeed remotely and fail on the way back. Retry: it returns `409` if the deployment now exists, and `GET` confirms either way.

**Creating a deployment incurs cost.**


**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | string | yes | The user or organization that will own the deployment. The caller must have permission to create deployments for it. 3–32 characters of letters, digits, hyphens, and underscores. |
| `name` | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |
| `cloud` | string | yes | The cloud the deployment runs in. |
| `zone` | string | yes | The cloud region to provision in, as listed by the deployment options. |
| `cluster_type` | string | no | The database engine the deployment runs. `mysql_with_dolt_replicas` is a MySQL primary with Dolt read replicas. |
| `instance_type_id` | string | yes | The **id** of the instance type, from the deployment options endpoint. Note a deployment reports `instance_type_name` on a read — the id and the display name are different values. |
| `volume_type_id` | string | yes | The **id** of the storage type, from the deployment options endpoint. As with `instance_type_id`, this is the id rather than the display name. |
| `volume_size_gb` | integer | yes | The size of the storage volume, in gigabytes. Must fall within the selected storage type's supported range. |
| `replicas` | integer | no | The number of read replicas. Defaults to `0` when omitted. |
| `webpki_cert` | boolean | no | Serve a publicly-trusted (WebPKI) TLS certificate rather than a Hosted-issued one. Defaults to `false` when omitted. |
| `expose_remotesapi_endpoint` | boolean | no | Expose a Dolt remotes API endpoint. Defaults to `false` when omitted. |
| `expose_mcp` | boolean | no | Expose an MCP endpoint. Defaults to `false` when omitted. |
| `expose_stats` | boolean | no | Expose a statistics endpoint. Defaults to `false` when omitted. |

**Example request**

```sh
curl -X POST 'https://hosted.doltdb.com/api/v1/deployments' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"owner":"acme","name":"analytics","cloud":"aws","zone":"us-east-1","instance_type_id":"aws.t2.medium","volume_type_id":"aws.ebs.gp3_50","volume_size_gb":50}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `202` | The deployment has been accepted and is provisioning. `state` is `starting`. | [`Deployment`](/products/hosted/api/v1/models#model-deployment) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `409` | The request conflicts with the current state of the resource (e.g. it already exists). | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `422` | The request was well-formed but semantically invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `503` | The service is temporarily unavailable. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example response `202`**

```json
{
  "data": {
    "owner": "acme",
    "name": "analytics",
    "state": "starting",
    "cloud": "aws",
    "zone": "us-east-1",
    "cluster_type": "dolt",
    "instance_type_name": "t2.medium",
    "volume_type_name": "Trial 50GB EBS",
    "volume_size_gb": 50,
    "replicas": 0,
    "host": "",
    "port": 3306,
    "caller_role": "admin",
    "created_by": "acme-ops",
    "created_at": "2026-08-11T09:14:00Z"
  }
}
```

---

## List an owner's deployments {#listDeployments}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v1/deployments/{owner}</code>

Returns the deployments belonging to `{owner}` that the caller can see, newest cursor page first. Requires a credential with access to the owner.

Items are `DeploymentSummary`, not the full `Deployment` — the backing RPC returns a narrower shape for lists. Fetch `GET /api/v1/deployments/{owner}/{deployment}` for the complete resource.

Pagination is cursor-based: when `meta.next_page_token` is present, pass it back as `page_token` to fetch the next page. On the last page `meta` is omitted entirely, so presence of the token is the only check a client needs.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization whose deployments to list. 3–32 characters of letters, digits, hyphens, and underscores. |
| `page_token` | query | string | no | The `meta.next_page_token` from a previous response. Omit for the first page. |
| `state` | query | string | no | Return only deployments in this state. Omit for all states. |

**Example request**

```sh
curl -X GET 'https://hosted.doltdb.com/api/v1/deployments/{owner}' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The owner's deployments. | [`DeploymentSummary[]`](/products/hosted/api/v1/models#model-deploymentsummary) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example response `200`**

```json
{
  "data": [
    {
      "owner": "acme",
      "name": "analytics",
      "state": "started",
      "cloud": "aws",
      "zone": "us-west-2",
      "cluster_type": "dolt",
      "instance_type_name": "m5.large",
      "volume_type_name": "gp3",
      "volume_size_gb": 100,
      "replicas": 0,
      "database_version": "1.58.4",
      "hourly_cost_usd": 0.192,
      "webpki_cert": true
    }
  ],
  "meta": {
    "next_page_token": "eyJvZmZzZXQiOjI1fQ"
  }
}
```

---

## Get a deployment {#getDeployment}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v1/deployments/{owner}/{deployment}</code>

Returns the deployment `{owner}/{deployment}`. Requires a credential with at least read access; a deployment the caller cannot see returns `404` rather than `403`, so its existence isn't leaked.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the deployment. 3–32 characters of letters, digits, hyphens, and underscores. |
| `deployment` | path | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |

**Example request**

```sh
curl -X GET 'https://hosted.doltdb.com/api/v1/deployments/{owner}/{deployment}' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The deployment. | [`Deployment`](/products/hosted/api/v1/models#model-deployment) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `503` | The service is temporarily unavailable. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example response `200`**

```json
{
  "data": {
    "owner": "acme",
    "name": "analytics",
    "state": "started",
    "cloud": "aws",
    "zone": "us-east-1",
    "cluster_type": "dolt",
    "instance_type_name": "t2.medium",
    "volume_type_name": "Trial 50GB EBS",
    "volume_size_gb": 50,
    "replicas": 0,
    "database_version": "1.58.4",
    "host": "analytics.dbs.hosted.doltdb.com",
    "port": 3306,
    "hourly_cost_usd": 0.06849315,
    "webpki_cert": true,
    "expose_remotesapi_endpoint": false,
    "expose_mcp": false,
    "expose_stats": false,
    "disable_automatic_dolt_updates": false,
    "caller_role": "admin",
    "created_by": "acme-ops",
    "created_at": "2026-07-01T18:22:04Z"
  }
}
```

---

## List a deployment's instances {#listDeploymentInstances}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v1/deployments/{owner}/{deployment}/instances</code>

Returns the instances backing `{owner}/{deployment}` — one for a single-instance deployment, or a primary plus its read replicas.

Stopped instances are not listed; starting, started, and stopping ones all are. So an instance appearing here is part of the deployment but not necessarily serving traffic, and an empty array means it has none outside the stopped state — normal while a deployment is itself `starting`.

The list is not paginated: a deployment has a primary and its replicas, a set small enough to return whole.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the deployment. 3–32 characters of letters, digits, hyphens, and underscores. |
| `deployment` | path | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |

**Example request**

```sh
curl -X GET 'https://hosted.doltdb.com/api/v1/deployments/{owner}/{deployment}/instances' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The deployment's non-stopped instances. | [`DeploymentInstance[]`](/products/hosted/api/v1/models#model-deploymentinstance) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `503` | The service is temporarily unavailable. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example response `200`**

```json
{
  "data": [
    {
      "id": "9b1f5c2e-4d3a-4f8b-9c0d-1e2f3a4b5c6d",
      "index": 0,
      "is_primary": true,
      "host": "analytics-0.dbs.hosted.doltdb.com",
      "instance_type_name": "t2.medium",
      "volume_type_name": "Trial 50GB EBS",
      "volume_size_gb": 50,
      "hourly_cost_usd": 0.06849315
    },
    {
      "id": "2c4e6a8b-1d3f-4a5c-8e9b-0f1a2b3c4d5e",
      "index": 1,
      "is_primary": false,
      "host": "analytics-1.dbs.hosted.doltdb.com",
      "instance_type_name": "t2.medium",
      "volume_type_name": "Trial 50GB EBS",
      "volume_size_gb": 50,
      "hourly_cost_usd": 0.06849315
    }
  ]
}
```

---

## Add a read replica to a deployment {#addDeploymentInstance}
<span class="api-method" style="background:#6DB0FC">POST</span> <code class="api-path">/api/v1/deployments/{owner}/{deployment}/instances</code>

Adds an instance to `{owner}/{deployment}` and returns `202` with the new instance, which is still being provisioned and so has no `host` yet. Poll `GET /api/v1/deployments/{owner}/{deployment}/instances` until that instance reports a `host`; that is when it is reachable. There is no per-instance state field to watch.

This is also how a disabled deployment is started again: adding an instance clears the shutdown and brings it back to `starting`. Pass `backup_id` to restore a backup into it, or it comes back empty.

`instance_type_id` and `volume_type_id` take the **ids** from the deployment options endpoint, not the display names an instance reports on a read.

Instances can only be added when the deployment is settled. If it is stopping, or any instance is still starting or stopping, the request conflicts with the deployment's current state and is rejected with `409`. Retry once it settles.

As with any create, a `5xx` does not tell you whether the instance was added. List the instances to find out; a retry while the new instance is still starting is rejected with `409` rather than adding a second one.

**Adding a replica incurs cost.**


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the deployment. 3–32 characters of letters, digits, hyphens, and underscores. |
| `deployment` | path | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `instance_type_id` | string | yes | The **id** of the instance type, from the deployment options endpoint. Note an instance reports `instance_type_name` on a read — the id and the display name are different values. |
| `volume_type_id` | string | yes | The **id** of the storage type, from the deployment options endpoint. |
| `volume_size_gb` | integer | yes | The size of the instance's storage volume, in gigabytes. Must fall within the selected storage type's supported range. |
| `backup_id` | string | no | A backup of this deployment to restore into the new instance, from the backups list. Only valid when the deployment is disabled and this request is restarting it; supplying it otherwise is a `400`. Without it a restarted deployment comes up empty. |

**Example request**

```sh
curl -X POST 'https://hosted.doltdb.com/api/v1/deployments/{owner}/{deployment}/instances' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"instance_type_id":"aws.t2.medium","volume_type_id":"aws.ebs.gp3_50","volume_size_gb":50}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `202` | The instance has been accepted and is starting. | [`DeploymentInstance`](/products/hosted/api/v1/models#model-deploymentinstance) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `409` | The request conflicts with the current state of the resource (e.g. it already exists). | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example response `202`**

```json
{
  "data": {
    "id": "2c4e6a8b-1d3f-4a5c-8e9b-0f1a2b3c4d5e",
    "index": 1,
    "is_primary": false,
    "instance_type_name": "t2.medium",
    "volume_type_name": "Trial 50GB EBS",
    "volume_size_gb": 50
  }
}
```

---

## List a deployment's backups {#listDeploymentBackups}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v1/deployments/{owner}/{deployment}/backups</code>

Returns the backups held for `{owner}/{deployment}`, newest first. Deleted backups are not included.

The list is not paginated: a deployment's retained backups are a bounded set.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the deployment. 3–32 characters of letters, digits, hyphens, and underscores. |
| `deployment` | path | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |

**Example request**

```sh
curl -X GET 'https://hosted.doltdb.com/api/v1/deployments/{owner}/{deployment}/backups' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The deployment's backups. | [`Backup[]`](/products/hosted/api/v1/models#model-backup) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `503` | The service is temporarily unavailable. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example response `200`**

```json
{
  "data": [
    {
      "id": "20260812T020000.000",
      "databases": [
        "analytics",
        "staging"
      ],
      "instance_index": 0,
      "created_at": "2026-08-12T02:00:00Z"
    },
    {
      "id": "20260811T020000.000",
      "databases": [
        "analytics",
        "staging"
      ],
      "size_bytes": 1048576,
      "instance_index": 0,
      "created_at": "2026-08-11T02:00:00Z"
    }
  ]
}
```

---

## Get a deployment's configuration {#getDeploymentConfig}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v1/deployments/{owner}/{deployment}/config</code>

Returns the deployment's effective database configuration: every setting Hosted supports, carrying the deployment's own value where it has overridden one and the default otherwise. This is what the deployment's Configuration page shows.

`is_overridden` distinguishes the two, and `default` is always reported, so a caller can tell what has been changed and what it would revert to.

Values are strings as stored, including numeric and boolean settings.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the deployment. 3–32 characters of letters, digits, hyphens, and underscores. |
| `deployment` | path | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |

**Example request**

```sh
curl -X GET 'https://hosted.doltdb.com/api/v1/deployments/{owner}/{deployment}/config' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The deployment's effective configuration — every supported setting, at the value it is running. | [`DeploymentConfig`](/products/hosted/api/v1/models#model-deploymentconfig) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `503` | The service is temporarily unavailable. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example response `200`**

```json
{
  "data": {
    "settings": [
      {
        "key": "listener_max_connections",
        "value": "500",
        "default": "100",
        "is_overridden": true
      },
      {
        "key": "behavior_read_only",
        "value": "false",
        "default": "false",
        "is_overridden": false
      }
    ]
  }
}
```

---

## Disable a deployment {#disableDeployment}
<span class="api-method" style="background:#6DB0FC">POST</span> <code class="api-path">/api/v1/deployments/{owner}/{deployment}/disable</code>

Shuts the deployment down, tearing down its instances and their storage. Returns `202` with the deployment in `stopping`; poll `GET /api/v1/deployments/{owner}/{deployment}` until `state` is `stopped`.

**Take a backup first if you want the data.**

The deployment itself is not deleted. It stays readable with `disabled_at` and `disabled_by` set — which is why this is a `POST` to an action rather than a `DELETE` — and can be brought back by adding an instance with `POST /api/v1/deployments/{owner}/{deployment}/instances`; give that request a `backup_name` to restore the data, or it comes back empty.

Not idempotent: disabling a deployment that is already stopping or stopped returns `422`. The `202` only confirms acceptance — `GET` the deployment for its full state.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the deployment. 3–32 characters of letters, digits, hyphens, and underscores. |
| `deployment` | path | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |

**Example request**

```sh
curl -X POST 'https://hosted.doltdb.com/api/v1/deployments/{owner}/{deployment}/disable' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `202` | The teardown has been accepted. `state` is `stopping`. | [`DisableAccepted`](/products/hosted/api/v1/models#model-disableaccepted) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `422` | The request was well-formed but semantically invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `503` | The service is temporarily unavailable. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example response `202`**

```json
{
  "data": {
    "owner": "acme",
    "name": "analytics",
    "state": "stopping"
  }
}
```

---

## Remove an instance from a deployment {#deleteDeploymentInstance}
<span class="api-method" style="background:#EF5350">DELETE</span> <code class="api-path">/api/v1/deployments/{owner}/{deployment}/instances/{id}</code>

Removes an instance from `{owner}/{deployment}` and returns `202`. The instance is marked stopping and torn down in the background.

There is no per-instance state on this API, so completion is observed by the instance leaving `GET /api/v1/deployments/{owner}/{deployment}/instances` — that list reports only instances that have not stopped. An instance that is still present is either running or still stopping.

Instances can only be removed when the deployment is settled. If it is stopping, or any instance is still starting or stopping, the request conflicts with the deployment's current state and is rejected with `409`. Retry once it settles. Removing an instance that has already stopped is `422`.

**This removes a database server and the data on its volume.** It is meant for removing a read replica, so check `is_primary` on the instances list before picking an id: removing the primary shuts the deployment down. To do that, use `POST /api/v1/deployments/{owner}/{deployment}/disable`, which records `disabled_at` and `disabled_by` — removing the instance leaves the deployment with nothing running and no record of why.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the deployment. 3–32 characters of letters, digits, hyphens, and underscores. |
| `deployment` | path | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |
| `id` | path | string | yes | The instance's id, as reported by the instances list. |

**Example request**

```sh
curl -X DELETE 'https://hosted.doltdb.com/api/v1/deployments/{owner}/{deployment}/instances/{id}' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `202` | The removal has been accepted and the instance is stopping. | [`InstanceDeleteAccepted`](/products/hosted/api/v1/models#model-instancedeleteaccepted) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `409` | The request conflicts with the current state of the resource (e.g. it already exists). | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `422` | The request was well-formed but semantically invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example response `202`**

```json
{
  "data": {
    "id": "2c4e6a8b-1d3f-4a5c-8e9b-0f1a2b3c4d5e",
    "state": "stopping"
  }
}
```

