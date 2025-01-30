---
title: Browserslist
description: Browserslist가 무엇인지에 대한 간단한 설명
topic: 웹
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

이전 Angular 프로젝트에서 루트 폴더에 `.browserslistrc`(이전에는 `browserslist`로 알려짐)라는 신비한 파일이 있습니다. 수년 동안 저는 최근에 제 동료가 이 문제를 제게 알려줄 때까지 이 파일을 무시해 왔습니다.

<!--more-->

게다가, Nuxt 3.6으로 작성된 현재 블로그에는 다음과 같은 경고 메시지가 있는데, 저는 편리하게도 눈감아주었습니다.

```
 WARN  Browserslist: caniuse-lite is outdated. Please run:                           8:11:02 am
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
```

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 부인 성명
---
한국어 실력이 부적하여 이 기사는 구글 번역기를 주로 활용했기 때문에 부정확한 문법과 어휘가 있을수 있습니다. 이 점 양해 부탁드리며, 추후에 다시 검토하여 수정하도록 하겠습니다.
::
<!-- prettier-ignore-end -->

## 요약

간단히 말해서, Browserslist는 브라우저에서 애플리케이션을 사용할 특정 대상 고객을 타겟팅하는 도구로, [autoprefixer](https://github.com/postcss/autoprefixer) 및 [babel](https://babeljs.io/)과 같은 도구가 이에 따라 폴리필과 최적화를 수행합니다.

우리가 알고 있듯이 세상에는 수많은 종류의 인터넷 브라우저가 있고, 가장 유명한 것은 바로 Google Chrome입니다. [statcounter](https://gs.statcounter.com/browser-market-share)의 데이터에 따르면 이 글을 쓰는 시점을 기준으로 시장 점유율이 약 68%에 달합니다.

게다가, 같은 브라우저의 여러 버전이 여전히 사용되고 있으며, 그중에는 중요하지는 않지만 심각하게 오래된 것도 있습니다. 따라서 웹사이트의 대상 고객을 고려하여 어떤 브라우저와 버전을 지원할지 결정하는 것이 필수적입니다.

### 툴체인

최신 웹 툴링은 컴파일 대상을 정하기 위해 browserslist를 사용합니다.

- Autoprefixer: 브라우저 호환성을 위해 CSS 속성에 공급업체 접두사를 추가합니다.
- Babel: 최신 JavaScript를 대상 브라우저에서 지원하는 이전 버전으로 변환합니다.
- PostCSS: JavaScript로 CSS를 변환하는 도구입니다.
- Webpack: 대상 브라우저에 따라 코드를 최적화할 수 있는 모듈 번들러입니다.

## 구성 파일

`.browserslistrc`라는 구성 파일 내부 또는 `package.json` 내부에서 웹 애플리케이션에 지원해야 하는 브라우저와 버전. 기본 `.browserslistrc` 파일은 다음과 같습니다.

```[.browserslist]
> 0.5%
last 2 versions
Firefox ESR
not dead
```

`browserslist` 키를 사용하여 `package.json` 내부에 작성된 동일한 쿼리는 다음과 같습니다.

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

구문은 난해하게 느껴졌지만, 실제로는 프로젝트가 컴파일될 대상(일명 [쿼리](https://github.com/browserslist/browserslist?tab=readme-ov-file#queries)) 목록입니다. 특정 버전의 브라우저나 운영 체제에 대한 대상이 될 수 있습니다. 지원되는 모든 쿼리는 [전체 목록](https://github.com/browserslist/browserslist?tab=readme-ov-file#full-list)을 참조하세요.

위의 질의에 대한 세부 내용은 다음과 같습니다.

- 글로벌 사용 점유율이 0.5%를 넘는 브라우저.
- 알려진 모든 브라우저의 마지막 두 가지 주요 버전.
- Firefox의 현재 확장 지원 릴리스(ESR).
- "죽은" 것으로 간주되지 않는 브라우저(더 이상 보안 업데이트를 받지 않음).

위의 쿼리는 실제로 browserslist에서 사용하는 기본 컴파일 대상입니다. `defaults` 키워드로 대체할 수 있습니다.

```json [package.json]
{
  "browserslist": [
    "defaults"
  ]
}
```

타겟 고객이 누구인지 확실하지 않은 경우, 가장 좋은 방법은 기본값을 사용하는 것입니다. 구성을 완전히 건너뛸 수 있으며 도구는 기본 쿼리를 스스로 추론합니다.

## 장점

Browserslist를 사용하면 브라우저 호환성이 향상됩니다. 새로운 기능이나 구문을 이전 방식으로 변환할 수 있으며 이전 버전의 브라우저에서 작동합니다. 프로세스가 매끄럽게 진행되었습니다.

게다가 일부 브라우저에 필요하지 않은 일반적인 폴리필을 포함하지 않고 브라우저에 필요한 것만 전송함으로써 번들 크기를 줄일 수 있으며, 이는 전반적인 성능을 향상시킵니다.

## 도구

- [browsersl.ist](https://browsersl.ist)
- [browserslist.dev](https://browserslist.dev/)

## 참고

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
