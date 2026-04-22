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

#### `POST` /database

Create a new Dolt database

This API allows you to create a new Dolt database.

**URL**: `https://www.dolthub.com/api/v1alpha1/database`


**Request Body**

Content-Type: `application/json`

- **`description`** (string, Optional) — A description of the database.
- **`ownerName`** (string, Optional) — The name of the owner of the database.
- **`repoName`** (string, Optional) — The name of the repository for the database.
- **`visibility`** (string, Optional) — The visibility of the database (public or private).


**Responses**

- **200**: Database created successfully.
- **400**: Bad request. The request was invalid or could not be processed.

---


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

#### `POST` /fork

Fork an existing Dolt database

This API allows you to fork an existing Dolt database.

**URL**: `https://www.dolthub.com/api/v1alpha1/fork`


**Request Body**

Content-Type: `application/json`

- **`parentOwnerName`** (string, Optional) — The name of the owner of the parent database.
- **`parentDatabaseName`** (string, Optional) — The name of the parent database.
- **`ownerName`** (string, Optional) — The name of the owner to fork to.


**Responses**

- **200**: Success.
- **400**: Bad request. The request was invalid or could not be processed.

---


Then use `GET` to poll the operation to check if the fork operation is done.

#### `GET` /fork

Check fork operation status

Poll the operation to check if the fork operation is done

**URL**: `https://www.dolthub.com/api/v1alpha1/fork`

**Parameters**

**`operationName`** (query, string, Required)
  The operation name to check
  Example: `operations/b09a9221-9dcb-4a15-9ca8-a64656946f12`


**Responses**

- **200**: The status of the fork operation
- **400**: Bad request. The request was invalid or could not be processed.

---


## List forks

Here's an example of how to list the databases within the fork network of a database called `dolthub/museum-collections` using an [authorization token](authentication).

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

#### `GET` /{owner}/{database}/forks

List Forks

This API endpoint allows you to list all forks within the fork network of a database.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/forks`

**Parameters**

**`owner`** (path, string, Required)
  The name of the owner of the database.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---


## Create pull request

Here is an example of opening a pull request on the `museum-collections` database with data from the Los Angeles County Museum of Art. This data was added to the `lacma` branch on a fork database, whose `owner` is `liuliu`, we would like to eventually merge `lacma` branch into the `main` branch using an [authorization token](authentication).

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

#### `POST` /{owner}/{database}/pulls

Create a new pull request

This API allows you to create a new pull request.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls`

**Parameters**

**`owner`** (path, string, Required)
  The name of the owner of the database.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`


**Request Body**

Content-Type: `application/json`

- **`title`** (string, Optional) — The title of the pull request.
- **`description`** (string, Optional) — The description of the pull request.
- **`fromBranchOwnerName`** (string, Optional) — The name of the owner of the source branch.
- **`fromBranchRepoName`** (string, Optional) — The name of the database containing the source branch.
- **`fromBranchName`** (string, Optional) — The name of the source branch.
- **`toBranchOwnerName`** (string, Optional) — The name of the owner of the destination branch.
- **`toBranchRepoName`** (string, Optional) — The name of the database containing the destination branch.
- **`toBranchName`** (string, Optional) — The name of the destination branch.


**Responses**

- **200**: Pull request created successfully.
- **400**: Bad request. The request was invalid or could not be processed.

---


## Get pull request details

This API allows you to retrieve the details of a specific pull request in the `museum-collections` database. In this example, we will retrieve the details of pull request #1.

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

#### `GET` /{owner}/{database}/pulls/{pull_id}

Get pull request by ID

Get information about a specific pull request.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls/{pull_id}`

**Parameters**

**`owner`** (path, string, Required)
  The name of the database owner.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`

**`pull_id`** (path, string, Required)
  ID of the pull request
  Example: `1`


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---


## Update a pull request

This API allows you to update a pull request by providing the fields you want to update in the request body. You can update the title, description, and state (only closing a pull request is supported).

Here's an example of how to update pull request #1 on the museum-collections database. In this example, we will set a new title, description, and close the pull request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

#### `PATCH` /{owner}/{database}/pulls/{pull_id}

Update Pull Request

Updates a pull request by ID, including its title, description, and sets its state to be 'closed'.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls/{pull_id}`

**Parameters**

