import { readArticle } from '../../utils/markdown'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing article id' })
  }
  
  const article = readArticle(id)
  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }
  
  return article
})