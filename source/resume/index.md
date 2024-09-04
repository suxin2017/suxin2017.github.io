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

<p>熟悉 React 开发框架</p>
<p>熟悉 antd 组件使用方法</p>
<p>熟悉 JS,CSS.网络请求方式,浏览器工作过程.</p>
<p>熟悉 Less css 编译库. 熟悉 echart 图形库的使用</p>
<p>熟练操作 git 进行规范提交,代码合并. 掌握 nginx 基础配置,掌握 linux 命令</p>
<p>掌握nodejs及其后端框架，koa 有实际应用的经验</p>
<p>了解golang，rust，java等后端开发,对Java 与 NodeJs 有实际落地项目</p>

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
    <div> <b>业务支持</b></div>
        <div class="item">
            <div class="name">海外 dsp 投放平台
                <div class="tag">主要负责人</div>
            </div>
            <div class="desc">广告投放平台是海外商业化主要收入平台，是广告主进行广告投放入口，其主要负责广告搭建，效果报表分析广告效果，提供人群定向等人群包，人群圈等能力，维护广告物料库等能力</div>
            <div class="me">
                <ul>
                    <li>从0到1完成平台建设，设计创编流程字段联动方案。</li>
                    <li>负责日常平台维护，支撑全平台模块，推广列表，创编流程，数据报表，人群包，广告资产，操作记录等业务需求</li>
                    <li>负责人才面试与初级人才培养</li>
                </ul>
            </div>
            <div class="key">
                <span class="tag">React</span>
                <span class="tag">Redux</span>
                <span class="tag">React Query</span>
                <span class="tag">React Intl</span>
            </div>
             <div class="name">海外建站
                <div class="tag">主要负责人</div>
            </div>
            <div class="desc">海外首个动态化搭建平台，为广告主提供动态化建站能力，提供比广告主自身落地页300%上（fmp）性能提升的落地页，极大提高落地页触达率30%</div>
            <div class="me">
                <ul>
                    <li>从0到1完成平台建设，设计整体无代码架构方案，通过分层设计，接口约束，支撑平台拓展性，满足丰富物料带来的平台压力</li>
                    <li>做好落地页防裂化与性能优化建设</li>
                    <li>支撑物料拓展，模板搭建等复杂需求</li>
                </ul>
            </div>
            <div class="key">
                <span class="tag">React Native</span>
                <span class="tag">Redux</span>
                <span class="tag">React Query</span>
                <span class="tag">React Intl</span>
            </div>
        </div>
          <div class="item">
            <div class="name">魔力建站
                <div class="tag">核心开发人员</div>
            </div>
            <div class="desc">魔力建站是一个无代码的落地页搭建项目,为广告主搭建落地页</div>
            <div class="me">
                <ul>
                    <li>常规业务迭代，支撑业务开发</li>
                    <li>实现编辑器部分功能复杂也如逻辑比如参考线实现，字体压缩服务等功能</li>
                </ul>
            </div>
            <div class="key">
                <span class="tag">React</span>
                <span class="tag">Redux</span>
                <span class="tag">Koa</span>
            </div>
         </div>
         <div> <b>技术提效</b></div>
        <div class="item">
            <div class="name">jinx 前端部署平台
                <div class="tag">主要负责人与开发</div>
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
                <span class="tag">mysql</span>
                <span class="tag">Typeorm</span>
            </div>
        </div>
         <div class="item">
            <div class="name">前端接口生成方案
                <div class="tag">主要负责人与开发</div>
            </div>
            <div class="desc">通过解析swagger协议生成axios与react query代码，达到节约前端工作量，与开发时感知后端协议变更目的</div>
        </div>
         <div class="item">
            <div class="name">多语言平台
                <div class="tag">主要负责人与开发</div>
            </div>
            <div class="desc">为海外商业化提供多语言解决方案，通过平台维护文案，通过命令行工具进行文案对比与拉取，减少人工校验成本</div>
        </div>
    </div>
</div>


<h3>个人项目</h3>

<ul class="private">
    <li><a href="https://github.com/suxin2017/css-tutorial">
           rust 写的css ast解析器</a></li>
    <li><a href="https://github.com/suxin2017/ng-m">
           golang 实现的ng配置管理平台</a></li>
    <li><a href="https://github.com/biomejs/biome">
           biome的贡献者，在prettier挑战赛中获得400奖励</a></li>  
</ul>

<h3>个人自评</h3>

<ul class="evaluation">
    <li>通过业务分析，能够做好架构设计，满足当下与未来业务诉求。</li>
    <li>对技术充满好奇，对于新的技术接受能力较强，享受技术带来的成就感</li>
    <li>具有良好的沟通能力，问题分析解决能力</li>
    <li>能够挖掘当前业务/效率痛点，并做出实际行动改进</li>
</ul>
