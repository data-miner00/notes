---
title: Python 및 Julia 상호 운용
description: Python과 그 생태계를 Julia와 상호 운용하기 위한 미니 가이드
topic: 일반
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - julia
  - python
  - interop
updatedAt: 2024-05-24T13:10:15.014Z
createdAt: 2023-07-15T13:17:10.163Z
---

Julia는 C, Python, R 및 Java와 같은 다른 프로그래밍 언어 및 환경과 상호 운용할 때 매우 다재다능합니다.

<!--more-->

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 부인 성명
---
한국어 실력이 부적하여 이 글이 구글 번역기를 주로 활용했기 때문에 부정확한 문법과 어휘가 있을수 있습니다. 이 점 양해 부탁드리며, 추후에 다시 검토하여 수정하도록 하겠습니다.
::
<!-- prettier-ignore-end -->

## Julia에서 Python코드 실행

Julia에서는 [일반 레지스트리](https://github.com/JuliaRegistries/General)에서 쉽게 설치할 수 있는 `PyCall` 인터페이스 패키지를 통해 Python 코드를 호출할 수 있습니다.

저장소에서 Julia REPL을 열고 `]`를 눌러 패키지 모드로 전환하고 `PyCall` 패키지를 설치합니다.

```
(workspace) pkg> add PyCall
```

그런 다음 Julia 파일 중 하나에서 `PyCall`을 가져오면 `py""` 래퍼를 사용하여 Python 코드를 정의하고 실행할 수 있습니다.

```julia
using PyCall

py"print('Hello from Python')" # Julia는 문자열을 큰따옴표로 묶는 것만 허용합니다.
```

반환 값을 얻으려면 Python 블록을 Julia 변수에 직접 할당하면 됩니다.

```julia
total = py"100 + 100"

typeof(total) |> println
total |> println
```

## Python 패키지 작업

[PyPi 저장소](https://pypi.org/)와 같은 Python 라이브러리를 사용하려면 `PyCall`이 사용하는 올바른 Python 인터프리터에 패키지를 설치해야 합니다.

Julia에서 다음 코드를 실행하여 인터프리터의 위치를 알아보세요.

```
PyCall.python |> println
```

그런 다음 디렉터리로 이동하여(Python.exe가 있는지 확인) 다음 명령을 사용하여 패키지를 설치합니다.

```
python -m pip install <패키지>
```

성공적으로 설치되면 이제 Julia 코드 내에서 사용할 수 있습니다. 여기에서 데모를 위해 설치된 패키지는 문자열을 삭제하는 데 사용되는 [`cleantext`](https://pypi.org/project/clean-text/)라고 합니다.

설치된 Python 패키지를 가져오려면 `pyimport` 함수를 사용하고 점 표기법으로 해당 함수를 호출하세요.

```julia
py_clean = pyimport("cleantext")

py_clean.clean("h€ello") |> println
```

## Python 함수 정의

Python 함수는 아래와 같이 `py""`의 여러 줄 블록 내에서 정의할 수 있습니다.

```julia
py"""
from cleantext import clean

def custom_clean(x: str):
    return clean(f'청소 된 텍스트: {x}')
"""
```

새로 정의된 Python 함수는 동일한 `py""` 블록 내에서 다시 호출될 수 있습니다.

```julia
py"custom_clean"("»Yóù àré     rïght &lt;3!«") |> println
```
