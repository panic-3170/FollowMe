import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { marked } from 'marked'

export interface Article {
  id: string
  title: string
  date: string
  /** 独立修改日期（frontmatter 显式指定；不指定则与 date 相同） */
  modifiedAt?: string
  category: string
  readTime: string
  tags: string[]
  content: string
  _excerpt: string
  _path: string
  /** FAQ 区段抽取出的问答对（仅含常见问题/FAQ 区段） */
  _faqs?: { question: string; answer: string }[]
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

    const articleId = file.replace('.md', '')
    return {
      ...parsed,
      id: articleId,
      // 末尾加斜杠,避免 GitHub Pages + Fastly 301 跳转
      _path: `/writing/${articleId}/`
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
      // 末尾加斜杠,避免 301 跳转
      _path: `/writing/${id}/`
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
  const modifiedAt = meta.modifiedAt || date
  const category = meta.category || inferCategory(body, id)
  const readTime = meta.readTime || estimateReadTime(body)
  const tags = meta.tags || extractTags(body)

  // 提取摘要：跳过标题、引用、分割线，取第一段正文
  const excerpt = extractExcerpt(body)

  // 提取 FAQ 区段（用于 FAQPage 结构化数据）
  const faqs = extractFaqs(body)

  return {
    title,
    date,
    modifiedAt: modifiedAt !== date ? modifiedAt : undefined,
    category,
    readTime,
    tags,
    content: marked.parse(body) as string,
    _excerpt: excerpt,
    _faqs: faqs.length > 0 ? faqs : undefined,
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
        'vps', 'ssh', 'ssl', 'tls', 'cdn', 'dns', 'websocket',
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
        'cloudflare', 'cf', '域名', '备案', 'dns', 'cdn', 'websocket', 'nginx', 'ssl'
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

/**
 * 从 Markdown 正文抽取 FAQ 问答对
 * 规则：
 * 1. 找到 H2 标题包含 "FAQ" / "常见问题" / "问答" / "Q&A" 的区段
 * 2. 在该区段内，每个 H3 视为一个问题，H3 标题到下一个 H3 之间的正文视为答案
 * 3. 答案剔除 Markdown 标记，转为纯文本
 */
function extractFaqs(body: string): { question: string; answer: string }[] {
  const lines = body.split('\n')

  // 1) 定位 FAQ 区段起止
  const faqHeaderRegex = /^##\s+(.+)$/
  const faqStart = lines.findIndex(line => {
    const m = line.match(faqHeaderRegex)
    if (!m) return false
    const t = m[1].toLowerCase()
    return /常见问题|f&q|问答|questions?\s*(&|and)\s*answers/i.test(t) || /frequently\s*asked/i.test(t)
  })
  if (faqStart === -1) return []

  // 找到下一个 H2（FAQ 区段结束）
  let faqEnd = lines.length
  for (let i = faqStart + 1; i < lines.length; i++) {
    if (faqHeaderRegex.test(lines[i])) {
      faqEnd = i
      break
    }
  }
  const faqSection = lines.slice(faqStart + 1, faqEnd)

  // 2) 抽取 H3 问答对
  const h3Regex = /^###\s+(.+)$/
  const faqs: { question: string; answer: string }[] = []
  let currentQuestion = ''
  let currentAnswerLines: string[] = []

  const flush = () => {
    if (currentQuestion && currentAnswerLines.length) {
      const answer = currentAnswerLines
        .join('\n')
        .replace(/`([^`]+)`/g, '$1')              // 行内代码去标记
        .replace(/\*\*([^*]+)\*\*/g, '$1')        // 加粗
        .replace(/\*([^*]+)\*/g, '$1')            // 斜体
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // 链接
        .replace(/^\s*[-*+]\s+/gm, '')            // 无序列表
        .replace(/^\s*\d+\.\s+/gm, '')            // 有序列表
        .replace(/^#+\s+/gm, '')                  // 多余标题
        .replace(/\n{2,}/g, '\n')                 // 多余空行
        .trim()
      if (answer) faqs.push({ question: currentQuestion, answer })
    }
    currentAnswerLines = []
  }

  for (const line of faqSection) {
    const m = line.match(h3Regex)
    if (m) {
      // 遇到新问题，先保存上一个
      flush()
      currentQuestion = m[1].trim()
    } else {
      currentAnswerLines.push(line)
    }
  }
  flush()

  return faqs
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
