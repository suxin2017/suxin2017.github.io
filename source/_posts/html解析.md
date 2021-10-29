---
title: html解析
date: 2021-10-23 20:01:52
tags: 
category: 
- post
---
```javascript preview open
var string = `
<div >
	fff ddd
	<span style="123 fff"
	data-size=12 data-width='20px' >123</span>
	<br style="fff" />
	ddd
</div>
`;
var offset = 0;
// <div> or </div> or <div > 
function getTagName(str) {
    var start = offset;
    var reg = /[a-zA-Z]/;
    while (reg.test(str[offset]) && offset < str.length) {
        offset++;
    }
    return str.substring(start, offset);
}
function parse(str) {
    var stack = [{
            tagName: 'root',
            children: []
        }];
    var root;
    while (offset < str.length) {
        switch (str[offset]) {
            case '<':
                offset++;
                if (str[offset] === '/') {
                    var node = stack.pop();
                    if (stack.length === 0) {
                        root = node;
                    }
                    offset++;
                    var tagName = getTagName(str);
                    if (tagName !== (node === null || node === void 0 ? void 0 : node.tagName)) {
                        console.error(tagName + "\u4E0D\u5339\u914D");
                    }
                    else {
                        while (str[offset] !== '>') {
                            offset++;
                        }
                        node.end = offset;
                    }
                }
                else {
                    var node = {
                        start: offset
                    };
                    var tagName = getTagName(str);
                    node.tagName = tagName;
                    if (stack[stack.length - 1]) {
                        if (!stack[stack.length - 1].children) {
                            stack[stack.length - 1].children = [];
                        }
                        stack[stack.length - 1].children.push(node);
                    }
                    while (str[offset] !== '/' && str[offset] !== '>') {
                        if (!node.attrSource) {
                            node.attrSource = '';
                        }
                        node.attrSource += str[offset];
                        offset++;
                    }
                    node.attr = parseAttribute(node.attrSource);
                    node.end = offset;
                    stack.push(node);
                }
                break;
            case '>':
                if (str[offset - 1] === '/') {
                    var node = stack.pop();
                    if (stack.length === 0) {
                        root = node;
                    }
                    node.end = offset;
                }
                break;
            default:
                if (stack.length > 0) {
                    stack.push({
                        tagName: 'text',
                        value: ''
                    });
                    var start = offset;
                    while (!/[<>]/.test(str[offset]) && offset < str.length) {
                        offset++;
                    }
                    var textNode = stack.pop();
                    textNode.value = str.substring(start, offset);
                    if (!stack[stack.length - 1].children) {
                        stack[stack.length - 1].children = [];
                    }
                    stack[stack.length - 1].children.push(textNode);
                    offset--;
                }
        }
        offset++;
    }
    console.log(stack);
}
// parseAttribute(' style= "123 1ff" data-v = 123')
function parseAttribute(str) {
    var index = 0;
    var open = false;
    var qOpen = false;
    var stack = [];
    while (index < (str === null || str === void 0 ? void 0 : str.length)) {
        var currentCode = str[index];
        if (!/\s/.test(currentCode)) {
            if (!open) {
                var start = index;
                while (currentCode !== '=' && index < str.length) {
                    index++;
                    currentCode = str[index];
                }
                var key = str.substring(start, index);
                stack.push({
                    key: key,
                    value: ''
                });
                open = true;
            }
            else {
                var start = index;
                if (/["']/.test(currentCode)) {
                    qOpen = true;
                    index++;
                    currentCode = str[index];
                }
                if (qOpen) {
                    while (!/["']/.test(currentCode) && index < str.length) {
                        index++;
                        currentCode = str[index];
                    }
                    qOpen = false;
                }
                else {
                    // number
                    while (!/\s/.test(currentCode) && index < str.length) {
                        index++;
                        currentCode = str[index];
                    }
                }
                var node = stack[stack.length - 1];
                node.value = str.substring(start, index);
                open = false;
            }
        }
        index++;
    }
    // console.log(stack)
    return stack;
}
parse(string);

```