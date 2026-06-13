import type { Component } from 'vue'
import { AppWindow, Monitor, Globe } from 'lucide-vue-next'

export interface Project {
  id: string
  name: string
  icon: Component
  description: string
  tags: string[]
  status: string
  users: string
  fullDescription: string
  features: string[]
  techStack: { category: string; items: string[] }[]
  images?: string[]
  link?: string
  github?: string
}

export const projects: Project[] = [
  {
    id: 'TimeCalendar',
    name: '时光日历',
    icon: AppWindow,
    description: '移动端时间管理应用，主要功能包括时间规划、事件记录、ai复盘等功能',
    tags: ['flutter', 'Getx', 'Dart'],
    status: '已上线v1.0',
    users: '1K+ 用户',
    fullDescription: 'TimeCalendar 是一款专为现代工作者设计的时间管理应用。通过直观的界面和简单操作，帮助用户高效管理日常任务，提升工作生活效率。',
    features: [
      '时间规划功能，用户可查看一年的时间流失情况',
      'AI复盘功能，用户可以对话AI，自动生成当日复盘报告',
      '任务优先级管理和分类标签',
      '事件记录功能，记录重要事件',
      '数据可视化，追踪工作进度',
      '离线模式支持，无网络使用'
    ],
    techStack: [
      { category: '前端', items: ['flutter', 'Getx', 'Dart'] },
      { category: '后端', items: ['none'] },
      { category: '工具', items: ['sqflite', 'file_picker', 'fl_chart', 'sticky_headers'] }
    ],
    link: '#',
    github: 'https://github.com/panic-3170/date'
  },
   {
    id: 'trendradar',
    name: '趋势雷达',
    icon: Globe,
    description: '面向自媒体人与求职者的全网趋势信息聚合导航页',
    tags: ['Nuxt.js', 'Vue 3', 'Tailwind CSS'],
    status: '已上线',
    users: '公开访问',
    fullDescription: '趋势雷达（TrendRadar）是一个轻量级的全网趋势信息聚合导航页，通过 7 大分类整合 30+ 精选站点，让用户每天 30 分钟内吃透全网趋势，告别在数十个平台之间来回跳转的低效。',
    features: [
      '7 大分类聚合 30+ 精选站点（Reddit 生态、趋势监控、产品与技术、深度内容、数据分析、社媒聚合、中文聚合）',
      '智能搜索，快速定位目标站点',
      '一键收藏常用站点，搭建个人常用导航',
      '深色模式，自动跟随系统主题',
      '响应式设计，完美适配桌面与移动设备',
      '中英文双语支持，自由切换'
    ],
    techStack: [
      { category: '前端', items: ['Nuxt.js 3', 'Vue 3', 'Tailwind CSS'] },
      { category: '部署', items: ['GitHub Pages'] },
      { category: '分析', items: ['51.la', 'Google Analytics'] }
    ],
    link: 'https://www.apppss.com',
    github: 'https://github.com/panic-3170/TrendRadar'
  },
  {
    id: 'webflow',
    name: 'WebFlow',
    icon: Globe,
    description: '可视化网页编辑器，无需代码即可构建专业网站',
    tags: ['React', 'Node.js', 'MongoDB'],
    status: '已上线',
    users: '20K+ 用户',
    fullDescription: 'WebFlow 是一款强大的可视化网页编辑器，让任何人都能轻松创建专业网站。拖放式界面、丰富的组件库、实时预览功能，让网页设计变得简单而有趣。',
    features: [
      '所见即所得的编辑体验',
      '丰富的预制组件库',
      '响应式设计，适配各种设备',
      '自定义动画和交互效果',
      '一键导出代码或直接发布',
      '团队协作和版本控制'
    ],
    techStack: [
      { category: '前端', items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
      { category: '后端', items: ['Node.js', 'Express', 'MongoDB', 'AWS S3'] },
      { category: '基础设施', items: ['Docker', 'Kubernetes', 'CI/CD'] }
    ],
    link: 'https://webflow.example.com'
  }
]