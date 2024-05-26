---
title: Zod를 사용한 데이터 검증
description: Zod를 사용한 클라이언트 측 데이터 검증 목록
topic: JavaScript
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - validation
  - typescript
updatedAt: 2024-05-25T07:17:04.813Z
createdAt: 2023-01-12T15:27:38.762Z
---

Zod는 입력 유효성 검사를 위한 TypeScript 라이브러리입니다. TypeScript는 컴파일 타임에 JavaScript 개발을 위한 타입 안전성을 보장하는 데 있어 심오한 작업을 수행했습니다. Zod는 브라우저에서 양식 유효성 검사와 같은 런타임 유효성 검사를 제공하여 TypeScript를 보완합니다.

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

## 기본 사용법

아래 샘플은 `UserSchema`라는 Zod 객체 스키마에 대해 `user` 객체를 구문 분석하려고 시도합니다. 유효성 검사가 성공하면 개체 자체를 반환하고 그렇지 않으면 오류가 발생합니다.

```ts
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
})

const user = { id: 1, username: 0, email: 'abcd' }

console.log(UserSchema.parse(user))
```

### 스키마 추론

Zod의 스키마는 타입 추론에도 사용할 수 있으며 이는 코드 재사용에 매우 유용합니다.

```ts
const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
})

type User = z.infer<typeof UserSchema>

const user: User = {
  id: 123,
  username: 'Jason',
  email: 'json@gmail.com',
}

console.log(UserSchema.parse(user)) // `user` 개체 똑같은
```

## 안전한 구문 분석

유효성 검사가 실패할 때 오류를 발생시키는 대신 유효성 검사 상태를 나타내는 `success` 속성을 사용하여 결과를 개체로 래핑합니다. `error` 속성은 유효성 검사가 실패한 경우에만 액세스할 수 있는 반면, `data` 속성은 유효성 검사를 통과한 경우에만 사용할 수 있습니다.

```ts
const result = UserSchema.parse(user)

if (!result.success) {
  console.log(result.error)
} else {
  console.log(result.data as User)
}
```

## 기본 타입

기본 타입에는 `z.object`, `z.string`, `z.number`, `z.date` 및 `z.boolean`이 포함됩니다.

```ts
const UserSchema = z.object({
  username: z.string(),
  age: z.number(),
  birthday: z.date(),
  isProgrammer: z.boolean(),
})
```

## 특별한 타입

JavaScript에서 잘못된 값을 처리하는 추가 타입입니다.

```ts
z.object({
  undefined_type: z.undefined(),
  null_type: z.null(),
  void_type: z.void(),
  any_type: z.any(),
  unknown_type: z.unknown(), // `any`와 동일하게 사용할 수 있습니다
  never_type: z.never(), // 객체에 이 '키'가 없어야 합니다. 그렇지 않으면 실패합니다.
})
```

## 수정자

필드의 요구 사항을 수정하거나 구체화하기 위해 타입 정의 뒤에 연결되는 추가 논리입니다.

```ts
z.object({
  optional: z.string().optional(),
  nullable: z.string().nullable(), // 'null'일 수 있으며 이는 'optional'과 다릅니다.
  nullish: z.string().nullish(), // 'null' 또는 'undefined'일 수 있습니다.
  default: z.string().default('안녕'),
  randomNum: z.number().default(Math.random),
})
```

### 문자열 수정자

```ts
const UserSchema = z.object({
  username: z.string().min(3).max(10), // 문자열 크기
  email: z.string().email(),
  url: z.string().url(),
})
```

