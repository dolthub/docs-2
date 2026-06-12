---
title: "File Uploads"
description: Upload data files into a DoltHub database asynchronously, with optional transformations and progress polling.
---

_API version: v1alpha1_

DoltHub provides an API endpoint for uploading data files into a database. Uploads run asynchronously — the same endpoint also lets you poll the import job for status.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## Upload a file

Here is an example of uploading a file `lacma.csv` to create a table `lacma` on a database `museum-collections` using an [authorization token](authentication.md). Note that the file import operation is asynchronous and creates an operation that can be polled to get the result.

To poll the operation and check its status, you can use the `operationName` in the returned response of the file upload post to query the API. Once the operation is complete, the response will contain a `job_id` field indicating the job that's running the file import as well as the id of the pull request that's created when the import job is completed.

Keep in mind that the time it takes for the import operation to complete can vary depending on the size of the file and the complexity of the changes being applied to the database. The file size limit is 100 MB.

Include this `header` in your request with the API token you created.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

To upload the file, include two fields in the request body, `file` and `params`, the `file` should be type of `Blob`, and `params` should be a JSON object.

{% swagger src="../../../../.gitbook/assets/dolthub-api/fileUpload.json" path="/{owner}/{database}/upload" method="post" %}
[fileUpload.json](../../../../.gitbook/assets/dolthub-api/fileUpload.json)
{% endswagger %}

Then use `GET` to poll the operation to check if the import operation is done.

{% swagger src="../../../../.gitbook/assets/dolthub-api/pollImportJob.json" path="/{owner}/{database}/upload" method="get" %}
[pollImportJob.json](../../../../.gitbook/assets/dolthub-api/pollImportJob.json)
{% endswagger %}

Here is an example of uploading a CSV file to create a table through this api endpoint in Javascript, you can reference the [`dolt table import`](/cli-reference/cli#dolt-table-import) documentation for additional information.:

{% hint style="info" %}
Please make sure to send your requests to `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/upload` instead of `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/upload/`, do not need the last `/`.
{% endhint %}

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

