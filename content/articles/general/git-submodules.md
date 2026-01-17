---
title: Git Submodules
description: A way of referencing third-party codes from a Git repository
topic: General
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - git
  - workflow
  - library
updatedAt: 2026-01-17T12:24:00.000Z
createdAt: 2026-01-17T12:24:00.000Z
---

Submodules allow us to keep a Git repository as a subdirectory of another Git repository. This lets us include and track external dependencies or shared code in the repo itself while maintaining their own separate version history.

<!--more-->

Additionally, the shared code are pointing to a specific commit instead of the latest version. This can help guarantee that the repo will not break due to breaking changes from the external sources.

## Basic Setup

### Add Submodule

Adding a submodule to existing Git repository can be performed with the `submodule add` command.

```bash
git submodule add <repository-url> <path>
```

For example, if we want to add a library called `shared-utils` to a `libs` directory:

```bash
git submodule add https://github.com/username/shared-utils.git libs/shared-utils
```

This creates a new directory at the specified path and tracks the submodule in a `.gitmodules` file at the repository root.

### Commit Submodule

The submodule added needs to be committed together with the `.gitmodules` file.

```bash
git add .gitmodules libs/shared-utils
git commit -m "Add shared-utils submodule"
```

## Cloning Project with Submodules

When cloning a repository with submodule, the submodule directories will be empty by default. They need to initialize separately.

```bash
git clone <your-repository-url>
cd <your-repository>
git submodule init
git submodule update
```

Fortunately, there is a one-liner clone command to do the same by passing the `--recurse-submodules` flag when cloning.

```bash
git clone --recurse-submodules <your-repository-url>
```

## Common Operations

### Update Submodule

Here is how we can update the submodule library to the latest commit from the origin. All we need to do is to move into the directory of the submodule, pull the latest change and return to the root of the repository to commit the update.

```bash
cd libs/shared-utils
git pull origin main
cd ../..
git add libs/shared-utils
git commit -m "Update shared-utils submodule"
```

To update **all submodules** at once, use the following command.

```bash
git submodule update --remote
```

### Check Status

The status of all the submodules can be inspected by running the following command.

```bash
git submodule status
```

Then, for each submodule, it will output something like below.

```
 a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0 libs/shared-utils (v1.2.3)
```

Let's break down the cryptic output. The format for the output is shown below.

```
[status indicator][commit hash] [path] [(tag/branch)]
```

The first character is the **status indicator**. It tells us the status of the respective submodule. There are 4 kinds of status indicator.

1. ` ` (space/no symbol) - The submodule is checked out at the correct commit (everything's in sync)
2. `-` - The submodule is not initialized yet (empty directory)
3. `+` - The submodule is checked out to a different commit than what the parent repo expects (changes were made locally but haven't committed the change)
4. `U` - The submodule has merge conflicts

## Demo

I've set up two GitHub repository to demonstrate the concept. Feel free to clone them for hands-on experience.

1. [cdn](https://github.com/data-miner00/cdn) - The JavaScript library repository
2. [use-cdn](https://github.com/data-miner00/use-cdn) - The JavaScript app that uses the library

GitHub represents submodules with a **hyperlink** to the original repository along with the **current hash commit** of the library (submodule @ hash).

![Screenshot of submodule reference in GitHub](/images/git-submodule/github-submodule.png)

## Summary

Submodules are helpful for

1. Reuse code from another Git project
2. Lock the library or dependency at a specific commit
3. Keep histories of projects separate without committing the full 3rd party codes into the repo

## References

<!-- prettier-ignore-start -->
::apa-reference
---
title: 7.11 Git Tools - Submodules
url: https://git-scm.com/book/en/v2/Git-Tools-Submodules
retrievedDate: 2026, January 17
source: websites
---
::

::apa-reference
---
title: Git Submodules
url: https://www.w3schools.com/git/git_submodules.asp
retrievedDate: 2026, January 17
source: websites
---
::

::apa-reference
---
authors:
 - Mazin, D # Dmitry Mazin
title: Demystifying git submodules
url: https://www.cyberdemon.org/2024/03/20/submodules.html
date: 2024, March 20
source: websites
---
::

::apa-reference
---
title: Git submodules
url: https://www.atlassian.com/git/tutorials/git-submodule
retrievedDate: 2026, January 17
source: websites
---
::
<!-- prettier-ignore-end -->
