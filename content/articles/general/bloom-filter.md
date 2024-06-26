---
title: Bloom Filter
description: A brief introduction on Bloom Filter
topic: Data Structure
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - data
  - structure
  - hash
updatedAt: 2024-03-28T11:05:53.157Z
createdAt: 2023-03-22T12:58:10.024Z
---

Bloom Filter is a data structure that allows rapid lookup on an element, say a string whether it is present in a set. Implementation-wise, it is a **bit vector** that contains an array of zeros and ones (booleans) with a fixed length. It is known for its space and time efficiency.

<!--more-->

It is probabilistic in nature that is useful for lookup on **non-critical data**, such as caching search keywords and detecting weak passwords. Upon querying, bloom filter will only return one of the two responses - "maybe" or "no".

If the answer is "maybe", we only have a high chance that the data is indeed there, based on the allowed false positive rate configured. If the answer is "no", then the data is definitely absent in the set. In other words, a Bloom Filter can have a _low_ chance of getting a False positive (Type I Error) but _never_ a False negative.

Here is a simple Bloom Filter with the size of 10 for demonstration.

![A simple bloom filter with 10 bits](/images/bloom-filter/bloom-filter.png)

## How it works

To add an item in the Bloom Filter, it takes the input and hashed it with a few hash functions to get multiple hash digests. Subsequently, the results are used to determine the position of the bits to be flipped.

![Insertion operation of a string](/images/bloom-filter/insertion.png)

Here, we take the string `"hello, world"` and hash it with 3 different, independent hash functions and flip the bits accordingly.

After that, when a query tries to lookup for the same value, the hash produced will be the same and the results will points to the same bits that is already flipped, indicating the item is very likely to be there.

Let's try to query for the string `"hi, mum"` and observe the behaviour.

![Query not found in set](/images/bloom-filter/query-not-found.png)

Base on the results, only `Hash1` got a match whereas both `Hash2` and `Hash3` did not. Hence, we can deduce that `"hi, mum"` definitely does not exist.

## Collision

As the number of items in the Bloom Filter increases, more bits are being flipped and collision are bound to happen. Given a non-existing input, all of the hash functions may even have their results point to the flipped bit, hence producing a false positive result and this is the reason bloom filter is considered as a probabilistic data structure.

![A query that has collided](/images/bloom-filter/query-collision.png)

The hashes for the string `"hi, dad"` coincidentally fall to the flipped bits by `"hello, world"` earlier and this shows how a false positive can manifest.

The good news is, with proper tuning of the parameters, we can minimize the rate of false positivity to the threshold that is low enough to be acceptable for our use case.

## Parameters

Here are the parameters that can be controlled.

|     | Parameter                            | Description                        |
| --- | ------------------------------------ | ---------------------------------- |
| 1.  | Bit array, $m$                       | The size of the bloom filter       |
| 2.  | Hash function, $k$                   | The number of hash function used   |
| 3.  | Items in filter, $n$                 | Total amount of items inserted     |
| 4.  | False positive probability, $P_{fp}$ | The rate of getting false positive |

The relationships between the parameters can be represented by the formula as follows.

$$
P_{fp} \approx \big(1-e^{-\frac{kn}{m}}\big)^k
$$

As the probability of false positive is directly proportional to the number of items inserted, we would like to fix $n$ to be the maximum amount of items that we want to insert instead. This way, we can achieve a fixed maximum $P_{fp}$ and whats left to determine is the size of the bit array, $m$.

$$
m = - \frac{n \ln P_{fp}}{(\ln 2)^2}
$$

The number of hash function, $k$ can either be set arbitrary or by calculation.

$$
k = \frac{m \ln 2}{n}
$$

However, be mindful that the number of hash functions used does **not** correspond to the efficiency of the Bloom Filter as it will occupy more bits when inserting an element and consequently increases the likelihood of a collision. In fact, the more hash functions used, the slower it is for the operation to execute.

## Sample Implementation

This is a simple implementation in JavaScript. For Python's implementation, refer to [Brilliant.org](https://brilliant.org/wiki/bloom-filter/).

