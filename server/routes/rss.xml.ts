// server/api/rss.xml.ts
// 自动生成 RSS 2.0 feed
// 所有非文件类 URL 必须以斜杠结尾 - 避免 301 跳转稀释链接权重
import { readArticles } from '~/server/utils/markdown'
import { withTrailingSlash } from '~/composables/usePageSeo'

// 必须和 nuxt.config.ts 里的 BASE_URL + SITE_URL 保持一致
const SITE_URL = 'https://apppss.com'
const BASE_URL = '/'
const FULL_SITE_URL = `${SITE_URL}${BASE_URL}`
const SITE_NAME = '陵下书生 · 独立开发者'
const SITE_DESCRIPTION = '独立开发者 / 全栈工程师的博客。分享技术教程、交易心得与个人成长。'
const AUTHOR = '陵下书生'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')

  const articles = readArticles()
  const buildDate = new Date().toUTCString()
  const latestDate = articles[0] ? new Date(articles[0].date).toUTCString() : buildDate

  const items = articles.map(a => {
    const link = withTrailingSlash(`${FULL_SITE_URL}writing/${a.id}`)
    const pubDate = new Date(a.date).toUTCString()
    const categories = [a.category, ...(a.tags || [])]
      .filter(Boolean)
      .map(c => `    <category>${escapeXml(c)}</category>`)
      .join('\n')

    return `  <item>
    <title>${escapeXml(a.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${pubDate}</pubDate>
    <author>panic3170@gmail.com (${AUTHOR})</author>
    <description><![CDATA[${a._excerpt || a.title}]]></description>
    <content:encoded><![CDATA[${a.content || ''}]]></content:encoded>
${categories}
  </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${FULL_SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>zh-CN</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${latestDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${FULL_SITE_URL}rss.xml" rel="self" type="application/rss+xml" />
    <managingEditor>panic3170@gmail.com (陵下书生)</managingEditor>
    <webMaster>panic3170@gmail.com (陵下书生)</webMaster>
    <copyright>Copyright © ${new Date().getFullYear()} ${AUTHOR}</copyright>
    <generator>Nuxt 3 + RSS</generator>
${items}
  </channel>
</rss>`
})
