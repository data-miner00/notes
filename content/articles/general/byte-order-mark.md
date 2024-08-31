---
title: Byte Order Mark
topic: General
description: An invisible piece of info that is used in Unicode encodings
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - bytes
  - concepts
  - encoding
updatedAt: 2024-08-25T10:36:05.680Z
createdAt: 2024-08-25T10:36:05.680Z
---

Byte Order Mark (a.k.a BOM) is a special marker used in the encoding of a text file or a stream. It is represented as U+FEFF in unicode. It can be thought of just an arbitrary text appended to the original content of a file or a stream.

<!--more-->

## Example

For example, given I have a text file with the following raw contents.

```
Roses are red, violets are blue.
```

The content with the presence of byte order mark will look like this.

```
0xFEFFRoses are red, violets are blue.
```

Of course, the text "Roses are red, violets are blue." will also be converted into bytes when saved to the disk. We are able to see the content correctly because of the software that we use already did the conversion for us behind the scenes.

## Usages

It serves as a hint to software while trying to interpreting the content of the file regarding **byte order** and **encoding**.

### Byte Order

Byte Order, also known as endianness, is the order of the bytes are stored. For example,

- **Big-Endian (BE)**: The most significant byte is stored first.
- **Little-Endian (LE)**: The least significant byte is stored first.

I've already had an article explaining on [endianness](/articles/general/endianness), check it out if you are interested.

### Encodings

Besides serving as an indication of the byte order, it is also used for determining the encoding format of a file, such as UTF-8, UTF-16 and UTF-32.

The common BOM values are as follows:

- UTF-8: EF BB BF (Optional)
- UTF-16 (Big-Endian): FE FF (Compulsory)
- UTF-16 (Little-Endian): FF FE (Compulsory)
- UTF-32 (Big-Endian): 00 00 FE FF (Compulsory)
- UTF-32 (Little-Endian): FF FE 00 00 (Compulsory)

The BOM for UTF-16 and UTF-32 are **compulsory** because endianness matter.

## Python Examples

### Convert String to Hex

We can convert a string to hexadecimal representation in Python.

```python
char = 'h'

char.encode('utf-8') # b'h'
char.encode('utf-16') # b'\xff\xfeh\x00'
char.encode('utf-32') # b'\xff\xfe\x00\x00h\x00\x00\x00'
```

If we specify little endian or big endian in the encoding, it will not display the BOM.

```python
char.encode('utf-16le') # b'h\x00'
char.encode('utf-16be') # b'\x00h'
```

### Inspect BOM

The encoding utilities can be found in the `codecs` module.

```python
import codecs

print(codecs.BOM) # b'\xff\xfe'
```

### Write to File With Encoding

The following code writes the content to a file with the specified encoding. It will include the BOM for UTF-16 and UTF-32 encodings.

```python
char = 'h'

with open('file.json', 'w', encoding='utf-16') as f:
	f.write(char)
```

## Hexdump

We can use hexdump to inspect whether a file contains BOM.

Install the utilities package that comes with `hd` program.

```
sudo apt install bsdmainutils
```

Next, we can inspect whether file contains the byte order mark by using `hd` command. This is the `file.json` that is created earlier from the Python command above.

```
hd -c file.json
```

It will print the content of the files alongside with hex dumps.

```
00000000  ff fe 03 26                                       |...&|
0000000 377 376 003   &
0000004
```

The byte order mark is found as indicated by the preceding `ff fe` bits. Hence, we can deduce that `utf-16` encoding in Python will add a BOM when writing to files.

## Issues

- **Compatibility**: Some software might not handle the BOMs correctly, especially in UTF-8 encoded files where the BOM is not mandatory and might be treated as the actual content.

- **Portability**: Files containing a BOM might not be portable across different systems or environments due to aforementioned compatibility issue.

## References

<!-- prettier-ignore-start -->
::apa-reference
---
publisher: Wikipedia
title: Byte Order Mark
url: https://en.wikipedia.org/wiki/Byte_order_mark
retrievedDate: 2024, August 25
source: websites
---
::

::apa-reference
---
authors:
 - Sottile, A # Anthony Sottile
title: "what is a BOM (byte-order-marker) (intermediate) anthony explains"
url: https://www.youtube.com/watch?v=OrtNMystCgM
date: 2023, November 1
source: websites
---
::

::apa-reference
---
organization: Unicode, Inc
title: "UTF-8, UTF-16, UTF-32 & BOM"
url: https://unicode.org/faq/utf_bom.html
retrievedDate: 2024, August 25
source: websites
---
::
<!-- prettier-ignore-end -->
