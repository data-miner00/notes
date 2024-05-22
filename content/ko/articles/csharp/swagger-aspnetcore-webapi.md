---
title: AspNetCore WebApi에서 Swagger 설정
description: AspNetCore WebApi 프로젝트에서 Swagger를 사용하여 엔드포인트에 설명 및 예제를 추가하는 방법에 대한 가이드
topic: C#
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - api
  - docs
  - swagger
updatedAt: 2024-05-22T07:47:13.902Z
createdAt: 2023-11-01T11:21:03.209Z
---

이 블로그에서는 샘플 프로젝트부터 시작하여 설명을 수정하고 예제를 추가하여 Swagger 페이지를 풍부하게 만드는 올바른 단계를 요약했습니다.

<!--more-->

> 저는 이제 아직 한국어 잘 못했으니까 이 기사는 구글 번역은 많이 사용했어서 잘못된 문법과 어휘는 있으니 죄송합니다.

## 사용된 버전

시연에 사용된 기술의 버전은 다음과 같습니다.

| 색인 | 기술                               | 버전    |
| ---- | ---------------------------------- | ------- |
| 1.   | dotnet CLI                         | 7.0.304 |
| 2.   | Target Framework                   | net6.0  |
| 3.   | Swashbuckle.AspNetCore             | 6.5.0   |
| 4.   | Swashbuckle.AspNetCore.Annotations | 6.5.0   |
| 5.   | Swashbuckle.AspNetCore.Filters     | 7.0.12  |

## 설정

먼저 날씨 API 템플릿을 사용하겠습니다.

```
dotnet new webapi -o WeatherApi
```

### 패키지 설치

프로젝트가 생성된 후 `.csproj` 파일이나 Visual Studio의 NuGet 탐색기를 확인하여 `Swashbuckle.AspNetCore` 패키지가 이미 설치되어 있는지 확인하세요.

필요한 Swagger 패키지를 두 가지 더 있습니다.

- `Swashbuckle.AspNetCore.Annotations`
- `Swashbuckle.AspNetCore.Filters`

