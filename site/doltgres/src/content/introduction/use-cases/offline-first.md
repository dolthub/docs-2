---
title: Offline First
description: Cloning a full database locally, working disconnected, then syncing changes back like git push/pull.
---

## Problem

* Are you expecting your application to make writes locally while offline?
* Do these writes need to be synced to a central server or other nodes?
* How are you going to detect conflicting writes?
* What are you going to do if you detect them?
* Would the Git model of clone, push, and pull on your data help?

## Doltgres solves this by…

Doltgres brings Git-style decentralization to the SQL database. Just like Git is ideal in no connectivity environments when dealing with files, Doltgres is ideal in low connectivity environments when dealing with tables. Most large scale data is stored in tables.

With Doltgres you write to the database disconnected. You can have a fully functioning offline application that uses the exact same software and models it would use if it were a standard centralized SQL database.

When it is safe to connect to the internet, Doltgres computes the difference between what you have and what a peer database has and only sends these differences both ways. This synchronization process is very efficient, effectively allowing you to get the most information possible in and out in the shortest amount of time. Once the synchronization is complete, go back to disconnected. You and the peer now share a synchronized view with complete, auditable edit history.

Conflicting writes are surfaced quickly and an operator or software can take additional action to resolve.

## Doltgres replaces

## Custom syncing processes

Doltgres replaces custom code to synchronize your client and server. This code is complicated and hard to get right. The Git [remote](/concepts/git/remotes) model of clone, fetch, push, and pull is a proven synchronization model. Doltgres brings this model to the database allowing you to remove most of your synchronization code. Doltgres remotes can be backed by the file system, cloud storage like S3, or a self-hosted remote server. 

## Companies Doing This

Be the first

## Case Studies

Let us know if you would like us to feature your use of Doltgres for offline first applications here.

## Other Related Articles

* [So you want a Decentralized database?](https://www.dolthub.com/blog/2022-05-27-decentralized-database/)
* [Dolt for Military Applications](https://www.dolthub.com/blog/2022-03-07-dolt-military/)
