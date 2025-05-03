---
title: E-Tag
topic: Web
description: The way of versioning resources through the internet
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - http
  - header
  - caching
updatedAt: 2025-04-20T14:04:34.000Z
createdAt: 2024-05-13T00:32:00.000Z
---

ETag (entity tag) is a HTTP response header that is used to identify the version of a resource and is part of the **HTTP/1.1** specification. When a request is sent to a remote server with the ETag, the server can compare the ETag value to tell whether a particular resource is changed or remains the same. If the ETag value is the same, the server will respond with status code 304 without the requested content.

<!--more-->

This behaviour facilitate efficient caching and conditional requests, which in turn reduces bandwidth usage and improve web performance. Additionally, ETag can be used for preventing a race-condition on multiple simultaneous request trying to update the target resource. This phenomenon is referred to as "mid-air collision".

## How E-Tag Works

1. **Generation**: The server first generates a unique identifier for a particular resource such as an user object. This is typically a hash or fingerprint of the content. If the object has been updated, the unique identifier changes too.
2. **Validation**: For subsequent requests of the same resources, the client will send over the ETag value through the `If-None-Match` header.
3. **Comparison**: The server compares the client ETag value with the current ETag value computed by the server and decides if it is the same and will return either `304 Not Modified` or `200 OK` depending on the comparison result.

### Node.js Example

The following code shows how ETag (strong) can be implemented in Express.js.

```js [index.js]
app.get('/api/user/:id', (req, res) => {
	const user = getUser(req.params.id);
	const etag = '"' + hash(user) + '"';

	if (req.headers['if-none-match'] === etag) {
		return res.status(304).end();
	}

	res.set('ETag', etag);
	res.json(user);
});
```

## Strong and Weak E-Tags

ETags have two flavors:

- **Strong ETags**: Guarantee byte-for-byte identity between representations. This means that the ETag is derived from the entirety of the resource itself.

```
ETag: "abc123"
```

- **Weak ETags**: Indicate semantic equivalence but not byte-for-byte identity, prefixed with `W/`

```
ETag: W/"abc123"
```

<!-- prettier-ignore-start -->
::callout
---
type: info
title: Quoted ETags
---
Note that the ETag must be enclosed within double quotes.
::
<!-- prettier-ignore-end -->

Consider the following example `user` resource.

```json
{
  "name": "Shaun",
  "age": 27
}
```

The following table shows how strong and weak ETag can be used.

| Flavour | Properties used to compute ETag | ETag         | Description                |
| ------- | ------------------------------- | ------------ | -------------------------- |
| Strong  | All properties                  | `"Abc123"`   | Exact match is required    |
| Weak    | Only `name`                     | `W/"Abc124"` | Partial match is tolerated |

## Problems with E-Tag

### Load Balancer

![Diagram that shows the conflicts of ETag generation from multiple servers behind a load balancer](/images/etag/ETagLoadBalancerConflicts.excalidraw.png)

When ETag is used with load balancer that serves as a reverse proxy for multiple server instance, the ETag that comes from individual server might be different, even through the resource has not been modified. The ETag here is basically useless and causing overheads to the client and server.

The fix to this is to configure web servers to generate deterministic ETags.

### Minor Complication

It is complicated to implement the environment that is aware of ETag. The client needs to have the logic to send the request with the `If-None-Match` header and the server is required to handle the corresponding header as well.

![The diagram that shows the flow of ETag for Client and Server](/images/etag/ETagComplication.excalidraw.png)

### Unethical Tracking

[Hulu and other big names](https://www.lexology.com/library/detail.aspx?g=cfd44331-0c27-4c37-aeb0-d31b7f7c729e) uses ETag to track their user. Unlike cookies that can be easily accessed and deleted by the user, ETag is fully managed by the browser. Unless the user is tech-savvy enough to delete the ETag header manually before firing a request, there is basically no way to circumvent that.

![The diagram that shows how tracking can be abused by ETag](/images/etag/ETagTracking.excalidraw.png)

The company spawns some unsolicited resource, such as an image of 1 pixel to the user with the ETag and decides to always return the 304 when the browser receives the request. This behaviour essentially establishes a **session** with the server that is capable to track the activities of the user on the browser, such as the movies watched by the user.

## References

<!-- prettier-ignore-start -->
::apa-reference
---
organization: Mozilla
title: ETag
url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag
retrievedDate: 2025, April 20
source: websites
---
::

::apa-reference
---
organization: Wikipedia
title: HTTP ETag
url: https://en.wikipedia.org/wiki/HTTP_ETag
retrievedDate: 2025, April 20
source: websites
---
::

::apa-reference
---
authors:
  - Nasser, H # Hussien Nasser
title: "HTTP Caching with E-Tags - (Explained by Example)"
url: https://www.youtube.com/watch?v=TgZnpp5wJWU
date: 2018, August 20
source: websites
---
::

::apa-reference
---
publisher: Lexology
title: "Privacy suit filed over use of ETags "
url: https://www.lexology.com/library/detail.aspx?g=cfd44331-0c27-4c37-aeb0-d31b7f7c729e
date: 2011, August 19
source: websites
---
::
<!-- prettier-ignore-end -->
