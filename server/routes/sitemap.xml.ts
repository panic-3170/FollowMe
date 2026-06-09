import { articleIds, projectIds } from '../utils/sitemap-data'

// 与 nuxt.config.ts 中的 BASE_URL 保持一致
// 切换自定义域名时同步修改这里
const SITE_URL = 'https://panic-3170.github.io/FollowMe'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  const today = new Date().toISOString().split('T')[0]

  const urls: string[] = []

  // 静态路由
  urls.push(`  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`)

  urls.push(`  <url>
    <loc>${SITE_URL}/writing</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`)

  // 文章
  for (const a of articleIds) {
    urls.push(`  <url>
    <loc>${SITE_URL}/writing/${a.id}</loc>
    <lastmod>${a.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
  }

  // 项目
  for (const id of projectIds) {
    urls.push(`  <url>
    <loc>${SITE_URL}/projects/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
})
