<script setup lang="ts">
import { ArrowLeft, Mail, Github, Twitter, Globe, Briefcase, Code2, TrendingUp } from 'lucide-vue-next'
import { usePageSeo } from '~/composables/usePageSeo'

const config = useRuntimeConfig()

usePageSeo({
  title: '关于我',
  description: '王哪走都是上坡，独立开发者 / 全栈工程师。专注 Vue 3、flutter、TypeScript 与独立产品，期货交易爱好者，分享 CDN 加速、nginx 反向代理、Node.js WebSocket 后端架构与 AI 编程实战。',
  url: `${config.public.siteUrl}about/`,
  tags: ['关于我', '独立开发者', '全栈工程师', 'ai编程', 'trae', 'codex', 'claude', 'Vue 3', 'Flutter', 'TypeScript', '期货交易'],
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${config.public.siteUrl}about/`,
    mainEntity: {
      '@type': 'Person',
      name: config.public.author,
      jobTitle: '独立开发者 / 全栈工程师',
      description: '专注前端技术栈（Vue 3、Flutter、TypeScript、Nuxt.js）与独立产品。期货交易爱好者，关注趋势跟踪、止损策略与心态管理。',
      alumniOf: '全栈工程师',
      sameAs: [
        'https://github.com/panic-3170',
        'https://x.com/theruoshui3000',
      ],
    },
  },
})
</script>

<template>
  <div class="pt-24 pb-20 px-6">
    <div class="max-w-4xl mx-auto">
      <Breadcrumb :items="[
        { name: '首页', url: '/' },
        { name: '关于我', url: '/about' }
      ]" />

      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft class="w-4 h-4" />
        返回首页
      </NuxtLink>

      <article>
        <header class="mb-12">
          <h1 class="text-4xl md:text-5xl font-medium mb-6">关于我</h1>
          <p class="text-xl text-gray-600">
            独立开发者 / 全栈工程师 · 期货交易爱好者
          </p>
        </header>

        <!-- 个人简介 -->
        <section class="mb-12">
          <h2 class="text-2xl font-medium mb-4 flex items-center gap-2">
            <Briefcase class="w-6 h-6" />
            我是谁
          </h2>
          <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              你好，我是 <strong>{{ config.public.author }}</strong>，一名独立开发者 / 全栈工程师。
            </p>
            <p>
              从一线大厂辞职后开始独立开发之旅，专注于用技术解决真实问题。日常工作涉及前端、后端、移动端、DevOps 全链路。
            </p>
            <p>
              除了写代码，我也是一名<strong>期货交易爱好者</strong>，从亏损到稳定盈利的路上，总结了一些心得：等待信号、严格止损、顺应趋势、移动止损、深入一个品种、调整好心态。
            </p>
            <p>
              这个博客记录我在技术、交易、个人成长方面的所思所感。希望我的经验能给你带来一点启发。
            </p>
          </div>
        </section>

        <!-- 技术栈 -->
        <section class="mb-12">
          <h2 class="text-2xl font-medium mb-4 flex items-center gap-2">
            <Code2 class="w-6 h-6" />
            技术栈
          </h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="p-6 bg-white rounded-xl border border-gray-200">
              <h3 class="text-lg font-medium mb-3">前端</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• <strong>Vue 3</strong> - Composition API / Pinia / Nuxt 3</li>
                <li>• <strong>React</strong> - Hooks / Next.js / React Native</li>
                <li>• <strong>TypeScript</strong> - 严格类型，泛型进阶</li>
                <li>• <strong>Tailwind CSS</strong> - 原子化样式</li>
              </ul>
            </div>
            <div class="p-6 bg-white rounded-xl border border-gray-200">
              <h3 class="text-lg font-medium mb-3">移动端</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• <strong>Flutter</strong> - GetX 状态管理</li>
                <li>• <strong>React Native</strong> - 性能优化实战</li>
                <li>• <strong>iOS / Android</strong> - 原生能力调用</li>
              </ul>
            </div>
            <div class="p-6 bg-white rounded-xl border border-gray-200">
              <h3 class="text-lg font-medium mb-3">后端 / 基础设施</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• <strong>Node.js</strong> - Express / NestJS</li>
                <li>• <strong>数据库</strong> - PostgreSQL / MongoDB / Redis</li>
                <li>• <strong>DevOps</strong> - Docker / GitHub Actions</li>
                <li>• <strong>部署</strong> - Vercel / GitHub Pages / Cloudflare</li>
              </ul>
            </div>
            <div class="p-6 bg-white rounded-xl border border-gray-200">
              <h3 class="text-lg font-medium mb-3">交易 / 投资</h3>
              <ul class="space-y-2 text-gray-700">
                <li>• <strong>期货交易</strong> - 趋势跟踪 / 移动止损</li>
                <li>• <strong>基本面 + 技术面</strong> 双修</li>
                <li>• <strong>品种深耕</strong> - 深入一个品种全链路</li>
                <li>• <strong>心态管理</strong> - 等待信号 / 严格风控</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 联系我 -->
        <section class="mb-12">
          <h2 class="text-2xl font-medium mb-4 flex items-center gap-2">
            <Mail class="w-6 h-6" />
            联系我
          </h2>
          <p class="text-gray-700 mb-6">
            欢迎通过以下方式与我交流技术、交易或合作机会：
          </p>
          <div class="grid sm:grid-cols-2 gap-4">
            <a
              href="mailto:panic3170@gmail.com"
              class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
            >
              <Mail class="w-5 h-5 text-gray-600" />
              <div>
                <div class="font-medium">邮箱</div>
                <div class="text-sm text-gray-500">panic3170@gmail.com</div>
              </div>
            </a>
            <a
              href="https://github.com/panic-3170"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
            >
              <Github class="w-5 h-5 text-gray-600" />
              <div>
                <div class="font-medium">GitHub</div>
                <div class="text-sm text-gray-500">@panic-3170</div>
              </div>
            </a>
            <a
              href="https://x.com/theruoshui3000"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
            >
              <Twitter class="w-5 h-5 text-gray-600" />
              <div>
                <div class="font-medium">X (Twitter)</div>
                <div class="text-sm text-gray-500">@theruoshui3000</div>
              </div>
            </a>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
            >
              <Globe class="w-5 h-5 text-gray-600" />
              <div>
                <div class="font-medium">RSS 订阅</div>
                <div class="text-sm text-gray-500">第一时间获取更新</div>
              </div>
            </a>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>
