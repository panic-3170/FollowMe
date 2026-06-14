import tailwindcss from '@tailwindcss/vite'

// GitHub Pages 项目页路径：https://<user>.github.io/FollowMe/
// 切换到自定义域名时改为 '/'
const BASE_URL = '/FollowMe/'
const SITE_URL = 'https://panic-3170.github.io'
const FULL_SITE_URL = `${SITE_URL}${BASE_URL}`
const AUTHOR_NAME = '王叔走都是上坡'
const SITE_NAME = '王叔走都是上坡 · 独立开发者'
const SITE_DESCRIPTION = '独立开发者 / 全栈工程师。专注 Vue 3、React Native、TypeScript 与独立产品，分享期货交易心得、CF+xray+nginx 反 GFW 技术方案与个人成长经验。'
const SITE_KEYWORDS = '独立开发者,Vue 3,React Native,TypeScript,Flutter,Nuxt.js,期货交易,趋势跟踪,止损,xray,VLESS,Cloudflare,GFW,移动止损,产品设计,Git 工作流,个人成长'
const AUTHOR_EMAIL = 'panic3170@gmail.com'
const AUTHOR_GITHUB = 'https://github.com/panic-3170'
const AUTHOR_TWITTER = 'https://x.com/theruoshui3000'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  ssr: true,
  vite: {
    base: BASE_URL,
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
      ],
      script: [
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
      // sitemap 和 rss 由 server/api/*.ts 自动生成
      // 路径需要带 baseURL 前缀
      routes: [
        '/FollowMe/',
        '/FollowMe/writing',
        '/FollowMe/about',
        '/FollowMe/404.html',
        '/FollowMe/sitemap.xml',
        '/FollowMe/rss.xml',
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
