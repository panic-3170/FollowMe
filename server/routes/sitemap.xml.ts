import { articles } from '~/data/articles'
import { projects } from '~/data/projects'

// 与 nuxt.config.ts 中的 BASE_URL 保持一致
// 切换自定义域名时同步修改这里
const SITE_URL = 'https://panic-3170.github.io/FollowMe'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  const today = new Date().toISOString().split('T')[0]

  const staticRoutes = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/writing', changefreq: 'weekly', priority: '0.9' }
  ]

  const articleRoutes = articles.map((a) => ({
    loc: `/writing/${a.id}`,
    lastmod: a.date,
    changefreq: 'monthly',
    priority: '0.7'
  }))

  const projectRoutes = projects.map((p) => ({
    loc: `/projects/${p.id}`,
    changefreq: 'monthly',
    priority: '0.6'
  }))

  const allRoutes = [...staticRoutes, ...articleRoutes, ...projectRoutes]

  const urls = allRoutes
    .map(
      (r) => `  <url>
    <loc>${SITE_URL}${r.loc}</loc>
    <lastmod>${'lastmod' in r ? r.lastmod : today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})
