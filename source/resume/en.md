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
                Name: 温鑫
            </p>
        </div>
        <div class="about-me-code-age">
            <p>
                Age: <span id="age2"></span>
            </p>
            <script>
                const age2 = document.getElementById('age2');
                age2.textContent = Math.floor((Date.now() - new Date(1996, 0)) / (24 * 3600 * 1000 * 365))
            </script>
        </div>
        <div class="about-me-code-age">
            <p>
Educational qualifications: Graduates
            </p>
        </div>
        <div class="about-me-code-age">
            <p>
                School: 华北理工大学轻工学院
            </p>
        </div>
        <div class="about-me-code-age">
            <p>
                Work Experience: <span id="age1"></span>years
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
        content: 'Project description：';
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
        content: 'Project Responsibilities：';
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

<h3>Skills</h3> <p>Proficient in the React development framework</p> <p>Experienced with Ant Design component usage</p> <p>Familiar with JavaScript, CSS, network request methods, and browser working mechanisms</p> <p>Skilled in using the Less CSS preprocessor and ECharts visualization library</p> <p>Proficient in using Git for standard commits and code merges; experienced with basic Nginx configuration and Linux commands</p> <p>Experienced with Node.js and its backend frameworks, particularly Koa, with hands-on application experience</p> <p>Knowledgeable in backend development with Go, Rust, and Java; have practical project experience with Java and Node.js</p> <h3>Work Experience & Projects</h3> <div class="container"> <div class="info"> <div class="time">April 2020 - Present</div> <div class="company">Kuaishou</div> <div class="tag">Frontend Developer</div> </div> <div class="list"> <div><b>Business Support</b></div> <div class="item"> <div class="name">Overseas DSP Advertising Platform <div class="tag">Lead Developer</div> </div> <div class="desc">The advertising platform is the main revenue source for overseas commercialization. It serves as the entry point for advertisers to launch campaigns, build ads, and analyze performance reports. It supports audience targeting, audience package management, and ad material library maintenance.</div> <div class="me"> <ul> <li>Built the platform from scratch, designed field linkage schemes in creative editing processes.</li> <li>Responsible for platform maintenance, supporting all platform modules including promotion lists, creative processes, data reports, audience packages, ad assets, and operation logs.</li> <li>Handled talent recruitment and junior talent development.</li> </ul> </div> <div class="key"> <span class="tag">React</span> <span class="tag">Redux</span> <span class="tag">React Query</span> <span class="tag">React Intl</span> </div>
        <div class="name">Overseas Website Builder
            <div class="tag">Lead Developer</div>
        </div>
        <div class="desc">Developed the first dynamic website builder for overseas advertisers, providing landing pages with 300% better performance (FMP) compared to their own. Increased landing page reach rate by 30%.</div>
        <div class="me">
            <ul>
                <li>Built the platform from the ground up, designing a no-code architecture that ensured scalability through layered design and interface constraints.</li>
                <li>Optimized landing page performance and stability.</li>
                <li>Supported complex requirements like material expansion and template building.</li>
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
        <div class="name">Magic Website Builder
            <div class="tag">Core Developer</div>
        </div>
        <div class="desc">Magic Website Builder is a no-code project for creating landing pages for advertisers.</div>
        <div class="me">
            <ul>
                <li>Supported business development through regular iterations.</li>
                <li>Developed complex editor functionalities such as guide line implementation and font compression services.</li>
            </ul>
        </div>
        <div class="key">
            <span class="tag">React</span>
            <span class="tag">Redux</span>
            <span class="tag">Koa</span>
        </div>
    </div>
    <div><b>Technical Efficiency</b></div>
    <div class="item">
        <div class="name">Jinx Frontend Deployment Platform
            <div class="tag">Lead Developer</div>
        </div>
        <div class="desc">Jinx is a multi-branch frontend deployment service responsible for deploying frontend resources in the testing environment, service proxies, and domain name resolution. It supports 617 internal frontend projects, over 20,000 extended branches, with a total of 250,000+ deployments, serving 600+ users across 3 departments.</div>
        <div class="me">
            <ul>
                <li>Designed the entire architecture and implemented the UI.</li>
                <li>Developed key features like interface proxy, script injection, static resource management, and domain rule resolution.</li>
                <li>Provided ongoing user support, resolving user issues and inquiries.</li>
            </ul>
        </div>
        <div class="key">
            <span class="tag">Koa</span>
            <span class="tag">React</span>
            <span class="tag">Antd</span>
            <span class="tag">MySQL</span>
            <span class="tag">TypeORM</span>
        </div>
    </div>
    <div class="item">
        <div class="name">Frontend API Generation Solution
            <div class="tag">Lead Developer</div>
        </div>
        <div class="desc">Generated Axios and React Query code by parsing the Swagger protocol to reduce frontend workload and detect backend protocol changes during development.</div>
    </div>
    <div class="item">
        <div class="name">Multilingual Platform
            <div class="tag">Lead Developer</div>
        </div>
        <div class="desc">Provided a multilingual solution for overseas commercialization, reducing manual verification costs by maintaining documentation through a platform and using CLI tools for document comparison and retrieval.</div>
    </div>
</div>
</div> <h3>Personal Projects</h3> <ul class="private"> <li><a href="https://github.com/suxin2017/css-tutorial">CSS AST Parser written in Rust</a></li> <li><a href="https://github.com/suxin2017/ng-m">NG configuration management platform implemented in Go</a></li> <li><a href="https://github.com/biomejs/biome">Contributor to Biome, earned a $400 reward in the Prettier challenge</a></li> </ul> <h3>Self-Evaluation</h3> <ul class="evaluation"> <li>Capable of designing architectures that meet current and future business needs through thorough business analysis.</li> <li>Highly curious about new technologies and quick to adapt, enjoying the sense of achievement brought by technical solutions.</li> <li>Strong communication skills and problem-solving abilities.</li> <li>Proactive in identifying and addressing business inefficiencies and making tangible improvements.</li> </ul>