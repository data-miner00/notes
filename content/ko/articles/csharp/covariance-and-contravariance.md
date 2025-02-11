---
title: 공변성 및 반변성
description: C# 예제에서 공변성 및 반변성는 간단하게 설명 드릴게요
topic: C#
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - variance
  - interface
  - csharp
updatedAt: 2025-02-11T12:22:05.000Z
createdAt: 2022-11-09T15:06:47.818Z
---

공변성(covariance)과 반변성(contravariance)은 요인의 규모가 결과의 규모에 어떻게 영향을 미칠 수 있는지 설명하기 위해 물리학에서 유래한 용어입니다. 공변은 결과 규모가 원인의 규모에 정비례하는 반면 반공변은 반비례한다는 것을 나타냅니다.

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

프로그램밍에서는 그 것 들은 [SOLID 원칙](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/)중 하나인 리스코프 치환 원칙(Liskov Substitution Principle)을 보완하다.

간단히 말해서, 공변성은 파생 엔터티를 계층 구조에서 더 높은 상위 엔터티로 변환하는 것입니다. 고양이를 동물로 변환하는 것(업캐스팅)이 전형입니다.

![간단한 계층 도표](/images/variance/hierarchy.png)

반변성은 상위 엔터티를 계층 구조 아래의 더 파생되고 구체적인 엔터티로 변환하는 것입니다. 이는 동물을 고양이로 변환하는 것과 같습니다(다운캐스팅).

## 기본 소개

`Animal` 과 `Cat` 클래스를 예로 들어보겠습니다.

```cs
class Animal {
	public void Eat() => Console.WriteLine("nom, nom");
}

class Cat : Animal {
	public void Meow() => Console.WriteLine("meow");
}
```

기반 클래스 `Animal` 은 `Animal` 및 `Cat` 개체를 인스턴스화할 때 두 참조에 사용됩니다.

```cs
Animal x = new Animal();
Animal y = new Cat();
```

`x` 와 `y` 두는 `Eat` 메서드를 호출할 수 있습니다. 그러나 `Meow` 메서드는 `Cat` 클래스에만 존재하므로 기본 `Animal` 클래스에서 참조하는 `Cat` 객체는 해당 메서드를 **호출할 수 없습니다**.

```cs
x.Meow(); // 컴파일 오류
y.Meow(); // 컴파일 오류
```

참조로 자체 클래스가 있는 `Cat` 인스턴스만 `Meow` 메서드에 액세스할 수 있습니다.

```cs
Cat z = new Cat();
z.Meow();
```

## 제네릭

제네릭 타입 인터페이스의 경우 변동성은 주로 **객체를 대체할 수 있는 방법** 과 관련이 있습니다.

`T` 타입의 공변 인터페이스는 해당 파생 항목에 `T` 타입의 엔터티를 생성하는 메서드만 있음을 나타냅니다. 그가 `out` 키워드로 지정됩니다.

```cs
// 공변성
interface IProducer<out T> {
	T Produce();
}
```

반대로 `T` 타입의 반공변 인터페이스는 파생물에 `T` 타입의 객체 매개변수를 사용하지만 이를 반환하지 않는 메서드만 있음을 보여줍니다. 이는 `in` 키워드로 표시됩니다.

```cs
// 반변성
interface IConsumer<in T> {
	void Consume(T obj);
}
```

### 공변성

`IProducer`가 더 높은 계층적 순서의 타입을 취하는 경우 `Produce` 메소드는 파생된 타입 참조와 호환되지 않는 더 높은 타입을 생성합니다.

```cs
IProducer<Animal> producer;
Animal a = producer.Produce();
Cat b = producer.Produce(); // 오류
```

그러나 'IProducer'가 더 높은 계층 구조의 파생 타입을 사용하는 경우 'Produce' 메서드는 기본 참조와 파생 참조 모두에 적합합니다.

```cs
IProducer<Cat> producer;
Animal c = producer.Produce();
Cat d = producer.Produce(); // 문제 없음
```

이는 **파생** 타입이 **기본** 타입과 _동일하게 동작_ 하므로 공분산이 있음을 의미합니다.

```
Cat : Animal ==> IProducer<Cat> : IProducer<Animal>
```

### 반변성

`Consume` 메소드는 `T`의 제네릭 타입 매개변수를 사용하며 차이점을 확연히 알 수 있습니다. 이제 아래 표시된 대로 파생 타입과 기본 타입이 모두 방정식에 잘 들어맞습니다.

```cs
IConsumer<Animal> consumer;
consumer.Consume(new Animal());
consumer.Consume(new Cat()); // 문제도 없음
```

소비자에서 덜 파생된 타입은 반대 동작을 갖습니다.

```cs
IConsumer<Cat> consumer;
consumer.Consume(new Cat());
consumer.Consume(new Animal()); // 분명히 못됩니다
```

따라서 그들은 반대는 속성이 있습니다.

```
Cat : Animal ==> IConsumer<Animal> : IConsumer<Cat>
```

## 무변성

기본 타입이나 파생 타입이 없는 `T` 타입 자체가 있는 인터페이스는 항상 소비와 생성의 양쪽 끝을 모두 만족시킬 수 있습니다. 이를 무변성 타입이라고 합니다.

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
