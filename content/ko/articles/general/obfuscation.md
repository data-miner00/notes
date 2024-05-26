---
title: 코드 난독화
description: 소스코드의 목적을 숨기려는 시도
topic: 일반
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - encryption
  - c
  - security
updatedAt: 2024-05-24T13:10:15.014Z
createdAt: 2022-08-12T17:38:48.848Z
---

난독화란 소스 코드의 일부를 의도적으로 실제 목적을 숨기기 위해 인간이 이해하기 어려운 코드로 변환하는 행위이지만 기능은 변경되지 않고 컴퓨터에서 완벽하게 실행될 수 있도록 하는 것입니다.

<!--more-->

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 부인 성명
---
저는 이제 아직 한국어 잘 못했으니까 이 기사는 구글 번역은 많이 사용했어서 잘못된 문법과 어휘는 있으니 죄송합니다. 이 기사가 나중에 다시 리뷰를 할겁니다.
::
<!-- prettier-ignore-end -->

## 예시

다음은 C 코드 부분을 난독화하는 방법에 대한 [단계별 가이드](https://www.youtube.com/watch?v=rwOI1biZeD8)입니다. 전후의 변화는 서로에 비해 상당히 파격적이다.

### 난독화 전 코드

```c [hello.c]
int main(void)
{
    time_t t;
    struct tm* tm;

    t = time(NULL); /* 현재 시간을 초 단위로 가져옵니다. */
    tm = localtime(&t); /* 타임스탬프를 세분화된 시간으로 변환 */

    switch(tm->tm_hour) /* 시간 값에서 작업 선택 */
    {
        case 4: case 5: case 6: case 7:
        case 8: case 9: case 10: case 11:
            printf("Good morning!\n");
            break;
        case 12: case 13: case 14:
            printf("Good day!\n");
            break;
        case 15: case 16: case 17:
            printf("Good afternoon!\n");
            break;
        case 18: case 19: case 20: case 21:
            printf("Good evening!\n");
            break;
        default:
            printf("Good night!\n");
            break;
    }
    return 0;
}
```

### 난독화 후 코드

```c [hello.c]
#include <time.h>
char* w = "AAAA########+++///9999AA Good %s!\n\0morning\0day\0afternoon\0evening\0night";
int main(){time_t t=time(0); return printf(w+25, w + w[ localtime(&t)->tm_hour ]);}
```

## 오라인 난독화기

난독화기는 [JavaScript](https://obfuscator.io/) 및 [Python](https://pyob.oxyry.com/)용으로 온라인에서도 사용할 수 있습니다. 더 유사한 서비스를 찾으려면 관련 키워드를 Google에 검색하세요.

## 단점

- 난독화로 인해 읽기 또는 리버스 엔지니어링이 어려워지지만 불가능하지는 않습니다.
- 올바르게 취급하지 않을 경우 성능 저하의 원인이 될 수 있습니다.
- 개발자에게 빌드 및 디버깅의 복잡성을 소개합니다.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Bisqwit
title: "Obfuscated C programs: Introduction"
url: https://www.youtube.com/watch?v=rwOI1biZeD8
date: 2016, February 18
source: websites
---
::

::apa-reference
---
title: Obfuscation (software)
url: https://en.wikipedia.org/wiki/Obfuscation_(software)
date: 2023, December 14
publisher: Wikipedia
source: websites
---
::

::apa-reference
---
title: JavaScript Obfuscator Tool
url: https://obfuscator.io/
retrievedDate: 2024, March 25
source: websites
---
::

::apa-reference
---
title: Oxyry Python Obfuscator
url: https://pyob.oxyry.com/
retrievedDate: 2024, March 25
source: websites
---
::

::apa-reference
---
title: Obfuscated C Code
url: https://www.cise.ufl.edu/~manuel/obfuscate/obfuscate.html
organization: University of Florida
retrievedDate: 2024, March 25
source: websites
---
::

::apa-reference
---
title: The International Obfuscated C Code Contest
url: https://www.ioccc.org/
retrievedDate: 2024, March 25
source: websites
---
::
<!-- prettier-ignore-end -->
