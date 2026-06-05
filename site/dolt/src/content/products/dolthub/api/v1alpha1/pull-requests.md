---
title: "Pull Requests"
description: Open, list, get, update, comment on, and merge pull requests on DoltHub over HTTP.
---

# Pull Requests

_API version: v1alpha1_

DoltHub provides API endpoints for creating, getting, updating, listing, commenting on, and merging pull requests on a database.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## Create pull request

Here is an example of opening a pull request on the `museum-collections` database with data from the Los Angeles County Museum of Art. This data was added to the `lacma` branch on a fork database, whose `owner` is `liuliu`, we would like to eventually merge `lacma` branch into the `main` branch using an [authorization token](authentication).

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#6DB0FC">POST</span>
<code class="api-path">/{owner}/{database}/pulls</code>
</div>
<p class="api-summary">Create a new pull request</p>
<p class="api-description">This API allows you to create a new pull request.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls</code></div>
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
<tr><td><code>title</code></td><td>string</td><td>No</td><td>The title of the pull request.</td></tr>
<tr><td><code>description</code></td><td>string</td><td>No</td><td>The description of the pull request.</td></tr>
<tr><td><code>fromBranchOwnerName</code></td><td>string</td><td>No</td><td>The name of the owner of the source branch.</td></tr>
<tr><td><code>fromBranchRepoName</code></td><td>string</td><td>No</td><td>The name of the database containing the source branch.</td></tr>
<tr><td><code>fromBranchName</code></td><td>string</td><td>No</td><td>The name of the source branch.</td></tr>
<tr><td><code>toBranchOwnerName</code></td><td>string</td><td>No</td><td>The name of the owner of the destination branch.</td></tr>
<tr><td><code>toBranchRepoName</code></td><td>string</td><td>No</td><td>The name of the database containing the destination branch.</td></tr>
<tr><td><code>toBranchName</code></td><td>string</td><td>No</td><td>The name of the destination branch.</td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Pull request created successfully.</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


## Get pull request details

This API allows you to retrieve the details of a specific pull request in the `museum-collections` database. In this example, we will retrieve the details of pull request #1.

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/{owner}/{database}/pulls/{pull_id}</code>
</div>
<p class="api-summary">Get pull request by ID</p>
<p class="api-description">Get information about a specific pull request.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls/{pull_id}</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>owner</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database owner. <em>Example: <code class="api-example">dolthub</code></em></td></tr>
<tr><td><code>database</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database. <em>Example: <code class="api-example">museum-collections</code></em></td></tr>
<tr><td><code>pull_id</code></td><td>path</td><td>string</td><td>Yes</td><td>ID of the pull request <em>Example: <code class="api-example">1</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Success</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


## Update a pull request

This API allows you to update a pull request by providing the fields you want to update in the request body. You can update the title, description, and state (only closing a pull request is supported).

Here's an example of how to update pull request #1 on the museum-collections database. In this example, we will set a new title, description, and close the pull request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#F0A35C">PATCH</span>
<code class="api-path">/{owner}/{database}/pulls/{pull_id}</code>
</div>
<p class="api-summary">Update Pull Request</p>
<p class="api-description">Updates a pull request by ID, including its title, description, and sets its state to be 'closed'.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls/{pull_id}</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>owner</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database owner. <em>Example: <code class="api-example">dolthub</code></em></td></tr>
<tr><td><code>database</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database. <em>Example: <code class="api-example">museum-collections</code></em></td></tr>
<tr><td><code>pull_id</code></td><td>path</td><td>string</td><td>Yes</td><td>ID of the pull request to update. <em>Example: <code class="api-example">1</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Request Body</h5>
<p>Content-Type: <code>application/json</code></p>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>title</code></td><td>string</td><td>No</td><td>The updated title of the pull request.</td></tr>
<tr><td><code>description</code></td><td>string</td><td>No</td><td>The updated description of the pull request.</td></tr>
<tr><td><code>state</code></td><td>string</td><td>No</td><td>The updated state of the pull request (can only update to 'closed')</td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Success</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


## List pull requests

