---
title: 바이트 순서 표시
topic: 일반
description: 유니코드 인코딩에 사용되는 보이지 않는 정보
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - bytes
  - concepts
  - encoding
updatedAt: 2024-08-25T10:36:05.680Z
createdAt: 2024-08-25T10:36:05.680Z
---

바이트 순서 마크(BOM)는 텍스트 파일이나 스트림 인코딩에 사용되는 특수 마커입니다. 유니코드에서는 U+FEFF로 표현됩니다. 파일이나 스트림의 원래 내용에 추가된 임의의 텍스트로 생각할 수 있습니다.

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

## 예시

예를 들어, 다음과 같은 원시 내용이 담긴 텍스트 파일이 있다고 가정합니다.

```
Roses are red, violets are blue.
```

바이트 순서 표시가 있는 콘텐츠는 다음과 같습니다.

```
0xFEFFRoses are red, violets are blue.
```

물론, "Roses are red, violets are blue."라는 텍스트도 디스크에 저장될 때 바이트로 변환됩니다. 우리가 사용하는 소프트웨어가 이미 우리를 위해 장면 뒤에서 변환을 했기 때문에 우리는 내용을 올바르게 볼 수 있습니다.

## 사용법

이는 소프트웨어가 **바이트 순서** 및 **인코딩**과 관련하여 파일 내용을 해석할 때 힌트 역할을 합니다.

### 바이트 순서

바이트 순서(Endianness라고도 함)는 바이트가 저장되는 순서입니다. 예를 들어,

- **빅 엔디안(BE)**: 가장 중요한 바이트가 먼저 저장됩니다.
- **리틀 엔디안(LE)**: 가장 중요하지 않은 바이트가 먼저 저장됩니다.

저는 이미 [엔디안](/articles/general/endianness)에 대해 설명하는 글을 썼습니다. 관심이 있다면 계속 읽어보세어.

### 문자 인코딩

바이트 순서를 나타내는 지표일 뿐만 아니라, UTF-8, UTF-16, UTF-32 등 파일의 인코딩 형식을 결정하는 데에도 사용됩니다.

일반적인 BOM 값은 다음과 같습니다.

- UTF-8: EF BB BF(필수 아닙)
- UTF-16(빅 엔디안): FE FF(필수)
- UTF-16(리틀 엔디안): FF FE(필수)
- UTF-32(빅 엔디안): 00 00 FE FF(필수)
- UTF-32(리틀 엔디안): FF FE 00 00(필수)

UTF-16 및 UTF-32의 BOM은 엔디안이 중요하기 때문에 **필수**입니다.

## 파이썬 예시

### 문자열을 16진수로 변환

파이썬으로 문자열을 16진수로 변환 할 수 있습니다.

```python
char = 'h'

char.encode('utf-8') # b'h'
char.encode('utf-16') # b'\xff\xfeh\x00'
char.encode('utf-32') # b'\xff\xfe\x00\x00h\x00\x00\x00'
```

인코딩에서 리틀 엔디안이나 빅 엔디안을 지정하면 BOM이 표시되지 않습니다.

```python
char.encode('utf-16le') # b'h\x00'
char.encode('utf-16be') # b'\x00h'
```

### BOM 검사

인코딩 유틸리티는 `codecs` 모퓰에서 찾을 수 있습니다.

```python
import codecs

print(codecs.BOM) # b'\xff\xfe'
```

### 인코딩을 사용하여 파일에 쓰기

다음 코드는 지정된 인코딩으로 파일에 콘텐츠를 씁니다. 여기에는 UTF-16 및 UTF-32 인코딩에 대한 BOM이 포함됩니다.

```python
char = 'h'

with open('file.json', 'w', encoding='utf-16') as f:
	f.write(char)
```

## Hexdump

Hexdump를 사용하면 파일에 BOM이 포함되어 있는지 검사할 수 있습니다.

다음 명령을 `hd` 유틸리티 프로그램 포함 있는 패키지를 설치 하세요.
Install the utilities package that comes with `hd` program.

```
sudo apt install bsdmainutils
```

다음으로, `hd` 명령을 사용하여 파일에 바이트 순서 표시가 포함되어 있는지 검사할 수 있습니다. 이것은 위의 Python 명령에서 이전에 생성된 `file.json`입니다.

```
hd -c file.json
```

이 명령 실행한 후에는 헥스 덤프와 함께 파일의 내용을 인쇄합니다.

```
00000000  ff fe 03 26                                       |...&|
0000000 377 376 003   &
0000004
```

바이트 순서 표시는 앞의 `ff fe` 비트로 표시된 대로 발견됩니다. 따라서 Python에서 `utf-16` 인코딩은 파일에 쓸 때 BOM을 추가할 것이라고 추론할 수 있습니다.

## 문제

- **호환성**: 일부 소프트웨어는 BOM을 올바르게 처리하지 못할 수 있습니다. 특히 BOM이 필수가 아니고 실제 콘텐츠로 처리될 수 있는 UTF-8 인코딩 파일에서 그렇습니다.

- **이식성**: BOM이 포함된 파일은 앞서 언급한 호환성 문제로 인해 다른 시스템이나 환경에서 이식할 수 없습니다.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
publisher: Wikipedia
title: Byte Order Mark
url: https://en.wikipedia.org/wiki/Byte_order_mark
retrievedDate: 2024, August 25
source: websites
---
::

::apa-reference
---
authors:
 - Sottile, A # Anthony Sottile
title: "what is a BOM (byte-order-marker) (intermediate) anthony explains"
url: https://www.youtube.com/watch?v=OrtNMystCgM
date: 2023, November 1
source: websites
---
::

::apa-reference
---
organization: Unicode, Inc
title: "UTF-8, UTF-16, UTF-32 & BOM"
url: https://unicode.org/faq/utf_bom.html
retrievedDate: 2024, August 25
source: websites
---
::
<!-- prettier-ignore-end -->
