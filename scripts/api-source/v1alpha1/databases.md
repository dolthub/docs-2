---
title: "Databases"
description: Create, fork, and list forks of a DoltHub database over HTTP.
---

_API version: v1alpha1_

DoltHub provides API endpoints for creating, forking, and listing forks of a database.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## Create database

Here's an example of how to create a new database called `museum-collections` under the organization `dolthub` using an [authorization token](authentication.md).

Creating a database requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../../.gitbook/assets/dolthub-api/createDatabase.json" path="/database" method="post" %}
[createDatabase.json](../../../../.gitbook/assets/dolthub-api/createDatabase.json)
{% endswagger %}

## Fork database

Here's an example of how to fork a database called `dolthub/museum-collections` to the username `taylor` using an [authorization token](authentication.md). Note that the fork operation is asynchronous and creates an operation that can be polled to get the result.

To poll the operation and check its status, you can use the `operationName` in the returned response of the fork request to query the API. Once the operation is complete, the response will contain the new database owner and name.

Keep in mind that the time it takes for the fork operation to complete can vary depending on the size of the database.

Forking a database requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../../.gitbook/assets/dolthub-api/createFork.json" path="/fork" method="post" %}
[createFork.json](../../../../.gitbook/assets/dolthub-api/createFork.json)
{% endswagger %}

Then use `GET` to poll the operation to check if the fork operation is done.

{% swagger src="../../../../.gitbook/assets/dolthub-api/createFork.json" path="/fork" method="get" %}
[createFork.json](../../../../.gitbook/assets/dolthub-api/createFork.json)
{% endswagger %}

## List forks

Here's an example of how to list the databases within the fork network of a database called `dolthub/museum-collections` using an [authorization token](authentication.md).

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../../.gitbook/assets/dolthub-api/listforks.json" path="/{owner}/{database}/forks" method="get" %}
[listforks.json](../../../../.gitbook/assets/dolthub-api/listforks.json)
{% endswagger %}