참고로 이전 버전의 Swagger를 사용하는 경우 위에 나열된 다른 패키지를 설치해야 할 수도 있습니다. 패키지의 다른 버전 관리로 인해 이미 몇 번이나 당황했습니다. 맞는 설정한 패키지 버전 링크는 [여기입니다](https://github.com/mattfrear/Swashbuckle.AspNetCore.Filters#where-to-get-it).

## Swagger UI

`WeatherForecastController.cs` 파일 안내서 이런 엔드포인트 있어야 합니다.

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

결과 Swagger 페이지는 다음과 같습니다. 보시다시피 예시 응답이 표시됩니다.

![기본 Swagger 페이지](/images/swagger-aspnetcore/1.api-default.png)

메서드는 `async` 키워드 추가 수 있으면 Swagger 페이지에는 여전히 동일한 내용이 표시됩니다.

```cs[WeatherForecastController.cs]
[HttpGet(Name = "GetWeatherForecast")]
public async Task<IEnumerable<WeatherForecast>> Get()
{
	// 비동기 코드 여기에 실행
	return await Task.FromResult(Enumerable.Range(1, 5).Select(index => new WeatherForecast
	{
		Date = DateTime.Now.AddDays(index),
		TemperatureC = Random.Shared.Next(-20, 55),
		Summary = Summaries[Random.Shared.Next(Summaries.Length)]
	})
	.ToArray());
}
```

## 응답 설명 수정

설명 텍스트를 HTTP 코드 `200`의 기본 `Success`에서 다른 것으로 수정하려면 `Swashbuckle.AspNetCore.Annotations` 라이브러리를 사용해야 합니다.

`Program.cs`로 이동하여 `AddSwaggerGen` 메서드 호출을 다음과 같이 수정하여 기능을 활성화합니다.

```diff[Program.cs]
- builder.Services.AddSwaggerGen();
+ builder.Services.AddSwaggerGen(opt =>
+ {
+     opt.EnableAnnotations();
+ });
```

그런 다음 엔드포인트로 돌아가 적용 가능한 HTTP 코드에 대한 주석을 추가합니다.

```diff[WeatherForecastController.cs]
+ using System.Net;
+ using Swashbuckle.AspNetCore.Annotations;

  [HttpGet(Name = "GetWeatherForecast")]
+ [SwaggerResponse((int)HttpStatusCode.OK, "Successfully retrieved info.")]
+ [SwaggerResponse((int)HttpStatusCode.NotFound, "Info not found.")]
  public async Task<IEnumerable<WeatherForecast>> Get()
  {
	  // 비동기 코드 여기에 실행
```

![변경된 상태 코드 설명](/images/swagger-aspnetcore/2.modified-description.png)

이제 각 HTTP 코드의 설명은 주석에 지정된 내용에 따라 수정됩니다.

## 예시 추가

예제를 추가하려면 `Program.cs`에서도 이를 지원하도록 Swagger를 활성화해야 합니다.

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

그런 다음 `WeatherForecastExample.cs` 라는 예제 파일을 만들고 파일을 다음 내용으로 채웁니다. 이는 코드 적용 범위에서도 제외해야 하는 코드입니다.

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

컨트롤러 파일로 다시 이동하여 엔드포인트에 다음 주석을 추가합니다.

```diff[WeatherForecastController.cs]
+ using Swashbuckle.AspNetCore.Filters;

  [HttpGet(Name = "GetWeatherForecast")]
  [SwaggerResponse((int)HttpStatusCode.OK, "Successfully retrieved info.")]
  [SwaggerResponse((int)HttpStatusCode.NotFound, "Info not found.")]
+ [SwaggerResponseExample((int)HttpStatusCode.OK, typeof(WeatherForecastExample))]
  public async Task<IEnumerable<WeatherForecast>> Get()
  {
	  // 비동기 코드 여기에 실행
```

![Swagger에 응답 예시를 추가되었습니다](/images/swagger-aspnetcore/3.added-example.png)

해당 엔드포인트에 대한 Swagger 페이지의 예제는 예제 파일과 일치하도록 업데이트됩니다.

## IActionResult를 사용하다

엔드포인트 응답을 `IActionResult`로 래핑하려고 하면 예제 응답이 사라집니다. `IActionResult` 응답이 이미 실제 개체를 직렬화했기 때문에 Swagger가 응답을 직렬화할 수 없는 것 같습니다.

```diff[WeatherForecastController.cs]
  [HttpGet(Name = "GetWeatherForecast")]
  [SwaggerResponse((int)HttpStatusCode.OK, "Successfully retrieved info.")]
  [SwaggerResponse((int)HttpStatusCode.NotFound, "Info not found.")]
  [SwaggerResponseExample((int)HttpStatusCode.OK, typeof(WeatherForecastExample))]
- public async Task<IEnumerable<WeatherForecast>> Get()
+ public async Task<IActionResult> Get()
  {
	  // 비동기 코드 여기에 실행
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

이제 Swagger 페이지는 다음과 같습니다. IActionResult로 인해 예제가 누락되었습니다.

![IActionResult로 인해 예제가 누락되었습니다.](/images/swagger-aspnetcore/4.example-missing.png)

이 문제를 해결하려면 다음과 같이 엔드포인트에 어노테이션을 추가하세요.

```diff[WeatherForecastController.cs]
  [SwaggerResponse((int)HttpStatusCode.NotFound, "Info not found.")]
  [SwaggerResponseExample((int)HttpStatusCode.OK, typeof(WeatherForecastExample))]
+ [ProducesResponseType(typeof(WeatherForecastExample), (int)HttpStatusCode.OK)]
  public async Task<IActionResult> Get()
  {
	  // 비동기 코드 여기에 실행
```

Swagger 페이지에 예제가 다시 표시되어야 합니다.

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
