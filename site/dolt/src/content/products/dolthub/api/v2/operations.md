---
title: "Operations"
description: Long-running async operations in the DoltHub v2 API.
---

# Operations

Long-running async operations. Every async mutation returns an OperationRef; poll this resource to track progress.

## List a database's async operations {#listOperations}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v2/databases/{owner}/{database}/operations</code>

Returns the async operations (imports, merges, SQL writes, forks, …) recorded against the database `{owner}/{database}`, ordered by the backend. Cursor-paginated via `page_token` (request) / `meta.next_page_token` (response); when `next_page_token` is absent or empty there are no further pages. Public databases are readable without authentication; private databases require a credential with access (and return `404` otherwise, so their existence isn't leaked). Each entry is the same `Operation` shape `GET /api/v2/operations/{id}` returns — `data[i].id` is what you pass to that endpoint to re-poll a single operation.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |
| `page_token` | query | string | no | Opaque cursor returned in a prior response's `meta.next_page_token`. Pass it back to fetch the next page; omit it on the first request. The token format is server-defined — clients must treat it as an opaque string. |

**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/operations' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The database's async operations. | [`Operation[]`](models#model-operation) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

---

## Get an async operation {#getOperation}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v2/operations/{operation_id}</code>

Polls a long-running operation by its `id`. Every async mutation (SQL write, import, merge, fork) returns an `OperationRef` in its `202` response; clients poll this endpoint until `status` is `succeeded` or `failed`. The `id` is the job resource name returned by the backend.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `operation_id` | path | string | yes | The operation ID returned in an `OperationRef`. |

**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/operations/{operation_id}' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The current state of the operation. | [`Operation`](models#model-operation) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

