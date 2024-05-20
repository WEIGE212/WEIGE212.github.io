---
title: 通过XML方式实现Spring IoC应用详解
icon: laptop-code
date: 2024-03-16
star: true
order: 3
category:
  - Spring
tag:
  - IoC
  - DI
  - XML
---


通过XML方式实现Spring IoC应用快速上手

<!-- more -->

## 1. 快速上手
### 第一步：Maven导入Spring坐标
- 首先，在pom.xml文件中配置Spring-context坐标，这边以5.3.19版本为例。

```xml
<dependencies>
        <!--Spring核心-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.3.19</version>
     </dependency>
 </dependencies>
```
![spring核心坐标导入](./assets/spring核心坐标导入.png)

### 第二步：定义Bean的对象

- 如下图，以UseDao和UseService为例，创建其接口和实现类。		
  
  ![project目录.png](./assets/project目录.png)

- 分别在UserDaoImpl和DaoImpl在构造函数中添加如下代码，以验证其对象已经创建。

```java
public class UserDaoImpl implements UserDao {
    public UserDaoImpl() {
        System.out.println("UserDaoImpl创建了...");
    }
}

public class UserServiceImpl implements UserService {
    public UserServiceImpl() {
        System.out.println("UserServiceImpl创建了...");
    }

}
```
### 第三步：创建Bean对象的配置文件
- 在Resouse目录下创建Bean的配置文件，如下图所示分别创建了Bean.xml和ApplicationContext.xml文件，他们分别对应是BeanFacory和ApplicationContext的配置文件，两者功能一样。至于BeanFactory和ApplicationContext的关系上文做了详细的回答，[点我，看详解答！！！](spring2.md)

  ![resource目录](./assets/resource目录.png)

- 配置\<Bean>\</Bean>标签

```java
    <bean id="userService" class="org.example.service.impl.UserServiceImpl"/>
  
    <bean id="userDao" class="org.example.dao.impl.UserDaoImpl"/>
```
### 第四步：创建BeanFactory，加载配置文件，创建Bean对象
- 分别以BeanFactory和Application两种方式进行演示代码如下：

```java
public class ApplicationContextTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
       	//在代码中用来获取UseDao对象
        //UserDao userUserDao = (UserDao) applicationContext.getBean("userDao");
    }
}

public class BeanFactoryTest {

    public static void main(String[] args) {
        DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();
        //创建读取器
        XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(beanFactory);
        //加载配置文件
        reader.loadBeanDefinitions("beans.xml");
        //获取Bean实例对象
        //UserService userService = (UserService) beanFactory.getBean("userService");
    }
}

```
## 2. Bean配置详解
### 2.1 Bean的常用配置
&emsp;&emsp;Spring中常用的Bean配置如下：
- \<bean id="" class=""> ：Bean的id和全限定名配置
```xml
<bean id="userDao" class="org.example.service.impl.UserServiceImpl"/>
```
- **\<bean name="">** ：通过name设置Bean的别名，通过别名也能直接获取到Bean实例
```xml
<bean id="userDao" name="aaa,bbb" class="org.example.service.impl.UserServiceImpl"/>
```
- **\<bean scope="">** ：Bean的作用范围，BeanFactory作为容器时取值singleton和prototype
	- singleton：单例，默认值，Spring容器创建的时候，就会进行Bean的实例化，并存储到容器内部的单例池中，每次getBean时都是从单例池中获取相同的Bean实例；
 	- prototype：原型，Spring容器初始化时不会创建Bean实例，当调用getBean时才会实例化Bean，每次getBean都会创建一个新的Bean实例。
```xml
<bean id="userDao" class="org.example.service.impl.UserServiceImpl" scope="singleton"/>
```
- **\<bean lazy-init="">** ：Bean的实例化时机，是否延迟加载。BeanFactory作为容器时无效
&emsp;&emsp;当lazy-init设置为true时为延迟加载，也就是当Spring容器创建的时候，不会立即创建Bean实例，等待用到时在创
建Bean实例并存储到单例池中去，后续在使用该Bean直接从单例池获取即可，本质上该Bean还是单例的 
```xml
<bean id="userDao" class="org.example.service.impl.UserServiceImpl" lazy-init="true"/>
```
- **\<bean init-method="">** ：Bean实例化后自动执行的初始化方法，method指定方法名
- **\<bean destroy-method="">** ：Bean实例销毁前的方法，method指定方法名
```xml
<bean id="userDao" class="org.example.service.impl.UserServiceImpl" init-method="init" 
destroy-method="destroy"/>
```
在UserDao中添加如下方法，用于指定
```java
public class UserDaoImpl implements UserDao {
	public UserDaoImpl() { System.out.println("UserDaoImpl创建了..."); }
	public void init(){ System.out.println("初始化方法..."); }
	public void destroy(){ System.out.println("销毁方法..."); }
}
```
	扩展：除此之外，我们还可以通过实现 InitializingBean 接口，完成一些Bean的初始化操作。
