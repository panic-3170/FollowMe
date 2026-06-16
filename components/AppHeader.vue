<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Github, Mail, Menu, X } from 'lucide-vue-next'

const route = useRoute()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const isHome = computed(() => route.path === '/')

const onScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function smoothScrollTo(id: string) {
  if (!isHome.value) {
    window.location.href = `/#${id}`
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.pageYOffset - 80
  window.scrollTo({ top, behavior: 'smooth' })
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav :class="[
    'fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-gray-200',
    scrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm' : 'bg-white/80 backdrop-blur-md'
  ]">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <NuxtLink to="/" class="text-xl tracking-tight font-medium hover:text-gray-600 transition-colors">
          王哪走都是上坡
        </NuxtLink>
        <div class="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <template v-if="isHome">
            <button @click="smoothScrollTo('about')" class="hover:text-gray-900 transition-colors">
              关于
            </button>
            <button @click="smoothScrollTo('projects')" class="hover:text-gray-900 transition-colors">
              项目
            </button>
            <button @click="smoothScrollTo('writing')" class="hover:text-gray-900 transition-colors">
              写作
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/#about" class="hover:text-gray-900 transition-colors">
              关于
            </NuxtLink>
            <NuxtLink to="/#projects" class="hover:text-gray-900 transition-colors">
              项目
            </NuxtLink>
            <NuxtLink to="/writing/" class="hover:text-gray-900 transition-colors">
              写作
            </NuxtLink>
          </template>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="hidden md:flex items-center gap-3">
          <a href="https://github.com/panic-3170" target="_blank" rel="noopener noreferrer" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Github class="w-5 h-5" />
          </a>
          <a href="https://x.com/theruoshui3000" target="_blank" rel="noopener noreferrer" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="mailto:panic3170@gmail.com" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Mail class="w-5 h-5" />
          </a>
        </div>
        <button
          class="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <X v-if="mobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
      <div class="px-6 py-4 space-y-4">
        <template v-if="isHome">
          <button @click="smoothScrollTo('about')" class="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors">
            关于
          </button>
          <button @click="smoothScrollTo('projects')" class="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors">
            项目
          </button>
          <button @click="smoothScrollTo('writing')" class="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors">
            写作
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/#about" class="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors" @click="mobileMenuOpen = false">
            关于
          </NuxtLink>
          <NuxtLink to="/#projects" class="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors" @click="mobileMenuOpen = false">
            项目
          </NuxtLink>
          <NuxtLink to="/writing/" class="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors" @click="mobileMenuOpen = false">
            写作
          </NuxtLink>
        </template>
        <div class="border-t border-gray-200 pt-4">
          <div class="flex items-center gap-3">
            <a href="https://github.com/panic-3170" target="_blank" rel="noopener noreferrer" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Github class="w-5 h-5" />
            </a>
            <a href="https://x.com/theruoshui3000" target="_blank" rel="noopener noreferrer" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="mailto:panic3170@gmail.com" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Mail class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>