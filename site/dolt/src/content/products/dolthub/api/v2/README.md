---
title: "DoltHub API v2"
description: The DoltHub v2 API — an explicit, versioned, OpenAPI-defined contract for databases, branches, SQL, and more.
---

# DoltHub API v2

_API version: v2_

The v2 API is the current generation of the DoltHub HTTP surface. Every endpoint lives under `https://www.dolthub.com/api/v2/`.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

Compared to `v1alpha1`, v2 commits to:
- Consistent HTTP semantics (correct status codes, idempotent GETs, etc.)
- A single error model ([RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) problem details)
- A uniform success [Envelope](models#model-envelope) wrapping every response
- A standardized [long-running operations](operations) protocol for async mutations

## All endpoints

### User

| Method | Path | What it does |
|--------|------|--------------|
| **GET** | `/api/v2/user` | [Get the authenticated user](user#getCurrentUser) |

### Database

| Method | Path | What it does |
|--------|------|--------------|
| **POST** | `/api/v2/databases` | [Create a database](database#createDatabase) |
| **GET** | `/api/v2/databases/{owner}/{database}` | [Get a database](database#getDatabase) |
| **GET** | `/api/v2/databases/{owner}/{database}/branches` | [List branches](database#listBranches) |
| **POST** | `/api/v2/databases/{owner}/{database}/branches` | [Create a branch](database#createBranch) |
| **GET** | `/api/v2/databases/{owner}/{database}/tags` | [List tags](database#listTags) |
| **POST** | `/api/v2/databases/{owner}/{database}/tags` | [Create a tag](database#createTag) |
| **GET** | `/api/v2/databases/{owner}/{database}/forks` | [List forks](database#listForks) |
| **POST** | `/api/v2/databases/{owner}/{database}/forks` | [Fork a database](database#createFork) |
| **GET** | `/api/v2/databases/{owner}/{database}/releases` | [List releases](database#listReleases) |
| **POST** | `/api/v2/databases/{owner}/{database}/releases` | [Create a release](database#createRelease) |
| **GET** | `/api/v2/databases/{owner}/{database}/sql` | [Run a read-only SQL query](database#runSqlReadQuery) |
| **POST** | `/api/v2/databases/{owner}/{database}/sql` | [Run a read-only SQL query (large-query variant)](database#runSqlReadQueryPost) |
| **GET** | `/api/v2/databases/{owner}/{database}/pulls` | [List pull requests](database#listPulls) |
| **POST** | `/api/v2/databases/{owner}/{database}/pulls` | [Create a pull request](database#createPull) |
| **GET** | `/api/v2/databases/{owner}/{database}/pulls/{pull_number}` | [Get a pull request](database#getPull) |
| **PATCH** | `/api/v2/databases/{owner}/{database}/pulls/{pull_number}` | [Update a pull request](database#updatePull) |
| **GET** | `/api/v2/databases/{owner}/{database}/pulls/{pull_number}/comments` | [List pull request comments](database#listPullComments) |
| **POST** | `/api/v2/databases/{owner}/{database}/pulls/{pull_number}/comments` | [Add a pull request comment](database#createPullComment) |
| **POST** | `/api/v2/databases/{owner}/{database}/pulls/{pull_number}/merge` | [Merge a pull request](database#mergePull) |
| **POST** | `/api/v2/databases/{owner}/{database}/imports/uploads` | [Initialize a multipart upload](database#createImportUpload) |
| **POST** | `/api/v2/databases/{owner}/{database}/imports` | [Create an import operation](database#createImport) |

### Operations

| Method | Path | What it does |
|--------|------|--------------|
| **GET** | `/api/v2/databases/{owner}/{database}/operations` | [List a database's async operations](operations#listOperations) |
| **GET** | `/api/v2/operations/{operation_id}` | [Get an async operation](operations#getOperation) |
