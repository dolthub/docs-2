---
title: "Jobs"
description: Inspect the status of asynchronous DoltHub operations — merges, SQL writes, and file imports — and list them by user or by database.
---

_API version: v1alpha1_

DoltHub runs certain operations (merges, SQL writes, file imports) asynchronously as jobs. These endpoints let you list and inspect them.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## List operations

DoltHub provides support for asynchronous operations, including merging, SQL writes, and file importing. When you execute one of these operations from the API, you will get an operation name that you can poll using another endpoint to check the operation status and other information.

This API endpoint lets you monitor the status of all the operations you started in one place without needing to poll the endpoints for singular operations. These operations have `error` and `metadata` fields which contain useful information for troubleshooting and debugging.

For example, if you have executed a few SQL write queries using that [API endpoint](sql.md#writing), you can list those operations using the `operationType` query parameter to filter for `SqlWrite` operations. The `metadata` will show the query executed, database and branch that the query ran on, as well as any syntax or other errors you may have encountered.

Here's an example of how to list `SqlWrite` operations initiated by user `liuliu` using an [authorization token](authentication.md).

Listing operations requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/listoperations.json" path="/users/{username}/operations" method="get" %}
[listoperations.json](../../../.gitbook/assets/dolthub-api/listoperations.json)
{% endswagger %}

## List jobs

DoltHub performs certain asynchronous operations through job execution, including merging, importing, SQL reading, and migrating. When these operations are initiated via the API, you receive an operation name that includes the job ID.

This API endpoint lets you monitor the status of jobs started in a specific database.

Here is an example of how to list all the jobs on a database `museum-collections` using an [authorization token](authentication.md).

Listing jobs requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/listjobs.json" path="/{owner}/{database}/jobs" method="get" %}
[listjobs.json](../../../.gitbook/assets/dolthub-api/listjobs.json)
{% endswagger %}
