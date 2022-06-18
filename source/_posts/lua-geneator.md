---
title: lua-geneator
date: 2022-06-18 11:43:57
tags:
category:
  - post
---

代码生成

### 定义关键字及符号映射

```javascript preview src=lua-lexer.js

```

```javascript preview src=lua-token.js

```

```javascript preview src=lua-parser.js

```

```javascript preview src=lua-gen-js.js

```

```javascript preview drawCode
function drawCode(code, dom, idx) {
  let str = `<textarea id="code-${idx}" class="code" rows=6 cols=80 readonly>${code}</textarea>`;
  dom.innerHTML = str;
}

window.drawCode = drawCode;
```

```javascript preview draw
function draw(code, ast, idx) {
  let e = document.getElementById(`draw-${idx}`);
  e.classList.add("box");
  let c = document.createElement("div");
  c.classList.add("code");
  e.appendChild(c);
  drawCode(code, c, idx);
}
window.draw = draw;
```

<pre>
// 生成的js代码
<div id="js-code"></div>
<div>
//eval 执行结果
</div>
<div id="js-eval"></div>
</pre>

<div>source code 👇👇👇</div>

```javascript preview
let idx = arguments[0];
let code = `
local name,age = "jack",18;
local jsCode = document.getElementById("js-eval");
jsCode.textContent = "hello world!!!, name is".." "..name.." age is "..age;
`;
let lexer = new Lexer(code);
let parser = new Parser(lexer);
let ast = parser.parse();
draw(code, ast, idx);
console.log(ast);
let jsCode = gen(ast);
document.getElementById("js-code").textContent = jsCode.split(";").join(";\n");
console.log(jsCode);

eval(jsCode);

```

```
