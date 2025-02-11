---
title: Useful NPM Commands
topic: Web
description: List of helpful NPM commands and information
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - javascript
  - npm
  - packages
updatedAt: 2025-02-11T05:19:06.000Z
createdAt: 2024-05-21T15:07:34.090Z
---

- Search package `npm search <keyword>`
- List

```
npm list --depth 0 --json
npm list --depth 0 --parseable
npm list --depth 0 --dev
npm list --depth 0 --prod
```

- Install globally

```
npm i -g <package>
```

- Uninstall a package

```
npm uninstall <package>
npm un <package>
npm rm <package>
npm r <package>
```

- Install with specific versions

```
npm i <package>@1
npm i <package>@1.3
npm i <package>@1.3.2
```

- Install ranged versions

```
npm i <package>@">=1.1.0 <1.4.0"
```

- Always install latest version

```
npm i <package>@"*"
npm i <package>@"x"
```

- Update dependencies ([Here](https://docs.npmjs.com/cli/v10/commands/npm-update))

```
npm update

npm update --save # update package.json deps version
```

- Installing from Http

```
npm i https://www.website.com/pkg

npm i https://dropbox.com/abcdsf # dropbox
```

- Installing from gist

The gist must have a `package.json` file to be installable.

```
npm i gist:<unique-hash>
```

- Get outdated packages

```
npm outdated
```

- Remove unused packages

```
npm prune
```

- Convert to shrinkwrap

```
npm shrinkwrap
```

- Get info for a package

```
npm info <package>
```

```
underscore@1.13.6 | MIT | deps: none | versions: 53
JavaScript's functional programming helper library.
https://underscorejs.org

keywords: util, functional, server, client, browser

dist
.tarball: https://registry.npmjs.org/underscore/-/underscore-1.13.6.tgz
.shasum: 04786a1f589dc6c09f761fc5f45b89e935136441
.integrity: sha512-+A5Sja4HP1M08MaXya7p5LvjuM7K6q/2EaC0+iovj/wOcMsTzMvDFbasi/oSapiwOlt252IqsKqPjCl7huKS0A==
.unpackedSize: 903.3 kB

maintainers:
- jashkenas <jashkenas@gmail.com>
- jgonggrijp <dev@juliangonggrijp.com>

dist-tags:
latest: 1.13.6  stable: 1.13.4

published a year ago by jgonggrijp <dev@juliangonggrijp.com>
```

- Add tag

```
git tag 1.0.2 (after push & publish)
git push --tags (push all tags)
git push origin tag 1.0.2 (push single tag)
```

- Updating semver

```
npm version minor
npm version major
npm version patch
```

- Login

```
npm login
```

- Publish for scoped project

```
npm publish --access=public
```

- Testing Npm Package Locally

```
├─ packages
│  ├─ my-pkg
│  │  ├─ index.js
│  │  └─ package.json
├─ test-project
│  ├─ index.js
│  └─ package.json (run npm link in this project)
```

```
npm link <my-pkg>
```

## Npm Registry

- Home - https://registry.npmjs.org
- Package - https://registry.npmjs.org/pkg-name
- Alias - https://npm.im/pkg-name
- Open GitHub link - `npm repo <pkg-name>`

## Modifiers

- Caret (`^`) - Minor version
- Tilde (`~`) - Patch version

## Resources

- [Getting Started with NPM 4](https://app.pluralsight.com/library/courses/npm-getting-started/)
