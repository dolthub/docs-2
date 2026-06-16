---
title: "User"
description: User and organization endpoints.
---

# User

DoltHub provides a user API for retrieving information about the authenticated user.

> **Note:** Please make sure to send your requests to `https://www.dolthub.com` instead of `https://dolthub.com`.

## Get current user

Here's an example of how to fetch information about the authenticated user using an [authorization token](authentication).

This endpoint requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication) section for more details.

```python
headers = {
    'authorization': 'token [api token you created]'
}
```

<div class="api-endpoint">
<div class="api-endpoint-header">
<span class="api-method" style="background:#29E3C1">GET</span>
<code class="api-path">/user</code>
</div>
<p class="api-summary">Get current user</p>
<p class="api-description">Returns information about the authenticated user, including their username, display name, profile picture, and email addresses.</p>
<div class="api-url"><strong>URL</strong> <code>https://www.dolthub.com/api/v1alpha1/user</code></div>
<div class="api-section">
<h5>Responses</h5>
<div class="api-response"><span class="api-status-success">200</span> Success</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Success",
  "username": "jdoe",
  "display_name": "Jane Doe",
  "bio": "",
  "location": "San Francisco, CA",
  "url": "https://example.com",
  "profile_picture_url": "https://dolthubapi.../profilePictures/users/jdoe/profilePic",
  "email_addresses": [
    {
      "address": "jdoe@dolthub.com",
      "is_primary": true,
      "is_verified": true
    }
  ]
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td>Status of the request.</td></tr>
<tr><td><code>username</code></td><td>string</td><td>The user's unique handle.</td></tr>
<tr><td><code>display_name</code></td><td>string</td><td>The user's display name, or empty string if not set.</td></tr>
<tr><td><code>bio</code></td><td>string</td><td>The user's bio, or empty string if not set.</td></tr>
<tr><td><code>location</code></td><td>string</td><td>The user's location, or empty string if not set.</td></tr>
<tr><td><code>url</code></td><td>string</td><td>The user's website URL, or empty string if not set.</td></tr>
<tr><td><code>profile_picture_url</code></td><td>string</td><td>URL of the user's profile picture.</td></tr>
<tr><td><code>email_addresses</code></td><td>array&lt;object&gt;</td><td>Email addresses associated with the user. At least one will be primary.</td></tr>
</tbody></table>
</div>
<div class="api-response"><span class="api-status-error">401</span> Not authenticated. The request did not include a valid API token.</div>
<div class="api-response-body">
<p>Body — <code>application/json</code></p>
<pre class="api-response-example"><code>{
  "status": "Error",
  "message": "Not authenticated"
}</code></pre>
<table class="api-params">
<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>status</code></td><td>string</td><td></td></tr>
<tr><td><code>message</code></td><td>string</td><td></td></tr>
</tbody></table>
</div>
</div>
</div>

