---
title: Security Assertion Markup Language (SAML)
description: 내 이해를 통해 SAML의 신비화를 풀려고 시도합니다
topic: 인증
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - auth
  - okta
  - saml
  - sso
updatedAt: 2025-11-23T04:41:46.000Z
createdAt: 2024-11-03T05:40:33.392Z
---

SAML(Security Assertion Markup Language)은 일반적으로 두 당사자 이상 간의 **인증** 및 **권한 부여**를 위한 XML 기반 데이터 교환 형식입니다.

<!--more-->

SAML은 엔터프라이즈 애플리케이션에서 SSO(Single Sign-On)를 구현하는 인기 있는 방법입니다. 이를 통해 사용자는 재인증 없이도 여러 애플리케이션에 인증될 수 있습니다.

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 부인 성명
---
SAML은 다루기 복잡한 주제입니다. 저는 여전히 더 깊은 차원에서 이해하려고 노력하고 있으며, 이 글은 제가 지금까지 배운 내용을 바탕으로 작성되었습니다. 따라서 소금 한 알을 뿌려서 받아들여야 할 정확하지 않은 정보가 있을 수 있습니다. 게다가, 저는 지금은 한국어 잘 말 할 수 없어서 이상한 문법과 단어를 찾아온 것을 죄송합니다. 이 글이 꼭 다시 리뷰를 할겁니다.
::
<!-- prettier-ignore-end -->

## 구성 요소

SAML은 세 가지 구성 요소 또는 역할을 지정하며, 이는 **주체(사용자)**, **ID 제공자(IdP)** 및 **서비스 제공자(SP)**입니다.

### 주제(사용자)

앱이나 보호된 리소스에 대한 액세스를 요청하는 사용자입니다.

### ID 제공자(IdP)

식별 서비스를 제공하는 당사자. ID 제공자의 예는 다음과 같습니다.

- Google Workspace
- Microsoft
- Okta

### 서비스 제공자(SP)

사용자가 액세스하려는 실제 애플리케이션. 모든 애플리케이션이 SAML 통합을 지원하는 것은 아닙니다.

SAML 지원 서비스 제공자의 예:

- Salesforce
- Pluralsight
- Microsoft 365

## 인증 흐름

SAML SSO를 시작하는 데에는 **ID 제공자 시작(IdP Init)** 흐름과 **서비스 제공자 시작(SP Init)** 흐름의 두 가지 유형이 있습니다.

### 서비스 제공자 시작(SP Init)

서비스 제공자(애플리케이션)에서 시작된 인증 흐름. 사용자가 앱에 로그인을 요청했지만 IdP로 리디렉션됨.

![서비스 제공자 시작 흐름](/images/saml/saml-spinit.png)

### ID 제공자 시작(IdP Init)

ID 제공자(IdP)에서 시작된 인증 흐름. 차이점은 이 흐름에 SAML 요청이 포함되지 않는다는 것입니다. 이 작업은 등록된 앱이 있는 IdP 포털을 통해 수행되는 경우가 많습니다. 그러면 IdP는 SP에 요청되지 않은 SAML 응답을 전송하여 로그인 세션을 생성합니다.

아래는 Okta의 애플리케이션 대시보드의 예입니다.

![Okta 대시보드](/images/saml/okta-dashboard.jpg)

## 어휘

### SAML 요층

IdP로 전송하는 인증 요청입니다. 여기에는 사용자가 로그인을 요청하기 전 사용자의 마지막 활성 리소스를 저장하는 **릴레이 상태(relay state)**가 포함될 수 있으므로 인증 후 브라우저가 사용자가 이전에 있던 위치로 리디렉션됩니다.

