<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-vue-next'

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

interface ArticleDetail extends ArticleListItem {
  content: string
}

const route = useRoute()
const id = route.params.id as string

const { data: article } = await useFetch<ArticleDetail>(`/api/articles/${id}`)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: '文章未找到' })
}

const { data: allArticles } = await useFetch<ArticleListItem[]>('/api/articles')
const articles = allArticles.value || []

const relatedArticles = computed(() => {
  if (!article.value) return []
  return articles
    .filter(a => a.category === article.value!.category && a.id !== id)
    .slice(0, 3)
    .map(a => ({ ...a, _path: `/writing/${a.id}` }))
})
</script>

<template>
  <div class="pt-24 pb-20 px-6">
    <div class="max-w-4xl mx-auto">
      <NuxtLink
        to="/writing"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft class="w-4 h-4" />
        返回文章列表
      </NuxtLink>

      <article>
        <header class="mb-12">
          <div class="mb-4">
            <span class="px-4 py-2 bg-gray-900/5 text-gray-700 rounded-full">
              {{ article.category }}
            </span>
          </div>

          <h1 class="text-4xl md:text-5xl font-medium mb-6 leading-tight">
            {{ article.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-6 text-gray-600 pb-6 border-b border-gray-200">
            <div class="flex items-center gap-2">
              <Calendar class="w-4 h-4" />
              <span>{{ article.date }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Clock class="w-4 h-4" />
              <span>{{ article.readTime }}阅读</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mt-6">
            <span
              v-for="(tag, i) in article.tags"
              :key="i"
              class="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 text-sm rounded-lg"
            >
              <Tag class="w-3 h-3" />
              {{ tag }}
            </span>
          </div>
        </header>

        <div class="prose prose-lg max-w-none" v-html="article.content"></div>
      </article>

      <section v-if="relatedArticles.length > 0" class="mt-16 pt-12 border-t border-gray-200">
        <h2 class="text-2xl font-medium mb-8">相关文章</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="relatedArticle in relatedArticles"
            :key="relatedArticle._path"
            :to="relatedArticle._path"
            class="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group"
          >
            <div class="mb-3">
              <span class="px-2 py-1 bg-gray-900/5 text-gray-600 text-xs rounded">
                {{ relatedArticle.category }}
              </span>
            </div>
            <h3 class="text-lg font-medium mb-2 group-hover:text-gray-600 transition-colors">
              {{ relatedArticle.title }}
            </h3>
            <p class="text-sm text-gray-600 line-clamp-2">
              {{ relatedArticle._excerpt }}
            </p>
          </NuxtLink>
        </div>
      </section>

      <div class="mt-12 text-center">
        <NuxtLink
          to="/writing"
          class="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-full hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          查看更多文章
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  color: #374151;
  line-height: 1.75;
}
.prose :deep(h1) { font-size: 2.25rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; line-height: 1.3; color: #111827; }
.prose :deep(h2) { font-size: 1.875rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; line-height: 1.3; color: #111827; }
.prose :deep(h3) { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; line-height: 1.4; color: #111827; }
.prose :deep(p) { margin-bottom: 1.25rem; line-height: 1.75; }
.prose :deep(ul), .prose :deep(ol) { margin-top: 1rem; margin-bottom: 1rem; padding-left: 1.5rem; }
.prose :deep(li) { margin-bottom: 0.5rem; line-height: 1.75; }
.prose :deep(code) { background-color: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.375rem; font-size: 0.875em; font-family: 'Monaco', 'Menlo', 'Courier New', monospace; }
.prose :deep(pre) { background-color: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1.5rem 0; }
.prose :deep(pre code) { background-color: transparent; padding: 0; color: inherit; font-size: 0.875rem; }
.prose :deep(hr) { margin: 1.5rem 0; border-color: #e5e7eb; }
.prose :deep(strong) { font-weight: 600; color: #111827; }
.prose :deep(a) { color: #2563eb; text-decoration: underline; }
.prose :deep(a:hover) { color: #1d4ed8; }
.prose :deep(blockquote) { border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 1.5rem 0; color: #6b7280; font-style: italic; }
.prose :deep(table) { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
.prose :deep(th), .prose :deep(td) { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
.prose :deep(th) { background-color: #f9fafb; font-weight: 600; }
</style>
