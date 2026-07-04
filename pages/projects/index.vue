<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink, Folder, ArrowLeft } from 'lucide-vue-next'
import { projects } from '~/data/projects'
import { usePageSeo } from '~/composables/usePageSeo'

// 按项目标签分组:同一个项目可能出现在多个 tag 组里
const groupedByTag = computed(() => {
  const map = new Map<string, typeof projects>()
  projects.forEach((p) => {
    p.tags.forEach((tag) => {
      if (!map.has(tag)) map.set(tag, [])
      map.get(tag)!.push(p)
    })
  })
  // 按项目数量降序、相同数量按标签名升序,保持稳定排序
  return Array.from(map.entries())
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(([tag, list]) => ({ tag, list }))
})

const totalCount = computed(() => projects.length)
const tagCount = computed(() => groupedByTag.value.length)

usePageSeo({
  title: '所有项目',
  description: `收录 ${totalCount.value} 个独立开发项目,按 ${tagCount.value} 个技术标签分类,涵盖 Flutter、Vue 3、Nuxt.js、工具类产品等多个方向。`,
  type: 'website',
  url: `${useRuntimeConfig().public.siteUrl}projects/`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '所有项目',
    description: '按技术标签分类的独立开发项目合集',
    hasPart: projects.map((p) => ({
      '@type': 'SoftwareApplication',
      name: p.name,
      description: p.description,
      applicationCategory: 'WebApplication',
      keywords: p.tags.join(','),
    })),
  },
})
</script>

<template>
  <div class="pt-24 pb-20 px-6">
    <div class="max-w-7xl mx-auto">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft class="w-4 h-4" />
        返回首页
      </NuxtLink>

      <div class="mb-16">
        <h1 class="text-4xl md:text-5xl font-medium mb-4 tracking-tight">所有项目</h1>
        <p class="text-lg text-gray-600">
          共 {{ totalCount }} 个项目,按 {{ tagCount }} 个技术标签分类。
        </p>
      </div>

      <div class="space-y-16">
        <section v-for="group in groupedByTag" :key="group.tag">
          <div class="flex items-center gap-3 mb-6">
            <Folder class="w-5 h-5 text-gray-400" />
            <h2 class="text-2xl font-medium">{{ group.tag }}</h2>
            <span class="px-2.5 py-0.5 text-sm text-gray-500 bg-gray-100 rounded-full">
              {{ group.list.length }}
            </span>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="project in group.list"
              :key="project.id"
              :to="`/projects/${project.id}/`"
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
        </section>
      </div>
    </div>
  </div>
</template>