```java
public class UserDaoImpl implements UserDao, InitializingBean {
	public UserDaoImpl() {System.out.println("UserDaoImpl创建了...");}
	public void init(){System.out.println("初始化方法...");}
	public void destroy(){System.out.println("销毁方法...");}
	//执行时机早于init-method配置的方法
	public void afterPropertiesSet() throws Exception {
		System.out.println("InitializingBean..."); 
	}
}
```
- **\<bean autowire="byType">** ：设置自动注入模式，常用的有按照类型byType，按照名字byName
	- byName：通过属性名自动装配，即去匹配 setXxx 与 id="xxx"（name="xxx"）是否一致；
	- byType：通过Bean的类型从容器中匹配，匹配出多个相同Bean类型时，报错。 	
- **\<bean factory-bean="" factory-method=""/**> ：指定哪个工厂Bean的哪个方法完成Bean的创建
### 2.2 Bean的实例化配置
&emsp;&emsp;Spring对Bean的实例化分以下两种：
- 构造方式实例化：底层通过构造方法对Bean进行实例化
- 工厂方式实例化：底层通过调用自定义的工厂方法对Bean进行实例化

构造方式实例化Bean又分为无参构造方法实例化和有参构造方法实例化，Spring中配置的\<bean>几乎都是无参构
造该方式，通过\<constructor-arg>标签，嵌入在\<bean>标签内部提供构造参数，如下：
```java
public class UserDaoImpl implements UserDao {
//    public UserDaoImpl() {
//        System.out.println("UserDaoImpl创建了...");
//    }

    public UserDaoImpl(String name){
        System.out.println(name+"对象创建了...");
    }
}
```
```xml
    <bean id="userDao" class="org.example.dao.impl.UserDaoImpl">
        <constructor-arg name="name" value="weige"/>
    </bean>

```

&emsp;&emsp;工厂方式实例化Bean，又分为如下三种：
- 静态工厂方法实例化Bean
- 实例工厂方法实例化Bean
- 实现FactoryBean规范延迟实例化Bean

&emsp;&emsp;静态工厂方法实例化Bean，其实就是定义一个工厂类，提供一个静态方法用于生产Bean实例，在将该工厂类及其
静态方法配置给Spring即可，代码如下：
```java
//工厂类
public class UserDaoFactoryBean {
	//非静态工厂方法
	public static UserDao getUserDao(String name){
	//可以在此编写一些其他逻辑代码
	return new UserDaoImpl();
	}
}
```
```xml
<bean id="userDao" class="org.example.factory.UserDaoFactoryBean" factory-method="getUserDao">
	<constructor-arg name="name" value="weige"/>
</bean>
```
	<constructor-arg>标签不仅仅是为构造方法传递参数，只要是为了实例化对象而传递的参数都可以通过 <constructor-arg>标签完成
&emsp;&emsp;实例工厂方法，与静态工厂方式比较，该方式需要先有工厂对象，在用工厂对象去调用非静态方法，所以在进行配置时，要先配置工厂Bean，在配置目标Bean代码如下：
```java
public class UserDaoFactoryBean2 {
    public UserDao getUserDao(String name){
        //可以在此编写一些其他逻辑代码
        return new UserDaoImpl();
    }
}
```
```xml
  <!-- 配置实例工厂Bean -->
    <bean id="userDaoFactoryBean2" class="org.example.factory.UserDaoFactoryBean2"/>
    <!-- 配置实例工厂Bean的哪个方法作为工厂方法 -->
    <bean id="userDao" factory-bean="userDaoFactoryBean2" factory-method="getUserDao">
        <constructor-arg name="name" value="haohao"/>
    </bean>
```
&emsp;&emsp;实现FactoryBean规范延迟实例化Bean，Spring提供了FactoryBean的接口规范，FactoryBean接口定义如下：
```java
public interface FactoryBean<T> {
	String OBJECT_TYPE_ATTRIBUTE = “factoryBeanObjectType”;
T 	getObject() throws Exception; //获得实例对象方法
	Class<?> getObjectType(); //获得实例对象类型方法
		default boolean isSingleton() {
		return true;
	}
}
```
&emsp;&emsp;定义工厂实现FactoryBean
```java
public class UserDaoFactoryBean3 implements FactoryBean<UserDao> {
	public UserDao getObject() throws Exception {
		return new UserDaoImpl();
	}
	public Class<?> getObjectType() {
		return UserDao.class;
	}
}
```
```xml
<bean id="userDao" class="org.example.factory.UserDaoFactoryBean3"/>
```
```java
ApplicationContext applicationContext =new ClassPathxmlApplicationContext("applicationContext.xml");
Object userDao = applicationContext.getBean("userDao");
System.out.println(userDao);
```
&emsp;&emsp;通过断点观察发现Spring容器创建时，FactoryBean被实例化了，并存储到了单例池singletonObjects中，但是getObject() 方法尚未被执行，UserDaoImpl也没被实例化，当首次用到UserDaoImpl时，才调用getObject() ，此工厂方式产生的Bean实例不会存储到单例池singletonObjects中，会存储到 factoryBeanObjectCache 缓存池中，并且后期每次使用到userDao都从该缓存池中返回的是同一个userDao实例。
### 2.3 Bean的依赖注入配置
&emsp;&emsp;Bean的依赖注入有如下两种方式：
- 通过Bean的set方法注入
- 通过构造Bean的方法进行注入

&emsp;&emsp;依赖注入的数据类型有如下三种：
- 普通数据类型，例如：String、int、boolean等，通过value属性指定。
- 引用数据类型，例如：UserDaoImpl、DataSource等，通过ref属性指定。
- 集合数据类型，例如：List、Map、Properties等。

代码如下：
```xml
    <bean id="userDao" class="org.example.dao.impl.UserDaoImpl"/>
    <bean id="userDao2" class="org.example.dao.impl.UserDaoImpl"/>
    <bean id="userDao3" class="org.example.dao.impl.UserDaoImpl"/>
    <!--配置UserService-->
    <bean id="userService" class="org.example.service.impl.UserServiceImpl">
        <!-- 注入 List<T> 集合 – 普通数据-->
        <property name="strList">
            <list>
                <value>姚明</value>
                <value>麦迪</value>
            </list>
        </property>
        <!-- 注入 List<T> 集合 – 引用数据-->
        <property name="objList">
            <list>
                <ref bean="userDao"></ref>
                <ref bean="userDao2"></ref>
                <ref bean="userDao3"></ref>
            </list>
        </property>
        <!-- 注入泛型为字符串的Set集合 -->
        <property name="valueSet">
            <set>
                <value>姚明</value>
                <value>麦迪</value>
            </set>
        </property>
        <!-- 注入泛型为对象的Set集合 -->
        <property name="objSet">
            <set>
                <ref bean="userDao"></ref>
                <ref bean="userDao2"></ref>
                <ref bean="userDao3"></ref>
            </set>
        </property>
        <!--注入值为字符串的Map集合-->
        <property name="valueMap">
            <map>
                <entry key="aaa" value="AAA" />
                <entry key="bbb" value="BBB" />
                <entry key="ccc" value="CCC" />
            </map>
        </property>
        <!--注入值为对象的Map集合-->
        <property name="objMap">
            <map>
                <entry key="ud" value-ref="userDao"/>
                <entry key="ud2" value-ref="userDao2"/>
                <entry key="ud3" value-ref="userDao3"/>
            </map>
        </property>
		<!--注入property-->
        <property name="properties">
            <props>
                <prop key="xxx">XXX</prop>
                <prop key="yyy">YYY</prop>
            </props>
        </property>

    </bean>
</beans>
```
```java
public class UserServiceImpl implements UserService {
    public UserServiceImpl() {
        System.out.println("UserServiceImpl创建了...");
    }
	//注入泛型为字符串的List集合
    public void setObjList(List<UserDao> objList) {
        objList.forEach(obj -> {
            System.out.println(obj);
        });
    }
	//注入泛型为对象的List集合
    public void setStrList(List<String> strList) {
        strList.forEach(str -> {
            System.out.println(str);
        });
    }
    //注入泛型为字符串的Set集合
    public void setValueSet(Set<String> valueSet){
        valueSet.forEach(str->{
            System.out.println(str);
        });
    }
    //注入泛型为对象的Set集合
    public void setObjSet(Set<UserDao> objSet){
        objSet.forEach(obj->{
            System.out.println(obj);
        });
    }

    //注入值为字符串的Map集合
    public void setValueMap(Map<String,String> valueMap){
        valueMap.forEach((k,v)->{
            System.out.println(k+"=="+v);
        });
    }
    //注入值为对象的Map集合
    public void setObjMap(Map<String,UserDao> objMap){
        objMap.forEach((k,v)->{
            System.out.println(k+"=="+v);
        });
    //注入Properties
	public void setProperties(Properties properties){
        properties.forEach((k,v)->{
            System.out.println(k+"=="+v);
        });
    }
    }
}
```
### 2.4 Spring的其他配置标签 
- \<beans>标签，除了经常用的做为根标签外，还可以嵌套在根标签内，使用profile属性切换开发环境
	- 使用命令行动态参数，虚拟机参数位置加载 -Dspring.profiles.active=test 
	- 使用代码的方式设置环境变量 System.setProperty("spring.profiles.active","test")
```xml
<!-- 配置测试环境下，需要加载的Bean实例 -->
<beans profile="test">
</beans>
<!-- 配置开发环境下，需要加载的Bean实例 -->
<beans profile="dev">
</beans>
```
- \<import>标签，用于导入其他配置文件，项目变大后，就会导致一个配置文件内容过多，可以将一个配置文件根据业务某块进行拆分，拆分后，最终通过\<import>标签导入到一个主配置文件中，项目加载主配置文件就连同\<import> 导入的文件一并加载了
```xml
<!--导入用户模块配置文件-->
<import resource="classpath:UserModuleApplicationContext.xml"/>
<!--导入商品模块配置文件-->
<import resource="classpath:ProductModuleApplicationContext.xml"/>
```
\<alias> 标签是为某个Bean添加别名，与在\<bean> 标签上使用name属性添加别名的方式一样，我们为UserServiceImpl指定四个别名：aaa、bbb、xxx、yyy
```xml
<!--配置UserService-->
<bean id="userService" name="aaa,bbb" class="org.example.service.impl.UserServiceImpl">
	<property name="userDao" ref="userDao"/>
</bean>
<!--指定别名-->
<alias name="userService" alias="xxx"/>
<alias name="userService" alias="yyy"/>
```
### 2.5  非自定义Bean的配置
1. 配置 Druid 数据源交由Spring管理
```xml
<!-- mysql驱动 -->
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<version>5.1.49</version>
</dependency>
<!-- druid数据源 -->
<dependency>
	<groupId>com.alibaba</groupId>
	<artifactId>druid</artifactId>
	<version>1.1.23</version>
</dependency>
```
配置 DruidDataSource
```xml
<!--配置 DruidDataSource数据源-->
<bean class="com.alibaba.druid.pool.DruidDataSource">
	<!--配置必要属性-->
	<property name="driverClassName" value="com.mysql.jdbc.Driver"/>
	<property name="url" value="jdbc://localhost:3306/demo"/>
	<property name="username" value="root"/>
	<property name="password" value="root"/>
</bean>
```
2. 配置Connection交由Spring管理：Connection 的产生是通过DriverManager的静态方法getConnection获取的，所以我们要用静态工厂方式配置
```xml
<bean class="java.lang.Class" factory-method="forName">
	<constructor-arg name="className" value="com.mysql.jdbc.Driver"/>
</bean>
<bean id="connection" class="java.sql.DriverManager" factory-method="getConnection" 
scope="prototype">
	<constructor-arg name="url" value="jdbc:mysql:///demo"/>
	<constructor-arg name="user" value="root"/>
	<constructor-arg name="password" value="root"/>
</bean>	
```
3. 配置日期对象交由Spring管理
```java
String currentTimeStr = "2023-08-27 07:20:00";
SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
Date date = simpleDateFormat.parse(currentTimeStr);
```
可以看成是实例工厂方式，使用Spring配置方式产生Date实例
```xml
<bean id="simpleDateFormat" class="java.text.SimpleDateFormat">
	<constructor-arg name="pattern" value="yyyy-MM-dd HH:mm:ss"/>
</bean>
<bean id="date" factory-bean="simpleDateFormat" factory-method="parse">
	<constructor-arg name="source" value="2023-08-27 07:20:00"/>
</bean>
```