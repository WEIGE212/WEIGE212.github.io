---
title: 基于AOP的声明式事务控制配置
icon: laptop-code
date: 2024-05-01
star: true
order: 9
category:
  - Spring
tag:
  - AOP
  - 注解
  - 事务控制
  - XML
---

事务控制是数据库操作中必不可少的技术，在使用JDBC开发时，我们使用connnection对事务进行控制，在使用MyBatis时，我们使用SqlSession对事务进行控制。对于切换数据库访问技术时，事务控制方式总会变化的问题，Spring框架提供了统一的控制事务的接口。

<!-- more -->

## 1. Spring事务编程主要概念

-  编程式事务控制：Spring提供了事务控制的类和方法，使用编码的方式对业务代码进行事务控制，事务控制代码和业务操作代码耦合到了一起。
- 声明式事务控制：Spring将事务控制的代码封装，对外提供了Xml和注解配置方式，通过配置的方式完成事务的控制，可以达到事务控制与业务操作代码解耦合。
- 平台事务管理器（ PlatformTransactionManager）：是一个接口标准，实现类都具备事务提交、回滚和获得事务对象的功能，不同持久层框架可能会有不同实现方案。
- 事务定义（TransactionDefinition）：定义封装事务的隔离级别、传播行为、过期时间等属性信息。
- 事务状态 （TransactionStatus）：存储当前事务的状态信息，如果事务是否提交、是否回滚、是否有回滚点等。

## 2. 基于XML方式配置事务控制

### 2.1 命名空间

```xml
xmlns:tx="http://www.springframework.org/schema/tx" 
http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/springtx.xsd
```

### 2.2 平台事务管理器

```xml
<!--平台事务管理器-->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
	<property name="dataSource" ref="dataSource"/>
</bean>
```

> 平台事务管理器PlatformTransactionManager是Spring提供的封装事务具体操作的规范接口，封装了事务的提交和回滚方法
>
> ```java
> public interface PlatformTransactionManager extends TransactionManager {
>         TransactionStatus getTransaction(@Nullable TransactionDefinition var1) throws 
>         TransactionException;
>         void commit(TransactionStatus var1) throws TransactionException;
>         void rollback(TransactionStatus var1) throws TransactionException;
> }
> ```
>
> 不同的持久层框架事务操作的方式有可能不同，所以不同的持久层框架有可能会有不同的平台事务管理器实现，例如，MyBatis作为持久层框架时，使用的平台事务管理器实现是DataSourceTransactionManager。Hibernate作为持久层框架时，使用的平台事务管理器是HibernateTransactionManager。

### 2.3 spring的事务通知

```xml
<tx:advice id="myAdvice" transaction-manager="transactionManager">
    <tx:attributes>
    	<tx:method name=""/> <!--指定需要事务控制方法-->
    </tx:attributes>
</tx:advice>
```

