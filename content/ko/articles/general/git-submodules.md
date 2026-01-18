---
title: Git Submodules
description: Git 저장소에서 타사 코드를 참조하는 방법
topic: 일반
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

Git Submodule (깃 서브모듈)을 사용하면 하나의 Git 저장소를 다른 Git 저장소의 하위 디렉터리로 유지할 수 있습니다. 이를 통해 외부 종속성이나 공유 코드를 저장소 자체에 포함하고 추적하면서도 별도의 버전 기록을 유지할 수 있습니다.

<!--more-->

또한 공유 코드는 최신 버전이 아닌 특정 커밋을 가리킵니다. 이는 외부 소스의 호환성을 깨뜨리는 변경 사항으로 인해 저장소가 손상되는 것을 방지하는 데 도움이 될 수 있습니다.

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 부인 성명
---
한국어 실력이 부적하여 이 글이 구글 번역기를 주로 활용했기 때문에 부정확한 문법과 어휘가 있을수 있습니다. 이 점 양해 부탁드리며, 추후에 다시 검토하여 수정하도록 하겠습니다.
::
<!-- prettier-ignore-end -->

## 기본 설정

### 서브모듈 추가

기존 Git 저장소에 서브모듈을 추가하는 작업은 `submodule add` 명령어를 사용하여 수행할 수 있습니다.

```bash
git submodule add <repository-url> <path>
```

예를 들어, `libs` 디렉토리에 `shared-utils`라는 라이브러리를 추가하고 싶다면 다음과 같이 하면 됩니다.

```bash
git submodule add https://github.com/username/shared-utils.git libs/shared-utils
```

이렇게 하면 지정된 경로에 새 디렉터리가 생성되고 저장소 루트의 `.gitmodules` 파일에서 서브모듈을 추적합니다.

### 서브모듈 커밋

추가된 서브모듈은 `.gitmodules` 파일과 함께 커밋되어야 합니다.

```bash
git add .gitmodules libs/shared-utils
git commit -m "Add shared-utils submodule"
```

## 프로젝트 클론

서브모듈이 포함된 저장소를 클론할 때, 서브모듈 디렉터리는 기본적으로 비어 있습니다. 따라서 별도로 초기화해야 합니다.

```bash
git clone <your-repository-url>
cd <your-repository>
git submodule init
git submodule update
```

다행히 클론할 때 `--recurse-submodules` 플래그를 전달하면 동일한 작업을 수행하는 한 줄짜리 클론 명령이 있습니다.

```bash
git clone --recurse-submodules <your-repository-url>
```

## 일반적인 작업

### 서브모듈 업데이트

서브모듈 라이브러리를 오리진의 최신 커밋으로 업데이트하는 방법은 다음과 같습니다. 서브모듈이 있는 디렉토리로 이동하여 최신 변경 사항을 가져온 다음, 저장소의 루트로 돌아가 업데이트를 커밋하면 됩니다.

```bash
cd libs/shared-utils
git pull origin main
cd ../..
git add libs/shared-utils
git commit -m "Update shared-utils submodule"
```

**모든 서브모듈**을 한 번에 업데이트하려면 다음 명령어를 사용하십시오.

```bash
git submodule update --remote
```

### 상태 확인

다음 명령어를 실행하면 모든 서브모듈의 상태를 확인할 수 있습니다.

```bash
git submodule status
```

그러면 각 서브모듈에 대해 아래와 같은 내용이 출력됩니다.

```
 a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0 libs/shared-utils (v1.2.3)
```

이 난해한 출력 결과를 분석해 보겠습니다. 출력 형식은 아래와 같습니다.

```
[상태 표시기][커밋 해시] [경로] [(태그/브랜치)]
```

첫 번째 문자는 **상태 표시기**입니다. 이는 해당 서브모듈의 상태를 알려줍니다. 상태 표시기에는 4가지 종류가 있습니다.

1. ` ` (공백/기호 없음) - 서브모듈이 올바른 커밋으로 체크아웃되었습니다(모든 것이 동기화됨).
2. `-` - 서브모듈이 아직 초기화되지 않았습니다(디렉토리가 비어 있음).
3. `+` - 서브모듈이 상위 저장소에서 예상하는 커밋과 다른 커밋으로 체크아웃되었습니다(로컬에서 변경했지만 아직 커밋하지 않음).
4. `U` - 서브모듈에 병합 충돌이 있습니다.

## 데모

개념을 설명하기 위해 두 개의 GitHub 저장소를 만들었습니다. 직접 사용해 보시려면 클론해 보세요.

1. [cdn](https://github.com/data-miner00/cdn) - JavaScript 라이브러리 저장소
2. [use-cdn](https://github.com/data-miner00/use-cdn) - 라이브러리를 사용하는 JavaScript 애플리케이션

GitHub에서는 서브모듈을 원본 저장소에 대한 **하이퍼링크**와 해당 라이브러리의 **현재 해시 커밋**(서브모듈 @ 해시)으로 표시합니다.

![GitHub에서 서브모듈 참조의 스크린샷](/images/git-submodule/github-submodule.png)

## 요약

서브모듈은 다음과 같은 경우에 유용합니다.

1. 다른 Git 프로젝트의 코드를 재사용할 수 있습니다.
2. 특정 커밋에서 라이브러리 또는 종속성을 고정할 수 있습니다.
3. 전체 서드파티 코드를 저장소에 커밋하지 않고도 프로젝트별 히스토리를 분리하여 관리할 수 있습니다.

## 참고

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
