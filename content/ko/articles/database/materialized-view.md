---
title: 실체화된 뷰
topic: 데이터베이스
description: 실체화된 뷰를 사용할 때의 모법 사례 및 예시 몇 가지
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - sql
  - view
  - query
updatedAt: 2025-02-01T00:04:26.548Z
createdAt: 2024-12-12T06:05:32.534Z
---

실체화된 뷰는(Materialized view) 일반 뷰와 비슷하게 작동하지만 캐싱을통해 성능을 향상시킵니다.

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

호출될 때마다 쿼리를 다시 계산하지 않고 쿼리 결과의 스냅샷을 디스크에 저장합니다.

## 사용 사례

실체된 뷰는 다음과 같은 시나리오에서 사용될 수 있습니다.

1. 복잡하고 비싼 쿼리는 캐싱을 됨니다
2. 오래된 데이터 괜찮아
3. 읽이 집약적인 데이터
4. 업데이트가 자주 되지 않는 데이터

실체화된 뷰는 데이터웨어하우스에서 쿼리 성능은 높이기 위해 많이 사용합니다.

## 데이터 새로 고치다

실체화된 뷰가 쿼리의 스냅샷에서 작동하기 때문에 업데이트 없이 시간이 지남에 따라 결과가 오래될 것입니다. 스냅샷 데이터는 새로 고침 메커니즘을 통해 동기화할 수 있습니다.

그 새로 고침 메커니즘을 두 가지 있습니다.

1. **완전히 새로 고침(Complete refresh)** - 스냅샷을 처음부터 재구성합니다.
2. **빠르게 새로 고침(Fast refresh)** - 마지막 새로 고침 이후 변경 사항의 차이점을 찾아 변경 사항을 적용합니다. 일반적으로 로깅 및 추가 변경이 필요합니다.

새로 고침은 사용자가 수동으로 새로 고침 지침을 실행하는 **요청 시** 또는 기본 테이블에 커밋이 발생할 때 자동으로 새로 고침이 수행되는 **커밋 시**로 수행할 수 있습니다.

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: 너무 자주 동기화하지 마세요
---
실체화된 뷰의 아이디어는 계산하기 복잡하고 비용이 많이 들고 오래된 데이터가 있을 것으로 예상되는 쿼리 결과를 캐시하는 것입니다. 근시 또는 실시간으로 일관성을 유지하기 위해 자주 새로 고침하려면 실체화된 뷰 대신 일반 뷰를 사용하는 것이 좋습니다.
::
<!-- prettier-ignore-end -->

## 코드에 구현

### PostgreSQL

PostgreSQL로 실채화된 뷰는 `CREATE MATERIALIZED VIEW` 명령을 실행하며 작성할 수 있습니다.

```sql
CREATE MATERIALIZED VIEW total_sales_per_region AS
SELECT region, SUM(sales_amount) AS total_sales
FROM sales
GROUP BY region;
```

그 다음에, 실체화된 뷰가 일반적인 뷰 같은 선택할 수 있습니다.

```sql
SELECT * FROM total_sales_per_region;
```

더 자세한 예제는 Neon의 [튜토리얼](https://neon.tech/postgresql/postgresql-views/postgresql-materialized-views)을 참조하세요.

### SQL Server

SQL Server에서는 실체화된 뷰의 개념이 "인덱싱된 뷰(Indexed view)"와 다르게 구현됩니다.

먼저 뷰를 만들고 색인이 추가합니다. 이렇게 하면 새로 고침할 필요 없이 항상 데이터를 동기화할 수 있습니다.

```sql
-- 뷰가 만들기
CREATE VIEW [dbo].[mv_TotalSalesPerRegion]
WITH SCHEMABINDING
AS
SELECT region, SUM(sales_amount) AS total_sales
FROM [dbo].sales
GROUP BY region;

GO

-- `region`을 이용하여 색인이 만들기
CREATE UNIQUE CLUSTERED INDEX UIX_mvTotalSalesPerRegion_region
  ON [dbo].[mv_TotalSalesPerRegion]([region]);
```

그 후에, 이 실체화된 뷰가 이렇게 같은 명령을 실행될 수 있습니다.

```sql
-- NOEXPAND는 쿼리 최적화 프로그램이 인덱스를 사용하도록 강제하는 데 사용됩니다
SELECT * FROM total_sales WITH (NOEXPAND);
```

하지만, 인덱스 뷰는 제한 많이 있습니다. 출력이 결정적이어야 합니다.

제약 조건이 위반하여 실패한 뷰에 대한 인덱스를 만들려고 시도한 예는 다음과 같습니다.

```sql
CREATE VIEW [dbo].[mv_TaggedRegions]
WITH SCHEMABINDING
AS
SELECT
  [Region],
  STRING_AGG(t.[Tags], ',') AS Tags
FROM [dbo].[Sales]
GROUP BY [Region];
```

그 오류메시지가 다음과 같습니다.

```
Msg 10125, Level 16, State 1, Line 1
Cannot create index on view "Sales.dbo.mv_TaggedRegions" because it uses aggregate "STRING_AGG". Consider eliminating the aggregate, not indexing the view, or using alternate aggregates. For example, for AVG substitute SUM and COUNT_BIG, or for COUNT, substitute COUNT_BIG.
```

`STRING_AGG` 함수는 비결정적이므로 사용할 수 없습니다. 호출 시 매개변수가 변경되거나 바뀌지 않았더라도 동일한 논리적 행에 대한 뷰의 결과는 쿼리를 실행할 때마다 반드시 같지 않을 수 있습니다.

인덱싱된 뷰에서 사용할 수 없는 기능에 대해서는 Microsoft의 공식 [문서](https://learn.microsoft.com/en-us/sql/relational-databases/views/create-indexed-views?view=sql-server-ver16)를 참조하세요.

## 참고

<!-- prettier-ignore-start -->
::apa-reference
---
title: Materialized view
publisher: Wikipedia
retrievedDate: 2024, December 12
url: https://en.wikipedia.org/wiki/Materialized_view
source: websites
---
::

::apa-reference
---
title: Differences Between Views and Materialized Views in SQL
publisher: GeekForGeeks
url: https://www.geeksforgeeks.org/differences-between-views-and-materialized-views-in-sql/
date: 2024, December 2
source: websites
---
::

::apa-reference
---
title: PostgreSQL Materialized Views
organization: Neon
date: 2024, March 16
url: https://neon.tech/postgresql/postgresql-views/postgresql-materialized-views
source: websites
---
::

::apa-reference
---
authors:
  - Schnider, D # Dani Schnider
title: Materialized View Refresh for Dummies
date: 2019, February 18
url: https://danischnider.wordpress.com/2019/02/18/materialized-view-refresh-for-dummies/
source: websites
---
::

::apa-reference
---
authors:
  - KeepLearningIT
publisher: YouTube
title: Indexed Views (Materialized Views) in SQL Server and Performance Considerations
date: 2020, August 7
url: https://www.youtube.com/watch?v=qDWPdgglbvA
source: websites
---
::

::apa-reference
---
organization: Microsoft
title: Create indexed views
date: 2024, July 23
url: https://learn.microsoft.com/en-us/sql/relational-databases/views/create-indexed-views?view=sql-server-ver16
source: websites
---
::
<!-- prettier-ignore-end -->
