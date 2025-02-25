---
title: 엔디언
topic: 일반
description: 컴퓨팅에서의 빅엔디언과 리틀엔디언에 대한 간략한 설명 드릴게요
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - bytes
  - concepts
  - encoding
updatedAt: 2024-06-20T14:35:20.945Z
createdAt: 2024-06-20T14:35:20.945Z
---

조나단 스위프트(Jonathan Swift)의 고전 소설 걸리버 여행기(1726)에는 달걀을 넓은 쪽 끝으로 깨뜨릴 것인지, 좁은 쪽 끝으로 깨뜨릴 것인지에 관해 두 집단 사이에 어리석은 논쟁이 벌어지고 있습니다. 이 두 그룹의 사람들을 각각 빅엔디언과 리틀엔디언이라고 합니다.

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

## 컴퓨팅

오늘날의 컴퓨팅 환경에서 엔디언은 데이터 조각의 바이트 순서를 나타냅니다. 빅엔디언은 바이트 시퀀스에서 가장 중요한 값을 가장 낮은 저장 주소에 먼저 배치하는 순서입니다. 빅엔디언 데이터는 바이트가 왼쪽에서 오른쪽으로 배치되므로 사람이 읽기가 더 쉽습니다.

반면 리틀 엔디언은 하위 저장 주소에 가장 중요하지 않은 값을 먼저 배치합니다. 리틀 엔디언 데이터는 사람이 읽기에는 직관적이지 않지만 컴퓨터가 계산을 수행하기가 더 쉽기 때문에 효율성이 향상됩니다.

## 비유와 예

다음은 빅 엔디언과 리틀 엔디언을 모두 표현하기 위해 영어 문장을 사용한 조잡하고 간단한 비유입니다.

| 체재        | 문장                  |
| ----------- | --------------------- |
| 빅 엔디언   | I am going to the gym |
| 리틀 엔디언 | gym the to going am I |

눈을 가늘게 뜨면 기본적으로 리틀 엔디언 문장을 오른쪽에서 왼쪽으로 읽는 것입니다.

현실적인 예는 16진수 표현입니다.

| 체재        | $4660_{10}$을 나타내는 16진수 | 완전한 표현 |
| ----------- | ----------------------------- | ----------- |
| 빅 엔디언   | 0x1234                        | 0x12340000  |
| 리틀 엔디언 | 0x3412                        | 0x00003412  |

이 [온라인 변환기를](https://www.scadacore.com/tools/programming-calculators/online-hex-converter/) 사용하면 16진수 문자열에서 다양한 엔디언을 시각화할 수 있습니다.

## 리틀 엔디언의 장점

1. 증분 처리
2. 캐스팅은 연산이 없습니다
3. 구버전과 호환된다
4. 메모리가 제한된 장치에 이상적입니다
5. 더하기, 빼기와 같은 더 빠른 산술 연산

![추가 과정](/images/endianness/addition-process.png)

위의 숫자에 1을 더하는 과정은 최하위 바이트가 메모리 주소의 시작 부분에 있기 때문에 리틀 엔디언에서는 쉽습니다. 빅엔디언의 경우 추가를 수행하기 전에 오른쪽의 최하위 바이트에 대한 포인터로 순회해야 합니다.

## 기타

이것은 우리 컴퓨터가 빅엔디언인지 알아내는 C++의 함수입니다. JVM은 내부적으로 빅엔디언을 사용하고 있습니다.

```cpp
bool is_big_endian(void)
{
    union {
        uint32_t i;
        char c[4];
    } bint = {0x01020304};

    return bint.c[0] == 1;
}
```

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: Endianness
publisher: Wikipedia
retrievedDate: 2024, June 20
url: https://en.wikipedia.org/wiki/Endianness
source: websites
---
::

::apa-reference
---
authors:
 - epcdiy
title: "50 年前的巧妙设计，依然广泛应用在现代手机电脑上"
publisher: YouTube
date: 2024, January 14
url: https://www.youtube.com/watch?v=Sw3XiCvej0U
source: websites
---
::

::apa-reference
---
authors:
 - Parr, K # Kealan Parr
title: "What is Endianness? Big-Endian vs Little-Endian Explained with Examples"
publisher: freeCodeCamp
date: 2021, February 1
url: https://www.freecodecamp.org/news/what-is-endianness-big-endian-vs-little-endian/
source: websites
---
::

::apa-reference
---
authors:
 - Murzea, R. # Radu Murzea
 - Cracker
title: "What is the advantage of little endian format?"
retrievedDate: 2024, June 20
url: https://softwareengineering.stackexchange.com/questions/95556/what-is-the-advantage-of-little-endian-format
source: websites
---
::

::apa-reference
---
authors:
 - Mortensen, P. # Peter Mortensen
 - Jay, T
title: Detecting endianness programmatically in a C++ program
retrievedDate: 2024, June 20
url: https://stackoverflow.com/questions/1001307/detecting-endianness-programmatically-in-a-c-program
source: websites
---
::

<!-- prettier-ignore-end -->
