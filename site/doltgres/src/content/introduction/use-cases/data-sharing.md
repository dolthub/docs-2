---
title: Data Sharing
description: Publishing and collaboratively editing a dataset the way teams collaborate on code — clone, branch, edit, and merge.
---

## Problem

- Do you share data with customers?
- Do they ask you what changed between versions you share?
- Do they want to actively switch versions instead of having data change out from under them?
- Or, are customers or vendors sharing data with you?
- Are you having trouble maintaining quality of scraped data?
- When new data is shared or scraped, do downstream systems break?
- Would you like to see exactly what changed between data versions?
- Do you want to add automated testing to data shared with you?
- Would you like to instantly rollback to the previous version if tests fail?

## Doltgres solves this by…

Doltgres was built for sharing. The Git model of code sharing has scaled to thousands of contributors for open source software. We believe the same model can work for data.

Doltgres is the version controlled Postgres-flavored SQL database. Git-style version control allows for decentralized, asynchronous collaboration. Every person gets their own copy of the database to read and write. Doltgres coordinates collaboration through [remotes](/concepts/git/remotes): configure a remote on a file system, S3-compatible cloud storage, or a self-hosted remote server, then [clone, fetch, push, and pull](/reference/version-control/remotes) between Doltgres servers. Note that [DoltHub](https://www.dolthub.com/), the hosting service for Dolt databases, does not yet support hosting Doltgres databases, so sharing happens over custom remotes you control.

Doltgres is a great way to share data with customers. Stand up a remote your customers can clone and pull from. Use versions to satisfy both slow and fast upgrading consumers. Let your customers help make your data better. Versions offer better debugging information. Version X works but version Y doesn't. Your customers can even make changes on a branch, push it to a shared remote, and submit data patches for your review, much like open source.

Doltgres is also great if vendors share data with you. When you receive data from a vendor, import the data into Doltgres. Examine the diff, either with the human eye or programmatically, before putting the data into production. You can now build integration tests for vendor data. If there's a problem, never [merge](/concepts/git/merge) the import [branch](/concepts/git/branch) into main or roll the change back if a bug was discovered in production. Use the problematic [diff](/concepts/git/diff) to debug with your vendor. The same tools you have for software dependencies, you now have for data dependencies.

## Doltgres replaces...

## Exchanging Files

Doltgres replaces exchanging flat data files like CSVs via email, FTP servers, or other file transfer techniques. Doltgres allows data to maintain schema on exchange including constraints, triggers, and views. This more rich format of exchange reduces transfer errors. Doltgres also allows you to change the data to fit your needs and still get updates from your source. Doltgres will notify you if your changes [conflict](/concepts/git/conflicts) with the source.

## External APIs

Doltgres is ideal for sharing data that does not have an API. But even for data with an API, Doltgres is often more convenient. With Doltgres, you get all the data and its history. With APIs you often have to assemble the data with multiple API calls. With APIs, the data can change out from under you, whereas with Doltgres you can read a version of the data until you are ready to upgrade. And because Doltgres speaks Postgres, consumers can query the shared data with any standard Postgres client.

## Companies Doing This

- [Bitfinex](https://www.bitfinex.com/)
- [KAPSARC](https://www.kapsarc.org/)

## Case Studies

Let us know if you would like us to feature your use of Doltgres for data sharing here.

## Other Related Articles

- [Distribute Data with Dolt, not APIs](https://www.dolthub.com/blog/2020-05-18-distribute-dolt-not-api/)
