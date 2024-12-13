---
title: 룬 알고리즘
topic: 암호화
description: C# 구현을 위한 간단한 단계별 가이드
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - encoding
  - hash
  - algorithm
updatedAt: 2024-12-12T11:35:01.046Z
createdAt: 2024-12-12T11:35:01.046Z
---

룬 알고리즘(Luhn algorithm), "모듈러스 10(modulus 10, mod 10)"으로도 알려져 있으며 금융 회사 및 정부와 같은 다양한 산업에서 널리 사용되는 체크섬 공식입니다.

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

## 작동 원리

룬 알고리즘은 몇 가지 간단한 단계로 나눌 수 있습니다. 신용 카드 번호 "374245455400126"이 있다고 가정해 보겠습니다.

1. 먼저 페이로드와 체크 숫자를 분리합니다. 체크 숫자는 마지막 숫자입니다. 그러면 "37424545540012"와 "6"이 나옵니다.
2. 마지막 숫자 "2"부터 시작하여 **오른쪽에서 왼쪽으로** 두 번째 숫자마다 2를 곱합니다. 그 곱셈의 결과 9보다 큰다면, 9를 뺍니다.
3. 결과 숫자를 합계에 더합니다.

$$
\begin{align}
\text{sum} &= (2 \cdot 2) + (1 \cdot 1) + (0 \cdot 2) + (0 \cdot 1) + (4 \cdot 2) + (5 \cdot 1) + ((5 \cdot 2) - 9) + (4 \cdot 1) + ((5 \cdot 2) - 9) + (4 \cdot 1) + (2 \cdot 2) + (4 \cdot 1) + ((7 \cdot 2) - 9) + (3 \cdot 1) \\
 &= 44
\end{align}
$$

4. 다음 공식으로 검사 숫자를 계산하세요.

$$
\begin{align}
\text{Check Digit} &= 10 - (\text{sum}\; mod\; 10) \\
 &= 10 - (44\; mod\; 10) \\
 &= 10 - (4) \\
 &= 6
\end{align}
$$

보시다시피, 체크 숫자는 원래 카드 번호에서 추출한 값인 6과 동일합니다. 이는 카드 번호가 유효함을 보여줍니다.

## C#으로 구현

이것은 C#에서 알고리즘을 구현한 것입니다. `parity`는 숫자를 두 배로 늘릴지 말지를 결정하는 데 사용됩니다.

```cs
public static bool ValidateLuhn(string cardNumber)
{
    int sum = 0;
    int parity = (cardNumber.Length - 1) % 2;

    // 그 `- '0'`가 char 숫자에 int 숫자로 변환
    int checkDigit = cardNumber[^1] - '0';

    for (int i = cardNumber.Length - 2; i >= 0; i--)
    {
        int digit = cardNumber[i] - '0';

        if (i % 2 == parity)
        {
            sum += digit;
        }
        else if (digit > 4)
        {
            sum += (2 * digit) - 9;
        }
        else
        {
            sum += 2 * digit;
        }
    }

    return checkDigit == 10 - (sum % 10);
}
```

위의 구현은 문자열의 모든 숫자를 더하고(여전히 두 배로 늘리는 규칙을 준수함) 10으로 나누었을 때 결과 합계가 나머지가 없는지 확인하여 더욱 단순화할 수 있습니다. 나머지가 없으면 숫자가 유효하다는 것을 의미합니다.

```cs
public static bool ValidateLuhn(string cardNumber)
{
    int sum = 0;
    int parity = cardNumber.Length % 2;

    for (int i = 0; i < cardNumber.Length; i++)
    {
        int digit = cardNumber[i] - '0';

        if (i % 2 != parity)
        {
            sum += digit;
        }
        else if (digit > 4)
        {
            sum += (2 * digit) - 9;
        }
        else
        {
            sum += 2 * digit;
        }
    }

    return sum % 10 == 0;
}
```

## 단점

룬 알고리즘은 숫자 문자열의 유효성과 오타를 구별하는 데 사용되므로 변조 방지가 되지 않습니다. 게다가 한 자릿수 오류는 잘 포착하지만 여러 자릿수 오류는 잘 포착하지 못합니다.

## 유용한 도구

- https://paymentcardtools.com/luhn-algorithm
- https://developers.bluesnap.com/reference/test-credit-cards

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: Luhn algorithm
publisher: Wikipedia
retrievedDate: 2024, December 12
url: https://en.wikipedia.org/wiki/Luhn_algorithm
source: websites
---
::

::apa-reference
---
title: Luhn algorithm
publisher: GeekForGeeks
date: 2022, July 19
url: https://www.geeksforgeeks.org/luhn-algorithm/
source: websites
---
::
<!-- prettier-ignore-end -->
