---
title: Azure Bicep 설명
description: 마이크로소프트의 최고 수준 IaC (Infrastructure as Code)를 사용하여 Azure 클라우드 리소스 프로비저닝
topic: DevOps
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - cloud
  - iac
  - infra
  - azure
updatedAt: 2026-01-12T15:47:59.000Z
createdAt: 2025-10-12T06:50:49.000Z
---

Bicep은 Azure 네이티브 IaC(Infrastructure as Code) 솔루션으로, ARM 템플릿으로 변환하여 리소스 프로비저닝을 간소화합니다. 읽고 유지 관리하기 쉬운 선언적 도메인 특정 언어(DSL)입니다.

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

## 설치

Bicep 관련 명령을 사용하려면 [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest&pivots=msi)가 필요합니다. 설치 여부를 확인하려면 `az version` 명령을 사용하세요. 설치된 Azure CLI 구성 요소가 JSON 형식으로 표시됩니다.

```json
{
  "azure-cli": "2.77.0",
  "azure-cli-core": "2.77.0",
  "azure-cli-telemetry": "1.1.0",
  "extensions": {}
}
```

그 후, `bicep install` 명령어를 사용하여 Bicep 모듈을 설치합니다.

```
az bicep install
```

그러면 다음과 같은 결과가 출력됩니다.

```
Installing Bicep CLI v0.37.4...
The configuration value of bicep.use_binary_from_path has been set to 'false'.
Successfully installed Bicep CLI to "C:\Users\User\.azure\bin\bicep.exe".
```

설치된 버전을 확인하려면 `bicep version` 명령을 사용하세요.

```
az bicep version
```

업그레이드하려면 다음을 실행하세요.

```
az bicep upgrade
```

## 기본 사용법

