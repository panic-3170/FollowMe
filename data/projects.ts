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
    id: 'codesnap',
    name: 'CodeSnap',
    icon: Monitor,
    description: '跨平台代码截图工具，支持多种主题和导出格式',
    tags: ['Electron', 'Vue', 'Node.js'],
    status: '开发中',
    users: '5K+ 下载',
    fullDescription: 'CodeSnap 是一款专业的代码截图工具，为开发者提供美观、高质量的代码分享图片。支持30+种编程语言的语法高亮，多种主题风格，以及灵活的导出选项。',
    features: [
      '支持30+种编程语言的语法高亮',
      '10+种精美主题，支持自定义主题',
      '多种导出格式（PNG, SVG, PDF）',
      '可调整窗口样式、字体和间距',
      '快捷键操作，提升工作效率',
      '代码片段管理和收藏功能'
    ],
    techStack: [
      { category: '框架', items: ['Electron', 'Vue 3', 'Vite', 'Pinia'] },
      { category: '核心功能', items: ['Highlight.js', 'html2canvas', 'FileSaver.js'] },
      { category: '构建工具', items: ['TypeScript', 'SCSS', 'ESLint'] }
    ],
    github: 'https://github.com/example/codesnap'
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