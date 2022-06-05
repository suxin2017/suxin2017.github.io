---
title: lua-lexer
date: 2022-05-28 19:56:22
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

```html preview
<style>
  .token {
    display: inline-block;
    padding: 4px;
    border: 1px solid var(--base00, transparent);
    margin: 2px;
    border-radius: 4px;
  }
</style>
<div>
  <textarea rows="20" style="width:100%" id="input" autofocus>
  '\u{1f481}'
  '\x61'
  '\97'
  'a'
  [[a]]

  1
  1.1
  1.1e-1
  1.1e+1
  .1
local abc = 123;
if(abc="123"){
  print(abc)
}
string='123'
-- abc
-- [[
comment
]]--
longString = [[too long]]
</textarea
  >
  <button id="generate">generate</button>
</div>
<div id="tag" style="width:100%;min-height:200px;font-size:14px;"></div>
<script>
  const input = document.getElementById("input");
  const g = document.getElementById("generate");
  const t = document.getElementById("tag");
  const lexerCom = () => {
    console.log("start..");
    t.innerHTML = "";
    let err = "";
    try {
      const lexer = new Lexer(input.value, "main.lua");
      let d = "";
      let token = lexer.nextToken();
      while (token[0] !== TOKEN_EOF) {
        d += gt(token);
        token = lexer.nextToken();
      }
      d += gt(token);
      t.innerHTML = d;
    } catch (e) {
      console.error(e);
      t.innerHTML = `<div style="color:red;font-size:14px;">${e.message}</div>`;
    }
  };
  g.onclick = lexerCom;
  lexerCom();
  function colorRandom() {
    const color = [
      "yellow",
      "orange",
      "red",
      "magenta",
      "violet",
      "blue",
      "cyan",
      "green",
    ];
    return color[Math.floor(Math.random() * color.length)];
  }
  function gt(token) {
    let [kind, tok, location] = token;
    let printStr = `[${kindToCategory(kind)}] ${tok}`;
    return `<div class="token" style="color:var(--${colorRandom()})" data-start=${
      location?.start.offset
    } data-end=${location?.end.offset}>${printStr}</div>`;
  }

  // This handler will be executed every time the cursor
  // is moved over a different list item
  t.addEventListener(
    "mouseover",
    function (event) {
      event.target.style.borderColor = "orange";
      let start = event.target.dataset["start"];
      let end = event.target.dataset["end"];
      setTimeout(() => {
        input.setAttribute("readonly", true);
        input.focus();
        input.setSelectionRange(start, end);
      }, 10);

      event.preventDefault();
    },
    false
  );
  t.addEventListener(
    "mouseout",
    function (event) {
      event.target.style.borderColor = "";

      input.removeAttribute("readonly");
    },
    false
  );
</script>
```
