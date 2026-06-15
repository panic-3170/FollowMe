import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { marked } from 'marked'

export interface Article {
  id: string
  title: string
  date: string
  category: string
  readTime: string
  tags: string[]
  content: string
  _excerpt: string
  _path: string
}

// 配置 marked 选项
marked.setOptions({
  gfm: true,
  breaks: false
})

export function readArticles(): Article[] {
  const articlesDir = join(process.cwd(), 'content', 'articles')
  const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'))

  return files.map(file => {
    const filePath = join(articlesDir, file)
    const stat = statSync(filePath)
    const content = readFileSync(filePath, 'utf-8')
    const parsed = parseMarkdown(content, file, stat.mtime)

    return {
      ...parsed,
      id: file.replace('.md', ''),
      _path: `/writing/${file.replace('.md', '')}`
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function readArticle(id: string): Article | null {
  const filePath = join(process.cwd(), 'content', 'articles', `${id}.md`)
  try {
    const stat = statSync(filePath)
    const content = readFileSync(filePath, 'utf-8')
    const parsed = parseMarkdown(content, `${id}.md`, stat.mtime)
    return {
      ...parsed,
      id,
      _path: `/writing/${id}`
    }
  } catch {
    return null
  }
}

/**
 * 智能解析 Markdown：
 * 1. 优先解析 Frontmatter
 * 2. 缺失字段自动从内容/文件元数据补全
 */
function parseMarkdown(content: string, filename: string, mtime: Date) {
  const lines = content.split('\n')
  let meta: Record<string, any> = {}
  let body = content

  // 尝试解析 Frontmatter
  if (lines[0]?.trim() === '---') {
    const frontmatterEnd = lines.indexOf('---', 1)
    if (frontmatterEnd > 0) {
      const frontmatter = lines.slice(1, frontmatterEnd).join('\n')
      body = lines.slice(frontmatterEnd + 1).join('\n')
      meta = parseFrontmatter(frontmatter)
    }
  }

  // 自动补全缺失字段
  const id = filename.replace('.md', '')
  const title = meta.title || extractTitle(body) || id
  const date = meta.date || mtime.toISOString().split('T')[0]
  const category = meta.category || inferCategory(body, id)
  const readTime = meta.readTime || estimateReadTime(body)
  const tags = meta.tags || extractTags(body)

  // 提取摘要：跳过标题、引用、分割线，取第一段正文
  const excerpt = extractExcerpt(body)

  return {
    title,
    date,
    category,
    readTime,
    tags,
    content: marked.parse(body) as string,
    _excerpt: excerpt
  }
}

// 从内容中提取第一个 # 标题
function extractTitle(body: string): string {
  const match = body.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : ''
}

// 估算阅读时间（按 300 字/分钟）
function estimateReadTime(body: string): string {
  // 去除代码块、Markdown 符号后再统计
  const plainText = body
    .replace(/```[\s\S]*?```/g, '')  // 移除代码块
    .replace(/`[^`]+`/g, '')          // 移除行内代码
    .replace(/[#*_>~\-\[\]\(\)!]/g, '') // 移除 Markdown 符号
    .replace(/\s/g, '')
  const wordCount = plainText.length
  const minutes = Math.max(1, Math.ceil(wordCount / 300))
  return `${minutes} 分钟`
}

// 从内容中提取标签：匹配 #标签 模式
function extractTags(body: string): string[] {
  const tags: string[] = []
  // 匹配 #标签 模式（支持中英文）
  const matches = body.match(/(?:^|\s)#([\u4e00-\u9fa5\w-]+)/g)
  if (matches) {
    tags.push(...matches.map(t => t.trim().replace(/^#/, '')))
  }
  return [...new Set(tags)].slice(0, 5)
}

/**
 * 基于关键词自动推断文章分类
 * 优先级：先匹配文件名关键词，再匹配正文关键词
 */
function inferCategory(body: string, id: string): string {
  // 关键词规则（按顺序匹配，第一个匹配即返回）
  const rules: Array<{ category: string; keywords: string[] }> = [
    {
      category: '技术教程',
      keywords: [
        // 编程语言/框架
        'vue', 'react', 'typescript', 'javascript', 'python', 'java', 'rust', 'go',
        'nuxt', 'next', 'node', 'npm', 'pnpm', 'webpack', 'vite',
        // 网络/服务器
        'nginx', 'apache', 'docker', 'kubernetes', 'linux', 'ubuntu', 'centos',
        'vps', 'ssh', 'ssl', 'tls', 'cdn', 'dns',
        'xray', 'v2ray', 'clash', 'shadowsocks', 'trojan',
        // 工具
        'git', 'github', 'vscode', 'cursor', 'claude',
        // 通用
        '教程', '指南', '入门', '实战', '优化', '配置', '部署', '搭建', '开发', 'api', 'cli'
      ]
    },
    {
      category: '交易心得',
      keywords: [
        '设计', 'ux', 'ui', '交互', '原型', 'figma', 'sketch',
        '产品', '需求', '用户', '体验', '视觉', '设计原则', '设计模式', '设计思维'
      ]
    },
    {
      category: '创业人生',
      keywords: [
        '独立开发', '创业', '副业', '变现', '商业模式', '增长', '营销', '推广',
        '个人成长', '转型', '辞职', '自由职业', '远程工作', '产品上线', '冷启动'
      ]
    },
    {
      category: '开发工具',
      keywords: [
        '工作流', '协作', '版本控制', '效率工具', '生产力', '工具推荐',
        'best practice', '最佳实践', '工作方式', '习惯', '心得'
      ]
    },
    {
      category: '网络工具',
      keywords: [
        '翻墙', '科学上网', '代理', 'vpn', 'gfw', '防火墙', '梯子', '机场',
        'cloudflare', 'cf', '域名', '备案', 'dns', 'cdn'
      ]
    }
  ]

  // 合并文件名和正文用于匹配（文件名权重更高）
  const searchText = (id + ' ' + body).toLowerCase()

  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return rule.category
      }
    }
  }

  return '未分类'
}

// 提取摘要：跳过标题、引用、分割线，取第一段正文
function extractExcerpt(body: string): string {
  const paragraphs = body.split('\n\n')
  for (const p of paragraphs) {
    const trimmed = p.trim()
    // 跳过空行、标题、引用、分割线、代码块
    if (!trimmed) continue
    if (trimmed.startsWith('#')) continue
    if (trimmed.startsWith('>')) continue
    if (trimmed.startsWith('---')) continue
    if (trimmed.startsWith('```')) continue
    if (trimmed.startsWith('|')) continue
    // 返回纯文本
    return trimmed.replace(/[#*_>`]/g, '').replace(/\n/g, ' ').slice(0, 150)
  }
  return ''
}

function parseFrontmatter(frontmatter: string): Record<string, any> {
  const meta: Record<string, any> = {}
  let currentKey = ''
  let currentValue: string[] = []

  frontmatter.split('\n').forEach(line => {
    // 用 (.*) 而不是 (.+),允许 key 后面没有值(如 `tags:`),这样后续的 - xxx 才会被正确归到 tags
    const match = line.match(/^(\w+):\s*(.*)$/)
    if (match) {
      if (currentKey) {
        meta[currentKey] = parseValue(currentValue.join('\n'))
      }
      currentKey = match[1]
      currentValue = [match[2]]
    } else if (line.trim().startsWith('- ') && currentKey) {
      currentValue.push(line.trim())
    } else if (currentKey) {
      currentValue.push(line)
    }
  })
  if (currentKey) {
    meta[currentKey] = parseValue(currentValue.join('\n'))
  }

  return meta
}

function parseValue(value: string): any {
  value = value.trim()

  if (value.startsWith('- ')) {
    return value.split('\n').map(line => line.replace(/^-\s*/, '').trim()).filter(Boolean)
  }

  if (value === 'true') return true
  if (value === 'false') return false

  // 必须整个字符串都是数字才转为 number,避免 "86 手机号..." 被 parseFloat 截成 86
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value)
  }

  return value
}
