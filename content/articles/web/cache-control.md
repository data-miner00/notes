---
title: Cache-Control
topic: Web
description: A quick explanation of how the Cache-Control HTTP Header works
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - http
  - header
  - cache
updatedAt: 2024-06-21T23:45:58.363Z
createdAt: 2024-06-21T23:45:58.363Z
---

The `cache-control` HTTP header field specifies how the caching mechanism can be done for that particular resource across the client (e.g. browsers) and shared caches (e.g. Proxies, CDNs).

<!--more-->

```
   Client <------ CDN <------ Server
     ↓             ↓            ↓
[Web Browser] [Shared Cache] [Origin Server]
```

## Syntax

The syntax for cache directives are as follows:

1. Directives are case insensitive, but all-lowercase is recommended as some implementation is **not case-insensitive**.
2. Multiple directives must be chained together with comma as the separator. (e.g. `cache-control: private, max-age=180`)
3. Optional argument for directives must be delimited by an equal sign, such as `max-age=180`.

## Directives

Directives are the valid values that can be populated into the `cache-control` header.

### `max-age`

```
   Client <------ CDN <------ Server
   max-age      max-age
```

The `max-age=N` in a response indicates that the response remains fresh for $N$ seconds after the response is generated from the server (not receive on client) and can be used for subsequent requests while the response cache is still fresh. The `Age` header will be included by the browser for subsequent requests to the same resource.

```
Cache-Control: max-age=604800
Age: 888
```

### `s-maxage`

```
   Client <------ CDN <------ Server
               s-maxage
```

The `s-maxage` is used to specify it's validity/freshness in a shared cache. It is ignored by private caches and takes precedence over the `max-age` and `Expires` header if specified for the shared cache.

```
Cache-Control: s-maxage=604800
```

### `no-store`

```
   Client <------ CDN <------ Server
     ✗             ✗
```

A response that contains `no-store` directive cannot be stored anywhere, including the browser and the shared cache. A request of identical properties must be hitting the server to get the latest data. This is typically used for sensitive info such as authentication tokens.

### `no-cache`

```
   Client <------ CDN <------ Server
     ↓             ↓
  Revalidate   Revalidate
```

This directive means that the cached version must not be used immediately after retrieving out from the cache. It must be revalidated on it's validity with the server first before it can be used. This is typically done by comparing [[E-Tag]] of the cached resource with the server's.

### `must-revalidate`

```
   Client <------ CDN <------ Server
     ↓             ↓
  Revalidate   Revalidate
```

`must-revalidate` indicates the response can be stored in caches and be reused for subsequent requests. However, if the response becomes stale, it must be validated with the origin server before use.

It is typically used in conjunction with `max-age`.

```
Cache-Control: max-age=604800, must-revalidate
```

### `proxy-revalidate`

```
   Client <------ CDN <------ Server
                   ↓
               Revalidate
```

Behaviour identical to `must-revalidate`, but it only applies to the shared cache. Private browser cache remains unaffected.

### `private`

```
   Client <------ CDN <------ Server
     ✓             ✗
```

The `private` response directive indicates that the response can only be stored by client's local cache but not publicly shared cache.

```
Cache-Control: private
```

### `public`

```
   Client <------ CDN <------ Server
     ✓             ✓
```

The `public` response directive indicates that the response can be stored on both local and shared cache.

```
Cache-Control: public
```

### `no-transform`

```
   Client <------ CDN <------ Server
     ✗             ✗
  Transform    Transform
```

This directive indicates that the resource must be served to the client as-is without any altering or transforming by intermediaries such as resizing image.

## References

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Shayan, T
title: "Cache-Control: Cheat Sheet."
date: 2024, March 14
url: https://shayy.org/posts/cache-control/
source: websites
---
::

::apa-reference
---
organization: MDN Web Docs
title: Cache-Control
retrievedDate: 2024, June 22
url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
source: websites
---
::

::apa-reference
---
organization: Cloudflare
title: "What is cache-control? | Cache explained"
retrievedDate: 2024, June 22
url: https://www.cloudflare.com/learning/cdn/glossary/what-is-cache-control/
source: websites
---
::

::apa-reference
---
authors:
 - Jxck
title: "Cache-Control: must-understand ディレクティブとは何か"
date: 2021, February 12
url: https://blog.jxck.io/entries/2021-02-12/cache-control-must-understand.html
source: websites
---
::
<!-- prettier-ignore-end -->
