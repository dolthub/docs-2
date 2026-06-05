---
title: "Branches"
description: Create and list branches on a DoltHub database over HTTP.
---

_API version: v1alpha1_

DoltHub provides API endpoints for creating and listing branches on a database.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## Create a branch

Here's an example of how to create a new branch in database `museum-collections` under the organization `dolthub` using an [authorization token](authentication.md).

Creating a branch requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/createBranch.json" path="/{owner}/{database}/branches" method="post" %}
[createBranch.json](../../../.gitbook/assets/dolthub-api/createBranch.json)
{% endswagger %}

## List branches

Here's an example of how to list branches in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication.md).

Listing branches requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/listbranches.json" path="/{owner}/{database}/branches" method="get" %}
[listbranches.json](../../../.gitbook/assets/dolthub-api/listbranches.json)
{% endswagger %}
