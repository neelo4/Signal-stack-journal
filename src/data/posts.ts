import matter from 'gray-matter'
import { Buffer } from 'buffer'

const globalWithBuffer = globalThis as typeof globalThis & {
  Buffer?: typeof Buffer
}

if (!globalWithBuffer.Buffer) {
  globalWithBuffer.Buffer = Buffer
}

const rawModules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

type FrontMatter = {
  title: string
  highlight: string
  category: string
  coverImage: string
  readingTime: string
  publishedAt: string | Date
  author: {
    name: string
    role: string
    avatar: string
  }
  summary: string
  tags: string[] | string
  pinned?: boolean | string
  accentColor?: string
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  highlight: string
  category: string
  coverImage: string
  readingTime: string
  publishedAt: string
  publishedAtISO: string
  author: {
    name: string
    role: string
    avatar: string
  }
  summary: string
  tags: string[]
  content: string
  pinned: boolean
  accentColor: string
}

const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const createAccentFromCategory = (category: string): string => {
  const key = category.toLowerCase()
  if (key.includes('beauty')) return '#f5bfd8'
  if (key.includes('mental')) return '#c8e6ff'
  if (key.includes('sleep')) return '#d5c4ff'
  if (key.includes('movement')) return '#d3f1e4'
  return '#f5bfd8'
}

export const posts: BlogPost[] = Object.entries(rawModules)
  .map(([filePath, fileContent]) => {
    const slug = filePath.split('/').pop()?.replace(/\.md$/, '') ?? 'post'
    const parsed = matter(fileContent)
    const data = parsed.data as FrontMatter
    const content = parsed.content

    const iso =
      data.publishedAt instanceof Date
        ? data.publishedAt.toISOString()
        : data.publishedAt

    const publishedAtDate = iso ? new Date(iso) : new Date()
    const publishedAt = dateFormatter.format(publishedAtDate)

    const tags = Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === 'string'
        ? [data.tags]
        : []

    const pinned =
      typeof data.pinned === 'string'
        ? data.pinned.toLowerCase() === 'true'
        : Boolean(data.pinned)

    const accentColor =
      'accentColor' in data && typeof (data as any).accentColor === 'string'
        ? ((data as any).accentColor as string)
        : createAccentFromCategory(data.category)

    return {
      id: slug,
      slug,
      title: data.title,
      highlight: data.highlight,
      category: data.category,
      coverImage: data.coverImage,
      readingTime: data.readingTime,
      publishedAt,
      publishedAtISO: publishedAtDate.toISOString(),
      author: data.author,
      summary: data.summary,
      tags,
      content,
      pinned,
      accentColor,
    }
  })
  .sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    const aTime = new Date(a.publishedAtISO).getTime()
    const bTime = new Date(b.publishedAtISO).getTime()
    return bTime - aTime
  })
