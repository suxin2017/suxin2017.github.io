---
title: simple-prosy
date: 2021-05-22 14:55:16
tags:
category:
---
<script>
    function $(id) {
        return document.getElementById(id)
    }
    let countNode;
    let addButton;
</script>
简单的代理对象

给count 最原始的方式绑定数据
```html preview open
<div id="count_0"> </div>
<button id="add_0">add</button>
<script>
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
 <script>
    countNode = $('count_1');
    addButton = $('add_1');
    let value1 = new Proxy({ count: 1 },{
        set(target, prop, value, receiver){
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

