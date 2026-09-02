---
title: "Hosted API v1"
description: The Hosted Dolt v1 API — an explicit, versioned, OpenAPI-defined contract for deployments.
---

# Hosted API v1

_API version: v1_

The v1 API is the public HTTP surface for the Hosted Dolt control plane. Every endpoint lives under `https://hosted.doltdb.com/api/v1/`.

It is an OpenAPI-defined contract, and commits to:

- Consistent HTTP semantics (correct status codes, idempotent GETs, `202` for work that continues after the response)
- A single error model ([RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) problem details) — see [Problem](/products/hosted/api/v1/models#model-problem)
- A uniform success [Envelope](/products/hosted/api/v1/models#model-envelope) wrapping every response
- Cursor pagination on list endpoints

**Scope.** v1 covers the control plane only. Querying the data inside a deployment is not part of this API — connect to the deployment's SQL endpoint directly with your database credentials.

## Authentication

Every endpoint requires a Hosted API token, sent as a bearer token:

```sh
curl 'https://hosted.doltdb.com/api/v1/user' \
  -H 'Authorization: Bearer hsat.v1.YOUR_TOKEN_HERE'
```

See [Authentication](/products/hosted/api/v1/authentication) for how to create and manage tokens.

## All endpoints

### User

| Method | Path | What it does |
|--------|------|--------------|
| **GET** | `/api/v1/user` | [Get the authenticated user](/products/hosted/api/v1/user#getCurrentUser) |

### Deployment

| Method | Path | What it does |
|--------|------|--------------|
| **GET** | `/api/v1/deployment-options` | [List the options a deployment can be created with](/products/hosted/api/v1/deployment#getDeploymentOptions) |
| **POST** | `/api/v1/deployments` | [Create a deployment](/products/hosted/api/v1/deployment#createDeployment) |
| **GET** | `/api/v1/deployments/{owner}` | [List an owner's deployments](/products/hosted/api/v1/deployment#listDeployments) |
| **GET** | `/api/v1/deployments/{owner}/{deployment}` | [Get a deployment](/products/hosted/api/v1/deployment#getDeployment) |
| **GET** | `/api/v1/deployments/{owner}/{deployment}/instances` | [List a deployment's instances](/products/hosted/api/v1/deployment#listDeploymentInstances) |
| **POST** | `/api/v1/deployments/{owner}/{deployment}/instances` | [Add a read replica to a deployment](/products/hosted/api/v1/deployment#addDeploymentInstance) |
| **DELETE** | `/api/v1/deployments/{owner}/{deployment}/instances/{id}` | [Remove an instance from a deployment](/products/hosted/api/v1/deployment#deleteDeploymentInstance) |
| **GET** | `/api/v1/deployments/{owner}/{deployment}/config` | [Get a deployment's configuration](/products/hosted/api/v1/deployment#getDeploymentConfig) |
| **GET** | `/api/v1/deployments/{owner}/{deployment}/backups` | [List a deployment's backups](/products/hosted/api/v1/deployment#listDeploymentBackups) |
| **POST** | `/api/v1/deployments/{owner}/{deployment}/disable` | [Disable a deployment](/products/hosted/api/v1/deployment#disableDeployment) |

### Pull request

| Method | Path | What it does |
|--------|------|--------------|
| **GET** | `/api/v1/deployments/{owner}/{deployment}/pulls` | [List a database's pull requests](/products/hosted/api/v1/pull-request#listDeploymentPulls) |
| **GET** | `/api/v1/deployments/{owner}/{deployment}/pulls/{id}/comments` | [List a pull request's comments](/products/hosted/api/v1/pull-request#listDeploymentPullComments) |
| **GET** | `/api/v1/deployments/{owner}/{deployment}/pulls/{id}/logs` | [List a pull request's activity log](/products/hosted/api/v1/pull-request#listDeploymentPullLogs) |

Pull requests are read-only in v1, and merging is not part of this API at all: a pull request is merged by connecting to the deployment and issuing `CALL DOLT_MERGE(...)`. They also hang off a deployment but belong to one database within it, so [the list](/products/hosted/api/v1/pull-request#listDeploymentPulls) requires a `database` — a deployment can host several, and their pull requests are unrelated.

## Response shape

Every `2xx` response body is an [Envelope](/products/hosted/api/v1/models#model-envelope): the resource, or an array of resources, under `data`, with optional `meta`.

```json
{
  "data": { "owner": "acme", "name": "analytics", "state": "started" }
}
```

List endpoints put the pagination cursor in `meta`:

```json
{
  "data": [ { "owner": "acme", "name": "analytics" } ],
  "meta": { "next_page_token": "eyJvZmZzZXQiOjI1fQ" }
}
```

When `meta.next_page_token` is present, pass it back as the `page_token` query parameter to fetch the next page. On the last page `meta` is omitted entirely, so checking whether the token is present is all a client needs — it is never returned present but empty. Page size is fixed and not caller-controlled, so a full page is not itself a sign that another one follows.

A few lists are small enough by nature to be returned whole and take no `page_token` at all — a pull request's [comments](/products/hosted/api/v1/pull-request#listDeploymentPullComments) and its [activity log](/products/hosted/api/v1/pull-request#listDeploymentPullLogs). Each endpoint's parameters say which it is.

## Errors

Every non-`2xx` response is a [Problem](/products/hosted/api/v1/models#model-problem) with content type `application/problem+json`:

```json
{
  "type": "https://docs.dolthub.com/products/hosted/api/v1/models/#model-errorcode",
  "title": "Not found",
  "status": 404,
  "detail": "Deployment 'analytics' does not exist for owner 'acme'",
  "instance": "/api/v1/deployments/acme/analytics",
  "code": "NOT_FOUND",
  "request_id": "req_01HZX9P7Q5N2M8"
}
```

Branch on `code` — a stable, machine-readable [ErrorCode](/products/hosted/api/v1/models#model-errorcode) — never on the human-readable `title` or `detail`, which may be reworded at any time.

Every response, including successful ones, carries an `x-request-id` header, echoed in the body as `request_id` on errors. Include it when contacting support so a request can be traced end to end.

## Long-running work

Creating a deployment returns `202 Accepted` with the deployment in its `starting` state — provisioning continues after the response. Poll [Get a deployment](/products/hosted/api/v1/deployment#getDeployment) until `state` becomes `started`.

[Disabling a deployment](/products/hosted/api/v1/deployment#disableDeployment) works the same way: `202 Accepted` with the deployment in `stopping`, then poll until `state` is `stopped`.

Instance changes are also `202`, but there is no per-instance `state` field to poll, so they are observed through the [instance list](/products/hosted/api/v1/deployment#listDeploymentInstances) instead. After [adding a replica](/products/hosted/api/v1/deployment#addDeploymentInstance), poll until that instance reports a `host` — that is when it is reachable. After [removing one](/products/hosted/api/v1/deployment#deleteDeploymentInstance), poll until it disappears from the list, which only reports instances that aren't stopped.

Deployment names are unique within an owner, which makes creates idempotent by name: retrying after an ambiguous failure returns `409 Conflict` rather than provisioning a second deployment.

> **Creating a deployment incurs cost.** Disabling one tears down its instances and their storage — [take a backup first](/products/hosted/api/v1/deployment#listDeploymentBackups) if you want the data.

## Stability

v1 is additive. New endpoints, new optional request fields, new response fields, and new `ErrorCode` values may be introduced within v1. Renaming or removing a field, or changing an existing one's meaning, requires a new major version.
