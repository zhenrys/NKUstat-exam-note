>[!warning]-
>以下操作基于`Rstudio`
## 安装package

在rstudio中
1. 最上面任务栏tool
2. 第一行install packages
3. 输入需要的包名并选择源即可

另一种方法（不甚好用）在脚本中输入
```r
install packages("包名")
```

更多方法参考☞ https://blog.csdn.net/qq_43210428/article/details/116382131
## 加载package

在脚本中
```r
library("包名")
```

## 控制台清空

`Ctrl + L`

也可以点击右上角透明笤帚

## 可视化查看变量

```r
View(X)
```

或者：双击右上侧`environment`中对应变量

## R Notebook

`+c`图标：添加新单元格

`preview`：预览html格式

`run`：运行单元格，输出在正下方

### R notebook输出latex编译的pdf

在Rmd文件上方加入
```r
---
title: "回归分析上机3"
output:
  pdf_document:
    latex_engine: xelatex
  html_document:
    df_print: paged
header-includes:
  - \usepackage{fontspec}  # 导入 fontspec 包
  - \setmainfont{Times New Roman}  # 设置英文字体
  - \newfontface\zhfont{SimHei}  # 设置中文字体（例如：SimHei, 宋体等）
  - \usepackage{xeCJK}  # 导入 xeCJK 包支持中文
  - \setCJKmainfont{SimHei}  # 设置中文正文使用的字体（例如：SimHei）
---
```

>[!Note]-
>作用1：用xelatex编译；作用2：添加显示中文的宏包

>[!warning]-
>输出pdf之前要删掉之前输出的旧pdf，才能输出新的pdf。
## R中代码单行过长换行

用括号表示代码还没结束
```r
result <- (
  long_function_name(param1, param2, param3, 
                      param4, param5)
)
```

==输出为pdf时候更方便的事手动在逗号后面敲回车==

## Rmd中输入表格
注意用array，并且后面的 c 与 | 要对应列数。
```latex
$$
\begin{array}{|c|c|c|c|}
\hline
\textbf{Comparison} & \textbf{Mean\_Difference} & \textbf{Lower} & \textbf{Upper} \\
\hline
1-2 & 12.6667 & 6.8660 & 18.4673 \\
1-3 & -3.3333 & -9.1340 & 2.4673 \\
2-3 & -16.0000 & -21.8006 & -10.1993 \\
\hline
\end{array}
$$
```


---
# 线性模型

## 数据导入 与 简单处理
```r
## 加载数据集
data("longley")

## 提取X，Y
X_raw <- data.matrix(longley[, 1:6]) # 前六列为设计矩阵
Y_raw <- data.matrix(longley[,7]) # 第七列为响应变量

# 获取原始数据的均值和标准差
X_bar <- colMeans(X_raw)
X_sd <- apply(X_raw, 2, sd)

Y_bar <- mean(Y_raw)
Y_sd <- sd(Y_raw)

# 中心化+标准化
X <- scale(X_raw, center = TRUE, scale = TRUE)
Y <- scale(Y_raw, center = TRUE, scale = TRUE)
```

>[!warning]-
>注意对标准化的数据进行估计后要要回推原始方程。
## 从xlsx中导入数据
```r
library(readxl)
data <- read_excel("C:\\Users\\86177\\Desktop\\3-15.xlsx") #注意要双\\
```

>[!Note]-
>向量与矩阵的转换：
>```r
>X <- data.matrix(longley)
>X_2 <- X_raw[,2]
>X_3 <- X_raw[,3]
>X_2UX_3 <- rbind(X_2,X_3)
>```


# 1 复共线性处理

## 判断复共线性
```r
## 可以通过比较最小特征值与最大特征值的比值来判断
min_eigen <- min(eigen_values)
max_eigen <- max(eigen_values)
condition_number <- max_eigen / min_eigen

print(paste("条件数:", condition_number))

if (condition_number > 30) {
  print("存在复共线性问题")
} else {
  print("复共线性问题不明显")
}
```

## 特征值分解（主成分回归需要）
```r
# 计算协方差矩阵
cov_matrix <- cov(X)

# 提取特征值lambda，特征向量eigen_vectors, phi矩阵
eigen_values_vectors <- eigen(cov_matrix)

eigen_values <- eigen_values_vectors$values
eigen_vectors <- eigen_values_vectors$vectors
eigen_vectors_matrix <- as.matrix(eigen(cov_matrix)$vectors)
```

