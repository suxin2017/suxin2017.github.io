var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}
const hljs = require("highlight.js");
const javascript = require("highlight.js/lib/languages/javascript");
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
const typescript = require("highlight.js/lib/languages/typescript");
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
const css = require("highlight.js/lib/languages/css");
hljs.registerLanguage("css", css);
const xml = require("highlight.js/lib/languages/xml");
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("ebnf", function ebnf(hljs) {
  const commentMode = hljs.COMMENT(/\(\*/, /\*\)/);
  const commentLineMode = hljs.COMMENT(/\/\//, /[\r\n]/);
  const nonTerminalMode = {
    className: "attribute",
    begin: /^[ ]*[a-zA-Z0-9]+([\s_-]+[a-zA-Z]+)*/,
  };

  const specialSequenceMode = {
    className: "meta",
    begin: /\?.*\?/,
  };

  const ruleBodyMode = {
    begin: /::=/,
    beginScope: "operator",
    end: /[\r\n]/,
    scope: "body",
    contains: [
      commentMode,
      specialSequenceMode,

      {
        scope: "string",
        begin: /['"]/,
        end: /['"]/,
      },
      {
        scope: "string",
        begin: /\//,
        end: /\//,
      },
      {
        scope: "built_in",
        begin: /[\[\]\{\}\|]/,
      },
    ],
  };

  return {
    name: "Extended Backus-Naur Form",
    illegal: /\S/,
    contains: [
      commentLineMode,
      commentMode,
      nonTerminalMode,
      ruleBodyMode,
      {
        begin: [/^\s+/, /\|/],
        beginScope: { 2: "built_in" },
        end: /[\r\n]/,
        scope: "body",
        contains: [
          commentMode,
          specialSequenceMode,

          {
            scope: "string",
            begin: /['"]/,
            end: /['"]/,
          },
          {
            scope: "string",
            begin: /\//,
            end: /\//,
          },
          {
            scope: "built_in",
            begin: /[\[\]\{\}\|]/,
          },
        ],
      },
    ],
  };
});

const url_for = require("hexo-util").url_for.bind(hexo);
const imgSize = require("markdown-it-imsize");
hexo.extend.filter.register("markdown-it:renderer", function (md) {
  const { config } = this; // Optional, parse user
  md.use(imgSize);
  md.use(function (md) {
    const oldCodeRule = md.renderer.rules.fence;
    md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
      const token = tokens[idx];
      const code = token.content;
      const placeholder =
        token.info.split(" ")[2] !== "open" ? token.info.split(" ")[2] : "";
      if (token.info.indexOf('mermaid') !== -1) {
        return `<pre class="mermaid">${code}</pre>`
      }
      const defaultOpen = token.info.split(" ")[2] === "open";
      const hasPreview = token.info.indexOf("preview") !== -1;
      const lang = token.info.split(" ")[0] || "";
      let codeHighlight = "";
      if (lang) {
        try {
          codeHighlight = `<pre><code class="hljs">${hljs.highlight(lang, code).value
            }</code></pre>`;
        } catch (e) {
          codeHighlight = `<pre><code class="hljs">${hljs.highlightAuto(code).value
            }</code></pre>`;
        }
      } else {
        codeHighlight = `<pre><code class="hljs">${hljs.highlightAuto(code).value
          }</code></pre>`;
      }
      if (!hasPreview) {
        return codeHighlight;
      }
      const jsPreview =
        token.info.indexOf("js") !== -1 ||
        token.info.indexOf("javascript") !== -1;
      let demo = "暂不支持该语言预览";

      if (jsPreview) {
        if (token.info.indexOf("src=") !== -1) {
          demo = `<script src="/js/${token.info.match(/src=(.*)/)?.[1]}">
${code}</script>`;
        } else {
          demo = `<script type="module">
                    (function(){
                        ${code}
                    })(${idx})
                </script>`;
        }
      }
      const htmlPreview = token.info.indexOf("html") !== -1;
      if (htmlPreview) {
        demo = code;
      }
      return `<div id="preview-${idx}" class="preview">
<div class="preview-box">    
<div id="draw-${idx}">
    ${placeholder ? placeholder : ""}${demo}
    </div>
    <div class="preview-box-util">
        <span id="expand-${idx}" class="preview-box-util-code" style="background-image:url(${url_for(
        "/imgs/code.svg"
      )})"></span>
    </div>
</div>
<div id="code-${idx}" class="preview-code ${defaultOpen && "preview-code-active"
        }">
${codeHighlight}
</div>
<script>
    const expandCode_${idx} = document.getElementById('expand-${idx}');
    const bindCode_${idx} = document.getElementById('code-${idx}');
    let flag_${idx} = ${defaultOpen ? "false" : "true"};
    expandCode_${idx}.onclick = function (){
        if(flag_${idx}){
            bindCode_${idx}.classList.add('preview-code-active')
        }else{
            bindCode_${idx}.classList.remove('preview-code-active') 
        }
        flag_${idx} = !flag_${idx}
    }
</script>
</div>`;
    };
  });
});

const backtickCodeBlock = require("hexo/lib/plugins/filter/before_post_render/backtick_code_block.js");
hexo.extend.filter.unregister("before_post_render", backtickCodeBlock);
