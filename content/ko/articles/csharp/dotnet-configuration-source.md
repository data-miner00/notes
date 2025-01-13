---
title: .NET Core의 구성 소스
description: .NET Core에서 구성을 사용하여 비밀을 관리하는 방법애 대한 가이드
topic: C#
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - secrets
  - configuration
  - csharp
updatedAt: 2025-01-12T07:29:26.289Z
createdAt: 2025-01-12T07:29:26.289Z
---

프로젝트를 개발하는 동안, 우리는 불가피하게 API키, 연결 문자열 또는 다른 서비스와 통합할때 비밀번호와 같은 비밀을 마주치게 됩니다. 다음은 .NET Core에서 이를 관리하는 몇 가지 일반적인 방법입니다.

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

## 관리 없음

가장 간단한 방법은 비밀을 소스 코드에 직접 넣는 것입니다. 이것은 빠르고 지저분한 것에는 매우 유용할 수 있지만 심각한 프로제트에는 결코 좋은 생각이 아닙니다.

```cs
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer("Server=DESKTOP-AB4CDEF;Database=MyDb;Trusted_Connection=True;TrustServerCertificate=True;"));
```

## JSON 사용

사용자 정의 JSON 구성 파일은 구성 가능한 항목을 소스 코드에서 분리하는 데 사용할 수 있습니다. 민감한 정보를 저장하기에 좋은 곳은 아니지만 환경별 변수를 도입하기에 좋은 시작점입니다.

먼저, `Microsoft.Extensions.Configuration.Abstractions` NuGet 패키지를 설치하세요.

```
dotnet add package Microsoft.Extensions.Configuration.Abstractions --version 9.0.0
```

그 다음에, 프로젝트에 `settings.json` 또는 `appsettings.json`이라는 파일이 만듭니다.

```json [appsettings.json]
{
  "ConnectionStrings": {
    "Default": "Server=DESKTOP-AB4CDEF;Database=MyDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

`AddJsonFile` 메서드로 파일을 등록하여 값을 로드해야 합니다.

```cs
builder.Configuration
    .AddJsonFile("appsettings.json")
    .AddJsonFile($"appsettings.{environment.EnvironmentName}.json");
```

사용자 자정 JSON파일에서 단일 값을 검색하는 방법은 여러 가지가 있습니다. 아래 예에서는 파일에서 기본 연결 문자열을 검색하는 세가지 방법을 보여줍니다.

```cs
var connectionString = builder.Configuration["ConnectionStrings:Default"];
// 또는
var connectionString = builder.Configuration.GetSection("ConnectionString:Default").Value;
// 또는
var connectionString = builder.Configuration.GetConnectionString("Default");
```

### 업션 패턴

JSON 파일 내의 여러 값을 단일 객체로 논리적으로 그룹화할 수 있습니다. 이를 통해 값의 가독성과 응집성이 향상됩니다.

예를 들어, `MySettings`라는 클래스가 있고 이 클래스는 애플리케이션에 필요한 일부 변수를 나타냅니다.

```cs [MySettings.cs]
public class MySettings
{
    public string ConnectionString { get; set; }
    public int TimeoutInSeconds { get; set; }
}
```

`MySettings` 클래스를 보방한 다음 섹션을 `appsettings.json`에 추가할 수 있습니다.

```json [appsettings.json]
{
  "mySettings": {
    "connectionString": "내 안전한 연결 문제열",
    "timeoutInSeconds": 10
  }
}
```

다음과 같은 값을 `MySettings` 객체에 복사할 수 있습니다.

```cs [Program.cs]
var mySettings = new MySettings();
builder.Configuration.GetSection("MySettings").Bind(mySettings);
// 또는
var mySettings = builder.Configuration.GetSection(nameof(MySettings)).Get<MySettings>();
```

## 환경 변수

환경 변수는 프로젝트 외부의 사용자 또는 머신 레벨에 존재하는 변수입니다. .NET 구성은 인스턴스화 중에 환경 변수를 메모리로 읽어들입니다.

PowerShell에서는 사용 가능한 환경 변수 목록을 검색할 수 있습니다.

```ps1
Get-ChildItem env:* | Sort-Object name
```

임시 환경 변수는 다음과 같이 생성할 수 있습니다.

```ps1
$env:MYENV=foobar
```

동일한 PowerShell 세션으로 .NET 프로젝트를 실행하는 경우 앱 내에서도 사용할 수 있습니다.

```cs
var myEnv = builder.Configuration.GetSection("MYENV").Value; // foobar
```

다른 방법은 `launchSettings.json`의 대상 프로필의 `environmentVariables` 섹션에서 지정하는 것입니다. 이것은 `launchSettings.json` 파일을 사용하여 프로젝트를 시작하는 AspNetCore Mvc 또는 WebApi 프로젝트에 유용합니다.

```json [launchSettings.json]
{
  "https": {
    "commandName": "Project",
    "dotnetRunMessages": true,
    "launchBrowser": true,
    "applicationUrl": "https://localhost:7201;http://localhost:5029",
    "environmentVariables": {
      "ASPNETCORE_ENVIRONMENT": "Development",
      "MYENV": "foobar"
    }
  }
}
```

## 명령줄 인수

명령줄 인수는 구성을 사용하는 또 다른 방법입니다.

```
dotnet run --MYENV foobar
```

`launchSettings.json`에서도 명령줄 인수를 제공할 수 있습니다.

```json [launchSettings.json]
{
  "https": {
    "commandName": "Project",
    "dotnetRunMessages": true,
    "launchBrowser": true,
    "applicationUrl": "https://localhost:7201;http://localhost:5029",
    "environmentVariables": {
      "ASPNETCORE_ENVIRONMENT": "Development"
    },
    "commandLineArgs": "--MYENV=\"hello\""
  }
}
```

```cs
var myEnv = builder.Configuration.GetSection("MYENV")?.Value; // hello
```

## 유저 시크릿

유저 시크릿(User secrets)은 git에 체크인되지 않는 코드 베이스 외부에 데이터를 저장하는 또 다른 접근 방식을 취합니다.

먼저 프로젝트 디렉토리로 이동합니다. 다음과 같은 명령을 실행하세요.

```
dotnet user-secrets init
```

이렇게 하면 프로젝트에 대한 고유 ID가 생성되어 아래에 표시되어 있는 것처럼 `.csproj` 파일에 추가됩니다.

```xml [MyApp.csproj]
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UserSecretsId>5bd4c643-9153-4772-aff7-5f92ccbd5739</UserSecretsId>
  </PropertyGroup>
