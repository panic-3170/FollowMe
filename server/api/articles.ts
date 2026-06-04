import { readArticles } from '../utils/markdown'

export default defineEventHandler(() => {
  const articles = readArticles()
  return articles.map(a => ({
    id: a.id,
    title: a.title,
    date: a.date,
    category: a.category,
    readTime: a.readTime,
    tags: a.tags,
    _excerpt: a._excerpt,
    _path: a._path
  }))
})