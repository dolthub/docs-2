---
title: "Operation"
description: Polling background work in the Hosted v1 API.
---

# Operation

Work Hosted carries out in the background. Endpoints that queue it return an operation id you can poll here.

## Get the status of queued work {#getOperation}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v1/operations/{id}</code>

Returns the status of a single operation, such as a Dolt version roll or a backup. The id comes from whichever endpoint queued the work.

An operation is `queued` until Hosted picks it up, `running` once it is under way, and then `succeeded` or `failed`. Only those last two are final, so poll until you see one. Completion depends on the action: a version roll waits for instance observations, while a reboot succeeds when its platform accepts the request, before the database is necessarily available. Some actions have no completion signal and remain running until timeout finalization.

A `failed` operation carries an `error.code`. `EXPIRED` means the dispatch window elapsed without confirmation. `FAILED` means execution reported an error or its outcome could not be confirmed before timeout finalization. Neither proves the work had no effects: status reports can be lost and some instances may have applied the request. Check the deployment's state before resubmitting, especially for reboots and credential changes.

Polling reports persisted states. Overdue work remains queued or running until a report or the timeout sweeper records a terminal outcome. Timeout finalization does not cancel work, and a failed operation does not imply rollback.

Poll with a delay and backoff on transient HTTP errors. An HTTP error reading this resource is not an operation failure and is not a reason to submit the action again.

An operation is readable by anyone who can read the deployment it was submitted against. One belonging to a deployment you cannot read is a `404`, not a `403`, so a `404` here does not prove the operation does not exist.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `id` | path | string | yes | The operation's identifier, as returned by the endpoint that queued it. |

**Example request**

```sh
curl -X GET 'https://hosted.doltdb.com/api/v1/operations/{id}' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The operation. | [`Operation`](/products/hosted/api/v1/models#model-operation) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `503` | The service is temporarily unavailable. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example responses `200`**

_A Dolt version roll still running._

```json
{
  "data": {
    "id": "3f2a9c14-8e7b-4d21-9a05-6c3e1b8f4d72",
    "type": "update_dolt",
    "status": "running",
    "cancelable": false,
    "created_at": "2026-09-16T14:02:11Z",
    "updated_at": "2026-09-16T14:02:19Z"
  }
}
```

_The same roll, once every instance reported the new version._

```json
{
  "data": {
    "id": "3f2a9c14-8e7b-4d21-9a05-6c3e1b8f4d72",
    "type": "update_dolt",
    "status": "succeeded",
    "cancelable": false,
    "created_at": "2026-09-16T14:02:11Z",
    "updated_at": "2026-09-16T14:03:47Z"
  }
}
```

_A backup that was never picked up._

```json
{
  "data": {
    "id": "91b7d0e5-3c62-4f88-a1de-27b940fa6c39",
    "type": "create_backup",
    "status": "failed",
    "cancelable": false,
    "error": {
      "code": "EXPIRED"
    },
    "created_at": "2026-09-16T09:15:00Z",
    "updated_at": "2026-09-16T09:15:00Z"
  }
}
```

