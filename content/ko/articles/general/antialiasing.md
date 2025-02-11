---
title: 앤티앨리어싱
description: 앤티앨리어싱이 무엇인지 매우 높은 수준에서 폭로합니다
topic: 그래픽
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - graphics
  - game
  - algorithm
updatedAt: 2024-10-27T10:22:03.695Z
createdAt: 2024-10-27T10:22:03.695Z
---

저는 앤티앨리어싱이라는 전문 용어에 대해 많이 들었지만 실제로 그것이 무엇인지 알아낼 용기가 나지 않았습니다. 미친 수학자만 이해할 수 있는 것이라고 생각했기 때문입니다. 제가 틀렸고 아주 간단했습니다.

<!--more-->

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 부인 성명
---
한국어 실력이 부적하여 이 기사는 구글 번역기를 주로 활용했기 때문에 부정확한 문법과 어휘가 있을수 있습니다. 이 점 양해 부탁드리며, 추후에 다시 검토하여 수정하도록 하겠습니다.
::
<!-- prettier-ignore-end -->

기본적으로 이는 디지털 이미지, 게임 및 기타 3D 렌더링 환경에서 들쭉날쭉한 모서리를 부드럽게 하기 위해 컴퓨터 그래픽에서 사용되는 기술입니다.

## 시나리오

예를 들어 모니터를 살펴보겠습니다. 삼성이나 Prism+를 사용하든, 화면에 표시되는 것은 2차원 그리드에 배열된 무수히 많은 사각형(일명 픽셀)으로 구성되어 있으며, 색상을 동기화하여 표시되는 모든 것을 구현합니다.

하지만 픽셀이 육안으로 관찰할 수 있을 만큼 작기 때문에 대각선과 곡선이 있는 모양이 화면에 표시되면 완벽하다는 착시현상을 줍니다.

## 사용원리

앤티앨리어싱은 픽셀의 거친 가장자리를 흐리게 처리하여 선이 더 자연스럽게 보이도록 매끄러운 전환을 제공하는 방식입니다.

![앨리어싱과 앤티앨리어싱의 비교](/images/antialiasing/03_engl-1024x513.jpg)

<!-- 이미지 원본 출처 @ https://vokigames.com/wp-content/uploads/2022/08/03_engl-1024x513.jpg -->

> [vokigames.com](https://vokigames.com/anti-aliasing-in-gaming-the-battle-for-perfect-graphics/)에서 가져온 이미지입니다.

앤티앨리어싱은 비디오 게임에서 널리 사용됩니다. 특히 3D 기반 게임일 때 그래픽의 품질을 개선하기 위한 것입니다. 비디오 게임은 종종 다양한 하드웨어 사양을 가진 더 광범위한 청중을 대상으로 여러 가지 앤티앨리어싱 기술을 제공합니다.

기타 앤티앨리어싱 용도:

1. 디지털 텍스트 렌더링 - 최신의 CSS는 [`text-rendering`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering)이라는 속성을 제공하는데, 이를 통해 글꼴의 가독성을 개선하기 위해 앤티앨리어싱을 사용할지 여부를 지정할 수 있습니다. TailwindCSS에는 [글꼴 매끄럽게 하기](https://tailwindcss.com/docs/font-smoothing)에 대한 페이지도 있습니다.
2. 이미지 처리 - 크기가 조절되거나 축소된 이미지의 품질을 개선합니다.

## 앤티앨리어싱 기술

그러나 앤티앨리어싱 프로세스는 약간의 추가 컴퓨팅 파워를 부과합니다. 다양한 앤티앨리어싱 기술은 궁극적으로 성능과 품질에 영향을 미치는 다양한 알고리즘을 사용합니다. 다음은 앤티앨리어싱 기술의 비철저한 목록입니다.

![앤티앨리어싱 알고리즘 스펙트럼](/images/antialiasing/antialiasing-spectrum.png)

위에 언급된 기술의 이름은 다음과 같습니다.

- **Fast Approximate Antialiasing (FXAA)**
- **Subpixel Morphological Antialiasing (SMAA)**
- **Temporal Antialiasing (TAA)**
- **Supersampling Antialiasing (SSAA)**
- **Multisample Antialiasing (MSAA)**

각각에 대해 자세히 알아보려면 이미 심도 있게 다룬 기사가 많이 있습니다. Vokigames의 이 [블로그 게시물](https://vokigames.com/anti-aliasing-in-gaming-the-battle-for-perfect-graphics/)과 HP의 이 [블로그 게시물](https://www.hp.com/us-en/shop/tech-takes/what-is-anti-aliasing)을 참조하여 개별 기술에 대해 자세히 알아보세요.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Cabading, Z # Zach Cabading
title: "What is Anti-Aliasing? A Comprehensive Guide to Smoother Gaming Graphics"
url: https://www.hp.com/us-en/shop/tech-takes/what-is-anti-aliasing
date: 2024, August 27
source: websites
---
::

::apa-reference
---
authors:
 - CGJournalist
title: "What is Anti-Aliasing?"
url: https://www.youtube.com/watch?v=iqdVZr-TEHI
date: 2023, May 7
source: websites
---
::

::apa-reference
---
organization: Voki Games
title: "Anti-Aliasing in Gaming: The Battle for Perfect Graphics"
url: https://vokigames.com/anti-aliasing-in-gaming-the-battle-for-perfect-graphics/
date: 2022, August 24
source: websites
---
::
<!-- prettier-ignore-end -->
