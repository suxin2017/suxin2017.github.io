var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
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
const hljs = require('highlight.js')
const url_for = require('hexo-util').url_for.bind(hexo)
const imgSize = require('markdown-it-imsize');
hexo.extend.filter.register('markdown-it:renderer', function (md) {
    const { config } = this; // Optional, parse user 
    md.use(imgSize)
    md.use(function (md) {
        const oldCodeRule = md.renderer.rules.fence;
        md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
            const token = tokens[idx];
            const code = token.content
            const placeholder = token.info.split(' ')[2] !== 'open' ?  token.info.split(' ')[2] : '' ;
            const defaultOpen = token.info.split(' ')[2] === 'open';
            const hasPreview = token.info.indexOf('preview') !== -1;
            const lang = token.info.split(' ')[0] || '';
            const codeHighlight = `<pre><code class="hljs">${hljs.highlight(lang,code).value}</code></pre>`
            if (!hasPreview) {
                return codeHighlight;
            }
            const jsPreview = token.info.indexOf('js') !== -1 || token.info.indexOf('javascript') !== -1;
            let demo = '暂不支持该语言预览'
            if (jsPreview) {
                demo = `<script type="module">
    (function(){
        ${code}
    })(${idx})
</script>`
            }
            const htmlPreview = token.info.indexOf('html') !== -1;
            if (htmlPreview) {
                demo = code
            }
            return `<div id="preview-${idx}" class="preview">
<div class="preview-box">    
    ${placeholder ? placeholder : ''}${demo}
    <div class="preview-box-util">
        <span id="expand-${idx}" class="preview-box-util-code" style="background-image:url(${url_for('/imgs/code.svg')})"></span>
    </div>
</div>
<div id="code-${idx}" class="preview-code ${defaultOpen && 'preview-code-active'}">
${codeHighlight}
</div>
<script>
    const expandCode_${idx} = document.getElementById('expand-${idx}');
    const bindCode_${idx} = document.getElementById('code-${idx}');
    let flag_${idx} = ${defaultOpen ? 'false':'true'};
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
        }
    })
});

const backtickCodeBlock = require('hexo/lib/plugins/filter/before_post_render/backtick_code_block.js')
hexo.extend.filter.unregister('before_post_render', backtickCodeBlock);

