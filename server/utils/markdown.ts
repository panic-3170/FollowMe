import { readFileSync, readdirSync } from 'fs'
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
    const content = readFileSync(filePath, 'utf-8')
    const parsed = parseMarkdown(content)
    
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
    const content = readFileSync(filePath, 'utf-8')
    const parsed = parseMarkdown(content)
    return {
      ...parsed,
      id,
      _path: `/writing/${id}`
    }
  } catch {
    return null
  }
}

function parseMarkdown(content: string) {
  const lines = content.split('\n')
  const frontmatterEnd = lines.indexOf('---', 1)
  
  const frontmatter = lines.slice(1, frontmatterEnd).join('\n')
  const body = lines.slice(frontmatterEnd + 1).join('\n')
  
  const meta: Record<string, any> = {}
  let currentKey = ''
  let currentValue: string[] = []
  
  frontmatter.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/)
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
  
  const excerpt = body.split('\n\n')[0].replace(/#+\s*/g, '').trim()
  
  return {
    title: meta.title || '',
    date: meta.date || '',
    category: meta.category || '',
    readTime: meta.readTime || '',
    tags: meta.tags || [],
    content: marked.parse(body) as string,
    _excerpt: excerpt
  }
}

function parseValue(value: string): any {
  value = value.trim()
  
  if (value.startsWith('- ')) {
    return value.split('\n').map(line => line.replace(/^-\s*/, '').trim()).filter(Boolean)
  }
  
  if (value === 'true') return true
  if (value === 'false') return false
  
  const num = parseFloat(value)
  if (!isNaN(num)) return num
  
  return value
}