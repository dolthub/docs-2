---
title: "Databases"
description: Create, fork, and list forks of a DoltHub database over HTTP.
---

# Databases

_API version: v1alpha1_

DoltHub provides API endpoints for creating, forking, and listing forks of a database.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## Create database

Here's an example of how to create a new database called `museum-collections` under the organization `dolthub` using an [authorization token](authentication).

Creating a database requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#6DB0FC">POST</span>
<code class="api-path">/database</code>
</div>
<p class="api-summary">Create a new Dolt database</p>
<p class="api-description">This API allows you to create a new Dolt database.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/database</code></div>
<div class="api-section">
<h5>Request Body</h5>
<p>Content-Type: <code>application/json</code></p>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>description</code></td><td>string</td><td>No</td><td>A description of the database.</td></tr>
<tr><td><code>ownerName</code></td><td>string</td><td>No</td><td>The name of the owner of the database.</td></tr>
<tr><td><code>repoName</code></td><td>string</td><td>No</td><td>The name of the repository for the database.</td></tr>
<tr><td><code>visibility</code></td><td>string</td><td>No</td><td>The visibility of the database (public or private).</td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Database created successfully.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Success",
  "description": "Records from museums around the world.",
  "repository_owner": "dolthub",
  "repository_name": "museum-collections",
  "visibility": "public"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>description</code></td><td>string</td><td></td></tr>
<tr><td><code>repository_owner</code></td><td>string</td><td></td></tr>
<tr><td><code>repository_name</code></td><td>string</td><td></td></tr>
<tr><td><code>visibility</code></td><td>string</td><td></td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error creating a database.",
  "description": "Records from museums around the world.",
  "repository_owner": "dolthub",
  "repository_name": "museum-collections",
  "visibility": "public"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>message</code></td><td>string</td><td></td></tr>
<tr><td><code>description</code></td><td>string</td><td></td></tr>
<tr><td><code>repository_owner</code></td><td>string</td><td></td></tr>
<tr><td><code>repository_name</code></td><td>string</td><td></td></tr>
<tr><td><code>visibility</code></td><td>string</td><td></td></tr>
</tbody></table>
</div>
</div>
</div>


## Fork database

Here's an example of how to fork a database called `dolthub/museum-collections` to the username `taylor` using an [authorization token](authentication). Note that the fork operation is asynchronous and creates an operation that can be polled to get the result.

To poll the operation and check its status, you can use the `operationName` in the returned response of the fork request to query the API. Once the operation is complete, the response will contain the new database owner and name.

Keep in mind that the time it takes for the fork operation to complete can vary depending on the size of the database.

Forking a database requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#6DB0FC">POST</span>
<code class="api-path">/fork</code>
</div>
<p class="api-summary">Fork an existing Dolt database</p>
<p class="api-description">This API allows you to fork an existing Dolt database.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/fork</code></div>
<div class="api-section">
<h5>Request Body</h5>
<p>Content-Type: <code>application/json</code></p>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>parentOwnerName</code></td><td>string</td><td>No</td><td>The name of the owner of the parent database.</td></tr>
<tr><td><code>parentDatabaseName</code></td><td>string</td><td>No</td><td>The name of the parent database.</td></tr>
<tr><td><code>ownerName</code></td><td>string</td><td>No</td><td>The name of the owner to fork to.</td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Success.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Success",
  "parent_owner": "dolthub",
  "parent_database": "museum-collections",
  "forked_owner": "myusername",
  "operation_name": "operations/b09a9221-9dcb-4a15-9ca8-a64656946f12"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>parent_owner</code></td><td>string</td><td></td></tr>
<tr><td><code>parent_database</code></td><td>string</td><td></td></tr>
<tr><td><code>forked_owner</code></td><td>string</td><td></td></tr>
<tr><td><code>operation_name</code></td><td>string</td><td></td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error creating a database.",
  "parent_owner": "dolthub",
  "parent_database": "museum-collections",
  "forked_owner": "myusername"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>message</code></td><td>string</td><td></td></tr>
<tr><td><code>parent_owner</code></td><td>string</td><td></td></tr>
<tr><td><code>parent_database</code></td><td>string</td><td></td></tr>
<tr><td><code>forked_owner</code></td><td>string</td><td></td></tr>
</tbody></table>
</div>
</div>
</div>


Then use `GET` to poll the operation to check if the fork operation is done.

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/fork</code>
</div>
<p class="api-summary">Check fork operation status</p>
<p class="api-description">Poll the operation to check if the fork operation is done</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/fork</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>operationName</code></td><td>query</td><td>string</td><td>Yes</td><td>The operation name to check <em>Example: <code class="api-example">operations/b09a9221-9dcb-4a15-9ca8-a64656946f12</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> The status of the fork operation</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Success",
  "done": true,
  "operation_name": "operations/jobs/b09a9221-9dcb-4a15-9ca8-a64656946f12",
  "database_owner": "myusername",
  "database_name": "museum-collections"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td>The status of the operation, Success if the fork creation was successful</td></tr>
<tr><td><code>done</code></td><td>boolean</td><td>True if the fork operation is done, false otherwise</td></tr>
<tr><td><code>operation_name</code></td><td>string</td><td>The operation name</td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>The owner of the newly forked database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>The name of the newly forked database</td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error polling an operation status.",
  "operation_name": "operations/jobs/b09a9221-9dcb-4a15-9ca8-a64656946f12"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>message</code></td><td>string</td><td></td></tr>
<tr><td><code>operation_name</code></td><td>string</td><td></td></tr>
</tbody></table>
</div>
</div>
</div>


## List forks

Here's an example of how to list the databases within the fork network of a database called `dolthub/museum-collections` using an [authorization token](authentication).

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/{owner}/{database}/forks</code>
</div>
<p class="api-summary">List Forks</p>
<p class="api-description">This API endpoint allows you to list all forks within the fork network of a database.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/forks</code></div>
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
  "forks": [
    {
      "database_owner": "anotherOrg",
      "database_name": "museum-collections"
    }
  ],
  "parent_owner": "",
  "parent_database_name": "",
  "network_root_owner": "dolthub",
  "network_root_database_name": "museum-collections",
  "fork_network_count": 3
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td>Status of the request.</td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Owner of the database.</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Name of the database.</td></tr>
<tr><td><code>forks</code></td><td>array&lt;object&gt;</td><td>List of forks within the fork network of this database.</td></tr>
<tr><td><code>parent_owner</code></td><td>string</td><td>Owner of the parent database, empty if this is the root.</td></tr>
<tr><td><code>parent_database_name</code></td><td>string</td><td>Name of the parent database, empty if this is the root.</td></tr>
<tr><td><code>network_root_owner</code></td><td>string</td><td>Owner of the root database in the fork network.</td></tr>
<tr><td><code>network_root_database_name</code></td><td>string</td><td>Name of the root database in the fork network.</td></tr>
<tr><td><code>fork_network_count</code></td><td>integer</td><td>Number of forks in the fork network (excluding the root).</td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error getting the forks list.",
  "database_owner": "dolthub",
  "database_name": "with-archives"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>message</code></td><td>string</td><td></td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Owner of the database.</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Name of the database.</td></tr>
</tbody></table>
</div>
</div>
</div>

