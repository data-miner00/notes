---
title: 코드 리뷰
topic: 일반
description: 더 나은 코드 리뷰 사고방식을 위한 유용한 조언
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - engineering
  - pullrequest
updatedAt: 2024-08-25T05:17:01.046Z
createdAt: 2024-06-26T12:37:01.866Z
---

코드 리뷰 또는 PR 리뷰는 관련된 모든 당사자가 변경 사항에 만족할 때까지 정보를 교환하고 최신 버전의 소프트웨어 시스템에 포함되도록 제안된 코드를 개선하는 프로세스입니다.

<!--more-->

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 부인 성명
---
저는 이제 아직 한국어 잘 못했으니까 이 기사는 구글 번역은 많이 사용했어서 잘못된 문법과 어휘는 있으니 죄송합니다. 이 기사가 나중에 다시 리뷰를 할겁니다.
::
<!-- prettier-ignore-end -->

## 코드 리뷰 측면

1. **디사인**: 관련된 변경 사항에 적합한 디자인 패턴을 따르고 있습니까?
2. **기능성**: 코드가 작성자의 의도대로 작동합니까?
3. **복잡성**: 구현이 불필요하게 복잡합니까? 다른 개발자가 미래에 이러한 구현을 이해할 수 있습니까?
4. **테스트**: 코드에는 극단적인 경우를 포함하여 대부분의 경우를 포괄하는 충분한 테스트가 있습니까?
5. **명명**: 변수, 함수 또는 클래스의 이름이 명확하고 응집력이 있습니까?
6. **커멘트**: 댓글이 명확하고 유용합니까? 댓글은 가능하면 피하세요.
7. **스타일**: 코드가 기존 스타일 가이드를 따르고 있나요?
8. **문서**: 관련 문서가 업데이트되고 있나요?
9. **개량**: PR도 기존 코드를 완전히 개선하는 건가요? "보이스카우트의 법칙"
10. **일관성**: PR은 이름 지정, 디자인 패턴 등과 같이 우리가 이미 가지고 있는 것과 일치합니까?

## 설명 작성

이 부분은 작성자에게 해당되는 부분입니다. 검토용 풀 요청을 생성할 때 설명은 적절하게 활용된다면 무엇을, 왜 하는지에 대한 전체 맥락을 효과적으로 전달하는 강력한 도구입니다.

1. 끌어오기 요청의 전체 아이디어를 포함하는 간단한 요약을 작성합니다.
2. 요약을 확장하고 자세히 설명하며 한 단락에 최대한 많은 정보를 제공합니다. 필요한 경우 글머리 기호 또는 번호 매기기를 사용하여 끌어오기 요청의 핵심 내용을 나열하세요.
3. 변경사항이 웹 애플리케이션의 새로운 기능과 같은 사용자 인터페이스와 관련된 경우 적절한 스크린샷을 제공하고 각 스크린샷에 이해하기 쉬운 설명을 추가합니다.
4. 도움이 될 수 있는 링크나 참고 자료를 제공하십시오.

훌륭한 설명은 검토자가 기대에 부응할 수 있도록 준비시키고 코드 변경 사항에 대한 전체적인 시각을 제공합니다.

## 커멘팅

이 부분은 리뷰어에게 해당되는 부분입니다.

1. 존중하고 건설적인 태도를 취하십시오. 다른 사람의 코드를 검토할 때 가혹하거나 비판적이거나 냉소적이지 마십시오.
2. 코드에 대해 의문이 있으면 질문하세요. 작성자는 코드가 왜 그렇게 작성되었는지 설명하고 정당화해야 합니다.
3. 코드에 개선의 여지가 있으면 제안해 주세요. 제안과 관련된 근거, 링크 또는 참조를 제공하십시오.
4. 응답 체인을 중지합니다. 커멘트가 여러 개의 연쇄 답변을 얻었지만 아무런 효과가 없는 것처럼 보인다면 이는 팀에서 오해나 불일치가 있음을 나타냅니다. 불일치를 해결하기 위해 별도로 전화를 걸어 팀이 같은 입장에 있는지 확인하세요. 의심을 해소한 후 동일한 커멘트에 돌아와서 다른 검토자가 조정할 수 있도록 토론의 최종 결론을 게시하세요.

저자 여러분, 리뷰어의 논평에 기분이 상하셨다면 한 발 뒤로 물러나 숨을 쉬십시오. 개인적으로 받아들이지 마십시오. 동료들 앞에서 화를 내는 것은 결코 일어나기를 원하지 않는 일입니다. 이는 극도로 미숙하며 장기적으로 귀하의 경력과 팀과의 관계에 부정적인 영향을 미칠 것입니다. 대부분의 경우 검토자는 코드베이스의 품질이 최고인지 확인하고 실제로는 공격적이지 않은 것으로 간주될 정도로 단어를 조합하는 데 능숙하지 않을 수 있습니다.

> 심호흡을 해라

## 기타 쿨팁을

1. 큰 PR을 피하십시오. 검토 프로세스를 쉽게 하기 위해 더 작고 논리적인 PR로 나누세요. 이는 "역대 최대 규모의 PR" 기록을 깨기 위한 경쟁이 아닙니다.
2. [기존 커밋](https://www.conventionalcommits.org/en/v1.0.0/#summary)을 사용하세요. 각 커밋을 개별적으로 검사할 수 있도록 각 논리적 커밋 앞에 적절한 용어를 붙입니다.
3. [기존 커멘트](https://conventionalcomments.org/)를 사용하세요. 이렇게 하면 작성자나 댓글을 읽는 사람이 무엇을 기대하는지에 대해 준비할 수 있습니다.

## 요약

코드 검토는 코드베이스의 품질을 보장합니다. 또한 팀이 변화에 적응하고 승리를 위해 의미 있는 논의를 하는 데 도움이 됩니다. 효과적인 검토는 증오를 조장하는 것이 아니라 협력을 촉진합니다.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Debogori, N # Nadia Debogori
title: How to review as a Pro
url: https://dev.to/nadia/how-to-review-as-a-pro-59a0
date: 2024, June 19
source: websites
---
::

::apa-reference
---
authors:
 - Mignonsin, M # Marc Mignonsin
title: A practical guide for better, faster code reviews
url: https://github.com/mawrkus/pull-request-review-guide
date: 2024, April 15
source: websites
publisher: GitHub
---
::

::apa-reference
---
organization: Google
title: Google's Code Review Developer Guide
url: https://google.github.io/eng-practices/review/
retrievedDate: 2024, June 26
source: websites
---
::

::apa-reference
---
authors:
 - Vessels, S # Sarah Vessels
title: "How to review code effectively: A GitHub staff engineer's philosophy"
url: https://github.blog/developer-skills/github/how-to-review-code-effectively-a-github-staff-engineers-philosophy/
date: 2024, July 23
source: websites
---
::
<!-- prettier-ignore-end -->
