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
    flex-wrap:wrap;
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
function drawNode(node,idx) {
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
    mini = `<span class="mini"> ${Object.keys(node)} </span>`;
    endName = `<span>${endName}</span>`;
  }
  if (node._n) {
    name = `${node._n}:${name}`;
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
    childrenStr = drawTree(childrenToken,idx);
  }
  const printLocation = (node) => {
    if (node instanceof Node) {
      return `onclick="selectCode(event,${idx})" data-start=${node.location?.start?.offset} data-end=${node.location?.end?.offset}`;
    }
  };

  return `<li class='node' data-active="false"   ${printLocation(
    node
  )}>${name}${startTag}${attrStr}${childrenStr}${mini}${endName}</li>`;
}

function drawTree(nodes,idx) {
  let children = [];
  for (let node of nodes) {
    children.push(drawNode(node,idx));
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
  let str = drawTree([obj], idx);
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
function drawCode(code, dom, idx) {
  let str = `<textarea id="code-${idx}" class="code" rows=6 cols=60 readonly>${code}</textarea>`;
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
function selectCode(event,idx) {
  let start = event.target.dataset["start"];
  let end = event.target.dataset["end"];
  let input = document.getElementById(`code-${idx}`);
  input.focus();
  input.setSelectionRange(start, end);
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
window.selectCode = selectCode;
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
function ()  end
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

```javascript preview
let idx = arguments[0];
let code = `
-- 注释
;
break
::label::
goto preLabel
while 1 do end
repeat until 1
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
draw(
  code,
  [
    parser.parseState(),
    parser.parseState(),
    parser.parseState(),
    parser.parseState(),
    parser.parseState(),
    parser.parseState(),
  ],
  idx
);
```

```javascript preview
let idx = arguments[0];
let code = `
if true then end
if true then  elseif true then end
if true then  elseif true then  else  end
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
draw(
  code,
  [parser.parseState(), parser.parseState(), parser.parseState()],
  idx
);
```

```javascript preview
let idx = arguments[0];
let code = `
for i=10,1 do end
for i=10,1,2 do end
for i,v in "a" do end
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
draw(
  code,
  [parser.parseState(), parser.parseState(), parser.parseState()],
  idx
);
```

```javascript preview
let idx = arguments[0];
let code = `
local a = 123
local a,b=1,2
local a
local function f() end
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
draw(
  code,
  [
    parser.parseState(),
    parser.parseState(),
    parser.parseState(),
    parser.parseState(),
  ],
  idx
);
```

```javascript preview
let idx = arguments[0];
let code = `
name[1]
name.name1
name:name1(1)(2)(3)
("name")[1]
("name").name1
("name"):name(1)
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
draw(
  code,
  [
    parser.parseExp(),
    parser.parseExp(),
    parser.parseExp(),
    parser.parseExp(),
    parser.parseExp(),
    parser.parseExp(),
  ],
  idx
);
```

```javascript preview
let idx = arguments[0];
let code = `
;
break
::label::
goto label
do print('hello') end
while true do print('hello') end
repeat print('hello') until false
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
let ast =  parser.parse();
console.log(ast)
draw(code,ast, idx);
```

```javascript preview
let idx = arguments[0];
let code = `
local function f() end
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
let ast =  parser.parse();
console.log(ast)
draw(code,ast, idx);
```
