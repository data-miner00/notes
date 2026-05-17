---
title: Git 체리픽
description: 브랜치 간 커밋을 수동 복사 없이 특정 커밋만 복사하는 방법
topic: 일반
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - git
  - workflow
  - commit
updatedAt: 2026-05-17T12:24:00.000Z
createdAt: 2026-05-17T12:24:00.000Z
---

Git 체리픽(cherry-pick)은 두 브랜치를 병합하지 않고도 특정 커밋을 다른 브랜치로 복사할 수 있게 해주는 기능입니다.

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

![Git 체리픽 개요](/images/git-cherrypick/git_cherrypick_overview.svg)

위 그림은 `feature` 브랜치에서 `main` 브랜치의 `C'`로 `C` 커밋을 이동하려는 의도를 보여줍니다. 체리픽은 커밋 메타데이터를 일대일로 이동시키는 대신 새로운 커밋 해시를 생성합니다.

## 기본 사용법

이 기능은 `main` 브랜치에 잘못 커밋했을 때, 대신 `feat/awesome-feature` 기능 브랜치에 커밋해야 할 경우에 유용합니다.

이 경우 먼저 `main` 브랜치에서 커밋 해시를 가져옵니다.

```sh
git log --oneline
```

그런 다음 해시를 복사하고 `feat/awesome-feature` 브랜치로 체크아웃합니다. 마지막으로 `git cherry-pick` 명령을 사용하고 복사한 `hash`를 인수로 전달합니다.

```sh
git checkout feat/awesome-feature
git cherry-pick <the commit hash>
```

이렇게 하면 수동으로 작업하지 않고도 커밋을 성공적으로 복사할 수 있습니다. 이후 `main`으로 체크아웃한 뒤 `git reset`을 사용해 실수로 추가된 커밋을 제거합니다.

```sh
git checkout main
git reset --hard HEAD~1 # main 브랜치에서 커밋 제거
```

## 커밋하지 않고 적용하기

커밋을 바로 만들지 않고 먼저 커밋을 복사한 뒤 수정할 때 유용합니다. 이 경우 `--no-commit`의 줄임말인 `-n` 플래그를 사용합니다.

```sh
git cherry-pick -n <hash>
# 약간 수정...
git commit -m "Applied fix with adjustments"
```

## 충돌 처리하기

체리픽은 병합과 마찬가지로 여전히 충돌이 발생할 수 있습니다. 이럴 때는 수동으로 해결한 뒤 체리픽을 계속하거나 중단할 수 있습니다.

```sh
git cherry-pick <hash>
# 충돌 발생! git이 여기서 일시 중지하기

# 1. 충돌한 파일 수정
# 2. 스테이징
git add <fixed-files>

# 3. 체리픽 계속하기
git cherry-pick --continue

# 또는, 중단하기
git cherry-pick --abort
```

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: git-cherry-pick
url: https://git-scm.com/docs/git-cherry-pick
date: 2026, April 20
source: websites
---
::

::apa-reference
---
title: Git cherry pick
url: https://www.atlassian.com/git/tutorials/cherry-pick
retrievedDate: 2026, May 17
source: websites
publisher: Atlassian
---
::
<!-- prettier-ignore-end -->
