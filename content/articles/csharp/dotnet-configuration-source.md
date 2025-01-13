---
title: Configuration Source in .NET Core
description: A short guide on managing secrets with configuration in .NET Core
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

During project development, we will inevitable came across secrets such as API Key, connection string or passwords when integrating with 3rd-party services. Here are a few common ways to manage them.

<!--more-->

## No management

The simplest way is to place the secrets directly in the source code. This can extremely useful for some quick and dirty stuffs but is never a good idea for any serious project.

```cs
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer("Server=DESKTOP-AB4CDEF;Database=MyDb;Trusted_Connection=True;TrustServerCertificate=True;"));
```

## Using JSON

A custom JSON configuration file can be used for separating the configurables from the source code. It is by no means a great place to store sensitive information too, but a great start to introduce environment specific variables.

First, need to install the `Microsoft.Extensions.Configuration.Abstractions` package.

```
dotnet add package Microsoft.Extensions.Configuration.Abstractions --version 9.0.0
```

Then, create a file named `settings.json` or `appsettings.json` in the project with some values in it.

```json [appsettings.json]
{
  "ConnectionStrings": {
    "Default": "Server=DESKTOP-AB4CDEF;Database=MyDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

The files need to be registered with `AddJsonFile` method to load it's values.

```cs
builder.Configuration
    .AddJsonFile("appsettings.json")
    .AddJsonFile($"appsettings.{environment.EnvironmentName}.json");
```

There are a couple ways to retrieve a single value from the custom JSON file. The example below shows three ways to retrieve the default connection string from the file.

```cs
var connectionString = builder.Configuration["ConnectionStrings:Default"];
// or
var connectionString = builder.Configuration.GetSection("ConnectionString:Default").Value;
// or
var connectionString = builder.Configuration.GetConnectionString("Default");
```

### Options Pattern

Multiple values inside the JSON file can be grouped logically in a single object. This promotes readability and cohesion to the values.

For example, given this is a class named `MySettings` representing some variables required by the application.

```cs [MySettings.cs]
public class MySettings
{
    public string ConnectionString { get; set; }
    public int TimeoutInSeconds { get; set; }
}
```

We can add the following section in the `appsettings.json` that mirrors the `MySettings` class.

```json [appsettings.json]
{
  "mySettings": {
    "connectionString": "My secure connection string;",
    "timeoutInSeconds": 10
  }
}
```

After that, we can copy the values into the `MySettings` object as follows.

```cs [Program.cs]
var mySettings = new MySettings();
builder.Configuration.GetSection("MySettings").Bind(mySettings);
// or
var mySettings = builder.Configuration.GetSection(nameof(MySettings)).Get<MySettings>();
```

## Environment Variables

Environment variables are the variables that exists in the user or machine level outside the project. The .NET Configuration will also read the environment variables into memory during instantiation.

In PowerShell, can retrieve the list of available environments variable.

```ps1
Get-ChildItem env:* | Sort-Object name
```

A temporary environment variable can be created as follows.

```ps1
$env:MYENV=foobar
```

When running the .NET project with the same PowerShell session, it is also able to pick up within the app.

```cs
var myEnv = builder.Configuration.GetSection("MYENV").Value; // foobar
```

Another way is to specify in the `environmentVariables` section of the target profile in the `launchSettings.json`. This is helpful for AspNetCore Mvc or WebApi projects that uses the `launchSettings.json` file to launch the project.

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

## Command Line Arguments

Command line arguments is another way that Configuration will be used.

```
dotnet run --MYENV foobar
```

We can provide the command line arguments in the `launchSettings.json` as well.

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

## User Secrets

User secrets takes another approach for storing the data outside the repository, that will not be checked into source control.

First, go to the project directory.

```
dotnet user-secrets init
```

This will generate a unique Id for the project and added into the `.csproj` file as shown below.

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

The value can be set with the following syntax.

```
dotnet user-secrets set "ConnectionString:Default" foobar
```

All user secrets can be retrieved with the `list` command.

```
dotnet user-secrets list
```

The data is stored in the `C:\Users\<username>\AppData\Roaming\Microsoft\UserSecrets\<guid>\secrets.json` file, where the `<guid>` is a directory name that should match the ones designated in the `.csproj` file.

## DotEnv

This is a popular way of managing secrets in the JavaScript projects, where the secrets are placed in a file called `.env` that is ignored from source control. However, the dummy version of the file, commonly called as `.env.example` is kept in the source control for users who wants to setup the local environment for reference.

```[.env]
ConnectionStrings__Default="Server=DESKTOP-AB4CDEF;Database=MyDb;Trusted_Connection=True;TrustServerCertificate=True;"
```

The example file should redact any sensitive information before being committed.

```[.env.example]
ConnectionStrings__Default="<connection-string>"
```

Install the package named `dotenv.net`.

```
dotnet add package dotenv.net
```

Then, load the contents in the `.env` file into the `builder.Configurations` object by running the following code.

```cs [Program.cs]
using dotenv.net;
DotEnv.Load();
```

## Order of Precedence

For .NET Configurations, different configuration source have different priority, where values defined in the lower priority source gets overwritten by the ones in the higher priority.

|     | Source                 | Priority |
| --- | ---------------------- | -------- |
| 1.  | JSON file              | Lowest   |
| 2.  | User secrets           | Low      |
| 3.  | Environment variables  | Medium   |
| 4.  | .env load              | High     |
| 5.  | Command line arguments | Highest  |

## References

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
