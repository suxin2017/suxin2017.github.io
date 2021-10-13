---
title: github工作流到github page
date: 2020-12-12 20:38:56
tags:
  - github
  - ci
category:
  - 运维
  - 文章
---

> 大家应该都知道 github 是一个白嫖党的福利地，加上它的 GitHub Pages 简直是前端白嫖的圣地

## 使用方法

在项目根目录创建

.github/workflows/node.js.ynl

把下面的内容粘贴进入就可以快速构建部署到 GitHub Pages

## 献上小弟的一份白嫖 workflow 文件

```yaml
name: Node.js CI

on:
  ## 触发时机
  push:
    ## 分支，git新建项目新的项目默认是main，老得是master
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x]

    steps:
      ## 切换分支
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      ## 执行脚本
      - run: npm install
      - run: npm run build

      - name: GitHub Pages
        uses: crazy-max/ghaction-github-pages@v2.1.1
        with:
          ## 构建生成的目录
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
