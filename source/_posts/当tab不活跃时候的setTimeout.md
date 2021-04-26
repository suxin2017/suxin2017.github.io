---
title: 当tab不活跃时候怎样搞一个定时器
date: 2020-12-06 10:04:51
tags:
  - setTimeout
  - js
category:
  - 前端
---

> ps: 下面的脚本使用了 script module 请打开原文或者使用非 IE 浏览器浏览

<script  id="common">

</script>

## setTimeout 当 tab 不活跃时候

当 tab 不活跃的时候，setTimeout 和 setInterval 的运行时间出现延迟

当未被激活的 tabs 的 setInterval 的最小延迟>=1000ms.浏览器这样做的原因是为了省电.

点击下面按钮，网页的 document title 会数字相加，闪烁间隔为 500ms,当 tab 切换为其他 tab 的时候就会变慢

<button id="setTimeout" >开启定时器</button>

```html
<script type="module">
  let button = document.getElementById("setTimeout");
  let id;
  let count = 0;
  let flag = true;
  button.onclick = () => {
    if (flag) {
      button.innerText = "关闭定时器";
      id = setInterval(() => {
        document.title = `${count++} setInterval`;
      }, 500);
      flag = !flag;
    } else {
      button.innerText = "开启定时器";
      clearInterval(id);
      flag = !flag;
    }
  };
</script>
```

<script type="module">
    let button = document.getElementById("setTimeout");
    let id;
    let count = 0;
    let flag = true;
    button.onclick = ()=>{
        if(flag){
            button.innerText = "关闭定时器"
            id = setInterval(()=>{
                document.title = `${count++} setInterval`;
            },500);
            flag = !flag
        }else{
            button.innerText = "开启定时器"
            clearInterval(id);
            flag = !flag
        }
    }
</script>

## requrestAnimationFrameAPI 当 tab 不活跃时候

requrestAnimationFrameAPI 当 tab 不活跃时候，执行会被暂停
注意 requrestAnimationFrameAPI 只是能够满足 1 秒 60 帧，所以会和比 setTimeout 慢一些

<button id="requestAnimation">开启 requestAnimation 定时器</button>

```html
<script type="module">
  const timerList = {};

  function setRafTimeout(cb, time) {
    const timer = {
      id: -1,
      start: -1,
      cb,
    };
    const handleNextTick = (timestamp) => {
      if (timer.start === -1) {
        timer.start = timestamp;
      }
      const elapsed = timestamp - timer.start;
      if (!time || elapsed > time) {
        cb();
        clearRafTimeout(id);
      } else {
        timer.id = window.requestAnimationFrame(handleNextTick);
      }
    };
    const id = window.requestAnimationFrame(handleNextTick);
    timer.id = id;
    timerList[id] = timer;
    return id;
  }

  function clearRafTimeout(id) {
    const timer = timerList[id];
    if (timer) {
      window.cancelAnimationFrame(timer.id);
      delete timerList[id];
    }
  }
  let intervalList = {};
  function setRafInterval(cb, time) {
    let intervalId = setRafTimeout(function fn() {
      if (!intervalList[intervalId]) return;
      cb();
      clearRafTimeout(intervalList[intervalId]);
      intervalList[intervalId] = setRafTimeout(fn, time);
    }, time);
    intervalList[intervalId] = intervalId;
    return intervalId;
  }
  function clearRafInterval(id) {
    const timer = intervalList[id];
    if (timer) {
      window.cancelAnimationFrame(timer);
      delete intervalList[id];
      console.log(timer, id, intervalList);
    }
  }

  let requestButton = document.getElementById("requestAnimation");
  let requestId;
  let count = 0;
  let flag1 = true;
  requestButton.onclick = () => {
    if (flag1) {
      requestButton.innerText = "关闭requestAnimation定时器";
      requestId = setRafInterval(() => {
        document.title = `${count++} requestAnimation`;
      }, 1000);
      flag1 = !flag1;
    } else {
      requestButton.innerText = "开启requestAnimation定时器";
      clearRafInterval(requestId);
      flag1 = !flag1;
    }
  };
</script>
```

