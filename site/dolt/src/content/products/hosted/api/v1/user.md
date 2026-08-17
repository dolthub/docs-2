---
title: "User"
description: The authenticated user resource in the Hosted v1 API.
---

# User

The authenticated user.

## Get the authenticated user {#getCurrentUser}
<span class="api-method" style="background:#29E3C1">GET</span> <code class="api-path">/api/v1/user</code>

Returns the profile of the user identified by the request's credentials. Useful as a credential check: a `200` confirms the token is valid and shows whose access it carries.


**Example request**

```sh
curl -X GET 'https://hosted.doltdb.com/api/v1/user' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The authenticated user's profile. | [`User`](/products/hosted/api/v1/models#model-user) |
| `401` | Authentication credentials were missing or invalid. |  |
| `405` | The HTTP method is not supported for this resource. |  |
| `500` | An unexpected server error occurred. |  |

**Example response `200`**

```json
{
  "data": {
    "username": "acme-ops",
    "display_name": "Acme Operations",
    "company": "Acme Corp",
    "email_addresses": [
      {
        "address": "ops@acme.com",
        "is_verified": true,
        "is_primary": true
      }
    ]
  }
}
```

