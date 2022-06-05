---
title: lua-parse
date: 2022-06-05 12:00:00
tags:
category:
  - post
---

动手写个词法解析器，词法解析非常简单其关键处理问题在于

- 字符串
- 数字
- 关键字与符号

### 定义关键字及符号映射

```javascript preview src=lua-lexer.js

```

```javascript preview src=lua-token.js

```

```javascript preview src=lua-parser.js

```

<style>
	.node{
		cursor:pointer;
	}
	
	li {
		list-style-type: none;
    position:relative;
	}
	.node::before {
		content: "\25B6";
		color: var(--color01);
		display: inline-block;
		margin-right: 6px;
		font-size: small;
    position: absolute;
    left: -16px;
	}
	.node[data-active='true']::before {
	transform: rotate(90deg);
	}
	[data-active='true']{
		display:block;
	}
	[data-active='true'] .mini{
		display:none;
	}
	[data-active='false'] ul{
		display:none;
	}
	[data-active='false'] .mini{
		display:inline;
	}
  .box{
    display:flex;
    max-height: 400px;
    overflow:auto;
  }
 
  
</style>

```javascript preview drawJson
function drawAttrs(attrs) {
  let attrStr = "<ul class='attrs'>";
  for (let { key, val } of attrs) {
    attrStr += `<li class='attr'>${key}:${val}</li>`;
  }
  return attrStr + "</ul>";
}
function drawNode(node) {
  let name = "";
  if (node?.constructor?.name) {
    name = node.constructor.name;
  }
  let startTag = "";
  let endName = "";
  if (name === "Object") {
    startTag = "{";
    endName = "}";
  }
  if (name === "Array") {
    startTag = "[";
    endName = "]";
  }
  let mini = "";
  if (endName !== "") {
    if (node._n) {
      name = `${node._n}:`;
    }
    mini = `<span class="mini"> ${Object.keys(node)} </span>`;
    endName = `<span>${endName}</span>`;
  }

  let keys = Object.keys(node);
  let attrs = [];
  let childrenToken = [];
  for (let key of keys) {
    if (typeof node[key] !== "object" || node[key] == null) {
      attrs.push({ key, val: node[key] });
    } else {
      Object.defineProperty(node[key], "_n", {
        enumerable: false,
        value: key,
      });
      childrenToken.push(node[key]);
    }
  }
  let attrStr = "";
  if (attrs.length) {
    attrStr = drawAttrs(attrs);
  }
  let childrenStr = "";
  if (childrenToken.length) {
    childrenStr = drawTree(childrenToken);
  }

  return `<li class='node' data-active="false">${name}${startTag}${attrStr}${childrenStr}${mini}${endName}</li>`;
}

function drawTree(nodes) {
  let children = [];
  for (let node of nodes) {
    children.push(drawNode(node));
  }
  return `<ul class="tree"  >${children.join("\n")}</ul>`;
}

function toggle(e) {
  if (e.dataset["active"] === "true") {
    e.dataset["active"] = false;
  } else {
    e.dataset["active"] = true;
  }
}
function drawJson(obj, dom, idx) {
  let str = drawTree([obj], true);
  dom.addEventListener(
    "click",
    (e) => {
      if (e.target.tagName === "LI") {
        toggle(e.target);
      }
    },
    false
  );
  dom.innerHTML = `<div>
  <button onclick="expandAll(${idx})">展开所有</button>
  <button onclick="foldAll(${idx})">折叠所有</button></div>
  ${str}`;
}
window.drawJson = drawJson;
```

```javascript preview
function drawCode(code, dom) {
  let str = `<textarea class="code" rows=6 cols=60 readonly>${code}</textarea>`;
  dom.innerHTML = str;
}
function expandAll(idx) {
  let nodes = document
    .getElementById(`draw-${idx}`)
    .querySelectorAll('[data-active="false"]');
  Array.from(nodes).forEach((node) => {
    node.dataset["active"] = true;
  });
}
function foldAll(idx) {
  let nodes = document
    .getElementById(`draw-${idx}`)
    .querySelectorAll('[data-active="true"]');
  Array.from(nodes).forEach((node) => {
    node.dataset["active"] = false;
  });
}
window.drawCode = drawCode;
window.expandAll = expandAll;
window.foldAll = foldAll;
```

```javascript preview
function draw(code, ast, idx) {
  let e = document.getElementById(`draw-${idx}`);
  e.classList.add("box");
  let c = document.createElement("div");
  let j = document.createElement("div");
  c.classList.add("code");
  j.classList.add("json");
  e.appendChild(c);
  e.appendChild(j);
  drawJson(ast, j, idx);
  drawCode(code, c, idx);
}
window.draw = draw;
```

```javascript preview
let idx = arguments[0];
let code = `
...
nil
true
false
123
1.123
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
draw(
  code,
  [
    parser.parseExp0(),
    parser.parseExp0(),
    parser.parseExp0(),
    parser.parseExp0(),
    parser.parseExp0(),
    parser.parseExp0(),
  ],
  idx
);
```

```javascript preview
let idx = arguments[0];
let code = `
function () end
function (...) end
function (a,b,c) end
function (d,e,...) end
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
draw(
  code,
  [
    parser.parseExp0(),
    parser.parseExp0(),
    parser.parseExp0(),
    parser.parseExp0(),
  ],
  idx
);
```

```javascript preview
let idx = arguments[0];
let code = `
{}
{["a"]=123}
{["a"]=123,["b"]=456,c=123}
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
parser.a();
draw(code, [parser.parseExp0(), parser.parseExp0(), parser.parseExp0()], idx);
```

```javascript preview
let idx = arguments[0];
let code = `

a.b
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
draw(code, [parser.parseExp0()], idx);
```

```javascript preview
let idx = arguments[0];
let code = `
1 or 2 or 3
1 ^ 2 ^ 3
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
draw(code, [parser.parseExp(), parser.parseExp()], idx);
```
