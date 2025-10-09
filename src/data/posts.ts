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
}

const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

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
    }
  })
  .sort((a, b) =>
    a.publishedAtISO > b.publishedAtISO ? -1 : a.publishedAtISO < b.publishedAtISO ? 1 : 0,
  )
