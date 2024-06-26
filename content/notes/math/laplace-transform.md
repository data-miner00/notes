---
title: Laplace Transform
topic: Math
description: Quick demonstration of how Laplace Transform works
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

Laplace Transform is a versatile tool that is widely used on different realm of professions. It is used to convert a differential equation into algebraic equation that is easier to solve.

$$
\mathscr{L}\{f(t)\} = F(s)
$$

The $F(s)$ is the output function after the transformation is applied.

The formula to perform the transformation are as follows.

$$
F(s) = \int^{\infty}_0{e^{-st}f(t)dt}
$$

## Examples

1. Find the Laplace Transform for $f(t)$.

$$
f(t) = e^{at}, t\geq0
$$

This is an exponential function.

$$
\begin{align}
    F(s) &= \mathscr{L}\{e^{at}\} \\
      &= \int^{\infty}_0{e^{-st}e^{at}dt} \\
      &= \int^{\infty}_0{e^{(a-s)t}}dt \\
      &= \frac{e^{(a-s)t}}{a-s}\bigg\rvert^{\infty}_{0}
\end{align}
$$

For $s > a$:

$$
\begin{align}
F(s) &= 0 - \frac{1}{a - s} \\
&= \frac{1}{s - a}
\end{align}
$$

For $s \leq a$, the value diverges.

## References

- [Intro to the Laplace Transform & Three Examples](https://www.youtube.com/watch?v=KqokoYr_h1A)