## 典则形式

$$
y = \alpha_01_n+Z\alpha+e
$$
$$
Z=X\Phi,\alpha=\Phi\beta',X'X = \Phi\Lambda\Phi'
$$


```r
# 计算 phi矩阵
phi <- as.matrix(eigen(cov_matrix)$vectors)

Z <- X%*%phi
```

## 岭回归

#### 方法1 HK公式求k
```r
alpha<-solve(t(Z)%*%Z)%*%t(Z)%*%Y

product <- t(alpha)%*%alpha 

# 提取对角线元素
diagonal_elements <- diag(product)

# 计算最大对角线元素
alpha_max <- max(diagonal_elements)

# 应用H-K公式,注意分子sigma取值，为标准化后的Y的sd，取1
k_hat <- 1/(alpha_max^2)

#回归系数估计
beta_k <- solve(t(X)%*%X+k_hat*diag(6))%*%t(X)%*%Y
#参数回推
beta_hat <- beta_k/X_sd*Y_sd
beta_0 <- sum((-X_bar*beta_k)/X_sd)*Y_sd+Y_bar

k_hat
```

>[!Note]-
>`Z`是典则形式里的经过变换的设计阵。


#### 方法2 岭迹法求k
```r
# 设置k的范围
k_values <- seq(0, 0.5, by = 0.005)
beta_k <- matrix(0, nrow = length(k_values), ncol = ncol(X))
rss_values <- numeric(length(k_values))
# 循环计算beta_k
for (i in seq_along(k_values)) 
{
  k <- k_values[i]
  beta_k[i, ] <- solve(t(X) %*% X + k * diag(ncol(X))) %*% t(X) %*% Y
  # 计算预测值
  Y_hat <- X %*% beta_k[i, ]
}
# 将结果转置为数据框以便于绘图
beta_k_df <- as.data.frame(beta_k)
colnames(beta_k_df) <- colnames(X)

# 绘制参数随k的变化
matplot(k_values, beta_k_df, type = "l", lty = 1, col = 1:
        (ncol(beta_k_df)),
        xlab = "k", ylab = "beta_k",
        main = "岭迹图")
legend("topright", legend = colnames(beta_k_df), col = 1:
         (ncol(beta_k_df)), lty = 1, cex = 0.5) # 调整cex以缩小图例

print(beta_k_df)

```


---

# 2 最小二乘
## 最小二乘法
```r
model <- lm(data$Y ~ data$X, data = data) 
```

#### 散点图图并添加回归直线
```r
plot(data$X, data$Y, xlab = "x", ylab = "y")
abline(model, col = "red") 
```

#### 残差图
```r
residuals <- residuals(model)
plot(data$X, residuals, 
     xlab = "x", 
     ylab = "残差", 
     pch = 19)
abline(h = 0, col = "red", lty = 2)  # 添加水平线 y=0
```

## 变换$Y_{new}=Y^{1/2}$再进行最小二乘
```r
data$Y_new <- sqrt(data$Y)
model_new <- lm(data$Y_new ~ data$X, data = data) 
```

## Box-Cox 变换
```r
library(MASS)
boxcox_result <- boxcox(model, lambda = seq(-2, 2, 0.1))

# calculate the best lambda
best_lambda <- boxcox_result$x[which.max(boxcox_result$y)]

# use the best lambda to transform the model
if (best_lambda == 0) {
  data$y_transformed <- log(data$Y)  # 当 lambda = 0 时，使用自然对数变换
} else {
  data$y_transformed <- (data$Y^best_lambda - 1) / best_lambda
}
model_transformed <- lm(y_transformed ~ X, data = data)

summary(model_transformed)
```

>[!Note]-
>boxcox函数会自动输出一个lambda的趋势变化图。

## 库克距离与强影响点
```r
cooks_d <- cooks.distance(model)
n <- nrow(data)
threshold <- 4 / n
influential_points <- which(cooks_d > threshold)
influential_data <- data[influential_points, ]
```
#### 库克距离绘图
```r
plot(cooks_d, main = "Cook Distance", ylab = "Cook Distance", xlab = "Index")
abline(h = threshold, col = "red", lty = 2)  # 添加阈值线

```

---

# 3.逐步回归

