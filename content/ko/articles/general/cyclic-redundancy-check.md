---
title: 순환 중복 검사
topic: 일반
description: 간단하면서도 유용한 오류 감지 방법으로 데이터 무결성 보장
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - algorithm
  - hash
  - error
updatedAt: 2024-09-14T00:19:05.225Z
createdAt: 2024-09-14T00:19:05.225Z
---

순환 중복 검사(CRC)는 디지털 통신 및 저장 시스템에서 오류를 감지하는 데 사용되는 알고리즘입니다. CRC는 체크섬이 생성되는 길이를 결정하는 다양한 비트 크기와 함께 제공됩니다. 일반적으로 사용되는 CRC는 8비트, 16비트, 32비트 및 64비트입니다.

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

## 계산법

### 이진으로 변환

문자열이든 JPG 파일이든 데이터가 있으면 이를 각각 이진 표현으로 변환해야 합니다.

```
"hello world" ---> 01101000 01100101 ...
Image.jpg     ---> 01101100 01100100 ...
```

### 제수 (除數) 선택

송신자와 수신자 모두는 제수(생성자 다항식)에 대해 상호 합의해야 합니다. 체크섬 크기에 대한 최상의 제수를 선택하려면 [최상의 CRC 다항식](https://users.ece.cmu.edu/%7Ekoopman/crc/)을 참조하세요.

예를 들어, `101101` (6비트)이 나누는 수로 선택되면 수학적 표현은 다음과 같습니다.

$$
\begin{align}
G(x) &= 1 \cdot x^5 + 0 \cdot x^4 + 1 \cdot x^3 + 1 \cdot x^2 + 0 \cdot x^1 + 1 \cdot x^0 \\
 &= x^5 + x^3 + x^2 + 1
\end{align}
$$

`10011000` (8비트)에 대한 또 다른 예는 다음과 같습니다.

$$
\begin{align}
G(x) &= 1 \cdot x^7 + 0 \cdot x^6 + 0 \cdot x^5 + 1 \cdot x^4 + 1 \cdot x^3 + 0 \cdot x^2 + 0 \cdot x^1 + 0 \cdot x^0 \\
 &= x^7 + x^4 + x^3
\end{align}
$$

CRC 32비트의 경우 나누는 차수는 최대 31입니다.

$$
G(x) = x^{31} + x^{30} + \cdots + x^1 + 1
$$

### 분할 수행

나누기는 이진 형태와 수학적 형태로 모두 수행할 수 있습니다. 나누기 단계를 보여주는 [유튜브 튜토리얼](https://www.youtube.com/watch?v=A9g6rTMblz4)이 있습니다.

나누기에서 몫과 나머지를 얻습니다. 나머지는 체크섬이며 항상 나누는 수보다 1비트 작습니다.

### 나머지를 데이터에 추가

마지막 단계는 나머지(체크섬)를 원본 데이터에 추가하는 것입니다.

예를 들어,

```
    1001 (데이터) ++ 101 (체크섬) --> 1001101 (최후의 데이터)
```

수신 측에서는 체크섬을 사용하여 데이터를 정확하게 해석하고 그 이후로 검증을 수행합니다.

## 용법

### 프레임 검사 순서

TCP와 같은 전송 프로토콜에서 프레임 검사 시퀀스는 수신자 측에서 오류 감지를 위해 헤더에 추가된 데이터입니다. 이 경우 아래에 표시된 CRC32 검사 합계입니다.

![MAC 헤더](/images/cyclic-redundancy-check/MAC-header-format.png)

<!-- Retrieved from: https://www.researchgate.net/publication/312261643_Pre-Emptive_Traffic_Management_for_a_Cluster-Based_TDMA_System_in_Vehicular_Communications -->
<!-- TODO: Display reference/credit to this figure -->

### 파일 무결성 검증

CRC 체크섬은 인터넷에서 파일을 다운로드할 때에도 가끔 제공되어, 파일을 성공적으로 다운로드한 후 파일의 무결성을 확인할 수 있습니다.

### 파일 압축

파일 압축 알고리즘은 압축 후 CRC 체크섬을 비교하여 파일 무결성을 확인하기 위해 CRC 체크섬을 사용합니다

## 제한 사항

CRC는 매우 유용한 체크섬 알고리즘이기는 하지만, 일부 경우에는 적합하지 않게 만드는 본질적인 약점을 가지고 있습니다.

1. **보안**: CRC는 비암호화 해시 함수이므로 보안이 최우선순위일 때 적합하지 않습니다. 의도적인 변조에 강하지 않습니다. Anderson Dadario의 이 놀라운 [블로그 게시물](https://dadario.com.br/cryptographic-and-non-cryptographic-hash-functions/)에서 암호화 해시 함수와 비암호화 해시 함수에 대해 자세히 알아보세요.

2. **충돌**: 체크섬은 알고리즘에 의해 계산된 나머지일 뿐이므로 충돌 가능성은 매우 낮지만 존재합니다.

3. **오류 감지 기능**: 단일 비트 오류 감지에는 좋지만, 특히 위에 언급한 알고리즘의 충돌 특성으로 인해 대용량 데이터 세트의 경우 다중 비트 오류는 감지하기 어렵습니다.

## 코드 예시

### C#

C#에서 Crc32는 [System.IO.Hashing](https://learn.microsoft.com/en-us/dotnet/api/system.io.hashing?view=net-8.0) 네임스페이스에서 찾을 수 있으며, 이는 [nuget.org](https://www.nuget.org/packages/System.IO.Hashing/)에서 별도로 설치해야 합니다.

```cs [Program.cs]
using System.Text;
using System.IO.Hashing;

const string originalString = "hello world";
var encodedString = Encoding.UTF8.GetBytes(originalString);
var checksum = Crc32.Hash(encodedString);

Console.WriteLine(BitConverter.ToInt32(checksum)); // 222957957
```

### Python

CRC32 해싱 유틸리티는 내장된 `zlib` 압축 라이브러리에서 찾을 수 있습니다.

```python
import zlib

data = b'hello world'
checksum = zlib.crc32(data)

print(checksum) # 222957957
```

## 유용한 도구

- [CRC-32 Checksum Calculator (Hash Generator)](https://crc32.online/)
- [String to Binary Converter](https://www.rapidtables.com/convert/number/string-to-binary.html)

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: Cyclic redundancy check
url: https://en.wikipedia.org/wiki/Cyclic_redundancy_check
retrievedDate: 2024, September 14
source: websites
publisher: Wikipedia
---
::

::apa-reference
---
title: Understanding CRC32
url: https://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art008
retrievedDate: 2024, September 14
source: websites
authors:
 - Davies, J # Joshua Davies
publisher: Commandlinefanatic.com
---
::

::apa-reference
---
title: Cyclic Redundancy Check
url: https://asecuritysite.com/comms/crc_div
date: "2024"
source: websites
authors:
 - Buchanan, William J
publisher: Asecuritysite.com
---
::

::apa-reference
---
title: "Cyclic Redundancy Check (CRC) - Part 1"
url: https://www.youtube.com/watch?v=A9g6rTMblz4
date: 2023, March 27
source: websites
authors:
 - Neso Academy
publisher: YouTube
---
::

::apa-reference
---
title: "Best CRC Polynomials"
url: https://users.ece.cmu.edu/%7Ekoopman/crc/
retrievedDate: 2024, September 14
source: websites
authors:
 - Koopman, P # Philip Koopman
---
::
<!-- prettier-ignore-end -->
