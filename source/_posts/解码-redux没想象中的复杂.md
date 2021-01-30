---
title: "解码:redux没想象中的复杂"
date: 2021-01-30 11:31:41
tags:
  - js
  - redux
category:
  - 前端
---

## redux

redux 是一个函数式的数据流管理库，但是我一直都不了解其实现原理，之前一直用人家封装好的。

根据官网大致理解其运行方式是下图这样的。**通过 store dispatch 传入 action 然后经由 reducer 进行数据处理返回新的 state。**

![redux运行方式](/imgs/redux.png)

我觉得这像观察者模式，然后在内部绑定了一个数据。

## 验证

为了验证我的想法我翻看了 redux 的源码，精简之后他的代码大概是这样的.

```javascript
function createState(reducer, initState,)
  let currentState = initState;
  let currentReducer = reducer;
  let currentListeners = [];

  let isDispatching = false;
  function dispatch(action) {
    try {
      isDispatching = true;

      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    const listeners = currentListeners;
    listeners.forEach((listener) => {
      listener();
    });
  }
  function getCurrentState() {
    return currentState;
  }
  function subscribe(listener) {
    if (isDispatching) {
      console.log("正在触发事件不能添加新的监听器");
      return;
    }
    currentListeners.push(listener);
    let isSubscribed = true;
    return function unSubscribe() {
      if (!isSubscribed) {
        console.log("已经取消过了");
        return;
      }
      const index = currentListeners.indexOf(listener);
      currentListeners.splice(index, 1);
    };
  }

  dispatch({ type: "init" });

  return {
    getState: getCurrentState,
    subscribe,
    dispatch,
  };
}
```

首先创造一个观察者

```javascript
function createObserver() {
  let listeners = [];
  function dispatch(eventType, data) {
    listeners.forEach((listener) => {
      listener(eventType, data);
    });
  }
  function addEventListener(eventType, listener) {
    listeners.push(listener);
  }
  return {
    dispatch: dispatch,
    addEventListener,
  };
}

const observer = createObserver();

observer.addEventListener("add", (type, data) => {
  console.log(data);
});

observer.dispatch("add", 1);
```

通过创建一个可观察的对象，然后向对象发布事件，调用所有监听事件的方法。

这就是观察者模式，进一步改造，我们需要一个全局变量作为我们的 state;

那么在使用的时候需要做这件事。

```javascript
let state = 0;

const observer = createObserver();

observer.addEventListener("add", (type) => {
  state = state + 1;
});

observer.dispatch("add");
```

这样就完成了对 state 的操作，通常情况下，对数据的操作和使用数据通常不在一起。

为了代码更好的复用，需要提取数据操作的部分作为一个单独的内容，只操作数据。

并且我们把 state 放到到 createObserver 中，作为 observer 的成员。

```javascript
function createObserver() {
  // 全局唯一
  let state = 0;
  let operateDataFunc = [];

  // 发送事件
  function dispatch(eventType, data) {
    // 操作数据的方法
    state = operateDataFunc.reduce((data, operateFunc) => {
      return operateFunc(data, eventType);
    }, state);
    console.log(state);
  }

  // 添加操作数据的方法
  function addOperateFunc(eventType, listener) {
    operateDataFunc.push(listener);
  }

  function getState() {
    return state;
  }

  return {
    getState: getState,
    dispatch: dispatch,
    addOperateFunc: addOperateFunc,
  };
}

const observer = createObserver();

observer.addOperateFunc("add", (prevState) => {
  return prevState + 1;
});

observer.dispatch("add");
```

现在数据操作搞定了，接下来就是数据使用方了，需要对数据进行操作后通知所有的数据使用方，state 数据发生变动。

继续改造 dispatch 方法

```javascript
function createObserver() {
  let state = 0;
  let operateDataFunc = [];
  let users = [];

  // 发送事件
  function dispatch(eventType, data) {
    // 操作数据的方法
    state = operateDataFunc.reduce((data, operateFunc) => {
      return operateFunc(data, eventType);
    }, state);
    notifyUser();
  }

  // 添加操作数据的方法
  function addOperateFunc(eventType, listener) {
    operateDataFunc.push(listener);
  }

  // 通知使用数据的用户，数据改变了
  function notifyUser() {
    users.forEach((user) => user());
  }

  // 添加数据使用者
  function addUser(user) {
    users.push(user);
  }

  function getState() {
    return state;
  }

  return {
    getState: getState,
    dispatch: dispatch,
    addOperateFunc: addOperateFunc,
    addUser: addUser,
  };
}

const observer = createObserver();

observer.addUser(() => {
  console.log("数据发生变化", observer.getState());
});

observer.addOperateFunc("add", (prevState) => {
  return prevState + 1;
});

observer.dispatch("add");
```

ok 到这里 mini-redux 完成一大半了，检验一下

