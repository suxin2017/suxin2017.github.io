---
title: pm2介绍
date: 2020-11-20 13:10:24
tags:
  - node
category:
  - 运维
---

pm2 是基于 node 的进程管理工具，利于 pm2 可以很方便的管理启动进程，比如性能监控，自动重启等功能。

## 安装

```
$ npm install pm2@latest -g
# or
$ yarn global add pm2
```

## 启动一个 app

启动的方式极其简单。

```
$ pm2 start app.js
```

pm2 作为一个进程管理器，自然而然可以启动其他进程的任务了。

```
$ pm2 start bashscript.sh
$ pm2 start python-app.py --watch
$ pm2 start binary-file -- --port 1520
```

start 的时候有一些可选参数

```
# 指定应用名，可以通过id或者应用名的方式操作应用
--name <app_name>

# 当文件改变的时候重启应用
--watch

# 设置内存阈值重载应用
--max-memory-restart <200MB>

# 指定日志文件
--log <log_path>

# 传入额外的参数给脚本
-- arg1 arg2 arg3

# 自动重启间隔
--restart-delay <delay in ms>

# 时间日志前缀
--time

# 不自动重启应用
--no-autorestart


```

## 管理进程

```sh
$ pm2 restart app_name
$ pm2 reload app_name
$ pm2 stop app_name
$ pm2 delete app_name
```

app_name 也可以传 id 或者 all 执行所有

reload 和 restart 的区别在于

- reload 实现 0 秒停机重载进程
- 如果 reload 失败，会执行 restart

## 列出当下所有应用

```
$ pm2 [list|ls|status]
```

## 显示实时日志

```
$ pm2 logs
```

## 终端仪表盘

```
$ pm2 monit
```

## web 界面

```
$ pm2 plus
```

这个界面有问题启动不起来，网上说可能和 node 版本有关系。

## 实战案例

以一个 nuxt 的 ssr 项目为例

```
// 构建项目
$ yarn bulid
// 启动服务
$ pm2 start "yarn start" --name website

```

![image](http://note.youdao.com/yws/public/resource/e9abbc73fe552f6c95c9f7360d656f66/EE22D1780C054A9B86E3ABBE959C38EB?ynotemdtimestamp=1605849324442)

可以看到我们的应用启动起来了。

查看日志

![image](http://note.youdao.com/yws/public/resource/e9abbc73fe552f6c95c9f7360d656f66/1056ACDDB8C74B45A20825FE582A281C?ynotemdtimestamp=1605849324442)

查看实时监控

### 通过配置文件启动

```
$ pm2 ecosystem
```

我们修改一下配置文件,具体配置参数在这里[配置参数](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#attributes-available)

```
module.exports = {
  apps : [{
    name:"website"
    script: 'yarn start',
    watch: '.',
    out_file: 'log.info'
  }
  ],
};
```

#### 启动服务

```
$ pm2 delete website
$ pm2 start ecosystem.config.js
```

这里需要删除原有的应用，从新启动一下。
![预览](3.png)

### 总结

通过 pm2 我们可以更好的对应用进行管理，更直观的看到应用的资源监控，而且还有自动重启，批量启动等功能还有集群的功能因时间有限就不过多介绍了，居家部署必备良品。
