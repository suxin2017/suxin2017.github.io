---
title: resume
date: 2020-11-16 13:42:55
type: "resume"
layout: "resume"
---

<div class="about-me" style="margin:24px 0px">
    <!-- <div class="about-me-avatar"> -->
        <!-- <img src="/imgs/avatar.jpeg" width=128 height=128 alt="头像" > -->
    <!-- </div> -->
    <div class="about-me-desc" style="margin:0">
        <div class="about-me-desc-name">
            <p>
                温鑫
            </p>
        </div>
        <div class="about-me-code-age">
            <p>
                年龄: <span id="age2"></span>
            </p>
            <script>
                const age2 = document.getElementById('age2');
                age2.textContent = Math.floor((Date.now() - new Date(1996, 0)) / (24 * 3600 * 1000 * 365))
            </script>
        </div>
        <div class="about-me-code-age">
            <p>
                学历: 本科
            </p>
        </div>
        <div class="about-me-code-age">
            <p>
                学校: 华北理工大学轻工学院
            </p>
        </div>
        <div class="about-me-code-age">
            <p>
                工龄: <span id="age1"></span>年
            </p>
            <script>
                const age1 = document.getElementById('age1');
                age1.textContent = Math.floor((Date.now() - new Date(2019, 0)) / (24 * 3600 * 1000 * 365))
            </script>
        </div>
        <div class="about-me-code-age">
            <p>
            </p>
        </div>
        <div class="about-me-code-age">
            <p>
                email: 1107178482@qq.com 
            </p>
        </div>
           <div class="about-me-code-age">
            <p>
                github: https://github.com/suxin2017
            </p>
        </div>
    </div>
</div>
<style>
    .resume-content {
        padding: 0 24px;
    }
    .company {
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        margin-right: 12px !important;
    }
    .tag {
        font-size: 10px;
        margin-left: 4px;
        display: inline-block;
        padding: 0px 4px;
        border-radius: 4px;
        border: 1px solid var(--shadowColor)
    }
    .tag-yellow {
        color: var(--yellow);
    }
    .tag-orange {
        color: var(--orange);
    }
    .tag-red {
        color: var(--red);
    }
    .tag-magenta {
        color: var(--magenta);
    }
    .tag-violet {
        color: var(--violet);
    }
    .tag-blue {
        color: var(--blue);
    }
    .tag-cyan {
        color: var(--cyan);
    }
    .tag-green {
        color: var(--green);
    }
    .time {
        font-size: 12px;
    }
    .container {
        position: relative;
        margin-left: 1em;
        margin-bottom: -14px;
        padding-top: 2px;
    }
    .container div {
        margin: 8px 0;
    }
    .container::after {
        content: '';
        position: absolute;
        background-color: var(--cyan);
        width: 6px;
        height: 6px;
        display: block;
        border-radius: 50%;
        left: -20px;
        top: 15px;
        bottom: 0;
        z-index: 1;
    }
    .container::before {
        content: '';
        position: absolute;
        background-color: var(--shadowColor);
        width: 2px;
        display: block;
        left: -18px;
        top: 0;
        bottom: 0;
    }
    .list {}
    .list .item .name {
        font-size: 14px;
        font-weight: 500;
    }
    .list .item .desc {
        font-size: 14px;
        margin: 14px;
        margin-left: 28px;
    }
    .list .item .desc::before {
        font-size: 14px;
        margin-left: -14px;
        margin-bottom: 8px;
        display: block;
        content: '项目描述：';
    }
    .list .item .me {
        font-size: 14px;
        margin: 14px;
        margin-left: 28px;
    }
    .list .item .me::before {
        font-size: 14px;
        margin-left: -14px;
        margin-bottom: 8px;
        content: '项目责任：';
        display: block;
    }
    .list .item .key {
        font-size: 14px;
        margin: 14px;
        margin-left: 28px;
    }
    .list .item .key::before {
        font-size: 14px;
        margin-left: -14px;
        margin-bottom: 8px;
        content: 'keyword：';
        display: block;
    }
    h3 {
        position: relative;
        margin-top: 32px;
    }
    h3::after {
        content: '';
        position: absolute;
        background-color: var(--cyan);
        width: 13px;
        height: 13px;
        display: block;
        border-radius: 50%;
        left: -20px;
        top: 4.5px;
        bottom: 0;
    }
    .private {
    }
    .private li {
        width: 327px;
        margin: 8px;
        font-size: 14px;
        cursor: pointer;
    }
    .evaluation {
        font-size: 14px;
    }
    @media only screen and (max-width: 768px) {
        .desc,
        .me,
        li {
            line-height: 2;
        }
        ul {
            padding: 0 12px;
        }
    }