> 事务定义信息配置，每个事务有很多特性，例如：隔离级别、只读状态、超时时间等，这些信息在开发时可以通过connection进行指定，而此处要通过配置文件进行配置
>
> ```java
> <tx:attributes>
>     <tx:method name="方法名称"
>         isolation="隔离级别"
>         propagation="传播行为"
>         read-only="只读状态"
>         timeout="超时时间"/>
> </tx:attributes>
> ```
>
> - name属性名称指定哪个方法要进行哪些事务的属性配置，区分的是切点表达式指定的方法与此处指定的方法的
>
>   - 切点表达式，是指过滤哪些方法可以进行事务增强
>
>   - 事务属性信息的name，是指定哪个方法要进行哪些事务属性的配置
>
> ```xml
> <tx:advice id="myAdvice" transaction-manager="transactionManager">
>     <tx:attributes>
>     	<!--精确匹配xx方法-->
>         <tx:method name="xx"/>
>         <!--模糊匹配以Service结尾的方法-->
>         <tx:method name="*Service"/>
>         <!--模糊匹配以insert开头的方法-->
>         <tx:method name="insert*"/>
>         <!--模糊匹配以update开头的方法-->
>         <tx:method name="update*"/>
>         <!--模糊匹配任意方法，一般放到最后作为保底匹配-->
>         <tx:method name="*"/>
>     </tx:attributes>
> </tx:advice>
> ```
>
> - isolation属性：指定事务的隔离级别，事务并发存在三大问题：脏读、不可重复读、幻读/虚读。可以通过设置事务的隔离级别来保证并发问题的出现，常用的是READ_COMMITTED 和 REPEATABLE_READ
>   - DEFAULT：默认隔离级别，取决于当前数据库隔离级别，例如MySQL默认隔离级别是REPEATABLE_READ
>   - READ_UNCOMMITTED：A事务可以读取到B事务尚未提交的事务记录，不能解决任何并发问题，安全性最低，性能最高
>   - READ_COMMITTED：A事务只能读取到其他事务已经提交的记录，不能读取到未提交的记录。可以解决脏读问题，但是不能解决不可重复读和幻读
>   - REPEATABLE_READ：A事务多次从数据库读取某条记录结果一致，可以解决不可重复读，不可以解决幻读
>   - SERIALIZABLE：串行化，可以解决任何并发问题，安全性最高，但是性能最低
> - propagation属性：设置事务的传播行为，主要解决是A方法调用B方法时，事务的传播方式问题的，例如：使用单方的事务，还是A和B都使用自己的事务等。事务的传播行为有如下七种属性值可配置
>   - REQUIRED（默认值）：A调用B，B需要事务，如果A有事务B就加入A的事务中，如果A没有事务，B就自己创建一个事务
>   - REQUIRED_NEW：A调用B，B需要新事务，如果A有事务就挂起，B自己创建一个新的事务
>   - SUPPORTS：A调用B，B有无事务无所谓，A有事务就加入到A事务中，A无事务B就以非事务方式执行
>   - NOT_SUPPORTS：A调用B，B以无事务方式执行，A如有事务则挂起
>   - NEVER：A调用B，B以无事务方式执行，A如有事务则抛出异常
>   - MANDATORY ：A调用B，B要加入A的事务中，如果A无事务就抛出异常
>   - NESTED ：A调用B，B创建一个新事务，A有事务就作为嵌套事务存在，A没事务就以创建的新事务执行
> - read-only属性：设置当前的只读状态，如果是查询则设置为true，可以提高查询性能，如果是更新（增删改）操作则设置为false
>
> ```xml
> <!-- 一般查询相关的业务操作都会设置为只读模式 -->
> <tx:method name="select*" read-only="true"/>
> <tx:method name="find*" read-only="true"/>
> ```
>
> - timeout属性：设置事务执行的超时时间，单位是秒，如果超过该时间限制但事务还没有完成，则自动回滚事务，不在继续执行。默认值是-1，即没有超时时间限制
>
> ```xml
> <tx:method name="select*" read-only="true" timeout="3"/>
> ```

### 2.5 使用advisor方式配置切面

```xml
<aop:config>
	<aop:advisor advice-ref="myAdvice" pointcut="execution(* org.example.service.impl.*.*(..))"/>
</aop:config>
```

## 3. 基于注解方式配置事务控制

### 3.1 半注解的形式

- 在配置文件中配置平台事务管理器，开启事务注解开关

```xml
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
	<property name="dataSource" ref="dataSource"/>
</bean>
<!--配置事务的注解驱动-->
<tx:annotation-driven transaction-manager="transactionManager"/>
```

- 配置事务通知

```java
@Service
public class XxxServiceImpl implements XxxService {
   		 //<tx:method name="*" isolation="REPEATABLE_READ" propagation="REQUIRED“/>
   		@Transactional(isolation = Isolation.REPEATABLE_READ,propagation = Propagation.REQUIRED,readOnly = false,timeout = 5)
        public void xxx(String decrAccountName, String incrAccountName, int money) {
    }
}
```

### 3.2 全注解的形式

- 以注解的方式配置，需要配置类来代替，例如：


```java
@Configuration
@ComponentScan("org.example.service")
@PropertySource("classpath:jdbc.properties")
@MapperScan("org.example.mapper")
@EnableTransactionManagement
public class ApplicationContextConfig {
	@Bean
    public PlatformTransactionManager tansactionManager(DataSource dataSource){
        DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
        transactionManager.setDataSource(dataSource);
        return transactionManager;
    }
// ... 省略其他配置 ...
}

```

- 配置事务通知

```java
@Service
public class AccoutServiceImpl implements XxxService {
   		 //<tx:method name="*" isolation="REPEATABLE_READ" propagation="REQUIRED“/>
   		@Transactional(isolation = Isolation.REPEATABLE_READ,propagation = Propagation.REQUIRED,readOnly = false,timeout = 5)
        public void xxx(String decrAccountName, String incrAccountName, int money) {
    }
}
```



