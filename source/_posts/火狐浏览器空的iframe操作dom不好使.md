---
title: 火狐浏览器空的iframe操作dom不好使
date: 2020-12-11 21:02:59
tags:
  - js
  - firefox
category:
  - 前端
---

## 如果向一个空的 iframe 直接执行

```javascrpt
document.appendChild(document.createElement('div'))
```

会不好使,但是页面不会报错，没有警告

## 解决方案

监听 iframe onload 事件
再 onload 事件中执行 dom 操作比较安全

```javascript
// win 是 iframe 的引用
const root = win.document.createElement("div");
win.onload = () => {
  win.document.appendChild(root);
};
```

参考链接 [firefox 不好使](https://stackoverflow.com/questions/3255702/firefox-strange-behaviour-when-working-with-javascript-on-an-iframe)

然而再 chrome 上 src 是 about:blank 就是不写 src 的 onload 不会被触发

兼容处理

检测浏览器版本这里用之前写的 is 库做处理[is everything lib](https://github.com/suxin2017/is/blob/master/src/platform/isFirefox.ts)

这个看起来应该算是 chrome 的 bug
