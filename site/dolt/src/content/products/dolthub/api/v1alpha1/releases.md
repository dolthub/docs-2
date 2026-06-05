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
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
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
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>

