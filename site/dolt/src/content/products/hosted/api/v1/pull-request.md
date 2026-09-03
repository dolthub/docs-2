---
title: "Pull Request"
description: Reading the pull requests in a deployment database, with their comments and activity.
---

# Pull Request

Proposals to merge one branch into another within a deployment's database. Merging itself is done in the Hosted web UI, not through this API.

## List a database's pull requests {#listDeploymentPulls}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v1/deployments/{owner}/{deployment}/pulls</code>

Returns the pull requests for one database in `{owner}/{deployment}`, newest first.

Pull requests belong to a deployment but are scoped to a database within it, so `database` is required — a deployment can host several, and their pull requests are unrelated.

Merging is not part of this API. Merge a pull request in the Hosted web UI; `state` here reports the result.

Pages hold up to 20 pull requests and the size is not caller-controlled. Do not infer the end of the list from how many came back — a full page can still be the last one. `meta.next_page_token` is the only signal that there is more, and its absence is the only signal that there is not.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the deployment. 3–32 characters of letters, digits, hyphens, and underscores. |
| `deployment` | path | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |
| `database` | query | string | yes | The database within the deployment whose pull requests to list. |
| `state` | query | [`PullState`](/products/hosted/api/v1/models#model-pullstate) | no | Return only pull requests in this state. All states when omitted. |
| `query` | query | string | no | Free-text filter matched as a substring against the pull request's title and its creator's username, case-insensitively. Matched literally: it is not a pattern, and characters with meaning in SQL patterns carry none here. |
| `page_token` | query | string | no | The `next_page_token` from a previous response. Opaque — do not construct or parse it. |

**Example request**

```sh
curl -X GET 'https://hosted.doltdb.com/api/v1/deployments/{owner}/{deployment}/pulls?database=inventory' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The database's pull requests. | [`Pull[]`](/products/hosted/api/v1/models#model-pull) |
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
      "id": "42",
      "database": "inventory",
      "title": "Add supplier table",
      "description": "Adds the supplier table and backfills it.",
      "from_branch": "add-suppliers",
      "to_branch": "main",
      "state": "open",
      "creator": "acme-ops",
      "created_at": "2026-08-11T09:14:00Z",
      "comment_count": 2
    }
  ]
}
```

---

## List a pull request's comments {#listDeploymentPullComments}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v1/deployments/{owner}/{deployment}/pulls/{id}/comments</code>

Returns every comment on one pull request, oldest first.

The list is not paginated: a pull request reports its comments whole.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the deployment. 3–32 characters of letters, digits, hyphens, and underscores. |
| `deployment` | path | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |
| `id` | path | string | yes | The pull request's id, as reported by the pull request list. |

**Example request**

```sh
curl -X GET 'https://hosted.doltdb.com/api/v1/deployments/{owner}/{deployment}/pulls/{id}/comments' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The pull request's comments. | [`PullComment[]`](/products/hosted/api/v1/models#model-pullcomment) |
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
      "id": "6f8f57c2-9a1e-4a3b-8f2d-1c4b5a6e7d80",
      "author": "acme-ops",
      "comment": "Backfill looks right to me.",
      "created_at": "2026-08-11T10:02:00Z",
      "updated_at": "2026-08-11T10:02:00Z"
    },
    {
      "id": "9d2c1b4a-7e6f-4c5d-9a8b-0f1e2d3c4b5a",
      "author": "acme-dev",
      "comment": "Can we add an index on supplier_id?",
      "created_at": "2026-08-11T11:20:00Z",
      "updated_at": "2026-08-11T11:24:00Z"
    }
  ]
}
```

---

## Comment on a pull request {#createDeploymentPullComment}
<span class="api-method" style="background:#6DB0FC">POST</span> <code class="api-path">/api/v1/deployments/{owner}/{deployment}/pulls/{id}/comments</code>

Adds a comment to one pull request and returns the comment that was created.

Any token that can read the deployment can comment.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the deployment. 3–32 characters of letters, digits, hyphens, and underscores. |
| `deployment` | path | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |
| `id` | path | string | yes | The pull request's id, as reported by the pull request list. |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `comment` | string | yes | The comment body. |

**Example request**

```sh
curl -X POST 'https://hosted.doltdb.com/api/v1/deployments/{owner}/{deployment}/pulls/{id}/comments' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"comment":"Backfill looks right to me."}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `201` | The comment that was created. | [`PullComment`](/products/hosted/api/v1/models#model-pullcomment) |
| `400` | The request was malformed or failed input validation. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `422` | The request was well-formed but semantically invalid. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](/products/hosted/api/v1/models#model-problem) |
| `503` | The service is temporarily unavailable. | [`Problem`](/products/hosted/api/v1/models#model-problem) |

**Example response `201`**

```json
{
  "data": {
    "id": "6f8f57c2-9a1e-4a3b-8f2d-1c4b5a6e7d80",
    "author": "acme-ops",
    "comment": "Backfill looks right to me.",
    "created_at": "2026-08-11T10:02:00Z",
    "updated_at": "2026-08-11T10:02:00Z"
  }
}
```

---

## List a pull request's activity log {#listDeploymentPullLogs}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v1/deployments/{owner}/{deployment}/pulls/{id}/logs</code>

Returns the record of what has happened to one pull request — opened, closed, merged, and the branch or database deletions that closed it — oldest first.

The list is not paginated: a pull request reports its activity whole.

An entry's `user` is empty when the activity was recorded by Hosted rather than by a person.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the deployment. 3–32 characters of letters, digits, hyphens, and underscores. |
| `deployment` | path | string | yes | The deployment name, unique within the owner. 3–32 characters of letters, digits, hyphens, and underscores. |
| `id` | path | string | yes | The pull request's id, as reported by the pull request list. |

**Example request**

```sh
curl -X GET 'https://hosted.doltdb.com/api/v1/deployments/{owner}/{deployment}/pulls/{id}/logs' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The pull request's activity log. | [`PullActivityLogEntry[]`](/products/hosted/api/v1/models#model-pullactivitylogentry) |
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
      "id": "4b8a1f2c-3d5e-4a6b-8c9d-0e1f2a3b4c5d",
      "activity": "opened",
      "user": "acme-ops",
      "logged_at": "2026-08-11T09:14:00Z"
    },
    {
      "id": "c1d2e3f4-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
      "activity": "merged",
      "user": "acme-admin",
      "logged_at": "2026-08-12T16:40:00Z"
    },
    {
      "id": "7e6d5c4b-3a2f-4e1d-9c8b-7a6f5e4d3c2b",
      "activity": "branch_deleted",
      "user": "acme-admin",
      "logged_at": "2026-08-12T16:40:01Z"
    }
  ]
}
```

