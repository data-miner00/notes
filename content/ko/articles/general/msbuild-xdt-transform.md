---
title: MSBuild XDT 변환
description: MSBuild에 내장된 XDT 변환 도구를 사용하여 XML을 변환합니다
topic: 일반
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - xml
  - msbuild
  - vs
updatedAt: 2026-05-03T02:58:59.000Z
createdAt: 2026-05-03T02:58:59.000Z
---

XML은 Visual Studio에 내장된 XDT 변환 라이브러리를 통해 새 버전으로 변환할 수 있습니다.

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

## 대본

다음과 같은 XML 설정 파일이 있다고 가정해 보겠습니다.

```xml [dev.config.xml]
<website>
  <title>내 사이트</title>
  <environment>개발</environment>
  <url>http://localhost:8080</url>
</website>
```

이 설정은 로컬/개발 환경에만 적용됩니다. 프로덕션 환경에서 사용하려면 설정을 복사하여 붙여넣고 관련 속성만 환경에 맞게 변경하면 됩니다.

```xml [prod.config.xml]
<website>
  <title>내 사이트</title>
  <environment>생산</environment>
  <url>https://www.mysite.com</url>
</website>
```

간단한 설정이라면 괜찮을 수 있습니다. 하지만 설정이 1,000줄이나 된다면 어떨까요? 복사 붙여넣기 방식은 오류 발생 가능성이 높고 유지 관리가 어려워집니다. 또한 일부 속성은 여러 환경에서 재사용되고 공유되므로 모든 속성을 변경할 필요가 없어 중복이 발생합니다.

따라서 복사 붙여넣기 대신 XDT 변환을 사용하여 기본 XML 파일을 확장하는 것이 가능합니다.

## 구문 소개

XDT 변환은 이렇게 생겼습니다. 여전히 XML 파일입니다.

```xml [prod.config.xml]
<?xml version="1.0" encoding="utf-8" ?>
<website xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
  <environment
    xdt:Locator="XPath(//website/environment)"
    xdt:Transform="Replace">생산</environment>
  <url
    xdt:Locator="XPath(//website/url)"
    xdt:Transform="Replace">https://www.mysite.com</url>
</website>
```

여기서 `title`은 모든 환경 출력에서 ​​동일하므로 무시하고 `environment`와 `url`만 변환합니다. `xdt:Locator`는 "원본 요소의 위치"를 나타내고 `xdt:Transform`은 "어떻게 조작할 것인가"를 지정합니다. 이것들이 XDT 변환이 제공하는 기본적인 연산자입니다.

핵심 아이디어는 `prod.config.xml` 파일이 `dev.config.xml` 파일을 기반으로 XDT 변환을 거쳐 마치 복사 붙여넣기처럼 완전한 구조를 가진 결과물을 생성하는 것입니다. 다음 단계에서는 변환 프로세스를 설정하는 방법을 보여줍니다.

## 프로젝트 설정

먼저 Visual Studio에서 `MyXmlTransforms`라는 이름의 빈 콘솔 프로젝트를 생성합니다. 파일 구조는 다음과 같아야 합니다.

```
MyXmlTransforms/
├── MyXmlTransforms.csproj
└── Program.cs
```

그 후 `Program.cs` 파일을 삭제하고 `Base`라는 폴더를 생성한 다음 그 안에 `dev.config.xml` 파일을 넣으세요. 또한 `Prod`라는 폴더를 생성하고 그 안에 `prod.config.xml` 파일을 넣으세요. 마지막으로 `MyXmlTransforms.csproj` 파일을 다음과 같이 업데이트하세요.

