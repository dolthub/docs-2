---
title: "Hosted Dolt API"
description: Programmatic access to your Hosted Dolt deployments.
---

# Hosted Dolt API

Hosted Dolt exposes an HTTP API for managing deployments programmatically — creating them, listing them, and reading their configuration and state from scripts, CI, or your own tooling.

## REST API

- **[v1 API](/products/hosted/api/v1)** — the current generation. An explicit, versioned, OpenAPI-defined contract with consistent HTTP semantics, a single [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) error model, and a uniform response envelope. Start here.

The conventions are deliberately the same as the [DoltHub v2 API](/products/dolthub/api/v2): the same error body, the same success envelope, and the same cursor pagination. If you already integrate with one, the other should feel familiar.

## Scope

The v1 API covers the **control plane** — the deployments themselves. Querying the data *inside* a deployment is not part of it: every deployment exposes a SQL endpoint that you connect to directly with your database credentials, exactly as you would any MySQL or Postgres server. See [Getting Started](/products/hosted/getting-started) for how to connect.

Database credentials are never returned by this API. Reading a deployment tells you its configuration and state, never its secrets.

> **Note:** please send requests to `https://hosted.doltdb.com`.
