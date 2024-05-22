---
title: WPF 의존성 주입
description: WPF 프로그렘을 Autofac 의존성 주입 설정
topic: C#
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - wpf
  - csharp
  - autofac
updatedAt: 2024-03-24T08:28:42.756Z
createdAt: 2023-11-04T08:28:42.756Z
---

의존성 두입은 종속 항목을 직접 만드는 대신 종속 항목에 필요한 외부 기능을 수신하는 일반적인 방법입니다. 이 방식은 [IoC (Inversion of Control)](https://www.educative.io/answers/what-is-inversion-of-control)를 통합하여 해당 종속성을 관리하기 위한 컨테이너를 사용하도록 더욱 확장될 수 있습니다.

<!--more-->

이 짧은 가이드에서는 [Autofac](https://autofac.org/)을 IoC 컨테이너로 사용하도록 WPF(Windows Presentation Foundation) 애플리케이션을 구성하는 단계를 설명합니다.

## 사용된 버전

이 데모는 다음 버전의 기술로 테스트되었습니다.

| 색인 | 기술                                    | 버전           |
| ---- | --------------------------------------- | -------------- |
| 1.   | dotnet CLI                              | 7.0.304        |
| 2.   | Target Framework                        | net6.0-windows |
| 3.   | Autofac                                 | 7.1.0          |
| 4.   | Autofac.Configuration                   | 6.0.0          |
| 5.   | Microsoft.Extensions.Configuration      | 7.0.0          |
| 6.   | Microsoft.Extensions.Configuration.Json | 7.0.0          |

## IoC 컨테이너 만두기

먼저 `ContainerConfig.cs`라는 클래스 파일을 만듭니다. 의존송 및 기타 시작 구성을 등록하는 곳입니다.

```cs[ContainerConfig.cs]
using Autofac;

internal static class ContainerConfig
{
	public static IContainer Configure()
	{
		var builder = new ContainerBuilder();

		// register services required
		builder.RegisterType<MyHandler>().As<IHandler>().SingleInstance();
		builder.RegisterType<MyService>().As<IService>().SingleInstance();

		// register the forms required
		builder.RegisterType<MainWindow>().SingleInstance();

		return builder.Build();
	}
}
```

## 컨테이너를 유지

IoC 컨테이너를 저장할 애플리케이션의 진입점인 `App.xaml.cs`로 이동합니다.

```cs[App.xaml.cs]
using System.Windows;
using Autofac;

public partial class App : Application
{
	public static IContainer Container { get; private set; } = ContainerConfig.Configure();

	public static ILifetimeScope Scope { get; private set; } = Container.BeginLifetimeScope();
}
```

그 다음에 `OnStartup`을 재정의하여 DI 컨테이너를 통해 표시할 기본 창을 호출하고 `OnExit` 컨테이너를 삭제합니다.

```cs[App.xaml.cs]
protected override void OnStartup(StartupEventArgs e)
{
	var mainWindow = Scope.Resolve<MainWindow>();
	mainWindow.Show();

	base.OnStartup(e);
}

protected override void OnExit(ExitEventArgs e)
{
	Container.Dispose();

	base.OnExit(e);
}
```

## 자동 시작 제거

기본적으로 애플리케이션은 시작 시 자동으로 `MainWindow`를 호출합니다. 문제는 이 `MainWindow`가 DI 컨테이너에 의해 관리되지 않는다는 것입니다. 결과적으로 시작하는 동안 **2**개의 별도 `MainWindow`가 열려 있게 됩니다.

이 문제를 해결하려면 `App.xaml`로 이동하여 `StartupUri` 속성을 제거하세요.

```diff[App.xaml]
  <Application x:Class="MyWpfApp"
               xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
               xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
-              xmlns:local="clr-namespace:MyWpfApp"
+              xmlns:local="clr-namespace:MyWpfApp">
-              StartupUri="MainWindow.xaml">
      <Application.Resources>

      </Application.Resources>
  </Application>
```

그러면 DI 컨테이너가 관리하는 `MainWindow` 인스턴스 하나만 실행됩니다.

## 종속성 사용

DI 컨테이너가 올바르게 설정되었으므로 이제 `ContainerConfig.cs` 파일에 종속성이 올바르게 등록되어 있는 한 프로젝트에서 종속성을 자유롭게 사용할 수 있습니다.

다음은 `MainWindow.xaml.cs`를 사용한 간단한 예입니다. 양식이 초기화되지 않을 때 양식 요소 조작 예외를 방지하려면 생성자 상단에 `this.InitializeComponent` 메소드 호출을 유지하십시오.

```cs[MainWindow.xaml.cs]
public partial class MainWindow : Window
{
	private readonly IHandler handler;
	private readonly IService service;

	public MainWindow(IHandler handler, IService service)
	{
		this.InitializeComponent();

		this.handler = handler;
		this.service = service;
	}
}
```

## 구성 추가

WebApi 프로젝트에서 `appsettings.json`과 같은 JSON 구성 파일을 사용하기 위해 구성할 수도 있습니다.

다음 내용을 포함하는 `appsettings.json`이라는 구성 파일이 있다고 가정해 보겠습니다.

```json[appsettings.json]
{
	"MyConfig": {
		"Sleep": 1000,
		"Theme": "dark"
	}
}
```

`MyConfig` 섹션을 반영하는 옵션 파일을 생성해야 합니다. 따라서 다음 내용으로 `MyConfigOption.cs`라는 파일을 만듭니다.

```cs[MyConfigOption.cs]
public class MyConfigOption
{
	public int Sleep { get; set; }
	public string Theme { get; set; }
}
```

마지막으로 `ContainerConfig.cs`에 `appsettings.json` 파일을 등록하고 사용을 위한 구성 옵션을 해결합니다.

```diff[ContainerConfig.cs]
  using Autofac;
+ using Autofac.Configuration;
+ using Microsoft.Extensions.Configuration;

  internal static class ContainerConfig
  {
	  public static IContainer Configure()
	  {
		  var builder = new ContainerBuilder();

+   	  var configBuilder = new ConfigurationBuilder();
+         configBuilder.AddJsonFile("appsettings.json");

+         var config = configBuilder.Build();
+         var module = new ConfigurationModule(configBuilder.Build());
+         builder.RegisterModule(module);

		  // `MyConfig` 섹션의 역직렬화된 구성을 가져옵니다.
+         var myConfig = config.GetSection("MyConfig").Get<MyConfigOption>();

		  // Console.WriteLine(myConfig.Theme);

		  // 필요한 서비스 등록
		  builder.RegisterType<MyHandler>().As<IHandler>().SingleInstance();
		  builder.RegisterType<MyService>().As<IService>().SingleInstance();

		  // 필요한 양식 등록
		  builder.RegisterType<MainWindow>().SingleInstance();

		  return builder.Build();
	  }
  }
```

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Hasan, F # Fatima Hasan
title: What is Inversion of Control
publisher: Educative
retrievedDate: 2024, March 24
url: https://www.educative.io/answers/what-is-inversion-of-control
source: websites
---
::

::apa-reference
---
authors:
 - Corey, T # Tim Corey
title: Dependency Injection in WPF in .NET 6 Including the Factory Pattern
publisher: Youtube
url: https://www.youtube.com/watch?v=dLR_D2IJE1M
date: 2022, July 18
source: websites
---
::

::apa-reference
---
authors:
 - Akbari, S # Salah Akbari
 - Andrew, S
title: "Error: No matching constructor found on type"
date: 2016, December 26
url: https://stackoverflow.com/questions/41327777/error-no-matching-constructor-found-on-type
source: websites
---
::
<!-- prettier-ignore-end -->
