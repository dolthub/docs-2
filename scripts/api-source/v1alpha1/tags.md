---
title: "Tags"
description: Create and list tags on a DoltHub database over HTTP.
---

_API version: v1alpha1_

DoltHub provides API endpoints for creating and listing tags on a database.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## Create a tag

Here's an example of how to create a new tag in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication.md).

Creating a tag requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../../.gitbook/assets/dolthub-api/createTag.json" path="/{owner}/{database}/tags" method="post" %}
[createTag.json](../../../../.gitbook/assets/dolthub-api/createTag.json)
{% endswagger %}

## List tags

Here's an example of how to list tags in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication.md).

Listing tags requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../../.gitbook/assets/dolthub-api/listtags.json" path="/{owner}/{database}/tags" method="get" %}
[listtags.json](../../../../.gitbook/assets/dolthub-api/listtags.json)
{% endswagger %}
