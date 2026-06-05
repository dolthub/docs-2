---
title: "DoltHub/DoltLab API"
description: Programmatic access to databases hosted on DoltHub.
---

# DoltHub/DoltLab API

_API version: v1alpha1_

DoltHub and DoltLab provide a family of HTTP APIs for executing Dolt SQL, downloading and uploading data, and automating workflows against your databases. Every endpoint lives under `https://www.dolthub.com/api/v1alpha1/`.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

Browse the per-resource pages in the sidebar, or jump straight to an endpoint from the index below.

## All endpoints

### SQL

| Method | Path | What it does |
|---|---|---|
| **GET** | `/{owner}/{database}` | [SQL read queries on the default branch](/products/dolthub/api/sql#reading) |
| **GET** | `/{owner}/{database}/{ref}` | [SQL read queries on a specified ref](/products/dolthub/api/sql#reading) |
| **POST** | `/{owner}/{database}/write/{from_branch}/{to_branch}` | [SQL write query and merge branches](/products/dolthub/api/sql#writing) |
| **GET** | `/{owner}/{database}/write` | [Check write query operation status](/products/dolthub/api/sql#writing) |

### User

| Method | Path | What it does |
|---|---|---|
| **GET** | `/user` | [Get current user](/products/dolthub/api/user#get-current-user) |

### Databases

| Method | Path | What it does |
|---|---|---|
| **POST** | `/database` | [Create a new Dolt database](/products/dolthub/api/databases#create-database) |
| **POST** | `/fork` | [Fork an existing Dolt database](/products/dolthub/api/databases#fork-database) |
| **GET** | `/fork` | [Check fork operation status](/products/dolthub/api/databases#fork-database) |
| **GET** | `/{owner}/{database}/forks` | [List Forks](/products/dolthub/api/databases#list-forks) |

### Branches

| Method | Path | What it does |
|---|---|---|
| **POST** | `/{owner}/{database}/branches` | [Create Branch](/products/dolthub/api/branches#create-a-branch) |
| **GET** | `/{owner}/{database}/branches` | [List Branches](/products/dolthub/api/branches#list-branches) |

### Pull Requests

| Method | Path | What it does |
|---|---|---|
| **POST** | `/{owner}/{database}/pulls` | [Create a new pull request](/products/dolthub/api/pull-requests#create-pull-request) |
| **GET** | `/{owner}/{database}/pulls/{pull_id}` | [Get pull request by ID](/products/dolthub/api/pull-requests#get-pull-request-details) |
| **PATCH** | `/{owner}/{database}/pulls/{pull_id}` | [Update Pull Request](/products/dolthub/api/pull-requests#update-a-pull-request) |
| **GET** | `/{owner}/{database}/pulls` | [List pull requests of a database](/products/dolthub/api/pull-requests#list-pull-requests) |
| **POST** | `/{owner}/{database}/pulls/{pull_id}/comments` | [Add comment to pull request](/products/dolthub/api/pull-requests#create-a-pull-request-comment) |
| **POST** | `/{owner}/{database}/pulls/{pull_id}/merge` | [Merge a pull request](/products/dolthub/api/pull-requests#merge-pull-request) |
| **GET** | `/{owner}/{database}/pulls/{pull_id}/merge` | [Check merge operation status](/products/dolthub/api/pull-requests#merge-pull-request) |

### Releases

| Method | Path | What it does |
|---|---|---|
| **POST** | `/{owner}/{database}/releases` | [Create Release](/products/dolthub/api/releases#create-a-release) |
| **GET** | `/{owner}/{database}/releases` | [List Releases](/products/dolthub/api/releases#list-releases) |

### Tags

| Method | Path | What it does |
|---|---|---|
| **POST** | `/{owner}/{database}/tags` | [Create Tag](/products/dolthub/api/tags#create-a-tag) |
| **GET** | `/{owner}/{database}/tags` | [List Tags](/products/dolthub/api/tags#list-tags) |

### File Uploads

| Method | Path | What it does |
|---|---|---|
| **POST** | `/{owner}/{database}/upload` | [Upload a file to a DoltHub database](/products/dolthub/api/uploads#upload-a-file) |
| **GET** | `/{owner}/{database}/upload` | [Check import operation status](/products/dolthub/api/uploads#upload-a-file) |

### Jobs

| Method | Path | What it does |
|---|---|---|
| **GET** | `/users/{username}/operations` | [List operations](/products/dolthub/api/jobs#list-operations) |
| **GET** | `/{owner}/{database}/jobs` | [List jobs](/products/dolthub/api/jobs#list-jobs) |

