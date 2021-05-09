---
title: flex布局
date: 2021-05-09 18:03:12
tags:
category:
---

**flex** 布局有 `align-self` 进行垂直个体布局，但是`justify-self`只在 **grid** 布局上面生效

通过查阅资料发现在**flex** 中可以通过 **margin：auto** 的方式实现单个元素的布局;

实现单个元素相对剩余位置居中布局

```html preview
<div class="flex-box">
    <div class="item "></div>
    <div class="item flex-item-center">
        相对于后面位置居中
    </div>
</div>

<style>
    .flex-box{
        display: flex
    }
    .item{
        width: 80px;
        height: 80px;
        background-color: aquamarine;
    }
    .flex-item-center{
        margin:0 auto;
    }
</style>
```

```html preview
<div class="flex-box">
    <div class="item "></div>
    <div class="item flex-item-right">
        相对于空余位居右
    </div>
</div>

<style>
    .flex-box{
        display: flex
    }
    .item{
        width: 80px;
        height: 80px;
        background-color: aquamarine;
    }
    .flex-item-right{
        margin-left:auto;
    }
</style>
```


```html preview
<div class="flex-box">
    <div class="item flex-item-right">
        flex 居右
    </div>
</div>

<style>
    .flex-box{
        display: flex
    }
    .item{
        width: 80px;
        height: 80px;
        background-color: aquamarine;
    }
    .flex-item-right{
        margin-left:auto;
    }
</style>
```


```html preview
<div class="flex-box">
    <div class="item flex-item-center">
        flex 居中
    </div>
</div>

<style>
    .flex-box{
        display: flex
    }
    .item{
        width: 80px;
        height: 80px;
        background-color: aquamarine;
    }
    .flex-item-center{
        margin-left:auto;
    }
</style>
```