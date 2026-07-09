---
title: "Models"
description: Request and response schemas for the DoltHub v2 API.
---

# Models

Shared request and response types used across the v2 API. See the [error model](#model-problem) for how failures are reported.

## ErrorCode {#model-errorcode}
A stable, machine-readable error code in SCREAMING_SNAKE_CASE. Clients branch on this value, never on the human-readable `title`/`detail` prose. The baseline codes below cover the standard HTTP failure categories; endpoint-specific codes (e.g. `BRANCH_NOT_FOUND`) are appended to this enum alongside the endpoints that emit them, which is an additive, non-breaking change under the v2 stability policy.

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
A structured error body returned for every non-2xx response, following RFC 9457 (Problem Details for HTTP APIs). This is the single error model for the entire v2 API — there are no ad-hoc error shapes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `string` | no | A URI identifying the problem type; when dereferenced it points at human-readable documentation for the error. |
| `title` | `string` | yes | A short, human-readable summary of the problem type. |
| `status` | `integer` | yes | The HTTP status code, repeated in the body for convenience. |
| `detail` | `string` | no | A human-readable explanation specific to this occurrence of the problem. |
| `instance` | `string` | no | A URI reference identifying the specific occurrence (typically the request path). |
| `code` | `string` | yes | A stable, machine-readable error code in SCREAMING_SNAKE_CASE. Clients branch on this value, never on the human-readable `title`/`detail` prose. The baseline codes below cover the standard HTTP failure categories; endpoint-specific codes (e.g. `BRANCH_NOT_FOUND`) are appended to this enum alongside the endpoints that emit them, which is an additive, non-breaking change under the v2 stability policy. |
| `request_id` | `string` | yes | The request identifier, echoed on every response. Include it when contacting support so a request can be traced end-to-end. |

---

## Meta {#model-meta}
Response metadata carried alongside the primary `data` payload. All fields are optional; list endpoints populate `next_page_token` for cursor pagination.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `next_page_token` | `string` | no | Opaque cursor for the next page of a list response. Absent or empty when there are no further results; otherwise pass it back as the `page_token` query parameter to fetch the next page. |

---

## Envelope {#model-envelope}
The success envelope wrapping every 2xx response body: the resource or list of resources under `data`, with optional `meta`. This is the single success shape for the API — there are no unenveloped success bodies. Endpoints narrow `data` to a concrete resource via `allOf` (see the section comment above); the base leaves `data` unconstrained so that composition works.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | `object,array` | yes | The primary response payload — a resource, or an array of resources for list endpoints. |
| `meta` | `object` | no | Response metadata carried alongside the primary `data` payload. All fields are optional; list endpoints populate `next_page_token` for cursor pagination. |

---

## DatabaseRef {#model-databaseref}
A minimal reference to a database — owner and name only. Used wherever the API points at another database (a fork's parent, a network's root, an item in the forks list) without re-embedding the full Database resource.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | `string` | yes | The user or organization that owns the referenced database. |
| `name` | `string` | yes | The referenced database's name. |

---

## CreateDatabaseRequest {#model-createdatabaserequest}
Body for `POST /api/v2/databases`. `owner` names the user or organization that will own the new database; the caller's credentials must allow creating under that owner.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | `string` | yes | The user or organization that will own the database. |
| `name` | `string` | yes | The database name. Must be unique within the owner and conform to DoltHub's naming rules (letters, digits, `-`, `_`; cannot start or end with `-`). |
| `description` | `string` | no | Optional human-readable description. |
| `visibility` | `string` | yes | Whether the database is publicly readable. Defaults are *not* applied — clients must declare the intended visibility on create. |

---

## CreatePullRequest {#model-createpullrequest}
Body for `POST /api/v2/databases/{owner}/{database}/pulls`. `to_branch.database` must equal the URL's `{owner}/{database}` (the PR opens against this repo); `from_branch.database` is usually the same but may point at a fork for cross-fork PRs.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | yes | The pull request's title. |
| `description` | `string` | no | Optional pull-request body (markdown). |
| `from_branch` | `object` | yes | A reference to a branch within a specific database. Carries the database so callers can disambiguate cross-fork pull requests, where `from_branch` and `to_branch` may live in different repositories. |
| `to_branch` | `object` | yes | A reference to a branch within a specific database. Carries the database so callers can disambiguate cross-fork pull requests, where `from_branch` and `to_branch` may live in different repositories. |

---

## CreatePullCommentRequest {#model-createpullcommentrequest}
Body for `POST /api/v2/databases/{owner}/{database}/pulls/{pull_number}/comments`. Carries only the comment text; author and timestamps are server-assigned.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `body` | `string` | yes | The comment text (markdown). |

---

## MergePullRequest {#model-mergepullrequest}
Body for `POST /api/v2/databases/{owner}/{database}/pulls/{pull_number}/merge`. Currently empty — the merge takes no parameters today. The empty object exists so the schema is closed under `additionalProperties` (mistyped fields fail loud rather than getting silently dropped) and so we have a stable place to add the conflict-resolution strategy when that ships.

_Type: `object`_


---

## CreateForkRequest {#model-createforkrequest}
Body for `POST /api/v2/databases/{owner}/{database}/forks`. The URL identifies the source database; `owner` is the user or organization that will own the new fork. The new fork inherits the source database's name. Forking into a namespace the caller does not own returns `403`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | `string` | yes | The user or organization that will own the new fork. |

---

## UpdatePullRequest {#model-updatepullrequest}
Body for `PATCH /api/v2/databases/{owner}/{database}/pulls/{pull_number}`. Every field is optional; the caller supplies whichever fields they're changing and the server only updates those. At least one field must be present. `state` is restricted to the writable transitions (`open` ↔ `closed`); to merge, use the merge operation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | no | New title; omit to leave unchanged. |
| `description` | `string` | no | New description body (markdown); omit to leave unchanged. |
| `state` | `string` | no | New state. Merging is a separate operation; this field can't transition to `merged`. |

---

## CreateBranchRequest {#model-createbranchrequest}
Body for `POST /api/v2/databases/{owner}/{database}/branches`. `from` is a discriminated union — one of `{ branch }` or `{ commit }` — that names the source revision the new branch will point at.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | yes | The new branch's name. |
| `from` | `object` | yes |  |

---

## CreateTagRequest {#model-createtagrequest}
Body for `POST /api/v2/databases/{owner}/{database}/tags`. `from` is the same `{ branch | commit }` discriminated union used by `CreateBranchRequest`. Supplying `message` produces an annotated tag; omitting it produces a lightweight tag.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | yes | The new tag's name, unique within the database. |
| `from` | `object` | yes |  |
| `message` | `string` | no | Optional annotation message. Present → annotated tag; absent → lightweight tag. |

---

## CreateReleaseRequest {#model-createreleaserequest}
Body for `POST /api/v2/databases/{owner}/{database}/releases`. Releases pin to a specific commit (`commit_sha`), not a moving branch. The release is published under `tag`; `create_tag_if_not_exists` lets the backend create that tag implicitly when it doesn't already exist, otherwise the tag must already point at `commit_sha`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tag` | `string` | yes | The tag the release is published under, unique within the database. |
| `title` | `string` | yes | Human-readable title. |
| `commit_sha` | `string` | yes | The commit hash the release points at. |
| `description` | `string` | no | Optional release notes body (markdown). |
| `create_tag_if_not_exists` | `boolean` | no | When true and no tag named `tag` exists, create one pointing at `commit_sha`. Defaults to false — the caller is responsible for tag creation otherwise. |

---

## ImportFileType {#model-importfiletype}
Source file format for an import.

**Enum values**

| Value |
|-------|
| `csv` |
| `psv` |
| `xlsx` |
| `json` |
| `sql` |
| `yaml` |

---

## ImportOperation {#model-importoperation}
How the imported rows are applied to the target table. `create` requires the table not to exist; `overwrite` replaces it; `update` upserts into an existing table; `replace` truncates then inserts.

**Enum values**

| Value |
|-------|
| `create` |
| `overwrite` |
| `update` |
| `replace` |

---

## CompletedPart {#model-completedpart}
One part of a multipart upload, identified by its part number and the ETag the storage backend returned.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `part_number` | `integer` | yes | The 1-based part number this entry corresponds to. |
| `etag` | `string` | yes | The ETag returned by the storage backend for this part. |

---

## ImportUploadPart {#model-importuploadpart}
A single part in an upload session — the part number plus the pre-signed URL to PUT it to.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `part_number` | `integer` | yes | The 1-based part number. |
| `url` | `string` | yes | Pre-signed URL the client should upload this part to. |

---

## ImportUpload {#model-importupload}
A multipart upload session. The client PUTs each file chunk to the matching `parts[].url`, collects the storage backend's ETag for each, and then calls `createImport` with the `token`, `contents_key`, and the collected `CompletedPart`s.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | `string` | yes | Opaque upload-session token. Pass verbatim to `createImport`. |
| `contents_key` | `string` | yes | Storage key the assembled file will live at. Pass verbatim to `createImport`. |
| `parts` | `array` | yes | One entry per part, in part-number order. |
| `http_method` | `string` | yes | HTTP method to use when uploading each part. Currently always `PUT`. |
| `headers` | `object` | yes | Headers the client must include on each part upload (e.g. proxy-auth, signed-headers added by the storage backend). Usually empty; clients should iterate every entry and add each name with all of its values to the part-upload request. Each header may have multiple values. |

---

## CreateImportUploadRequest {#model-createimportuploadrequest}
Body for `POST /api/v2/databases/{owner}/{database}/imports/uploads`. Asks the server to mint a multipart upload session for a file of `content_length` bytes split into `num_parts` parts; the response carries the pre-signed URLs to upload to.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content_length` | `integer` | yes | Total size of the file being uploaded, in bytes. |
| `num_parts` | `integer` | yes | Number of parts the client will split the upload into. |
| `file_type` | `string` | yes | Source file format for an import. |

---

## CreateImportRequest {#model-createimportrequest}
Body for `POST /api/v2/databases/{owner}/{database}/imports`. Wraps a completed multipart upload (`token`, `contents_key`, `completed_parts`) into an import job that loads the file into `table_name` on `branch_name`. Returns `202` + an `OperationRef`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `branch_name` | `string` | yes | The branch to import onto. |
| `table_name` | `string` | yes | The destination table. |
| `file_name` | `string` | yes | The original file name (used for the commit message and import description). |
| `file_size` | `integer` | yes | Size of the uploaded file in bytes; must match the `content_length` from `createImportUpload`. |
| `file_type` | `string` | yes | Source file format for an import. |
| `import_operation` | `string` | yes | How the imported rows are applied to the target table. `create` requires the table not to exist; `overwrite` replaces it; `update` upserts into an existing table; `replace` truncates then inserts. |
| `token` | `string` | yes | Upload-session token from `createImportUpload`. |
| `contents_key` | `string` | yes | Contents key from `createImportUpload`. |
| `completed_parts` | `array` | yes | One entry per uploaded part, in any order. |
| `file_parts_md5` | `string` | yes | MD5 of the concatenated per-part MD5s, base64-encoded. Some backends require this for integrity verification of the assembled file. |
| `primary_keys` | `array` | yes | Primary-key column names. May be empty when the destination table already exists (its existing primary keys are used). Required (possibly empty) so a missing field fails fast rather than mis-importing as no-primary-key. |
| `commit_message` | `string` | no | Override the default commit message the import produces. |
| `pull_request_branch_name` | `string` | no | When set, the import lands on this branch (created from `branch_name`) and a pull request is opened against `branch_name`. When unset, the import lands directly on `branch_name`. |
| `column_map` | `object` | no | Optional mapping from source column names to destination column names. Useful when the file's columns don't match the target table's columns. |

---

## OperationStatus {#model-operationstatus}
The lifecycle state of an async operation.

**Enum values**

| Value |
|-------|
| `queued` |
| `running` |
| `succeeded` |
| `failed` |

---

## OperationType {#model-operationtype}
The kind of work this operation performs.

**Enum values**

| Value |
|-------|
| `import` |
| `merge` |
| `sql_write` |
| `fork` |
| `dolt_ci` |

---

## OperationError {#model-operationerror}
Error details recorded when an operation reaches the `failed` status.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | `integer` | yes | HTTP-equivalent status code for the failure. |
| `code` | `string` | yes | A stable, machine-readable error code in SCREAMING_SNAKE_CASE. Clients branch on this value, never on the human-readable `title`/`detail` prose. The baseline codes below cover the standard HTTP failure categories; endpoint-specific codes (e.g. `BRANCH_NOT_FOUND`) are appended to this enum alongside the endpoints that emit them, which is an additive, non-breaking change under the v2 stability policy. |
| `title` | `string` | yes | A short, human-readable summary of the failure. |
| `detail` | `string` | no | A human-readable explanation of the failure, sourced from the underlying operation error message when available. |

---

## Operation {#model-operation}
A long-running async operation. Every async mutation returns an `OperationRef`; poll `GET /api/v2/operations/{id}` until `status` is `succeeded` or `failed`. The `id` is opaque — pass it back to the poll endpoint verbatim.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | Opaque operation identifier. Pass verbatim to `GET /api/v2/operations/{id}`. |
| `type` | `string` | yes | The kind of work this operation performs. |
| `status` | `string` | yes | The lifecycle state of an async operation. |
| `created_at` | `string` | yes | When the operation was enqueued. |
| `cancelable` | `boolean` | yes | Reserved for a future cancel endpoint. Always `false` today — no `POST /api/v2/operations/{id}/cancel` exists yet. |
| `error` | `object` | no | Error details recorded when an operation reaches the `failed` status. |
| `result` | `object` | no | Present when `status` is `succeeded`. Shape depends on `type`: `import`/`merge` → `{ pull_id }`; `sql_write` → `{ commit_sha }`; `fork` → `{ database: { owner, name } }`. |

---

## OperationRef {#model-operationref}
A reference to an in-progress async operation, returned in `202` responses. Pass `id` to `GET /api/v2/operations/{id}` to poll for completion.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | The operation ID. |
| `href` | `string` | yes | Absolute URL of the poll endpoint. |

---

## Database {#model-database}
A DoltHub database and its public metadata. v2 exposes the database's own fields; caller-specific state (your role on it, whether you've starred it) is not part of this resource.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owner` | `string` | yes | The user or organization that owns the database. |
| `name` | `string` | yes | The database name, unique within the owner. |
| `description` | `string` | no | The database's short description. |
| `visibility` | `string` | yes | Whether the database is publicly readable or private. |
| `fork_network_count` | `integer` | yes | The total number of databases in this database's fork network — transitive, counting forks-of-forks. The `/forks` endpoint returns immediate children only, so `fork_network_count` may exceed the length of that list. |
| `star_count` | `integer` | yes | The number of users who have starred the database. |
| `size_bytes` | `integer` | yes | The on-disk size of the database, in bytes. |
| `last_write_at` | `string` | no | When the database last received a write. |
| `parent` | `object` | no | The database this one was forked from. Omitted when this database is not a fork — i.e., it is the root of its fork network. |
| `network_root` | `object` | no | The original database at the root of this database's fork network. Omitted when this database is itself the root (no ancestors). |

---

## Branch {#model-branch}
A branch in a database — a named pointer to a head commit. v2 exposes the branch's identity (name) and the head it currently points at; the head commit's full metadata (message, author, parents) belongs to the commit resource, not the branch list.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | yes | The branch name, unique within the database. |
| `head_commit_sha` | `string` | yes | The hash of the commit the branch currently points at. |
| `last_updated_at` | `string` | no | When the head commit was committed; absent if the backend didn't report it. |

---

## Tag {#model-tag}
A tag in a database — a named, optionally annotated pointer to a specific commit. v2 exposes the tag's identity and the commit it targets; the target commit's full metadata (message, author, parents) belongs to the commit resource, not the tag list.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | yes | The tag name, unique within the database. |
| `commit_sha` | `string` | yes | The hash of the commit the tag points at. |
| `message` | `string` | no | The tag's annotation message; omitted when the tag has none. |
| `tagged_at` | `string` | no | When the tag was created; absent if the backend didn't report it. |

---

## Release {#model-release}
A named release of a database — a title and notes attached to a specific commit, often but not always paired with a tag of the same name. v2 exposes the release's public fields; the internal release id is omitted (the tag is the user-facing identifier).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tag` | `string` | yes | The tag the release is published under, unique within the database. |
| `title` | `string` | yes | The release's human-readable title. |
| `commit_sha` | `string` | yes | The hash of the commit the release points at. |
| `description` | `string` | no | The release notes body (markdown). Omitted when the release has none. |
| `created_at` | `string` | yes | When the release was first published. |
| `updated_at` | `string` | yes | When the release was last edited; equals `created_at` for never-edited releases. |

---

## PullSummary {#model-pullsummary}
The lean list shape of a pull request — title, state, creator, timestamps. Companion to the canonical `Pull` resource returned by the per-pull GET, which adds structured `from_branch` / `to_branch` references (fork-aware owner / database) needed to disambiguate cross-fork PRs.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pull_number` | `integer` | yes | The per-database sequential identifier (à la GitHub PR numbers). |
| `title` | `string` | yes | The pull request's human-readable title. |
| `description` | `string` | no | The pull request description (markdown). Omitted when the pull has none. |
| `state` | `string` | yes | The pull request's lifecycle state. |
| `created_at` | `string` | yes | When the pull request was created. |
| `creator` | `string` | yes | The username of the user who created the pull request. |

---

## BranchRef {#model-branchref}
A reference to a branch within a specific database. Carries the database so callers can disambiguate cross-fork pull requests, where `from_branch` and `to_branch` may live in different repositories.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `database` | `object` | yes | A minimal reference to a database — owner and name only. Used wherever the API points at another database (a fork's parent, a network's root, an item in the forks list) without re-embedding the full Database resource. |
| `branch_name` | `string` | yes | The branch name within the referenced database. |

---

## Pull {#model-pull}
The canonical pull-request resource. Same public fields as the list `PullSummary` plus structured `from_branch` / `to_branch` references that carry the database the branch lives in (necessary for cross-fork pulls, where the source branch lives in a different repository).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pull_number` | `integer` | yes | The per-database sequential identifier (à la GitHub PR numbers). |
| `title` | `string` | yes | The pull request's human-readable title. |
| `description` | `string` | no | The pull request description (markdown). Omitted when the pull has none. |
| `state` | `string` | yes | The pull request's lifecycle state. |
| `from_branch` | `object` | yes | A reference to a branch within a specific database. Carries the database so callers can disambiguate cross-fork pull requests, where `from_branch` and `to_branch` may live in different repositories. |
| `to_branch` | `object` | yes | A reference to a branch within a specific database. Carries the database so callers can disambiguate cross-fork pull requests, where `from_branch` and `to_branch` may live in different repositories. |
| `created_at` | `string` | yes | When the pull request was created. |
| `creator` | `string` | yes | The username of the user who created the pull request. |

---

## PullComment {#model-pullcomment}
A top-level comment on a pull request. Diff-line comments and review comments are modeled as separate resources (not in v2 yet).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `comment_id` | `string` | yes | The opaque per-comment identifier, unique within the pull request. |
| `author` | `string` | yes | The username of the comment's author. |
| `body` | `string` | yes | The comment text (markdown). |
| `created_at` | `string` | yes | When the comment was first posted. |
| `updated_at` | `string` | yes | When the comment was last edited (equals `created_at` if never edited). |

---

## QueryColumn {#model-querycolumn}
One column in a query result's schema.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | yes | The column name. |
| `type` | `string` | yes | The column's SQL type — e.g. `VARCHAR(255)`, `BIGINT`, `DATETIME(6)`. Clients parsing typed values are expected to read this and coerce `cells` accordingly. |
| `is_primary_key` | `boolean` | no | Whether the column is part of the source table's primary key. |
| `source_table` | `string` | no | The table this column came from. Empty for expressions or virtual columns (e.g. `COUNT(*)`). |

---

## SqlReadRequest {#model-sqlreadrequest}
Body for the read variant of `POST /api/v2/databases/{owner}/{database}/sql`. Identical semantics to the `GET /sql` query string — pass the query in the body when it's too long for a URL.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ref` | `string` | yes | The branch, tag, or commit hash to query against. A 32-character value using only the characters `0-9a-v` (Dolt's base32 alphabet) is treated as a commit hash; everything else resolves as a branch, tag, or other ref. |
| `q` | `string` | yes | The SQL query to execute. Read-only — mutations are rejected. |
| `limit` | `integer` | no | Maximum number of rows to return (default `1000`). |
| `timeout_ms` | `integer` | no | Per-query execution timeout in milliseconds (default `30000`, cap `60000`). |

