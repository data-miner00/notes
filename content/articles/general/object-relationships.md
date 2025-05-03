---
title: Object Relationships
description: Comprehending the relationships of objects in terms of association, inheritance, realization, aggregation and composition
topic: General
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - theory
  - object
updatedAt: 2025-03-04T11:21:30.000Z
createdAt: 2023-11-27T14:10:03.378Z
---

In Object-Oriented concept, a relationship refers to the way in two or more classes interact with each other within a system.

<!--more-->

## Association

Association represents the relationship between two classes. There are two types of association, namely unidirectional association and bidirectional association.

| Association    | Example                                 |
| -------------- | --------------------------------------- |
| Unidirectional | Customer places an order                |
| Bidirectional  | A is married to B and B is married to A |

Besides, association can also be multiplexed in the form of **one-to-one**, **one-to-many**, **many-to-one** and **many-to-many** relationships.

![Diagrams showing relationships between association, aggregation and composition](/images/object-relationships/association.png)

## Aggregation

Aggregation indicates that when an object that is owned or depend by another object, it can still exist on its own even after the dependent party is dead or ceases to exist.

Examples:

- The relationship between a **car** and a **wheel**. The wheel can still serve its purpose when the car it belongs to no longer exist.
- The relationship between a **company** and an **employee**. The employee can apply for a new company when the old company goes bankrupt.

This relationship can be understood colloquially as "A **uses** B, where B can live happily without A. "

![Diagrams showing the aggregation relationship between car and wheel](/images/object-relationships/aggregation.png)

## Composition

In composition, it is the opposite to the aggregation. The object that is owned by others cannot live on its own.

Examples:

- The relationship between a **cup handle** and a **cup**. It is safe to say that each cup comes with different sizes, colors and materials. Hence, the cup handle is unique to a cup and will have no use outside of the cup.
- The relationship between a **company** and their **bank accounts**. The bank accounts have no use without the company and would be illegal if someone trying to access the account without legitimate authority.

In other words, composition can be understood as "A **owns** B and B has no meaning outside A. "

![Diagrams showing the composition relationship between cup and cup handle](/images/object-relationships/composition.png)

## Inheritance

Inheritance describes the relationship between two objects that are usually depicted as a parent and child relationship.

Example:

- The relationship between a **cat** and **animal**. The cat _is an_ animal.

_"Is a"_ is the keyword for inheritance.

![Diagrams showing the inheritance relationship between cat and animal](/images/object-relationships/inheritance.png)

<!-- prettier-ignore-start -->
::callout
---
type: info
title: Notation
---
In a class diagram that is representing the inheritance relationship, if the parent is an abstract class, the class name is _italicized_.
::
<!-- prettier-ignore-end -->

## Realization

Similar to inheritance, realization refers to the **implementation** of an interface instead of inheriting from another class.

Example:

- The animal here is an interface and it encapsulates certain behaviours that an animal has. The cat behaves like an animal.

_"Behaves like" or "can do"_ is the keyword for realization.

![Diagrams showing the realization relationship between cat and animal interface](/images/object-relationships/realization.png)

## References

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Reddy, S # Siva Reddy
title: Association vs Aggregation vs Composition
url: https://www.youtube.com/watch?v=zLvOO4pm6ZI
date: 2019, August 14
source: websites
---
::

::apa-reference
---
title: Association, Aggregation, and Composition in Object-Oriented Programming
url: https://algodaily.com/lessons/association-aggregation-composition-casting
retrievedDate: 2024, March 26
source: websites
---
::
<!-- prettier-ignore-end -->
