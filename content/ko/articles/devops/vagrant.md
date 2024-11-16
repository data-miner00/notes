---
title: Vagrant
description: 클라우드와 로컬에서 VM을 관리하는 결정적이고 반복 가능한 방법
topic: DevOps
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - vm
  - iac
  - infra
updatedAt: 2024-11-14T12:36:20.276Z
createdAt: 2024-11-14T12:36:20.276Z
---

Vagrant는 가상 머신(VM) 프로비저닝 프로세스를 자동화하는 도구입니다. 이 프로젝트는 원래 2010년 Hashicorp의 창립자인 미첼 하시모토가 개인적인 사이드 프로젝트로 개발했습니다.

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

## 제공자

제공자는 Vagrant가 VM을 기본적으로 배포하고 구성하는 데 사용할 수 있는 가상화 기술입니다.
지원되는 Vagrant 제공자 목록은 다음과 같습니다.

- [Virtualbox](https://www.virtualbox.org/)
- [Docker](https://www.docker.com/)
- [EC2](https://aws.amazon.com/pm/ec2/)
- [OpenStack](https://www.openstack.org/)
- [DigitalOcean](https://www.digitalocean.com/)
- [Azure](https://azure.microsoft.com/en-us)
- [Google](https://cloud.google.com/)
- [VMWare](https://www.vmware.com/)
- [Hyper-V](https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/)
- [Vultr](https://www.vultr.com/)
- [Qemu](https://www.qemu.org/)

## 상자(Box)

Box는 기본적으로 배포할 수 있는 VM의 **이미지**입니다. Vagrant에는 배포에 사용할 수 있는 관리자 또는 커뮤니티가 만든 다양한 상자가 들어 있는 자체 저장소가 있습니다.

상자는 [Hashicorp Portal](https://portal.cloud.hashicorp.com/vagrant/discover)을 통해 발견/탐색할 수 있습니다.

몇 게 예시 상자가 다음과 같습니다.

- `centos/7`
- `generic/gentoo`
- `ubuntu/xenial64`
- `hashicorp/precise64`
- `archlinux/archlinux`

## Vagrantfile

Vagrantfile은 Vagrant가 배포에 사용하는 VM에 대한 모든 구성을 포함하는 파일입니다. 이 파일은 [Ruby 문법](https://ruby-doc.org/docs/ruby-doc-bundle/Manual/man-1.4/syntax.html)으로 작성되었습니다.

이는 VM을 생성하기 위한 이미지로 사용될 `centos/7`을 지정하는 최소한의 Vagrantfile입니다.

```rb [Vagrantfile]
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
end
```

`vagrant init centos/7`를 사용하면 초보자가 살펴보기에 유용한 CentOS용 Vagrantfile을 많이 주석 처리하여 스캐폴딩합니다. Vagrantfile을 구성하는 방법에 대한 [예](https://github.com/patrickdlee/vagrant-examples/)가 더 있습니다.

Vagrantfile의 유효성을 검사하려면 `validate` 명령을 실행합니다.

```
vagrant validate
```

## 프로비저너(Provisioner)

프로비저너는 VM이 ​​생성된 후 VM을 설정하는 도구입니다. 필요한 도구와 소프트웨어가 설치되지 않은 빈 VM을 만드는 것은 그다지 유용하지 않습니다.

- [Ansible](https://www.ansible.com/)
- Puppet
- Chef
- Salt
- Raw scripts (e.g Bash)

### 셸 수크립트

셸 프로비저닝 블록에서는 생성/편집 시 실행되는 인라인 셸 명령을 제공할 수 있습니다.

```ruby [Vagrantfile]
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
  config.vm.provision "shell", inline: <<-SHELL
    echo hello from shell!
    sudo yum update -y
    sudo yum install -y httpd
  SHELL
end
```

또는, Vagrantfile에서 참조할 수 있는 별도의 셸 스크립트를 사용해도 같은 결과를 얻을 수 있습니다.

```sh [provision.sh]
#!/bin/bash

echo hello from shell!
sudo yum update -y
sudo yum install -y httpd
```

이 `provision.sh` 스크립트는 이렇게 가져올 수 있습니다.

```ruby [Vagrantfile]
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
  config.vm.provision "shell", path: "provision.sh"
end
```

셸을 프로비저너로 사용하는 것에 대한 자세한 내용은 [공식 문서](https://developer.hashicorp.com/vagrant/docs/provisioning/shell)에서 배우할 수 있습니다.

## 다음에

Vagrantfile을 생성하고 구성한 후 `vagrant up`을 실행하여 VM을 시작합니다. 처음 실행할 때는 VM을 생성하고 실행하기 전에 먼저 공식 저장소에서 지정된 상자(이미지)를 다운로드합니다.

VM이 생성되고 실행되면 `vagrant ssh`를 실행하여 VM에 ssh로 접속합니다. SSH에서 VM을 종료하려면 명령줄에 `exit`를 입력합니다. VM을 중지하려면 `vagrant halt`를 실행하여 VM을 우아하게 종료합니다.

## 기본 명령

이 섹션을 기본한 Vagrant CLI 명령 몇 가지 아라보게씁니다.

### Vagrant 명령

| 명령                     | 설명                                                     | 예시                                     |
| ------------------------ | -------------------------------------------------------- | ---------------------------------------- |
| vagrant init             | 새로운 Vagrantfile를 만드다                              | vagrant init centos/7                    |
| vagrant up               | VM을 다운로드 다음에 시작하다                            |                                          |
| vagrant ssh              | SSH를 사용하여 VM에 들어가기                             |                                          |
| vagrant ssh-config       | OpenSSH 유효 구성을 인쇄합니다                           |                                          |
| vagrant halt             | VM들 다 멈추다                                           |                                          |
| vagrant suspend          | VM들을 일시 중단하다                                     |                                          |
| vagrant resume           | 중단된 VM들은 다시 시작하다                              |                                          |
| vagrant reload           | VM들 멈추고 다시 시작하다                                |                                          |
| vagrant destroy          | 모든 VM을 중지하고 제거하다                              |                                          |
| vagrant status           | 현재 Vagrant 환경의 상태를 보여주다                      |                                          |
| vagrant package          | 실행 중인 가상 환경을 재사용 가능한 상자로 패키징하다    |                                          |
| vagrant provision        | 실행 중인 VM에 대해 구성된 모든 프로비저너를 실행합니다. |                                          |
| vagrant plugin install   | Vagrant 플러그인을 설치하다                              | vagrant plugin install vagrant-vbguest   |
| vagrant plugin list      | 설치된 모든 플러그인을 나열하다                          |                                          |
| vagrant plugin uninstall | 설치왼 플러그인을 제거하다                               | vagrant plugin uninstall vagrant-vbguest |

### Vagrant 상자 명령

| 명령                  | 설명                                            | 예시                                                |
| --------------------- | ----------------------------------------------- | --------------------------------------------------- |
| vagrant box add       | 상자는 다운로드하다                             | vagrant box add centos/7                            |
| vagrant box list      | 다운로드된 상자가 모든 나열하다                 |                                                     |
| vagrant box outdated  | 다운로드왼 상자가 오래된 것이 있는지 확인합니다 |                                                     |
| vagrant box update    | 상자가 최신 버전으로 업데이트하다               | vagrant box update centos/7                         |
| vagrant box repackage | 새 이름과 메타데이터로 상자를 다시 포장합니다.  | vagrant box repackage centos/7 --name custom-centos |
| vagrant box prune     | 오래된 상자를 제거하다                          |                                                     |
| vagrant box remove    | 상자가 삭제하다                                 | vagrant box remove centos/7                         |

## 제공자로서의 VirtualBox

Vagrant의 제공자로 VirtualBox를 사용하는 경우 VM을 검사하는 데 유용한 명령은 다음과 같습니다.

- 모든 VM으로 나열하다

```
vboxmanage list vms
```

- 모든 실행중VM들 나열하다

```
vboxmanage list runningvms
```

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Pal, R # Raghav Pal
title: Vagrant Beginner Tutorial
url: https://www.youtube.com/playlist?list=PLhW3qG5bs-L9S272lwi9encQOL9nMOnRa
date: 2023, April 22
source: websites
---
::

::apa-reference
---
organization: Hashicorp
title: Introduction to Vagrant
url: https://developer.hashicorp.com/vagrant/intro
retrievedDate: 2024, November 14
source: websites
---
::

::apa-reference
---
publisher: Wikipedia
title: Vagrant (software)
url: https://en.wikipedia.org/wiki/Vagrant_(software)
retrievedDate: 2024, November 14
source: websites
---
::

::apa-reference
---
organization: Hashicorp
title: Shell Provisioner
url: https://developer.hashicorp.com/vagrant/docs/provisioning/shell
retrievedDate: 2024, November 14
source: websites
---
::
<!-- prettier-ignore-end -->
