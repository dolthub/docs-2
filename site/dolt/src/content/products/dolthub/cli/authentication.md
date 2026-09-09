---
title: "Authenticate dh"
description: "Use browser login for interactive work or a DoltHub token for scripts and containers."
---

## Browser login

```bash
dh auth login
dh auth status
```

Approve the login in your browser and return to the terminal. `dh` stores your credentials and refreshes OAuth access tokens automatically. It prefers the operating system's keyring; when that is unavailable, it saves a credential file and reports that fallback.

The default host is `www.dolthub.com`. If your environment or configuration selects another host, explicitly choose production:

```bash
dh auth login --hostname www.dolthub.com
```

Use [Configuration](/products/dolthub/cli/configuration) to check or change the host used by subsequent commands.

## Tokens for scripts and containers

Create a personal access token in [DoltHub token settings](https://www.dolthub.com/settings/tokens) and copy it when shown. Set it as `DH_TOKEN` in your shell or your CI system's secret environment. In Bash, you can enter it without putting its value in shell history:

```bash
read -r -s -p 'DoltHub token: ' DH_TOKEN
printf '\n'
export DH_TOKEN
dh auth status
```

`DH_TOKEN` takes precedence over saved login credentials. Keep the value out of checked-in scripts and logs. See [DoltHub API authentication](/products/dolthub/api/v2/authentication) for token management and [Automate with dh](/products/dolthub/cli/guides/automation) for scripting examples.

Unset the variable before browser login or logout:

```bash
unset DH_TOKEN
```

In PowerShell, remove it from the current process with `Remove-Item Env:DH_TOKEN`.

## Access and permissions

Public database reads can run anonymously. Private reads and writes require an identity with access to the database. A token or browser login does not grant permissions beyond those of the authenticated identity. See [DoltHub permissions](/concepts/dolthub/permissions).

`dh auth status` checks your authentication. A `401` usually means the credential is missing or invalid; a `403` means the identity lacks permission for the requested action.

## Log out or change accounts

```bash
dh auth logout
dh auth login
```

Logout removes the selected host's saved active identity and local credential. Use `--yes` to skip interactive confirmation. When `DH_TOKEN` is set, remove that environment variable instead; logout cannot clear it for your shell.

## Credential locations

Configuration and fallback credentials live in the platform's user config directory:

| System | Directory |
| --- | --- |
| Linux | `$XDG_CONFIG_HOME/dh`, or `~/.config/dh` when unset |
| macOS | `~/Library/Application Support/dh` |
| Windows | `%AppData%\dh` |

`config.json` contains non-secret settings and the active identity. If keyring storage is unavailable, `credentials.json` holds fallback credentials. Prefer the CLI login/logout commands to editing these files.

## Custom hosts and OAuth clients

Production login includes the public DoltHub CLI OAuth client ID and uses PKCE without a client secret. Custom or development hosts require an OAuth client registered for that host, supplied through `DH_OAUTH_CLIENT_ID`.

Credentials issued for a different OAuth client require that client's override or a fresh login with the intended client. Keep this setting unset for ordinary production use unless you deliberately use a different registered client.

For exact flags, see [dh auth](/products/dolthub/cli/commands/auth).
