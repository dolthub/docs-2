---
title: "Install the DoltHub CLI"
description: "Install dh on Linux, macOS, or Windows, verify your download, and set up shell completion."
---

Download `dh` from [GitHub Releases](https://github.com/dolthub/cli/releases). Choose the archive for your operating system and processor:

| System | Processor | Archive |
| --- | --- | --- |
| Linux | Intel/AMD 64-bit | `dh-linux-amd64.tar.gz` |
| Linux | ARM64 | `dh-linux-arm64.tar.gz` |
| macOS | Intel | `dh-darwin-amd64.tar.gz` |
| macOS | Apple silicon | `dh-darwin-arm64.tar.gz` |
| Windows | Intel/AMD 64-bit | `dh-windows-amd64.zip` |

Download `checksums.txt` from the **same release**. Compare the archive's SHA-256 hash with the matching filename in that file before extracting it.

## Linux and macOS

For Linux amd64, run these commands from the download directory:

```bash
sha256sum dh-linux-amd64.tar.gz
tar -xzf dh-linux-amd64.tar.gz
mkdir -p "$HOME/.local/bin"
install -m 755 dh "$HOME/.local/bin/dh"
```

On macOS, substitute your archive name and use `shasum -a 256` to calculate the hash. Add the directory containing `dh` to your shell's `PATH` if it is not already there. For example, add this line to your shell configuration and open a new terminal:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Verify the installation:

```bash
dh version
```

## Windows

From PowerShell in the download directory:

```powershell
Get-FileHash .\dh-windows-amd64.zip -Algorithm SHA256
Expand-Archive .\dh-windows-amd64.zip -DestinationPath .\dh-cli
.\dh-cli\dh.exe version
```

Move `dh.exe` into a directory on your user `Path`, or add its directory through **Environment Variables → User variables → Path**. Open a new terminal and run `dh version`.

## Upgrade

Download and verify the new release, replace the installed executable, and run `dh version`. If it still reports the previous version, use `command -v dh` on Linux/macOS or `Get-Command dh` in PowerShell to find the executable your shell is running.

## Shell completion

The CLI emits completion scripts for Bash, Zsh, Fish, and PowerShell. To enable completion for the current Bash session:

```bash
source <(dh completion bash)
```

For Zsh:

```bash
autoload -Uz compinit
compinit
source <(dh completion zsh)
```

For Fish, save the script in its completion directory:

```fish
mkdir -p ~/.config/fish/completions
dh completion fish > ~/.config/fish/completions/dh.fish
```

For the current PowerShell session:

```powershell
dh completion powershell | Out-String | Invoke-Expression
```

For persistent setup, add the appropriate initialization to your shell profile or save the script in your shell's completion directory. See [dh completion](/products/dolthub/cli/commands/completion#dh-completion).

## Build from source

Source builds require Git, Go 1.26 or newer, and Make for the `make build` shortcut:

```bash
git clone https://github.com/dolthub/cli.git
cd cli
make build
./bin/dh version
```

Without Make, use `go build -o dh ./cmd/dh` (or `go build -o dh.exe ./cmd/dh` on Windows). Move the resulting executable to your `PATH` as above.

For containers, see [Run dh in Docker](/products/dolthub/cli/guides/docker). Next, [create your first database](/products/dolthub/cli/getting-started).
