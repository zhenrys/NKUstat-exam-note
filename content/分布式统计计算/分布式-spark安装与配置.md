## 安装spark

>[!warning]
>以下代码中的`$`是linux的shell中的标识符，不是命令内容。

0. 安装Spark之前需要安装Java环境和Hadoop环境。注意选择without-hadoop版本如：`spark-3.4.2-bin-without-hadoop.tgz`。

下载地址：[http://spark.apache.org](http://spark.apache.org/)

1. 复制安装包`spark-3.4.2-bin-without-hadoop.tgz`至路径 `~/software/`
2. 解压缩安装包到(`~/module/`)
```shell
$ tar –xvzf ~/software/spark-3.4.2-bin-without-hadoop.tgz –C  ~/module/
```
改名
```shell
$ mv ./spark-3.4.2-bin-without-hadoop/ ./spark  
```
3. 配置Spark 的Classpath。
```shell
$ cd ~/module/spark/conf
$ cp spark-env.sh.template spark-env.sh
```
编辑该配置文件，在文件最后面加上如下一行内容：
```shell
export SPARK_DIST_CLASSPATH=$(/home/hadoop/module/hadoop-3.3.6/bin/hadoop classpath) 
```

>[!warning]-
>此处的`/home/hadoop/module/hadoop-3.3.6/bin`要换成自己的bin路径。可以用`vim ~/.bashrc`将其中**有关的配置文件拍个照**方便修改及后续。

保存配置文件后，就可以启动、运行Spark了。Spark包含多种运行模式。这里使用本地模式运行Spark。若需要使用HDFS中的文件，则在使用Spark前需要启动Hadoop。

---
## Standalone模式
1. 配置works
```shell
$ cp workers.template workers
```
2.配置spark-env.sh
加入
```shell
export JAVA_HOME=/home/hadoop/module/jdk1.8.0_202
export HADOOP_CONF_DIR=/home/hadoop/module/hadoop-3.3.6/etc/hadoop
SPARK_MASTER_HOST=localhost
SPARK_MASTER_PORT=7077
```

3. 启动standalone模式
```shell
$ ./sbin/start-master.sh
$ ./sbin/start-workers.sh spark://localhost:7077
```

## Spark Shell
- Spark Shell 提供了简单的方式来学习Spark API
- Spark Shell可以以实时、交互的方式来分析数据
- Spark Shell支持Scala和Python

1. 在~/.bashrc中配置环境变量
```shell
export SPARK_HOME=/home/hadoop/module/spark
export PATH=$PATH:$SPARK_HOME/bin
```
2. 运行 spark-shell
```shell
$ spark-shell
```


---
## Spark应用程序

在Spark Shell中进行编程主要是方便对代码进行调试，但需要以逐行代码的方式运行。一般情况下，会选择将调试后代码打包成独立的Spark应用程序，提交到Spark中运行。
采用Scala编写的程序需要使用sbt（Simple Build Tool）进行打包，sbt的安装配置步骤如下：

1.下载https://www.scala-sbt.org/download/
https://github.com/sbt/sbt/releases/download/v1.9.9/sbt-1.9.9.tgz

从win移动到wsl里（此代码需要根据自己电脑调整）
```shell
$ cp /mnt/d/Download_Files/Firefox_Download/sbt-1.9.9.tgz ~/software
```
2.解压缩，配置环境变量
```shell
$ tar –xvzf sbt-1.9.9.tgz –C ~/module/sbt
```

修改.bashrc
```shell
export PATH=$PATH:~/module/sbt/bin
```

我们以一个简单的程序为例，介绍如何打包并运行Spark程序，该程序的功能是统计文本文件中包含字母a和字b的各有多少行，具体步骤如下：
1. 创建程序根目录，并创建程序所需的文件夹结构，命令如下：
```shell
$ mkdir ~/sparkapp
$ mkdir –p ~/sparkapp/src/main/scala
```
2. 创建scala文件`(~/sparkapp/src/main/scala/SimpleApp.scala)`，通过cd和vim即可

写入
```scala
import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
 object SimpleApp {
  def main(args: Array[String]) {
    val logFile = "file:///home/hadoop/module/spark/README.md" // 用于统计的文本文件
    val conf = new SparkConf().setAppName("Simple Application")
    val sc = new SparkContext(conf)
    val logData = sc.textFile(logFile, 2).cache()
    val numAs = logData.filter(line => line.contains("a")).count()
    val numBs = logData.filter(line => line.contains("b")).count()
    println("Lines with a: %s, Lines with b: %s".format(numAs, numBs))
  }
}

```

1. 然后创建一个`simple.sbt`文件（文件路径：`~/sparkapp/simple.sbt`），用于声明该应用程序的信息以及与Spark的依赖关系，具体内容如下：
```sbt
name := "Simple Project"
version := "1.0"
scalaVersion := "2.10.5"
libraryDependencies += "org.apache.spark" %% "spark-core" % "1.6.0“
```

4.使用sbt对该应用程序进行打包，命令如下
```shell
$ cd ~/sparkapp
$ ~/module/sbt/sbt/bin/sbt package
```

>[!warning]-
>此处我的路径里有两个`/sbt`，需要注意。

 5. 有了最终生成的jar包后，再通过spark-submit就可以提交到Spark中运行了，命令如下：
```shell
$ ~/module/spark/bin/spark-submit --class "SimpleApp" ~/sparkapp/target/scala-2.10/simple-project_2.10-1.0.jar
```

>[!warning]-
>第五条命令注意class前面是两个`--` 。此外要确定`~/sparkapp/target/scala-2.10/simple-project_2.10-1.0.jar`的存在性。此外此处路径是两个2.10，ppt上是2.12，注意修改。

>[!Note] 成功？
>如果运行后，能在众多输出中看一行关于a和b的词频统计，说明成功完成配置并且任务执行成功。

---

## 补充-不同spark模式下提交simpleapp任务

```shell
start-dfs.sh
start-yarn.sh
```

### 本地模式
```shell
~/module/spark/bin/spark-submit   --class "SimpleApp"   --master local   ~/sparkapp/target/scala-2.10/simple-project_2.10-1.0.jar
```

### standalone模式
```shell
~/module/spark/sbin/start-master.sh # 之后即可在 http://localhost:8080/ 上面查看进展

~/module/spark/sbin/start-worker.sh spark://localhost:7077

~/module/spark/bin/spark-submit   --class "SimpleApp"   --master spark://localhost:7077   --executor-memory 1G   --total-executor-cores 2   ~/sparkapp/target/scala-2.10/simple-project_2.10-1.0.jar
```

>[!Note] 成功？
>如果运行后，能在众多输出中看一行关于a和b的词频统计，说明成功完成配置并且任务执行成功。