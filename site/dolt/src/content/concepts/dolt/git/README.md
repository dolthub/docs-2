---
title: Git-Like Version Control
---

# Git-Like Version Control

Dolt implements Git-style version control on tables instead of files. 

Dolt adopts the Git-interface to version control. There are [commits](/concepts/dolt/git/commits), [branches](/concepts/dolt/git/branch), [merges](/concepts/dolt/git/merge), and all the other Git concepts you are familiar with. If you know Git, Dolt will feel very familiar because conceptually, Dolt is modeled on Git.

On the command-line, these concepts are exposed as a replica of the Git command line. Where you would type `git log`, you now type `dolt log`. Where you would type `git add`, you type `dolt add`. The replication extends to the command arguments.

In SQL, Dolt becomes a bit more complicated because no Git-equivalent to SQL exists. Git read operations are modeled as [system tables](/sql-reference/version-control/dolt-system-tables). Git write operations are modeled as [stored procedures](/sql-reference/version-control/dolt-sql-procedures). But conceptually, all the Git concepts you are familiar with extend to SQL. 

In this section we explore the following Git concepts and explain how they work in Dolt:

1. [Commits](/concepts/dolt/git/commits)
2. [Log](/concepts/dolt/git/log)
3. [Diff](/concepts/dolt/git/diff)
4. [Branch](/concepts/dolt/git/branch)
5. [Merge](/concepts/dolt/git/merge)
6. [Conflicts](/concepts/dolt/git/conflicts)
7. [Remotes](/concepts/dolt/git/remotes)
8. [Working Set](/concepts/dolt/git/working-set)
