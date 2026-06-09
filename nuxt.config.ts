import tailwindcss from '@tailwindcss/vite'

// GitHub Pages 项目页路径：https://<user>.github.io/FollowMe/
// 切换到自定义域名时改为 '/'
const BASE_URL = '/FollowMe/'

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
      title: '王叔走都是上坡 · 独立开发者',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '独立开发者 / 全栈工程师 - 个人主页' },
        { name: 'google-site-verification', content: 'EtV_GxgMJxLvCVNSflYdqaDUdbJWth3INAzEAXko5VQ' }
      ]
    }
  },
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/writing', '/404.html']
    }
  }
})
