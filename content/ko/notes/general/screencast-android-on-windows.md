---
title: Windows에서 Android 스크린캐스트
description: Windows에서 Android 기기의 화면을 공유하는 두 가지 방법
topic: 일반
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - windows
  - android
  - screencast
  - guide
updatedAt: 2024-09-15T05:44:36.967Z
createdAt: 2024-09-15T05:44:36.967Z
---

## Windows Connect

Windows의 단계:

1. 설정으로 이동
2. 사이드바에서 "이 PC로 투사"를 클릭합니다.
3. "선택적 기능"을 클릭합니다.
4. "기능 추가"를 클릭합니다.
5. "무선 디스플레이"를 검색하여 설치합니다.
6. 설정으로 돌아가서 첫 번째 드롭다운에서 "모든 곳에서 사용 가능"을 선택합니다.
7. "Connect 앱을 실행하여 이 PC로 투사"를 클릭합니다.

Android의 단계:

1. 설정에서 "연결 및 공유" 옵션을 찾습니다.
2. 스크린캐스팅과 관련된 옵션을 클릭합니다.
3. 화면 공유를 위해 준비된 Windows PC를 감지할 수 있어야 합니다.
4. PC 이름을 클릭합니다.
5. Android 휴대전화의 화면이 PC에 투사되어야 합니다.

## scrcpy

요약된 단계:

1. PC: [scrcpy](https://github.com/Genymobile/scrcpy) GitHub에서 에셋을 다운로드합니다.
2. PC: 파일을 폴더로 추출합니다.
3. Android: 개발자 모드를 활성화합니다.
4. Android: USB 디버깅을 활성화합니다.
5. Android: USB 와이어로 휴대폰을 PC에 연결합니다.
6. PC: 폴더에서 `scrcpy-noconsole.vbs`를 실행합니다.
7. Android: "RSA 디버깅 허용" 프롬프트에서 "허용"을 클릭합니다.
8. PC: `scrcpy-noconsole.vbs`를 다시 실행합니다.
9. PC: 휴대폰 화면이 PC에서 사용 가능해야 하며 클릭할 수 있어야 합니다.

## 참고

- [How To CAST Android Mobile Phone Screen to PC Laptop for Free Connect Phone to PC Laptop!!](https://www.youtube.com/watch?v=3KPiN-3MyTg)
- [How to use SCRCPY 2.0 | Control & Mirroring Android to PC](https://www.youtube.com/watch?v=owijYeRAlEw)
