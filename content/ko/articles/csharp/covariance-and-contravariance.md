---
title: 공변성 및 반변성
description: C# 예제를 통해 공변성과 반변성을 간단히 설명합니다
topic: C#
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - variance
  - interface
  - csharp
updatedAt: 2025-11-23T06:33:51.000Z
createdAt: 2022-11-09T15:06:47.818Z
---

공변성(covariance)과 반변성(contravariance)은 원래 수학·물리학에서 유래한 용어이지만, 프로그래밍에서는 주로 타입 치환(type substitution) 관계를 설명할 때 사용됩니다. 간단히 말해 공변성은 하위 타입이 상위 타입의 위치에 안전하게 들어갈 수 있는 성질을 말하고, 반변성은 그 반대 방향의 치환을 허용하는 성질을 말합니다.

<!--more-->

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 면책 조항
---
이 글은 작성자의 한국어 실력이 충분치 않아 주로 기계 번역(예: 구글 번역기)을 활용해 작성되었습니다. 그로 인해 문법이나 어휘가 부정확할 수 있습니다. 읽으시면서 어색한 부분을 발견하시면 알려주시면 감사하겠습니다. 추후 다시 검토해 수정하겠습니다.
::
<!-- prettier-ignore-end -->

프로그래밍에서는 이 개념들이 [SOLID 원칙](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/) 중 하나인 리스코프 치환 원칙(Liskov Substitution Principle)과 관련이 있습니다.

간단히 말해, 공변성은 하위 타입(subtype)이 상위 타입(supertype)의 위치에 안전하게 대체될 수 있는 성질을 말합니다. 예를 들어 고양이(Cat)를 동물(Animal)으로 취급하는 업캐스팅(upcasting)이 대표적인 사례입니다.

![간단한 계층 도표](/images/variance/hierarchy.png)

반면 반변성은 상위 타입의 참조를 하위 타입이 기대하는 위치에 사용할 수 있게 하는 성질입니다. 다운캐스팅은 항상 안전하지 않을 수 있으므로 주의해야 합니다.

## 기본 소개

`Animal`과 `Cat` 클래스를 예로 들어보겠습니다.

```cs
class Animal {
	public void Eat() => Console.WriteLine("nom, nom");
}

class Cat : Animal {
	public void Meow() => Console.WriteLine("meow");
}
```

다음과 같이 `Animal`과 `Cat`을 인스턴스화하고 참조할 수 있습니다.

```cs
Animal x = new Animal();
Animal y = new Cat();
```

`x`와 `y`는 둘 다 `Eat` 메서드를 호출할 수 있습니다. 그러나 `Meow` 메서드는 `Cat` 클래스에만 있으므로, `Animal` 타입으로 참조할 경우 `Meow`에 접근할 수 없습니다.

```cs
x.Meow(); // 컴파일 오류
y.Meow(); // 컴파일 오류
```

직접 `Cat` 타입으로 참조하는 경우에만 `Meow` 메서드에 접근할 수 있습니다.

```cs
Cat z = new Cat();
z.Meow();
```

## 제네릭

제네릭 타입의 경우, 변이(variance)는 주로 타입을 서로 대체(substitution)할 수 있는 방식과 관련있습니다.

제네릭 매개변수 `T`가 공변(out)으로 표시된 인터페이스는 주로 `T`를 반환하는(생성하는) 용도로만 사용되어야 한다는 의미입니다. C#에서는 `out` 키워드로 표시합니다.

```cs
// 공변성
interface IProducer<out T> {
	T Produce();
}
```

반대로 `in`으로 표시된 반공변(contravariant) 인터페이스는 메서드가 `T` 타입의 매개변수를 받지만 `T`를 반환하지 않아야 한다는 제약을 뜻합니다. C#에서는 `in` 키워드로 표시합니다.

```cs
// 반변성
interface IConsumer<in T> {
	void Consume(T obj);
}
```

### 공변성

예를 들어 `IProducer<Animal>` 타입의 프로듀서는 `Produce()`가 `Animal`을 반환하므로, 반환값을 `Cat` 변수에 바로 할당할 수 없습니다.

```cs
IProducer<Animal> producer;
Animal a = producer.Produce();
Cat b = producer.Produce(); // 오류
```

반대로 `IProducer<Cat>`인 경우, `Produce()`는 `Cat`을 반환하며 이를 `Animal` 타입의 변수에도 할당할 수 있습니다.

```cs
IProducer<Cat> producer;
Animal c = producer.Produce();
Cat d = producer.Produce(); // 문제 없음
```

이는 하위 타입이 상위 타입의 위치에 들어가도 안전하다는 의미이며, 이를 공변성이라고 합니다.

```
Cat : Animal ==> IProducer<Cat> : IProducer<Animal>
```

### 반변성

`IConsumer<Animal>`는 `Animal`뿐 아니라 `Cat`도 소비할 수 있습니다.

```cs
IConsumer<Animal> consumer;
consumer.Consume(new Animal());
consumer.Consume(new Cat()); // 문제 없음
```

반대로 `IConsumer<Cat>`는 `Cat`만 안전하게 소비할 수 있고 `Animal`을 전달하면 오류가 납니다.

```cs
IConsumer<Cat> consumer;
consumer.Consume(new Cat());
consumer.Consume(new Animal()); // 오류
```

따라서 반변성 관계는 다음과 같이 표현됩니다.

```
Cat : Animal ==> IConsumer<Animal> : IConsumer<Cat>
```

## 무변성

제네릭 매개변수에 `in` 또는 `out`과 같은 변이 표시가 없는 경우, 해당 타입은 무변성(invariant)입니다. 즉, 하위/상위 타입 간의 치환을 허용하지 않습니다.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: Liskov substitution principle
url: https://en.wikipedia.org/wiki/Liskov_substitution_principle
retrievedDate: 2024, March 26
publisher: Wikipedia
source: websites
---
::

::apa-reference
---
authors:
 - Leopold, N # Niklas Leopold
title: Covariance and now Contravariance, do I really need to know this?
url: https://morotsman.github.io/java/contravariance/the/liskov/substitution/principle/2020/07/17/java-contravariance.html
date: 2020, July 17
source: websites
---
::

::apa-reference
---
authors:
 - Horvat, Z # Zoran Horvat
title: What is Covariance and Contravariance in C#
url: https://www.youtube.com/watch?v=Wp5iYQqHspg
date: 2022, May 16
source: websites
---
::

::apa-reference
---
authors:
 - Ssabae
title: 공변성, 반공변성, 무공변성이란?
url: https://velog.io/@lsb156/covariance-contravariance
date: 2020, October 25
source: websites
---
<!-- prettier-ignore-end -->
