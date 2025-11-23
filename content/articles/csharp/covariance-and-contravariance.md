---
title: Covariance and Contravariance
description: A brief explanation on variance in Object-Oriented programming with examples in C#
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

Covariance and contravariace are the terms originated from Physics to explain how the scale of the factor can affect the scale of the outcome. Covariant is indicative of the scale of outcome is directly proportional to the scale of the cause whereas contravariant is inversely proportional.

<!--more-->

In Programming, covariance and contravariance compliments the Liskov Substitution Principle of the [SOLID Principles](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/).

Simply put, contravariance is the conversion of a derived entity to its parent entity that are higher in the hierarchy. An epitome would converting Cat to Animal (upcasting).

![A simple hierarchical diagram](/images/variance/hierarchy.png)

Covariance on the other hand, is the conversion of a higher entity to a more derived, specific ones down the hierarchy. It is like converting Animal to Cat (downcasting).

## Basics

Take the `Animal` and `Cat` class as example.

```cs
class Animal {
	public void Eat() => Console.WriteLine("nom, nom");
}

class Cat : Animal {
	public void Meow() => Console.WriteLine("meow");
}
```

The base class `Animal` is used for both reference when instantiating both the `Animal` and `Cat` object.

```cs
Animal x = new Animal();
Animal y = new Cat();
```

Both `x` and `y` are able to invoke the `Eat` method. However, since the `Meow` method only exist in the `Cat` class, a `Cat` object that is referenced by the base `Animal` class **cannot** invoke that method.

```cs
x.Meow(); // compilation error
y.Meow(); // compilation error
```

Only the `Cat` object that has its own class as reference is able to access the `Meow` method.

```cs
Cat z = new Cat();
z.Meow();
```

## Generics

When it comes to generic typed interfaces, variance is mainly concerned with **how objects can be substituted**.

Covariant interface of type `T` indicates that its derivatives will only have methods that produce entities of type `T`. It is specified with the `out` keyword.

```cs
// covariant
interface IProducer<out T> {
	T Produce();
}
```

Conversely, contravariant interface of type `T` shows that its derivatives will only have methods that takes in object parameters of type `T` but not returning it. It is indicated by the `in` keyword.

```cs
// contravariant
interface IConsumer<in T> {
	void Consume(T obj);
}
```

### Covariance

For example, a producer of type `IProducer<Animal>` cannot directly assign the return value to the `Cat` variable because `Produce()` returns `Animal`.

```cs
IProducer<Animal> producer;
Animal a = producer.Produce();
Cat b = producer.Produce(); // error
```

Conversely, if it's `IProducer<Cat>`, `Produce()` returns `Cat`, which can also be assigned to a variable of type `Animal`.

```cs
IProducer<Cat> producer;
Animal c = producer.Produce();
Cat d = producer.Produce(); // no issue
```

This means that it is safe for a subtype to be placed in the position of a supertype, and this is called covariance.

```
Cat : Animal ==> IProducer<Cat> : IProducer<Animal>
```

### Contravariance

`IConsumer<Animal>` can consume not only `Animal` but also `Cat`.

```cs
IConsumer<Animal> consumer;
consumer.Consume(new Animal());
consumer.Consume(new Cat()); // no problem
```

Conversely, `IConsumer<Cat>` can only safely consume `Cat` and will throw an error if passed `Animal`.

```cs
IConsumer<Cat> consumer;
consumer.Consume(new Cat());
consumer.Consume(new Animal()); // error
```

Hence, they implies contravariance as they behaves in the opposite way.

```
Cat : Animal ==> IConsumer<Animal> : IConsumer<Cat>
```

## Invariant Type

If a generic parameter does not have a mutation notation such as `in` or `out`, the type is invariant, meaning it does not allow substitution between subtypes.

## Reference

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
::
<!-- prettier-ignore-end -->
