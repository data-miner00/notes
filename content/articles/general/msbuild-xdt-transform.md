---
title: MSBuild XDT Transform
description: Transform a XML with the built-in XDT Transformation tool in MSBuild
topic: General
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

XML can be transformed into a new version by going through the XDT transformation library built-in with Visual Studio.

<!--more-->

## Scenario

Imagine we have a XML configuration file that looks like this.

```xml [dev.config.xml]
<website>
  <title>My Website</title>
  <environment>Development</environment>
  <url>http://localhost:8080</url>
</website>
```

The configuration are only for local/development environment. To cater for the production environment, we can just copy and paste the configuration and just change the relevant properties to the environment.

```xml [prod.config.xml]
<website>
  <title>My Website</title>
  <environment>Production</environment>
  <url>https://www.mysite.com</url>
</website>
```

That is fine for minimal configurations. What if we have 1000 lines of configurations? The copy and paste approach becomes error-prone and difficult to maintain. It also creates redundancy as not all of the properties need to be changed as some are reused and shared across different environments.

Hence, what we can do is to extend the base XML file with XDT transform instead of copy pasta.

## Syntax Introduction

This is how a XDT transformation looks like. It is still an XML file.

```xml [prod.config.xml]
<?xml version="1.0" encoding="utf-8" ?>
<website xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
  <environment
    xdt:Locator="XPath(//website/environment)"
    xdt:Transform="Replace">Production</environment>
  <url
    xdt:Locator="XPath(//website/url)"
    xdt:Transform="Replace">https://www.mysite.com</url>
</website>
```

Here, we ignore the `title` because it is the same for all environment output and only transform the `environment` and `url`. The `xdt:Locator` indicates "Where is the original element" and `xdt:Transform` declares "How to manipulate it". These are the fundamental operators that the XDT transformation offers.

The idea is, this `prod.config.xml` will be processed by the XDT Transformation against the `dev.config.xml` and produce a fully structured counterpart just like a copy-paste would produce. The following step shows how to set up the transformation process.

## Project Setup

First, create an empty Console project named `MyXmlTransforms` in Visual Studio. This is how the file tree should look like.

```
MyXmlTransforms/
├── MyXmlTransforms.csproj
└── Program.cs
```

After that, remove the `Program.cs` file and create a folder called `Base` and put the `dev.config.xml` inside as well as a folder `Prod` and put `prod.config.xml` inside. After that update the `MyXmlTransforms.csproj` file to the following.

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
		<!-- Add more pairs here as needed -->
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

> The `%(...)` batching syntax means MSBuild runs `TransformXml` once per item automatically — no loops needed.
> `StackTrace="true"` on the task gives detailed error output if a transform fails — useful while authoring.

Tldr,

- XDT transform powered by the built-in `Microsoft.Web.Publishing.Tasks.dll` from Visual Studio
- Declares a transformation pipeline that merges the `dev` and `prod` config file and outputs to the `bin/Output` directory
- If you have more pairs of file to transform, duplicate the `XmlTransform` element and populate the properties with respect to the file

Then, execute the transformation by using the following commands.

```
msbuild WithXdt.csproj /t:Transform
```

Or simply

```
dotnet build
```

The file tree should now looks like this.

```
MyXmlTransforms/
├── MyXmlTransforms.csproj
├── Base/
│   └── dev.config.xml
├── Prod/
│   └── prod.config.xml
└── bin/
    └── Output/              <-- created at build time
```

## Common XDT Transform Attributes

Here are some of the common XDT operations.

| Scenario               | `xdt:Transform`              | `xdt:Locator`                |
| ---------------------- | ---------------------------- | ---------------------------- |
| Change an attribute    | `SetAttributes(attrName)`    | `Match(keyAttr)`             |
| Replace entire element | `Replace`                    | `Match(...)` or `XPath(...)` |
| Insert new element     | `Insert`                     | _(none)_                     |
| Remove an element      | `Remove`                     | `Match(...)` or `XPath(...)` |
| Remove an attribute    | `RemoveAttributes(attrName)` | `Match(...)`                 |

## Summary

This guide covers the scenario of XDT transformation, simple syntax and project setup. Here is the [similar project](https://github.com/data-miner00/Sandbox/tree/master/demo/XmlTransform/WithXdt) on GitHub for reference. For folder-based transformation, refer to [this project](https://github.com/data-miner00/Sandbox/tree/master/demo/XmlTransform/WithXdtBatch).

## References

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
