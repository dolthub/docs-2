---
title: "File Uploads"
description: Upload data files into a DoltHub database asynchronously, with optional transformations and progress polling.
---

# File Uploads

_API version: v1alpha1_

DoltHub provides an API endpoint for uploading data files into a database. Uploads run asynchronously — the same endpoint also lets you poll the import job for status.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

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


Here is an example of uploading a CSV file to create a table through this api endpoint in Javascript, you can reference the [`dolt table import`](/cli-reference/cli#dolt-table-import) documentation for additional information.:

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

