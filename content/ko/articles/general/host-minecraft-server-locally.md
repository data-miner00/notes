---
title: Minecraft 서버를 로컬로 호스팅하기
description: ngrok를 사용하여 로컬에서 작동하는 Minecraft 서버를 무료로 설정하기 위한 철저한 가이드
topic: 마인크래프트
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - minecraft
  - server
  - ngrok
updatedAt: 2024-08-31T13:14:10.324Z
createdAt: 2023-02-06T13:40:58.648Z
---

일반 플레이어에게는 Minecraft 서버를 호스팅하는 데 비용이 많이 들 수 있습니다. Athernos와 같은 무료 서비스는 극도로 느리기 때문에 성능이 좋지 않습니다. 게다가 저장된 파일이 서버에서 사라졌습니다. 모든 힘든 노력이 헛된 것입니다. 이것이 바로 우리가 서버를 직접 호스팅해야 하는 이유입니다.

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

## 요구 사항

For everything to work, there are a couple of software and tools that must be installed before hand.

### Java

설치해야 할 첫 번째이자 가장 중요한 구성 요소는 [Java](https://www.java.com/en/download/help/whatis_java.html)입니다.

일반적으로 Minecraft Java Edition은 Java에 의존하므로 Java는 Minecraft Launcher와 함께 설치됩니다. 명령 프롬프트에 `java --version`을 입력하여 Java가 설치되어 있는지 확인하면 다음과 같은 결과가 출력됩니다.

```
java 17.0.1 2021-10-19 LTS
Java(TM) SE Runtime Environment (build 17.0.1+12-LTS-39)
Java HotSpot(TM) 64-Bit Server VM (build 17.0.1+12-LTS-39, mixed mode, sharing)
```

### Minecraft 서버

목록의 두 번째 항목은 Minecraft 서버입니다.[공식 다운로드 페이지](https://www.minecraft.net/en-us/download/server)로 이동하여 "minecraft_server.x.x.x.jar 다운로드"라는 다운로드 링크에서 필요한 파일을 다운로드합니다.

`x.x.x`는 Minecraft 서버 버전입니다. 자신에게 맞는 올바른 버전을 찾으세요. 이 jar파일이름은 `server.jar`로 바꾸세요.

### ngrok

[ngrok](https://ngrok.com)을 사용하면 친구들이 로컬에서 호스팅되는 Minecraft 서버에 빠르고 무료로 참여할 수 있도록 대중에게 터널을 만들 수 있습니다.

계속해서 무료 ngrok 계정에 가입하고 대시보드에서 ngrok 클라이언트를 다운로드하세요. 다양한 OS용 ngrok 다운로더 링크가 포함된 배너가 있어야 합니다. 운영 체제에 적합한 버전을 다운로드하고 zip 파일에서 `ngrok.exe` 파일을 컴퓨터의 어느 곳으로든 *추출*하세요.

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: ngrok은 더 이상 "무료"가 아닙니다
---
ngrok에서 가격 계획을 검토한 것 같고 무료 플랜은 더 이상 지속 가능하지 않습니다. 할당된 1GB 데이터 전송은 단 이틀(또는 그 이하) 만에 소진됩니다.

![ngrok 데이터 전송 한도](/images/minecraft-localhost/ngrok-data-transfer-limit.png)

::
<!-- prettier-ignore-end -->

## 서버 디렉토리 설정

다음으로, Minecraft 서버와 Minecraft 저장 파일을 모두 포함하는 폴더 역할을 할 빈 디렉터리를 컴퓨터의 아무 곳에나 만듭니다. `server.jar` 파일과 추출된 `ngrok.exe`를 현재 디렉터리로 복사/이동합니다.

동일한 디렉터리에 `run.bat`라는 배치 파일을 만들고 텍스트 편집기로 엽니다. 실행 시 서버를 회전시킬 내용을 다음과 같이 입력합니다.

```bat[run.bat]
java -Xmx1024M -Xms1024M -jar server.jar nogui
PAUSE
```

숫자 '1024'는 서버가 컴퓨터에서 할당된 RAM(MB)을 나타냅니다. 대신 서버에 2GB RAM을 제공하려면 1024에 2를 곱하고 숫자를 바꾸면 됩니다.

이제 서버 디렉터리는 다음과 같으며 그 안에 3개의 파일이 있습니다.

```[디렉토리 구조]
├─ ngrok.exe
├─ run.bat
└─ server.jar
```

## 로컬로 호스팅하기

### `run.bat`을 실행하다

다음으로 `run.bat` 파일을 더블클릭하여 실행합니다. 처음 실행하는 동안 스크립트는 `eula.txt`를 로드하지 못했다는 로그와 함께 *종료*됩니다. 이는 예상된 내용이며 잠시 후에 다시 설명하겠습니다.

이제 새 파일과 폴더가 생성됩니다. 콘텐츠는 아래 표시된 디렉터리 구조와 일치해야 합니다.

```[디렉토리 구조]
├─ libraries/
│  └─ ...
├─ logs/
│  └─ ...
├─ versions/
│  └─ ...
├─ eula.txt
├─ ngrok.exe
├─ run.bat
├─ server.jar
└─ server.properties
```

### EULA에 동의하다

`eula.txt`를 열고 `eula`라는 속성을 검색하고 해당 값을 `false`에서 `true`로 변경합니다. 내용은 아래 표시된 내용과 유사해야 합니다.

```[eula.txt]
#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://aka.ms/MinecraftEULA).
#Mon Feb 06 10:57:19 MYT 2023
eula=true
```

파일을 저장하고 닫습니다.

### 두 번째로 `run.bat` 실행

변경 사항을 저장한 후 `run.bat`를 다시 실행하면 이번에는 표시된 대로 디렉터리 내에 몇 가지 파일이 더 있는 완전히 새로운 세계를 생성하는 동안 서버가 가동되어 실행되어야 합니다.

```[디렉토리 구조]
├─ libraries/
│  └─ ...
├─ logs/
│  └─ ...
├─ versions/
│  └─ ...
├─ world/
│  └─ ...
├─ banned-ips.json
├─ banned-players.json
├─ eula.txt
├─ ngrok.exe
├─ ops.json
├─ run.bat
├─ server.jar
├─ server.properties
├─ usercache.json
└─ whitelist.json
```

Minecraft 서버가 성공적으로 시작되면 실행 중인 포트가 표시되어야 합니다. 일반적으로 `25565`입니다.

```
[11:01:11] [Server thread/INFO]: Starting Minecraft server on *:25565
```

> Minecraft 클라이언트의 **크랙된 버전**을 활성화하여 서버에 참여하려면 `server.properties` 파일에서 `online-mode`를 비활성화하여 인증을 비활성화해야 합니다.

이제 `localhost`를 주소로 사용하여 서버에 가입할 수 있습니다.

![localhost 가입중](/images/minecraft-localhost/localhost.png)

![가입 수 있는 localhost](/images/minecraft-localhost/joinable-localhost.png)

서버를 중지하려면 서버 명령 프롬프트에 `stop`을 입력하면 모든 데이터가 저장되고 안전하게 종료됩니다. **반드시** 서버를 종료할 때마다 이 작업을 수행하십시오. 그렇지 않으면 세션에서 이루어진 모든 진행 상황이 **손실됩니다**.

다음은 서버 종료 시 몇 가지 샘플 로그입니다.

```
[14:17:39] [Server thread/INFO]: Done (2.857s)! For help, type "help"
stop
[14:17:45] [Server thread/INFO]: Stopping the server
[14:17:45] [Server thread/INFO]: Stopping server
[14:17:45] [Server thread/INFO]: Saving players
[14:17:45] [Server thread/INFO]: Saving worlds
[14:17:46] [Server thread/INFO]: Saving chunks for level 'ServerLevel[world]'/minecraft:overworld
[14:17:47] [Server thread/INFO]: Saving chunks for level 'ServerLevel[world]'/minecraft:the_end
[14:17:47] [Server thread/INFO]: Saving chunks for level 'ServerLevel[world]'/minecraft:the_nether
[14:17:47] [Server thread/INFO]: ThreadedAnvilChunkStorage (world): All chunks are saved
[14:17:47] [Server thread/INFO]: ThreadedAnvilChunkStorage (DIM1): All chunks are saved
[14:17:47] [Server thread/INFO]: ThreadedAnvilChunkStorage (DIM-1): All chunks are saved
[14:17:47] [Server thread/INFO]: ThreadedAnvilChunkStorage: All dimensions are saved
```

## 서버를 공개적으로 노출

다음으로, 서버 디렉터리에 설치된 ngrok에 ngrok 인증 토큰을 추가합니다. 아래와 같이 로그인 후 대시보드에 ngrok 계정을 연결하는 명령이 있어야 합니다.

```
ngrok config add-authtoken <비밀 토큰>
```

다음 명령을 사용하여 `run-ngrok.bat`라는 파일을 만듭니다.

```[run-ngrok.bat]
ngrok tcp --region us 25565
PAUSE
```

이 명령은 라우팅을 위해 지정된 지역에서 실행되는 로컬 Minecraft 서버인 `25565` 포트를 노출합니다. 귀하의 지리적 위치에 가장 가까운 것을 선택하십시오. 참고할 수 있는 지역 목록은 다음과 같습니다.

변경 사항을 저장하고 파일을 종료합니다. 두 번 클릭하여 실행하면 이제 로컬 Minecraft 서버가 대중에게 공개됩니다. 아래 출력은 ngrok가 실행 중임을 보여줍니다.

```
ngrok

Add Okta or Azure to protect your ngrok dashboard with SSO: https://ngrok.com/dashSSO
Session Status                online
Account                       <your-username> (Plan: Free)
Version                       3.1.1
Region                        United States (us)
Latency                       23ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    tcp://0.tcp.ap.ngrok.io:13768 -> localhost:25565
Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

`Forwarding` 속성에서 TCP URL을 복사하여 친구에게 제공하여 모험에 참여하세요. 포트는 새 세션을 열 때마다 *변경*되며 해당 특정 세션에 참여할 사람을 업데이트해야 한다는 점에 유의하세요.

![ngrok 가입중](/images/minecraft-localhost/ngrok.png)

![가입 수 있는 ngrok](/images/minecraft-localhost/joinable-ngrok.png)

## 화이트리스팅

서버는 인터넷 전체에 공개적으로 제공되므로 악의적인 사람들이 공개 채널을 감지하고 세상에 합류하여 해를 끼칠 수 있습니다.

그렇게 하려면 `server.properties` 파일로 이동하여 `white-list`라는 필드를 찾아 해당 값을 `true`로 설정하세요. 그런 다음 플레이어를 화이트리스트에 추가하려면 실행 중인 서버 명령 프롬프트로 이동하여 다음을 입력하여 플레이어를 화이트리스트에 추가하세요.

```
whitelist add <player-name>
```

화이트리스트에 없는 플레이어는 가입 즉시 추방됩니다.

## 결론

이 기사에서는 자체 호스팅 서버를 설정하고 ngrok를 통해 대중이 액세스할 수 있게 만드는 방법을 안내합니다. 원치 않는 침입자가 서버에 들어오는 것을 방지하려면 **화이트리스트를 설정**하는 것이 중요합니다.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - TheHowToGuy123
title: How To Make A Minecraft Server For 1.19.3 - No Port Forwarding or Hamachi
url: https://www.youtube.com/watch?v=m-1hfPSKKKw
date: 2022, August 22
source: websites
---
::
<!-- prettier-ignore-end -->
