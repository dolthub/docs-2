---
title: "Database"
---

# Database

DoltHub provides a database API for fetching and creating data on your database. You can create a database, create a pull request, create a pull request comment, and merge a pull request through these APIs.

> **Note**
Please make sure to send your requests to `https://www.dolthub.com` instead of `https://dolthub.com`.


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
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
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
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
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
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
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
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


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


## Create a pull request comment&#x20;

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


## Upload a file

Here is an example of uploading a file `lacma.csv` to create a table `lacma` on a database `museum-collections` using an [authorization token](authentication). Note that the file import operation is asynchronous and creates an operation that can be polled to get the result.

To poll the operation and check its status, you can use the `operationName` in the returned response of the file upload post to query the API. Once the operation is complete, the response will contain a `job_id` field indicating the job that's running the file import as well as the id of the pull request that's created when the import job is completed.

Keep in mind that the time it takes for the import operation to complete can vary depending on the size of the file and the complexity of the changes being applied to the database. The file size limit is 100 MB.

Include this `header` in your request with the API token you created.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

To upload the file, include two fields in the request body, `file` and `params`, the `file` should be type of `Blob`, and `params` should be a JSON object.

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#6DB0FC">POST</span>
<code class="api-path">/{owner}/{database}/upload</code>
</div>
<p class="api-summary">Upload a file to a DoltHub database</p>
<p class="api-description">This endpoint allows you to upload a file to DoltHub to create, update, overwrite, or replace a table.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/upload</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>owner</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database owner. <em>Example: <code class="api-example">dolthub</code></em></td></tr>
<tr><td><code>database</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the database. <em>Example: <code class="api-example">museum-collections</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Request Body</h5>
<p>Content-Type: <code>multipart/form-data</code></p>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>file</code></td><td>string</td><td>No</td><td>The file to be uploaded.</td></tr>
<tr><td><code>params</code></td><td>object</td><td>No</td><td></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Pull request created successfully.</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


Then use `GET` to poll the operation to check if the import operation is done.

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/{owner}/{database}/upload</code>
</div>
<p class="api-summary">Check import operation status</p>
<p class="api-description">Poll the operation to check if the file import operation is done</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/upload</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>owner</code></td><td>path</td><td>string</td><td>Yes</td><td>The owner of the database <em>Example: <code class="api-example">dolthub</code></em></td></tr>
<tr><td><code>database</code></td><td>path</td><td>string</td><td>Yes</td><td>The database name <em>Example: <code class="api-example">museum-collections</code></em></td></tr>
<tr><td><code>branch</code></td><td>query</td><td>string</td><td>Yes</td><td>The name of the branch to upload the file to. <em>Example: <code class="api-example">main</code></em></td></tr>
<tr><td><code>operationName</code></td><td>query</td><td>string</td><td>Yes</td><td>The operation name to check <em>Example: <code class="api-example">repositoryOwners/dolthub/repositories/museum-collections/jobs/b09a9221-9dcb-4a15-9ca8-a64656946f12</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> The status of the file import operation</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


