---
title: Windows에 PySpark 설치
description: Windows에서 작동하도록 PySpark를 설정하는 방법에 대한 종합 가이드
topic: 일반
authors:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - python
  - spark
  - setup
updatedAt: 2024-05-23T14:31:44.473Z
createdAt: 2023-04-18T01:41:30.909Z
---

로컬 Windows 시스템에서 PySpark를 시작하려면 [Apache Spark](https://spark.apache.org/)를 먼저 설치해야 하고 종속 항목이 많아 설치가 복잡하므로 약간 까다로울 수 있습니다. 단계.

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

모르는 사람들을 위해 설명하자면, PySpark는 Python의 Apache Spark용 브리지입니다. Apache Spark는 Scala로 작성된 분산 컴퓨팅을 사용하는 빅 데이터 처리 분야의 선구자이며 Scala는 JVM(Java Virtual Machine)에서 실행됩니다. PySpark를 사용하면 [Py4j 라이브러리](https://www.py4j.org/)를 활용하여 Python에서 직접 JVM 개체에 대한 인터페이스를 사용할 수 있습니다.

## 핵심 구성 요소 설정

### Java 설치

설치해야 하는 첫 번째 항목은 Java, 특히 JDK(Java Development Kit)이며 JRE(Java Runtime Environment)가 **아닙니다**. Oracle JDK에 대한 링크는 [여기](https://www.oracle.com/java/technologies/downloads/#java8-windows) 및 OpenJDK [여기](https://jdk.java.net/20)에서 찾을 수 있습니다. 다양한 OpenJDK 공급업체가 있으므로 자신에게 편한 것을 선택하세요.

### Apache Spark 설치

Apache Spark는 [공식 다운로드 페이지](https://spark.apache.org/downloads.html)에서 다운로드할 수 있습니다. 다운로드한 파일은 다운로드한 버전에 따라 `spark-3.3.2-bin-hadoop3`과 유사한 이름을 가진 `tgz` 압축 파일에 있습니다. 동일한 이름의 폴더를 `C:/src` 또는 `D:/Programs`와 같은 짧은 디렉토리에 추출합니다.

> 꿀팁: 나중에 PATH에 디렉터리를 추가할 때 오류가 발생할 수 있으므로 폴더 이름을 `spark`와 같은 더 짧은 이름으로 바꾸는 것이 좋습니다.

### Winutils.exe 다운로드

Winutils는 [Hadoop](https://hadoop.apache.org/)용 Windows 바이너리입니다. Hadoop은 *posix와 유사한 파일 권한*을 통한 파일 액세스와 같은 일부 기능을 위해 Windows에서 작동하려면 기본 API가 필요합니다. Spark는 독립적이며 Hadoop 없이 실행될 수 있으며, Winutils는 Spark가 올바르게 작동하는 데 필요한 Hadoop의 유일한 바이너리입니다.

바이너리를 다운로드하려면 steveloughran이 작성한 [winutils GitHub](https://github.com/steveloughran/winutils)로 이동하세요. 다양한 버전의 Hadoop에서 사용되는 바이너리 파일 목록이 있습니다. 해당 Hadoop 버전이 포함된 `winutils.exe` 바이너리를 찾아서 다운로드하세요.

파일은 PATH로 검색 가능해야 합니다. 가장 쉬운 방법은 파일을 새로 다운로드한 Spark 바이너리 디렉터리로 이동하는 것입니다. 그렇지 않으면 새 디렉터리를 만들고 위치를 PATH에 노출합니다.

### PySpark 설치

[PySpark](https://pypi.org/project/pyspark/)는 [pip](https://pip.pypa.io/en/stable/)로 설치 가능한 Python 라이브러리입니다. 전역적으로 설치할지 가상 환경에 설치할지 여부에 따라 Python 작업 공간에서 PySpark가 올바르게 작동하려면 어딘가에 설치해야 합니다.

```
pip install pyspark  # 전역 설치

pipenv install pyspark  # Pipenv를 통해 설치
```

다음으로 Pandas와 Numpy를 설치하세요.

```
pip install pandas numpy
```

## 환경 변수는 설정

마지막 단계는 환경 변수와 경로를 등록하는 것입니다. 환경 변수 창을 열고 Spark 디렉터리 값으로 `SPARK_HOME`이라는 새 변수를 추가합니다.

```
SET SPARK_HOME=C:\src\spark
```

다음으로 `PYSPARK_PYTHON`이라는 또 다른 변수를 만들고 해당 값을 `python`으로 할당합니다. 이렇게 하면 Apache Spark가 Python을 호출할 때 Unix 시스템에서와 같이 올바른 Python 인터프리터를 사용하고 Apache Spark는 `python` 대신 `python3`을 통해 이를 호출하게 됩니다.

```
SET PYSPARK_PYTHON=python
```

그런 다음 `JAVA_HOME`이 실제 JDK를 가리키는 값으로 존재하는지 확인하세요. 그렇지 않으면 변수를 생성하고 JDK에 경로를 할당합니다.

```
SET JAVA_HOME=C:\Program Files\Java\jdk-17.0.1
```

### 격로 추가

마지막으로 Spark에 필요한 바이너리로 연결되는 경로를 추가합니다. `Path`를 찾아 편집을 클릭하세요. 노출된 디렉터리 목록이 표시되어야 합니다. JDK, Spark 및 Python에 대한 경로가 있는지 확인하세요. 그렇지 않은 경우 수동으로 추가하세요.

```
C:\Program Files\Java\jdk-17.0.1\bin
C:\src\spark\bin
C:\Users\User\AppData\Local\Programs\Python\Python310\
```

## 설정 확인

### Spark 셸

Spark가 환경에 노출되었는지 확인하려면 명령줄에 `spark-shell`을 입력하세요.

```
> spark-shell
```

Spark는 아래와 같이 로고와 함께 로드되어야 합니다.

```
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
23/04/18 20:41:29 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Spark context Web UI available at http://DESKTOP.mshome.net:4040
Spark context available as 'sc' (master = local[*], app id = local-1681821689885).
Spark session available as 'spark'.
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /___/ .__/\_,_/_/ /_/\_\   version 3.3.2
      /_/

Using Scala version 2.12.15 (Java HotSpot(TM) 64-Bit Server VM, Java 17.0.1)
Type in expressions to have them evaluated.
Type :help for more information.

scala>
```

좋아요, Spark는 잘 작동하고 있으며 마지막 단계는 PySpark도 의도한 대로 작동하는지 확인하는 것입니다.

### PySpark

아래 내용으로 `main.py`를 생성합니다. `python main.py`로 파일을 실행하고 실행을 관찰하세요.

```python [main.py]
from pyspark.sql import SparkSession

# SparkSession를 만들기
spark = SparkSession.builder.appName("sandbox").getOrCreate()

# DataFrame를 널 값 있음 데이터 만들기
df = spark.createDataFrame(
    [(1, None, "a"), (2, "b", None), (3, "c", "d")], ["id", "col1", "col2"]
)

# 널 값이 2개 이상 있는 행을 삭제합니다
df_thresh = df.na.drop(thresh=2)

# 결과 표시
df_thresh.show()
```

오류 없이 아래 표시된 출력으로 실행이 종료되면 PySpark가 로컬 시스템에 올바르게 설정된 것입니다.

```
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
23/04/18 20:48:10 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
+---+----+----+
| id|col1|col2|
+---+----+----+
|  1|null|   a|
|  2|   b|null|
|  3|   c|   d|
+---+----+----+

SUCCESS: The process with PID 19900 (child process of PID 21416) has been terminated.
SUCCESS: The process with PID 21416 (child process of PID 24088) has been terminated.
SUCCESS: The process with PID 24088 (child process of PID 5140) has been terminated.
```

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Prabha
title: Apache Spark 3.5 Installation on Windows 
url: https://sparkbyexamples.com/spark/apache-spark-installation-on-windows/
date: 2023, November 17
publisher: Spark By Examples
source: websites
---
::

::apa-reference
---
title: pyspark 3.5.1
url: https://pypi.org/project/pyspark/ 
date: 2024, February 26
publisher: PyPI
source: websites
---
::

::apa-reference
---
title: "Hadoop vs. Spark: What's the Difference?"
url: https://www.ibm.com/cloud/blog/hadoop-vs-spark
date: 2021, May 27
publisher: IBM
source: websites
---
::
<!-- prettier-ignore-end -->
