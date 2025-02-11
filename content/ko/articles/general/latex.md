---
title: LaTeX
description: LaTeX의 함수 및 샘플에 대한 대략적인 목록
topic: 일반
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - science
  - latex
  - cheatsheet
updatedAt: 2024-12-13T17:30:58.824Z
createdAt: 2022-10-22T03:34:20.346Z
---

LaTeX는 문서 작성 및 과학 논문 작성에 널리 사용되는 인기 있는 조판 언어입니다. 이것이 LaTeX 문서의 기본 구조입니다.

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

```tex
\documentclass[a4paper, 11pt]{article}

\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}

\title{My Title}
\author{My name}
\date{October 2021}

\begin{document}
\maketitle
\tableofcontents

\section{Introduction}

\end{document}
```

## 서문

클래스와 패키지는 물론 문서에 분류된 메타데이터도 포함됩니다.

`\documentclass` 태그를 사용하면 일부 선택적 구성과 함께 문서 스타일을 지정할 수 있습니다.

```tex
\documentclass[<options>]{<document style>}
```

다음은 LaTeX에 내장된 클래스(스타일)의 대략적인 목록입니다.

- **article**
- **book**
- **report**
- **letter**
- **slides**
- **proc** - proceedings

`\usepackage` 태그는 라이브러리를 가져오는 데 사용되므로 문서 작성 기능을 확장할 수 있습니다.

```tex
\usepackage[<options>]{<package>}
```

일반적으로 사용되는 패키지:

