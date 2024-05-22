---
title: Windows File System
topic: General
description: Some information about the file system on Windows
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - windows
  - files
  - exfat
updatedAt: 2024-05-21T15:07:34.090Z
createdAt: 2024-05-21T15:07:34.090Z
---

A new storage device may need to be formatted before it can be used.

## Types of Storage Device

- SD Card
- USB Drive
- SSD
- Hard Drive
- Flash Drive

## File System

A way to store and organize data on a hard drive. It offers features such as

- efficiency
- compatibility
- permissions

## Windows File System

### FAT32

- FAT32 stands for File Allocation Table 32.
- Introduced with Windows 95
- Most compatible format
- Recommend for those who use the drive in multiple devices frequently

Limitations

- Max file size is 4GB
  - Will get "File Too Large" if attempt to put file that is more than 4GB
- Max partition size is 2TB
  - If having 4TB drive, need to partition into 2 2TB partition separately

### exFAT

- Stands for Extended File Allocation Table
- Latest file system from Microsoft (since 2006)
- Improvement to FAT32
- Can support unlimited
  - File size
  - Partition size

Limitations

- Not as compatible as FAT32
- Compatible with
  - all versions of Windows
  - MacOS
  - Some Linux
- Not compatible
  - Older devices
  - Some Linux

### NTFS

- New Technology File System
- Introduced from Windows XP
- Support unilmited
  - File size
  - Partition size
- More features than FAT32 and ex-FAT
- In the windows property of a file in NTFS has 2 more tabs compare to others.
  - Security tab - Managing folder and file permission
  - Previous Versions - Shadowed copies. Automatically saved in a restore point.
- Encryption

Limitations

- Compatibility
  - Compatible for Windows
  - MacOS and Linux is read-only access

## Summary

|                 | FAT32                                       | exFAT                                       | NTFS                                       |
| --------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------ |
| Compatibility   | Most compatible                             | Less compatible                             | Least compatible                           |
| File Limit      | 4GB                                         | Infinity                                    | Infinity                                   |
| Partition Limit | 2TB                                         | Infinity                                    | Infinity                                   |
| Hardware        | Flash drives, memory cards, external drives | Flash drives, memory cards, external drives | Windows drives only                        |
| Special feature | None                                        | None                                        | Permission, encryption, previous versions. |

## Formatting

### format CLI

Windows comes with the `format` command line utility to format disk drives easily. We can format any disk with the desired file system as follows.

```
format D: \fs:exFAT
format F: \fs:fat32
format E: \fs:NTFS
```

## Resources

- [FAT32 vs exFAT vs NTFS - Windows File Systems](https://www.youtube.com/watch?v=bYjQakUxeVY)
- [exFAT VS NTFS: 차이점은 무엇입니까](https://www.easeus.co.kr/partition-manager-software/exfat-vs-ntfs.html)