```xml [MyXmlTransforms.csproj]
<Project Sdk="Microsoft.NET.Sdk" DefaultTargets="Transform">
	<PropertyGroup>
		<OutputType>Library</OutputType>
		<TargetFramework>net10.0</TargetFramework>
		<ImplicitUsings>enable</ImplicitUsings>
		<Nullable>enable</Nullable>
	</PropertyGroup>

	<PropertyGroup>
		<XdtDll>$(MSBuildExtensionsPath)\Microsoft\VisualStudio\v$(VisualStudioVersion)\Web\Microsoft.Web.Publishing.Tasks.dll</XdtDll>
		<OutputDir>$(MSBuildThisFileDirectory)bin\Output\</OutputDir>
	</PropertyGroup>

	<UsingTask TaskName="TransformXml" AssemblyFile="$(XdtDll)" />

	<ItemGroup>
		<!-- 여기에 항목을 더 추가하세요 -->
		<XmlTransform Include="Config">
			<Source>Base\dev.config.xml</Source>
			<Transform>Prod\prod.config.xml</Transform>
			<Destination>$(OutputDir)prod.config.xml</Destination>
		</XmlTransform>
	</ItemGroup>

	<Target Name="Transform" BeforeTargets="Build">
		<MakeDir Directories="$(OutputDir)" />
		<TransformXml Source="%(XmlTransform.Source)" Transform="%(XmlTransform.Transform)" Destination="%(XmlTransform.Destination)" StackTrace="true" />
		<Message Text="Transformed → %(XmlTransform.Destination)" Importance="high" />
	</Target>
</Project>
```

> `%(...)` 배치 구문은 MSBuild가 항목당 한 번씩 `TransformXml`을 자동으로 실행한다는 것을 의미합니다. 따라서 반복문이 필요하지 않습니다.
> 작업에 `StackTrace="true"` 옵션을 설정하면 변환이 실패할 경우 자세한 오류 출력이 제공되므로 작성 중에 유용합니다.

다음에 핵심 요약입니다.

- Visual Studio에 내장된 `Microsoft.Web.Publishing.Tasks.dll`을 이용한 XDT 변환
- `dev` 및 `prod` 구성 파일을 병합하고 `bin/Output` 디렉터리에 출력하는 변환 파이프라인을 선언합니다.
- 변환할 파일 쌍이 여러 개인 경우, `XmlTransform` 요소를 복제하고 파일에 따라 속성을 채우해세요.

다음으로, 다음 명령어를 사용하여 변환을 실행하세요.

```
msbuild WithXdt.csproj /t:Transform
```

또는 더 간단하게

```
dotnet build
```

파일 트리는 이제 다음과 같아야 합니다.

```
MyXmlTransforms/
├── MyXmlTransforms.csproj
├── Base/
│   └── dev.config.xml
├── Prod/
│   └── prod.config.xml
└── bin/
    └── Output/              <-- 빌드 시점에 생성됨
```

## 일반적인 XDT 변환 속성

여기는 가장 일반적인 변환 속성이 있습니다.

| 대본                 | `xdt:Transform`              | `xdt:Locator`                |
| -------------------- | ---------------------------- | ---------------------------- |
| 속성을 변경하다      | `SetAttributes(attrName)`    | `Match(keyAttr)`             |
| 전체 요소를 교체하다 | `Replace`                    | `Match(...)` or `XPath(...)` |
| 새 요소를 삽입하다   | `Insert`                     | _(필요 없음)_                |
| 요소를 삭제하다      | `Remove`                     | `Match(...)` or `XPath(...)` |
| 속성을 삭제하다      | `RemoveAttributes(attrName)` | `Match(...)`                 |

## 요약

이 가이드에서는 XDT 변환 시나리오, 간단한 구문 및 프로젝트 설정에 대해 설명합니다. 참고 자료로 GitHub의 [유사 프로젝트](https://github.com/data-miner00/Sandbox/tree/master/demo/XmlTransform/WithXdt)를 확인하세요. 폴더 기반 변환에 대해서는 [이 프로젝트](https://github.com/data-miner00/Sandbox/tree/master/demo/XmlTransform/WithXdtBatch)를 참조하세요.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: Web.config Transformation Syntax for Web Project Deployment Using Visual Studio
url: https://sparkbyexamples.com/spark/apache-spark-installation-on-windows/
retrievedDate: 2026, May 3
organization: Microsoft
source: websites
---
::

::apa-reference
---
title: Web Config Transform
url: https://logicwiki.co.uk/Web_Config_Transform
retrievedDate: 2026, May 3
publisher: Logicmade Wiki
source: websites
---
::

::apa-reference
---
authors:
  - Suwat, C
title: Xdt transform samples
url: https://github.com/projectkudu/kudu/wiki/Xdt-transform-samples
date: 2019, August 3
source: websites
---
::

::apa-reference
---
title: XPath Syntax
url: https://www.w3schools.com/xml/xpath_syntax.asp
retrievedDate: 2026, May 3
source: websites
---
::
<!-- prettier-ignore-end -->
