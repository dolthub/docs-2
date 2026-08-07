---
title: Data and Model Quality Control
description: Gating data and ML training-set changes behind review and tests in Doltgres so bad data never reaches production or a model.
---

## Problem

* Are you in the business of creating data and models? 
* Do you want to institute human or automated review on data changes for data quality assurance?
* Are you worried about model reproducibility? 
* Do different people or teams want to work on slightly different versions of the data? 
* Are long running projects hard to pull off because of parallel data changes? 
* Would data branches help?
* Do you want the ability to query or roll back to a previous version of the data instantly?

## Doltgres solves this by…

Traditional databases were built for a world of transactions and reports. Modern data science tools use data to create models that behave more like software than reports. Models produce user visible outputs and define application behavior. Tuning data to get the right model can be a lot like writing code.

The version control tools we use to build software apply to modern data science. Version control for data did not exist until Dolt, the first database you can branch, diff, and merge just like a Git repository. Doltgres brings those same capabilities to Postgres: the first Postgres-flavored database you can [branch](/concepts/git/branch), [diff](/concepts/git/diff), and [merge](/concepts/git/merge).

Modern data science applications require model reproducibility, data quality, and multiple versions of data to perform at their best. Doltgres allows for these capabilities directly in your database, in a [Git-style version control model](/concepts/git/) most developers understand.

Doltgres can be used for model reproducibility. If you build a model from a version of the data, make a tag at that commit and refer to that tag in the model metadata. Some of our data and model quality control customers only use Dolt for this simple feature. Doltgres shares storage between versions so you can store many more copies of the data using Doltgres than say storing copies of the data in S3. 

Doltgres allows for human or automated review on data changes increasing data quality. If a bad change makes it through review simply [roll the data back to a previous version](https://www.dolthub.com/blog/2022-09-23-dolt-rollback-options/). Because branches and diffs are exposed through SQL, you can extend [the Pull Request model](https://docs.dolthub.com/concepts/dolthub/prs), the standard for human reviewing code changes, to your data: make changes on a branch, review the diff, and merge when approved.

Doltgres is the only Postgres-flavored database with [branch](/concepts/git/branch) and [merge](/concepts/git/merge) functionality. Branches allow for long running data projects. Want to add an additional feature to a model but don't want the new feature effecting the production model build? Make branch and run the project on that branch. Occasionally merge production data into that branch so you can stay in touch with changes there. Companies use Dolt branches to increase the number of parallel data projects by an order of magnitude.

Lastly, [commits](/concepts/git/commits), [logs](/concepts/git/log), and [diffs](/concepts/git/diff) can be used for model insights. Did Thursday's model perform better than Tuesday's but had the same model weights? Inspect the data diff to see what changed. Inspect the commit log to see where that new data came from.

## Doltgres replaces...

## Unstructured files in cloud storage

It is common practice to store copies of training data or database backups in cloud storage for model reproducibility. A full copy of the data is stored for every training run. This can become quite expensive and limit the amount of models you can reproduce. Doltgres stores only the differences between stored versions decreasing the cost of data storage. Additionally, Doltgres can produce diffs between versions of training data producing novel model insights.

## Postgres, MySQL, or other databases

Doltgres can replace any database used to store and query data. Many customers switch from other OLTP databases like Postgres or MySQL to improve data and model quality through versioning. Customers have also switched from document databases like MongoDB. Doltgres's additional unique features like branches, diffs, and merges allow for human review of data changes and multiple parallel data projects.

## Companies Doing This

* [Turbine](https://turbine.ai/)
* [KAPSARC](https://www.kapsarc.org/) 
* [Flock Safety](https://www.flocksafety.com/) 
* [Tome](https://www.tome.com/) 
* [Bosch](https://www.bosch-home.com/) 
* [IMTF](https://imtf.com/)

## Case Studies

[Turbine](https://www.dolthub.com/blog/2022-08-17-dolt-turbine/)

## Other Related Articles

* [Better Data with Great Expectations + Dolt](https://www.dolthub.com/blog/2021-06-15-great-expectations-plus-dolt/)
* [Upleveling Flyte’s Data Lineage Using Dolt](https://www.dolthub.com/blog/2021-06-04-flyte-dolt-plugin/)
* [Data Version Control and Dolt Reproducibility](https://www.dolthub.com/blog/2021-04-16-dolt-dvc/)
* [Using Dolt to Manage Train/Test Splits](https://www.dolthub.com/blog/2020-05-11-dolt-manage-train-test-splits/)
* [So you want Data Quality Control](https://www.dolthub.com/blog/2022-11-23-data-quality-control/)
