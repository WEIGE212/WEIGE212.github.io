---
title: 将jar包添加Maven仓库
icon: laptop-code
date: 2024-05-21
star: false
order: 2
category:
  - 代码片段
tag:
  - Maven
---

Maven用于将jar包添加Maven仓库的命令

<!-- more -->


```java
mvn install:install-file --settings C:\Users\Administrator\.m2\settings.xml -Dfile=D:\jar包\artemis-http-client-1.1.7.jar -DartifactId=artemis-http-client -DgroupId=com.hikvision -Dversion=1.1.7 -Dpackaging=jar -DgeneratePom=true
# --settings：指定maven配置文件
# -Dfile：本地jar包的相对路径或者绝对路径
# -DgroupId:jar包的组织id,也是需要安装的文件夹路径
# -DartifactId:包名
# -Dversion:版本号
#-Dpackaging：打包方式
#-DgeneratePom：是否生成依赖包POM文件
```

