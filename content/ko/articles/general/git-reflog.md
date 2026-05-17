---
title: Git Reflog
description: 파괴적인 작업을 되돌릴 수 있게 해주는 Git 일지
topic: 일반
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

Git reflog는 커밋 삭제나 강제 리셋 같은 파괴적인 작업을 포함하여 저장소에서 일어나는 모든 트랜잭션을 기록하는 Git의 일지/감사 메커니즘입니다.

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

## 삭제된 커밋 복구하기

이 섹션은 Git 로그 예제를 통해 삭제된 커밋을 복구하는 방법을 보여줍니다.

```sh
git log --oneline
```

그러면 다음과 같이 로그가 표시됩니다.

```
30b387b (HEAD -> master) feat: Add paths
b786463 feat: Write source code
44927b6 feat: Add increment age
9c98d0a docs: Include README
cf456d2 feat: Use variables
cb4ca4b initial
```

그 다음 커밋들이 더 이상 관련성이 없다고 생각하여 코드베이스를 `44927b6 feat: Add increment age`로 리셋합니다.

```sh
git reset --hard 44927b6
```

이제 로그는 다음과 같이 보일 것입니다.

```
44927b6 (HEAD -> master) feat: Add increment age
9c98d0a docs: Include README
cf456d2 feat: Use variables
cb4ca4b initial
```

그런데 나중에 이 커밋들이 실제로는 중요했다는 것을 깨닫고 복구하고 싶을 때가 있습니다. 바로 이때 git reflog가 유용합니다.

```sh
git reflog
```

이것이 reflog 출력입니다. 기본적으로 저장소에서 일어난 모든 작업의 완전한 감사 추적을 제공합니다.

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

이 경우 복구하려는 커밋의 해시 `30b387b`를 얻었고 이것이 중요한 부분입니다. 이 커밋들을 포함한 새 브랜치를 만들 수 있습니다.

```sh
git branch chore/restore-commits 30b387b
```

그러면 커밋들을 다시 가져올 수 있습니다.

```
30b387b (HEAD -> chore/restore-commits) feat: Add paths
b786463 feat: Write source code
44927b6 (master) feat: Add increment age
9c98d0a docs: Include README
cf456d2 feat: Use variables
cb4ca4b initial
```

## 삭제된 브랜치 복구하기

위에서 만든 브랜치에 새로운 커밋이 있다고 가정합시다.

```
7f6fe3e (HEAD -> chore/restore-commits) feat: Add filename to path for source
30b387b feat: Add paths
b786463 feat: Write source code
44927b6 (master) feat: Add increment age
9c98d0a docs: Include README
cf456d2 feat: Use variables
cb4ca4b initial
```

`master` 브랜치로 체크아웃한 후 실수로 새 커밋들이 있는 브랜치를 삭제했습니다.

```sh
git branch -D chore/restore-commits
```

이제 reflog를 확인해봅시다.

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

두 번째 줄에 브랜치가 삭제되어 손실된 커밋이 있음을 주목하세요. 이 로그를 사용해 브랜치도 복구할 수 있습니다.

```sh
git branch chore/restored-branch 7f6fe3e
git checkout chore/restored-branch
```

다행히 손실된 브랜치를 다시 가져올 수 있습니다.

```
7f6fe3e (HEAD -> chore/restored-branch) feat: Add filename to path for source
30b387b feat: Add paths
b786463 feat: Write source code
44927b6 (master) feat: Add increment age
9c98d0a docs: Include README
cf456d2 feat: Use variables
cb4ca4b initial
```

## 참고

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
