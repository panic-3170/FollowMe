import tailwindcss from '@tailwindcss/vite'

// 自定义域名：https://apppss.com/FollowMe/
// 若以后想挂在域名根目录，把 BASE_URL 改为 '/'，并把 nitro.prerender.routes 里的 /FollowMe 前缀一并去掉
const BASE_URL = '/'
const SITE_URL = 'https://apppss.com'
const FULL_SITE_URL = `${SITE_URL}${BASE_URL}`
const AUTHOR_NAME = '王叔走都是上坡'
const SITE_NAME = '王叔走都是上坡 · 独立开发者'
const SITE_DESCRIPTION = '独立开发者与全栈工程师的技术博客。深耕 Vue 3、React Native、TypeScript、Flutter、Nuxt.js 实战教程，分享独立产品出海经验、期货趋势跟踪与移动止损策略、程序员副业变现与个人成长方法论。'
const SITE_KEYWORDS = '独立开发者,全栈工程师,独立开发,副业变现,程序员副业,远程工作,出海,独立产品,Vue 3 教程,Vue 3 组合式 API,Vue 3 最佳实践,React Native 性能优化,React Native 实战,TypeScript 教程,TypeScript 类型体操,Nuxt 3 教程,Nuxt 3 静态部署,Nuxt 3 GitHub Pages,Flutter 跨平台,Flutter 开发,期货交易,期货趋势跟踪,趋势跟踪策略,移动止损,止损技巧,程序化交易,教程,Cloudflare,VPS,Git 工作流,产品设计,个人成长,技术写作'
const AUTHOR_EMAIL = 'panic3170@gmail.com'
const AUTHOR_GITHUB = 'https://github.com/panic-3170'
const AUTHOR_TWITTER = 'https://x.com/theruoshui3000'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  ssr: true,
  vite: {
    // 必须用相对路径 './' 而不是 BASE_URL。
    // GitHub Pages project page(仓库名 FollowMe + 自定义域名 apppss.com)部署后,
    // 仓库根的 _nuxt/xxx.js 在 URL 空间里已经是 /FollowMe/_nuxt/xxx.js
    // (project page 会自动 prepend 仓库名作为路径前缀)。
    // 如果 vite.base 写成 '/FollowMe/',HTML 里的 <script> 会变成
    // 绝对路径 /FollowMe/_nuxt/xxx.js,叠加 project page 的自动前缀后
    // 变成 /FollowMe/FollowMe/_nuxt/xxx.js,稳定 404。
    // 改用 './' 让浏览器按 HTML 当前位置解析,完全避开双重前缀问题。
    // app.baseURL 保持 '/FollowMe/' 不动 — 它管的是运行时 router 和 _payload.json,
    // 这两个需要绝对路径,跟 vite.base 是两套机制。
    base: './',
    plugins: [tailwindcss()],
  },
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: BASE_URL,
    head: {
      title: SITE_NAME,
      titleTemplate: (titleChunk?: string) =>
        titleChunk && titleChunk !== SITE_NAME
          ? `${titleChunk} | ${SITE_NAME}`
          : SITE_NAME,
      htmlAttrs: {
        lang: 'zh-CN',
        dir: 'ltr',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' },
        { name: 'description', content: SITE_DESCRIPTION },
        { name: 'keywords', content: SITE_KEYWORDS },
        { name: 'author', content: AUTHOR_NAME },
        { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'baiduspider', content: 'index, follow' },
        { name: 'rating', content: 'general' },
        { name: 'distribution', content: 'global' },
        { name: 'revisit-after', content: '7 days' },
        { name: 'language', content: 'zh-CN' },
        { name: 'geo.region', content: 'CN' },
        { name: 'geo.placename', content: 'China' },
        { name: 'google-site-verification', content: 'EtV_GxgMJxLvCVNSflYdqaDUdbJWth3INAzEAXko5VQ' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:title', content: SITE_NAME },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:url', content: FULL_SITE_URL },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:locale:alternate', content: 'en_US' },
        { property: 'og:image', content: `${FULL_SITE_URL}og-default.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: SITE_NAME },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@theruoshui3000' },
        { name: 'twitter:creator', content: '@theruoshui3000' },
        { name: 'twitter:title', content: SITE_NAME },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'twitter:image', content: `${FULL_SITE_URL}og-default.png` },
        { name: 'twitter:image:alt', content: SITE_NAME },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: FULL_SITE_URL },
        { rel: 'alternate', type: 'application/rss+xml', title: SITE_NAME, href: `${FULL_SITE_URL}rss.xml` },
        { rel: 'sitemap', type: 'application/xml', href: `${FULL_SITE_URL}sitemap.xml` },
        // llms.txt - LLM/AI 爬虫入口(llmstxt.org 规范)
        { rel: 'alternate', type: 'text/plain', title: 'LLM-friendly site index', href: `${FULL_SITE_URL}llms.txt` },
      ],
      script: [
        // Google AdSense — 必须在 <head> 里 async 加载,广告才会展示
        {
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1750003824799412',
          async: true,
          crossorigin: 'anonymous',
        },
        {
          type: 'application/ld+json',
          // 全站 Organization + Person Schema
          children: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: AUTHOR_NAME,
              url: FULL_SITE_URL,
              email: AUTHOR_EMAIL,
              jobTitle: '独立开发者 / 全栈工程师',
              sameAs: [
                AUTHOR_GITHUB,
                AUTHOR_TWITTER,
                `${SITE_URL}`,
              ],
              knowsAbout: [
                'Vue 3', 'React Native', 'TypeScript', 'Flutter', 'Nuxt.js',
                '期货交易', '技术写作', '独立开发', '系统架构'
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: SITE_NAME,
              url: FULL_SITE_URL,
              logo: `${FULL_SITE_URL}og-default.png`,
              sameAs: [AUTHOR_GITHUB, AUTHOR_TWITTER],
              contactPoint: {
                '@type': 'ContactPoint',
                email: AUTHOR_EMAIL,
                contactType: 'customer support',
                availableLanguage: ['zh-CN', 'en-US'],
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              url: FULL_SITE_URL,
              description: SITE_DESCRIPTION,
              inLanguage: 'zh-CN',
              author: { '@type': 'Person', name: AUTHOR_NAME },
              potentialAction: {
                '@type': 'SearchAction',
                target: `${FULL_SITE_URL}writing?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            },
          ]),
        },
      ],
    },
  },
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      // sitemap / rss / llms.txt 由 server/api/*.ts 自动生成
      // 路径需要带 baseURL 前缀
      routes: [
        '/',
        '/writing',
        '/about',
        '/404.html',
        '/sitemap.xml',
        '/rss.xml',
        '/llms.txt',
      ],
      // 不让 404 错误中断构建
      failOnError: false,
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: FULL_SITE_URL,
      siteName: SITE_NAME,
      author: AUTHOR_NAME,
    },
  },
})
