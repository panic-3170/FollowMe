/**
 * 服务端专用数据：sitemap 等构建时工具使用
 * 这里不能引入任何客户端依赖（如 vue、lucide-vue-next）
 */
export const articleIds: { id: string; date: string }[] = [
  { id: 'indie-developer-journey', date: '2026-05-15' },
  { id: 'vue3-composition-api', date: '2026-04-28' },
  { id: 'react-native-performance', date: '2026-04-15' },
  { id: 'product-design-principles', date: '2026-03-20' },
  { id: 'git-workflow-best-practices', date: '2026-03-10' },
  { id: 'typescript-tips', date: '2026-02-25' }
]

export const projectIds: string[] = [
  'TimeCalendar',
  'trendradar',
  'webflow'
]
