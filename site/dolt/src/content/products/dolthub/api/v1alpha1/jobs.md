---
title: "Jobs"
description: Inspect the status of asynchronous DoltHub operations — merges, SQL writes, and file imports — and list them by user or by database.
---

# Jobs

_API version: v1alpha1_

DoltHub runs certain operations (merges, SQL writes, file imports) asynchronously as jobs. These endpoints let you list and inspect them.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

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
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Success",
  "operations": [
    {
      "operation_name": "users/liuliu/userOperations/5e4834c9-375d-4bbd-bdaf-09eb0734127c",
      "creator": "liuliu",
      "description": "Run query CREATE TABLE tablename (\\n  pk INT,\\n  col1 VARCHAR(255),\\n  PRIMARY KEY (pk)\\n);",
      "operation_type": "SqlWrite",
      "operation_status": "liuliu",
      "error": "table with name tablename already exists",
      "metadata": "{'from_branch_name':'main','from_repo_name':'api-db','from_repo_owner':'liuliu','sql_query':'CREATE TABLE tablename (\\n  pk INT,\\n  col1 VARCHAR(255),\\n  PRIMARY KEY (pk)\\n);','to_branch_name':'main','to_repo_name':'api-db','to_repo_owner':'liuliu'}",
      "created_at": "2024-01-09T22:19:49.000Z",
      "updated_at": "2024-01-09T22:19:50.000Z"
    }
  ],
  "next_page_token": "AWE2Nm9uMWQ26pQQpqLNLXu7a60647lpiZoDFrf5WDGHo68XNC-rfr068rymbEdUHCXidRxx7_fwGBMSzQi6C_D50NcJFXm0BwRnGmmHEL4T4xxkWoX3sL5mKD-PuMRuxeHPsR0NB5Rzi70jGzblVlfBTIHPJ20c630pNLrI_spxH0tYTzMnQ4uPpr3ub9P50FEH9i4Au0gUkmvj8NUibbGWi-R1AJYplEPr="
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td>Status of the request.</td></tr>
<tr><td><code>operations</code></td><td>array&lt;object&gt;</td><td>List of operations</td></tr>
<tr><td><code>next_page_token</code></td><td>string</td><td>Token for the next page of results</td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error getting the operations list.",
  "username": "liuliu",
  "operation_type": "SqlWrite"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>message</code></td><td>string</td><td></td></tr>
<tr><td><code>username</code></td><td>string</td><td>The name of the user who initiated the operations.</td></tr>
<tr><td><code>operation_type</code></td><td>string</td><td>Operation type if provided in the query</td></tr>
</tbody></table>
</div>
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
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Success",
  "database_owner": "dolthub",
  "database_name": "museum-collections",
  "jobs": [
    {
      "job_id": "repositoryOwners/dolthub/repositories/museum-collections/jobs/aa37149c-61c3-4ce2-b3d8-694d2a152257",
      "creator": "liuliu",
      "description": "Merge pull request #9",
      "job_type": "Merge",
      "status": "Failed",
      "created_at": "2024-01-09T22:19:49.000Z",
      "error": "failed to push to branch"
    }
  ],
  "next_page_token": "AWE2Nm9uMWQ2M84_Q_ajmYOdCDIg_Ac8OuedPyAGoTT3TsBNnTSE29QPb6oJmZdbjYwdFjTwu6_ioVx4nsp3eCPoO5zyATKGsauocvy4onXjoWGfqmatl2dcm-2Ks45NPT0qRPu37HjVcaC0Qj2X5_KHcYI70fzOLn1RogexmtBlf_AtI3os4DntzhZtfp9GFtHiVekppo_26viXiKcjy0DpKay5"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td>Status of the request.</td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Name of the owner of the database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Name of the database</td></tr>
<tr><td><code>jobs</code></td><td>array&lt;object&gt;</td><td>List of jobs</td></tr>
<tr><td><code>next_page_token</code></td><td>string</td><td>Token for the next page of results</td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">400</span> Bad request. The request was invalid or could not be processed.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Error getting the jobs list.",
  "database_owner": "dolthub",
  "database_name": "museum-collections"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>message</code></td><td>string</td><td></td></tr>
<tr><td><code>database_owner</code></td><td>string</td><td>Name of the owner of the database</td></tr>
<tr><td><code>database_name</code></td><td>string</td><td>Name of the database</td></tr>
</tbody></table>
</div>
</div>
</div>

