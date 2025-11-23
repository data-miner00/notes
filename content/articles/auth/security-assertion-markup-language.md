---
title: Security Assertion Markup Language (SAML)
description: Attempting to demystify SAML through my own understanding
topic: Auths
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

Security Assertion Markup Language, colloquially known as SAML, is an XML-based data interchange format for **authentication** and **authorization** between two or more parties.

<!--more-->

SAML is a popular way to achieve single sign-on (SSO) in enterprise applications. It allows the user to be authenticated to multiple applications without the need of re-authentication.

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: Disclaimer
---
SAML is a complex topic to grapple with. I am still trying understand it on a deeper level and this article was written based on what I've learned so far. Hence, it might have less-than-accurate info that you might need to take with a grain of salt.
::
<!-- prettier-ignore-end -->

## Stakeholders

The authentication flow involves three parties - the **principal**, **service provider (SP)** and **identity provider (IdP)**.

### Principal (a.k.a Subject)

The user that requests access to an app or a protected resource.

### Identity Provider (a.k.a IdP)

The party that provides identification services. Examples of identity providers are:

- Google Workspace
- Microsoft
- Okta

### Service Provider (a.k.a SP)

The actual application that the user is trying to access. Not all application supports SAML integration.

Examples of SAML enabled service provider:

- Salesforce
- Pluralsight
- Microsoft 365

## Flows

There are two types of flow to initiate a SAML SSO, the **IdP Init** flow and the **SP Init** flow.

### SP Init

The authentication flow initiated from a service provider (app). The user requests to sign into the app but is redirected to the IdP.

![SP Init Flow](/images/saml/saml-spinit.png)

### IdP Init

The authentication flow initiated from the identity provider (IdP). The difference is that there is no SAML request involved in this flow. This is often done via the IdP portal with registered apps. The IdP will then sends an unsolicited SAML response to the SP to create a login session.

Below is an example of application dashboard in Okta.

![Okta dashboard](/images/saml/okta-dashboard.jpg)

## Glossary

### SAML Request

The authentication request that is sending over to the IdP. It can contain a **relay state** which stores the last active resource of the user before the user requests to sign in so that after being authenticated, the browser will redirect to where the user was previously.

This is an example AuthnRequest from [signicat.com](https://developer.signicat.com/broker/signicat-identity-broker/service-providers/saml/saml-examples.html#authnrequest-examples).

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

### SAML Response

SAML Response contains statements (a.k.a assertions) that are signed with [XML Signatures (DSig)](https://www.cryptosys.net/sc14n/example-signed-xmldsig.html). Besides, it also contain **attributes** which are the profile info such as first name and last name of the user. The SAML Response are being validated in the client side by its own **Assertion Consumer Service**.

This is an example response from [signicat.com](https://developer.signicat.com/broker/signicat-identity-broker/service-providers/saml/saml-examples.html#authnresponse-examples).

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

### SAML Trust

A shared configuration between IdP and SP so that each of them recognizes each other during the communication. An example is certificates.

### Provisioning

The identity provider is the source of truth for the user. From time to time, the user data that kept in the service provider needs to be synced to get the updated info. It can be done by **just-in-time provisioning** and **real-time provisioning**.

- **Just-in-time provisioning**: When the service provider internally does not have an account that is currently requested by the user and is authenticated, JIT kicks in and provisions the new account. It is also responsible to update the account.

- **Real-time provisioning**: Works by push-based architecture. When the account was created/updated in the IdP side, a subsequent request will be made to the corresponding SP to create/update the account. No need to wait for the actual access.

### Metadata

A shared XML configuration blueprint for the IdP and SP to configure themselves. Certificate can also be put here. This is more of a convenience feature.

```xml
<ds:NameIDFormat>urn:oasis:names:tc:saml:1.1:nameid-format:unspecified</ds:NameIDFormat>
<ds:NameIDFormat>urn:oasis:names:tc:saml:1.1:nameid-format:emailaddress</ds:NameIDFormat>

<ds:X509Certificate>ABCDEFG</ds:X509Certificate>
```

## Vulnerabilities

SAML is vulnerable to being exploited if not implemented correctly. The common weaknesses are:

- Incorrect assertion validation
- Unconventional XML parsers

Here are some of the best practices when implementing SAML.

- Limit the XML parsing features.
- Use canonicalized XML (normalization)
- Validate schema from XML response
- Validate every signature from XML response
- Limit accepted algorithms
  ```xml
  <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
  ```
- Use SSL (HTTPS)
- Validate parties
- Enforce validation window
- Create historical cache
- Limit buffer size

## Conflicting Claims

[Some source](https://auth0.com/docs/authenticate/protocols/saml#:~:text=authentication%20and%20authorization) says that SAML can be used in both authentication and authorization but [some site](https://www.cloudflare.com/learning/access-management/what-is-saml/#:-:text=SAML%20is%20a%20technology%20for%20user%20authentication%2C%20not%20user%20authorization:~:text=SAML%20is%20a%20technology%20for%20user%20authentication%2C%20not%20user%20authorization) denies that use for authorization.

Logically thinking, since SAML are mainly used for SSO, the IdP should just authenticate the user and the SP should handle the authorization internally instead. However, until I have implemented the SAML integration on my own, I couldn't tell for sure now.

## Tools

Some useful tools while dealing with SAML.

- [samltool.io](https://samltool.io)
- [samltool.com](https://samltool.com)
- [SAML Tracer Extension](https://chromewebstore.google.com/detail/saml-tracer/mpdajninpobndbfcldcmbpnnbhibjmch?hl=en)

## References

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
