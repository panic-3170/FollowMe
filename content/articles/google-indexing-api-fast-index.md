---
id: google-indexing-api-fast-index
title: 沙盒期 GitHub Pages 提速收录:用 Google Indexing API 24 小时强制收录新文章
date: 2026-07-05
category: 工具教程
readTime: 10 分钟
tags:
  - Google Indexing API
  - GitHub Pages
  - 沙盒期
  - 强制收录
  - sitemap
  - SEO
  - Google Search Console
  - Service Account
  - googleapis
  - 站长工具
---

# 沙盒期 GitHub Pages 提速收录:用 Google Indexing API 24 小时强制收录新文章

> **核心结论**:GitHub Pages 新站在 Google 沙盒期内,在 Search Console 点"请求编入索引"往往要排队半个月才轮得到。**用 Google 官方给新闻站用的 Indexing API,配合 Node.js 一键脚本批量推送 sitemap 中的所有文章 URL,可以直接走"特快加急通道",24 小时内强制 Googlebot 来抓取,绕过域名低信任度限制**。前提条件:你有一个 GCP 项目 + 一个 Service Account 凭证(JSON)、把该 Service Account 加为 Search Console 站点所有者。本文给出从 GCP 申请到 Node.js 脚本跑通、再到 sitemap 自动同步增量推送的完整链路,**适用所有静态博客、独立开发站、刚上线的低权重新站**。

**3 分钟摘要**:
- 沙盒期 = Google 对新域名/低权重域名的"观察期",普通收录通道排队要 2-4 周
- Indexing API 是 Google 官方给新闻站用的快速收录接口,**任何类型站点都能用**(Google 文档明确说明)
- 5 步走通:GCP 建项目 → 开 Indexing API → 建 Service Account → Search Console 授权 → Node.js 脚本批量推送
- 配合 `sitemap.xml` 自动同步,只推送"新增/修改过"的 URL,**一天 200 次的 publish 配额不浪费**
- 实测新站文章 24 小时内出现在 Google 搜索结果,沙盒期直接被 Indexing API 绕过

