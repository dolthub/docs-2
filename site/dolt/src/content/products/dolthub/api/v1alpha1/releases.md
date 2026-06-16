---
title: "Releases"
description: Create and list releases on a DoltHub database over HTTP.
---

# Releases

_API version: v1alpha1_

DoltHub provides API endpoints for creating and listing releases on a database.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## Create a release

Here's an example of how to create a new release in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication).

Creating a release requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#6DB0FC">POST</span>
<code class="api-path">/{owner}/{database}/releases</code>
</div>
<p class="api-summary">Create Release</p>
<p class="api-description">This API endpoint allows you to create a new release in your database.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/releases</code></div>
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
<tr><td><code>title</code></td><td>string</td><td>Yes</td><td>The title of the release.</td></tr>
<tr><td><code>commitSha</code></td><td>string</td><td>Yes</td><td>The commit SHA or branch name of the release.</td></tr>
<tr><td><code>tag</code></td><td>string</td><td>Yes</td><td>The name of the tag.</td></tr>
<tr><td><code>description</code></td><td>string</td><td>No</td><td>The description of the tag.</td></tr>
<tr><td><code>createTagIfNotExists</code></td><td>boolean</td><td>No</td><td>Whether to create a tag if it doesn't exist.</td></tr>
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
  "release_tag": "v1",
  "release_description": "First version of the database",
  "release_commit_sha": "1234567890",
  "release_title": "my-release-v1",
  "release_created_at": "2021-01-01T00:00:00Z",
  "release_updated_at": "2021-01-01T00:00:00Z"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td>Status of the create branch operation</td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Owner of the database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Database name</td></tr>
<tr><td><code>release_tag</code></td><td>string</td><td>Name of the tag</td></tr>
<tr><td><code>release_description</code></td><td>string</td><td>Description of the release</td></tr>
<tr><td><code>release_commit_sha</code></td><td>string</td><td>Commit SHA of the release</td></tr>
<tr><td><code>release_title</code></td><td>string</td><td>Title of the release</td></tr>
<tr><td><code>release_created_at</code></td><td>string</td><td>Created at of the release</td></tr>
<tr><td><code>release_updated_at</code></td><td>string</td><td>Updated at of the release</td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error creating a release.",
  "database_owner": "dolthub",
  "database_name": "museum-collections",
  "release_tag": "v1",
  "release_description": "First version of the database",
  "release_commit_sha": "1234567890",
  "release_title": "my-release-v1"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>message</code></td><td>string</td><td></td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Owner of the database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Database name</td></tr>
<tr><td><code>release_tag</code></td><td>string</td><td>Name of the tag</td></tr>
<tr><td><code>release_description</code></td><td>string</td><td>Description of the release</td></tr>
<tr><td><code>release_commit_sha</code></td><td>string</td><td>Commit SHA of the release</td></tr>
<tr><td><code>release_title</code></td><td>string</td><td>Title of the release</td></tr>
</tbody></table>
</div>
</div>
</div>


## List releases

Here's an example of how to list releases in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication).

Listing releases requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/{owner}/{database}/releases</code>
</div>
<p class="api-summary">List Releases</p>
<p class="api-description">This API endpoint allows you to list all releases in your database.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/releases</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>owner</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the owner of the database. <em>Example: <code class="api-example">dolthub</code></em></td></tr>
<tr><td><code>database</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database. <em>Example: <code class="api-example">museum-collections</code></em></td></tr>
<tr><td><code>next_page_token</code></td><td>query</td><td>string</td><td>No</td><td>The next page token. <em>Example: <code class="api-example">1234567890</code></em></td></tr>
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
  "next_page_token": "1234567890",
  "releases": [
    {
      "release_title": "my-release-v1",
      "release_tag": "v1",
      "release_commit_sha": "1234567890",
      "release_description": "First version of the database",
      "release_created_at": "2023-03-31T18:00:00Z",
      "release_updated_at": "2023-03-31T18:00:00Z"
    }
  ]
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td>Status of the request</td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Owner of the database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Database name</td></tr>
<tr><td><code>next_page_token</code></td><td>string</td><td>Next page token</td></tr>
<tr><td><code>releases</code></td><td>array&lt;object&gt;</td><td>List of releases</td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error creating a release.",
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