> 문자열 수정자 [더 보기](https://zod.dev/?id=strings)

### 숫자 수정자

```ts
const UserSchema = z.object({
  age: z.number().gt(0),
})
```

> 숫자 수정자 [더 보기](https://zod.dev/?id=numbers)

## 리터럴 타입

정확히 일치하는 특정 값입니다.

```ts
z.literal('sashimi')
z.literal(true)
```

> 리터럴 타입 [더 보기](https://zod.dev/?id=literals)

## 변형 목록

Zod Enum을 사용하면 기본적으로 TypeScript 공용체 타입으로 변환됩니다.

```ts
z.enum(['Programming', 'Guitar'])
```

배열이 `z.enum` 절 외부에 선언되면 배열에 `as const` 키워드를 추가해야 합니다.

```ts
const hobbies = ['Programming', 'Guitar'] as const
z.enum(hobbies) // 문제 없음
console.log(hobbies[0])
```

이러한 방식으로 Zod는 정확한 검증을 위해 애플리케이션 전체에서 값이 변경되지 않도록 할 수 있습니다.

Zod Enum 외에도 네이티브 TypeScript Enum도 `z.nativeEnum`으로 지원될 수 있습니다.

```ts
enum Hobbies {
  Programming,
  Guitar,
}

z.nativeEnum(Hobbies)

const ppl = {
  hobbies: Hobbies.Programming,
}
```

## 물체 타입

스키마의 모양을 얻으려면 `shape` 속성을 사용하세요. 그러면 어떤 필드가 있는지와 해당 데이터 타입이 표시됩니다.

```ts
UserSchema.shape
```

부분 수정자는 스키마 내의 각 필드를 선택 사항으로 만들어 다단계 형식에 유용합니다.

```ts
UserSchema.partial().parse(user)
```

RxJS의 `pluck`과 유사하게 `pick`은 더 큰 객체에서 지정된 키 값 쌍을 선택합니다.

```ts
UserSchema.pick({ username: true }).parse(user)
```

특정 요소를 생략하려면 `omit` 메소드를 사용하세요. 메소드 서명은 `pick`과 동일합니다.

```ts
UserSchema.omit({ username: true }).parse(user)
```

Zod는 기본적으로 얕은 검사만 수행하므로 Deep Partials를 사용하면 다른 객체에 중첩된 객체를 비교할 수 있습니다.

```ts
UserSchema.deepPartial().parse(user)
```

확장을 사용하면 추가 필드를 사용하여 원래 스키마를 새 스키마로 확장할 수 있습니다.

```ts
UserSchema.extend({ name: z.string() }).parse(user)
```

기존 스키마를 다른 스키마와 함께 새 스키마로 병합합니다.

```ts
UserSchema.merge(UserSchema2).parse(user)
```

## 존재 없는 키

기본적으로 Zod는 스키마에 정의되지 않은 모든 키 값 쌍을 생략합니다. 예를 들어, 이런 객체가 있다면,

```ts
const UserSchema = z.object({
  username: z.string().min(5).max(15),
})

const user = {
  username: 'Jason', // 스키마에 정의됨
  address: '41777 South Bound, West Virginia', // 스키마에 정의하지 않음
}
```

구문 분석 후 결과 객체에는 `address` 속성이 없습니다.

```ts
console.log(UserSchema.parse(user))
```

문서화되지 않은 필드가 최종 출력에 포함되도록 하려면 `passthrough`를 사용하세요.

```ts
const UserSchema = z
  .object({
    username: z.string().min(5).max(15),
  })
  .passthrough()
```

그렇지 않으면 원래 스키마 내에 존재하지 않는 제공된 키가 있는 경우 `strict` 모드에서 오류가 발생합니다.

```ts
const UserSchema = z
  .object({
    username: z.string().min(5).max(15),
  })
  .strict()
```

## 배열 타입

배열 타입은 `z.array`를 사용하여 선언하고 보유할 값 타입을 전달할 수 있습니다.

```ts
z.array(z.string())
```

배열에 값이 하나 이상 포함되어 있는지 확인하려면 `nonempty` 수정자를 사용하세요.

```ts
z.array(z.string()).nonempty()
```

> 배열 타입 [더 보기](https://zod.dev/?id=arrays)

## 튜플 타입

튜플 유형을 선언하려면 Zod 유형 선언 배열을 `z.tuple` 메소드에 전달하세요. 유형 선언은 수정자와 잘 연결될 수 있습니다.

```ts
z.tuple([z.number(), z.number(), z.number().gt(4).int()])
```

길이가 무한한 튜플을 선언하려면 `rest`를 사용하여 나머지 매개변수 선언에 언급되지 않은 요소의 유형을 나타낼 수 있습니다.

```ts
z.tuple([z.string(), z.date()]).rest(z.number())
```

## 유니언 타입

이거는 TypeScript같은 유니언 타입이다.

```ts
z.union([z.string(), z.number()]) // id
z.string().or(z.number()) // same
```

태그된 유니언 - 한 필드의 유형은 이전에 정의된 필드의 출력에 따라 달라집니다.

```ts
const UserSchema = z.object({
  id: z.discriminatedUnion('status', [
    z.object({ status: z.literal('success'), data: z.string() }),
    z.object({ status: z.literal('failed'), data: z.instanceof(Error) }),
  ]),
})
```

## 레코드 타입

객체에 대한 키 값 쌍 유효성 검사입니다. 아래 예에서는 문자열 유형이어야 하는 객체의 '키'만 유효성을 검사합니다.

```ts
const UserMap = z.record(z.string()) // 키 만

const usermp = {
  abc: 'abc',
  def: 'def',
}
```

`z.record` 메소드에 두 개의 Zod 타입을 제공하여 객체의 키와 값 쌍을 모두 검증하는 것이 가능합니다.

```ts
const UserMap = z.record(z.string(), z.number()) // 키과 값
```

## 맵 타입

이는 위의 `record` 유형과 매우 유사하지만 실제 JavaScript `Map` 유형 자체에 맞게 조정되었습니다.

```ts
const UserMap = z.map(z.string(), z.object({ name: z.string() }))

const users = new Map([
  ['id-jogn', { name: 'Jphn' }],
  ['id-kye', { name: 'Kyle' }],
])
```

## 셋 타입

```ts
const UserMap = z.set(z.number())

const a = new Set([1, 1, 1, 2])

console.log(UserMap.parse(a)) // [1, 2]
```

## 프로미스 타입

```ts
const PromiseSchema = z.promise(z.string())

const p = Promise.resolve('ahaha') // 2단계 검증

console.log(PromiseSchema.parse(p))
```

## 메시지 수정

유효성 검사에 실패했을 때 표시되는 오류 메시지를 조작하는 등 낮은 수준의 액세스 권한을 부여합니다.

```ts
const brandEmail = z
  .string()
  .email()
  .refine((val) => val.endsWith('@email.com'), {
    message: '이메일은 @email.com으로 끝나야 합니다.',
  })

const email = 'email.com'
console.log(brandEmail.parse(email))
```

> 사용자 정의를 위해 매우 낮은 수준의 액세스 권한을 제공하는 `superRefine`이라는 방법도 있습니다.

## 오류

오류 메시지는 대상 절에 두 번째 인수로 제공하여 사용자 정의할 수 있습니다.

```ts
z.string().min(3, '3자 이상이어야 됩니다.')
```

그 외에도 모든 복잡한 오류 메시지를 사람이 더 읽기 쉬운 방식으로 변환하는 Zod에서 제공하는 유효성 검사 오류 패키지가 있습니다.

```
npm i zod-validation-error
```

```ts
import { fromZodError } from 'zod-validation-error'

if (!results.success) {
  console.log(fromZodError(results.error))
}
```

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Cook, K # Kyle Cook
title: Learn Zod In 30 Minutes
url: https://www.youtube.com/watch?v=L6BE-U3oy80
source: websites
date: 2022, December 18
---
::

::apa-reference
---
title: Introduction
url: https://zod.dev/?id=introduction
source: websites
retrievedDate: 2024, March 25
publisher: Zod
---
::
<!-- prettier-ignore-end -->
