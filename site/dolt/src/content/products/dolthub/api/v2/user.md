---
title: "User"
description: The authenticated user resource in the DoltHub v2 API.
---

# User

The authenticated user.

## Get the authenticated user {#getCurrentUser}
`GET /api/v2/user`

Returns the profile of the user identified by the request's credentials.


**Example request**

```sh
curl -X GET 'https://www.dolthub.com/api/v2/user' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Responses**

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The authenticated user's profile. | [`User`](models#model-user) |
| `401` | Authentication credentials were missing or invalid. | [`Problem`](models#model-problem) |
| `405` | The HTTP method is not supported for this resource. | [`Problem`](models#model-problem) |
| `500` | An unexpected server error occurred. | [`Problem`](models#model-problem) |

**Example response `200`**

```json
{
  "data": {
    "username": "dolthub",
    "display_name": "DoltHub",
    "bio": "The database for agents.",
    "location": "San Mateo, CA",
    "website_url": "https://www.dolthub.com",
    "profile_pic_url": "https://www.dolthub.com/static/images/dolthub_logo.png",
    "email_addresses": [
      {
        "address": "dolt-interest@dolthub.com",
        "is_primary": true,
        "is_verified": true
      }
    ]
  }
}
```