```r
### data input
# install.packages("readxl")
library(readxl)
data <- read_excel("5-7.xlsx")
data <- data[1:29,1:6]
```
## 向前法
```r
# 先建立一个空模型 
null_model <- lm(y ~ 1, data = data) 
# 建立全模型 
full_model <- lm(y ~ x1 + x2 + x3 + x4 + x5, data = data)

forward_model <- step(null_model, direction = "forward", scope = formula(full_model), k = log(nrow(data)))
summary(forward_model)
```

>[!Note]-
>此处设置`k=log(nrow(data)))`，本质为采用BIC准则，效果优于AIC。
## 逐步回归法（向前向后法）
```r
# 使用逐步法进行模型选择
stepwise_model <- step(full_model, direction = "both", k = log(nrow(data)))
summary(stepwise_model)
```

>[!Note]-
>还有另一个子集回归函数，method有四个参数可选
>```r
>subset_model <- regsubsets(y ~ ., data = data,method = "forward",  nvmax=ncol(data) - 1)
>```

## 全部子集回归方法

#### 计算全部可能组合
```r
# 定义自变量
x_vars <- names(data)[-which(names(data) == "y")]

# 初始化结果存储
aic_values <- numeric()
rmsq_values <- numeric()
model_forms <- character()

# 遍历所有可能的组合
for (i in 1:length(x_vars)) {
  combos <- combn(x_vars, i, simplify = FALSE)
  for (combo in combos) {
    # 构建模型公式
    formula <- as.formula(paste("y ~", paste(combo, collapse = " + ")))
    
    # 拟合模型
    fit <- lm(formula, data = data)
    
    # 计算 AIC 和 RMSq
    aic_values <- c(aic_values, AIC(fit))
    rmsq_values <- c(rmsq_values, sqrt(deviance(fit) / nrow(data)))
    model_forms <- c(model_forms, paste(combo, collapse = ", "))
  }
}

# 创建结果数据框
results <- data.frame(Model = model_forms, AIC = aic_values, RMSq = rmsq_values)

# 输出结果
print(results)

```

#### 计算固定变量个数时候的最小rms_q对应的方程
```r
library(Metrics)
subset_model <- regsubsets(y ~ ., data = data, nvmax = ncol(data) - 1)
subset_summary <- summary(subset_model)

# 存储 AIC 和 RMSE 的结果
aic_values <- numeric(length(subset_summary$rsq))
rmse_values <- numeric(length(subset_summary$rsq))

# 计算 AIC 和 RMSE
for (i in 1:length(subset_summary$rsq)) {
  if (i == 1) {
    # 空模型的 AIC 和 RMSE
    model <- lm(y ~ 1, data = data)
  } else {
    # 使用选定的变量构建模型
    variables <- names(subset_summary$which[i,])[subset_summary$which[i,]]
    model <- lm(as.formula(paste("y ~", paste(variables[-1], collapse = "+"))), data = data)  # 排除截距
  }
  
  # 计算 AIC
  aic_values[i] <- AIC(model)

  # 计算 RMSE
  rmse_values[i] <- rmse(data$y, predict(model))
}

# 输出结果
results <- data.frame(
  Model = 1:length(subset_summary$rsq),
  AIC = aic_values,
  RMSE = rmse_values
)

print(results)
```

---

# 4单因子方差分析

```r
data <- data.frame(
  Factory = rep(c(1,2,3), each = 6),
  Response = c(40, 48, 38, 42, 45, 46, 26, 
              34, 30, 28, 32, 33, 39, 40, 
              48, 50, 50, 52)
)

# 注意此处要加入factor函数
model <- lm(Response~factor(Factory), data = data)

anova_result <- anova(model)

print(anova_result)
```

>[!warning]-
>注意`model <- lm(Response~factor(Factory), data = data)`要加入`factor`函数。这是核心步骤！

---

# 5双因子方差分析（含交互效应）

```r
data <- data.frame(
  FactorA = rep(c(1, 2, 3), each = 8),
  FactorB = rep(1:4, times = 3),
  Response = c(14, 10, 11, 11, 13, 19, 10, 12, 
               9, 7, 10, 8, 7, 11, 6, 10,
               5, 11, 13, 14, 12, 13, 14, 10)
)

# 注意此处要加入factor函数
model <- lm(Response ~ factor(FactorA) + factor(FactorB) 
            + factor(FactorA):factor(FactorB), data = data)

anova_result <- anova(model)

print(anova_result)
```

>[!warning]-
>注意gpt生成的里面没有factor函数。