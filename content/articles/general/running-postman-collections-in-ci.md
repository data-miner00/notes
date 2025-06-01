---
title: Running Postman Collections in CI
description: Using the newman CLI to run Postman collections in Azure Pipelines
topic: General
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

[Postman](https://www.postman.com/product/what-is-postman/) is a feature-rich API client for building, managing and testing APIs. It allows people to share their API collections easilly with a JSON export file. It is also a great tool to test against API endpoints and can be integrated into CI environments.

<!--more-->

## Post-response Script

Postman allows custom hooks written in JavaScript that binds to a request for both before and after the API execution. The post-response script can be used to write API integration tests.

It can be found at the section under `scripts` > `Post-response`.

![The screenshot showing the post response script](/images/postman-ci/postman-post-response-script.png)

It will execute the test after the API call and display the test results at a separate tab below.

![The screenshot showing test passed](/images/postman-ci/postman-test-passed.png)

### Examples

We can create a test scenario with `pm.test` and perform assertions in a fluent interface. The example below asserts the response's status code to be 200 OK.

```js
pm.test("Status code should be 200", function () {
  pm.response.to.have.status(200);
});
```

Next, we can retrieve the response's content in JSON to perform assertions as follows.

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

Newman CLI is a command line tool for running Postman Collections. It can be installed from NPM or use as a [Docker container](https://learning.postman.com/docs/collections/using-newman-cli/newman-with-docker/#use-newman-with-docker-on-macos-and-ubuntu).

```
npm i -g newman
```

We can export a Postman collection by clicking on the ellipsis icon of the collection and then the export option. The exported collection will be named as `<Collection Name>.postman_collection.json`.

The example below demonstrates the execution of my collection named [`Hoppscotch.postman_collection.json`](https://github.com/data-miner00/postman/blob/main/collections/Hoppscotch.postman_collection.json) that calls to the Hoppscotch echo endpoint.

```
newman run Hoppscotch.postman_collection.json
```

It will tabulate the results nicely after the execution.

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

Newman CLI can be integrated to Azure Pipelines easily. The example below shows an excerpt of the `azure-pipelines.yml` configuration file for running the Postman collection using `newman`.

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

To execute multiple collections in the script stage, we will need to use `call` for each of them individually. The `-e` flag can be used for collection that requires variables defined in the environments file.

```yaml [azure-pipelines.yml]
- script: |
    call npx newman run collections/Hoppscotch.postman_collection.json
    call npx newman run "collections/JSON Placeholder.postman_collection.json" -e environments/Scratchpad.postman_environment.json
  displayName: "Run integration tests"
```

## Links

- [My postman workspace](https://github.com/data-miner00/postman)
- [Newman GitHub](https://github.com/postmanlabs/newman)
- [Run and test collections from the command line using Newman CLI](https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/)