---

## SqlWriteRequest {#model-sqlwriterequest}
Body for `POST /api/v2/databases/{owner}/{database}/sql-writes`. Runs `q` on `to_branch` (creating it from `from_branch` if it doesn't exist) then merges `from_branch` into `to_branch`. Returns `202` + `OperationRef`. `from_branch` and `to_branch` are bare branch names — both must live in the URL's `{owner}/{database}`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from_branch` | `string` | yes | The branch to merge from after the write completes. |
| `to_branch` | `string` | yes | The branch the write runs on. Created from `from_branch` when it doesn't already exist. |
| `q` | `string` | yes | The SQL write statement to execute. |

---

## QueryResult {#model-queryresult}
The result of a `runSqlReadQuery` call. SQL-level conditions (success, error, timeout, row-limit) live in `status` and `message` — they are query-level, not transport-level.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `columns` | `array` | yes | The result schema — one entry per column, in the row's cell order. |
| `rows` | `array` | yes | The result rows. Each row is an array of cell values, ordered to match the `columns` schema. Non-NULL cells are serialized as strings regardless of the underlying SQL type; clients can parse per `columns[i].type` to coerce typed values. NULL cells are serialized as JSON `null`. BLOB-typed cells are returned as the placeholder string `"<binary>"` (the backend does not stream binary bytes over this endpoint); clients can detect blob columns via `columns[i].type`. |
| `status` | `string` | yes | The query's execution status. `success` is the only status that guarantees `rows` and `columns` are fully populated. |
| `message` | `string` | no | Server-supplied message describing the status. Always populated for non-`success` statuses; usually empty on success. |
| `warnings` | `array` | no | SQL-level warnings emitted by the query engine (e.g. truncated values). |

---

## EmailAddress {#model-emailaddress}
An email address registered to a DoltHub user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | `string` | yes | The email address. |
| `is_primary` | `boolean` | yes | Whether this is the user's primary email address. |
| `is_verified` | `boolean` | yes | Whether this email address has been verified. |

---

## User {#model-user}
A DoltHub user. `GET /api/v2/user` returns the authenticated user's profile. v2 returns only the public-facing profile fields — internal flags (super-admin, two-factor settings, API tokens) are never included.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | `string` | yes | The user's DoltHub username (unique handle). |
| `display_name` | `string` | no | The user's display name. May be empty. |
| `bio` | `string` | no | The user's bio. May be empty. |
| `location` | `string` | no | The user's stated location. May be empty. |
| `website_url` | `string` | no | The user's website URL. May be empty. |
| `profile_pic_url` | `string` | no | URL of the user's profile picture. May be empty. |
| `email_addresses` | `array` | yes | The user's registered email addresses. |

