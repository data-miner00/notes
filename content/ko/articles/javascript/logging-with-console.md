---
title: Console로 로깅
description: '`console.log` 외에 더 유용한 콘솔 방법이 있습니다'
topic: JavaScript
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - javascript
  - logging
  - debugging
updatedAt: 2024-05-25T07:39:32.119Z
createdAt: 2022-08-12T17:38:48.848Z
---

Javascript 개발자가 자신의 코드를 디버깅하려고 할 때 사실상의 방법은 간단하고 요점이 명확하기 때문에 `console.log()`를 사용하는 것입니다. 전달된 모든 내용을 인쇄합니다. `console.log()`를 통해 변수의 상태(숫자 유형, 객체 유형 또는 정의되지 않음)를 식별할 수 있습니다.

<!--more-->

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 부인 성명
---
한국어 실력이 부적하여 이 기사는 구글 번역기를 주로 활용했기 때문에 부정확한 문법과 어휘가 있을수 있습니다. 이 점 양해 부탁드리며, 추후에 다시 검토하여 수정하도록 하겠습니다.
::
<!-- prettier-ignore-end -->

그 후 개발자들은 `console.log`를 사용한 현재 디버깅 기술에 안주하고 다른 믿을 수 없을 만큼 유용한 `콘솔` 방법의 존재에 대해 완전히 무지할 것입니다.

## 디버깅

디버깅에도 `console.assert`, `console.table`, `console.groupCollapsed`, `console.dir`, `console.trace` 및 `console.count`를 사용할 수 있습니다.

### Assert

전달된 식이 진실인지 확인하는 메서드는 그렇지 않으면 두 번째 매개변수로 제공된 오류 메시지를 로그아웃합니다.

```js
console.assert(1 === 1, '1은 1과 같지 않습니다.')
```

### Table

배열, 객체 및 다차원 배열을 포함하여 표로 만들 수 있는 모든 데이터를 표시하는 방법입니다.

```js
var people = [
  ['John', 'Smith'],
  ['Jane', 'Doe'],
  ['Emily', 'Jones'],
]
console.table(people)
```

출력 테이블은 다음과 같습니다.

| 색인 | 0         | 1         |
| ---- | --------- | --------- |
| 0    | `"John"`  | `"Smith"` |
| 1    | `"Jane"`  | `"Doe"`   |
| 2    | `"Emily"` | `"Jones"` |

### Group Collapsed

그룹 축소는 `console.groupEnd`가 호출될 때까지 후속 콘솔 호출을 상위 항목 아래에 그룹화하여 콘솔에서 구조화된 콘솔 로깅 섹션을 시작하는 방법입니다.

```js
console.groupCollapsed('Mysterious Errors')
console.log("Console.log won't work")
console.log('Mom pls help')
console.groupEnd()
```

로그는 아코디언으로 잘 그룹화되어 기본 세부 정보를 확장하거나 축소합니다.

![Console의 그룹화 문](/images/console/groups.png)

하위 그룹을 생성하여 그룹을 중첩할 수도 있습니다. 이에 따라 `groupEnd()`를 호출하여 그룹을 종료해야 합니다.

```js
console.group('Parent Group')
console.log('Parent log - 1')
console.group('Child Group')
console.log('Child log - 1')
console.log('Child log - 2')
console.groupEnd()
console.groupEnd()
```

![중첩된 그룹 문](/images/console/nested-groups.png)

### Dir

기록 시 객체 유형에 대한 가독성이 향상됩니다. html 요소(`document.querySelector` 또는 유사한 메소드 포함)가 전달되면 JSON 정보를 출력합니다.

![Console에 dir 메소드 사용](/images/console/dir.png)

### Trace

스택 추적을 콘솔에 인쇄합니다. 중첩된 함수의 호출을 추적하는 데 유용합니다.

### Count

호출될 때마다 기록하고 1씩 증가하는 카운터입니다. 한 번만 실행된다고 가정하는 코드에서 여러 개의 중복된 호출을 감지하는 데 유용합니다. 매개변수에 전달된 문자열로 레이블이 지정될 수 있습니다.

```js
console.count() // 1
console.count() // 2

// 라벨이 붙은 개수
console.count('myLabel') // 1

// 초기화
console.countReset() // `default` 라벨이 초기화
console.countReset('myLabel') // `myLabel` 라벨이 초기화
```

### Level

로그의 의도나 긴급성을 구별하는 데 사용할 수 있는 수준을 로그에 제공합니다.

```js
// 파란색 배경으로
console.info('This is debug message')

// 노란색 배경으로
console.warn('This is warning message')

// 빨간색 배경으로
console.error('This is error message')

// 추적 가능한 메시지
console.debug('This is debug message')
```

|     | Level | 설명                                                     |
| --- | ----- | -------------------------------------------------------- |
| 1.  | Info  | 서비스 시작/중지, 기능 호출 등과 같은 일반 메시지입니다. |
| 2.  | Warn  | 인수 누락과 같은 잠재적인 중단 동작.                     |
| 3.  | Error | 치명적이며 작업을 계속하는 데 방해가 되는 모든 행위.     |
| 4.  | Debug | 디버깅에 도움이 되는 진단 정보 제공                      |

