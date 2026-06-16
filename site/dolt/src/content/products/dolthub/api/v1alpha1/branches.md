---
title: "Branches"
description: Create and list branches on a DoltHub database over HTTP.
---

# Branches

_API version: v1alpha1_

DoltHub provides API endpoints for creating and listing branches on a database.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## Create a branch

Here's an example of how to create a new branch in database `museum-collections` under the organization `dolthub` using an [authorization token](authentication).

Creating a branch requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#6DB0FC">POST</span>
<code class="api-path">/{owner}/{database}/branches</code>
</div>
<p class="api-summary">Create Branch</p>
<p class="api-description">This API endpoint allows you to create a new branch in your database.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/branches</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>owner</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the owner of the database. <em>Example: <code class="api-example">dolthub</code></em></td></tr>
<tr><td><code>database</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database. <em>Example: <code class="api-example">museum-collections</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Request Body</h5>
<p>Content-Type: <code>application/json</code></p>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>revisionType</code></td><td>string</td><td>Yes</td><td>The type of revision, can be either 'branch', 'ref' or 'commit'.</td></tr>
<tr><td><code>revisionName</code></td><td>string</td><td>Yes</td><td>The name of revision. If revisionType is 'branch', this is the name of the base branch. If revisionType is 'commit', this is the commit hash.</td></tr>
<tr><td><code>newBranchName</code></td><td>string</td><td>Yes</td><td>The name of the new branch.</td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Success</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Success",
  "database_owner": "dolthub",
  "database_name": "museum-collections",
  "new_branch_name": "feature-branch",
  "revision_type": "branch",
  "revision_name": "main"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td>Status of the create branch operation</td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Owner of the database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Database name</td></tr>
<tr><td><code>new_branch_name</code></td><td>string</td><td>Name of the new branch</td></tr>
<tr><td><code>revision_type</code></td><td>string</td><td>Type of the revision</td></tr>
<tr><td><code>revision_name</code></td><td>string</td><td>Name of the revision</td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error creating a branch.",
  "database_owner": "dolthub",
  "database_name": "museum-collections",
  "new_branch_name": "feature-branch",
  "revision_type": "branch",
  "revision_name": "main"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>message</code></td><td>string</td><td></td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Owner of the database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Database name</td></tr>
<tr><td><code>new_branch_name</code></td><td>string</td><td>Name of the new branch</td></tr>
<tr><td><code>revision_type</code></td><td>string</td><td>Type of the revision</td></tr>
<tr><td><code>revision_name</code></td><td>string</td><td>Name of the revision</td></tr>
</tbody></table>
</div>
</div>
</div>


## List branches

Here's an example of how to list branches in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication).

Listing branches requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/{owner}/{database}/branches</code>
</div>
<p class="api-summary">List Branches</p>
<p class="api-description">This API endpoint allows you to list all branches in your database.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/branches</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>owner</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the owner of the database. <em>Example: <code class="api-example">dolthub</code></em></td></tr>
<tr><td><code>database</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database. <em>Example: <code class="api-example">museum-collections</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Success</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Success",
  "database_owner": "dolthub",
  "database_name": "museum-collections",
  "branches": [
    {
      "branch_name": "main"
    }
  ]
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td>Status of the request.</td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Owner of the database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Database name</td></tr>
<tr><td><code>branches</code></td><td>array&lt;object&gt;</td><td>List of branches</td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error getting the branches list.",
  "database_owner": "dolthub",
  "database_name": "museum-collections"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>message</code></td><td>string</td><td></td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Owner of the database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Database name</td></tr>
</tbody></table>
</div>
</div>
</div>

