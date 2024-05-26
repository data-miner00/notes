---
title: RxJS
description: 유용한 RxJs 연산자 목록
topic: JavaScript
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - reactive
  - rxjs
  - cheatsheet
updatedAt: 2024-05-25T12:13:30.565Z
createdAt: 2022-11-18T11:37:49.432Z
---

RxJS는 JavaScript의 [ReactiveX](https://reactivex.io/) 구현입니다. ReactiveX는 관찰 가능한 스트림을 사용한 비동기 프로그래밍을 위한 API입니다. Java용 [RxJava](https://github.com/ReactiveX/RxJava), Java용 [Rx.NET](https://github.com/dotnet/reactive) 등 다른 언어로 ReactiveX를 구현하는 방법이 더 많이 있습니다. C#, Swift용 [RxSwift](https://github.com/ReactiveX/RxSwift) 등.

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

데이터 스트림에는 데이터베이스 이벤트, DOM 이벤트 및 파일 업로드가 포함됩니다.

## 설치

RxJS는 시중에 나와 있는 노드 패키지 관리자를 사용하여 설치할 수 있으며 여기서는 [Yarn](https://yarnpkg.com)을 사용하여 데모를 진행합니다. 또한 엄격한 유형 지정을 통해 코드를 더욱 강력하고 읽기 쉽게 만들 수 있으므로 TypeScript를 사용하는 것이 좋습니다.

```
yarn add rxjs
yarn add -D typescript ts-loader
```

[Webpack](https://webpack.js.org/) 또는 기타 JavaScript 번들러를 사용하는 경우 번들러가 적절하게 실행되도록 구성하고 `package.json` 파일에 시작 스크립트가 있는지 확인하세요.

```json[package.json]
{
	"scripts": {
		"start": "webpack-dev-server --mode development"
	}
}
```

## Angular

[Angular](https://angular.io/)는 Google에서 개발한 JavaScript 프레임워크입니다. RxJS는 기본적으로 Angular에 구워져 있으므로 처음부터 사용할 수 있으므로 별도로 설치할 필요가 없습니다. 작업할 새 프로젝트를 만드는 데 필요한 것은 [Angular CLI](https://angular.io/cli)뿐입니다.

```
ng new <your-project-name>
```

종속성이 설치된 후 프로젝트를 시작하십시오.

## 옵저버블

구독할 수 있는 데이터 조각을 둘러싼 래퍼입니다. 그러면 데이터 자체에 변경 사항이 있을 때 해당 데이터의 구독자에게 알림이 전송됩니다.

Observable은 말 그대로 "관찰할 수 있는 것"을 의미합니다. 데이터 파이프라고도 생각할 수 있습니다.

Observable을 생성하는 다음 코드는 데모 목적으로만 사용됩니다. Observable은 RxJS 라이브러리 자체에서 제공하는 일부 연산자를 통해서만 유용한 방식으로 생성될 수 있습니다.

이 코드는 구독 시 `hello` 텍스트를 보내는 Observable을 생성합니다.

```ts
import { Observable } from 'rxjs'

var observable = Observable.create((observer) => {
  observer.next('hello')
  observer.next('hello')
})
```

관찰자를 구독하려면 `subscribe` 메소드를 사용하고 하나의 필수 콜백과 두 개의 선택적 콜백을 인수로 받습니다.

```ts
var observer = observable.subscribe(
  (x) => console.log('onSuccess: ', x),
  (err) => console.error('onError', err),
  () => console.log('onComplete')
)
```

구독은 Observable을 활성화하고 `onSuccess: hello` 두 줄이 브라우저 개발 도구에 나타나야 합니다.

관찰자가 `완료`로 표시되면 비활성화되고 더 이상 데이터를 보낼 수 없습니다.

```ts
var observable = Observable.create((observer) => {
  observer.next('hey')
  observer.next('hey')
  observer.complete()
  observer.next('hey') // 전송되지 않음
})
```

### 옵저버블 만들기

위에서 언급했듯이 Observable은 RxJS가 공식적으로 승인한 방식으로 생성되어야 합니다. Observable을 생성하는 몇 가지 방법은 다음과 같습니다.

```ts
import { Observable, of, from, interval, fromEvent } from 'rxjs'
```

Observable 내부에 원시 값을 래핑하려면 `of`를 사용할 수 있습니다. 이는 한 번 래핑된 값만 내보내므로 소프트웨어 테스트에 유용합니다. 그러나 `of`가 프로덕션 코드에서도 유용할 수 있는 경우가 있습니다.

```ts
const hello$ = of('hello')

hello$.subscribe((x) => console.log(x)) // hello
```

다음으로 `from` 연산자는 반복 가능한 항목을 가져와 하나씩 내보냅니다.

```ts
const hello$ = from('hello')

hello$.subscribe((x) => console.log(x)) // h, e, l, l, o
```

다음으로 `fromEvent` 연산자는 DOM의 이벤트를 관찰 가능 항목으로 구성하는 데 유용합니다. 'fromEvent'는 DOM 요소를 첫 번째 매개변수로, 수신할 이벤트를 두 번째 매개변수로 사용합니다.

```ts
const event$ = fromEvent(document, 'click')
event$.subscribe((x) => console.log(x))
```

또 다른 관찰자 생성 방법은 'interval'로, 밀리초 단위의 시간 간격을 취하고 0부터 시작하여 1씩 정수를 지속적으로 증가시킵니다.

```ts
const periodic$ = interval(1000)

// 5초가 지났다
periodic$.subscribe((x) => console.log(x)) // 0, 1, 2, 3, 4
```

### 동기식 및 비동기식

RxJS는 동기식과 비동기식이 모두 가능합니다.

```ts
const hello$ = of('hello')
hello$.subscribe((x) => console.log(x))
console.log('world')
```

위의 코드는 메인 스레드 내에서 코드가 위에서 아래로 모두 동기적으로 실행되기 때문에 `hello`를 먼저 생성한 다음 `world`의 결과를 생성합니다.

비동기식으로 만들려면 `asyncScheduler`를 사용할 수 있습니다.

```ts
import { asyncScheduler } from 'rxjs'

const hello$ = of('hello', asyncScheduler)
hello$.subscribe((x) => console.log(x))
console.log('world')
```

구독은 비동기 이벤트 루프의 두 번째 반복에서만 발생하는 반면 `world`를 인쇄하는 줄은 첫 번째 이벤트 루프에서 이미 완료되었기 때문에 출력은 `world` 뒤에 `hello`입니다.

### 뜨겁고 차가운 옵저버블

데이터가 Observable 자체에 의해 생성되면 이를 콜드 Observable이라고 부릅니다. 데이터가 Observable 외부에서 생성되면 이를 핫 Observable이라고 부릅니다. Hot Observable은 여러 구독을 가질 수 있는 반면 Cold Observable은 구독을 하나만 가질 수 있습니다. 콜드 Observable에 대한 구독이 두 개 이상인 경우 얻은 데이터가 다를 수 있습니다.

Cold Observable은 게으르다. 구독하기 전까지는 값을 생성하지 않습니다. 다음은 Cold Observable의 예입니다.

```ts
const cold$ = Observable.create((observer) => observer.next(Math.random()))

cold$.subscribe(console.log) // 0.5
cold$.subscribe(console.log) // 0.89
```

그러나 이는 실제 시나리오에서는 유용하지 않을 수 있으며 데이터가 일관되기를 원합니다. 이를 달성하려면 차가운 Observable을 Hot Observable로 변환해야 합니다.

첫 번째 방법은 데이터 생성을 관찰 가능 외부로 이동하는 것입니다.

```ts
const random = Math.random()

const hot$ = Observable.create((observer) => observer.next(random))

hot$.subscribe(console.log) // 0.5
hot$.subscribe(console.log) // 값이 없음
```

두 번째 구독자는 첫 번째 관찰자가 구독할 때 데이터가 이미 방출되었기 때문에 아무 값도 받지 못합니다.

Cold Observable을 Hot Observable로 변환하는 다른 방법은 `share` 연산자를 사용하는 것입니다.

```ts
const cold$ = Observable.create((observer) => observer.next(Math.random()))

const hot$ = cold$.pipe(share())

hot$.subscribe(console.log) // 0.5
hot$.subscribe(console.log) // 값이 없음
```

두 번째 구독자가 마지막으로 내보낸 값을 수신하도록 하려면 `share` 연산자를 대체하여 `shareReplay`를 사용할 수 있습니다.

```ts
const cold$ = Observable.create((observer) => observer.next(Math.random()))

const hot$ = cold$.pipe(shareReplay())

hot$.subscribe(console.log) // 0.5
hot$.subscribe(console.log) // 0.5
```

## Subject

Subject는 생성 후 프로그래밍 방식으로 값을 푸시할 수 있는 다른 유형의 관찰 가능 항목입니다.

```ts
import { Subject } from 'rxjs'

var subject = new Subject()
subject.subscribe(console.log)
subject.next('The first thing has been sent')

var observer = subject.subscribe(console.log)
subject.next('The second thing has been sent')
observer.unsubscribe()
subject.next('The third thing has been sent')
```

### Behaviour Subject

Behaviour subject는 신규 구독 시 마지막으로 캐시된 값을 내보냅니다.

```ts
var subject = new BehaviorSubject('First')

subject.subscribe((data) => addItem('observer 1 ', data))
```

### Replay Subject

Behaviour Subject를 사용하면 늦게 온 사람은 마지막으로 방출된 아이템만 받을 수 있습니다. 하지만 Replay Subject를 이용하면 후발주자도 구독 시 $n$ 상당의 데이터를 받을 수 있습니다.

```ts
var subject = new ReplaySubject(3)

subject.next(1)
subject.next(2)
subject.subscribe(console.log) // 1, 2
subject.next(3) // 3
subject.next(4) // 4
subject.subscribe(console.log) // 2, 3, 4
```

### Async Subject

가장 간단한 주제입니다. 완료 시 마지막 값만 내보냅니다.

```ts
var subject = new AsyncSubject()

subject.next(1)
subject.subscribe(console.log)
subject.complete() // 1
```

## 연산자

- 정적 연산자: 이 연산자는 일반적으로 관찰 가능 항목을 만드는 데 사용됩니다.
- 인스턴스 연산자: 관찰 가능한 인스턴스에 대한 이러한 메서드(대부분의 RxJS)

### 수정자 연산자

이러한 연산자는 기존 값을 변환하고 데이터 흐름을 수정합니다.

```ts
import { map, filter, take, scan } from 'rxjs/operators'

const source$ = from([1, 2, 3, 4, 5])
const modified$ = source$.pipe(
  map((x) => x + 1), // 2, 3, 4, 5, 6
  scan((acc, val) => acc + val), // 2, 5, 9, 14, 20
  filter((x) => x > 10), // 14, 20
  take(1) // 14
)
```

### Pluck

객체 배열에서 특정 키만 선택하기 위한 `map`용 합성 설탕입니다.

```ts
const list$ = of([
  {
    name: 'Shino',
    age: 20,
    address: 'Tokyo',
  },
  {
    name: 'Anthony',
    age: 21,
    address: 'Berkeley',
  },
])

const names$ = list$.pipe(pluck('name'))

names$.subscribe(console.log) // 'Shino', 'Anthony'
```

### Tap

이 연산자를 사용하면 파이프 내에서 부작용이 트리거될 수 있습니다.

```ts
source$.pipe(
  tap(console.log),
  map((x) => x.toUpperCase()),
  tap(async (x) => {
    await Promise.resolve()
    alert(x)
  })
)
```

### 배압 처리

배압은 실제로 필요한 것보다 **압도적으로 많은 양**의 값을 방출하는 관찰 가능 항목입니다. 마우스 움직임에 의해 트리거되는 DOM 이벤트의 유입이 그 전형이 될 것입니다.

이를 처리하는 첫 번째 전략은 이벤트를 디바운싱하는 것입니다. Debounce는 일정 기간 동안 작업이 중지될 때까지 이벤트를 생성하지 않으며 이는 사용자가 입력 필드를 채울 때 자동 완성에 유용할 수 있으며 유효성 검사는 입력을 완료한 후에만 트리거됩니다.

```ts
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

const event$ = fromEvent(document, 'mousemove')

const debounced$ = event$.pipe(debounceTime(1000))
debounced$.subscribe(console.log)
```

지정된 시간 간격에 따라 이벤트 수가 크게 줄어들기 때문에 이벤트를 조절하는 것도 유용할 수 있습니다. 조절은 속도 제한으로 생각할 수 있습니다.

```ts
import { throttleTime } from 'rxjs/operators'

const event$ = fromEvent(document, 'mousemove')

const throttled$ = event$.pipe(throttleTime(1000))
throttled$.subscribe(console.log)
```

반면에 버퍼 수는 모든 이벤트를 배열로 유지하고 버퍼 용량에 도달하면 모든 이벤트를 한 번에 내보냅니다.

```ts
import { bufferCount } from 'rxjs/operators'

const event$ = fromEvent(document, 'mousemove')

const buffered$ = event$.pipe(bufferCount(10))
buffered$.subscribe(console.log)
```

### Switch Map

Switch Map을 사용하면 두 개의 관계형 관찰 가능 항목이 데이터 가져오기를 위해 상호 운용될 수 있습니다.

```ts
const user$ = of({ uid: Math.random() })
const fetchOrders$ = (userId: number) => of(`${userId}'s order data'`)
```

먼저 주문 데이터를 가져오기 전에 사용자 ID가 필요합니다. 이를 수행하는 직관적인 방법은 구독을 중첩하는 것입니다.

```ts
user$.subscribe({ uid } => {
	fetchOrders$(uid).subscribe(console.log)
})
```

관계형 호출을 수행하는 더 좋은 방법은 스위치 맵을 사용하는 것입니다.

```ts
const orders$ = user$.pipe(switchMap((user) => fetchOrders$(user.uid)))

orders$.subscribe(console.log)
```

### 조합 연산자

Observable을 결합하는 방법에는 여러 가지가 있습니다. **최신 버전 결합**은 Observable 배열을 가져오고 각 독립 Observable의 모든 값이 해당 값을 확인하기를 기다리고 모든 값만 배열로 함께 내보냅니다.

```ts
import { combineLatest } from 'rxjs'
import { delay } from 'rxjs/operators'

const randSync$ = Observable.create((o) => o.next(Math.random()))
const randAsync$ = randSync$.pipe(delay(1000))

const combined$ = combineLatest([randSync$, randAsync$])

combined$.subscribe(console.log) // [0.5, 0.8]
```

**병합** 반면에 두 개의 Observable을 하나로 융합하여 일반적인 Observable을 생성합니다.

```ts
import { merge } from 'rxjs'
import { delay } from 'rxjs/operators'

const randSync$ = Observable.create((o) => o.next(Math.random()))
const randAsync$ = randSync$.pipe(delay(1000))

const merged$ = merge([randSync$, randAsync$])

merged$.subscribe(console.log) // 0.5, 0.8
```

**Skip Until**을 사용하면 두 번째 Observable이 값을 방출할 때까지 소스 Observable을 무시할 수 있습니다.

```ts
var skipped$ = observable1$.skipUntil(observable2$)
```

### 오류 처리

파이프 내부에서 관찰 가능한 항목에 대해 오류 처리를 수행할 수 있습니다. 재시도 메커니즘은 `retry` 연산자를 사용하여 구현할 수도 있습니다.

```ts
import { catchError, retry } from 'rxjs/operators'

someObservable$.pipe(
  catchError((err) => of('default value')),
  retry(2)
)
```

## 메모리 누수

장기 실행 Observable을 구독 취소하는 것을 잊지 마세요.

```ts
const source$ = interval(100)

const subscription = source.subscribe((x) => {
  console.log(x)
  if (x > 10) {
    subscription.unsubscribe()
  }
})
```

이를 처리하는 더 좋은 방법은 조건이 더 이상 충족되지 않을 때 값 방출을 중지하는 `takeWhile`을 사용하는 것입니다.

```ts
source$.pipe(takeWhile((x) => x <= 10))
```

대신 다른 Observable에 의존하여 값 방출을 중지하려면 다른 Observable이 값을 방출하면 현재 Observable에 대한 구독이 자동으로 취소되므로 `takeUntil`을 사용할 수 있습니다.

```ts
source$.pipe(takeUntil(of('something')))
```

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: ReactiveX
url: https://reactivex.io/
retrievedDate: 2024, March 24
source: websites
---
::

::apa-reference
---
title: RxJS
url: https://rxjs.dev/ 
retrievedDate: 2024, March 24
source: websites
---
::

::apa-reference
---
title: RxJS Primer
url: https://www.learnrxjs.io/learn-rxjs/concepts/rxjs-primer
retrievedDate: 2024, March 24
source: websites
---
::

::apa-reference
---
title: RxJS Overview
url: https://rxjs-dev.firebaseapp.com/guide/overview
retrievedDate: 2024, March 24
source: websites
---
::

::apa-reference
---
authors:
 - Gruijs, L # Luuk Gruijs
title: Understanding hot vs cold Observables
url: https://luukgruijs.medium.com/understanding-hot-vs-cold-observables-62d04cf92e03
date: 2018, October 18
source: websites
---
::

::apa-reference
---
authors:
 - Delaney, J # Jeff Delaney
title: RxJS Top Ten - Code This, Not That
date: 2019, March 26
url: https://www.youtube.com/watch?v=ewcoEYS85Co
source: websites
---
::
<!-- prettier-ignore-end -->
