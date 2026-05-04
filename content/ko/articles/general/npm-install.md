---
title: NPM Install
description: NPM을 사용하여 종속성을 설치하는 방법
topic: 일반
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

NPM을 사용하여 종속성을 설치하는 것은 주의 사항을 모르면 다소 혼란스러울 수 있습니다.

<!--more-->

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 부인 성명
---
한국어 실력이 부적하여 이 글이 구글 번역기를 주로 활용했기 때문에 부정확한 문법과 어휘가 있을수 있습니다. 이 점 양해 부탁드리며, 추후에 다시 검토하여 수정하도록 하겠습니다.
::
<!-- prettier-ignore-end -->

NPM 저장소에서 종속성을 설치할 수 있는 명령어는 `npm install`과 `npm ci` 두 가지가 있습니다.

## npm install (일반 개발)

이 명령어는 개발자가 로컬 환경에서 개발하거나 종속성을 업데이트할 때 사용합니다.

- **기능**: `package.json` 파일을 읽어 설치할 종속성을 확인합니다. 새 패키지를 설치하거나 기존 패키지를 지정된 범위(예: ^1.2.3) 내의 최신 버전으로 업데이트할 수 있습니다.

- **수정 사항**: 설치 후 `package-lock.json` 파일을 주기적으로 업데이트하여 특정 버전을 반영합니다.

- **속도**: 종속성을 해결하고 최신 버전을 찾기 위해 네트워크 요청을 수행해야 하므로 일반적으로 속도가 느립니다.

## npm ci (자동화된 환경)

`npm ci`은 "클린 설치(Clean Install)"의 약자입니다. 이 명령어는 CI/CD 환경에서 예측 가능하고 안정적인 종속성 설치를 위해 사용됩니다.

- **기능**: `package.json` 파일을 무시하고 `package-lock.json`(또는 `npm-shrinkwrap.json`)에서 직접 종속성을 설치합니다.
- **엄격성**: `lockfile`이 반드시 존재해야 하며, `package.json`과 `lockfile`이 **동기화되지 않은** 경우 오류를 발생시킵니다.

- **클린 상태**: 설치 시작 전에 `node_modules` 폴더를 자동으로 삭제하여 새롭고 예측 가능한 설치를 보장합니다.

- **속도**: 버전 확인을 건너뛰고 `lockfile`을 업데이트하지 않으므로 일반적으로 `npm install`보다 빠릅니다.

### 동기화 오류

최근 CI/CD 파이프라인에서 `npm ci`를 실행하려고 할 때 발생한 오류입니다.

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

해결 방법은 `package-lock.json` 파일을 삭제하고 `npm install`을 로컬에서 실행하여 새로운 잠금 파일을 생성한 다음 CI/CD 환경에 푸시하여 다시 실행하는 것입니다.

## 비교 요약

| 특징            | `npm install`               | `npm ci`                            |
| --------------- | --------------------------- | ----------------------------------- |
| 주요 사용 사례  | 로컬 개발, 패키지 추가      | CI/CD, 프로덕션 빌드, 팀 동기화     |
| Lockfile 종속성 | 생성 또는 업데이트 가능     | 필수, 수정 불가                     |
| 버전 확인       | 유연함(SemVer 범위 준수)    | 엄격함(Lockfile에 정확한 버전 유지) |
| node_modules    | 기존 파일 추가/업데이트     | 삭제 후 처음부터 다시 설치          |
| 재현성          | 낮음(버전 변동 가능성 있음) | 높음(확정적인 빌드)                 |

자세한 기술적 내용은 npm Docs 포털의 [npm-install](https://docs.npmjs.com/cli/v11/commands/npm-install) 및 [npm-ci](https://docs.npmjs.com/cli/v11/commands/npm-ci) 문서를 참조하세요.

## 개발 종속성 vs 종속성

`dependencies`는 프로그램을 실행하는 데 필요한 패키지를 의미하며, `devDependencies`는 개발 또는 빌드 과정에서만 필요한 패키지 또는 도구를 의미합니다.

필요에 따라 `dependencies` 또는 `devDependencies`만 선택적으로 설치할 수 있습니다.

아래 명령어는 `node_modules` 폴더에 있는 `종속성` 파일만 설치합니다.

```
npm install --production
# 또는
npm install --omit=dev
```

## `package-lock.json` VS `shrinkwrap.json`

Shrinkwrap은 `package-lock.json`의 공개 버전입니다. 이 파일은 NPM에 게시되지만, `package-lock.json` 원본은 게시되지 않습니다. 따라서 Shrinkwrap을 사용하면 패키지 설치 프로그램이 설치된 종속성과 **정확히 동일한 버전**의 패키지를 사용하게 됩니다.

[`npm shrinkwrap`](https://docs.npmjs.com/cli/v11/commands/npm-shrinkwrap) 명령어를 실행하면 `package-lock.json` 파일을 `shrinkwrap.json` 파일로 변환할 수 있습니다.

또한 NPM 2-4 버전과의 하위 호환성도 제공합니다. 일반적으로 Shrinkwrap을 사용할 필요는 거의 없으며, 기존의 `package-lock.json`만으로도 충분합니다.

예전에 CI 관련 문제를 해결하기 위해 프로젝트에서 [shrinkwrap](https://github.com/data-miner00/ng-hackernews/blob/angular12-archive/npm-shrinkwrap.json)을 사용한 적이 있는데, 더 나은 해결 방법이 있을 거라고 생각합니다.

## 참고

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
