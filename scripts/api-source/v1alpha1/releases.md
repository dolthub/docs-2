---
title: "Releases"
description: Create and list releases on a DoltHub database over HTTP.
---

_API version: v1alpha1_

DoltHub provides API endpoints for creating and listing releases on a database.

> **Note:** please send requests to `https://www.dolthub.com`, not `https://dolthub.com`.

## Create a release

Here's an example of how to create a new release in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication.md).

Creating a release requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../../.gitbook/assets/dolthub-api/createRelease.json" path="/{owner}/{database}/releases" method="post" %}
[createRelease.json](../../../../.gitbook/assets/dolthub-api/createRelease.json)
{% endswagger %}

## List releases

Here's an example of how to list releases in the database `museum-collections` under the organization `dolthub` using an [authorization token](authentication.md).

Listing releases requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../../.gitbook/assets/dolthub-api/listreleases.json" path="/{owner}/{database}/releases" method="get" %}
[listreleases.json](../../../../.gitbook/assets/dolthub-api/listreleases.json)
{% endswagger %}
