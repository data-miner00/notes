---
title: Windows 파이일 시스템
topic: 일반
description: Windows의 파일 시스템에 대한 일부 정보
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - windows
  - files
  - exfat
updatedAt: 2024-05-22T15:07:34.090Z
createdAt: 2024-05-21T15:07:34.090Z
---

새 저장 장치를 사용하려면 먼저 포맷해야 할 수도 있습니다.

## 저장 장치의 종류

- SD 카드
- USB 드라이브
- SSD
- 하드 드라이브
- 플래쉬 드라이브

## 파이일 시스템

하드 드라이브에 데이터를 저장하고 구성하는 방법입니다. 다음과 같은 기능을 제공합니다.

- 효율성
- 호환성
- 권한

## Windows 파이일 시스템

### FAT32

- 긴 이름은 File Allocation Table 32 입니다
- 유래는 Windows 95 부터
- 가장 호환되는 형식
- 여러 유형의 장치에서 드라이브를 자주 사용하는 사람들에게 권장됩니다

단점

- 최대 파일 크기는 4GB입니다.
  - 4GB가 넘는 파일을 넣으려고 하면 "파일이 너무 큼" 메시지가 표시됩니다.
- 최대 파티션 크기는 2TB입니다.
  - 4TB 드라이브가 있는 경우 2개의 2TB 파티션으로 별도로 파티션해야 합니다.

### exFAT

- 긴 이름은 Extended File Allocation Table
- Microsoft의 최신 파일 시스템(2006년 이후)
- FAT32 개선
- 무제한 지원 가능
  - 파일 크기
  - 파티션 크기

단점

- FAT32만큼 호환되지 않음
- 호환 가능
  - 모든 버전의 Windows
  - 맥 OS
  - 일부 리눅스
- 호환되지 않음
  - 오래된 기기
  - 일부 리눅스

### NTFS

- New Technology File System 입니다
- Windows XP부터 도입
- 무제한 지원
  - 파일 크기
  - 파티션 크기
- FAT32 및 ex-FAT보다 더 많은 기능
- NTFS 파일의 창 속성에는 다른 파일에 비해 탭이 2개 더 많습니다.
  - 보안 탭 - 폴더 및 파일 권한 관리
  - 이전 버전 - 섀도우 복사본. 복원 지점에 자동으로 저장됩니다.
- 암호화

단점

- 호환성
  - 윈도우와 호환 가능
  - MacOS 및 Linux는 읽기 전용 액세스입니다.

## 요약

|                  | FAT32                                       | exFAT                                       | NTFS                    |
| ---------------- | ------------------------------------------- | ------------------------------------------- | ----------------------- |
| 호환성           | 가장 호환되는                               | 호환성이 낮음                               | 호환성이 가장 낮음      |
| 파일 크기 제한   | 4GB                                         | 무한대                                      | 무한대                  |
| 파티션 크기 제한 | 2TB                                         | 무한대                                      | 무한대                  |
| 하드웨어         | 플래시 드라이브, 메모리 카드, 외장 드라이브 | 플래시 드라이브, 메모리 카드, 외장 드라이브 | Windows 드라이브만      |
| 특별한 기능      | 없음                                        | 없음                                        | 권한, 암호화, 이전 버전 |

## 서식 지정

### format 명령

Windows에는 디스크 드라이브를 쉽게 포맷할 수 있는 `format` 명령줄 유틸리티가 함께 제공됩니다. 다음과 같이 원하는 파일 시스템으로 모든 디스크를 포맷할 수 있습니다.

```
format D: \fs:exFAT
format F: \fs:fat32
format E: \fs:NTFS
```

## 참고

- [FAT32 vs exFAT vs NTFS - Windows File Systems](https://www.youtube.com/watch?v=bYjQakUxeVY)
- [exFAT VS NTFS: 차이점은 무엇입니까](https://www.easeus.co.kr/partition-manager-software/exfat-vs-ntfs.html)
