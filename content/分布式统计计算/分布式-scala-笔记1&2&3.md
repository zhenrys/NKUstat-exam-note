[R语言-回归分析-实战笔记](R语言-回归分析-实战笔记.md)## 启动`spark-shell`

```shell
$ spark-shell 
```

### local模式
```shell
spark-shell --master local[*]   
#或者 
–-master spark://localhost:7077
```

### standalone模式
```shell
#同local
```
### yarn模式
```shell
$ start-dfs.sh
$ start-yarn.sh
$ spark-shell --master yarn --deploy-mode client

```

### 退出
```shell
:quit

:help
```

## sbt 打包

### 1. 确保项目结构正确

首先，确保你的项目有正确的结构，`file1.scala`应该存放在`src/main/scala`目录下。项目的基本结构如下：

```
MyScalaProject/
├── build.sbt
├── src/
│   └── main/
│       └── scala/
│           └── file1.scala
└── target/   (这个目录会被自动创建)
```

### 2. 编辑`build.sbt`(已完成)

### 3. 通过`sbt`打包

在项目根目录下，打开终端并运行`sbt`命令。

#### 打包命令：
在`sbt`交互式控制台中，输入以下命令来生成一个JAR包：

```bash
sbt package
```

这将编译你的项目并将其打包成一个JAR文件，JAR文件将存储在`target/scala-<version>/`目录下，例如：

```
target/scala-2.10/your-project-name_2.10-0.1.jar
```

其中`your-project-name_2.13-0.1.jar`是生成的JAR文件，`2.13`是你使用的Scala版本，`0.1`是你在`build.sbt`中指定的版本。

#### 运行JAR包：
你可以使用以下命令来运行生成的JAR文件：

```bash
java -jar target/scala-2.13/your-project-name_2.13-0.1.jar
```


---
# 6.1 scala基础
## 值和变量
```scala
scala> val Number = 10
Number: Int = 10

scala> Number
res0: Int = 10

scala> Number.getClass
res1: Class[Int] = int

scala> Number = 20
<console>:23: error: reassignment to val
       Number = 20
              ^

scala> var Number1 = 10
Number1: Int = 10

scala> Number1 = 20
Number1: Int = 20

scala> Number1 = 'hello'
<console>:1: error: unclosed character literal (or use " for string literal "hello")
       Number1 = 'hello'
```

```scala
scala> Number1 = "hello"
<console>:23: error: type mismatch;
 found   : String("hello")
 required: Int
       Number1 = "hello"
```

```scala                 
scala> var Number2:Any=10
Number2: Any = 10

scala> Number2 = "hello"
Number2: Any = hello

```

## 输入输出

```scala
scala> import scala.io.StdIo._
scala> var i = readInt
scala> var f = readFloat
scala> var b = readBoolean
Scala> var str = readLine(“Please input your name:”)

scala> var I = 314
scala> print(“i=“);print(i)
scala> println(“hello”);println(“world”)

scala> var i = 3.14
scala> printf(“PI is %f\n“,i)

scala> val i = 10
scala> val f = 3.14
scala> val s = “hello”
scala> println(s”$s:i=$i,f=$f”)
scala> println(f”$s:i=$i%d,f=$f%.1f”)

```

### 文件读写
```scala
scala> import java.io.PrintWriter
scala> val outputFile = new PrintWriter(“test.txt”)
scala> outputFile.println(“hello world!”)
scala> outputFile.print(“Spark is good”)
scala> outputFile.close()

scala> import scala.io.Source
scala> val inputFile = Source.fromFile(“test.txt”)
scala> val lines =  inputFile.getLines
scala> for ( line <- lines ) println(line)
```
## 控制结构

### while

do-while

while-do

### for 

```scala
scala>for(i<-1 to 5) println(i)
scala>for(i<-1 until 5) println(i) //包括5
scala>for(i<-1 to 5 by 2) println(i) 
```

>[!Note]-
>`变量<-表达式`被称为==生成器==。玩法丰富。

* ==guard表达式== 过滤出一些满足条件的结果。
```scala
//for( 变量 <- 表达式 if 条件表达式 ) {语句块}
scala>for(i<-1 to 5 if i%2==0) println(i) 
```

* Scala也支持“多个生成器”的情形，可以用分号把它们隔开，比如：
```scala
scala>for(i<-1 to 5; j<-1 to 3) println(i*j) //双重循环的简写
```

* ==for推导式==：for结构可以在每次执行的时候创造一个值，然后将包含了所有产生值的集合作为for循环表达式的结果返回，集合的类型由生成器中的集合类型确定
```scala
scala>r = for(i<-Array(12,32,11,17,25) if i%2 == 0) yield{i} //for 推导式，返回数组:(12,32)，赋值给r。
//for( 变量 <- 表达式 )  yield {语句块}
```

### 循环控制

scala没有break和continue，需要用类来实现。

```scala
breakable{

if(...) break

}
```


## 数据结构

### 数组，较重要
可变，可索引，元素类型相同。

```scala
val intValueArr = new Array[Int](3) //
intValueArr(0) = 12

val intValueArr = new Array[String](3) //字符型数组

val intValueArr = Array(12,23,35)//自动类型推断

```

