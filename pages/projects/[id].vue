<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ExternalLink, Github, CheckCircle2 } from 'lucide-vue-next'
import { projects } from '~/data/projects'

const route = useRoute()
const project = computed(() => projects.find(p => p.id === route.params.id))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: '项目未找到' })
}
</script>

<template>
  <div class="pt-24 pb-20 px-6">
    <div class="max-w-4xl mx-auto">
      <NuxtLink
        to="/#projects"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft class="w-4 h-4" />
        返回项目列表
      </NuxtLink>

      <div class="mb-12">
        <div class="flex flex-col md:flex-row items-start gap-6 mb-6">
          <div class="p-4 bg-gray-900/5 rounded-2xl">
            <component :is="project.icon" class="w-12 h-12" />
          </div>
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h1 class="text-4xl md:text-5xl font-medium mb-3">{{ project.name }}</h1>
                <p class="text-xl text-gray-600">{{ project.description }}</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-3 mb-6">
              <span
                v-for="(tag, i) in project.tags"
                :key="i"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-4">
              <span :class="[
                'px-4 py-2 rounded-full',
                project.status === '已上线' ? 'bg-gray-900 text-white' : 'bg-white border-2 border-gray-200 text-gray-900'
              ]">
                {{ project.status }}
              </span>
              <span class="text-gray-600">{{ project.users }}</span>
              <a
                v-if="project.link"
                :href="project.link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <ExternalLink class="w-4 h-4" />
                访问网站
              </a>
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-full hover:bg-gray-50 transition-colors"
              >
                <Github class="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-12">
        <section>
          <h2 class="text-2xl font-medium mb-4">项目简介</h2>
          <p class="text-lg text-gray-600 leading-relaxed">
            {{ project.fullDescription }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-medium mb-6">核心功能</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div
              v-for="(feature, index) in project.features"
              :key="index"
              class="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200"
            >
              <CheckCircle2 class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span class="text-gray-700">{{ feature }}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-medium mb-6">技术栈</h2>
          <div class="space-y-6">
            <div
              v-for="(category, index) in project.techStack"
              :key="index"
              class="p-6 bg-white rounded-xl border border-gray-200"
            >
              <h3 class="text-lg font-medium mb-4">{{ category.category }}</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(item, i) in category.items"
                  :key="i"
                  class="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="pt-8 border-t border-gray-200">
          <h2 class="text-2xl font-medium mb-6">更多项目</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <NuxtLink
              v-for="otherProject in projects.filter(p => p.id !== project.id).slice(0, 2)"
              :key="otherProject.id"
              :to="`/projects/${otherProject.id}`"
              class="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group"
            >
              <div class="flex items-center gap-4 mb-3">
                <div class="p-2 bg-gray-900/5 rounded-lg">
                  <component :is="otherProject.icon" class="w-5 h-5" />
                </div>
                <h3 class="text-lg font-medium group-hover:text-gray-600 transition-colors">
                  {{ otherProject.name }}
                </h3>
              </div>
              <p class="text-gray-600 text-sm">
                {{ otherProject.description }}
              </p>
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>