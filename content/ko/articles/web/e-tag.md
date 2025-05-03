---
title: E-Tag
topic: 웹
description: 인터넷을 통한 리소스 버전 관리 방법
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - http
  - header
  - caching
updatedAt: 2025-04-25T14:04:34.000Z
createdAt: 2024-05-13T00:32:00.000Z
---

ETag (엔터티 태그)는 리소스 버전을 식별하는 데 사용되는 HTTP 응답 허더입니다. 이는 **HTTP/1.1** 사양의 일부입니다.

ETag와 함께 원격 서버로 요청이 전송되면 서버는 ETag값을 비교하여 특정 리소스 변경 되었는지 또는 동일하게 유지되는지를 알 수 있습니다. 그 값이 같으면 서버는 요청된 콘텐츠 없이 상태 코드 304로 응답할 겁니다.

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

이러한 동작은 효율적인 캐싱과 조건부 요청을 용이하게 하여 대역폭 사용량을 중이고 웹 성능을 향상시킵니다. 또한, ETag는 대상 리소스를 업데이트하려는 여러 요청이 동시에 발생할 때 발생하는 경쟁 조건을 방지하는 데 사용할 수 있습니다. 이 현상을 "공중 충돌"이라고 합니다.

## 작동원리

1. **생성**: 서버는 먼저 사용자 객체와 같은 특정 리소스에 대한 고유 식별자를 생성합니다. 이는 일반적으로 콘텐츠의 해시 또는 지문입니다. 객체가 업데이트되면 고유 식별자도 변경됩니다.
2. **검증**: 동일한 리소스에 대한 후속 요청의 경우 클라이언트는 `If-None-Match` 헤더를 통해 ETag 값을 전송합니다.
3. **비교**: 서버는 클라이언트 ETag 값을 서버가 계산한 현재 ETag 값과 비교하여 동일한지 판단하고 비교 결과에 따라 `304 Not Modified` 또는 `200 OK`를 반환합니다.

### Node.js에 구현

다음 코드는 Express.js에서 ETag(강력)를 구현하는 방법을 보여줍니다.

```js [index.js]
app.get('/api/user/:id', (req, res) => {
	const user = getUser(req.params.id);
	const etag = '"' + hash(user) + '"';

	if (req.headers['if-none-match'] === etag) {
		return res.status(304).end();
	}

	res.set('ETag', etag);
	res.json(user);
});
```

## 강력한 E-Tag 약한 E-Tag

ETag에는 두 가지 있습니다.

- **강력한 ETags**: 동일한 리소스를 보장합니다. 즉, ETag는 리소스 자체 전체에서 파생된다는 의미입니다.

```
ETag: "abc123"
```

- **약한 ETags**: 의미적 동등성을 나타내지만 바이트 단위의 동일성은 나타내지 않으며 `W/` 접두사가 붙습니다.

```
ETag: W/"abc123"
```

<!-- prettier-ignore-start -->
::callout
---
type: info
title: 큰따옴표로 묶인 ETag
---
올바른 ETag가 큰따옴표로 묶어야 합니다.
::
<!-- prettier-ignore-end -->

다음의 `user` 리소스를 살펴보겠습니다.

```json
{
  "name": "Shaun",
  "age": 27
}
```

다음 표는 강력한 ETag와 약한 ETag를 사용하는 방법을 보여줍니다.

| 유형   | ETag를 계산하는 데 사용되는 속성 | ETag         | 설명                     |
| ------ | -------------------------------- | ------------ | ------------------------ |
| 강력한 | 모든 속성                        | `"Abc123"`   | 정확한 일치가 필요합니다 |
| 약한   | `name` 속성만                    | `W/"Abc124"` | 부분 일치는 허용됩니다   |

## E-Tag의 단점

### 로드 밸런서 충돌

![로드 밸런서 뒤에 있는 여러 서버에서 ETag 생성 충돌을 보여주는 다이어그램](/images/etag/ETagLoadBalancerConflicts.excalidraw.png)

ETag를 여러 서버 인스턴스의 역방향 프록시 역할을 하는 로드 밸런서와 함께 사용하는 경우, 리소스가 수정되지 않았더라도 개별 서버에서 전송되는 ETag가 다를 수 있습니다. 이 경우 ETag는 사실상 쓸모가 없으며 클라이언트와 서버에 오버헤드를 발생시킵니다.

이 문제를 해결하려면 웹 서버를 구성하여 결정적 ETag를 생성해야 합니다.

### 복잡한 구현

ETag를 인식하는 환경을 구현하는 것은 복잡합니다. 클라이언트는 `If-None-Match` 헤더와 함께 요청을 전송하는 로직을 가지고 있어야 하며, 서버는 해당 헤더를 처리해야 합니다.

![클라이언트와 서버의 ETag 흐름을 보여주는 다이어그램](/images/etag/ETagComplication.excalidraw.png)

### 비윤리적인 추적

[Hulu및 다른 대기업가](https://www.lexology.com/library/detail.aspx?g=cfd44331-0c27-4c37-aeb0-d31b7f7c729e) ETag를 사용하여 사용자들을 추적합니다. 사용자가 쉽게 접근하고 삭제할 수 있는 쿠키와 달리, ETag는 브라우저에서 완전히 관리됩니다. 사용자가 요청을 실행하기 전에 ETag 헤더를 수동으로 삭제할 만큼 기술에 능숙하지 않다면, 이를 우회할 방법이 사실상 없습니다.

![ETag가 추적을 어떻게 남용할 수 있는지 보여주는 다이어그램](/images/etag/ETagTracking.excalidraw.png)

이 회사는 ETag를 사용하여 사용자에게 1픽셀 이미지와 같은 요청되지 않은 리소스를 생성하고, 브라우저가 요청을 수신할 때마다 항상 304 응답을 반환하기로 결정했습니다. 이러한 동작은 사용자가 시청한 영화와 같이 브라우저에서 사용자의 활동을 추적할 수 있는 서버와의 **세션**을 기본적으로 설정합니다.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
organization: Mozilla
title: ETag
url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag
retrievedDate: 2025, April 20
source: websites
---
::

::apa-reference
---
organization: Wikipedia
title: HTTP ETag
url: https://en.wikipedia.org/wiki/HTTP_ETag
retrievedDate: 2025, April 20
source: websites
---
::

::apa-reference
---
authors:
  - Nasser, H # Hussien Nasser
title: "HTTP Caching with E-Tags - (Explained by Example)"
url: https://www.youtube.com/watch?v=TgZnpp5wJWU
date: 2018, August 20
source: websites
---
::

::apa-reference
---
publisher: Lexology
title: "Privacy suit filed over use of ETags "
url: https://www.lexology.com/library/detail.aspx?g=cfd44331-0c27-4c37-aeb0-d31b7f7c729e
date: 2011, August 19
source: websites
---
::
<!-- prettier-ignore-end -->