>[!Note]
>此处使用val表示变量名不可变，但是数组本身可变，所以仍可变。

### 元组，不重要

```scala
tuple
```

### 容器/集合(collection)，很重要

* 序列（seq）：可以通过索引访问元素。
	* list，array，vector
* 集（set）：不包含重复元素，无顺序。
	* set，sortedset
* 映射（map）：键值对集合。
	* map，sorted，map

list是某种链表，存储位置在空间上并不连续。


---
### 构造列表

```scala
val otherList = "apd"::strList //在列表头添加一个元素，并生成新列表
val intList = 1::2::3::Nil //元素1::元素2::元素3::Nil
val intList = List(1,2,3) //上一行与这行等价
```

### vector

```scala
val vec1 = Vector(1,2)
val vec2 = 3 +: vec1
val vec3 = vec2 :+ 5

```


### 改变不可变类型的**重新赋值**逻辑
```scala
var imlist = List(1,2,3)
imList(1) = 3 //不可以

imList = 4::imList  //可以生成新列表，指向新列表
```

```scala
val imlist = List(1,2,3)
imList(1) = 3 //更不可以

imList = 4::imList  //不能生成新列表
```

```scala
var mySet = Set("A","B") //默认集合石不可变的
mySet += "scala" //重新赋值的逻辑
mySet = myset +:"scala" //上式的展开
```

### 迭代器iterator
迭代器在next和hasnext之外的方法被调用后，会改变迭代器的位置状态，不建议调用。

# 6.2面向对象的编程

## 6.2.1 类
### 1. 类的定义
```scala
class Counter {
  var value = 0 //这里定义类的字段和方法，用val或var关键字进行定义
  def increment(step: Int): Unit = { value += step }
  def current(): Int = { value } //def 方法名(参数列表):返回结果类型={方法体}

}
```

使用new关键字创建一个类的==实例==

```scala
val myCounter = new Counter
myCounter.value = 5 //访问字段
myCounter. increment(3) //调用方法
println(myCounter.current) //调用无参数方法时，可以省略方法名后的括号

```

### 2. 类成员的可见性
* Scala类中所有成员的默认可见性为公有，任何作用域内都能直接访问公有成员
* 除了默认的公有可见性，Scala也提供private和protected，其中，private成员只对本类型和嵌套类型可见；protected成员对本类型和其继承类型都可见
* 为了避免直接暴露public字段，建议将字段设置为private，对于private字段，Scala采用类似Java中的getter和setter方法，定义了两个成对的方法value和value_=进行读取和修改

```scala
class Counter {
  private var privateValue = 0

  def value = privateValue

  def value_=(newValue: Int): Unit = {
    if (newValue > 0) privateValue = newValue
  }

  def increment(step: Int): Unit = { value += step }

  def current(): Int = value
}
```

Scala语法中有如下规范，当编译器看到以value和value_=这种成对形式出现的方法时，==它允许用户去掉下划线_，而采用类似赋值表达式的形式==

```scala
val myCounter = new Counter
myCounter.value_=(3)


myCounter.value= 3 // 等效于myCounter.value_=(3)
myCounter.privateValue=3 
```

### 3. 方法的定义方式

基本语法：
* def 方法名(参数列表):返回结果类型={方法体}
* 方法参数前不能加上val或var，所有的方法参数都是不可变类型
* 无参数的方法定义时可以省略括号，这时调用时也不能带有括号；如果定义时带有括号，则调用时可以带括号，也可以不带括号
* 方法名后面的圆括号()可以用大括号{}来代替
* 如果方法只有一个参数，可以省略点号（.）而采用中缀操作符调用方法
* 如果方法体只有一条语句，可以省略方法体两边的大括号

```scala
class Counter {
      var value = 0
      def increment(step:Int):Unit = { value += step }
      def current:Int = value
      def getValue():Int = value
}

val c= new Counter
c increment 5 //中缀调用法，等价于 c.increment(5)
c.getValue()   //定义时带括号
c.getValue   //定义时带括号
c.current     //定义时不带括号
c.current()  //错误，因为定义的时候没有带括号

```

* 当方法的返回结果类型可以从最后的表达式推断出时，可以省略结果类型
* 如果方法返回类型为Unit，可以同时省略返回结果类型和等号，但不能省略大括号.
* 对比上面

```scala
class Counter {
    var value = 0
    def increment(step:Int) { value += step }//赋值表达式的值为Unit类型
    def current()= value //根据value的类型自动推断出返回类型为Int型
}
```

### 4. 构造器
* Scala类的定义主体就是类的构造器，称为主构造器。在类名之后用圆括号列出主构造器的参数列表。在 Scala 中，如果没有显式地定义主构造器，Scala 会为类提供一个默认的主构造器，这个默认的主构造器没有参数，并且不执行任何操作。
* 主构造器的参数前可以使用val或var关键字，Scala内部将自动为这些参数创建私有或者公有字段，并提供对应的访问方法

