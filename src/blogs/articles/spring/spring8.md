---
title: 基于注解方式配置 Spring AOP应用
icon: laptop-code
date: 2024-04-21
star: true
order: 8
category:
  - Spring
tag:
  - AOP
  - 注解
---



使用注解的方式配置Spring AOP应用

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
    public void around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("环绕前通知");
        joinPoint.proceed();
        System.out.println("环绕后通知");
    }
}

//启动类
public class ApplicationContextTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(ApplicationContextTest.class);
        UserService userService = (UserService) applicationContext.getBean("userService");
        userService.show1();
    }
}
```

### 1.3 配置注解

```java
//配置目标类注解
@Component("userService")
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

//配置增强类注解
@Component
@Aspect
public class MyAdvice {
    @Around("execution(void org.example.service..*.*(..))")
    public void around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("环绕前通知");
        joinPoint.proceed();
        System.out.println("环绕后通知");
    }
}

//配置启动类注解
@Configuration
@ComponentScan(value = "org.example")
@EnableAspectJAutoProxy
public class ApplicationContextTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(ApplicationContextTest.class);
        UserService userService = (UserService) applicationContext.getBean("userService");
        userService.show1();
    }
}

```

### 1.4 运行结果

![基于注解AOP运行结果](./assets/基于注解AOP运行结果.png)

## 2. 基于注解配置详解

### 2.1 通知类型配置

```java
//前置通知
@Before("execution(*org.example.aop.*.*(..))")
public void before(JoinPoint joinPoint){}
//后置通知
@AfterReturning("execution(*org.example.aop.*.*(..))")
public void AfterReturning(JoinPoint joinPoint){}
//环绕通知
@Around("execution(* org.example.aop.*.*(..))")
public void around(ProceedingJoinPoint joinPoint) throws Throwable {}
//异常通知
@AfterThrowing("execution(* org.example.aop.*.*(..))")
public void AfterThrowing(JoinPoint joinPoint){}
//最终通知
@After("execution(* org.example.aop.*.*(..))")
public void After(JoinPoint joinPoint){}
```

### 2.2 切点表达式引用配置

> 使用一个空方法，将切点表达式标注在空方法上，其他通知方法引用即可

```java
@Component
@Aspect
public class AnnoAdvice {
//切点表达式抽取
@Pointcut("execution(* com.itheima.aop.*.*(..))")
public void pointcut(){}
//前置通知
@Before("pointcut()")
public void before(JoinPoint joinPoint){}
//后置通知
@AfterReturning("AnnoAdvice.pointcut()")
public void AfterReturning(JoinPoint joinPoint){}
}
```

### 2.3 开启注解的代理的配置

@EnableAspectJAutoProxy，用于代替xml配置文件中的\<aop:aspectj-autoproxy/\>

```java
@EnableAspectJAutoProxy
public class ApplicationContextTest {
    public static void main(String[] args) {
    }
}
```

