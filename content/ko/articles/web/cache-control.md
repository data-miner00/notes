---
title: Cache-Control
topic: 웹
description: Cache-Control HTTP 헤더에 대한 간단한 설명
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - http
  - header
  - cache
updatedAt: 2024-06-21T23:45:58.363Z
createdAt: 2024-06-21T23:45:58.363Z
---

`cache-control` HTTP 헤더 필드는 클라이언트(예: 브라우저) 및 공유 캐시(예: 프록시, CDN)에서 특정 리소스에 대해 캐싱 메커니즘을 수행할 수 있는 방법을 지정합니다.

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

```
   클라이언트 <------ CDN <------ 서버
       ↓              ↓           ↓
  [웹 브라우저]  [공유한 캐시] [최철한 서버]
```

## 통사론

캐시 지시문의 구문은 다음과 같습니다.

1. 지시어는 대소문자를 구분하지 않지만 일부 구현에서는 **대소문자를 구분하지 않기** 때문에 소문자를 사용하는 것이 좋습니다.
2. 여러 지시문은 쉼표를 구분 기호로 사용하여 연결해야 합니다. (예: `cache-control: private, max-age=180`)
3. 지시문의 선택적 인수는 `max-age=180`과 같이 등호로 구분되어야 합니다.

## 지시문

지시문은 `cache-control` 헤더에 입력할 수 있는 유효한 값입니다.

### `max-age`

```
   클라이언트 <------ CDN <------ 서버
     max-age       max-age
```

응답의 `max-age=N`은 응답이 서버에서 생성된 후(클라이언트에서 수신되지 않음) $N$초 동안 응답이 최신 상태로 유지되고 응답 캐시가 여전히 신선한 동안 후속 요청에 사용될 수 있음을 나타냅니다. `Age` 헤더는 동일한 리소스에 대한 후속 요청을 위해 브라우저에 포함됩니다.

```
Cache-Control: max-age=604800
Age: 888
```

### `s-maxage`

```
   클라이언트 <------ CDN <------ 서버
                   s-maxage
```

`s-maxage`는 공유 캐시에서 유효성/최신성을 지정하는 데 사용됩니다. 개인 캐시에서는 무시되며 공유 캐시에 지정된 경우 `max-age` 및 `Expires` 헤더보다 우선합니다.

```
Cache-Control: s-maxage=604800
```

### `no-store`

```
   클라이언트 <------ CDN <------ 서버
       ✗             ✗
```

`no-store` 지시어가 포함된 응답은 브라우저와 공유 캐시를 포함한 어느 곳에도 저장할 수 없습니다. 최신 데이터를 얻으려면 동일한 속성에 대한 요청이 서버에 도달해야 합니다. 이는 일반적으로 인증 토큰과 같은 민감한 정보에 사용됩니다.

### `no-cache`

```
   클라이언트 <------ CDN <------ 서버
       ↓              ↓
     재검증          재검증
```

이 지시어는 캐시된 리소스를 캐시에서 검색한 후 즉시 사용해서는 안 된다는 것을 의미합니다. 사용하기 전에 먼저 서버에서 유효성을 다시 검증해야 합니다. 이는 일반적으로 캐시된 리소스의 E-Tag를 서버의 E-Tag와 비교하여 수행됩니다.

### `must-revalidate`

```
   클라이언트 <------ CDN <------ 서버
     ↓                ↓
   재검증            재검증
```

`must-revalidate`는 응답이 캐시에 저장되어 후속 요청에 재사용될 수 있음을 나타냅니다. 그러나 응답이 오래되면 사용하기 전에 원본 서버에서 유효성을 검사해야 합니다.

일반적으로 `max-age`와 함께 사용됩니다.

```
Cache-Control: max-age=604800, must-revalidate
```

### `proxy-revalidate`

```
   클라이언트 <------ CDN <------ 서버
                      ↓
                    재검증
```

`must-revalidate`와 동일한 동작이지만 공유 캐시에만 적용됩니다. 개인브라우저 캐시는 영향을 받지 않습니다.

### `private`

```
   클라이언트 <------ CDN <------ 서버
       ✓             ✗
```

`private` 응답 지시문은 응답이 클라이언트의 로컬 캐시에만 저장될 수 있고 공개적으로 공유되는 캐시에는 저장될 수 없음을 나타냅니다.

```
Cache-Control: private
```

### `public`

```
   클라이언트 <------ CDN <------ 서버
       ✓             ✓
```

`public` 응답 지시문은 응답이 로컬 캐시와 공유 캐시 모두에 저장될 수 있음을 나타냅니다.

```
Cache-Control: public
```

### `no-transform`

```
   클라이언트 <------ CDN <------ 서버
       ✗             ✗
  처리 및 변환    처리 및 변환
```

이 지시문은 이미지 크기 조정과 같은 중개자에 의한 변경이나 변형 없이 리소스가 있는 그대로 클라이언트에 제공되어야 함을 나타냅니다.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Shayan, T
title: "Cache-Control: Cheat Sheet."
date: 2024, March 14
url: https://shayy.org/posts/cache-control/
source: websites
---
::

::apa-reference
---
organization: MDN Web Docs
title: Cache-Control
retrievedDate: 2024, June 22
url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
source: websites
---
::

::apa-reference
---
organization: Cloudflare
title: "What is cache-control? | Cache explained"
retrievedDate: 2024, June 22
url: https://www.cloudflare.com/learning/cdn/glossary/what-is-cache-control/
source: websites
---
::

::apa-reference
---
authors:
 - Jxck
title: "Cache-Control: must-understand ディレクティブとは何か"
date: 2021, February 12
url: https://blog.jxck.io/entries/2021-02-12/cache-control-must-understand.html
source: websites
---
::
<!-- prettier-ignore-end -->