## 벤치마킹

### Timer

함수 호출이나 기능의 전체 실행 시간을 벤치마킹하기 위해 `time` 함수를 사용하면 호출될 때 타이머를 시작할 수 있습니다. 코드 중간 어딘가에서 `console.timeLog()`를 사용하여 타이머가 시작된 이후 경과된 시간을 확인할 수 있습니다. 타이머를 재설정하려면 `console.timeEnd()`를 호출하여 타이머를 종료해야 합니다.

```js
// starting the timer
console.time()

// execute some codes

// log time elapsed in the middle of code execution
console.timeLog()

// end timer
console.timeEnd()
```

[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/console/time)에는 Timer에 대한 더 보기.

### 프로파일러

`console.profile`은 Google Chrome 브라우저에서 사용할 수 있는 JavaScript 프로파일러 도구를 사용하여 코드 실행 성능을 프로파일링하는 데 사용됩니다.

```js
function shortFunction() {
  let number = 1
  number++
  console.log(number)
}

function longFunction() {
  for (let i = 0; i < 100000; i++);
}

console.profile('Profiler')
shortFunction()
console.timeStamp('Profiler')
longFunction()
console.profileEnd('Profiler')
```

위의 코드는 `Profiler`라는 프로파일링 활동을 등록하고 DevTools의 JavaScript Profiler에서 검사할 수 있습니다.

![JavaScript 프로파일러](/images/console/javascript-profiler.png)

## 요약

위에서 언급한 방법을 요약하면 다음과 같습니다.

| 메소드                                                                                     | 설명                                                 | 용법                                             |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------ |
| [Assert](https://developer.mozilla.org/en-US/docs/Web/API/console/assert)                  | 전달된 표현식이 "진실"인지 확인                      | `console.assert(1 === 1, "1 is not equal to 1")` |
| [Table](https://developer.mozilla.org/en-US/docs/Web/API/console/table)                    | 표 형식의 데이터를 표로 표시합니다.                  | `console.table(array1)`                          |
| [Group Collapsed](https://developer.mozilla.org/en-US/docs/Web/API/console/groupCollapsed) | `Console` 명령을 수집하는 축소된 그룹을 만듭니다.    | `console.groupCollapsed('XHR Related Errors')`   |
| [Dir](https://developer.mozilla.org/en-US/docs/Web/API/console/dir)                        | 객체의 모든 속성을 기록합니다.                       | `console.dir(object)`                            |
| [Trace](https://developer.mozilla.org/en-US/docs/Web/API/console/trace)                    | 전체 호출 스택에 대한 추적                           | `console.trace()`                                |
| [Count](https://developer.mozilla.org/en-US/docs/Web/API/console/count)                    | 호출될 때마다 지정된 레이블의 카운터를 증가시킵니다. | `console.count(label)`                           |
| Time                                                                                       | 타이머 시작                                          | `console.time()`                                 |
| Profiler                                                                                   | Chrome에서 프로파일링 세션 시작                      | `console.profile(label)`                         |

## 스타일링

여기 `console.log` 매니아를 위한 전문가 팁이 있습니다. 브라우저(Node.js 아님)의 로깅은 다양한 CSS 스타일로 향상되어 로그가 기본 로그보다 훨씬 더 좋아 보이도록 만들 수 있습니다. 그렇게 하려면 `%c`에 공백을 추가하고 그 뒤에 기록할 콘텐츠를 추가하고 그 뒤에 CSS 관련 스타일 **문자열**을 추가하고 스타일 사이를 세미콜론으로 구분합니다.

```js
console.log(
  '%c Gradient in DevTools',
  'font-size: bold; background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%); color: white; padding: 3px 7px; border-radius: 5px;'
)
```

다음과 같은 멋진 콘솔이 생성됩니다.

![콘솔의 다채로운 로그 샘플](/images/console/gradient.png)

하나의 로그에 여러 가지 다른 스타일을 제공하려면 `%c` 문자를 더 많이 지정하면 됩니다. 이는 본질적으로 스타일이 시작되는 **어디**를 나타냅니다. 인터프리터가 하나의 단일 로그에서 두 번째 `%c`를 발견하면 처음 적용된 스타일이 거기서 **중지**되고 제공된 두 번째 스타일 문자열을 사용하여 다음 스타일을 지정하기 시작합니다.

다음 예에서는 위에서 논의한 내용을 보여줍니다.

```js
console.log(
  `%c Notice: %c The value for ${type} does not exist`,
  'color: white; background: #00d1b2; font-weight: bold; border-radius: 2px; ',
  'color: #00947e; background: #ebfffc;'
)
```

위의 로그는 첫 번째 매개변수로 기록할 문자열을 사용하고 이어서 두 개의 스타일 문자열을 사용합니다. 호출되면 다음을 생성합니다.

![내 개인 프로젝트의 다채로운 로그](/images/console/project-example.png)

이것은 `console.log`를 과도하게 엔지니어링하여 내 프로젝트 중 하나에서 했던 것처럼 매력적으로 만드는 방법입니다.
