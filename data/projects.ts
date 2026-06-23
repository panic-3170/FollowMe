import type { Component } from 'vue'
import { AppWindow, Wifi, Globe, Wrench } from 'lucide-vue-next'

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
    link: 'https://panic-3170.github.io/TrendRadar/',
    github: 'https://github.com/panic-3170/TrendRadar'
  },
  {
    id: 'webflow',
    name: 'WiFi 传输助手',
    icon: Wifi,
    description: '局域网 P2P 文件传输 / 即时通讯工具，无需联网，扫码即连',
    tags: ['Flutter', 'GetX', 'WebSocket', 'mobile_scanner'],
    status: '开发中 v1.0',
    users: '内部测试',
    fullDescription: 'WiFi 传输助手 是一款基于 Flutter + GetX 的局域网 P2P 文件传输与即时通讯工具。手机开启 HTTP/WebSocket 服务器，浏览器访问 IP:port 后自动生成二维码，App 扫码即可建立加密通道，支持文件互传、即时消息。**整个过程完全在局域网内进行，无需联网，隐私零泄露**。',
    features: [
      '零依赖传输：手机和电脑在同一 WiFi/热点下即可互传文件，无需云端、无需登录',
      '二维码扫码连接：Web 端自动生成连接二维码，App 端 mobile_scanner 扫描即连',
      'Token 鉴权：32 字符加密安全随机 Token，30 分钟自动失效，支持手动刷新',
      'WebSocket 实时通信：双向消息推送，毫秒级延迟',
      'Material Design 3 UI：现代化设计，跟随系统深色模式',
      '多平台支持：iOS / Android / macOS / Windows / Linux / Web 全平台覆盖',
      '局域网 IP 智能识别：自动检测 192.168.x.x / 10.x.x.x / 172.16-31.x.x 网段',
      '零依赖网页端：内置 HTML5 + CSS3 + Vanilla JS，浏览器打开即用'
    ],
    techStack: [
      { category: 'App 端', items: ['Flutter 3.x', 'Dart 3.7+', 'GetX 4.6'] },
      { category: '网络', items: ['dart:io HttpServer', 'WebSocket', 'shelf', 'shelf_web_socket'] },
      { category: '扫描 / 存储', items: ['mobile_scanner', 'qr_flutter', 'get_storage', 'path_provider', 'connectivity_plus'] },
      { category: 'Web 端', items: ['HTML5', 'CSS3', 'Vanilla JS', 'qrcode.js'] }
    ],
    link: '#',
    github: 'https://github.com/panic-3170/wifi-transfer-assistant'
  },
  {
    id: 'toolkit',
    name: 'ToolKit · 在线工具箱',
    icon: Wrench,
    description: '浏览器端图片格式转换工具集，WebP/HEIC/SVG ↔ PNG/JPG，100% 本地处理，文件零上传',
    tags: ['HTML5', 'Canvas API', 'WebAssembly', 'Client-side', '隐私优先'],
    status: '已上线',
    users: '公开访问',
    fullDescription: 'ToolKit.run 是一个**纯浏览器端**的免费在线图片格式转换工具集，主打隐私优先：所有图像处理完全在用户浏览器内完成，文件永不离开本地设备，无需注册、无需登录、无任何追踪。已上线 WebP → PNG / WebP → JPG 两款核心工具，即将推出 HEIC → JPG（iPhone 照片转通用格式）与 SVG → PNG（矢量图栅格化）。',
    features: [
      'WebP → PNG：保留透明通道，转换为通用 PNG 格式，100% 本地解码',
      'WebP → JPG：转换为带白底的 JPEG，体积更小、兼容性更强',
      'HEIC → JPG（即将上线）：iPhone HEIC 照片一键转通用 JPEG，无需安装额外软件',
      'SVG → PNG（即将上线）：矢量图任意分辨率栅格化，纯客户端渲染',
      '零上传架构：所有处理在浏览器内完成，文件永不上传服务器',
      '零注册零追踪：不需要账号、不收集邮箱、不写 Cookie',
      '跨平台兼容：任何现代浏览器（Chrome / Edge / Safari / Firefox）即开即用',
      '开源免费：源码开放，长期免费使用'
    ],
    techStack: [
      { category: '前端', items: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Tailwind CSS'] },
      { category: '图像处理', items: ['Canvas API', 'OffscreenCanvas', 'WebP 编解码', 'HEIC 解码（libheif-js）', 'SVG 栅格化'] },
      { category: '性能', items: ['WebAssembly', 'Web Workers', 'Stream API'] },
      { category: '部署', items: ['GitHub Pages', '自定义域名 kit.apppss.com', 'Cloudflare CDN'] }
    ],
    link: 'https://kit.apppss.com/',
    github: 'https://github.com/panic-3170/webp2png'
  }
]