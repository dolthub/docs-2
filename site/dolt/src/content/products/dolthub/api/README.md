---
title: "DoltHub/DoltLab API"
description: Programmatic access to databases hosted on DoltHub.
---

# DoltHub/DoltLab API

DoltHub and DoltLab expose HTTP APIs for programmatic access to your hosted databases.

## REST API

The REST API is available in two versions. **New integrations should use v2.**

- **[v2 API](/products/dolthub/api/v2)** — the current generation. An explicit, versioned, OpenAPI-defined contract with consistent HTTP semantics, a single [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) error model, a uniform response envelope, and a standardized async-operations protocol. Start here.
- **[v1alpha1 API](/products/dolthub/api/v1alpha1)** — the original API. Still supported, but new endpoints are being added to v2 only. See the [migration guide](/products/dolthub/api/v2/migration) if you are moving an existing integration.

## Other API surfaces

- **[CSV API](/products/dolthub/api/csv)** — bulk export and import of table data as CSV.
- **[Webhooks](/products/dolthub/api/hooks)** — receive HTTP callbacks when events happen on your database (pushes, pull-request activity, and so on).

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.