</Project>
```

다음 명령을 사용하여 값을 설정할 수 있습니다.

```
dotnet user-secrets set "ConnectionString:Default" foobar
```

모든 사용자 비밀은 `list` 명령으로 표시할 수 있습니다.

```
dotnet user-secrets list
```

데이터는 `C:\Users\<username>\AppData\Roaming\Microsoft\UserSecrets\<guid>\secrets.json` 파일에 저장됩니다. 여기서 `<guid>`는 디렉토리 이름이며 `.csproj` 파일에 지정된 이름과 일치해야 합니다.

## DotEnv

이것은 JavaScript 프로젝트에서 비밀을 관리하는 인기 있는 방법으로, 비밀은 소스 제어에서 무시되는 `.env`라는 파일에 저장됩니다. 그러나 일반적으로 `.env.example`이라고 하는 파일의 더미 버전은 참조를 위해 로컬 환경을 설정하려는 사용자를 위해 소스 제어에 보관됩니다.

```[.env]
ConnectionStrings__Default="Server=DESKTOP-AB4CDEF;Database=MyDb;Trusted_Connection=True;TrustServerCertificate=True;"
```

예시 파일은 커밋되기 전에 민감한 정보를 삭제해야 합니다.

```[.env.example]
ConnectionStrings__Default="<connection-string>"
```

`dotenv.net`이라는 패키지를 설치합니다.

```
dotnet add package dotenv.net
```

다음 코드를 실행하여 `.env` 파일의 내용을 `builder.Configurations` 객체에 로드합니다.

```cs [Program.cs]
using dotenv.net;
DotEnv.Load();
```

## 우선순위

.NET 구성의 경우, 구성 소스마다 우선순위가 다르며, 우선순위가 낮은 소스에 정의된 값은 우선순위가 높은 소스에 정의된 값으로 덮어쓰입니다.

|     | 소스         | 우선 사항 |
| --- | ------------ | --------- |
| 1.  | JSON 파일    | 가장 낮은 |
| 2.  | User secrets | 낮은      |
| 3.  | 환경 변수    | 중간      |
| 4.  | .env         | 높은      |
| 5.  | 명령줄 인수  | 제일 높은 |

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
organization: Microsoft
title: Safe storage of app secrets in development in ASP.NET Core
url: https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-9.0&tabs=windows
date: 2024, November 5
source: websites
---
::

::apa-reference
---
authors:
 - Abuhakmeh, K # Khalid Abuhakmeh
title: Securing Sensitive Information with .NET User Secrets
url: https://blog.jetbrains.com/dotnet/2023/01/17/securing-sensitive-information-with-net-user-secrets/
date: 2023, January 17
source: websites
---
::

::apa-reference
---
authors:
 - Wildermuth, S # Shawn Wildermuth
title: "Coding Shorts: I Think We Can Do Better Than User Secrets"
url: https://www.youtube.com/watch?v=orQXrNaCZPg
date: 2023, June 17
source: websites
---
::

::apa-reference
---
authors:
 - Patrascu, D # Dan Patrascu
title: How To Keep SECRET Strings REALLY SECRET in ASP.NET Core? 
url: https://www.youtube.com/watch?v=5TxnLU-SXVg
date: 2023, January 29
source: websites
---
::

::apa-reference
---
authors:
 - Moris Gorski, D # Dustin Moris Gorski
title: Using .env in .NET
url: https://dusted.codes/dotenv-in-dotnet
date: 2021, January 10
source: websites
---
::
<!-- prettier-ignore-end -->