```javascript
function createObserver() {
  let state = 0;
  let operateDataFunc = {};
  let users = [];

  // 发送事件
  function dispatch(eventType, data) {
    // 操作数据的方法
    state = operateDataFunc[eventType].reduce((data, operateFunc) => {
      return operateFunc(data, eventType);
    }, state);
    notifyUser();
  }

  // 添加操作数据的方法
  function addOperateFunc(eventType, listener) {
    if (!operateDataFunc[eventType]) {
      operateDataFunc[eventType] = [];
    }
    operateDataFunc[eventType].push(listener);
  }

  // 通知使用数据的用户，数据改变了
  function notifyUser() {
    users.forEach((user) => user());
  }

  function addUser(user) {
    users.push(user);
  }

  function getState() {
    return state;
  }

  return {
    getState: getState,
    dispatch: dispatch,
    addOperateFunc: addOperateFunc,
    addUser: addUser,
  };
}

const observer = createObserver();

observer.addOperateFunc("add", (prevState) => {
  return prevState + 1;
});
observer.addOperateFunc("subtraction", (prevState) => {
  return prevState - 1;
});

let result = document.getElementById("result");
result.textContent = "result: " + observer.getState();

observer.addUser(() => {
  result.textContent = "result: " + observer.getState();
});

document.getElementById("add").onclick = () => {
  observer.dispatch("add");
};

document.getElementById("subtraction").onclick = () => {
  observer.dispatch("subtraction");
};
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="angelname" data-slug-hash="jOVOQMK" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="observer 模式">
  <span>See the Pen <a href="https://codepen.io/angelname/pen/jOVOQMK">
  observer 模式</a> by bxer (<a href="https://codepen.io/angelname">@angelname</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
  如果你看不到这个演示，说明当前网站不支持 codepen ，可以到 <a href="https://www.suxin.2017.cn">苏鑫的博客</a>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

现在完成了无副作用的 redux，函数相同的参数返回值一定是相同的，但是前段经常通过请求来获取数据。

假设我们对 result 的操作，加 1 或者减 1，来至于服务器。

```javascript
// mock server
function getOperate() {
  return new Promise((r) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        r("add");
      } else {
        r("subtraction");
      }
    }, 500);
  });
}
```

和同步代码一样，需要添加一个专门存放副作用函数的对象。
只需要发送给副作用事件的时候，把 dispatch 传给副作用的处理数据的函数就可以了。

最终结果

```javascript
function createObserver() {
  let state = 0;
  let operateDataFunc = {};
  let users = [];
  let effectOperateDataFunc = {};

  // 发送事件
  function dispatch(eventType, data) {
    // 操作数据的方法
    state = operateDataFunc[eventType].reduce((data, operateFunc) => {
      return operateFunc(data, eventType);
    }, state);
    notifyUser();
  }

  // 添加操作数据的方法
  function addOperateFunc(eventType, listener) {
    if (!operateDataFunc[eventType]) {
      operateDataFunc[eventType] = [];
    }
    operateDataFunc[eventType].push(listener);
  }

  // 添加存在副作用的函数
  function addEffectOperateFunc(eventType, listener) {
    if (!effectOperateDataFunc[eventType]) {
      effectOperateDataFunc[eventType] = [];
    }
    effectOperateDataFunc[eventType].push(listener);
  }

  // 发送给副作用函数的事件
  async function dispatchEffect(eventType, data) {
    for (const operateFunc of effectOperateDataFunc[eventType]) {
      await operateFunc(dispatch, state, data, eventType);
    }
  }

  // 通知使用数据的用户，数据改变了
  function notifyUser() {
    users.forEach((user) => user());
  }

  function addUser(user) {
    users.push(user);
  }

  function getState() {
    return state;
  }

  return {
    getState: getState,
    dispatch: dispatch,
    addOperateFunc: addOperateFunc,
    addUser: addUser,
    addEffectOperateFunc: addEffectOperateFunc,
    dispatchEffect: dispatchEffect,
  };
}

const observer = createObserver();

observer.addOperateFunc("add", (prevState) => {
  return prevState + 1;
});
observer.addOperateFunc("subtraction", (prevState) => {
  return prevState - 1;
});

observer.addEffectOperateFunc("getOpereate", (dispatch, prevState) => {
  return getOperate().then((operateType) => {
    dispatch(operateType);
  });
});

let result = document.getElementById("result");
result.textContent = "result: " + observer.getState();

observer.addUser(() => {
  result.textContent = "result: " + observer.getState();
});

document.getElementById("add").onclick = () => {
  observer.dispatchEffect("getOpereate");
};

function getOperate() {
  return new Promise((r) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        r("add");
      } else {
        r("subtraction");
      }
    }, 500);
  });
}
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="angelname" data-slug-hash="bGBGQvM" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="effect 模式">
  <span>See the Pen <a href="https://codepen.io/angelname/pen/bGBGQvM">
  effect 模式</a> by bxer (<a href="https://codepen.io/angelname">@angelname</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
   如果你看不到这个演示，说明当前网站不支持 codepen ，可以到 <a href="https://www.suxin.2017.cn">苏鑫的博客</a>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

这样就完成了一个玩具 redux 喽。

redux 源码中还有一个方式是和 Observables 的 ECMAScript 提案相关的。

可以有序的处理这种副作用函数的执行，有兴趣可以看看。

[observables-coming-to-ecmascript](https://ponyfoo.com/articles/observables-coming-to-ecmascript?utm_source=tuicool&utm_medium=referral)

顺便一提，关于函数式编程，函数式编程是一种思维方式，也许作为前端的你可能没研究过，但是你只要用上了 map，find，reduce，forEach，filter 其实你就已经用上了函数式编程，因为在语言方面就提供了这种 api，还有就是为什么函数式编程现在才流行，因为它慢。如果感兴趣可以留言，我看看要不要写一篇函数式编程的文章。

我是苏鑫，关注我，带你搞各种各样的小玩具哦。
