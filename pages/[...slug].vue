<script setup lang="ts">
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo({
  title: '404 页面未找到',
  description: '抱歉，您访问的页面不存在。返回首页或浏览我们的文章与项目。',
  noindex: true,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '404 页面未找到',
    description: '页面不存在',
  },
})

// 设置 HTTP 状态码为 404
setResponseStatus(404)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="text-center max-w-2xl">
      <h1 class="text-7xl font-medium mb-4 text-gray-900">404</h1>
      <p class="text-2xl text-gray-700 mb-2">页面未找到</p>
      <p class="text-gray-500 mb-8">
        抱歉，您访问的页面不存在或已被移动。
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          返回首页
        </NuxtLink>
        <NuxtLink
          to="/writing"
          class="inline-block px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-full hover:bg-gray-50 transition-colors"
        >
          浏览文章
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="inline-block px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-full hover:bg-gray-50 transition-colors"
        >
          关于我
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
