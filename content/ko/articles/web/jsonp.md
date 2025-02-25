---
title: JSONP
topic: 웹
description: 동일 출처 정책을 우회하는 데 사용되는 레거시 데이터 가져오기 기술에 대한 간략한 소개
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - javascript
  - json
  - cors
  - legacy
updatedAt: 2024-03-24T13:17:10.163Z
createdAt: 2023-10-25T13:47:56.869Z
---

JSONP는 JSON with Padding이라고도 알려져 있으며 CORS(Cross-Origin Resource Sharing) 정책에 의해 가로채지 않고 데이터를 요청하는 기술입니다. 기본적으로 이 방법을 사용하면 브라우저에서 시행하는 CORS 검사를 우회할 수 있습니다. 내 경험에 따르면 많은 중국 웹사이트에서는 여전히 이 기술을 사용하여 데이터를 가져옵니다.

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

## 시나리오

웹 애플리케이션이 `www.a.com`에 호스팅되어 있고 JavaScript 코드 중 하나가 `www.b.com`에 호스팅된 원격 서버에서 데이터를 가져오려고 한다고 가정해 보겠습니다. 원격 서버가 `*` 또는 `www.a.com`으로 설정된 `Access-Control-Allow-Origin` 헤더를 사용하여 쿼리에 응답하지 않으면 브라우저는 응답을 수신하고 해석할 때 오류를 발생시키고 거부합니다. 요청한 데이터.

## 해법

### 옵션 1: CORS 구성

문제를 해결하는 가장 안전하고 일반적인 방법은 'Access-Control-Allow-Origin' 헤더가 적절한 도메인을 가리키도록 설정하여 백엔드 서버에서 CORS를 올바르게 구성하는 것입니다. 리소스가 Azure, GCP 또는 AWS와 같은 클라우드에서 호스팅되는 경우 CORS를 활성화하는 설정도 있을 것입니다.

### 옵션 2: JSONP 사용

JSONP에는 수신된 응답을 활용하기 위해 따라야 하는 특정 규칙 세트가 있습니다.

## 포맷

다음은 `https://a.com/sample.json`에 원시 JSON 형식의 예제 데이터입니다.

```json
{
  "name": "Jane",
  "age": 14,
  "school": "Stanford High School"
}
```

다음은 URL `https://a.com/sample?callback=callback`에 있는 JSONP 형식의 데이터입니다.

```js
callback({
  name: 'Jane',
  age: 14,
  school: 'Stanford High School',
})
```

본질적으로 이는 요청된 데이터에 대한 JavaScript 함수 호출일 뿐이며 함수 이름은 '콜백' 쿼리 매개변수로 수정될 수 있습니다. 콜백 함수는 우리가 "패딩(Padding)"이라고 부르는 것입니다. 예를 들어 `https://a.com/sample?callback=cb`를 호출하면 반환된 데이터는 `cb` 함수로 묶입니다.

```js
cb({
  name: 'Jane',
  age: 14,
  school: 'Stanford High School',
})
```

주목해야 할 한 가지 중요한 주의 사항은 제공된 콜백 함수 이름이 무엇이든 제공된 데이터를 의미 있게 사용하려면 함수가 존재해야 한다는 것입니다. 그렇지 않으면 오류가 발생합니다.

```
Uncaught ReferenceError: <method> is not defined
```

## 용법

요청된 데이터를 사용하려면 쿼리 매개변수에 제공된 동일한 이름으로 JavaScript 콜백 함수를 정의하고 JSONP 데이터가 로드되기 전에 함수가 정의되었는지 확인하세요.

```js
function callback(data) {
  // 데이터를 처리
  console.log(data)
}
```

## HTML로 쇼케이스

HTML에서는 다음과 같이 표시됩니다.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>JSONP Showcase</title>
  </head>
  <body>
    <script type="text/javascript">
      function myFunction(data) {
        console.log(data)
      }
    </script>

    <!-- 일반 JavaScript처럼 스크립트 태그를 사용하여 JSONP 데이터 가져오기 -->
    <script
      type="text/javascript"
      src="https://a.com/mydata?callback=myFunction"
    ></script>
  </body>
