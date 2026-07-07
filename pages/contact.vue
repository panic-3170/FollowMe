<script setup lang="ts">
import {
  Mail,
  User,
  Building2,
  ShoppingBag,
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Check,
  Plus,
} from 'lucide-vue-next'
import { socialGroups } from '~/data/socials'
import { usePageSeo } from '~/composables/usePageSeo'

const config = useRuntimeConfig()
const EMAIL = 'panic3170@gmail.com'

usePageSeo({
  title: '联系 · 全网账号',
  description: `联系 ${config.public.author || '陵下书生'} 的所有方式：邮箱、个人 IP 账号（国内外）、品牌 / 店铺账号、店铺链接（国内外）。一站式触达。`,
  url: `${config.public.siteUrl}contact/`,
  tags: ['联系', '社交账号', '个人 IP', '品牌账号', '店铺链接', '微信公众号', 'GitHub', 'Twitter', 'Shopify', '独立站'],
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${config.public.siteUrl}contact/`,
    mainEntity: {
      '@type': 'Person',
      name: config.public.author || '陵下书生',
      email: EMAIL,
      sameAs: socialGroups
        .flatMap(g => g.links)
        .filter(l => l.status === 'active')
        .map(l => l.url),
    },
  },
})

// 按类型分组,每组内按区域再分
const grouped = computed(() => {
  const types: Array<{ key: 'personal' | 'brand' | 'store'; title: string; icon: any; description: string }> = [
    { key: 'personal', title: '个人 IP 账号', icon: User, description: '个人创作、内容输出、技术分享' },
    { key: 'brand', title: '品牌 / 店铺账号', icon: Building2, description: '品牌官方账号、产品发布' },
    { key: 'store', title: '店铺链接', icon: ShoppingBag, description: '直接购买 / 访问入口' },
  ]
  return types.map(t => ({
    ...t,
    regions: socialGroups.filter(g => g.type === t.key),
  }))
})

// 总数统计
const stats = computed(() => {
  const all = socialGroups.flatMap(g => g.links)
  return {
    total: all.length,
    active: all.filter(l => l.status === 'active').length,
    pending: all.filter(l => l.status === 'pending').length,
  }
})

// 取平台名首字做 badge,中文 1 字 / 英文 1-2 字
function badgeText(platform: string) {
  // 提取中文字符
  const cn = platform.match(/[\u4e00-\u9fa5]/g)
  if (cn && cn.length) return cn[0]
  // 英文:取第一个单词首字母
  const en = platform.split(/[\s()]/)[0]
  return en.slice(0, 2).toUpperCase()
}
</script>

<template>
  <div class="pt-24 pb-20 px-6">
    <div class="max-w-5xl mx-auto">
      <Breadcrumb :items="[
        { name: '首页', url: '/' },
        { name: '联系 · 全网账号', url: '/contact' }
      ]" />

      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft class="w-4 h-4" />
        返回首页
      </NuxtLink>

      <header class="mb-12">
        <h1 class="text-4xl md:text-5xl font-medium mb-6">联系 · 全网账号</h1>
        <p class="text-xl text-gray-600 leading-relaxed">
          一站式触达所有渠道:邮箱、私人 IP、品牌账号、店铺链接 — 国内外都汇总在这里。
        </p>
        <p class="text-sm text-gray-500 mt-3 flex items-center gap-2">
          <Clock class="w-4 h-4" />
          本页持续维护中,新账号会逐步添加
        </p>
      </header>

      <!-- 统计概览 -->
      <div class="grid grid-cols-3 gap-4 mb-12">
        <div class="p-4 bg-white rounded-xl border border-gray-200 text-center">
          <div class="text-2xl font-medium">{{ stats.total }}</div>
          <div class="text-xs text-gray-500 mt-1">总平台数</div>
        </div>
        <div class="p-4 bg-white rounded-xl border border-gray-200 text-center">
          <div class="text-2xl font-medium text-emerald-600 flex items-center justify-center gap-1">
            <Check class="w-5 h-5" />
            {{ stats.active }}
          </div>
          <div class="text-xs text-gray-500 mt-1">已配置</div>
        </div>
        <div class="p-4 bg-white rounded-xl border border-gray-200 text-center">
          <div class="text-2xl font-medium text-gray-400 flex items-center justify-center gap-1">
            <Plus class="w-5 h-5" />
            {{ stats.pending }}
          </div>
          <div class="text-xs text-gray-500 mt-1">待添加</div>
        </div>
      </div>

      <!-- 邮箱(主联系方式) -->
      <section class="mb-16">
        <h2 class="text-2xl font-medium mb-4 flex items-center gap-2">
          <Mail class="w-6 h-6" />
          邮箱(主要联系方式)
        </h2>
        <a
          :href="`mailto:${EMAIL}`"
          class="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-medium">
              @
            </div>
            <div>
              <div class="font-medium text-lg">{{ EMAIL }}</div>
              <div class="text-sm text-gray-500">工作 / 合作 / 投稿 / 反馈,看到必回</div>
            </div>
          </div>
          <ArrowUpRight class="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
        </a>
      </section>

      <!-- 三大分组:个人 IP / 品牌 / 店铺 -->
      <section
        v-for="type in grouped"
        :key="type.key"
        class="mb-16"
      >
        <h2 class="text-2xl font-medium mb-2 flex items-center gap-2">
          <component :is="type.icon" class="w-6 h-6" />
          {{ type.title }}
        </h2>
        <p class="text-sm text-gray-500 mb-6">{{ type.description }}</p>

        <div
          v-for="region in type.regions"
          :key="region.title"
          class="mb-8 last:mb-0"
        >
          <h3 class="text-lg font-medium mb-4 flex items-center gap-2">
            <span class="text-gray-700">{{ region.title }}</span>
            <span class="text-xs text-gray-400">({{ region.links.length }})</span>
          </h3>
          <p class="text-sm text-gray-500 mb-4">{{ region.description }}</p>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <!-- 已配置 -->
            <a
              v-for="link in region.links.filter(l => l.status === 'active')"
              :key="link.platform"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-900 hover:shadow-md transition-all group"
            >
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {{ badgeText(link.platform) }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-medium text-sm flex items-center gap-1.5">
                  {{ link.platform }}
                  <Check class="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div class="text-xs text-gray-500 truncate">{{ link.username }}</div>
              </div>
              <ArrowUpRight class="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors flex-shrink-0" />
            </a>

            <!-- 待添加 -->
            <div
              v-for="link in region.links.filter(l => l.status === 'pending')"
              :key="link.platform"
              class="flex items-center gap-3 p-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200"
            >
              <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-medium flex-shrink-0">
                {{ badgeText(link.platform) }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-medium text-sm text-gray-500 flex items-center gap-1.5">
                  {{ link.platform }}
                  <span class="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">待添加</span>
                </div>
                <div class="text-xs text-gray-400">编辑 data/socials.ts 即可激活</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 底部说明 -->
      <section class="mt-16 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
        <h2 class="text-lg font-medium mb-2">📝 如何添加新平台</h2>
        <p class="text-sm text-gray-600 leading-relaxed mb-3">
          打开 <code class="px-1.5 py-0.5 bg-gray-100 rounded text-xs">data/socials.ts</code>,在对应分组下追加一条,例如:
        </p>
        <pre class="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>{ platform: '微信公众号', url: 'https://mp.weixin.qq.com/s/xxx', username: '陵下书生', status: 'active' }</code></pre>
        <p class="text-xs text-gray-500 mt-3">
          改完保存,推到 main 分支,等部署完成即可上线(约 1-2 分钟)。无需改任何页面代码。
        </p>
      </section>
    </div>
  </div>
</template>
