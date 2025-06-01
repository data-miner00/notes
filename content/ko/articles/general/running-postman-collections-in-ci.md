---
title: CI에서 Postman 컬렉션에서 실행
description: Azure Pipelines에서 Postman 컬렉션을 실행하기 위해 newman CLI 사용
topic: 일반
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - api
  - integration
  - azure
updatedAt: 2025-05-10T12:32:13.000Z
createdAt: 2025-05-10T12:32:13.000Z
---

[Postman](https://www.postman.com/product/what-is-postman/)은 API 구축, 관리 및 테스트를 위한 풍부한 기능을 갖춘 API 클라이언트입니다. JSON 내보내기 파일을 통해 API 컬렉션을 쉽게 공유할 수 있습니다. 또한 API 엔드포인트를 테스트하는 데 유용한 도구이며 CI 환경에 통합할 수 있습니다.

<!--more-->

## 사후 응답 스크립트

Postman은 API 실행 전후 모두 요청에 바인딩되는 JavaScript로 작성된 사용자 지정 후크를 허용합니다. 응답 후 스크립트를 사용하여 API 통합 테스트를 작성할 수 있습니다.

해당 내용은 `scripts` > `Post-response` 섹션에서 찾을 수 있습니다.

![응답 후 스크립트를 보여주는 스크린샷](/images/postman-ci/postman-post-response-script.png)

API 호출 후 테스트를 실행하고 아래의 별도 탭에 테스트 결과를 표시합니다.

![테스트가 통과되었음을 보여주는 스크린샷](/images/postman-ci/postman-test-passed.png)

### 예시

`pm.test`를 사용하여 테스트 시나리오를 생성하고 Fluent 인터페이스에서 어설션을 수행할 수 있습니다. 아래 예제는 응답의 상태 코드를 200 OK로 어설션합니다.

```js
pm.test("Status code should be 200", function () {
  pm.response.to.have.status(200);
});
```

다음으로, 다음과 같이 어설션을 수행하기 위해 JSON 형식의 응답 내용을 검색할 수 있습니다.

```js
pm.test("Should have correct JSON response body", function () {
  const content = pm.response.json();

  pm.expect(content).to.be.an('object');

  pm.expect(content['title']).to.be.eql('foo');
  pm.expect(content['body']).to.be.eql('bar');
  pm.expect(content['userId']).to.be.eql(1);
});
```

## Newman CLI

Newman CLI은 Postman 컬렉션을 실행하기 위한 명령줄 인터페이스입니다. 이는 NPM에서 설치하거나 [도커 컨테이너로](https://learning.postman.com/docs/collections/using-newman-cli/newman-with-docker/#use-newman-with-docker-on-macos-and-ubuntu) 사용할 수 있습니다.

```
npm i -g newman
```

Postman 컬렉션을 내보내려면 컬렉션의 줄임표 아이콘을 클릭한 다음 내보내기 옵션을 클릭하세요. 내보낸 컬렉션의 이름은 `<컬렉션 이름>.postman_collection.json`입니다.

아래 예제는 Hoppscotch echo 엔드포인트를 호출하는 [`Hoppscotch.postman_collection.json`](https://github.com/data-miner00/postman/blob/main/collections/Hoppscotch.postman_collection.json)이라는 컬렉션을 실행하는 방법을 보여줍니다.

```
newman run Hoppscotch.postman_collection.json
```

실행 후에는 결과가 깔끔하게 표로 정리됩니다.

```
Hoppscotch

→ Echo
  GET https://echo.hoppscotch.io [200 OK, 1.84kB, 754ms]
  √  Status code should be 200
  √  Should contain method

┌─────────────────────────┬────────────────────┬───────────────────┐
│                         │           executed │            failed │
├─────────────────────────┼────────────────────┼───────────────────┤
│              iterations │                  1 │                 0 │
├─────────────────────────┼────────────────────┼───────────────────┤
│                requests │                  1 │                 0 │
├─────────────────────────┼────────────────────┼───────────────────┤
│            test-scripts │                  1 │                 0 │
├─────────────────────────┼────────────────────┼───────────────────┤
│      prerequest-scripts │                  0 │                 0 │
├─────────────────────────┼────────────────────┼───────────────────┤
│              assertions │                  2 │                 0 │
├─────────────────────────┴────────────────────┴───────────────────┤
│ total run duration: 798ms                                        │
├──────────────────────────────────────────────────────────────────┤
│ total data received: 1.2kB (approx)                              │
├──────────────────────────────────────────────────────────────────┤
│ average response time: 754ms [min: 754ms, max: 754ms, s.d.: 0µs] │
└──────────────────────────────────────────────────────────────────┘
```

## Azure Pipelines

Newman CLI는 Azure Pipelines에 쉽게 통합할 수 있습니다. 아래 예는 `newman`을 사용하여 Postman 컬렉션을 실행하기 위한 `azure-pipelines.yml` 구성 파일의 일부를 보여줍니다.

```yaml [azure-pipelines.yml]
steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "22.x"
    displayName: "Install Node.js"

  - script: npm install
    displayName: "Install dependencies"

  - script: npx newman run collections/Hoppscotch.postman_collection.json
    displayName: "Run integration tests"
```

스크립트 단계에서 여러 컬렉션을 실행하려면 각 컬렉션에 대해 `call`을 개별적으로 사용해야 합니다. 환경 파일에 정의된 변수가 필요한 컬렉션에는 `-e` 플래그를 사용할 수 있습니다.

```yaml [azure-pipelines.yml]
- script: |
    call npx newman run collections/Hoppscotch.postman_collection.json
    call npx newman run "collections/JSON Placeholder.postman_collection.json" -e environments/Scratchpad.postman_environment.json
  displayName: "Run integration tests"
```

## 링크

- [내 postman 작업 공간](https://github.com/data-miner00/postman)
- [Newman의 GitHub](https://github.com/postmanlabs/newman)
- [Run and test collections from the command line using Newman CLI](https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/)
