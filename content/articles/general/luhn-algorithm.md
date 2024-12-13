---
title: Luhn's Algorithm
topic: Cryptography
description: A simple step-by-step guide with C# implementation
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - encoding
  - hash
  - algorithm
updatedAt: 2024-12-12T11:35:01.046Z
createdAt: 2024-12-12T11:35:01.046Z
---

Luhn's algorithm, also known as "modulus 10", is a checksum formula that is widely used across different industries, such as financial firm and governments.

<!--more-->

## How it works

Luhn's algorithm can be broken down into a few simple steps. Let's say we have a credit card number "374245455400126".

1. Separate the payload and the check digit. The check digit is the last digit. This yields "37424545540012" and "6".
2. Starting from the last digit "2", moving from **right to left**, for every second digit, multiply it by two. If the result of the multiplication exceeded 9, deduct 9 from it to make it within 10.
3. Add the resultant numbers to the total sum.

$$
\begin{align}
\text{sum} &= (2 \cdot 2) + (1 \cdot 1) + (0 \cdot 2) + (0 \cdot 1) + (4 \cdot 2) + (5 \cdot 1) + ((5 \cdot 2) - 9) + (4 \cdot 1) + ((5 \cdot 2) - 9) + (4 \cdot 1) + (2 \cdot 2) + (4 \cdot 1) + ((7 \cdot 2) - 9) + (3 \cdot 1) \\
 &= 44
\end{align}
$$

4. Calculate the check digit by the following formula

$$
\begin{align}
\text{Check Digit} &= 10 - (\text{sum}\; mod\; 10) \\
 &= 10 - (44\; mod\; 10) \\
 &= 10 - (4) \\
 &= 6
\end{align}
$$

As you can see, the check digit is equivalent to the value extracted from the original card number, which is 6. This shows that the card number is valid.

## Implementation

This is the implementation of the algorithm in C#. The `parity` is used to determine whether to double the digit or not.

```cs
public static bool ValidateLuhn(string cardNumber)
{
    int sum = 0;
    int parity = (cardNumber.Length - 1) % 2;

    // The `- '0'` converts char digit to int digit
    int checkDigit = cardNumber[^1] - '0';

    for (int i = cardNumber.Length - 2; i >= 0; i--)
    {
        int digit = cardNumber[i] - '0';

        if (i % 2 == parity)
        {
            sum += digit;
        }
        else if (digit > 4)
        {
            sum += (2 * digit) - 9;
        }
        else
        {
            sum += 2 * digit;
        }
    }

    return checkDigit == 10 - (sum % 10);
}
```

The implementation above can be further simplified by summing all the digits (still respecting the rule for doubling) of the string and checks whether the resulting sum has no remainder when divided by 10. If there is no remainder, means the number is valid.

```cs
public static bool ValidateLuhn(string cardNumber)
{
    int sum = 0;
    int parity = cardNumber.Length % 2;

    for (int i = 0; i < cardNumber.Length; i++)
    {
        int digit = cardNumber[i] - '0';

        if (i % 2 != parity)
        {
            sum += digit;
        }
        else if (digit > 4)
        {
            sum += (2 * digit) - 9;
        }
        else
        {
            sum += 2 * digit;
        }
    }

    return sum % 10 == 0;
}
```

## Disadvantages

As Luhn Algorithm is used to distinguish the validity of a string of numbers from mistyping, it is not tamper-proof. Moreover, it is great at capturing single-digit error but is bad at capturing multi-digit errors.

## Tools

- https://paymentcardtools.com/luhn-algorithm
- https://developers.bluesnap.com/reference/test-credit-cards

## References

<!-- prettier-ignore-start -->
::apa-reference
---
title: Luhn algorithm
publisher: Wikipedia
retrievedDate: 2024, December 12
url: https://en.wikipedia.org/wiki/Luhn_algorithm
source: websites
---
::

::apa-reference
---
title: Luhn algorithm
publisher: GeekForGeeks
date: 2022, July 19
url: https://www.geeksforgeeks.org/luhn-algorithm/
source: websites
---
::
<!-- prettier-ignore-end -->
