---
title: Arch Linux 설치
description: 내 개인적인 경험을 바탕으로 한 Arch Linux 설치 종합 가이드
topic: Linux
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - linux
  - os
  - arch
  - hp
directory: programming
updatedAt: 2024-05-25T13:53:18.347Z
createdAt: 2023-10-28T12:39:05.389Z
---

무엇보다도 기본적인 Linux, 디버깅 및 명령줄 지식이 있으면 설치 프로세스에 도움이 됩니다.

<!--more-->

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 부인 성명
---
저는 이제 아직 한국어 잘 못했으니까 이 기사는 구글 번역은 많이 사용했어서 잘못된 문법과 어휘는 있으니 죄송합니다. 이 기사가 나중에 다시 리뷰를 할겁니다.
::
<!-- prettier-ignore-end -->

## 사전 설치 단계

Arch Linux를 설치하려면 몇 가지 작업을 수행해야 합니다. 다음은 전제 조건을 순서대로 나열한 것입니다.

1. Arch Linux [공식 다운로드 페이지](https://archlinux.org/download/)로 이동합니다.
2. 귀하의 국가 또는 귀하의 국가와 가장 가까운 거울을 찾으십시오.
3. `x86_64.iso` 파일을 다운로드하고 **선택적으로** `sha256sums.txt`를 다운로드합니다.
4. 다운로드한 ISO의 해시를 텍스트 파일과 비교하여 확인합니다. Microsoft Windows에서는 내장된 `certutil` 명령을 사용하여 서명을 확인할 수 있습니다.
5. ISO 이미지가 확인되면 [balenaEtcher](https://etcher.balena.io/) 또는 [rufus](https: //rufus.ie/en/).
6. 그런 다음 새로 구운 플래시 드라이브를 대상 컴퓨터에 연결합니다.
7. 전원을 켜고 BIOS 메뉴가 나타날 때까지 <kbd>Esc</kbd> 키를 반복해서 누르십시오.
8. 하드웨어에 따라 플래시 드라이브로 계산된 부팅 방법을 알아내야 합니다.

### HP Pavilion

HP Pavilion 시스템에 Arch를 설치하는 경우 플래시 드라이브로 시스템을 부팅하기 위해 수행해야 하는 몇 가지 추가 단계가 있을 수 있습니다.

먼저 <kbd>F9</kbd>를 눌러 부트로더를 입력하고 Arch Linux 이미지가 마운트된 플래시 드라이브의 이름을 선택하세요. 플래시 드라이브로 부팅하려면 <kbd>Enter</kbd>를 누르십시오.

"선택한 부팅 이미지가 인증되지 않았습니다. 계속하려면 Enter를 누르세요."라는 오류 메시지가 표시되고 부팅을 진행할 수 없는 경우 <kbd>Enter</kbd>를 누른 다음 <kbd>F10</kbd>를 눌러 다음으로 이동하세요. BIOS 설정. "시스템 구성", "부팅 옵션"으로 이동한 후 마지막으로 "레거시 지원" 설정을 활성화합니다.

```
F10 BIOS settings -> System Configuration -> Boot Options -> Legacy Support -> Enable
```

변경 사항이 저장되면 머신이 재부팅되고 "Operating System Boot Mode Change(운영 체제 부팅 모드 변경)" 메시지가 표시됩니다. 4자리 숫자를 입력한 후 <kbd>Enter</kbd>를 눌러 변경 사항을 확인하라는 메시지가 표시됩니다.

이제 플래시 드라이브는 아무런 방해 없이 부팅 가능해야 합니다.

## 설치

설치 단계의 순서는 다음과 같습니다. 부팅이 완료되어 tty 화면에 표시된 경우에만 설치를 진행하세요.

### WiFi 확인 및 연결

이 단계는 WiFi를 통해 기기를 인터넷에 연결하는 것입니다. 이더넷 사용자의 경우 이 단계를 건너뛸 수 있습니다.

먼저 `iwctl`을 입력하여 [iNet 무선 데몬(iwd)](https://wiki.archlinux.org/title/iwd) 모드로 들어갑니다.

```
iwctl
```

그런 다음 다음 명령을 입력하여 WiFi 네트워크를 표시하고 검색하고 연결하십시오. `#` 기호는 iwd 모드에 있음을 나타냅니다.

```
# station wlan0 show
# station wlan0 scan
# station wlan0 connect 'Wifi Name'
Passphrase: ***
# quit
```

### GPG 키 업데이트

Arch Linux를 설치하기 위해 `archinstall` 스크립트를 사용하지 않으려면 이 단계를 건너뛸 수 있습니다.

```
pacman-key --init
pacman-key --populate archlinux
```

### 설정 시간

다음으로, 다음 명령을 사용하여 Linux 시스템 시계를 NTP 서버와 동기화해야 합니다.

```
timedatectl set-ntp true
timedatectl status
```

### 디스크 파티셔닝

디스크 파티셔닝은 Arch Linux 설치에서 가장 중요한 부분입니다. 사용 가능한 하드 디스크를 나열하려면 `-l` 플래그와 함께 `fdisk` 명령을 사용하여 정보를 검색하세요.

```
fdisk -l
```

결과에는 최소한 `sda`가 있어야 하며 이는 포맷 및 파티셔닝에 사용됩니다. 프로세스를 시작하려면 `fdisk`에 디스크 경로를 제공하여 'fdisk' 모드로 들어갑니다.

```
fdisk /dev/sda
```

프롬프트가 `Command (m for help):`로 변경되어야 합니다. 디스크를 세 개의 섹션으로 분할해야 합니다. 첫 번째는 EFI 시스템용, 두 번째는 스왑용, 세 번째는 일반 파일 시스템용입니다.

레이블을 생성하려면 <kbd>g</kbd>를 누르고 파티션을 생성하려면 <kbd>n</kbd>를 누르십시오. 파티션을 생성하려면 _파티션 번호_, _시작_ 및 *끝*을 묻는 메시지가 표시됩니다. 다음은 3개의 새로운 파티션을 생성하는 방법입니다. 연속된 쉼표는 필드를 비워두고 기본값을 사용한다는 의미입니다.

```
Command (m for help): g
Command (m for help): n, , ,+550M // EFI system
Command (m for help): n, , ,+16G // Linux swap
Command (m for help): n, , , // Linux filesystem
```

### 디스크 파티션 바꾸다

기본적으로 `n` 명령으로 생성된 모든 파티션은 "Linux 파일 시스템" 유형입니다. 따라서 첫 번째 파티션의 파티션 유형을 "EFI 시스템"으로, 두 번째 파티션의 파티션 유형을 "Linux 스왑"으로 수정해야 합니다. 세 번째 파티션이 맞습니다.

파티션 유형을 업데이트하려면 `t` 명령을 사용하세요.

```
Command (m for help): t

Partition 1 --> 1 (EFI system)
Partition 2 --> 19 (Linux swap)
```

파티션이 올바르게 구성된 후 <kbd>w</kbd>를 입력하여 변경 사항을 저장하고 `fdisk`를 종료하세요.

### 스토리지 생성

다음으로 파티션 유형에 따라 해당 스토리지를 생성합니다. `fdisk`를 사용한 파티셔닝은 사용 가능한 저장소 유형을 완전히 생성하지 않습니다.

```
mkfs.fat -F32 /dev/sda1
mkswap /dev/sda2
swapon /dev/sda2
mkfs.ext4 /dev/sda3
```

### sda3 장착

이를 사용하려면 `/dev/sda3`을 `/mnt`에 마운트해야 합니다.

```
mount /dev/sda3 /mnt
```

### 시스템 설치

파일 시스템이 마운트된 후 'pacstrap' 명령을 실행하여 Arch Linux를 하드 드라이브(sda3)에 설치합니다.

```
pacstrap /mnt base base-devel linux linux-firmware
```

### Fstab

그런 다음, 다음 명령을 사용하여 파일 시스템 테이블을 생성합니다.

```
genfstab -U /mnt >> /mnt/etc/fstab
```

### Arch Chroot

다음 명령을 사용하여 chroot 모드로 들어갑니다. 이후에는 설치 단계를 계속 진행해야 합니다.

```
arch-chroot /mnt
```

### 시간대 설정

우리 컴퓨터의 올바른 시간대를 구성하려면 다음과 같이 `ln`(링크) 명령을 사용할 수 있습니다.

```
ln -sf /usr/share/zoneinfo/<REGION>/<CITY> /etc/localtime

# 예
ln -sf /usr/share/zoneinfo/Asia/Kuala_Lumpur /etc/localtime
```

귀하의 지역이나 도시가 확실하지 않은 경우 다음 명령을 사용하여 사용 가능한 지역과 도시를 탐색하거나 [시간대 표 Wikipedia 페이지](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)를 방문하세요.

```
ls /usr/share/zoneinfo
```

### 하드웨어 시계 설정

하드웨어 시계는 Linux 관리 시계와 다릅니다. 하드웨어 시계는 시스템이 꺼진 후에도 작동됩니다. "시스템-하드웨어 시계"를 의미하는 `--systohc` 플래그와 함께 `hwclock`을 실행하여 하드웨어 시계를 현재 시스템 시계와 동기화해야 합니다.

```
hwclock --systohc
```

### Nano 설치

Nano는 다음 단계에서 로케일 파일을 편집하는 데 사용할 간단한 명령줄 텍스트 편집기입니다. Nano를 설치하려면 다음 명령을 실행하세요. 또는 Vim 또는 Emacs를 사용하여 파일을 편집할 수 있습니다. 이런 경우에는 이 단계를 건너뛰고 대신 설치할 수 있습니다.

```
pacman -S nano
```

### 로케일 구성

로캘은 시스템에 컨텍스트를 제공하여 가장 적합한 정보를 표시하는 데 사용됩니다. `/etc/locale.gen` 파일을 열고 사용하려는 로케일을 **주석 해제**하세요.

```
nano /etc/locale.gen
```

파일을 저장한 후 `locale-gen`을 실행하여 심볼릭 링크를 생성합니다.

```
locale-gen
```

### Hostname 구성

호스트 이름은 컴퓨터를 식별하는 이름입니다. 제 경우에는 HP Pavilion을 사용하고 있으므로 'pavilion'을 호스트 이름으로 사용하겠습니다. 그러나 호스트 이름 설정에 있어서 엄격한 규칙은 없습니다.

`/etc/hostname`에 새 파일을 생성하여 호스트 이름을 설정하고 파일의 첫 번째 줄에 원하는 호스트 이름을 삽입해야 합니다.

```
nano /etc/hostname
```

그런 다음 텍스트 편집기를 저장하고 종료하십시오.

### 호스트 구성

다음으로 머신의 호스트를 구성해야 합니다.

```
nano /etc/hosts
```

다음 내용을 복사하여 `/etc/hosts` 파일에 추가하고 `<hostname>`을 실제 호스트 이름으로 바꿉니다.

```
127.0.0.1    localhost
::1          localhost
127.0.1.1    <hostname>.localdomain    <hostname>
```

내 구성 파일의 모습은 다음과 같습니다.

```
127.0.0.1    localhost
::1          localhost
127.0.1.1    pavilion.localdomain    pavilion
```

### 비밀번호 생성

다음으로 `passwd` 명령을 사용하여 루트 사용자의 비밀번호를 설정해야 합니다.

```
passwd
```

비밀번호를 입력하고 메시지가 나타나면 비밀번호를 확인하세요.

### 사용자 추가

현재 우리는 "루트"인 슈퍼유저를 단 한 명만 보유하고 있으며 더 나은 보안을 위해 권한이 없는 사용자를 생성하고 대신 해당 사용자를 사용하는 것이 좋습니다. 다음과 같이 새 사용자를 생성하고 해당 사용자의 비밀번호를 구성할 수 있습니다.

```
useradd -m <username>
passwd <username>
```

### 그룹에 사용자 추가

루트 액세스가 필요한 기능에 액세스하려면 새로 생성된 사용자를 미리 정의된 일부 그룹에 추가해야 합니다.

```
usermod -aG wheel,audio,video,optical,storage <username>
```

### sudo 설치

`sudo` 명령을 사용하려면 먼저 설치해야 합니다.

```
pacman -S sudo
```

sudoer 파일을 열고 `%wheel ALL=(ALL) ALL`의 주석 처리를 제거합니다.

```
EDITOR=nano visudo
```

파일을 저장하고 Nano를 종료합니다.

### grub 및 기타 종속성 설치

```
pacman -S grub efibootmgr dosfstools os-prober mtools
```

### 부트 디렉토리 만들기

```
mkdir /boot/EFI
mount /dev/sda1 /boot/EFI
grub-install --target=x86_64-efi --bootloader-id=grub_uefi --recheck
```

### Grub 구성 파일 만들기

그런 다음 아래 명령을 사용하여 grub 구성 파일을 생성합니다.

```
grub-mkconfig -o /boot/grub/grub.cfg
```

### NetworkManager 설치

NetworkManager는 WiFi 연결에 사용됩니다.

```
pacman -S networkmanager
```

NetworkManager를 활성화하려면 아래 명령을 입력하십시오.

```
systemctl enable NetworkManager
```

### Chroot 모드를 퇴거하고 마운트 해제

chroot를 종료하고 스토리지 파티션을 마운트 해제합니다.

```
exit
umount -l /mnt
```

아치 리눅스가 설치되었습니다. 설치를 확인하려면 USB 플래시 드라이브를 **분리**한 상태에서 머신을 재부팅하세요. 그 후에도 여전히 Arch Linux로 부팅할 수 있습니다.

## WiFi 연결 설정(재부팅 후)

**처음으로** 머신을 재부팅한 후 WiFi에 다시 연결해야 합니다. 이번에는 이전에 설치한 NetworkManager를 사용합니다.

NetworkManager 서비스가 아직 실행되고 있지 않은 경우 `enable` 명령을 사용하여 활성화하고 `status`를 실행하여 이미 백그라운드에서 실행 중인지 확인하세요.

```
systemctl enable NetworkManager.service --now
systemctl status NetworkManager.service
```

네트워크에 연결하려면 그림과 같이 NetworkManager의 터미널 UI를 실행하면 됩니다. UI를 탐색하여 WiFi 네트워크에 연결할 수 있어야 합니다.

```
nmtui
```

또는 대신 한 줄짜리 CLI 명령을 사용하여 WiFi를 연결할 수 있습니다.

```
nmcli device wifi connect 'WiFi Name' password *****
```

네트워크에 연결한 후 `ping`을 사용하여 인터넷 액세스를 확인할 수 있습니다.

```
ping google.com
```

축하해요. 이제 모든 것이 완전히 설정되었습니다. 다음으로 필요에 따라 창 관리자, 데스크톱 환경, 로그인 관리자 등 즐겨 사용하는 패키지와 소프트웨어를 설치할 수 있습니다.

## 기타

또한 다운로드 속도를 향상시키기 위해 팩맨의 미러 목록을 업데이트할 수 있습니다. `reflector`라는 패키지를 설치하여 시작하세요.

```
sudo pacman -S reflector
```

다음으로 재해에 대비해 기존 미러 목록에 대한 백업을 생성합니다.

```
sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.bak
```

마지막으로 반사판을 사용하여 미러 목록을 업데이트할 수 있습니다.

```
sudo reflector --verbose --latest 10 --protocol https --sort rate --save /etc/pacman.d/mirrorlist
```

미러 목록은 지역의 가용성에 따라 업데이트되어야 합니다.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Taylor, D # Derek Taylor
title: Arch Linux Installation Guide 2020
url: https://www.youtube.com/watch?v=PQgyW10xD8s
date: 2020, September 2
source: websites
---
::

::apa-reference
---
authors:
 - Sol Does Tech
title: Hyprland on Arch Install script -V2
url: https://www.youtube.com/watch?v=8GmpCwBqHCA
date: 2023, April 4
source: websites
---
::

::apa-reference
---
title: Arch Linux Installation Guide
url: https://wiki.archlinux.org/title/Installation_guide
date: 2024, March 25
publisher: Arch Linux
source: websites
---
::

::apa-reference
---
title: Arch Linux Postinstall Recommendations
url: https://wiki.archlinux.org/title/General_recommendations
date: 2024, March 15
publisher: Arch Linux
source: websites
---
::

::apa-reference
---
title: Synchronizing a Linux System Clock with NTP Server
url: https://tecadmin.net/synchronizing-a-linux-system-clock-with-ntp-server/
authors:
 - Kumar, R # Rahul Kumar
date: 2023, February 8
source: websites
---
::

::apa-reference
---
authors:
 - Natarajan, R # Ramesh Natarajan
title: 7 Linux hwclock Command Examples to Set Hardware Clock Date Time
url: https://www.thegeekstuff.com/2013/08/hwclock-examples/
date: 2013, August 13
source: websites
---
::

::apa-reference
---
authors:
 - SussyBob420
title: No Internet after reboot
url: https://www.reddit.com/r/archlinux/comments/vala0i/no_internet_after_reboot/
source: websites
date: 2022, June 12
---
::
<!-- prettier-ignore-end -->
