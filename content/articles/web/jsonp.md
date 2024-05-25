---
title: JSONP
topic: Web
description: Brief introduction to the legacy data fetching technique used to bypass same-origin policy
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - javascript
  - json
  - cors
  - legacy
updatedAt: 2024-03-24T13:17:10.163Z
createdAt: 2023-10-25T13:47:56.869Z
---

JSONP, also known as JSON with Padding, is a technique for requesting data without being intercepted by Cross-Origin Resource Sharing (CORS) policy. Essentially, we can bypass the CORS check enforced by the browser by using this method. Based on my own experience, a lot of Chinese websites still use this technique to fetch data.

<!--more-->

## Scenario

Let's say our web application is hosted at `www.a.com` and one of the JavaScript code is trying to fetch data from a remote server hosted at `www.b.com`. If the remote server does not reply the query with a `Access-Control-Allow-Origin` header set to `*` or `www.a.com`, the browser, upon receiving and interpreting the response will throw an error and reject the requested data.

## Solution

### Option 1: Configure CORS

The safest and the most common way to resolve the issue is by configuring the CORS properly on the back-end server by setting the `Access-Control-Allow-Origin` header to point to the appropriate domains. If the resources are hosted on the cloud like Azure, GCP or AWS, they would have settings to enable CORS as well.

### Option 2: Using JSONP

With JSONP, there are a specific set of rules that we need to follow to utilize the response received.

## Format

Here is an example data in raw JSON format at `https://a.com/sample.json`.

```json
{
  "name": "Jane",
  "age": 14,
  "school": "Stanford High School"
}
```

Here is the data in JSONP format at the URL `https://a.com/sample?callback=callback`.

```js
callback({
  name: 'Jane',
  age: 14,
  school: 'Stanford High School',
})
```

Essentially, it is just a JavaScript function call to the requested data and the function name can be modified by the `callback` query parameter. The callback function is what we called "Padding". For example, if we make a call to `https://a.com/sample?callback=cb`, the returned data will be enclosed by the `cb` function.

```js
cb({
  name: 'Jane',
  age: 14,
  school: 'Stanford High School',
})
```

One important caveat to notice is that, whatever the callback function name provided, the function must exist in order to make any meaningful use of the data provided. Otherwise, an error will be thrown.

```
Uncaught ReferenceError: <method> is not defined
```

## Usage

To use the requested data, simply define the JavaScript callback function with the same name provided to the query parameter and make sure that the function is defined before the JSONP data is loaded.

```js
function callback(data) {
  // Do anything with the data
  console.log(data)
}
```

## Showcase in HTML

Here is how it looks like in the HTML.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>JSONP Showcase</title>
  </head>
  <body>
    <script type="text/javascript">
      function myFunction(data) {
        console.log(data)
      }
    </script>

    <!-- Fetching JSONP data with a script tag just like normal Js -->
    <script
      type="text/javascript"
      src="https://a.com/mydata?callback=myFunction"
    ></script>
  </body>
</html>
```

## Uncaching

JSONP calls are subjected to caching by the browser for optimization if the `<script src="https://constant-static-url">` is constant. To prevent the browser from caching the stale data, we have to generate the callback function name dynamically by using `Math.random`.

```js
window.onload = function () {
  var randomNum = Math.floor(100_000 * Math.random())
  var functionName = 'cb_' + randomNum

  window[functionName] = function (data) {
    console.log(data)
  }

  // We need to dynamically generate the script tag
  var newScriptTag = document.createElement('script')
  newScriptTag.src = 'https://a.com/mydata?callback=' + functionName

  document.body.appendChild(newScriptTag)
}
```

With this approach, the browser will request for the latest data most of the time.

### Cleanup

We can optionally remove the script tag that is dynamically generated as the data is already consumed by the browser.

```js
window.onload = function () {
  var randomNum = Math.floor(100_000 * Math.random())
  var functionName = 'cb_' + randomNum

  window[functionName] = function (data) {
    console.log(data)
  }

  // We need to dynamically generate the script tag
  var newScriptTag = document.createElement('script')
  newScriptTag.id = 'script_' + functionName
  newScriptTag.src = 'https://a.com/mydata?callback=' + functionName

  document.body.appendChild(newScriptTag)
  document.getElementById(newScriptTag.id).remove()
}
```

The cleanup will make the call to JSONP look seamless.

## Pros and Cons

### Advantages

- Cross-domain request: Able to escape the bounds enforced by CORS policy.
- Easy to use: Just use the `<script>` tag in HTML without convoluted setup codes.
- Great browser compatibility: Because it is just JavaScript function call, every browser supports it.

### Disadvantages

- Security risk: Might be abused by malicious code due to its vulnerable nature.
- No error handling: If any error arises, e.g. function not defined or server not responding, there is no way to handle the errors other than throwing the said error to the console.
- Depends on server: If the server does not provide the JSONP endpoint then there is no way to use JSONP.
- Only supports GET request: As we already know that JSONP request is just using the `<script>` tag, there is no way to support other HTTP methods other than GET.

## Reference

<!-- prettier-ignore-start -->
::apa-reference
---
title: JSONP
publisher: Wikipedia
url: https://en.wikipedia.org/wiki/JSONP
retrievedDate: 2024, March 24
source: websites
---
::

::apa-reference
---
authors:
 - Maccana, M. # mikemaccana
 - Cheeso
title: What is JSONP, and why was it created?
url: https://stackoverflow.com/questions/2067472/what-is-jsonp-and-why-was-it-created 
date: 2019, February 27
source: websites
---
::

::apa-reference
---
authors:
 - Cieślar, M # Maciej Cieślar
title: "JSONP demystified: What it is and why it exists" 
url: https://blog.logrocket.com/jsonp-demystified-what-it-is-and-why-it-exists/
date: 2019, November 21
source: websites
publisher: LogRocket
---
::

::apa-reference
---
authors:
 - Vinod
title: Understanding JSONP
url: https://www.youtube.com/watch?v=3AoeiQa8mY8
date: 2015, April 2
source: websites
---
<!-- prettier-ignore-end -->
