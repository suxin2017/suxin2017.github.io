---
title: opencv 常用对象
tags:
  - opencv
  - C++
date: 2020-11-22 08:47:39
category:
- post
---

## 创建Mat对象的方法

- 构造函数Mat()

```cpp
Mat M(2,2,CV_8UC3,Scalar(0,0,255));

cout << "M = " << M << endl;

// output
//  M = [  0,   0, 255,   0,   0, 255;
//   0,   0, 255,   0,   0, 255]

```

这段代码创建了2*2的标量(Scalar)（只有大小没有方向）[0,255,255]

CV_8UC3 表示 unsigned char 类型
char 是一个字节 -128-127
unsigned 是 0-255

- 通过构造函数

```cpp
int sz[3] = {2,2,2};
Mat L(3,sz,CV_8UC,Scalar::all(0));

cout << M << endl;
// error 输出会报错
```

Scalar::all(0) 会返回一个```[0,0,0,0]```


构造函数有点多用到一个再写一个吧。

## 格式化输出

直接用python格式的，因为很舒服

```cpp
 Mat r(10,4,CV_8UC3);
randu(r,Scalar::all(0),Scalar::all(255));
cout<< format(r,Formatter::FMT_PYTHON) << endl;

//output 
[[[ 91,   2,  79], [179,  52, 205], [236,   8, 181]],
 [[239,  26, 248], [207, 218,  45], [183, 158, 101]],
 [[102,  18, 118], [ 68, 210, 139], [198, 207, 211]],
 [[181, 162, 197], [191, 196,  40], [  7, 243, 230]],
 [[ 45,   6,  48], [173, 242, 125], [175,  90,  63]],
 [[ 90,  22, 112], [221, 167, 224], [113, 208, 123]],
 [[214,  35, 229], [  6, 143, 138], [ 98,  81, 118]],
 [[187, 167, 140], [218, 178,  23], [ 43, 133, 154]],
 [[150,  76, 101], [  8,  38, 238], [ 84,  47,   7]],
 [[117, 246, 163], [237,  69, 129], [ 60, 101,  41]]]
```

#常用数据结构

- 点 Point

```cpp
// 二维
Point2f p(6,2);
// 三维
Point3f p3(6,2,5);



// output 
[6,2]
[6,2,5]
```
- 向量 vector

和数组差不多

```cpp
vector<float> v;
v.push_back(3);
v.push_back(5);
v.push_back(7);

cout << Mat(v) << endl;

//output
[3;
 5;
 7]
```
这个vector 是标准库的向量，可以自动改变自己的长度


- 颜色 Scalar 

Scalar 是一个四个元素的数组

```cpp
Scalar s(0,0,0,0);
//可以是

int r = 255,g=0,b=0;
Scalar(r,g,b);
```

- 大小 Size

width 和 height
```cpp
int width = 100, height = 200;
Size(width, height);
```

- 矩形 Rect

```cpp
int x = 0, y = 0,width = 200, height = 200;
Rect rect1(x, y, width, height);
Rect rect2(x + 50, y + 50, width, height);

// 矩形交集
Rect rect = rect1 & rect2;
// output
[150 x 150 from (50, 50)]
// 矩形并集
Rect rect = rect1 | rect2;
[250 x 250 from (0, 0)]

// 移动矩形
Point2f point(10, 10);
Rect rectShift = rect + point;

// 添加
Rect rectShift = rect1 - Size(20,20);
//output
[180 x 180 from(0, 0)]


//  移动
Rect rectShift = rect1 - Point(20,20);
// output
[200 x 200 from(-20, -20)]
```

- 颜色空间转换 cvtColor

void cvtColor(InputArray src, OutputArray output ,int code, int dstCn=0);

常用颜色
- RGB 
- HSV 色调 饱和度 明度 
- HLS 色调 亮度 饱和度 
- Gray 灰度
- 5X5 5X5颜色矩阵，开发板
- YCrCb(YUV)  Y 明亮度 U和V色度，描述色彩及饱和度 JPEG会用
- CIE L*a*b  L 亮度 a 和 b 色彩对立唯独
- CIE L*u*v  未知
- Bayer 拜尔滤色镜 多用于数字图像传感器
- YUV420 YUV的一种
常量都在COLOR_XXX2XXX 定义

> ps: OpenCV 默认图片通道存储孙旭是BGR即蓝绿红，而不是RGB

