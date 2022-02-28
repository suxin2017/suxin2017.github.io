---
title: hook原理
date: 2022-02-27 20:40:22
tags:
category:
  - post
---

```javascript preview open
let currentComponent;
let currentIndex;
const components = [];

class Component {
  __hooks = {
    _hookList: [],
    _effectHookList: [],
    _cleanEffectHookList: [],
    _layoutHookList: [],
  };
  diff() {}
  // 更新函数
  update() {
    this.render();
  }
  beforeRender() {
    currentIndex = 0;
    currentComponent = this;
  }
  afterRender() {
    this.__hooks._cleanEffectHookList.forEach((fn) => {
      fn();
    });
    this.__hooks._cleanEffectHookList = [];
    this.__hooks._effectHookList.forEach((fn) => {
      const clean = fn();
      if (typeof clean === "function") {
        this.__hooks._cleanEffectHookList.push(clean);
      }
    });
    this.__hooks._effectHookList = [];
  }

  afterDomRender() {
    this.__hooks._layoutHookList.forEach((fn) => {
      fn();
    });
    this.__hooks._layoutHookList = [];
  }
  render() {
    this.beforeRender();
    const [state, setState] = useState(0);

    useEffect(() => {
      console.log("useEffect mount");
      return () => {
        console.log("useEffect clear");
      };
    }, [state]);

    useLayoutEffect(() => {
      console.log("useLayout Render");
    }, []);

    this.afterRender();

    const dom = document.getElementById("app");
    let text;
    if (!(text = document.getElementById("text"))) {
      text = document.createElement("h1");
      text.id = "text";
      dom.appendChild(text);
    }
    let button;
    if (!(button = document.getElementById("button"))) {
      button = document.createElement("button");
      button.id = "button";
      button.textContent = "add";
      dom.appendChild(button);
    }
    let subButton;
    if (!(subButton = document.getElementById("button1"))) {
      subButton = document.createElement("button");
      subButton.id = "button1";
      subButton.textContent = "sub";
      dom.appendChild(subButton);
    }
    subButton.onclick = () => {
      setState(state - 1);
    };
    button.onclick = () => {
      setState(state + 1);
    };
    text.textContent = state;

    this.afterDomRender();
  }
}
new Component().render();

function getHookState(index) {
  const hooks = currentComponent.__hooks;

  // 加入的
  // []
  // [useState,useState,useState]...
  if (index >= hooks._hookList.length) {
    // 每种类型的hook的属性是不同的
    hooks._hookList.push({});
  }
  return hooks._hookList[index];
}

function useState(initState) {
  return useReducer((initState, action) => action, initState);
}

function useReducer(reducer, initState) {
  const hookState = getHookState(currentIndex++);
  // hook 是否初始化
  if (!hookState.__value) {
    hookState.__value = [
      // value
      initState,
      // dispatch
      (action) => {
        const nextValue = reducer(hookState.__value[0], action);
        hookState.__value[0] = nextValue;
                hookState._component.update()
      },
    ];
    if (!hookState._component) {
      hookState._component = currentComponent;
    }
  }

  return hookState.__value;
}
function useEffect(cb, deps) {
  const hookState = getHookState(currentIndex++);

  if (!hookState._value || isChange(deps, hookState.__value[1])) {
    hookState.__value = [];
    hookState.__value[0] = cb;
    hookState.__value[1] = deps;
    currentComponent.__hooks._effectHookList.push(hookState.__value[0]);
  }
}
function useLayoutEffect(cb, deps) {
  const hookState = getHookState(currentIndex++);

  if (!hookState._value || isChange(deps, hookState.__value[1])) {
    hookState.__value = [];
    hookState.__value[0] = cb;
    hookState.__value[1] = deps;
    currentComponent.__hooks._layoutHookList.push(hookState.__value[0]);
  }
}

function isChange(oldArgs, newArgs) {
  return (
    !oldArgs ||
    oldArgs.length !== newArgs.length ||
    newArgs.some((arg, index) => arg !== oldArgs[index])
  );
}
```

```html preview hook的使用，实现了useState，useReduce，useEffect
<div id="app"></div>
```
