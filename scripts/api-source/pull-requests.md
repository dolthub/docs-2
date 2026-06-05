---
title: "Pull Requests"
description: Open, list, get, update, comment on, and merge pull requests on DoltHub over HTTP.
---

_API version: v1alpha1_

DoltHub provides API endpoints for creating, getting, updating, listing, commenting on, and merging pull requests on a database.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## Create pull request

Here is an example of opening a pull request on the `museum-collections` database with data from the Los Angeles County Museum of Art. This data was added to the `lacma` branch on a fork database, whose `owner` is `liuliu`, we would like to eventually merge `lacma` branch into the `main` branch using an [authorization token](authentication.md).

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/createpull.json" path="/{owner}/{database}/pulls" method="post" %}
[createpull.json](../../../.gitbook/assets/dolthub-api/createpull.json)
{% endswagger %}

## Get pull request details

This API allows you to retrieve the details of a specific pull request in the `museum-collections` database. In this example, we will retrieve the details of pull request #1.

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/getpull.json" path="/{owner}/{database}/pulls/{pull_id}" method="get" %}
[getpull.json](../../../.gitbook/assets/dolthub-api/getpull.json)
{% endswagger %}

## Update a pull request

This API allows you to update a pull request by providing the fields you want to update in the request body. You can update the title, description, and state (only closing a pull request is supported).

Here's an example of how to update pull request #1 on the museum-collections database. In this example, we will set a new title, description, and close the pull request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/updatepull.json" path="/{owner}/{database}/pulls/{pull_id}" method="patch" %}
[updatepull.json](../../../.gitbook/assets/dolthub-api/updatepull.json)
{% endswagger %}

## List pull requests

Here is an example of listing pull requests for the `museum-collections` database using an [authorization token](authentication.md). The response of pull request list is paginated, so you need to use the next page token included in the response to retrieve the following pages of pull requests.

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/listpulls.json" path="/{owner}/{database}/pulls" method="get" %}
[listpulls.json](../../../.gitbook/assets/dolthub-api/listpulls.json)
{% endswagger %}

## Create a pull request comment&#x20;

Here is an example of adding a pull request comment using an [authorization token](authentication.md).

Include this `header` in your request.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/pullcomment.json" path="/{owner}/{database}/pulls/{pull_id}/comments" method="post" %}
[pullcomment.json](../../../.gitbook/assets/dolthub-api/pullcomment.json)
{% endswagger %}

## Merge pull request

Here is an example of merging a pull request `#66` on a database `museum-collections` using an [authorization token](authentication.md). Note that the merge operation is asynchronous and creates an operation that can be polled to get the result.

To poll the operation and check its status, you can use the `operationName` in the returned response of the merge request to query the API. Once the operation is complete, the response will contain a `job_id` field indicating the job that's running the merge, as well as other information such as the `database_owner`, `database_name`, and `pull_id`.

Keep in mind that the time it takes for the merge operation to complete can vary depending on the size of the pull request and the complexity of the changes being merged.&#x20;

Include this `header` in your request with the API token you created.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/mergePull.json" path="/{owner}/{database}/pulls/{pull_id}/merge" method="post" %}
[mergePull.json](../../../.gitbook/assets/dolthub-api/mergePull.json)
{% endswagger %}

Then use `GET` to poll the operation to check if the merge operation is done.

{% swagger src="../../../.gitbook/assets/dolthub-api/pollMergeJob.json" path="/{owner}/{database}/pulls/{pull_id}/merge" method="get" %}
[pollMergeJob.json](../../../.gitbook/assets/dolthub-api/pollMergeJob.json)
{% endswagger %}
