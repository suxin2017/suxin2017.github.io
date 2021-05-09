---
title: koa动态中间件
date: 2021-05-09 18:19:54
tags:
category:
---

koa 动态加载删除中间件。

当我们建立一个具有插件机制的应用的时候需要动态管理中间件。

对于koa可以通过下面代码动态管理中间件。

```typescript
// pluginManages.ts
import Koa from 'koa'

export class PluginManags {

    static app: Koa<Koa.DefaultContext, Koa.DefaultState>;

    middlewareList: { name: string, middleware: Koa.Middleware }[];

    constructor(){
        this.middlewareList=[];
    }

    registMiddleware(name: string, middleware: Koa.Middleware) {
        this.middlewareList.push({
            name,
            middleware,
        })
        PluginManags.app.middleware.push(middleware);
    }

    removeMiddleware(name: string) {
        const middlewareIndex =  this.middlewareList.findIndex(middleware=>middleware.name === name);
        this.middlewareList.splice(middlewareIndex,1);
        PluginManags.app.middleware.splice(middlewareIndex,1);
    }
}

let pluginInstance:PluginManags;

export function getPluginManages(app:Koa<Koa.DefaultContext,Koa.DefaultState>){
    if(!pluginInstance){
        PluginManags.app = app;
        pluginInstance = new PluginManags();
    }
    return pluginInstance 
}
```

```typescript
// index.ts
import Koa from 'koa';
import { join } from 'path';
import { getPluginManages } from './pluginManage';

const port = 3001;
const app = new Koa();

const pluginManages = getPluginManages(app);

pluginManages.registMiddleware('hello',async (ctx,next)=>{
    ctx.body = 'Hello World';
    next()
})

pluginManages.registMiddleware('dyna',async (ctx,next)=>{
    ctx.body = '动态加载'
    next()
})

setTimeout(()=>{
    pluginManages.removeMiddleware('dyna')
},1000)

app.listen(port,()=>{
    console.log("http://127.0.0.1:"+port)
});
```
