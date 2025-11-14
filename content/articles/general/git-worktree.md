---
title: Git Worktree
description: A powerful but underrated Git feature that will change your way of branching forever
topic: General
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - git
  - workflow
  - branch
updatedAt: 2025-11-09T15:21:57.000Z
createdAt: 2025-11-09T15:21:57.000Z
---

`git worktree` is a Git feature that allows us to **check out multiple branches at the same time** in **separate working directories**, all linked to the same Git repository.

<!--more-->

## Why use `git worktree`?

Ever been frustrated while being called for a urgent PR review while you are working on your new feature that have 1000+ uncommited files in the same repository? You'll most likely stash all the changes, and then check out to the other branch for review. Worse, you received a PR comment on your other feature that couldn't be delayed further and requires immediate fix, you'll probably switch the branch again.

The scenario above is a nightmare to maintain and navigate. As much as we'll like to avoid multitasking, sometimes it's just inevitable and in this case, working with multiple branches simultaneously. With `git worktree`, we can avoid making extra clones or stashing our work.

## Create New Worktree

Consider the following directory `repo` that have your repository `website`.

```
repo/
└─ website/
   └─ index.html
```

We would like to work on a new feature `feature-x` without disturbing the `master` branch.

### Command

This can be achieved by adding a Git Worktree that is mounted in a separate directory and the `master` branch would be untempered. Use the `git worktree add` command to create it.

```bash
git worktree add ../feature-x-dir feature-x
```

- This creates a new folder `../feature-x-dir`
- Checks out `feature-x` branch in that folder
- Note that if `feature-x` doesn't exist, Git will throw an error `fatal: invalid reference: feature-x`

To create the `feature-x` branch on the fly, add the `-b` flag before the branch name.

```bash
git worktree add ../feature-x-dir -b feature-x
```

This directory wll now look like this.

```
repo/
├─ feature-x-dir/
|  └─ index.html
└─ website/
   └─ index.html
```

Now, we can work in `feature-x-dir` on `feature-x`, while still having `master` checked out in your original repo.

### Naming Convention

Notice the naming is quite different from the original repo and it can be troublesome when there are other projects in the same directory. Hence, it is imperative to give the worktree clear and descriptive names too.

It is advised to name it `<Original Repo Name>-<Type>-<Branch Name>` to be apparent that the worktrees are related to each other. Some example would be `website-feat-ImplementNavigation` and `website-fix-CumulativeLayoutShift`. The directory structure will now look cleaner.

```
repo/
├─ website-feat-ImplementNavigation/
|  └─ index.html
├─ website-fix-CumulativeLayoutShift/
|  └─ index.html
└─ website/
   └─ index.html
```

## List Worktrees

For each of the worktrees created, we can list all of them with the `worktree list` command. The example output are show below. It will show the path to the branch, followed by the latest commit hash and finally the branch name encapsulated within the square brackets.

```
> git worktree list
D:/repo/website                            f9d49ec [master]
D:/repo/website-feat-ImplementNavigation   f8d48ec [test]
D:/repo/website-fix-CumulativeLayoutShift  f7d47ec [test2]
```

## Remove Worktree

After we are done with the worktree, we can remove them with `worktree remove` command and it will get rid of everything including the build artifacts in the worktree directory, which is extremely handy! We just need to supply the path to the worktree as an argument.

Note that the worktree must remain clean, i.e. all changes commit/discarded for it to work. Otherwise, use the `--force` flag to discard the changes and remove the worktree.

```
git worktree remove <path>
```

For example, inside the original repository directory `website`, run the following.

```bash
git worktree remove ../website-feat-ImplementNavigation --force
```

However, note that the **branch** associated with the worktree is not deleted with this operation.

## Summary

| Command                            | Description                          |
| ---------------------------------- | ------------------------------------ |
| `git worktree list`                | List all active worktrees            |
| `git worktree add <path> <branch>` | Add a new worktree for a branch      |
| `git worktree remove <path>`       | Remove a worktree (must be clean)    |
| `git worktree prune`               | Clean up stale/invalid worktrees     |
| `git worktree lock`                | Prevent a worktree from being pruned |

After I learned about this awesome feature, I **always** create a worktree for whatever branches that I am working on.

## References

<!-- prettier-ignore-start -->
::apa-reference
---
title: git-worktree - Manage multiple working trees
url: https://git-scm.com/docs/git-worktree
retrievedDate: 2025, November 10
source: websites
---
::

::apa-reference
---
title: Git Worktree
url: https://www.gitkraken.com/learn/git/git-worktree
retrievedDate: 2025, November 10
source: websites
---
::

::apa-reference
---
authors:
 - bashbunni
title: learn git worktrees in under 5 minutes
url: https://www.youtube.com/watch?v=8vsRb2mTBA8
date: 2025, July 5
source: websites
---
::
<!-- prettier-ignore-end -->
