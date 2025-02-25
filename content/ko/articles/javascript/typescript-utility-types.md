---
title: TypeScript 유틸리티 타입
topic: JavaScript
description: TypeScript가 제공하는 유용한 유틸리티 타입 목록
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - typescript
  - javascript
updatedAt: 2024-05-25T12:36:55.931Z
createdAt: 2023-03-15T12:52:58.230Z
---

TypeScript의 유틸리티 타입은 새로운 유형을 빠르게 모델링하고 생성할 수 있는 도우미 유형 역할을 합니다.

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

## NonNullable

타입 선언에서 모든 nullish 유형을 제거합니다.

```ts
type MaybeString = string | null | undefined

type NonNullableString = NonNullable<MaybeString>
// is equivalent to
type NonNullableString = string
```

## 객체 타입

### Required 및 Partial

`Required` 도우미는 기본 타입의 모든 필드를 필요에 따라 변환하고 유형 내에 존재하는 선택적 마커(`?`)를 제거하는 새로운 유형을 만듭니다.

반면 '부분'은 새로운 타입의 동일한 필드를 생성하지만 모든 필드에 선택적 마커가 적용됩니다.

```ts
type User = {
  id: string
  name: string
  age?: number
}

type RequiredUser = Required<User>
// 똑같은
type RequiredUser = {
  id: string
  name: string
  age: number
}

type PartialUser = Partial<User>
// 똑같은
type PartialUser = {
  id?: string
  name?: string
  age?: number
}
```

### Omit 및 Pick

`Omit`은 지정된 필드를 무시하는 반면 '선택'은 새 타입을 생성하는 동안 지정된 필드만 선택합니다.

```ts
type User = {
  id: string
  name: string
  age?: number
}

// 필드 1개 생략
type OmittedUser = Omit<User, 'id'>
type OmittedUser = {
  name: string
  age?: number
}

// 필드 몇개 생략
type OmittedUser2 = Omit<User, 'id' | 'name'>
type OmittedUser2 = {
  age?: number
}
```

타입에서 특정 키 세트를 선택하는 것이 처음부터 완전히 새로운 유형을 만드는 것만큼 좋다고 주장할 수도 있지만 `Pick`에는 특정한 이점이 있습니다. `Pick`을 사용하는 가장 강력한 이유는 가독성입니다.

설명된 대로 `User`라는 타입이 있지만 훨씬 더 많은 필드가 있다고 상상해 보세요. 로그인 페이지에서는 `id`와 `password` 필드가 필요할 수 있으며 여기에서 `Pick`이 유용합니다.

```ts
// 필드 1개 선택
type PickedUser = Pick<User, 'id'>
type PickedUser = {
  id: string
}

// 필드 몇개 선택
type PickedUser2 = Pick<User, 'id' | 'name'>
type PickedUser2 = {
  id: string
  name: string
}
```

### 레코드 타입

`Record` 타입을 사용하면 키의 유형과 객체(또는 사전)의 값을 지정할 수 있습니다.

```ts
type MyDictionary = Record<number, string>

// 똑같은

type MyDictionary = {
  [key: number]: string
}
```

### 읽이 전용

`Readonly`는 `readonly` 키워드로 타입의 모든 필드를 표시하므로 모든 필드는 생성 후 변경할 수 없습니다.

```ts
type User = {
  id: string
  name: string
  age?: number
}

type ReadonlyUser = Readonly<User>
type ReadonlyUser = {
  readonly id: string
  readonly name: string
  readonly age?: number
}
```

### 변경 필드

TypeScript에는 `Readonly`와 반대되는 `Mutable` 유틸리티 타입이 없지만 쉽게 직접 만들 수 있습니다.

```ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}
```

`-readonly`는 기본적으로 키 값 쌍을 반복하면서 타입에서 읽기 전용 키워드를 제거합니다.

```ts
type MutableUser = Mutable<ReadonlyUser>
type MutableUser = {
  id: string
  name: string
  age?: number
}
```

## 유니언 타입

### Exclude

`Exclude`는 `Omit`과 거의 동일한 작업을 수행하지만 공용체 타입을 사용합니다.

```ts
type Role = 'admin' | 'user' | 'anonymous'

type AnonymousRole = Exclude<Role, 'user' | 'admin'>
type AnonymousRole = 'anonymous'
```

### Extract

`Extract`는 해당 키와 구별된 공용체에 존재하는 타입 정보 조각을 선별하는 데 사용됩니다.

```ts
type RoleAttributes =
  | { role: 'admin'; orgId: string }
  | { role: 'user'; name: string }
  | { role: 'anonymous' }

type UserRole = Extract<
  RoleAttributes,
  {
    role: 'user'
  }
>
```

## 함수

이러한 유틸리티 타입은 해당 함수에 대한 충분한 선언 유형이 없는 라이브러리를 처리할 때 매우 유용합니다.

### ReturnType

`ReturnType`은 함수 자체의 반환 타입을 추출하므로 설명이 필요 없습니다.

```ts
type Func = (a: number, b: string) => string

type FuncReturnValue = ReturnType<Func>
type FuncReturnValue = string
```

### Parameters

`Parameters`는 네임드 튜플(또는 배열) 형식으로 함수 타입의 매개변수를 추출합니다.

```ts
type FuncParams = Parameters<Func>
type FuncParams = [a: number, b: string]
```

위치별로 매개변수를 추출하려면 간단히 명명된 튜플의 색인을 기준으로 개별 항목을 색인화하면 됩니다.

```ts
type FirstFuncParam = Parameters<Func>[0]
type FirstFuncParam = number
```

## 프로미스

### Promise

Promise 타입의 객체를 정의합니다.

```ts
type PromiseNumber = Promise<number>
```

### Awaited

반면에 `Awaited`는 `Promise` 타입의 기본 유형을 래핑 해제합니다.

```ts
type Result = Awaited<PromiseNumber>
type Result = number
```

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: TypeScript Utility Types
url: https://www.w3schools.com/typescript/typescript_utility_types.php
publisher: W3schools
retrievedDate: 2024, March 24
source: websites
---
::

::apa-reference
---
title: Utility Types
url: https://www.typescriptlang.org/docs/handbook/utility-types.html
publisher: TypeScript
retrievedDate: 2024, March 24
source: websites
---
::

::apa-reference
---
authors:
 - Pocock, M # Matt Pocock
title: "Blazing Fast Tips: TypeScript Utility Types"
url: https://www.youtube.com/watch?v=EU0TB_8KHpY
date: 2023, January 17
source: websites
---
::
<!-- prettier-ignore-end -->
