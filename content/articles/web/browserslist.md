---
title: Browserslist
description: Quick runthrough on what Browserslist is about
topic: Web
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - polyfill
  - angular
  - browser
  - babel
updatedAt: 2025-01-30T17:13:52.193Z
createdAt: 2025-01-29T04:45:45.206Z
---

In older Angular project, there is a mysterious file named `.browserslistrc` (formerly known as `browserslist`) in the root folder. For years, I've been ignoring the file until recently when my colleague bring this to my attention.

<!--more-->

In my current blog which is written in Nuxt 3.6, I have this warning message which I conveniently turned over a blind eye too.

```
 WARN  Browserslist: caniuse-lite is outdated. Please run:                           8:11:02 am
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
```

## Summary

Simply put, Browserslist is a tool to target specific audience that will use the application (in a browser) so that tools like [autoprefixer](https://github.com/postcss/autoprefixer) and [babel](https://babeljs.io/) perform polyfill and optimizations accordingly.

As we've all known, there are a myriad of internet browsers out there, and the most prominent ones are no other than Google Chrome, raking in around 68% of the market share as of the time writing according to data from [statcounter](https://gs.statcounter.com/browser-market-share).

Moreover, different versions of the same browser are still being used, including those that are severely outdated, albeit insignificant. Hence, it is imperative to consider the audience of the website to cater for and make decisions on which browsers and versions to support.

### Toolchains

Modern web tooling uses browserslist to target their compilation targets.

- Autoprefixer: Adds vendor prefixes to CSS properties for browser compatibility.
- Babel: Transpiles modern JavaScript to older versions supported by your target browsers.
- PostCSS: A tool for transforming CSS with JavaScript.
- Webpack: A module bundler that can optimize code based on your target browsers.

## Configuration File

The browsers and their versions that needs to be supported for the web application inside a configuration file named `.browserslistrc` or inside `package.json`. The default `.browserslistrc` file looks like this

```[.browserslist]
> 0.5%
last 2 versions
Firefox ESR
not dead
```

Here is the same queries written within `package.json` with the key `browserslist`.

```json [package.json]
{
  "browserslist": [
    "> 0.5%",
    "last 2 versions",
    "Firefox ESR",
    "not dead"
  ]
}
```

The syntax felt arcane, but it's actually a list of targets (a.k.a [queries](https://github.com/browserslist/browserslist?tab=readme-ov-file#queries)) that the project will be compiled to. It can be the target to a specific version of the browser or the operating system. Refer to the [full list](https://github.com/browserslist/browserslist?tab=readme-ov-file#full-list) for all supported queries.

Here are the breakdown of the queries on above.

- Browsers with a global usage share of more than 0.5%.
- The last two major versions of all known browsers.
- The current Extended Support Release (ESR) of Firefox.
- Browsers that are not considered "dead" (no longer receiving security updates).

The queries above are actually the default compilation target used by browserslist. It can be replaced with the `defaults` keyword.

```json [package.json]
{
  "browserslist": [
    "defaults"
  ]
}
```

If you are not sure what your target audience is, the best bet is to use the defaults. You can skip the configuration altogether and the tools will infer the default queries themselves.

## Advantages

Using Browserslist improves browser compatibility. It is able to transpile newer features or syntax to the older way of doing the same thing and works on older version of the browser. The process seemed seamless.

Moreover, it can reduce the bundle size by shipping only whatever that is necessary to the browser, without generic polyfills that some browser might not even need, hence improving performance altogether.

## Tools

- [browsersl.ist](https://browsersl.ist)
- [browserslist.dev](https://browserslist.dev/)

## References

<!-- prettier-ignore-start -->
::apa-reference
---
title: Shared browser compatibility config for popular JavaScript tools like Autoprefixer, Babel, ESLint, PostCSS, and Webpack
url: https://browsersl.ist
retrievedDate: 2025, January 31
source: websites
---
::

::apa-reference
---
title: Browserslist
url: https://github.com/browserslist/browserslist
retrievedDate: 2025, January 31
source: websites
---
::
<!-- prettier-ignore-end -->
