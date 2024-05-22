---
title: DDL语句的执行顺序
icon: laptop-code
date: 2024-05-21
star: true
order: 1
category:
  - 数据库
tag:
  - SQL
---

SQL语法中DQL语句的正确编写顺序和其执行的顺序。

<!-- more -->

```sql
SELECT                   4
	字段列表
FROM                     1
	表名
WHERE                    2
	条件列表
GROUP BY                 3
	分组字段列表
HAVING                   
	分组后条件列表
ORDER BY                 5
	排序字段列表
LIMIT                    6
	分页参数
```

DDL语句的执行顺序即为: FROM—》WHERE—》GROUP BY—》SELECT—》ORDER BY—》LIMIT