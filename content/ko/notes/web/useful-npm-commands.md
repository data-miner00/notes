---
title: 유용한 NPM 명령
topic: 웹
description: 유용한 NPM 명령 및 정보 목록
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

- 패키지 검색 `npm search <keyword>`
- 패키지 나열

```
npm list --depth 0 --json
npm list --depth 0 --parseable
npm list --depth 0 --dev
npm list --depth 0 --prod
```

- 전역적으로 패키지 설치

```
npm i -g <package>
```

- 패키지 삭제

```
npm uninstall <package>
npm un <package>
npm rm <package>
npm r <package>
```

- 특정 버전의 패키지를 설치

```
npm i <package>@1
npm i <package>@1.3
npm i <package>@1.3.2
```

- 범위 버전으로 패키지 설치

```
npm i <package>@">=1.1.0 <1.4.0"
```

- 항상 최신 버전으로 패키지를 설치

```
npm i <package>@"*"
npm i <package>@"x"
```

- 패키지 업데이트 ([여기](https://docs.npmjs.com/cli/v10/commands/npm-update))

```
npm update

npm update --save # update package.json deps version
```

- HTTP에서 패키지 설치

```
npm i https://www.website.com/pkg

npm i https://dropbox.com/abcdsf # dropbox
```

- Gist에서 설치

이 Gist는 설치하려면 `package.json` 파일이 필요

```
npm i gist:<unique-hash>
```

- 오래된 패키지 표시

```
npm outdated
```

- 사용하지 않은 패키지 삭제

```
npm prune
```

- Shrinkwrap으로 변환

```
npm shrinkwrap
```

- 패키지 정보 얻음

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

- 택을 추가

```
git tag 1.0.2 (푸시 및 게시 후)
git push --tags (모두 태그를 푸시)
git push origin tag 1.0.2 (단일 태그 푸시)
```

- 바전 업데이트

```
npm version minor
npm version major
npm version patch
```

- 로그인

```
npm login
```

- NPM에 프로젝트 게시

```
npm publish --access=public
```

- NPM 패키지를 로걸로 테스트

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

## Npm 레지스트리

- 홈 - https://registry.npmjs.org
- 패키지 - https://registry.npmjs.org/pkg-name
- 별명 - https://npm.im/pkg-name
- GitHub 링크 열기 - `npm repo <pkg-name>`

## 수정자

- 탈자 부호 (`^`) - 마이너 버전
- 틸드 (`~`) - 패치 버전

## 참고

- [Getting Started with NPM 4](https://app.pluralsight.com/library/courses/npm-getting-started/)
