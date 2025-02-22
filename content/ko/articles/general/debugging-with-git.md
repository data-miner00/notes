---
title: Git으로 디버깅
topic: 일반
description: Git을 사용하여 코드베이스의 버그와 문제를 식별하는 기술
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - git
  - debugging
  - grep
updatedAt: 2024-03-28T11:05:53.157Z
createdAt: 2023-10-27T11:12:17.718Z
---

일반적인 `fetch`, `commit`, `push` 명령 외에도 꽤 유용할 수 있는 Git 명령이 훨씬 더 많습니다. 이 짧은 글에서는 'bisect', 'grep' 및 'blame'이라는 3가지 유용한 Git 명령을 소개합니다.

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

## Bisect

커밋 히스토리를 통해 버그를 유발하는 커밋을 찾아내는 기술입니다. 잘못된 커밋을 감지하기 위해 내부적으로 이진 검색을 사용합니다. 흥미롭게도 사용자 정의 스크립트를 사용하여 프로세스를 **자동화**할 수 있습니다.

### 1단계: 좋은 커밋과 나쁜 커밋 찾기

첫 번째 단계는 좋은(이전) 커밋과 나쁜(최신) 커밋을 식별하는 것입니다. 잘못된 커밋은 파일 누락과 같은 일부 문제가 예기치 않게 발생하는 현재 HEAD일 가능성이 높습니다.

해당 커밋을 식별하고 해당 커밋의 해시를 기록해 둡니다.

```
좋은 커밋 해시: <hash>
나쁜 커밋 해시: <hash>
```

### 2단계: Bisect 시작

`bisect start` 명령을 사용하여 대화형 디버깅 세션을 시작합니다.

```
git bisect start
```

### 3단계: 좋은 커밋과 나쁜 커밋 지정

1단계에서 수집된 커밋 해시를 사용하여 디버깅 세션에 채웁니다.

```
git bisect good <좋은 해시>
git bisect bad <나쁜 해시>
```

### 4단계: 코드베이스에 문제가 있는지 검사

이는 반복적인 단계입니다. 이제 Bisect는 코드 검사를 위해 이진 검색을 통해 기록을 탐색합니다.

코드베이스를 조사하세요. 현재 커밋에 버그나 이슈가 지속된다면 `bisect bad` 명령어를 사용하여 반영할 수 있습니다.

```
git bisect bad
```

Bisect는 피드백을 인정하고 역사상 다른 커밋으로 이동합니다. 코드베이스를 조사하고 피드백을 다시 제공하세요.

좋은 커밋이라면 `bisect good` 명령을 사용하여 Bisect를 알 수 있습니다.

```
git bisect good
```

더 이상 검사할 커밋이 없을 때까지 이를 반복합니다. 그런 일이 발생하면 문제가 있는 커밋을 찾아야 합니다.

### 프로세스를 자동화하다

각 명령줄에서 실행할 수 있는 사용자 정의 스크립트를 작성하여 이등분 프로세스를 자동화할 수 있습니다. 기준을 충족하지 못한 경우 스크립트는 `-1` 또는 `0`이 아닌 숫자를 반환해야 하며, 이등분선이 올바르게 작동하려면 기준이 일치했음을 나타내는 `0`을 반환해야 합니다.

자동화된 bisect 세션을 시작하려면 'bisect start' 명령에 잘못된 커밋 해시와 올바른 커밋 해시를 모두 지정하세요.

```
git bisect start <나쁜 해시> <좋은 해시>
```

그런 다음 실행할 스크립트나 명령을 지정합니다.

```
git bisect run <사용자 정의 스크립트 또는 명령>
```

실행이 끝나면 수동 이등분 세션과 마찬가지로 문제를 유발하는 커밋이 표시됩니다.

### 초기화

회귀 원인을 확인한 후 `reset`을 사용하여 이등분 세션을 종료해야 합니다.

```
git bisect reset
```

## Blame

'비난'은 문서 내 각 코드 줄의 작성자를 간략하게 설명하는 데 사용됩니다. 각 라인에 대한 세 가지 유용한 정보가 표시됩니다.

- 커밋 해시
- 작가
- 커밋 타임스탬프

[GitLens](https://gitlens.amod.io/)는 VSCode 사용자가 정보를 읽는 데 편리합니다.

```
git blame <document name>
```

### 파일 일부분 Blame 적용

파일의 일부만 검사하려면 `-L` 플래그를 사용하여 파일에 대해 검사할 줄 번호 범위를 제공합니다.

```
git blame -L <line-start>,<line-end> <문서 일음>

# 예시
git blame -L 23,54 azure-pipeline.yml
```

### Show

커밋을 추가로 검사하려면 `show` 명령을 사용하세요. `blame` 명령으로 수집된 해시를 활용하여 변경 사항에 대해 자세히 알아볼 수 있습니다.

```
git show <commit-hash>
```

```diff
@@ -23,4 +23,4 @@
        using System.Collections.Specialized;
        using System.IO;

-       public sealed class Calculator
+       public class Calculator
        {
            private const string Name = "Calculator";
            private readonly IMapper mapper;
            private readonly IRepository repository;
```

## Grep

`grep` 명령은 Git 저장소 내에서 커밋된 파일에 대한 문자열이나 정규식을 사용하여 텍스트를 검색하는 데 사용됩니다.

```
git grep <regex/텍스트>

# 예시
git grep "plain text"
git grep "^regex[a-zA-Z0-9]+$"
```

검색할 파일 형식을 제한하려면 다음과 같이 glob 패턴을 제공하세요.

```
git grep <regex/텍스트> -- <glob 패턴>

# 예시
git grep "hello" -- "*.tsx"
```

특정 지점을 검색하려면 지점 이름을 두 번째 매개변수로 제공합니다.

```
git grep <regex/text> <branch>
```

이것은 모든 것을 하나로 연결하는 예입니다.

```
git grep -n "section" origin/master -- index.html
```

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Stewart, A # Aaron Stewart
title: Git Debugging Techniques
publisher: Pluralsight
date: 2023, October 3
url: https://app.pluralsight.com/library/courses/git-debugging-techniques/table-of-contents
source: websites
---
::

::apa-reference
---
authors:
 - IAdapter
 - Ulhaq, M # Mateen Ulhaq
title: How do I use git bisect?
date: 2011, January 17
url: https://stackoverflow.com/questions/4713088/how-do-i-use-git-bisect
source: websites
---
::

::apa-reference
---
title: git bisect
retrievedDate: 2024, March 24
url: https://git-scm.com/docs/git-bisect
source: websites
---
::

::apa-reference
---
title: git grep
retrievedDate: 2024, March 24
url: https://git-scm.com/docs/git-grep
source: websites
---
::

::apa-reference
---
title: git blame
retrievedDate: 2024, March 24
url: https://git-scm.com/docs/git-blame
source: websites
---
::
<!-- prettier-ignore-end -->
