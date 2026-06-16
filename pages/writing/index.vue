<script setup lang="ts">
import { ref, computed } from 'vue'
import { Clock, Tag, Rss } from 'lucide-vue-next'
import { usePageSeo } from '~/composables/usePageSeo'

interface ArticleListItem {
  id: string
  title: string
  date: string
  category: string
  readTime: string
  tags: string[]
  _excerpt: string
  _path: string
}

const config = useRuntimeConfig()

const { data: articlesData } = await useFetch<ArticleListItem[]>('/api/articles')
const articles = articlesData.value || []

const selectedCategory = ref('all')

// 保留服务端传来的 _path(已带末尾斜杠,避免 301)
const items = articles.map(a => ({ ...a, _path: a._path || `/writing/${a.id}/` }))

const categories = computed(() => {
  const cats = Array.from(new Set(items.map(a => a.category)))
  return ['all', ...cats]
})

const filteredArticles = computed(() => {
  if (selectedCategory.value === 'all') return items
  return items.filter(a => a.category === selectedCategory.value)
})

// SEO 配置
usePageSeo({
  title: '写作专栏',
  description: '技术见解、产品思考、交易心得和创业经验。涵盖 Vue 3、React Native、TypeScript、期货交易、移动止损、xray 翻墙等热门话题。',
  url: `${config.public.siteUrl}writing/`,
  tags: ['技术博客', 'Vue 3', 'React Native', '期货交易', '独立开发', 'TypeScript'],
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '王叔走都是上坡的写作专栏',
    url: `${config.public.siteUrl}writing/`,
    description: '技术见解、产品思考、交易心得和创业经验',
    author: { '@type': 'Person', name: config.public.author },
    blogPost: items.slice(0, 10).map(a => ({
      '@type': 'BlogPosting',
      headline: a.title,
      url: `${config.public.siteUrl}writing/${a.id}/`,
      datePublished: a.date,
      keywords: a.tags.join(','),
      articleSection: a.category,
    })),
  },
})
</script>

<template>
  <div class="pt-24 pb-20 px-6">
    <div class="max-w-6xl mx-auto">
      <Breadcrumb :items="[
        { name: '首页', url: '/' },
        { name: '写作专栏', url: '/writing' }
      ]" />

      <div class="mb-12 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-4xl md:text-4xl font-medium mb-4">写作专栏</h1>
          <p class="text-xl text-gray-600">
            分享技术见解、产品思考和创业经验
          </p>
        </div>
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors text-sm"
        >
          <Rss class="w-4 h-4" />
          RSS 订阅
        </a>
      </div>

      <div class="mb-12 flex flex-wrap gap-3">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-full transition-all',
            selectedCategory === category
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ category === 'all' ? '全部' : category }}
        </button>
      </div>

      <div v-if="filteredArticles.length === 0" class="text-center py-20">
        <p class="text-gray-600">暂无文章</p>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-8">
        <NuxtLink
          v-for="article in filteredArticles"
          :key="article._path"
          :to="article._path"
          class="group"
        >
          <article class="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
            <div class="mb-4">
              <span class="px-3 py-1 bg-gray-900/5 text-gray-700 text-sm rounded-full">
                {{ article.category }}
              </span>
            </div>

            <h2 class="text-2xl font-medium mb-3 group-hover:text-gray-600 transition-colors">
              {{ article.title }}
            </h2>

            <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <time :datetime="article.date">{{ article.date }}</time>
              <span class="flex items-center gap-1">
                <Clock class="w-4 h-4" />
                {{ article.readTime }}
              </span>
            </div>

            <p class="text-gray-600 leading-relaxed mb-6 flex-1">
              {{ article._excerpt }}
            </p>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in article.tags"
                :key="tag"
                class="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded"
              >
                <Tag class="w-3 h-3" />
                {{ tag }}
              </span>
            </div>
          </article>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