</html>
```

## 캐시 해제

JSONP 호출은 `<script src="https://constant-static-url">`이 상수인 경우 최적화를 위해 브라우저에 의해 캐싱됩니다. 브라우저가 오래된 데이터를 캐싱하는 것을 방지하려면 `Math.random`을 사용하여 콜백 함수 이름을 동적으로 생성해야 합니다.

```js
window.onload = function () {
  var randomNum = Math.floor(100_000 * Math.random())
  var functionName = 'cb_' + randomNum

  window[functionName] = function (data) {
    console.log(data)
  }

  // 스크립트 태그를 동적으로 생성해야 합니다.
  var newScriptTag = document.createElement('script')
  newScriptTag.src = 'https://a.com/mydata?callback=' + functionName

  document.body.appendChild(newScriptTag)
}
```

이 접근 방식을 사용하면 브라우저는 대부분의 경우 최신 데이터를 요청합니다.

### 청소

브라우저에서 이미 데이터를 사용하고 있으므로 동적으로 생성된 스크립트 태그를 선택적으로 제거할 수 있습니다.

```js
window.onload = function () {
  var randomNum = Math.floor(100_000 * Math.random())
  var functionName = 'cb_' + randomNum

  window[functionName] = function (data) {
    console.log(data)
  }

  // 스크립트 태그를 동적으로 생성해야 합니다.
  var newScriptTag = document.createElement('script')
  newScriptTag.id = 'script_' + functionName
  newScriptTag.src = 'https://a.com/mydata?callback=' + functionName

  document.body.appendChild(newScriptTag)
  document.getElementById(newScriptTag.id).remove()
}
```

정리를 통해 JSONP 호출이 원활하게 표시됩니다.

## 장점과 단점

### 장점

- 크로스 도메인 요청: CORS 정책에 의해 시행되는 경계를 벗어날 수 있습니다.
- 사용하기 쉬움: 복잡한 설정 코드 없이 HTML에서 `<script>` 태그를 사용하기만 하면 됩니다.
- 뛰어난 브라우저 호환성: 단순한 JavaScript 함수 호출이기 때문에 모든 브라우저에서 지원합니다.

### 단점

- 보안위험 : 취약한 특성으로 인해 악성코드에 의해 악용될 수 있습니다.
- 오류 처리 없음: 오류가 발생한 경우. 함수가 정의되지 않았거나 서버가 응답하지 않는 경우 해당 오류를 콘솔에 표시하는 것 외에는 오류를 처리할 수 있는 방법이 없습니다.
- 서버에 따라 다름: 서버가 JSONP 엔드포인트를 제공하지 않으면 JSONP를 사용할 방법이 없습니다.
- GET 요청만 지원: JSONP 요청은 `<script>` 태그만 사용한다는 것을 이미 알고 있으므로 GET 이외의 다른 HTTP 메서드를 지원할 방법은 없습니다.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: JSONP
publisher: Wikipedia
url: https://en.wikipedia.org/wiki/JSONP
retrievedDate: 2024, March 24
source: websites
---
::

::apa-reference
---
authors:
 - Maccana, M. # mikemaccana
 - Cheeso
title: What is JSONP, and why was it created?
url: https://stackoverflow.com/questions/2067472/what-is-jsonp-and-why-was-it-created 
date: 2019, February 27
source: websites
---
::

::apa-reference
---
authors:
 - Cieślar, M # Maciej Cieślar
title: "JSONP demystified: What it is and why it exists" 
url: https://blog.logrocket.com/jsonp-demystified-what-it-is-and-why-it-exists/
date: 2019, November 21
source: websites
publisher: LogRocket
---
::

::apa-reference
---
authors:
 - Vinod
title: Understanding JSONP
url: https://www.youtube.com/watch?v=3AoeiQa8mY8
date: 2015, April 2
source: websites
---
<!-- prettier-ignore-end -->
