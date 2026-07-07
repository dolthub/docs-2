---
title: "Database"
description: DoltHub databases, branches, tags, forks, releases, SQL, pull requests, and imports.
---

# Database

DoltHub databases and their metadata.

## Databases

### Create a database {#createDatabase}
`POST /api/v2/databases`

Creates a database under the named owner (a user or organization). The caller's credentials must allow creating under that owner — creating for yourself works as long as you authenticate; creating for an organization requires membership with the appropriate role. Returns the new `Database` resource on `201`. If a database with the same `{owner, name}` already exists, the response is `409 Conflict`.


**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | string | yes | The user or organization that will own the database. |
| `name` | string | yes | The database name. Must be unique within the owner and conform to DoltHub's naming rules (letters, digits, `-`, `_`; cannot start or end with `-`). |
| `description` | string | no | Optional human-readable description. |
| `visibility` | string | yes | Whether the database is publicly readable. Defaults are *not* applied — clients must declare the intended visibility on create. |

**Example request**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"owner":"dolthub","name":"us-jails","visibility":"public"}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `201` | The newly-created database. | [`Database`](models#model-database) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `409` | The request conflicts with the current state of the resource (e.g. it already exists). | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `201`**

```json
{
  "data": {
    "owner": "dolthub",
    "name": "us-jails",
    "description": "Open data about incarceration in the United States.",
    "visibility": "public",
    "fork_network_count": 3,
    "star_count": 42,
    "size_bytes": 10485760,
    "last_write_at": "2024-01-15T12:34:56Z"
  }
}
```

---

### Get a database {#getDatabase}
`GET /api/v2/databases/{owner}/{database}`

Returns the metadata for the database `{owner}/{database}`. Public databases are readable without authentication; private databases require a credential with access (and return `404` otherwise, so their existence isn't leaked).


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |

**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/databases/{owner}/{database}' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The database's metadata. | [`Database`](models#model-database) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": {
    "owner": "dolthub",
    "name": "us-jails",
    "description": "Open data about incarceration in the United States.",
    "visibility": "public",
    "fork_network_count": 3,
    "star_count": 42,
    "size_bytes": 10485760,
    "last_write_at": "2024-01-15T12:34:56Z"
  }
}
```


## SQL

### Run a read-only SQL query {#runSqlReadQuery}
`GET /api/v2/databases/{owner}/{database}/sql`

Executes a read-only SQL query against the database at the given revision and returns the result rows, the column schema, and the query-execution status. Read queries are not paginated — the full row set comes back in one response, bounded by `limit` (default 1000) and the server-enforced row cap. For larger result sets, refine the query (`LIMIT`/`WHERE`/`SELECT` fewer columns) or use the phase-4 async SQL job.
SQL-level errors (syntax errors, missing tables, timeouts, row-limit exceeded) come back as `200` with `status: "error" | "timeout" | "row_limit" | "not_workspace"` and a human-readable `message` — they are query-level conditions, not transport-level failures. HTTP `4xx` / `5xx` are reserved for transport-level problems (auth, the database doesn't exist, malformed request).
Public databases are readable without authentication; private databases require a credential with access (and return `404` otherwise, so their existence isn't leaked).


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |
| `ref` | query | string | yes | The branch, tag, or commit hash to query against. A 32-character value using only the characters `0-9a-v` (Dolt's base32 alphabet) is treated as a commit hash; everything else resolves as a branch, tag, or other ref. |
| `q` | query | string | yes | The SQL query to execute. Read-only — use the phase-4 SQL write endpoint for mutations. |
| `limit` | query | string | no | Maximum number of rows to return (default `1000`). The server enforces an upper cap; refine the query or use the async SQL job for larger result sets. |
| `timeout_ms` | query | string | no | Per-query execution timeout in milliseconds (default `30000`, server-enforced cap `60000`). A query that hits the cap returns `status: "timeout"`. |

**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/sql' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The query result. SQL-level errors live in `status` + `message`. | [`QueryResult`](models#model-queryresult) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": {
    "columns": [
      {
        "name": "state_name",
        "type": "VARCHAR(255)",
        "is_primary_key": true,
        "source_table": "jails"
      },
      {
        "name": "count",
        "type": "BIGINT",
        "is_primary_key": false,
        "source_table": ""
      }
    ],
    "rows": [
      [
        "California",
        "162"
      ],
      [
        "Texas",
        "108"
      ],
      [
        null,
        "0"
      ]
    ],
    "status": "success",
    "warnings": []
  }
}
```

---

### Run a SQL query (read or write) {#runSqlPost}
`POST /api/v2/databases/{owner}/{database}/sql`

Dual-purpose `/sql` POST: discriminated by the request body shape. A `SqlReadRequest` body (`{ ref, q }`) runs a read identical to `GET /sql` — same response shape — but carries the query in the body to dodge the browser/proxy URL-length limit (~4–8 KB) that `?q=` hits for large SQL statements. A `SqlWriteRequest` body (`{ from_branch, to_branch, query }`) kicks off an asynchronous SQL write — running the write on `to_branch` (creating it from `from_branch` if it doesn't exist), then merging `from_branch` into `to_branch` — and returns `202` with an `OperationRef`; poll `GET /api/v2/operations/{id}` for completion. Authentication is required for writes; reads follow the database-level convention (public DBs readable without a token, private DBs require one).


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |

**Request body — `SqlReadRequest`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ref` | string | yes | The branch, tag, or commit hash to query against. A 32-character value using only the characters `0-9a-v` (Dolt's base32 alphabet) is treated as a commit hash; everything else resolves as a branch, tag, or other ref. |
| `q` | string | yes | The SQL query to execute. Read-only — mutations are rejected. |
| `limit` | integer | no | Maximum number of rows to return (default `1000`). |
| `timeout_ms` | integer | no | Per-query execution timeout in milliseconds (default `30000`, cap `60000`). |

**Request body — `SqlWriteRequest`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from_branch` | string | yes | The branch to merge from after the write completes. |
| `to_branch` | string | yes | The branch the write runs on. Created from `from_branch` when it doesn't already exist. |
| `query` | string | yes | The SQL write statement to execute. |

**Example request — `SqlReadRequest`**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/sql' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"ref":"main","q":"SELECT name, year FROM jails WHERE state = 'California' LIMIT 10"}'
```

**Example request — `SqlWriteRequest`**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/sql' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"from_branch":"main","to_branch":"feature/new-states","query":"INSERT INTO states (name, abbr) VALUES ('Puerto Rico', 'PR')"}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The read query result. SQL-level errors live in `status` + `message`. | [`QueryResult`](models#model-queryresult) |
| `202` | The write operation has been accepted and is queued. | [`OperationRef`](models#model-operationref) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": {
    "columns": [
      {
        "name": "state_name",
        "type": "VARCHAR(255)",
        "is_primary_key": true,
        "source_table": "jails"
      },
      {
        "name": "count",
        "type": "BIGINT",
        "is_primary_key": false,
        "source_table": ""
      }
    ],
    "rows": [
      [
        "California",
        "162"
      ],
      [
        "Texas",
        "108"
      ],
      [
        null,
        "0"
      ]
    ],
    "status": "success",
    "warnings": []
  }
}
```


## Branches

### List branches {#listBranches}
`GET /api/v2/databases/{owner}/{database}/branches`

Returns the branches of the database `{owner}/{database}`, ordered by the backend. Cursor-paginated via `page_token` (request) / `meta.next_page_token` (response); when `next_page_token` is absent or empty there are no further pages. Public databases are readable without authentication; private databases require a credential with access (and return `404` otherwise, so their existence isn't leaked).


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |
| `page_token` | query | string | no | Opaque cursor returned in a prior response's `meta.next_page_token`. Pass it back to fetch the next page; omit it on the first request. The token format is server-defined — clients must treat it as an opaque string. |

**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/branches' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The database's branches. | [`Branch[]`](models#model-branch) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": [
    {
      "name": "main",
      "head_commit_sha": "vt1u8gdsovtj0qq2qmd6he7n5o4mq2qm",
      "last_updated_at": "2024-01-15T12:34:56Z"
    }
  ],
  "meta": {
    "next_page_token": "eyJvZmZzZXQiOjI1fQ"
  }
}
```

---

### Create a branch {#createBranch}
`POST /api/v2/databases/{owner}/{database}/branches`

Creates a new branch in `{owner}/{database}` pointing at the source revision named by `from`. Authentication required; the caller must have write access. Returns the new `Branch` resource on `201`. A `409 Conflict` comes back if a branch with the same name already exists.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | The new branch's name. |
| `from` | object | yes |  |

**Example request**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/branches' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"feature-x","from":0}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `201` | The newly-created branch. | [`Branch`](models#model-branch) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `409` | The request conflicts with the current state of the resource (e.g. it already exists). | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `201`**

```json
{
  "data": {
    "name": "main",
    "head_commit_sha": "vt1u8gdsovtj0qq2qmd6he7n5o4mq2qm",
    "last_updated_at": "2024-01-15T12:34:56Z"
  }
}
```


## Tags

### List tags {#listTags}
`GET /api/v2/databases/{owner}/{database}/tags`

Returns the tags of the database `{owner}/{database}`, ordered by the backend. Cursor-paginated via `page_token` (request) / `meta.next_page_token` (response); when `next_page_token` is absent or empty there are no further pages. Public databases are readable without authentication; private databases require a credential with access (and return `404` otherwise, so their existence isn't leaked).


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |
| `page_token` | query | string | no | Opaque cursor returned in a prior response's `meta.next_page_token`. Pass it back to fetch the next page; omit it on the first request. The token format is server-defined — clients must treat it as an opaque string. |

**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/tags' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The database's tags. | [`Tag[]`](models#model-tag) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": [
    {
      "name": "v1.0.0",
      "commit_sha": "vt1u8gdsovtj0qq2qmd6he7n5o4mq2qm",
      "message": "First public release.",
      "tagged_at": "2024-01-15T12:34:56Z"
    }
  ],
  "meta": {
    "next_page_token": "eyJvZmZzZXQiOjI1fQ"
  }
}
```

---

### Create a tag {#createTag}
`POST /api/v2/databases/{owner}/{database}/tags`

Creates a new tag in `{owner}/{database}` pointing at the source revision named by `from`. The optional `message` makes the tag annotated; omitted yields a lightweight tag. Returns the new `Tag` resource on `201`. Authentication required; the caller must have write access. A `409 Conflict` comes back if a tag with the same name already exists.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | The new tag's name, unique within the database. |
| `from` | object | yes |  |
| `message` | string | no | Optional annotation message. Present → annotated tag; absent → lightweight tag. |

**Example request**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/tags' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"v1.0.0","from":0}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `201` | The newly-created tag. | [`Tag`](models#model-tag) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `409` | The request conflicts with the current state of the resource (e.g. it already exists). | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `201`**

```json
{
  "data": {
    "name": "v1.0.0",
    "commit_sha": "vt1u8gdsovtj0qq2qmd6he7n5o4mq2qm",
    "message": "First public release.",
    "tagged_at": "2024-01-15T12:34:56Z"
  }
}
```


## Forks

### List forks {#listForks}
`GET /api/v2/databases/{owner}/{database}/forks`

Returns the databases that have been directly forked from `{owner}/{database}` — immediate children only. Forks-of-forks are not flattened into the list; use `fork_network_count` on the `Database` resource for the transitive total. Topology context (`parent`, `network_root`, total `fork_network_count`) lives on the `Database` resource. Pagination (`page_token` / `meta.next_page_token`) will be added when the backend supports it; until then the full list is returned in one response. Public databases are readable without authentication; private databases require a credential with access (and return `404` otherwise, so their existence isn't leaked).


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |

**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/forks' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The database's direct fork children (immediate forks only). | [`DatabaseRef[]`](models#model-databaseref) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": [
    {
      "owner": "dolthub",
      "name": "us-jails"
    }
  ],
  "meta": {
    "next_page_token": "eyJvZmZzZXQiOjI1fQ"
  }
}
```

---

### Fork a database {#createFork}
`POST /api/v2/databases/{owner}/{database}/forks`

Forks `{owner}/{database}` into `owner`'s namespace. Returns `202` with an `OperationRef`; follow `OperationRef.href` to poll for completion (operation IDs contain slashes and must not be interpolated raw into path templates). The caller must have read access on the source database and may only fork into a namespace they own. Duplicate forks (same source forked twice into the same owner) surface as `422` via the standard error model. Authentication is required.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the source database. |
| `database` | path | string | yes | The source database name, unique within the owner. |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | string | yes | The user or organization that will own the new fork. |

**Example request**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/forks' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"owner":"taylor"}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `202` | The fork operation has been accepted and is queued. | [`OperationRef`](models#model-operationref) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `422` | The request was well-formed but semantically invalid. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |


## Releases

### List releases {#listReleases}
`GET /api/v2/databases/{owner}/{database}/releases`

Returns the releases of the database `{owner}/{database}`, ordered by the backend. Cursor-paginated via `page_token` (request) / `meta.next_page_token` (response); when `next_page_token` is absent or empty there are no further pages. Public databases are readable without authentication; private databases require a credential with access (and return `404` otherwise, so their existence isn't leaked).


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |
| `page_token` | query | string | no | Opaque cursor returned in a prior response's `meta.next_page_token`. Pass it back to fetch the next page; omit it on the first request. The token format is server-defined — clients must treat it as an opaque string. |

**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/releases' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The database's releases. | [`Release[]`](models#model-release) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": [
    {
      "tag": "v1.0.0",
      "title": "First public release",
      "commit_sha": "vt1u8gdsovtj0qq2qmd6he7n5o4mq2qm",
      "description": "## Highlights\n- new join planner",
      "created_at": "2024-01-15T12:34:56Z",
      "updated_at": "2024-01-15T12:34:56Z"
    }
  ],
  "meta": {
    "next_page_token": "eyJvZmZzZXQiOjI1fQ"
  }
}
```

---

### Create a release {#createRelease}
`POST /api/v2/databases/{owner}/{database}/releases`

Creates a release in `{owner}/{database}` pinned to the commit named by `commit_sha` and published under `tag`. When `create_tag_if_not_exists` is true and no tag with that name exists, the backend creates one pointing at the same commit; otherwise the tag must already exist and point at the same commit. Returns the new `Release` resource on `201`. Authentication required; the caller must have write access. A `409 Conflict` comes back if a release with the same tag already exists.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tag` | string | yes | The tag the release is published under, unique within the database. |
| `title` | string | yes | Human-readable title. |
| `commit_sha` | string | yes | The commit hash the release points at. |
| `description` | string | no | Optional release notes body (markdown). |
| `create_tag_if_not_exists` | boolean | no | When true and no tag named `tag` exists, create one pointing at `commit_sha`. Defaults to false — the caller is responsible for tag creation otherwise. |

**Example request**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/releases' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"tag":"v1.0.0","title":"First public release","commit_sha":"vt1u8gdsovtj0qq2qmd6he7n5o4mq2qm"}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `201` | The newly-created release. | [`Release`](models#model-release) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `409` | The request conflicts with the current state of the resource (e.g. it already exists). | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `201`**

```json
{
  "data": {
    "tag": "v1.0.0",
    "title": "First public release",
    "commit_sha": "vt1u8gdsovtj0qq2qmd6he7n5o4mq2qm",
    "description": "## Highlights\n- new join planner",
    "created_at": "2024-01-15T12:34:56Z",
    "updated_at": "2024-01-15T12:34:56Z"
  }
}
```


## Pull Requests

### List pull requests {#listPulls}
`GET /api/v2/databases/{owner}/{database}/pulls`

Returns the pull requests for the database `{owner}/{database}`, ordered by the backend. Cursor-paginated via `page_token` (request) / `meta.next_page_token` (response); when `next_page_token` is absent or empty there are no further pages. Public databases are readable without authentication; private databases require a credential with access (and return `404` otherwise, so their existence isn't leaked).


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |
| `page_token` | query | string | no | Opaque cursor returned in a prior response's `meta.next_page_token`. Pass it back to fetch the next page; omit it on the first request. The token format is server-defined — clients must treat it as an opaque string. |

**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/pulls' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The database's pull requests. | [`PullSummary[]`](models#model-pullsummary) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": [
    {
      "pull_number": 42,
      "title": "Fix join planner regression",
      "description": "Fixes #99.",
      "state": "open",
      "created_at": "2024-01-15T12:34:56Z",
      "creator": "dolthub"
    }
  ],
  "meta": {
    "next_page_token": "eyJvZmZzZXQiOjI1fQ"
  }
}
```

---

### Create a pull request {#createPull}
`POST /api/v2/databases/{owner}/{database}/pulls`

Opens a new pull request in `{owner}/{database}`. `to_branch.database` must equal the URL's `{owner}/{database}`. `from_branch.database` is usually the same; for a cross-fork pull it points at a fork — in that case the caller must have read access on the fork's database and the fork's network root must match the target. Returns the new `Pull` resource on `201`. Authentication is required.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | The pull request's title. |
| `description` | string | no | Optional pull-request body (markdown). |
| `from_branch` | object | yes | A reference to a branch within a specific database. Carries the database so callers can disambiguate cross-fork pull requests, where `from_branch` and `to_branch` may live in different repositories. |
| `to_branch` | object | yes | A reference to a branch within a specific database. Carries the database so callers can disambiguate cross-fork pull requests, where `from_branch` and `to_branch` may live in different repositories. |

**Example request**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/pulls' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Fix join planner regression","from_branch":{"database":{"owner":"dolthub","name":"us-jails"},"branch_name":"my-feature"},"to_branch":{"database":{"owner":"dolthub","name":"us-jails"},"branch_name":"my-feature"}}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `201` | The newly-created pull request. | [`Pull`](models#model-pull) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `409` | The request conflicts with the current state of the resource (e.g. it already exists). | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `201`**

```json
{
  "data": {
    "pull_number": 42,
    "title": "Fix join planner regression",
    "description": "Fixes #99.",
    "state": "open",
    "from_branch": {
      "database": {
        "owner": "dolthub",
        "name": "us-jails"
      },
      "branch_name": "my-feature"
    },
    "to_branch": {
      "database": {
        "owner": "dolthub",
        "name": "us-jails"
      },
      "branch_name": "main"
    },
    "created_at": "2024-01-15T12:34:56Z",
    "creator": "dolthub"
  }
}
```

---

### Get a pull request {#getPull}
`GET /api/v2/databases/{owner}/{database}/pulls/{pull_number}`

Returns the pull request `{pull_number}` in the database `{owner}/{database}`. Unlike the list endpoint, the per-pull resource exposes structured `from_branch` / `to_branch` references, each carrying the database the branch lives in — necessary to disambiguate cross-fork pulls where the source branch lives in a different repository. Public databases are readable without authentication; private databases require a credential with access (and return `404` otherwise, so their existence isn't leaked).


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |
| `pull_number` | path | string | yes | The per-database sequential pull-request identifier (à la GitHub PR numbers). |

**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/pulls/{pull_number}' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The requested pull request. | [`Pull`](models#model-pull) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": {
    "pull_number": 42,
    "title": "Fix join planner regression",
    "description": "Fixes #99.",
    "state": "open",
    "from_branch": {
      "database": {
        "owner": "dolthub",
        "name": "us-jails"
      },
      "branch_name": "my-feature"
    },
    "to_branch": {
      "database": {
        "owner": "dolthub",
        "name": "us-jails"
      },
      "branch_name": "main"
    },
    "created_at": "2024-01-15T12:34:56Z",
    "creator": "dolthub"
  }
}
```

---

### Update a pull request {#updatePull}
`PATCH /api/v2/databases/{owner}/{database}/pulls/{pull_number}`

Partially updates the pull request `{pull_number}` in `{owner}/{database}`. The body carries only the fields the caller is changing — any subset of `title`, `description`, `state`; at least one must be present. `state` is restricted to the writable transitions (`open` ↔ `closed`); merging happens via the dedicated merge operation (phase 4), not by writing state here. Returns the canonical `Pull` resource on `200`. Authentication required.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |
| `pull_number` | path | string | yes | The per-database sequential pull-request identifier. |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | no | New title; omit to leave unchanged. |
| `description` | string | no | New description body (markdown); omit to leave unchanged. |
| `state` | string | no | New state. Merging is a separate operation; this field can't transition to `merged`. |

**Example request**

```sh
curl -X PATCH 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/pulls/{pull_number}' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The updated pull request. | [`Pull`](models#model-pull) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": {
    "pull_number": 42,
    "title": "Fix join planner regression",
    "description": "Fixes #99.",
    "state": "open",
    "from_branch": {
      "database": {
        "owner": "dolthub",
        "name": "us-jails"
      },
      "branch_name": "my-feature"
    },
    "to_branch": {
      "database": {
        "owner": "dolthub",
        "name": "us-jails"
      },
      "branch_name": "main"
    },
    "created_at": "2024-01-15T12:34:56Z",
    "creator": "dolthub"
  }
}
```

---

### List a pull request's comments {#listPullComments}
`GET /api/v2/databases/{owner}/{database}/pulls/{pull_number}/comments`

Returns the top-level comments on pull request `{pull_number}` in `{owner}/{database}`, in the order the backend returns them. The backend doesn't paginate comments today, so the full list is returned in one response; if a comment volume hot spot appears, `page_token` / `meta.next_page_token` will be wired through without changing the resource shape. Diff-line comments and review comments are separate resources (not in v2 yet). Public databases are readable without authentication; private databases require a credential with access (and return `404` otherwise, so their existence isn't leaked).


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |
| `pull_number` | path | string | yes | The per-database sequential pull-request identifier (à la GitHub PR numbers). |

**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/pulls/{pull_number}/comments' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The pull request's comments. | [`PullComment[]`](models#model-pullcomment) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": [
    {
      "comment_id": "1c8f3b1e-5d2e-4a3a-9f2b-0e7a6d5c4b3a",
      "author": "alice",
      "body": "LGTM — one nit on the join planner case.",
      "created_at": "2024-01-15T12:34:56Z",
      "updated_at": "2024-01-15T12:34:56Z"
    }
  ],
  "meta": {
    "next_page_token": "eyJvZmZzZXQiOjI1fQ"
  }
}
```

