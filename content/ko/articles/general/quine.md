---
title: Quine
topic: 일반
description: 몇 가지 언어에 자기 자신을 출력하는 코드
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - c
  - cpp
  - python
updatedAt: 2024-05-24T13:10:15.014Z
createdAt: 2021-10-31T13:33:30.485Z
---

Quine은 실행 시 이전에 실행된 출력과 동일한 코드를 생성하는 코드를 말합니다. 멱등성 속성을 나타냅니다. Quine은 "자체 복제 프로그램" 또는 "자체 복사 프로그램"으로도 알려져 있습니다.

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

## 참고

<!-- prettier-ignore-start -->
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
<!-- prettier-ignore-end -->
