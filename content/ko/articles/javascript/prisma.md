---
title: Prisma
description: Node.js용으로 널리 사용되는 TypeScript ORM
topic: JavaScript
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - typescript
  - prisma
  - orm
  - sql
updatedAt: 2024-05-25T10:06:40.621Z
createdAt: 2022-10-15T12:01:41.858Z
---

Prisma는 Node.js 및 Typescript용 ORM 레이어입니다. Prisma는 주로 관계형 데이터베이스에 사용되지만 MongoDb와 같은 no-SQL 데이터베이스는 추가 구성을 통해 계속 사용할 수 있습니다.

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

Prisma에는 다음과 같은 3가지 구성 요소가 있습니다.

- **Prisma Client**: Node.js 및 TypeScript용으로 생성된 유형 안전 쿼리 빌더입니다.
- **Prisma Migrate**: 지원되는 데이터베이스의 마이그레이션 시스템입니다.
- **Prisma Studio**: 데이터베이스 내부의 데이터를 보고 편집하는 GUI 도구입니다.

## 텍스트 에디터

우선, 대부분의 코딩 작업에 적극 권장되는 텍스트 편집기는 물론 [Visual Studio Code](https://code.visualstudio.com/)입니다. 여기에는 구문 강조, 자동 서식 지정 등을 제공하기 위해 설치할 수 있는 [Prisma 확장](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)이 있습니다. 또한 개발을 빠르고 즐겁게 만들어주는 유용한 코드 자동 완성 기능을 제공하여 개발에 힘을 실어줍니다.

## 프로젝트 초기화

시작하려면 빈 Node.js 프로젝트를 만들어야 합니다.

```
npm init -y
```

다음으로 Prisma를 설치하고 선택 사항이지만 그 위에 Prisma가 작성되어 있으므로 Typescript도 함께 설치하는 것이 좋습니다.

```
npm install -D prisma typescript ts-node @types/node nodemon
```

종속성이 설치되면 이제 아래 명령을 실행하여 프로젝트 내에서 Prisma 초기화를 진행할 수 있습니다.

```
npx prisma init
```

다음과 같이 실행 출력과 함께 `prisma` 폴더 내에 추가된 `schema.prisma`라는 파일이 있습니다.

```
✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started
```

축하합니다. Prisma가 성공적으로 초기화되었으며 진행할 준비가 되었습니다.

## Prisma 스키마

`schema.prisma` 파일 내부의 모습은 다음과 같습니다.

```prisma[schema.prisma]
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

이 스키마 파일 내에서 _세가지_ 항목을 구성할 수 있습니다.

- **데이터 소스**: 데이터베이스에 대한 연결 문자열을 지정합니다(환경 변수를 통해).
- **생성기**: 생성하려는 클라이언트를 지정합니다.
- **데이터 모델**: 애플리케이션에서 사용되는 모든 모델 및 관계

### 생성기

`generator client` 내부의 콘텐츠는 사용자 지정 스키마를 읽고 이를 Visual Studio Code의 intellisense에서 힌트를 줄 수 있는 안전한 형식의 변수로 변환하는 데 사용되는 클라이언트를 지정합니다. 우리 애플리케이션 내에서 사용될 클라이언트이기도 합니다.

기본적으로 사용되는 공급자는 `prisma-client-js`이며 이 글을 쓰는 시점에는 사용 가능한 다른 유형의 클라이언트가 없습니다. [생성기](https://www.prisma.io/docs/concepts/comComponents/prisma-schema/generators)에 대해 자세히 알아보세요.

### 데이터 소스

`datasource db`는 Prisma와 함께 사용하려는 데이터베이스와 연결을 지정합니다. 초기화 중에 데이터베이스가 제공되지 않으면 PostgreSQL이 기본적으로 제공됩니다. `env` 함수는 `.env` 파일에서 `DATABASE_URL`이라는 비밀 정보를 가져옵니다. `DATABASE_URL`은 데이터베이스에 대한 연결 문자열입니다.

PostgreSQL 연결 문자열의 일반적인 형식은 다음과 같습니다.

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

> 데이터베이스에 대한 연결 문자열에 대한 `.env` 파일의 `DATABASE_URL` 값을 **바꾸십시오**.

### 모텔

모델은 데이터베이스에 저장하려는 엔터티를 설명하는 데이터 구조입니다. Prisma에서는 `model` 키워드로 정의할 수 있습니다.

```prisma[schema.prisma]
model User {
	id Int @id @default(autoincrement())
	name String
}
```

Prisma는 모든 모델이 데이터베이스의 각 항목을 고유하게 식별하는 기본 키 역할을 하는 일종의 식별자를 갖도록 요구합니다.

보시다시피 Prisma 모델 내의 필드는 이름, 데이터 유형 및 속성의 순서를 따릅니다.

```prisma
model User {
	<name> <datatype> @<attributes>
}
```

`@id` 속성은 Prisma에게 해당 필드가 기본 키이고 `@default()`가 객체 생성 시 기본값을 지정함을 알려줍니다. `autoincrement()` 함수는 각 후속 항목에서 id 값을 1씩 증가시킵니다. `uuid()`는 인덱스 필드를 초기화하는 데에도 일반적입니다. 속성에 대해서는 나중에 더 자세히 다루겠습니다.

### 데이터 타입

Prisma에는 다양한 데이터 유형이 있습니다. 여기서 데이터 유형은 다양한 데이터베이스에서 제공되는 다양한 데이터 유형을 일반화한 것입니다. 예를 들어, 여기서 `String`은 PostgreSQL에서는 `text` 데이터 유형에 매핑되지만 SQL Server에서는 `nvarchar(1000)`에 매핑됩니다. [스칼라 유형](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#model-field-scalar-types)에 대해 자세히 알아보세요.

- `Int`: 정수형
- `String`: 모든 종류의 텍스트를 처리하는 유형
- `부울`: 참 또는 거짓
- `BigInt`: 매우 큰 정수
- `Float`: 단순 부동 소수점
- `Decimal`: 정확한 부동 소수점
- `DateTime`: 타임스탬프
- `Json`: JSON 형식, 모든 데이터베이스에서 지원되지는 않음
- `바이트`: 큰 덩어리를 저장하기 위한 원시 바이트 형식의 데이터
- `Unsupported("")`: 지원하지 않는 타입, 다른 db에서 prisma로 변환하는 경우에만 사용됨

### 타입 수정자

유형 수정자는 필드의 동작을 수정하는 것입니다. Prisma에는 단 2개의 수정자가 있으며 이해하기가 매우 쉽습니다.

- nullable 수정자 `?`: 필드를 nullable로 표시합니다.
- 배열 수정자 `[]`: 필드가 여러 발생을 참조할 수 있음을 나타냅니다.

### 관계

데이터베이스 엔터티가 가질 수 있는 관계에는 일대일, 일대다, 다대일, 다대다의 4가지 유형이 있습니다.

- **일대다**: `User`가 여러 `Post`를 가지려면 다음과 같이 스키마를 정의할 수 있습니다.

```prisma[schema.prisma]
model User {
	id Int
	name String
	posts Post[]
}

model Post {
	id Int
	title String
	author User @relation(fields: [authorId], references: [id])
	authorId Int
}
```

- **이중 일대다**: `사용자`는 `게시물`에 대한 다중 참조를 가질 수 있습니다. 여기에는 `writePosts`와 `favouritePosts`가 있을 수 있습니다. 여러 일대다 관계 명확화

```prisma[schema.prisma]
model User {
	id Int
	name String
	writtenPosts Post[] @relation("WrittenPosts")
	favouritePosts Post[] @relation("FavoritePosts")
}

model Post {
	id Int
	title String
	author User @relation("WrittenPosts", fields: [authorId], references: [id])
	authorId Int
	favoritedBy User? @relation("FavoritePosts", fields: [favoritedById], references: [id])
	favoritedById Int?
}
```

- **다대다**: 하나의 '게시물'은 여러 개의 '카테고리'를 가질 수 있고 하나의 '카테고리'는 여러 개의 '게시물'을 가질 수 있습니다.

```prisma[schema.prisma]
model Post {
	id Int
	title String
	categories Category[]
}

model Category {
	id Int
	name String
	posts Post[]
}
```

- **일대일**: 한 명의 `사용자`가 하나의 `UserPreference` 세트를 가집니다.

```prisma[schema.prisma]
model User {
	id Int
	name String
	preference UserPreference?
}

model UserPreference {
	id Int
	emailUpdates Boolean
	user User @relation(fields: [userId], references:[id])
	userId Int @unique
}
```

일대일 관계이기 때문에 `userId` 필드를 `@unique`로 표시해야 합니다. 고유하지 않으면 의미가 없기 때문이죠.

### 속성

속성은 필드 또는 모델 블록의 동작을 수정합니다. 속성은 별칭 기호 `@` 또는 `@@`으로 시작됩니다.

_**필드 수준 속성**_

- `@id`: 필드가 식별자임을 지정합니다.
- `@default()`: 해당 필드의 기본값을 지정합니다.
- `@default(autoincrement())`: 정수 필드를 1씩 증분 업데이트합니다.
- `@default(uuid())`: 고유하게 식별 가능한 문자열을 자동으로 생성합니다.
- `@default(now())`: 생성 시 타임스탬프를 추가하는 `DateTime` 필드와 쌍을 이룹니다.
- `@relation()`: 해당 필드와 다른 모델 간의 관계를 지정합니다.
- `@unique`: 동일한 값을 가진 항목을 시도하도록 필드를 고유하게 지정합니다.
- `@updatedAt`: 수정 시 필드를 최신 타임스탬프로 자동 업데이트하는 `DateTime` 필드와 쌍을 이룹니다.

_**블록 수준 속성**_

단일 필드 대신 전체 모델에 적용되는 속성입니다.

- `@@unique([])`: 복합 필드에 고유 제약 조건을 제공합니다.

```prisma[schema.prisma]
model User {
	id Int
	name String
	age Int

	@@unique([name, age])
}
```

- `@@index([])`: 지정된 필드에 대한 인덱스 필드를 생성하고 정렬 및 성능에 도움이 됩니다.

```prisma[schema.prisma]
model User {
	id Int
	name String
	age Int

	@@unique([name, age])
	@@index([email])
}
```

- `@@id([])`: 지정된 필드를 사용하여 복합 ID를 생성합니다.

```prisma[schema.prisma]
model User {
	// no more id field
	name String
	age Int

	@@id([name, age])
}
```

- `@@map([])`: 데이터베이스의 실제 이름에 대한 현재 모델의 매핑을 생성합니다.

```prisma[schema.prisma]
model User {
	id Int
	name String
	age Int

	@@map("my_users")
}
```

### 열거형

우리에게 익숙한 일반적인 열거형입니다. 고정된 값 집합 또는 필드가 사용할 수 있는 변형을 나타냅니다.

```prisma[schema.prisma]
enum Role {
	SUPERUSER,
	BASIC,
	READER
}
```

그 후에는 `모델` 내부에서 데이터 유형으로 쉽게 사용할 수 있습니다.

```prisma[schema.prisma]
model User {
	id Int
	name String
	role Role @default(BASIC)
}
```

## Prisma 클라이언트

Prisma 클라이언트는 VSCode에서 자동 완성 기능을 활성화하는 스키마에 정의한 사용자 정의 유형을 생성할 수 있도록 스키마 파일이 수정될 때마다 다시 생성되어야 합니다.

스키마가 확정되면 클라이언트 생성을 진행할 수 있습니다.

```
npx prisma generate
```

> 이 명령은 `schema.prisma` 파일을 변경할 때마다 실행되어야 합니다.

`package.json`에 나타나야 합니다.

```json[package.json]
"dependencies": {
    "@prisma/client": "^4.4.0"
}
```

### Create

루트에 직접 `index.ts` 파일을 만들고 다음 내용으로 채웁니다.

```ts[index.ts]
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      // populating data fields
      age: 17,
      name: 'Elrond',
      email: 'elrond@wix.com',
    },
  })
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect())
```

위의 코드는 데이터베이스 내부에 `User` 개체를 생성합니다. 로그를 추가하려면 `PrismaClient`에 인수를 제공하면 됩니다.

```ts
new PrismaClient({
  log: ['query', 'error', 'info', 'warn'],
})
```

### Nested Create

`User` 스키마 내에 사용자 정의 모델 `User Preference`가 있다고 가정해 보겠습니다.

```prisma[schema.prisma]
model User {
	id Int
	name String
	preference UserPreference
}
```

클라이언트에서 `UserPreference` 모델을 사용하여 `User` 엔터티를 모두 인스턴스화하려면 다음과 같이 할 수 있습니다.

```ts[index.ts]
await prisma.user.create({
  data: {
    // ... other fields of data
    preference: {
      create: {
        // ... data for `UserPreference`
      },
    },
  },
})
```

`create` 함수는 생성 중인 개체의 데이터를 반환합니다. 기본적으로 생성된 중첩 항목은 반환되지 않습니다. 이를 포함하려면 `include` 개체를 사용하고 포함할 개체를 `true`로 설정해야 합니다.

```ts[index.ts]
await prisma.user.create({
  data: {
    // ... 다른 데이터
    preference: {
      create: {
        // ... `UserPreference`에 대한 데이터
      },
    },
  },
  include: {
    preference: true,
  },
})
```

데이터의 일부만 가져오려면 `select` 객체를 사용하고 `true`로 원하는 필드를 지정할 수 있습니다.

```ts[index.ts]
await prisma.user.create({
  data: {
    // ... 다른 데이터
    preference: {
      create: {
        // ... `UserPreference`에 대한 데이터
      },
    },
  },
  select: {
    name: true,
  },
})
```

Select는 중첩된 개체에서도 잘 작동합니다. 중첩된 개체를 선택하고 GraphQL처럼 반환하려는 필드만 대상으로 지정할 수 있습니다.

```ts[index.ts]
await prisma.user.create({
  data: {
    // ... other fields of data
    preference: {
      create: {
        // ... data for `UserPreference`
      },
    },
  },
  select: {
    name: true,
    preference: {
      select: {
        // field: true
      },
    },
  },
})
```

> 참고: `select`와 `include`는 함께 사용할 수 없습니다. 그것은 단지 둘 중 하나입니다.

### Create Many

한 번에 하나씩 초기화하는 대신 한 번에 여러 인스턴스를 초기화합니다.

```ts[index.ts]
await prisma.user.createMany([
  // 사용자 배열
])
```

> 팁: `createMany` 내에서는 `select`를 사용할 수 없습니다.

### Find Unique

`unique`로 표시된 필드를 통해 개체의 인스턴스를 찾습니다. 예를 들어, 다음 모델이 있다고 가정하면 `findUnique`를 사용하여 `email` 또는 `ssn` 필드를 통해 객체를 찾을 수 있습니다.

```prisma[schema.prisma]
model User {
	id Int
	name String
	email String @unique
	ssn String @unique
}
```

```ts[index.ts]
const user = await prisma.user.findUnique({
  where: {
    email: 'abc@email.com',
  },
  // select? include? 는 여기에 허용됩니다
})
```

여러 필드에 걸쳐 블록 수준 고유 제약 조건이 지정되면 Prisma는 필드 이름을 변수로 구분하는 밑줄로 참조를 정의합니다.

예를 들어서

```prisma[schema.prisma]
model User {
	id Int
	name String
	age Int

	@@unique([name, age])
}
```

쿼리에 사용할 수 있는 변수로 `name_age`를 생성합니다.

```ts[index.ts]
await prisma.user.findUnique({
  where: {
    name_age: {
      name: 'Ken',
      age: 27,
    },
  },
})
```

### Find First

`findUnique`의 문제는 `name`이나 `age`를 기준으로 쿼리할 수 없다는 것입니다. 필드 중 하나만 일치하는 결과를 검색하려는 경우 대신 `findFirst`를 사용할 수 있습니다.

```ts[index.ts]
await prisma.user.findFirst({
  where: {
    name: 'Hailey',
  },
})
```

### Find Many

이름이 제안한 대로 여러 개를 찾고, 검색 기준이 배열로 충족되면 여러 결과를 반환합니다.

```ts[index.ts]
await prisma.user.findMany({
  where: {
    age: 12,
  },
})
```

`distinct` 검색 쿼리를 사용하면 제공된 필드에서 고유하게 필터링한 후 첫 번째 레코드가 반환됩니다.

```ts[index.ts]
await prisma.user.findMany({
  where: {
    name: 'Jack',
  },
  distinct: ['name', 'age'],
})
```

페이지 매김을 위해 검색 쿼리 내에서 'take' 개체를 사용할 수 있습니다. `skip` 매개변수를 제공하면 `take`를 실행하기 전에 먼저 지정된 레코드 수를 건너뜁니다.

```ts[index.ts]
await prisma.user.findMany({
  where: {
    name: 'Jack',
  },
  take: 2,
  skip: 1,
})
```

정렬하려는 필드별로 검색 결과를 정렬할 수도 있습니다.

```ts[index.ts]
await prisma.user.findMany({
  where: {
    name: 'Jack',
  },
  orderBy: {
    age: 'asc',
  },
})
```

### 고급 필터링

`where` 절을 사용하면 많은 일을 할 수 있습니다.

```json
{
  "name": { "equals": "" },
  "name": { "not": "" },
  "name": { "in": ["Nick", "Josh"] },
  "name": { "notIn": ["Nick", "Josh"] },
  "age": { "lt": 20 },
  "age": { "gt": 20 },
  "age": { "gte": 20 },
  "age": { "lte": 20 },
  "email": { "contains": "@test.com" },
  "email": { "endsWith": "@gmail.com" },
  "email": { "startsWith": "hi" }
}
```

여러 쿼리 매개변수를 연결하려면 'AND', 'OR' 및 'NOT'을 사용하여 모든 쿼리를 함께 연결할 수 있습니다.

```ts[index.ts]
await prisma.user.findMany({
  where: {
    AND: [{ name: { equals: 'Sam' } }, { age: { gte: 20 } }],
  },
})
```

### 관계 필터링

하위 개체를 기반으로 상위 개체를 검색할 수도 있습니다. `every`는 `none`과 `some`으로 대체될 수 있습니다.

```ts[index.ts]
await prisma.user.findMany({
  where: {
    // nested objects
    writtenPosts: {
      every: {
        title: 'test',
      },
    },
  },
})
```

다음을 통해 작성자가 20세인 모든 게시물을 쿼리할 수 있습니다.

```ts[index.ts]
await prisma.post.findMany({
  where: {
    author: {
      id: {
        age: 20,
      },
    },
  },
})
```

### 업데이트

데이터를 쿼리하고 이를 업데이트된 버전으로 바꿉니다. 발견된 모든 레코드를 업데이트하는 또 다른 버전은 `updateMany()`입니다.

```ts[index.ts]
await prisma.user.update({
  where: {
    email: 'Test@test.com',
  },
  data: {
    email: 'Deck@test.com',
  },
})
```

Prisma에는 정수 값 업데이트와 관련하여 몇 가지 흥미로운 기능이 있습니다. `increment`, `decrement`, `multiply`, `divide`와 같은 수학 연산을 사용하여 값을 업데이트할 수 있습니다.

```ts[index.ts]
await prisma.user.update({
  where: {
    email: 'Test@test.com',
  },
  data: {
    age: {
      increment: 1,
    },
  },
})
```

> 팁: `update*`는 고유 필드에 대해 쿼리되어야 합니다.

### Connect 메소드

Connect 메소드를 사용하면 **기존 객체**를 상위 객체에 연결할 수 있습니다.

```ts[index.ts]
await prisma.user.update({
  where: {
    id: 123,
  },
  data: {
    userPreference: {
      connect: {
        // assuming already have a userPreference obj with the id
        id: 'abc123',
      },
    },
  },
})
```

`disconnect`를 사용하여 해당 객체에 대한 기존 참조도 제거할 수 있습니다.

```ts[index.ts]
await prisma.user.update({
  where: {
    id: 123,
  },
  data: {
    userPreference: {
      disconnect: true,
    },
  },
})
```

### 삭제

`delete` 및 `deleteMany`를 사용하여 데이터를 제거합니다.

```ts[index.ts]
await prisma.user.delete({
  where: {
    id: 123,
  },
})
```

> 위험: `deleteMany` 함수에 아무것도 전달하지 않으면 전체 테이블이 제거됩니다.
