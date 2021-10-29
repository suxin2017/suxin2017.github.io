---
title: jest mock XMLHttpRequest
tags:
  - jest
  - javascript
category:
  - 前端
  - post
date: 2020-11-20 13:04:30
---

## 场景

要开发一个sdk需要请求网络，需要在本地连接远端sdk，这时候有两种方式去模拟这种行为。
- 测试时候通过本地代理，做接口转发
- 通过jest直接mock xhr对象，让其返回一定是那个数据格式

对于第一种来说，还需要更多的接口信息，依赖后端的逻辑判断，为了sdk依赖更小，我选择直接使用mock的方式。

## jest mock一个实例

jest 

```javascript
// jest.mock(implementation)是 jest.fn().mockImplementation(implementation)
// 缩写
global.XMLHttpRequest = jest.fn().mockImplementation(()=>{
    return {
        open:jest.fn(),
        send:function(){
            setTimeout(()=>{
                console.log(this);
                this.response = "ok"
                this.onload()
            })
        },
    }
})
describe('xhr mock', () => {
    /**
     * @type {XMLHttpRequest}
     */
    let xhr;
    beforeEach(() => {
        xhr = new XMLHttpRequest();
    });
    it('should get ok', (done) => {
        xhr.open("http://test.com/rest/abc");
        xhr.onload= ()=>{
            expect(xhr.response).toBe("ok")
            done();
        }
        xhr.send();
    });
});
```

这样我们就成功mock一个xhr接口了，不过现在还是存在问题，不能根据路径返回不同的数据，那么我们继续修改下我们的方法

```javascript
let mockCache = {};
function mockApi(path,data){
    mockCache[path] = data;
}
// jest.mock(implementation)是 jest.fn().mockImplementation(implementation)
// 缩写
global.XMLHttpRequest = jest.fn().mockImplementation(()=>{
    return {
        open:function(type,path){
            this.response = mockCache[path]
        },
        send:function(){
            this.onload()
        },
    }
})
describe('xhr mock', () => {
    /**
     * @type {XMLHttpRequest}
     */
    let xhr;
    beforeEach(() => {
        xhr = new XMLHttpRequest();
    });
    it('should get ok', (done) => {
        mockApi("http://test.com/rest/abc","ok")
        xhr.open("get","http://test.com/rest/abc");
        xhr.onload= ()=>{
            expect(xhr.response).toBe("ok")
            done();
        }
        xhr.send();
    });
    it('should get {abc: 123}', (done) => {
        mockApi("http://test.com/rest/abc",{abc:123})
        xhr.open("get","http://test.com/rest/abc");
        xhr.onload= ()=>{
            expect(xhr.response).toStrictEqual({abc:123})
            done();
        }
        xhr.send();
    });
});
```

剩下的还可以继续扩充，但是到了这部分就够我的需求用了。

简单的轮子自己搞，代码简洁又明了。