---
title: WPF Dependency Injection
description: Configure WPF application to become DI aware with Autofac
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

Dependency Injection is a common practice to receive external functionalities that a dependant needs instead of creating their own. This practice can be further extended to incorporate [Inversion of Control (IoC)](https://www.educative.io/answers/what-is-inversion-of-control) to use a container for managing said dependencies.

<!--more-->

In this short guide, I will demonstrate the steps for configuring a Windows Presentation Foundation (WPF) application to use [Autofac](https://autofac.org/) as its IoC container.

## Versions Used

This demonstration is tested with the technologies with the following versions:

| Index | Technology                              | Version        |
| ----- | --------------------------------------- | -------------- |
| 1.    | dotnet CLI                              | 7.0.304        |
| 2.    | Target Framework                        | net6.0-windows |
| 3.    | Autofac                                 | 7.1.0          |
| 4.    | Autofac.Configuration                   | 6.0.0          |
| 5.    | Microsoft.Extensions.Configuration      | 7.0.0          |
| 6.    | Microsoft.Extensions.Configuration.Json | 7.0.0          |

## Create IoC Container

First, create a class file named `ContainerConfig.cs`. This is the place for registering dependencies and any other startup configuration.

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

## Store the Container

Navigate to `App.xaml.cs`, the entry point of the application to store the IoC container.

```cs[App.xaml.cs]
using System.Windows;
using Autofac;

public partial class App : Application
{
	public static IContainer Container { get; private set; } = ContainerConfig.Configure();

	public static ILifetimeScope Scope { get; private set; } = Container.BeginLifetimeScope();
}
```

Next, override the `OnStartup` to call the main window for display through the DI container and dispose the container `OnExit`.

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

## Remove Auto Startup

By default, the application will call the `MainWindow` automatically on startup. The catch is, this `MainWindow` is not managed by the DI container. As a result, we end up having **2** separate `MainWindow` open during the startup.

To fix that, head over to `App.xaml` to remove `StartupUri` property.

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

This will only run one instance of `MainWindow` that is managed by the DI container.

## Using Dependencies

With the DI container properly set up, we can now use the dependencies freely in the project as long as the dependencies are properly registered in the `ContainerConfig.cs` file.

Here is a trivial example with `MainWindow.xaml.cs`. Try to keep the `this.InitializeComponent` method call on the top of the constructor to prevent exception of manipulating the form element when the form is not initialized.

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

## Add Configurations

To use a JSON configuration file like `appsettings.json` in the WebApi project, we can configure them as well.

Let's say we have a configuration file named `appsettings.json` that has the following contents.

```json[appsettings.json]
{
	"MyConfig": {
		"Sleep": 1000,
		"Theme": "dark"
	}
}
```

We need to create the options file that reflect the `MyConfig` section. So, create a file named `MyConfigOption.cs` with the following contents.

```cs[MyConfigOption.cs]
public class MyConfigOption
{
	public int Sleep { get; set; }
	public string Theme { get; set; }
}
```

Finally, register the `appsettings.json` file in `ContainerConfig.cs` and resolve the configuration option for usage.

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

		  // Get the deserialized config of `MyConfig` section.
+         var myConfig = config.GetSection("MyConfig").Get<MyConfigOption>();

		  // Console.WriteLine(myConfig.Theme);

		  // register services required
		  builder.RegisterType<MyHandler>().As<IHandler>().SingleInstance();
		  builder.RegisterType<MyService>().As<IService>().SingleInstance();

		  // register the forms required
		  builder.RegisterType<MainWindow>().SingleInstance();

		  return builder.Build();
	  }
  }
```

## References

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
