---
title: Window 함수
topic: 데이터베이스
description: SQL Server에서 Window 함수를 사용하는 예와 이유
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - sql
  - window
updatedAt: 2024-12-12T11:35:01.046Z
createdAt: 2024-05-18T11:35:01.046Z
---

SQL에서 윈도우 함수는 데이터를 집계하지 않고 현재 행과 관련된 행 집합에 대해 계산을 수행합니다.

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

## `AVG`, `MIN` 및 `MAX`

다음은 `AVG`, `MIN`, `MAX`를 사용한 몇 가지 간단한 예입니다.

```sql
SELECT
	id,
	name,
	category,
	AVG(price) OVER(),
	MIN(price) OVER(),
	MAX(price) OVER()
FROM books;
```

출력은 동일한 값을 갖는 세 개의 새로운 열로 구성됩니다.

| id  | name  | category   | avg(price) | min(price) | max(price) |
| --- | ----- | ---------- | ---------- | ---------- | ---------- |
| 1   | book1 | motivation | 50.10      | 5.20       | 120.90     |
| 2   | book2 | motivation | 50.10      | 5.20       | 120.90     |
| 3   | book3 | health     | 50.10      | 5.20       | 120.90     |

### 평균 가격에서 가격 차이를 계산

다음으로, `OVER`를 이용해 가격 차이와 백분율을 계산할 수 있습니다.

```sql
SELECT
	id,
	name,
	category,
	ROUND(AVG(price) OVER(), 2),
	ROUND((price - AVG(price) OVER()), 2) AS diff_avg,
	ROUND(ABS(price - AVG(price) OVER()) / (AVG(price) OVER() * 100)) AS pct_diff_avg
FROM books;
```

결과는 아래에 표시된 것과 같습니다.

| id  | name  | category   | avg(price) | diff_avg | pct_diff_avg |
| --- | ----- | ---------- | ---------- | -------- | ------------ |
| 1   | book1 | motivation | 50.10      | -20.10   | xx           |
| 2   | book2 | motivation | 50.10      | 5.60     | xx           |
| 3   | book3 | health     | 50.10      | 10.80    | xx           |

## 파티션닝

`PARTITION BY`는 `GROUPBY`와 매우 유사하지만, 분할은 `OVER()` 절 내에서 수행됩니다.

### 카테고리별 파티션

```sql
SELECT
	id,
	name,
	category,
	publisher,
	AVG(price) OVER(PARTITION BY category) AS avg_cat,
	AVG(price) OVER(PARTITION BY category, publisher) AS avg_cat_pub
FROM books;
```

아래와 유사한 결과가 생성됩니다.

| id  | name  | category   | publisher | avg_cat   | avg_cat_pub |
| --- | ----- | ---------- | --------- | --------- | ----------- |
| 1   | book1 | motivation | pelangi   | 30.00     | 32.00       |
| 2   | book2 | motivation | popular   | 30.00     | 25.00       |
| 3   | book3 | health     | pelangi   | **20.80** | **20.80**   |
| 4   | book4 | motivation | popular   | 30.00     | 25.00       |
| 5   | book5 | health     | pelangi   | **20.80** | **20.80**   |

첫 번째 파티션은 `category` 열을 기준으로 계산을 수행합니다. 동일한 `category`에 속하는 각 책은 동일한 값을 가져야 합니다. 두 번째 파티션은 `category` 열과 `publisher` 열을 사용하여 계산을 수행합니다. 동일한 `category`와 `publisher`에 속하는 사람들도 동일한 결과를 얻을 것으로 예상됩니다.

## 순위

### Row Number

순위는 창 함수를 사용하여 원하는 열을 기준으로 계산될 수 있습니다.

```sql
SELECT
	id,
	name,
	category,
	price,
	ROW_NUMBER() OVER(ORDER BY price DESC) AS rank_by_price
FROM books;
```

| id  | name  | category   | price | rank_by_price |
| --- | ----- | ---------- | ----- | ------------- |
| 1   | book1 | motivation | 99.99 | 1             |
| 2   | book2 | motivation | 70.00 | 2             |
| 3   | book3 | health     | 30.50 | 3             |
| 4   | book4 | motivation | 10.00 | 4             |
| 5   | book5 | health     | 5.80  | 5             |

표는 오름차순으로 얻은 순위에 따라 행을 나열합니다.

또한, 순위를 열, 예를 들어 `category`에 따라 분할할 수 있습니다.

```sql
SELECT
	id,
	name,
	category,
	price,
	ROW_NUMBER() OVER(PARTITION BY category ORDER BY price DESC) AS rank_partition_by_price
FROM books;
```

이제 결과는 자체 파티션 내의 행을 순위를 매깁니다.

