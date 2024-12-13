---
title: Materialized View
topic: Database
description: Best practices when using materialized view and some examples
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - sql
  - view
  - query
updatedAt: 2024-12-12T06:05:32.534Z
createdAt: 2024-12-12T06:05:32.534Z
---

Materialized view works similarly to a regular view but with caching to speed up performance.

<!--more-->

It stores the snapshot of the query result on the disk rather than recomputing the query each time it is being called.

## Use Cases

Materialized view can be used in the following scenarios.

1. Caching complex queries that are expensive to be evaluated
2. Data that is okay to be stale
3. Data that is read-intensive
4. Data that updates rarely or sparingly

It is a perfect use case for data warehouses to have a optimized query on aggregated data.

## Refreshes

As the materialized view operates on the snapshot of the query, the result will be stale as time goes on without updating. The snapshot data can be synchronized through the refresh mechanism.

There are two types of refresh mechanism

1. **Complete refresh** - Reconstruct the snapshot from scratch
2. **Fast refresh** - Find the diff or delta of the changes since the last refresh and apply those instead. Typically requires logging and additional changes to the base table.

The refresh can be performed either **on-demand**, where the user manually executes the refresh instruction or **on-commit** where automatic refresh is performed when any commit occurs to the base table.

<!-- prettier-ignore-start -->
::callout
---
type: warning
title: Do not refresh too frequently
---
The idea of a materialized view is to cache query results that are complex and expensive to calculate and are expected to have stale data. If you want it to be frequently refreshed to be consistent in near-time or real-time, you might as well just use the regular view instead of materialized view.
::
<!-- prettier-ignore-end -->

## Implementation

### PostgreSQL

Materialized view in PostgreSQL can be created with the `CREATE MATERIALIZED VIEW` clause.

```sql
CREATE MATERIALIZED VIEW total_sales_per_region AS
SELECT region, SUM(sales_amount) AS total_sales
FROM sales
GROUP BY region;
```

After that, the materialized view can be selected just like a regular view.

```sql
SELECT * FROM total_sales_per_region;
```

Refer to this [tutorial](https://neon.tech/postgresql/postgresql-views/postgresql-materialized-views) by Neon for more detailed examples.

### SQL Server

In SQL Server, the concept of materialized view is implement differently as "Indexed Views".

Essentially, we create a view first, then create an index for that view instead. This allows the data to be synchronized all the time without the need for refreshing.

```sql
-- Create view
CREATE VIEW [dbo].[mv_TotalSalesPerRegion]
WITH SCHEMABINDING
AS
SELECT region, SUM(sales_amount) AS total_sales
FROM [dbo].sales
GROUP BY region;

GO

-- Create index to the view using `region` as the index
CREATE UNIQUE CLUSTERED INDEX UIX_mvTotalSalesPerRegion_region
  ON [dbo].[mv_TotalSalesPerRegion]([region]);
```

Then, the materialized view can be used as follows

```sql
-- NOEXPAND is used to force the query optimizer to use the index
SELECT * FROM total_sales WITH (NOEXPAND);
```

However, the indexed view is quite restrictive as it requires the output to be deterministic.

Here is an example where I tried to create an index for the view that failed due to unmet constraint.

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

The error message:

```
Msg 10125, Level 16, State 1, Line 1
Cannot create index on view "Sales.dbo.mv_TaggedRegions" because it uses aggregate "STRING_AGG". Consider eliminating the aggregate, not indexing the view, or using alternate aggregates. For example, for AVG substitute SUM and COUNT_BIG, or for COUNT, substitute COUNT_BIG.
```

It disallow the `STRING_AGG` function because it is non-deterministic; the result of the view, for the same logical row, might not necessary be the same every time when queried albeit no parameter was changed/altered upon invocation.

Refer to the official [docs](https://learn.microsoft.com/en-us/sql/relational-databases/views/create-indexed-views?view=sql-server-ver16) by Microsoft on what feature is unavailable for indexed views.

## References

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
