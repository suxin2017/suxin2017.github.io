---
title: lua-token
date: 2022-06-02 10:09:28
tags:
category:
  - post
---

一个变成语言基本分为 4 部分，入口，块，语句，表达式

其中入口便是程序开始部分

约定 :: 代表定义， {} 代表 0 次或者多次, [] 代表 0 - 1 次

人类自己制造的编程语言，不同于自然语言，相对简单的多，基本就是一个有穷状态机。

```ebnf
gammer ::= block
block ::= {stat} [retStat]
// 返回
retStat ::= return [expList] [';']

// 语句，一共有 15 种，语句只能执行，不能求值，比如 if
stat ::= ';'
	| varList '=' expList
	| functionCall
	| label
	| break
	| goto Name
	| do block end
	| while exp do block end
	| repeat block until exp
	| if exp then block {elseif exp then block} [else block] end
	| for Name '=' exp ',' exp [',',exp] do block end
	| function funcName funcBody
	| local function Name funcBody
	| local nameList ['=' expList]

// 表达式只能求值不能执行，比如 123  1 + 2
expList ::= exp {',' exp}
exp ::= nil | false | true | Numeral | LiteralString | '...' | functionDef ｜ prefixExp
	| tableConstructor | exp binOp exp | unOp exp

// ps: 函数调用既可以是表达式也是语句
// hello() obg[key()] 这种都是合法的,前者属于语句，后者属于表达式
```

针对语句进行拆分
语句部分 ast 结构

```ebnf
// 拆分一下
emptyStat ::= ';'
breakStat ::= break
labelStat ::= '::' Name '::'
gotoStat ::= goto Name
doStat ::= do block end
funcCallStat ::= FuncCallExp
whileStat  ::= while exp do block end
repeatStat ::= repeat block until exp
// ifStat 可以将else 简化
ifStat ::= if exp then block {elseif exp then block} [else block] end
// ifStat ::= if exp then block {elseif exp then block} [elseif true then block] end
// ifStat ::= if exp then block {elseif exp then block} end

forNumStat ::= for Name '=' exp ',' exp [',',exp] do block end
forInStat ::= for nameList in expList do block end
localVarDeclStat ::= local nameList '=' expList
assignStat ::= varList '=' expList
// 是 assignStat 的语法糖，所以返回结构和 也是AssignStat.
// TODO: 没准我可以美化下
funcDefStat ::= function funcName funcBody
localFuncDefStat ::= local function Name funcBody

// util
nameList ::= Name {',' Name}
expList ::= exp {',' exp}
varList ::= var {',' var}
var ::= Name | prefixExp '[' exp ']' | prefixExp '.' Name
funcName ::= Name {'.' Name} [':' Name]
funcBody ::= '(' [parList] ')' block end
parList ::= nameList [',' '...'] | '...'

// 最终
tat ::= emptyStat
	| assignStat
	| funcCallStat
	| labelStat
	| breakStat
	| gotoStat
	| doStat
	| whileStat
	| repeatStat
	| ifStat
	| forNumStat
	| forInStat
	| funcDefStat
	| localFuncDefStat
	| localVarDeclStat
```

表达式部分精简

```ebnf
nilExp ::= nil
falseExp ::= false
trueExp ::= true
varArgExp ::= '...'
integerExp ::= Numeral
floatExp ::= Numeral
stringExp ::= LiteralString
nameExp ::= Name
concatExp ::= exp '...' exp
tableConstructorExp ::= '{' [fieldList] '}'
funcDefExp ::= function funcBody

// 原始版本
prefixExp ::= var | functionCall | '(' exp ')'
// 赋值语句等号左侧、名字表达式、表访问表达式、记录访问表达式
var ::= Name | prefixExp '[' exp ']' | prefixExp '.' Name
functionCall ::= prefixExp args | prefixExp ':' Name args

// 精简版
prefixExp ::= Name | parentExp | tableAccessExp | prefixExp '.' Name | functionCallExp

parentExp ::= '(' exp ')'
tableAccessExp ::= prefixExp '[' exo ']'
functionCallExp ::= prefixExp [':' Name] args

// util
Name ::= /^[_\d\w]+/


LiteralString ::= /(^'(\\\\|\\'|\\\n|\\z\s*|[^'\n])*')|(^"(\\\\|\\"|\\\n|\\z\s*|[^"\n])*")/;

Numeral ::= /^0[xX][0-9a-fA-F]*(\.[0-9a-fA-F]*)?([pP][+\-]?[0-9]+)?|^[0-9]*(\.[0-9]*)?([eE][+\-]?[0-9]+)?/;

fieldList ::= field {fieldSep field} [fieldSep]
field ::= '[' exp ']' '=' exp | Name '=' exp | exp
fieldSep ::= ',' | ';'


args ::= '{' [expList] '}' | tableConstructorExp | LiteralString

// 通过优先级解决歧义问题
exp ::= exp12
exp12 ::= epx11 {or exp11}
exp11 ::= exp10 {and exp10}
exp10 ::= exp9 {('<' | '>' | '<=' | '>=' | '~=' | '==') exp9}
exp9 ::= exp8 {'|' exp8}
exp8 ::= exp7 {'~' exp7}
exp7 ::= exp6 {'&' exp6}
exp6 ::= exp5 {('<<' | '>>') exp5}
exp5 ::= exp4 {'..' exp4}
exp4 ::= exp3 {('+' | '-') exp3}
exp3 ::= exp2 {( '*' | '/' | '//' | '&') exp2}
exp2 ::= {('not' | '#' | '-' | '~')} exp1
exp1 ::= exp0 ('^' exp2)
exp0 ::= nil | false | true | Numeral | LiteralString | '...' | funcDefExp ｜ prefixExp
	| tableConstructorExp

```

[LiteralString](https://regexper.com/#%2F%28%5E'%28%5C%5C%5C%5C%7C%5C%5C'%7C%5C%5C%5Cn%7C%5C%5Cz%5Cs*%7C%5B%5E'%5Cn%5D%29*'%29%7C%28%5E%22%28%5C%5C%5C%5C%7C%5C%5C%22%7C%5C%5C%5Cn%7C%5C%5Cz%5Cs*%7C%5B%5E%22%5Cn%5D%29*%22%29%2F)
LiteralString ::= /(^'(\\\\|\\'|\\\n|\\z\s*|[^'\n])*')|(^"(\\\\|\\"|\\\n|\\z\s*|[^"\n])*")/;

[Numeral](https://regexper.com/#%2F%5E0%5BxX%5D%5B0-9a-fA-F%5D*%28%5C.%5B0-9a-fA-F%5D*%29%3F%28%5BpP%5D%5B%2B%5C-%5D%3F%5B0-9%5D%2B%29%3F%7C%5E%5B0-9%5D*%28%5C.%5B0-9%5D*%29%3F%28%5BeE%5D%5B%2B%5C-%5D%3F%5B0-9%5D%2B%29%3F%2F)
Numeral ::= /^0[xX][0-9a-fa-f]_(\.[0-9a-fA-F]_)?([pP][+\-]?[0-9]+)?|^[0-9]_(\.[0-9]_)?([eE][+\-]?[0-9]+)?/;)


```javascript preview src=lua-token.js

```