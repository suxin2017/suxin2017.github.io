---
title: 测试
---

```javascript preview 请打开console查看结果
function sayHello(){
    console.log('hello')
}
sayHello()
```


```html preview

<div id="btn">button</div>
<style>
    #btn{
        width: 20px;
        height: 20px;
        background: red;
    }
</style>
<script>
function btnSayHello(){
    console.log('hello btn')
}
document.getElementById('btn').onclick = btnSayHello
</script>

```

```ts
type A = string;
```