---
title: "Run dh in Docker"
description: "Run the DoltHub CLI container with tokens, piped SQL, and mounted input files."
---

The `dolthub/cli` image runs `dh` on Linux amd64 and arm64:

```bash
docker run --rm dolthub/cli:latest version
```

The examples use `latest`. For reproducible jobs, choose an available version tag from the release you intend to use. The image entrypoint is `dh`, so arguments after the image name are CLI commands.

## Authentication and database selection

Set `DH_TOKEN` in your shell or CI environment, then forward it by name:

```bash
docker run --rm -e DH_TOKEN dolthub/cli:latest auth status
docker run --rm -e DH_TOKEN dolthub/cli:latest db view OWNER/people
```

Public reads can run anonymously. Use the native CLI for browser login: the container has no browser or system keyring, and its loopback callback is inside the container.

Pass `--db OWNER/DATABASE` explicitly, or forward `DH_DB`. The image does not include `dolt` for discovering a local repository's remotes. Forward `DH_HOST` with `-e DH_HOST` when using a custom host.

## Pipe SQL

Use `-i` to keep stdin open:

```bash
printf 'SELECT COUNT(*) FROM people;\n' | \
  docker run --rm -i -e DH_TOKEN dolthub/cli:latest \
  sql --db OWNER/people --ref main
```

## Mount input files

From a directory containing `query.sql`, mount that directory read-only:

```bash
docker run --rm -e DH_TOKEN \
  --mount "type=bind,src=$PWD,dst=/work,readonly" \
  dolthub/cli:latest sql --db OWNER/people --ref main --file /work/query.sql
```

The same approach works for [table imports](/products/dolthub/cli/guides/table-imports):

```bash
docker run --rm -e DH_TOKEN \
  --mount "type=bind,src=$PWD,dst=/work,readonly" \
  dolthub/cli:latest table import people /work/changes.json \
  --db OWNER/people --branch main --update
```

The image runs as UID/GID 1001 with home directory `/home/dh`. Mounted files must be readable by that user. Local shell paths and container paths differ; `--file` and import arguments must name the mounted path inside the container.

For structured output and operation watching, see [Automate with dh](/products/dolthub/cli/guides/automation).
