---
title: Endianness
topic: General
description: Brief explanation for Big-endian and Little-endian in computing
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - bytes
  - concepts
  - encoding
updatedAt: 2024-06-20T14:35:20.945Z
createdAt: 2024-06-20T14:35:20.945Z
---

In the classic novel Gulliver's Travels by Jonathan Swift (1726), there is a silly debate between two groups of people on whether to break an egg through the wider end or the narrower end. These two groups of people are called big-endians and little-endians respectively.

<!--more-->

## Computing

In today's computing landscape, endianness refers to the ordering of the bytes in a piece of data. Big-endian is an order that places the most significant value in the byte sequence first at the lowest storage address. Big-endian data is easier for human to read as the bytes are positioned from left to right.

Little-endian on the other hand places the least significant value first at the lower storage address. Little-endian data are non-intuitive for human to read, but it is easier for computers to perform computations and hence improves efficiency.

## Analogies and Examples

Here is a crude and simple analogy using the English sentence to represent in both big and little endian.

| Format        | Sentence              |
| ------------- | --------------------- |
| Big-endian    | I am going to the gym |
| Little-endian | gym the to going am I |

If you squint, it's basically reading the sentence from right to left for the sentence of little-endian.

A more realistic example is the representation of hexadecimal number.

| Format        | Hexadecimal for $4660_{10}$ | Full representation |
| ------------- | --------------------------- | ------------------- |
| Big-endian    | 0x1234                      | 0x12340000          |
| Little-endian | 0x3412                      | 0x00003412          |

This [online converter tool](https://www.scadacore.com/tools/programming-calculators/online-hex-converter/) can be used to visualize different endianness from a hexadecimal string.

## Little-endian Advantages

1. Incremental processing
2. Casts are no-op
3. Backward compatible
4. Ideal for devices with limited memory
5. Faster arithmetic operations such as addition and subtraction

![Process of addition](/images/endianness/addition-process.png)

The process of adding one to the number above is easy for little-endian as the least significant byte is at the start of the memory address whereas for big-endian, it requires traversal by the pointer to the least significant byte on the right before it can perform the addition.

## Extras

This is a function in C++ to find out whether our computer is Big-endian. The JVM is using Big-endian under the hood.

```cpp
bool is_big_endian(void)
{
    union {
        uint32_t i;
        char c[4];
    } bint = {0x01020304};

    return bint.c[0] == 1;
}
```

## References

<!-- prettier-ignore-start -->
::apa-reference
---
title: Endianness
publisher: Wikipedia
retrievedDate: 2024, June 20
url: https://en.wikipedia.org/wiki/Endianness
source: websites
---
::

::apa-reference
---
authors:
 - epcdiy
title: "50 年前的巧妙设计，依然广泛应用在现代手机电脑上"
publisher: YouTube
date: 2024, January 14
url: https://www.youtube.com/watch?v=Sw3XiCvej0U
source: websites
---
::

::apa-reference
---
authors:
 - Parr, K # Kealan Parr
title: "What is Endianness? Big-Endian vs Little-Endian Explained with Examples"
publisher: freeCodeCamp
date: 2021, February 1
url: https://www.freecodecamp.org/news/what-is-endianness-big-endian-vs-little-endian/
source: websites
---
::

::apa-reference
---
authors:
 - Murzea, R. # Radu Murzea
 - Cracker
title: "What is the advantage of little endian format?"
retrievedDate: 2024, June 20
url: https://softwareengineering.stackexchange.com/questions/95556/what-is-the-advantage-of-little-endian-format
source: websites
---
::

::apa-reference
---
authors:
 - Mortensen, P. # Peter Mortensen
 - Jay, T
title: Detecting endianness programmatically in a C++ program
retrievedDate: 2024, June 20
url: https://stackoverflow.com/questions/1001307/detecting-endianness-programmatically-in-a-c-program
source: websites
---
::

<!-- prettier-ignore-end -->
