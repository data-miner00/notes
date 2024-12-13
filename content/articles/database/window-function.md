---
title: Window Function
topic: Database
description: Examples and the reason to use window function in SQL Server
author:
  - name: Shaun Chong
    avatar: levi.png
tags:
  - sql
  - window
updatedAt: 2024-12-12T11:35:01.046Z
createdAt: 2024-05-18T11:35:01.046Z
---

In SQL, window function performs calculation across a set of rows, that are somehow related to the current row without aggregating the data.

<!--more-->

## `AVG`, `MIN` and `MAX`

Here are a few straightforward examples using `AVG`, `MIN` and `MAX`.

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

The output will yield the following with three new columns with the same value.

| id  | name  | category   | avg(price) | min(price) | max(price) |
| --- | ----- | ---------- | ---------- | ---------- | ---------- |
| 1   | book1 | motivation | 50.10      | 5.20       | 120.90     |
| 2   | book2 | motivation | 50.10      | 5.20       | 120.90     |
| 3   | book3 | health     | 50.10      | 5.20       | 120.90     |

### Difference from `AVG`

Next, we can calculate the price difference and the percentage with `OVER`.

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

It will the results that looks something shown below.

| id  | name  | category   | avg(price) | diff_avg | pct_diff_avg |
| --- | ----- | ---------- | ---------- | -------- | ------------ |
| 1   | book1 | motivation | 50.10      | -20.10   | xx           |
| 2   | book2 | motivation | 50.10      | 5.60     | xx           |
| 3   | book3 | health     | 50.10      | 10.80    | xx           |

## Partitioning

`PARTITION BY` is very similar to `GROUPBY`, just that partition by happens within the `OVER()` clause.

### Partition by Category

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

It will produce the results similar to below.

| id  | name  | category   | publisher | avg_cat   | avg_cat_pub |
| --- | ----- | ---------- | --------- | --------- | ----------- |
| 1   | book1 | motivation | pelangi   | 30.00     | 32.00       |
| 2   | book2 | motivation | popular   | 30.00     | 25.00       |
| 3   | book3 | health     | pelangi   | **20.80** | **20.80**   |
| 4   | book4 | motivation | popular   | 30.00     | 25.00       |
| 5   | book5 | health     | pelangi   | **20.80** | **20.80**   |

The first partition by uses the `category` column as the baseline to perform the calculation. Each books that belongs to the same `category` should have the same value. The second partition uses the `category` column as well as the `publisher` column to perform the calculation. It is also expected for those who fall under the same `category` and `publisher` will have the same result.

## Ranking

### Row Number

A rank can be computed based on a desired column with the window function.

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

The table will list down the rows according to the rank obtained in ascending order.

Additionally, we can partition the ranking according to a column, `category` for example.

```sql
SELECT
	id,
	name,
	category,
	price,
	ROW_NUMBER() OVER(PARTITION BY category ORDER BY price DESC) AS rank_partition_by_price
FROM books;
```

The result will now rank the rows within its own partition.

| id  | name  | category   | price | rank_partition_by_price |
| --- | ----- | ---------- | ----- | ----------------------- |
| 1   | book1 | motivation | 99.99 | 1                       |
| 2   | book2 | motivation | 70.00 | 2                       |
| 3   | book3 | health     | 30.50 | 1                       |
| 4   | book5 | health     | 10.00 | 2                       |
| 5   | book4 | motivation | 5.80  | 1                       |

---

Problem statement: Create a new column that populate the column with "Yes" if the book is top 3 by category, "No" if otherwise.

To tackle this issue, we can use the `CASE` statement.

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

The result will be similar to this.

| id  | name  | category   | price  | top3_of_category |
| --- | ----- | ---------- | ------ | ---------------- |
| 1   | book1 | motivation | 99.99  | Yes              |
| 2   | book2 | motivation | 70.00  | Yes              |
| 3   | book3 | motivation | 30.50  | Yes              |
| 4   | book5 | motivation | 10.00  | No               |
| 5   | book4 | motivation | 5.80   | No               |
| 6   | book6 | health     | 100.00 | Yes              |

### Rank & Dense Rank

Rank and dense rank is pretty similar to how `ROW_NUMBER` will work, but with a subtlety. They are useful to rank records that have **the exact same value** against a target column.

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

The rank for the same records are the same, but the subsequent rank is skipped depending on how many records are having the same value.

Dense rank on the other hand, preserves the ranking sequence and does not skip any of the subsequent rank.

Below shows the results obtained when we replace the `RANK` keyword to `DENSE_RANK` in the same query.

| id  | name  | category   | price | rank_partition_by_price |
| --- | ----- | ---------- | ----- | ----------------------- |
| 1   | book1 | motivation | 99.99 | 1                       |
| 2   | book2 | motivation | 70.00 | 2                       |
| 3   | book3 | motivation | 70.00 | 2                       |
| 4   | book5 | motivation | 60.50 | 3                       |
| 5   | book4 | motivation | 60.50 | 3                       |
| 6   | book6 | motivation | 30.00 | 4                       |

### Lag and Lead

- Lag - bring in the previous value within the rank
- Lead - bring in the next value within the rank

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

The query above will yield the results shown on the table below.

| id  | name  | category   | price | a      | b      |
| --- | ----- | ---------- | ----- | ------ | ------ |
| 1   | book1 | motivation | 99.99 | _null_ | 70.00  |
| 2   | book2 | motivation | 70.00 | 99.99  | 70.00  |
| 3   | book3 | motivation | 70.00 | 70.00  | 60.50  |
| 4   | book5 | motivation | 60.50 | 70.00  | 60.50  |
| 5   | book4 | motivation | 60.50 | 60.50  | 30.00  |
| 6   | book6 | motivation | 30.00 | 60.50  | _null_ |

Both lag and lead accepts an additional optional parameter that dictates the `period` to be used.

```
LAG(price, 2)
LEAD(price, 5)
```

## Usage

A few usages for window function

- Ranking
- Moving averages
- Cumulative (running total)
- Period-to-period comparison
- Percentile calculations
- Opening and closing prices
- Time series analysis

## References

<!-- prettier-ignore-start -->
::apa-reference
---
authors:
 - Mo Chen
title: "WINDOW FUNCTIONS | Advanced SQL"
publisher: YouTube
retrievedDate: 2023, May 20
url: https://www.youtube.com/watch?v=efrR9eP2hUo
source: websites
---
::
<!-- prettier-ignore-end -->
