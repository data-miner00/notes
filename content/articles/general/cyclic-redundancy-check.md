---
title: Cyclic Redundancy Check
topic: General
description: Ensuring data integrity with the simple yet useful error detection method
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - algorithm
  - hash
  - error
updatedAt: 2024-09-14T00:19:05.225Z
createdAt: 2024-09-14T00:19:05.225Z
---

Cyclic Redundancy Check (CRC) is an algorithm that is used to detect errors in digital communication and storage systems. CRC comes with varying bit sizes that determine how long the checksum it produced. The commonly used CRC are 8-bit, 16-bit, 32-bit and 64-bit.

<!--more-->

## Calculation

### Convert to Binary

Given we have a piece of data, whether it is a string or a JPG file, it needs to be converted into its binary representation respectively.

```
"hello world" ---> 01101000 01100101 ...
Image.jpg     ---> 01101100 01100100 ...
```

### Select a Divisor

Both the sender and receiver will need to mutually agree on the divisor (a.k.a. generator polynomial). Refer to [Best CRC Polynomials](https://users.ece.cmu.edu/%7Ekoopman/crc/) to select the best divisor in relation to the checksum size.

For example, if `101101` (6-bit) is selected as the divisor, this is how it looks like in the mathematical representation.

$$
\begin{align}
G(x) &= 1 \cdot x^5 + 0 \cdot x^4 + 1 \cdot x^3 + 1 \cdot x^2 + 0 \cdot x^1 + 1 \cdot x^0 \\
 &= x^5 + x^3 + x^2 + 1
\end{align}
$$

Another example for `10011000` (8-bit) is as follows.

$$
\begin{align}
G(x) &= 1 \cdot x^7 + 0 \cdot x^6 + 0 \cdot x^5 + 1 \cdot x^4 + 1 \cdot x^3 + 0 \cdot x^2 + 0 \cdot x^1 + 0 \cdot x^0 \\
 &= x^7 + x^4 + x^3
\end{align}
$$

For CRC 32-bit, the divisor degree is up to 31.

$$
G(x) = x^{31} + x^{30} + \cdots + x^1 + 1
$$

### Perform Division

Division can be performed in both binary form and mathematical form. Here is a [Youtube tutorial](https://www.youtube.com/watch?v=A9g6rTMblz4) that illustrates the division steps.

From the division, we'll get the quotient and the remainder. The remainder is the checksum and will always be 1 bit lesser than the divisor.

### Append Remainder to Data

The last step is to append the remainder (checksum) to the original data.

For example,

```
    1001 (data) ++ 101 (checksum) --> 1001101 (final)
```

The receiver side will interpret the data correctly with its checksum and perform the validation thenceforth.

## Usages

### Frame Check Sequence

In transmission protocol such as TCP, a Frame Check Sequence is a piece of data appended to the header for error detection on the receiver's end. In this case, it is the CRC32 checksum as shown below.

![MAC Header](/images/cyclic-redundancy-check/MAC-header-format.png)

<!-- Retrieved from: https://www.researchgate.net/publication/312261643_Pre-Emptive_Traffic_Management_for_a_Cluster-Based_TDMA_System_in_Vehicular_Communications -->
<!-- TODO: Display reference/credit to this figure -->

### File Integrity Verification

CRC checksum is also provided sometimes when we are downloading files from the internet so that we can verify the integrity of the file once the file has been successfully downloaded.

### File Compression

File compression algorithms on the other hand use CRC checksum to verify the file integrity by comparing the CRC checksum after compression.

## Limitations

Despite being an extremely useful checksum algorithm, CRC also comes with its inherent weaknesses that makes it unsuitable for some occasion.

1. **Security**: CRC is a non-cryptographic hash function which makes it a bad candidate when security is the utmost priority. It is not resistant to intentional tampering. Read more about cryptographic hash function and non-cryptographic hash function on this amazing [blog post](https://dadario.com.br/cryptographic-and-non-cryptographic-hash-functions/) by Anderson Dadario.

2. **Collision**: Since the checksum is just the remainder calculated by the algorithm, the probability of collision exists albeit very low.

3. **Error Detection Capability**: Good for detecting single-bit error but not multi-bit errors especially in large datasets due to the collision nature of the algorithm mentioned above.

## Examples

### C#

In C#, Crc32 can be found in [System.IO.Hashing](https://learn.microsoft.com/en-us/dotnet/api/system.io.hashing?view=net-8.0) namespace that needs to be installed from [nuget.org](https://www.nuget.org/packages/System.IO.Hashing/) separately.

```cs [Program.cs]
using System.Text;
using System.IO.Hashing;

const string originalString = "hello world";
var encodedString = Encoding.UTF8.GetBytes(originalString);
var checksum = Crc32.Hash(encodedString);

Console.WriteLine(BitConverter.ToInt32(checksum)); // 222957957
```

### Python

Crc32 hashing utility can be found in the built-in `zlib` compression library.

```python
import zlib

data = b'hello world'
checksum = zlib.crc32(data)

print(checksum) # 222957957
```

## Tools

- [CRC-32 Checksum Calculator (Hash Generator)](https://crc32.online/)
- [String to Binary Converter](https://www.rapidtables.com/convert/number/string-to-binary.html)

## References

<!-- prettier-ignore-start -->
::apa-reference
---
title: Cyclic redundancy check
url: https://en.wikipedia.org/wiki/Cyclic_redundancy_check
retrievedDate: 2024, September 14
source: websites
publisher: Wikipedia
---
::

::apa-reference
---
title: Understanding CRC32
url: https://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art008
retrievedDate: 2024, September 14
source: websites
authors:
 - Davies, J # Joshua Davies
publisher: Commandlinefanatic.com
---
::

::apa-reference
---
title: Cyclic Redundancy Check
url: https://asecuritysite.com/comms/crc_div
date: "2024"
source: websites
authors:
 - Buchanan, William J
publisher: Asecuritysite.com
---
::

::apa-reference
---
title: "Cyclic Redundancy Check (CRC) - Part 1"
url: https://www.youtube.com/watch?v=A9g6rTMblz4
date: 2023, March 27
source: websites
authors:
 - Neso Academy
publisher: YouTube
---
::

::apa-reference
---
title: "Best CRC Polynomials"
url: https://users.ece.cmu.edu/%7Ekoopman/crc/
retrievedDate: 2024, September 14
source: websites
authors:
 - Koopman, P # Philip Koopman
---
::
<!-- prettier-ignore-end -->