<script type="module">

const timerList = {};

function setRafTimeout(cb, time) {
    const timer = {
        id: -1,
        start: -1,
        cb,
    };
    const handleNextTick = (timestamp) => {
        if (timer.start === -1) {
            timer.start = timestamp;
        }
        const elapsed = timestamp - timer.start;
        if (!time || elapsed > time) {
            cb();
            clearRafTimeout(id);
        } else {
            timer.id = window.requestAnimationFrame(handleNextTick);
        }
    };
    const id = window.requestAnimationFrame(handleNextTick);
    timer.id = id;
    timerList[id] = timer;
    return id;
}

function clearRafTimeout(id ) {
    const timer = timerList[id];
    if (timer) {
        window.cancelAnimationFrame(timer.id);
        delete timerList[id];
    }
} 
let intervalList = {};
function setRafInterval(cb,time){
    let intervalId = setRafTimeout(function fn(){
        if(!intervalList[intervalId])return;
        cb();
        clearRafTimeout(intervalList[intervalId])
        intervalList[intervalId] = setRafTimeout(fn,time);
    },time)
    intervalList[intervalId] = intervalId;
    return intervalId;
}
function clearRafInterval(id){
    const timer = intervalList[id];
    if (timer) {
        window.cancelAnimationFrame(timer);
        delete intervalList[id];
        console.log(timer,id,intervalList)
    }
}

    let requestButton = document.getElementById("requestAnimation");
    let requestId;
    let count = 0;
    let flag1 = true;
    requestButton.onclick = ()=>{
        if(flag1){
            requestButton.innerText = "关闭requestAnimation定时器"
            requestId = setRafInterval(()=>{
                document.title = `${count++} requestAnimation`;
            },1000);
            flag1 = !flag1
        }else{
            requestButton.innerText = "开启requestAnimation定时器"
            clearRafInterval(requestId);
            flag1 = !flag1
        }
    }
</script>

## WebWorker

webworker 不会受浏览器切换 tab 影响，能够正常运行

<button id="webwork">开启 WebWorker 定时器</button>

```html
<script type="module">
  let blob = new Blob([
    `
    let timer;
    onmessage = ({data:flag})=>{
        console.log("收到message",flag)
        if(!flag){
            clearInterval(timer);
        }else{
           timer = setInterval(function() { postMessage(''); }, 500);
        }
    }
    `,
  ]);
  let url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  window.URL.revokeObjectURL(blob);
  let workerButton = document.getElementById("webwork");
  let requestId;
  let count = 0;
  let flag1 = true;
  worker.onmessage = () => {
    console.log(count, "123");

    document.title = `${count++} WebWorker`;
  };
  workerButton.onclick = () => {
    console.log(flag1);
    if (flag1) {
      workerButton.innerText = "关闭web work定时器";
    } else {
      workerButton.innerText = "开启web work定时器";
    }
    worker.postMessage(flag1);
    flag1 = !flag1;
  };
</script>
```

<script type="module">
    let blob = new Blob([`
    let timer;
    onmessage = ({data:flag})=>{
        console.log("收到message",flag)
        if(!flag){
            clearInterval(timer);
        }else{
           timer = setInterval(function() { postMessage(''); }, 500); 
        }
    }
    `]);
    let url = window.URL.createObjectURL(blob);
    var worker = new Worker(url);
    window.URL.revokeObjectURL(blob)
    let workerButton = document.getElementById("webwork");
    let requestId;
    let count = 0;
    let flag1 = true;
    worker.onmessage = ()=>{
    console.log(count,'123')

        document.title = `${count++} WebWorker`;
    }
    workerButton.onclick = ()=>{
        console.log(flag1)
        if(flag1){
            workerButton.innerText = "关闭web work定时器"
        }else{
            workerButton.innerText = "开启web work定时器"
        }
        worker.postMessage(flag1);
        flag1 = !flag1
    }
</script>
