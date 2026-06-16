---
title: "Tags"
description: Create and list tags on a DoltHub database over HTTP.
---

# Tags

_API version: v1alpha1_

DoltHub provides API endpoints for creating and listing tags on a database.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## Create a tag

Here's an example of how to create a new tag in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication).

Creating a tag requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#6DB0FC">POST</span>
<code class="api-path">/{owner}/{database}/tags</code>
</div>
<p class="api-summary">Create Tag</p>
<p class="api-description">This API endpoint allows you to create a new tag in your database.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/tags</code></div>
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
<tr><td><code>tagName</code></td><td>string</td><td>Yes</td><td>The name of the tag.</td></tr>
<tr><td><code>tagMessage</code></td><td>string</td><td>Yes</td><td>The description of the tag.</td></tr>
<tr><td><code>revisionType</code></td><td>string</td><td>Yes</td><td>The type of revision, can be either 'branch', 'ref' or 'commit'.</td></tr>
<tr><td><code>revisionName</code></td><td>string</td><td>Yes</td><td>The name of revision. If revisionType is 'branch', this is the name of the base branch. If revisionType is 'commit', this is the commit hash.</td></tr>
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
  "tag_name": "v1",
  "tag_description": "First version of the database",
  "revision_type": "branch",
  "revision_name": "main"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td>Status of the create branch operation</td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Owner of the database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Database name</td></tr>
<tr><td><code>tag_name</code></td><td>string</td><td>Name of the tag</td></tr>
<tr><td><code>tag_description</code></td><td>string</td><td>Description of the tag</td></tr>
<tr><td><code>revision_type</code></td><td>string</td><td>Type of the revision</td></tr>
<tr><td><code>revision_name</code></td><td>string</td><td>Name of the revision</td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error creating a tag.",
  "database_owner": "dolthub",
  "database_name": "museum-collections",
  "tag_name": "v1",
  "tag_description": "First version of the database",
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
<tr><td><code>tag_name</code></td><td>string</td><td>Name of the tag</td></tr>
<tr><td><code>tag_description</code></td><td>string</td><td>Description of the tag</td></tr>
<tr><td><code>revision_type</code></td><td>string</td><td>Type of the revision</td></tr>
<tr><td><code>revision_name</code></td><td>string</td><td>Name of the revision</td></tr>
</tbody></table>
</div>
</div>
</div>


## List tags

Here's an example of how to list tags in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication).

Listing tags requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/{owner}/{database}/tags</code>
</div>
<p class="api-summary">List Tags</p>
<p class="api-description">This API endpoint allows you to list all tags in your database.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/tags</code></div>
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
  "tags": [
    {
      "tag_name": "v1",
      "tag_description": "First version of the database",
      "tagged_at": "2023-03-31T18:00:00Z"
    }
  ]
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td>Status of the request</td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Owner of the database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Database name</td></tr>
<tr><td><code>tags</code></td><td>array&lt;object&gt;</td><td>List of tags</td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error creating a tag.",
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

