---
title: Git Reflog
description: A Git diary that allows us to revert destructive actions
topic: General
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - git
  - workflow
  - log
updatedAt: 2026-05-17T16:24:00.000Z
createdAt: 2026-05-17T16:24:00.000Z
---

Git reflog is a diary/auditing mechanism of git that records down every single transaction happening, including destructive actions such as deleting or hard resetting commits.

<!--more-->

## Recover Deleted Commits

This section shows how to recover deleted commits with an example git log.

```sh
git log --oneline
```

Then it shows the log as below.

```
30b387b (HEAD -> master) feat: Add paths
b786463 feat: Write source code
44927b6 feat: Add increment age
9c98d0a docs: Include README
cf456d2 feat: Use variables
cb4ca4b initial
```

Then, we reset the codebase back to `44927b6 feat: Add increment age` because we thought the subsequent commit is not relevant anymore.

```sh
git reset --hard 44927b6
```

Then the log should look like this now.

```
44927b6 (HEAD -> master) feat: Add increment age
9c98d0a docs: Include README
cf456d2 feat: Use variables
cb4ca4b initial
```

Then you realised that those commits are actually important, and you want to restore it back. This is where git reflog comes in useful.

```sh
git reflog
```

This is the reflog output. It basically provides the full audit trail of what action has happened across the repository.

```
44927b6 (HEAD -> master) HEAD@{0}: reset: moving to 44927b6
30b387b HEAD@{1}: commit: feat: Add paths
b786463 HEAD@{2}: commit: feat: Write source code
44927b6 (HEAD -> master) HEAD@{3}: rebase (finish): returning to refs/heads/master
44927b6 (HEAD -> master) HEAD@{4}: rebase (pick): feat: Add increment age
9c98d0a HEAD@{5}: rebase (reword): docs: Include README
c669e31 HEAD@{6}: rebase: fast-forward
cf456d2 HEAD@{7}: rebase (start): checkout HEAD~2
9b38d32 HEAD@{8}: commit: feat: Add increment age
c669e31 HEAD@{9}: commit: readme
cf456d2 HEAD@{10}: rebase (finish): returning to refs/heads/master
cf456d2 HEAD@{11}: rebase (start): checkout HEAD~1
cf456d2 HEAD@{12}: rebase (finish): returning to refs/heads/master
cf456d2 HEAD@{13}: rebase (start): checkout HEAD~1
cf456d2 HEAD@{14}: commit: feat: Use variables
cb4ca4b HEAD@{15}: commit (initial): initial
```

In this case, we've got the hash for the commit we want to restore back to `30b387b` and this is what it matters. We can create a new branch with the commits included.

```sh
git branch chore/restore-commits 30b387b
```

Then we are able to get the commits back.

```
30b387b (HEAD -> chore/restore-commits) feat: Add paths
b786463 feat: Write source code
44927b6 (master) feat: Add increment age
9c98d0a docs: Include README
cf456d2 feat: Use variables
cb4ca4b initial
```

## Recover Deleted Branches

Let's say we have a new commit on the branch that we've created above.

```
7f6fe3e (HEAD -> chore/restore-commits) feat: Add filename to path for source
30b387b feat: Add paths
b786463 feat: Write source code
44927b6 (master) feat: Add increment age
9c98d0a docs: Include README
cf456d2 feat: Use variables
cb4ca4b initial
```

We've checkout to the `master` branch and accidentally deleted the new branch with new commits.

```sh
git branch -D chore/restore-commits
```

Let's see the reflog now.

```
44927b6 (HEAD -> master) HEAD@{0}: checkout: moving from chore/restore-commits to master
7f6fe3e HEAD@{1}: commit: feat: Add filename to path for source
30b387b HEAD@{2}: checkout: moving from master to chore/restore-commits
44927b6 (HEAD -> master) HEAD@{3}: reset: moving to 44927b6
30b387b HEAD@{4}: commit: feat: Add paths
b786463 HEAD@{5}: commit: feat: Write source code
44927b6 (HEAD -> master) HEAD@{6}: rebase (finish): returning to refs/heads/master
44927b6 (HEAD -> master) HEAD@{7}: rebase (pick): feat: Add increment age
9c98d0a HEAD@{8}: rebase (reword): docs: Include README
c669e31 HEAD@{9}: rebase: fast-forward
cf456d2 HEAD@{10}: rebase (start): checkout HEAD~2
9b38d32 HEAD@{11}: commit: feat: Add increment age
c669e31 HEAD@{12}: commit: readme
cf456d2 HEAD@{13}: rebase (finish): returning to refs/heads/master
cf456d2 HEAD@{14}: rebase (start): checkout HEAD~1
cf456d2 HEAD@{15}: rebase (finish): returning to refs/heads/master
cf456d2 HEAD@{16}: rebase (start): checkout HEAD~1
cf456d2 HEAD@{17}: commit: feat: Use variables
cb4ca4b HEAD@{18}: commit (initial): initial
```

Notice the second line where we have the commit that was lost because the branch was deleted. We can use that log to restore the branch as well.

```sh
git branch chore/restored-branch 7f6fe3e
git checkout chore/restored-branch
```

Thankfully, we are able to get back the lost branch.

```
7f6fe3e (HEAD -> chore/restored-branch) feat: Add filename to path for source
30b387b feat: Add paths
b786463 feat: Write source code
44927b6 (master) feat: Add increment age
9c98d0a docs: Include README
cf456d2 feat: Use variables
cb4ca4b initial
```

## Reference

<!-- prettier-ignore-start -->
::apa-reference
---
title: git-reflog
url: https://git-scm.com/docs/git-reflog
date: 2025, October 15
source: websites
---
::

::apa-reference
---
authors:
  - Macy, N # Neil Macy
title: Git Reflog To The Rescue
url: https://www.neilmacy.co.uk/blog/git-reflog/
date: 2024, October 25
source: websites
---
::
<!-- prettier-ignore-end -->
