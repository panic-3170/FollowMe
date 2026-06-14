<script setup lang="ts">
import { ChevronRight, Home } from 'lucide-vue-next'
import { buildBreadcrumbJsonLd } from '~/composables/usePageSeo'

interface Crumb {
  name: string
  url: string
}

interface Props {
  items: Crumb[]
}

const props = defineProps<Props>()
const config = useRuntimeConfig()

// 在 head 中注入 BreadcrumbList Schema
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(buildBreadcrumbJsonLd(props.items)),
    },
  ],
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="text-sm text-gray-500 mb-6">
    <ol class="flex items-center flex-wrap gap-1">
      <li class="flex items-center">
        <NuxtLink to="/" class="flex items-center hover:text-gray-900 transition-colors">
          <Home class="w-4 h-4" />
        </NuxtLink>
      </li>
      <template v-for="(item, index) in items" :key="item.url">
        <li class="flex items-center">
          <ChevronRight class="w-3.5 h-3.5 mx-1 text-gray-400" />
          <NuxtLink
            v-if="index < items.length - 1"
            :to="item.url"
            class="hover:text-gray-900 transition-colors"
          >
            {{ item.name }}
          </NuxtLink>
          <span v-else class="text-gray-900 font-medium" aria-current="page">
            {{ item.name }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>