</style>

<h3>
    技能
</h3>

<p>熟悉 React 开发框架. 掌握 vue 开发，了解React ssr</p>
<p>熟悉 antd 组件使用方法</p>
<p>熟悉 JS,CSS.网络请求方式,浏览器工作过程. 熟悉 umi-request、aixo 中间件和拦截器的使用</p>
<p>熟悉 Less css 编译库. 熟悉 echart 图形库的使用</p>
<p>熟练操作 git 进行规范提交,代码合并. 掌握 nginx 基础配置,掌握 linux 命令</p>
<p>掌握nodejs,及其后端框架，koa，egg有实际应用的经验</p>
<p>了解golang，rust，java等后端开发</p>

<h3>
    工作经历&项目经历
</h3>

<div class="container">
    <div class="info">
        <div class="time">2020.04 - 至今</div>
        <div class="company">快手 </div>
        <div class="tag">前端研发</div>
    </div>
    <div class="list">
        <div class="item">
            <div class="name">海外 dsp 投放平台
                <div class="tag">核心开发人员</div>
            </div>
            <div class="desc">进行广告投放计划组创意创建，广告预算维护，数据统计平台。</div>
            <div class="me">
                <ul>
                    <li>负责平台维护，文案提取平台，国际化工作</li>
                    <li>从0到1构建项目</li>
                    <li>完成页面布局搭建</li>
                    <li>文案提取： 通过eslint ast分析自动fix代码中未被国际化标签包裹的中文</li>
                    <li>文案替换： 通过eslint ast分析自动替换全部代码中中文到英文节省大量人力成本</li>
                </ul>
            </div>
            <div class="key">
                <span class="tag">React</span>
                <span class="tag">Redux</span>
                <span class="tag">React Query</span>
                <span class="tag">React Intl</span>
            </div>
        </div>
        <div class="item">
            <div class="name">jinx 前端部署平台
                <div class="tag">项目负责人</div>
                <div class="tag">核心开发人员</div>
            </div>
            <div class="desc">jinx 是一个多分支开发的前端部署服务，负责公司前端资源测试环境部署，服务代理，域名解析等功能。服务内部前端项目100+,跨3个部门使用</div>
            <div class="me">
                <ul>
                    <li>项目设计：完成整体架构设计、ui设计与实现</li>
                    <li>功能开发：接口代理、脚本注入、静态资源管理、域名规则解析功能开发</li>
                    <li>后期服务：日常客服，解决用户疑难问题。</li>
                </ul>
            </div>
            <div class="key">
                <span class="tag">Koa</span>
                <span class="tag">React</span>
                <span class="tag">Antd</span>
                <span class="tag">Sqlite</span>
                <span class="tag">Typeorm</span>
            </div>
        </div>
        <div class="item">
            <div class="name">魔力建站
                <div class="tag">核心开发人员</div>
            </div>
            <div class="desc">魔力建站是一个无代码的落地页搭建项目</div>
            <div class="me">
                <ul>
                    <li>
                        业务跟进：常规业务迭代，比如组件开发等业务需求。</li>
                    <li>
                        技术难点：编辑器部分功能开发比如参考线实现，字体压缩服务等功能
                    </li>
                    <li>
                        服务他方：封装快聊转跳sdk，供多个业务方使用
                    </li>
                </ul>
            </div>
            <div class="key">
                <span class="tag">React</span>
                <span class="tag">Redux</span>
                <span class="tag">Koa</span>
                <span class="tag">Wings</span>
            </div>
        </div>
        <div class="item">
            <div class="name">快手视频web端一期
                <div class="tag">核心开发人员</div>
            </div>
            <div class="desc">web 端的快手短视频</div>
            <div class="me">
                <ul>
                    <li>与主站同学一起完成从0到1的开发</li>
                </ul>
            </div>
            <div class="key">
                <span class="tag">graphql</span>
                <span class="tag">vue</span>
            </div>
        </div>
        <div class="item">
            <div class="name">bit 组件市场
                <div class="tag">核心开发人员</div>
                <div class="tag">项目负责人</div>
            </div>
            <div class="desc">解析bit组件存储规则，web端可视化组件api，文档服务，收录组件400+。</div>
            <div class="me">
                <ul>
                    <li>项目设计：整体页面设计，技术实现</li>
                    <li>探索源码：主动分析bit源码，发现bit版本存储的原理，并反解析，输出到组件市场</li>
                    <li>代码分析：介入jsdoc，tsdoc完成代码分析，自动输出api文档</li>
                    <li>周边生态：完成kbit封装，可在提交组件时，同步组件市场数据</li>
                </ul>
            </div>
            <div class="key">
                <span class="tag">egg</span>
                <span class="tag">typeorm</span>
                <span class="tag">mysql</span>
                <span class="tag">React</span>
            </div>
        </div>
    </div>
