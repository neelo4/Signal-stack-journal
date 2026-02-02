import { posts as localPosts } from '../data/posts'
import type { BlogPost } from '../data/posts'

export const formatPublishedDate = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const normalizeTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((tag) => `${tag}`.trim()).filter((tag) => tag.length > 0)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  }

  return []
}

export const mapRowToPost = (row: Record<string, unknown>): BlogPost | null => {
  if (!row) return null
  const slug = (row.slug as string) || (row.id as string)
  if (!slug) return null

  let publishedISO = new Date().toISOString()
  if (typeof row.published_at === 'string') {
    const parsed = new Date(row.published_at)
    if (!Number.isNaN(parsed.getTime())) {
      publishedISO = parsed.toISOString()
    }
  } else if (row.published_at instanceof Date) {
    publishedISO = row.published_at.toISOString()
  } else if (typeof row.created_at === 'string') {
    const created = new Date(row.created_at)
    if (!Number.isNaN(created.getTime())) {
      publishedISO = created.toISOString()
    }
  }

  const fallback = localPosts.find((post) => post.slug === slug) ?? localPosts[0]

  return {
    id: (row.id as string) ?? slug,
    slug,
    title: (row.title as string) ?? fallback?.title ?? 'Untitled story',
    highlight: (row.highlight as string) ?? fallback?.highlight ?? '',
    category: (row.category as string) ?? fallback?.category ?? 'Journal',
    coverImage: (row.cover_image as string) ?? fallback?.coverImage ?? '',
    readingTime: (row.reading_time as string) ?? fallback?.readingTime ?? '5 min read',
    publishedAt:
      formatPublishedDate((row.published_at as string) ?? (row.created_at as string)) ??
      fallback?.publishedAt ??
      formatPublishedDate(publishedISO),
    publishedAtISO: publishedISO,
    author: {
      name: (row.author_name as string) ?? fallback?.author.name ?? 'Neelofar Khan',
      role: (row.author_role as string) ?? fallback?.author.role ?? '',
      avatar: (row.author_avatar as string) ?? fallback?.author.avatar ?? '/images/neelofar-khan.jpeg',
    },
    summary: (row.summary as string) ?? fallback?.summary ?? '',
    tags: normalizeTags(row.tags) ?? fallback?.tags ?? [],
    content: (row.content as string) ?? fallback?.content ?? '',
    pinned: Boolean(row.pinned ?? false),
    accentColor: (row.accent_color as string) ?? fallback?.accentColor ?? '#d9dee7',
  }
}

export const mergePosts = (primary: BlogPost[], fallbackPosts: BlogPost[]): BlogPost[] => {
  const seen = new Set<string>()
  const merged: BlogPost[] = []

  const addPost = (post: BlogPost) => {
    if (!seen.has(post.slug)) {
      merged.push(post)
      seen.add(post.slug)
    }
  }

  primary.forEach(addPost)
  fallbackPosts.forEach(addPost)

  return merged
}

export const sortPosts = (stories: BlogPost[]): BlogPost[] => {
  return [...stories].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1

    const aTime = new Date(a.publishedAtISO).getTime()
    const bTime = new Date(b.publishedAtISO).getTime()

    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0
    if (Number.isNaN(aTime)) return 1
    if (Number.isNaN(bTime)) return -1

    return bTime - aTime
  })
}