```scala
class MyClass(param1: Int, param2: String) {
  // 主构造器的参数列表在类名后面直接定义
  // 类的实例变量可以在主构造器中初始化
  val x: Int = param1
  val y: String = param2
  // 类的其他方法和成员可以放在类的内部
}
val obj = new MyClass(10,”hello”) //创建类MyClass的实例obj,并且传递参数整数10和字符串”hello”给主构造器

```

>[!Note] 类与构造器参数
>构造器参数`class Person(name: String, age: Int)`
>
>类的字段`class Person(val name: String, var age: Int)
>
>类的字段属于类，是可以改变的，而构造器参数只是传入的参数而已

```scala
class Counter(var name:String) //定义一个带字符串参数的简单类
var mycounter = new Counter("Runner")
println(mycounter.name) //调用读方法
mycounter.name_=("Timer") //调用写方法
mycounter.name = "Timer"// 更直观地调用写方法，和上句等效
```

* Scala类可以包含零个或多个辅助构造器（auxiliary constructor）。辅助构造器使用this进行定义，this的返回类型为Unit
* 每个辅助构造器的第一个表达式必须是调用一个此前已经定义的辅助构造器或主构造器，调用的形式为“this(参数列表)”

```scala
class Counter {
    private var value = 0 
    private var name = ""
    private var step = 1 //计算器的默认递进步长
    println("the main constructor")
    def this(name: String){ //第一个辅助构造器
        this() //调用主构造器
        this.name = name
        printf("the first auxiliary constructor,name:%s\n",name)
    }
    def this (name: String,step: Int){ //第二个辅助构造器
        this(name) //调用前一个辅助构造器
        this.step = step
       printf("the second auxiliary constructor,name:%s,step:%d\n",name,step)
    }
    def increment(step: Int): Unit = { value += step}
    def current(): Int = {value}
}


