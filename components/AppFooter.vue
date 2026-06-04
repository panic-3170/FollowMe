<script setup lang="ts">
import { Github } from 'lucide-vue-next'
</script>

<template>
  <footer class="py-12 px-6 border-t border-gray-200 bg-white">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="text-center md:text-left">
          <div class="text-xl mb-2 font-medium">王叔走都是上坡</div>
          <p class="text-sm text-gray-600">独立开发者 · 用代码创造价值</p>
        </div>

        <div class="flex items-center gap-6">
          <a href="mailto:panic3170@gmail.com" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            panic3170@gmail.com
          </a>
          <div class="w-px h-4 bg-gray-200"></div>
          <div class="flex items-center gap-3">
            <a href="https://github.com/panic-3170" target="_blank" rel="noopener noreferrer" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Github class="w-5 h-5" />
            </a>
            <a href="https://x.com/theruoshui3000" target="_blank" rel="noopener noreferrer" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 my-6"></div>

      <div class="text-center text-sm text-gray-600">
        © 2026 王叔走都是上坡. All rights reserved.
      </div>
    </div>
  </footer>
</template>