Bicep에서 리소스를 선언하는 구문은 다음과 같습니다. `resource` 키워드는 뒤따르는 내용이 리소스 선언임을 나타냅니다. `<Variable>`은 프로비저닝된 리소스에 대한 참조를 저장하며, 스크립트에서 이후에 사용할 수 있습니다. `<ResourceType>`는 유효한 Azure 리소스 유형으로, [템플릿 페이지](https://learn.microsoft.com/en-us/azure/templates/)의 `참조` 섹션에서 해당 범주별로 확인할 수 있습니다. `<DateVersion>`은 리소스 프로비저닝에 사용할 API 버전을 나타냅니다. 각 선언 블록 내에서 리소스를 구성하는 매개변수와 해당 값을 지정할 수 있습니다.

```bicep
resource <Variable> '<ResourceType>@<DateVersion>' = {
  parameter: value
  parameter2: value2
  ...
}
```

다음은 스토리지 계정을 선언하는 예시입니다.

```bicep [main.bicep]
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'mydemostorage'
  location: 'eastus'
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}
```

이 파일은 `deployment group create` 명령을 실행하여 실행할 수 있습니다. `<existing-resource-group>`은 기존 리소스 그룹의 이름을 나타냅니다.

```
az deployment group create \
  --template-file main.bicep \
  --resource-group <existing-resource-group>
```

위 명령어는 `main.bicep` 파일을 리소스 그룹 수준에서 배포합니다. 반면에 아래 명령은 `sub` 하위 명령을 사용하여 구독 수준에서 `main.bicep`을 프로비저닝합니다.

```
az deployment sub create --location eastus --template-file main.bicep
```

## 기본 구문

프로그래밍 언어와 마찬가지로 Bicep은 변수, 반복문, 모듈 및 함수를 사용하여 코드를 효율적이고 재사용 가능하게 만드는 방법을 제공합니다. Bicep에서는 세미콜론을 사용하지 않습니다.

### 변수

변수는 `var` 키워드를 사용하여 선언할 수 있습니다. 변수 선언 시 문자열 보간을 사용할 수도 있습니다. 아래 예시는 스토리지 계정의 위치 변수를 이름 선언의 일부로 사용하는 방법을 보여줍니다.

```bicep [main.bicep]
var storageAccountLocation = 'eastus'
var storageAccountName = 'mydemostorage${storageAccountLocation}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}
```

변수에는 지원되는 모든 [데이터 형식](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/data-types)을 저장할 수 있습니다.

### 반복문

루프를 사용하면 코드를 반복하지 않고도 배열을 활용하여 여러 리소스를 배포할 수 있습니다. 예를 들어, 배열에 지정된 여러 위치에 각각 다른 스토리지 계정을 생성할 때 루프를 사용할 수 있습니다. 배열의 요소는 줄 바꿈 문자(`\n`) 또는 쉼표(`,`)로 구분할 수 있습니다.

```bicep
var regions1 = ['eastus', 'northeurope', 'uksouth']
var regions2 = [
  'southeastasia'
  'westeurope'
]
```

아래는 `regions1` 배열을 사용하여 `eastus`, `northeurope`, `uksouth` 지역에 스토리지 계정을 배포하는 예시입니다. 이름은 Azure 전체에서 고유해야 하므로 인덱스 또는 지역 이름을 사용하여 이름을 생성해야 합니다.

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = [for (region, index) in regions1: {
  name: 'mystorage${region}${index}'
  location: region
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}]
```

### If 문

if 문은 리소스를 조건부로 배포하는 데 사용할 수 있습니다. 예를 들어 특정 지역에서만 필요한 리소스가 있을 수 있습니다. 이 경우 조건절을 사용하여 해당 리소스를 배포하도록 할 수 있습니다.

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = if (region == 'uksouth') {
  name: 'mystorage${region}${index}'
  location: region
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}
```

### 함수

Bicep은 지원하는 데이터 형식을 조작하기 위한 다양한 내장 함수를 제공합니다. 다음은 문자열 및 배열 유형에 사용되는 몇 가지 함수의 예입니다. 전체 함수 목록은 [공식 문서](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/bicep-functions)에서 확인할 수 있습니다.

문자열은 `concat` 함수를 사용하여 연결할 수 있으며, `toUpper` 함수를 사용하여 대문자로 변환할 수 있습니다.

```bicep
var hello string = 'hello'
var helloWorld string = concat(toUpper(hello), ', world!') // HELLO, world!
```

배열은 `union` 함수를 사용하여 중복 없이 병합할 수 있습니다.

```bicep
var array1 = [1, 2, 3]
var array2 = [2, 3, 4]

var result = union(array1, array2) // [1, 2, 3, 4]
```

`func` 키워드를 사용하면 입력값을 받아 출력값을 반환하는 사용자 정의 함수를 만들 수 있습니다.

```bicep
func prefixName(prefix string, name string) string => '${prefix}_${name}'
func add(num1 int, num2 int) int => num1 + num2
```

### 모듈

모듈을 사용하면 관련 리소스를 논리적인 방식으로 그룹화하여 리소스 아키텍처를 정확하게 표현할 수 있습니다. 모듈은 **매개변수**, **리소스** 및 **출력**이라는 세 가지 주요 부분으로 구성됩니다.

매개변수는 호출자가 전달하는 데이터이며, `param` 키워드로 표시됩니다. 리소스는 모듈에 의해 실제로 생성될 리소스이며, 출력은 호출자가 필요로 할 수 있는 생성된 리소스에 대한 중요한 정보(예: 리소스 ID)입니다.

아래 예시는 [App Service 또는 웹 앱](https://azure.microsoft.com/en-us/products/app-service)을 배포하는 모듈입니다. App Service는 [App Service 플랜](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans)이 필요하므로, 이 모듈은 해당 플랜도 함께 프로비저닝합니다.

```bicep [appService.bicep]
@description('모든 리소스의 위치입니다.')
param location string

@description('앱 서비스 플랜의 이름.')
param appServicePlanName string

@description('웹 앱의 이름.')
param webAppName string

@description('배포 환경.')
@allowed([ 'dev', 'prod' ])
param environmentType string

@description('모든 리소스에 적용할 태그.')
param tags object = {}

var appServicePlanSkuName = (environmentType == 'prod') ? 'P2V3' : 'F1'

resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSkuName
  }
  tags: tags
}

resource webApp 'Microsoft.Web/sites@2024-11-01' = {
  name: webAppName
  location: location
  properties:{
    serverFarmId: appServicePlan.id
    httpsOnly: true
  }
  tags: tags
}

@description('웹 앱의 기본 호스트 이름')
output webAppHostName string = webApp.properties.defaultHostName
```

첫 두 줄은 이 모듈이 `location`이라는 이름의 문자열 타입 매개변수를 입력으로 받으며, `@description` 어노테이션을 사용하여 필수 매개변수의 의미를 설명한다는 것을 나타냅니다.

또한 `appServicePlanSkuName`에서는 삼항 연산자를 사용하여 `environmentType` 환경 유형에 따라 필요한 SKU를 결정하는데, 일반적으로 프로덕션 환경에서는 더 강력한 컴퓨팅 성능이 필요하기 때문입니다.

그런 다음, 제공된 매개변수와 변수를 사용하여 `appServicePlan`이라는 상징적인 이름으로 App Service Plan을 프로비저닝하고, `serverFarmId: appServicePlan.id` 줄에서 해당 App Service Plan 아래에 웹 앱을 프로비저닝합니다.

마지막으로, 새로 생성된 웹 앱의 `webAppHostName`을 반환합니다.

이것이 모듈 사용 방법입니다.

```bicep [main.bicep]
module appService 'modules/appService.bicep' = {
  name: 'appService'
  params: {
    location: location
    appServicePlanName: appServicePlanName
    webAppName: webAppName
    environmentType: environmentType
    tags: tags
  }
}
```

반환된 값은 `outputs` 속성을 호출하여 사용할 수 있습니다.

```bicep [main.bicep]
// 이 변수는 원하는 곳 어디든 사용할 수 있습니다.
var appName = appService.outputs.webAppHostName
```

전체 코드는 제 [GitHub 저장소](https://github.com/data-miner00/infra/tree/master/bicep)에서 확인할 수 있습니다.

### 기존 자원

Bicep은 리소스를 다시 프로비저닝할 필요 없이 기존 리소스를 참조할 수 있습니다. 아래와 같이 `existing` 키워드를 사용하여 선언할 수 있습니다.

```bicep [main.bicep]
var exampleRG = 'example-rg'

resource existingStorage 'Microsoft.Storage/storageAccounts@2025-06-01' existing = {
  name: 'examplestorage'
  scope: resourceGroup(exampleRG)
}
```

## 메인 파일 매개변수화

메인 파일도 `param` 키워드를 사용하여 매개변수화할 수 있습니다.

```bicep [main.bicep]
@allowed([
  'dev'
  'prod'
])
param environment string

module appService 'modules/appService.bicep' = {
  name: 'appService'
  params: {
    location: location
    appServicePlanName: appServicePlanName
    webAppName: webAppName
    environmentType: environment // 여기에는 사용 되요
    tags: tags
  }
}
```

그런 다음 배포 명령에서 `--parameters` 플래그를 사용하여 개별 매개변수를 지정할 수 있습니다.

```
az deployment group create \
  --resource-group my-rg \
  --template-file main.bicep \
  --parameters environment=dev
```

주요 배포 파일에 매개변수가 많은 경우, 명령줄에서 하나씩 전달하는 대신 `.bicepparam` 확장자로 끝나는 [Bicep 매개변수 파일](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/parameter-files?tabs=Bicep)을 사용하여 매개변수를 코드로 저장할 수 있습니다. 이 파일은 Docker에서 `docker-compose.yml` 파일이 작동하는 방식과 매우 유사합니다.

아래 예시는 `main.dev.bicepparam` 파일에서 `main.bicep` 모듈에 대한 환경을 정의합니다.

```bicep [main.dev.bicepparam]
use 'main.bicep'

param environment = 'dev'
```

그런 다음 배포 시에는 `parameter` 명령을 사용하여 이 매개변수 파일을 참조하기만 하면 됩니다.

```
az deployment group create \
  --resource-group my-rg \
  --parameters main.dev.bicepparam
```

## 도구

### VS Code 확장 프로그램

Bicep은 구문 강조 표시, 인텔리센스, 유효성 검사 및 배포 구성을 이해하는 데 매우 유용한 리소스 시각화 도구를 제공하는 [VS Code 확장 프로그램](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep)을 제공합니다.

![VSCode 확장 프로그램에 리소스 시각화](/images/bicep/bicep-vscode-extension-visualizer.png)

### 린팅

Bicep 파일은 `lint` 명령을 사용하여 린팅할 수 있습니다.

```
az bicep lint --file <your-bicep-file>
```

### 포맷팅

Bicep 파일은 `format` 명령을 사용하여 제자리에서 형식을 지정할 수 있습니다.

```
az bicep format --file <your-bicep-file>
```

### 빌딩

Bicep 파일은 build 명령을 사용하여 JSON 형식의 ARM 템플릿으로 컴파일할 수 있습니다. 대안적으로 `--outdir` 플래그를 사용하여 빌드 디렉토리를 지정할 수도 있습니다.

```
az bicep build --file <your-bicep-file> --outdir <outdir>
```

Bicep 매개변수 파일은 `build-params` 명령어를 사용하여 생성할 수 있습니다.

```
az bicep build --file <your-bicepparam-file> --outdir <outdir>
```

## What-If

`what-if` 명령어를 사용하여 변경 사항을 적용하기 전에 환경의 리소스에 어떤 변화가 발생하는지 미리 확인할 수 있습니다. 이를 통해 배포 과정에서 발생할 수 있는 의도치 않은 데이터 손실을 방지할 수 있습니다.

```
az deployment group what-if --resource-group my-rg --template-file main.bicep
```

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
organization: Microsoft
title: Bicep documentation
url: https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/
retrievedDate: 2026, January 12
source: websites
---
::

::apa-reference
---
authors:
 - Rathnayake, K # Kamal Rathnayake
title: "Azure Bicep Crash Course | Step by Step | All in One"
url: https://www.youtube.com/watch?v=mKG5d9rnaYg
date: 2023, January 10
source: websites
---
::

::apa-reference
---
organization: Microsoft
title: Fundamentals of Bicep
url: https://learn.microsoft.com/en-us/training/paths/fundamentals-bicep/
retrievedDate: 2025, October 12
source: websites
---
::
<!-- prettier-ignore-end -->
