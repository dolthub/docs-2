---
title: "Operations"
description: Long-running async operations in the DoltHub v2 API.
---

# Operations

Long-running async operations. Every async mutation returns an OperationRef; poll this resource to track progress.

## Get an async operation {#getOperation}
`GET /api/v2/operations/{operation_id}`

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

