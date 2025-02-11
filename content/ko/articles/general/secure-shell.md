---
title: 시큐어 셸 (SSH)
topic: 일반
description: SSH와 실제 사용에 대한 빠르고 간단한 소개
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - protocol
  - ssh
  - remote
updatedAt: 2024-09-13T14:45:26.489Z
createdAt: 2024-09-13T14:45:26.489Z
---

시큐어 셸(SSH)은 **보안되지 않은 네트워크**를 통해 두 장치 간의 **보안 통신**을 가능하게 하는 암호화 프로토콜입니다. 원격 로그인, 명령 실행 및 파일 전송에 사용됩니다.

<!--more-->

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 부인 성명
---
한국어 실력이 부적하여 이 기사는 구글 번역기를 주로 활용했기 때문에 부정확한 문법과 어휘가 있을수 있습니다. 이 점 양해 부탁드리며, 추후에 다시 검토하여 수정하도록 하겠습니다.
::
<!-- prettier-ignore-end -->

SSH는 비밀번호 로그인이나 공개/비공개 키 쌍을 통해 클라이언트 측에서 인증을 수행할 수 있는 [서버-클라이언트 아키텍처](https://en.wikipedia.org/wiki/Client%E2%80%93server_model)에서 작동합니다.

## 서버

서버는 모든 클라이언트가 연결할 준비가 된 대상 머신입니다. Linux에서 SSH 데몬(예명으로 sshd)은 머신을 SSH 서버로 전환하는 데 필요합니다.

### 설치

SSH는 대부분 Linux 배포판에서 사용할 수 있는 `openssh` 패키지를 통해 설치할 수 있습니다. 설치하기 전에 `openssh`가 이미 설치되어 있는지 간단히 확인하세요.

```sh
ssh
```

이미 설치되어 있다면 도움말 텍스트가 콘솔에 인쇄됩니다.

```
usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface]
           [-b bind_address] [-c cipher_spec] [-D [bind_address:]port]
           [-E log_file] [-e escape_char] [-F configfile] [-I pkcs11]
           [-i identity_file] [-J [user@]host[:port]] [-L address]
           [-l login_name] [-m mac_spec] [-O ctl_cmd] [-o option] [-p port]
           [-Q query_option] [-R address] [-S ctl_path] [-W host:port]
           [-w local_tun[:remote_tun]] destination [command [argument ...]]
```

아직 설치되지 않았다면 배포 패키지 저장소에 따라 설치할 관련 패키지를 찾기만 하면 됩니다. 다음은 Ubuntu와 Arch Linux에서 `openssh`를 설치하는 방법에 대한 몇 가지 예입니다. Ubuntu에서는 클라이언트와 서버의 기능이 별도로 패키징되는 반면 Arch Linux에서는 [올인원](https://archlinux.org/packages/?q=openssh)입니다.

```shell
# Ubuntu
sudo apt-get install openssh-server openssh-client

# Arch Linux
sudo pacman -S openssh
```

Windows에 SSH를 설치하려면 MSDN의 [가이드](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse?tabs=gui&pivots=windows-server-2025)를 참조하세요.

### SSH 활성화/시작

SSH 데몬은 `systemctl`로 제어되어 시작, 중지, 재시작, 활성화 또는 비활성화될 수 있습니다.

```
sudo systemctl start sshd.service
```

### 방화벽 차단 해제

방화벽이 설치된 머신의 경우 SSH 인바운드 연결을 위해 포트 22를 열어야 합니다.

```
sudo ufw allow ssh
```

### IP 검색

클라이언트 머신에서 SSH를 사용하려면 대상 머신의 IP 주소가 필요합니다. 머신이 동일한 네트워크에 속해 있고, 즉 동일한 Wi-Fi에 연결되어 있는 경우 로컬 IP가 해당 작업을 수행합니다. Linux에서 로컬 네트워크의 IP 주소를 얻으려면 다음 `ip` 명령을 실행합니다.

```
ip a
```

이렇게 하면 로컬 IP 주소를 포함한 네트워크에 대한 정보가 인쇄됩니다.

```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute
       valid_lft forever preferred_lft forever
2: eno1: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN group default qlen 1000
    link/ether 80:aa:aa:aa:aa:aa brd ff:ff:ff:ff:ff:ff
    altname enp3s0
3: wlo1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 40:aa:aa:aa:aa:aa brd ff:ff:ff:ff:ff:ff
    altname wlp2s0
    inet 192.168.68.114/24 brd 192.168.68.255 scope global dynamic noprefixroute wlo1
       valid_lft 6915sec preferred_lft 6915sec
    inet6 fe80::aaaa:aaaa:aaaa:aaaa/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
```

## 클라이언트

클라이언트는 명령줄을 통해 SSH 서버에 연결할 머신입니다. 서버 머신에 연결하려면 아래에 표시된 SSH 명령을 사용합니다. `<username>`과 `<ip-address>`를 적절한 정보로 바꾸세요.

```
ssh <username>@<ip-address>
```

머신과 사용자가 성공적으로 검증되면 해당 사용자가 로그인하기 위해 비밀번호를 입력하라는 메시지가 표시됩니다. 처음으로 머신에 SSH를 성공적으로 연결하면 호스트를 신뢰하라는 경고 메시지가 표시됩니다. `yes`를 입력하면 됩니다.

```
The authenticity of host '192.168.68.114 (192.168.68.114)' can't be established.
ED25519 key fingerprint is SHA256:vEM3bnZJ09HNs4NnxxxxxxxxxxxxxxxxxxxxxxJuJ9Y.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
```

여기 내 Windows 10 컴퓨터에서 [MobaXTerm](https://mobaxterm.mobatek.net/)을 사용하여 내 Arch Linux 노트북에 SSH를 실행하는 스크린샷이 있습니다. MobaXTerm은 SSH를 바로 사용할 수 있는 등 많은 유용한 기능이 있어서 마음에 듭니다.

![MobaXTerm으로 로그인 성공](/images/secure-shell/mobax1.png)

내가 모르는 사이에 내 Neovim 테마와 구성도 잘 작동하고 있어요. 내가 코드를 편집하는 동안 [언어 서버 프로토콜](https://en.wikipedia.org/wiki/Language_Server_Protocol)도 활성화되어 있습니다. 너무 신기해.

![Clojure 코드 편집 시 활성한 LSP](/images/secure-shell/mobax2.png)

## 서버 로그인 보기

SSH 로그인에 대한 로그는 systemd의 로깅 서비스에서 구조화된 로그를 쿼리하는 유틸리티인 `journalctl`을 통해 검색할 수 있습니다.

```
journalctl -u sshd
```

이렇게 하면 SSH를 통해 서버 머신에 로그인한 각 항목에 대한 자세한 로그가 표시됩니다. 이 [기사](https://www.strongdm.com/blog/view-ssh-logs)에서 로그를 쿼리하는 데 사용할 수 있는 다양한 매개변수에 대해 자세히 알아보세요.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: Secure Shell
url: https://en.wikipedia.org/wiki/Secure_Shell
retrievedDate: 2024, September 13
source: websites
publisher: Wikipedia
---
::

::apa-reference
---
authors:
 - Gite, V # Vivek Gite
title: Linux start sshd (OpenSSH) server command
url: https://www.cyberciti.biz/faq/linux-start-sshd-openssh-server-command/
date: 2024, March 31
source: websites
---
::

::apa-reference
---
authors:
 - Todd, E # Evan Todd
title: How to View SSH Logs?
url: https://www.strongdm.com/blog/view-ssh-logs
date: 2023, January 24
source: websites
---
::

::apa-reference
---
authors:
 - Terpollari, O # Oltjano Terpollari
title: How to Install OpenSSH Server In Linux
url: https://www.tecmint.com/install-openssh-server-in-linux/
date: 2023, April 24
source: websites
---
::
<!-- prettier-ignore-end -->
