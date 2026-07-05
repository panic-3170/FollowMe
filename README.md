# 陵下书生 · 独立开发者博客（FollowMe）

> 一个面向中文开发者的**独立开发者技术博客**与个人主页：深耕 Python/ Golang / Flutter / TypeScript / Nuxt.js / Flutter 实战教程与 **AI 编程（Cursor / Claude Code）实战**，分享独立产品出海、远程开发与团队协作、期货趋势跟踪与移动止损策略、程序员副业变现与个人成长方法论。

[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-3.21-00DC82?logo=nuxtdotjs&logoColor=white)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-222222?logo=githubpages&logoColor=white)](https://pages.github.com/)

**在线访问**：[https://apppss.com](https://apppss.com) ·
**RSS**：[https://apppss.com/rss.xml](https://apppss.com/rss.xml) ·
**Sitemap**：[https://apppss.com/sitemap.xml](https://apppss.com/sitemap.xml) ·
**llms.txt**：[https://apppss.com/llms.txt](https://apppss.com/llms.txt)

---

## 目录

- [项目简介](#项目简介)
- [核心特性](#核心特性)
- [技术栈](#技术栈)
- [精选项目](#精选项目)
- [写作专栏（全部文章）](#写作专栏全部文章)
- [项目结构](#项目结构)
- [本地开发](#本地开发)
- [部署与 CI/CD](#部署与-cicd)
- [发布与 Google 索引推送](#发布与-google-索引推送)
- [SEO 优化](#seo-优化)
- [作者](#作者)
- [联系与订阅](#联系与订阅)
- [许可证](#许可证)

---

## 项目简介

**FollowMe** 是独立开发者 **陵下书生** 的个人技术博客与作品集站点，专注于"用代码创造有价值的数字产品"。站点采用 **Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS** 构建，**纯静态生成（SSG）** 后通过 **GitHub Pages + 自定义域名 `apppss.com`** 上线，无需服务器即可承载全文检索、RSS、Sitemap、llms.txt、Schema.org 结构化数据等一整套现代博客能力。

站点内容覆盖五大方向：

| 方向 | 关键词 |
| --- | --- |
| 前端 / 移动端技术 | Vue 3 组合式 API、TypeScript 类型体操、React Native 性能优化、Flutter 跨平台 |
| 独立开发与产品 | 独立开发者、创业心得、副业变现、出海、个人成长、产品设计 |
| 工具 / 教程 | Git 工作流、Telegram 86 号码找回、海外 VPS 的 CDN 加速与网站防探测 |
| 交易 / 投资 | 期货交易、趋势跟踪、移动止损、看大做小、RSI 临界点入场 |
| AI 编程 | Cursor、Claude Code、GitHub Copilot、Prompt 工程、AI Agent、代码评审自动化、Vibe Coding |

适合正在学习 Vue 3 / TypeScript / React Native / Flutter 的前端与移动端工程师、希望转型的在职程序员、对独立产品出海感兴趣的创业者、研究期货趋势跟踪的交易者，以及探索 AI 编程提效的全栈开发者阅读与收藏。

---

## 核心特性

- 🚀 **Nuxt 3 静态站点生成** — `nuxt generate` 一键产出纯静态 HTML，托管在 GitHub Pages 零成本运行
- 🎨 **Tailwind CSS 4 + 现代极简 UI** — 响应式设计，桌面 / 平板 / 手机三端一致体验
- 🔍 **完整 SEO 套件** — 自动生成 `sitemap.xml` / `rss.xml` / `robots.txt` / `llms.txt`，每个页面独立的 meta、OG、Twitter Card、JSON-LD 结构化数据
- 📝 **Markdown 内容管理** — 文章存放在 `content/articles/`，支持 frontmatter 元数据自动解析
- ⚡ **预渲染所有路由** — `nitro.prerender.crawlLinks: true` 自动发现并预渲染所有内链
- 🤖 **LLM 友好** — 内置 `llms.txt`（遵循 [llmstxt.org](https://llmstxt.org/) 规范），便于 ChatGPT、Claude 等 AI 抓取与引用
- 🐙 **GitHub Actions 自动化部署** — push 到 `main` 分支即触发构建与发布
- 🌓 **暗色模式 / 中英双语** — UI 自适应系统主题
- 🧠 **AI 编程加持** — 文章与项目从构思到实现，全流程借助 Cursor / Claude Code 提效
- 📡 **RSS / Sitemap / JSON-LD** — 三件套齐备，搜索引擎与订阅器全兼容

---

## 技术栈

| 层级 | 选型 | 版本 |
| --- | --- | --- |
| 框架 | [Nuxt](https://nuxt.com/) | ^3.21.7 |
| 视图层 | [Vue](https://vuejs.org/) | ^3.5.13 |
| 类型系统 | [TypeScript](https://www.typescriptlang.org/) | ^5.8.2 |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) | ^4.1.12 |
| Markdown 解析 | [marked](https://github.com/markedjs/marked) | ^18.0.4 |
| 图标 | [lucide-vue-next](https://lucide.dev/) | ^0.379.0 |
| 存储抽象 | [unstorage](https://github.com/unjs/unstorage) | ^1.17.5 |
| AI 编程助手 | [Cursor](https://www.cursor.com/) / [Claude Code](https://www.anthropic.com/) | — |
| 构建工具 | Vite（Nuxt 内置） | — |
| 部署 | GitHub Pages（`NITRO_PRESET=github_pages`） | — |
| CI/CD | GitHub Actions（Node 24） | — |

---

## 精选项目

> 数据源：[`data/projects.ts`](data/projects.ts)。每个项目都有专属详情页 `/projects/:id/`。

### 📅 TimeCalendar · 时光日历

- **简介**：移动端时间管理应用，主打时间规划、事件记录、AI 复盘
- **技术栈**：Flutter · GetX · Dart · sqflite · fl_chart · sticky_headers · **AI 对话复盘**
- **状态**：已上线 v1.0
- **用户量**：1K+ 用户
- **核心功能**：一年时间轴可视化、AI 对话自动生成复盘报告、任务优先级与分类标签、离线模式
- **源码**：[github.com/panic-3170/date](https://github.com/panic-3170/date)

### 📡 趋势雷达 · TrendRadar

- **简介**：面向自媒体人与求职者的全网趋势信息聚合导航页
- **技术栈**：Nuxt.js 3 · Vue 3 · Tailwind CSS · GitHub Pages · 51.la · Google Analytics
- **状态**：已上线
- **访问量**：公开访问
- **核心功能**：7 大分类聚合 30+ 精选站点、智能搜索、一键收藏、深色模式、中英双语、响应式
- **在线**：[apppss.com](https://www.apppss.com) ·
  **源码**：[github.com/panic-3170/TrendRadar](https://github.com/panic-3170/TrendRadar)

### 📲 WiFi 传输助手 · webflow

- **简介**：局域网 P2P 文件传输 / 即时通讯工具，**无需联网，扫码即连**
- **技术栈**：Flutter 3.x · Dart 3.7+ · GetX 4.6 · dart:io HttpServer · WebSocket · shelf · mobile_scanner · qr_flutter · qrcode.js
- **状态**：开发中 v1.0（内部测试）
- **核心功能**：零依赖传输、二维码扫码连接、32 字符 Token 鉴权（30 分钟自动失效）、WebSocket 实时通信、Material Design 3、深色模式、跨 6 平台
- **源码**：[github.com/panic-3170/wifi-transfer-assistant](https://github.com/panic-3170/wifi-transfer-assistant)

---

## 写作专栏（全部文章）

> 数据源：[`content/articles/`](content/articles) 下的 Markdown 文件（frontmatter 驱动）。按发布日期倒序。

### 工具教程

- **[86 手机号无法登录 Telegram 终极解决方案：绕过付费验证码 + 旧设备验证找回账号](content/articles/telegram-86-login-recovery.md)** · 2026-06-14 · 8 分钟
  > 86 号码 + 邮箱 + 二次验证密码 = 找回账号的三要素。用第三方客户端 Telega 走"邮箱 + 2FA 密码"通道直接登录，绕开短信付费和旧设备验证，亲测可行。
  > 标签：`Telegram` · `86手机号` · `账号找回` · `二次验证` · `短信收费`

- **[海外 VPS 的 CDN 加速与网站防探测架构（Cloudflare + nginx 反代 + WebSocket 后端完整方案）](content/articles/cdn-anti-scan-vps-architecture.md)** · 2026-06-18 · 10 分钟
  > VPS 真实 IP 一旦暴露，端口扫描器会持续探测并识别服务指纹。用 Cloudflare CDN 隐藏真实 IP，业务服务跑在 127.0.0.1 永不对外暴露，nginx 反代让扫描器看到的是普通博客。附完整 Node.js WebSocket 后端、systemd 服务管理、防指纹识别的 nginx 配置。
  > 标签：`Cloudflare` · `nginx` · `WebSocket` · `反向代理` · `CDN 加速` · `网站防探测` · `VPS 安全`

### 交易心得

- **[期货「看大做小」趋势交易法：从前辈点拨到实操悟道的完整路径（日线 + 30分钟 + RSI 临界点入场）](content/articles/kan-da-zuo-xiao-futures-trading.md)** · 2026-06-14 · 9 分钟
  > 多周期共振趋势交易法：日线定方向 → 30 分钟找结构 → 5 分钟等 RSI 临界点入场，止损 / 止盈 / 仓位管理的完整实操路径。
  > 标签：`期货交易` · `看大做小` · `多周期共振` · `趋势交易` · `日线` · `30分钟` · `5分钟` · `RSI指标` · `入场点` · `顺势交易`

- **[期货交易的七条铁律：从亏损到稳定盈利的思考](content/articles/futures-trading-seven-rules.md)** · 2026-03-20 · 5 分钟
  > 等待信号、严格止损、顺应趋势、移动止损、深入一个品种、调整好心态 — 真金白银换来的七条心得，期货交易本质上不是预测行情，而是管理自己。
  > 标签：`期货交易` · `交易心得` · `交易思维` · `止损` · `趋势跟踪` · `心法`

### 创业人生

- **[从零到一：我的独立开发之路](content/articles/indie-developer-journey.md)** · 2026-05-15 · 8 分钟
  > 2023 年从大厂辞职转型独立开发者的真实历程：第一款产品 TaskFlow 的诞生、Product Hunt 推广、用户从 0 到 1 万+ 的突破，以及五条核心经验总结。
  > 标签：`独立开发` · `创业` · `个人成长`

### 技术教程

- **[Vue 3 Composition API 完全指南](content/articles/vue3-composition-api.md)** · 2026-04-28 · 12 分钟
  > 深入理解 Vue 3 Composition API 的核心概念：ref / reactive / computed / watch / watchEffect，组合式函数复用逻辑，最佳实践与 TypeScript 类型支持。
  > 标签：`Vue` · `JavaScript` · `前端`

- **[React Native 性能优化实战](content/articles/react-native-performance.md)** · 2026-04-15 · 10 分钟
  > 列表渲染优化（FlatList + React.memo）、FastImage 图片加载、内存泄漏排查、定时器与异步清理、帧率监控 — 真实项目里踩过的坑。
  > 标签：`React Native` · `性能` · `移动端`

- **[TypeScript 实用技巧](content/articles/typescript-tips.md)** · 2026-02-25 · 7 分钟
  > 类型守卫与类型断言、泛型 / 条件类型 / 映射类型进阶、Partial / Pick / Omit 工具类型实战，写出更类型安全、更优雅的代码。
  > 标签：`TypeScript` · `前端` · `编程技巧`

### 开发工具

- **[Git 工作流最佳实践](content/articles/git-workflow-best-practices.md)** · 2026-03-10 · 5 分钟
  > Git Flow vs Trunk Based Development 分支策略、约定式提交规范（feat / fix / docs / style / refactor / test / chore）、PR 审查流程与审查要点。
  > 标签：`Git` · `团队协作` · `版本控制`

### AI 编程（筹备中）

> 🚧 AI 编程专栏筹备中，即将更新 Cursor / Claude Code 实战、Prompt 工程、AI Agent 工作流、代码评审自动化等系列内容。

- **Cursor + Claude Code 双引擎实战** · 筹备中
  > 用 Cursor 做行内补全与 Composer，用 Claude Code 跑 Agent 任务（修 Bug、写测试、批量重构），从需求拆解到 PR 提交的全流程提效经验。
  > 标签：`AI 编程` · `Cursor` · `Claude Code` · `AI Agent` · `效率工具`

- **Vibe Coding 与 AI 代码评审** · 筹备中
  > 用自然语言驱动 AI 写代码，再用 AI 帮自己 review、找 bug、写测试，覆盖 Vue 3 / TypeScript / Flutter 实战场景。
  > 标签：`AI 编程` · `Vibe Coding` · `代码评审` · `测试自动化`

- **独立开发者的 AI 全链路提效清单** · 筹备中
  > 从产品设计、UI 出图、文案撰写到客服回复，独立开发全链路的 AI 工具栈与 Prompt 模板。
  > 标签：`AI 编程` · `独立开发` · `Prompt 工程` · `副业变现`

> 💡 **小贴士**：每篇文章在博客详情页 `https://apppss.com/writing/{id}/` 都有完整正文、目录、阅读时长与相关标签。也可以通过 RSS（`/rss.xml`）或 llms.txt（`/llms.txt`）订阅。

---

## 项目结构

```text
FollowMe/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 自动部署工作流
├── assets/
│   └── css/main.css            # 全局样式
├── components/                 # Vue 组件
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   └── Breadcrumb.vue
├── blogseo/                    # SEO 工具脚本(Google Indexing API 推送)
│   ├── push.js                 # 增量推送脚本(自动从 sitemap 拉取)
│   ├── state.json              # 推送状态(URL → lastmod 映射,自动生成)
│   └── service-account.json    # Google Service Account 凭证(请勿提交)
├── composables/
│   └── usePageSeo.ts           # 统一 SEO meta + JSON-LD 注入
├── content/
│   ├── TEMPLATE.md             # 新文章 frontmatter 模板
│   └── articles/               # 所有 Markdown 文章
├── data/
│   ├── articles.ts             # 文章列表数据源
│   └── projects.ts             # 项目列表数据源
├── layouts/
│   └── default.vue
├── pages/                      # 路由
│   ├── index.vue               # 首页
│   ├── about.vue               # 关于我
│   ├── writing/
│   │   ├── index.vue           # 文章列表
│   │   └── [id].vue            # 文章详情
│   ├── projects/
│   │   └── [id].vue            # 项目详情
│   └── [...slug].vue           # 兜底动态路由
├── public/
│   ├── CNAME                   # 自定义域名 apppss.com
│   └── robots.txt
├── server/
│   ├── api/                    # 服务端 API（构建期生成）
│   └── routes/                 # sitemap.xml / rss.xml / llms.txt
├── nuxt.config.ts              # Nuxt 配置（SEO meta、prerender 等）
├── package.json
└── tsconfig.json
```

---

## 本地开发

**环境要求**：Node.js ≥ 24、pnpm（或 npm / yarn）。

```bash
# 1. 克隆仓库
git clone https://github.com/panic-3170/FollowMe.git
cd FollowMe

# 2. 安装依赖
npm install
# 或 pnpm install

# 3. 启动开发服务器（默认 http://localhost:3000）
npm run dev

# 4. 构建生产版本（静态站点输出到 .output/public）
npm run build

# 5. 预渲染生成全站静态文件
npm run generate

# 6. 本地预览生成结果
npm run preview
```

新增文章：在 [`content/articles/`](content/articles) 下新建 Markdown，参考 [`TEMPLATE.md`](content/TEMPLATE.md) 的 frontmatter 格式（`id` / `title` / `date` / `category` / `readTime` / `tags`），保存后 `npm run dev` 即热更新。

新增项目：编辑 [`data/projects.ts`](data/projects.ts) 追加对象，重启 dev server 即可。

> 🤖 **AI 编程提示**：本仓库鼓励使用 Cursor / Claude Code 辅助开发，新文章与新项目都可让 AI 先生成初稿，再人工 review 合并。

---

## 部署与 CI/CD

部署由 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 全自动完成：

1. **触发条件**：push 到 `main` 分支 或 手动 `workflow_dispatch`
2. **构建环境**：ubuntu-latest · Node.js 24
3. **构建步骤**：
   - `npm ci` 安装依赖
   - `npm run generate` + `NITRO_PRESET=github_pages` 生成静态站点到 `.output/public`
4. **发布**：通过 `actions/upload-pages-artifact@v5` + `actions/deploy-pages@v4` 发布到 GitHub Pages
5. **域名**：`public/CNAME` 配置自定义域名为 [`apppss.com`](https://apppss.com)

> 📌 仓库默认是 GitHub Pages **project page**（仓库名 `FollowMe`），通过 `public/CNAME` 升级为 **custom domain + apex**（即 `https://apppss.com`，不出现 `/FollowMe/` 前缀）。

---

## 发布与 Google 索引推送

> 一篇新文章从本地 Markdown 到被 Google 收录的完整链路：**写文 → 重新生成站点 → sitemap 自动同步 → 增量推送到 Google Indexing API**。

### 1. 写新文章

在 [`content/articles/`](content/articles) 下新建 Markdown,按照 [`content/TEMPLATE.md`](content/TEMPLATE.md) 的 frontmatter 格式(`id` / `title` / `date` / `category` / `readTime` / `tags` / `modifiedAt`) 填写,正文按 H2/H3 分级即可。

> 📌 **`modifiedAt` 是增量推送的关键字段** — 当你修改老文章时,记得把 `modifiedAt` 更新为当天的 ISO 日期,后续推送脚本会自动识别为"修改过",再次强推给 Google。

### 2. 重新生成站点(sitemap 自动同步)

```bash
# 本地预览
npm run dev          # http://localhost:3000

# 生成静态站点(自动产出最新 sitemap.xml)
npm run generate
```

sitemap 由 [`server/routes/sitemap.xml.ts`](server/routes/sitemap.xml.ts) 在构建时根据 `content/articles/*.md` 动态生成,无需手动维护。新增 / 删除 / 修改文章后,只要重新 `generate` 一次,sitemap 就会刷新。

部署后线上地址:

- Sitemap: <https://apppss.com/sitemap.xml>
- RSS: <https://apppss.com/rss.xml>
- llms.txt: <https://apppss.com/llms.txt>

### 3. 推送到 Google Indexing API

`blogseo/push.js` 是一键推送脚本,核心特性:

- ✅ **自动从 sitemap 拉取 URL** — 不再手写 URL 数组
- ✅ **增量推送** — 用 sitemap 中的 `<lastmod>` 与本地 `state.json` 比对,只推送"新增"或"修改过"的 URL
- ✅ **每条成功立即落盘** — 中途崩溃也不会重提已成功的 URL
- ✅ **零配额浪费** — 200 次/天的 publish 配额全部留给真正变更的页面

#### 前置准备

1. 在 [Google Cloud Console](https://console.cloud.google.com/) 创建项目,启用 **Indexing API**
2. 创建 Service Account 并下载 JSON 凭证,放到 [`blogseo/service-account.json`](blogseo/service-account.json)(**注意不要提交到 Git**)
3. 在 [Search Console](https://search.google.com/search-console) 将该 Service Account 邮箱添加为站点所有者

#### 常用命令

```bash
# 1) 默认增量推送(线上 sitemap,只推 /writing/ 文章)
node blogseo/push.js

# 2) 推本地预览(先 npm run dev 启动)
node blogseo/push.js http://localhost:3000/sitemap.xml

# 3) 强制全量重推(忽略本地状态,例如想重新激活一批老文章)
node blogseo/push.js --force

# 4) 不只推文章,把首页 / about 等静态页也一起推
node blogseo/push.js --all

# 5) 组合使用:本地预览 + 强制全量
node blogseo/push.js http://localhost:3000/sitemap.xml --force --all
```

#### 输出示例

```text
正在使用 Google 官方原生机制解析凭证: .../blogseo/service-account.json
🌐 正在拉取 Sitemap: https://apppss.com/sitemap.xml
📋 从 Sitemap 解析到 12 个待评估 URL(仅文章)
🆕 待推送: 2 个 | ⏭️  已跳过(未变更): 10 个
✅ Google Auth 官方原生认证成功!加急通道已开启。
正在向 Google 骨干网提交: https://apppss.com/writing/xxx/ (lastmod=2026-07-05) ...
🚀 成功强推! 状态码: 200, 消息: OK
📊 Google 登记详情: notifyTime=2026-07-05T...
🏁 全部的特快加急工单已成功递交至 Google Indexer 核心队列!
```

#### 状态文件

`blogseo/state.json` 由脚本自动维护,结构:

```json
{
  "https://apppss.com/writing/xxx/": {
    "lastmod": "2026-07-05",
    "submittedAt": "2026-07-05T10:00:00.000Z",
    "notifyTime": "2026-07-05T10:00:01.000Z"
  }
}
```

- 想清空重新全量推送一次?直接 `rm blogseo/state.json` 后再跑 `node blogseo/push.js`
- 想看哪些 URL 已经被记录过?直接 `cat blogseo/state.json`

### 4. 一条命令串联全流程

发布新文章时,推荐的一气呵成流程:

```bash
# 1. 写完 / 修改完文章
git add content/articles/

# 2. 本地预览一遍
npm run dev

# 3. 没问题,提交并触发自动部署
git commit -m "feat: 发布《xxx》"
git push origin main    # GitHub Actions 自动 build + deploy

# 4. 部署完成后(约 1-2 分钟),主动强推 Google 索引
node blogseo/push.js

# 5. 如果访问google超时，请设置代理
$env:HTTP_PROXY="http://127.0.0.1:10808"
$env:HTTPS_PROXY="http://127.0.0.1:10808"  
```

> 💡 **小贴士**:写新文章时,**同一天**写多篇不需要每篇都推送 — 等所有文章写完、一次性部署后,跑一次 `node blogseo/push.js`,脚本会自动挑出当天 `date` / `modifiedAt` 与 state 中不一致的 URL 一次性推送,既省事又不浪费配额。

---

## SEO 优化

本仓库内置了一整套面向搜索引擎与 AI 爬虫友好的能力：

- ✅ **Meta 标签** — 每个页面独立的 `title` / `description` / `keywords` / `robots` / `author`
- ✅ **Open Graph & Twitter Card** — 社交分享卡片完整支持
- ✅ **JSON-LD 结构化数据** — `Person` / `Organization` / `WebSite` / `AboutPage` / `ProfilePage` 全套 Schema.org
- ✅ **Sitemap** — [`server/routes/sitemap.xml.ts`](server/routes/sitemap.xml.ts) 自动生成
- ✅ **RSS** — [`server/routes/rss.xml.ts`](server/routes/rss.xml.ts) 自动生成
- ✅ **robots.txt** — [`public/robots.txt`](public/robots.txt)
- ✅ **llms.txt** — [`server/routes/llms.txt.ts`](server/routes/llms.txt.ts)，符合 [llmstxt.org](https://llmstxt.org/) 规范，便于 ChatGPT / Claude / Gemini 抓取
- ✅ **Canonical URL** — 防止重复内容
- ✅ **hreflang / 多语言** — `og:locale: zh_CN / en_US`
- ✅ **预渲染** — `nitro.prerender.crawlLinks: true` 确保所有内链页面被静态化
- ✅ **关键词矩阵**：Vue 3、TypeScript、React Native、Nuxt 3、Flutter、Cloudflare、Cursor、Claude Code、AI 编程、Prompt 工程、AI Agent、Vibe Coding、期货交易、趋势跟踪、移动止损、独立开发、副业变现、出海、TypeScript 类型体操 等

---

## 作者

**陵下书生** — 独立开发者 / 全栈工程师 · 期货交易爱好者 · AI 编程实践者

- 🎓 开封大学 · 计算机科学
- 💼 10+ 年互联网开发经验，2023 年转型独立开发者
- 🚀 独立开发并上线 15+ 个项目，累计服务 30K+ 用户
- ✍️ 持续输出技术、交易、AI 编程、个人成长类长文

**技术专长**：Vue 3、React Native、TypeScript、Flutter、Nuxt.js、Node.js、PostgreSQL / MongoDB / Redis、Docker、Cloudflare、GitHub Actions

**交易专长**：期货趋势跟踪、移动止损、品种深耕、心态管理

**AI 工作流**：日常使用 Cursor 做行内补全与 Composer，Claude Code 跑 Agent 任务（修 Bug、写测试、批量重构），配合自定义 Prompt 模板提效 3-5 倍。

---

## 联系与订阅

| 渠道 | 链接 |
| --- | --- |
| 个人主页 | [https://apppss.com](https://apppss.com) |
| 邮箱 | [panic3170@gmail.com](mailto:panic3170@gmail.com) |
| GitHub | [@panic-3170](https://github.com/panic-3170) |
| X (Twitter) | [@theruoshui3000](https://x.com/theruoshui3000) |
| RSS | [/rss.xml](https://apppss.com/rss.xml) |
| Sitemap | [/sitemap.xml](https://apppss.com/sitemap.xml) |
| llms.txt | [/llms.txt](https://apppss.com/llms.txt) |

欢迎就技术、交易、AI 编程、独立产品、远程工作、副业变现等话题交流。

---

## 许可证

本仓库源代码采用 [MIT 许可证](LICENSE) 开源。
博客文章版权归作者所有，转载请保留原文链接。

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/panic-3170">@panic-3170</a> · Nuxt 3 · Vue 3 · TypeScript · Tailwind CSS · AI 编程加持 · Deployed on GitHub Pages</sub>
</p>