이는 [signicat.com](https://developer.signicat.com/broker/signicat-identity-broker/service-providers/saml/saml-examples.html#authnrequest-examples)의 AuthnRequest 예시입니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<saml2p:AuthnRequest xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol" AttributeConsumingServiceIndex="1"
                     Destination="https://yourdomain/broker/sp/saml/login" ForceAuthn="true"
                     ID="_b6a016332e19a825bb42917c9870c93a" IssueInstant="2021-03-09T10:26:17.210Z"
                     Version="2.0">
    <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">
        yourEntityID
    </saml2:Issuer>
    <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        ... XML Signature ...
    </ds:Signature>
</saml2p:AuthnRequest>
```

### SAML 응답

SAML 응답에는 [XML Signatures(DSig)](https://www.cryptosys.net/sc14n/example-signed-xmldsig.html)로 서명된 문장(assertion)이 포함되어 있습니다. 또한 사용자의 이름과 성과 같은 프로필 정보인 **속성**도 포함되어 있습니다. SAML 응답은 클라이언트 측에서 자체 **ACS(Assertion Consumer Service)**에 의해 검증됩니다.

이거는 [signicat.com](https://developer.signicat.com/broker/signicat-identity-broker/service-providers/saml/saml-examples.html#authnresponse-examples)의 응답 예시입니다.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<saml2p:Response xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol"
                 Destination="https://yourspdomain/acs" ID="_c5bb9d944845c6ee1ddb85e59330ab36"
                 InResponseTo="_900A8CD85314D6317FA8C61B49D021DA" IssueInstant="2021-03-09T15:42:11.907Z" Version="2.0">
    <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">https://yourbrokerdomain/broker/sp/saml
    </saml2:Issuer>
    <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        ... XML Signature ...
    </ds:Signature>
    <saml2p:Status>
        <saml2p:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
    </saml2p:Status>
    <saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" ID="_f940b40421a7330f9b63e381bf8f1844"
                     IssueInstant="2021-03-09T15:42:11.914Z" Version="2.0">
        <saml2:Issuer>https://yourbrokerdomain/broker/sp/saml</saml2:Issuer>
        <saml2:Subject>
            <saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
                          NameQualifier="https://was-preprod1.digid.nl/saml/idp/metadata">900026261
            </saml2:NameID>
            <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
                <saml2:SubjectConfirmationData InResponseTo="_900A8CD85314D6317FA8C61B49D021DA"
                                               NotOnOrAfter="2021-03-09T15:44:11.921Z"
                                               Recipient="https://yourspdomain"/>
            </saml2:SubjectConfirmation>
        </saml2:Subject>
        <saml2:Conditions NotBefore="2021-03-09T15:42:06.921Z" NotOnOrAfter="2021-03-09T15:44:11.921Z">
            <saml2:AudienceRestriction>
                <saml2:Audience>https://yourspdomain</saml2:Audience>
            </saml2:AudienceRestriction>
        </saml2:Conditions>
        <saml2:AttributeStatement>
            <saml2:Attribute Name="OriginalResponse">
                <saml2:AttributeValue xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:string">
                    PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c2FtbDpBc3NlcnRpb24geG1sbnM6c2FtbD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFzc2VydGlvbiIgSUQ9Il84ZTdmZDIxMDYwNmMwNzc1ODZmMmE3Mjg0ZjhjM2ZjMDdhNjEzZmVkIiBJc3N1ZUluc3RhbnQ9IjIwMjEtMDMtMDlUMTU6NDI6MTFaIiBWZXJzaW9uPSIyLjAiIHhtbG5zOmRzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIiB4bWxuczpzYW1scD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIj48c2FtbDpJc3N1ZXI+aHR0cHM6Ly93YXMtcHJlcHJvZDEuZGlnaWQubmwvc2FtbC9pZHAvbWV0YWRhdGE8L3NhbWw6SXNzdWVyPjxkczpTaWduYXR1cmU+PGRzOlNpZ25lZEluZm8+PGRzOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48ZHM6U2lnbmF0dXJlTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxkc2lnLW1vcmUjcnNhLXNoYTI1NiIvPjxkczpSZWZlcmVuY2UgVVJJPSIjXzhlN2ZkMjEwNjA2YzA3NzU4NmYyYTcyODRmOGMzZmMwN2E2MTNmZWQiPjxkczpUcmFuc2Zvcm1zPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZW52ZWxvcGVkLXNpZ25hdHVyZSIvPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiPjxlYzpJbmNsdXNpdmVOYW1lc3BhY2VzIHhtbG5zOmVjPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiIFByZWZpeExpc3Q9ImRzIHNhbWwgc2FtbHAgeHMiLz48L2RzOlRyYW5zZm9ybT48L2RzOlRyYW5zZm9ybXM+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NiIvPjxkczpEaWdlc3RWYWx1ZT55KzAxeGlFSmhXRS9zOGFXWW53bzM4clJhMzBKOW1oWVlnKzJBZnNFVDhnPTwvZHM6RGlnZXN0VmFsdWU+PC9kczpSZWZlcmVuY2U+PC9kczpTaWduZWRJbmZvPjxkczpTaWduYXR1cmVWYWx1ZT5FcHhUdGN1UFM3NXRYM1ZzWDQvaWd1RytoNzl3SGRFVTVjWFJJdHhaeDF6b2ZNeEkrQzBEUTdldnVzSU9TV1czK0lKNkd6SmNIWGRqdHJqUVA3OFpTdER1djZhWXdxbDUrU2M0cno5V2pWbkdCSlVUbnJLVHgzb2xxdkQzYVA1amVWUmhJVkk2TUYxVXExcG5pVXQxaDJNeG9RL0ZXZUlpUjg0RXU5Z3JrbzQ0ZDkvcGtEVy9taXA1bEIySUpTZWZzSzVtUmVTc3REZXJGWHg4L1B1ZnZTZ3NJTnIvVmNpQU1oUC91VzU4YU4vWFpOU0QrS0MvQkpGUDZsSU15UUwvMndwVU1xbkV5MERBYzUxNUNveXYvNDVoUWhJejdsZUR0SWtFd2Jid2VqRDlyNUFFcy9kbDhuQ3o4b3R5NFlyOXJKQ1N6U1U0ck51VE9xM0R1T0hXVkE9PTwvZHM6U2lnbmF0dXJlVmFsdWU+PGRzOktleUluZm8+PGRzOktleU5hbWU+OTRiZWMxMGM5ZDZiYzJhN2U4OGJlODNjZDgxZmRmNGRkMTUxMTI1MjwvZHM6S2V5TmFtZT48ZHM6WDUwOURhdGE+PGRzOlg1MDlDZXJ0aWZpY2F0ZT5NSUlHZ0RDQ0JHaWdBd0lCQWdJVWVhSkNITjVXWXBBWW0zT2I5NUsrK3d1VUtGNHdEUVlKS29aSWh2Y04KQVFFTEJRQXdVekVMTUFrR0ExVUVCaE1DVGt3eEVUQVBCZ05WQkFvTUNFdFFUaUJDTGxZdU1URXdMd1lEClZRUUREQ2hMVUU0Z1VFdEpiM1psY21obGFXUWdVSEpwZG1GMFpTQlRaWEoyYVdObGN5QkRRU0F0SUVjeApNQjRYRFRJd01URXdOREUxTURVeE1Gb1hEVEl6TVRFd05ERTFNRFV4TUZvd2dZWXhDekFKQmdOVkJBWVQKQWs1TU1SRXdEd1lEVlFRSERBaEVaVzRnU0dGaFp6RVBNQTBHQTFVRUNnd0dURzluYVhWek1STXdFUVlEClZRUUxEQXBCWm1RdUlFUnBaMmxFTVIwd0d3WURWUVFGRXhRd01EQXdNREF3TkRFMk5qa3dPVGt4TXpBdwpNREVmTUIwR0ExVUVBd3dXYzJGdGJDMXphV2R1TG5Cd01TNWthV2RwWkM1dWJEQ0NBU0l3RFFZSktvWkkKaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFNajhrS2RvbzF0MDdORmkrRE1QKzg0RW9SZzlza3FmCm9pQXBiKzhJd1JJcFZqZUN1NnRZOVlzby9KYzlsbVBsekxkUkRLVE9qS2M3L3Rhc3dDTHYxaytpVXZOYQpoNXkwTWgzTURvVFdwMytRY1VxaW0wZUxuNmRVTU55TXFQME1RTHFJWFRoekVUVTVGeW5iYlR2Mjd2eFcKdHFKZFdQaWx2OUU5K04xOSt2cFJNZ2JpWjVtSWFyZmhBdXZlaWkxK21HQTlZWkYyak1zRG1mYW5KNEwwCnBMNE1KUjQ0RkNiczJjZTFuOTZZTmhaaVoxWGh0NVk0NmpYWHZwUWtIRnhXRGJBR2Fra21uQ2k4ejlEMApCQkVZUTJNY2VZejJkQndxd0R0WUZnV3E4OVhmTVhPazhOWjdyNjV4dTlHSjU2TzJ2M2xjSHF2d0RQWGYKZ3pZVjFnWDZwcjBDQXdFQUFhT0NBaFl3Z2dJU01Bd0dBMVVkRXdFQi93UUNNQUF3SHdZRFZSMGpCQmd3CkZvQVV1TlJNbjZoYmJ0b2xwMmlPNzR4R0d2NGZVMlV3T0FZSUt3WUJCUVVIQVFFRUxEQXFNQ2dHQ0NzRwpBUVVGQnpBQmhoeG9kSFJ3T2k4dmNISnZZM053TG0xaGJtRm5aV1J3YTJrdVkyOXRNQ0VHQTFVZEVRUWEKTUJpQ0ZuTmhiV3d0YzJsbmJpNXdjREV1WkdsbmFXUXVibXd3Z2RjR0ExVWRJQVNCenpDQnpEQ0J5UVlLCllJUVFBWWRyQVFJSUJqQ0J1akJDQmdnckJnRUZCUWNDQVJZMmFIUjBjSE02THk5alpYSjBhV1pwWTJGaApkQzVyY0c0dVkyOXRMMlZzWld0MGNtOXVhWE5qYUdVdGIzQnpiR0ZuY0d4aFlYUnpNSFFHQ0NzR0FRVUYKQndJQ01HZ01aazl3SUdScGRDQmpaWEowYVdacFkyRmhkQ0JwY3lCb1pYUWdRMUJUSUZCTFNXOTJaWEpvClpXbGtJRkJ5YVhaaGRHVWdVMlZ5ZG1salpYTWdVMlZ5ZG1WeUlHTmxjblJwWm1sallYUmxiaUIyWVc0ZwpTMUJPSUhaaGJpQjBiMlZ3WVhOemFXNW5MakFkQmdOVkhTVUVGakFVQmdnckJnRUZCUWNEQWdZSUt3WUIKQlFVSEF3RXdYQVlEVlIwZkJGVXdVekJSb0UrZ1RZWkxhSFIwY0RvdkwyTnliQzV0WVc1aFoyVmtjR3RwCkxtTnZiUzlMVUU1Q1ZsQkxTVzkyWlhKb1pXbGtVSEpwZG1GMFpWTmxjblpwWTJWelEwRkhNUzlNWVhSbApjM1JEVWt3dVkzSnNNQjBHQTFVZERnUVdCQlNkZ25wcnp2REhmQWJYOWlJNmRiQWpQVmxaTmpBT0JnTlYKSFE4QkFmOEVCQU1DQmFBd0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dJQkFCc1hJQVJCSGpBbng1dThTMVdjCjdybXQxOGx6ZHZkMUJkUVJvZ1NtQ3YyclZvUnJ5SnZLczNqMlhhRkpGTHZ6L0phSEkxdlRobmEzMS8yeApqR2xJVEc4ZTFYeDRwRGZ0WFlwdW1iV3BScTNVQVYrWmN2UDhVYTF2TFlPTjFSWSthOUVtYVFBOElUWE8KSzNhdjVSTW52M3VEb0h0Q2RCdnNCT0NabVphV1REZjRnbjhqWFdpcnlhbGt3ZUdFZXJiMDFRcGFPYTJ3CkJjNnJUZW5WSEE5R0s4UmIxQ0tWbmVxOHBKZFM4TmE3V0ZCalUxWnpxMjhMb3I0ZEVSSlhURzVRS1ROVwpDNEI1OHN0b2tEaW9nd2tWaGpiMjdVeTBzQ0puNXdOOTdPbVVSMlliUUhGSjlkbS9rcE5GK1B2M0tRekEKcjRGQkxmMUYzMzJaVVVFeGg5TGh3UGRtalFyOHZIcFA1Y0xmNldIc0VGQVpqN3M3U0xNbitybDl2WHp1Ck1LVXAwRWF1QjVjQjFUUHduclVKRTNCb0t6aS9GVUYyM1RHb1RXZnFqbFZmZ0NlR2MyL1JSY3BaVWxyTApTZ3BmRHBFNXAyTkltVUo2anFQc200L3RMWUc2Z1AxY0dEM3JObEVaeEV1RmVPRkh4L2dPVVRjQ0R4Y2cKTmRvbHJmRCtlZldwZHErWk1SdWd2aTVFZGoxUUFEYTRkNGVocnd4L0VJUUFBZ2hhcWxKTnN2S3hHLzFCCnJ5cmx6RHJKM3hyVnVYVEpFV2ZxM0VhK00xM2RFRFh2bmM1bmhRdDdnUFkwUzB5YnpCL01IbG1qQmZGTApmWHErZXVoUXRJWkRLNGJXaE5rbkI5MU15TkluWC9MQzJOeXdWNDdUUGZsdEY5TW5xT2ErWHVFeFhDWGgKdGErRAo8L2RzOlg1MDlDZXJ0aWZpY2F0ZT48L2RzOlg1MDlEYXRhPjwvZHM6S2V5SW5mbz48L2RzOlNpZ25hdHVyZT48c2FtbDpTdWJqZWN0PjxzYW1sOk5hbWVJRD5zMDAwMDAwMDA6OTAwMDI2MjYxPC9zYW1sOk5hbWVJRD48c2FtbDpTdWJqZWN0Q29uZmlybWF0aW9uIE1ldGhvZD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmNtOmJlYXJlciI+PHNhbWw6U3ViamVjdENvbmZpcm1hdGlvbkRhdGEgSW5SZXNwb25zZVRvPSJfY2MxOWUyNDE0OGNlZDA3OTg3MWEwYTJlMDg4ZGZlNmEiIE5vdE9uT3JBZnRlcj0iMjAyMS0wMy0wOVQxNTo0NDoxMVoiIFJlY2lwaWVudD0iaHR0cHM6Ly9wa2lvLmJyb2tlci5uZy10ZXN0Lm5sL2Jyb2tlci9hdXRobi9kaWdpZC9hY3MiLz48L3NhbWw6U3ViamVjdENvbmZpcm1hdGlvbj48L3NhbWw6U3ViamVjdD48c2FtbDpDb25kaXRpb25zIE5vdEJlZm9yZT0iMjAyMS0wMy0wOVQxNTo0MDoxMVoiIE5vdE9uT3JBZnRlcj0iMjAyMS0wMy0wOVQxNTo0NDoxMVoiPjxzYW1sOkF1ZGllbmNlUmVzdHJpY3Rpb24+PHNhbWw6QXVkaWVuY2U+aHR0cHM6Ly9wa2lvLmJyb2tlci5uZy10ZXN0Lm5sL2Jyb2tlci9hdXRobi9kaWdpZDwvc2FtbDpBdWRpZW5jZT48L3NhbWw6QXVkaWVuY2VSZXN0cmljdGlvbj48L3NhbWw6Q29uZGl0aW9ucz48c2FtbDpBdXRoblN0YXRlbWVudCBBdXRobkluc3RhbnQ9IjIwMjEtMDMtMDlUMTU6NDI6MTFaIiBTZXNzaW9uSW5kZXg9IjA2MGI4YTc0Njg1MTIxYTQ5YmY4ZDI3YjQ3Nzc4ZjY0NzU4NTEyMyI+PHNhbWw6U3ViamVjdExvY2FsaXR5IEFkZHJlc3M9Ijc3LjI0OC4yMjcuMTgzIi8+PHNhbWw6QXV0aG5Db250ZXh0PjxzYW1sOkF1dGhuQ29udGV4dENsYXNzUmVmPnVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOlNtYXJ0Y2FyZDwvc2FtbDpBdXRobkNvbnRleHRDbGFzc1JlZj48L3NhbWw6QXV0aG5Db250ZXh0Pjwvc2FtbDpBdXRoblN0YXRlbWVudD48L3NhbWw6QXNzZXJ0aW9uPg==
                </saml2:AttributeValue>
            </saml2:Attribute>
        </saml2:AttributeStatement>
        <saml2:AuthnStatement AuthnInstant="2021-03-09T15:42:11.921Z"
                              SessionIndex="add33efd-9f37-48b2-a8a2-d6346c539307">
            <saml2:AuthnContext>
                <saml2:AuthnContextClassRef>urn:etoegang:core:assurance-class:loa3</saml2:AuthnContextClassRef>
                <saml2:AuthenticatingAuthority>https://was-preprod1.digid.nl/saml/idp/metadata
                </saml2:AuthenticatingAuthority>
            </saml2:AuthnContext>
        </saml2:AuthnStatement>
    </saml2:Assertion>
</saml2p:Response>
```

### SAML 트러스트(Trust)

IdP와 SP 간의 공유 구성으로, 통신 중에 각자가 서로를 인식할 수 있습니다. 예를 들어 인증서가 있습니다.

### 프로비저닝

ID 제공자는 사용자에게 진실의 원천입니다. 때때로 서비스 제공자에 보관된 사용자 데이터를 동기화하여 업데이트된 정보를 얻어야 합니다. 이는 **적시 프로비저닝(Just-in-time provisioning)** 과 **실시간 프로비저닝(real-time provisioning)** 을 통해 수행할 수 있습니다.

- **적시 프로비저닝**: 서비스 제공자가 현재 사용자가 요청하고 인증한 계정이 내부에 없는 경우, JIT가 작동하여 새 계정을 프로비저닝합니다. 또한 계정을 업데이트할 책임이 있습니다.

- **실시간 프로비저닝**: 푸시 기반 아키텍처로 작동합니다. IdP 측에서 계정이 생성/업데이트되면 해당 SP에 후속 요청이 이루어져 계정을 생성/업데이트합니다. 실제 액세스를 기다릴 필요가 없습니다.

### 메타데이터(Metadata)

IdP와 SP가 스스로를 구성하기 위한 공유 XML 구성 청사진. 인증서도 여기에 넣을 수 있습니다. 이는 편의 기능에 가깝습니다.

```xml
<ds:NameIDFormat>urn:oasis:names:tc:saml:1.1:nameid-format:unspecified</ds:NameIDFormat>
<ds:NameIDFormat>urn:oasis:names:tc:saml:1.1:nameid-format:emailaddress</ds:NameIDFormat>

<ds:X509Certificate>ABCDEFG</ds:X509Certificate>
```

## 최약점

SAML은 올바르게 구현되지 않으면 악용될 수 있습니다. 일반적인 약점은 다음과 같습니다.

- 잘못된 어설션 검증
- 비전통 XML 파서(parser)

SAML을 구현할 때 참고할 수 있는 모범 사례는 다음과 같습니다.

- XML 구문 분석 기능을 제한합니다.
- 표준화된(canonicalized) SAML을 사용하세요
- XML ​​응답에서 스키마 검증
- XML ​​응답에서 모든 서명 검증
- 허용 알고리즘 제한
  ```xml
  <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
  ```
- SSL (HTTPS)를 사용하세요
- 발신자와 수신자를 검증합니다.
- 검증 창 적용
- 기록 캐시 생성
- 버퍼 크기 제한

## 상충되는 주장

[일부 출처](https://auth0.com/docs/authenticate/protocols/saml#:~:text=authentication%20and%20authorization)에서는 SAML이 인증과 권한 부여 모두에 사용될 수 있다고 말하지만 [일부 사이트](https://www.cloudflare.com/learning/access-management/what-is-saml/#:-:text=SAML%20is%20a%20technology%20for%20user%20authentication%2C%20not%20user%20authorization:~:text=SAML%20is%20a%20technology%20for%20user%20authentication%2C%20not%20user%20authorization)에서는 권한 부여에 대한 사용을 부인합니다.

논리적으로 생각하면, SAML은 주로 SSO에 사용되므로 IdP는 사용자를 인증하고 SP는 대신 내부적으로 권한을 처리해야 합니다. 하지만 제가 직접 SAML 통합을 구현하기 전까지는 확실히 말할 수 없었습니다.

## 도구

SAML 개발 할 때 유용한 도구는 다음과 같습니다.

- [samltool.io](https://samltool.io)
- [samltool.com](https://samltool.com)
- [SAML Tracer Extension](https://chromewebstore.google.com/detail/saml-tracer/mpdajninpobndbfcldcmbpnnbhibjmch?hl=en)

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: Security Assertion Markup Language
url: https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language
retrievedDate: 2024, November 3
source: websites
publisher: Wikipedia
---
::

::apa-reference
---
title: Understanding SAML
url: https://developer.okta.com/docs/concepts/saml/
retrievedDate: 2024, November 3
source: websites
organization: Okta
---
::

::apa-reference
---
authors:
 - OktaDev
title: A Developer's Guide to SAML
url: https://www.youtube.com/watch?v=l-6QSEqDJPo
date: 2021, April 10
source: websites
---
::

::apa-reference
---
authors:
 - VMWare End-User Computing
title: "SAML 2.0: Technical Overview"
url: https://www.youtube.com/watch?v=SvppXbpv-5k
date: 2019, December 13
source: websites
---
::

::apa-reference
---
title: "What is Security Assertion Markup Language (SAML)?"
url: https://www.oracle.com/my/security/cloud-security/what-is-saml/
retrievedDate: 2024, November 3
source: websites
organization: Oracle
---
::

::apa-reference
---
title: SAML
url: https://auth0.com/docs/authenticate/protocols/saml
retrievedDate: 2024, November 3
source: websites
organization: Auth0
---
::

::apa-reference
---
authors:
 - Lee. S.Y # SeungYeon Lee
title: 호다닥 공부해보는 SSO와 친구들 (SAML, OAuth, OIDC) 
url: https://gruuuuu.github.io/security/ssofriends/
date: 2021, October 8
source: websites
---
::

::apa-reference
---
authors:
 - MindMajix
title: SAML In Okta | Components Of SAML | Concepts Of SAML Flow
url: https://www.youtube.com/watch?v=-2KL57GEzwM
date: 2022, August 1
source: websites
---
::

::apa-reference
---
authors:
 - ByteMonk
title: What is SAML? A Comprehensive Guide with Examples
url: https://www.youtube.com/watch?v=4ULlJEupV-I
date: 2023, September 22
source: websites
---
::
<!-- prettier-ignore-end -->
