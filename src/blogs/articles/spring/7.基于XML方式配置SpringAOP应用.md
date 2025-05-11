---
title: 基于XML方式配置 Spring AOP应用
icon: laptop-code
date: 2024-04-17
star: true
order: 7
category:
  - Spring
tag:
  - AOP
  - XML
---



 使用XML方式快速入门Spring AOP应用

<!-- more -->

## 1. 快速入门

### 1.1 导入AOP相关坐标

```java
    <dependencies>
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>1.9.19</version>
     </dependency>
```

### 1.2 准备目标类、准备增强类

```java
//目标接口
public interface UserService {
    void show1();
    void show2();
}

//目标类
public class UserServiceImpl implements UserService {
    @Override
    public void show1() {
        System.out.println("show1...");
    }

    @Override
    public void show2() {
        System.out.println("show2...");
    }
}

//增强类
public class MyAdvice {
    public void beforeAdvice(){
        System.out.println("beforeAdvice");
    }
    public void afterAdvice(){
        System.out.println("afterAdvice");
    }
}

//启动类
public class ApplicationContextTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
        UserService userService = (UserService) applicationContext.getBean("userService");
        userService.show1();
    }
}
```

### 1.3 配置切面给Spring管理

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">
    <!--配置目标类,内部的方法是连接点-->
    <bean id="userService" class="org.example.service.impl.UserServiceImpl"/>
    <!--配置通知类,内部的方法是增强方法-->
    <bean id="myAdvice" class="org.example.advice.MyAdvice"/>


    <aop:config>
        <!--配置切点表达式,对哪些方法进行增强-->
        <aop:pointcut id="myPointcut" expression="execution(void org.example.service.impl.UserServiceImpl.show1())"/>
        <!--切面=切点+通知-->
        <aop:aspect ref="myAdvice">
            <!--指定前置通知方法是beforeAdvice-->
            <aop:before method="beforeAdvice" pointcut-ref="myPointcut"/>
            <!--指定后置通知方法是afterAdvice-->
            <aop:after-returning method="afterAdvice" pointcut-ref="myPointcut"/>
        </aop:aspect>
    </aop:config>
</beans>
```

### 1.4 运行结果

 ![xml方式配置AOP运行结果](./assets/xml方式配置AOP运行结果.png)

## 2. 基于XML方式配置详解

### 2.1 切点表达式的配置方式

- 直接将切点表达式配置在通知上

```xml
<aop:after-returning method="afterAdvice" pointcut="execution(void org.example.service.impl.UserServiceImpl.show1())"/>
```

- 将切点表达式抽取到外面，在通知上进行引用

```xml
<aop:pointcut id="myPointcut" expression="execution(void org.example.service.impl.UserServiceImpl.show1())"/>
<aop:aspect ref="myAdvice">
    <aop:before method="beforeAdvice" pointcut-ref="myPointcut"/>
     <aop:after-returning method="afterAdvice" pointcut-ref="myPointcut"/>
</aop:aspect>
```

### 2.2 切点表达式的配置语法

- execution([访问修饰符]返回值类型 包名.类名.方法名(参数))
  - 访问修饰符可以省略不写。
  - 返回值类型、某一级包名、类名、方法名 可以使用 * 表示任意。
  - 包名与类名之间使用单点 . 表示该包下的类，使用双点 .. 表示该包及其子包下的类。
  - 参数列表可以使用两个点 .. 表示任意参数。
- 示例如下：

```xml
//表示访问修饰符为public、无返回值、在org.example.aop包下的TargetImpl类的无参方法show
execution(public void org.example.aop.TargetImpl.show())
//表述org.example.aop包下的TargetImpl类的任意方法
execution(* org.example.aop.TargetImpl.*(..))
//表示org.example.aop包下的任意类的任意方法
execution(* org.example.aop.*.*(..))
//表示org.example.aop包及其子包下的任意类的任意方法
execution(* org.example.aop..*.*(..))
//表示任意包中的任意类的任意方法
execution(* *..*.*(..))
```

### 2.3 通知的类型

- 前置通知 （< aop:before >）： 目标方法执行之前执行（示例如快速入门）。
- 后置通知 （< aop:after-returning >）： 目标方法执行之后执行，目标方法异常时，不在执行（示例如快速入门）。
- 环绕通知 （< aop:around >）： 目标方法执行前后执行，目标方法异常时，环绕后方法不在执行。

```java
public class MyAdvice {
    
    public void around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("环绕前通知");

        joinPoint.proceed();
        System.out.println("环绕后通知");
    }
}
```

```xml
<aop:aspect ref="myAdvice">
    <aop:around method="around" pointcut="execution(void org.example.service.impl.UserServiceImpl.show1())"/>
