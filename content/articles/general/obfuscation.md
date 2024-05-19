---
title: Obfuscation
description: The attempt to conceal the purpose of a source code
topic: General
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - encryption
  - c
  - security
updatedAt: 2024-03-25T13:17:10.163Z
createdAt: 2022-08-12T17:38:48.848Z
---

Obfuscation is the act of deliberately converting a piece of source code into codes that are difficult for human to understand to conceal its true purpose, but the functionality remains unchanged and are perfectly executable by computers.

## Example

Here is a [step by step guide](https://www.youtube.com/watch?v=rwOI1biZeD8) on obfuscating a piece of C code. The transformation before and after are quite drastic as compared to each other.

### Before Obfuscation

```c [hello.c]
int main(void)
{
    time_t t;
    struct tm* tm;

    t = time(NULL); /* Get current time in seconds */
    tm = localtime(&t); /* Transform a timestamp to broken-down time */

    switch(tm->tm_hour) /* Choose action from the hour value */
    {
        case 4: case 5: case 6: case 7:
        case 8: case 9: case 10: case 11:
            printf("Good morning!\n");
            break;
        case 12: case 13: case 14:
            printf("Good day!\n");
            break;
        case 15: case 16: case 17:
            printf("Good afternoon!\n");
            break;
        case 18: case 19: case 20: case 21:
            printf("Good evening!\n");
            break;
        default:
            printf("Good night!\n");
            break;
    }
    return 0;
}
```

### After Obfuscation

```c [hello.c]
#include <time.h>
char* w = "AAAA########+++///9999AA Good %s!\n\0morning\0day\0afternoon\0evening\0night";
int main(){time_t t=time(0); return printf(w+25, w + w[ localtime(&t)->tm_hour ]);}
```

## Online Obfuscator

Obfuscator is also available online for [JavaScript](https://obfuscator.io/) and [Python](https://pyob.oxyry.com/). Google the related keywords for more similar services.

## Disadvantages

- Obfuscation makes reading or reverse-engineering difficult, but not impossible
- May causes the performance to degrade if not handled properly
- Introduces complexity for building and debugging to the developers

## References

::apa-reference
---
authors:
 - Bisqwit
title: "Obfuscated C programs: Introduction"
url: https://www.youtube.com/watch?v=rwOI1biZeD8
date: 2016, February 18
source: websites
---
::

::apa-reference
---
title: Obfuscation (software)
url: https://en.wikipedia.org/wiki/Obfuscation_(software)
date: 2023, December 14
publisher: Wikipedia
source: websites
---
::

::apa-reference
---
title: JavaScript Obfuscator Tool
url: https://obfuscator.io/
retrievedDate: 2024, March 25
source: websites
---
::

::apa-reference
---
title: Oxyry Python Obfuscator
url: https://pyob.oxyry.com/
retrievedDate: 2024, March 25
source: websites
---
::

::apa-reference
---
title: Obfuscated C Code
url: https://www.cise.ufl.edu/~manuel/obfuscate/obfuscate.html
organization: University of Florida
retrievedDate: 2024, March 25
source: websites
---
::

::apa-reference
---
title: The International Obfuscated C Code Contest
url: https://www.ioccc.org/
retrievedDate: 2024, March 25
source: websites
---
::