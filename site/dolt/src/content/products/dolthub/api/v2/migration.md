---
title: "Migrating from v1alpha1"
description: How to migrate your integrations from the DoltHub v1alpha1 API to v2.
---

# Migrating from v1alpha1

This page covers the mechanical changes needed to move an existing v1alpha1 integration to v2. Read it alongside the [v2 overview](/products/dolthub/api/v2) and the per-resource pages.

## 1. Base URL

Every v1alpha1 path lives under `/api/v1alpha1/`. Every v2 path lives under `/api/v2/`.

```diff
- https://www.dolthub.com/api/v1alpha1/dolthub/us-jails
+ https://www.dolthub.com/api/v2/databases/dolthub/us-jails/sql?q=SHOW+TABLES
```

The database owner and name moved from path roots into `/databases/{owner}/{database}/`.

---

## 2. Response envelope

v1alpha1 responses are flat and ad-hoc — each endpoint has its own top-level shape. v2 wraps every success response in a uniform envelope:

```json
{
  "data": { ... },
  "meta": { "next_page_token": "eyJ..." }
}
```

`data` is the resource (or an array of resources for list endpoints). `meta` is present on list responses and carries the pagination cursor; it is absent on single-resource responses.

**Before (v1alpha1 branch list):**
```json
{
  "database_owner": "dolthub",
  "database_name": "us-jails",
  "branches": [ { "name": "main", ... } ]
}
```

**After (v2 branch list):**
```json
{
  "data": [ { "name": "main", "head_commit_sha": "abc...", "last_updated_at": "..." } ],
  "meta": { "next_page_token": "eyJ..." }
}
```

---

## 3. Error model