**`owner`** (path, string, Required)
  The name of the database owner.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`

**`pull_id`** (path, string, Required)
  ID of the pull request to update.
  Example: `1`


**Request Body**

Content-Type: `application/json`

- **`title`** (string, Optional) — The updated title of the pull request.
- **`description`** (string, Optional) — The updated description of the pull request.
- **`state`** (string, Optional) — The updated state of the pull request (can only update to 'closed')


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---


## List pull requests

Here is an example of listing pull requests for the `museum-collections` database using an [authorization token](authentication). The response of pull request list is paginated, so you need to use the next page token included in the response to retrieve the following pages of pull requests.

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

#### `GET` /{owner}/{database}/pulls

List pull requests of a database

List pull requests

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls`

**Parameters**

**`owner`** (path, string, Required)
  The name of the database owner.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`

**`pageToken`** (query, string, Optional)
  The pageToken to get the next page of results
  Example: `AWE2Nm9uMWQ23FSQ7oRTbCXYTLLvNDhNs5hIFebQFI66FW-SYXGSlh3XcUQ8zmtLQ00QgD0X5FZr5ZTAhvT2FfRrGog7OuUno9wdTIXFQpkkX0opYoJL6Vrn2emlXkMBTiZYMqChyhR92_Yxd58B0w5nMrfXFf8v7xfAkN46hw`

**`filterByState`** (query, string, Optional)
  Filter pulls by state, can be Open, Closed, or Merged.
  Example: `Open`

**`filterByReviewStatus`** (query, string, Optional)
  Filter pulls by review status, can be Approved, AssignedReviewer, Rejected or Reviewed
  Example: `Approved`

**`query`** (query, string, Optional)
  Search by pull request title or author name.
  Example: `test`


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---


## Create a pull request comment&#x20;

Here is an example of adding a pull request comment using an [authorization token](authentication).

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

#### `POST` /{owner}/{database}/pulls/{pull_id}/comments

Add comment to pull request

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls/{pull_id}/comments`

**Parameters**

**`owner`** (path, string, Required)
  Owner of the database
  Example: `dolthub`

**`database`** (path, string, Required)
  database name
  Example: `museum-collections`

**`pull_id`** (path, string, Required)
  Pull request ID
  Example: `66`


**Request Body**

Content-Type: `application/json`

- **`comment`** (string, Required) — Comment to be added to the pull request


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---


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

#### `POST` /{owner}/{database}/pulls/{pull_id}/merge

Merge a pull request

This endpoint merges a pull request into the destination branch.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls/{pull_id}/merge`

**Parameters**

**`owner`** (path, string, Required)
  The name of the database owner.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`

**`pull_id`** (path, string, Required)
  The ID of the pull request to merge.
  Example: `66`


**Responses**

- **200**: The pull request was merged successfully.
- **400**: Bad request. The request was invalid or could not be processed.

---


Then use `GET` to poll the operation to check if the merge operation is done.

#### `GET` /{owner}/{database}/pulls/{pull_id}/merge

Check merge operation status

Poll the operation to check if the merge operation is done

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/pulls/{pull_id}/merge`

**Parameters**

**`owner`** (path, string, Required)
  The owner of the database
  Example: `dolthub`

**`database`** (path, string, Required)
  The database name
  Example: `museum-collections`

**`pull_id`** (path, string, Required)
  The ID of the pull request
  Example: `66`

**`operationName`** (query, string, Required)
  The operation name to check
  Example: `repositoryOwners/dolthub/repositories/museum-collections/jobs/b09a9221-9dcb-4a15-9ca8-a64656946f12`


**Responses**

- **200**: The status of the merge operation
- **400**: Bad request. The request was invalid or could not be processed.

---


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

#### `POST` /{owner}/{database}/upload

Upload a file to a DoltHub database

This endpoint allows you to upload a file to DoltHub to create, update, overwrite, or replace a table.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/upload`

**Parameters**

**`owner`** (path, string, Required)
  The name of the database owner.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`


**Request Body**

Content-Type: `multipart/form-data`

- **`file`** (string, Optional) — The file to be uploaded.
- **`params`** (object, Optional)


**Responses**

- **200**: Pull request created successfully.
- **400**: Bad request. The request was invalid or could not be processed.

---


Then use `GET` to poll the operation to check if the import operation is done.

#### `GET` /{owner}/{database}/upload

Check import operation status

Poll the operation to check if the file import operation is done

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/upload`

**Parameters**

**`owner`** (path, string, Required)
  The owner of the database
  Example: `dolthub`