val c1=new Counter
val c2=new Counter(“the 2nd Counter”)
val c3=new Counter(“the 3rd Counter”,2
```
## 6.2.2 对象 

单例对象
伴生对象
* 伴生对象中的apply方法：将所有类的构造方法以apply方法的形式定义在伴生对象中，这样伴生对象就像生成类实例的工厂，而这些apply方法也被称为工厂方法
* 工厂模式与多个构造器比较



==通过单例对象构造类不用new==

---
### 1 单例对象

在 Scala 中，单例对象（Singleton Object）是通过关键字 object 定义的对象。与类不同，单例对象在整个程序中只有一个实例，因此也称为单例对象。

#### 单例对象的特点
* 唯一性：
	单例对象在整个程序中只有一个实例，通常用于保存不变的全局状态或工具方法。
* 没有构造函数：
	单例对象不能通过 new 关键字创建实例。定义 object 时，Scala 自动创建并初始化唯一的实例。
* 可以作为==伴生对象==：
	单例对象可以作为一个类的伴生对象，与同名的类一起定义。伴生对象和类可以互相访问彼此的私有成员。
* 与静态成员的关系：
	Scala 没有静态成员的概念，单例对象可以用来实现类似 Java 中的静态方法和变量。

#### 单例对象的作用
* 全局配置或常量：
	单例对象可以用于保存不变的全局配置或常量。
* 工具类和静态方法：
	单例对象常用于定义工具类，提供与类相关的静态方法。例如定义一个 MathUtil 对象，其中包含一些数学计算方法。
* 伴生对象：
	单例对象可以作为伴生对象，与同名类一起定义。伴生对象中的方法和变量可以被类的所有实例共享。
* ==工厂方法==：
	单例对象可以用作工厂对象，==提供工厂方法来创建类的实例==。

#### 使用object 关键字定义单例对象
```scala
object Person {
    private var lastId = 0  //一个人的身份编号
    def newPersonId() = {
        lastId +=1
        lastId
    }
}
```

* 单例对象的使用与一个普通的类实例一样：
```scala
printf(“The first person id:%d.\n”,Persion.newPersionID())
The first person id:1

printf(“The second person id:%d.\n”,Persion.newPersionID())
The second person id:2

printf(“The third person id:%d.\n”,Persion.newPersionID())
The third person id:3

```

#### 伴生对象和孤立对象

* 当一个单例对象和它的同名类一起出现时，这时的单例对象被称为这个同名类的“伴生对象”（companion object）。相应的类被称为这个单例对象的“伴生类”
* 类和它的伴生对象必须存在于同一个文件中，可以相互访问私有成员
* 没有同名类的单例对象，被称为==孤立对象==（standalone object）。==一般情况下，Scala程序的入口点main方法就是定义在一个孤立对象里==

```scala
class Person(val name:String){
    private val id = Person.newPersonId() //调用了伴生对象中的方法
    def info() {
        printf("The id of %s is %d.\n",name,id)
    }
}
object Person {
    private var lastId = 0  //一个人的身份编号
    def newPersonId() = {
        lastId +=1
        lastId
    }
    def main(args: Array[String]) {
        val person1 = new Person("Lilei")
        val person2 = new Person("Hanmei")
        person1.info()
        person2.info()
    }
}

```

### 2. apply方法

思考下行代码的执行过程
```scala
val myStrArr = Array("BigData","Hadoop","Spark")
```

* Scala自动调用Array类的==伴生对象Array中的==一个称为==apply==的方法，来创建一个Array对象myStrArr
* apply方法调用约定：用==括号传递给类实例或单例对象名一个或多个参数时==，Scala 会在相应的类或对象中查找==方法名为apply且参数列表与传入的参数一致的方法==，并用传入的参数来调用该apply方法

例：类中的apply方法
```scala
class TestApplyClass {
    def apply(param: String){
	     println("apply method called: " + param)
}
}
val myObject = new TestApplyClass
myObject(“Hello Apply”)//自动调用类中定义的apply方法
myObject.apply(“Hello Apply”) //手动调用apply方法
```

==伴生对象中的apply方法：将所有类的构造方法以apply方法的形式定义在伴生对象中，这样伴生对象就像生成类实例的工厂，而这些apply方法也被称为工厂方法==

```scala
class Car(name: String) {
    def info() {
        println("Car name is "+ name)
    }
}
object Car {
    def apply(name: String) = new Car(name) //调用伴生类Car的构造方法
}
object MyTestApply{
    def main (args: Array[String]) {
    val mycar = Car("BMW") //调用伴生对象中的apply方法
    mycar.info() //输出结果为“Car name is BMW”
    }
}

```

#### 工厂模式与多个构造器的比较

```scala
// 定义一个简单的trait
trait Animal {
  def sound: String
}

// Dog类实现Animal trait
class Dog extends Animal {
  override def sound: String = "Woof"
}

// Cat类实现Animal trait
class Cat extends Animal {
  override def sound: String = "Meow"
}

// 单例对象作为工厂，用来创建不同的Animal实例
object AnimalFactory {
  // 工厂方法，根据类型创建不同的Animal实例
  def apply(animalType: String): Animal = animalType match {
    case "dog" => new Dog
    case "cat" => new Cat
    case _ => throw new IllegalArgumentException("Unknown animal type")
  }
}

// 使用工厂方法来创建Animal对象
val dog: Animal = AnimalFactory("dog")
val cat: Animal = AnimalFactory("cat")
println(dog.sound) // 输出"Woof"
println(cat.sound) // 输出"Meow"

class Animal(val sound: String)

object Animal {
  // 提供多个构造器，但都返回Animal类型实例
  def apply(): Animal = new Animal("unknown")
  def apply(sound: String): Animal = new Animal(sound)
}


val defaultAnimal = Animal()// 使用无参数构造器
val dog = Animal("Woof")// 使用带参数构造器

```



#### 为什么要设计apply方法？

* 保持对象和函数之间使用的一致性，==让**函数是对象**==
* 面向对象：“对象.方法” VS  数学：“函数(参数)”
* Scala中一切都是对象，包括函数也是对象。==Scala中的函数既保留括号调用样式，也可以使用点号调用形式，其对应的方法名即为apply==
```scala
scala> val add=(x:Int,y:Int)=>x+y  //add是一个函数
scala> add(4,5)   //采用括号调用样式
scala> add.apply(4,5) //add也是对象，采用点号形式调用apply方法
```

Scala的对象也可以看成函数，前提是该对象提供了apply方法
```scala
class Car(name: String) {
    def info() {
        println("Car name is "+ name)
    }
}
object Car {
    def apply(name: String) = new Car(name) //调用伴生类Car的构造方法
}
object MyTestApply{
    def main (args: Array[String]) {
    val mycar = Car("BMW") //调用伴生对象中的apply方法
    mycar.info() //输出结果为“Car name is BMW”
    }
}
```

### 3. update方法
与apply方法类似的update方法也遵循相应的调用约定：当对带有括号并包括一到若干参数的对象进行赋值时，编译器将调用对象的update方法，并将括号里的参数和等号右边的值一起作为update方法的输入参数来执行调用

```scala
scala>val myStrArr = new Array[String](3)  //声明一个长度为3的字符串数组，每个数组元素初始化为null
scala>myStrArr(0) = "BigData" //实际上，调用了伴生类Array中的update方法，执行myStrArr.update(0,"BigData")
scala>myStrArr(1) = "Hadoop" //实际上，调用了伴生类Array中的update方法，执行myStrArr.update(1,"Hadoop")
scala>myStrArr(2) = "Spark" //实际上，调用了伴生类Array中的update方法，执行myStrArr.update(2,"Spark")
```

>[!Note]-
>类比数组的按照索引的赋值。

* unapply方法用于对对象进行解构操作，与apply方法类似，该方法也会被自动调用
* 可以认为unapply方法是apply方法的反向操作，apply方法接受构造参数变成对象，而unapply方法接受一个对象，从中提取值

```scala
class Car(val brand: String, val price: Int) {
  def info(): Unit = {
    println(s"Car brand is $brand and price is $price")
  }
}

object Car {
  def apply(brand: String, price: Int): Car = {
    println("Debug: calling apply ... ")
    new Car(brand, price)
  }

  def unapply(c: Car): Option[(String, Int)] = {
    println("Debug: calling unapply ... ")
    Some((c.brand, c.price))
  }
}

object TestUnapply {
  def main(args: Array[String]): Unit = {
    val Car(carbrand, carprice) = Car("BMW", 800000)
    println(s"brand: $carbrand and carprice: $carprice")
  }
}

TestUnapply
```

输出
```scala
Debug:calling apply ...
Debug:calling unapply ...
brand: BMW and carprice: 800000
```



## 6.2.3继承

### 1抽象类

```scala
abstract class Car(val name:String) {
    val carBrand:String //字段没有初始化值，就是一个抽象字段
    def info() //抽象方法
    def greeting() {
        println("Welcome to my car!")
    }
}
```

```scala
val carBrand:String = "a" //具体字段
val carbrand //错误写法
```

>[!Note]
>
> 1. 定义一个抽象类，需要使用关键字abstract
> 2. 定义一个抽象类的抽象方法，不需要关键字abstract，只要把方法体空着，不写方法体就可以
> 3. 抽象类中定义的字段，只要没有给出初始化值，就表示是一个抽象字段，但是，抽象字段必须要声明类型，否则编译会报错

### 2扩展类

Scala只支持单一继承，而不支持多重继承。在类定义中使用==extends==关键字表示继承关系。定义子类时，需要注意：

* 重载父类的抽象成员（包括字段和方法）时，==override==关键字是可选的；而重载父类的非抽象成员时，override关键字是必选的
* 只能重载val类型的字段，而不能重载var类型的字段。因为var类型本身就是可变的，所以，可以直接修改它的值，无需重载

>[!Note] 函数重载 实用 灵活
> 同一个名字的运算符应用于同场景：`<<`

### 3 Scala的类层次结构

Null是所有引用类型的子类，其唯一的实例为null，表示一个“空”对象，可以赋值给任何==引用类型==的变量，但不能赋值给值类型的变量

>[!Note] 引用类型
>如果一个类型的声明是类、对象、数组、特质（trait）的实例、函数类型、`Option`、`Either`、`Try`、集合类型等，那么它就是引用类型。

Nothing是所有其它类型的子类，包括Null。Nothing没有实例，主要用于异常处理函数的返回类型

![](image-20241108144136543.png)

### 4 Option类
* Scala提供null是为了实现在JVM与其它Java库的兼容性，但是，除非明确需要与Java库进行交互，否则，**Scala建议尽量避免使用这种可能带来bug的null**，而改用Option类
* Option是一个抽象类，有一个具体的子类Some和一个对象None，其中，前者表示有值的情形，后者表示没有值
* 当方法不确定是否有对象返回时，可以让返回值类型为`Option[T]`，其中，T为类型参数。对于这类方法，如果确实有T类型的对象需要返回，会将该对象包装成一个Some对象并返回；如果没有值需要返回，将返回None

## 6.2.4特质

>[!Note] PPT
>  * Java中提供了==接口(interface)==，允许一个类实现任意数量的接口
> * Scala中没有接口的概念，而是提供了“特质(trait)”，它不仅实现了接口的功能，还具备了很多其他的特性
>  * Scala的特质是代码重用的基本单元，可以同时拥有抽象方法和具体方法
>  * Scala中，一个类只能继承自一个超类，却可以实现多个特质，从而重用特质中的方法和字段，实现了==多重继承==

### 特质的定义`trait`
使用 `trait` 关键字来定义特质。例如：

```scala
trait Flyable {
  def fly(): Unit   // 抽象方法，没有实现
  def takeOff(): Unit = println("Taking off...")  // 具体方法，有实现
}
```

### 特质的使用`extend`
类通过关键字 `extends` 继承一个特质，或通过 `with` 关键字混入更多的特质。例如：

```scala
class Bird extends Flyable {
  def fly(): Unit = println("Bird is flying")  // 实现抽象方法
}

val bird = new Bird
bird.takeOff()  // 调用具体方法，输出: Taking off...
bird.fly()      // 调用实现方法，输出: Bird is flying
```

### 特质的多重混入`with`
在 Scala 中，类或对象可以混入多个特质，实现多重继承：

```scala
trait Swimmable {
  def swim(): Unit = println("Swimming...")
}

class Duck extends Flyable with Swimmable {
  def fly(): Unit = println("Duck is flying") //重载特质的方法
}

val duck = new Duck
duck.takeOff() // 输出: Taking off...
duck.fly()     // 输出: Duck is flying
duck.swim()    // 输出: Swimming...
```

### 特质综合运用 PPT
```scala
trait Flyable {
  var maxFlyHeight: Int // 抽象字段
  def fly() // 抽象方法
  def breathe() {
    println("I can breathe")
  }
}

trait HasLegs {
  val legs: Int // 抽象字段
  def move() {
    printf("I can walk with %d legs", legs)
  }
}

class Animal(val category: String) {
  def info() {
    println("This is a " + category)
  }
}

class Bird(flyHeight: Int) extends Animal("Bird") with Flyable with HasLegs {
  var maxFlyHeight: Int = flyHeight // 重载特质的抽象字段
  val legs: Int = 2 // 重载特质的抽象字段
  def fly() {
    printf("I can fly at the height of %d", maxFlyHeight)
  } // 重载特质的抽象方法
}
```

>[!Note]
>多重混入重载函数的顺序是`with`的==从左到右==

## 6.2.5模式匹配

### 1. match语句
#### 1.简单匹配
```scala
import scala.io.StdIn._
println("Please input the score:")
val grade=readChar()
grade match{
	case 'A' => println("85-100")
	case 'B' => println("70-84")
	case 'C' => println("60-69")
	case 'D' => println("<60")
	case _ => println("error input!")
}
```

>[!Note]
> - 通配符`_`相当于Java中的default分支
> - match结构中==不需要break==语句来跳出判断，Scala从前往后匹配到一个分支后，会自动跳出判断
> - case后面的表达式可以是==任何类型的常量==，而不要求是整数类型

####  2.除了匹配特定的常量，还==能匹配某种类型的所有值==

```scala
for (elem <- List(6, 9, 0.618, "Spark", "Hadoop", 'Hello')) {
  val str = elem match {
    case i: Int => i + " is an int value." // 匹配整型的值，并赋值给i
    case d: Double => d + " is a double value." // 匹配浮点型的值
    case "Spark" => "Spark is found." // 匹配特定的字符串
    case s: String => s + " is a string value." // 匹配其它字符串
    case _ => "unexpected value: " + elem // 与以上都不匹配
  }
  println(str)
}
```

#### 可以在match表达式的case中使用==守卫式==（guard）添加一些过滤逻辑
```scala
for (elem <- List(1, 2, 3, 4)) {
  elem match {
    case _ if elem % 2 == 0 => println(elem + " is even.")
    case _ => println(elem + " is odd.")
  }
}
```

### 2.case类`case class`

* case类是一种特殊的类，它们经过优化以被用于模式匹配
* 当定义一个类时，如果在class关键字前加上case关键字，则该类称为case类
* Scala为case类自动重载了许多实用的方法，包括toString、equals和hashcode方法
* Scala为每一个case类自动生成一个伴生对象，其包括模板代码
	* 1个apply方法，因此，实例化case类的时候无需使用new关键字
	* 1个unapply方法，该方法包含一个类型为伴生类的参数，返回的结果是Option类型，对应的类型参数是N元组，N是伴生类中主构造器参数的个数。Unapply方法用于对对象进行解构操作，在case类模式匹配中，该方法被自动调用，并将待匹配的对象作为参数传递给它

```scala
case class Car(brand: String, price: Int)
//代码中的 `Car` 是一个 `case class`，它自动生成了 `apply` 方法，因此可以直接用 `Car("BYD", 89000)` 的方式创建 `Car` 的实例，而不需要使用 `new` 关键字。
val myBYDCar = Car("BYD", 89000)
val myBMWCar = Car("BMW", 1200000)
val myBenzCar = Car("Benz", 1500000)

for (car <- List(myBYDCar, myBMWCar, myBenzCar)) {
  car match {
	//`case class` 支持模式匹配，代码中使用 `match` 表达式对 `Car` 对象进行模式匹配。在 `case` 语句中，我们可以直接通过 `case Car("BYD", 89000)` 这样解构对象，提取 `brand` 和 `price` 的值。
    case Car("BYD", 89000) => println("Hello, BYD!")
    case Car("BMW", 1200000) => println("Hello, BMW!")
    case Car(brand, price) => println("Brand: " + brand + ", Price: " + price + ", do you want it?")
  }
}
```


## 6.2.6 包

通过在关键字package后面加大括号，可以将程序的不同部分放在不同的包里。这样可以实现包的嵌套，相应的作用域也是嵌套的
```scala
package xmu {
	package autodepartment {
	
	}
}
```

使用通配符下划线（`_`）引入类或对象的所有成员
```scala
import scala.io.StdIn._
```

Scala 隐式地添加了一些引用到每个程序前面，相当于每个Scala程序都隐式地以如下代码开始：
```scala
import java.lang._
import scala._
import Predef._
```
# 6.3 函数式编程

## 6.3.1 函数定义与使用

* 字面量：整数字面量、浮点数字面量、布尔型字面量、字符字面量、字符串字面量、符号字面量、函数字面量和元组字面量
* 函数字面量可以体现函数式编程的核心理念
* 在函数式编程中，函数是“头等公民”，可以像任何其他数据类型一样被传递和操作，也就是说，函数的使用方式和其他数据类型的使用方式完全一致了
* 这时，我们就可以像定义变量那样去定义一个函数，由此导致的结果是，函数也会和其他变量一样，开始有“值”
* 就像变量的“类型”和“值”是分开的两个概念一样，函数式编程中，函数的“类型”和“值”也成为两个分开的概念，函数的“值”，就是“函数字面量”

```scala
def counter(value: Int): Int = { value += 1} //传统的定义函数的方法

val num: Int = 5 //定义普通变量的语法
```

```scala
val counter: Int => Int = { (value) => value += 1 }  //类似的可以定义函数，俗手
val connter: Int => Int = _+1//本手
val counter = (_:Int) + 1 //有类型时括号不能省略，等效于“x:Int=>x+1” ，妙手
```

* 当函数的每个参数在函数字面量内仅出现一次，可以省略“=>”并用下划线“`_`”作为参数的占位符来简化函数字面量的表示，第一个下划线代表第一个参数，第二个下划线代表第二个参数，依此类推

```scala
val add:(Int,Int) => Int = (x,y) => x+y
val add = (x:Int,y:Int) => x+y
val add = (_:Int)+(_:Int)
```

## 6.3.2 高阶函数

* 高阶函数：当一个函数包含其它函数作为其参数或者返回结果为一个函数时，该函数被称为高阶函数
* 例：假设需要分别计算从一个整数到另一个整数的“连加和”、“平方和”以及“2的幂次和”
#### “连加和”
```scala
def sum(Start:Int, End:Int):Int = 
{
	if(Start > End) 0 else
	start + sum(Start+1, End)
}
```
#### “平方和”
```scala
def sum(Start:Int, End:Int):Int = 
{
	if(Start > End) 0 else
	start*start + sum(Start+1, End)
}
```

#### "2的幂次和"
```scala
def power(x:Int):Int = 
{
	if(x==0) 1 else
	2*power(x-1)
}
```

#### 妙手
```scala
def func(f:Int => Int,Start:Int,End:Int) = 
{
	if(Start > End) 0 else
	f(start) + sum(Start+1, End)
}
```

`f:Int => Int` 可替换为匿名函数 `_`,`x=>x*x`,`Power`

```scala
scala> sum(x=>x,1,5) //直接传入一个匿名函数
//且省略了参数x的类型，因为可以由sum的参数类型推断出来
res8: Int = 15
scala> sum(x=>x*x,1,5) //直接传入另一个匿名函数
res9: Int = 55
scala> sum(powerOfTwo,1,5) //传入一个已经定义好的方法
res10: Int = 62

def powerOfTwo(x: Int): Int = {if(x == 0) 1 else 2 * powerOfTwo(x-1)}
```


---
2024年11月15日14:21:43

## 6.3.3针对容器的操作
### 1 遍历操作
Scala容器的标准遍历==方法foreach==

```scala
def foreach[U](f: Elem => U) :Unit

scala> val list = List(1, 2, 3)
list: List[Int] = List(1, 2, 3)
scala> val f=(i:Int)=>println(i)
f: Int => Unit = <function1>
scala> list.foreach(f)
1
2
3

```

>[!Note]
>中缀调用简化写法：“list foreach println”
>
>等价于“list foreach(i=>println(i))”

```scala
scala> val university = Map("NKU" ->"Nankai University", "THU" ->"Tsinghua University","PKU"->"Peking University")
university: scala.collection.mutable.Map[String,String] = ...

scala> university foreach{kv => println(kv._1+":"+kv._2)}
NKU:Nankai University
THU:Tsinghua University
PKU:Peking University

scala> val university = Map(“NKU" ->“Nankai University", "THU" ->"Tsinghua University","PKU"->"Peking University")
university: scala.collection.mutable.Map[String,String] = ...

scala> university foreach{kv => println(kv._1+":"+kv._2)} //键值对的 建 和 值
NKU:Nankai University
THU:Tsinghua University
PKU:Peking University
```

### 2 映射操作
映射是指通过对容器中的元素进行某些运算来生成一个新的容器。两个典型的映射操作是==map方法==和==flatMap方法==
#### map方法（==一对一映射==）：
将某个函数应用到集合中的每个元素，映射得到一个新的元素，map方法会返回一个与原容器类型大小都相同的新容器，只不过元素的类型可能不同

```scala
scala> val books =List("Hadoop","Hive","HDFS")
books: List[String] = List(Hadoop, Hive, HDFS)
scala> books.map(s => s.toUpperCase)
//toUpperCase方法将一个字符串中的每个字母都变成大写字母
 List[String] = List(HADOOP, HIVE, HDFS)
scala> books.map(s => s.length) //将字符串映射到它的长度
 List[Int] = List(6, 4, 4) //新列表的元素类型为Int

```

#### flatMap方法（==一对多映射==）：
将某个函数应用到容器中的元素时，对每个元素都会返回一个容器（而不是一个元素），然后，flatMap把生成的多个容器“拍扁”成为一个容器并返回。返回的容器与原容器类型相同，但大小可能不同，其中元素的类型也可能不同
```scala
scala> books flatMap (s => s.toList)
 List[Char] = List(H, a, d, o, o, p, H, i, v, e, H, D, F, S)
```

### 3 过滤操作
过滤：遍历一个容器，从中获取满足指定条件的元素，返回一个新的容器
==filter方法：接受一个返回布尔值的函数f作为参数，==并将f作用到每个元素上，将f返回真值的元素组成一个新容器返回

```scala
scala> val university = Map("NKU" ->"Nankai University", "THU" ->"Tsinghua University","PKU"->"Peking University","XMUT"->"Xiamen University of Technology")
university: scala.collection.immutable.Map[String,String] = ...

//过滤出值中包含“Nankai”的元素，contains为String的方法
scala> val nkus = university filter {kv => kv._2 contains "Nankai"}
universityOfNankai: scala.collection.immutable.Map[String,String] = Map(NKU -> Nankai University)

scala> val l=List(1,2,3,4,5,6) filter {_%2==0}
//使用了占位符语法，过滤能被2整除的元素
l: List[Int] = List(2, 4, 6)

```

>[!Note]
>`universityOfNankai:`是由传入的两个变量生成的输出。

### 4 规约操作
规约操作是对容器元素进行两两运算，将其“规约”为一个值
==reduce方法：==接受一个二元函数f作为参数，首先将f作用在某两个元素上并返回一个值，然后再将f作用在上一个返回值和容器的下一个元素上，再返回一个值，依此类推，最后容器中的所有值会被规约为一个值

```scala
scala> val list =List(1,2,3,4,5)
list: List[Int] = List(1, 2, 3, 4, 5)

scala> list.reduce(_ + _) //将列表元素累加，使用了占位符语法
Int = 15

scala> list.reduce(_ * _) //将列表元素连乘
Int = 120

scala> list map (_.toString) reduce ((x,y)=>s"f($x,$y)")
String = f(f(f(f(1,2),3),4),5) //f表示传入reduce的二元函数
//可以看出规约顺序是从前往后

```

#### ==reduceLeft和reduceRight：==
前者从左到右进行遍历，后者从右到左进行遍历

![](image-20241115143631618.png)

```scala
scala> val list = List(1,2,3,4,5)
list: List[Int] = List(1, 2, 3, 4, 5)
scala> list reduceLeft {_-_}
 Int = -13
scala> list reduceRight {_-_}
 Int = 3
scala> val s = list map (_.toString)  //将整型列表转换成字符串列表
s: List[String] = List(1, 2, 3, 4, 5)
scala> s reduceLeft {(accu,x)=>s"($accu-$x)"}
 String = ((((1-2)-3)-4)-5)//list reduceLeft{_-_}的计算过程
scala> s reduceRight {(x,accu)=>s"($x-$accu)"}
 String = (1-(2-(3-(4-5))))//list reduceRight{_-_}的计算过程

```

>[!Note]
>注意从右规约并不是数列翻转后的从左规约，参考上面代码的`scala> list reduceRight {_-_}    Int = 3`的计算。` (1-(2-(3-(4-5))))`


#### fold方法：
==fold方法==一个双参数列表的函数，从提供的初始值开始规约。==第一个参数列表接受一个规约的初始值，第二个参数列表接受与reduce中一样的二元函数参数==
foldLeft和foldRight：前者从左到右进行遍历，后者从右到左进行遍历

```scala
scala> val list =List(1,2,3,4,5)
list: List[Int] = List(1, 2, 3, 4, 5)
scala> list.fold(10)(_*_)
 Int = 1200
scala> (list fold 10)(_*_) //fold的中缀调用写法
 Int = 1200
scala> (list foldLeft 10)(_-_)//计算顺序(((((10-1)-2)-3)-4)-5)
 Int = -5 
scala> (list foldRight 10)(_-_) //计算顺序(1-(2-(3-(4-(5-10)))))
 Int = -7

```

## 函数式编程实例
```scala
1   import java.io.File
2	import scala.io.Source
3	import collection.mutable.Map
4	object WordCount {
5		def main(args: Array[String]) { //main函数单独定义一个入口[]()
6			val dirfile=new File("testfiles")
7			val files  = dirfile.listFiles
8			val results = Map.empty[String,Int]
9			for(file <-files) {
10				val data= Source.fromFile(file)
11				val strs =data.getLines.flatMap{s =>s.split(" ")}
12				strs foreach { word =>
13					if (results.contains(word))
14					results(word)+=1 else  results(word)=1
15					}
16				}
17			results foreach{case (k,v) => println(s"$k:$v")}
18		}
19	}

```

- 行1-3：导入需要的类；
- 行6：建立一个File对象，这里假设当前文件夹下有一个testfiles文件夹，且里面包含若干文本文件；
- 行7：调用File对象的listFiles方法，得到其下所有文件对象构成的数组，files的类型为Array[java.io.File]；
- 行8：建立一个可变的空的映射（Map）对象results，保存统计结果。映射中的条目都是一个(key,value)键值对，其中，key是单词，value是单词出现的次数；
- 行9：通过for循环对文件对象进行循环，分别处理各个文件；
- 行10：从File对象建立Source对象方便文件的读取；
- 行11：getLines方法返回文件各行构成的迭代器对象，类型为Iterator[String]，flatMap进一步将每一行字符串拆分成单词，再返回所有这些单词构成的新字符串迭代器；
- 行12-15：对上述的字符串迭代器进行遍历，在匿名函数中，对于当前遍历到的某个单词，如果这个单词以前已经统计过，就把映射results中以该单词为key的映射条目的value增加1。如果以前没有被统计过，则为这个单词新创建一个映射条目，只需要直接对相应的key进行赋值，就实现了添加新的映射条目；
- 行17：对Map对象results进行遍历，输出统计结果。


