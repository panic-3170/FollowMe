// server/api/llms.txt.ts
// llms.txt 规范 (https://llmstxt.org/):
//   一个根级 markdown 文件,告诉 LLM/AI 爬虫网站结构、核心内容
//   nuxt generate 预渲染时会变成静态文件 /llms.txt
import { readArticles } from '~/server/utils/markdown'

const SITE_URL = 'https://apppss.com'
const BASE_URL = '/'
const FULL_SITE_URL = `${SITE_URL}${BASE_URL}`
const SITE_NAME = '王叔走都是上坡 · 独立开发者'
const SITE_DESCRIPTION =
  '独立开发者 / 全栈工程师。专注 Vue 3、React Native、TypeScript、Flutter、Nuxt 3 实战，分享期货趋势跟踪与移动止损策略、CF + xray + nginx 反 GFW 技术方案、程序员副业变现与个人成长方法论。'
const AUTHOR = '王叔走都是上坡'
const SITE_LANG = 'zh-CN'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  // 显式允许 AI 爬虫抓取
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  const articles = readArticles()
  const now = new Date().toISOString().split('T')[0]

  // 按分类聚合
  const byCategory = new Map<string, typeof articles>()
  for (const a of articles) {
    const list = byCategory.get(a.category) || []
    list.push(a)
    byCategory.set(a.category, list)
  }

  // 分类中文映射(只翻译已出现的分类,未知分类保持原样)
  const categoryCN: Record<string, string> = {
    '技术教程': '技术教程',
    '工具教程': '工具教程',
    '产品设计': '产品设计',
    '开发工具': '开发工具',
    '网络工具': '网络工具',
    '创业人生': '创业人生',
    '交易心得': '交易心得',
    '未分类': '未分类',
  }

  const sectionBlocks: string[] = []

  // --- 必选:核心入口 ---
  sectionBlocks.push(`## 核心入口

- [首页 / 文章列表](${FULL_SITE_URL}): ${SITE_NAME} 的主页,包含最新文章与项目展示
- [全部文章](${FULL_SITE_URL}writing): 所有已发布文章的索引页,支持分类与标签筛选
- [关于我](${FULL_SITE_URL}about): 作者介绍、技能栈、联系方式与社交账号
`)

  // --- 必选:文章(按分类聚合) ---
  for (const [cat, list] of byCategory.entries()) {
    const title = categoryCN[cat] || cat
    const items = list
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(a => {
        const excerpt = a._excerpt ? `: ${a._excerpt.replace(/\n/g, ' ')}` : ''
        return `- [${a.title}](${FULL_SITE_URL}writing/${a.id})${excerpt} (${a.date}, ${a.readTime})`
      })
      .join('\n')
    sectionBlocks.push(`## ${title}\n\n${items}\n`)
  }

  // --- 可选:辅助资源 ---
  sectionBlocks.push(`## 辅助资源

- [RSS 订阅](${FULL_SITE_URL}rss.xml): RSS 2.0 feed,适合阅读器订阅
- [Sitemap](${FULL_SITE_URL}sitemap.xml): 完整 URL 列表,含 lastmod / priority
- [GitHub](https://github.com/panic-3170): 作者 GitHub,源码与项目
- [X / Twitter](https://x.com/theruoshui3000): 作者社交账号
`)

  // 拼接最终输出
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}
>
> 作者: ${AUTHOR} | 语言: ${SITE_LANG} | 最近更新: ${now} | 文章总数: ${articles.length}

${sectionBlocks.join('\n')}

# llms.txt 声明

本文件遵循 [llms.txt 规范](https://llmstxt.org/),供 LLM / AI 搜索引擎(如 ChatGPT、Perplexity、Google SGE、Claude、Gemini)抓取站点结构与核心内容。
如需每篇文章的完整正文,请访问对应文章 URL,或参考 Sitemap 索引。
`

  return body
})
