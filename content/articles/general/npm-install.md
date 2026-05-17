---
title: NPM Install
description: Ways to install dependencies with NPM
topic: General
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - node
  - npm
  - javascript
updatedAt: 2026-05-04T06:52:56.000Z
createdAt: 2026-05-04T06:52:56.000Z
---

Installing dependencies with NPM can be a little bit confusing if we don't know the caveats.

<!--more-->

There are two commands that allows us to install dependencies from the NPM repository. They are `npm install` and `npm ci`.

## npm install (General Development)

This command is used for developers when developing locally or to update the dependencies.

- **Function**: Reads `package.json` to determine which dependencies to install. It can install new packages and update existing ones to newer versions within specified ranges (e.g., ^1.2.3).
- **Modifications**: It frequently updates your `package-lock.json` file to reflect the specific versions it just installed.
- **Speed**: Generally slower because it must resolve dependencies and may perform network requests to find newer version

## npm ci (Automated Environments)

Stands for "Clean Install." This command is used in the CI/CD environment to install the dependencies that are deterministic and reliable.

- **Function**: Ignores the `package.json` and installs dependencies directly from the `package-lock.json` (or `npm-shrinkwrap.json`)
- **Strictness**: It requires a lockfile to exist and will throw an error if `package.json` and the lockfile are **out of sync**.
- **Clean State**: It automatically deletes the `node_modules` folder before starting to ensure a fresh, predictable installation.
- **Speed**: Typically faster than `npm install` because it skips version resolution and does not update the lockfile

### Out-of-sync Error

This is a recent error that I faced while trying to run `npm ci` in the CI/CD pipeline.

```log
"C:\Windows\system32\cmd.exe" /D /E:ON /V:OFF /S /C "CALL "D:\agent\_work\_temp\6d22faac-2828-45d6-9ee5-b47ff7afc488.cmd""
npm error code EUSAGE
npm error
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
npm error
npm error Missing: @emnapi/core@1.9.2 from lock file
npm error Missing: @emnapi/runtime@1.9.2 from lock file
npm error Missing: chokidar@5.0.0 from lock file
npm error Missing: chokidar@5.0.0 from lock file
npm error Missing: @types/node@25.6.0 from lock file
npm error Missing: chokidar@5.0.0 from lock file
npm error Missing: @types/node@25.6.0 from lock file
npm error Missing: chokidar@5.0.0 from lock file
npm error
npm error Clean install a project
npm error
npm error Usage:
npm error npm ci
npm error
npm error Options:
npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]
npm error [--no-bin-links] [--no-fund] [--dry-run]
npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]
npm error
npm error aliases: clean-install, ic, install-clean, isntall-clean
npm error
npm error Run "npm help ci" for more info
npm error A complete log of this run can be found in: C:\Users\User\AppData\Local\npm-cache\_logs\2026-04-10T05_56_48_557Z-debug-0.log
##[error]Cmd.exe exited with code '1'.
```

The fix is to remove `package-lock.json` and run `npm install` locally to regenerate the fresh lock file before pushing it to the CI/CD to rerun again.

## Comparison Summary

| Feature             | `npm install`                      | `npm ci`                            |
| ------------------- | ---------------------------------- | ----------------------------------- |
| Primary Use Case    | Local development, adding packages | CI/CD, production builds, team sync |
| Lockfile Dependency | Can create or update it            | Requires it; never modifies it      |
| Version Resolution  | Flexible (follows SemVer ranges)   | Strict (exact versions in lockfile) |
| node_modules        | Appends/updates existing files     | Deletes and reinstalls from scratch |
| Reproducibility     | Lower (versions may drift)         | Higher (deterministic builds)       |

For official technical details, refer to the [npm-install](https://docs.npmjs.com/cli/v11/commands/npm-install) and [npm-ci](https://docs.npmjs.com/cli/v11/commands/npm-ci) documentation on the npm Docs portal.

## Dev Dependencies vs Dependencies

The `dependencies` are the packages that are required to run or execute your program, whereas `devDependencies` are the packages or tools that is only needed when developing or during the build process.

We can selectively install only `dependencies` or `devDependencies` based on our needs.

The commands below only install the `dependencies` in the `node_modules`.

```
npm install --production
# or
npm install --omit=dev
```

## `package-lock.json` VS `shrinkwrap.json`

Shrinkwrap is a publishable version of `package-lock.json`. This file will be published to NPM whereas `package-lock.json` does not. Hence, it ensures the installer of our package will get the **exact same version** of dependencies that we have installed.

We can convert the `package-lock.json` into `shrinkwrap.json` by running [`npm shrinkwrap`](https://docs.npmjs.com/cli/v11/commands/npm-shrinkwrap).

It is also a backward compatible solution for NPM 2-4. In general, we rarely need to use Shrinkwrap and stick to the good ol `package-lock.json` will do.

There are once upon a time where I used [shrinkwrap](https://github.com/data-miner00/ng-hackernews/blob/angular12-archive/npm-shrinkwrap.json) in my project to resolve an issue with the CI, but I think there should be a better way to get around it.

## Reference

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Doumbouya, S. # Sékou Doumbouya
 - Ward, B # Brandon Ward
title: npm install vs. npm ci
url: https://www.baeldung.com/ops/npm-install-vs-npm-ci
date: 2025, May 20
source: websites
---
::

::apa-reference
---
authors:
 - Amery, M # Mark Amery
title: "What is the difference between npm-shrinkwrap.json and package-lock.json?"
url: https://stackoverflow.com/questions/44258235/what-is-the-difference-between-npm-shrinkwrap-json-and-package-lock-json
date: 2021, March 30
source: websites
---
::
<!-- prettier-ignore-end -->
