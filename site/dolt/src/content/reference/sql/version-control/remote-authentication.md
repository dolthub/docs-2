---
title: Authenticating to Remotes
description: Setting up credentials to push and pull against DoltHub and other remotes.
---

The remote-touching stored procedures
([`DOLT_CLONE()`](/sql-reference/version-control/dolt-sql-procedures#dolt_clone),
[`DOLT_FETCH()`](/sql-reference/version-control/dolt-sql-procedures#dolt_fetch),
[`DOLT_PULL()`](/sql-reference/version-control/dolt-sql-procedures#dolt_pull),
[`DOLT_PUSH()`](/sql-reference/version-control/dolt-sql-procedures#dolt_push))
accept a `--user <name>` argument to authenticate against private remotes —
DoltHub or DoltLab organizations you have access to, Hosted Dolt deployments,
or another Dolt `sql-server`'s `remotesapi` endpoint. The matching password is
**not** a procedure argument; instead it's read from the `DOLT_REMOTE_PASSWORD`
environment variable of the `sql-server` process at the moment the procedure
runs.

```sql
-- Same shape on the wire as `DOLT_REMOTE_PASSWORD=… dolt clone --user … <url>`.
CALL DOLT_CLONE('--user', 'alice', 'https://doltremoteapi.dolthub.com/acme/secret-db');
CALL DOLT_PUSH('--user', 'alice', 'origin', 'main');
```

## Setting `DOLT_REMOTE_PASSWORD` on the server

Because the variable is read from the server process's environment, you have
to make it available **to the server before any authenticated procedure call
runs** — typically by setting it on the command line that launches
`dolt sql-server`, in the systemd unit / container env, or in your shell
before `dolt sql-server` forks. The SQL session that calls the procedure
cannot set it.

```bash
DOLT_REMOTE_PASSWORD='s3cret' dolt sql-server --config config.yaml
```

For the duration of that server process, every `--user` call uses the same
password value. If you need different credentials for different remotes,
you'll need separate server processes (each with its own env) or to rotate
the variable's value out-of-band — there's no per-call password argument on
the procedures.

## What the credentials are

The username/password pair you supply depends on what kind of remote you're
talking to:

- **DoltHub** — your DoltHub username and an account password (or an API
  token configured to act as the password). See
  [API authentication](/products/dolthub/api/authentication) for generating
  tokens.
- **DoltLab** — your DoltLab username and account password.
- **Hosted Dolt** — the deployment's admin user / password, or any SQL user
  on the deployment that has the `CLONE_ADMIN` privilege. See
  [Cloning a Hosted database](/products/hosted/cloning) for the full
  walkthrough.
- **Another Dolt `sql-server`'s remotesapi** — a SQL user configured on that
  server, with `CLONE_ADMIN` (for read) or appropriate write grants (for
  push). See
  [Dolt sql-server as a remote](/sql-reference/version-control/remotes#dolt-sql-server)
  for the end-to-end setup, including granting `CLONE_ADMIN`.

## Example: cloning a private DoltHub database from a SQL session

```bash
# Launch the server with the remote password in its environment.
DOLT_REMOTE_PASSWORD='my-dolthub-token' dolt sql-server --port 3306 &
```

```sql
-- Connect to the server, then:
CALL DOLT_CLONE('--user', 'alice', 'acme/private-data');
USE `private-data`;
SHOW TABLES;
```

If `DOLT_REMOTE_PASSWORD` is unset, `--user` calls fail with:

```
error: must set DOLT_REMOTE_PASSWORD environment variable to use --user param
```