- [fontenc](https://latexref.xyz/fontenc-package.html)
- [inputenc](https://latexref.xyz/inputenc-package.html)
- lipsum - lorem ipsum 텍스트를 생성
- geometry
- hyperref - 자동으로 링크 생성
- mathtools
- upgreek
- graphicx

`geometry` 패키지의 샘플 사용은 다음과 같습니다.

```tex
% 모든 면에 1.5cm 여백을 지정합니다.
\usepackage[margin=1.5cm]{geometry}

% 측면마다 다른 여백을 지정합니다.
\usepackage[top=2cm, bottom=2cm, left=3cm, right=3cm]{geometry}
```

`hyperref` 패키지의 데모입니다.

```tex
\usepackage{hyperref}
\hypersetup{colorlinks=true, linkcolor=blue}
```

제목, 작성자, 날짜는 메타데이터뿐만 아니라 문서에도 지정할 수 있습니다.

```tex
\title{My Title}
\author{My name}
\date{October 2021}
```

## 내용

최종 출력에 나타날 문서의 모든 내용은 `\begin{document}`와 `\end{document}` 태그 사이에 배치되어야 합니다.

```tex
\begin{document}
% 내용 여기
\end{document}
```

`\maketitle`은 문서 시작 부분에 제목, 작성자, 날짜 등 이전에 정의한 문서 메타데이터를 표시하도록 컴파일러에 지시합니다.

`\tableofcontents`는 지정된 위치에 목차를 삽입합니다.

다른 파일(예: `other.tex`)에서 콘텐츠를 가져오려면 `\input` 태그를 사용하면 됩니다.

```tex
\input{other.tex}
```

## 이미지

문서의 이미지를 처리하려면 `graphicx` 패키지가 필요합니다.

```tex
\usepackage{graphicx}
```

### 이미지 환경 만들기

`\begin`, `\end`를 매개변수로 `Figure`를 사용하여 이미지를 저장하는 환경을 생성할 수 있습니다. 이미지 이름을 적용하려면 `\includegraphics` 태그 내에 배치해야 합니다.

동일한 이미지 타입이 여러 개인 경우 컴파일러가 가장 적합한 확장자를 찾을 수 있도록 이미지 파일의 확장자를 지정할 필요가 없습니다.

```tex
\begin{figure}
	\centering
	\includegraphics{My_image.png}
	\caption{My caption}
	\label{fig:my_label}
\end{figure}
```

이미지는 기본적으로 왼쪽에 정렬됩니다. 중앙에 배치하려면 `Figure` 블록 내에 `\centering` 태그를 포함하세요.

캡션은 이미지를 설명하기 위해 이미지 아래에 표시되는 텍스트입니다.

라벨은 나중에 문서의 다른 부분에서 쉽게 참조할 수 있도록 지정됩니다. `\ref` 태그를 사용하여 참조할 수 있습니다.

```tex
Lorem ipsum dolor sit amet, see Fig. \ref{fig:my_label}
```

### 이미지 크기 조정

때로는 이미지의 해상도가 더 높아질 수 있으며 이를 문서에서 직접 사용하면 큰 이미지가 렌더링됩니다.

크기를 조정하려면 `\includegraphics` 태그에 대한 옵션을 사용하세요.

```tex
\includegraphics[width=0.75\textwidth]{My_image.png}
```

`\textwidth`는 문서에 텍스트를 표시하는 데 허용되는 너비를 나타냅니다. 컴파일러가 이미지의 종횡비를 유지하므로 높이 속성을 지정할 필요가 없습니다.

그러나 높이를 명시적으로 지정할 수 있습니다.

```tex
\includegraphics[width=5cm, height=6cm]{My_image.png}
```

### 이미지 위치

이미지를 정확히 배치해야 하는 위치를 컴파일러에 알리기 위해 `\begin{Figure}` 뒤에 대괄호를 추가하고 옵션을 지정할 수 있습니다.

```tex
\begin{figure}[htbp]
```

- h - (here)여기
- t - (top)사용 가능한 다음 페이지 상단
- b - (bottom)사용 가능한 다음 페이지 하단
- p - (page itself)페이지 자체

전자가 적합하지 않은 경우 컴파일러가 후자로 대체되도록 여러 위치를 지정하는 것이 좋습니다.

### 그림 목록

그림 목록은 목차와 유사하게 작동하지만 그림의 경우입니다. 추가하는 방법은 매우 간단합니다.

```tex
\listoffigures
```

### 짧은 캡션

때로는 그림을 설명하는 매우 긴 캡션이 있을 수 있습니다. 그림 목록 섹션에 표시하기 쉽게 하려면 짧은 캡션을 사용하는 것이 매우 유용합니다.

```tex
\caption[Short caption!]{My very bery very very long caption}
```

### 2열 모드

과학 논문에서 매우 인기 있는 모드는 `\documentclass` 태그 아래의 서문 섹션으로 가서 옵션으로 `twocolumn`을 지정하면 얻을 수 있습니다.

```tex
\documentclass[twocolumn]{article}
```

`\textwidth`에 너비가 설정되어 있으므로 기존 이미지의 일부가 엉망이 될 수 있습니다. `\columnwidth`를 사용하면 문제를 쉽게 해결할 수 있습니다.

```tex
\includegraphics[width=0.75\columnwidth]{My_image.png}
```

## 사용자 정의 명령

사용자 정의 명령이나 별칭을 만들려면 `\newcommand` 태그를 사용하세요.

```tex
\newcommand{\dg}{$^{\circ}$}
```

## 수학

To use math function in LaTeX document, math package is required. The package mathtools and amsmath are mostly identical, it's just that mathtools is the newer package available but importing either one of them will do just fine.

```tex
\usepackage{mathtools}
% 또는
\usepackage{amsmath}
```

### 블록 표시

```tex
\begin{equation}
% 여기 수식
\end{equation}
```

생성된 방정식의 자동 색인 번호를 억제하려면 `equation*`을 사용하세요.

방정식에 레이블을 추가하면 문서 내에서 쉽게 참조할 수 있습니다.

```tex
\begin{equation}
 y = mx + c
 \label{eq:gradient}
\end{equation}
```

문서 내의 단락 어딘가에서 레이블이 지정된 방정식을 참조하려면 `\ref` 명령을 사용하여 둘 사이를 연결하세요.

```tex
The equation \ref{eq:gradient} is kinda basic.
```

### 인라인 표시

인라인 수학 표현식은 `$` 기호 열기 및 닫기를 사용하여 생성할 수 있습니다.

```tex
The gradient equation $y = mx + c$ is really cool.
```

### 아래 첨자와 위 첨자

아래 첨자를 사용하려면 앞에 밑줄 `_`을 추가하고, 위 첨자의 경우 앞에 캐럿 `^` 기호를 추가합니다.

```tex
H_0 = x^2 + 1
```

$$
H_0 = X^2 + 1
$$

부정적인 아래 첨자나 위 첨자의 경우 대신 중괄호로 묶어야 합니다.

```tex
y = 2x^{-1}
```

$$
y = 2x^{-1}
$$

### 간격

LaTeX는 방정식 내의 모든 공백을 무시합니다. 그러나 다음 명령을 사용하여 명시적으로 공백을 추가할 수 있습니다.

| 명령    | 설명         |
| ------- | ------------ |
| `\quad` | 가장 큰 간격 |
| `\;`    | 큰 간격      |
| `\:`    | 중간 간격    |
| `\,`    | 작은 간격    |

### 방정식 안에의 영어 단어

`\text` 명령을 사용하며 영어 단어를 방정식에 추가할 수 있습니다.

```tex
\text{Check Digit} = 10 - (\text{sum}\; mod\; 10)
```

$$
\text{Check Digit} = 10 - (\text{sum}\; mod\; 10)
$$

### 분수

LaTeX에는 두 가지 타입의 분수가 있습니다. 표시 스타일 및 텍스트 스타일. 디스플레이 스타일은 디스플레이 블록에 표시되고 텍스트 스타일은 인라인 환경 내에서 사용됩니다. LaTeX는 환경에 따라 자동으로 최상의 스타일을 선택하지만 이를 명시적으로 지정할 수 있는 옵션도 있습니다. 표시 스타일 분수에는 `\dfrac`을, 텍스트 스타일 분수에는 `\tfrac`을 사용할 수 있습니다.

```tex
\frac{nominator}{denominator}
% 또는
\dfrac{nominator}{denominator}
% 또는
\tfrac{nominator}{denominator}
```

$$
\dfrac{1}{2} = \tfrac{1}{2}
$$

또 다른 영리한 방법은 기울어진 분수를 사용하는 것입니다. 이는 기술적으로 분수를 표시하는 내장된 방식이 아니라 기존 동작을 영리하게 활용한 것입니다.

```tex
$^1/_2$
```

$$
^1/_2
$$

### 괄호

대괄호는 키보드 `(` 및 `)`에서 직접 삽입할 수 있습니다. 그러나 기본값이 보기에 좋지 않은 경우 디스플레이 모드를 변경할 수 있는 옵션도 있습니다.

```tex
% 기본 표시
( \frac{x}{y} )

% 큰 동봉 된 괄호
\left( \frac{x}{y} \right)

% 더 큰 괄호
\big( x(y) \big)
```

$$
( \frac{x}{y} )
\left( \frac{x}{y} \right)
\big( x(y) \big)
$$

### 행렬

행렬의 요소는 앰퍼샌드 `&` 기호로 구분되며 그 뒤에 들어오는 행이 있는 경우 행은 `\\`로 끝나야 합니다.

```tex
\begin{equation}
\begin{matrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{matrix}
\end{equation}
```

$$
\begin{equation}
\begin{matrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{matrix}
\end{equation}
$$

행렬 주위에 괄호를 포함하려면 `matrix` 대신 `pmatrix`를 사용하면 됩니다. 대괄호에는 `bmatrix`를 사용하세요.

$$
\begin{equation}
\begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{pmatrix}
\end{equation}
$$

LaTeX의 행렬은 기본적으로 중앙에 정렬되지만 길이가 다른 경우에는 보기 좋지 않을 수 있습니다. `matrix*`를 사용하면 옵션 대괄호로 정렬을 쉽게 지정할 수 있습니다.

```tex
\begin{matrix*}[r]
1 & -2 & 3 \\
-4 & 5 & 6 \\
7 & 8 & -9
\end{matrix*}
```

$$
\begin{matrix*}[r]
1 & -2 & 3 \\
-4 & 5 & 6 \\
7 & 8 & -9
\end{matrix*}
$$

### 조정

중앙 `=` 기호에 맞춰 정렬되는 파생 방정식을 표시하려면 정렬 블록을 사용할 수 있습니다. 블록 내에서는 일반 `=` 기호 대신 `&=`가 사용되며 가장 중요한 것은 다음 줄에 표시할 다른 방정식이 있는 방정식 뒤에 이중 백슬래시 `\\`를 지정해야 한다는 것입니다.

```tex
\begin{align}
y &= f(x) \\
f(x) &= mx + c
\end{align}
```

$$
\begin{align}
y &= f(x) \\
f(x) &= mx + c
\end{align}
$$

`align` 블록이 방정식의 각 줄에 번호 매기기를 생성하지 않으려면 `align*`을 대신 사용할 수 있습니다. 그러나 방정식의 특정 행에 대해서만 번호 매기기를 억제하려면 방정식 뒤 `\\` 기호 앞에 `\nonumber` 태그를 추가할 수 있습니다.

```tex
\begin{align}
y &= f(x) \nonumber \\
f(x) &= mx + c
\end{align}
```

### 직립 텍스트

방정식 블록의 모든 기호와 문자는 이탤릭체로 표시됩니다. 똑바로 세우려면 `\mathrm{}`을 사용하세요.

```tex
\begin{equation}
	y = \mathrm{m}x + c
\end{equation}
```

$$
y = \mathrm{m}x + c
$$

직립 그리스 문자를 사용하려면 "upgreek" 패키지가 필요합니다.

```tex
\usepackage{upgreek}
```

```tex
\mu -> \upmu
```

### 볼드체

텍스트를 굵게 표시하려면 `\textbf{}`를 사용하고 수학 기호에는 `\mathbf{}`를 사용하세요.

$$
\textbf{bold}
$$

$$
\mathbf{\Lambda}\mathbf{\beta}\mathbf{\chi}
$$

## 표

테이블에도 수학과 숫자처럼 테이블 환경이 필요합니다. 테이블은 또한 이미지와 마찬가지로 `htbp` 속성을 사용합니다.

```tex
\begin{table}[htbp]
	\centering
	\begin{tabular}{c|c}
	% tabulating data
	\end{tabular}
	\caption[Short caption]{Caption}
	\label{tab:my_label}
\end{table}
```

표 형식 시작 태그 뒤의 `{c|c}`는 `<number of columns><border><alignment of data>`을 의미합니다. 데이터 속성의 정렬은 왼쪽에 `l`, 가운데에 `c`, 오른쪽에 `r`을 허용합니다. 데이터를 구분하기 위해 테두리를 사용하는 것은 권장되지 않으므로 `{cc}`를 사용하는 것이 좋습니다.

```tex
\begin{tabular}{|c|r|l|c|}
	Heading 1 & Heading 2 & Heading 3 & Heading 4 \\
	Data 1 & Data 2 & Data 2 & Data 2 \\
	Data 3 & Data 4 & Data 2 & Data 2 \\
	Data 5 & Data 6 & Data 2 & Data 2
\end{tabular}
```

그러나 LaTeX에서 직접 테이블을 관리하는 것은 지옥 같은 노력이 될 수 있습니다. 테이블의 데이터를 관리하려면 [테이블 생성기](https://tablesgenerator.com/)와 같은 온라인 도구를 사용하는 것이 좋습니다.

테이블에 대한 가장 좋은 방법은 수평선을 사용하여 제목과 데이터를 분리하고 문서 내의 나머지 콘텐츠와 함께 테이블을 분리하는 것입니다. 이는 `\hline`을 적절하게 사용하여 달성할 수 있습니다.

```tex
\begin{tabular}
	\hline
	Heading 1 & Heading 2 \\
	\hline
	Data 1 & Data 2 \\
	Data 3 & Data 4 \\
	Data 5 & Data 6
	\hline
\end{tabular}
```

그것만으로는 충분하지 않습니다. 셀의 패딩은 여전히 다음을 사용하여 지정해야 합니다.

```tex
\renewcommand{\arraystretch}{1.5}
```

```tex
\begin{tabular}{ p{3.5cm} p{2.2cm} p{0.25\textwidth} }
```

테이블 목록을 포함하려면 `\listoftables`를 사용하면 됩니다. [목차](#content) 및 [그림](#list-of-Figures)도 마찬가지입니다.

## 목록

순서가 지정된 목록의 항목을 나열하려면 표시된 대로 `enumerate` 명령을 사용할 수 있습니다. `begin` 블록 내에서 `\item` 명령 뒤에 공백과 해당 설명을 사용하여 개별 항목을 나열할 수 있습니다. 순서가 지정되지 않은 목록의 경우 `enumerate`를 `itemized`로 대체할 수 있습니다.

```tex
\section{Definitions of $e$}

\begin{enumerate}
\item As a \textbf{limit}:
\[e= \lim_{n\to\infty} \left(1+\frac{1}{n}\right)^n\]

\item As a \textit{sum}:
\[e= \sum_{n=0}^{\infty} \frac{1}{n!}.\]

\item As a \underline{continued fraction}:
\[e= 2+\frac{1}{1+\frac{1}{2+\frac{2}{3+\frac{3}{4+\frac{4}{5+\ddots}}}}}\]
\end{enumerate}
```

## 샘플 수식

1. **e**의 정의

> 1.1 한도로

$$
e= \lim_{n\to\infty} \left(1+\frac{1}{n}\right)^n
$$

> 1.2 합계로

$$
e= \sum_{n=0}^{\infty} \frac{1}{n!}.
$$

> 1.3 연속된 분수로

$$
e= 2+\frac{1}{1+\frac{1}{2+\frac{2}{3+\frac{3}{4+\frac{4}{5+\ddots}}}}}
$$

2. 삼중 적분

$$
\iiint f(x,y,z)\,dxdydz
$$

3. 벡터

$$
\vec{v}=<v_1, v_2, v_3>
$$

4. $\mathbb{R}$로 표현되는 실수는 정말 멋집니다.

## 화학 방정식

`\ce{}` 블록 안에 내용을 넣어 _mhchem_ 구문을 사용하여 화학 방정식을 작성할 수 있습니다. 예를 들어,

1. 간단한 화학 방정식

$$
\ce{Xe + 2 F2 -> XeF4}
$$

```latex
\ce{Xe + 2 F2 -> XeF4}
```

2. 화학 결합

$$
\ce{H\bond{-}O\bond{-}H\bond{...}H\bond{-}O\bond{-}H}
$$

```latex
\ce{H\bond{-}O\bond{-}H\bond{...}H\bond{-}O\bond{-}H}
```

3. 화살

$$
\ce{CoCl2 + 6 H2O <=> CoCl2 * 6 H2O}
$$

```latex
\ce{CoCl2 + 6 H2O <=> CoCl2 * 6 H2O}
```

4. 물리적 단위

$$
\pu{123 kJ//mol}
$$

```latex
\pu{123 kJ//mol}
```

[mhchem 가이드](https://mhchem.github.io/MathJax-mhchem/)에서 자세한 내용을 읽어보세요.

## LaTeX 로고

$\LaTeX$ 로고를 사용하려면 이 태그를 사용하면 됩니다.

```tex
\LaTeX
```

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Sally
title: SOS Writing
url: https://www.youtube.com/channel/UCnNtbHkOScqQfQuqYDPm1sg
retrievedDate: 2024, March 24
source: websites
---
::

::apa-reference
---
title: LateX Math Symbols
url: https://kapeli.com/cheat_sheets/LaTeX_Math_Symbols.docset/Contents/Resources/Documents/index
retrievedDate: 2024, March 24
source: websites
---
::

::apa-reference
---
title: General Documentation
url: https://www.latex-project.org/help/documentation/#general-documentation
retrievedDate: 2024, March 25
source: websites
---
::

::apa-reference
---
title: Overleaf
url: https://www.overleaf.com/
retrievedDate: 2024, March 25
source: websites
---
::

::apa-reference
---
authors:
 - Bazett, T # Dr. Trefor Bazett
title: "Intro to LaTeX : Learn to write beautiful math equations || Part 1"
url: https://www.youtube.com/watch?v=Jp0lPj2-DQA
date: 2020, May 6
source: websites
---
::

::apa-reference
---
authors:
 - Bazett, T # Dr. Trefor Bazett
title: "Intro to LaTeX **Full Tutorial** Part II (Equations, Tables, Figures, Theorems, Macros and more)"
url: https://www.youtube.com/watch?v=-HvRvBjBAvg
date: 2021, August 11
source: websites
---
::

::apa-reference
---
organization: mhchem
title: mhchem for MathJax. mhchem for KaTeX
url: https://mhchem.github.io/MathJax-mhchem/
retrievedDate: 2024, June 28
source: websites
---
::

::apa-reference
---
authors:
 - Xiong Ying
title: Discover the beauty of LaTeX
url: https://latex-tutorial.com/
retrievedDate: 2024, December 13
source: websites
---
::
<!-- prettier-ignore-end -->
