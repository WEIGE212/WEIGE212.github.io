---
title: Spring（五）案例：模拟手写Spring IoC容器
icon: laptop-code
date: 2023-12-06
star: true
order: 5
category:
  - Spring
  - 手撕代码
tag:
  - IoC
  - DI
---


模拟手写Spring里面核心的东西：IoC（控制反转）和DI（依赖注入）

<!-- more -->

## 1.准备测试bean

- 创建UserDao接口
```java
package org.example.dao;

public interface UserDao {

}
```

- 创建UserDaoImpl实现

```java
package org.example.dao.impl;

import org.example.dao.UserDao;


public class UserDaoImpl implements UserDao {
  public UserDaoImpl() {
        System.out.println("UserDaoImpl创建了...");
    }
}

```

- 创建UserService接口

```java
package org.example.service;

public interface UserService {


}
```

- 创建UserServiceImpl实现类

```java
package org.example.service.impl;

import org.example.service.UserService;

public class UserServiceImpl implements UserService {

	public UserServiceImpl() {
        System.out.println("UserServiceImpl创建了...");
    }
}

```
## 2.定义注解
通过注解的形式加载bean和实现依赖注入

- 定义bean注解

```java
package org.example.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Bean {
}
```

- 定义依赖注入注解

```java
package org.example.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Di {
}
```
## 3.定义并实现bean容器接口
- 定义bean容器接口
```java
package org.example.core;

public interface ApplicationContext {

    Object getBean(Class clazz);
}
```
- 注解bean容器接口实现
AnnotationApplicationContext基于注解扫描bean
```java
package org.example.core;

import java.util.HashMap;

public class AnnotationApplicationContext implements ApplicationContext {

    //存储bean的容器
    private HashMap<Class, Object> beanFactory = new HashMap<>();

    @Override
    public Object getBean(Class clazz) {
        return beanFactory.get(clazz);
    }

    /**
     * 根据包扫描加载bean
     * @param basePackage
     */
    public AnnotationApplicationContext(String basePackage) {
        
    }
}
```
## 4.编写扫描bean的逻辑
```java
package org.example.core;

import org.example.annotation.Bean;

import java.net.URL;
import java.net.URLDecoder;
import java.util.Enumeration;
import java.util.HashMap;
import java.io.File;

public class AnnotationApplicationContext implements ApplicationContext {
    //存储bean的容器
    private HashMap<Class, Object> beanFactory = new HashMap<>();
    private static String rootPath;

    @Override
    public Object getBean(Class clazz) {
        return beanFactory.get(clazz);
    }

    /**
     * 根据包扫描加载bean
     *
     * @param basePackage
     */
    public AnnotationApplicationContext(String basePackage) {
        try {
            String packageDirName = basePackage.replaceAll("\\.", "\\\\");
            Enumeration<URL> dirs = Thread.currentThread().getContextClassLoader().getResources(packageDirName);
            while (dirs.hasMoreElements()) {
                URL url = dirs.nextElement();
                String filePath = URLDecoder.decode(url.getFile(), "utf-8");
                rootPath = filePath.substring(0, filePath.length() - packageDirName.length());
                loadBean(new File(filePath));
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void loadBean(File fileParent) {
        if (fileParent.isDirectory()) {
            File[] childrenFiles = fileParent.listFiles();
            if (childrenFiles == null || childrenFiles.length == 0) {
                return;
            }
            for (File child : childrenFiles) {
                if (child.isDirectory()) {
                    //如果是个文件夹就继续调用该方法,使用了递归
                    loadBean(child);
                } else {
                    //通过文件路径转变成全类名,第一步把绝对路径部分去掉
                    String pathWithClass = child.getAbsolutePath().substring(rootPath.length() - 1);
                    //选中class文件
                    if (pathWithClass.contains(".class")) {
                        //    com.xinzhi.dao.UserDao
                        //去掉.class后缀，并且把 \ 替换成 .
                        String fullName = pathWithClass.replaceAll("\\\\", ".").replace(".class", "");
                        try {
                            Class<?> aClass = Class.forName(fullName);
                            //把非接口的类实例化放在map中
                            if (!aClass.isInterface()) {
                                Bean annotation = aClass.getAnnotation(Bean.class);
                                if (annotation != null) {
                                    Object instance = aClass.newInstance();
                                    //判断一下有没有接口
                                    if (aClass.getInterfaces().length > 0) {
                                        //如果有接口把接口的class当成key，实例对象当成value
                                        System.out.println("正在加载【" + aClass.getInterfaces()[0] + "】,实例对象是：" + instance.getClass().getName());
                                        beanFactory.put(aClass.getInterfaces()[0], instance);
                                    } else {
                                        //如果有接口把自己的class当成key，实例对象当成value
                                        System.out.println("正在加载【" + aClass.getName() + "】,实例对象是：" + instance.getClass().getName());
                                        beanFactory.put(aClass, instance);
                                    }
                                }
                            }
                        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
    }

}

```
## 5.注解标识bean
```java
@Bean
public class UserServiceImpl implements UserService
```