Here is an example of listing pull requests for the `museum-collections` database using an [authorization token](authentication). The response of pull request list is paginated, so you need to use the next page token included in the response to retrieve the following pages of pull requests.

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/{owner}/{database}/pulls</code>
</div>
<p class="api-summary">List pull requests of a database</p>
<p class="api-description">List pull requests</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>owner</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database owner. <em>Example: <code class="api-example">dolthub</code></em></td></tr>
<tr><td><code>database</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database. <em>Example: <code class="api-example">museum-collections</code></em></td></tr>
<tr><td><code>pageToken</code></td><td>query</td><td>string</td><td>No</td><td>The pageToken to get the next page of results <em>Example: <code class="api-example">AWE2Nm9uMWQ23FSQ7oRTbCXYTLLvNDhNs5hIFebQFI66FW-SYXGSlh3XcUQ8zmtLQ00QgD0X5FZr5ZTAhvT2FfRrGog7OuUno9wdTIXFQpkkX0opYoJL6Vrn2emlXkMBTiZYMqChyhR92_Yxd58B0w5nMrfXFf8v7xfAkN46hw</code></em></td></tr>
<tr><td><code>filterByState</code></td><td>query</td><td>string</td><td>No</td><td>Filter pulls by state, can be Open, Closed, or Merged. <em>Example: <code class="api-example">Open</code></em></td></tr>
<tr><td><code>filterByReviewStatus</code></td><td>query</td><td>string</td><td>No</td><td>Filter pulls by review status, can be Approved, AssignedReviewer, Rejected or Reviewed <em>Example: <code class="api-example">Approved</code></em></td></tr>
<tr><td><code>query</code></td><td>query</td><td>string</td><td>No</td><td>Search by pull request title or author name. <em>Example: <code class="api-example">test</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Success</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


## Create a pull request comment

Here is an example of adding a pull request comment using an [authorization token](authentication).

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#6DB0FC">POST</span>
<code class="api-path">/{owner}/{database}/pulls/{pull_id}/comments</code>
</div>
<p class="api-summary">Add comment to pull request</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls/{pull_id}/comments</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>owner</code></td><td>path</td><td>string</td><td>Yes</td><td>Owner of the database <em>Example: <code class="api-example">dolthub</code></em></td></tr>
<tr><td><code>database</code></td><td>path</td><td>string</td><td>Yes</td><td>database name <em>Example: <code class="api-example">museum-collections</code></em></td></tr>
<tr><td><code>pull_id</code></td><td>path</td><td>string</td><td>Yes</td><td>Pull request ID <em>Example: <code class="api-example">66</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Request Body</h5>
<p>Content-Type: <code>application/json</code></p>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>comment</code></td><td>string</td><td>Yes</td><td>Comment to be added to the pull request</td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Success</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


## Merge pull request

Here is an example of merging a pull request `#66` on a database `museum-collections` using an [authorization token](authentication). Note that the merge operation is asynchronous and creates an operation that can be polled to get the result.

To poll the operation and check its status, you can use the `operationName` in the returned response of the merge request to query the API. Once the operation is complete, the response will contain a `job_id` field indicating the job that's running the merge, as well as other information such as the `database_owner`, `database_name`, and `pull_id`.

Keep in mind that the time it takes for the merge operation to complete can vary depending on the size of the pull request and the complexity of the changes being merged.&#x20;

Include this `header` in your request with the API token you created.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#6DB0FC">POST</span>
<code class="api-path">/{owner}/{database}/pulls/{pull_id}/merge</code>
</div>
<p class="api-summary">Merge a pull request</p>
<p class="api-description">This endpoint merges a pull request into the destination branch.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls/{pull_id}/merge</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>owner</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database owner. <em>Example: <code class="api-example">dolthub</code></em></td></tr>
<tr><td><code>database</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database. <em>Example: <code class="api-example">museum-collections</code></em></td></tr>
<tr><td><code>pull_id</code></td><td>path</td><td>string</td><td>Yes</td><td>The ID of the pull request to merge. <em>Example: <code class="api-example">66</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> The pull request was merged successfully.</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


Then use `GET` to poll the operation to check if the merge operation is done.

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/{owner}/{database}/pulls/{pull_id}/merge</code>
</div>
<p class="api-summary">Check merge operation status</p>
<p class="api-description">Poll the operation to check if the merge operation is done</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls/{pull_id}/merge</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>owner</code></td><td>path</td><td>string</td><td>Yes</td><td>The owner of the database <em>Example: <code class="api-example">dolthub</code></em></td></tr>
<tr><td><code>database</code></td><td>path</td><td>string</td><td>Yes</td><td>The database name <em>Example: <code class="api-example">museum-collections</code></em></td></tr>
<tr><td><code>pull_id</code></td><td>path</td><td>string</td><td>Yes</td><td>The ID of the pull request <em>Example: <code class="api-example">66</code></em></td></tr>
<tr><td><code>operationName</code></td><td>query</td><td>string</td><td>Yes</td><td>The operation name to check <em>Example: <code class="api-example">repositoryOwners/dolthub/repositories/museum-collections/jobs/b09a9221-9dcb-4a15-9ca8-a64656946f12</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> The status of the merge operation</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>

