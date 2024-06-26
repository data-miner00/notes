---
title: Swagger in AspNetCore WebApi
description: A walkthrough on adding description and examples to an endpoint with Swagger in AspNetCore WebApi project
topic: C#
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - api
  - docs
  - swagger
updatedAt: 2023-11-01T11:21:03.209Z
createdAt: 2023-11-01T11:21:03.209Z
---

In this blog, I have condensed the correct steps to enrich the Swagger page by modifying the description and adding examples, starting off with a sample project.

<!--more-->

## Version Check

The versions of the technologies used for demonstration are as follows:

| Index | Technology                         | Version |
| ----- | ---------------------------------- | ------- |
| 1.    | dotnet CLI                         | 7.0.304 |
| 2.    | Target Framework                   | net6.0  |
| 3.    | Swashbuckle.AspNetCore             | 6.5.0   |
| 4.    | Swashbuckle.AspNetCore.Annotations | 6.5.0   |
| 5.    | Swashbuckle.AspNetCore.Filters     | 7.0.12  |

## Setting up

First, we will use the weather API template provided by .NET console.

```
dotnet new webapi -o WeatherApi
```

### Installing Dependencies

After the project has been generated, verify the `Swashbuckle.AspNetCore` package has already been installed either by looking at the `.csproj` file or NuGet explorer in Visual Studio.

There are two more Swagger dependencies that we'll need.

- `Swashbuckle.AspNetCore.Annotations`
- `Swashbuckle.AspNetCore.Filters`