</div>

<div class="container">
    <div class="info">
        <div class="time">2019.06 - 2020.04</div>
        <div class="company">百分点信息有限公司 </div>
        <div class="tag">前端研发</div>
    </div>
    <div class="list">
        <div class="item">
            <div class="name">资产平台</div>
            <div class="desc">大数据能力平台是一个数据处理平台,包含数据接入,数据治理,数据开发,数据监控(接入,治理,开发,硬件
                资源的监控),权限管理,等功能</div>
            <div class="me">
                <ul>
                    <li>
                        完成新需求的页面开发,对老代码的 bug 进行修改.
                    </li>
                    <li>
                        报表页面开发,用 G6 开发组织结构图.
                    </li>
                    <li>
                        隔代升级老项目的 webpack 到新版,优化项目打包构建速度,构建速度从 40 多秒到
                        10 多秒.
                    </li>
                    <li>
                        通过使用 g6 库，开发自定义树状图.
                    </li>
                </ul>
            </div>
            <div class="key">
                <span class="tag">React</span>
                <span class="tag">echarts</span>
                <span class="tag">g6</span>
                <span class="tag">webpack</span>
            </div>
        </div>
    </div>
</div>

<h3>个人项目</h3>

<ul class="private">
    <li><a href="https://suxin2017.github.io/pixel-editor/">pixel-editor 像素风格建站</a></li>
    <li><a href="https://suxin2017.github.io/markdown-website/#/">马克在线 markdown 转富文本工具</a></li>
    <li><a href="https://github.com/suxin2017/code-playground">playground 在线编辑预览工具</a></li>
    <li><a href="https://suxin2017.github.io/bxer-ui/?path=/docs/%E4%BB%8B%E7%BB%8D--page">
            bxer ui 一套精简级组件库</a></li>
    <li><a href="https://github.com/suxin2017/css-tutorial">
           rust 写的css ast解析器</a></li>
    <li><a href="https://github.com/suxin2017/ng-m">
           golang 实现的ng配置管理平台</a></li>
</ul>

<h3>个人自评</h3>

<ul class="evaluation">
    <li>能够落地项目从0到1的建设。</li>
    <li>对技术充满好奇，对于新的技术接受能力较强，经常搞些小东西，享受技术带来的成就感</li>
    <li>具有良好的沟通能力，问题分析解决能力</li>
    <li>能够挖掘当前业务痛点，并做出实际行动改进</li>
</ul>
