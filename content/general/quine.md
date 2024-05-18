---
title: Quine
topic: General
description: The phenomena of self-replicating codes in various programming languages
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - c
  - cpp
  - python
  - fun
updatedAt: 2024-03-24T13:17:10.163Z
createdAt: 2021-10-31T13:33:30.485Z
---

A quine is referred to the code that upon execution, will produce the exact same code that was executed prior as the output. It exhibits the idempotency property. Quine is also known as "self-replicating programs" or "self-copying programs."

## C

```c [Example 1]
const unsigned char data[] = { /* snip */ };
#include <stdio.h>
int main() {
  printf( "const unsigned char data[] = {" );
  for ( int i=0; i<sizeof(data); i++ ) {
      printf( " %0#4x,", data[i] );
  }
  printf( "\n};\n\n" );
  for ( int j=0; j<sizeof(data); j++)
      putchar( data[j] );
  return 0;
}
```

```c [Example 2]
int main(void) {
  char str[]= " int main(void)\
{ char str[]= %c%s%c;\
printf(str, 0x22, str, 0x22);}";
  printf(str, 0x22, str, 0x22);}
```

```c [Example 3]
main(){char*s="main(){char*s=%c%s%c;printf(s,34,s,34);}";printf(s,34,s,34);}
```

## CoffeeScript

```coffee
s="s=%j;console.log s,s";console.log s,s
```

## Java

```java
public class Quine
{
  public static void main(String[] args)
  {
    char q = 34;      // Quotation mark character
    String[] l = {    // Array of source code
    "public class Quine",
    "{",
    "  public static void main(String[] args)",
    "  {",
    "    char q = 34;      // Quotation mark character",
    "    String[] l = {    // Array of source code",
    "    ",
    "    };",
    "    for(int i = 0; i < 6; i++)           // Print opening code",
    "        System.out.println(l[i]);",
    "    for(int i = 0; i < l.length; i++)    // Print string array",
    "        System.out.println(l[6] + q + l[i] + q + ',');",
    "    for(int i = 7; i < l.length; i++)    // Print this code",
    "        System.out.println(l[i]);",
    "  }",
    "}",
    };
    for(int i = 0; i < 6; i++)           // Print opening code
        System.out.println(l[i]);
    for(int i = 0; i < l.length; i++)    // Print string array
        System.out.println(l[6] + q + l[i] + q + ',');
    for(int i = 7; i < l.length; i++)    // Print this code
        System.out.println(l[i]);
  }
}
```

## JavaScript

```js
s = "s=%j;console.log(s,s)";
console.log(
  s,
  s
)(function a() {
  console.log("(" + a + ")");
})();

code = 'var q=unescape("%27");console.log("code="+q+code+q+";eval(code)")';
eval(code);
```

## Lua

```lua
s="s=%qprint(s:format(s))"print(s:format(s))
```

## Perl

```perl [Example 1]
$s='$s=%c%s%c;printf($s,39,$s,39);';printf($s,39,$s,39);
```

```perl [Example 2]
$s=q($s=q(%s);printf($s,%s););printf($s,%s);
```

## Python

```python [Example 1]
_='_=%r;print (_%%_)';print (_%_)
```

```python [Example 2]
s='s=%r;print(s%%s)';print(s%s)
```

```python [Example 3]
s='s=%r;print(s%%s,sep="")';print(s%s,sep="")
```

## Ruby

```rb [Example 1]
s="s=%p;printf s,s";printf s,s
```

```rb [Example 2]
s="s=%p;print s%%s";print s%s
```

```rb [Example 3]
s="s=%p;puts s%%s";puts s%s
```

```rb [Example 4]
s="s=%c%s%c;printf s,34,s,34";printf s,34,s,34
```

## Shell

```sh
s='s=\47%s\47;printf "$s" "$s"';printf "$s" "$s"
```

## Scheme

```scheme
(define x '(
  (display "(define x '(")
  (newline)
  (map (lambda (s) (write s) (newline)) x)
  (display "))")
  (newline)
  (display "(map eval x)")
  (newline)
  ))
(map eval x)
```

## References

::apa-reference
---
authors:
  - Toal, R # Ray Toal
title: Quine Programs
retrievedDate: 2024, March 24
url: https://cs.lmu.edu/~ray/notes/quineprograms/ 
source: websites
---
::

::apa-reference
---
authors:
  - Bertoldi, D # David Bertoldi
title: How to write your first Quine program 
date: 2019, July 26
publisher: Towards Data Science
retrievedDate: 2024, March 24
url: https://towardsdatascience.com/how-to-write-your-first-quine-program-947f2b7e4a6f
source: websites
---
::