As a side note, if we are using an older version of Swagger, we might need to install different packages listed above. The different versioning of the packages tripped me off a few times already. Here is the [reference](https://github.com/mattfrear/Swashbuckle.AspNetCore.Filters#where-to-get-it) table for the `Filters` package to be installed.

## Swagger UI

In the `WeatherForecastController.cs`, there should be an existing endpoint similar to this.

```cs[WeatherForecastController.cs]
[HttpGet(Name = "GetWeatherForecast")]
public IEnumerable<WeatherForecast> Get()
{
	return Enumerable.Range(1, 5).Select(index => new WeatherForecast
	{
		Date = DateTime.Now.AddDays(index),
		TemperatureC = Random.Shared.Next(-20, 55),
		Summary = Summaries[Random.Shared.Next(Summaries.Length)]
	})
	.ToArray();
}
```

The resulting Swagger page looks like this. As we can see, there is an example response being displayed.

![The default Swagger page](/images/swagger-aspnetcore/1.api-default.png)

We can change the method signature to `async` and the Swagger page will still show the same content.

```cs[WeatherForecastController.cs]
[HttpGet(Name = "GetWeatherForecast")]
public async Task<IEnumerable<WeatherForecast>> Get()
{
	// Pretending there is some async code execution
	return await Task.FromResult(Enumerable.Range(1, 5).Select(index => new WeatherForecast
	{
		Date = DateTime.Now.AddDays(index),
		TemperatureC = Random.Shared.Next(-20, 55),
		Summary = Summaries[Random.Shared.Next(Summaries.Length)]
	})
	.ToArray());
}
```

## Modifying Response Description

To modify the description text from the default `Success` for HTTP Code `200` to something else, we need to use the `Swashbuckle.AspNetCore.Annotations` library.

Head over to `Program.cs` and modify the `AddSwaggerGen` method call as follows to enable the feature.

```diff[Program.cs]
- builder.Services.AddSwaggerGen();
+ builder.Services.AddSwaggerGen(opt =>
+ {
+     opt.EnableAnnotations();
+ });
```

Next, go back to the endpoint and add the annotation for HTTP codes that are applicable.

```diff[WeatherForecastController.cs]
+ using System.Net;
+ using Swashbuckle.AspNetCore.Annotations;

  [HttpGet(Name = "GetWeatherForecast")]
+ [SwaggerResponse((int)HttpStatusCode.OK, "Successfully retrieved info.")]
+ [SwaggerResponse((int)HttpStatusCode.NotFound, "Info not found.")]
  public async Task<IEnumerable<WeatherForecast>> Get()
  {
	  // Pretending there is some async code execution
```

![Description of status code changed](/images/swagger-aspnetcore/2.modified-description.png)

The descriptions of each HTTP codes are now modified according to what was specified in the annotation.

## Adding Examples

To add examples, we will need to enable the Swagger to support this in the `Program.cs` as well.

```diff[Program.cs]
+ using System.Reflection;
+ using Swashbuckle.AspNetCore.Filters;

  builder.Services.AddSwaggerGen(opt =>
  {
      opt.EnableAnnotations();
+     opt.ExampleFilters();
  });

+ builder.Services.AddSwaggerExamplesFromAssemblies(Assembly.GetEntryAssembly());
```

After that, create an example file named `WeatherForecastExample.cs` and populate the file with the following contents. Note that this is the code which you will need to exclude from code coverage too.

```cs[WeatherForecastExample.cs]
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Swashbuckle.AspNetCore.Filters;

[ExcludeFromCodeCoverage]
public class WeatherForecastSingleExample : IExamplesProvider<IEnumerable<WeatherForecast>>
{
	public IEnumerable<WeatherForecast> GetExamples()
	{
		return new[]
		{
			new WeatherForecast
			{
				Date = DateTime.Now,
				Summary = "Chilly",
				TemperatureC = 32,
			},
			new WeatherForecast
			{
				Date = DateTime.Now,
				Summary = "Sweltering",
				TemperatureC = 40,
			},
		};
	}
}
```

Navigate back to the controller file and add the following annotation to the endpoint.

```diff[WeatherForecastController.cs]
+ using Swashbuckle.AspNetCore.Filters;

  [HttpGet(Name = "GetWeatherForecast")]
  [SwaggerResponse((int)HttpStatusCode.OK, "Successfully retrieved info.")]
  [SwaggerResponse((int)HttpStatusCode.NotFound, "Info not found.")]
+ [SwaggerResponseExample((int)HttpStatusCode.OK, typeof(WeatherForecastExample))]
  public async Task<IEnumerable<WeatherForecast>> Get()
  {
	  // Pretending there is some async code execution
```

![Added response to Swagger](/images/swagger-aspnetcore/3.added-example.png)

The examples on the Swagger page for that endpoint will be updated to match the example file.

## Using IActionResult

If we try to wrap the endpoint response in an `IActionResult`, the example response will disappear. I think that Swagger can't serialize the response because the `IActionResult` response has already serialized the actual object.

```diff[WeatherForecastController.cs]
  [HttpGet(Name = "GetWeatherForecast")]
  [SwaggerResponse((int)HttpStatusCode.OK, "Successfully retrieved info.")]
  [SwaggerResponse((int)HttpStatusCode.NotFound, "Info not found.")]
  [SwaggerResponseExample((int)HttpStatusCode.OK, typeof(WeatherForecastExample))]
- public async Task<IEnumerable<WeatherForecast>> Get()
+ public async Task<IActionResult> Get()
  {
      // Pretending there is some async code execution
-     return await Task.FromResult(Enumerable.Range(1, 5).Select(index => new WeatherForecast
+     return this.Ok(await Task.FromResult(Enumerable.Range(1, 5).Select(index => new WeatherForecast
      {
          Date = DateTime.Now.AddDays(index),
          TemperatureC = Random.Shared.Next(-20, 55),
          Summary = Summaries[Random.Shared.Next(Summaries.Length)]
      })
-     .ToArray());
+     .ToArray()));
  }
```

The Swagger page will now looks like this.

![Example missing due to IActionResult](/images/swagger-aspnetcore/4.example-missing.png)

To fix that, add an additional annotation to the endpoint as follows.

```diff[WeatherForecastController.cs]
  [SwaggerResponse((int)HttpStatusCode.NotFound, "Info not found.")]
  [SwaggerResponseExample((int)HttpStatusCode.OK, typeof(WeatherForecastExample))]
+ [ProducesResponseType(typeof(WeatherForecastExample), (int)HttpStatusCode.OK)]
  public async Task<IActionResult> Get()
  {
      // Some async code execution
```

The example should show up again in the Swagger page.

## References

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Kirsten
title: Swagger not generating model for object wrapped by IActionResult
url: https://stackoverflow.com/questions/53105513/swagger-not-generating-model-for-object-wrapped-by-iactionresult
date: 2018, November 1
source: websites
---
::

::apa-reference
---
authors:
 - Frear, M # Matt Frear
title: Swagger.AspNetCore.Filters
url: https://github.com/mattfrear/Swashbuckle.AspNetCore.Filters
retrievedDate: 2024, March 26
source: websites
---
::

::apa-reference
---
authors:
 - Rob
title: ASP.net Core - SwaggerResponseExample not outputting specified example
url: https://stackoverflow.com/questions/61896978/asp-net-core-swaggerresponseexample-not-outputting-specified-example
date: 2020, May 19
source: websites
---
::

::apa-reference
---
authors:
 - Singhal, N # Nitesh Singhal
title: Multiple Request/Response examples for Swagger UI in ASP.NET core
url: https://medium.com/@niteshsinghal85/multiple-request-response-examples-for-swagger-ui-in-asp-net-core-864c0bdc6619
publisher: Medium
date: 2022, January 25
source: websites
---
::

::apa-reference
---
title: Swagger Petstore
url: https://petstore.swagger.io/#/
retrievedDate: 2024, March 26
publisher: Swagger
source: websites
---
::
<!-- prettier-ignore-end -->