**`database`** (path, string, Required)
  The database name
  Example: `museum-collections`

**`branch`** (query, string, Required)
  The name of the branch to upload the file to.
  Example: `main`

**`operationName`** (query, string, Required)
  The operation name to check
  Example: `repositoryOwners/dolthub/repositories/museum-collections/jobs/b09a9221-9dcb-4a15-9ca8-a64656946f12`


**Responses**

- **200**: The status of the file import operation
- **400**: Bad request. The request was invalid or could not be processed.

---


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

#### `POST` /{owner}/{database}/branches

Create Branch

This API endpoint allows you to create a new branch in your database.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/branches`

**Parameters**

**`owner`** (path, string, Required)
  The name of the owner of the database.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`


**Request Body**

Content-Type: `application/json`

- **`revisionType`** (string, Required) — The type of revision, can be either 'branch', 'ref' or 'commit'.
- **`revisionName`** (string, Required) — The name of revision. If revisionType is 'branch', this is the name of the base branch. If revisionType is 'commit', this is the commit hash.
- **`newBranchName`** (string, Required) — The name of the new branch.


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---


## List branches

Here's an example of how to list branches in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication).

Listing branches requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

#### `GET` /{owner}/{database}/branches

List Branches

This API endpoint allows you to list all branches in your database.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/branches`

**Parameters**

**`owner`** (path, string, Required)
  The name of the owner of the database.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---


## Create a tag

Here's an example of how to create a new tag in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication).

Creating a tag requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

#### `POST` /{owner}/{database}/tags

Create Tag

This API endpoint allows you to create a new tag in your database.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/tags`

**Parameters**

**`owner`** (path, string, Required)
  The name of the owner of the database.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`


**Request Body**

Content-Type: `application/json`

- **`tagName`** (string, Required) — The name of the tag.
- **`tagMessage`** (string, Required) — The description of the tag.
- **`revisionType`** (string, Required) — The type of revision, can be either 'branch', 'ref' or 'commit'.
- **`revisionName`** (string, Required) — The name of revision. If revisionType is 'branch', this is the name of the base branch. If revisionType is 'commit', this is the commit hash.


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---


## List tags

Here's an example of how to list tags in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication).

Listing tags requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

#### `GET` /{owner}/{database}/tags

List Tags

This API endpoint allows you to list all tags in your database.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/tags`

**Parameters**

**`owner`** (path, string, Required)
  The name of the owner of the database.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---


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

#### `GET` /{owner}/{database}/releases

List Releases

This API endpoint allows you to list all releases in your database.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/releases`

**Parameters**

**`owner`** (path, string, Required)
  The name of the owner of the database.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`

**`next_page_token`** (query, string, Optional)
  The next page token.
  Example: `1234567890`


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---


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

#### `GET` /users/{username}/operations

List operations

This API endpoint allows you to list all operations that are created by the user.

**URL**: `https://www.dolthub.com/api/v1alpha1/users/{username}/operations`

**Parameters**

**`username`** (path, string, Required)
  The name of the user who initiated the operations. This user's name must match the user associated with the api token.
  Example: `liuliu`

**`operationType`** (query, string, Optional)
  Specific type of operation for this query. Supported operation types are SqlWrite, SqlRead, Import, Merge, Migrate.
  Example: `SqlWrite`

**`pageToken`** (query, string, Optional)
  Token for the next page of results
  Example: `AWE2Nm9uMWQ26pQQpqLNLXu7a60647lpiZoDFrf5WDGHo68XNC-rfr068rymbEdUHCXidRxx7_fwGBMSzQi6C_D50NcJFXm0BwRnGmmHEL4T4xxkWoX3sL5mKD-PuMRuxeHPsR0NB5Rzi70jGzblVlfBTIHPJ20c630pNLrI_spxH0tYTzMnQ4uPpr3ub9P50FEH9i4Au0gUkmvj8NUibbGWi-R1AJYplEPr=`


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---


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

#### `GET` /{owner}/{database}/jobs

List jobs

This API endpoint allows you to list all jobs in your database.

**URL**: `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/jobs`

**Parameters**

**`owner`** (path, string, Required)
  The name of the owner of the database.
  Example: `dolthub`

**`database`** (path, string, Required)
  The name of the database.
  Example: `museum-collections`


**Responses**

- **200**: Success
- **400**: Bad request. The request was invalid or could not be processed.

---