---

### Add a top-level comment to a pull request {#createPullComment}
`POST /api/v2/databases/{owner}/{database}/pulls/{pull_number}/comments`

Posts a new top-level comment on pull request `{pull_number}` in `{owner}/{database}`. The body carries only the comment text; author and timestamps are server-assigned from the authenticated caller and the server clock. Returns the new `PullComment` on `201`. Diff-line and review comments are separate resources (not in v2 yet).


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |
| `pull_number` | path | string | yes | The per-database sequential pull-request identifier. |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `body` | string | yes | The comment text (markdown). |

**Example request**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/pulls/{pull_number}/comments' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"body":"LGTM — one nit on the join planner case."}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `201` | The newly-created comment. | [`PullComment`](models#model-pullcomment) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `201`**

```json
{
  "data": {
    "comment_id": "1c8f3b1e-5d2e-4a3a-9f2b-0e7a6d5c4b3a",
    "author": "alice",
    "body": "LGTM — one nit on the join planner case.",
    "created_at": "2024-01-15T12:34:56Z",
    "updated_at": "2024-01-15T12:34:56Z"
  }
}
```

---

### Merge a pull request {#mergePull}
`POST /api/v2/databases/{owner}/{database}/pulls/{pull_number}/merge`

Kicks off a merge of pull `{pull_number}` in `{owner}/{database}`. Returns `202` with an `OperationRef`; poll `GET /api/v2/operations/{id}` until `status` is `succeeded` (the operation's `result.pull_id` echoes the merged pull) or `failed`. The caller must have write access on the database. Preconditions like "pull is already merged" or "has conflicts" surface as `422` via the standard error model rather than being pre-checked here. Authentication is required.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |
| `pull_number` | path | string | yes | The pull request number (per-database sequential id). |

**Example request**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/pulls/{pull_number}/merge' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `202` | The merge operation has been accepted and is queued. | [`OperationRef`](models#model-operationref) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `422` | The request was well-formed but semantically invalid. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |


## Imports

### Initialize a multipart upload for an import {#createImportUpload}
`POST /api/v2/databases/{owner}/{database}/imports/uploads`

Starts a multipart upload session and returns the pre-signed part URLs the client uses to upload the source file directly to object storage. Once every part is uploaded, call `POST /api/v2/databases/{owner}/{database}/imports` with the returned `token`, `contents_key`, and the collected `completed_parts` to create the import operation. Authentication is required.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content_length` | integer | yes | Total size of the file being uploaded, in bytes. |
| `num_parts` | integer | yes | Number of parts the client will split the upload into. |
| `file_type` | string | yes | Source file format for an import. |

**Example request**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/imports/uploads' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"content_length":1048576,"num_parts":4,"file_type":"csv"}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `201` | The multipart upload session. | [`ImportUpload`](models#model-importupload) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

---

### Create an import operation {#createImport}
`POST /api/v2/databases/{owner}/{database}/imports`

Imports the previously-uploaded file into `{owner}/{database}` as the table named in the body. The upload (token, contents_key, and the parts uploaded against the URLs returned by `POST .../imports/uploads`) must already be complete; the import itself runs asynchronously. Returns `202` + an `OperationRef`; poll `GET /api/v2/operations/{id}` until `status` is `succeeded` or `failed`. Authentication is required.


**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `owner` | path | string | yes | The user or organization that owns the database. |
| `database` | path | string | yes | The database name, unique within the owner. |

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `branch_name` | string | yes | The branch to import onto. |
| `table_name` | string | yes | The destination table. |
| `file_name` | string | yes | The original file name (used for the commit message and import description). |
| `file_size` | integer | yes | Size of the uploaded file in bytes; must match the `content_length` from `createImportUpload`. |
| `file_type` | string | yes | Source file format for an import. |
| `import_operation` | string | yes | How the imported rows are applied to the target table. `create` requires the table not to exist; `overwrite` replaces it; `update` upserts into an existing table; `replace` truncates then inserts. |
| `token` | string | yes | Upload-session token from `createImportUpload`. |
| `contents_key` | string | yes | Contents key from `createImportUpload`. |
| `completed_parts` | array | yes | One entry per uploaded part, in any order. |
| `file_parts_md5` | string | yes | MD5 of the concatenated per-part MD5s, base64-encoded. Some backends require this for integrity verification of the assembled file. |
| `primary_keys` | array | yes | Primary-key column names. May be empty when the destination table already exists (its existing primary keys are used). Required (possibly empty) so a missing field fails fast rather than mis-importing as no-primary-key. |
| `commit_message` | string | no | Override the default commit message the import produces. |
| `pull_request_branch_name` | string | no | When set, the import lands on this branch (created from `branch_name`) and a pull request is opened against `branch_name`. When unset, the import lands directly on `branch_name`. |
| `column_map` | object | no | Optional mapping from source column names to destination column names. Useful when the file's columns don't match the target table's columns. |

**Example request**

```sh
curl -X POST 'https://www.dolthub.com/api/v2/databases/{owner}/{database}/imports' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"branch_name":"main","table_name":"states","file_name":"states.csv","file_size":1048576}'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `202` | The import operation has been accepted and is queued. | [`OperationRef`](models#model-operationref) |
| `400` | The request was malformed or failed input validation. | [`Problem`](models#model-problem) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `403` | Authenticated, but not permitted to perform this action. | [`Problem`](models#model-problem) |
| `404` | The requested resource does not exist. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

