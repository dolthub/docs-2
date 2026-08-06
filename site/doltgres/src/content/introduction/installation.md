---
title: "Installation"
description: How to install Doltgres on Linux, macOS, and Windows, plus Docker and build-from-source instructions.
---

To install Doltgres on Linux or Mac based systems run this command in your terminal:

```
sudo bash -c 'curl -L https://github.com/dolthub/doltgresql/releases/latest/download/install.sh | bash'
```

This will download the latest doltgres release and put it in `/usr/local/bin/`, which is probably on
your `$PATH`.

## Windows

Download the latest Microsoft Installer (`.msi` file) in
[releases](https://github.com/dolthub/doltgresql/releases) and run it.

## Docker

Doltgres publishes an official Docker image on every release:

- [dolthub/doltgresql](https://hub.docker.com/r/dolthub/doltgresql)

Run it on your local Docker like this:

```bash
$ docker run -e DOLTGRES_PASSWORD=myPassword -p 5432:5432 dolthub/doltgresql:latest
```

## Building From Source

To produce a binary from source code, run `./scripts/build.sh`.
