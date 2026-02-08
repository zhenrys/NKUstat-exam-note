%% 2024年9月30日18:13:12 %%
# YARN的配置

*下面的注释中的序号对应的是ppt中的章节*

```shell
# 配置yarn
  vim ~/.bashrc # 查看自己的hadoop-3.3.6位置，记录下来
  cd $HADOOP_HOME/etc/hadoop/
  vim core-site.xml # 进行更改1
  vim mapred-site.xml # 进行更改2
  vim yarn-site.xml # 进行更改3
  vim hadoop-env.sh # 进行更改4

  # 不进行分发配置

# 启动集群服务
  start-dfs.sh
  start-yarn.sh
  
  jps # 主要看nodemanager是否启动，如果没有，说明前面需要调整

# 执行一个例子计算圆周率，检查yarn是否初步配置成功
  hdfs dfs -ls /input
  hdfs dfs -mkdir /input
  hdfs dfs -rm -r /user/hadoop/output
  hdfs dfsadmin -safemode leave
  hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-*.jar pi 16 10000

# 4 更改yarn的配置
  cd $HADOOP_HOME/etc/hadoop/
  vim mapred-site.xml  # 进行更改5
  vim yarn-site.xml  # 进行更改6

# 5 尝试yarn命令运行，ctrl+c退出
  yarn top
  yarn node –all –list
  ls

# 7 先进行备份，之后更改日志配置
  cp capacity-scheduler.xml
  cp $HADOOP_HOME/etc/hadoop/capacity-scheduler.xml $HADOOP_HOME/etc/hadoop/capacity-scheduler.xml.bak
  vim capacity-scheduler.xml  # 进行更改7
  
# 重启集群服务
  stop-yarn.sh
  start-yarn.sh

# 检测small队列是否可用
  yarn queue -status small 

# 向小序列递交任务，求圆周率
  hdfs dfs -mkdir /input
  hdfs dfs -ls /user/hadoop/input
  hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount   -Dmapreduce.job.queuename=small /user/hadoop/input /user/hadoop/output
  
  eixt
```


# 配置文件更改后的样子
### 更改1 `core-site.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<!--
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. See accompanying LICENSE file.
-->

<!-- Put site-specific property overrides in this file. -->

<configuration>
<property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9820</value>
</property>
<property>
        <name>hadoop.tmp.dir</name>
        <value>/usr/local/hadoop-3.3.6/tmp</value>
</property>


</configuration>
```
### 更改2`mapred-site.xml`
```xml
    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. See accompanying LICENSE file.
-->

<!-- Put site-specific property overrides in this file. -->

<configuration>
<property>
      <name>mapreduce.framework.name</name>
      <value>yarn</value>
</property>
<property>
      <name>yarn.app.mapreduce.am.env</name>
      <value>HADOOP_MAPRED_HOME=/usr/local/hadoop-3.3.6</value>
</property>
<property>
      <name>mapreduce.map.env</name>
      <value>HADOOP_MAPRED_HOME=/usr/local/hadoop-3.3.6</value>
</property>
<property>
      <name>mapreduce.reduce.env</name>
      <value>HADOOP_MAPRED_HOME=/usr/local/hadoop-3.3.6</value>
</property>


<property>
      <name>MapReduce.jobhistory.address</name>
      <value>ThinkPad-ZHR:10020</value>
</property>
<property>
      <name>MapReduce.jobhistory.webapp.address</name>
      <value>ThinkPad-ZHR:19888</value>
</property>
</configuration>

```

### 更改3`yarn-site.xml`
```xml
<?xml version="1.0"?>
<!--
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. See accompanying LICENSE file.
-->
<configuration>

<!-- Site specific YARN configuration properties -->
<property>
      <name>yarn.nodemanager.aux-services</name>
      <value>mapreduce_shuffle</value>
</property>
<property>
      <name>yarn.log-aggregation-enable</name>
      <value>true</value>
</property>
<property>
      <name>yarn.log-aggregation.retain-seconds</name>
      <value>604800</value>
</property>
<property>
      <name>yarn.log.server.url</name>
      <value>http://ThinkPad-ZHR:19888/jobhistory/logs</value>
</property>

</configuration>
~      
```

### 更改4`hadoop-env.sh`
```sh
###
# Advanced Users Only!
###

#
# When building Hadoop, one can add the class paths to the commands
# via this special env var:
# export HADOOP_ENABLE_BUILD_PATHS="true"

#
# To prevent accidents, shell commands be (superficially) locked
# to only allow certain users to execute certain subcommands.
# It uses the format of (command)_(subcommand)_USER.
#
# For example, to limit who can execute the namenode command,
# export HDFS_NAMENODE_USER=hdfs


###
# Registry DNS specific parameters
###
# For privileged registry DNS, user to run as after dropping privileges
# This will replace the hadoop.id.str Java property in secure mode.
# export HADOOP_REGISTRYDNS_SECURE_USER=yarn

# Supplemental options for privileged registry DNS
# By default, Hadoop uses jsvc which needs to know to launch a
# server jvm.
# export HADOOP_REGISTRYDNS_SECURE_EXTRA_OPTS="-jvm server"

# zhr add it
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64
export HDFS_NAMENODE_USER=hadoop
export HDFS_DATANODE_USER=hadoop
export HDFS_SECONDARYNAME_USER=hadoop

# zhr add it for yarn
export HADOOP_MAPRED_HOME=/usr/local/hadoop-3.3.6
export YARN_RESOURCEMANAGER_USER=hadoop
export YARN_NODEMANAGER_USER=hadoop

```


>[!hint]
>更改5和更改6在前面的更改中一起一步到位了。
### 更改7 `capacity-scheduler.xml`

*这一文件太长了，就只放上了需要更改的部分*

```xml

# 这一部分是修改的
<property>
  <name>yarn.scheduler.capacity.root.queues</name>
  <value>default,small</value>
  <description>The queues at the this level (root is the root queue).</description>
</property>

# 这一部分是后加的
<property>
  <name>yarn.scheduler.capacity.root.default.capacity</name>
  <value>70</value>
  <description>Default queue target capacity.</description>
</property>
<property>
  <name>yarn.scheduler.capacity.root.small.capacity</name>
  <value>30</value>
</property>
<property>
  <name>yarn.scheduler.capacity.root.small.user-limit-factor</name>
  <value>1</value>
</property>
<property>
  <name>yarn.scheduler.capacity.root.small.maximum-capacity</name>
  <value>100</value>
</property>
<property>
  <name>yarn.scheduler.capacity.root.small.state</name>
  <value>RUNNING</value>
</property>
<property>
  <name>yarn.scheduler.capacity.root.small.acl_submit_applications</name>
  <value>*</value>
</property>
<property>
  <name>yarn.scheduler.capacity.root.small.acl_administer_queue</name>
  <value>*</value>
</property>
```


