
# 分布式在liunx上的安装
## 下载hadoop和java
 1. 下载对应版本的hadoop，注意下载二进制版本，即文件名和下面**完全一致**，注意没有**src**。
	`hadoop-3.3.6.tar.gz`

>[!warning]-
>注意下载的文件名字一定要和上面完全一致。
## 创建用户`hadoop`
```shell
sudo adduser hadoop
sudo vim /etc/sudoers

	加入hadoop	ALL=(ALL:ALL) ALL

su hadoop
```

## `java`的安装
```shell
# 安装apt并下载java
sudo apt update
apt --version
sudo apt install openjdk-8-jdk

sudo vim ~/.bashrc

	在其中加入：
	# export JAVA_HOME=/usr/local/jdk-21.0.4 
	export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64
	export PATH=$JAVA_HOME/bin:$PATH
	
source ~/.bashrc

java -version
# 如果有一些版本号输出即为成功。

```

## `hadoop`的安装
```shell
mkdir software
cd software

# 这里要先准备好自己网上下载好的Hadoop的gz文件，并把下面的/mnt/...路径替换为自己的路径
mv /mnt/d/Download_Files/Firefox_Download/hadoop-3.3.6.tar.gz /home/hadoop/software
sudo tar -xvzf hadoop-3.3.6.tar.gz -C /usr/local/

sudo vim ~/.bashrc
	
	在其中加入：
	# zhr add it Set Hadoop-related environment variables
	export HADOOP_HOME=/usr/local/hadoop-3.3.6
	export HADOOP_INSTALL=$HADOOP_HOME
	export HADOOP_MAPRED_HOME=$HADOOP_HOME
	export HADOOP_COMMON_HOME=$HADOOP_HOME
	export HADOOP_HDFS_HOME=$HADOOP_HOME
	export YARN_HOME=$HADOOP_HOME
	export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin

source ~/.bashrc

hadoop version
# 如果有一些版本号输出即为成功。

```

>[!Note]-
>一步到位的方法，在bashrc中加入：
>```shell
># zhr add it for hadoop and java
> # export JAVA_HOME=/usr/local/jdk-21.0.4
> export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64
> export PATH=$JAVA_HOME/bin:$PATH
> 
> # zhr add it Set Hadoop-related environment variables
> export HADOOP_HOME=/usr/local/hadoop-3.3.6
> export HADOOP_INSTALL=$HADOOP_HOME
> export HADOOP_MAPRED_HOME=$HADOOP_HOME
> export HADOOP_COMMON_HOME=$HADOOP_HOME
> export HADOOP_HDFS_HOME=$HADOOP_HOME
> export YARN_HOME=$HADOOP_HOME
> export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
>
>```

# 安装后的分布式配置

```shell
# 安装ssh
  188  sudo apt install openssh-client
  189  sudo apt install openssh-server
  190  sudo service ssh start
  191  ssh localhost
  
# 修改分布式节点配置
  206  cd $HADOOP_HOME/etc/hadoop
  209  sudo vim core-site.xml
  210  sudo vim hdfs-site.xml
  212  sudo vim hadoop-env.sh
  
# 公钥私钥的免密登录
  213  ls ~/.ssh/
  214  ssh-keygen -t rsa
  215  cd ~/.ssh/
  216  ssh-copy-id localhost
  217  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
  
# 启动集群服务，并在网页端查看明细
  225  hdfs namenode -format
  244  $HADOOP_HOME/sbin/start-dfs.sh
  245  jps
  260  http://localhost:9870
  
# 在分布式上运行文字计数例子
  261  cd $HADOOP_HOME/share/hadoop/mapreduce
  265  hdfs dfs -mkdir -p /user/hadoop/input
  274  hdfs dfs -put ~/input/test1.txt /user/hadoop/input/
  275  hdfs dfs -ls /user/hadoop/input
  276  hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount /user/hadoop/input /user/hadoop/output
  277  hdfs dfs -ls /user/hadoop/output
  278  hdfs dfs -cat /user/hadoop/output/part-r-00000
  
# 停止集群服务
  279  $HADOOP_HOME/sbin/stop-dfs.sh
```


>[!warning]-
>如果出现问题，因为是个人使用，没有重要信息，建议格式化。格式化的时候必须删掉tmp和logs，让系统干净的像初生的婴儿一样。



