---
title: "Import Tables with dh"
description: "Upload a local CSV, PSV, XLSX, or JSON file into a DoltHub table."
---

`dh table import` uploads a local file and imports it into a table on a specified branch. Log in first and choose a database you can write to. Replace `OWNER` with your username.

## Create a table from CSV

Save this as `people.csv`:

```text
id,name,city
1,Ada,London
2,Grace,New York
```

Create a new database if needed:

```bash
dh db create OWNER/import-demo --private
```

Import the file into its `main` branch:

```bash
dh table import people people.csv --db OWNER/import-demo --branch main \
  --primary-key id --message "Import people"
```

The default mode creates a table, so use it when `people` does not already exist. The command waits for upload and import completion. Verify the rows:

```bash
dh sql --db OWNER/import-demo --ref main "SELECT * FROM people ORDER BY id"
```

Primary keys can be repeated or comma-separated, for example `--primary-key account_id,person_id`.

## Import into an existing table

Choose one mode:

| Mode | Effect |
| --- | --- |
| No mode flag | Create a new table; the table must not already exist. |
| `--overwrite` | Replace the existing table with the imported data. |
| `--update` | Upsert rows into the existing table. |
| `--replace` | Remove existing rows and insert the imported rows. |

The three mode flags are mutually exclusive. Select the mode based on whether you want to preserve rows that are absent from the input.

For a JSON update, save `changes.json`:

```json
{"rows": [{"id": 1, "name": "Ada", "city": "Paris"}]}
```

Then run:

```bash
dh table import people changes.json --db OWNER/import-demo --branch main --update
```

JSON input requires `--update` or `--replace`, with a table that already has a schema. Use the Dolt JSON table-import format, with a top-level `rows` array. For more on formats, see [Dolt import formats](/guides/import).

## Formats and limits

CSV, PSV, XLSX, and JSON are supported. The filename extension selects the format, or you can specify `--file-type csv`, `psv`, `xlsx`, or `json`.

Files must be regular, nonempty local files of at most 1 GiB. Stdin is not supported. Keep the file unchanged until the upload finishes. `--branch` is always required; there is no implicit default-branch lookup.

## Completion and recovery

For structured completion output:

```bash
dh table import people changes.json --db OWNER/import-demo --branch main --update \
  --json id,status,result
```

`--no-wait --json id,href` returns a job reference after the file upload and submission. It does **not** skip waiting for the upload. Use [job watching](/products/dolthub/cli/guides/automation#asynchronous-jobs) to wait for the import later.

Storage URLs expire after ten minutes. Failed or expired uploads must restart; the CLI does not resume them or refresh the URLs. Ctrl+C stops local transfers or waiting, but does not abort the storage session or cancel a submitted import.

If submission returns an ambiguous error, check existing jobs before retrying:

```bash
dh job list --db OWNER/import-demo
```

The server may already have accepted the import. See [dh table import](/products/dolthub/cli/commands/table#dh-table-import) for all flags.