| id  | name  | category   | price | rank_partition_by_price |
| --- | ----- | ---------- | ----- | ----------------------- |
| 1   | book1 | motivation | 99.99 | 1                       |
| 2   | book2 | motivation | 70.00 | 2                       |
| 3   | book3 | health     | 30.50 | 1                       |
| 4   | book5 | health     | 10.00 | 2                       |
| 5   | book4 | motivation | 5.80  | 1                       |

---

문제 진술: 책이 카테고리별 상위 3위이면 "예", 그렇지 않으면 "아니요"로 열을 채우는 새 열을 만듭니다.

이 문제를 해결하기 위해 `CASE` 문을 사용할 수 있습니다.

```sql
SELECT
	id,
	name,
	category,
	price,
	CASE
		WHEN ROW_NUMBER() OVER(PARTITION BY category ORDER BY price DESC) <= 3 THEN 'Yes'
		ELSE 'No'
	END AS top3_of_category
FROM books;
```

결과가 다음과 비슷할 것입니다.

| id  | name  | category   | price  | top3_of_category |
| --- | ----- | ---------- | ------ | ---------------- |
| 1   | book1 | motivation | 99.99  | Yes              |
| 2   | book2 | motivation | 70.00  | Yes              |
| 3   | book3 | motivation | 30.50  | Yes              |
| 4   | book5 | motivation | 10.00  | No               |
| 5   | book4 | motivation | 5.80   | No               |
| 6   | book6 | health     | 100.00 | Yes              |

### Rank 및 Dense Rank

Rank와 dense rank는 `ROW_NUMBER`가 작동하는 방식과 매우 유사하지만 미묘함이 있습니다. 대상 열에 대해 **정확히 동일한 값**을 가진 레코드를 순위를 매기는 데 유용합니다.

```sql
SELECT
	id,
	name,
	category,
	price,
	RANK() OVER(PARTITION BY category ORDER BY price DESC) AS rank_partition_by_price
FROM books;
```

| id  | name  | category   | price | rank_partition_by_price |
| --- | ----- | ---------- | ----- | ----------------------- |
| 1   | book1 | motivation | 99.99 | 1                       |
| 2   | book2 | motivation | 70.00 | 2                       |
| 3   | book3 | motivation | 70.00 | 2                       |
| 4   | book5 | motivation | 60.50 | 4                       |
| 5   | book4 | motivation | 60.50 | 4                       |
| 6   | book6 | motivation | 30.00 | 6                       |

동일한 레코드의 순위는 동일하지만, 후속 순위는 동일한 값을 갖는 레코드의 수에 따라 건너뜁니다.

반면, 밀집 순위는 순위 순서를 보존하고 후속 순위를 건너뛰지 않습니다.

아래는 동일한 쿼리에서 `RANK` 키워드를 `DENSE_RANK`로 대체했을 때 얻은 결과를 보여줍니다.

| id  | name  | category   | price | rank_partition_by_price |
| --- | ----- | ---------- | ----- | ----------------------- |
| 1   | book1 | motivation | 99.99 | 1                       |
| 2   | book2 | motivation | 70.00 | 2                       |
| 3   | book3 | motivation | 70.00 | 2                       |
| 4   | book5 | motivation | 60.50 | 3                       |
| 5   | book4 | motivation | 60.50 | 3                       |
| 6   | book6 | motivation | 30.00 | 4                       |

### Lag 및 Lead

- Lag - 순위 내에서 이전 값을 가져옵니다
- Lead - 순위 내에서 다음 값을 가져옵니다

```sql
SELECT
	id,
	name,
	category,
	price,
	LAG(price) OVER(PARTITION BY category ORDER BY price) a,
	LEAD(price) OVER(PARTITION BY category ORDER BY price) b
FROM books;
```

위 쿼리를 실행하면 아래 표에 표시된 결과가 생성됩니다.

| id  | name  | category   | price | a      | b      |
| --- | ----- | ---------- | ----- | ------ | ------ |
| 1   | book1 | motivation | 99.99 | _null_ | 70.00  |
| 2   | book2 | motivation | 70.00 | 99.99  | 70.00  |
| 3   | book3 | motivation | 70.00 | 70.00  | 60.50  |
| 4   | book5 | motivation | 60.50 | 70.00  | 60.50  |
| 5   | book4 | motivation | 60.50 | 60.50  | 30.00  |
| 6   | book6 | motivation | 30.00 | 60.50  | _null_ |

lag와 lead는 둘 다 사용할 `기간`을 지시하는 추가적인 선택적 매개변수를 허용합니다.

```
LAG(price, 2)
LEAD(price, 5)
```

## 사용 시나리오

윈도우 함수의 몇 가지 사용법

- 순위
- 이동 평균
- 누적(누적)
- 기간별 비교
- 백분위수 계산
- 시작가와 마감가
- 시계열 분석

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Mo Chen
title: "WINDOW FUNCTIONS | Advanced SQL"
publisher: YouTube
date: 2023, May 20
url: https://www.youtube.com/watch?v=efrR9eP2hUo
source: websites
---
::
<!-- prettier-ignore-end -->
