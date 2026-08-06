---
title: Manual Data Curation
description: Hand-editing a dataset safely in Doltgres — branch, make changes, diff to see exactly what moved, merge when it's right.
---

## Problem

- Are you using spreadsheets to curate production data?
- Is the process of merging and reviewing everyone’s changes getting out of hand?
- Are bad data changes causing production issues?
- Would human review of cell-level data changes help?

## Doltgres solves this by…

Doltgres allows you to treat your spreadsheet like code. Extend [the Pull Request workflow](https://docs.dolthub.com/concepts/dolthub/prs), the standard for reviewing code changes, to your data changes. Make changes on [branches](/concepts/git/branch) and then have the changes human reviewed. Data diffs are easily consumed by a human reviewer. Add continuous integration tests to data changes. Have dozens or hundreds of changes in flight at one time.

Doltgres supports [SQL](/concepts/sql/) for data modification, and works with the standard Postgres tools your team already uses, including graphical [SQL editors](/reference/supported-clients/sql-editors) simple enough for less technical users to make and review data changes. Web-based editing on DoltHub is not yet available for Doltgres databases.

Doltgres is a Postgres compatible database so exporting the manually created data to production can be as simple as cloning a copy and starting a server for your developers to connect to.

## Doltgres replaces...

## Spreadsheets

Doltgres replaces Excel or Google Sheets for manual data curation. Versioning features allow for more efficient asynchronous collaboration and human review of data changes. Familiar Postgres editing tools keep contributing and reviewing data changes easy enough for non-technical users.

## Companies Doing This

- [Annalise](https://annalise.ai/)
- [Briya](https://briya.com/)
- [Aktify](https://aktify.com/)
- [Blonk Sustainability](https://blonksustainability.nl/)
- [IMTF](https://imtf.com/)
- [Lumicks](https://lumicks.com/)
- [Merkle Science](https://www.merklescience.com/)
- [Idearoom](https://www.idearoom.com/)

## Case Studies

- [Aktify](https://www.dolthub.com/blog/2021-10-01-dolt-aktify/)

## Other Related Articles

- [So you want Spreadsheet Version Control?](https://www.dolthub.com/blog/2022-07-15-so-you-want-spreadsheet-version-control/)
- [Edit like a Spreadsheet V1](https://www.dolthub.com/blog/2021-10-04-edit-like-spreadsheet-v1/)
