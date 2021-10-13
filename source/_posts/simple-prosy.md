---
title: simple-proxy
date: 2021-05-22 14:55:16
tags:
category:
- 文章
---
<script>
    function $(id) {
        return document.getElementById(id)
    }
  x
</script>
简单的代理对象

给count 最原始的方式绑定数据
```html preview open
<div id="count_0"> </div>
<button id="add_0">add</button>
<script type="module">
    let countNode;
    let addButton;
    countNode = $('count_0');
    addButton = $('add_0');
    let value = { count: 1 };

    countNode.textContent = value.count;
    addButton.onclick = () => {
        value.count++;
        countNode.textContent = value.count;
    }

</script>
```
通过set绑定数据
```html preview open
<div id="count_1"> </div>
<button id="add_1">add</button>
<!-- proxy 方式 -->
<script type="module">
    let countNode;
    let addButton;
    countNode = $('count_1');
    addButton = $('add_1');
    let value1 = new Proxy({ count: 1 }, {
        set(target, prop, value, receiver) {
            target[prop] = value;
            countNode.textContent = value;
        }
    });
    // mount
    countNode.textContent = value1.count;

    // update
    addButton.onclick = () => {
        value1.count++;
    }

</script>
```

循环代理+动态渲染
```html preview open
<div id="app">
    <div>data.count</div>
    <div id="count_2"></div>
    <div>data.data.count</div>
    <div id="count_3"></div>
    <button id="add_2">add</button>
</div>
<script type="module">
    const app = $("app")
    const map = new WeakMap();

    function generatorProxy(obj, vm) {
        const proxy = map.get(obj) ?? new Proxy(obj, {
            get: (target, prop) => {
                if (typeof target[prop] === 'object') {
                    return generatorProxy(target[prop], vm)
                }
                return Reflect.get(target, prop);
            },
            set: (target, prop, value, receiver) => {
                if (target[prop] === value) {
                    return;
                }
                const result = Reflect.set(target, prop, value);
                vm.render()
                return result;
            }
        })
        map.set(proxy, obj)
        return proxy;
    }

    const count_2 = $('count_2');
    const count_3 = $('count_3');
    const add_2 = $('add_2');


    function Component() {
        const data = generatorProxy({
            count: 0, data: {
                count: 0
            }
        }, this);
        this.render = () => {
            count_2.textContent = data.count;
            count_3.textContent = data.data.count;
            add_2.onclick = () => {
                console.log('click', data)
                ++data.count;
                ++data.data.count;
            }
        }
        this.render()
    }
 
    // 创建新的组件
    new Component();


</script>
```