v1alpha1 error shapes vary by endpoint. v2 uses [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457) for every non-2xx response. See [Models → Problem](/products/dolthub/api/v2/models#model-problem).

```json
{
  "type": "https://dolthub.com/docs/api/errors/not-found",
  "title": "Not found",
  "status": 404,
  "detail": "Branch 'feature' does not exist in dolthub/us-jails",
  "instance": "/api/v2/databases/dolthub/us-jails/branches/feature",
  "code": "NOT_FOUND",
  "request_id": "req_01HZX9P7Q5N2M8"
}
```

Branch on `code` (a stable `SCREAMING_SNAKE_CASE` string), never on `title` or `detail` (prose that can change).

---

## 4. Pagination

v1alpha1 list endpoints use offset-based pagination (or no pagination). v2 uses **cursor-based pagination** throughout.

- If `meta.next_page_token` is present in the response, pass it back as `?page_token=<token>` to fetch the next page.
- An absent or empty `next_page_token` means you are on the last page.

```sh
# First page
curl 'https://www.dolthub.com/api/v2/databases/dolthub/us-jails/branches'

# Next page
curl 'https://www.dolthub.com/api/v2/databases/dolthub/us-jails/branches?page_token=eyJ...'
```

---

## 5. Async operations

v1alpha1 exposes separate polling endpoints per operation type (e.g. `GET /fork`, `GET /{owner}/{database}/write`, `GET /{owner}/{database}/pulls/{id}/merge`).

v2 uses a single unified protocol: any async mutation returns `202` with an `OperationRef`:

```json
{
  "data": {
    "id": "owners/dolthub/repos/us-jails/jobs/abc123",
    "href": "https://www.dolthub.com/api/v2/operations/owners/dolthub/repos/us-jails/jobs/abc123"
  }
}
```

Poll `GET /api/v2/operations/{operation_id}` until `status` is `succeeded` or `failed`. See [Operations](/products/dolthub/api/v2/operations#getOperation).

```sh
curl 'https://www.dolthub.com/api/v2/operations/owners/dolthub/repos/us-jails/jobs/abc123' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## 6. Endpoint mapping

| v1alpha1 | v2 |
|---|---|
| `GET /user` | [`GET /user`](/products/dolthub/api/v2/user#getCurrentUser) |
| `POST /database` | [`POST /databases`](/products/dolthub/api/v2/database#createDatabase) |
| `GET /{owner}/{database}?q=` | [`GET /databases/{owner}/{database}/sql?q=`](/products/dolthub/api/v2/database#runSqlReadQuery) |
| `GET /{owner}/{database}/{ref}?q=` | [`GET /databases/{owner}/{database}/sql?q=&ref=`](/products/dolthub/api/v2/database#runSqlReadQuery) |
| `POST /{owner}/{database}/write/{from_branch}/{to_branch}` | [`POST /databases/{owner}/{database}/sql-writes`](/products/dolthub/api/v2/database#runSqlWriteQuery) |
| `GET /{owner}/{database}/write` | Poll [`GET /operations/{id}`](/products/dolthub/api/v2/operations#getOperation) |
| `GET /{owner}/{database}/forks` | [`GET /databases/{owner}/{database}/forks`](/products/dolthub/api/v2/database#listForks) |
| `GET /{owner}/{database}/branches` | [`GET /databases/{owner}/{database}/branches`](/products/dolthub/api/v2/database#listBranches) |
| `POST /{owner}/{database}/branches` | [`POST /databases/{owner}/{database}/branches`](/products/dolthub/api/v2/database#createBranch) |
| `GET /{owner}/{database}/pulls` | [`GET /databases/{owner}/{database}/pulls`](/products/dolthub/api/v2/database#listPulls) |
| `POST /{owner}/{database}/pulls` | [`POST /databases/{owner}/{database}/pulls`](/products/dolthub/api/v2/database#createPull) |
| `GET /{owner}/{database}/pulls/{id}` | [`GET /databases/{owner}/{database}/pulls/{pull_number}`](/products/dolthub/api/v2/database#getPull) |
| `PATCH /{owner}/{database}/pulls/{id}` | [`PATCH /databases/{owner}/{database}/pulls/{pull_number}`](/products/dolthub/api/v2/database#updatePull) |
| `POST /{owner}/{database}/pulls/{id}/comments` | [`POST /databases/{owner}/{database}/pulls/{pull_number}/comments`](/products/dolthub/api/v2/database#createPullComment) |
| `POST /{owner}/{database}/pulls/{id}/merge` | [`POST /databases/{owner}/{database}/pulls/{pull_number}/merge`](/products/dolthub/api/v2/database#mergePull) |
| `GET /{owner}/{database}/pulls/{id}/merge` | Poll [`GET /operations/{id}`](/products/dolthub/api/v2/operations#getOperation) |
| `GET /{owner}/{database}/releases` | [`GET /databases/{owner}/{database}/releases`](/products/dolthub/api/v2/database#listReleases) |
| `POST /{owner}/{database}/releases` | [`POST /databases/{owner}/{database}/releases`](/products/dolthub/api/v2/database#createRelease) |
| `GET /{owner}/{database}/tags` | [`GET /databases/{owner}/{database}/tags`](/products/dolthub/api/v2/database#listTags) |
| `POST /{owner}/{database}/tags` | [`POST /databases/{owner}/{database}/tags`](/products/dolthub/api/v2/database#createTag) |
| `POST /{owner}/{database}/upload` | [`POST .../imports/uploads`](/products/dolthub/api/v2/database#createImportUpload) then [`POST .../imports`](/products/dolthub/api/v2/database#createImport) |
| `GET /{owner}/{database}/upload` | Poll [`GET /operations/{id}`](/products/dolthub/api/v2/operations#getOperation) |
| `POST /fork` | [`POST /databases/{owner}/{database}/forks`](/products/dolthub/api/v2/database#createFork) |
| `GET /fork` | Poll [`GET /operations/{id}`](/products/dolthub/api/v2/operations#getOperation) |
| `GET /{owner}/{database}/jobs` | [`GET /databases/{owner}/{database}/operations`](/products/dolthub/api/v2/operations#listOperations) |
| `GET /users/{username}/operations` | [`GET /databases/{owner}/{database}/operations`](/products/dolthub/api/v2/operations#listOperations) |