**事故背景**:个人博客 [apppss.com](https://apppss.com) 部署到 GitHub Pages 第一个月,在 Google Search Console 提交了好几篇技术文章,看着"已发现 → 已抓取 → 已编入索引"卡在第一步两周没动;手动点"请求编入索引"也被排到半个月后。折腾过主动外链(reddit/V2EX/掘金)、sitemap 重新提交、robots.txt 调整,效果都一般。**直到用 Indexing API 把所有文章一次性 publish 过去,24 小时内全部出现在搜索结果**。本文把这条最快路径完整记录下来。

---

## 一、问题背景:为什么 GitHub Pages 新站会被"沙盒"

### 1.1 沙盒期的真实表现

新域名上线 GitHub Pages 后 1-3 个月,Google 搜索表现通常是这样:

| 阶段 | 现象 | 耗时 |
|------|------|------|
| **发现期** | Search Console 显示"已发现",但 Googlebot 不来抓 | 1-2 周 |
| **抓取期** | 抓了,但只抓首页、不抓内页 | 1-3 周 |
| **索引期** | 抓了内页,但搜索结果查不到 | 2-4 周 |
| **排名期** | 终于有收录,但排名在第 5 页之后 | 不定 |

**手动点"请求编入索引"在沙盒期基本无效** — Google 把它降级为低优先级,排队很长。

### 1.2 沙盒期的根因

Google 对**新域名 + 低权重 + 大量新内容**的站点有天然的"观察期":
- 域名年龄 < 6 个月 → 信任度低
- 外链少 → 抓取预算(Crawl Budget)被分得很低
- 内容质量未验证 → 索引优先级低
- 主机 IP(尤其是 GitHub Pages 共享 IP) → 被批量识别为"低质量站"

常规 SEO 优化(优质内容、外链、sitemap)对沙盒期帮助有限,Google 不会因为你有 sitemap 就破例加速。**真正能绕过沙盒期的,只有 Google 官方的"特快通道" — Indexing API**。

### 1.3 三个常见的"伪解法"

| 伪解法 | 实际效果 | 为什么没用 |
|--------|----------|------------|
| 在 GSC 反复点"请求编入索引" | 队列被合并,不加速 | 沙盒期被降权,无法插队 |
| 重新提交 sitemap.xml | GSC 显示"已处理",但索引不动 | 抓取预算没增加 |
| 各大平台发外链引流 | 带来真实流量,但不加速索引 | Googlebot 抓取优先级不变 |

**只有 Indexing API 能直接要求 Googlebot 24 小时内来抓**。下面开始走通完整流程。

---

## 二、原理:Indexing API 是什么

### 2.1 一句话定义

**Indexing API** 是 Google 官方在 2018 年开放的接口,最初给新闻站点("JobPosting" 和 "BroadcastEvent" 结构化数据)用来**秒级推送新内容到 Google 索引**。**2024 年后 Google 文档明确:任何类型的网站都可以用,不再局限于新闻站**。

### 2.2 与"请求编入索引"的区别

| 维度 | Search Console 请求编入索引 | Indexing API |
|------|------------------------------|---------------|
| 配额 | 每天 5-10 次(隐式) | 每天 200 次 publish |
| 优先级 | 普通队列 | 特快通道(24h) |
| 调用方 | 人工(网页点) | 程序化(脚本批量) |
| 适用对象 | 单个 URL | 任何 URL,推荐 sitemap 批量 |
| 鉴权 | GSC 登录态 | Service Account JSON |

### 2.3 API 接口规范

**端点**:`https://indexing.googleapis.com/v3/urlNotifications:publish`

**请求体**:
```json
{
  "url": "https://apppss.com/writing/xxx/",
  "type": "URL_UPDATED"
}
```

**type 字段说明**:
- `URL_UPDATED`:新增或修改(强推,本文使用)
- `URL_DELETED`:已删除(从索引移除)

**响应**:HTTP 200 + `urlNotificationMetadata.latestUpdate.notifyTime`(Google 登记时间)。

### 2.4 配额与限制

| 限制项 | 数值 | 备注 |
|--------|------|------|
| 每天 publish 配额 | **200 次/Service Account** | 超出返回 429 |
| QPS(每秒请求) | 建议 ≤ 1 | 太快会被限流 |
| URL 必须是公开可访问 | 是 | HTTP 200 才有效 |
| 沙盒期新站能用吗? | **可以,且必须** | 沙盒期绕过的核心手段 |
| 个人博客能用吗? | 可以 | Google 文档明确"任何类型" |

---

## 三、前置准备:5 步搞定 GCP + Service Account

### 第一步:创建 GCP 项目 + 启用 Indexing API

1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 顶部下拉 → **新建项目** → 命名如 `blog-indexer` → 创建
3. 左侧菜单 → **APIs & Services** → **Library**
4. 搜索 `Indexing API` → 点击 → **Enable**(启用)

> ⚠️ **注意**:Indexing API 不在 Library 顶部,需要搜索。启用后等 1-2 分钟生效。

### 第二步:创建 Service Account 并下载 JSON

1. 左侧菜单 → **IAM & Admin** → **Service Accounts**
2. 顶部 **Create Service Account**:
   - Service account name:`blog-indexer`(任意)
   - Service account ID:自动生成
3. **Grant this service account access to project**:跳过(选 No role)
4. **Grant users access to this service account**:跳过
5. 点击刚创建的 Service Account → **Keys** 标签 → **Add Key** → **Create new key** → 选 **JSON** → 下载
6. **重命名** 为 `service-account.json`,放到项目里的 `blogseo/` 目录(请勿提交到 Git)

### 第三步:把 Service Account 加为 Search Console 所有者

1. 打开 [Google Search Console](https://search.google.com/search-console)
2. 选择你的站点资源(`apppss.com`)
3. 左侧 **Settings** → **Users and permissions** → **Add user**
4. 把 Service Account 的邮箱填进去(在 `service-account.json` 的 `client_email` 字段,形如 `blog-indexer@xxx.iam.gserviceaccount.com`)
5. 权限选 **Owner**(Full)
6. 等 1-2 分钟生效

> 📌 **这一步最常被忽略** — 没在 GSC 加 Service Account,API 调用会返回 403 `Permission denied`。

### 第四步:验证 API 启用成功

在本地跑一个最小化测试:

```bash
mkdir -p blogseo
cd blogseo
npm init -y
npm install googleapis
```

创建 `test.js`:

```javascript
import { google } from 'googleapis';
import { readFileSync } from 'fs';

const auth = new google.auth.GoogleAuth({
  keyFile: './service-account.json',
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const indexing = google.indexing({ version: 'v3', auth: await auth.getClient() });

const res = await indexing.urlNotifications.publish({
  requestBody: {
    url: 'https://apppss.com/',
    type: 'URL_UPDATED',
  },
});
console.log('状态:', res.status, '时间:', res.data.urlNotificationMetadata?.latestUpdate?.notifyTime);
```

跑 `node test.js`,看到 状态: 200 即配置成功。

### 第五步:把 service-account.json 加入 .gitignore

编辑项目根目录的 `.gitignore`,追加:

```gitignore
# Google Service Account 凭证(请勿提交)
blogseo/service-account.json
```

并把 `blogseo/service-account.json` 从 Git 历史中清理(用 `git rm --cached`)。

---

## 四、核心代码:从 sitemap 自动同步增量推送

### 4.1 设计思路

- **数据源**:线上 `https://apppss.com/sitemap.xml`(部署后由 Nuxt 自动生成)
- **状态文件**:`blogseo/state.json`,记录每个 URL 上次推送的 `lastmod`
- **差量推送**:对比 sitemap 的 `<lastmod>` 与 state 中记录,只推"新增"或"修改过"的 URL
- **每条成功立即落盘**:中途崩溃也不会重提已成功的

### 4.2 完整脚本 `blogseo/push.js`

```javascript
import { google } from 'googleapis';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonKeyPath = join(__dirname, './service-account.json');
const stateFilePath = join(__dirname, './state.json');

const SITEMAP_URL = process.argv[2] || 'https://apppss.com/sitemap.xml';
const FORCE = process.argv.includes('--force');
const PUSH_ALL = process.argv.includes('--all');

// 从 sitemap.xml 提取 [{ loc, lastmod }]
function extractEntries(xml) {
  const entries = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = m[1].match(/<loc>\s*([^<]+?)\s*<\/loc>/)?.[1].trim();
    const lastmod = m[1].match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/)?.[1].trim() || '';
    if (loc) entries.push({ loc, lastmod });
  }
  return entries;
}

async function loadState() {
  try { return JSON.parse(await readFile(stateFilePath, 'utf-8')); }
  catch (e) { if (e.code === 'ENOENT') return {}; throw e; }
}
async function saveState(s) {
  await writeFile(stateFilePath, JSON.stringify(s, null, 2) + '\n', 'utf-8');
}

function diff(entries, state) {
  const todo = [], skipped = [];
  for (const e of entries) {
    if (!FORCE && state[e.loc]?.lastmod === e.lastmod) {
      skipped.push(e);
    } else {
      todo.push(e);
    }
  }
  return { todo, skipped };
}

const auth = new google.auth.GoogleAuth({
  keyFile: jsonKeyPath,
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

async function main() {
  let entries = extractEntries(await (await fetch(SITEMAP_URL)).text());
  if (!PUSH_ALL) entries = entries.filter(e => e.loc.includes('/writing/'));
  console.log(`📋 解析到 ${entries.length} 个 URL${PUSH_ALL ? '(含静态页)' : '(仅文章)'}`);

  const state = await loadState();
  const { todo, skipped } = diff(entries, state);
  console.log(`🆕 待推送: ${todo.length} | ⏭️  跳过: ${skipped.length}${FORCE ? ' [FORCE]' : ''}`);

  if (todo.length === 0) return console.log('\n✨ 没有需要推送的 URL');

  const client = await auth.getClient();
  const indexing = google.indexing({ version: 'v3', auth: client });

  for (const e of todo) {
    console.log(`正在提交: ${e.loc} (lastmod=${e.lastmod})`);
    const res = await indexing.urlNotifications.publish({
      requestBody: { url: e.loc, type: 'URL_UPDATED' },
    });
    const notifyTime = res.data.urlNotificationMetadata?.latestUpdate?.notifyTime || new Date().toISOString();
    console.log(`✅ 状态 ${res.status} | notifyTime=${notifyTime}`);
    state[e.loc] = { lastmod: e.lastmod, submittedAt: new Date().toISOString(), notifyTime };
    await saveState(state);
  }
  console.log('\n🏁 全部提交完毕');
}

main().catch(e => console.error('❌', e.response?.data || e.message));
```

### 4.3 常用命令

```bash
# 1) 默认:增量推送线上 sitemap 的所有文章
node blogseo/push.js

# 2) 推本地预览(先 npm run dev)
node blogseo/push.js http://localhost:3000/sitemap.xml

# 3) 强制全量(忽略 state.json,例如重新激活一批老文章)
node blogseo/push.js --force

# 4) 包括首页 / about 等静态页
node blogseo/push.js --all

# 5) 组合
node blogseo/push.js http://localhost:3000/sitemap.xml --force --all

# 6) 清空状态全量推
rm blogseo/state.json && node blogseo/push.js
```

### 4.4 输出示例

```text
📋 解析到 12 个 URL(仅文章)
🆕 待推送: 2 | ⏭️  跳过: 10
正在提交: https://apppss.com/writing/foo/ (lastmod=2026-07-05)
✅ 状态 200 | notifyTime=2026-07-05T10:00:01Z
正在提交: https://apppss.com/writing/bar/ (lastmod=2026-07-05)
✅ 状态 200 | notifyTime=2026-07-05T10:00:02Z
🏁 全部提交完毕
```

---

## 五、避坑指南:6 个常见错误

| 错误 | 现象 | 解决方法 |
|------|------|----------|
| **GSC 没加 Service Account** | 403 Permission denied | Search Console → Settings → Users → Add Owner |
| **API 没启用** | 403 Indexing API has not been used in project | GCP → Library → 搜 Indexing API → Enable |
| **JSON 路径错误** | ENOENT 找不到 service-account.json | 用 `__dirname` 拼绝对路径,不要写相对 |
| **URL 没带斜杠** | 404,Google 不会处理 | 确保 `https://xxx.com/writing/yyy/` 末尾有 `/` |
| **一天超过 200 次** | 429 Rate Limit | 用 state.json 做增量,不要全量重提 |
| **推送了没收录** | GSC 显示已处理但搜索没结果 | 等 24-72 小时,Indexing API 只是"加急"不保证秒收录 |

---

## 六、关键点回顾

| 关键点 | 错误做法 | 正确做法 |
|--------|----------|----------|
| API 启用 | 跳过 Library 启用步骤 | 先在 GCP 搜 Indexing API 并 Enable |
| 凭证存放 | 把 JSON 提交到 GitHub | 放 `blogseo/`,加进 `.gitignore` |
| GSC 授权 | 只在 GCP 创建 Service Account | 同时在 Search Console 加为 Owner |
| URL 格式 | 推送 `https://xxx.com/writing/foo` | 推送 `https://xxx.com/writing/foo/`(带斜杠) |
| 推送方式 | 一次性全量推 100 个 | 增量推送,只推新增/修改过的 |
| 配额管理 | 每天重提 200 次已推送的 | 用 `state.json` 去重 |
| 沙盒期应对 | 在 GSC 反复点"请求编入索引" | 直接 Indexing API 走特快通道 |
| 失败排查 | 看到 429 就不管了 | 检查 state.json,确认是新增才推 |

---

## 七、写在最后

沙盒期不是诅咒,是 Google 对所有新站的"面试期"。常规 SEO 优化能帮你过面试,但**面试完不给你 Offer 时,Indexing API 就是那个能让你直接走特批的"内推"**。

把这条自动化链路跑通之后,我再也没有手动去 GSC 点过"请求编入索引"。每天写完文章,部署完跑一次 `node blogseo/push.js`,新文章 24 小时内稳定出现在搜索结果 — 沙盒期像从来没存在过一样。

记住:**工具只是杠杆,真正决定你博客生死的,还是内容本身**。Indexing API 能帮你跑得更快,不能帮你写得更深。把它当作加速器,别当作替代品。

> 写一篇能被快速收录的文章,只是开始;写一篇值得被收录的文章,才是目的。

---

## 常见问题 FAQ

### 沙盒期 GitHub Pages 站多久能正常收录?
通常 3-6 个月。**用 Indexing API 后可以压缩到 24-72 小时**,但本质上是"加急"不是"破除"沙盒,沙盒的域名信任度积累仍需时间。

### Google Indexing API 普通人能申请吗?
**可以**,且 Google 官方文档明确说明"任何公开内容网站都可以使用",不再局限于新闻站。流程是 GCP 建项目 + Service Account + 启用 API 即可,无需审核。

### Indexing API 每天 200 次配额够用吗?
对个人博客完全够用。假设你一天写 5 篇文章、修改 3 篇老文章,共 8 次 publish。**用 state.json 做增量推送,200 次配额可以覆盖一个月**。即使做迁移要重提,一次也不会超过 50 个 URL。

### Indexing API 推送后多久能在 Google 搜索到?
实测沙盒期新站:**24 小时内出现在搜索结果**(GSC 显示"已编入索引")。但搜索排名仍然受沙盒信任度影响,关键词排名可能还在第 3-5 页,需要靠内容质量 + 外链慢慢爬。

### Service Account 凭证安全吗?要不要担心泄露?
JSON 凭证只对 Indexing API 有效,无法登录 GCP、无法访问你的 GCP 项目资源。**仍然不要提交到 Git**,因为拿到凭证的人可以批量消耗你的 200 次/天配额。丢失后直接在 GCP 删 Key 重建即可。

### Indexing API 能推送 sitemap 吗?
**不能直接推送 sitemap 文件**,只能推送一个个 URL。所以本文的核心就是:**自己写脚本从 sitemap.xml 里提取 URL 批量推送**。Google 自己的搜索爬虫负责抓 sitemap,你负责"特快加急"。

### Vercel / Netlify / Cloudflare Pages 站能用 Indexing API 吗?
**任何能被 Google 抓取的公开站点都能用**,平台不限。GitHub Pages、Vercel、Netlify、Cloudflare Pages、自建 VPS 都一样,Indexing API 走的是 Google 收录通道,和你的主机无关。

### Indexing API 推送后被 Google 处罚怎么办?
正常使用**不会被处罚**。Indexing API 不属于"快排黑帽",它是 Google 官方接口。处罚的常见原因是:批量推送大量低质重复内容、或恶意刷量。个人博客正常使用完全没问题。

### GitHub Pages 自定义域名会影响 Indexing API 吗?
不影响。`https://apppss.com/...` 和 `https://xxx.github.io/xxx/...` 在 Google 看来是两个不同的 URL,推送哪个就索引哪个。**推荐统一推自定义域名的 URL**,因为这是用户最终访问的地址。

### Indexing API 和 Search Console 的"请求编入索引"能同时用吗?
可以,但没必要。**Indexing API 已经包含了"请求编入索引"的功能,且更强更快**。同时用只会浪费 GSC 的配额。建议 Indexing API 跑脚本,Search Console 只看数据统计,不再点"请求编入索引"。

---

> 本文只做 Indexing API 沙盒期提速的实操分享,不构成 Google 官方推荐。请遵守 Google 搜索规范,合法合规使用 API 接口。
