---
title: "User"
description: User and organization endpoints.
---

DoltHub provides a user API for retrieving information about the authenticated user.

> **Note:** Please make sure to send your requests to `https://www.dolthub.com` instead of `https://dolthub.com`.

## Get current user

Here's an example of how to fetch information about the authenticated user using an [authorization token](authentication.md).

This endpoint requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/dolthub-api/getCurrentUser.json" path="/user" method="get" %}
[getCurrentUser.json](../../../.gitbook/assets/dolthub-api/getCurrentUser.json)
{% endswagger %}
