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

const SITE_NAME = '王叔走都是上坡 · 独立开发者'
const SITE_URL = 'https://panic-3170.github.io'
const BASE_URL = '/FollowMe/'
const FULL_SITE_URL = `${SITE_URL}${BASE_URL}`
const AUTHOR_NAME = '王叔走都是上坡'
const DEFAULT_DESCRIPTION = '独立开发者 / 全栈工程师。专注 Vue 3、React Native、TypeScript 与独立产品，分享期货交易心得、CF+xray+nginx 反 GFW 技术方案与个人成长经验。'
const DEFAULT_IMAGE = `${FULL_SITE_URL}og-default.png`
const TWITTER_HANDLE = '@theruoshui3000'

export function usePageSeo(options: SeoOptions = {}) {
  const config = useRuntimeConfig()
  const route = useRoute()

  const {
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    type = 'website',
    url = `${FULL_SITE_URL}${route.path.replace(/^\//, '')}`,
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
    dateModified: article.date,
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
      item: item.url,
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
