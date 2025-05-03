---
title: 개체 관계
description: 객체 간의 관계를 연관, 상속, 실현, 집합, 합성의 관점에서 이해하기
topic: 일반
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - theory
  - object
updatedAt: 2025-03-04T11:21:30.000Z
createdAt: 2023-11-27T14:10:03.378Z
---

객체 지향 개념에서 관계는 둘 이상의 클래스가 시스템 내에서 서로 상호 작용하는 방식을 나타냅니다.

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

## 연관관계

연관은 두 클래스 간의 관계를 나타냅니다. 연관에는 단방향 연관과 양방향 연관이라는 두 가지 타입이 있습니다.

| 연관관계 | 예시                              |
| -------- | --------------------------------- |
| 단방향   | 고객이 주문을 하다                |
| 양방향   | A는 B와 결혼했고 B는 A와 결혼하다 |

게다가 연관은 **일대일**, **일대다**, **다대일** 및 **다대다** 형식으로 다중화될 수도 있습니다. 관계.

![연관, 집계 및 구성 간의 관계를 보여주는 다이어그램](/images/object-relationships/association.png)

## 집계관계

집계는 다른 개체가 소유하거나 의존하는 개체가 종속 당사자가 죽거나 더 이상 존재하지 않는 후에도 자체적으로 존재할 수 있음을 나타냅니다.

예:

- **자동차**와 **바퀴**의 관계. 바퀴는 자신이 속한 자동차가 더 이상 존재하지 않더라도 여전히 그 목적을 수행할 수 있습니다.
- **회사**와 **직원**의 관계. 직원은 이전 회사가 파산한 경우 새 회사에 신청할 수 있습니다.

이 관계는 구어적으로 "A가 B를 사용하며, B는 A 없이도 행복하게 살아갈 수 있다"고 이해될 수 있다.

![자동차와 바퀴의 집합관계를 보여주는 다이어그램](/images/object-relationships/aggregation.png)

## 구성관계

구성에서는 집계와 반대입니다. 남의 소유물은 스스로 살아갈 수 없습니다.

예:

- **컵 손잡이**와 **컵**의 관계. 각 컵마다 크기, 색상, 소재가 다르다고 해도 과언이 아닙니다. 따라서 컵 손잡이는 컵에만 고유하며 컵 외부에서는 사용할 수 없습니다.
- **회사**와 **은행 계좌** 간의 관계입니다. 은행계좌는 회사가 없으면 아무 소용이 없으며, 누군가 적법한 권한 없이 계좌에 접근하려고 하면 불법입니다.

즉, 구성은 "A가 B를 **소유**하고 B는 A 외부의 의미가 없습니다. "라고 이해될 수 있습니다.

![컵과 컵 손잡이의 구성 관계를 보여주는 다이어그램](/images/object-relationships/composition.png)

## 상속관계

상속은 일반적으로 부모와 자식 관계로 묘사되는 두 개체 간의 관계를 설명합니다.

예:

- **고양이**와 **동물**의 관계. 고양이는 _동물이다_.

_"이다"_ 는 상속을 위한 키워드입니다.

![고양이와 동물의 유전 관계를 보여주는 다이어그램](/images/object-relationships/inheritance.png)

<!-- prettier-ignore-start -->
::callout
---
type: info
title: 표기법
---
상속 관계를 나타내는 클래스 다이어그램에서 부모가 추상 클래스인 경우 클래스 이름은 _기울임꼴로_ 표시됩니다.
::
<!-- prettier-ignore-end -->

## 실현관계

상속과 비슷하게 실현(realization)은 다른 클래스로부터 상속하는 대신 인터페이스를 **구현**하는 것을 의미합니다.

예를 들어:

- 여기의 동물은 인터페이스이고 동물이 가진 특정 행동을 캡슐화합니다. 고양이는 동물처럼 행동합니다.

_"~처럼 행동하다" 또는 "~할 수 있다"는_ 실현의 키워드입니다.

![고양이와 동물 인터페이스 간의 실현 관계를 보여주는 다이어그램](/images/object-relationships/realization.png)

## 참고

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
