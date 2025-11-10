---
title: Git Worktree
description: 강력하지만 제대로 알려지지 않은 Git 기능으로, 브랜치 관리 방식을 완전히 바꿔놓을 것입니다
topic: 일반
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

`git worktree`는 Git의 기능 중 하나로, 동일한 Git 저장소에 연결된 **별도의 작업 디렉토리**에서 **여러 브랜치를 동시에 체크아웃**할 수 있도록 해줍니다.

<!--more-->

## 왜 `git worktree`를 사용할까?

새로운 기능을 개발하느라 같은 저장소에 커밋되지 않은 파일이 1000개 이상 쌓여 있는데 갑자기 긴급한 PR 검토 요청을 받아서 당황스러웠던 경험 있으신가요? 아마도 모든 변경 사항을 스태시(stash)하고 다른 브랜치로 전환해서 검토했을 겁니다. 더 나쁜 상황은, 다른 기능에 대한 PR에서 더 이상 미룰 수 없는 긴급한 수정 사항이 발생해서 다시 브랜치를 바꿔야 하는 경우일 겁니다.

위에서 설명한 시나리오는 유지 관리하고 다루기가 매우 어렵습니다. 멀티태스킹을 피하고 싶지만, 때로는 불가피한 경우가 있으며, 이 경우 여러 브랜치를 동시에 작업해야 합니다. `git worktree`를 사용하면 추가 복제본을 만들거나 작업 내용을 임시 저장할 필요 없이 이러한 문제를 해결할 수 있습니다.

## 새 Worktree를 만들기

다음은 여러분의 저장소인 `website`가 포함된 `repo` 디렉토리입니다.

```
repo/
└─ website/
   └─ index.html
```

우리는 `master` 브랜치에 영향을 주지 않고 새로운 기능인 `feature-x`를 개발하고 싶습니다.

### 명령

이는 별도의 디렉토리에 마운트되는 Git 작업 트리를 추가함으로써 달성할 수 있으며, 이렇게 하면 `master` 브랜치는 변경되지 않은 상태로 유지됩니다. `git worktree add` 명령을 사용하여 작업 트리를 생성하세요.

```bash
git worktree add ../feature-x-dir feature-x
```

- 이 명령은 `../feature-x-dir`이라는 새 폴더를 생성합니다.
- 해당 폴더에서 `feature-x` 브랜치를 체크아웃합니다.
- 참고로, `feature-x` 브랜치가 존재하지 않으면 Git에서 `fatal: invalid reference: feature-x` 오류가 발생합니다.

`feature-x` 브랜치를 즉석에서 생성하려면 브랜치 이름 앞에 `-b` 플래그를 추가하세요.

```
git worktree add ../feature-x-dir -b feature-x
```

이제 이 디렉터리는 다음과 같이 보일 것입니다.

```
repo/
├─ feature-x-dir/
|  └─ index.html
└─ website/
   └─ index.html
```

이제 원래 저장소에는 `master` 브랜치가 체크아웃된 상태로 유지하면서 `feature-x-dir` 디렉토리에서 `feature-x` 브랜치 작업을 할 수 있습니다.

### 명명 규칙

이름 지정 방식이 원래 저장소와 상당히 다르다는 점에 유의하세요. 같은 디렉터리에 다른 프로젝트가 있는 경우 문제가 발생할 수 있습니다. 따라서 작업 트리에 명확하고 설명적인 이름을 지정하는 것이 매우 중요합니다.

워크트리들이 서로 관련되어 있음을 명확히 하기 위해 `<원본 저장소 이름>-<유형>-<브랜치 이름>` 형식으로 이름을 지정하는 것이 좋습니다. 예를 들어 `website-feat-ImplementNavigation` 및 `website-fix-CumulativeLayoutShift`와 같이 이름을 지정할 수 있습니다. 이렇게 하면 디렉터리 구조가 더 깔끔해 보일 것입니다.

```
repo/
├─ website-feat-ImplementNavigation/
|  └─ index.html
├─ website-fix-CumulativeLayoutShift/
|  └─ index.html
└─ website/
   └─ index.html
```

## Worktree 들를 나열하다

생성된 각 작업 트리 목록은 `worktree list` 명령을 사용하여 확인할 수 있습니다. 아래는 예시 출력입니다. 출력에는 브랜치 경로, 최신 커밋 해시, 그리고 대괄호 안에 표시된 브랜치 이름이 순서대로 나타납니다.

```
> git worktree list
D:/Workspace/projects/webutils        f9d49ec [master]
D:/Workspace/projects/webutils-test   f9d49ec [test]
D:/Workspace/projects/webutils-test2  f9d49ec [test2]
```

## Worktree를 삭제

작업 트리를 모두 사용하고 나면 `worktree remove` 명령어를 사용하여 해당 트리를 제거할 수 있습니다. 이 명령어를 사용하면 작업 트리 디렉터리에 있는 빌드 결과물을 포함한 모든 파일이 삭제되므로 매우 편리합니다. 작업 트리 경로를 인수로 제공하기만 하면 됩니다.

참고로, 이 기능이 제대로 작동하려면 작업 트리가 깨끗한 상태여야 합니다. 즉, 모든 변경 사항이 커밋되거나 폐기되어야 합니다.

```
git worktree remove <path>
```

## 요약

| 명령                               | 설명                                            |
| ---------------------------------- | ----------------------------------------------- |
| `git worktree list`                | 모든 활성 작업 트리 나열                        |
| `git worktree add <path> <branch>` | 새 작업 트리 만들기                             |
| `git worktree remove <path>`       | 작업 트리 제거                                  |
| `git worktree prune`               | 오래되거나 유효하지 않은 작업 트리를 정리합니다 |
| `git worktree lock`                | 작업 트리가 정리되지 않도록 방지합니다          |

이 멋진 기능을 알게 된 후로는 제가 작업하는 모든 브랜치에 대해 **항상** 워크트리를 생성합니다.

## 참고

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