```java
@Bean
public class UserDaoImpl implements UserDao 
```
## 6.测试Bean加载
```java
package org.example;


import org.example.core.AnnotationApplicationContext;
import org.example.core.ApplicationContext;
import org.example.service.UserService;


public class ApplicationContextTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new AnnotationApplicationContext("org.example");
        UserService userService = (UserService)applicationContext.getBean(UserService.class);
        System.out.println("run success");
    }
}
```
**运行成功**
![手写Ioc](./assets/手写Ioc.png)

## 7.依赖注入
```java
package org.example.service.impl;

import org.example.annotation.Bean;
import org.example.annotation.Di;
import org.example.dao.UserDao;
import org.example.service.UserService;

@Bean
public class UserServiceImpl implements UserService {

    @Di
    private UserDao userDao;

    public UserServiceImpl() {
        System.out.println("UserServiceImpl创建了...");
    }
}
```
依赖注入实现
```java
package org.example.core;

import org.example.annotation.Bean;
import org.example.annotation.Di;

import java.lang.reflect.Field;
import java.net.URL;
import java.net.URLDecoder;
import java.util.Enumeration;
import java.util.HashMap;
import java.io.File;
import java.util.Map;

public class AnnotationApplicationContext implements ApplicationContext {
    //存储bean的容器
    private HashMap<Class, Object> beanFactory = new HashMap<>();
    private static String rootPath;

    @Override
    public Object getBean(Class clazz) {
        return beanFactory.get(clazz);
    }

    /**
     * 根据包扫描加载bean
     *
     * @param basePackage
     */
    public AnnotationApplicationContext(String basePackage) {
        try {
            String packageDirName = basePackage.replaceAll("\\.", "\\\\");
            Enumeration<URL> dirs = Thread.currentThread().getContextClassLoader().getResources(packageDirName);
            while (dirs.hasMoreElements()) {
                URL url = dirs.nextElement();
                String filePath = URLDecoder.decode(url.getFile(), "utf-8");
                rootPath = filePath.substring(0, filePath.length() - packageDirName.length());
                loadBean(new File(filePath));
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        loadDi();
    }

    private void loadBean(File fileParent) {
        if (fileParent.isDirectory()) {
            File[] childrenFiles = fileParent.listFiles();
            if (childrenFiles == null || childrenFiles.length == 0) {
                return;
            }
            for (File child : childrenFiles) {
                if (child.isDirectory()) {
                    //如果是个文件夹就继续调用该方法,使用了递归
                    loadBean(child);
                } else {
                    //通过文件路径转变成全类名,第一步把绝对路径部分去掉
                    String pathWithClass = child.getAbsolutePath().substring(rootPath.length() - 1);
                    //选中class文件
                    if (pathWithClass.contains(".class")) {
                        //    com.xinzhi.dao.UserDao
                        //去掉.class后缀，并且把 \ 替换成 .
                        String fullName = pathWithClass.replaceAll("\\\\", ".").replace(".class", "");
                        try {
                            Class<?> aClass = Class.forName(fullName);
                            //把非接口的类实例化放在map中
                            if (!aClass.isInterface()) {
                                Bean annotation = aClass.getAnnotation(Bean.class);
                                if (annotation != null) {
                                    Object instance = aClass.newInstance();
                                    //判断一下有没有接口
                                    if (aClass.getInterfaces().length > 0) {
                                        //如果有接口把接口的class当成key，实例对象当成value
                                        System.out.println("正在加载【" + aClass.getInterfaces()[0] + "】,实例对象是：" + instance.getClass().getName());
                                        beanFactory.put(aClass.getInterfaces()[0], instance);
                                    } else {
                                        //如果有接口把自己的class当成key，实例对象当成value
                                        System.out.println("正在加载【" + aClass.getName() + "】,实例对象是：" + instance.getClass().getName());
                                        beanFactory.put(aClass, instance);
                                    }
                                }
                            }
                        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
    }
    private void loadDi() {
        for(Map.Entry<Class,Object> entry : beanFactory.entrySet()){
            //就是咱们放在容器的对象
            Object obj = entry.getValue();
            Class<?> aClass = obj.getClass();
            Field[] declaredFields = aClass.getDeclaredFields();
            for (Field field : declaredFields){
                Di annotation = field.getAnnotation(Di.class);
                if( annotation != null ){
                    field.setAccessible(true);
                    try {
                        System.out.println("正在给【"+obj.getClass().getName()+"】属性【" + field.getName() + "】注入值【"+ beanFactory.get(field.getType()).getClass().getName() +"】");
                        field.set(obj,beanFactory.get(field.getType()));
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

}

```
**运行成功**
![手写DI](./assets/手写DI.png)

## 8.总结

::: tip IoC和DI实现过程总结如下：

1. 配置包扫描的路径
2. 依据提供包路径扫描其中的所包含的类
3. 通过反射判断类中是否包含Bean注解，如有包含通过反射进行实例化
4. 通过反射判断类中是否包含Di注解，如有包含通过反射将其设置为所对应的成员变量

:::