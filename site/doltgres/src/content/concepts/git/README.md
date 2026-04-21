---
title: Git-Like Version Control
---

Doltgres implements Git-style version control on tables instead of files. 

Doltgres adopts the Git-interface to version control. There are [commits](/concepts/git/commits),
[branches](/concepts/git/branch), [merges](/concepts/git/merge), and all the other Git concepts you are familiar
with. If you know Git, Doltgres will feel very familiar because conceptually, Doltgres is modeled on
Git.

In SQL, Git read operations are modeled as [system
tables](/reference/version-control/dolt-system-tables). Git write operations are modeled
as [system functions](/reference/version-control/dolt-sql-functions). But
conceptually, all the Git concepts you are familiar with extend to SQL.

In this section we explore the following Git concepts and explain how they work in Doltgres:

1. [Commits](/concepts/git/commits)
2. [Log](/concepts/git/log)
3. [Diff](/concepts/git/diff)
4. [Branch](/concepts/git/branch)
5. [Merge](/concepts/git/merge)
6. [Conflicts](/concepts/git/conflicts)
7. [Remotes](/concepts/git/remotes)
8. [Working Set](/concepts/git/working-set)
