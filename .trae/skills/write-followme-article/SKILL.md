---
name: "write-followme-article"
description: "Writes SEO + GEO optimized blog articles for the FollowMe Nuxt blog. Invoke when user asks to write a new article, blog post, or 写一篇 / 新建文章 for content/articles/."
---

# Write FollowMe Article

为 [FollowMe 博客项目](file:///d:\app\FollowMe) 撰写 SEO + GEO 友好的博客文章。**该项目的所有新文章都必须遵循本文档定义的格式、结构和优化标准**。

## 何时调用（触发条件）

满足以下任一条件时立即调用本 Skill：

1. 用户说 **"写一篇"**、**"新写一篇"**、**"写一篇文章"**、**"新建文章"**
2. 用户提到 **"文章"**、**"blog post"**、**".md"** 写作
3. 用户在 `content/articles/` 目录下新建了空 `.md` 文件并请求填充
4. 用户要求"按之前的格式写"

## 项目背景（一句话）

Nuxt 3 + TypeScript 博客，部署到 GitHub Pages（`https://apppss.com`），文章以 `content/articles/*.md` 文件形式存在，通过 [server/utils/markdown.ts](file:///d:\app\FollowMe\server\utils\markdown.ts) 自动解析为结构化数据。

---

## 第 1 步：检索（按需）

如果用户提供了**完整的内容大纲和观点**（如"我已经想好了要写什么"）→ **跳过检索**，直接写。

如果用户只给了一个**主题/话题**（如"写一篇关于 X 的文章"）→ **必须先 WebSearch**，至少检索 2-3 个相关可靠源（带 `.com / .org / .edu` 域名优先），获取：
- 主流的实操方法 / 步骤
- 关键概念定义
- 数据/案例支撑

> **核心原则**：用户提供的是"自己的理解和悟道"，网上搜的是"主流观点和事实"。**两者必须融合**：用网上数据支撑结构，用用户观点填充灵魂。

---

## 第 2 步：生成 Frontmatter

**精确格式**（少一个字段都会被 Markdown 解析器自动推断，可能分类错误）：

```yaml
---
id: <kebab-case-file-name>
title: <SEO 标题, 50-70 字符, 含核心关键词>
date: <YYYY-MM-DD, 默认今天>
category: <技术教程 | 工具教程 | 交易心得 | 网络工具 | 创业人生 | 产品设计 | 开发工具>
readTime: <X 分钟, 估读>
tags:
  - <关键词1>
  - <关键词2>
  - <关键词3>
  - <关键词4>
  - <关键词5>
---
```

**约束**：
- `id` 必须等于文件名（去掉 .md）
- `title` 含主关键词，不要是问句
- `category` 显式指定，**不要依赖自动推断**（避免被分错类）
- `tags` 5-10 个，覆盖核心 + 长尾

---

## 第 3 步：文章结构（标准模板）

**严格按以下 9 个段落顺序写**。每段都有明确目的。

### 段 1：H1 标题（= frontmatter title）

```markdown
# <title>
```

### 段 2：核心结论（blockquote）

> **核心结论**：<1 句话总结文章核心方法/方案/结论>。<前置条件>。<本文提供什么>。

### 段 3：3 分钟摘要（核心要点列表）

```markdown
**3 分钟摘要**：
- <要点 1，含核心关键词>
- <要点 2>
- <要点 3>
- <要点 4>
- <要点 5>
```

### 段 4：事故 / 缘起背景

```markdown
**事故背景** / **缘起**：<真实故事，时间线，>用户为什么关注这个话题>。本文记录...
```

### 段 5：第一个大章节（`## 一、`）

铺垫 / 背景 / 底层原理。**最少 3 个 H3 子章节**。

### 段 6-N：核心章节（`## 二、`、`## 三、`...）

每章 200-500 字，含：
- 表格（对比 / 流程 / 清单）
- 代码块（命令 / 配置 / YAML）
- 列表（步骤 / 要点）

**至少 5 个一级章节**。

### 段 N+1：关键点回顾表

```markdown
| 关键点 | 错误做法 | 正确做法 |
|---|---|---|
| ... | ... | ... |
```

8-10 行。

### 段 N+2：写在最后

感性收尾，含金句/格言/给读者的最终建议。**3-5 段**。

### 段 N+3：常见问题 FAQ

```markdown
## 常见问题 FAQ

### <问题 1>?
<答案 1>

### <问题 2>?
<答案 2>
...
```

**8-10 个问题**。**问题必须以 `?` 结尾**（中文 `？` 也可），否则 FAQ 解析器可能漏掉。
**问题要覆盖长尾搜索词**，便于 GEO 抓取。

---

## 第 4 步：SEO 优化（必做）

| 优化项 | 实施位置 | 规则 |
|---|---|---|
| 核心关键词 | 标题 + H1 + 第一段 | 必须出现 1-2 次 |
| 长尾关键词 | H2 / H3 标题 | 自然出现，不强塞 |
| 内链机会 | 文中相关主题 | 链接到站内其他文章（用 `/writing/<id>/` 带斜杠） |
| 摘要 | frontmatter 抽取的 `_excerpt` | 第一段就要写好，搜索引擎摘要用 |
| 字数 | 整篇 | 中文 ≥ 3000 字 |

---

## 第 5 步：GEO 优化（必做，AI 搜索引擎友好）

| GEO 维度 | 实施方式 |
|---|---|
| **HTML 优先** | 项目已用 Nuxt SSR ✅，无需额外处理 |
| **结构化数据** | 项目自动注入 Article + FAQPage schema ✅，**只确保 FAQ 区段存在** |
| **FAQ Q&A 格式** | 第 N+3 段必须存在，H3 提问 / 段落回答 |
| **Speakable** | 段 2 核心结论用 blockquote（让 TTS 友好） |
| **E-E-A-T** | 段 4 含真实故事 / 个人体验（**不要虚构**） |
| **可执行步骤** | 含命令、代码、表格、清单，**自包含** |
| **dateModified** | 留空即可（项目用 date 兜底） |

---

## 第 6 步：保存与验证

1. **保存**到 `content/articles/<id>.md`（kebab-case）
2. **重新构建**：`npx nuxt build`
3. **验证**：
   - 构建无 ERROR
   - 文章出现在 `.output/public/writing/<id>/index.html`
   - canonical URL 带 `/`：`https://apppss.com/writing/<id>/`
   - FAQ 段落被自动识别（`.output/public/writing/<id>/index.html` 含 `"@type":"FAQPage"`）
   - sitemap.xml / rss.xml / llms.txt 包含新文章 URL
4. **失败排查**：
   - 404 → 检查 server 路由在 `server/routes/`（不是 `server/api/`）
   - 分类错 → 检查 frontmatter `category` 字段
   - FAQ 没识别 → 检查 H2 标题含 "FAQ" / "常见问题" / "问答"

---

## 第 7 步：交付报告

写完一篇文章后，**向用户报告**：

- **文章路径**：`content/articles/<id>.md`
- **访问 URL**：`https://apppss.com/writing/<id>/`
- **字数统计**：约 X 千字
- **结构概览**：X 个一级章节、Y 个 FAQ
- **SEO 关键词**：列出 title/H1/H2 中出现的主关键词
- **构建结果**：成功 / 失败，路由数
- **schema 验证**：Article + FAQPage 都已注入
- **分类归类**：自动归到 X 类

---

## 参考案例

- [telegram-86-login-recovery.md](file:///d:\app\FollowMe\content\articles\telegram-86-login-recovery.md) — 工具类标准模板
- [kan-da-zuo-xiao-futures-trading.md](file:///d:\app\FollowMe\content\articles\kan-da-zuo-xiao-futures-trading.md) — 心得类标准模板
- [content/articles/TEMPLATE.md](file:///d:\app\FollowMe\content\articles\TEMPLATE.md) — 空白模板（用于手动写作时复制）

## 反模式（不要做）

- ❌ 跳过 frontmatter（会被 Markdown parser 自动推断字段，分类和标签不可控）
- ❌ 把 FAQ 写成 `#### 问题`（必须用 `### 问题` 让解析器识别）
- ❌ 段落标题用问号结尾但 FAQ 段没有 H2 标记
- ❌ 写假数据 / 假案例（破坏 E-E-A-T 信度）
- ❌ 不验证构建直接交付
- ❌ 用相对路径或 `/FollowMe/` 前缀（必须用 `/writing/<id>/` 带斜杠）
