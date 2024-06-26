---
title: 라플라스 변환
topic: 수학
description: 라플라스 변환의 작동 방식에 대한 간단한 데모
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - differential
  - algebraic
  - math
updatedAt: 2024-06-22T16:19:02.800Z
createdAt: 2024-06-22T16:19:02.800Z
---

라플라스 변환은 다양한 직업 영역에서 널리 사용되는 다목적 도구입니다. 미분 방정식을 더 쉽게 풀 수 있는 대수 방정식으로 변환하는 데 사용됩니다.

$$
\mathscr{L}\{f(t)\} = F(s)
$$

$F(s)$는 변환이 적용된 후의 출력 함수입니다.

변환을 수행하는 공식은 다음과 같습니다.

$$
F(s) = \int^{\infty}_0{e^{-st}f(t)dt}
$$

## 예

1. $f(t)$에 대한 라플라스 변환을 구합니다.

$$
f(t) = e^{at}, t\geq0
$$

이것은 지수함수입니다.

$$
\begin{align}
    F(s) &= \mathscr{L}\{e^{at}\} \\
      &= \int^{\infty}_0{e^{-st}e^{at}dt} \\
      &= \int^{\infty}_0{e^{(a-s)t}}dt \\
      &= \frac{e^{(a-s)t}}{a-s}\bigg\rvert^{\infty}_{0}
\end{align}
$$

$s > a$의 경우:

$$
\begin{align}
F(s) &= 0 - \frac{1}{a - s} \\
&= \frac{1}{s - a}
\end{align}
$$

$s \leq a$의 경우, 값은 갈라진다.

## 참고

- [Intro to the Laplace Transform & Three Examples](https://www.youtube.com/watch?v=KqokoYr_h1A)
