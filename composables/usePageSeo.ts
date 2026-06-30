// composables/useSeoMeta.ts
// 统一管理每页的 SEO meta 标签
// 用法：在 setup 中调用 usePageSeo({ title, description, image?, type?, ... })

import type { Article } from '~/server/utils/markdown'

interface SeoOptions {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
  url?: string
  publishedAt?: string
  modifiedAt?: string
  author?: string
  tags?: string[]
  category?: string
  jsonLd?: Record<string, any> | Record<string, any>[]
  noindex?: boolean
}

const SITE_NAME = '陵下书生 · 独立开发者'
const SITE_URL = 'https://apppss.com'
// 必须和 nuxt.config.ts 里的 BASE_URL 保持一致(都是 '/'),否则 og:url / canonical / 面包屑 会指向 /FollowMe/* 这条不存在的路径
const BASE_URL = '/'
const FULL_SITE_URL = `${SITE_URL}${BASE_URL}`
const AUTHOR_NAME = '陵下书生'
const DEFAULT_DESCRIPTION = '独立开发者 / 全栈工程师。专注 Vue 3、TypeScript、React Native 与 AI 编程实战（Cursor、Claude Code），分享期货交易心得（趋势跟踪、止损、移动止损）与独立产品经验。'
const DEFAULT_IMAGE = `${FULL_SITE_URL}og-default.png`
const TWITTER_HANDLE = '@theruoshui3000'

/**
 * URL 规范化:为文件夹式路由补上末尾斜杠
 * GitHub Pages + Fastly 默认会对无斜杠路径做 301 跳转到带斜杠版本
 * 为了避免每次请求多一次重定向,以及让 Sitemap / RSS / llms.txt 与最终 URL 一致
 * 规则:
 *   - 空串 / 根路径 '/' 不动
 *   - 已带斜杠 / 已带 query 或 hash 不动
 *   - 文件类路径(.xml / .txt / .html / .json 等带扩展名)不动
 *   - 其他路径补上末尾斜杠
 */
export function withTrailingSlash(url: string): string {
  if (!url) return url
  if (url === '/') return url
  if (url.endsWith('/')) return url
  if (/[?#]/.test(url)) return url
  if (/\.[a-z0-9]+$/i.test(url)) return url
  return url + '/'
}

export function usePageSeo(options: SeoOptions = {}) {
  const config = useRuntimeConfig()
  const route = useRoute()

  const {
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    type = 'website',
    url = withTrailingSlash(`${FULL_SITE_URL}${route.path.replace(/^\//, '')}`),
    publishedAt,
    modifiedAt,
    author = AUTHOR_NAME,
    tags = [],
    category,
    jsonLd,
    noindex = false,
  } = options

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME

  // 主 meta 标签
  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: description },
      ...(tags.length ? [{ name: 'keywords', content: tags.join(',') }] : []),
      { name: 'author', content: author },
      ...(noindex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
      ...(category ? [{ name: 'article:section', content: category }] : []),

      // Open Graph
      { property: 'og:type', content: type },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:site_name', content: SITE_NAME },
      ...(publishedAt ? [{ property: 'article:published_time', content: publishedAt }] : []),
      ...(modifiedAt ? [{ property: 'article:modified_time', content: modifiedAt }] : []),
      ...(author ? [{ property: 'article:author', content: author }] : []),
      ...(category ? [{ property: 'article:section', content: category }] : []),
      ...(tags.map(tag => ({ property: 'article:tag', content: tag }))),

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: TWITTER_HANDLE },
      { name: 'twitter:creator', content: TWITTER_HANDLE },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    link: [
      { rel: 'canonical', href: url },
    ],
    script: jsonLd
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]),
          },
        ]
      : [],
  })
}

// 便捷方法：从 Article 对象生成 Article Schema
export function buildArticleJsonLd(article: Article, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article._excerpt || article.title,
    image: `${FULL_SITE_URL}og-default.png`,
    datePublished: article.date,
    dateModified: article.modifiedAt || article.date,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: FULL_SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${FULL_SITE_URL}og-default.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: article.category,
    keywords: article.tags.join(','),
    inLanguage: 'zh-CN',
    wordCount: article.content?.length || 0,
  }
}

// 便捷方法：面包屑 Schema
export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      // Schema.org 要求 item 必须是绝对 URL,直接传 '/xxx' 会被 Google 报"字段 id 中的网址无效"
      // 统一加末尾斜杠,避免 301 跳转稀释链接权重
      item: withTrailingSlash(
        item.url.startsWith('http')
          ? item.url
          : `${FULL_SITE_URL.replace(/\/$/, '')}${item.url}`
      ),
    })),
  }
}

// 便捷方法：FAQ Schema
export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// 便捷方法：HowTo Schema
export function buildHowToJsonLd(options: {
  name: string
  description: string
  steps: { name: string; text: string }[]
  totalTime?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: options.name,
    description: options.description,
    ...(options.totalTime ? { totalTime: options.totalTime } : {}),
    step: options.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}
