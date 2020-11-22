---
title: jest mock 对象
date: 2020-11-20 13:04:30
tags:
  - jest
  - javascript
category:
  - 前端
---

# jest

jest 是一个十分流行的前端测试库内置了许多工具

```javascript
// SomeClass.js
module.exports = class SomeClass {
  m(a, b) {}
};

// OtherModule.test.js
jest.mock("./SomeClass"); // this happens automatically with automocking
const SomeClass = require("./SomeClass");
const mMock = jest.fn();
SomeClass.mockImplementation(() => {
  return {
    m: mMock,
  };
});

const some = new SomeClass();
some.m("a", "b");
console.log("Calls to m: ", mMock.mock.calls);
```