```js [bloom.js]
var crypto = require("crypto");

class BloomFilter {
  #size;
  #sliceStart;
  #sliceEnd;
  #array;
  #itemCount = 0;

  get itemsAdded() {
    return this.#itemCount;
  }

  constructor(size = 50, sliceStart = 0, sliceEnd = 4) {
    this.#size = size;
    this.#sliceStart = sliceStart;
    this.#sliceEnd = sliceEnd;
    this.#array = new Array(size);
  }

  insert(string) {
    var [hash1, hash2, hash3, hash4] = this.#getHashes(string);

    this.#array[
      Number("0x" + hash1.slice(this.#sliceStart, this.#sliceEnd)) % this.#size
    ] = 1;
    this.#array[
      Number("0x" + hash2.slice(this.#sliceStart, this.#sliceEnd)) % this.#size
    ] = 1;
    this.#array[
      Number("0x" + hash3.slice(this.#sliceStart, this.#sliceEnd)) % this.#size
    ] = 1;
    this.#array[
      Number("0x" + hash4.slice(this.#sliceStart, this.#sliceEnd)) % this.#size
    ] = 1;
    this.#itemCount++;
  }

  find(string) {
    var [hash1, hash2, hash3, hash4] = this.#getHashes(string);

    return !!(
      this.#array[
        Number("0x" + hash1.slice(this.#sliceStart, this.#sliceEnd)) %
          this.#size
      ] &&
      this.#array[
        Number("0x" + hash2.slice(this.#sliceStart, this.#sliceEnd)) %
          this.#size
      ] &&
      this.#array[
        Number("0x" + hash3.slice(this.#sliceStart, this.#sliceEnd)) %
          this.#size
      ] &&
      this.#array[
        Number("0x" + hash4.slice(this.#sliceStart, this.#sliceEnd)) %
          this.#size
      ]
    );
  }

  showState() {
    console.log("State are as follows: ", this.#array);
  }

  #getHashes(str) {
    var hash1 = crypto.createHash("sha1").update(str).digest("hex");
    var hash2 = crypto.createHash("sha256").update(str).digest("hex");
    var hash3 = crypto.createHash("mdc2").update(str).digest("hex");
    var hash4 = crypto.createHash("sha384").update(str).digest("hex");

    return [hash1, hash2, hash3, hash4];
  }
}
```

Strings can be inserted via the `insert` method, `find` for the lookup operation that returns a boolean value and the `showState` method shows the current state of the bit array. The `#itemCount` keep tracks of how many elements has been inserted since its instantiation.

The `#sliceStart` and `#sliceEnd` does not have anything to do with Bloom Filter. It is just a way I personally use to interpret the hashes and convert them into bit array positions.

## Closing Remark

In short, Bloom Filter is a powerful and efficient data structure that can be used in situations when false positive can be tolerated.
By tolerating the slim chance of collision, we are rewarded with an incredibly memory efficient data structure with miniscule size.

## References

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - ByteByteGo
title: Bloom Filters | Algorithms You Should Know #2 | Real-world Examples
url: https://www.youtube.com/watch?v=V3pzxngeLqw
date: 2022, September 6
source: websites
---
::

::apa-reference
---
authors:
 - Chumbley, A. # Alex Chumbley
 - Chattopadhyay, A. # Agnishom Chattopadhyay
 - Sinha, A. # Abhishek Sinha
 - et al
title: Bloom Filter
url: https://brilliant.org/wiki/bloom-filter/
retrievedDate: 2024, March 26
publisher: Brilliant
source: websites
---
::

::apa-reference
---
authors:
 - Mill, B # Bill Mill
title: Bloom Filters by Example
url: https://llimllib.github.io/bloomfilter-tutorial/
retrievedDate: 2024, March 26
source: websites
---
::

::apa-reference
---
title: Bloom Filter
url: https://en.wikipedia.org/wiki/Bloom_filter
retrievedDate: 2024, March 26
publisher: Wikipedia
source: websites
---
::

::apa-reference
---
authors:
 - Hurst, T # Thomas Hurst
title: Bloom Filter Calculator
url: https://hur.st/bloomfilter/
retrievedDate: 2024, March 26
source: websites
---
::

::apa-reference
---
title: Applications for Bloom Filter
url: https://iq.opengenus.org/applications-of-bloom-filter/
publisher: OpenGenus
retrievedDate: 2024, March 26
source: websites
---
::

::apa-reference
---
authors:
 - Bartakke, P # Prasanna Bartakke
title: "Bloom Filter Data Structure: Implementation and Application"
url: https://www.enjoyalgorithms.com/blog/bloom-filter
source: websites
retrievedDate: 2024, March 26
---
::
<!-- prettier-ignore-end -->
