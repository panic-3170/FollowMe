// server/api/sitemap.xml.ts
// 自动生成 sitemap.xml
// 所有非文件类 URL 必须以斜杠结尾 - GitHub Pages + Fastly 默认会对无斜杠路径做 301 跳转
import { readArticles } from '~/server/utils/markdown'
import { withTrailingSlash } from '~/composables/usePageSeo'

// 必须和 nuxt.config.ts 里的 BASE_URL + SITE_URL 保持一致
// 站点使用自定义域名 apppss.com 部署在根路径
const SITE_URL = 'https://apppss.com'
const BASE_URL = '/'
const FULL_SITE_URL = `${SITE_URL}${BASE_URL}`

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  const articles = readArticles()
  const now = new Date().toISOString().split('T')[0]

  // 静态路由 - 末尾补斜杠
  const staticRoutes = [
    { loc: withTrailingSlash(`${FULL_SITE_URL}`), lastmod: now, changefreq: 'weekly', priority: '1.0' },
    { loc: withTrailingSlash(`${FULL_SITE_URL}writing`), lastmod: now, changefreq: 'weekly', priority: '0.9' },
    { loc: withTrailingSlash(`${FULL_SITE_URL}about`), lastmod: now, changefreq: 'monthly', priority: '0.7' },
    { loc: withTrailingSlash(`${FULL_SITE_URL}contact`), lastmod: now, changefreq: 'monthly', priority: '0.7' },
  ]

  // 文章路由 - 优先用 modifiedAt(若有),否则用 date - URL 末尾补斜杠
  const articleRoutes = articles.map(a => ({
    loc: withTrailingSlash(`${FULL_SITE_URL}writing/${a.id}`),
    lastmod: a.modifiedAt || a.date,
    changefreq: 'monthly',
    priority: '0.7',
  }))

  const allRoutes = [...staticRoutes, ...articleRoutes]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allRoutes.map(r => `  <url>
    <loc>${r.loc}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return xml
})