Here is an example of uploading a CSV file to create a table through this api endpoint in Javascript, you can reference the [`dolt table import`](https://docs.dolthub.com/cli-reference/cli#dolt-table-import) documentation for additional information.:

> **Note**
Please make sure to send your requests to `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/upload` instead of `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/upload/`, do not need the last `/`.


```js
const fs = require("fs");

const url =
  "https://www.dolthub.com/api/v1alpha1/dolthub/museum-collections/upload";


const headers = {
  "Content-Type": "application/json",
  authorization: [api token you created],
};

const filePath = "lacma.csv";

fetchFileAndSend(filePath);

async function fetchFileAndSend(filePath) {
  const params = {
    tableName: "lacma",
    fileName: "lacma.csv",
    branchName:"main",
    fileType: "Csv",
    importOp: "Create",
    primaryKeys: ["id"],
  };

  const formData = new FormData();
  const fileData = fs.readFileSync(filePath);
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  await formData.append("file", blob, "lacma.csv");
  formData.append("params", JSON.stringify(params));

  fetch(url, {
    method: "POST",
    headers,
    body: formData,
  })
   .then((response) => {
        // process response
    })
    .catch((error) => {
      // process error
    });
}

```

And an example of polling the job status in Javascript:

```js
function pollOperation(op_name,branch_name) {
  const url = `https: //www.dolthub.com/api/v1alpha1/dolthub/museum-collections/upload?branchName=${branch_name}&operationName=${op_name}`;
  const headers = {
    "Content-Type": "application/json",
    authorization: [api token you created],
  };

  while (true) {
    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    const data = await res.json();
    if (data.job_created) {
      return data;
    } else {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

}
```

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
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
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
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


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
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
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
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


## Create a release

Here's an example of how to create a new release in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication).

Creating a release requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/createRelease.json" path="/{owner}/{database}/releases" method="post" %  }
[createRelease.json](../../../.gitbook/assets/dolthub-api/createRelease.json)
{% endswagger %}

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


## List operations

DoltHub provides support for asynchronous operations, including merging, SQL writes, and file importing. When you execute one of these operations from the API, you will get an operation name that you can poll using another endpoint to check the operation status and other information.

This API endpoint lets you monitor the status of all the operations you started in one place without needing to poll the endpoints for singular operations. These operations have `error` and `metadata` fields which contain useful information for troubleshooting and debugging.

For example, if you have executed a few SQL write queries using that [API endpoint](sql#writing), you can list those operations using the `operationType` query parameter to filter for `SqlWrite` operations. The `metadata` will show the query executed, database and branch that the query ran on, as well as any syntax or other errors you may have encountered.

Here's an example of how to list `SqlWrite` operations initiated by user `liuliu` using an [authorization token](authentication).

Listing operations requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/users/{username}/operations</code>
</div>
<p class="api-summary">List operations</p>
<p class="api-description">This API endpoint allows you to list all operations that are created by the user.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/users/{username}/operations</code></div>
<div class="api-section">
<h5>Parameters</h5>
<table class="api-params">
<thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>username</code></td><td>path</td><td>string</td><td>Yes</td><td>The name of the user who initiated the operations. This user's name must match the user associated with the api token. <em>Example: <code class="api-example">liuliu</code></em></td></tr>
<tr><td><code>operationType</code></td><td>query</td><td>string</td><td>No</td><td>Specific type of operation for this query. Supported operation types are SqlWrite, SqlRead, Import, Merge, Migrate. <em>Example: <code class="api-example">SqlWrite</code></em></td></tr>
<tr><td><code>pageToken</code></td><td>query</td><td>string</td><td>No</td><td>Token for the next page of results <em>Example: <code class="api-example">AWE2Nm9uMWQ26pQQpqLNLXu7a60647lpiZoDFrf5WDGHo68XNC-rfr068rymbEdUHCXidRxx7_fwGBMSzQi6C_D50NcJFXm0BwRnGmmHEL4T4xxkWoX3sL5mKD-PuMRuxeHPsR0NB5Rzi70jGzblVlfBTIHPJ20c630pNLrI_spxH0tYTzMnQ4uPpr3ub9P50FEH9i4Au0gUkmvj8NUibbGWi-R1AJYplEPr=</code></em></td></tr>
</tbody></table>
</div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Success</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>


## List jobs

DoltHub performs certain asynchronous operations through job execution, including merging, importing, SQL reading, and migrating. When these operations are initiated via the API, you receive an operation name that includes the job ID.

This API endpoint lets you monitor the status of jobs started in a specific database.

Here is an example of how to list all the jobs on a database `museum-collections` using an [authorization token](authentication).

Listing jobs requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/{owner}/{database}/jobs</code>
</div>
<p class="api-summary">List jobs</p>
<p class="api-description">This API endpoint allows you to list all jobs in your database.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/{owner}/{database}/jobs</code></div>
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
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
</div>
</div>

