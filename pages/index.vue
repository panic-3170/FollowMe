<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ExternalLink, ArrowUp } from 'lucide-vue-next'
import { projects } from '~/data/projects'

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

const { data: articlesData } = await useFetch<ArticleListItem[]>('/api/articles')
const articles = articlesData.value || []

const showScrollTop = ref(false)

const onScroll = () => {
  showScrollTop.value = window.scrollY > 500
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function smoothScrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.pageYOffset - 80
  window.scrollTo({ top, behavior: 'smooth' })
}

const featuredArticles = articles
  .slice(0, 3)
  .map(a => ({ ...a, _path: `/writing/${a.id}` }))
</script>

<template>
  <div>
    <section class="pt-32 pb-20 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="max-w-3xl">
          <div class="inline-block px-4 py-1.5 bg-gray-900/5 rounded-full mb-6 animate-in">
            <span class="text-sm text-gray-600">独立开发者 / 全栈工程师</span>
          </div>
          <h1 class="text-4xl md:text-6xl mb-6 tracking-tight font-medium animate-in delay-100">
            创造有价值的<br />数字产品
          </h1>
          <p class="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 animate-in delay-200">
            专注于构建优雅、高效的应用程序。从概念到实现，<br class="hidden md:block" />
            用代码将想法变为现实，为用户创造卓越体验。
          </p>
          <div class="flex flex-col sm:flex-row items-center gap-4 animate-in delay-300">
            <button
              @click="smoothScrollTo('projects')"
              class="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors w-full sm:w-auto font-medium"
            >
              查看项目
            </button>
            <button
              @click="() => window.location.href = 'mailto:hello@example.com'"
              class="px-8 py-3 bg-white border border-gray-200 text-gray-900 rounded-full hover:bg-gray-50 transition-colors w-full sm:w-auto font-medium"
            >
              联系我
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="py-20 px-6 bg-white/50">
      <div class="max-w-7xl mx-auto">
        <div class="max-w-4xl">
          <h2 class="text-3xl md:text-4xl mb-8 tracking-tight font-medium">关于我</h2>
          <div class="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              你好，我是王叔。2015年毕业开封大学计算机科学专业，在郑州多家互联网公司担任前端、后端、全栈工程师等职务期间，积累了丰富的产品开发经验。
            </p>
            <p>
              2023年，我决定转型为独立开发者，追求更大的创作自由。这三年来，我独立开发并上线了多款应用，涵盖移动端、桌面端和Web平台，累计服务多家中小企业和个人用户。
            </p>
            <p>
              我相信优秀的产品源于对细节的极致追求。在开发过程中，我注重用户体验、性能优化和代码质量，力求打造既美观又实用的应用。
            </p>
            <div class="border-t border-gray-200 my-8"></div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div class="text-3xl mb-2 font-medium">10+</div>
                <div class="text-sm text-gray-600">年经验</div>
              </div>
              <div>
                <div class="text-3xl mb-2 font-medium">15+</div>
                <div class="text-sm text-gray-600">项目上线</div>
              </div>
              <div>
                <div class="text-3xl mb-2 font-medium">30K+</div>
                <div class="text-sm text-gray-600">总用户数</div>
              </div>
              <div>
                <div class="text-3xl mb-2 font-medium">400+</div>
                <div class="text-sm text-gray-600">写作文章</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="projects" class="py-20 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-12">
          <h2 class="text-3xl md:text-4xl mb-4 tracking-tight font-medium">精选项目</h2>
          <p class="text-base md:text-lg text-gray-600">
            一些小小的作品，覆盖多个平台和技术栈
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="project in projects"
            :key="project.id"
            :to="`/projects/${project.id}`"
            class="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-gray-900/5 rounded-xl">
                <component :is="project.icon" class="w-6 h-6" />
              </div>
              <ExternalLink class="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h3 class="text-2xl mb-2 font-medium">{{ project.name }}</h3>
            <p class="text-gray-600 mb-4 leading-relaxed">
              {{ project.description }}
            </p>

            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="(tag, i) in project.tags"
                :key="i"
                class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">{{ project.users }}</span>
              <span :class="[
                'px-3 py-1 text-sm rounded-full',
                project.status === '已上线' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-900'
              ]">
                {{ project.status }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="writing" class="py-20 px-6 bg-white/50">
      <div class="max-w-7xl mx-auto">
        <div class="mb-12">
          <h2 class="text-3xl md:text-4xl mb-4 tracking-tight font-medium">写作专栏</h2>
          <p class="text-base md:text-lg text-gray-600">
            分享技术见解、产品思考和创业经验
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="article in articles"
            :key="article._path"
            :to="article._path"
            class="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
          >
            <div class="mb-4">
              <span class="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-sm rounded-full">
                {{ article.category }}
              </span>
              <h3 class="text-xl mb-2 mt-3 group-hover:text-gray-600 transition-colors font-medium">
                {{ article.title }}
              </h3>
              <p class="text-sm text-gray-500 mb-3">
                {{ article.date }}
              </p>
            </div>
            <p class="text-gray-600 leading-relaxed">
              {{ article._excerpt }}
            </p>
          </NuxtLink>
        </div>

        <div class="text-center mt-12">
          <NuxtLink
            to="/writing"
            class="inline-block px-8 py-3 bg-white border border-gray-200 text-gray-900 rounded-full hover:bg-gray-50 transition-colors font-medium"
          >
            查看全部文章
          </NuxtLink>
        </div>
      </div>
    </section>

    <div v-if="showScrollTop" class="fixed bottom-8 right-8 z-40">
      <button
        @click="() => window.scrollTo({ top: 0, behavior: 'smooth' })"
        class="p-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      >
        <ArrowUp class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>