</aop:aspect>
```

- 异常通知 （< aop:after-throwing >）： 目标方法抛出异常时执行。

```java
public class MyAdvice {
    public void afterThrowing(){
        System.out.println("目标方法抛出异常了，后置通知和环绕后通知不在执行");
    }
}
```

```xml
 <aop:aspect ref="myAdvice">
     <aop:around method="afterThrowing" pointcut="execution(void org.example.service.impl.UserServiceImpl.show1())"/>
</aop:aspect>
```

- 最终通知 （< aop:after > ）：不管目标方法是否有异常，最终都会执行。

```java
public class MyAdvice {
	public void after(){
		System.out.println("不管目标方法有无异常，我都会执行");
	}
}
```

```xml
<aop:aspect ref="myAdvice">
    <aop:around method="after" pointcut="execution(void org.example.service.impl.UserServiceImpl.show1())"/>
</aop:aspect>
```

### 2.4 通知的参数

- JoinPoint ：连接点对象，任何通知都可使用，可以获得当前目标对象、目标方法参数等信息。

```java
public void 通知方法名称(JoinPoint joinPoint){
    //获得目标方法的参数
    System.out.println(joinPoint.getArgs());
    //获得目标对象
    System.out.println(joinPoint.getTarget());
    //获得精确的切点表达式信息
    System.out.println(joinPoint.getStaticPart());
}
```

- ProceedingJoinPoint ：JoinPoint子类对象，主要是在环绕通知中执行proceed()，进而执行目标方法。

```java
public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
    System.out.println(joinPoint.getArgs());//获得目标方法的参数
    System.out.println(joinPoint.getTarget());//获得目标对象
    System.out.println(joinPoint.getStaticPart());//获得精确的切点表达式信息
    Object result = joinPoint.proceed();//执行目标方法
    return result;//返回目标方法返回值
}	
```

- Throwable：异常对象，使用在异常通知中，需要在配置文件中指出异常对象名称。

```java
public void afterThrowing(JoinPoint joinPoint,Throwable th){
    //获得异常信息
    System.out.println("异常对象是："+th+"异常信息是："+th.getMessage());
}
```

```xml
<aop:after-throwing method="afterThrowing" pointcut-ref="myPointcut" throwing="th"/>
```

### 2.5 AOP的配置的两种方式

- 第一种：aspect的配置方式，以上的配置方式均为aspect的配置方式，参照本文以上代码即可。

- 第二种：advisor的配置方式：

  - 通知类实现了前置通知和后置通知接口。

  ```java
  public class Advices implements MethodBeforeAdvice, AfterReturningAdvice {
      public void before(Method method, Object[] objects, Object o) throws Throwable {
      	System.out.println("This is before Advice ...");
      }
      public void afterReturning(Object o, Method method, Object[] objects, Object o1) throws Throwable {
      	System.out.println("This is afterReturn Advice ...");
  	}
  }
  ```

  - 切面使用advisor标签配置。

  ```xml
  <aop:config>
  <!-- 将通知和切点进行结合 -->
  	<aop:advisor advice-ref="advices" pointcut="execution(void org.example.service.impl.UserServiceImpl.show1())"/>
  </aop:config>
  ```


- 使用aspect和advisor配置区别如下：

  - 配置语法不同

  ```xml
  <!-- 使用advisor配置 -->
  <aop:config>
  	<!-- advice-ref:通知Bean的id -->
  	<aop:advisor advice-ref="advices" pointcut="execution(void org.example.service.impl.UserServiceImpl.show1())"/>
  </aop:config>
  
  
  <!-- 使用aspect配置 -->
  <aop:config>
      <!-- ref:通知Bean的id -->
      <aop:aspect ref="advices">
      <aop:before method="before" pointcut="execution(void org.example.service.impl.UserServiceImpl.show1())"/>
      </aop:aspect>
  </aop:config>
  ```

  - 通知类的定义要求不同
    - advisor 需要的通知类需要实现Advice的子功能接口，（ MethodBeforeAdvice、AfterReturningAdvice 等）。
    - aspect 不需要通知类实现任何接口，在配置的时候指定哪些方法属于哪种通知类型即可，更加灵活方便。
  - 可配置的切面数量不同
    - 一个advisor只能配置一个固定通知和一个切点表达式。
    - 一个aspect可以配置多个通知和多个切点表达式任意组合，粒度更细。
  - 使用场景不同
    - 如果通知类型多、允许随意搭配情况下可以使用aspect进行配置。
    - 如果通知类型单一、且通知类中通知方法一次性都会使用到的情况下可以使用advisor进行配置。
    - 在通知类型已经固定，不用人为指定通知类型时，可以使用advisor进行配置，例如Spring事务控制的配置。

