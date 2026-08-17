---
title: "Authentication"
description: How to authenticate requests to the Hosted Dolt v1 API.
---

# Authentication

_API version: v1_

Every v1 endpoint requires authentication. The only credential type is a **Hosted API token**, sent in the `Authorization` header as a bearer token.

## Creating a token

Create a token from the **Tokens** section of your account settings at [hosted.doltdb.com/settings/tokens](https://hosted.doltdb.com/settings/tokens). Give it a name that says where it will be used — `deploy pipeline`, `staging bootstrap` — since that name is how you will identify it later.

Copy the token immediately. Only a hash of it is stored, so the secret is shown once and cannot be recovered afterwards. If you lose it, delete the token and create another.

Tokens are prefixed `hsat.v1.`.

## Using a token

Send it as a bearer token on every request:

```sh
curl 'https://hosted.doltdb.com/api/v1/user' \
  -H 'Authorization: Bearer hsat.v1.YOUR_TOKEN_HERE'
```

`GET /api/v1/user` is the cheapest way to check a credential: a `200` confirms the token is valid and shows whose access it carries.

In a script, keep the token in an environment variable rather than in the source:

```sh
export HOSTED_API_TOKEN='hsat.v1.YOUR_TOKEN_HERE'

curl 'https://hosted.doltdb.com/api/v1/deployments/acme' \
  -H "Authorization: Bearer $HOSTED_API_TOKEN"
```

## Permissions

A token carries the full permissions of the user who created it. There are no per-token scopes in v1 — anything you can do in the web UI, a token of yours can do through the API, including [creating deployments, which incurs cost](/products/hosted/api/v1/deployment#createDeployment).

Access to a particular deployment still follows that deployment's own roles. A deployment you cannot see returns `404` rather than `403`, so the API never reveals that a deployment exists to someone without access to it.

## Expiry and revocation

Every token has an expiry date, chosen when you create it — 30, 60, or 90 days, or one year. There is deliberately no non-expiring option; rotate long-lived automation on a schedule that matches the expiry you pick.

Delete a token from the same settings page to revoke it immediately. The tokens table also shows when each token was last used, and from where, which is the fastest way to find out whether a token is still in service before you delete it.

## Failure responses

| Status | Code | Meaning |
|--------|------|---------|
| `401` | `UNAUTHENTICATED` | The `Authorization` header was missing, malformed, or the token is invalid or expired. |
| `403` | `PERMISSION_DENIED` | The token is valid, but its user is not permitted to perform this action. |

Both are returned as [Problem](/products/hosted/api/v1/models#model-problem) documents. See the [v1 overview](/products/hosted/api/v1#errors) for the error model.
