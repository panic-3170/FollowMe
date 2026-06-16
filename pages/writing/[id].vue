<script setup lang="ts">
import { ArrowLeft, Clock, Calendar, Tag, Share2, Twitter, Github, User, Edit3 } from 'lucide-vue-next'
import { usePageSeo, buildArticleJsonLd, buildFaqJsonLd } from '~/composables/usePageSeo'

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

interface Faq {
  question: string
  answer: string
}

interface ArticleDetail extends ArticleListItem {
  content: string
  modifiedAt?: string
  _faqs?: Faq[]
}

const route = useRoute()
const config = useRuntimeConfig()
const id = route.params.id as string

const { data: article } = await useFetch<ArticleDetail>(`/api/articles/${id}`)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: '文章未找到' })
}

const { data: allArticles } = await useFetch<ArticleListItem[]>('/api/articles')
const articles = allArticles.value || []

// 相关文章（同分类，排除自己）
const relatedArticles = computed(() => {
  if (!article.value) return []
  return articles
    .filter(a => a.category === article.value!.category && a.id !== id)
    .slice(0, 3)
    .map(a => ({ ...a, _path: `/writing/${a.id}` }))
})

// 分享 URL
const fullUrl = computed(() => `${config.public.siteUrl}writing/${id}`)
const shareText = computed(() => `${article.value?.title} | ${config.public.siteName}`)

// 独立修改日期（frontmatter 显式指定 modifiedAt 才会有值）
const modifiedDate = computed(() => article.value?.modifiedAt || article.value?.date)
const showModified = computed(() => !!article.value?.modifiedAt && article.value.modifiedAt !== article.value?.date)

// SEO 配置
// 同时注入 Article + FAQPage（若文章有 FAQ 区段）
const jsonLdBlocks = computed<Record<string, any>[]>(() => {
  const blocks: Record<string, any>[] = [buildArticleJsonLd(article.value!, fullUrl.value)]
  if (article.value?._faqs && article.value._faqs.length > 0) {
    blocks.push(buildFaqJsonLd(article.value._faqs))
  }
  return blocks
})

usePageSeo({
  title: article.value.title,
  description: article.value._excerpt || article.value.title,
  type: 'article',
  url: fullUrl.value,
  publishedAt: article.value.date,
  modifiedAt: modifiedDate.value,
  author: config.public.author,
  tags: article.value.tags,
  category: article.value.category,
  jsonLd: jsonLdBlocks.value,
})
</script>

<template>
  <div class="pt-24 pb-20 px-6">
    <div class="max-w-4xl mx-auto">
      <Breadcrumb :items="[
        { name: '首页', url: '/' },
        { name: '文章', url: '/writing' },
        { name: article.title, url: `/writing/${article.id}` }
      ]" />

      <NuxtLink
        to="/writing"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft class="w-4 h-4" />
        返回文章列表
      </NuxtLink>

      <article itemscope itemtype="https://schema.org/Article">
        <header class="mb-12">
          <div class="mb-4">
            <span class="px-4 py-2 bg-gray-900/5 text-gray-700 rounded-full" itemprop="articleSection">
              {{ article.category }}
            </span>
          </div>

          <h1 class="text-4xl md:text-5xl font-medium mb-6 leading-tight" itemprop="headline">
            {{ article.title }}
          </h1>

          <p class="sr-only" itemprop="description">{{ article._excerpt || article.title }}</p>

          <div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-600 pb-6 border-b border-gray-200">
            <!-- 发布日期 -->
            <div class="flex items-center gap-2">
              <Calendar class="w-4 h-4" />
              <time :datetime="article.date" itemprop="datePublished">{{ article.date }}</time>
            </div>

            <!-- 阅读时长 -->
            <div class="flex items-center gap-2">
              <Clock class="w-4 h-4" />
              <span>{{ article.readTime }}阅读</span>
            </div>

            <!-- 作者（E-E-A-T 可见化） -->
            <div
              class="flex items-center gap-2"
              itemprop="author"
              itemscope
              itemtype="https://schema.org/Person"
            >
              <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-medium">
                <User class="w-3.5 h-3.5" />
              </span>
              <NuxtLink
                to="/about"
                class="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                itemprop="name"
                :title="`关于 ${config.public.author}`"
              >
                {{ config.public.author }}
              </NuxtLink>
              <meta itemprop="url" :content="config.public.siteUrl" />
              <a
                href="https://github.com/panic-3170"
                target="_blank"
                rel="noopener noreferrer author"
                class="text-gray-400 hover:text-gray-900 transition-colors"
                itemprop="sameAs"
                aria-label="作者 GitHub"
              >
                <Github class="w-4 h-4" />
              </a>
              <a
                href="https://x.com/theruoshui3000"
                target="_blank"
                rel="noopener noreferrer author"
                class="text-gray-400 hover:text-gray-900 transition-colors"
                itemprop="sameAs"
                aria-label="作者 X / Twitter"
              >
                <Twitter class="w-4 h-4" />
              </a>
            </div>

            <!-- 最近更新（仅当与发布日期不同时显示） -->
            <div v-if="showModified" class="flex items-center gap-2 text-gray-500">
              <Edit3 class="w-4 h-4" />
              <span>更新于</span>
              <time :datetime="modifiedDate">{{ modifiedDate }}</time>
              <meta itemprop="dateModified" :content="modifiedDate" />
            </div>
            <meta v-else itemprop="dateModified" :content="article.date" />
          </div>

          <div class="flex flex-wrap gap-2 mt-6">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 text-sm rounded-lg"
            >
              <Tag class="w-3 h-3" />
              {{ tag }}
            </span>
          </div>
        </header>

        <div class="prose prose-lg max-w-none" itemprop="articleBody" v-html="article.content"></div>
      </article>

      <!-- 分享按钮 -->
      <section class="mt-12 pt-8 border-t border-gray-200">
        <h2 class="text-lg font-medium mb-4 flex items-center gap-2">
          <Share2 class="w-5 h-5" />
          分享这篇文章
        </h2>
        <div class="flex flex-wrap gap-3">
          <a
            :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Twitter class="w-4 h-4" />
            分享到 X
          </a>
          <a
            :href="`https://github.com/`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Github class="w-4 h-4" />
            讨论
          </a>
        </div>
      </section>

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
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
