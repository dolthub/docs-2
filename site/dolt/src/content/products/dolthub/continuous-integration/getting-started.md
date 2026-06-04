---
title: Getting Started with DoltHub/DoltLab CI
description: Setting up your first Dolt CI workflow.
---

CI for DoltHub and DoltLab requires [Dolt v1.45.3](https://github.com/dolthub/dolt/releases/tag/v1.45.3). This release contains the `dolt ci` command you will use to configure CI to run.

To start, let's ensure we have the correct Dolt version installed locally.

```bash
% dolt version
dolt version 1.45.3
```

Now, let's clone a database that's hosted on DoltHub that we want to run CI tests on. 

I've created the [fork](/concepts/dolthub/forks), [dolthub/options](https://www.dolthub.com/repositories/dolthub/options), of the popular DoltHub database[post-no-preference/options](https://www.dolthub.com/repositories/post-no-preference/options), and cloned a copy of my fork locally.

```bash
% dolt clone dolthub/options
cloning https://doltremoteapi.dolthub.com/dolthub/options
% cd options
% dolt status
On branch master
Your branch is up to date with 'origin/master'.
nothing to commit, working tree clean
```

The first step required to enable a Dolt database to run CI is to run the [dolt ci init](/cli-reference/cli#dolt-ci-init) command. This command will create Dolt's internal CI tables and also writes a new commit to the branch.

```bash
% dolt ci init
% dolt log -n 1
commit mptat9ijrblrb2q4j2digq9miav3vfv0 (HEAD -> master) 
Author: 😺😺😺😺 <dustin@dolthub.com>
Date:  Wed Nov 13 15:36:27 -0800 2024

        Successfully initialized Dolt CI

%
```

After CI initialization, we need to create the workflow file that will define our CI tests.

## Defining a Workflow

Modeled after GitHub Action's [Workflows](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions), Dolt CI is configured with a yaml file that gets imported into the database.

Let's create an example `workflow.yaml` file now.

```yaml
# workflow.yaml
name: my first DoltHub workflow
on:
  push:
    branches:
      - master
jobs:
  - name: validate tables
    steps:
      - name: assert expected tables exist
        saved_query_name: show tables
        expected_rows: "== 2"
```

The above `workflow.yaml` definition should look pretty familiar to GitHub Action's users. 

It defines a new Dolt workflow named "my first DoltHub workflow" in the top-level `name` field, specifies when this workflow should run in the `on` field, and what should happen when the workflow runs, defined in the `jobs` field. Each of these top-level fields is required.

A Workflow's `name` must be unique and is case-insensitive.

The `on` field defines when the workflow should run, or rather, what [Events]() should trigger the workflow to run. The above workflow is configured to run whenever a `push` to this database's `master` branch occurs.

`jobs` defines the work to be performed when the workflow is run. Each workflow Job must have a unique `name` and at least one step defined in the `steps` field. Currently, these [Steps]() are where Dolt CI differs the most from GitHub Actions.

In GitHub Actions, a workflow step, or action step, can be the running of an arbitrary binary or snippet of code that is executed as part of a Job. For Dolt CI though, at least in its current form, a job step can _only_ execute a Saved Query, which must be identified by name in the `saved_query_name` field.

A [Saved Query](/sql-reference/version-control/saved-queries) in Dolt, is an arbitrary SQL query stored in the database for execution at a later time. By specifying the name of the saved query in the `workflow.yaml` file, we are configuring CI to execute the "show tables" saved query against the `master` branch, whenever a push to `master` occurs.

Additionally, each "step" optionally allows an `expected_rows` or `expected_columns` field to be defined, which can be used to assert the number of rows or columns in the resulting output of the saved query. 

For this simple example, we will assert that the number of rows returned from our "show tables" saved query will be equal to (`==`), 2.

Let's save this file, and store our new workflow in the database.

To do this, we simply use the `dolt ci import <file>` command.

```bash
% dolt ci import workflow.yaml 
% dolt log -n 1
commit 0r25jqhrh26p0s9g7s8pes6qdrmq7bf0 (HEAD -> master) 
Author: 😺😺😺😺 <dustin@dolthub.com>
Date:  Wed Nov 13 15:37:01 -0800 2024

        Successfully stored workflow: my first DoltHub workflow

%
```

Like the `dolt ci init` command earlier, this command also automatically creates a new commit. At this point the file we created `workflow.yaml` is no longer needed, as the configuration has been persisted in the Dolt database. 

If we ever need this file again, we can simply list the defined workflows in the database with the `dolt ci ls` command, then export the workflow back to yaml with the `dolt ci export <workflow name>` command.

```bash
% dolt ci ls
my first DoltHub workflow
% dolt ci export "my first dolthub workflow"
Dolt CI Workflow 'my first DoltHub workflow' exported to /Users/dustin/doltdbs/options/my_first_DoltHub_workflow.yaml.
% ls
my_first_DoltHub_workflow.yaml
%
```

The final step we need to perform on our local database is to define the saved query named "show tables".

## Defining a saved query

A saved query can be added by using the [dolt sql command](/cli-reference/cli#dolt-sql) with the `--save` option. And, as the name of our saved query suggests, we'll save the query "SHOW TABLES;".

```bash
% dolt sql --save "show tables" -q "SHOW TABLES;"
+--------------------+
| Tables_in_options  |
+--------------------+
| option_chain       |
| volatility_history |
+--------------------+

% dolt status
On branch master
Your branch is ahead of 'origin/master' by 1 commit.
  (use "dolt push" to publish your local commits)
	
Untracked tables:
  (use "dolt add <table>" to include in what will be committed)
	new table:        dolt_query_catalog
```

Above we can see the expected output of the "show tables" saved query. The results have two rows, one row for each table in the database. 

After creating the saved query, we can see the creation of the internal `dolt_query_catalog` table which stores saved queries. We now need to add and commit this new table to our database.

```bash
% dolt add .
% dolt commit -m 'add show tables saved query'
commit jn5n8pqc43hqs59hgolinf2mrhhkncm7 (HEAD -> master) 
Author: 😺😺😺😺 <dustin@dolthub.com>
Date:  Wed Nov 13 15:38:35 -0800 2024

        add show tables saved query

%
```

With the workflow and saved query defined on the database, we can push our updates to DoltHub.

```bash
% dolt push origin master
/ Uploading...
To https://doltremoteapi.dolthub.com/dolthub/options
 * [new branch]          master -> master
%
```

## Workflow Jobs on DoltHub

Once we push the `master` branch, DoltHub will run our workflow for the first time. It does this by creating a new Dolt CI Job, in the same way it creates Jobs for pull request merges.

Dolt CI Jobs are visible on from the "Jobs" tab.

![Running Workflow Job](../../../.gitbook/assets/first_workflow_running.png)

Here you can see the workflow job we defined in our yaml file "validate tables" is now running. Notice that for the time being, all Dolt CI Jobs will say they were created by the database owner, regardless of the person responsible for the `push` event. This will be fixed at a later date.

![Succeeded Workflow Job](../../../.gitbook/assets/first_workflow_succeeded.png)

If the Dolt CI Job is successful, meaning the saved query succeeded and the expected number of rows were found, the Job will have status "Succeeded". If the Job failed, the status would be "Failed" and we would see a relevant failure message on the Job's detail page.

To demonstrate what this looks like, let's update our `workflow.yaml` file to include another `step`. This time, let's add a step for a saved query that does not exist in the database.

```yaml
# workflow.yaml
name: my first DoltHub workflow
on:
  push:
    branches:
      - master
jobs:
  - name: validate tables
    steps:
      - name: assert expected tables exist
        saved_query_name: show tables
        expected_rows: "== 2"
      - name: assert table option_chain exists
        saved_query_name: option_chain exists
```

You can see that we've now added a step called "assert table option_chain exists" to our workflow, which uses a saved query "option_chain exists". Let's import these new changes into our local database, but skip saving the saved query "option_chain exists".

```bash
% dolt ci import workflow.yaml 
% dolt log -n 1
commit gngghlouuq6g4k8fs8qpldvr0scfcjvr (HEAD -> master) 
Author: 😺😺😺😺 <dustin@dolthub.com>
Date:  Wed Nov 13 15:56:00 -0800 2024

        Successfully stored workflow: my first DoltHub workflow

% dolt push origin master
- Uploading...
To https://doltremoteapi.dolthub.com/dolthub/options
 * [new branch]          master -> master
%
```

Now with our workflow configuration updated and pushed to DoltHub, we can go check the status of our new Workflow Job.

![Failed Workflow Job](../../../.gitbook/assets/workflow_failed.png)

As expected, the Workflow Job that ran on `push` now failed. And if we click "View details" we can see that it's because we did not add the saved query to the database.

![Failed Workflow Job Reason](../../../.gitbook/assets/workflow_failed_reason.png)

Ok, so let's fix the step we just added by adding the saved query "option_chain exists" to the database and pushing the changes.

```bash
% dolt sql --save "option_chain exists" -q "select * from option_chain limit 1;"
+------------+------------+------------+--------+----------+-------+-------+--------+--------+--------+---------+--------+--------+
| date       | act_symbol | expiration | strike | call_put | bid   | ask   | vol    | delta  | gamma  | theta   | vega   | rho    |
+------------+------------+------------+--------+----------+-------+-------+--------+--------+--------+---------+--------+--------+
| 2019-02-09 | A          | 2019-02-15 | 65.00  | Call     | 10.50 | 11.25 | 0.2705 | 1.0000 | 0.0000 | -0.0046 | 0.0000 | 0.0124 |
+------------+------------+------------+--------+----------+-------+-------+--------+--------+--------+---------+--------+--------+

% dolt status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "dolt add <table>" to update what will be committed)
  (use "dolt checkout <table>" to discard changes in working directory)
    modified:         dolt_query_catalog
% dolt add .
% dolt commit -m 'add option_chain exists saved query'
commit g8hm71ar28djfv1q08uvphn44njuecb7 (HEAD -> master) 
Author: 😺😺😺😺 <dustin@dolthub.com>
Date:  Wed Nov 13 16:04:15 -0800 2024

        add option_chain exists saved query
% dolt push origin master
\ Uploading...
To https://doltremoteapi.dolthub.com/dolthub/options
 * [new branch]          master -> master
```

And after that latest Workflow Job completes, we can see that our "validate tables" Job is passing again!

![Failed Workflow Fixed](../../../.gitbook/assets/workflow_fail_fixed.png)

## Getting fancier

Let's update our `workflow.yaml` once more, but get a little fancier with it.

```yaml
# workflow.yaml
name: my first DoltHub workflow
on:
  push:
    branches:
      - master
jobs:
  - name: validate tables
    steps:
      - name: assert expected tables exist
        saved_query_name: show tables
        expected_rows: "== 2"
      - name: assert table option_chain exists
        saved_query_name: option_chain exists
      - name: assert table volatility_history
        saved_query_name: volatility_history exists
  - name: validate schema
    steps:
      - name: assert 13 option_chain columns exist
        saved_query_name: check option_chain column length
        expected_columns: "<= 13"
      - name: assert call_put column exist
        saved_query_name: check option_chain.call_put exists
        expected_columns: "== 1"
      - name: assert 16 volatility_history columns exist
        saved_query_name: check volatility_history column length
        expected_columns: ">= 16"
      - name: assert act_symbol column exist
        saved_query_name: check volatility_history.act_symbol exists
        expected_columns: "== 1"
  - name: check data
    steps:
      - name: assert option_chain table has data
        saved_query_name: check option_chain data
        expected_rows: "> 0"
      - name: assert volatility_history table has data
        saved_query_name: check volatility_history data
        expected_rows: "> 0"
```

Above, we've done quite a bit more than before. With this updated workflow we now have added additional `job` definitions that will check each tables' schema, and ensure each table has data.

After importing this new `workflow.yaml` into our local database, we create all of the saved queries we've referenced above in the file. The queries for each are shown in the `dolt_query_catalog` table below.

```bash
% dolt sql -r vertical -q "select * from dolt_query_catalog;"
*************************** 1. row ***************************
           id: check option_chain column length
display_order: 4
         name: check option_chain column length
        query: select * from option_chain limit 1;
  description: 

*************************** 2. row ***************************
           id: check option_chain data
display_order: 8
         name: check option_chain data
        query: select * from option_chain limit 1;
  description: 

*************************** 3. row ***************************
           id: check option_chain.call_put exists
display_order: 5
         name: check option_chain.call_put exists
        query: select call_put from option_chain limit 1;
  description: 

*************************** 4. row ***************************
           id: check volatility_history column length
display_order: 6
         name: check volatility_history column length
        query: select * from volatility_history limit 1;
  description: 

*************************** 5. row ***************************
           id: check volatility_history data
display_order: 9
         name: check volatility_history data
        query: select * from volatility_history limit 1;
  description: 

*************************** 6. row ***************************
           id: check volatility_history.act_symbol exists
display_order: 7
         name: check volatility_history.act_symbol exists
        query: select act_symbol from volatility_history limit 1;
  description: 

*************************** 7. row ***************************
           id: option_chain exists
display_order: 2
         name: option_chain exists
        query: select * from option_chain limit 1;
  description: 

*************************** 8. row ***************************
           id: show tables
display_order: 1
         name: show tables
        query: SHOW TABLES;
  description: 

*************************** 9. row ***************************
           id: volatility_history exists
display_order: 3
         name: volatility_history exists
        query: select * from volatility_history limit 1;
  description: 

%
```

After we push these new changes to DoltHub, they'll be live.

Now, let's say that hypothetically, a new committer, unaware of the updated workflow we've defined, comes along and decides to delete all data from the `option_chain` table and pushes this change to `master`.

```bash
% dolt sql -q "delete from option_chain;"
Query OK, 71203454 rows affected (0.00 sec)
% dolt status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "dolt add <table>" to update what will be committed)
  (use "dolt checkout <table>" to discard changes in working directory)
    modified:         option_chain
% dolt add .
% dolt commit -m 'remove option_chain data'
commit gjo41are9nbo4ocq9faapickmqtum26q (HEAD -> master) 
Author: 😺😺😺😺 <dustin@dolthub.com>
Date:  Wed Nov 13 19:00:31 -0800 2024

        remove option_chain data

% dolt push origin master
- Uploading...
To https://doltremoteapi.dolthub.com/dolthub/options
 * [new branch]          master -> master
```

Our updated workflow defined for this database will kick-off each of the Workflow Jobs, as seen in the image below.

![Fancier Workflows Running](../../../.gitbook/assets/fancier_workflows_running.png)

But, we'd expect the "check data" Workflow Job to fail. And, it does.

![Fancier Workflows Failed](../../../.gitbook/assets/fancier_workflows_fail_expected.png)

If we click "View details", we can see the failure resulted from expecting > 0 rows, but got 0.

![Fancier Workflows Failed Details](../../../.gitbook/assets/fancier_workflows_fail_expected_details.png)


